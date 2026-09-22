// Deterministic HTML parser for dexonline paradigm tables (Hardened per dre-p154 Addendum 3 & 4)
// 1. Column header-based selection of "articulat" (never static index)
// 2. Full HTML entity decoding (numerical & named)
// 3. Rule-based variant selection (rejects hyphenated/enclitic variants)
// 4. Strict assertions: no hyphens, entities, or whitespace in returned forms
// 5. Plural form extraction for validation and notes
// No LLM involved in any phase.

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

export function extractDefiniteFormFromHtml(html, lemma, targetGender = null) {
  // Decode HTML entities across the source table content
  const tableRegex = /<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi;
  const tables = [];
  let tMatch;
  while ((tMatch = tableRegex.exec(html)) !== null) {
    tables.push(tMatch[1]);
  }

  if (tables.length === 0) {
    throw new Error(`[PARSER_ERROR] No lexeme tables found for lemma "${lemma}".`);
  }

  for (let tIdx = 0; tIdx < tables.length; tIdx++) {
    const tableContent = tables[tIdx];

    const rows = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rMatch;
    while ((rMatch = rowRegex.exec(tableContent)) !== null) {
      rows.push(rMatch[1]);
    }

    if (rows.length < 2) continue;

    let nomAccRowIdx = -1;
    for (let r = 1; r < rows.length; r++) {
      if (/nominativ-acuzativ/i.test(rows[r]) && /singular/i.test(rows[r])) {
        nomAccRowIdx = r;
        break;
      }
    }
    if (nomAccRowIdx === -1) continue;

    const isTwoLevelHeader = nomAccRowIdx === 2;

    let targetColIdx = -1;
    let detectedGender = null;

    if (!isTwoLevelHeader) {
      const row0Cells = parseRowCells(rows[0]);
      const headerText = row0Cells.map(c => c.text).join(' ');
      if (/substantiv\s+feminin/i.test(headerText)) detectedGender = 'f';
      else if (/substantiv\s+neutru/i.test(headerText)) detectedGender = 'n';
      else if (/substantiv\s+masculin/i.test(headerText)) detectedGender = 'm';

      const formHeaders = row0Cells.filter(c => /inflection/i.test(c.raw) || /articulat/i.test(c.text));
      const articulatColIdx = formHeaders.findIndex(c => c.text.trim().toLowerCase() === 'articulat');

      if (articulatColIdx === -1) continue;
      targetColIdx = articulatColIdx;
    } else {
      const row1Cells = parseRowCells(rows[1]);
      let desiredGender = targetGender;
      if (!desiredGender) {
        desiredGender = (lemma.endsWith('ă') || lemma.endsWith('a')) ? 'f' : 'm';
      }
      detectedGender = desiredGender;

      const articulatIndices = [];
      row1Cells.forEach((c, idx) => {
        if (c.text.trim().toLowerCase() === 'articulat') {
          articulatIndices.push(idx);
        }
      });

      if (articulatIndices.length === 0) continue;
      targetColIdx = desiredGender === 'f' ? articulatIndices[articulatIndices.length - 1] : articulatIndices[0];
    }

    if (targetColIdx === -1) continue;

    const nomAccCells = parseRowCells(rows[nomAccRowIdx]);
    const formCells = nomAccCells.slice(2);

    if (targetColIdx >= formCells.length) continue;

    const articulatCell = formCells[targetColIdx];
    const { definiteForm, multiValues } = extractCellVariants(articulatCell.raw, lemma);

    // Assertions per Section 3-1 & 3-2
    assertCleanForm(definiteForm, lemma, 'definiteForm');

    return {
      lemma,
      definiteForm,
      gender: detectedGender,
      multiValues,
      tableIndex: tIdx,
      targetColIdx,
    };
  }

  throw new Error(`[PARSER_ERROR] No matching nominativ-acuzativ singular articulat cell found for lemma "${lemma}".`);
}

/**
 * Extracts the plural nearticulat form (e.g. "bani", "ajutoare", "ajutori") from dexonline HTML
 */
