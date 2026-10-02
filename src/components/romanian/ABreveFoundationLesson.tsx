'use client';

import { MeaningLines } from './MeaningLines';

import React from 'react';
import { AlphabetStageNav } from './AlphabetStageNav';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { PronunciationAudio } from './PronunciationAudio';

type Locale = 'fa' | 'en';
type Phase = 0 | 1 | 2 | 3 | 4;
type Word = {
  ro: string;
  en: string;
  fa: string;
  position: 'start' | 'middle' | 'end';
  ruleFa: string;
  ruleEn: string;
  forms: string;
  source: string;
};
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};
type RecognitionWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

const words: Word[] = [
  { ro: 'masă', en: 'table', fa: 'میز', position: 'end', ruleFa: 'اسم مؤنث؛ یک میز: o masă. در صورت مشخص، ă به a تبدیل می‌شود.', ruleEn: 'Feminine noun; one table: o masă. In the definite singular, final ă becomes a.', forms: 'masă → masa · mese → mesele', source: 'https://dexonline.ro/definitie/mas%C4%83/paradigma' },
  { ro: 'apă', en: 'water', fa: 'آب', position: 'end', ruleFa: 'اسم مؤنث؛ معمولاً برای مادهٔ آب به‌صورت مفرد به کار می‌رود. جمع ape بیشتر دربارهٔ آب‌ها یا انواع آب است.', ruleEn: 'Feminine noun, usually singular for water as a substance. The plural ape is used for waters or types of water.', forms: 'apă → apa · ape → apele', source: 'https://dexonline.ro/definitie/ap%C4%83/paradigma' },
  { ro: 'astăzi', en: 'today', fa: 'امروز', position: 'middle', ruleFa: 'قید زمان است؛ جنس، جمع یا حرف تعریف ندارد. می‌تواند زمان رویداد را در جمله مشخص کند.', ruleEn: 'Time adverb; it has no gender, plural, or definite article. It locates an event in time.', forms: 'astăzi (صورت ثابت / invariable)', source: 'https://dexonline.ro/definitie/ast%C4%83zi' },
  { ro: 'ăsta', en: 'this one (masculine, informal)', fa: 'این یکی (مذکر، خودمانی)', position: 'start', ruleFa: 'ضمیر/صفت اشاره در گفتار خودمانی؛ مذکر مفرد است. صورت مؤنث asta و صورت رسمی‌تر acesta است.', ruleEn: 'Informal demonstrative pronoun/adjective, masculine singular. The feminine is asta; a more formal form is acesta.', forms: 'ăsta · asta · ăștia · astea', source: 'https://dexonline.ro/definitie/%C4%83sta' },
];
const recall = [
  { answer: 'masă', fa: '«میز» را با ă بنویسید.', en: 'Write “table” with ă.' },
  { answer: 'astăzi', fa: '«امروز» را با ă بنویسید.', en: 'Write “today” with ă.' },
  { answer: 'apă', fa: '«آب» را با ă بنویسید.', en: 'Write “water” with ă.' },
];
const progressKey = 'dorvia:romanian:foundation:a-breve:v1';

function normalize(value: string) {
  return value.normalize('NFC').toLocaleLowerCase('ro-RO').trim().replace(/[.!?،,]+$/g, '').replace(/\s+/g, ' ');
}

