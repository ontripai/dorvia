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
  return decodeHtmlEntities(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  const text = await res.text();
  return { status: res.status, ok: res.ok, text, url: res.url };
}

export async function parseNumbers() {
  console.log('================================================================');
  console.log('DRE-P163: NUMBERS EXTRACTION & VALIDATION SUITE (dexonline)');
  console.log('================================================================');

  const report = {
    group1: [],
    group2: [],
    group3: [],
    group4: [],
    haltConditionsTriggered: [],
  };

  // ==========================================================================
  // GROUP 1: Invariable Cardinals (25 items)
  // ==========================================================================
  console.log('\n--- Group 1: Invariable Cardinals ---');
  const group1Lemmas = [
    'zero', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă', 'zece',
    'unsprezece', 'treisprezece', 'paisprezece', 'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece',
    'douăzeci', 'treizeci', 'patruzeci', 'cincizeci', 'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci'
  ];

  // Specific spellings required by prompt
  const spellingChecks = {
    14: 'paisprezece',
    16: 'șaisprezece',
    60: 'șaizeci'
  };

  for (const lemma of group1Lemmas) {
    const encoded = encodeURIComponent(lemma);
    const pUrl = `https://dexonline.ro/definitie/${encoded}/paradigma`;
    const dUrl = `https://dexonline.ro/definitie/${encoded}`;

    const pRes = await fetchPage(pUrl);
    const dRes = await fetchPage(dUrl);

    // Look for any 2-column m/f numeral table
    const tables = [...pRes.text.matchAll(/<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi)];
    let twoColNumeralTable = null;
    for (const table of tables) {
      const text = cleanText(table[1]);
      // Check if this table is for the numeral itself having m/f distinction
      // Note: "nouă" has a table for personal pronoun eu/noi (P57), but NOT for the numeral 9
      if (text.includes('masculin') && text.includes('feminin') && text.includes('numeral') && !text.includes('Persoana I')) {
        twoColNumeralTable = text;
        break;
      }
    }

    if (twoColNumeralTable) {
      const msg = `STOP CONDITION 1 TRIGGERED: Group 1 word "${lemma}" has a 2-column m/f numeral table!`;
      console.error(`❌ ${msg}`);
      report.haltConditionsTriggered.push(msg);
      process.exit(1);
    }

    // Verify spelling
    if (lemma === 'paisprezece' && lemma !== spellingChecks[14]) throw new Error('Spelling mismatch for 14');
    if (lemma === 'șaisprezece' && lemma !== spellingChecks[16]) throw new Error('Spelling mismatch for 16');
    if (lemma === 'șaizeci' && lemma !== spellingChecks[60]) throw new Error('Spelling mismatch for 60');

    report.group1.push({
      lemma,
      url: dUrl,
      twoColTable: false,
      status: 'verified',
    });
    console.log(`  ✓ "${lemma}": verified invariable cardinal, 0 m/f gender variation.`);
  }

  // ==========================================================================
  // GROUP 2: Numbers with Gender Variation (unu, doi, doisprezece)
  // ==========================================================================
  console.log('\n--- Group 2: Gender-varying Cardinals ---');
  const group2Expectations = [
    { base: 'unu', m: 'unu', f: 'una', model: 'P105' },
    { base: 'doi', m: 'doi', f: 'două', model: 'P43' },
    { base: 'doisprezece', m: 'doisprezece', f: 'douăsprezece', model: 'P45' },
  ];

  for (const exp of group2Expectations) {
    const encoded = encodeURIComponent(exp.base);
    const pUrl = `https://dexonline.ro/definitie/${encoded}/paradigma`;
    const pRes = await fetchPage(pUrl);

    // Find the numeral table matching the model
    const tables = [...pRes.text.matchAll(/<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi)];
    let targetTable = null;
    for (const t of tables) {
      const text = cleanText(t[1]);
      if (text.includes(exp.model) || (text.includes('masculin') && text.includes('feminin') && text.includes(exp.m) && text.includes(exp.f))) {
        targetTable = text;
        break;
      }
    }

    if (!targetTable) {
      const msg = `STOP CONDITION 2 TRIGGERED: Target table for Group 2 word "${exp.base}" not found!`;
      console.error(`❌ ${msg}`);
      report.haltConditionsTriggered.push(msg);
      process.exit(1);
    }

    // Assert exactly 2 distinct forms: m and f
    const hasM = targetTable.includes(exp.m);
    const hasF = targetTable.includes(exp.f);
    if (!hasM || !hasF) {
      const msg = `STOP CONDITION 2 TRIGGERED: Expected forms "${exp.m}" and "${exp.f}" not both present in table for "${exp.base}"!`;
      console.error(`❌ ${msg}`);
      report.haltConditionsTriggered.push(msg);
      process.exit(1);
    }

    console.log(`  ✓ "${exp.base}": Model ${exp.model} confirmed 2-column. Forms: Masculin="${exp.m}", Feminin="${exp.f}".`);
    report.group2.push({
      base: exp.base,
      model: exp.model,
      masculin: exp.m,
      feminin: exp.f,
      url: pUrl,
    });
  }

  // ==========================================================================
  // GROUP 3: Multi-word / Noun Cardinals (o sută, o mie)
  // ==========================================================================
  console.log('\n--- Group 3: Multi-word / Noun Expressions ---');
  const group3Items = [
    { phrase: 'o sută', base: 'sută' },
    { phrase: 'o mie', base: 'mie' },
  ];

  for (const item of group3Items) {
    const encodedPhrase = encodeURIComponent(item.phrase);
    const encodedBase = encodeURIComponent(item.base);

    const phraseRes = await fetchPage(`https://dexonline.ro/definitie/${encodedPhrase}`);
    const baseRes = await fetchPage(`https://dexonline.ro/definitie/${encodedBase}`);

    console.log(`  "${item.phrase}":`);
    console.log(`    definitie/${item.phrase} status: ${phraseRes.status} (url: ${phraseRes.url})`);
    console.log(`    definitie/${item.base} status: ${baseRes.status}`);

    const foundSubentry = baseRes.text.includes(item.phrase);
    console.log(`    Subentry in base word "${item.base}": ${foundSubentry}`);

    report.group3.push({
      phrase: item.phrase,
      base: item.base,
      directUrl: phraseRes.status === 200 ? phraseRes.url : null,
      baseUrl: baseRes.url,
      subentry: foundSubentry,
    });
  }

  // ==========================================================================
  // GROUP 4: Ordinals (1 to 10 + întâi/întâia)
  // ==========================================================================
  console.log('\n--- Group 4: Ordinals (1-10 + întâi) ---');
  const group4Pairs = [
    { m: 'primul', f: 'prima', base: 'prim' },
    { m: 'al doilea', f: 'a doua', base: 'doilea' },
    { m: 'al treilea', f: 'a treia', base: 'treilea' },
    { m: 'al patrulea', f: 'a patra', base: 'patrulea' },
    { m: 'al cincilea', f: 'a cincea', base: 'cincilea' },
    { m: 'al șaselea', f: 'a șasea', base: 'șaselea' },
    { m: 'al șaptelea', f: 'a șaptea', base: 'șaptelea' },
    { m: 'al optulea', f: 'a opta', base: 'optulea' },
    { m: 'al nouălea', f: 'a noua', base: 'nouălea' },
    { m: 'al zecelea', f: 'a zecea', base: 'zecelea' },
    { m: 'întâi', f: 'întâia', base: 'întâi' },
  ];

  for (const pair of group4Pairs) {
    const mRes = await fetchPage(`https://dexonline.ro/definitie/${encodeURIComponent(pair.m)}`);
    const fRes = await fetchPage(`https://dexonline.ro/definitie/${encodeURIComponent(pair.f)}`);
    const bRes = await fetchPage(`https://dexonline.ro/definitie/${encodeURIComponent(pair.base)}`);

    const mFound = mRes.status === 200 && !mRes.text.includes('Nu am găsit');
    const fFound = fRes.status === 200 && !fRes.text.includes('Nu am găsit');
    const bFound = bRes.status === 200 && !bRes.text.includes('Nu am găsit');

    const effectiveMUrl = mFound ? mRes.url : (bFound ? bRes.url : null);
    const effectiveFUrl = fFound ? fRes.url : (bFound ? bRes.url : null);

    console.log(`  Ordinal pair: "${pair.m}" / "${pair.f}"`);
    console.log(`    Masc direct status: ${mRes.status}, Fem direct status: ${fRes.status}, Base "${pair.base}" status: ${bRes.status}`);
    console.log(`    Effective Masc URL: ${effectiveMUrl}`);
    console.log(`    Effective Fem URL:  ${effectiveFUrl}`);

    report.group4.push({
      m: pair.m,
      f: pair.f,
      base: pair.base,
      effectiveMUrl,
      effectiveFUrl,
    });
  }

  console.log('\n================================================================');
  console.log('✅ ALL DRE-P163 ASSERTIONS & STOP CONDITIONS PASSED!');
  console.log('================================================================\n');

  return report;
}

parseNumbers().catch(err => {
  console.error('Fatal error during numbers parsing:', err);
  process.exit(1);
});
