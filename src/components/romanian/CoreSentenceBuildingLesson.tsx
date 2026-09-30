'use client';

import React from 'react';
import type { Language } from '@/types';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from '@/components/romanian/PronunciationAudio';
import { SpokenWordCheck } from '@/components/romanian/SpokenWordCheck';

type LessonKind = 'verbs-present' | 'adjectives';

const stagesFa = ['هدف و یادآوری', 'شنیدن نمونه', 'کشف قاعده', 'نوشتن', 'گفتن و مرور'];
const stagesEn = ['Goal and recall', 'Listen to examples', 'Notice the rule', 'Write', 'Speak and review'];
const minutes = [2, 3, 4, 4, 2];

const conjugations = [
  { person: 'eu', fa: 'من', fi: 'sunt', avea: 'am' },
  { person: 'tu', fa: 'تو', fi: 'ești', avea: 'ai' },
  { person: 'el / ea', fa: 'او', fi: 'este', avea: 'are' },
  { person: 'noi', fa: 'ما', fi: 'suntem', avea: 'avem' },
  { person: 'voi', fa: 'شما', fi: 'sunteți', avea: 'aveți' },
  { person: 'ei / ele', fa: 'آن‌ها', fi: 'sunt', avea: 'au' },
];

const lessonCopy = {
  'verbs-present': {
    titleFa: 'دو فعل پایه در زمان حال: a fi و a avea',
    titleEn: 'Two essential present-tense verbs: a fi and a avea',
    introFa: 'فعل با فاعل هماهنگ می‌شود. در این جلسه، شکل‌های زمان حالِ «بودن» و «داشتن» را می‌آموزید تا بعداً آن‌ها را در جمله به کار ببرید.',
    introEn: 'The verb agrees with its subject. Learn the present forms of “to be” and “to have” so you can use them in sentences.',
    examples: [
      { ro: 'Eu sunt aici.', fa: 'من اینجا هستم.', en: 'I am here.' },
      { ro: 'Tu ești aici.', fa: 'تو اینجا هستی.', en: 'You are here.' },
      { ro: 'Eu am un bilet.', fa: 'من یک بلیت دارم.', en: 'I have a ticket.' },
      { ro: 'Ea are un bilet.', fa: 'او یک بلیت دارد.', en: 'She has a ticket.' },
    ],
    ruleFa: 'مصدر با «a» می‌آید: a fi = بودن و a avea = داشتن. در جمله، مصدر را جای فعل صرف‌شده نمی‌گذاریم؛ شکل فعل را از روی فاعل انتخاب می‌کنیم. ضمیر فاعلی گاهی حذف می‌شود، چون خود شکل فعل فاعل را نشان می‌دهد: Sunt aici.',
    ruleEn: 'The infinitive begins with “a”: a fi = to be and a avea = to have. In a sentence, choose the conjugated form that matches the subject. The subject pronoun is often omitted because the verb ending identifies it: Sunt aici.',
    prompts: [
      { fa: 'من اینجا هستم.', en: 'I am here.', answer: 'Eu sunt aici.' },
      { fa: 'تو اینجا هستی.', en: 'You are here.', answer: 'Tu ești aici.' },
      { fa: 'من یک بلیت دارم.', en: 'I have a ticket.', answer: 'Eu am un bilet.' },
    ],
    speak: 'Eu am un bilet nou.',
    speakFa: 'من یک بلیت جدید دارم.',
    speakEn: 'I have a new ticket.',
  },
  adjectives: {
    titleFa: 'صفت در جمله: جایگاه و هماهنگی',
    titleEn: 'Adjectives in sentences: position and agreement',
    introFa: 'صفت اسم را توصیف می‌کند. در توصیف ساده معمولاً پس از اسم می‌آید و شکل آن با جنس و شمار اسم هماهنگ می‌شود.',
    introEn: 'An adjective describes a noun. In a simple description it usually follows the noun and agrees with its gender and number.',
    examples: [
      { ro: 'un bilet nou', fa: 'یک بلیت جدید', en: 'a new ticket' },
      { ro: 'o casă nouă', fa: 'یک خانهٔ جدید', en: 'a new house' },
      { ro: 'doi elevi buni', fa: 'دو دانش‌آموز خوب', en: 'two good pupils' },
      { ro: 'două case noi', fa: 'دو خانهٔ جدید', en: 'two new houses' },
    ],
    ruleFa: 'الگوی معمول: اسم + صفت؛ مانند bilet nou. در مفرد مذکر/خنثی می‌گوییم nou، در مفرد مؤنث nouă، و در جمع noi. بعضی صفت‌ها شکل‌های دیگری دارند؛ صفت را همراه اسم و با توجه به جنس و شمار آن یاد بگیرید. صفت گاهی برای تأکید پیش از اسم می‌آید، پس جای پس از اسم یک الگوی معمول است، نه قانونی بی‌استثنا.',
    ruleEn: 'Usual pattern: noun + adjective, as in bilet nou. Use nou with a masculine/neuter singular noun, nouă with a feminine singular noun, and noi in these plural examples. Some adjectives have other forms, so learn the adjective with its noun and match gender and number. An adjective can sometimes precede the noun for emphasis; post-noun position is a common pattern, not an exceptionless rule.',
    prompts: [
      { fa: 'یک بلیت جدید', en: 'a new ticket', answer: 'un bilet nou' },
      { fa: 'یک خانهٔ جدید', en: 'a new house', answer: 'o casă nouă' },
      { fa: 'دو خانهٔ جدید', en: 'two new houses', answer: 'două case noi' },
    ],
    speak: 'Eu am un bilet nou.',
    speakFa: 'من یک بلیت جدید دارم.',
    speakEn: 'I have a new ticket.',
  },
} as const;

