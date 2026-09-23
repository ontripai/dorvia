import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractVerbFromHtml } from './parse-dexonline.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const EXPECTED_FIXTURE = [
  {
    infinitive: 'a fi',
    lemma: 'fi',
    whatItTests: 'بی‌قاعده‌ی کامل',
    prezent: { eu: 'sunt', tu: 'ești', el: 'este', noi: 'suntem', voi: 'sunteți', ei: 'sunt' },
    conjunctiv3: 'fie',
    participiu: 'fost',
  },
  {
    infinitive: 'a avea',
    lemma: 'avea',
    whatItTests: 'بی‌قاعده + کمکی',
    prezent: { eu: 'am', tu: 'ai', el: 'are', noi: 'avem', voi: 'aveți', ei: 'au' },
    conjunctiv3: 'aibă',
    participiu: 'avut',
  },
  {
    infinitive: 'a merge',
    lemma: 'merge',
    whatItTests: 'صرف سوم',
    prezent: { eu: 'merg', tu: 'mergi', el: 'merge', noi: 'mergem', voi: 'mergeți', ei: 'merg' },
    conjunctiv3: 'meargă',
    participiu: 'mers',
  },
  {
    infinitive: 'a vorbi',
    lemma: 'vorbi',
    whatItTests: 'صرف چهارم با میانوند -esc',
    prezent: { eu: 'vorbesc', tu: 'vorbești', el: 'vorbește', noi: 'vorbim', voi: 'vorbiți', ei: 'vorbesc' },
    conjunctiv3: 'vorbească',
    participiu: 'vorbit',
  },
  {
    infinitive: 'a putea',
    lemma: 'putea',
    whatItTests: 'وجهی بی‌قاعده',
    prezent: { eu: 'pot', tu: 'poți', el: 'poate', noi: 'putem', voi: 'puteți', ei: 'pot' },
    conjunctiv3: 'poată',
    participiu: 'putut',
  },
];

async function getOrFetchHtml(lemma) {
  const scratchFile = path.join(rootDir, 'scratch', `${lemma}.html`);
  if (fs.existsSync(scratchFile)) {
    return fs.readFileSync(scratchFile, 'utf8');
  }
  const url = `https://dexonline.ro/definitie/${encodeURIComponent(lemma)}/paradigma`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  if (!fs.existsSync(path.join(rootDir, 'scratch'))) {
    fs.mkdirSync(path.join(rootDir, 'scratch'), { recursive: true });
  }
  fs.writeFileSync(scratchFile, html);
  return html;
}

async function main() {
  console.log('================================================================');
  console.log('DORVIA DRE-P157 — 5-VERB STOP GATE FIXTURE VERIFICATION');
  console.log('================================================================\n');

  let allPassed = true;
  let passedCount = 0;
  const multiValuesGlobal = [];

  for (const exp of EXPECTED_FIXTURE) {
    console.log(`Testing verb: ${exp.infinitive} (lemma: "${exp.lemma}")...`);
    const html = await getOrFetchHtml(exp.lemma);
    const parsed = extractVerbFromHtml(html, exp.lemma);

    const prezentStr = `${parsed.prezent.eu} / ${parsed.prezent.tu} / ${parsed.prezent.el} / ${parsed.prezent.noi} / ${parsed.prezent.voi} / ${parsed.prezent.ei}`;
    const expPrezentStr = `${exp.prezent.eu} / ${exp.prezent.tu} / ${exp.prezent.el} / ${exp.prezent.noi} / ${exp.prezent.voi} / ${exp.prezent.ei}`;

    const prezentMatches = prezentStr === expPrezentStr;
    const conj3Matches = parsed.conjunctiv.el === exp.conjunctiv3 && parsed.conjunctiv.ei === exp.conjunctiv3;
    const partMatches = parsed.participiu === exp.participiu;

    const matchesAll = prezentMatches && conj3Matches && partMatches;

    if (matchesAll) {
      passedCount++;
      console.log(`  ✅ MATCH [5/5 criteria met]`);
      console.log(`     Selected Table: [Index ${parsed.tableIndex}] "${parsed.tableHeader.slice(0, 70)}..."`);
      console.log(`     prezent: ${prezentStr}`);
      console.log(`     conjunctiv (3rd pers): ${parsed.conjunctiv.el} (el) / ${parsed.conjunctiv.ei} (ei)`);
      console.log(`     participiu: ${parsed.participiu}`);
    } else {
      allPassed = false;
      console.error(`  ❌ MISMATCH for ${exp.infinitive}:`);
      if (!prezentMatches) console.error(`     prezent expected "${expPrezentStr}", got "${prezentStr}"`);
      if (!conj3Matches) console.error(`     conjunctiv3 expected "${exp.conjunctiv3}", got "${parsed.conjunctiv.el}"`);
      if (!partMatches) console.error(`     participiu expected "${exp.participiu}", got "${parsed.participiu}"`);
    }

    if (parsed.multiValues && parsed.multiValues.length > 0) {
      console.log(`     Multi-value cell(s) detected: ${parsed.multiValues.length}`);
      for (const mv of parsed.multiValues) {
        multiValuesGlobal.push({ verb: exp.infinitive, ...mv });
        console.log(`       - [${mv.context}]: [${mv.variants.join(', ')}] -> Selected: "${mv.selected}"`);
      }
    }
    console.log('');
  }

  console.log('================================================================');
  console.log(`SUMMARY: ${passedCount} of ${EXPECTED_FIXTURE.length} verbs strictly matched fixture.`);
  console.log('================================================================\n');

  if (allPassed) {
    console.log('🎉 5 OUT OF 5 FIXTURE VERBS MATCHED PERFECTLY.');
    console.log('STOP GATE REACHED: Halting execution as mandated by dre-p157 Section 2.');
    console.log('Awaiting explicit user approval before proceeding to Section 5 (remaining 7 verbs).\n');
    process.exit(0);
  } else {
    console.error('❌ FIXTURE FAILED: Halting execution. Parser requires correction.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
