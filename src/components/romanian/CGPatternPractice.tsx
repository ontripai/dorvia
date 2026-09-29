'use client';

import React from 'react';
import { SpokenWordCheck } from './SpokenWordCheck';

const patterns = [
  { ro: 'ca / co / cu', soundFa: 'ک', soundEn: 'k', example: 'card', grammarFa: 'کارت؛ اسم خنثی: card، جمع carduri، مشخص cardul.', grammarEn: 'Card; neuter noun: card, plural carduri, definite cardul.', source: 'https://dexonline.ro/definitie/card/paradigma', noteFa: 'c پیش از a/o/u صدای «ک» می‌دهد.', noteEn: 'c before a/o/u has a k sound.' },
  { ro: 'ce / ci', soundFa: 'چ', soundEn: 'ch', example: 'ceai', grammarFa: 'چای؛ اسم خنثی: ceai، جمع ceaiuri، مشخص ceaiul.', grammarEn: 'Tea; neuter noun: ceai, plural ceaiuri, definite ceaiul.', source: 'https://dexonline.ro/definitie/ceai/paradigma', noteFa: 'c پیش از e/i در واژه‌های معمول صدای «چ» می‌دهد.', noteEn: 'c before e/i commonly has a ch sound.' },
  { ro: 'che / chi', soundFa: 'ک', soundEn: 'k', example: 'cheie', grammarFa: 'کلید؛ اسم مؤنث: cheie، جمع chei، مشخص cheia.', grammarEn: 'Key; feminine noun: cheie, plural chei, definite cheia.', source: 'https://dexonline.ro/definitie/cheie/paradigma', noteFa: 'h صدای جداگانه ندارد؛ c را پیش از e/i به صدای «ک» برمی‌گرداند.', noteEn: 'h adds no separate sound; it keeps c hard before e/i.' },
  { ro: 'ga / go / gu', soundFa: 'گ', soundEn: 'g', example: 'gară', grammarFa: 'ایستگاه؛ اسم مؤنث: gară، جمع gări، مشخص gara.', grammarEn: 'Station; feminine noun: gară, plural gări, definite gara.', source: 'https://dexonline.ro/definitie/gar%C4%83/paradigma', noteFa: 'g پیش از a/o/u صدای «گ» می‌دهد.', noteEn: 'g before a/o/u has a hard g sound.' },
  { ro: 'ge / gi', soundFa: 'ج', soundEn: 'j', example: 'geam', grammarFa: 'شیشه/پنجره؛ اسم خنثی: geam، جمع geamuri، مشخص geamul.', grammarEn: 'Window pane; neuter noun: geam, plural geamuri, definite geamul.', source: 'https://dexonline.ro/definitie/geam/paradigma', noteFa: 'g پیش از e/i در واژه‌های معمول صدای «ج» می‌دهد.', noteEn: 'g before e/i commonly has a j sound.' },
  { ro: 'ghe / ghi', soundFa: 'گ', soundEn: 'g', example: 'ghișeu', grammarFa: 'باجه؛ اسم خنثی: ghișeu، جمع ghișee، مشخص ghișeul.', grammarEn: 'Service counter; neuter noun: ghișeu, plural ghișee, definite ghișeul.', source: 'https://dexonline.ro/definitie/ghi%C8%99eu/paradigma', noteFa: 'h صدای جداگانه ندارد؛ g را پیش از e/i به صدای «گ» برمی‌گرداند.', noteEn: 'h adds no separate sound; it keeps g hard before e/i.' },
] as const;

const questions = {
  'c-hard': { word: 'card', group: 'ca', answer: 'k', choices: ['k', 'ch'] },
  'ce-ci': { word: 'ceai', group: 'ce', answer: 'ch', choices: ['k', 'ch'], second: { word: 'cinci', group: 'ci', fa: 'پنج؛ عدد اصلی، بدون تغییر جنس و شمار.', en: 'Five; cardinal number, unchanged for gender or number.', source: 'https://dexonline.ro/definitie/cinci' } },
  'che-chi': { word: 'cheie', group: 'che', answer: 'k', choices: ['k', 'ch'], second: { word: 'chitară', group: 'chi', fa: 'گیتار؛ اسم مؤنث: o chitară، جمع chitare، مشخص chitara.', en: 'Guitar; feminine noun: o chitară, plural chitare, definite chitara.', source: 'https://dexonline.ro/definitie/chitar%C4%83' } },
  'g-hard': { word: 'gară', group: 'ga', answer: 'g', choices: ['g', 'j'] },
  'ge-gi': { word: 'geam', group: 'ge', answer: 'j', choices: ['g', 'j'], second: { word: 'girafă', group: 'gi', fa: 'زرافه؛ اسم مؤنث: o girafă، جمع girafe، مشخص girafa.', en: 'Giraffe; feminine noun: o girafă, plural girafe, definite girafa.', source: 'https://dexonline.ro/definitie/giraf%C4%83' } },
  'ghe-ghi': { word: 'ghișeu', group: 'ghi', answer: 'g', choices: ['g', 'j'], second: { word: 'gheață', group: 'ghe', fa: 'یخ؛ اسم مؤنث: gheață، مشخص gheața؛ جمع ghețuri برای توده‌ها/انواع یخ.', en: 'Ice; feminine noun: gheață, definite gheața; plural ghețuri for ice masses/types.', source: 'https://dexonline.ro/definitie/ghea%C8%9B%C4%83' } },
} as const;

