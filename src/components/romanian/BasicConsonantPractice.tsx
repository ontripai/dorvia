'use client';

import React from 'react';
import { SpokenWordCheck } from './SpokenWordCheck';
import { PronunciationAudio } from './PronunciationAudio';
import type { BasicConsonantSlug } from '@/content/romanian/basic-consonants';


const items = [
  { letter: 'b', name: 'be', sound: 'ba', word: 'bilet', fa: 'بلیت', en: 'ticket', ruleFa: 'اسم خنثی: un bilet، جمع bilete، مشخص biletul.', ruleEn: 'Neuter noun: un bilet, plural bilete, definite biletul.', source: 'https://dexonline.ro/definitie/bilet/paradigma' },
  { letter: 'd', name: 'de', sound: 'da', word: 'card', fa: 'کارت', en: 'card', ruleFa: 'اسم خنثی: un card، جمع carduri، مشخص cardul. d در پایان واژه است.', ruleEn: 'Neuter noun: un card, plural carduri, definite cardul. d occurs at the end.', source: 'https://dexonline.ro/definitie/card/paradigma' },
  { letter: 'f', name: 'ef', sound: 'fa', word: 'telefon', fa: 'تلفن', en: 'phone', ruleFa: 'اسم خنثی: un telefon، جمع telefoane، مشخص telefonul.', ruleEn: 'Neuter noun: un telefon, plural telefoane, definite telefonul.', source: 'https://dexonline.ro/definitie/telefon/paradigma' },
  { letter: 'l', name: 'el', sound: 'la', word: 'elev', fa: 'دانش‌آموز', en: 'pupil', ruleFa: 'اسم مذکر: un elev، جمع elevi، مشخص elevul.', ruleEn: 'Masculine noun: un elev, plural elevi, definite elevul.', source: 'https://dexonline.ro/definitie/elev/paradigma' },
  { letter: 'm', name: 'em', sound: 'ma', word: 'masă', fa: 'میز', en: 'table', ruleFa: 'اسم مؤنث: o masă، جمع mese، مشخص masa.', ruleEn: 'Feminine noun: o masă, plural mese, definite masa.', source: 'https://dexonline.ro/definitie/mas%C4%83/paradigma' },
  { letter: 'n', name: 'en', sound: 'na', word: 'ban', fa: 'سکه/واحد پول', en: 'coin / monetary unit', ruleFa: 'اسم مذکر: un ban، جمع bani، مشخص banul.', ruleEn: 'Masculine noun: un ban, plural bani, definite banul.', source: 'https://dexonline.ro/definitie/ban/paradigma' },
  { letter: 'p', name: 'pe', sound: 'pa', word: 'apă', fa: 'آب', en: 'water', ruleFa: 'اسم مؤنث: apă، جمع ape، مشخص apa. p در میانهٔ واژه است.', ruleEn: 'Feminine noun: apă, plural ape, definite apa. p occurs in the middle.', source: 'https://dexonline.ro/definitie/ap%C4%83/paradigma' },
  { letter: 't', name: 'te', sound: 'ta', word: 'taxi', fa: 'تاکسی', en: 'taxi', ruleFa: 'اسم خنثی: un taxi، جمع taxiuri، مشخص taxiul.', ruleEn: 'Neuter noun: un taxi, plural taxiuri, definite taxiul.', source: 'https://dexonline.ro/definitie/taxi/paradigma' },
  { letter: 'z', name: 'zet', sound: 'za', word: 'zi', fa: 'روز', en: 'day', ruleFa: 'اسم مؤنث: o zi، جمع zile، مشخص ziua. z را با s اشتباه نگیرید.', ruleEn: 'Feminine noun: o zi, plural zile, definite ziua. Distinguish z from s.', source: 'https://dexonline.ro/definitie/zi/paradigma' },
] as const;

