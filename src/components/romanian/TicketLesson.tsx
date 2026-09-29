'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';

type Locale = 'fa' | 'en';
type Phase = 0 | 1 | 2 | 3 | 4;
type Turn = { speaker: 'clerk' | 'you'; ro: string; en: string; fa: string };
type RomanianRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognitionWindow = Window & {
  SpeechRecognition?: new () => RomanianRecognition;
  webkitSpeechRecognition?: new () => RomanianRecognition;
};

const conversation: Turn[] = [
  { speaker: 'clerk', ro: 'Bună ziua! Un bilet sau două?', en: 'Hello! One ticket or two?', fa: 'سلام! یک بلیت یا دو تا؟' },
  { speaker: 'you', ro: 'Două bilete, vă rog.', en: 'Two tickets, please.', fa: 'دو بلیت، لطفاً.' },
  { speaker: 'clerk', ro: 'Poftiți.', en: 'Here you are.', fa: 'بفرمایید.' },
  { speaker: 'you', ro: 'Mulțumesc!', en: 'Thank you!', fa: 'ممنون!' },
];

const stages = {
  fa: ['مکالمه', 'کشف قاعده', 'یادآوری', 'گفت‌وگو', 'نتیجه'],
  en: ['Conversation', 'Discover', 'Recall', 'Dialogue', 'Result'],
};

function normalize(value: string) {
  return value.normalize('NFC').trim().toLocaleLowerCase('ro-RO')
    .replace(/[.!?،,]+$/g, '').replace(/\s+/g, ' ');
}

function errorKind(value: string, expected: 'one' | 'two'): 'number' | 'plural' | 'other' {
  const answer = normalize(value);
  if (expected === 'two') {
    if (/\bdoi\b/.test(answer)) return 'number';
    if (/\bdouă bilet\b/.test(answer)) return 'plural';
  } else if (/\bo bilet\b/.test(answer) || /\bdouă? bilet/.test(answer)) {
    return 'number';
  }
  return 'other';
}

