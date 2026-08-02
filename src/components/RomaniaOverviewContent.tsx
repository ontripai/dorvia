'use client';

import React from 'react';
import { Language } from '../types';
import { Button } from './Button';
import { Landmark, Building2, ShieldCheck, Scale, FileCheck2, ExternalLink } from './Icons';
import { featuredCities } from '../lib/data';
import { CityCard } from './CityCard';

interface RomaniaOverviewContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const RomaniaOverviewContent: React.FC<RomaniaOverviewContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  switch (subRoute) {

    // 1. ECONOMY OF ROMANIA
    case 'economy':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'شناخت کشور رومانی' : 'Discover Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'اقتصاد رومانی؛ صنایع، درآمد، بازار کار و شاخص‌های اقتصادی' : 'Economy of Romania: Industries, Earnings & Market Outlook'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'تحلیل جامع ساختار اقتصادی اتحادیه اروپا در رومانی، حوزه فناوری اطلاعات، صنایع خودروسازی و میانگین درآمدهای قانونی.'
                : 'Comprehensive analysis of EU economic structures in Romania, IT tech hubs, automotive sector & legal wage benchmarks.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="editorial-card p-5 bg-white text-center space-y-1">
              <div className="text-xs text-[#788697] font-bold">عضویت در اتحادیه اروپا</div>
              <div className="text-lg font-extrabold text-[#2F6FED]">کامل (EU)</div>
            </div>
            <div className="editorial-card p-5 bg-white text-center space-y-1">
              <div className="text-xs text-[#788697] font-bold">منطقه شنگن</div>
              <div className="text-lg font-extrabold text-emerald-700">عضو رسمی</div>
            </div>
            <div className="editorial-card p-5 bg-white text-center space-y-1">
              <div className="text-xs text-[#788697] font-bold">صنایع پیشرو</div>
              <div className="text-lg font-extrabold text-[#2F6FED]">IT & Auto</div>
            </div>
            <div className="editorial-card p-5 bg-white text-center space-y-1">
              <div className="text-xs text-[#788697] font-bold">واحد پول ملی</div>
              <div className="text-lg font-extrabold text-[#2F6FED]">RON (Leu)</div>
            </div>
          </div>
        </div>
      );

    // 2. SOCIETY
    case 'society':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'جامعه و زندگی اجتماعی در رومانی' : 'Romanian Society & Social Life'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'آشنایی با جمعت، زبان رسمی، آداب رفتار اجتماعی، سیستم آموزش و یکپارچگی مهاجرین.'
                : 'Demographics, official language, social etiquette, education system & integration guidance.'}
            </p>
          </div>
        </div>
      );

    // 3. CULTURE AND ARTS
    case 'culture-and-arts':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'فرهنگ، هنر و میراث تاریخی رومانی' : 'Culture, Arts & Cultural Heritage'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'معرفی تاریخ، معماری غنی بخارست و ترانسیلوانیا، موسیقی کلاسیک، آداب سنتی و موزوه‌ها.'
                : 'History, Bucharest architecture, Transylvanian heritage, classical music & museums.'}
            </p>
          </div>
        </div>
      );

    // 4. LAWS AND REGULATIONS
    case 'laws-and-regulations':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'حقوق و مقررات' : 'Legal Hub'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'قوانین و مقررات مهم رومانی' : 'Key Romanian Laws & Regulations'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'مرور قوانین کلیدی مهاجرت، کارفرمایی، قراردادهای کار، حریم خصوصی (GDPR) و حقوق مصرف‌کننده.'
                : 'Overview of immigration laws, employment contracts, labor rules & GDPR standards.'}
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed font-semibold">
            ⚖️ <strong>سلب مسئولیت حقوقی:</strong> این صفحه یک راهنمای عمومی است و جایگزین مشاوره حقوقی متناسب با پرونده شخصی نیست. متن و اجرای قوانین ممکن است تغییر کند؛ برای تصمیم‌گیری نهایی باید نسخه جاری قانون و نظر متخصص واجد صلاحیت بررسی شود.
          </div>
        </div>
      );

    // 5. TOURISM
    case 'tourism':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'راهنمای جامع گردشگری رومانی' : 'Romania Tourism & Travel Guide'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'معرفی قلعه‌های ترانسیلوانیا (Peles & Bran)، طبیعت کارپات، سواحل دریای سیاه و دلتای دانوب.'
                : 'Transylvanian castles, Carpathian mountain nature, Black Sea resorts & Danube Delta.'}
            </p>
          </div>
        </div>
      );

    // 6. CITIES HUB
    case 'cities':
    default:
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'شهرهای کلیدی کشور رومانی' : 'Key Cities of Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای جامع بخارست، کلوژ-نپوکا، تیمیشوارا، یاش و براشوف برای تحصیل، کار و استقرار.'
                : 'Detailed guides for Bucharest, Cluj-Napoca, Timișoara, Iași & Brașov.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCities.map((city) => (
              <CityCard key={city.id} city={city} currentLang={currentLang} onSelect={() => {}} />
            ))}
          </div>
        </div>
      );
  }
};
