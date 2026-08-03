'use client';

import React from 'react';
import { Language } from '../types';

interface WorkOverviewContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const WorkOverviewContent: React.FC<WorkOverviewContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white capitalize">
          {subRoute.replace('-', ' ')}
        </h1>
        <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {currentLang === 'fa' 
            ? `این صفحه برای بخش کار (${subRoute}) رزرو شده است و محتوای آن به زودی اضافه می‌شود.` 
            : `Placeholder for Work section (${subRoute}). Full content will be added soon.`}
        </p>
      </div>
    </div>
  );
};
