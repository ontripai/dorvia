'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/components/AppLayout';
import { getTranslations } from '@/lib/i18n';
import { sampleArticles } from '@/lib/data';
import { EvaluationCTA } from '@/components/EvaluationCTA';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ArrowLeft, ArrowRight, Calendar, Clock, BookOpen } from '@/components/Icons';

export default function ArticlesPage() {
  const { currentLang, onOpenEvaluationModal, onNavigate } = useAppContext();
  const t = getTranslations(currentLang);
  const isFa = currentLang === 'fa';
  const ArrowIcon = isFa ? ArrowLeft : ArrowRight;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const articleRouteMap: Record<string, string> = {
    'schengen-access-2026': '/immigration/long-term-residence',
    'study-medical-romania': '/universities',
    'srl-tax-benefits': '/company/investment',
  };

  const categories = [
    { id: 'all', labelFa: 'همه مقالات', labelEn: 'All Articles' },
    { id: 'immigration', labelFa: 'قوانین مهاجرت', labelEn: 'Immigration Laws' },
    { id: 'education', labelFa: 'تحصیلات عالی', labelEn: 'Higher Education' },
    { id: 'business', labelFa: 'کسب‌ و کار', labelEn: 'Business & Taxes' },
  ];

  const filteredArticles = selectedCategory === 'all'
    ? sampleArticles
    : sampleArticles.filter((art) => {
        if (selectedCategory === 'immigration') return art.category.en.includes('Immigration');
        if (selectedCategory === 'education') return art.category.en.includes('Education');
        if (selectedCategory === 'business') return art.category.en.includes('Business');
        return true;
      });

  const handleNav = (route: string) => {
    if (onNavigate) {
      onNavigate(route.replace(/^\//, ''));
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/10 px-3.5 py-1 rounded-full text-xs font-semibold text-slate-200">
          <BookOpen size={14} className="text-[#2F6FED]" />
          <span>{isFa ? 'مرکز دانش و تحلیل‌های تخصصی DORVIA EUROP' : 'DORVIA EUROP Knowledge & Analysis Hub'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {t.nav.articles}
        </h1>
        <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {isFa
            ? 'مجموعه مقالات، تحلیل‌های حقوقی و راهنماهای کاربردی پیرامون قوانین شنگن، مهاجرت، پذیرش دانشگاهی و ثبت شرکت در رومانی.'
            : 'Comprehensive articles, legal updates, and practical insights covering Schengen regulations, university admissions, and business setup in Romania.'}
        </p>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#2F6FED] text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-[#526174] border border-[#dfe6ef]'
              }`}
            >
              {isFa ? cat.labelFa : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => {
          const targetRoute = articleRouteMap[art.id] || '/start-here';

          return (
            <div
              key={art.id}
              className="editorial-card p-6 bg-white border border-[#dfe6ef] rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#2F6FED] hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2F6FED] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {art.category[currentLang]}
                  </span>
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-[11px] text-[#788697]">
                    <Clock size={12} />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-[#142033] group-hover:text-[#2F6FED] transition-colors leading-snug">
                  {art.title[currentLang]}
                </h3>

                <p className="text-xs text-[#526174] leading-relaxed line-clamp-4">
                  {art.excerpt[currentLang]}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#dfe6ef]">
                <div className="flex items-center justify-between text-[11px] text-[#788697]">
                  <span className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Calendar size={12} />
                    <span>{art.date}</span>
                  </span>
                  <span className="font-semibold text-slate-500">DORVIA EUROP</span>
                </div>

                <Link
                  href={targetRoute}
                  onClick={() => handleNav(targetRoute)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse bg-[#f8fafc] hover:bg-blue-50 text-[#2F6FED] font-bold text-xs py-2.5 rounded-xl border border-[#dfe6ef] hover:border-blue-200 transition-colors"
                >
                  <span>{isFa ? 'مطالعه راهنمای کامل' : 'Read Full Guide'}</span>
                  <ArrowIcon size={14} className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* EVALUATION CTA */}
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
