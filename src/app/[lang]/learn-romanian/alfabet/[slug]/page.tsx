import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PronunciationAudio } from '@/components/romanian/PronunciationAudio';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import {
  getPublishedGraphemes,
  getGraphemeBySlug,
  getWordById,
} from '@/lib/romanian/content';
import { ABreveFoundationLesson } from '@/components/romanian/ABreveFoundationLesson';
import { LetterPositionPractice } from '@/components/romanian/LetterPositionPractice';
import { CGPatternPractice } from '@/components/romanian/CGPatternPractice';
import { BasicConsonantPractice } from '@/components/romanian/BasicConsonantPractice';
import { ConsonantWordPractice } from '@/components/romanian/ConsonantWordPractice';
import { LoanLetterLesson } from '@/components/romanian/LoanLetterLesson';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ArrowLeft, ArrowRight, ChevronRight, ChevronLeft } from '@/components/Icons';

const LOAN_LETTER_SLUGS = ['k', 'q', 'w', 'y'] as const;
function isLoanLetterSlug(slug: string): slug is typeof LOAN_LETTER_SLUGS[number] {
  return LOAN_LETTER_SLUGS.some(letter => letter === slug);
}

export function generateStaticParams() {
  const published = getPublishedGraphemes();
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    for (const g of published) {
      params.push({ lang, slug: g.slug });
    }
    for (const slug of LOAN_LETTER_SLUGS) params.push({ lang, slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const grapheme = getGraphemeBySlug(params.slug);
  if (isLoanLetterSlug(params.slug)) {
    return { title: params.lang === 'fa' ? `حرف ${params.slug.toUpperCase()} در الفبای رومانیایی | DORVIA` : `Romanian letter ${params.slug.toUpperCase()} | DORVIA`, robots: { index: false, follow: false } };
  }
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
      ? `راهنمای حرف «${grapheme.grapheme}» در رومانیایی با واژه نمونه و تمرین؛ صوت ضبط‌شده در انتظار بررسی است.`
      : `Romanian spelling pattern "${grapheme.grapheme}" with example words and practice; recorded audio is pending review.`,
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

  if (isLoanLetterSlug(params.slug)) {
    return <main className="max-w-4xl mx-auto px-4 py-8"><LoanLetterLesson slug={params.slug} lang={params.lang as 'fa' | 'en'} /></main>;
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

  const toFaDigits = (n: number | string) =>
    String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  const PrevNextArrow = isFa ? ArrowRight : ArrowLeft;
  const ForwardArrow = isFa ? ArrowLeft : ArrowRight;

  if (grapheme.slug === 'a-breve') {
    return <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: isFa ? 'خانه' : 'Home', href: '/' },
          { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: isFa ? 'الفبا و تلفظ' : 'Alphabet & pronunciation', href: '/learn-romanian/alfabet' },
          { label: 'ă' },
        ]}
        currentLang={currentLang}
        disableJsonLd
      />
      <ABreveFoundationLesson lang={currentLang} />
    </main>;
  }

  return (
    <main className="space-y-6 animate-fadeIn max-w-[960px] mx-auto px-4 py-8">
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

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-[#1554bd]">{isFa ? 'هدف این درس' : 'Your goal'}</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">{isFa ? 'این الگو را در واژهٔ نمونه پیدا کنید، قاعدهٔ آن را بخوانید و در تمرین‌های پایین بنویسید یا بگویید. می‌توانید هر بخش را دوباره انجام دهید.' : 'Find this pattern in the example, read its rule, then write or say it in the practice below. You can repeat any part.'}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#1554bd]">
          {(isFa ? ['۱. دیدن الگو', '۲. بررسی واژه', '۳. تمرین'] : ['1. See the pattern', '2. Explore a word', '3. Practise']).map(step => <span key={step} className="rounded-full bg-white px-3 py-1.5">{step}</span>)}
        </div>
      </div>

      {/* Main Lesson Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-md space-y-7">
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
            {isFa ? `درس ${toFaDigits(grapheme.order)} از ۲۴` : `Lesson ${grapheme.order} of 24`}
          </span>
        </div>

        {/* Center: Large Letter & Audio Island */}
        <div className="text-center py-3 space-y-5">
          <div className="inline-flex items-center justify-center min-w-28 min-h-28 px-5 sm:min-w-36 sm:min-h-36 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 shadow-inner">
            <span dir="ltr" lang="ro" className="text-4xl sm:text-5xl font-extrabold text-[#1554bd] dark:text-blue-400 font-heading">
              {grapheme.grapheme}
            </span>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              {isFa ? `تلفظ «${grapheme.grapheme}»` : `Pronunciation of "${grapheme.grapheme}"`}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {isFa ? grapheme.soundHintFa : grapheme.soundHintEn}
            </p>
          </div>

          {displayWord && <div className="inline-flex flex-col items-center gap-2 rounded-2xl bg-slate-50 px-5 py-4">
            <span className="text-xs font-semibold text-slate-600">{isFa ? 'شنیدن واژهٔ نمونه' : 'Hear the example word'}</span>
            <strong dir="ltr" lang="ro" className="text-xl text-slate-900">{displayWord}</strong>
            <PronunciationAudio currentLang={currentLang} label={displayWord} />
            <span className="max-w-xs text-xs leading-5 text-slate-500">{isFa ? 'صدای مصنوعی مرورگر؛ تلفظ مستقل حرف یا ضبط تأییدشده نیست.' : 'Browser synthesis; not an isolated letter or verified recording.'}</span>
          </div>}
        </div>

        {/* Example Word Section */}
        {exampleWord && (
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isFa ? 'واژه نمونه در رومانیایی' : 'Romanian Example Word'}
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

      </div>
      <section aria-labelledby="practice-heading" className="space-y-4">
        <div><p className="text-xs font-bold uppercase tracking-wide text-[#1554bd]">{isFa ? 'بخش تمرین' : 'Practice'}</p><h2 id="practice-heading" className="mt-1 text-2xl font-extrabold text-slate-900">{isFa ? 'حالا نوبت شماست' : 'Now it is your turn'}</h2></div>
        <LetterPositionPractice slug={grapheme.slug} lang={currentLang} />
        {grapheme.order >= 11 && grapheme.order <= 16 && <CGPatternPractice slug={grapheme.slug as 'c-hard' | 'ce-ci' | 'che-chi' | 'g-hard' | 'ge-gi' | 'ghe-ghi'} lang={currentLang} />}
        {grapheme.slug === 'consoane' && <BasicConsonantPractice lang={currentLang} />}
        <ConsonantWordPractice slug={grapheme.slug} lang={currentLang} />
      </section>
      <nav aria-label={isFa ? 'درس قبلی و بعدی' : 'Previous and next lesson'} className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="mb-4 text-sm font-bold text-slate-800">{isFa ? 'ادامهٔ مسیر' : 'Continue learning'}</p>
        <div className="flex items-center justify-between gap-4">
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
        <Link href="/learn-romanian/alfabet" className="mt-4 inline-block text-sm font-semibold text-[#1554bd] hover:underline">{isFa ? 'بازگشت به همهٔ حروف' : 'Back to all letters'}</Link>
      </nav>
    </main>
  );
}
