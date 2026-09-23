import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractVerbFromHtml } from './parse-dexonline.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const CORE_VERB_DEFS = [
  // Layer A
  { lemma: 'fi', infinitive: 'a fi', en: 'to be', fa: 'بودن' },
  { lemma: 'avea', infinitive: 'a avea', en: 'to have', fa: 'داشتن' },
  { lemma: 'putea', infinitive: 'a putea', en: 'to be able to / can', fa: 'توانستن' },
  { lemma: 'vrea', infinitive: 'a vrea', en: 'to want', fa: 'خواستن' },
  {
    lemma: 'trebui',
    infinitive: 'a trebui',
    en: 'to need / must',
    fa: 'باید / لازم بودن',
    defective: {
      reason: 'Verb unipersonal / defectiv de persoana I și a II-a; se folosește doar la persoana a III-a.',
      source: 'DOOM 3 (V343) / dexonline',
    },
    usageNote: {
      fa: 'در زبان رومانیایی امروز، فعل a trebui به‌صورت بی‌شخص به کار می‌رود و فقط صورت trebuie برای همه‌ی اشخاص استفاده می‌شود؛ سایر صیغه‌ها در تولید گفتار معیار کاربرد ندارند.',
      en: 'In contemporary Romanian, "a trebui" is used impersonally; only the form "trebuie" is used across all persons, and personal forms are not used in standard production.',
    },
  },
  { lemma: 'ști', infinitive: 'a ști', en: 'to know', fa: 'دانستن' },
  // Layer B
  { lemma: 'înțelege', infinitive: 'a înțelege', en: 'to understand', fa: 'فهمیدن / درک کردن' },
  { lemma: 'vorbi', infinitive: 'a vorbi', en: 'to speak / talk', fa: 'صحبت کردن / حرف زدن' },
  { lemma: 'merge', infinitive: 'a merge', en: 'to go / walk', fa: 'رفتن / راه رفتن' },
  { lemma: 'veni', infinitive: 'a veni', en: 'to come', fa: 'آمدن' },
  { lemma: 'face', infinitive: 'a face', en: 'to do / make', fa: 'انجام دادن / ساختن' },
  { lemma: 'ajuta', infinitive: 'a ajuta', en: 'to help', fa: 'کمک کردن' },
];

function slugifyLemma(lemma) {
  return lemma
    .toLowerCase()
    .replace(/ț/g, 't')
    .replace(/ș/g, 's')
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i');
}

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
  const verbsOutput = [];

  for (const def of CORE_VERB_DEFS) {
    const html = await getOrFetchHtml(def.lemma);
    const parsed = extractVerbFromHtml(html, def.lemma);
    const url = `https://dexonline.ro/definitie/${encodeURIComponent(def.lemma)}/paradigma`;
    const slug = slugifyLemma(def.lemma);
    const id = `v-core-a-${slug}`;

    const verbObj = {
      id,
      infinitive: def.infinitive,
      translations: { en: def.en, fa: def.fa },
      domains: ['core'],
      conjugation: {
        prezent: parsed.prezent,
        conjunctiv: parsed.conjunctiv,
      },
      participiu: parsed.participiu,
      source: {
        label: `dexonline — paradigma (${parsed.tableHeader.slice(0, 30).trim()})`,
        url,
        retrievedAt: '2026-09-23',
      },
      reviewer: 'ai-only',
      status: 'draft',
    };

    if (def.usageNote) {
      verbObj.usageNote = def.usageNote;
    }

    if (def.defective) {
      verbObj.defective = def.defective;
    }

    verbsOutput.push(verbObj);
  }

  const fileContent = `import { RomanianVerb } from '@/lib/romanian/types';

/**
 * دوازده فعل هسته‌ی رومانیایی (dre-p157)
 * واکشی‌شده قطعی از dexonline بدون مدل زبانی
 *
 * لایه‌ی الف — پایه‌ای:
 *   a fi · a avea · a putea · a vrea · a trebui · a ști
 *
 * لایه‌ی ب — تعامل روزمره:
 *   a înțelege · a vorbi · a merge · a veni · a face · a ajuta
 *
 * تمامی افعال با status: 'draft' و صیغه‌های conjunctiv بدون 'să' ذخیره شده‌اند.
 */

export const CORE_VERBS: RomanianVerb[] = ${JSON.stringify(verbsOutput, null, 2)};
`;

  const targetPath = path.join(rootDir, 'src', 'content', 'romanian', 'core-verbs.ts');
  fs.writeFileSync(targetPath, fileContent, 'utf8');
  console.log(`Successfully generated ${verbsOutput.length} core verbs at ${targetPath}`);
}

main().catch(err => {
  console.error('Fatal generator error:', err);
  process.exit(1);
});