const target = { one: 'Un bilet, vă rog.', two: 'Două bilete, vă rog.' } as const;
const wordNotes = [
  { ro: 'Bună ziua', en: 'Good day / hello', fa: 'سلام رسمی در روز', ruleEn: 'A daytime greeting. Bună agrees with feminine zi; ziua is the definite form of zi (day). Learn the whole expression as a greeting.', ruleFa: 'سلام رایج و مؤدبانه در روز؛ bună صفت مؤنثِ هماهنگ با zi («روز») است و ziua صورت مشخصِ zi است. کل عبارت را یک سلام یاد بگیرید.', source: 'https://dexonline.ro/definitie/zi' },
  { ro: 'un · două', en: 'one · two', fa: 'یک · دو', ruleEn: 'Bilet is neuter: un with the singular, două with the plural. Două is also used with feminine plural nouns; doi is used with masculine plural nouns.', ruleFa: 'bilet خنثی است: در مفرد un و در جمع două می‌آید. două با جمع مؤنث نیز می‌آید؛ doi برای جمع مذکر است.', source: 'https://dexonline.ro/definitie/doi' },
  { ro: 'bilet · bilete', en: 'ticket · tickets', fa: 'بلیت · بلیت‌ها', ruleEn: 'Neuter noun; indefinite singular un bilet, plural două bilete. Definite: biletul, biletele. The lesson practises indefinite forms.', ruleFa: 'اسم خنثی؛ مفرد نامشخص un bilet و جمع نامشخص două bilete. صورت مشخص: biletul و biletele. در این جلسه صورت نامشخص را تمرین می‌کنید.', source: 'https://dexonline.ro/definitie/bilet/paradigma' },
  { ro: 'sau', en: 'or', fa: 'یا', ruleEn: 'A conjunction joining alternatives: un bilet sau două? It does not change for gender or number.', ruleFa: 'حرف ربط میان دو گزینه: un bilet sau două؟ جنس و شمار نمی‌گیرد.', source: 'https://dexonline.ro/definitie/sau' },
  { ro: 'vă', en: 'you (polite/plural)', fa: 'شما را / به شما (ضمیر مؤدبانه یا جمع)', ruleEn: 'An unstressed second-person plural object pronoun. In vă rog it addresses one person politely or several people; it precedes rog.', ruleFa: 'ضمیر مفعولیِ بی‌تکیهٔ دوم‌شخص جمع است. در vă rog برای خطاب مؤدبانه به یک نفر یا خطاب به چند نفر می‌آید و پیش از rog قرار می‌گیرد.', source: 'https://dexonline.ro/definitie/v%C4%83' },
  { ro: 'rog', en: 'I ask / I request', fa: 'خواهش می‌کنم (صورت فعل)', ruleEn: 'First-person singular present of a ruga. Vă rog is a polite request (“please”); compare te rog for informal singular address.', ruleFa: 'اول‌شخص مفردِ زمان حال از فعل a ruga است. vă rog درخواست مؤدبانه («لطفاً») می‌سازد؛ برای خطاب خودمانی به یک نفر te rog می‌گوییم.', source: 'https://dexonline.ro/definitie/ruga/paradigma' },
  { ro: 'Poftiți', en: 'Here you are / please', fa: 'بفرمایید', ruleEn: 'A polite imperative of a pofti for one respectfully addressed person or several people. Here the clerk offers the tickets; context gives the meaning.', ruleFa: 'وجه امریِ مؤدبانه از a pofti برای یک مخاطب محترمانه یا چند نفر است. اینجا فروشنده هنگام دادن بلیت می‌گوید «بفرمایید».', source: 'https://dexonline.ro/definitie/pofti%C8%9Bi' },
  { ro: 'Mulțumesc', en: 'Thank you', fa: 'سپاسگزارم', ruleEn: 'First-person singular present of a mulțumi, used on its own as “thank you”. This verb does not change with the listener’s formality.', ruleFa: 'اول‌شخص مفردِ زمان حال از a mulțumi است و به‌تنهایی معنی «متشکرم» می‌دهد. صورت این فعل با رسمی یا خودمانی بودن مخاطب عوض نمی‌شود.', source: 'https://dexonline.ro/definitie/mul%C8%9Bumi/paradigma' },
] as const;
const microTasks = [
  { fa: 'یک بلیت می‌خواهید. کدام عبارت درست است؟', en: 'You need one ticket. Which phrase is correct?', choices: ['Un bilet', 'O bilet', 'Un bilete'], answer: 'Un bilet', explanationFa: 'اسم خنثی در مفرد با un می‌آید و اسم به صورت bilet می‌ماند.', explanationEn: 'A neuter singular uses un and the singular bilet.' },
  { fa: 'دو بلیت می‌خواهید. کدام عبارت درست است؟', en: 'You need two tickets. Which phrase is correct?', choices: ['Doi bilete', 'Două bilet', 'Două bilete'], answer: 'Două bilete', explanationFa: 'اسم خنثی در جمع با două می‌آید و bilet به bilete تبدیل می‌شود.', explanationEn: 'A neuter plural uses două and the plural bilete.' },
] as const;
const progressKey = 'dorvia:romanian:ticket-lesson:v1';

