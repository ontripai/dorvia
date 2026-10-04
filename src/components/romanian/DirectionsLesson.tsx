'use client';

import React from 'react';
import { ListeningPractice } from './ListeningPractice';
import { LessonStageNav } from './LessonStageNav';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { playVerifiedAudio, stopVerifiedAudio } from '@/lib/romanian/playVerifiedAudio';

type Locale = 'fa' | 'en';
type SpeechResult = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type Recognition = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((e: SpeechResult) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null; start(): void; stop(): void; abort(): void };
type RecognitionWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
const stages = { fa: ['مکالمه', 'قاعده‌ها', 'یادآوری', 'راه‌یابی', 'نتیجه'], en: ['Conversation', 'Rules', 'Recall', 'Find the way', 'Result'] };
const dialogue = [
  { who: 'you', ro: 'Bună ziua!', en: 'Hello!', fa: 'سلام!', recorded: true },
  { who: 'you', ro: 'Unde este stația de metrou?', en: 'Where is the metro station?', fa: 'ایستگاه مترو کجاست؟', recorded: true },
  { who: 'local', ro: 'Mergeți înainte. Stația este pe dreapta.', en: 'Go straight ahead. The station is on the right.', fa: 'مستقیم بروید. ایستگاه سمت راست است.', recorded: true },
  { who: 'you', ro: 'Este departe?', en: 'Is it far?', fa: 'دور است؟', recorded: true },
  { who: 'local', ro: 'Nu, este aproape.', en: 'No, it is nearby.', fa: 'نه، نزدیک است.', recorded: true },
  { who: 'you', ro: 'Mulțumesc!', en: 'Thank you!', fa: 'متشکرم!', recorded: true },
] as const;
const tasks = [
  { target: 'Unde este stația de metrou?', fa: 'آدرس ایستگاه مترو را بپرسید.', en: 'Ask where the metro station is.', hint: 'Unde este stația de …?' },
  { target: 'Unde este o farmacie?', fa: 'نشانی یک داروخانه را بپرسید.', en: 'Ask where a pharmacy is.', hint: 'Unde este o …?' },
  { target: 'Este departe?', fa: 'بپرسید آیا دور است.', en: 'Ask if it is far.', hint: 'Este …?' },
] as const;
const normalize = (s: string) => s.normalize('NFC').toLocaleLowerCase('ro-RO').trim().replace(/[.!?،,]+$/g, '').replace(/\s+/g, ' ');

