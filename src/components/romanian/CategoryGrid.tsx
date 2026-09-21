'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ORDERED_CATEGORIES } from '@/lib/romanian/categories';
import { RomanianCategory } from '@/lib/romanian/types';
import { Language } from '@/types';
import { ArrowLeft, ArrowRight } from '@/components/Icons';

interface CategoryGridProps {
  currentLang: Language;
  categoryCounts: Record<RomanianCategory, number>;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  currentLang,
  categoryCounts,
}) => {
  const isFa = currentLang === 'fa';
  const ArrowIcon = isFa ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {isFa ? 'دسته‌بندی موضوعی عبارت‌ها' : 'Thematic Categories'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isFa
              ? 'مجموعه‌های کاربردی متناسب با نیازهای مهاجرت، کار، تحصیل و زندگی روزمره در رومانی'
              : 'Practical collections tailored for immigration, work, study, and daily life in Romania'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ORDERED_CATEGORIES.map(cat => {
          const count = categoryCounts[cat.slug] || 0;
          const hasContent = count > 0;
          const title = isFa ? cat.titleFa : cat.titleEn;
          const desc = isFa ? cat.descriptionFa : cat.descriptionEn;

          if (hasContent) {
            return (
              <Link
                key={cat.slug}
                href={`/learn-romanian/${cat.slug}`}
                className="editorial-card group p-5 sm:p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-[#1554bd] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#1554bd]">
                      {isFa ? `${count} عبارت` : `${count} phrase${count > 1 ? 's' : ''}`}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      #{cat.order}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#142033] group-hover:text-[#1554bd] transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1554bd]">
                  <span>{isFa ? 'مشاهده عبارت‌ها' : 'View Phrases'}</span>
                  <ArrowIcon size={14} className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          }

          // Zero-content category: visually muted, unclickable to avoid dead ends
          return (
            <div
              key={cat.slug}
              className="editorial-card p-5 sm:p-6 bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl flex flex-col justify-between opacity-75 select-none"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200/70 text-slate-600">
                    {isFa ? 'به‌زودی' : 'Coming Soon'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    #{cat.order}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-700">
                  {title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {desc}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center text-[11px] text-slate-400 font-medium">
                <span>{isFa ? 'محتوا در حال آماده‌سازی' : 'Content in preparation'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