export function TicketLesson({ lang }: { lang: Locale }) {
  const isFa = lang === 'fa';
  const [phase, setPhase] = React.useState<Phase>(0);
  const [showTranslation, setShowTranslation] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'number' | 'plural' | 'other' | null>(null);
  const [hint, setHint] = React.useState(false);
  const [task, setTask] = React.useState(0);
  const [mistakes, setMistakes] = React.useState<string[]>([]);
  const [finishedOn, setFinishedOn] = React.useState<string | null>(null);
  const [sessionComplete, setSessionComplete] = React.useState(false);
  const [voiceAvailable, setVoiceAvailable] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [voiceMessage, setVoiceMessage] = React.useState('');
  const [microRound, setMicroRound] = React.useState(0);
  const [microChoice, setMicroChoice] = React.useState<string | null>(null);
  const recognitionRef = React.useRef<RomanianRecognition | null>(null);

  React.useEffect(() => {
    const recognitionWindow = window as RecognitionWindow;
    setVoiceAvailable(Boolean(recognitionWindow.SpeechRecognition || recognitionWindow.webkitSpeechRecognition));
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || 'null');
      if (saved && typeof saved.completedOn === 'string') setFinishedOn(saved.completedOn);
    } catch { /* Browsing still works without device storage. */ }
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speak(ro: string) {
    if (!('speechSynthesis' in window)) { setAudioError(true); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ro);
    utterance.lang = 'ro-RO';
    utterance.rate = 0.82;
    const voices = window.speechSynthesis.getVoices();
    const romanianVoice = voices.find(v => v.lang.toLowerCase().startsWith('ro'));
    if (!romanianVoice) { setAudioError(true); return; }
    utterance.voice = romanianVoice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); setAudioError(true); };
    setAudioError(false);
    window.speechSynthesis.speak(utterance);
  }

  function move(next: Phase) {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setListening(false);
    setVoiceMessage('');
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setPhase(next);
    setAnswer('');
    setFeedback(null);
    setHint(false);
    setTask(0);
    setMicroRound(0);
    setMicroChoice(null);
  }

  const expected: 'one' | 'two' = phase === 2 ? 'two' : task === 2 ? 'one' : 'two';
  function check(raw = answer) {
    const submitted = normalize(raw);
    if (!submitted) return;
    const valid = expected === 'two'
      ? ['două bilete', 'două bilete, vă rog'].includes(submitted)
      : ['un bilet', 'un bilet, vă rog'].includes(submitted);
    if (valid) { setFeedback('correct'); return; }
    const kind = errorKind(raw, expected);
    setFeedback(kind);
    setMistakes(old => old.includes(kind) ? old : [...old, kind]);
  }

  function listen() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognitionWindow = window as RecognitionWindow;
    const Recognition = recognitionWindow.SpeechRecognition || recognitionWindow.webkitSpeechRecognition;
    if (!Recognition) return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setVoiceMessage('');
    setFeedback(null);
    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = 'ro-RO';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = event => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setAnswer(transcript);
        check(transcript);
      }
    };
    recognition.onerror = event => {
      if (event.error === 'aborted') return;
      const messages: Record<string, [string, string]> = {
        'not-allowed': ['مرورگر اجازهٔ استفاده از میکروفون را نداد. مجوز سایت و Windows را بررسی کنید.', 'The browser denied microphone access. Check the site and Windows permissions.'],
        'service-not-allowed': ['میکروفون ممکن است مجاز باشد، اما سرویس تشخیص گفتار مرورگر در دسترس نیست. اتصال اینترنت یا تنظیمات مرورگر را بررسی کنید.', 'The microphone may be allowed, but the browser speech service is unavailable. Check your connection or browser settings.'],
        'audio-capture': ['مرورگر به میکروفون انتخاب‌شده دسترسی ندارد. دستگاه ورودی را در تنظیمات Chrome بررسی کنید.', 'The browser cannot capture audio from the selected microphone. Check the input device in Chrome settings.'],
        network: ['ارتباط با سرویس تشخیص گفتار برقرار نشد. اتصال اینترنت را بررسی کنید.', 'Could not reach the speech recognition service. Check your internet connection.'],
        'no-speech': ['صدایی شنیده نشد. دوباره صحبت کنید یا پاسخ را تایپ کنید.', 'No speech was detected. Try speaking again or type your answer.'],
      };
      const message = messages[event.error] || ['تشخیص گفتار انجام نشد. دوباره تلاش کنید یا پاسخ را تایپ کنید.', 'Speech recognition failed. Try again or type your answer.'];
      setVoiceMessage(`${message[isFa ? 0 : 1]} (${event.error})`);
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    try {
      recognition.start();
      setListening(true);
    } catch {
      recognitionRef.current = null;
      setVoiceMessage(isFa ? 'میکروفون آغاز نشد. می‌توانید پاسخ را تایپ کنید.' : 'The microphone could not start. You can type your answer.');
    }
  }

  function advanceTask() {
    setFeedback(null);
    setAnswer('');
    setHint(false);
    if (phase === 2) move(3);
    else if (task < 2) setTask(task + 1);
    else finish();
  }

  function finish() {
    const completedOn = new Date().toISOString().slice(0, 10);
    try { localStorage.setItem(progressKey, JSON.stringify({ completedOn, mistakes })); } catch { /* optional device state */ }
    setFinishedOn(completedOn);
    setSessionComplete(true);
    move(4);
  }

  const feedbackText = feedback === 'correct'
    ? isFa ? 'درست است. جمله را یک بار با صدای بلند بگویید.' : 'Correct. Say the sentence aloud once.'
    : feedback === 'number'
      ? isFa ? '«بلیت» خنثی است: un bilet → două bilete. عدد را دوباره انتخاب کنید.' : 'Ticket is neuter: un bilet → două bilete. Try the number again.'
      : feedback === 'plural'
        ? isFa ? 'عدد درست است. خود اسم هم جمع می‌شود: bilete.' : 'The number is right. The noun also changes to bilete.'
        : isFa ? 'یک بار دیگر به سؤال گوش دهید یا راهنمای مرحله‌ای را باز کنید.' : 'Listen again or open the step-by-step hint.';

  return (
    <div className="space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
      <header className="dark-hero-panel rounded-3xl px-6 py-8 sm:p-10 text-white space-y-3">
        <span className="text-sm font-semibold text-blue-100">{isFa ? 'درس تعاملی پایه · حدود ۱۵ دقیقه' : 'Foundation practice · about 15 minutes'}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold">{isFa ? 'یک بلیت یا دو بلیت؟' : 'One ticket or two?'}</h1>
        <p className="text-base text-slate-200 leading-relaxed max-w-2xl">
          {isFa ? 'در باجه بلیت، سؤال فروشنده را بفهمید و خودتان پاسخ بدهید.' : 'At a ticket counter, understand the clerk and answer for yourself.'}
        </p>
      </header>

      <nav aria-label={isFa ? 'مراحل درس؛ برای جابه‌جایی انتخاب کنید' : 'Lesson stages; select to navigate'} className="flex flex-wrap gap-2">
        {stages[lang].map((label, i) => <button key={label} type="button" onClick={() => move(i as Phase)} aria-current={phase === i ? 'step' : undefined}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd] ${phase === i ? 'bg-[#1554bd] text-white' : i < phase ? 'bg-blue-50 text-[#1554bd] hover:bg-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          {isFa ? '۰۱۲۳۴۵۶۷۸۹'[i + 1] : i + 1}. {label}
        </button>)}
      </nav>

      {phase === 0 && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
        <h2 className="text-xl font-bold">{isFa ? 'ابتدا گفت‌وگو را بشنوید' : 'First, listen to the conversation'}</h2>
        <p className="text-base text-slate-700">{isFa ? 'برای خودتان و یک همراه بلیت می‌خواهید. فروشنده می‌پرسد چند بلیت؟' : 'You need tickets for yourself and a companion. The clerk asks how many.'}</p>
        <button type="button" onClick={() => speak(conversation.map(t => t.ro).join(' '))} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-semibold">
          {speaking ? isFa ? 'در حال پخش…' : 'Playing…' : isFa ? 'شنیدن گفت‌وگو' : 'Play conversation'}
        </button>
        {audioError && <p role="status" className="text-sm text-amber-900 bg-amber-50 p-3 rounded-lg">{isFa ? 'صدای رومانیایی در این مرورگر در دسترس نیست؛ متن درس و تمرین‌ها همچنان قابل استفاده‌اند.' : 'A Romanian voice is unavailable in this browser. You can still use the lesson and exercises.'}</p>}
        <div className="space-y-3">
          {conversation.map((turn, i) => <div key={i} className={`rounded-xl p-4 ${turn.speaker === 'you' ? 'bg-blue-50' : 'bg-slate-50'}`}>
            <div className="text-sm font-bold text-[#1554bd]">{turn.speaker === 'you' ? isFa ? 'شما' : 'You' : isFa ? 'فروشنده' : 'Clerk'}</div>
            <div dir="ltr" lang="ro" className="text-lg font-bold text-slate-900">{turn.ro}</div>
            <div dir="ltr" lang="en" className="text-sm text-slate-600">{turn.en}</div>
            {showTranslation && <div lang="fa" dir="rtl" className="text-sm text-slate-700 mt-1">{turn.fa}</div>}
            <button type="button" onClick={() => speak(turn.ro)} className="text-sm text-[#1554bd] underline mt-2">{isFa ? 'شنیدن این جمله' : 'Hear this line'}</button>
          </div>)}
        </div>
        {isFa && <button type="button" onClick={() => setShowTranslation(v => !v)} className="text-sm text-[#1554bd] underline">{showTranslation ? 'پنهان‌کردن ترجمه فارسی' : 'نمایش ترجمه فارسی'}</button>}
        <div><button type="button" onClick={() => move(1)} className="rounded-xl bg-[#1554bd] px-6 py-3 text-white font-bold">{isFa ? 'واژه و قاعده' : 'Explore the rule'}</button></div>
      </section>}

      {phase === 1 && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
        <h2 className="text-xl font-bold">{isFa ? 'از یک به دو چه چیزی عوض می‌شود؟' : 'What changes from one to two?'}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {(['Un bilet', 'Două bilete'] as const).map((ro, i) => <div key={ro} className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-2">
            <div dir="ltr" lang="ro" className="text-2xl font-extrabold">{ro}</div>
            <p dir="ltr" lang="en" className="text-sm">{i ? 'Two tickets' : 'One ticket'}</p>
            {isFa && <p>{i ? 'دو بلیت' : 'یک بلیت'}</p>}
            <button type="button" onClick={() => speak(ro)} className="text-sm font-semibold text-[#1554bd] underline">{isFa ? 'شنیدن و تکرار' : 'Listen and repeat'}</button>
          </div>)}
        </div>
        <p className="text-base leading-relaxed text-slate-800">{isFa
          ? 'bilet اسم خنثی است: برای یکی un bilet و برای دو تا două bilete می‌گوییم. هم عدد و هم پایان اسم تغییر می‌کند.'
          : 'Bilet is a neuter noun: un bilet for one, două bilete for two. Both the number and the noun change.'}</p>
        <details className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed"><summary className="cursor-pointer font-semibold">{isFa ? 'شناسنامه واژه و صورت‌های مشخص' : 'Word reference and definite forms'}</summary>
          <p className="mt-2" dir="ltr" lang="ro">bilet (neuter) · bilet / bilete · biletul / biletele</p>
          <p className="mt-1">{isFa ? 'صورت‌های مشخص در درس دیگری تمرین می‌شوند.' : 'The definite forms are practised in a later lesson.'}</p>
        </details>
        <div className="space-y-3">
          <h3 className="font-bold text-lg">{isFa ? 'شناسنامهٔ واژه‌های همین گفت‌وگو' : 'Every word in this dialogue'}</h3>
          <p className="text-sm text-slate-600">{isFa ? 'هر مورد را باز کنید و نقش آن را در جمله ببینید. صورت‌های فراتر از تمرین امروز برای شناخت آمده‌اند.' : 'Open each note to see its role in the sentence. Extra forms are for reference, not today’s quiz.'}</p>
          <div className="grid gap-3 sm:grid-cols-2">{wordNotes.map(note => <details key={note.ro} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <summary className="cursor-pointer font-semibold"><span lang="ro" dir="ltr" className="inline-block">{note.ro}</span> · {isFa ? note.fa : note.en}</summary>
            <p className="mt-3 leading-relaxed">{isFa ? note.ruleFa : note.ruleEn}</p>
            <a href={note.source} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[#1554bd] underline">{isFa ? 'منبع واژه' : 'Word source'}</a>
          </details>)}</div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
          <h3 className="font-bold">{isFa ? `تمرین کوتاه ${microRound + 1} از ۲` : `Short practice ${microRound + 1} of 2`}</h3>
          <p>{isFa ? microTasks[microRound].fa : microTasks[microRound].en}</p>
          <div className="flex flex-wrap gap-2" lang="ro" dir="ltr">{microTasks[microRound].choices.map(choice => <button key={choice} type="button" aria-pressed={microChoice === choice} onClick={() => setMicroChoice(choice)} className={`rounded-lg border px-4 py-2 font-semibold ${microChoice === choice ? 'border-[#1554bd] bg-[#1554bd] text-white' : 'border-blue-200 bg-white text-slate-900'}`}>{choice}</button>)}</div>
          {microChoice && <p role="status" className="text-sm">{microChoice === microTasks[microRound].answer ? isFa ? 'درست است. ' : 'Correct. ' : isFa ? 'یک بار دیگر دقت کنید: ' : 'Try again: '}{isFa ? microTasks[microRound].explanationFa : microTasks[microRound].explanationEn}</p>}
          {microChoice === microTasks[microRound].answer && (microRound === 0 ? <button type="button" onClick={() => { setMicroRound(1); setMicroChoice(null); }} className="rounded-xl bg-[#1554bd] px-5 py-2 text-white font-bold">{isFa ? 'تمرین بعدی' : 'Next practice'}</button> : <button type="button" onClick={() => move(2)} className="rounded-xl bg-[#1554bd] px-5 py-2 text-white font-bold">{isFa ? 'حالا از حافظه بگو' : 'Recall it now'}</button>)}
        </div>
      </section>}

      {(phase === 2 || phase === 3) && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5">
        <div className="text-sm font-bold text-[#1554bd]">{phase === 2 ? isFa ? 'تمرین واژه و جمع' : 'Recall the noun and plural' : isFa ? `مکالمه ${task + 1} از ۳` : `Dialogue ${task + 1} of 3`}</div>
        <h2 className="text-xl font-bold">{phase === 2
          ? isFa ? '«دو بلیت، لطفاً» را به رومانیایی بنویسید' : 'Write “Two tickets, please” in Romanian'
          : task === 2 ? isFa ? 'این بار تنها هستید. به فروشنده پاسخ دهید.' : 'This time you are alone. Answer the clerk.'
          : isFa ? 'برای خود و همراهتان به فروشنده پاسخ دهید.' : 'Answer the clerk for yourself and a companion.'}</h2>
        {phase === 3 && <div className="rounded-xl bg-slate-50 p-4 space-y-2">
          <p className="text-sm text-slate-600">{isFa ? 'فروشنده' : 'Clerk'}</p>
          <p lang="ro" dir="ltr" className="text-lg font-semibold">{task === 1 ? 'Bună ziua. Un bilet sau două?' : 'Un bilet sau două?'}</p>
          <button type="button" onClick={() => speak('Un bilet sau două?')} className="text-sm text-[#1554bd] underline">{isFa ? 'شنیدن سؤال' : 'Hear the question'}</button>
        </div>}
        <form onSubmit={e => { e.preventDefault(); check(); }} className="space-y-3">
          <label htmlFor="ticket-answer" className="block text-sm font-semibold">{isFa ? 'پاسخ شما به رومانیایی' : 'Your answer in Romanian'}</label>
          <input id="ticket-answer" lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={e => { setAnswer(e.target.value); setFeedback(null); }}
            className="w-full rounded-xl border border-slate-300 p-3 text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1554bd]" />
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-semibold disabled:opacity-50">{isFa ? 'بررسی پاسخ' : 'Check answer'}</button>
            {voiceAvailable && <button type="button" onClick={listen} aria-pressed={listening} className="rounded-xl border border-[#1554bd] px-5 py-3 text-[#1554bd] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd]">
              {listening ? isFa ? 'پایان شنیدن' : 'Stop listening' : isFa ? '🎙️ پاسخ با صدا' : '🎙️ Answer by voice'}
            </button>}
            <button type="button" onClick={() => setHint(true)} className="rounded-xl border border-slate-300 px-5 py-3 text-[#1554bd] font-semibold">{isFa ? 'راهنمای مرحله‌ای' : 'Show a hint'}</button>
          </div>
        </form>
        {listening && <p role="status" className="text-sm text-[#1554bd]">{isFa ? 'در حال شنیدن پاسخ رومانیایی شما…' : 'Listening for your Romanian answer…'}</p>}
        {voiceMessage && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{voiceMessage}</p>}
        {voiceAvailable && <p className="text-xs text-slate-600">{isFa ? 'با اجازهٔ شما، تشخیص گفتار مرورگر متن پاسخ را می‌نویسد و همان تمرین بررسی می‌شود. این بخش کیفیت تلفظ را نمره‌دهی نمی‌کند.' : 'With your permission, browser speech recognition transcribes your answer and checks the same exercise. It does not grade pronunciation.'}</p>}
        {hint && <p className="rounded-xl bg-blue-50 p-3 text-base" dir="ltr" lang="ro">{expected === 'two' ? 'Două …, vă rog.' : 'Un …, vă rog.'}</p>}
        {feedback && <div role="status" className={`rounded-xl p-4 text-base ${feedback === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{feedbackText}</div>}
        {feedback === 'correct' && <button type="button" onClick={advanceTask} className="rounded-xl bg-[#1554bd] px-5 py-3 text-white font-semibold">{phase === 3 && task === 2 ? isFa ? 'پایان جلسه' : 'Finish lesson' : isFa ? 'ادامه' : 'Continue'}</button>}
      </section>}

      {phase === 4 && <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
        <h2 className="text-2xl font-bold">{sessionComplete ? isFa ? 'توانستید یک یا دو بلیت بخواهید' : 'You asked for one or two tickets' : isFa ? 'نتیجهٔ این نوبت هنوز آماده نیست' : 'This attempt is not complete yet'}</h2>
        <p className="text-base">{sessionComplete
          ? isFa ? 'برای ماندگاری بهتر، فردا همین تغییر از یک به دو را با واژه‌ای دیگر تمرین کنید.' : 'For better recall, practise changing one to two with a different noun tomorrow.'
          : isFa ? 'پس از پاسخ‌دادن به سه نوبت گفت‌وگو، نتیجهٔ این نوبت ثبت می‌شود. می‌توانید هر مرحله را هر چند بار بخواهید تکرار کنید.' : 'Answer all three dialogue rounds to complete this attempt. You can repeat any stage as often as you like.'}</p>
        {sessionComplete && mistakes.length > 0 && <p className="rounded-xl bg-blue-50 p-4 text-sm">{isFa ? 'برای مرور بعدی، روی این بخش‌ها بیشتر کار کنید: ' : 'Focus your next review on: '}{mistakes.map(m => m === 'number' ? isFa ? 'عدد مناسب اسم خنثی' : 'neuter number' : m === 'plural' ? isFa ? 'صورت جمع اسم' : 'noun plural' : isFa ? 'ساخت جمله' : 'sentence building').join('، ')}</p>}
        {sessionComplete && <p className="text-sm text-slate-600">{isFa ? 'اتمام این جلسه فقط روی همین دستگاه ذخیره می‌شود.' : 'Completion is saved on this device only.'}</p>}
        <button type="button" onClick={() => { if (sessionComplete) { setMistakes([]); setSessionComplete(false); move(0); } else move(3); }} className="rounded-xl border border-[#1554bd] px-5 py-3 font-semibold text-[#1554bd]">{sessionComplete ? isFa ? 'تمرین دوباره' : 'Practise again' : isFa ? 'رفتن به گفت‌وگو' : 'Go to dialogue'}</button>
        {sessionComplete && <Link href="/learn-romanian/lectie/autobuz-tramvai" className="inline-block ms-3 rounded-xl bg-[#1554bd] px-5 py-3 font-semibold text-white">{isFa ? 'درس بعد: اتوبوس و تراموا' : 'Next: bus and tram'}</Link>}
        <Link href="/learn-romanian" className="inline-block ms-3 text-[#1554bd] underline">{isFa ? 'همهٔ درس‌ها' : 'All lessons'}</Link>
        {sessionComplete && <p className="text-sm text-slate-600">{isFa ? '۱۵ دقیقه فقط زمان پیشنهادی هر جلسه است. می‌توانید همین امروز درس دیگری بخوانید یا هر یک از مراحل را دوباره تمرین کنید.' : 'Fifteen minutes is only a suggested session length. You can study another lesson today or repeat any stage.'}</p>}
      </section>}
      {finishedOn && phase !== 4 && <p className="text-sm text-slate-500">{isFa ? 'این جلسه قبلاً روی همین دستگاه انجام شده است؛ می‌توانید دوباره تمرین کنید.' : 'You completed this lesson on this device; you can practise again.'}</p>}
      <p className="text-xs text-slate-500">{isFa ? 'پخش صوت به صدای رومانیایی مرورگر وابسته است. پاسخ صوتی، در مرورگرهای پشتیبانی‌شده، به متن تبدیل می‌شود؛ ارزیابی تلفظ در این نمونه وجود ندارد.' : 'Audio playback needs a Romanian browser voice. Supported browsers can transcribe spoken answers; this sample does not assess pronunciation.'}</p>
    </div>
  );
}
