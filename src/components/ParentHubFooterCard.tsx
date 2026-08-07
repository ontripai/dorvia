'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { PAGE_META } from '../lib/pageMeta';
import { ArrowLeft, ArrowRight, Layers } from './Icons';

interface ParentHubFooterCardProps {
  slugRoute: string;
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const ParentHubFooterCard: React.FC<ParentHubFooterCardProps> = ({ slugRoute, currentLang, onNavigate }) => {
  const meta = PAGE_META[slugRoute];

  if (!meta || !meta.parentPath) {
    return null;
  }

  const parentTitle = currentLang === 'fa' ? meta.parentTitleFa : meta.parentTitleEn;
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={`mt-8 p-5 bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-700">
        <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#2F6FED] flex items-center justify-center shrink-0 font-bold">
          <Layers size={20} />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-[#142033] leading-relaxed">
          {currentLang === 'fa'
            ? `این راهنما بخشی از مجموعه «${parentTitle}» است.`
            : `This guide is part of the "${parentTitle}" collection.`}
        </p>
      </div>

      <Link
        href={meta.parentPath}
        onClick={() => handleNav(meta.parentPath!.replace('/', ''))}
        className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-white hover:bg-blue-50 text-[#2F6FED] font-extrabold text-xs px-4 py-2.5 rounded-xl border border-blue-200 shadow-xs transition-colors shrink-0"
      >
        <span>
          {currentLang === 'fa'
            ? `مشاهده همه راهنماهای ${parentTitle}`
            : `View all guides in ${parentTitle}`}
        </span>
        <ArrowIcon size={14} className="rtl:mr-1 ltr:ml-1" />
      </Link>
    </div>
  );
};
