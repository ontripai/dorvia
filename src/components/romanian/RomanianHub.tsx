import React from 'react';
import type { Language } from '@/types';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';

interface Props {
  currentLang: Language;
  conversationCount: number;
  moduleCount: number;
  categoryCount: number;
}

export function RomanianHub({ currentLang, conversationCount, moduleCount, categoryCount }: Props) {
  const isFa = currentLang === 'fa';
  const number = (value: number) => isFa ? String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]) : String(value);
  const collections = [
    {
      href: '/learn-romanian/fundamente', number: 1, tone: 'blue',
      eyebrowFa: 'از اینجا شروع کنید', eyebrowEn: 'Start here',
      titleFa: 'درس‌های پایه', titleEn: 'Foundations',
      descriptionFa: 'الفبا و گروه‌حرف‌ها، سپس ۹ درس مرتب دربارهٔ ضمیر، جمله و دو فعل پایهٔ a fi و a avea. هدف: ساختن جملهٔ ساده.',
      descriptionEn: 'Alphabet and letter patterns, followed by nine ordered lessons on pronouns, sentences, a fi, and a avea. Build a simple sentence.',
      countFa: 'الفبا + ۹ درس', countEn: 'Alphabet + 9 lessons',
    },
    {
      href: '/learn-romanian/lectie', number: 2, tone: 'emerald',
      eyebrowFa: 'آموخته‌ها را به کار ببرید', eyebrowEn: 'Use what you learned',
      titleFa: 'مکالمه‌های روزمره', titleEn: 'Everyday conversations',
      descriptionFa: 'در موقعیت واقعی گفت‌وگو کنید؛ از شنیدن مکالمه تا کشف قاعده، نوشتن پاسخ و گفتن جملهٔ خودتان.',
      descriptionEn: 'Practise real situations, from listening and discovering a rule to writing and speaking your own response.',
      countFa: `${number(conversationCount)} درس`, countEn: `${conversationCount} lessons`,
    },
    {
      href: '/learn-romanian/modul', number: 3, tone: 'amber',
      eyebrowFa: 'واژه‌ها را در چند گام تمرین کنید', eyebrowEn: 'Practise in small steps',
      titleFa: 'تمرین‌های تکمیلی', titleEn: 'Extra practice',
      descriptionFa: 'ماژول‌های واژه و عبارت را به ترتیب بخش‌ها انجام دهید و آموخته‌های خود را با مرور روزانه تکرار کنید.',
      descriptionEn: 'Follow the word and phrase modules step by step, then revisit what you learned with daily review.',
      countFa: `${number(moduleCount)} ماژول + مرور`, countEn: `${moduleCount} modules + review`,
    },
    {
      href: '/learn-romanian/expresii', number: 4, tone: 'violet',
      eyebrowFa: 'مرجع بر اساس موقعیت', eyebrowEn: 'Browse by situation',
      titleFa: 'عبارت‌های کاربردی', titleEn: 'Practical phrases',
      descriptionFa: 'عبارت‌های آمادهٔ سفر، خرید، درمان و زندگی روزانه را در دسته‌های موضوعی پیدا کنید.',
      descriptionEn: 'Find ready-to-use expressions for travel, shopping, healthcare, and daily life in topic collections.',
      countFa: `${number(categoryCount)} موضوع`, countEn: `${categoryCount} topics`,
    },
  ] as const;
  const styles = {
    blue: 'border-blue-200 bg-blue-50/60 hover:border-blue-400 text-[#1554bd]',
    emerald: 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-400 text-emerald-800',
    amber: 'border-amber-200 bg-amber-50/60 hover:border-amber-400 text-amber-800',
    violet: 'border-violet-200 bg-violet-50/60 hover:border-violet-400 text-violet-800',
  };

  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-7 sm:space-y-10 sm:py-10" dir={isFa ? 'rtl' : 'ltr'}>
    <Breadcrumb items={[{ label: isFa ? 'خانه' : 'Home', href: '/' }, { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian' }]} currentLang={currentLang} disableJsonLd />
    <header className="dark-hero-panel rounded-3xl px-6 py-9 text-white shadow-xl sm:px-10 sm:py-12">
      <p className="text-sm font-bold text-blue-200">{isFa ? 'مسیر یادگیری · چهار مجموعهٔ روشن' : 'Learning path · four clear collections'}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{isFa ? 'از الفبا تا مکالمهٔ روزمره' : 'From the alphabet to everyday conversation'}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{isFa ? 'از پایه شروع کنید، جمله بسازید و سپس آن را در مکالمه به کار ببرید. برای دیدن درس‌ها، وارد مجموعهٔ موردنظر شوید.' : 'Start with the foundations, build sentences, and use them in conversation. Open a collection to see its lessons.'}</p>
      <Link href="/learn-romanian/fundamente" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#1554bd] hover:bg-blue-50">{isFa ? 'شروع از درس‌های پایه ←' : 'Start with foundations →'}</Link>
    </header>

    <section aria-labelledby="collections-heading" className="space-y-5">
      <div><p className="text-xs font-extrabold text-[#1554bd]">{isFa ? 'ترتیب پیشنهادی یادگیری' : 'Suggested learning order'}</p><h2 id="collections-heading" className="mt-1 text-2xl font-extrabold text-slate-900">{isFa ? 'مجموعهٔ خود را انتخاب کنید' : 'Choose a collection'}</h2></div>
      <ol className="grid gap-4 md:grid-cols-2">
        {collections.map(collection => <li key={collection.href}><Link href={collection.href} className={`group flex h-full min-h-64 flex-col rounded-3xl border-2 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-7 ${styles[collection.tone]}`}>
          <div className="flex items-center justify-between gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-white text-base font-extrabold shadow-sm">{number(collection.number)}</span><span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold">{isFa ? collection.countFa : collection.countEn}</span></div>
          <p className="mt-5 text-xs font-extrabold">{isFa ? collection.eyebrowFa : collection.eyebrowEn}</p>
          <h3 className="mt-1 text-2xl font-extrabold text-slate-900">{isFa ? collection.titleFa : collection.titleEn}</h3>
          <p className="mt-3 flex-1 text-sm leading-7 text-slate-700">{isFa ? collection.descriptionFa : collection.descriptionEn}</p>
          <span className="mt-5 text-sm font-extrabold group-hover:underline">{isFa ? 'دیدن درس‌ها و بخش‌ها ←' : 'View lessons and sections →'}</span>
        </Link></li>)}
      </ol>
    </section>
  </main>;
}
