'use client';

import React from 'react';
import { SpokenWordCheck } from './SpokenWordCheck';

const lessons = {
  j: { word: 'ajutor', fa: 'کمک', en: 'help', ruleFa: 'اسم خنثی: un ajutor، جمع ajutoare، مشخص ajutorul. j در میانه صدای «ژ» دارد.', ruleEn: 'Neuter noun: un ajutor, plural ajutoare, definite ajutorul. Medial j has the zh sound.', source: 'https://dexonline.ro/definitie/ajutor/paradigma' },
  r: { word: 'rece', fa: 'سرد', en: 'cold', ruleFa: 'صفت؛ مفرد مذکر/مؤنث rece و جمع reci. r در آغاز واژه است.', ruleEn: 'Adjective; singular rece for masculine/feminine and plural reci. r is word-initial.', source: 'https://dexonline.ro/definitie/rece' },
  v: { word: 'vamă', fa: 'گمرک', en: 'customs', ruleFa: 'اسم مؤنث: o vamă، جمع vămi، مشخص vama. v در آغاز واژه است.', ruleEn: 'Feminine noun: o vamă, plural vămi, definite vama. v is word-initial.', source: 'https://dexonline.ro/definitie/vam%C4%83/paradigma' },
  h: { word: 'hartă', fa: 'نقشه', en: 'map', ruleFa: 'اسم مؤنث: o hartă، جمع hărți، مشخص harta. h در این واژه شنیده می‌شود؛ در che/ghi صدای جدا ندارد.', ruleEn: 'Feminine noun: o hartă, plural hărți, definite harta. h is audible here; in che/ghi it has no separate sound.', source: 'https://dexonline.ro/definitie/hart%C4%83/paradigma' },
  s: { word: 'casă', fa: 'خانه', en: 'house', ruleFa: 'اسم مؤنث: o casă، جمع case، مشخص casa. s در میانه صدای «س» دارد.', ruleEn: 'Feminine noun: o casă, plural case, definite casa. Medial s has an s sound.', source: 'https://dexonline.ro/definitie/cas%C4%83/paradigma' },
  x: { word: 'taxi', fa: 'تاکسی', en: 'taxi', ruleFa: 'اسم خنثی: un taxi، جمع taxiuri، مشخص taxiul. x در این واژه صدای «کس» دارد؛ در همهٔ واژه‌ها الزاماً همین صدا را ندارد.', ruleEn: 'Neuter noun: un taxi, plural taxiuri, definite taxiul. x sounds like ks here; other words can differ.', source: 'https://dexonline.ro/definitie/taxi/paradigma' },
} as const;

export function ConsonantWordPractice({ slug, lang }: { slug: string; lang: 'fa' | 'en' }) {
  const lesson = lessons[slug as keyof typeof lessons];
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  if (!lesson) return null;
  const isFa = lang === 'fa';
  const correct = answer.normalize('NFC').trim().toLocaleLowerCase('ro-RO') === lesson.word;

  return <section className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-7 space-y-4" dir={isFa ? 'rtl' : 'ltr'}>
    <h2 className="text-xl font-bold">{isFa ? 'واژه، قاعده و یادآوری' : 'Word, grammar and recall'}</h2>
    <div className="rounded-xl bg-blue-50 p-4 space-y-2"><p lang="ro" dir="ltr" className="text-2xl font-bold">{lesson.word}</p><p>{isFa ? lesson.fa : lesson.en}</p><p className="text-sm">{isFa ? lesson.ruleFa : lesson.ruleEn}</p><a href={lesson.source} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1554bd] underline">{isFa ? 'منبع واژه' : 'Word source'}</a></div>
    <form onSubmit={event => { event.preventDefault(); setChecked(true); }} className="space-y-2"><label htmlFor={`consonant-${slug}`} className="block font-semibold">{isFa ? `«${lesson.fa}» را به رومانیایی بنویسید.` : `Write “${lesson.en}” in Romanian.`}</label><div className="flex flex-wrap gap-2"><input id={`consonant-${slug}`} lang="ro" dir="ltr" autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} className="rounded-xl border border-slate-300 px-3 py-2" /><button disabled={!answer.trim()} type="submit" className="rounded-xl bg-[#1554bd] px-4 py-2 text-white disabled:opacity-50">{isFa ? 'بررسی' : 'Check'}</button></div>{checked && <p role="status" className={correct ? 'text-emerald-800' : 'text-amber-800'}>{correct ? isFa ? 'درست است. اکنون با صدای بلند تکرار کنید.' : 'Correct. Now repeat aloud.' : isFa ? 'یک بار دیگر واژهٔ نمونه را ببینید و تلاش کنید.' : 'Review the example word and try again.'}</p>}</form>
    <SpokenWordCheck key={lesson.word} word={lesson.word} lang={lang} />
  </section>;
}
