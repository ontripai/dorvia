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

function stripInlineTags(html) {
  return html.replace(/<\/?(span|i|b|em|abbr|a)[^>]*>/gi, '');
}

function parseRowCells(rowHtml) {
  const tdRegex = /<td([^>]*)>([\s\S]*?)<\/td>/gi;
  const cells = [];
  let m;
  while ((m = tdRegex.exec(rowHtml)) !== null) {
    const rawAttrs = m[1];
    const rawInner = m[2];
    const cleanInner = stripInlineTags(rawInner);
    const text = decodeHtmlEntities(cleanInner.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')).trim();
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

  const isDash = (tok) => tok === '—' || tok === '–' || tok === '-' || tok === '';
  if (allVariants.length === 0 || allVariants.every(isDash)) {
    return {
      definiteForm: '',
      multiValues: null,
      isMissing: true,
    };
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
    isMissing: false,
  };
}

function cleanToken(htmlText) {
  let text = stripInlineTags(htmlText);
  text = decodeHtmlEntities(text);
  text = text
    .replace(/<[^>]+>/g, ' ') // remove HTML tags with spaces
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
  if (/\bsă\b/i.test(form)) {
    throw new Error(`[ASSERTION_FAILED] Lemma "${lemma}" ${fieldName} contains "să": "${form}".`);
  }
}

/**
 * Extracts prezent conjugation (6 persons), conjunctiv prezent (6 persons, without 'să'),
 * and participiu from dexonline paradigm HTML for a verb.
 */
export function extractVerbFromHtml(html, lemma) {
  const tableRegex = /<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi;
  const tables = [];
  let tMatch;
  while ((tMatch = tableRegex.exec(html)) !== null) {
    tables.push(tMatch[1]);
  }

  if (tables.length === 0) {
    throw new Error(`[PARSER_ERROR] No lexeme tables found for lemma "${lemma}".`);
  }

  const multiValuesReport = [];

  for (let tIdx = 0; tIdx < tables.length; tIdx++) {
    const tableContent = tables[tIdx];
    const rows = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rMatch;
    while ((rMatch = rowRegex.exec(tableContent)) !== null) {
      rows.push(rMatch[1]);
    }

    if (rows.length < 5) continue;

    // Header check in row 0
    const row0Cells = parseRowCells(rows[0]);
    const headerText = row0Cells.map(c => c.text).join(' ');

    // Must be a verb table
    if (!/verb/i.test(headerText)) continue;

    // Must not be an auxiliary-only table (e.g. V514-aux, VT517-aux)
    if (/-aux/i.test(headerText)) continue;

    // Row 1 infinitiv verification
    const row1Cells = parseRowCells(rows[1]);
    const infinitivCell = row1Cells.find(c => /form/i.test(c.attrs) || /\(a\)/i.test(c.text));
    if (infinitivCell) {
      const infVariants = infinitivCell.text
        .replace(/\(a\)\s*/gi, ' ')
        .split(/[\s,]+/)
        .map(v => v.replace(/[-‑–—]/g, '').trim().toLowerCase())
        .filter(Boolean);
      if (!infVariants.includes(lemma.toLowerCase())) {
        continue;
      }
    }

    // Locate participiu in non-finite section (Row 0 & Row 1)
    const nonFiniteFormCells = row1Cells.filter(c => /form/i.test(c.attrs));
    const nonFiniteHeaderCells = row0Cells.filter(c => /inflection/i.test(c.attrs));
    const participiuHeaderIdx = nonFiniteHeaderCells.findIndex(c => /participiu/i.test(c.text));

    let participiu = null;
    if (participiuHeaderIdx !== -1 && participiuHeaderIdx < nonFiniteFormCells.length) {
      const partCell = nonFiniteFormCells[participiuHeaderIdx];
      const partRes = extractCellVariants(partCell.raw, lemma);
      participiu = partRes.definiteForm;
      if (partRes.multiValues) {
        multiValuesReport.push({ context: 'participiu', variants: partRes.multiValues, selected: participiu });
      }
    }

    if (!participiu || participiu === '—' || participiu === '-') {
      continue;
    }

    assertCleanForm(participiu, lemma, 'participiu');

    // Locate finite tense conjugation header row (e.g. numărul | persoana | prezent | conjunctiv prezent | ...)
    let tenseHeaderRowIdx = -1;
    for (let r = 2; r < rows.length; r++) {
      if (/prezent/i.test(rows[r]) && /persoana/i.test(rows[r])) {
        tenseHeaderRowIdx = r;
        break;
      }
    }

    if (tenseHeaderRowIdx === -1) continue;

    const tenseHeaderCells = parseRowCells(rows[tenseHeaderRowIdx]);
    const tenseColumns = tenseHeaderCells.filter(c => !/numărul|persoana/i.test(c.text));
    const prezentColIdx = tenseColumns.findIndex(c => c.text.toLowerCase() === 'prezent');
    const conjunctivColIdx = tenseColumns.findIndex(c => /conjunctiv\s+prezent/i.test(c.text));

    if (prezentColIdx === -1 || conjunctivColIdx === -1) continue;

    const prezent = {};
    const conjunctiv = {};

    const personMap = [
      { key: 'eu', rx: /I\s*\(eu\)/i },
      { key: 'tu', rx: /II-a\s*\(tu\)/i },
      { key: 'el', rx: /III-a\s*\(el/i },
      { key: 'noi', rx: /I\s*\(noi\)/i },
      { key: 'voi', rx: /II-a\s*\(voi\)/i },
      { key: 'ei', rx: /III-a\s*\(ei/i },
    ];

    for (let r = tenseHeaderRowIdx + 1; r < rows.length; r++) {
      const rHtml = rows[r];
      const rCells = parseRowCells(rHtml);
      const personCell = rCells.find(c => /person/i.test(c.attrs) || /\((eu|tu|el|ea|noi|voi|ei|ele)\)/i.test(c.text));
      if (!personCell) continue;

      const matchedPerson = personMap.find(p => p.rx.test(personCell.text));
      if (!matchedPerson) continue;

      const formCells = rCells.filter(c => /form/i.test(c.attrs));
      if (prezentColIdx < formCells.length) {
        const pRes = extractCellVariants(formCells[prezentColIdx].raw, lemma);
        prezent[matchedPerson.key] = pRes.definiteForm;
        if (!pRes.isMissing && pRes.definiteForm) {
          assertCleanForm(pRes.definiteForm, lemma, `prezent.${matchedPerson.key}`);
        }
        if (pRes.multiValues) {
          multiValuesReport.push({ context: `prezent.${matchedPerson.key}`, variants: pRes.multiValues, selected: pRes.definiteForm });
        }
      }

      if (conjunctivColIdx < formCells.length) {
        const cRes = extractCellVariants(formCells[conjunctivColIdx].raw, lemma);
        conjunctiv[matchedPerson.key] = cRes.definiteForm;
        if (!cRes.isMissing && cRes.definiteForm) {
          assertCleanForm(cRes.definiteForm, lemma, `conjunctiv.${matchedPerson.key}`);
        }
        if (cRes.multiValues) {
          multiValuesReport.push({ context: `conjunctiv.${matchedPerson.key}`, variants: cRes.multiValues, selected: cRes.definiteForm });
        }
      }
    }

    if (lemma === 'trebui') {
      // Defective / impersonal verb in contemporary standard Romanian (DOOM 3)
      if (!prezent.el || !conjunctiv.el) {
        continue;
      }
    } else {
      const persons = ['eu', 'tu', 'el', 'noi', 'voi', 'ei'];
      const missingPrezent = persons.filter(k => !prezent[k]);
      const missingConj = persons.filter(k => !conjunctiv[k]);

      if (missingPrezent.length > 0 || missingConj.length > 0) {
        continue;
      }
    }

    return {
      lemma,
      prezent,
      conjunctiv,
      participiu,
      multiValues: multiValuesReport,
      tableIndex: tIdx,
      tableHeader: headerText,
    };
  }

  throw new Error(`[PARSER_ERROR] Could not extract valid verb paradigm for lemma "${lemma}".`);
}
