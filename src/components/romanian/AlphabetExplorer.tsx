'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';

type Category = 'vowels' | 'consonants' | 'loans';
type Letter = {
  glyph: string;
  slug: string;
  category: Category;
  example?: string;
  translation?: string;
  translationFa?: string;
  hint?: string;
};

const categoryNames = {
  fa: { all: 'همهٔ حروف', vowels: 'واکه‌ها', consonants: 'همخوان‌ها', loans: 'وام‌واژه‌ها' },
  en: { all: 'All letters', vowels: 'Vowels', consonants: 'Consonants', loans: 'Loan letters' },
};

export function AlphabetExplorer({ letters, lang }: { letters: Letter[]; lang: 'fa' | 'en' }) {
  const [category, setCategory] = React.useState<Category | 'all'>('all');
  const [query, setQuery] = React.useState('');
  const isFa = lang === 'fa';
  const filtered = letters.filter(letter => {
    const matchesCategory = category === 'all' || letter.category === category;
    const term = query.trim().toLocaleLowerCase('ro-RO');
    return matchesCategory && (!term || [letter.glyph, letter.example, letter.translation, letter.translationFa].some(value => value?.toLocaleLowerCase('ro-RO').includes(term)));
  });

  return <section id="letters" aria-labelledby="letters-heading" className="scroll-mt-24 space-y-5">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#1554bd]">{isFa ? 'بخش اول · انتخاب حرف' : 'Part one · choose a letter'}</p>
        <h2 id="letters-heading" className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">{isFa ? 'حروف را پیدا کنید' : 'Find a letter'}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{isFa ? '۳۱ حرف در سه گروه. هر کارت درس همان حرف را باز می‌کند؛ Â و Î قاعدهٔ صدای مشترک دارند.' : '31 letters in three groups. Each card opens its letter lesson; Â and Î share a sound lesson.'}</p>
      </div>
      <label className="block w-full sm:w-64">
        <span className="sr-only">{isFa ? 'جست‌وجوی حرف یا واژه' : 'Search letter or word'}</span>
        <input value={query} onChange={event => setQuery(event.target.value)} type="search"
          placeholder={isFa ? 'حرف یا واژه را جست‌وجو کنید' : 'Search a letter or word'}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1554bd] focus:ring-2 focus:ring-blue-100" />
      </label>
    </div>
    <div role="group" aria-label={isFa ? 'فیلتر حروف' : 'Letter filters'} className="flex flex-wrap gap-2">
      {(['all', 'vowels', 'consonants', 'loans'] as const).map(key => <button key={key} type="button"
        onClick={() => setCategory(key)} aria-pressed={category === key}
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd] ${category === key ? 'border-[#1554bd] bg-[#1554bd] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'}`}>
        {categoryNames[lang][key]} <span className="opacity-75">({letters.filter(letter => key === 'all' || letter.category === key).length})</span>
      </button>)}
    </div>
    <p aria-live="polite" className="text-xs text-slate-500">{isFa ? `${String(filtered.length).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])} حرف نمایش داده می‌شود` : `Showing ${filtered.length} ${filtered.length === 1 ? 'letter' : 'letters'}`}</p>
    {filtered.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {filtered.map(letter => <Link key={letter.glyph} href={`/learn-romanian/alfabet/${letter.slug}`}
        className="group flex min-h-36 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd]">
        <span dir="ltr" lang="ro" className="text-3xl font-extrabold text-[#1554bd]">{letter.glyph}</span>
        <span className="mt-2 truncate text-sm font-semibold text-slate-800" lang="ro" dir="ltr">{letter.example || ' '}</span>
        <span lang="en" dir="ltr" className="min-h-5 truncate text-xs text-slate-500">{letter.translation || letter.hint || ' '}</span>
        {isFa && letter.translationFa && <span lang="fa" dir="rtl" className="min-h-5 truncate text-xs text-slate-500">{letter.translationFa}</span>}
        <span className="mt-auto pt-3 text-xs font-bold text-[#1554bd] group-hover:underline">{isFa ? 'باز کردن درس ←' : 'Open lesson →'}</span>
      </Link>)}
    </div> : <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">{isFa ? 'حرف یا واژه‌ای با این جست‌وجو پیدا نشد. فیلتر را عوض کنید.' : 'No matching letter or word. Try another filter.'}</p>}
  </section>;
}
