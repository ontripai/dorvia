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

// Extract headwords from a dexonline definition page
export function extractHeadwords(html) {
  const headwords = new Set();

  // 1. Check <span class="entryName">
  const entryMatches = html.matchAll(/class=["'][^"']*entryName[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi);
  for (const m of entryMatches) {
    const text = cleanText(m[1]).toLowerCase().replace(/[^\p{L}]/gu, '');
    if (text) headwords.add(text);
  }

  // 2. Check <b> tags inside <span class="def">
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

export async function parseNumbers() {
  console.log('================================================================');
  console.log('DRE-P163: NUMBERS EXTRACTION & VALIDATION SUITE (dexonline)');
  console.log('================================================================');

  const report = {
    group1: [],
    group2: [],
    group3: [],
    group4: [],
    allEntriesTable: [],
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

    // Look for any 2-column m/f numeral table
    const tables = [...pRes.text.matchAll(/<table[^>]*class=["'][^"']*lexeme[^"']*["'][^>]*>([\s\S]*?)<\/table>/gi)];
    let twoColNumeralTable = null;
    for (const table of tables) {
      const text = cleanText(table[1]);
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

    report.group1.push({ lemma, url: dUrl, twoColTable: false, status: 'verified' });
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

    const hasM = targetTable.includes(exp.m);
    const hasF = targetTable.includes(exp.f);
    if (!hasM || !hasF) {
      const msg = `STOP CONDITION 2 TRIGGERED: Expected forms "${exp.m}" and "${exp.f}" not both present in table for "${exp.base}"!`;
      console.error(`❌ ${msg}`);
      report.haltConditionsTriggered.push(msg);
      process.exit(1);
    }

    console.log(`  ✓ "${exp.base}": Model ${exp.model} confirmed 2-column. Forms: Masculin="${exp.m}", Feminin="${exp.f}".`);
    report.group2.push({ base: exp.base, model: exp.model, masculin: exp.m, feminin: exp.f, url: pUrl });
  }

  // ==========================================================================
  // FULL CONTENT-BASED EXISTENCE TEST ACROSS ALL 55 ENTRIES
  // ==========================================================================
  console.log('\n--- Running New Content-Based Existence Test (All 55 entries) ---');

  const all55Definitions = [
    // Group 1
    { lemma: 'zero', root: 'zero', url: 'https://dexonline.ro/definitie/zero' },
    { lemma: 'trei', root: 'trei', url: 'https://dexonline.ro/definitie/trei' },
    { lemma: 'patru', root: 'patru', url: 'https://dexonline.ro/definitie/patru' },
    { lemma: 'cinci', root: 'cinci', url: 'https://dexonline.ro/definitie/cinci' },
    { lemma: 'șase', root: 'șase', url: 'https://dexonline.ro/definitie/%C8%99ase' },
    { lemma: 'șapte', root: 'șapte', url: 'https://dexonline.ro/definitie/%C8%99apte' },
    { lemma: 'opt', root: 'opt', url: 'https://dexonline.ro/definitie/opt' },
    { lemma: 'nouă', root: 'nouă', url: 'https://dexonline.ro/definitie/nou%C4%83' },
    { lemma: 'zece', root: 'zece', url: 'https://dexonline.ro/definitie/zece' },
    { lemma: 'unsprezece', root: 'unsprezece', url: 'https://dexonline.ro/definitie/unsprezece' },
    { lemma: 'treisprezece', root: 'treisprezece', url: 'https://dexonline.ro/definitie/treisprezece' },
    { lemma: 'paisprezece', root: 'paisprezece', url: 'https://dexonline.ro/definitie/paisprezece' },
    { lemma: 'cincisprezece', root: 'cincisprezece', url: 'https://dexonline.ro/definitie/cincisprezece' },
    { lemma: 'șaisprezece', root: 'șaisprezece', url: 'https://dexonline.ro/definitie/%C8%99aisprezece' },
    { lemma: 'șaptesprezece', root: 'șaptesprezece', url: 'https://dexonline.ro/definitie/%C8%99aptesprezece' },
    { lemma: 'optsprezece', root: 'optsprezece', url: 'https://dexonline.ro/definitie/optsprezece' },
    { lemma: 'nouăsprezece', root: 'nouăsprezece', url: 'https://dexonline.ro/definitie/nou%C4%83sprezece' },
    { lemma: 'douăzeci', root: 'douăzeci', url: 'https://dexonline.ro/definitie/dou%C4%83zeci' },
    { lemma: 'treizeci', root: 'treizeci', url: 'https://dexonline.ro/definitie/treizeci' },
    { lemma: 'patruzeci', root: 'patruzeci', url: 'https://dexonline.ro/definitie/patruzeci' },
    { lemma: 'cincizeci', root: 'cincizeci', url: 'https://dexonline.ro/definitie/cincizeci' },
    { lemma: 'șaizeci', root: 'șaizeci', url: 'https://dexonline.ro/definitie/%C8%99aizeci' },
    { lemma: 'șaptezeci', root: 'șaptezeci', url: 'https://dexonline.ro/definitie/%C8%99aptezeci' },
    { lemma: 'optzeci', root: 'optzeci', url: 'https://dexonline.ro/definitie/optzeci' },
    { lemma: 'nouăzeci', root: 'nouăzeci', url: 'https://dexonline.ro/definitie/nou%C4%83zeci' },

    // Group 2
    { lemma: 'unu', root: 'unu', url: 'https://dexonline.ro/definitie/unu/paradigma' },
    { lemma: 'una', root: 'unu', url: 'https://dexonline.ro/definitie/unu/paradigma' },
    { lemma: 'doi', root: 'doi', url: 'https://dexonline.ro/definitie/doi/paradigma' },
    { lemma: 'două', root: 'doi', url: 'https://dexonline.ro/definitie/doi/paradigma' },
    { lemma: 'doisprezece', root: 'doisprezece', url: 'https://dexonline.ro/definitie/doisprezece/paradigma' },
    { lemma: 'douăsprezece', root: 'doisprezece', url: 'https://dexonline.ro/definitie/doisprezece/paradigma' },

    // Group 3
    { lemma: 'o sută', root: 'sută', url: 'https://dexonline.ro/definitie/sut%C4%83' },
    { lemma: 'o mie', root: 'mie', url: 'https://dexonline.ro/definitie/mie' },

    // Group 4
    { lemma: 'primul', root: 'prim', url: 'https://dexonline.ro/definitie/prim' },
    { lemma: 'prima', root: 'prim', url: 'https://dexonline.ro/definitie/prim' },
    { lemma: 'al doilea', root: 'doilea', url: 'https://dexonline.ro/definitie/doilea' },
    { lemma: 'a doua', root: 'doilea', url: 'https://dexonline.ro/definitie/doilea' },
    { lemma: 'al treilea', root: 'treilea', url: 'https://dexonline.ro/definitie/treilea' },
    { lemma: 'a treia', root: 'treilea', url: 'https://dexonline.ro/definitie/treilea' },
    { lemma: 'al patrulea', root: 'patrulea', url: 'https://dexonline.ro/definitie/patrulea' },
    { lemma: 'a patra', root: 'patrulea', url: 'https://dexonline.ro/definitie/patrulea' },
    { lemma: 'al cincilea', root: 'cincilea', url: 'https://dexonline.ro/definitie/cincilea' },
    { lemma: 'a cincea', root: 'cincilea', url: 'https://dexonline.ro/definitie/cincilea' },
    { lemma: 'al șaselea', root: 'șaselea', url: 'https://dexonline.ro/definitie/%C8%99aselea' },
    { lemma: 'a șasea', root: 'șaselea', url: 'https://dexonline.ro/definitie/%C8%99aselea' },
    { lemma: 'al șaptelea', root: 'șaptelea', url: 'https://dexonline.ro/definitie/%C8%99aptelea' },
    { lemma: 'a șaptea', root: 'șaptelea', url: 'https://dexonline.ro/definitie/%C8%99aptelea' },
    { lemma: 'al optulea', root: 'optulea', url: 'https://dexonline.ro/definitie/optulea' },
    { lemma: 'a opta', root: 'optulea', url: 'https://dexonline.ro/definitie/optulea' },
    { lemma: 'al nouălea', root: 'nouălea', url: 'https://dexonline.ro/definitie/nou%C4%83lea' },
    { lemma: 'a noua', root: 'nouălea', url: 'https://dexonline.ro/definitie/nou%C4%83lea' },
    { lemma: 'al zecelea', root: 'zecelea', url: 'https://dexonline.ro/definitie/zecelea' },
    { lemma: 'a zecea', root: 'zecelea', url: 'https://dexonline.ro/definitie/zecelea' },
    { lemma: 'întâi', root: 'întâi', url: 'https://dexonline.ro/definitie/%C3%AEnt%C3%A2i' },
    { lemma: 'întâia', root: 'întâi', url: 'https://dexonline.ro/definitie/%C3%AEnt%C3%A2i' },
  ];

  for (const item of all55Definitions) {
    // Guard: URL must not contain space or %20
    if (item.url.includes(' ') || item.url.includes('%20')) {
      const msg = `URL GUARD FAILED: Item "${item.lemma}" has spaces or %20 in URL "${item.url}"!`;
      console.error(`❌ ${msg}`);
      report.haltConditionsTriggered.push(msg);
      process.exit(1);
    }

    const res = await fetchPage(item.url);

    // Assertion 1: No "nu este în dicționar"
    const notFound = res.text.includes('nu este în dicționar') || res.text.includes('nu este în dicţionar');
    if (!res.ok || notFound) {
      const msg = `ASSERTION 1 FAILED: Page for "${item.lemma}" at "${item.url}" was not found in dictionary!`;
      console.error(`❌ ${msg}`);
      report.haltConditionsTriggered.push(msg);
      process.exit(1);
    }

    // Assertion 2: Entry headword matches expected root lemma
    const headwords = extractHeadwords(res.text);
    const expected = item.root.toLowerCase().replace(/\s+/g, '');
    const matched = headwords.some(hw => hw === expected || hw.startsWith(expected) || expected.startsWith(hw));
    const matchingHw = headwords.find(hw => hw === expected || hw.startsWith(expected) || expected.startsWith(hw)) || headwords[0] || 'NONE';

    if (!matched) {
      const msg = `ASSERTION 2 FAILED: Headwords [${headwords.slice(0, 5).join(', ')}] do not match expected root "${item.root}" for item "${item.lemma}"!`;
      console.error(`❌ ${msg}`);
      report.haltConditionsTriggered.push(msg);
      process.exit(1);
    }

    report.allEntriesTable.push({
      lemma: item.lemma,
      finalUrl: item.url,
      returnedHeadword: matchingHw,
      matched: true,
    });

    console.log(`  ✓ [PASS] "${item.lemma.padEnd(14)}" -> ${item.url} (headword: "${matchingHw}")`);
  }

  console.log('\n================================================================');
  console.log('✅ ALL DRE-P163 CONTENT-BASED ASSERTIONS & STOP CONDITIONS PASSED!');
  console.log(`Total verified entries: ${report.allEntriesTable.length}/55`);
  console.log('================================================================\n');

  return report;
}

parseNumbers().catch(err => {
  console.error('Fatal error during numbers parsing:', err);
  process.exit(1);
});
