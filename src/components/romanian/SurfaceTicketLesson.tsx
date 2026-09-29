'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';

type Locale = 'fa' | 'en';
type Phase = 0 | 1 | 2 | 3 | 4;
type Vehicle = 'bus' | 'tram';
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
type RecognitionWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
const stages = {
  fa: ['مکالمه', 'واژه و قاعده', 'یادآوری', 'گفت‌وگو', 'نتیجه'],
  en: ['Conversation', 'Words and rule', 'Recall', 'Dialogue', 'Result'],
};
const targets: Record<Vehicle, string> = {
  bus: 'Este valabil și în autobuz?',
  tram: 'Este valabil și în tramvai?',
};
const sequence: Vehicle[] = ['tram', 'bus', 'tram'];
const progressKey = 'dorvia:romanian:surface-ticket:v1';

function normalize(value: string) {
  return value.normalize('NFC').trim().toLocaleLowerCase('ro-RO').replace(/[.!?،,]+$/g, '').replace(/\s+/g, ' ');
}

export function SurfaceTicketLesson({ lang }: { lang: Locale }) {
  const isFa = lang === 'fa';
  const [phase, setPhase] = React.useState<Phase>(0);
  const [round, setRound] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'vehicle' | 'other' | null>(null);
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
    try { setPriorCompletion(Boolean(localStorage.getItem(progressKey))); } catch { /* optional */ }
    return () => { recognitionRef.current?.abort(); window.speechSynthesis?.cancel(); };
  }, []);

  function move(next: Phase) {
    recognitionRef.current?.abort(); recognitionRef.current = null;
    window.speechSynthesis?.cancel();
    setListening(false); setVoiceMessage(''); setPhase(next); setRound(0);
    setAnswer(''); setFeedback(null); setHint(false);
  }

  function speak(ro: string) {
    if (!('speechSynthesis' in window)) { setAudioMessage(isFa ? 'پخش صوت در این مرورگر در دسترس نیست.' : 'Audio playback is unavailable.'); return; }
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ro'));
    if (!voice) { setAudioMessage(isFa ? 'صدای رومانیایی در مرورگر در دسترس نیست.' : 'A Romanian browser voice is unavailable.'); return; }
    window.speechSynthesis.cancel(); setAudioMessage('');
    const utterance = new SpeechSynthesisUtterance(ro);
    utterance.lang = 'ro-RO'; utterance.voice = voice; utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  const vehicle: Vehicle = phase === 2 ? 'tram' : sequence[round];
  function check(raw = answer) {
    const response = normalize(raw);
    if (!response) return;
    if (response === normalize(targets[vehicle])) { setFeedback('correct'); return; }
    setFeedback(response.includes(vehicle === 'bus' ? 'tramvai' : 'autobuz') ? 'vehicle' : 'other');
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
      if (event.error !== 'aborted') setVoiceMessage(`${isFa ? 'تشخیص گفتار انجام نشد؛ دوباره بگویید یا تایپ کنید.' : 'Speech recognition failed; try again or type.'} (${event.error})`);
    };
    recognition.onend = () => { recognitionRef.current = null; setListening(false); };
    try { recognition.start(); setListening(true); }
    catch { recognitionRef.current = null; setVoiceMessage(isFa ? 'میکروفون آغاز نشد؛ پاسخ را تایپ کنید.' : 'Microphone could not start; type your answer.'); }
  }

  function next() {
    if (phase === 2) { move(3); return; }
    if (round < sequence.length - 1) { setRound(round + 1); setAnswer(''); setFeedback(null); setHint(false); return; }
    try { localStorage.setItem(progressKey, new Date().toISOString()); } catch { /* optional */ }
    setPriorCompletion(true); setComplete(true); move(4);
  }

  return <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl px-6 py-8 sm:p-10 text-white space-y-3">
      <span className="text-sm font-semibold text-blue-100">{isFa ? 'درس دوم مسیر بلیت · حدود ۱۵ دقیقه' : 'Ticket path, lesson 2 · about 15 minutes'}</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold">{isFa ? 'اتوبوس یا تراموا؟' : 'Bus or tram?'}</h1>
      <p className="text-slate-200">{isFa ? 'بپرسید آیا عنوان سفر شما در وسیلهٔ دیگر هم معتبر است.' : 'Ask whether your travel ticket is valid on another vehicle.'}</p>
    </header>
    <nav aria-label={isFa ? 'مراحل درس' : 'Lesson stages'} className="flex flex-wrap gap-2">
      {stages[lang].map((label, i) => <button key={label} type="button" aria-current={phase === i ? 'step' : undefined} onClick={() => move(i as Phase)}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd] ${phase === i ? 'bg-[#1554bd] text-white' : 'bg-slate-100 text-slate-700 hover:bg-blue-50'}`}>
        {isFa ? '۰۱۲۳۴۵۶۷۸۹'[i + 1] : i + 1}. {label}
      </button>)}
    </nav>
    {phase === 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-4">
      <h2 className="text-xl font-bold">{isFa ? 'گفت‌وگو را بشنوید' : 'Listen to the conversation'}</h2>
      <p>{isFa ? 'بلیت سفر شهری دارید و می‌خواهید بدانید در تراموا هم قابل استفاده است یا نه.' : 'You have a city travel ticket and want to ask if it also works on a tram.'}</p>
      {[{ ro: 'Bună ziua! Este valabil și în tramvai?', en: 'Hello! Is it also valid on the tram?', fa: 'سلام! در تراموا هم معتبر است؟', who: 'you' },
        { ro: 'Da, este valabil.', en: 'Yes, it is valid.', fa: 'بله، معتبر است.', who: 'clerk' },
        { ro: 'Mulțumesc!', en: 'Thank you!', fa: 'ممنون!', who: 'you' }].map((line, i) => <div key={i} className={`rounded-xl p-4 ${line.who === 'you' ? 'bg-blue-50' : 'bg-slate-50'}`}>
          <p className="text-xs font-bold text-[#1554bd]">{line.who === 'you' ? isFa ? 'شما' : 'You' : isFa ? 'فروشنده' : 'Clerk'}</p>
          <p lang="ro" dir="ltr" className="text-lg font-bold">{line.ro}</p>
          <p lang="en" dir="ltr" className="text-sm text-slate-600">{line.en}</p>
          {translation && isFa && <p className="text-sm">{line.fa}</p>}
          <button type="button" onClick={() => speak(line.ro)} className="text-sm text-[#1554bd] underline">{isFa ? 'شنیدن این جمله' : 'Hear this line'}</button>
        </div>)}
      {isFa && <button type="button" onClick={() => setTranslation(v => !v)} className="text-sm text-[#1554bd] underline">{translation ? 'پنهان کردن فارسی' : 'نمایش فارسی'}</button>}
      <div><button type="button" onClick={() => move(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-bold">{isFa ? 'واژه و قاعده' : 'Explore the words'}</button></div>
    </section>}
    {phase === 1 && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
      <h2 className="text-xl font-bold">{isFa ? 'فقط نام وسیله را عوض کنید' : 'Change only the vehicle'}</h2>
      <p>{isFa ? 'از درس قبل «بلیت» را می‌شناسید. حالا با Este valabil și în …? دربارهٔ اعتبار آن سؤال کنید.' : 'You know “ticket” from the last lesson. Now ask whether it is valid with Este valabil și în …?'}</p>
      {([{ ro: 'Este valabil și în autobuz?', fa: 'در اتوبوس هم معتبر است؟', en: 'Is it also valid on the bus?' }, { ro: 'Este valabil și în tramvai?', fa: 'در تراموا هم معتبر است؟', en: 'Is it also valid on the tram?' }] as const).map(item => <div key={item.ro} className="rounded-xl bg-blue-50 p-4">
        <p lang="ro" dir="ltr" className="text-xl font-bold">{item.ro}</p><p className="text-sm">{isFa ? item.fa : item.en}</p>
        <button type="button" onClick={() => speak(item.ro)} className="text-sm text-[#1554bd] underline">{isFa ? 'بشنو و تکرار کن' : 'Listen and repeat'}</button>
      </div>)}
      <p className="text-sm text-slate-600">{isFa ? 'این یک تمرین پرسیدن است؛ اعتبار واقعی هر بلیت به نوع آن وابسته است و باید بررسی شود.' : 'This is a question practice. Actual validity depends on the travel product and should be checked.'}</p>
      <button type="button" onClick={() => move(2)} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-bold">{isFa ? 'یادآوری از حافظه' : 'Recall from memory'}</button>
    </section>}
    {(phase === 2 || phase === 3) && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
      <div className="text-sm font-bold text-[#1554bd]">{phase === 2 ? isFa ? 'یادآوری' : 'Recall' : isFa ? `گفت‌وگو ${round + 1} از ۳` : `Dialogue ${round + 1} of 3`}</div>
      <h2 className="text-xl font-bold">{vehicle === 'bus' ? isFa ? 'بپرسید در اتوبوس هم معتبر است؟' : 'Ask whether it is valid on the bus' : isFa ? 'بپرسید در تراموا هم معتبر است؟' : 'Ask whether it is valid on the tram'}</h2>
      {phase === 3 && <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-600">{isFa ? 'موقعیت' : 'Situation'}</p>
        <p>{vehicle === 'bus' ? isFa ? 'می‌خواهید از تراموا به اتوبوس بروید.' : 'You want to switch from the tram to a bus.' : isFa ? 'می‌خواهید از اتوبوس به تراموا بروید.' : 'You want to switch from the bus to a tram.'}</p>
      </div>}
      <form onSubmit={event => { event.preventDefault(); check(); }} className="space-y-3">
        <label htmlFor="surface-answer" className="block text-sm font-semibold">{isFa ? 'سؤال شما به رومانیایی' : 'Your question in Romanian'}</label>
        <input id="surface-answer" lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} className="w-full rounded-xl border border-slate-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1554bd]" />
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-semibold disabled:opacity-50">{isFa ? 'بررسی پاسخ' : 'Check answer'}</button>
          {voiceAvailable && <button type="button" onClick={listen} aria-pressed={listening} className="rounded-xl border border-[#1554bd] px-5 py-3 text-[#1554bd] font-semibold">{listening ? isFa ? 'پایان شنیدن' : 'Stop listening' : isFa ? '🎙️ پاسخ با صدا' : '🎙️ Answer by voice'}</button>}
          <button type="button" onClick={() => setHint(true)} className="rounded-xl border border-slate-300 px-5 py-3 text-[#1554bd] font-semibold">{isFa ? 'راهنما' : 'Hint'}</button>
        </div>
      </form>
      {listening && <p role="status" className="text-sm text-[#1554bd]">{isFa ? 'در حال شنیدن…' : 'Listening…'}</p>}
      {voiceMessage && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{voiceMessage}</p>}
      {hint && <p lang="ro" dir="ltr" className="rounded-xl bg-blue-50 p-3">Este valabil și în …?</p>}
      {feedback && <p role="status" className={`rounded-xl p-4 ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{feedback === 'correct' ? isFa ? 'درست است. یک بار با صدای بلند تکرار کنید.' : 'Correct. Say it aloud once.' : feedback === 'vehicle' ? isFa ? 'نام وسیله را عوض کنید: اتوبوس یا تراموا؟' : 'Switch the vehicle: bus or tram?' : isFa ? 'از الگوی «Este valabil și în …?» کمک بگیرید.' : 'Use the pattern “Este valabil și în …?”'}</p>}
      {feedback === 'correct' && <button type="button" onClick={next} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-bold">{phase === 3 && round === 2 ? isFa ? 'دیدن نتیجه' : 'See result' : isFa ? 'ادامه' : 'Continue'}</button>}
    </section>}
    {phase === 4 && <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
      <h2 className="text-2xl font-bold">{complete ? isFa ? 'توانستید دربارهٔ اتوبوس و تراموا سؤال کنید' : 'You asked about buses and trams' : isFa ? 'نتیجهٔ این نوبت هنوز آماده نیست' : 'This attempt is not complete yet'}</h2>
      <p>{complete ? isFa ? 'اگر وقت دارید، همین امروز به درس مترو بروید یا این گفت‌وگو را تکرار کنید.' : 'If you have time, continue to the metro lesson today or repeat this dialogue.' : isFa ? 'برای ثبت نتیجه، سه نوبت گفت‌وگو را انجام دهید.' : 'Complete three dialogue rounds to record this attempt.'}</p>
      <button type="button" onClick={() => { if (complete) { setComplete(false); move(0); } else move(3); }} className="rounded-xl border border-[#1554bd] px-5 py-3 font-bold text-[#1554bd]">{complete ? isFa ? 'تمرین دوباره' : 'Practise again' : isFa ? 'رفتن به گفت‌وگو' : 'Go to dialogue'}</button>
      {complete && <Link href="/learn-romanian/lectie/metrou" className="inline-block ms-3 rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'درس بعد: مترو' : 'Next: metro'}</Link>}
      <Link href="/learn-romanian" className="inline-block ms-3 text-[#1554bd] underline">{isFa ? 'همهٔ درس‌ها' : 'All lessons'}</Link>
    </section>}
    {priorCompletion && phase !== 4 && <p className="text-sm text-slate-500">{isFa ? 'این درس قبلاً روی همین دستگاه انجام شده است؛ می‌توانید دوباره تمرین کنید.' : 'You completed this lesson on this device; you can practise again.'}</p>}
    {audioMessage && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{audioMessage}</p>}
    <p className="text-xs text-slate-500">{isFa ? 'پخش به صدای رومانیایی مرورگر وابسته است. پاسخ صوتی به متن تبدیل می‌شود و کیفیت تلفظ نمره‌دهی نمی‌شود.' : 'Playback needs a Romanian browser voice. Spoken answers are transcribed; pronunciation is not graded.'}</p>
  </div>;
}