export function CGPatternPractice({ slug, lang }: { slug: keyof typeof questions; lang: 'fa' | 'en' }) {
  const [choice, setChoice] = React.useState<string | null>(null);
  const [round, setRound] = React.useState(0);
  const isFa = lang === 'fa';
  const question = questions[slug];
  const second = 'second' in question ? question.second : null;
  const current = round === 1 && second ? second : question;
  return <section className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-7 space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
    <h2 className="text-xl font-bold">{isFa ? 'نقشهٔ دو و سه حرفی C و G' : 'C and G: two and three-letter patterns'}</h2>
    <p className="text-sm text-slate-700">{isFa ? 'ce و che «حرف مستقل» نیستند. حرف بعد از c یا g تعیین می‌کند چه صدایی بشنوید؛ h در che/chi و ghe/ghi برای نگه‌داشتن صدای سخت نوشته می‌شود.' : 'Ce and che are spelling patterns, not extra alphabet letters. The following vowel changes c/g; h in che/chi and ghe/ghi keeps the hard sound.'}</p>
    <div className="grid gap-3 sm:grid-cols-2">{patterns.map(pattern => <div key={pattern.ro} className="rounded-xl bg-blue-50 p-4 space-y-1">
      <p lang="ro" dir="ltr" className="text-xl font-bold">{pattern.ro}</p>
      <p>{isFa ? `صدا: ${pattern.soundFa}` : `Sound: ${pattern.soundEn}`}</p>
      <p className="text-sm">{isFa ? pattern.noteFa : pattern.noteEn}</p>
      <p lang="ro" dir="ltr" className="text-sm font-semibold">{pattern.example}</p>
      <details className="rounded-lg bg-white p-2 text-sm"><summary className="cursor-pointer">{isFa ? 'قاعدهٔ واژهٔ نمونه' : 'Example word grammar'}</summary><p>{isFa ? pattern.grammarFa : pattern.grammarEn}</p><a href={pattern.source} target="_blank" rel="noopener noreferrer" className="text-[#1554bd] underline">{isFa ? 'منبع' : 'Source'}</a></details>
    </div>)}</div>
    <div className="rounded-xl border border-slate-200 p-4 space-y-2">
      <p className="font-semibold">{isFa ? `در «${current.word}»، گروه ${current.group} چه صدایی می‌دهد؟` : `In “${current.word}”, what sound does ${current.group} make?`}</p>
      {round === 1 && second && <details className="rounded-lg bg-blue-50 p-2 text-sm"><summary className="cursor-pointer">{isFa ? 'قاعدهٔ واژهٔ دوم' : 'Second word grammar'}</summary><p>{isFa ? second.fa : second.en}</p><a href={second.source} target="_blank" rel="noopener noreferrer" className="text-[#1554bd] underline">{isFa ? 'منبع' : 'Source'}</a></details>}
      <div className="flex gap-2" dir="ltr">{question.choices.map(value => <button key={value} type="button" onClick={() => setChoice(value)} aria-pressed={choice === value} className={`rounded-lg border px-4 py-2 ${choice === value ? 'border-[#1554bd] bg-[#1554bd] text-white' : 'border-slate-300'}`}>{value}</button>)}</div>
      {choice && <p role="status" className="text-sm">{choice === question.answer ? isFa ? 'درست است. حالا واژهٔ نمونه را بگویید.' : 'Correct. Now say the example word.' : isFa ? 'به حرف بعد از c/g و وجود یا نبودن h نگاه کنید و دوباره امتحان کنید.' : 'Check the vowel after c/g and whether h is present, then retry.'}</p>}
      {choice === question.answer && second && round === 0 && <button type="button" onClick={() => { setRound(1); setChoice(null); }} className="rounded-lg bg-[#1554bd] px-4 py-2 text-white">{isFa ? `تمرین ${second.group}` : `Practise ${second.group}`}</button>}
      {second && round === 1 && <button type="button" onClick={() => { setRound(0); setChoice(null); }} className="rounded-lg border border-[#1554bd] px-4 py-2 text-[#1554bd]">{isFa ? 'تکرار از ابتدا' : 'Repeat from start'}</button>}
    </div>
    <SpokenWordCheck key={current.word} word={current.word} lang={lang} />
    <p className="text-xs text-slate-600">{isFa ? 'واژه‌های این نقشه برای مقایسهٔ املا و صدا هستند؛ صوت ضبط‌شدهٔ هر صفحه مربوط به نمونهٔ همان درس است. تلفظ وام‌واژه‌ها را جدا بررسی می‌کنیم.' : 'These words compare spelling and sound; each page’s recorded clip belongs to its own lesson sample. Loans need separate pronunciation review.'}</p>
  </section>;
}
