'use client';

import React from 'react';
import { SpokenWordCheck } from './SpokenWordCheck';

const items = [
  { letter: 'b', word: 'bilet', fa: 'بلیت', en: 'ticket', ruleFa: 'اسم خنثی: un bilet، جمع bilete، مشخص biletul.', ruleEn: 'Neuter noun: un bilet, plural bilete, definite biletul.', source: 'https://dexonline.ro/definitie/bilet/paradigma' },
  { letter: 'd', word: 'card', fa: 'کارت', en: 'card', ruleFa: 'اسم خنثی: un card، جمع carduri، مشخص cardul. d در پایان واژه است.', ruleEn: 'Neuter noun: un card, plural carduri, definite cardul. d occurs at the end.', source: 'https://dexonline.ro/definitie/card/paradigma' },
  { letter: 'f', word: 'telefon', fa: 'تلفن', en: 'phone', ruleFa: 'اسم خنثی: un telefon، جمع telefoane، مشخص telefonul.', ruleEn: 'Neuter noun: un telefon, plural telefoane, definite telefonul.', source: 'https://dexonline.ro/definitie/telefon/paradigma' },
  { letter: 'l', word: 'elev', fa: 'دانش‌آموز', en: 'pupil', ruleFa: 'اسم مذکر: un elev، جمع elevi، مشخص elevul.', ruleEn: 'Masculine noun: un elev, plural elevi, definite elevul.', source: 'https://dexonline.ro/definitie/elev/paradigma' },
  { letter: 'm', word: 'masă', fa: 'میز', en: 'table', ruleFa: 'اسم مؤنث: o masă، جمع mese، مشخص masa.', ruleEn: 'Feminine noun: o masă, plural mese, definite masa.', source: 'https://dexonline.ro/definitie/mas%C4%83/paradigma' },
  { letter: 'n', word: 'ban', fa: 'سکه/واحد پول', en: 'coin / monetary unit', ruleFa: 'اسم مذکر: un ban، جمع bani، مشخص banul.', ruleEn: 'Masculine noun: un ban, plural bani, definite banul.', source: 'https://dexonline.ro/definitie/ban/paradigma' },
  { letter: 'p', word: 'apă', fa: 'آب', en: 'water', ruleFa: 'اسم مؤنث: apă، جمع ape، مشخص apa. p در میانهٔ واژه است.', ruleEn: 'Feminine noun: apă, plural ape, definite apa. p occurs in the middle.', source: 'https://dexonline.ro/definitie/ap%C4%83/paradigma' },
  { letter: 't', word: 'taxi', fa: 'تاکسی', en: 'taxi', ruleFa: 'اسم خنثی: un taxi، جمع taxiuri، مشخص taxiul.', ruleEn: 'Neuter noun: un taxi, plural taxiuri, definite taxiul.', source: 'https://dexonline.ro/definitie/taxi/paradigma' },
  { letter: 'z', word: 'zi', fa: 'روز', en: 'day', ruleFa: 'اسم مؤنث: o zi، جمع zile، مشخص ziua. z را با s اشتباه نگیرید.', ruleEn: 'Feminine noun: o zi, plural zile, definite ziua. Distinguish z from s.', source: 'https://dexonline.ro/definitie/zi/paradigma' },
] as const;

export function BasicConsonantPractice({ lang }: { lang: 'fa' | 'en' }) {
  const isFa = lang === 'fa';
  const [choice, setChoice] = React.useState<string | null>(null);
  const [audioNotice, setAudioNotice] = React.useState('');

  function speak(word: string) {
    const voice = window.speechSynthesis?.getVoices().find(v => v.lang.toLowerCase().startsWith('ro'));
    if (!voice) { setAudioNotice(isFa ? 'صدای رومانیایی مرورگر در دسترس نیست.' : 'A Romanian browser voice is unavailable.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.voice = voice; utterance.lang = 'ro-RO'; utterance.rate = 0.8;
    setAudioNotice(''); window.speechSynthesis.speak(utterance);
  }

  return <section className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-7 space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
    <h2 className="text-xl font-bold">{isFa ? '۹ همخوان ساده در واژه‌های کاربردی' : 'Nine basic consonants in useful words'}</h2>
    <p className="text-sm text-slate-700">{isFa ? 'هر حرف را در واژه ببینید؛ صدا را تکرار کنید و شناسنامهٔ واژه را بخوانید. جای حرف در این نمونه‌ها متفاوت است و محدود به آغاز واژه نیست.' : 'Find each letter in a word, repeat it, and open its grammar note. The target letter is not always word-initial.'}</p>
    <div className="grid gap-3 sm:grid-cols-3">{items.map(item => <article key={item.letter} className="rounded-xl bg-blue-50 p-4 space-y-2">
      <p lang="ro" dir="ltr" className="text-2xl font-bold">{item.letter.toUpperCase()} {item.letter} · {item.word}</p>
      <p>{isFa ? item.fa : item.en}</p>
      <button type="button" onClick={() => speak(item.word)} className="text-sm text-[#1554bd] underline">{isFa ? 'شنیدن با صدای مرورگر' : 'Hear browser voice'}</button>
      <details className="rounded-lg bg-white p-2 text-sm"><summary className="cursor-pointer font-semibold">{isFa ? 'قاعدهٔ واژه' : 'Word grammar'}</summary><p className="mt-2">{isFa ? item.ruleFa : item.ruleEn}</p><a href={item.source} target="_blank" rel="noopener noreferrer" className="text-[#1554bd] underline">{isFa ? 'منبع' : 'Source'}</a></details>
    </article>)}</div>
    {audioNotice && <p role="status" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{audioNotice}</p>}
    <SpokenWordCheck word="zi" lang={lang} />
    <div className="rounded-xl border border-slate-200 p-4 space-y-2"><h3 className="font-bold">{isFa ? 'یادآوری کوتاه' : 'Quick recall'}</h3><p>{isFa ? '«روز» با کدام حرف شروع می‌شود؟' : 'Which letter begins “day” (zi)?'}</p><div className="flex gap-2" dir="ltr">{['s', 'z'].map(letter => <button key={letter} type="button" aria-pressed={choice === letter} onClick={() => setChoice(letter)} className={`rounded-lg border px-4 py-2 ${choice === letter ? 'bg-[#1554bd] text-white' : 'border-slate-300'}`}>{letter}</button>)}</div>{choice && <p role="status">{choice === 'z' ? isFa ? 'درست است: zi با z آغاز می‌شود.' : 'Correct: zi begins with z.' : isFa ? 'به املای zi دوباره نگاه کنید.' : 'Look at the spelling of zi again.'}</p>}</div>
    <p className="text-xs text-slate-600">{isFa ? 'فایل صوتی ضبط‌شدهٔ بالای صفحه فقط نمونهٔ telefon است؛ پخش سایر واژه‌ها به صدای رومانیایی مرورگر نیاز دارد.' : 'The recorded clip above is only the telefon sample; the other words need a Romanian browser voice.'}</p>
  </section>;
}