export function DirectionsLesson({ lang }: { lang: Locale }) {
  const isFa = lang === 'fa';
  const [stage, setStage] = React.useState(0);
  const [round, setRound] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'retry' | null>(null);
  const [hint, setHint] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  const [voiceAvailable, setVoiceAvailable] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [voiceError, setVoiceError] = React.useState('');
  const recognition = React.useRef<Recognition | null>(null);
  React.useEffect(() => {
    const browser = window as RecognitionWindow;
    setVoiceAvailable(Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition));
    return () => { recognition.current?.abort(); stopVerifiedAudio(); };
  }, []);
  const task = stage === 2 ? tasks[0] : tasks[round];
  function move(next: number) { recognition.current?.abort(); recognition.current = null; stopVerifiedAudio(); setListening(false); setVoiceError(''); setStage(next); setRound(0); setAnswer(''); setFeedback(null); setHint(false); setAudioError(false); }
  function play(ro: string) { setAudioError(false); playVerifiedAudio(ro, () => setAudioError(true)); }
  function check(value = answer) { if (!value.trim()) return; setFeedback(normalize(value) === normalize(task.target) ? 'correct' : 'retry'); }
  function speak() {
    if (listening) { recognition.current?.stop(); return; }
    const browser = window as RecognitionWindow;
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Constructor) return;
    const instance = new Constructor(); recognition.current = instance;
    instance.lang = 'ro-RO'; instance.continuous = false; instance.interimResults = false;
    instance.onresult = event => { const spoken = event.results[0]?.[0]?.transcript?.trim(); if (spoken) { setAnswer(spoken); check(spoken); } };
    instance.onerror = () => setVoiceError(isFa ? 'تشخیص صدا انجام نشد؛ پاسخ را تایپ کنید.' : 'Speech recognition failed; type your answer.');
    instance.onend = () => { recognition.current = null; setListening(false); };
    try { instance.start(); setListening(true); setVoiceError(''); setFeedback(null); }
    catch { recognition.current = null; setVoiceError(isFa ? 'میکروفون آغاز نشد؛ پاسخ را تایپ کنید.' : 'Microphone could not start; type your answer.'); }
  }
  function next() {
    if (stage === 2) { move(3); return; }
    if (round < tasks.length - 1) { setRound(round + 1); setAnswer(''); setFeedback(null); setHint(false); return; }
    try { localStorage.setItem('dorvia:romanian:directions:v1', new Date().toISOString()); } catch { /* optional */ }
    setComplete(true); move(4);
  }
  const action = (label: string, onClick: () => void) => <button type="button" onClick={onClick} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{label}</button>;
  const example = (ro: string, en: string, fa: string, recorded = false) => <div key={ro} className="rounded-xl bg-white/80 p-3"><p lang="ro" dir="ltr" className="text-lg font-bold">{ro}</p><p lang="en" dir="ltr" className="text-sm text-slate-700">{en}</p>{isFa && <p className="text-sm">{fa}</p>}{recorded && <button type="button" onClick={() => play(ro)} className="mt-2 text-sm font-semibold text-[#1554bd] underline">{isFa ? 'شنیدن' : 'Listen'}</button>}</div>;
  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10"><p className="text-sm font-semibold text-blue-100">{isFa ? 'راه‌یابی در شهر · درس ۱ · حدود ۱۵ دقیقه' : 'Finding your way · lesson 1 · about 15 minutes'}</p><h1 className="mt-2 text-3xl font-extrabold">{isFa ? 'ایستگاه مترو کجاست؟' : 'Where is the metro station?'}</h1><p className="mt-3 text-blue-50">{isFa ? 'نشانی بپرسید و «مستقیم»، «راست» و «نزدیک» را در پاسخ تشخیص دهید.' : 'Ask for directions and understand “straight ahead”, “right” and “nearby”.'}</p></header>
    <LessonStageNav lang={lang} labels={stages[lang]} stage={stage} onSelect={move} />
    {stage === 0 && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۱. مکالمه در خیابان' : '1. Conversation in the street'}</h2><p>{isFa ? 'می‌خواهید ایستگاه مترو را پیدا کنید. هر جمله را بشنوید و سپس یک بار با صدای بلند تکرار کنید.' : 'You want to find the metro station. Listen to each line and then repeat it aloud once.'}</p><ListeningPractice lang={lang} dialogue={dialogue} counterpart={{ fa: 'رهگذر', en: 'Passerby' }}/><div>{action(isFa ? 'واژه‌ها و قاعده‌ها' : 'Words and rules', () => move(1))}</div></section>}
    {stage === 1 && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">{isFa ? '۲. قاعده‌ها در چهار گروه' : '2. Four groups of rules'}</h2>
      <article className="space-y-3 rounded-xl bg-sky-50 p-4"><h3 className="font-bold">{isFa ? '۱) پرسیدن مکان: Unde este + مکان؟' : '1) Asking where: Unde este + place?'}</h3><p>{isFa ? 'Unde یعنی «کجا» و este شکل سوم‌شخص مفرد فعل a fi («بودن») است. در سؤال، واژهٔ پرسشی اول، سپس فعل و بعد نام مکان می‌آید. در گفت‌وگوی مؤدبانه با غریبه ابتدا Bună ziua! بگویید.' : 'Unde means “where”; este is the third-person singular present of a fi (“to be”). Put the question word first, then the verb and the place. Greet a stranger with Bună ziua! first.'}</p>{example('Unde este stația de metrou?', 'Where is the metro station?', 'ایستگاه مترو کجاست؟', true)}{example('Unde este o farmacie?', 'Where is a pharmacy?', 'یک داروخانه کجاست؟', true)}</article>
      <article className="space-y-3 rounded-xl bg-emerald-50 p-4"><h3 className="font-bold">{isFa ? '۲) ایستگاه مشخص یا یک داروخانه' : '2) The station or a pharmacy'}</h3><p>{isFa ? 'stație اسم مؤنث مفرد است. در stația حرف تعریف معین به آخر اسم می‌چسبد و معنی «ایستگاهِ مشخص» می‌دهد؛ de metrou نوع ایستگاه را مشخص می‌کند. در o farmacie، o حرف تعریف نامعین مؤنث است: «یک داروخانه»، بدون اشاره به داروخانه‌ای مشخص.' : 'Stație is a feminine singular noun. In stația, the definite article attaches to the end: “the station”; de metrou specifies its kind. In o farmacie, o is the feminine indefinite article: “a pharmacy”, without naming a particular one.'}</p>{example('stația de metrou', 'the metro station', 'ایستگاه مترو', true)}{example('o farmacie', 'a pharmacy', 'یک داروخانه', true)}</article>
      <article className="space-y-3 rounded-xl bg-amber-50 p-4"><h3 className="font-bold">{isFa ? '۳) فهمیدن مسیر و درخواست مؤدبانه' : '3) Understanding directions and polite address'}</h3><p>{isFa ? 'Mergeți از فعل a merge («رفتن») است و در این پاسخ صورت امری مؤدبانه برای «شما بروید» است؛ همان شکل برای خطاب جمع نیز به کار می‌رود. înainte یعنی «به جلو/مستقیم». pe dreapta یعنی «سمت راست» و pe stânga یعنی «سمت چپ». در پاسخ «Stația este pe dreapta»، ترتیب جمله اسم + este + مکان است.' : 'Mergeți comes from a merge (“to go”). Here it is the polite plural imperative “go”; it also addresses a group. înainte means “ahead”; pe dreapta means “on the right” and pe stânga “on the left”. “Stația este pe dreapta” follows subject + este + location.'}</p>{example('Mergeți înainte. Stația este pe dreapta.', 'Go straight ahead. The station is on the right.', 'مستقیم بروید. ایستگاه سمت راست است.', true)}{example('Stația este pe stânga.', 'The station is on the left.', 'ایستگاه سمت چپ است.', true)}</article>
      <article className="space-y-3 rounded-xl bg-violet-50 p-4"><h3 className="font-bold">{isFa ? '۴) پرسیدن فاصله و فهمیدن پاسخ' : '4) Asking about distance and understanding the reply'}</h3><p>{isFa ? 'وقتی مکان روشن است، لازم نیست دوباره نامش را بگویید: Este departe? یعنی «دور است؟». در پاسخ، nu یعنی «نه» و aproape یعنی «نزدیک». este در سؤال و جواب همان شکل فعل «بودن» است.' : 'Once the place is clear, you can omit its name: Este departe? means “Is it far?” In the reply, nu means “no” and aproape means “nearby”. Este is the same form of “to be” in both question and answer.'}</p>{example('Este departe?', 'Is it far?', 'دور است؟', true)}{example('Nu, este aproape.', 'No, it is nearby.', 'نه، نزدیک است.', true)}</article>
      <div>{action(isFa ? 'یادآوری از حافظه' : 'Recall from memory', () => move(2))}</div></section>}
    {(stage === 2 || stage === 3) && <section className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"><p className="text-sm font-bold text-[#1554bd]">{stage === 2 ? isFa ? '۳. یادآوری' : '3. Recall' : isFa ? `۴. موقعیت ${round + 1} از ۳` : `4. Situation ${round + 1} of 3`}</p><h2 className="text-xl font-bold">{isFa ? task.fa : task.en}</h2><p className="text-sm text-slate-600">{isFa ? 'جمله را بنویسید یا در صورت پشتیبانی مرورگر بگویید. بعد یک بار بلند تکرار کنید.' : 'Write the sentence or say it if your browser supports speech recognition. Then repeat it aloud.'}</p><form onSubmit={e => { e.preventDefault(); check(); }} className="space-y-3"><label htmlFor="directions-answer" className="block font-semibold">{isFa ? 'پاسخ رومانیایی' : 'Romanian answer'}</label><input id="directions-answer" lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={e => { setAnswer(e.target.value); setFeedback(null); }} className="w-full rounded-xl border border-slate-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1554bd]" /><div className="flex flex-wrap gap-3"><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button>{voiceAvailable && <button type="button" onClick={speak} aria-pressed={listening} className="rounded-xl border border-[#1554bd] px-5 py-3 font-semibold text-[#1554bd]">{listening ? isFa ? 'پایان شنیدن' : 'Stop listening' : isFa ? '🎙️ پاسخ با صدا' : '🎙️ Answer by voice'}</button>}<button type="button" onClick={() => setHint(true)} className="rounded-xl border px-5 py-3 font-semibold text-[#1554bd]">{isFa ? 'راهنما' : 'Hint'}</button></div></form>{listening && <p role="status">{isFa ? 'در حال شنیدن…' : 'Listening…'}</p>}{voiceError && <p role="status" className="rounded-xl bg-amber-50 p-3">{voiceError}</p>}{hint && <p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-3">{task.hint}</p>}{feedback && <p role="status" className={`rounded-xl p-3 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{feedback === 'correct' ? isFa ? 'درست است. آن را بلند بگویید و ادامه دهید.' : 'Correct. Say it aloud, then continue.' : isFa ? 'یک بار دیگر امتحان کنید؛ ترتیب واژه‌ها و شکل اسم را بررسی کنید.' : 'Try again; check the word order and noun form.'}</p>}{feedback === 'correct' && action(stage === 2 ? isFa ? 'شروع راه‌یابی' : 'Start directions' : round === 2 ? isFa ? 'دیدن نتیجه' : 'See result' : isFa ? 'موقعیت بعدی' : 'Next situation', next)}</section>}
    {stage === 4 && <section className="space-y-4 rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold">{complete ? isFa ? 'می‌توانید نشانی بپرسید' : 'You can ask for directions' : isFa ? 'تمرین هنوز کامل نشده است' : 'Practice is not complete yet'}</h2><p>{isFa ? 'اکنون می‌توانید نشانی مترو یا داروخانه را بپرسید و دربارهٔ فاصله سؤال کنید.' : 'You can now ask where the metro station or a pharmacy is and whether it is far.'}</p>{action(complete ? isFa ? 'تمرین دوباره' : 'Practise again' : isFa ? 'ادامهٔ تمرین' : 'Continue practice', () => move(complete ? 0 : 3))}<Link href="/learn-romanian/lectie" className="ms-3 inline-block text-[#1554bd] underline">{isFa ? 'موضوع‌های روزمره' : 'Everyday topics'}</Link></section>}
    {audioError && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{isFa ? 'فایل صدا در دسترس نیست.' : 'Audio recording is unavailable.'}</p>}
    <p className="text-xs text-slate-500">{isFa ? 'همهٔ جمله‌های مکالمه و نمونه‌ها صدای ضبط‌شده دارند. تشخیص گفتار فقط متن را بررسی می‌کند و به کیفیت تلفظ نمره نمی‌دهد.' : 'All dialogue lines and examples have recordings. Speech recognition checks words, not pronunciation quality.'}</p>
  </div>;
}
