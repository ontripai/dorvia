import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ORDERED_CATEGORIES } from '@/lib/romanian/categories';
import type { RomanianCategory } from '@/lib/romanian/types';
import type { Language } from '@/types';

interface Props {
  currentLang: Language;
  categoryCounts: Record<RomanianCategory, number>;
}

export function CategoryGrid({ currentLang, categoryCounts }: Props) {
  const isFa = currentLang === 'fa';
  const available = ORDERED_CATEGORIES.filter(category => categoryCounts[category.slug] > 0);

  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {available.map(category => {
      const count = categoryCounts[category.slug];
      return <Link key={category.slug} href={`/learn-romanian/${category.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1554bd]">
        <span className="text-xs font-extrabold text-[#1554bd]">{isFa ? `${String(count).replace(/\d/g, n => '۰۱۲۳۴۵۶۷۸۹'[Number(n)])} عبارت` : `${count} phrase${count === 1 ? '' : 's'}`}</span>
        <h3 className="mt-2 text-lg font-extrabold text-slate-900">{isFa ? category.titleFa : category.titleEn}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{isFa ? category.descriptionFa : category.descriptionEn}</p>
        <span className="mt-4 text-xs font-bold text-[#1554bd] group-hover:underline">{isFa ? 'مشاهدهٔ عبارت‌ها ←' : 'View phrases →'}</span>
      </Link>;
    })}
  </div>;
}