export function ABreveFoundationLesson({ lang }: { lang: Locale }) {
  const isFa = lang === 'fa';
  const [phase, setPhase] = React.useState<Phase>(0);
  const [round, setRound] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'letter' | 'other' | null>(null);
  const [hint, setHint] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [priorCompletion, setPriorCompletion] = React.useState(false);
  const [voiceAvailable, setVoiceAvailable] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [voiceMessage, setVoiceMessage] = React.useState('');
  const recognitionRef = React.useRef<Recognition | null>(null);

  React.useEffect(() => {
    const browser = window as RecognitionWindow;
    setVoiceAvailable(Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition));
    try { setPriorCompletion(Boolean(localStorage.getItem(progressKey))); } catch { /* optional */ }
    return () => { recognitionRef.current?.abort(); window.speechSynthesis?.cancel(); };
  }, []);

  function move(next: Phase) {
    recognitionRef.current?.abort(); recognitionRef.current = null;
    window.speechSynthesis?.cancel();
    setListening(false); setVoiceMessage(''); setPhase(next); setRound(0);
    setAnswer(''); setFeedback(null); setHint(false);
  }

  const expected = phase === 2 ? recall[round].answer : round === 0 ? 'masă' : 'astăzi';
  function check(raw = answer) {
    const result = normalize(raw);
    if (!result) return;
    if (result === normalize(expected)) { setFeedback('correct'); return; }
    setFeedback(result.replaceAll('ă', 'a') === expected.replaceAll('ă', 'a') ? 'letter' : 'other');
  }

  function listen() {
    if (listening) { recognitionRef.current?.stop(); return; }
    const browser = window as RecognitionWindow;
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Constructor) return;
    window.speechSynthesis?.cancel(); setVoiceMessage(''); setFeedback(null);
    const recognition = new Constructor(); recognitionRef.current = recognition;
    recognition.lang = 'ro-RO'; recognition.continuous = false; recognition.interimResults = false;
    recognition.onresult = event => {
      const result = event.results[0]?.[0]?.transcript?.trim();
      if (result) { setAnswer(result); check(result); }
    };
    recognition.onerror = event => {
      if (event.error !== 'aborted') setVoiceMessage(`${isFa ? 'تشخیص گفتار انجام نشد؛ دوباره بگویید یا تایپ کنید.' : 'Speech recognition failed; retry or type.'} (${event.error})`);
    };
    recognition.onend = () => { recognitionRef.current = null; setListening(false); };
    try { recognition.start(); setListening(true); }
    catch { recognitionRef.current = null; setVoiceMessage(isFa ? 'میکروفون آغاز نشد؛ پاسخ را تایپ کنید.' : 'Microphone could not start; type your answer.'); }
  }

  function next() {
    if (phase === 2 && round < recall.length - 1) { setRound(round + 1); setAnswer(''); setFeedback(null); setHint(false); return; }
    if (phase === 2) { move(3); return; }
    if (round === 0) { setRound(1); setAnswer(''); setFeedback(null); setHint(false); return; }
    try { localStorage.setItem(progressKey, new Date().toISOString()); } catch { /* optional */ }
    setPriorCompletion(true); setComplete(true); move(4);
  }

  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl px-6 py-8 sm:p-10 text-white space-y-3">
      <span className="text-sm font-semibold text-blue-100">{isFa ? 'درس نمونهٔ پایه · حدود ۱۵ دقیقه' : 'Foundation sample · about 15 minutes'}</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold">{isFa ? 'صدای «ă» را پیدا کن' : 'Find the sound “ă”'}</h1>
      <p className="text-slate-200">{isFa ? 'بشنو، جای حرف را در واژه پیدا کن، آن را بنویس و تفاوتش را با a ببین.' : 'Listen, find the letter in words, write it, and distinguish it from a.'}</p>
      <div className="inline-flex flex-col items-start gap-2 rounded-2xl border border-white/20 bg-white/10 p-4">
        <span className="text-sm font-bold">{isFa ? 'شنیدن نام حرف' : 'Hear the letter name'}</span>
        <PronunciationAudio currentLang={lang} label="ă" />
        <span className="text-xs text-blue-100">{isFa ? 'صدای مصنوعی نام حرف است؛ برای شنیدن آن در واژه، نمونه‌ها را جداگانه پخش کنید.' : 'Browser synthesis reads the letter name; play examples to hear it in words.'}</span>
      </div>
    </header>
    <AlphabetStageNav lang={lang} stage={phase} onSelect={index => move(index as Phase)} />
    {phase === 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
      <h2 className="text-xl font-bold">{isFa ? 'حرف و واژهٔ نمونه' : 'Letter and example word'}</h2>
      <p>{isFa ? 'جای ă را در واژهٔ «masă» ببینید و تکرار کنید. آن را با a یکی نخوانید. صدای ضبط‌شدهٔ این درس تا بررسی مطابقت با حرف پخش نمی‌شود.' : 'Find ă in “masă” and practise it. Do not confuse it with a. The recording is unavailable until it is checked against the letter.'}</p>
      <div lang="ro" dir="ltr" className="text-4xl font-bold text-[#1554bd]">mas<span className="underline decoration-amber-500 decoration-4">ă</span></div>
      <PronunciationAudio currentLang={lang} label="masă" />
      <div className="grid gap-3 sm:grid-cols-3">{words.filter(word => word.ro !== 'masă').map(word => <div key={word.ro} className="rounded-xl bg-blue-50 p-3"><p lang="ro" dir="ltr" className="text-lg font-bold">{word.ro}</p><MeaningLines en={word.en} fa={word.fa} lang={lang} className="text-sm" /><PronunciationAudio currentLang={lang} label={word.ro} variant="compact" /></div>)}</div>
      <p className="text-sm text-slate-600">{isFa ? 'جزئیات و قاعدهٔ هر واژه در مرحلهٔ بعد باز می‌شود. برای واژه‌های ثبت‌شده، فایل صوتی آزور پخش می‌شود.' : 'Open the next stage for each word’s grammar. Catalogued words play their Azure recordings.'}</p>
      <button type="button" onClick={() => move(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-bold">{isFa ? 'کشف واژه‌ها' : 'Explore the words'}</button>
    </section>}
    {phase === 1 && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
      <h2 className="text-xl font-bold">{isFa ? 'ă در کجای واژه است؟' : 'Where is ă in the word?'}</h2>
      <p>{isFa ? 'هر واژه شناسنامهٔ کوتاهی دارد. روی قواعد آن باز کنید؛ برای اسم، صورت‌های مفرد و جمع و مشخص را می‌بینید و برای قید یا ضمیر، نقش و کاربرد آن را.' : 'Open each word’s rule card. Nouns show singular, plural and definite forms; other words show their role and usage.'}</p>
      <div className="grid gap-4 sm:grid-cols-2">{words.map(word => <article key={word.ro} className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
        <p className="text-xs font-bold text-[#1554bd]">{word.position === 'start' ? isFa ? 'آغاز واژه' : 'Beginning' : word.position === 'middle' ? isFa ? 'میانهٔ واژه' : 'Middle' : isFa ? 'پایان واژه' : 'End'}</p>
        <p lang="ro" dir="ltr" className="text-2xl font-bold">{word.ro}</p>
        <MeaningLines en={word.en} fa={word.fa} lang={lang} className="text-sm" />
        <PronunciationAudio currentLang={lang} label={word.ro} />
        <details className="rounded-lg bg-white p-3 text-sm"><summary className="cursor-pointer font-semibold">{isFa ? 'قاعده و صورت‌های این واژه' : 'This word’s rule and forms'}</summary>
          <p className="mt-2">{isFa ? word.ruleFa : word.ruleEn}</p>
          <p lang="ro" dir="ltr" className="mt-2 font-semibold">{word.forms}</p>
          <a href={word.source} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[#1554bd] underline">{isFa ? 'منبع واژه' : 'Word source'}</a>
        </details>
      </article>)}</div>
      <p className="text-sm text-slate-600">{isFa ? 'ăsta نمونهٔ آغاز واژه در گفتار خودمانی است. در درخواست رسمی از صورت رسمی‌تر استفاده می‌شود.' : 'Ăsta is a word-initial example from informal speech. Use a more formal form in a formal request.'}</p>
      <button type="button" onClick={() => move(2)} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-bold">{isFa ? 'یادآوری از حافظه' : 'Recall from memory'}</button>
    </section>}
    {(phase === 2 || phase === 3) && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
      <div className="text-sm font-bold text-[#1554bd]">{phase === 2 ? isFa ? `یادآوری ${round + 1} از ۳` : `Recall ${round + 1} of 3` : isFa ? `کاربرد ${round + 1} از ۲` : `Use it ${round + 1} of 2`}</div>
      <h2 className="text-xl font-bold">{phase === 2 ? isFa ? recall[round].fa : recall[round].en : round === 0 ? isFa ? 'در رستوران، واژهٔ «میز» را به رومانیایی بگویید.' : 'At a restaurant, say the Romanian word for “table”.' : isFa ? 'برای گفتن «امروز»، کدام واژه را به کار می‌برید؟' : 'Which word means “today”?'}</h2>
      {phase === 3 && <PronunciationAudio currentLang={lang} label={expected} />}
      <form onSubmit={event => { event.preventDefault(); check(); }} className="space-y-3">
        <label htmlFor="breve-answer" className="block text-sm font-semibold">{isFa ? 'پاسخ شما به رومانیایی' : 'Your Romanian answer'}</label>
        <input id="breve-answer" lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} className="w-full rounded-xl border border-slate-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1554bd]" />
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-semibold disabled:opacity-50">{isFa ? 'بررسی پاسخ' : 'Check answer'}</button>
          {voiceAvailable && <button type="button" onClick={listen} aria-pressed={listening} className="rounded-xl border border-[#1554bd] px-5 py-3 text-[#1554bd] font-semibold">{listening ? isFa ? 'پایان شنیدن' : 'Stop listening' : isFa ? '🎙️ پاسخ با صدا' : '🎙️ Answer by voice'}</button>}
          <button type="button" onClick={() => setHint(true)} className="rounded-xl border border-slate-300 px-5 py-3 text-[#1554bd] font-semibold">{isFa ? 'راهنما' : 'Hint'}</button>
        </div>
      </form>
      {listening && <p role="status" className="text-sm text-[#1554bd]">{isFa ? 'در حال شنیدن…' : 'Listening…'}</p>}
      {voiceMessage && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{voiceMessage}</p>}
      {hint && <p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-3">{expected.replaceAll('ă', '_')}</p>}
      {feedback && <p role="status" className={`rounded-xl p-4 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{feedback === 'correct' ? isFa ? 'درست است. واژه را یک بار با صدای بلند تکرار کنید.' : 'Correct. Say the word aloud once.' : feedback === 'letter' ? isFa ? 'صدای هدف را درست پیدا کرده‌اید؛ املای ă را با a مقایسه کنید.' : 'You found the word; compare the spelling ă with a.' : isFa ? 'به نمونه‌ها برگردید و دوباره امتحان کنید.' : 'Review the examples and try again.'}</p>}
      {feedback === 'correct' && <button type="button" onClick={next} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-bold">{phase === 3 && round === 1 ? isFa ? 'دیدن نتیجه' : 'See result' : isFa ? 'ادامه' : 'Continue'}</button>}
    </section>}
    {phase === 4 && <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
      <h2 className="text-2xl font-bold">{complete ? isFa ? 'صدای ă را در چند جای واژه دیدید' : 'You found ă in several word positions' : isFa ? 'نتیجهٔ این نوبت هنوز آماده نیست' : 'This attempt is not complete yet'}</h2>
      <p>{complete ? isFa ? 'واژه‌ها و قواعد هر کدام را می‌توانید دوباره مرور کنید. زمان ۱۵ دقیقه‌ای سقف مطالعه نیست.' : 'You can revisit the words and their rules. Fifteen minutes is not a daily limit.' : isFa ? 'برای ثبت نتیجه، یادآوری و کاربرد را کامل کنید.' : 'Complete recall and use-it practice to finish this attempt.'}</p>
      <button type="button" onClick={() => { if (complete) setComplete(false); move(0); }} className="rounded-xl border border-[#1554bd] px-5 py-3 font-bold text-[#1554bd]">{complete ? isFa ? 'تمرین دوباره' : 'Practise again' : isFa ? 'شروع از ابتدا' : 'Start from beginning'}</button>
      <Link href="/learn-romanian/alfabet" className="inline-block ms-3 text-[#1554bd] underline">{isFa ? 'دیگر درس‌های آوا' : 'Other sound lessons'}</Link>
    </section>}
    {priorCompletion && phase !== 4 && <p className="text-sm text-slate-500">{isFa ? 'این درس قبلاً روی همین دستگاه انجام شده است؛ تکرار آزاد است.' : 'You completed this lesson on this device; repeat it anytime.'}</p>}
    <p className="text-xs text-slate-500">{isFa ? 'برای واژه‌های ثبت‌شده فایل صوتی آزور پخش می‌شود. تشخیص گفتار کیفیت تلفظ را نمره‌دهی نمی‌کند.' : 'Catalogued words play Azure recordings. Speech recognition does not grade pronunciation.'}</p>
  </div>;
}
