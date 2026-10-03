'use client';

import React from 'react';
import { LessonStageNav } from './LessonStageNav';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { playVerifiedAudio, stopVerifiedAudio } from '@/lib/romanian/playVerifiedAudio';

type Locale = 'fa' | 'en';
type Phrase = { ro: string; en: string; fa: string };
const dialogue: (Phrase & { who: 'you' | 'pharmacist' })[] = [
  { who: 'you', ro: 'Bună ziua!', en: 'Hello!', fa: 'سلام!' },
  { who: 'you', ro: 'Aveți acest medicament?', en: 'Do you have this medicine?', fa: 'این دارو را دارید؟' },
  { who: 'pharmacist', ro: 'Da, avem acest medicament. Aveți rețetă?', en: 'Yes, we have this medicine. Do you have a prescription?', fa: 'بله، این دارو را داریم. نسخه دارید؟' },
  { who: 'you', ro: 'Da, am rețetă.', en: 'Yes, I have a prescription.', fa: 'بله، نسخه دارم.' },
  { who: 'you', ro: 'Cum se administrează?', en: 'How is it taken?', fa: 'چگونه مصرف می‌شود؟' },
  { who: 'pharmacist', ro: 'Vă explic imediat.', en: 'I will explain right away.', fa: 'همین حالا برایتان توضیح می‌دهم.' },
  { who: 'you', ro: 'Mulțumesc!', en: 'Thank you!', fa: 'متشکرم!' },
];
const examples: Phrase[] = [
  { ro: 'Aveți acest medicament?', en: 'Do you have this medicine?', fa: 'این دارو را دارید؟' },
  { ro: 'Aveți rețetă?', en: 'Do you have a prescription?', fa: 'نسخه دارید؟' },
  { ro: 'Da, am rețetă.', en: 'Yes, I have a prescription.', fa: 'بله، نسخه دارم.' },
  { ro: 'Nu am rețetă.', en: 'I do not have a prescription.', fa: 'نسخه ندارم.' },
  { ro: 'Cum se administrează?', en: 'How is it taken?', fa: 'چگونه مصرف می‌شود؟' },
];
const tasks = [
  { ...examples[0], hint: 'Aveți acest …?' },
  { ...examples[3], hint: 'Nu am … .' },
  { ...examples[4], hint: 'Cum se …?' },
];
const labels = { fa: ['مکالمه', 'قاعده‌ها', 'یادآوری', 'داروخانه', 'نتیجه'], en: ['Conversation', 'Rules', 'Recall', 'Pharmacy', 'Result'] };
const normalize = (s: string) => s.normalize('NFC').toLocaleLowerCase('ro-RO').trim().replace(/[.!?،,]+$/g, '').replace(/\s+/g, ' ');

