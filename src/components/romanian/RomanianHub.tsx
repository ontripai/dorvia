'use client';

import React from 'react';
import { Language } from '@/types';
import { RomanianPhrase, RomanianCategory } from '@/lib/romanian/types';
import { CategoryGrid } from './CategoryGrid';
import { PhraseCard } from './PhraseCard';

interface RomanianHubProps {
  currentLang: Language;
  categoryCounts: Record<RomanianCategory, number>;
  samplePhrases: RomanianPhrase[];
}

export const RomanianHub: React.FC<RomanianHubProps> = ({
  currentLang,
  categoryCounts,
  samplePhrases,
}) => {
  const isFa = currentLang === 'fa';

  return (
    <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      {/* Dark Hero Panel */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
          {isFa ? 'آموزش زبان رومانیایی' : 'Learn Romanian Language'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {isFa
            ? 'بانک عبارت‌ها و جملات کاربردی زبان رومانیایی'
            : 'Essential Romanian Phrases for Practical Living'}
        </h1>
        <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {isFa
            ? 'مجموعه‌ای مدون از جملات و عبارت‌های رسمی و کاربردی برای زندگی، اشتغال، تحصیل و کارهای اداری در کشور رومانی به همراه ترجمه انگلیسی و فارسی.'
            : 'A structured collection of official and practical Romanian phrases for living, working, studying, and administrative procedures in Romania.'}
        </p>
      </div>

      {/* Thematic Category Grid */}
      <CategoryGrid currentLang={currentLang} categoryCounts={categoryCounts} />

      {/* Featured / Sample Phrases Section */}
      {samplePhrases.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
                {isFa ? 'نمونه عبارت‌های منتخب' : 'Selected Phrase Samples'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isFa
                  ? 'برخی از پرکاربردترین جملات مقدماتی و رسمی'
                  : 'A selection of high-frequency formal and neutral introductory phrases'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {samplePhrases.map(phrase => (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                currentLang={currentLang}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