export function extractPluralFormFromHtml(html, lemma, targetGender = null) {
  const tableRegex = /<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi;
  const tables = [];
  let tMatch;
  while ((tMatch = tableRegex.exec(html)) !== null) {
    tables.push(tMatch[1]);
  }

  for (let tIdx = 0; tIdx < tables.length; tIdx++) {
    const tableContent = tables[tIdx];
    const rows = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rMatch;
    while ((rMatch = rowRegex.exec(tableContent)) !== null) {
      rows.push(rMatch[1]);
    }

    // Check table gender if targetGender specified
    if (targetGender && rows[0]) {
      const h = rows[0];
      if (targetGender === 'n' && !/substantiv\s+neutru/i.test(h)) continue;
      if (targetGender === 'm' && !/substantiv\s+masculin/i.test(h)) continue;
      if (targetGender === 'f' && !/substantiv\s+feminin/i.test(h)) continue;
    }

    // Find plural row
    let pluralRowIdx = -1;
    for (let r = 1; r < rows.length; r++) {
      if (/plural/i.test(rows[r])) {
        pluralRowIdx = r;
        break;
      }
    }
    if (pluralRowIdx === -1) continue;

    const pluralCells = parseRowCells(rows[pluralRowIdx]);
    // The first cell in plural row is "plural" (since nominativ-acuzativ has rowspan=2)
    // The next cell is nearticulat plural!
    const formCells = pluralCells.slice(1);
    if (formCells.length > 0) {
      const nearticulatPluralCell = formCells[0];
      const { definiteForm: pluralForm, multiValues } = extractCellVariants(nearticulatPluralCell.raw, lemma);
      assertCleanForm(pluralForm, lemma, 'pluralForm');
      return { pluralForm, multiValues, tableIndex: tIdx };
    }
  }

  throw new Error(`[PARSER_ERROR] Could not extract plural form for lemma "${lemma}".`);
}

function parseRowCells(rowHtml) {
  const tdRegex = /<td([^>]*)>([\s\S]*?)<\/td>/gi;
  const cells = [];
  let m;
  while ((m = tdRegex.exec(rowHtml)) !== null) {
    const rawAttrs = m[1];
    const rawInner = m[2];
    const text = decodeHtmlEntities(rawInner.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')).trim();
    cells.push({ raw: rawInner, attrs: rawAttrs, text });
  }
  return cells;
}

function extractCellVariants(cellHtml, lemma) {
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  const allVariants = [];
  let m;
  while ((m = liRegex.exec(cellHtml)) !== null) {
    const cleaned = cleanToken(m[1]);
    if (cleaned) allVariants.push(cleaned);
  }

  if (allVariants.length === 0) {
    const cleaned = cleanToken(cellHtml);
    if (cleaned) allVariants.push(cleaned);
  }

  let multiValues = null;
  if (allVariants.length > 1) {
    multiValues = allVariants;
    console.warn(`[MULTI_VALUE_CELL] Lemma "${lemma}": multiple variants found: [${allVariants.join(', ')}].`);
  }

  // Section 3-2: Rule-based selection: reject variants containing hyphens (- U+002D, ‑ U+2011, – U+2013, — U+2014)
  const isHyphenated = (tok) => /[-‑–—]/.test(tok);
  const cleanVariants = allVariants.filter(tok => !isHyphenated(tok));

  if (cleanVariants.length === 0) {
    throw new Error(`[PARSER_ERROR] Lemma "${lemma}": all variants in cell are hyphenated: [${allVariants.join(', ')}].`);
  }

  const selected = cleanVariants[0];

  return {
    definiteForm: selected,
    multiValues,
  };
}

function cleanToken(htmlText) {
  let text = decodeHtmlEntities(htmlText);
  text = text
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .trim();

  // Pick first whitespace or comma separated segment
  const first = text.split(/[\s,]+/)[0].trim();
  return first;
}

function assertCleanForm(form, lemma, fieldName) {
  if (!form || typeof form !== 'string') {
    throw new Error(`[ASSERTION_FAILED] Lemma "${lemma}" ${fieldName} is empty or invalid: "${form}".`);
  }
  if (/[&]/.test(form) || /#x/i.test(form)) {
    throw new Error(`[ASSERTION_FAILED] Lemma "${lemma}" ${fieldName} contains unparsed HTML entity: "${form}".`);
  }
  if (/[-‑–—]/.test(form)) {
    throw new Error(`[ASSERTION_FAILED] Lemma "${lemma}" ${fieldName} contains hyphen: "${form}".`);
  }
  if (/\s/.test(form)) {
    throw new Error(`[ASSERTION_FAILED] Lemma "${lemma}" ${fieldName} contains whitespace: "${form}".`);
  }
}