export function PharmacyLesson({ lang }: { lang: Locale }) {
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
    try { localStorage.setItem('dorvia:romanian:pharmacy:v1', new Date().toISOString()); } catch { /* optional */ }
    setComplete(true); move(4);
  }
  const action = (label: string, onClick: () => void) => <button type="button" onClick={onClick} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{label}</button>;
  const phrase = ({ ro, en, fa }: Phrase) => <div key={ro} className="rounded-xl bg-white/80 p-3"><p lang="ro" dir="ltr" className="text-lg font-bold">{ro}</p><p lang="en" dir="ltr" className="text-sm text-slate-700">{en}</p>{isFa && <p className="text-sm">{fa}</p>}<button type="button" onClick={() => play(ro)} className="mt-2 text-sm font-semibold text-[#1554bd] underline">{isFa ? 'شنیدن' : 'Listen'}</button></div>;
  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10"><p className="text-sm font-semibold text-blue-100">{isFa ? 'کارهای ضروری · درس ۲ · حدود ۱۵ دقیقه' : 'Essential services · lesson 2 · about 15 minutes'}</p><h1 className="mt-2 text-3xl font-extrabold">{isFa ? 'گفت‌وگو در داروخانه' : 'At the pharmacy'}</h1><p className="mt-3 text-blue-50">{isFa ? 'موجودی یک دارو را بپرسید، دربارهٔ نسخه پاسخ دهید و درخواست توضیح کنید.' : 'Ask whether a medicine is available, answer about a prescription, and request an explanation.'}</p></header>
    <LessonStageNav lang={lang} labels={labels[lang]} stage={stage} onSelect={move} />
    {stage === 0 && <section className="space-y-4 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۱. گفت‌وگو را بشنوید' : '1. Listen to the conversation'}</h2><p>{isFa ? 'در داروخانه دربارهٔ دارویی که نامش را نشان می‌دهید سؤال می‌کنید. هر جمله را بشنوید و بلند تکرار کنید.' : 'At a pharmacy, you ask about a medicine whose name you show. Listen and repeat each line.'}</p>{dialogue.map((line, i) => <div key={i} className={`rounded-xl p-4 ${line.who === 'you' ? 'bg-blue-50' : 'bg-slate-50'}`}><p className="text-xs font-bold text-[#1554bd]">{line.who === 'you' ? isFa ? 'شما' : 'You' : isFa ? 'داروساز' : 'Pharmacist'}</p><p lang="ro" dir="ltr" className="text-xl font-bold">{line.ro}</p><p lang="en" dir="ltr" className="text-sm text-slate-700">{line.en}</p>{isFa && translation && <p className="text-sm">{line.fa}</p>}<button type="button" onClick={() => play(line.ro)} className="mt-2 text-sm font-semibold text-[#1554bd] underline">{isFa ? 'شنیدن جمله' : 'Hear the line'}</button></div>)}{isFa && <button type="button" onClick={() => setTranslation(!translation)} className="text-sm text-[#1554bd] underline">{translation ? 'پنهان کردن فارسی' : 'نمایش فارسی'}</button>}<div>{action(isFa ? 'واژه‌ها و قاعده‌ها' : 'Words and rules', () => move(1))}</div></section>}
    {stage === 1 && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۲. قاعده‌ها و کاربرد' : '2. Rules and usage'}</h2>
      <article className="space-y-3 rounded-xl bg-sky-50 p-4"><h3 className="font-bold">{isFa ? 'پرسیدن موجودی: Aveți + اسم؟' : 'Ask availability: Aveți + noun?'}</h3><p>{isFa ? 'Aveți صورت مؤدبانهٔ «شما دارید؟» از فعل a avea است؛ برای خطاب به یک غریبه و همچنین چند نفر کاربرد دارد. acest medicament یعنی «این دارو»: medicament اسم مفرد خنثی است و acest پیش از آن می‌آید. با نشان دادن نام دارو می‌توانید بپرسید: Aveți acest medicament?' : 'Aveți is the polite “do you have?” form of a avea; it also addresses more than one person. Medicament is a singular neuter noun, and acest before it means “this”. Show the medicine name and ask Aveți acest medicament?'}</p>{phrase(examples[0])}</article>
      <article className="space-y-3 rounded-xl bg-emerald-50 p-4"><h3 className="font-bold">{isFa ? 'نسخه دارید؟ پاسخ مثبت و منفی' : 'Prescription: yes and no'}</h3><p>{isFa ? 'rețetă یعنی «نسخه». در سؤال کوتاه Aveți rețetă? اسم بدون حرف تعریف می‌آید. برای «من دارم» am و برای «ندارم» nu am بگویید: Da, am rețetă. یا Nu am rețetă. داشتن نسخه را فقط مطابق وضعیت واقعی خودتان پاسخ دهید.' : 'Rețetă means “prescription”. In the short question Aveți rețetă? it appears without an article. For “I have” use am; for “I do not have” use nu am: Da, am rețetă. or Nu am rețetă. Answer according to your actual situation.'}</p>{phrase(examples[1])}{phrase(examples[2])}{phrase(examples[3])}</article>
      <article className="space-y-3 rounded-xl bg-amber-50 p-4"><h3 className="font-bold">{isFa ? 'درخواست توضیح دربارهٔ روش مصرف' : 'Ask for an explanation of use'}</h3><p>{isFa ? 'Cum یعنی «چگونه». se administrează از فعل a administra با ساختار بازتابی است؛ در این سؤال معنی «چگونه مصرف/استفاده می‌شود؟» دارد و به داروی مورد اشاره برمی‌گردد. این پرسش برای گرفتن توضیح مستقیم از داروساز است؛ خود درس مقدار یا روش مصرف تعیین نمی‌کند.' : 'Cum means “how”. Se administrează is a reflexive construction from a administra; here it asks “How is it taken?” and refers to the medicine being discussed. Use it to ask the pharmacist directly; this lesson does not give dosing instructions.'}</p>{phrase(examples[4])}</article>
      <article className="space-y-3 rounded-xl bg-violet-50 p-4"><h3 className="font-bold">{isFa ? 'فهمیدن پاسخ داروساز' : 'Understand the pharmacist’s reply'}</h3><p>{isFa ? 'در Da, avem acest medicament، avem یعنی «ما داریم» و از a avea است. Vă explic imediat. یعنی «همین حالا برایتان توضیح می‌دهم»؛ vă خطاب مؤدبانه به شما، explic صورت «من توضیح می‌دهم» و imediat یعنی «فوراً/همین حالا» است. برای هر داروی واقعی، توضیح مخصوص همان دارو را از داروساز بگیرید.' : 'In Da, avem acest medicament, avem means “we have” from a avea. Vă explic imediat. means “I will explain right away”: vă politely addresses you, explic means “I explain”, and imediat means “right away”. Ask the pharmacist about the specific medicine.'}</p>{phrase({ ro: 'Vă explic imediat.', en: 'I will explain right away.', fa: 'همین حالا برایتان توضیح می‌دهم.' })}</article>
      <div>{action(isFa ? 'یادآوری از حافظه' : 'Recall from memory', () => move(2))}</div></section>}
    {(stage === 2 || stage === 3) && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><p className="text-sm font-bold text-[#1554bd]">{stage === 2 ? isFa ? '۳. یادآوری' : '3. Recall' : isFa ? `۴. داروخانه، نوبت ${round + 1} از ۳` : `4. Pharmacy, round ${round + 1} of 3`}</p><h2 className="text-xl font-bold">{isFa ? task.fa : task.en}</h2><p className="text-sm text-slate-600">{isFa ? 'به رومانیایی بنویسید و سپس بلند بگویید.' : 'Write in Romanian, then say it aloud.'}</p><form onSubmit={event => { event.preventDefault(); setFeedback(normalize(answer) === normalize(task.ro) ? 'correct' : 'retry'); }} className="space-y-3"><label htmlFor="pharmacy-answer" className="block font-semibold">{isFa ? 'پاسخ رومانیایی' : 'Romanian answer'}</label><input id="pharmacy-answer" lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} className="w-full rounded-xl border border-slate-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1554bd]"/><div className="flex flex-wrap gap-3"><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button><button type="button" onClick={() => setHint(true)} className="rounded-xl border px-5 py-3 font-semibold text-[#1554bd]">{isFa ? 'راهنما' : 'Hint'}</button></div></form>{hint && <p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-3">{task.hint}</p>}{feedback && <p role="status" className={`rounded-xl p-3 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{feedback === 'correct' ? isFa ? 'درست است. حالا بلند بگویید.' : 'Correct. Now say it aloud.' : isFa ? 'دوباره تلاش کنید؛ به شکل فعل و ترتیب جمله دقت کنید.' : 'Try again; check the verb and word order.'}</p>}{feedback === 'correct' && action(stage === 2 ? isFa ? 'شروع گفت‌وگو' : 'Start conversation' : round === 2 ? isFa ? 'نتیجه' : 'Result' : isFa ? 'مورد بعد' : 'Next item', next)}</section>}
    {stage === 4 && <section className="space-y-4 rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold">{complete ? isFa ? 'گفت‌وگوی سادهٔ داروخانه را تمرین کردید' : 'You practised a simple pharmacy conversation' : isFa ? 'تمرین هنوز کامل نشده است' : 'Practice is not complete yet'}</h2><p>{isFa ? 'می‌توانید دربارهٔ موجودی بپرسید، دربارهٔ نسخه پاسخ دهید و از داروساز توضیح بخواهید.' : 'You can ask about availability, answer about a prescription, and request an explanation from the pharmacist.'}</p>{action(complete ? isFa ? 'تمرین دوباره' : 'Practise again' : isFa ? 'ادامهٔ تمرین' : 'Continue practice', () => move(complete ? 0 : 3))}<Link href="/learn-romanian/lectie" className="ms-3 inline-block text-[#1554bd] underline">{isFa ? 'موضوع‌های روزمره' : 'Everyday topics'}</Link></section>}
    {audioError && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{isFa ? 'فایل صدا در دسترس نیست.' : 'Audio recording is unavailable.'}</p>}
    <p className="text-xs text-slate-500">{isFa ? 'این تمرین نوشتار را بررسی می‌کند و کیفیت تلفظ را نمره نمی‌دهد.' : 'This exercise checks writing, not pronunciation quality.'}</p>
  </div>;
}
