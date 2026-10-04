'use client';

import React from 'react';
import { ListeningPractice } from './ListeningPractice';
import { LessonStageNav } from './LessonStageNav';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { playVerifiedAudio, stopVerifiedAudio } from '@/lib/romanian/playVerifiedAudio';

type Locale = 'fa' | 'en';
type Phrase = { ro: string; en: string; fa: string };
const dialogue: (Phrase & { who: 'you' | 'server' })[] = [
  { who: 'you', ro: 'Bună ziua!', en: 'Hello!', fa: 'سلام!' },
  { who: 'server', ro: 'Ce doriți?', en: 'What would you like?', fa: 'چه میل دارید؟' },
  { who: 'you', ro: 'Aș dori o cafea fără zahăr, vă rog.', en: 'I would like a coffee without sugar, please.', fa: 'یک قهوه بدون شکر می‌خواهم، لطفاً.' },
  { who: 'server', ro: 'Sigur. Altceva?', en: 'Of course. Anything else?', fa: 'حتماً. چیز دیگری؟' },
  { who: 'you', ro: 'Nu, mulțumesc. Nota, vă rog.', en: 'No, thank you. The bill, please.', fa: 'نه، متشکرم. صورتحساب، لطفاً.' },
];
const examples: Phrase[] = [
  { ro: 'Aș dori o cafea, vă rog.', en: 'I would like a coffee, please.', fa: 'یک قهوه می‌خواهم، لطفاً.' },
  { ro: 'Aș dori un ceai, vă rog.', en: 'I would like a tea, please.', fa: 'یک چای می‌خواهم، لطفاً.' },
  { ro: 'Aș dori o cafea fără zahăr, vă rog.', en: 'I would like a coffee without sugar, please.', fa: 'یک قهوه بدون شکر می‌خواهم، لطفاً.' },
  { ro: 'Nota, vă rog.', en: 'The bill, please.', fa: 'صورتحساب، لطفاً.' },
];
const tasks = [
  { ...examples[0], hint: 'Aș dori o …, vă rog.' },
  { ...examples[1], hint: 'Aș dori un …, vă rog.' },
  { ...examples[3], hint: '… , vă rog.' },
];
const labels = { fa: ['مکالمه', 'قاعده‌ها', 'یادآوری', 'سفارش', 'نتیجه'], en: ['Conversation', 'Rules', 'Recall', 'Order', 'Result'] };
const normalize = (s: string) => s.normalize('NFC').toLocaleLowerCase('ro-RO').trim().replace(/[.!?،,]+$/g, '').replace(/\s+/g, ' ');