function normalize(value: string) {
  return value.normalize('NFC').trim().toLocaleLowerCase('ro-RO').replace(/[.!?]+$/g, '').replace(/\s+/g, ' ');
}

export function CoreSentenceBuildingLesson({ lang, kind }: { lang: Language; kind: LessonKind }) {
  const isFa = lang === 'fa';
  const copy = lessonCopy[kind];
  const [stage, setStage] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [passed, setPassed] = React.useState<number[]>([]);
  const [saidAloud, setSaidAloud] = React.useState(false);
  const isCorrect = normalize(answer) === normalize(copy.prompts[index].answer);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
    if (isCorrect && !passed.includes(index)) setPassed(items => [...items, index]);
  }

  function moveToNextPrompt() {
    if (index < copy.prompts.length - 1) {
      setIndex(current => current + 1);
      setAnswer('');
      setChecked(false);
    } else {
      setStage(4);
    }
  }

  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <Link href="/learn-romanian/fundamente" className="inline-flex text-sm font-semibold text-[#1554bd] hover:underline">{isFa ? '→ بازگشت به مسیر درس‌های پایه' : '← Back to the foundation path'}</Link>

    <header className="dark-hero-panel space-y-4 rounded-3xl p-7 text-white sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-blue-100">{isFa ? 'یک درس پایه · حدود ۱۵ دقیقه' : 'One foundation lesson · about 15 minutes'}</p>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{isFa ? 'گوش‌دادن · نوشتن · گفتن' : 'Listen · write · speak'}</span>
      </div>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{isFa ? copy.titleFa : copy.titleEn}</h1>
      <p className="max-w-3xl leading-7 text-blue-50">{isFa ? copy.introFa : copy.introEn}</p>
      <p className="text-xs text-blue-100">{isFa ? 'زمان پیشنهادی است؛ هر مرحله را می‌توانید تکرار کنید.' : 'The time is a guide; you can repeat any stage.'}</p>
    </header>

    <nav aria-label={isFa ? 'مراحل درس ۱۵ دقیقه‌ای' : '15-minute lesson stages'} className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-5">
      {(isFa ? stagesFa : stagesEn).map((label, step) => <button key={label} type="button" onClick={() => setStage(step)} aria-current={stage === step ? 'step' : undefined} className={`rounded-xl px-3 py-2 text-start text-xs font-semibold ${stage === step ? 'bg-[#1554bd] text-white' : 'bg-slate-50 text-slate-700 hover:bg-blue-50'}`}>
        <span className="block">{step + 1}. {label}</span><span className="mt-1 block opacity-80">{isFa ? `${minutes[step]} دقیقه` : `${minutes[step]} min`}</span>
      </button>)}
    </nav>

    {stage === 0 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'مرحلهٔ ۱ · ۲ دقیقه' : 'STEP 1 · 2 MINUTES'}</p>
      <h2 className="text-xl font-extrabold">{isFa ? 'از چیزی که تا اینجا می‌دانید شروع کنید' : 'Start with what you already know'}</h2>
      <p className="leading-7 text-slate-700">{isFa ? kind === 'verbs-present' ? 'در یک جمله، فاعل می‌گوید دربارهٔ چه کسی حرف می‌زنیم؛ فعل می‌گوید او چه هست یا چه دارد.' : 'اسم جنس و شمار دارد؛ صفت باید شکل متناسب با همان اسم را بگیرد.' : kind === 'verbs-present' ? 'The subject tells us who the sentence is about; the verb says what the subject is or has.' : 'A noun has gender and number; the adjective takes a matching form.'}</p>
      <div className="rounded-xl bg-blue-50 p-4"><p lang="ro" dir="ltr" className="text-lg font-extrabold text-[#1554bd]">{kind === 'verbs-present' ? 'Eu am un bilet.' : 'un bilet nou'}</p><p className="mt-1 text-sm">{kind === 'verbs-present' ? (isFa ? 'فاعل: eu · فعل صرف‌شده: am' : 'Subject: eu · conjugated verb: am') : (isFa ? 'اسم: bilet · صفت پس از اسم: nou' : 'Noun: bilet · adjective after the noun: nou')}</p></div>
      <button type="button" onClick={() => setStage(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'شنیدن نمونه‌ها ←' : 'Listen to examples →'}</button>
    </section>}

    {stage === 1 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'مرحلهٔ ۲ · ۳ دقیقه' : 'STEP 2 · 3 MINUTES'}</p>
      <h2 className="text-xl font-extrabold">{isFa ? 'هر نمونه را بشنوید و بلند تکرار کنید' : 'Listen to each example and repeat it aloud'}</h2>
      <div className="grid gap-3 sm:grid-cols-2">{copy.examples.map(example => <article key={example.ro} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p lang="ro" dir="ltr" className="text-lg font-extrabold text-[#1554bd]">{example.ro}</p><PronunciationAudio currentLang={lang} label={example.ro} className="mt-2" />
        <p className="mt-2 text-sm">{isFa ? example.fa : example.en}</p>
      </article>)}</div>
      <button type="button" onClick={() => setStage(2)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'دیدن قاعده ←' : 'See the rule →'}</button>
    </section>}

    {stage === 2 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'مرحلهٔ ۳ · ۴ دقیقه' : 'STEP 3 · 4 MINUTES'}</p>
      <h2 className="text-xl font-extrabold">{isFa ? 'قاعده را از جدول و جمله پیدا کنید' : 'Find the rule in the table and examples'}</h2>
      <p className="leading-7 text-slate-700">{isFa ? kind === 'verbs-present' ? lessonCopy['verbs-present'].ruleFa : lessonCopy.adjectives.ruleFa : kind === 'verbs-present' ? lessonCopy['verbs-present'].ruleEn : lessonCopy.adjectives.ruleEn}</p>
      {kind === 'verbs-present' ? <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[430px] text-sm"><thead className="bg-blue-50"><tr><th className="p-3 text-start">{isFa ? 'فاعل' : 'Subject'}</th><th className="p-3 text-start">a fi</th><th className="p-3 text-start">a avea</th></tr></thead><tbody>{conjugations.map(row => <tr key={row.person} className="border-t border-slate-100"><td className="p-3"><span lang="ro" dir="ltr" className="font-bold">{row.person}</span><span className="ms-2 text-slate-500">{isFa ? row.fa : ''}</span></td><td lang="ro" dir="ltr" className="p-3 font-bold">{row.fi}</td><td lang="ro" dir="ltr" className="p-3 font-bold">{row.avea}</td></tr>)}</tbody></table></div> : <div className="grid gap-3 sm:grid-cols-2">{[['nou', isFa ? 'مذکر/خنثی مفرد' : 'masculine/neuter singular'], ['nouă', isFa ? 'مؤنث مفرد' : 'feminine singular'], ['noi', isFa ? 'جمع؛ در نمونه‌های این درس' : 'plural in these examples'], ['buni', isFa ? 'صفت دیگری در جمع مذکر' : 'another adjective, masculine plural']].map(([form, note]) => <div key={form} className="rounded-xl bg-blue-50 p-4"><span lang="ro" dir="ltr" className="text-lg font-extrabold text-[#1554bd]">{form}</span><p className="mt-1 text-sm">{note}</p></div>)}</div>}
      <button type="button" onClick={() => { setStage(3); setIndex(0); setAnswer(''); setChecked(false); }} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'تمرین نوشتن ←' : 'Practise writing →'}</button>
    </section>}

    {stage === 3 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-extrabold text-[#1554bd]">{isFa ? `مرحلهٔ ۴ · ۴ دقیقه · تمرین ${index + 1} از ${copy.prompts.length}` : `STEP 4 · 4 MINUTES · PROMPT ${index + 1} OF ${copy.prompts.length}`}</p>
      <h2 className="text-xl font-extrabold">{isFa ? `«${copy.prompts[index].fa}» را به رومانیایی بنویسید.` : `Write “${copy.prompts[index].en}” in Romanian.`}</h2>
      <form onSubmit={submit} className="flex flex-wrap gap-2"><input lang="ro" dir="ltr" autoComplete="off" aria-label={isFa ? 'پاسخ به رومانیایی' : 'Romanian answer'} value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} className="min-w-56 flex-1 rounded-xl border border-slate-300 p-3 text-lg" /><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></form>
      {checked && <p role="status" className={`rounded-xl p-3 ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>{isCorrect ? (isFa ? 'درست است؛ شکل فعل/صفت را با فاعل/اسم هماهنگ کردید.' : 'Correct. You matched the verb/adjective to its subject/noun.') : (isFa ? 'هنوز درست نیست؛ قاعدهٔ تطبیق را دوباره بررسی کنید.' : 'Not quite. Check the agreement rule and try again.')}</p>}
      {checked && !isCorrect && <button type="button" onClick={() => setAnswer(copy.prompts[index].answer)} className="text-sm font-semibold text-[#1554bd] underline">{isFa ? 'نمایش پاسخ' : 'Show answer'}</button>}
      {passed.includes(index) && <button type="button" onClick={moveToNextPrompt} className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white">{index < copy.prompts.length - 1 ? (isFa ? 'تمرین بعدی ←' : 'Next prompt →') : (isFa ? 'رفتن به گفتن و مرور ←' : 'Continue to speak and review →')}</button>}
      <p lang="ro" dir="ltr" className="text-sm font-semibold text-slate-500">{copy.prompts[index].answer}</p>
    </section>}

    {stage === 4 && <section className="space-y-4 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-extrabold text-emerald-700">{isFa ? 'مرحلهٔ ۵ · ۲ دقیقه' : 'STEP 5 · 2 MINUTES'}</p>
      <h2 className="text-2xl font-extrabold text-emerald-800">{isFa ? 'حالا یک جملهٔ کامل را بگویید' : 'Now say a complete sentence'}</h2>
      <div className="rounded-2xl bg-emerald-50 p-5"><p lang="ro" dir="ltr" className="text-2xl font-extrabold text-emerald-950">{copy.speak}</p><p className="mt-1">{isFa ? copy.speakFa : copy.speakEn}</p><PronunciationAudio currentLang={lang} label={copy.speak} className="mt-3" /></div>
      <SpokenWordCheck word={copy.speak} lang={lang} />
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 font-semibold"><input type="checkbox" checked={saidAloud} onChange={event => setSaidAloud(event.target.checked)} className="h-5 w-5 accent-[#1554bd]" />{isFa ? 'جمله را بلند گفتم و قاعده را مرور کردم.' : 'I said the sentence aloud and reviewed the rule.'}</label>
      {saidAloud && <p role="status" className="rounded-xl bg-emerald-50 p-4 font-bold text-emerald-900">{isFa ? 'این نوبت ۱۵ دقیقه‌ای تمام شد. می‌توانید آن را تکرار کنید یا به گام بعدی مسیر بروید.' : 'This 15-minute session is complete. Repeat it or continue to the next step.'}</p>}
      <Link href={kind === 'verbs-present' ? '/learn-romanian/fundamente/sifat' : '/learn-romanian/fundamente/sakht-jomle'} className="inline-flex rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? kind === 'verbs-present' ? 'رفتن به درس صفت ←' : 'رفتن به درس جمله‌سازی ←' : kind === 'verbs-present' ? 'Continue to adjectives →' : 'Continue to sentence order →'}</Link>
    </section>}
  </div>;
}
