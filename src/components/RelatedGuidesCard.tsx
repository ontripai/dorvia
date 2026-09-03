'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { PAGE_META } from '../lib/pageMeta';
import { ArrowLeft, ArrowRight } from './Icons';

export interface RelatedGuideItem {
  route: string;
  titleFa?: string;
  titleEn?: string;
  descriptionFa?: string;
  descriptionEn?: string;
  icon?: string;
  badgeFa?: string;
  badgeEn?: string;
}

export type RelatedGuideInput = RelatedGuideItem | string;

interface RelatedGuidesCardProps {
  currentLang: Language;
  items: RelatedGuideInput[];
  titleFa?: string;
  titleEn?: string;
  subtitleFa?: string;
  subtitleEn?: string;
  onNavigate?: (route: string) => void;
  className?: string;
}

export const RelatedGuidesCard: React.FC<RelatedGuidesCardProps> = ({
  currentLang,
  items,
  titleFa,
  titleEn,
  subtitleFa,
  subtitleEn,
  onNavigate,
  className = '',
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const normalizedItems: RelatedGuideItem[] = items.map((item) =>
    typeof item === 'string' ? { route: item } : item
  );

  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;
  const isFa = currentLang === 'fa';

  const heading = isFa
    ? (titleFa || 'مطالب مرتبط و گام‌های بعدی')
    : (titleEn || 'Related Guides & Next Steps');

  const subheading = isFa
    ? (subtitleFa || 'راهنماهای پیشنهادی برای تکمیل اطلاعات و تسهیل فرآیند اقدام:')
    : (subtitleEn || 'Recommended guides to complete your information and streamline your journey:');

  const handleNav = (route: string) => {
    if (onNavigate) {
      onNavigate(route.replace(/^\//, ''));
    }
  };

  return (
    <section className={`bg-white rounded-2xl border border-[#dfe6ef] p-6 sm:p-8 shadow-sm space-y-6 ${className}`}>
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-xl">📚</span>
          <span>{heading}</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#526174]">
          {subheading}
        </p>
      </div>

      <div className={`grid grid-cols-1 ${normalizedItems.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4`}>
        {normalizedItems.map((item, idx) => {
          const cleanRoute = item.route.replace(/^\//, '');
          const meta = PAGE_META[cleanRoute];

          const itemTitle = isFa
            ? (item.titleFa || meta?.titleFa || cleanRoute)
            : (item.titleEn || meta?.titleEn || cleanRoute);

          const itemDesc = isFa
            ? (item.descriptionFa || meta?.seoDescFa || 'مشاهده جزئیات و الزامات این بخش')
            : (item.descriptionEn || meta?.seoDescEn || 'View details and requirements for this section');

          const icon = item.icon || '📌';
          const badge = isFa ? item.badgeFa : item.badgeEn;

          return (
            <Link
              key={idx}
              href={item.route.startsWith('/') ? item.route : `/${item.route}`}
              onClick={() => handleNav(item.route)}
              className="editorial-card p-5 bg-[#f8fafc] hover:bg-[#f0f4f9] border border-[#dfe6ef] hover:border-[#2F6FED] rounded-2xl transition-all flex flex-col justify-between group space-y-3 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{icon}</span>
                  {badge && (
                    <span className="text-[10px] font-bold text-[#2F6FED] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {badge}
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-sm sm:text-base text-[#142033] group-hover:text-[#2F6FED] transition-colors leading-snug">
                  {itemTitle}
                </h4>

                <p className="text-xs text-[#526174] leading-relaxed line-clamp-3">
                  {itemDesc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#dfe6ef]/60 flex items-center justify-between text-xs font-bold text-[#2F6FED] group-hover:text-blue-700">
                <span>{isFa ? 'مطالعه راهنما' : 'Read Guide'}</span>
                <ArrowIcon size={14} className="rtl:mr-1 ltr:ml-1 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
