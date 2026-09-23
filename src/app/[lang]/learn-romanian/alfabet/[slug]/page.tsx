import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import {
  getPublishedGraphemes,
  getGraphemeBySlug,
  getWordById,
} from '@/lib/romanian/content';
import { GraphemeAudio } from '@/components/romanian/GraphemeAudio';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ArrowLeft, ArrowRight, ChevronRight, ChevronLeft } from '@/components/Icons';

export function generateStaticParams() {
  const published = getPublishedGraphemes();
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    for (const g of published) {
      params.push({ lang, slug: g.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const grapheme = getGraphemeBySlug(params.slug);
  if (!grapheme) {
    return {
      title: 'Not Found',
      robots: { index: false, follow: false },
    };
  }

  const isFa = params.lang === 'fa';
  return {
    title: isFa
      ? `تلفظ حرف «${grapheme.grapheme}» در زبان رومانیایی | DORVIA`
      : `Pronunciation of "${grapheme.grapheme}" in Romanian | DORVIA`,
    description: isFa
      ? `راهنمای شنیداری و تلفظ حرف «${grapheme.grapheme}» در رومانیایی با واژه نمونه و صوت دوگانه گویندگان بومی.`
      : `Listening and pronunciation guide for Romanian letter "${grapheme.grapheme}" with example word and native audio.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RomanianGraphemeDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  if (!LOCALES.includes(params.lang as any)) {
    notFound();
  }

  const grapheme = getGraphemeBySlug(params.slug);
  if (!grapheme) {
    notFound();
  }

  const currentLang = params.lang as Language;
  const isFa = currentLang === 'fa';
  const allGraphemes = getPublishedGraphemes();

  // Find previous and next graphemes for sequential navigation
  const currentIndex = allGraphemes.findIndex(g => g.slug === grapheme.slug);
  const prevGrapheme = currentIndex > 0 ? allGraphemes[currentIndex - 1] : null;
  const nextGrapheme =
    currentIndex < allGraphemes.length - 1 ? allGraphemes[currentIndex + 1] : null;

  const exampleWord = getWordById(grapheme.exampleWordId);
  const displayWord = grapheme.exampleForm || exampleWord?.lemma || '';

  const PrevNextArrow = isFa ? ArrowRight : ArrowLeft;
  const ForwardArrow = isFa ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-8 animate-fadeIn max-w-[960px] mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: isFa ? 'صفحه اصلی' : 'Home', href: '/' },
          { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: isFa ? 'الفبا و تلفظ' : 'Alphabet & Pronunciation', href: '/learn-romanian/alfabet' },
          { label: grapheme.grapheme },
        ]}
        currentLang={currentLang}
        disableJsonLd={true}
      />

      {/* Main Lesson Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-md space-y-8">
        {/* Top bar: back to alphabet and lesson number */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <Link
            href="/learn-romanian/alfabet"
            className="hover:text-[#1554bd] dark:hover:text-blue-400 inline-flex items-center gap-1 font-medium transition-colors"
          >
            <PrevNextArrow className="w-3.5 h-3.5" />
            <span>{isFa ? 'تمام حروف الفبا' : 'All Alphabet Lessons'}</span>
          </Link>
          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-semibold">
            {isFa ? `درس ${grapheme.order} از ۲۴` : `Lesson ${grapheme.order} of 24`}
          </span>
        </div>

        {/* Center: Large Letter & Audio Island */}
        <div className="text-center py-6 space-y-6">
          <div className="inline-flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 shadow-inner">
            <span className="text-5xl sm:text-6xl font-extrabold text-[#1554bd] dark:text-blue-400 font-heading">
              {grapheme.grapheme}
            </span>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              {isFa ? `تلفظ و آوای حرف «${grapheme.grapheme}»` : `Pronunciation of letter "${grapheme.grapheme}"`}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {grapheme.soundHintFa}
            </p>
          </div>

          {/* Client Audio Player Island */}
          <div className="pt-2 flex justify-center">
            <GraphemeAudio
              clips={grapheme.audio}
              currentLang={currentLang}
              graphemeName={grapheme.grapheme}
              className="gap-3"
            />
          </div>
        </div>

        {/* Example Word Section */}
        {exampleWord && (
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isFa ? 'واژه نمونه در رومانیایی' : 'Romanian Example Word'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {exampleWord.id}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/50 pb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {displayWord}
                </span>
                {exampleWord.definiteForm && (
                  <span className="text-sm text-slate-500 font-normal">
                    {isFa ? 'معرفه:' : 'definite:'} <strong className="font-semibold text-slate-700 dark:text-slate-300">{exampleWord.definiteForm}</strong>
                  </span>
                )}
              </div>
              <div className="text-base font-semibold text-[#1554bd] dark:text-blue-400">
                {isFa ? exampleWord.translations.fa : exampleWord.translations.en}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              {exampleWord.gender && (
                <span>
                  {isFa ? 'جنسیت:' : 'Gender:'}{' '}
                  <strong className="text-slate-700 dark:text-slate-300">
                    {exampleWord.gender === 'f'
                      ? (isFa ? 'مؤنث (feminin)' : 'Feminine')
                      : exampleWord.gender === 'm'
                      ? (isFa ? 'مذکر (masculin)' : 'Masculine')
                      : (isFa ? 'خنثی (neutru)' : 'Neuter')}
                  </strong>
                </span>
              )}
              {exampleWord.plural && (
                <span>
                  {isFa ? 'حالت جمع:' : 'Plural:'}{' '}
                  <strong className="text-slate-700 dark:text-slate-300">{exampleWord.plural}</strong>
                </span>
              )}
              {exampleWord.source?.label && (
                <span>
                  {isFa ? 'منبع واژه:' : 'Source:'}{' '}
                  <span className="text-slate-600 dark:text-slate-400">{exampleWord.source.label}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation: Prev / Next Grapheme */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {prevGrapheme ? (
            <Link
              href={`/learn-romanian/alfabet/${prevGrapheme.slug}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1554bd] dark:hover:text-blue-400 transition-colors"
            >
              <PrevNextArrow className="w-4 h-4" />
              <span>
                {isFa ? 'حرف قبلی' : 'Previous'}: <strong className="font-bold">{prevGrapheme.grapheme}</strong>
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextGrapheme ? (
            <Link
              href={`/learn-romanian/alfabet/${nextGrapheme.slug}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1554bd] dark:hover:text-blue-400 transition-colors"
            >
              <span>
                {isFa ? 'حرف بعدی' : 'Next'}: <strong className="font-bold">{nextGrapheme.grapheme}</strong>
              </span>
              <ForwardArrow className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
