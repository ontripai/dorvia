import React from 'react';
import { Language } from '@/types';
import { RomanianPhrase, RomanianCategory } from '@/lib/romanian/types';
import { PublishedStationInfo } from '@/lib/romanian/content';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ArrowLeft, ArrowRight } from '@/components/Icons';
import { CategoryGrid } from './CategoryGrid';
import { PhraseCard } from './PhraseCard';

interface RomanianHubProps {
  currentLang: Language;
  categoryCounts: Record<RomanianCategory, number>;
  samplePhrases: RomanianPhrase[];
  stations?: PublishedStationInfo[];
}

const toFaDigits = (n: number | string): string =>
  String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export const RomanianHub: React.FC<RomanianHubProps> = ({
  currentLang,
  categoryCounts,
  samplePhrases,
  stations = [],
}) => {
  const isFa = currentLang === 'fa';
  const ArrowIcon = isFa ? ArrowLeft : ArrowRight;

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

      {/* Core Stations Section (Dynamically rendered from published stations) */}
      {stations.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
            <div>
              <div className="text-xs font-bold text-[#1554bd] uppercase tracking-wider mb-1">
                {isFa ? 'برنامه آموزشی پایه' : 'Foundational Curriculum'}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
                {isFa ? 'ایستگاه‌های یادگیری هسته' : 'Core Learning Stations'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isFa
                  ? 'پنج ایستگاه اصلی آموزش رومانیایی: ضمایر، کلمات پرسشی، اعداد، زمان و احوال‌پرسی روزمره.'
                  : 'Five essential foundation modules: pronouns, question words, numbers, time, and greetings.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stations.map(st => (
              <Link
                key={st.slug}
                href={`/learn-romanian/modul/${st.slug}`}
                className="editorial-card group p-5 sm:p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-[#1554bd] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#1554bd]">
                      {isFa
                        ? `${toFaDigits(st.totalCount)} مورد آموزشی`
                        : `${st.totalCount} learning item${st.totalCount > 1 ? 's' : ''}`}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0">
                      {isFa ? `ایستگاه ${toFaDigits(st.order)}` : `Station ${st.order}`}
                    </span>
                  </div>

                  {/*
                    مرز پرداخت باید دیده شود. `isFree` از dre-p177 در داده بود و
                    V37 تضمین می‌کرد پیشوند ترتیب آموزشی باشد، ولی هیچ‌جا رندر
                    نمی‌شد — یعنی یادگیرنده نمی‌دانست از کجا رایگان است.
                  */}
                  {(st.isFree || st.stepCount > 0) && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {st.isFree && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          {isFa ? 'رایگان' : 'Free'}
                        </span>
                      )}
                      {st.stepCount > 0 && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                          {isFa
                            ? `${toFaDigits(st.stepCount)} گام`
                            : `${st.stepCount} step${st.stepCount > 1 ? 's' : ''}`}
                        </span>
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#142033] group-hover:text-[#1554bd] transition-colors">
                      {isFa ? st.titleFa : st.titleRo}
                    </h3>
                    <div className="text-xs text-slate-400 font-heading">
                      {isFa ? st.titleRo : st.titleFa}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1554bd]">
                  <span>{isFa ? 'مشاهده درس‌ها و واژگان' : 'View module content'}</span>
                  <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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
