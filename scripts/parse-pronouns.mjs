import fs from 'fs';

export function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&#x([0-9a-fA-F]+);?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function cleanText(html) {
  if (!html) return '';
  const decoded = decodeHtmlEntities(html);
  return decoded.replace(/<[^>]+>/g, '').trim();
}

/**
 * Parses the dexonline HTML for a pronoun, extracting:
 * 1. The lexeme paradigm table (P57 / P101)
 * 2. The DOOM 3 grammatical definition entry
 * Cross-references both to ensure deterministic, labeled extraction.
 */
export function parsePronounHtml(html, lemma, personLabel = 'Persoana I') {
  // 1. Find the pronoun lexeme table
  const tableRegex = /<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi;
  let targetTable = null;
  let targetTableIndex = -1;
  let tMatch;
  let idx = 0;

  while ((tMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tMatch[1];
    if (
      /pronume/i.test(tableHtml) &&
      new RegExp(personLabel, 'i').test(tableHtml)
    ) {
      targetTable = tableHtml;
      targetTableIndex = idx;
      break;
    }
    idx++;
  }

  if (!targetTable) {
    throw new Error(`[PARSER_ERROR] No matching pronoun table found for "${lemma}" (${personLabel}).`);
  }

  // Parse rows of the table
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const rows = [];
  let rMatch;
  while ((rMatch = rowRegex.exec(targetTable)) !== null) {
    rows.push(rMatch[1]);
  }

  let nomAccSingularCell = null;
  let genDatSingularCell = null;

  for (let r = 0; r < rows.length; r++) {
    const rHtml = rows[r];
    if (/nominativ-acuzativ/i.test(rHtml) && /singular/i.test(rHtml)) {
      const formCells = [...rHtml.matchAll(/<td[^>]*class=["'][^"']*form[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi)];
      if (formCells.length > 0) {
        nomAccSingularCell = formCells[0][1];
      }
    }
    if (/genitiv-dativ/i.test(rHtml) && /singular/i.test(rHtml)) {
      const formCells = [...rHtml.matchAll(/<td[^>]*class=["'][^"']*form[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi)];
      if (formCells.length > 0) {
        genDatSingularCell = formCells[0][1];
      }
    }
  }

  if (!nomAccSingularCell || !genDatSingularCell) {
    throw new Error(`[PARSER_ERROR] Missing nom-acc or gen-dat singular cells in table ${targetTableIndex}.`);
  }

  // Extract items from <li> inside each cell, filtering out elision items
  const extractItems = (cellHtml) => {
    const liRegex = /<li([^>]*)>([\s\S]*?)<\/li>/gi;
    const items = [];
    let liMatch;
    while ((liMatch = liRegex.exec(cellHtml)) !== null) {
      const attrs = liMatch[1];
      const inner = liMatch[2];
      const isElision = /class=["'][^"']*elision/i.test(attrs) || /title=["'][^"']*eliziune/i.test(attrs);
      const text = cleanText(inner);
      const hasHyphen = /[-‑–—\u2011]/.test(text);

      items.push({
        rawText: text,
        cleanText: text.replace(/[-‑–—\u2011]/g, '').trim(),
        isElision: isElision || hasHyphen,
        attrs,
      });
    }
    return items;
  };

  const nomAccItems = extractItems(nomAccSingularCell);
  const genDatItems = extractItems(genDatSingularCell);

  const cleanNomAcc = nomAccItems.filter(i => !i.isElision).map(i => i.cleanText);
  const cleanGenDat = genDatItems.filter(i => !i.isElision).map(i => i.cleanText);

  // 2. Parse DOOM 3 definition entry for explicit grammatical labels
  let doom3DefText = '';
  const defWrappers = [...html.matchAll(/<div[^>]*class=["'][^"']*defWrapper[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];
  for (const dw of defWrappers) {
    const content = dw[1];
    if (/\/sursa\/doom3/i.test(content) && new RegExp(`/definitie/${lemma}/\\d+`, 'i').test(content)) {
      if (content.includes('>pr.<') || content.includes('data-bs-content="pronume')) {
        const pMatch = content.match(/<p[^>]*class=["'][^"']*read-more[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
        if (pMatch) {
          doom3DefText = pMatch[1];
          break;
        }
      }
    }
  }

  let doom3DativAcc = null;
  let doom3DativNeaccVariants = [];
  let doom3AcuzativAcc = null;
  let doom3AcuzativNeaccVariants = [];

  if (doom3DefText) {
    // Dativ section
    const dMatch = doom3DefText.match(/data-bs-content=["']dativ["'][\s\S]*?data-bs-content=["']accentuat["'][^>]*>[^<]*<\/abbr>\s*<i>([\s\S]*?)<\/i>[\s\S]*?data-bs-content=["']neaccentuat["'][^>]*>[^<]*<\/abbr>\s*([\s\S]*?)(?:;|<abbr[^>]*data-bs-content=["']acuzativ["'])/i);
    if (dMatch) {
      doom3DativAcc = cleanText(dMatch[1]).split(/[\s,]+/)[0];
      const rawNeacc = cleanText(dMatch[2]);
      doom3DativNeaccVariants = rawNeacc
        .split(/[\s,;]+/)
        .map(v => v.replace(/[()]/g, '').trim())
        .filter(v => v && !/[-‑–—\u2011]/.test(v) && !/^[A-Z]/.test(v) && !/^(Mi-a|Dă-mi|dându|Ție|se|dă)/i.test(v));
    }

    // Acuzativ section
    const acMatch = doom3DefText.match(/data-bs-content=["']acuzativ["'][\s\S]*?data-bs-content=["']accentuat["'][^>]*>[^<]*<\/abbr>\s*<i>([\s\S]*?)<\/i>[\s\S]*?data-bs-content=["']neaccentuat["'][^>]*>[^<]*<\/abbr>\s*([\s\S]*?)(?:;|<\/span>|<\/p>)/i);
    if (acMatch) {
      doom3AcuzativAcc = cleanText(acMatch[1]).split(/[\s,]+/)[0];
      const rawNeacc = cleanText(acMatch[2]);
      doom3AcuzativNeaccVariants = rawNeacc
        .split(/[\s,;]+/)
        .map(v => v.replace(/[()]/g, '').trim())
        .filter(v => v && !/[-‑–—\u2011]/.test(v) && !/^[A-Z]/.test(v) && !/^(Mă-ntreabă|Dă-mă|Te|Vedea)/i.test(v));
    }
  }

  // Paradigm table breakdown:
  // In row 'nominativ-acuzativ singular':
  // Item 0: nominative (matches lemma)
  const nominativ = cleanNomAcc[0];
  // Item 1: accusative accentuat
  const acuzativAcc = cleanNomAcc[1];
  // Item 2: accusative neaccentuat
  const acuzativNeacc = cleanNomAcc[2];

  // In row 'genitiv-dativ singular':
  // Item 0: dativ accentuat
  const dativAcc = cleanGenDat[0];
  // Item 1: dativ neaccentuat short clitic (e.g. 'mi' / 'ți')
  const dativNeaccShort = cleanGenDat[1];
  // Item 2: dativ neaccentuat standard clitic with î- prefix (e.g. 'îmi' / 'îți')
  const dativNeaccFull = cleanGenDat[2];

  // Selection rule for Dativ clitic:
  // The user requirement specifies standard standalone clitic starting with î- ('îmi', 'îți')
  // Short variant ('mi', 'ți') is preserved and reported as an alternate variant.
  const dativNeaccSelected = dativNeaccFull && dativNeaccFull.startsWith('î') ? dativNeaccFull : dativNeaccShort;

  return {
    lemma,
    personLabel,
    tableIndex: targetTableIndex,
    sources: 'DOOM 3 (Flexion model & DOOM 3 dictionary entry)',
    tableRaw: {
      nomAccAll: nomAccItems.map(i => i.rawText),
      nomAccClean: cleanNomAcc,
      genDatAll: genDatItems.map(i => i.rawText),
      genDatClean: cleanGenDat,
    },
    doom3Entry: {
      found: Boolean(doom3DefText),
      dativAccentuat: doom3DativAcc,
      dativNeaccentuatVariants: doom3DativNeaccVariants,
      acuzativAccentuat: doom3AcuzativAcc,
      acuzativNeaccentuatVariants: doom3AcuzativNeaccVariants,
    },
    extracted: {
      nominativ,
      acuzativAccentuat: acuzativAcc,
      acuzativNeaccentuat: acuzativNeacc,
      dativAccentuat: dativAcc,
      dativNeaccentuat: dativNeaccSelected,
    },
    multiValues: {
      dativNeaccentuatVariants: [dativNeaccShort, dativNeaccFull].filter(Boolean),
      elisionForms: genDatItems.filter(i => i.isElision).map(i => i.rawText),
    },
  };
}

// Execute on fixtures and save log
const euResult = parsePronounHtml(fs.readFileSync('eu-paradigm.html', 'utf8'), 'eu', 'Persoana I');
const tuResult = parsePronounHtml(fs.readFileSync('tu-paradigm.html', 'utf8'), 'tu', 'Persoana a 2-a');

const fullReport = {
  timestamp: new Date().toISOString(),
  fixtures: [euResult, tuResult],
};

fs.writeFileSync('pronoun-fixtures.log', JSON.stringify(fullReport, null, 2), 'utf8');
console.log('Saved pronoun-fixtures.log successfully.');
console.log('EU:', JSON.stringify(euResult.extracted));
console.log('TU:', JSON.stringify(tuResult.extracted));