export function BasicConsonantPractice({ lang, letter }: { lang: 'fa' | 'en'; letter?: BasicConsonantSlug }) {
  const isFa = lang === 'fa';
  const [choice, setChoice] = React.useState<string | null>(null);
  const shown = letter ? items.filter(item => item.letter === letter) : items;
  const target = shown[0];
  const other = target.letter === 'z' ? 's' : 'z';

  return <section className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-7 space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
    <h2 className="text-xl font-bold">{letter ? (isFa ? `حرف ${letter.toUpperCase()} در واژهٔ رومانیایی` : `Romanian letter ${letter.toUpperCase()} in a word`) : (isFa ? '۹ همخوان ساده در واژه‌های کاربردی' : 'Nine basic consonants in useful words')}</h2>
    <p className="text-sm text-slate-700">{isFa ? 'هر حرف را در واژه ببینید؛ صدا را تکرار کنید و شناسنامهٔ واژه را بخوانید. جای حرف در این نمونه‌ها متفاوت است و محدود به آغاز واژه نیست.' : 'Find each letter in a word, repeat it, and open its grammar note. The target letter is not always word-initial.'}</p>
    <div className="grid gap-3 sm:grid-cols-3">{shown.map(item => <article key={item.letter} className="rounded-xl bg-blue-50 p-4 space-y-2">
      <p lang="ro" dir="ltr" className="text-2xl font-bold">{item.letter.toUpperCase()} {item.letter} · {item.word}</p>
      <p>{isFa ? item.fa : item.en}</p>
      <div className="flex flex-wrap items-center gap-2"><span lang="ro" dir="ltr" className="text-xs text-slate-600">{isFa ? `نام حرف: ${item.name}` : `Letter name: ${item.name}`}</span><PronunciationAudio currentLang={lang} label={item.name} /></div>
      <div className="flex flex-wrap items-center gap-2"><span lang="ro" dir="ltr" className="text-xs text-slate-600">{isFa ? `آوای حرف در هجای کوتاه: ${item.sound}` : `Letter sound in a short syllable: ${item.sound}`}</span><PronunciationAudio currentLang={lang} label={item.sound} /></div>
      <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-slate-600">{isFa ? 'شنیدن واژهٔ نمونه' : 'Hear the example word'}</span><PronunciationAudio currentLang={lang} label={item.word} /></div>
      <details className="rounded-lg bg-white p-2 text-sm"><summary className="cursor-pointer font-semibold">{isFa ? 'قاعدهٔ واژه' : 'Word grammar'}</summary><p className="mt-2">{isFa ? item.ruleFa : item.ruleEn}</p><a href={item.source} target="_blank" rel="noopener noreferrer" className="text-[#1554bd] underline">{isFa ? 'منبع' : 'Source'}</a></details>
    </article>)}</div>
    <SpokenWordCheck word={target.word} lang={lang} />
    <div className="rounded-xl border border-slate-200 p-4 space-y-2"><h3 className="font-bold">{isFa ? 'یادآوری کوتاه' : 'Quick recall'}</h3><p>{isFa ? `در «${target.word}» کدام حرف را تمرین می‌کنید؟` : `Which letter are you practising in “${target.word}”?`}</p><div className="flex gap-2" dir="ltr">{[other, target.letter].map(option => <button key={option} type="button" aria-pressed={choice === option} onClick={() => setChoice(option)} className={`rounded-lg border px-4 py-2 ${choice === option ? 'bg-[#1554bd] text-white' : 'border-slate-300'}`}>{option}</button>)}</div>{choice && <p role="status">{choice === target.letter ? isFa ? `درست است: ${target.letter} در ${target.word} دیده می‌شود.` : `Correct: ${target.letter} appears in ${target.word}.` : isFa ? `به املای ${target.word} دوباره نگاه کنید.` : `Look at the spelling of ${target.word} again.`}</p>}</div>
    <p className="text-xs text-slate-600">{isFa ? 'این‌ها واژه‌های کامل‌اند تا صدای همخوان در بافت شنیده شود؛ فایل گویندهٔ تأییدشده نیستند.' : 'These full words let you hear consonants in context; they are not verified speaker recordings.'}</p>
  </section>;
}
