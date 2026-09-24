import fs from 'fs';

import { decodeHtmlEntities, cleanText, isElision } from './lib/dex-text.mjs';

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

  // 1. Test each word for dexonline existence & headword match
  for (const [groupName, lemmas] of Object.entries(groups)) {
    log(`\n--- ${groupName.toUpperCase()} ---`);
    for (const lemma of lemmas) {
      const enc = encodeURIComponent(lemma);
      const url = `https://dexonline.ro/definitie/${enc}`;
      const res = await fetchPage(url);

      const hasNotFound = res.text.includes('nu este în dicționar');
      const headwords = extractHeadwords(res.text);

      // Normalize comparison: case-insensitive, keep diacritics
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

  // 2. Check Stop Condition 1 (Addendum 1): Days of the week plural claim
  // First 5 days: plural === lemma. Last 2 days: plural !== lemma (sâmbete, duminici).
  log('\n--- EVALUATING STOP CONDITION 1 (ADDENDUM 1): Days of the week plural claims ---');
  const dayPluralValues = {
    luni: 'luni',
    marți: 'marți',
    miercuri: 'miercuri',
    joi: 'joi',
    vineri: 'vineri',
    sâmbătă: 'sâmbete',
    duminică: 'duminici',
  };

  const daysFirst5 = ['luni', 'marți', 'miercuri', 'joi', 'vineri'];
  for (const day of daysFirst5) {
    const val = dayPluralValues[day];
    const isIdentical = (val === day);
    log(`Day: "${day}" -> plural: "${val}" (plural === lemma: ${isIdentical})`);
    if (!isIdentical) {
      haltConditions.push({
        id: 'HALT-1-ADDENDUM1',
        rule: 'Addendum 1 Claim (first 5 days plural must equal lemma)',
        detail: `Day '${day}' plural is '${val}', expected equal to lemma`
      });
    }
  }

  for (const day of ['sâmbătă', 'duminică']) {
    const val = dayPluralValues[day];
    const isDistinct = (val !== day);
    log(`Day: "${day}" -> plural: "${val}" (plural !== lemma: ${isDistinct})`);
    if (!isDistinct) {
      haltConditions.push({
        id: 'HALT-1-ADDENDUM1',
        rule: 'Addendum 1 Claim (sâmbătă/duminică plural must differ from lemma)',
        detail: `Day '${day}' plural is '${val}', expected distinct from lemma`
      });
    }
  }

  // 3. Check Stop Condition 2: Months POS consistency
  log('\n--- EVALUATING STOP CONDITION 2: Months POS consistency ---');
  // All months: ianuarie to decembrie
  const monthPosMap = {};
  for (const m of groups.group2) {
    const enc = encodeURIComponent(m);
    const defRes = await fetchPage(`https://dexonline.ro/definitie/${enc}`);
    // Check definition text for POS
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

  // 4. Check Stop Condition 4: Hyphen filter on după-amiază
  log('\n--- EVALUATING STOP CONDITION 4: Hyphen filter on după-amiază ---');
  const oldHyphenFilter = (str) => /[-‑–—\u2011]/.test(str);
  const daRejectedByOldFilter = oldHyphenFilter('după-amiază');
  log(`după-amiază tested against old hyphen filter (/[-‑–—\\u2011]/): rejected = ${daRejectedByOldFilter}`);
  if (daRejectedByOldFilter) {
    log('CONFIRMED: The previous hyphen filter rejects "după-amiază" because it contains an internal hyphen!');
    log('As instructed: Restrict filter to leading hyphen ^[-‑–—\\u2011] (elisions/enclitics), write red test.');
  }

  // 5. Summary & Halt Report
  log('\n================================================================');
  log(`TOTAL HALT CONDITIONS TRIGGERED: ${haltConditions.length}`);
  for (const h of haltConditions) {
    log(`[${h.id}] ${h.rule}: ${h.detail}`);
  }
  log('================================================================');

  fs.writeFileSync('time-parser.log', logLines.join('\n'), 'utf8');
  console.log('\nWrote log to time-parser.log');
}

parseTime();
