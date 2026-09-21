'use client';

import React, { useState } from 'react';
import { RomanianPhrase } from '@/lib/romanian/types';
import { Language } from '@/types';

interface PhraseCardProps {
  phrase: RomanianPhrase;
  currentLang: Language;
  learnerName?: string;
}

const LATIN_NAME_REGEX = /^[\p{Script=Latin}\p{M}\s'’-]+$/u;

/**
 * Resolves a text string containing {{name}} template token into React nodes.
 * If learnerName is missing, empty, exceeds 60 chars, or contains non-Latin scripts,
 * it safely renders an accessible and elegant visual blank slot.
 */
function renderTextWithToken(
  text: string,
  learnerName: string | undefined,
  isRtl: boolean = false
): React.ReactNode {
  if (!text.includes('{{name}}')) {
    return text;
  }

  const trimmed = learnerName ? learnerName.trim() : '';
  const isValidName =
    trimmed.length > 0 &&
    trimmed.length <= 60 &&
    LATIN_NAME_REGEX.test(trimmed);

  const parts = text.split('{{name}}');

  return (
    <>
      {parts.map((part, idx) => (
        <React.Fragment key={idx}>
          {part}
          {idx < parts.length - 1 && (
            isValidName ? (
              <span className="font-semibold text-[#1554bd] px-1 underline decoration-dotted">
                {trimmed}
              </span>
            ) : (
              <span
                aria-label="نام / Name slot"
                className={`inline-block border-b-2 border-slate-400 bg-slate-100/75 dark:bg-slate-800/40 min-w-[3.5rem] h-[1.15em] align-middle mx-1 rounded-t-sm ${
                  isRtl ? 'rtl:mx-1' : 'ltr:mx-1'
                }`}
              />
            )
          )}
        </React.Fragment>
      ))}
    </>
  );
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  currentLang,
  learnerName,
}) => {
  const [showFaTranslation, setShowFaTranslation] = useState(false);
  const isEnMode = currentLang === 'en';

  return (
    <div className="editorial-card p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4">
      {/* Top Bar: Category badge & level / journey tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full font-medium bg-blue-50 text-[#1554bd] text-[11px]">
            {phrase.level}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
            {phrase.register}
          </span>
        </div>
        {phrase.journeys && phrase.journeys.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {phrase.journeys.map(j => (
              <span
                key={j}
                className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60"
              >
                {j}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      {/* Desktop in /fa: 3 columns (Romanian | English | Persian) */}
      {/* Mobile in /fa: stacked vertically (Romanian -> English -> Persian) */}
      {/* In /en: Romanian and English always visible, Persian behind a toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-1">
        {/* Romanian Section (Dominant visual weight) */}
        <div className="space-y-1.5 md:col-span-1 border-b md:border-b-0 md:border-r md:rtl:border-r-0 md:rtl:border-l border-slate-100 pb-3 md:pb-0 md:pr-4 md:rtl:pr-0 md:rtl:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Română
          </span>
          <p
            dir="ltr"
            lang="ro"
            className="text-lg sm:text-xl font-extrabold text-[#142033] tracking-tight leading-snug"
          >
            {renderTextWithToken(phrase.text.ro, learnerName, false)}
          </p>
        </div>

        {/* English Section */}
        <div className="space-y-1.5 md:col-span-1 border-b md:border-b-0 md:border-r md:rtl:border-r-0 md:rtl:border-l border-slate-100 pb-3 md:pb-0 md:pr-4 md:rtl:pr-0 md:rtl:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            English
          </span>
          <p
            dir="ltr"
            lang="en"
            className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed"
          >
            {renderTextWithToken(phrase.text.en, learnerName, false)}
          </p>
        </div>

        {/* Persian Section */}
        <div className="space-y-1.5 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              فارسی
            </span>
            {isEnMode && (
              <button
                type="button"
                onClick={() => setShowFaTranslation(prev => !prev)}
                className="text-[11px] font-semibold text-[#1554bd] hover:underline focus:outline-none"
              >
                {showFaTranslation ? 'Hide Persian' : 'Show Persian'}
              </button>
            )}
          </div>

          {(!isEnMode || showFaTranslation) && (
            <p
              dir="rtl"
              lang="fa"
              className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed"
            >
              {renderTextWithToken(phrase.text.fa, learnerName, true)}
            </p>
          )}
        </div>
      </div>

      {/* Informal Variant (Visually subordinate & explicitly labeled) */}
      {phrase.informalVariant && (
        <div className="mt-3 p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
            <span>ℹ️</span>
            <span>
              {currentLang === 'fa'
                ? 'صورت غیررسمی (برای درک شنیداری — نه برای گفتن)'
                : 'Informal variant (for comprehension only — do not use in speech)'}
            </span>
          </div>
          <div className="pt-1">
            <span
              dir="ltr"
              lang="ro"
              className="font-medium text-slate-800 inline-block px-1"
            >
              {phrase.informalVariant.ro}
            </span>
            {phrase.informalVariant.note && (
              <p className="text-slate-500 text-[11px] mt-0.5">
                {phrase.informalVariant.note}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Vocabulary Breakdown (Rendered only if present) */}
      {phrase.vocabulary && phrase.vocabulary.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 block">
            {currentLang === 'fa' ? 'واژگان کلیدی:' : 'Key Vocabulary:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {phrase.vocabulary.map((voc, vIdx) => (
              <div
                key={vIdx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-[11px]"
              >
                <span dir="ltr" lang="ro" className="font-bold text-[#142033]">
                  {voc.ro}
                </span>
                <span className="text-slate-400">·</span>
                <span dir="ltr" lang="en" className="text-slate-600">
                  {voc.en}
                </span>
                <span className="text-slate-400">·</span>
                <span dir="rtl" lang="fa" className="text-slate-800 font-medium">
                  {voc.fa}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
