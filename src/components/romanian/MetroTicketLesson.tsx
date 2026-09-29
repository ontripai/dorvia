'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';

type Locale = 'fa' | 'en';
type Phase = 0 | 1 | 2 | 3 | 4;
type Choice = 'ten' | 'monthly';
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type RecognitionWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

const stages = {
  fa: ['مکالمه', 'واژه و انتخاب', 'یادآوری', 'گفت‌وگو', 'نتیجه'],
  en: ['Conversation', 'Words and choice', 'Recall', 'Dialogue', 'Result'],
};
const examples = [
  { ro: 'Bună ziua! Doriți zece călătorii sau un abonament lunar?', fa: 'سلام! ده سفر می‌خواهید یا اشتراک ماهانه؟', en: 'Hello! Would you like ten journeys or a monthly pass?', who: 'clerk' },
  { ro: 'Doresc zece călătorii, vă rog.', fa: 'ده سفر می‌خواهم، لطفاً.', en: 'I would like ten journeys, please.', who: 'you' },
  { ro: 'Poftiți. Mulțumesc!', fa: 'بفرمایید. متشکرم!', en: 'Here you are. Thank you!', who: 'clerk' },
];
const prompts: Choice[] = ['ten', 'monthly', 'ten'];
const targets: Record<Choice, string> = {
  ten: 'Doresc zece călătorii, vă rog.',
  monthly: 'Doresc un abonament lunar, vă rog.',
};
const storageKey = 'dorvia:romanian:metro-ticket:v1';

function normalize(value: string) {
  return value.normalize('NFC').toLocaleLowerCase('ro-RO').trim()
    .replace(/[.!?،,]+$/g, '').replace(/\s+/g, ' ');
}

