'use client';

import { MeaningLines } from './MeaningLines';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { SpokenWordCheck } from './SpokenWordCheck';
import { PronunciationAudio } from './PronunciationAudio';
import { BASIC_CONSONANT_LETTERS, type BasicConsonantSlug } from '@/content/romanian/basic-consonants';
import { AlphabetStageNav } from './AlphabetStageNav';


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
  const [stage, setStage] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [written, setWritten] = React.useState(false);
  const [choice, setChoice] = React.useState<string | null>(null);
  const shown = letter ? items.filter(item => item.letter === letter) : items;
  const target = shown[0];
  const other = target.letter === 'z' ? 's' : 'z';
  const nextLetter = letter ? BASIC_CONSONANT_LETTERS[BASIC_CONSONANT_LETTERS.indexOf(letter) + 1] : undefined;
  const correct = answer.normalize('NFC').trim().toLocaleLowerCase('ro-RO') === target.word;

  return <div className="space-y-5" dir={isFa ? 'rtl' : 'ltr'}>
    <header className="dark-hero-panel rounded-3xl p-7 text-white sm:p-10">
      <p className="text-sm font-semibold text-blue-100">{isFa ? 'الفبا · حدود ۱۵ دقیقه' : 'Alphabet · about 15 minutes'}</p>
      <h1 className="mt-2 text-4xl font-extrabold" lang="ro" dir="ltr">{letter ? `${letter.toUpperCase()} ${letter}` : 'B D F L M N P T Z'}</h1>
      <p className="mt-3 text-sm leading-7 text-blue-50">{isFa ? 'نام حرف و آوای آن را جدا بشنوید، نمونه و قاعده را ببینید، سپس از حافظه بنویسید و بلند بگویید.' : 'Hear the letter name and sound separately, explore its word and rule, then write from memory and speak.'}</p>
    </header>
    <AlphabetStageNav lang={lang} stage={stage} onSelect={setStage} />
    {stage === 0 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold">{isFa ? 'نام حرف و آوای آن' : 'Letter name and sound'}</h2>
      <div className="grid gap-3 sm:grid-cols-2">{shown.map(item => <article key={item.letter} className="space-y-3 rounded-xl bg-blue-50 p-4">
        <p lang="ro" dir="ltr" className="text-3xl font-bold text-[#1554bd]">{item.letter.toUpperCase()} {item.letter}</p>
        <div><p className="text-sm font-semibold">{isFa ? `نام حرف: ${item.name}` : `Letter name: ${item.name}`}</p><PronunciationAudio currentLang={lang} label={item.name} /></div>
        <div><p className="text-sm font-semibold">{isFa ? `آوا در هجای ${item.sound}` : `Sound in the syllable ${item.sound}`}</p><PronunciationAudio currentLang={lang} label={item.sound} /></div>
        <div className="border-t border-blue-100 pt-3"><p lang="ro" dir="ltr" className="text-lg font-bold">{item.word}</p><MeaningLines en={item.en} fa={item.fa} lang={lang} className="text-sm" /><PronunciationAudio currentLang={lang} label={item.word} /></div>
      </article>)}</div>
      <button type="button" onClick={() => setStage(1)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'دیدن نمونه و قاعده' : 'Explore example and rule'}</button>
    </section>}
    {stage === 1 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold">{isFa ? 'واژه‌ها و قاعده' : 'Words and rule'}</h2>
      <p className="text-sm text-slate-600">{isFa ? 'جای حرف در هر واژه ممکن است آغاز، میانه یا پایان باشد.' : 'The letter may appear at the beginning, middle, or end of a word.'}</p>
      <div className="grid gap-3 sm:grid-cols-3">{shown.map(item => <article key={item.letter} className="space-y-2 rounded-xl bg-blue-50 p-4"><p lang="ro" dir="ltr" className="text-2xl font-bold">{item.word}</p><MeaningLines en={item.en} fa={item.fa} lang={lang} className="" /><PronunciationAudio currentLang={lang} label={item.word} /><p className="text-sm">{isFa ? item.ruleFa : item.ruleEn}</p><a href={item.source} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1554bd] underline">{isFa ? 'منبع واژه' : 'Word source'}</a></article>)}</div>
      <button type="button" onClick={() => setStage(2)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'نوشتن از حافظه' : 'Write from memory'}</button>
    </section>}
    {stage === 2 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold">{isFa ? `«${target.fa}» را به رومانیایی بنویسید` : `Write “${target.en}” in Romanian`}</h2>
      <form onSubmit={event => { event.preventDefault(); setChecked(true); if (correct) setWritten(true); }} className="flex flex-wrap gap-2"><input lang="ro" dir="ltr" aria-label={isFa ? 'پاسخ رومانیایی' : 'Romanian answer'} autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} className="rounded-xl border border-slate-300 p-3" /><button type="submit" disabled={!answer.trim()} className="rounded-xl bg-[#1554bd] px-4 py-2 text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></form>
      {checked && <p role="status" className={correct ? 'text-emerald-800' : 'text-amber-900'}>{correct ? isFa ? 'درست است.' : 'Correct.' : isFa ? 'املای واژه را در مرحلهٔ قبل بررسی کنید و دوباره بنویسید.' : 'Review the spelling in the previous stage and try again.'}</p>}
      <div className="rounded-xl bg-slate-50 p-4"><p>{isFa ? `در «${target.word}» کدام حرف را تمرین می‌کنید؟` : `Which letter appears in “${target.word}”?`}</p><div className="mt-2 flex gap-2" dir="ltr">{[other, target.letter].map(option => <button key={option} type="button" aria-pressed={choice === option} onClick={() => setChoice(option)} className={`rounded-lg border px-4 py-2 ${choice === option ? 'bg-[#1554bd] text-white' : 'border-slate-300'}`}>{option}</button>)}</div>{choice && <p role="status" className="mt-2">{choice === target.letter ? isFa ? 'درست است.' : 'Correct.' : isFa ? 'دوباره به واژه نگاه کنید.' : 'Look at the word again.'}</p>}</div>
      <button type="button" onClick={() => setStage(3)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'تمرین گفتاری' : 'Speaking practice'}</button>
    </section>}
    {stage === 3 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">{isFa ? 'واژه را بلند بگویید' : 'Say the word aloud'}</h2><p lang="ro" dir="ltr" className="text-2xl font-bold">{target.word}</p><PronunciationAudio currentLang={lang} label={target.word} /><SpokenWordCheck word={target.word} lang={lang} /><button type="button" onClick={() => setStage(4)} className="rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{isFa ? 'دیدن نتیجه' : 'See result'}</button></section>}
    {stage === 4 && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">{isFa ? 'نتیجه و مرور' : 'Result and review'}</h2><p>{written ? isFa ? 'واژه را درست نوشتید. هر زمان خواستید صدا و گفتار را تکرار کنید.' : 'You wrote the word correctly. Repeat listening and speaking whenever you like.' : isFa ? 'برای کامل کردن تمرین به مرحلهٔ نوشتن برگردید.' : 'Return to writing to complete the practice.'}</p><p className="text-sm text-slate-600">{isFa ? 'تطبیق متن گفتار، نمرهٔ صحت تلفظ نیست.' : 'A matching speech transcript is not a pronunciation score.'}</p><div className="flex flex-wrap gap-4 text-sm font-semibold text-[#1554bd]">{nextLetter && <Link href={`/learn-romanian/alfabet/${nextLetter}`} className="underline">{isFa ? 'درس بعدی:' : 'Next lesson:'} {nextLetter.toUpperCase()}</Link>}<Link href="/learn-romanian/alfabet" className="underline">{isFa ? 'همهٔ حروف' : 'All letters'}</Link></div><button type="button" onClick={() => setStage(0)} className="rounded-xl border border-[#1554bd] px-4 py-2 text-[#1554bd]">{isFa ? 'تکرار درس' : 'Repeat lesson'}</button></section>}
  </div>;
}
