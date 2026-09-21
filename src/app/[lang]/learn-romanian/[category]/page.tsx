import React from 'react';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import { ORDERED_CATEGORIES, getCategoryBySlug, isValidCategory } from '@/lib/romanian/categories';
import { RomanianCategory } from '@/lib/romanian/types';
import { getPhrasesByCategory } from '@/lib/romanian/content';
import { PhraseCard } from '@/components/romanian/PhraseCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ArrowLeft, ArrowRight } from '@/components/Icons';

export function generateStaticParams() {
  const params: { lang: string; category: string }[] = [];
  for (const lang of LOCALES) {
    for (const cat of ORDERED_CATEGORIES) {
      params.push({ lang, category: cat.slug });
    }
  }
  return params;
}

export default function RomanianCategoryPage({
  params,
}: {
  params: { lang: string; category: string };
}) {
  if (!LOCALES.includes(params.lang as any)) {
    notFound();
  }

  if (!isValidCategory(params.category)) {
    notFound();
  }

  const currentLang = params.lang as Language;
  const isFa = currentLang === 'fa';
  const categorySlug = params.category as RomanianCategory;
  const catMeta = getCategoryBySlug(categorySlug);
  const phrases = getPhrasesByCategory(categorySlug);
  const ArrowIcon = isFa ? ArrowRight : ArrowLeft;

  const title = isFa ? catMeta?.titleFa : catMeta?.titleEn;
  const description = isFa ? catMeta?.descriptionFa : catMeta?.descriptionEn;

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        slugRoute={`learn-romanian/${categorySlug}`}
        currentLang={currentLang}
        disableJsonLd={true}
      />

      {/* Category Header */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-12 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Link
            href="/learn-romanian"
            className="hover:text-white transition-colors underline decoration-dotted"
          >
            {isFa ? 'آموزش زبان رومانیایی' : 'Learn Romanian'}
          </Link>
          <span>/</span>
          <span className="text-white">{title}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          {title}
        </h1>
        {description && (
          <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Phrases Content or Explicit Empty State */}
      {phrases.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 text-sm text-slate-600">
            <span>
              {isFa
                ? `${phrases.length} عبارت در این دسته منتشر شده است`
                : `${phrases.length} phrase${phrases.length > 1 ? 's' : ''} published in this category`}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {phrases.map(phrase => (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                currentLang={currentLang}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Explicit Empty State for zero-phrase categories */
        <div className="editorial-card p-10 sm:p-14 bg-white border border-slate-200 rounded-3xl text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            ⏳
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-[#142033]">
              {isFa
                ? 'برای این دسته هنوز عبارتی منتشر نشده است'
                : 'No phrases published for this category yet.'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {isFa
                ? 'محتوای آموزشی و عبارت‌های کاربردی این بخش در حال بازبینی و آماده‌سازی نهایی است.'
                : 'Learning content and phrases for this category are currently under review and preparation.'}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/learn-romanian"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1554bd] text-white text-xs font-bold hover:bg-[#12469e] transition-colors shadow-sm"
            >
              <ArrowIcon size={14} />
              <span>
                {isFa
                  ? 'بازگشت به فهرست دسته‌بندی‌ها'
                  : 'Return to Categories Hub'}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Back to Hub Footer Navigation */}
      <div className="pt-6 border-t border-slate-200/80">
        <Link
          href="/learn-romanian"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1554bd] hover:underline"
        >
          <ArrowIcon size={14} />
          <span>
            {isFa
              ? 'مشاهده تمام دسته‌بندی‌های آموزش زبان'
              : 'Explore all Romanian learning categories'}
          </span>
        </Link>
      </div>
    </div>
  );
}