export function CafeLesson({ lang }: { lang: Locale }) {
  const isFa = lang === 'fa';
  const [stage, setStage] = React.useState(0);
  const [round, setRound] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'retry' | null>(null);
  const [hint, setHint] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  React.useEffect(() => () => stopVerifiedAudio(), []);
  const task = stage === 2 ? tasks[0] : tasks[round];
  function move(to: number) { stopVerifiedAudio(); setStage(to); setRound(0); setAnswer(''); setFeedback(null); setHint(false); setAudioError(false); }
  function play(ro: string) { setAudioError(false); playVerifiedAudio(ro, () => setAudioError(true)); }
  function next() {
    if (stage === 2) { move(3); return; }
    if (round < tasks.length - 1) { setRound(round + 1); setAnswer(''); setFeedback(null); setHint(false); return; }
    try { localStorage.setItem('dorvia:romanian:cafe:v1', new Date().toISOString()); } catch { /* optional */ }
    setComplete(true); move(4);
  }
  const action = (label: string, onClick: () => void) => <button type="button" onClick={onClick} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{label}</button>;
  const phrase = ({ ro, en, fa }: Phrase) => <div key={ro} className="rounded-xl bg-white/80 p-3"><p lang="ro" dir="ltr" className="text-lg font-bold">{ro}</p><p lang="en" dir="ltr" className="text-sm text-slate-700">{en}</p>{isFa && <p className="text-sm">{fa}</p>}<button type="button" onClick={() => play(ro)} className="mt-2 text-sm font-semibold text-[#1554bd] underline">{isFa ? 'شنیدن' : 'Listen'}</button></div>;
  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10"><p className="text-sm font-semibold text-blue-100">{isFa ? 'کافه و غذا · درس ۱ · حدود ۱۵ دقیقه' : 'Cafés and food · lesson 1 · about 15 minutes'}</p><h1 className="mt-2 text-3xl font-extrabold">{isFa ? 'سفارش در کافه' : 'Ordering in a café'}</h1><p className="mt-3 text-blue-50">{isFa ? 'قهوه یا چای بخواهید، «بدون شکر» بگویید و صورتحساب درخواست کنید.' : 'Ask for coffee or tea, say “without sugar”, and request the bill.'}</p></header>
    <LessonStageNav lang={lang} labels={labels[lang]} stage={stage} onSelect={move} />
    {stage === 0 && <section className="space-y-4 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۱. گفت‌وگو را بشنوید' : '1. Listen to the conversation'}</h2><p>{isFa ? 'در کافه یک نوشیدنی سفارش می‌دهید. جمله‌ها را بشنوید و بلند تکرار کنید.' : 'You order a drink at a café. Listen to each line and repeat it aloud.'}</p><ListeningPractice lang={lang} dialogue={dialogue} counterpart={{ fa: 'پیشخدمت', en: 'Server' }}/><div>{action(isFa ? 'واژه‌ها و قاعده‌ها' : 'Words and rules', () => move(1))}</div></section>}
    {stage === 1 && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۲. قاعده‌ها و کاربرد' : '2. Rules and usage'}</h2>
      <article className="space-y-3 rounded-xl bg-sky-50 p-4"><h3 className="font-bold">{isFa ? 'درخواست مؤدبانه: Aș dori + کالا' : 'Polite request: Aș dori + item'}</h3><p>{isFa ? 'Aș dori یعنی «مایلم/می‌خواهم» و از فعل a dori می‌آید. این شکل شرطی برای درخواست مؤدبانه است؛ برخلاف درخواست مستقیم، آهنگ نرم‌تری دارد. پس از آن نام نوشیدنی را بیاورید و در پایان vă rog («لطفاً») بگویید. ترتیب: درخواست + نام نوشیدنی + لطفاً.' : 'Aș dori means “I would like” and comes from a dori. This conditional form makes a polite request. Put the drink after it and add vă rog (“please”) at the end: request + drink + please.'}</p>{phrase(examples[0])}</article>
      <article className="space-y-3 rounded-xl bg-emerald-50 p-4"><h3 className="font-bold">{isFa ? 'یک قهوه و یک چای: o / un' : 'A coffee and a tea: o / un'}</h3><p>{isFa ? 'cafea اسم مؤنث است و با o می‌آید: o cafea. ceai اسم خنثی است و در مفرد مانند اسم مذکر با un می‌آید: un ceai. برای این دو نوشیدنی o و un را جابه‌جا نکنید.' : 'Cafea is feminine, so use o cafea. Ceai is neuter and takes un in the singular: un ceai. Keep the article with its noun.'}</p>{phrase(examples[1])}</article>
      <article className="space-y-3 rounded-xl bg-amber-50 p-4"><h3 className="font-bold">{isFa ? 'مشخص کردن سفارش: fără + اسم' : 'Specify your order: fără + noun'}</h3><p>{isFa ? 'fără یعنی «بدون» و پیش از چیزی می‌آید که نمی‌خواهید. fără zahăr یعنی «بدون شکر». این عبارت پس از نام نوشیدنی قرار می‌گیرد: o cafea fără zahăr.' : 'Fără means “without” and comes before the thing you do not want. Fără zahăr means “without sugar”. Put it after the drink: o cafea fără zahăr.'}</p>{phrase(examples[2])}</article>
      <article className="space-y-3 rounded-xl bg-violet-50 p-4"><h3 className="font-bold">{isFa ? 'فهمیدن پاسخ و درخواست صورتحساب' : 'Understand the reply and ask for the bill'}</h3><p>{isFa ? 'Ce doriți? یعنی «چه میل دارید؟». doriți صورت مؤدبانهٔ خطاب به شماست. Altceva? یعنی «چیز دیگری؟». اگر چیزی نمی‌خواهید، Nu, mulțumesc. بگویید. برای صورتحساب، Nota, vă rog. یک درخواست کوتاه و رایج است؛ nota شکل معین «صورتحساب» است.' : 'Ce doriți? means “What would you like?” Doriți addresses you politely. Altceva? means “Anything else?” Answer Nu, mulțumesc. if you need nothing more. Nota, vă rog. is a short request for the bill; nota is the definite form.'}</p>{phrase(examples[3])}</article>
      <div>{action(isFa ? 'یادآوری از حافظه' : 'Recall from memory', () => move(2))}</div></section>}
    {(stage === 2 || stage === 3) && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><p className="text-sm font-bold text-[#1554bd]">{stage === 2 ? isFa ? '۳. یادآوری' : '3. Recall' : isFa ? `۴. سفارش، نوبت ${round + 1} از ۳` : `4. Order, round ${round + 1} of 3`}</p><h2 className="text-xl font-bold">{isFa ? task.fa : task.en}</h2><p className="text-sm text-slate-600">{isFa ? 'به رومانیایی بنویسید و سپس جمله را بلند بگویید.' : 'Write it in Romanian, then say it aloud.'}</p><form onSubmit={event => { event.preventDefault(); setFeedback(normalize(answer) === normalize(task.ro) ? 'correct' : 'retry'); }} className="space-y-3"><label htmlFor="cafe-answer" className="block font-semibold">{isFa ? 'پاسخ رومانیایی' : 'Romanian answer'}</label><input id="cafe-answer" lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} className="w-full rounded-xl border border-slate-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1554bd]"/><div className="flex flex-wrap gap-3"><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button><button type="button" onClick={() => setHint(true)} className="rounded-xl border px-5 py-3 font-semibold text-[#1554bd]">{isFa ? 'راهنما' : 'Hint'}</button></div></form>{hint && <p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-3">{task.hint}</p>}{feedback && <p role="status" className={`rounded-xl p-3 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{feedback === 'correct' ? isFa ? 'درست است. حالا آن را بلند بگویید.' : 'Correct. Now say it aloud.' : isFa ? 'دوباره تلاش کنید؛ به o و un و ترتیب جمله دقت کنید.' : 'Try again; check o, un, and word order.'}</p>}{feedback === 'correct' && action(stage === 2 ? isFa ? 'شروع سفارش' : 'Start ordering' : round === 2 ? isFa ? 'نتیجه' : 'Result' : isFa ? 'مورد بعد' : 'Next item', next)}</section>}
    {stage === 4 && <section className="space-y-4 rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold">{complete ? isFa ? 'سفارش ساده را انجام دادید' : 'You completed a simple order' : isFa ? 'تمرین هنوز کامل نشده است' : 'Practice is not complete yet'}</h2><p>{isFa ? 'می‌توانید نوشیدنی بخواهید، شکر را حذف کنید و صورتحساب درخواست کنید.' : 'You can ask for a drink, leave out sugar, and request the bill.'}</p>{action(complete ? isFa ? 'تمرین دوباره' : 'Practise again' : isFa ? 'ادامهٔ تمرین' : 'Continue practice', () => move(complete ? 0 : 3))}<Link href="/learn-romanian/lectie" className="ms-3 inline-block text-[#1554bd] underline">{isFa ? 'موضوع‌های روزمره' : 'Everyday topics'}</Link></section>}
    {audioError && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{isFa ? 'فایل صدا در دسترس نیست.' : 'Audio recording is unavailable.'}</p>}
    <p className="text-xs text-slate-500">{isFa ? 'تمرین نوشتاری کیفیت تلفظ را نمره نمی‌دهد.' : 'The writing exercise does not score pronunciation quality.'}</p>
  </div>;
}
