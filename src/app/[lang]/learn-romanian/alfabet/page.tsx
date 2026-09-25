import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import { getPublishedGraphemes, getWordById } from '@/lib/romanian/content';
import { PronunciationAudio } from '@/components/romanian/PronunciationAudio';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ArrowLeft, ArrowRight } from '@/components/Icons';

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const isFa = params.lang === 'fa';
  return {
    title: isFa
      ? 'الفبا و تلفظ زبان رومانیایی | DORVIA'
      : 'Romanian Alphabet & Pronunciation | DORVIA',
    description: isFa
      ? 'راهنمای جامع حروف، صداها و تلفظ صحیح زبان رومانیایی به همراه فایل‌های صوتی بومی.'
      : 'Comprehensive guide to Romanian letters, sounds, and pronunciation with native audio.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RomanianAlphabetIndexPage({
  params,
}: {
  params: { lang: string };
}) {
  if (!LOCALES.includes(params.lang as any)) {
    notFound();
  }

  const currentLang = params.lang as Language;
  const isFa = currentLang === 'fa';
  const graphemes = getPublishedGraphemes();
  const ArrowIcon = isFa ? ArrowRight : ArrowLeft;

  const toFaDigits = (n: number | string) =>
    String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: isFa ? 'صفحه اصلی' : 'Home', href: '/' },
          { label: isFa ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: isFa ? 'الفبا و تلفظ' : 'Alphabet & Pronunciation' },
        ]}
        currentLang={currentLang}
        disableJsonLd={true}
      />

      {/* Header Panel */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Link
            href="/learn-romanian"
            className="hover:text-white transition-colors underline decoration-dotted inline-flex items-center gap-1"
          >
            <ArrowIcon className="w-3.5 h-3.5" />
            <span>{isFa ? 'بازگشت به آموزش رومانیایی' : 'Back to Learn Romanian'}</span>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-heading">
            {isFa ? 'الفبا و آواهای زبان رومانیایی' : 'Romanian Alphabet & Phonetics'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {isFa
              ? 'زبان رومانیایی خطی تا حد زیادی فونتیک (واج‌نگار) دارد؛ یعنی هر حرف غالباً همان‌گونه که نوشته می‌شود خوانده می‌شود. این ۲۴ درس پایه، تمامی صداهای خاص و حروف ترکیبی را با واژه نمونه و صوت دوگانه گویندگان بومی آموزش می‌دهند.'
              : 'Romanian is largely phonetic: words are generally pronounced as they are written. These 24 foundation lessons cover all special characters and combinations with native dual audio recordings.'}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 font-medium">
            {isFa ? '۲۴ درس آوایی' : '24 Sound Lessons'}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
            {isFa ? 'صوت آزاد و عمومی' : 'Free Public Audio'}
          </span>
        </div>
      </div>

      {/* Graphemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {graphemes.map(g => {
          const exampleWord = getWordById(g.exampleWordId);
          const displayWord = g.exampleForm || exampleWord?.lemma || '';

          return (
            <div
              key={g.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Letter and order badge */}
                <div className="flex items-start justify-between">
                  <Link
                    href={`/learn-romanian/alfabet/${g.slug}`}
                    className="group inline-flex items-baseline gap-2"
                  >
                    <span className="text-3xl font-extrabold text-[#1554bd] dark:text-blue-400 group-hover:underline">
                      {g.grapheme}
                    </span>
                  </Link>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {isFa ? `#${toFaDigits(g.order)}` : `#${g.order}`}
                  </span>
                </div>

                {/* Persian Sound Hint */}
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {g.soundHintFa}
                </p>

                {/* Example Word */}
                {exampleWord && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">
                        {isFa ? 'واژه نمونه:' : 'Example word:'}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        {displayWord}
                      </span>
                      {exampleWord.definiteForm && (
                        <span className="text-slate-500 ms-1.5 font-normal">
                          ({exampleWord.definiteForm})
                        </span>
                      )}
                    </div>
                    <div className="text-end text-slate-500 dark:text-slate-400">
                      {isFa ? exampleWord.translations.fa : exampleWord.translations.en}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom: Audio Island & Lesson Link */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <PronunciationAudio
                  clips={g.audio}
                  currentLang={currentLang}
                  label={g.grapheme}
                  variant="labelled"
                />
                <Link
                  href={`/learn-romanian/alfabet/${g.slug}`}
                  className="text-xs font-medium text-[#1554bd] dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>{isFa ? 'مشاهده درس' : 'Lesson'}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
