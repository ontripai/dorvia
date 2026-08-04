'use client';

import React from 'react';
import Link from 'next/link';
import { Language } from '../types';
import { PAGE_META } from '../lib/pageMeta';
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, Home } from './Icons';

interface BreadcrumbProps {
  slugRoute: string; // e.g. 'needs/driving-license' or 'immigration/citizenship'
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ slugRoute, currentLang, onNavigate }) => {
  const meta = PAGE_META[slugRoute];

  if (!meta || !meta.parentPath) {
    return null; // Don't show breadcrumbs for top-level pages without parents
  }

  const parentTitle = currentLang === 'fa' ? meta.parentTitleFa : meta.parentTitleEn;
  const currentTitle = currentLang === 'fa' ? meta.titleFa : meta.titleEn;
  const homeTitle = currentLang === 'fa' ? 'خانه' : 'Home';
  const Separator = currentLang === 'fa' ? ChevronLeft : ChevronRight;
  const BackArrow = currentLang === 'fa' ? ArrowRight : ArrowLeft;

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <>
      {/* MOBILE STICKY PARENT BACK BAR (موبایل و تبلت - چسبان زیر هدر) */}
      <div className="md:hidden sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-sm text-xs transition-all">
        <div className="flex items-center justify-between max-w-[1280px] mx-auto">
          <Link
            href={meta.parentPath}
            onClick={() => handleNav(meta.parentPath!.replace('/', ''))}
            className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold text-[#2F6FED] hover:text-blue-700 transition-colors"
          >
            <BackArrow size={14} />
            <span>{parentTitle}</span>
          </Link>
          <span className="text-slate-500 font-medium truncate max-w-[160px] text-left rtl:text-right">
            {currentTitle}
          </span>
        </div>
      </div>

      {/* DESKTOP BREADCRUMB BAR (دسکتاپ و نمایش متنی بالای صفحه) */}
      <nav aria-label="Breadcrumb" className={`py-3 px-4 max-w-[1280px] mx-auto text-xs font-semibold text-slate-500 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
        <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          <li>
            <Link
              href="/"
              onClick={() => handleNav('home')}
              className="inline-flex items-center space-x-1 rtl:space-x-reverse hover:text-[#2F6FED] transition-colors"
            >
              <Home size={13} className="text-slate-400" />
              <span>{homeTitle}</span>
            </Link>
          </li>

          <li className="flex items-center text-slate-400">
            <Separator size={12} className="mx-0.5" />
          </li>

          <li>
            <Link
              href={meta.parentPath}
              onClick={() => handleNav(meta.parentPath!.replace('/', ''))}
              className="hover:text-[#2F6FED] transition-colors"
            >
              {parentTitle}
            </Link>
          </li>

          <li className="flex items-center text-slate-400">
            <Separator size={12} className="mx-0.5" />
          </li>

          <li className="text-[#142033] font-bold truncate max-w-[240px] sm:max-w-xs" aria-current="page">
            {currentTitle}
          </li>
        </ol>
      </nav>
    </>
  );
};
