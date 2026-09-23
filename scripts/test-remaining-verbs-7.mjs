import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractVerbFromHtml } from './parse-dexonline.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const EXPECTED_SEVEN = [
  {
    infinitive: 'a vrea',
    lemma: 'vrea',
    prezent: { eu: 'vreau', tu: 'vrei', el: 'vrea', noi: 'vrem', voi: 'vreți', ei: 'vor' },
    conjunctiv3: 'vrea',
    participiu: 'vrut',
  },
  {
    infinitive: 'a ști',
    lemma: 'ști',
    prezent: { eu: 'știu', tu: 'știi', el: 'știe', noi: 'știm', voi: 'știți', ei: 'știu' },
    conjunctiv3: 'știe',
    participiu: 'știut',
  },
  {
    infinitive: 'a înțelege',
    lemma: 'înțelege',
    prezent: { eu: 'înțeleg', tu: 'înțelegi', el: 'înțelege', noi: 'înțelegem', voi: 'înțelegeți', ei: 'înțeleg' },
    conjunctiv3: 'înțeleagă',
    participiu: 'înțeles',
  },
  {
    infinitive: 'a veni',
    lemma: 'veni',
    prezent: { eu: 'vin', tu: 'vii', el: 'vine', noi: 'venim', voi: 'veniți', ei: 'vin' },
    conjunctiv3: 'vină',
    participiu: 'venit',
  },
  {
    infinitive: 'a face',
    lemma: 'face',
    prezent: { eu: 'fac', tu: 'faci', el: 'face', noi: 'facem', voi: 'faceți', ei: 'fac' },
    conjunctiv3: 'facă',
    participiu: 'făcut',
  },
  {
    infinitive: 'a ajuta',
    lemma: 'ajuta',
    prezent: { eu: 'ajut', tu: 'ajuți', el: 'ajută', noi: 'ajutăm', voi: 'ajutați', ei: 'ajută' },
    conjunctiv3: 'ajute',
    participiu: 'ajutat',
  },
  {
    infinitive: 'a trebui',
    lemma: 'trebui',
    // Only 3rd sing and participiu are declared in advance:
    partialExpected: {
      el: 'trebuie',
      participiu: 'trebuit',
    },
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
  console.log('DORVIA DRE-P157 — 7 REMAINING VERBS EXTRACTION & VERIFICATION');
  console.log('================================================================\n');

  let allPassed = true;
  const results = [];

  for (const exp of EXPECTED_SEVEN) {
    console.log(`Processing verb: ${exp.infinitive} (lemma: "${exp.lemma}")...`);
    try {
      const html = await getOrFetchHtml(exp.lemma);
      const parsed = extractVerbFromHtml(html, exp.lemma);

      const prezentStr = `${parsed.prezent.eu} / ${parsed.prezent.tu} / ${parsed.prezent.el} / ${parsed.prezent.noi} / ${parsed.prezent.voi} / ${parsed.prezent.ei}`;
      const conjStr = `${parsed.conjunctiv.eu} / ${parsed.conjunctiv.tu} / ${parsed.conjunctiv.el} / ${parsed.conjunctiv.noi} / ${parsed.conjunctiv.voi} / ${parsed.conjunctiv.ei}`;

      if (exp.prezent) {
        const expPrezentStr = `${exp.prezent.eu} / ${exp.prezent.tu} / ${exp.prezent.el} / ${exp.prezent.noi} / ${exp.prezent.voi} / ${exp.prezent.ei}`;
        const prezentMatches = prezentStr === expPrezentStr;
        const conj3Matches = parsed.conjunctiv.el === exp.conjunctiv3 && parsed.conjunctiv.ei === exp.conjunctiv3;
        const partMatches = parsed.participiu === exp.participiu;

        const matchesAll = prezentMatches && conj3Matches && partMatches;
        if (matchesAll) {
          console.log(`  ✅ MATCH [All criteria met]`);
        } else {
          allPassed = false;
          console.error(`  ❌ MISMATCH for ${exp.infinitive}:`);
          if (!prezentMatches) console.error(`     prezent expected "${expPrezentStr}", got "${prezentStr}"`);
          if (!conj3Matches) console.error(`     conjunctiv 3 expected "${exp.conjunctiv3}", got el:"${parsed.conjunctiv.el}", ei:"${parsed.conjunctiv.ei}"`);
          if (!partMatches) console.error(`     participiu expected "${exp.participiu}", got "${parsed.participiu}"`);
        }
      } else if (exp.partialExpected) {
        // a trebui
        const elMatches = parsed.prezent.el === exp.partialExpected.el;
        const partMatches = parsed.participiu === exp.partialExpected.participiu;
        if (elMatches && partMatches) {
          console.log(`  ✅ PARTIAL MATCH [Declared criteria met: el="${parsed.prezent.el}", participiu="${parsed.participiu}"]`);
        } else {
          allPassed = false;
          console.error(`  ❌ MISMATCH for ${exp.infinitive}:`);
          if (!elMatches) console.error(`     prezent.el expected "${exp.partialExpected.el}", got "${parsed.prezent.el}"`);
          if (!partMatches) console.error(`     participiu expected "${exp.partialExpected.participiu}", got "${parsed.participiu}"`);
        }
      }

      console.log(`     Selected Table: [Index ${parsed.tableIndex}] "${parsed.tableHeader.slice(0, 70)}..."`);
      console.log(`     prezent: ${prezentStr}`);
      console.log(`     conjunctiv: ${conjStr}`);
      console.log(`     participiu: ${parsed.participiu}`);
      if (parsed.multiValues && parsed.multiValues.length > 0) {
        console.log(`     Multi-value cell(s) detected: ${parsed.multiValues.length}`);
        parsed.multiValues.forEach(mv => {
          console.log(`       - [${mv.context}]: [${mv.variants.join(', ')}] -> Selected: "${mv.selected}"`);
        });
      }

      results.push({
        infinitive: exp.infinitive,
        lemma: exp.lemma,
        parsed,
      });
    } catch (err) {
      allPassed = false;
      console.error(`  💥 ERROR for ${exp.infinitive}:`, err.message);
    }
  }

  console.log('\n================================================================');
  console.log(`OVERALL STATUS: ${allPassed ? 'ALL VERBS PASSED' : 'FAILURES DETECTED'}`);
  console.log('================================================================');

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
