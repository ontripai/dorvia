import fs from 'fs';
import path from 'path';

export { decodeHtmlEntities, cleanText, isElision, extractItems } from './lib/dex-text.mjs';
import { decodeHtmlEntities, cleanText, isElision, extractItems } from './lib/dex-text.mjs';

/**
 * Parses pronoun paradigms from dexonline HTML using role-based rules (dre-p161 Addendum 2).
 */
export function parsePronounRoleBased({
  html,
  lemma,
  group, // 'A' | 'B' | 'C'
  personLabel,
  number = 'singular', // 'singular' | 'plural'
  genderCol = 0, // 0 for masculin / invariant, 1 for feminin
}) {
  // 1. Find the target lexeme table
  const tableRegex = /<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi;
  let targetTable = null;
  let targetTableIndex = -1;
  let tMatch;
  let idx = 0;

  while ((tMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tMatch[1];
    const matchesPos = /pronume/i.test(tableHtml) || /articol \/ numeral \/ adjectiv pronominal/i.test(tableHtml);
    const matchesPerson = !personLabel || new RegExp(personLabel, 'i').test(tableHtml);
    if (matchesPos && matchesPerson) {
      targetTable = tableHtml;
      targetTableIndex = idx;
      break;
    }
    idx++;
  }

  if (!targetTable) {
    throw new Error(`[PARSER_ERROR] No matching pronoun table found for "${lemma}" (${personLabel || 'no person'}).`);
  }

  const rows = [...targetTable.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(r => r[1]);

  let nomAccCell = null;
  let genDatCell = null;
  let currentCase = null;
  let currentCaseRowsRemaining = 0;

  for (let r = 0; r < rows.length; r++) {
    const rHtml = rows[r];
    const caseMatch = rHtml.match(/<td[^>]*class=["'][^"']*inflection[^"']*["'][^>]*>(nominativ-acuzativ|genitiv-dativ|vocativ)<\/td>/i);
    if (caseMatch) {
      currentCase = caseMatch[1].toLowerCase();
      const rowSpanMatch =
        rHtml.match(/<td[^>]*rowspan=["'](\d+)["'][^>]*class=["'][^"']*inflection[^"']*["'][^>]*>/i) ||
        rHtml.match(/<td[^>]*class=["'][^"']*inflection[^"']*["'][^>]*rowspan=["'](\d+)["'][^>]*>/i);
      currentCaseRowsRemaining = rowSpanMatch ? parseInt(rowSpanMatch[1], 10) : 1;
    }

    if (currentCase === 'nominativ-acuzativ' && new RegExp(number, 'i').test(rHtml)) {
      const formCells = [...rHtml.matchAll(/<td[^>]*class=["'][^"']*form[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi)];
      if (formCells.length > genderCol) {
        nomAccCell = formCells[genderCol][1];
      }
    }
    if (currentCase === 'genitiv-dativ' && new RegExp(number, 'i').test(rHtml)) {
      const formCells = [...rHtml.matchAll(/<td[^>]*class=["'][^"']*form[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi)];
      if (formCells.length > genderCol) {
        genDatCell = formCells[genderCol][1];
      }
    }

    if (currentCaseRowsRemaining > 0) {
      currentCaseRowsRemaining--;
      if (currentCaseRowsRemaining === 0) {
        currentCase = null;
      }
    }
  }

  if (!nomAccCell) {
    throw new Error(`[PARSER_ERROR] Missing nom-acc cell for "${lemma}" (${number}, col ${genderCol}) in table ${targetTableIndex}.`);
  }

  const nomAccItems = extractItems(nomAccCell);
  const cleanNomAcc = nomAccItems.filter(i => !i.isElision).map(i => i.cleanText);

  // GROUP A: Full clitic extraction (eu, tu, noi, voi)
  if (group === 'A') {
    if (!genDatCell) {
      throw new Error(`[PARSER_ERROR] Missing gen-dat cell for Group A pronoun "${lemma}".`);
    }
    const genDatItems = extractItems(genDatCell);
    const cleanGenDat = genDatItems.filter(i => !i.isElision).map(i => i.cleanText);

    // Rule 1: Nominative = FIRST item
    const nominativ = cleanNomAcc[0];

    // Rule 2: Accusative clitic = LAST non-elision item
    const acuzativNeacc = cleanNomAcc[cleanNomAcc.length - 1];

    // Assertion 1: acuzativNeacc !== nominativ
    if (acuzativNeacc === nominativ) {
      throw new Error(`[ASSERTION_FAILED] Group A "${lemma}": acuzativNeacc ("${acuzativNeacc}") must not equal nominativ ("${nominativ}").`);
    }

    // Rule 3: Dative clitic selection:
    // If one candidate equals acuzativNeacc -> pick it (equality branch)
    // Else -> candidate starting with 'î' (î branch)
    const eqCandidates = cleanGenDat.filter(c => c === acuzativNeacc);
    let matchingCandidates = [];
    let branch = '';

    if (eqCandidates.length > 0) {
      matchingCandidates = eqCandidates;
      branch = 'equality branch';
    } else {
      matchingCandidates = cleanGenDat.filter(c => c.startsWith('î'));
      branch = 'î branch';
    }

    // Assertion 2: EXACTLY ONE candidate must match
    if (matchingCandidates.length !== 1) {
      throw new Error(
        `[ASSERTION_FAILED] Group A "${lemma}": Expected exactly 1 matching dativ candidate, found ${matchingCandidates.length} (${JSON.stringify(matchingCandidates)}) in candidates ${JSON.stringify(cleanGenDat)}.`
      );
    }

    const dativNeacc = matchingCandidates[0];

    // Short forms logged (items that are neither the tonic first item nor the selected clitic)
    const dativShortForms = cleanGenDat.filter((c, idx) => idx > 0 && c !== dativNeacc);

    return {
      lemma,
      group: 'A',
      tableIndex: targetTableIndex,
      extracted: {
        nominativ,
        acuzativNeacc,
        dativNeacc,
      },
      branch,
      tableRaw: {
        nomAccClean: cleanNomAcc,
        genDatClean: cleanGenDat,
      },
      loggedOnly: {
        dativShortForms,
        elisionForms: [
          ...nomAccItems.filter(i => i.isElision).map(i => i.rawText),
          ...genDatItems.filter(i => i.isElision).map(i => i.rawText),
        ],
      },
    };
  }

  // GROUP B: Nominative only (el, ea, ei, ele, dumneavoastră, dumneata)
  if (group === 'B') {
    const nominativ = cleanNomAcc[0];
    const secondItemInfo = nomAccItems.length > 1 ? {
      text: nomAccItems[1].cleanText,
      attrs: nomAccItems[1].attrs,
      hasNotRecommendedClass: /notRecommended/i.test(nomAccItems[1].attrs),
    } : null;

    return {
      lemma,
      group: 'B',
      tableIndex: targetTableIndex,
      extracted: {
        nominativ,
      },
      tableRaw: {
        nomAccClean: cleanNomAcc,
      },
      secondItemInfo,
      loggedOnly: {
        otherItems: cleanNomAcc.slice(1),
        elisionForms: nomAccItems.filter(i => i.isElision).map(i => i.rawText),
      },
    };
  }

  // GROUP C: Possessive (meu, mea)
  if (group === 'C') {
    // Assertion: exactly 1 item
    if (cleanNomAcc.length !== 1) {
      throw new Error(`[ASSERTION_FAILED] Group C "${lemma}": expected exactly 1 item, found ${cleanNomAcc.length} (${JSON.stringify(cleanNomAcc)}).`);
    }
    const nominativ = cleanNomAcc[0];

    return {
      lemma,
      group: 'C',
      tableIndex: targetTableIndex,
      extracted: {
        nominativ,
      },
      tableRaw: {
        nomAccClean: cleanNomAcc,
      },
      loggedOnly: {},
    };
  }

  throw new Error(`Unknown group: ${group}`);
}

export function runFullPronounPipeline() {
  const root = process.cwd();
  const dir = path.join(root, 'scratch', 'pronouns');

  const targets = [
    // GROUP A
    { group: 'A', lemma: 'eu', file: 'eu-paradigm.html', person: 'Persoana I', number: 'singular' },
    { group: 'A', lemma: 'tu', file: 'tu-paradigm.html', person: 'Persoana a 2-a', number: 'singular' },
    { group: 'A', lemma: 'noi', file: path.join(dir, 'noi.html'), person: 'Persoana I', number: 'plural' },
    { group: 'A', lemma: 'voi', file: path.join(dir, 'voi.html'), person: 'Persoana a 2-a', number: 'plural' },

    // GROUP B
    { group: 'B', lemma: 'el', file: path.join(dir, 'el.html'), person: null, number: 'singular', genderCol: 0 },
    { group: 'B', lemma: 'ea', file: path.join(dir, 'ea.html'), person: null, number: 'singular', genderCol: 1 },
    { group: 'B', lemma: 'ei', file: path.join(dir, 'ei.html'), person: null, number: 'plural', genderCol: 0 },
    { group: 'B', lemma: 'ele', file: path.join(dir, 'ele.html'), person: null, number: 'plural', genderCol: 1 },
    { group: 'B', lemma: 'dumneavoastră', file: path.join(dir, 'dumneavoastr%C4%83.html'), person: null, number: 'plural', genderCol: 0 },
    { group: 'B', lemma: 'dumneata', file: path.join(dir, 'dumneata.html'), person: null, number: 'singular', genderCol: 0 },

    // GROUP C
    { group: 'C', lemma: 'meu', file: path.join(dir, 'meu.html'), person: null, number: 'singular', genderCol: 0 },
    { group: 'C', lemma: 'mea', file: path.join(dir, 'mea.html'), person: null, number: 'singular', genderCol: 1 },
  ];

  const results = [];
  const errors = [];

  for (const t of targets) {
    try {
      const html = fs.readFileSync(t.file, 'utf8');
      const res = parsePronounRoleBased({
        html,
        lemma: t.lemma,
        group: t.group,
        personLabel: t.person,
        number: t.number,
        genderCol: t.genderCol || 0,
      });
      results.push(res);
      console.log(`[PASS] Group ${t.group} "${t.lemma}":`, res.extracted);
    } catch (err) {
      console.error(`[HALT] Error on "${t.lemma}":`, err.message);
      errors.push({ lemma: t.lemma, error: err.message });
      break;
    }
  }

  const logPayload = {
    timestamp: new Date().toISOString(),
    ruleSet: 'dre-p161 Addendum 2 (Role-based Extraction)',
    successCount: results.length,
    errorCount: errors.length,
    results,
    errors,
  };

  fs.writeFileSync('pronoun-parser.log', JSON.stringify(logPayload, null, 2), 'utf8');
  console.log('\nWrote pronoun-parser.log');

  if (errors.length > 0) {
    console.error('\n❌ PIPELINE HALTED WITH ERRORS.');
    process.exit(1);
  } else {
    console.log('\n✅ ALL 12 PRONOUNS PARSED STRICTLY AND VERIFIED WITH 0 ERRORS!');
    process.exit(0);
  }
}

// Execute when invoked
runFullPronounPipeline();