export function MetroTicketLesson({ lang }: { lang: Locale }) {
  const isFa = lang === 'fa';
  const [phase, setPhase] = React.useState<Phase>(0);
  const [round, setRound] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'choice' | 'other' | null>(null);
  const [hint, setHint] = React.useState(false);
  const [translation, setTranslation] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [priorCompletion, setPriorCompletion] = React.useState(false);
  const [audioMessage, setAudioMessage] = React.useState('');
  const [voiceMessage, setVoiceMessage] = React.useState('');
  const [voiceAvailable, setVoiceAvailable] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const recognitionRef = React.useRef<Recognition | null>(null);

  React.useEffect(() => {
    const browser = window as RecognitionWindow;
    setVoiceAvailable(Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition));
    try { setPriorCompletion(Boolean(localStorage.getItem(storageKey))); } catch { /* storage is optional */ }
    return () => { recognitionRef.current?.abort(); window.speechSynthesis?.cancel(); };
  }, []);

  function move(next: Phase) {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    window.speechSynthesis?.cancel();
    setListening(false);
    setVoiceMessage('');
    setPhase(next);
    setRound(0);
    setAnswer('');
    setFeedback(null);
    setHint(false);
  }

  function speak(ro: string) {
    if (!('speechSynthesis' in window)) { setAudioMessage(isFa ? 'پخش صوت در این مرورگر در دسترس نیست.' : 'Audio playback is unavailable in this browser.'); return; }
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ro'));
    if (!voice) { setAudioMessage(isFa ? 'صدای رومانیایی روی این مرورگر در دسترس نیست.' : 'A Romanian voice is unavailable in this browser.'); return; }
    window.speechSynthesis.cancel();
    setAudioMessage('');
    const utterance = new SpeechSynthesisUtterance(ro);
    utterance.lang = 'ro-RO';
    utterance.voice = voice;
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  const expected: Choice = phase === 2 ? 'ten' : prompts[round];
  function check(raw = answer) {
    const response = normalize(raw);
    if (!response) return;
    const accepted = [targets[expected], targets[expected].replace(', vă rog.', '.')].map(normalize);
    if (accepted.includes(response)) { setFeedback('correct'); return; }
    setFeedback(response.includes(expected === 'ten' ? 'abonament' : 'călător') ? 'choice' : 'other');
  }

  function listen() {
    if (listening) { recognitionRef.current?.stop(); return; }
    const browser = window as RecognitionWindow;
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Constructor) return;
    window.speechSynthesis?.cancel();
    setFeedback(null);
    setVoiceMessage('');
    const recognition = new Constructor();
    recognitionRef.current = recognition;
    recognition.lang = 'ro-RO';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = event => {
      const result = event.results[0]?.[0]?.transcript?.trim();
      if (result) { setAnswer(result); check(result); }
    };
    recognition.onerror = event => {
      if (event.error !== 'aborted') setVoiceMessage(`${isFa ? 'تشخیص گفتار انجام نشد؛ می‌توانید دوباره بگویید یا تایپ کنید.' : 'Speech recognition failed; try again or type your answer.'} (${event.error})`);
    };
    recognition.onend = () => { recognitionRef.current = null; setListening(false); };
    try { recognition.start(); setListening(true); }
    catch { recognitionRef.current = null; setVoiceMessage(isFa ? 'میکروفون آغاز نشد؛ پاسخ را تایپ کنید.' : 'Microphone could not start; type your answer.'); }
  }

  function next() {
    if (phase === 2) { move(3); return; }
    if (round < prompts.length - 1) { setRound(round + 1); setAnswer(''); setFeedback(null); setHint(false); return; }
    try { localStorage.setItem(storageKey, new Date().toISOString()); } catch { /* optional device progress */ }
    setPriorCompletion(true);
    setComplete(true);
    move(4);
  }

  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl px-6 py-8 sm:p-10 text-white space-y-3">
      <span className="text-sm font-semibold text-blue-100">{isFa ? 'درس سوم مسیر بلیت · حدود ۱۵ دقیقه' : 'Ticket path, lesson 3 · about 15 minutes'}</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold">{isFa ? 'ده سفر یا اشتراک ماهانه؟' : 'Ten journeys or a monthly pass?'}</h1>
      <p className="text-slate-200">{isFa ? 'در باجهٔ مترو، نوع سفر را بفهمید و خواستهٔ خود را بیان کنید.' : 'At the metro counter, understand the choice and say what you need.'}</p>
    </header>

    <nav aria-label={isFa ? 'مراحل درس' : 'Lesson stages'} className="flex flex-wrap gap-2">
      {stages[lang].map((label, i) => <button key={label} type="button" onClick={() => move(i as Phase)} aria-current={phase === i ? 'step' : undefined}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd] ${phase === i ? 'bg-[#1554bd] text-white' : 'bg-slate-100 text-slate-700 hover:bg-blue-50'}`}>
        {isFa ? '۰۱۲۳۴۵۶۷۸۹'[i + 1] : i + 1}. {label}
      </button>)}
    </nav>

    {phase === 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-4">
      <h2 className="text-xl font-bold">{isFa ? 'گفت‌وگو را بشنوید و نقش خود را پیدا کنید' : 'Listen and find your part in the dialogue'}</h2>
      <button type="button" onClick={() => speak(examples.map(t => t.ro).join(' '))} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-semibold">{isFa ? 'شنیدن گفت‌وگو' : 'Play dialogue'}</button>
      {examples.map((line, i) => <div key={i} className={`rounded-xl p-4 ${line.who === 'you' ? 'bg-blue-50' : 'bg-slate-50'}`}>
        <p className="text-xs text-[#1554bd] font-bold">{line.who === 'you' ? isFa ? 'شما' : 'You' : isFa ? 'فروشنده' : 'Clerk'}</p>
        <p lang="ro" dir="ltr" className="text-lg font-bold">{line.ro}</p>
        <p lang="en" dir="ltr" className="text-sm text-slate-600">{line.en}</p>
        {translation && isFa && <p className="text-sm">{line.fa}</p>}
        <button type="button" onClick={() => speak(line.ro)} className="text-sm text-[#1554bd] underline">{isFa ? 'شنیدن این جمله' : 'Hear this line'}</button>
      </div>)}
      {isFa && <button type="button" onClick={() => setTranslation(v => !v)} className="text-sm text-[#1554bd] underline">{translation ? 'پنهان کردن فارسی' : 'نمایش فارسی'}</button>}
      <div><button type="button" onClick={() => move(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-bold">{isFa ? 'واژه و انتخاب' : 'Explore the words'}</button></div>
    </section>}

    {phase === 1 && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
      <h2 className="text-xl font-bold">{isFa ? 'بلیت، سفر و اشتراک را از هم جدا کنید' : 'Distinguish ticket, journey, and pass'}</h2>
      <p>{isFa ? 'در درس قبل bilet / bilete را به کار بردید. اینجا نوع سفر را مشخص می‌کنید.' : 'In the previous lesson you used bilet / bilete. Now you specify what kind of travel you need.'}</p>
      {[{ ro: 'zece călătorii', fa: 'ده سفر', en: 'ten journeys' }, { ro: 'un abonament lunar', fa: 'یک اشتراک ماهانه', en: 'a monthly pass' }, { ro: 'Doresc …, vă rog.', fa: '… می‌خواهم، لطفاً. (محترمانه)', en: 'I would like …, please. (polite)' }].map(item => <div key={item.ro} className="rounded-xl bg-blue-50 p-4">
        <p lang="ro" dir="ltr" className="text-xl font-bold">{item.ro}</p><p className="text-sm">{isFa ? item.fa : item.en}</p>
        <button type="button" onClick={() => speak(item.ro)} className="text-sm text-[#1554bd] underline">{isFa ? 'بشنو و تکرار کن' : 'Listen and repeat'}</button>
      </div>)}
      <p className="text-sm text-slate-700">{isFa ? 'در این جلسه فقط انتخاب نوع سفر را تمرین می‌کنیم؛ قیمت و شرایط خرید ممکن است تغییر کنند.' : 'This lesson focuses on choosing the type of travel; prices and purchase conditions can change.'}</p>
      <button type="button" onClick={() => move(2)} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-bold">{isFa ? 'یادآوری از حافظه' : 'Recall from memory'}</button>
    </section>}

    {(phase === 2 || phase === 3) && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
      <div className="text-sm font-bold text-[#1554bd]">{phase === 2 ? isFa ? 'یادآوری' : 'Recall' : isFa ? `گفت‌وگو ${round + 1} از ۳` : `Dialogue ${round + 1} of 3`}</div>
      <h2 className="text-xl font-bold">{expected === 'ten' ? isFa ? 'ده سفر بخواهید' : 'Ask for ten journeys' : isFa ? 'اشتراک ماهانه بخواهید' : 'Ask for a monthly pass'}</h2>
      {phase === 3 && <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-600">{isFa ? 'فروشنده' : 'Clerk'}</p>
        <p lang="ro" dir="ltr" className="text-lg font-semibold">{round === 1 ? 'Doriți un abonament lunar?' : 'Doriți zece călătorii sau un abonament lunar?'}</p>
        <button type="button" onClick={() => speak(round === 1 ? 'Doriți un abonament lunar?' : 'Doriți zece călătorii sau un abonament lunar?')} className="text-sm text-[#1554bd] underline">{isFa ? 'شنیدن سؤال' : 'Hear the question'}</button>
      </div>}
      <form onSubmit={event => { event.preventDefault(); check(); }} className="space-y-3">
        <label htmlFor="metro-answer" className="block text-sm font-semibold">{isFa ? 'پاسخ شما به رومانیایی' : 'Your Romanian answer'}</label>
        <input id="metro-answer" lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} className="w-full rounded-xl border border-slate-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1554bd]" />
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-semibold disabled:opacity-50">{isFa ? 'بررسی پاسخ' : 'Check answer'}</button>
          {voiceAvailable && <button type="button" onClick={listen} aria-pressed={listening} className="rounded-xl border border-[#1554bd] px-5 py-3 text-[#1554bd] font-semibold">{listening ? isFa ? 'پایان شنیدن' : 'Stop listening' : isFa ? '🎙️ پاسخ با صدا' : '🎙️ Answer by voice'}</button>}
          <button type="button" onClick={() => setHint(true)} className="rounded-xl border border-slate-300 px-5 py-3 text-[#1554bd] font-semibold">{isFa ? 'راهنما' : 'Hint'}</button>
        </div>
      </form>
      {listening && <p role="status" className="text-sm text-[#1554bd]">{isFa ? 'در حال شنیدن…' : 'Listening…'}</p>}
      {voiceMessage && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{voiceMessage}</p>}
      {hint && <p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-3">{expected === 'ten' ? 'Doresc zece …, vă rog.' : 'Doresc un … lunar, vă rog.'}</p>}
      {feedback && <p role="status" className={`rounded-xl p-4 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{feedback === 'correct' ? isFa ? 'درست است. جمله را یک بار با صدای بلند تکرار کنید.' : 'Correct. Say it aloud once.' : feedback === 'choice' ? isFa ? 'به نوع سفر خواسته‌شده دقت کنید: ده سفر یا اشتراک ماهانه؟' : 'Check the requested choice: ten journeys or a monthly pass?' : isFa ? 'از الگوی «Doresc …, vă rog» کمک بگیرید و دوباره تلاش کنید.' : 'Use “Doresc …, vă rog” and try again.'}</p>}
      {feedback === 'correct' && <button type="button" onClick={next} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-bold">{phase === 3 && round === 2 ? isFa ? 'دیدن نتیجه' : 'See result' : isFa ? 'ادامه' : 'Continue'}</button>}
    </section>}

    {phase === 4 && <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
      <h2 className="text-2xl font-bold">{complete ? isFa ? 'دو نوع سفر را درخواست کردید' : 'You requested two types of travel' : isFa ? 'نتیجهٔ این نوبت هنوز آماده نیست' : 'This attempt is not complete yet'}</h2>
      <p>{complete ? isFa ? 'می‌توانید دوباره تمرین کنید یا یک درس دیگر انتخاب کنید. محدودیت روزانه وجود ندارد.' : 'Repeat this lesson or choose another one. There is no daily limit.' : isFa ? 'برای ثبت نتیجه، به سه نوبت گفت‌وگو پاسخ دهید.' : 'Answer all three dialogue rounds to complete this attempt.'}</p>
      <button type="button" onClick={() => { if (complete) setComplete(false); move(0); }} className="rounded-xl border border-[#1554bd] px-5 py-3 font-bold text-[#1554bd]">{complete ? isFa ? 'تمرین دوباره' : 'Practise again' : isFa ? 'بازگشت به گفت‌وگو' : 'Go to dialogue'}</button>
      {!complete && <button type="button" onClick={() => move(3)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'شروع گفت‌وگو' : 'Start dialogue'}</button>}
      <Link href="/learn-romanian" className="inline-block ms-3 text-[#1554bd] underline">{isFa ? 'انتخاب درس دیگر' : 'Choose another lesson'}</Link>
    </section>}
    {priorCompletion && phase !== 4 && <p className="text-sm text-slate-500">{isFa ? 'این درس قبلاً روی همین دستگاه انجام شده است؛ می‌توانید دوباره تمرین کنید.' : 'You completed this lesson on this device; you can practise again.'}</p>}
    {audioMessage && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{audioMessage}</p>}
    <p className="text-xs text-slate-500">{isFa ? 'پخش به صدای رومانیایی مرورگر وابسته است. پاسخ صوتی به متن تبدیل می‌شود و کیفیت تلفظ نمره‌دهی نمی‌شود.' : 'Playback needs a Romanian browser voice. Spoken answers are transcribed; pronunciation is not graded.'}</p>
  </div>;
}
