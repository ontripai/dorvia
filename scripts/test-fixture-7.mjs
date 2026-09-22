import { extractDefiniteFormFromHtml } from './parse-dexonline.mjs';

const fixtures7 = [
  { lemma: 'ușă', expected: 'ușa' },
  { lemma: 'ghișeu', expected: 'ghișeul' },
  { lemma: 'gară', expected: 'gara' },
  { lemma: 'vamă', expected: 'vama' },
  { lemma: 'casă', expected: 'casa' },
  { lemma: 'cheie', expected: 'cheia' },
  { lemma: 'română', expected: 'româna' },
];

async function run() {
  console.log('Testing 7-word fixture (including 2-level header română):');
  let matchCount = 0;
  const results = [];

  for (const f of fixtures7) {
    const url = 'https://dexonline.ro/definitie/' + encodeURIComponent(f.lemma) + '/paradigma';
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (!res.ok) {
      console.error(`Failed to fetch ${f.lemma}: HTTP ${res.status}`);
      results.push({ lemma: f.lemma, expected: f.expected, output: `HTTP_${res.status}`, match: false });
      continue;
    }
    const html = await res.text();
    const parsed = extractDefiniteFormFromHtml(html, f.lemma, f.lemma === 'română' ? 'f' : null);
    const match = parsed.definiteForm === f.expected;
    if (match) matchCount++;
    results.push({
      lemma: f.lemma,
      expected: f.expected,
      output: parsed.definiteForm,
      gender: parsed.gender,
      multiValues: parsed.multiValues ? parsed.multiValues.join(', ') : 'none',
      match: match ? 'مطابق' : 'نامطابق'
    });
  }

  console.table(results);
  console.log(`Summary: ${matchCount} of ${fixtures7.length} matches.`);
}

run();
