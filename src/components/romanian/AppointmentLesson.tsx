'use client';

import React from 'react';
import { LessonStageNav } from './LessonStageNav';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { playVerifiedAudio, stopVerifiedAudio } from '@/lib/romanian/playVerifiedAudio';

type Locale = 'fa' | 'en';
type Phrase = { ro: string; en: string; fa: string };
const dialogue: (Phrase & { who: 'you' | 'desk' })[] = [
  { who: 'you', ro: 'Bună ziua!', en: 'Hello!', fa: 'سلام!' },
  { who: 'you', ro: 'Aș dori o programare la medic, vă rog.', en: 'I would like a doctor’s appointment, please.', fa: 'یک وقت ملاقات با پزشک می‌خواهم، لطفاً.' },
  { who: 'desk', ro: 'Pentru ce zi?', en: 'For which day?', fa: 'برای چه روزی؟' },
  { who: 'you', ro: 'Pentru luni, vă rog.', en: 'For Monday, please.', fa: 'برای دوشنبه، لطفاً.' },
  { who: 'desk', ro: 'La ce oră?', en: 'At what time?', fa: 'چه ساعتی؟' },
  { who: 'you', ro: 'La ora zece, vă rog.', en: 'At ten o’clock, please.', fa: 'ساعت ده، لطفاً.' },
  { who: 'desk', ro: 'Da, avem un loc liber.', en: 'Yes, we have an available slot.', fa: 'بله، یک وقت خالی داریم.' },
  { who: 'desk', ro: 'Confirmăm pentru luni la ora zece?', en: 'Shall we confirm Monday at ten?', fa: 'برای دوشنبه ساعت ده تأیید کنیم؟' },
  { who: 'you', ro: 'Da, confirm pentru luni la ora zece.', en: 'Yes, I confirm Monday at ten.', fa: 'بله، دوشنبه ساعت ده را تأیید می‌کنم.' },
  { who: 'you', ro: 'Mulțumesc!', en: 'Thank you!', fa: 'متشکرم!' },
];
const examples: Phrase[] = [
  { ro: 'Aș dori o programare la medic, vă rog.', en: 'I would like a doctor’s appointment, please.', fa: 'یک وقت ملاقات با پزشک می‌خواهم، لطفاً.' },
  { ro: 'Pentru luni, vă rog.', en: 'For Monday, please.', fa: 'برای دوشنبه، لطفاً.' },
  { ro: 'Pentru marți, vă rog.', en: 'For Tuesday, please.', fa: 'برای سه‌شنبه، لطفاً.' },
  { ro: 'La ora zece, vă rog.', en: 'At ten o’clock, please.', fa: 'ساعت ده، لطفاً.' },
  { ro: 'La ora nouă, vă rog.', en: 'At nine o’clock, please.', fa: 'ساعت نه، لطفاً.' },
];
const tasks = [
  { ...examples[0], hint: 'Aș dori o programare la …, vă rog.' },
  { ...examples[2], hint: 'Pentru …, vă rog.' },
  { ...examples[4], hint: 'La ora …, vă rog.' },
];
const labels = { fa: ['مکالمه', 'قاعده‌ها', 'یادآوری', 'گرفتن وقت', 'نتیجه'], en: ['Conversation', 'Rules', 'Recall', 'Book a time', 'Result'] };
const normalize = (s: string) => s.normalize('NFC').toLocaleLowerCase('ro-RO').trim().replace(/[.!?،,]+$/g, '').replace(/\s+/g, ' ');

