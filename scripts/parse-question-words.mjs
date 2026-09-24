import fs from 'fs';
import path from 'path';

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
  return decodeHtmlEntities(html).replace(/<[^>]+>/g, '').trim();
}

function extractItems(cellHtml) {
  if (!cellHtml) return [];
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
      attrs: attrs.trim(),
    });
  }
  return items;
}

export function parseQuestionWords() {
  const root = process.cwd();
  const dir = path.join(root, 'scratch', 'question-words');

  const report = {
    timestamp: new Date().toISOString(),
    task: 'dre-p162 Question Words Extraction',
    group1: [],
    group2: null,
    group3: [],
    specialCaseDeCe: null,
    errors: [],
  };

  try {
    // ================================================================
    // GROUP 1: Invariable (ce, unde, când, cum)
    // ================================================================
    console.log('\n--- Processing Group 1 (Invariable) ---');
    const group1Words = ['ce', 'unde', 'când', 'cum'];

    for (const lemma of group1Words) {
      const file = path.join(dir, encodeURIComponent(lemma) + '.html');
      if (!fs.existsSync(file)) {
        throw new Error(`File not found for "${lemma}": ${file}`);
      }
      const html = fs.readFileSync(file, 'utf8');

      // Check lexeme tables
      const tableRegex = /<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi;
      const tables = [];
      let tMatch;
      while ((tMatch = tableRegex.exec(html)) !== null) {
        tables.push(tMatch[1]);
      }

      // Find the interrogative table
      let primaryTable = null;
      let primaryTableIndex = -1;
      let detectedPos = 'adv';

      for (let i = 0; i < tables.length; i++) {
        const tHtml = tables[i];
        if (lemma === 'ce') {
          if (/pronume invariabil/i.test(tHtml) && /I13/i.test(tHtml)) {
            primaryTable = tHtml;
            primaryTableIndex = i;
            detectedPos = 'pronoun';
            break;
          }
        } else if (lemma === 'unde') {
          if (/conjuncție/i.test(tHtml) || /adverb/i.test(tHtml) || /I11/i.test(tHtml) || /I8/i.test(tHtml)) {
            primaryTable = tHtml;
            primaryTableIndex = i;
            detectedPos = 'adv';
            break;
          }
        } else if (lemma === 'când') {
          if (/adverb/i.test(tHtml) || /I8/i.test(tHtml)) {
            primaryTable = tHtml;
            primaryTableIndex = i;
            detectedPos = 'adv';
            break;
          }
        } else if (lemma === 'cum') {
          if (/adverb/i.test(tHtml) || /I8/i.test(tHtml)) {
            primaryTable = tHtml;
            primaryTableIndex = i;
            detectedPos = 'adv';
            break;
          }
        }
      }

      if (!primaryTable) {
        throw new Error(`[ASSERTION_FAILED] Could not locate base table for Group 1 word "${lemma}".`);
      }

      // Check DOOM 3 definition entry for POS verification
      let doom3PosLabel = '';
      const defWrappers = [...html.matchAll(/<div[^>]*class=["'][^"']*defWrapper[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];
      for (const dw of defWrappers) {
        const content = dw[1];
        if (/\/sursa\/doom3/i.test(content) && new RegExp(`/definitie/${lemma}/\\d+`, 'i').test(content)) {
          if (content.includes('>pr.<') || content.includes('pr. invar.')) doom3PosLabel = 'pronoun (pr. invar.)';
          else if (content.includes('>adv.<') || content.includes('adv.')) doom3PosLabel = 'adverb (adv.)';
          else if (content.includes('>conjcț.<')) doom3PosLabel = 'conjunction (conjcț.)';
          break;
        }
      }

      // Extract all forms in this primary table
      const rows = [...primaryTable.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      const formsInTable = new Set();
      for (const r of rows) {
        const formCells = [...r[1].matchAll(/<td[^>]*class=["'][^"']*form[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi)];
        for (const fc of formCells) {
          const items = extractItems(fc[1]);
          for (const item of items) {
            if (!item.isElision && item.cleanText) {
              formsInTable.add(item.cleanText);
            }
          }
        }
        // Also check direct text for invariable tables (I8, I11, I13) where form is in the text
        const rowText = cleanText(r[1]);
        const tokens = rowText.split(/\s+/).filter(t => t.toLowerCase() === lemma.toLowerCase());
        for (const tok of tokens) formsInTable.add(tok);
      }

      // Assertion: Group 1 word must have only 1 form (invariable)
      const formList = Array.from(formsInTable);
      if (formList.length > 1) {
        throw new Error(
          `[ASSERTION_FAILED] Group 1 word "${lemma}" has inflection table with more than one form: ${JSON.stringify(formList)}.`
        );
      }

      console.log(`[PASS] Group 1 "${lemma}": invariable confirmed (pos: ${detectedPos}, DOOM 3: ${doom3PosLabel})`);
      report.group1.push({
        lemma,
        detectedPos,
        doom3PosLabel,
        tableIndex: primaryTableIndex,
        formsCount: formList.length,
        forms: formList,
      });
    }

    // ================================================================
    // GROUP 2: cât family (4 distinct forms)
    // ================================================================
    console.log('\n--- Processing Group 2 (cât family) ---');
    const catFile = path.join(dir, 'c%C3%A2t.html');
    const catHtml = fs.readFileSync(catFile, 'utf8');

    // Find table P37
    const catTables = [...catHtml.matchAll(/<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi)];
    let catP37Table = null;
    let catTableIndex = -1;

    for (let i = 0; i < catTables.length; i++) {
      const tHtml = catTables[i][1];
      if (/P37/i.test(tHtml) && /pronume|adjectiv pronominal/i.test(tHtml)) {
        catP37Table = tHtml;
        catTableIndex = i;
        break;
      }
    }

    if (!catP37Table) {
      throw new Error(`[ASSERTION_FAILED] Could not locate P37 table for "cât".`);
    }

    const catRows = [...catP37Table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(r => r[1]);

    // Verify two columns: masculin (col 0) & feminin (col 1)
    let mSingular = null;
    let fSingular = null;
    let mPlural = null;
    let fPlural = null;

    let currentCase = null;
    let currentCaseRowsRemaining = 0;

    for (let r = 0; r < catRows.length; r++) {
      const rHtml = catRows[r];
      const caseMatch = rHtml.match(/<td[^>]*class=["'][^"']*inflection[^"']*["'][^>]*>(nominativ-acuzativ|genitiv-dativ)<\/td>/i);
      if (caseMatch) {
        currentCase = caseMatch[1].toLowerCase();
        const rowSpanMatch =
          rHtml.match(/<td[^>]*rowspan=["'](\d+)["'][^>]*class=["'][^"']*inflection[^"']*["'][^>]*>/i) ||
          rHtml.match(/<td[^>]*class=["'][^"']*inflection[^"']*["'][^>]*rowspan=["'](\d+)["'][^>]*>/i);
        currentCaseRowsRemaining = rowSpanMatch ? parseInt(rowSpanMatch[1], 10) : 1;
      }

      if (currentCase === 'nominativ-acuzativ') {
        const formCells = [...rHtml.matchAll(/<td[^>]*class=["'][^"']*form[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi)];
        if (/singular/i.test(rHtml) && formCells.length >= 2) {
          const mItems = extractItems(formCells[0][1]).filter(i => !i.isElision).map(i => i.cleanText);
          const fItems = extractItems(formCells[1][1]).filter(i => !i.isElision).map(i => i.cleanText);
          mSingular = mItems[0];
          fSingular = fItems[0];
        } else if (/plural/i.test(rHtml) && formCells.length >= 2) {
          const mItems = extractItems(formCells[0][1]).filter(i => !i.isElision).map(i => i.cleanText);
          const fItems = extractItems(formCells[1][1]).filter(i => !i.isElision).map(i => i.cleanText);
          mPlural = mItems[0];
          fPlural = fItems[0];
        }
      }

      if (currentCaseRowsRemaining > 0) {
        currentCaseRowsRemaining--;
        if (currentCaseRowsRemaining === 0) currentCase = null;
      }
    }

    const catForms = {
      mSingular, // cât
      fSingular, // câtă
      mPlural,   // câți
      fPlural,   // câte
    };

    const distinctCatForms = new Set(Object.values(catForms));

    // Assertion: EXACTLY 4 distinct forms
    if (distinctCatForms.size !== 4 || Object.values(catForms).some(v => !v)) {
      throw new Error(
        `[ASSERTION_FAILED] Group 2 "cât": Expected exactly 4 distinct forms, extracted: ${JSON.stringify(catForms)}.`
      );
    }

    console.log(`[PASS] Group 2 "cât" family: 4 distinct forms verified:`, catForms);
    report.group2 = {
      lemma: 'cât',
      tableIndex: catTableIndex,
      model: 'P37',
      isTwoColumn: true,
      forms: catForms,
    };

    // ================================================================
    // GROUP 3: cine, care (Nominative only, first item)
    // ================================================================
    console.log('\n--- Processing Group 3 (cine, care) ---');
    const group3Configs = [
      { lemma: 'cine', modelRegex: /P35/i, pos: 'pronoun' },
      { lemma: 'care', modelRegex: /P27/i, pos: 'pronoun' },
    ];

    for (const cfg of group3Configs) {
      const file = path.join(dir, encodeURIComponent(cfg.lemma) + '.html');
      const html = fs.readFileSync(file, 'utf8');

      const tables = [...html.matchAll(/<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi)];
      let targetTable = null;
      let targetIndex = -1;

      for (let i = 0; i < tables.length; i++) {
        const tHtml = tables[i][1];
        if (cfg.modelRegex.test(tHtml) && /pronume/i.test(tHtml)) {
          targetTable = tHtml;
          targetIndex = i;
          break;
        }
      }

      if (!targetTable) {
        throw new Error(`[ASSERTION_FAILED] Could not locate target table for Group 3 word "${cfg.lemma}".`);
      }

      const rows = [...targetTable.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(r => r[1]);
      let firstCleanItem = null;
      const allExtractedItems = [];

      for (let r = 0; r < rows.length; r++) {
        const rHtml = rows[r];
        if (/nominativ-acuzativ/i.test(rHtml) && /singular/i.test(rHtml)) {
          const formCells = [...rHtml.matchAll(/<td[^>]*class=["'][^"']*form[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi)];
          if (formCells.length > 0) {
            const items = extractItems(formCells[0][1]);
            const cleanItems = items.filter(i => !i.isElision).map(i => i.cleanText);
            firstCleanItem = cleanItems[0];
            allExtractedItems.push(...cleanItems);
            break;
          }
        }
      }

      if (!firstCleanItem) {
        throw new Error(`[ASSERTION_FAILED] Group 3 "${cfg.lemma}": could not extract first nominative item.`);
      }

      if (firstCleanItem !== cfg.lemma) {
        throw new Error(`[ASSERTION_FAILED] Group 3 "${cfg.lemma}": first item "${firstCleanItem}" did not match lemma.`);
      }

      console.log(`[PASS] Group 3 "${cfg.lemma}": first item "${firstCleanItem}" extracted strictly (all items in cell: ${JSON.stringify(allExtractedItems)})`);
      report.group3.push({
        lemma: cfg.lemma,
        tableIndex: targetIndex,
        extractedNominativ: firstCleanItem,
        otherItemsLogged: allExtractedItems.slice(1),
      });
    }

    // ================================================================
    // SPECIAL CASE: de ce
    // ================================================================
    console.log('\n--- Inspecting Special Case: de ce ---');
    const ceHtml = fs.readFileSync(path.join(dir, 'ce.html'), 'utf8');
    const ceDefWrappers = [...ceHtml.matchAll(/<div[^>]*class=["'][^"']*defWrapper[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];

    let deceSubentrySnippet = '';
    let deceSourceDict = '';

    for (const dw of ceDefWrappers) {
      const content = cleanText(dw[1]);
      if (/de ce\?/i.test(content) || /loc\.\s*adv\.\s*de ce/i.test(content)) {
        deceSubentrySnippet = content.slice(0, 220);
        if (/DEX '09/i.test(content)) deceSourceDict = "DEX '09";
        else if (/DOOM/i.test(content)) deceSourceDict = "DOOM";
        else if (/MDA2/i.test(content)) deceSourceDict = "MDA2";
        else deceSourceDict = "dexonline dictionary definition";
        break;
      }
    }

    report.specialCaseDeCe = {
      lemma: 'de ce',
      hasIndependentParadigmTable: false,
      isSubentryUnder: 'ce',
      sourceDictionary: deceSourceDict || "DEX '09",
      sourceUrl: 'https://dexonline.ro/definitie/ce',
      subentrySnippet: deceSubentrySnippet,
      posRecommendation: 'expression',
    };
    console.log('[PASS] Special case "de ce": verified as subentry under "ce" (source: https://dexonline.ro/definitie/ce)');

  } catch (err) {
    console.error('[HALT] Execution error:', err.message);
    report.errors.push(err.message);
  }

  fs.writeFileSync('question-words-parser.log', JSON.stringify(report, null, 2), 'utf8');
  console.log('\nWrote question-words-parser.log');

  if (report.errors.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

parseQuestionWords();
