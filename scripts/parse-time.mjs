import fs from 'fs';
import { decodeHtmlEntities, cleanText, isElision } from './lib/dex-text.mjs';
import { parseNounParadigmTable } from './lib/parse-noun-table.mjs';

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const text = await res.text();
    return { status: res.status, ok: res.ok, text, url: res.url };
  } catch (err) {
    return { status: 0, ok: false, text: '', url, error: err.message };
  }
}

export function extractHeadwords(html) {
  const headwords = new Set();

  // 1. <span class="entryName">
  const entryMatches = html.matchAll(/class=["'][^"']*entryName[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi);
  for (const m of entryMatches) {
    const text = cleanText(m[1]).toLowerCase().replace(/[0-9\.\-\(\)\*~,\/\s]/g, '');
    if (text) headwords.add(text);
  }

  // 2. <b> inside <span class="def">
  const defMatches = html.matchAll(/class=["'][^"']*def\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi);
  for (const dm of defMatches) {
    const boldMatches = dm[1].matchAll(/<b>([\s\S]*?)<\/b>/gi);
    for (const bm of boldMatches) {
      const raw = decodeHtmlEntities(bm[1]).replace(/<[^>]+>/g, '');
      const parts = raw.split(/[,;\/]/);
      for (const p of parts) {
        const clean = p.replace(/[0-9\.\-\(\)\*~]/g, '').replace(/\s+/g, '').toLowerCase().trim();
        if (clean) headwords.add(clean);
      }
    }
  }

  return [...headwords];
}

async function parseTime() {
  const logLines = [];
  const log = (msg) => {
    console.log(msg);
    logLines.push(msg);
  };

  log('================================================================');
  log('DRE-P164: TIME MODULE EXTRACTION & VALIDATION SUITE (dexonline)');
  log('================================================================');

  const groups = {
    group1: ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică'],
    group2: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
    group3: ['oră', 'minut', 'ceas', 'jumătate', 'sfert', 'fără', 'fix'],
    group4: [
      'azi', 'astăzi', 'mâine', 'poimâine', 'ieri', 'acum', 'devreme', 'târziu',
      'zi', 'săptămână', 'lună', 'an',
      'dimineață', 'după-amiază', 'seară', 'noapte',
      'viitor', 'trecut'
    ]
  };

  const resultsTable = [];
  const haltConditions = [];

  // ==========================================================================
  // PART 1: 44 Words Existence Test in dexonline
  // ==========================================================================
  log('\n--- PART 1: 44 WORDS EXISTENCE IN DEXONLINE ---');
  for (const [groupName, lemmas] of Object.entries(groups)) {
    log(`\n--- ${groupName.toUpperCase()} ---`);
    for (const lemma of lemmas) {
      const enc = encodeURIComponent(lemma);
      const url = `https://dexonline.ro/definitie/${enc}`;
      const res = await fetchPage(url);

      const hasNotFound = res.text.includes('nu este în dicționar');
      const headwords = extractHeadwords(res.text);

      const targetClean = lemma.toLowerCase().replace(/[-‑\s]/g, '');
      const matched = !hasNotFound && headwords.some(h => h.replace(/[-‑\s]/g, '') === targetClean);
      const returnedHeadword = matched ? lemma : (headwords[0] || 'N/A');

      resultsTable.push({
        group: groupName,
        lemma,
        url,
        returnedHeadword,
        matched,
        hasNotFound
      });

      log(`Lemma: "${lemma}" | URL: ${url} | Matched: ${matched} | Returned: "${returnedHeadword}" | NotFound: ${hasNotFound}`);
    }
  }

  // ==========================================================================
  // PART 2: 32 Inflected Words Paradigm Extraction (DRE-P164 Addendum 2)
  // Fetches real https://dexonline.ro/definitie/<lemma>/paradigma pages and
  // parses noun flexion tables by role/label (never hardcoded indices).
  // ==========================================================================
  log('\n--- PART 2: REAL PARADIGM EXTRACTION FROM DEXONLINE (/paradigma) ---');

  // Reference values from user prompt and Addendum 1 & 2
  const referenceValues = {
    // 7 days
    luni: { plural: 'luni', definiteForm: 'lunea' },
    marți: { plural: 'marți', definiteForm: 'marțea' },
    miercuri: { plural: 'miercuri', definiteForm: 'miercurea' },
    joi: { plural: 'joi', definiteForm: 'joia' },
    vineri: { plural: 'vineri', definiteForm: 'vinerea' },
    sâmbătă: { plural: 'sâmbete', definiteForm: 'sâmbăta' },
    duminică: { plural: 'duminici', definiteForm: 'duminica' },

    // 5 clock nouns
    oră: { plural: 'ore', definiteForm: 'ora' },
    minut: { plural: 'minute', definiteForm: 'minutul' },
    ceas: { plural: 'ceasuri', definiteForm: 'ceasul' },
    jumătate: { plural: 'jumătăți', definiteForm: 'jumătatea' },
    sfert: { plural: 'sferturi', definiteForm: 'sfertul' },

    // 4 period nouns
    zi: { plural: 'zile', definiteForm: 'ziua' },
    săptămână: { plural: 'săptămâni', definiteForm: 'săptămâna' },
    lună: { plural: 'luni', definiteForm: 'luna' },
    an: { plural: 'ani', definiteForm: 'anul' },

    // 4 parts of day
    dimineață: { plural: 'dimineți', definiteForm: 'dimineața' },
    'după-amiază': { plural: 'după-amiezi', definiteForm: 'după-amiaza' },
    seară: { plural: 'seri', definiteForm: 'seara' },
    noapte: { plural: 'nopți', definiteForm: 'noaptea' },

    // 12 months (invariable in DOOM 3 / M999: no plural, no definiteForm)
    ianuarie: { plural: null, definiteForm: null },
    februarie: { plural: null, definiteForm: null },
    martie: { plural: null, definiteForm: null },
    aprilie: { plural: null, definiteForm: null },
    mai: { plural: null, definiteForm: null },
    iunie: { plural: null, definiteForm: null },
    iulie: { plural: null, definiteForm: null },
    august: { plural: null, definiteForm: null }, // DOOM 3 M9 has augustul for masc noun, but month is invariable in usage
    septembrie: { plural: null, definiteForm: null },
    octombrie: { plural: null, definiteForm: null },
    noiembrie: { plural: null, definiteForm: null },
    decembrie: { plural: null, definiteForm: null },
  };

  const extractedParadigmResults = {};

  for (const [lemma, expected] of Object.entries(referenceValues)) {
    const enc = encodeURIComponent(lemma);
    const pUrl = `https://dexonline.ro/definitie/${enc}/paradigma`;
    const pRes = await fetchPage(pUrl);

    const tables = [...pRes.text.matchAll(/<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi)];
    let selectedParsed = null;

    // Filter candidate tables where singularNearticulat === lemma
    const candidates = [];
    for (let t = 0; t < tables.length; t++) {
      const parsed = parseNounParadigmTable(tables[t][1], lemma);
      if (parsed && parsed.singularNearticulat === lemma) {
        candidates.push({ tableIndex: t, parsed });
      }
    }

    if (candidates.length === 1) {
      selectedParsed = candidates[0].parsed;
    } else if (candidates.length > 1) {
      // If multiple (e.g. minut has minuturi vs minute, mai has tool vs month):
      // Choose candidate matching expected plural if known, or first standard feminine/masculine
      const matchPlural = candidates.find(c => c.parsed.plural === expected.plural);
      selectedParsed = matchPlural ? matchPlural.parsed : candidates[0].parsed;
    }

    extractedParadigmResults[lemma] = selectedParsed;

    const extPlural = selectedParsed?.plural || null;
    const extDef = selectedParsed?.definiteForm || null;

    log(`Word: "${lemma}" | Extracted: { plural: "${extPlural}", definiteForm: "${extDef}" } | Expected: { plural: "${expected.plural}", definiteForm: "${expected.definiteForm}" }`);

    // Compare with reference (excluding months where reference is null to explore)
    if (expected.plural !== null && extPlural !== expected.plural) {
      haltConditions.push({
        id: 'HALT-PLURAL-MISMATCH',
        rule: `Extracted plural mismatch for '${lemma}'`,
        detail: `Extracted '${extPlural}', expected '${expected.plural}'`
      });
    }

    if (expected.definiteForm !== null && extDef !== expected.definiteForm) {
      haltConditions.push({
        id: 'HALT-DEFINITE-MISMATCH',
        rule: `Extracted definiteForm mismatch for '${lemma}'`,
        detail: `Extracted '${extDef}', expected '${expected.definiteForm}'`
      });
    }
  }

  // ==========================================================================
  // PART 3: Months POS Consistency (Condition 2)
  // ==========================================================================
  log('\n--- PART 3: MONTHS POS CONSISTENCY ---');
  const monthPosMap = {};
  for (const m of groups.group2) {
    const enc = encodeURIComponent(m);
    const defRes = await fetchPage(`https://dexonline.ro/definitie/${enc}`);
    const defMatches = [...defRes.text.matchAll(/class=["'][^"']*def\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi)];
    let foundPos = 'unknown';
    for (const dm of defMatches) {
      const t = cleanText(dm[1]);
      if (/s\.\s*m\./i.test(t)) {
        foundPos = 's. m.';
        break;
      }
    }
    monthPosMap[m] = foundPos;
    log(`Month: "${m}" -> POS: "${foundPos}"`);
  }
  const uniqueMonthPos = new Set(Object.values(monthPosMap));
  if (uniqueMonthPos.size > 1) {
    haltConditions.push({
      id: 'HALT-2',
      rule: 'Section 6 Condition 2 (all 12 months must have same POS)',
      detail: `Months POS values: ${JSON.stringify(monthPosMap)}`
    });
  }

  // ==========================================================================
  // PART 4: Hyphen & Elision Real Function Assertion (Condition 4 - Addendum 2)
  // Tests imported cleanText and isElision from ./lib/dex-text.mjs
  // ==========================================================================
  log('\n--- PART 4: REAL DEX-TEXT.MJS FILTER ASSERTIONS ---');
  const daClean = cleanText('după-amiază');
  const daIsEl = isElision('după-amiază');
  log(`cleanText('după-amiază') = "${daClean}" (preserves internal hyphen: ${daClean === 'după-amiază'})`);
  log(`isElision('după-amiază') = ${daIsEl} (correctly not an elision: ${daIsEl === false})`);

  if (daClean !== 'după-amiază' || daIsEl !== false) {
    haltConditions.push({
      id: 'HALT-HYPHEN-FILTER',
      rule: 'Section 6 Condition 4 (după-amiază must not be corrupted or flagged as elision)',
      detail: `cleanText gave '${daClean}', isElision gave ${daIsEl}`
    });
  }

  const miIsEl = isElision('‑mi');
  const tiIsEl = isElision('‑ți');
  const miClean = cleanText('‑mi');
  log(`isElision('‑mi') = ${miIsEl}, isElision('‑ți') = ${tiIsEl}`);
  log(`cleanText('‑mi') = "${miClean}"`);

  if (!miIsEl || !tiIsEl || miClean !== 'mi') {
    haltConditions.push({
      id: 'HALT-ELISION-REJECTION',
      rule: 'Enclitic/elision boundary hyphens must be recognized',
      detail: `miIsEl=${miIsEl}, tiIsEl=${tiIsEl}, miClean='${miClean}'`
    });
  }

  // ==========================================================================
  // PART 5: Summary & Halt Report
  // ==========================================================================
  log('\n================================================================');
  log(`TOTAL HALT CONDITIONS TRIGGERED: ${haltConditions.length}`);
  for (const h of haltConditions) {
    log(`[${h.id}] ${h.rule}: ${h.detail}`);
  }
  log('================================================================');

  fs.writeFileSync('time-parser.log', logLines.join('\n'), 'utf8');
  console.log('\nWrote log to time-parser.log');

  if (haltConditions.length > 0) {
    process.exit(1);
  }
}

parseTime();