export function AppointmentLesson({ lang }: { lang: Locale }) {
  const isFa = lang === 'fa';
  const [stage, setStage] = React.useState(0);
  const [round, setRound] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'retry' | null>(null);
  const [hint, setHint] = React.useState(false);
  const [translation, setTranslation] = React.useState(true);
  const [complete, setComplete] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  React.useEffect(() => () => stopVerifiedAudio(), []);
  const task = stage === 2 ? tasks[0] : tasks[round];
  function move(to: number) { stopVerifiedAudio(); setStage(to); setRound(0); setAnswer(''); setFeedback(null); setHint(false); setAudioError(false); }
  function play(ro: string) { setAudioError(false); playVerifiedAudio(ro, () => setAudioError(true)); }
  function next() {
    if (stage === 2) { move(3); return; }
    if (round < tasks.length - 1) { setRound(round + 1); setAnswer(''); setFeedback(null); setHint(false); return; }
    try { localStorage.setItem('dorvia:romanian:appointment:v1', new Date().toISOString()); } catch { /* optional */ }
    setComplete(true); move(4);
  }
  const action = (label: string, onClick: () => void) => <button type="button" onClick={onClick} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{label}</button>;
  const phrase = ({ ro, en, fa }: Phrase) => <div key={ro} className="rounded-xl bg-white/80 p-3"><p lang="ro" dir="ltr" className="text-lg font-bold">{ro}</p><p lang="en" dir="ltr" className="text-sm text-slate-700">{en}</p>{isFa && <p className="text-sm">{fa}</p>}<button type="button" onClick={() => play(ro)} className="mt-2 text-sm font-semibold text-[#1554bd] underline">{isFa ? 'شنیدن' : 'Listen'}</button></div>;
  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10"><p className="text-sm font-semibold text-blue-100">{isFa ? 'کارهای ضروری · درس ۱ · حدود ۱۵ دقیقه' : 'Essential services · lesson 1 · about 15 minutes'}</p><h1 className="mt-2 text-3xl font-extrabold">{isFa ? 'گرفتن وقت ملاقات' : 'Booking an appointment'}</h1><p className="mt-3 text-blue-50">{isFa ? 'برای مراجعه به پزشک روز و ساعت دلخواهتان را بپرسید و پاسخ را بفهمید.' : 'Ask for a doctor’s appointment, choose a day and time, and understand the reply.'}</p></header>
    <LessonStageNav lang={lang} labels={labels[lang]} stage={stage} onSelect={move} />
    {stage === 0 && <section className="space-y-4 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۱. گفت‌وگو را بشنوید' : '1. Listen to the conversation'}</h2><p>{isFa ? 'در پذیرش درمانگاه وقت می‌خواهید. هر جمله را بشنوید و بلند تکرار کنید. روز و ساعت این گفت‌وگو فقط نمونهٔ آموزشی است.' : 'You ask for an appointment at a clinic desk. Listen and repeat each line. The day and time are only examples.'}</p>{dialogue.map((line, i) => <div key={i} className={`rounded-xl p-4 ${line.who === 'you' ? 'bg-blue-50' : 'bg-slate-50'}`}><p className="text-xs font-bold text-[#1554bd]">{line.who === 'you' ? isFa ? 'شما' : 'You' : isFa ? 'پذیرش' : 'Receptionist'}</p><p lang="ro" dir="ltr" className="text-xl font-bold">{line.ro}</p><p lang="en" dir="ltr" className="text-sm text-slate-700">{line.en}</p>{isFa && translation && <p className="text-sm">{line.fa}</p>}<button type="button" onClick={() => play(line.ro)} className="mt-2 text-sm font-semibold text-[#1554bd] underline">{isFa ? 'شنیدن جمله' : 'Hear the line'}</button></div>)}{isFa && <button type="button" onClick={() => setTranslation(!translation)} className="text-sm text-[#1554bd] underline">{translation ? 'پنهان کردن فارسی' : 'نمایش فارسی'}</button>}<div>{action(isFa ? 'واژه‌ها و قاعده‌ها' : 'Words and rules', () => move(1))}</div></section>}
    {stage === 1 && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۲. قاعده‌ها و کاربرد' : '2. Rules and usage'}</h2>
      <article className="space-y-3 rounded-xl bg-sky-50 p-4"><h3 className="font-bold">{isFa ? 'درخواست مؤدبانهٔ وقت' : 'Politely ask for an appointment'}</h3><p>{isFa ? 'Aș dori یعنی «مایلم/می‌خواهم»؛ شکل شرطی فعل a dori برای درخواست مؤدبانه است. o programare یعنی «یک قرار یا وقت ملاقات»؛ programare مؤنث است، پس o می‌گیرد. la medic یعنی «نزد پزشک/برای مراجعه به پزشک». ترتیب جمله: Aș dori + o programare + la medic + vă rog.' : 'Aș dori (“I would like”) is a polite conditional form of a dori. Programare is feminine, so say o programare (“an appointment”). La medic specifies a doctor. The order is Aș dori + o programare + la medic + vă rog.'}</p>{phrase(examples[0])}</article>
      <article className="space-y-3 rounded-xl bg-emerald-50 p-4"><h3 className="font-bold">{isFa ? 'روز: Pentru ce zi? → Pentru luni.' : 'Day: Pentru ce zi? → Pentru luni.'}</h3><p>{isFa ? 'pentru یعنی «برای»؛ ce zi یعنی «چه روزی». در پاسخ کوتاه همان برای را تکرار کنید: Pentru luni, vă rog. نام روزهای هفته در رومانیایی با حرف کوچک نوشته می‌شوند: luni دوشنبه، marți سه‌شنبه.' : 'Pentru means “for”; ce zi means “which day”. Repeat pentru in the short answer: Pentru luni, vă rog. Weekdays use lower-case letters in Romanian: luni is Monday; marți is Tuesday.'}</p>{phrase(examples[1])}{phrase(examples[2])}</article>
      <article className="space-y-3 rounded-xl bg-amber-50 p-4"><h3 className="font-bold">{isFa ? 'ساعت: La ce oră? → La ora zece.' : 'Time: La ce oră? → La ora zece.'}</h3><p>{isFa ? 'La ce oră? یعنی «در چه ساعتی؟». در پاسخ، la ora + عدد را به کار ببرید: La ora zece. در پرسش oră بدون حرف تعریف است و در پاسخ ora شکل معین آن است. zece ده و nouă نه است.' : 'La ce oră? asks “At what time?” Answer with la ora + number: La ora zece. The question uses oră without the definite article; the answer uses ora. Zece is ten and nouă is nine.'}</p>{phrase(examples[3])}{phrase(examples[4])}</article>
      <article className="space-y-3 rounded-xl bg-violet-50 p-4"><h3 className="font-bold">{isFa ? 'فهمیدن پاسخ پذیرش' : 'Understand the receptionist’s reply'}</h3><p>{isFa ? 'Da, avem un loc liber. یعنی «بله، یک وقت خالی داریم». avem صورت اول‌شخص جمع فعل a avea («داشتن») و un loc liber یعنی «یک جای خالی» است. برای قرار واقعی، روز و ساعت نهایی را با پذیرش تأیید کنید.' : 'Da, avem un loc liber. means “Yes, we have an available slot.” Avem is the first-person plural of a avea (“to have”); un loc liber is “an available slot.” Confirm the actual day and time with the receptionist.'}</p>{phrase({ ro: 'Da, avem un loc liber.', en: 'Yes, we have an available slot.', fa: 'بله، یک وقت خالی داریم.' })}</article>
      <article className="space-y-3 rounded-xl bg-slate-50 p-4"><h3 className="font-bold">{isFa ? 'تأیید نهایی روز و ساعت' : 'Confirm the day and time'}</h3><p>{isFa ? 'Confirmăm? یعنی «تأیید کنیم؟» و confirm یعنی «تأیید می‌کنم». برای جلوگیری از اشتباه، روز و ساعت را در پاسخ خود به‌طور کامل تکرار کنید.' : 'Confirmăm? asks “Shall we confirm?” Confirm means “I confirm”. Repeat the full day and hour in your reply to avoid a mix-up.'}</p>{phrase({ ro: 'Da, confirm pentru luni la ora zece.', en: 'Yes, I confirm Monday at ten.', fa: 'بله، دوشنبه ساعت ده را تأیید می‌کنم.' })}</article>
      <div>{action(isFa ? 'یادآوری از حافظه' : 'Recall from memory', () => move(2))}</div></section>}
    {(stage === 2 || stage === 3) && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><p className="text-sm font-bold text-[#1554bd]">{stage === 2 ? isFa ? '۳. یادآوری' : '3. Recall' : isFa ? `۴. گرفتن وقت، نوبت ${round + 1} از ۳` : `4. Booking, round ${round + 1} of 3`}</p><h2 className="text-xl font-bold">{isFa ? task.fa : task.en}</h2><p className="text-sm text-slate-600">{isFa ? 'به رومانیایی بنویسید و سپس بلند بگویید.' : 'Write in Romanian, then say it aloud.'}</p><form onSubmit={event => { event.preventDefault(); setFeedback(normalize(answer) === normalize(task.ro) ? 'correct' : 'retry'); }} className="space-y-3"><label htmlFor="appointment-answer" className="block font-semibold">{isFa ? 'پاسخ رومانیایی' : 'Romanian answer'}</label><input id="appointment-answer" lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} className="w-full rounded-xl border border-slate-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1554bd]"/><div className="flex flex-wrap gap-3"><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button><button type="button" onClick={() => setHint(true)} className="rounded-xl border px-5 py-3 font-semibold text-[#1554bd]">{isFa ? 'راهنما' : 'Hint'}</button></div></form>{hint && <p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-3">{task.hint}</p>}{feedback && <p role="status" className={`rounded-xl p-3 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{feedback === 'correct' ? isFa ? 'درست است. حالا بلند بگویید.' : 'Correct. Now say it aloud.' : isFa ? 'دوباره تلاش کنید؛ به pentru و la ora دقت کنید.' : 'Try again; check pentru and la ora.'}</p>}{feedback === 'correct' && action(stage === 2 ? isFa ? 'شروع گرفتن وقت' : 'Start booking' : round === 2 ? isFa ? 'نتیجه' : 'Result' : isFa ? 'مورد بعد' : 'Next item', next)}</section>}
    {stage === 4 && <section className="space-y-4 rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold">{complete ? isFa ? 'می‌توانید وقت ملاقات بخواهید' : 'You can request an appointment' : isFa ? 'تمرین هنوز کامل نشده است' : 'Practice is not complete yet'}</h2><p>{isFa ? 'درخواست مؤدبانه، انتخاب روز و اعلام ساعت را تمرین کردید.' : 'You practised a polite request, choosing a day, and stating a time.'}</p>{action(complete ? isFa ? 'تمرین دوباره' : 'Practise again' : isFa ? 'ادامهٔ تمرین' : 'Continue practice', () => move(complete ? 0 : 3))}<Link href="/learn-romanian/lectie" className="ms-3 inline-block text-[#1554bd] underline">{isFa ? 'موضوع‌های روزمره' : 'Everyday topics'}</Link></section>}
    {audioError && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{isFa ? 'فایل صدا در دسترس نیست.' : 'Audio recording is unavailable.'}</p>}
    <p className="text-xs text-slate-500">{isFa ? 'این تمرین نوشتار را بررسی می‌کند و کیفیت تلفظ را نمره نمی‌دهد.' : 'This exercise checks writing, not pronunciation quality.'}</p>
  </div>;
}

