'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { Button } from './Button';
import { Landmark, Building2, ShieldCheck, Scale, FileCheck2, ExternalLink, ArrowRight, ArrowLeft } from './Icons';
import { featuredCities } from '../lib/data';
import { CityCard } from './CityCard';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

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
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  switch (subRoute) {

    // 0. ROMANIA GENERAL HUB
    case 'romania':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'شناخت کشور رومانی' : 'Discover Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'راهنمای جامع جغرافیا، شهرها و قوانین رومانی' : 'Overview of Romania: Society, Economy & Key Cities'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'مقدمه‌ای بر اقتصاد پویا، جامعه چندفرهنگی، تاریخ و فرهنگ غنی و کلیدی‌ترین شهرهای کشور رومانی.'
                : 'Introduction to Romania’s growing EU economy, diverse society, rich cultural heritage, and key urban centers.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/romania/economy" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1554bd] flex items-center justify-center">📈</span>
                  <span>{currentLang === 'fa' ? 'اقتصاد و بازار کار' : 'Economy & Industries'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'تحلیل ساختار اقتصادی، قطب‌های فناوری و متوسط درآمد قانونی.' : 'Economic structure, IT hubs, and wage standards.'}</p>
              </div>
              <span className="text-xs font-bold text-[#1554bd] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/romania/society" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1554bd] flex items-center justify-center">👥</span>
                  <span>{currentLang === 'fa' ? 'جامعه و زندگی اجتماعی' : 'Society & Demographics'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'آشنایی با مردم رومانی، زبان رسمی، آداب اجتماعی و سیستم آموزش.' : 'Population dynamics, social life, and expat integration.'}</p>
              </div>
              <span className="text-xs font-bold text-[#1554bd] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/romania/culture-and-arts" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1554bd] flex items-center justify-center">🏛️</span>
                  <span>{currentLang === 'fa' ? 'فرهنگ، هنر و میراث' : 'Culture, Arts & Heritage'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'تاریخ غنی، قلعه‌های ترانسیلوانیا، موسیقی کلاسیک و آیین‌های سنتی.' : 'Carpathian folklore, historical landmarks, and classical music.'}</p>
              </div>
              <span className="text-xs font-bold text-[#1554bd] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/romania/laws-and-regulations" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1554bd] flex items-center justify-center">⚖️</span>
                  <span>{currentLang === 'fa' ? 'قوانین و مقررات عمومی' : 'Key Laws & Regulations'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'حقوق مصرف‌کننده، اصول قراردادها و حریم خصوصی (GDPR) در رومانی.' : 'General civil code, consumer rights, and GDPR standards.'}</p>
              </div>
              <span className="text-xs font-bold text-[#1554bd] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/romania/cities" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1554bd] flex items-center justify-center">🏙️</span>
                  <span>{currentLang === 'fa' ? 'شهرهای مهم رومانی' : 'Key Cities of Romania'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'راهنمای بخارست، کلوژ-نپوکا، یاش، تیمیشوارا و براشوف برای اقامت.' : 'Guides for Bucharest, Cluj-Napoca, Timișoara, Iași, and Brașov.'}</p>
              </div>
              <span className="text-xs font-bold text-[#1554bd] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/romania/tourism" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1554bd] flex items-center justify-center">✈️</span>
                  <span>{currentLang === 'fa' ? 'جاذبه‌های گردشگری' : 'Tourism & Travel'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'معرفی قلعه‌های تاریخی، طبیعت کارپات و دلتای دانوب.' : 'Danube delta, Carpathian ski resorts, and historical castles.'}</p>
              </div>
              <span className="text-xs font-bold text-[#1554bd] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/romania/geography" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1554bd] flex items-center justify-center">🗺️</span>
                  <span>{currentLang === 'fa' ? 'جغرافیا و مناطق' : 'Geography & Regions'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'مناطق تاریخی، تفاوت آب‌وهوا و فاصله بین شهرهای اصلی.' : 'Historic regions, climate differences, and city-to-city distances.'}</p>
              </div>
              <span className="text-xs font-bold text-[#1554bd] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/romania/history" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1554bd] flex items-center justify-center">📜</span>
                  <span>{currentLang === 'fa' ? 'تاریخ رومانی' : 'History of Romania'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'از داکیای رومی تا امروز — زمینه‌ای برای درک جامعه فعلی.' : 'From Roman Dacia to today — context for understanding modern society.'}</p>
              </div>
              <span className="text-xs font-bold text-[#1554bd] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>
          </div>
        </div>
      );


    // 1. ECONOMY OF ROMANIA
    case 'economy':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/economy" currentLang={currentLang} onNavigate={onNavigate} />

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
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منابع: مؤسسه ملی آمار رومانی (INS) — insse.ro، بانک ملی رومانی (BNR) — bnr.ro، کمیسیون اروپا — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Sources: National Institute of Statistics Romania (INS) — insse.ro, National Bank of Romania (BNR) — bnr.ro, European Commission — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="editorial-card p-5 bg-white text-center space-y-1">
              <div className="text-xs text-[#788697] font-bold">{currentLang === 'fa' ? 'عضویت در اتحادیه اروپا' : 'EU Membership'}</div>
              <div className="text-lg font-extrabold text-[#1554bd]">{currentLang === 'fa' ? 'کامل، از ۲۰۰۷' : 'Full, since 2007'}</div>
            </div>
            <div className="editorial-card p-5 bg-white text-center space-y-1">
              <div className="text-xs text-[#788697] font-bold">{currentLang === 'fa' ? 'منطقه شنگن' : 'Schengen Area'}</div>
              <div className="text-lg font-extrabold text-emerald-700">{currentLang === 'fa' ? 'عضو کامل' : 'Full member'}</div>
            </div>
            <div className="editorial-card p-5 bg-white text-center space-y-1">
              <div className="text-xs text-[#788697] font-bold">{currentLang === 'fa' ? 'صنایع پیشرو' : 'Leading Sectors'}</div>
              <div className="text-lg font-extrabold text-[#1554bd]">IT & Auto</div>
            </div>
            <div className="editorial-card p-5 bg-white text-center space-y-1">
              <div className="text-xs text-[#788697] font-bold">{currentLang === 'fa' ? 'واحد پول ملی' : 'National Currency'}</div>
              <div className="text-lg font-extrabold text-[#1554bd]">RON (Leu)</div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'رومانی از سال ۲۰۰۷ عضو کامل اتحادیه اروپا است و از ژانویه ۲۰۲۵ (پس از رفع کنترل مرزی هوایی و دریایی در مارس ۲۰۲۴) به‌طور کامل به فضای شنگن پیوسته است؛ یعنی دیگر هیچ کنترل مرزی داخلی شنگن (زمینی، هوایی یا دریایی) روی مرزهای رومانی وجود ندارد. با این حال، رومانی هنوز یورو را نپذیرفته و واحد پول رسمی همچنان لئوی رومانی (RON) است؛ در آگوست ۲۰۲۶ رئیس‌جمهور رومانی صرفاً از یک «توافق سیاسی» درباره اولویت پیوستن به یورو خبر داد، بدون تاریخ قطعی جدید (تاریخ اولیه ۲۰۲۹ پیش‌تر مطرح شده بود، اما گزارش همگرایی ژوئن ۲۰۲۶ نشان می‌دهد رومانی هنوز اکثر معیارهای یورو را احراز نکرده است).'
              : 'Romania has been a full EU member since 2007 and, as of January 2025 (following the March 2024 lifting of air/sea checks), is a full Schengen Area member — meaning no internal Schengen border checks (land, air, or sea) remain at Romania\'s borders. Romania has not yet adopted the euro, however; the official currency remains the Romanian Leu (RON). In August 2026 the Romanian president announced only a "political agreement" on prioritizing euro adoption, with no confirmed new target date (an earlier 2029 target had circulated, but the June 2026 EU Convergence Report found Romania still fails most of the formal euro-adoption criteria).'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'صنایع پیشرو و قطب‌های فناوری' : 'Leading Industries & Tech Hubs'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'برون‌سپاری نرم‌افزار و فناوری اطلاعات (IT/BPO) یکی از سریع‌ترین حوزه‌های رشد رومانی است؛ کلوژ-نپوکا، بخارست، یاش و تیمیشوارا مهم‌ترین قطب‌های فناوری کشورند.' : 'Software/IT outsourcing (IT/BPO) is one of Romania\'s fastest-growing sectors; Cluj-Napoca, Bucharest, Iași, and Timișoara are the country\'s leading tech hubs.'}</li>
                <li>{currentLang === 'fa' ? 'صنعت خودروسازی نیز نقش کلیدی دارد: کارخانه داچیا (گروه رنو) در میووِنی و کارخانه فورد در کرایوا از بزرگ‌ترین تولیدکنندگان منطقه هستند.' : 'The automotive industry is also central: the Dacia (Renault Group) plant in Mioveni and the Ford plant in Craiova are among the region\'s largest manufacturers.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'حداقل دستمزد و میانگین درآمد' : 'Minimum Wage & Average Income'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'حداقل دستمزد ناخالص ملی رومانی در سال ۲۰۲۶ به‌صورت دو مرحله‌ای تعیین شده (نیمه اول و دوم سال با ارقام متفاوت)؛ برای رقم دقیق و به‌روز، سایت وزارت کار یا BNR را بررسی کنید.' : 'Romania\'s national gross minimum wage in 2026 is set in two tiers (different figures for the first and second half of the year); check the Ministry of Labour or BNR site for the exact current figure.'}</li>
                <li>{currentLang === 'fa' ? 'بر اساس داده مؤسسه ملی آمار (INS)، میانگین دستمزد خالص ماهانه در سراسر کشور در میانه سال ۲۰۲۶ در محدوده چند هزار لئو بوده؛ این رقم بین شهرها و مشاغل تفاوت زیادی دارد، به‌ویژه در بخش فناوری اطلاعات که معمولاً بالاتر از میانگین ملی است.' : 'Per National Institute of Statistics (INS) data, the nationwide average monthly net salary in mid-2026 was in the low thousands of RON; this varies significantly by city and profession, particularly in IT, which typically pays well above the national average.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{currentLang === 'fa' ? 'ارقام دستمزد به‌طور مرتب تغییر می‌کند؛ برای اهداف قراردادی یا مهاجرتی همیشه از سایت رسمی INS یا BNR رقم روز را استعلام کنید.' : 'Wage figures change regularly; for contractual or immigration purposes, always check the current figure directly on the official INS or BNR site.'}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'ثبات اقتصادی و چشم‌انداز' : 'Economic Stability & Outlook'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'به‌عنوان عضو اتحادیه اروپا، رومانی از دسترسی آزاد به بازار واحد اروپا بهره‌مند است که فرصت‌های زیادی برای تجارت و اشتغال شهروندان خارجی مقیم فراهم می‌کند.' : 'As an EU member, Romania benefits from free access to the European single market, creating opportunities for trade and employment for resident foreign nationals.'}</li>
                <li>{currentLang === 'fa' ? 'با این حال، نرخ تورم و نوسانات ارزی همچون هر اقتصاد در حال توسعه‌ای وجود دارد؛ برنامه‌ریزی مالی بلندمدت باید این نوسانات را در نظر بگیرد.' : 'That said, inflation and currency fluctuations exist as in any developing economy; long-term financial planning should account for this volatility.'}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا رومانی از یورو استفاده می‌کند؟' : 'Does Romania use the euro?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. واحد پول رسمی رومانی همچنان لئو (RON) است. پیوستن به یورو موضوعی سیاسی و در حال بحث است و تاریخ قطعی ندارد.' : 'No. Romania\'s official currency remains the Leu (RON). Euro adoption is a politically debated topic with no confirmed date.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا برای سفر به رومانی نیاز به ویزای شنگن جداگانه دارم؟' : 'Do I need a separate Schengen visa to enter Romania?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر؛ از ژانویه ۲۰۲۵ رومانی عضو کامل فضای شنگن است، بنابراین ویزای شنگن معتبر یا اقامت شنگن برای ورود کافی است و کنترل مرزی داخلی وجود ندارد.' : 'No; since January 2025 Romania is a full Schengen member, so a valid Schengen visa or Schengen residence permit is sufficient for entry, with no internal border checks.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="romania/economy" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    // 2. SOCIETY
    case 'society':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/society" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'جامعه و زندگی اجتماعی در رومانی' : 'Romanian Society & Social Life'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'آشنایی با جمعت، زبان رسمی، آداب رفتار اجتماعی، سیستم آموزش و یکپارچگی مهاجرین.'
                : 'Demographics, official language, social etiquette, education system & integration guidance.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: مؤسسه ملی آمار رومانی (INS) — سرشماری ۲۰۲۱ — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: National Institute of Statistics Romania (INS) — 2021 census — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'طبق سرشماری رسمی سال ۲۰۲۱، جمعیت رومانی نزدیک به ۱۹ میلیون نفر است. زبان رسمی و غالب کشور رومانیایی است، اما اقلیت‌های قومی و زبانی (از جمله مجار و روما) در برخی مناطق، به‌ویژه ترانسیلوانیا، حضور قابل‌توجهی دارند. جامعه مهاجران خارجی — از جمله ایرانیان — عمدتاً در شهرهای بزرگ مانند بخارست و کلوژ-نپوکا متمرکز است، جایی که دانشگاه‌ها، شرکت‌های فناوری و شبکه‌های اجتماعی بین‌المللی رشد کرده‌اند.'
              : 'Per the official 2021 census, Romania\'s population is approximately 19 million. Romanian is the official and dominant language, though ethnic and linguistic minorities (including Hungarian and Roma communities) have a notable presence in certain regions, particularly Transylvania. The foreign expatriate community — including Iranians — is concentrated mainly in larger cities such as Bucharest and Cluj-Napoca, where universities, tech companies, and international social networks have grown.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'آداب اجتماعی رایج' : 'Common Social Etiquette'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'دست دادن هنگام معارفه رسمی رایج است؛ در محیط‌های کاری، وقت‌شناسی برای جلسات ارزش زیادی دارد.' : 'A handshake is common when formally meeting someone; punctuality for meetings is highly valued in professional settings.'}</li>
                <li>{currentLang === 'fa' ? 'انعام (Bacșiș) در رستوران‌ها رایج است، معمولاً حدود ۱۰٪ صورت‌حساب، هرچند اجباری نیست.' : 'Tipping (Bacșiș) at restaurants is customary, typically around 10% of the bill, though not obligatory.'}</li>
                <li>{currentLang === 'fa' ? 'هنگام هدیه دادن (مثلاً گل)، همیشه تعداد فرد انتخاب کنید — تعداد زوج گل مخصوص مراسم تدفین است. هدیه معمولاً همان‌جا و جلوی هدیه‌دهنده باز می‌شود.' : "When giving flowers, always choose an odd number — an even number is specifically associated with funerals. Gifts are typically opened right away, in front of the giver."}</li>
                <li>{currentLang === 'fa' ? 'سر میز غذا: دست‌ها روی میز باشد نه آرنج؛ غذا فقط بعد از این‌که میزبان «Poftă bună» (نوش جان) گفت شروع می‌شود؛ تمام کردن بشقاب، تعریف از آشپز محسوب می‌شود؛ تست رایج «Noroc!» (به سلامتی) است — اگر نمی‌خواهید بیشتر بنوشید، کافی است لیوانتان را نیمه‌پر نگه دارید.' : "At the table: hands stay on the table, not elbows; the meal starts only after the host says \"Poftă bună\"; finishing your plate is taken as a compliment to the cook; the standard toast is \"Noroc!\" — if you'd rather not keep drinking, simply leave your glass half-full."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'ساختار نظام آموزشی' : 'Education System Structure'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'آموزش پایه و متوسطه در رومانی اجباری است و در مدارس دولتی رایگان ارائه می‌شود؛ زبان اصلی آموزش رومانیایی است.' : 'Primary and secondary education in Romania is compulsory and provided free in public schools; the primary language of instruction is Romanian.'}</li>
                <li>{currentLang === 'fa' ? 'نظام دانشگاهی از مقاطع کارشناسی، کارشناسی ارشد و دکتری تشکیل شده و با فرآیند بولونیا هماهنگ است؛ جزئیات کامل در بخش تحصیل سایت آمده است.' : 'The university system follows bachelor\'s, master\'s, and doctoral levels aligned with the Bologna Process; full details are covered in the site\'s Study section.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'جامعه مهاجران و ادغام' : 'Expat Community & Integration'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بخارست و کلوژ-نپوکا میزبان جوامع بزرگ دانشجویی و کاری بین‌المللی هستند، با گروه‌های آنلاین فعال ایرانیان مقیم برای تبادل تجربه.' : 'Bucharest and Cluj-Napoca host large international student and professional communities, with active online groups of resident Iranians for exchanging experience.'}</li>
                <li>{currentLang === 'fa' ? 'یادگیری حداقل عبارات پایه رومانیایی، حتی برای کسانی که در محیط‌های انگلیسی‌زبان کار/تحصیل می‌کنند، در تعاملات روزمره (مانند اداره‌ها، فروشگاه‌ها) بسیار کمک‌کننده است.' : 'Learning at least basic Romanian phrases, even for those working/studying in English-speaking environments, is very helpful for everyday interactions (offices, shops).'}</li>
                <li>{currentLang === 'fa' ? 'رومانی‌ها را با سایر کشورهای اروپای شرقی یا یوگسلاوی سابق اشتباه نگیرید (زبان رومانیایی، رومنس است و به ایتالیایی/فرانسوی نزدیک‌تر است تا زبان‌های اسلاوی)؛ همچنین رومانیایی‌ها و روما (کولی) دو هویت قومی کاملاً جدا هستند. برخورد اولیه رسمی و کمی سرد طبیعی است و نشانه بی‌ادبی نیست — با اعتماد، گرم‌تر می‌شود.' : "Don't confuse Romanians with other Eastern European nationalities or the former Yugoslavia (Romanian is a Romance language, closer to Italian/French than Slavic languages); also, Romanians and Roma (an ethnic minority) are entirely separate identities. An initially formal, somewhat reserved first impression is normal and not rudeness — it warms up with trust."}</li>
              </ul>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#dfe6ef] shadow-sm">
            <table className="w-full text-sm text-[#526174] bg-white">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#dfe6ef]">
                  <th className="p-4 text-start font-bold text-[#142033]">{currentLang === 'fa' ? 'تعطیلات ارتدوکس ۲۰۲۶' : 'Orthodox Holiday, 2026'}</th>
                  <th className="p-4 text-start font-bold text-[#142033]">{currentLang === 'fa' ? 'تاریخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#eef2f6]"><td className="p-4">{currentLang === 'fa' ? 'تعمید (Bobotează)' : 'Epiphany (Bobotează)'}</td><td className="p-4">6–7 {currentLang === 'fa' ? 'ژانویه' : 'January'}</td></tr>
                <tr className="border-b border-[#eef2f6]"><td className="p-4">{currentLang === 'fa' ? 'جمعه مقدس تا دوشنبه عید پاک' : 'Good Friday – Easter Monday'}</td><td className="p-4">10–13 {currentLang === 'fa' ? 'آوریل' : 'April'}</td></tr>
                <tr className="border-b border-[#eef2f6]"><td className="p-4">{currentLang === 'fa' ? 'پنطیکاست (Rusalii)' : 'Pentecost (Rusalii)'}</td><td className="p-4">31 {currentLang === 'fa' ? 'مه' : 'May'} – 1 {currentLang === 'fa' ? 'ژوئن' : 'June'}</td></tr>
                <tr className="border-b border-[#eef2f6]"><td className="p-4">{currentLang === 'fa' ? 'اعتلای مریم مقدس' : 'Dormition of the Mother of God'}</td><td className="p-4">15 {currentLang === 'fa' ? 'اوت' : 'August'}</td></tr>
                <tr><td className="p-4">{currentLang === 'fa' ? 'روز سنت آندره (قدیس حامی رومانی)' : "St. Andrew's Day (patron saint)"}</td><td className="p-4">30 {currentLang === 'fa' ? 'نوامبر' : 'November'}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 italic px-2">
            {currentLang === 'fa'
              ? 'همه این‌ها تعطیل رسمی و غیرکاری هستند — بانک‌ها، ادارات دولتی و دفاتر نوتاری بسته می‌شوند. عید پاک ارتدوکس هر سال با تقویم غربی/کاتولیک فرق دارد (در ۲۰۲۷ مثلاً ۲ مه است، نه تاریخ عید پاک کاتولیک) — اگر با تقویم عید پاک غربی برنامه‌ریزی کنید، در تاریخ اشتباه گرفتار می‌شوید. بازه جمعه مقدس تا دوشنبه عید پاک (۴ روز) و کریسمس، دو دوره‌ای هستند که عملاً همه‌چیز، حتی زندگی اجتماعی غیررسمی، متوقف می‌شود چون بسیاری به روستای خانوادگی سفر می‌کنند.'
              : "All of these are official non-working holidays — banks, government offices, and notary offices close. Orthodox Easter falls on a different date each year than the Western/Catholic calendar (in 2027, for instance, it's May 2, not the Catholic Easter date) — planning around the Western Easter date will get you the wrong day. The Good Friday–Easter Monday stretch (4 days) and Christmas are the two periods when practically everything, even informal social life, pauses, as many people travel to their family village."}
          </p>

          <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-3">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? 'دین‌داری: هویت قوی، زندگی روزمره سکولار' : 'Religiosity: Strong Identity, Secular Daily Life'}
            </h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'طبق نظرسنجی معتبر Pew Research (۲۰۱۸)، رومانی از میان ۳۴ کشور اروپایی بررسی‌شده، رتبه اول «تعهد دینی» را دارد (۵۰٪ می‌گویند دین برایشان بسیار مهم است، ۵۰٪ حداقل ماهی یک‌بار به کلیسا می‌روند) — رقمی که یک نظرسنجی داخلی رومانیایی در سال ۲۰۲۵ هم با عدد مشابه (~۴۷٪ حضور ماهانه) تایید کرد. اما نکته مهم برای یک تازه‌وارد ایرانی: این دین‌داری بالا (کلیسای ارتدوکس) به‌معنای تنظیم دینی زندگی عمومی نیست — پوشش، اختلاط زن و مرد، و مصرف الکل عمدتاً بر اساس هنجارهای سکولار اروپایی است، نه قوانین یا فشار اجتماعی دینی.'
                : "According to the well-established Pew Research survey (2018), Romania ranks first in \"religious commitment\" among 34 European countries surveyed (50% say religion is very important to them, 50% attend church at least monthly) — a figure a 2025 domestic Romanian survey largely confirmed (~47% monthly attendance). But the key point for an Iranian newcomer: this high religiosity (Orthodox Christianity) does not translate into religious regulation of public life — dress, gender-mixing, and alcohol consumption are governed mainly by secular European norms, not religious law or social pressure."}
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-white border border-[#dfe6ef] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? '🇮🇷 ویژه ایرانیان: غذای حلال، مسجد، الکل، و نوروز در رومانی' : '🇮🇷 Iran-Specific: Halal Food, Mosques, Alcohol & Nowruz in Romania'}
            </h3>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'غذای حلال: چند رستوران واقعی و فعال در بخارست وجود دارد (Beyti، Saray، Divan، Sfeir Lebanese، Zaitoone، Duman و چند رستوران هندی/آسیایی)، و در کلوژ-نپوکا رستوران Mesopotamia (داخل مول Iulius) و Berrak Kebab. برای قصابی حلال، منابع مستند و به‌روز محدودند — بهتر است پیش از اعتماد به یک آدرس قدیمی، وضعیت فعلی را بررسی کنید.'
                : 'Halal food: several real, active restaurants exist in Bucharest (Beyti, Saray, Divan, Sfeir Lebanese, Zaitoone, Duman, and a few Indian/Asian options), and in Cluj-Napoca, Mesopotamia (inside Iulius Mall) and Berrak Kebab. Documented, up-to-date sources for halal butchers are limited — verify the current status before relying on an old listing.'}
            </p>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'مسجد: مسجد کارول-هونکیار (معروف به «جامع پیپتاناری») در خیابان Constantin Mănescu بخارست، فعال و باز به روی همه، با ۵ نماز روزانه — قدیمی‌ترین و اصلی‌ترین مسجد فعال شهر (از ۱۹۰۰-۱۹۰۶). نکته جالب: پروژه یک «مسجد بزرگ» مدرن با بودجه دولت ترکیه در ۲۰۱۵ تایید شد، اما در ۲۰۱۸ به‌خاطر مخالفت محلی و کمبود بودجه لغو شد — یعنی بخارست هنوز مسجد بزرگ مدرنی ندارد. در کلوژ-نپوکا، مرکز فرهنگی اسلامی «Islam Cluj» (از ۲۰۰۳) نماز روزانه و خطبه جمعه برگزار می‌کند. جمعیت مسلمانان کل رومانی طبق سرشماری ۲۰۲۱ نزدیک ۷۶ هزار نفر (~۰.۴٪) است که ~۹۷٪ آن در منطقه دوبروجا (کنستانتا/تولچا) با جامعه تاریخی تاتار/ترک متمرکز است — یعنی جامعه بخارست (شامل ایرانیان) نسبتاً کوچک و پراکنده است.'
                : "Mosque: the Carol-Hunchiar Mosque (known as the \"Pieptănari mosque\") on Strada Constantin Mănescu in Bucharest is active and open to everyone, holding all five daily prayers — the city's oldest and main active mosque (built 1900–1906). An interesting detail: a modern \"grand mosque\" project funded by the Turkish government was approved in 2015 but cancelled in 2018 due to local opposition and funding shortfalls — meaning Bucharest still has no large modern mosque. In Cluj-Napoca, the Islam Cluj cultural center (since 2003) holds daily prayers and Friday sermons. Romania's total Muslim population, per the 2021 census, is around 76,000 (~0.4%), with about 97% concentrated in the Dobrogea region (Constanța/Tulcea) around its historic Tatar/Turkish community — meaning Bucharest's community, including Iranians, is relatively small and dispersed."}
            </p>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'الکل: طبق گزارش OECD (۲۰۲۵، داده ۲۰۲۳)، رومانی یکی از بالاترین مصرف سرانه الکل اتحادیه اروپا را دارد (بیش از ۱۱.۵ لیتر الکل خالص سالانه، در برابر میانگین OECD حدود ۸.۵ لیتر). تسویکا و پالینکا (عرق آلوی خانگی) و شراب بخش اصلی مهمان‌نوازی رومانیایی هستند، نه یک فعالیت حاشیه‌ای — اگر به دلایل شخصی/مذهبی نمی‌نوشید، بهتر است صریح و از همان ابتدا بگویید، چون میزبان معمولاً برای ادب اصرار می‌کند.'
                : "Alcohol: per an OECD report (2025, 2023 data), Romania has one of the highest per-capita alcohol consumption rates in the EU (over 11.5 litres of pure alcohol annually, versus an OECD average of about 8.5 litres). Homemade țuică and palincă (plum brandy) and wine are a core part of Romanian hospitality, not a marginal activity — if you don't drink for personal or religious reasons, it's best to say so clearly from the start, since a host will typically keep insisting out of politeness."}
            </p>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'نوروز: موزه ملی روستا «دیمیتری گوستی» در بخارست در مارس ۲۰۲۴ جشنواره نوروز را با همکاری مستقیم سفارت ایران (همراه سفارت‌های هند، قزاقستان، ترکمنستان و ترکیه) برگزار کرد — نمایش لباس سنتی، فرش و موسیقی. رسانه‌های رسمی رومانی (خبرگزاری آژرپرس، تلویزیون ملی) هم هرساله درباره «۲۱ مارس، روز جهانی نوروز سازمان ملل» می‌نویسند، یعنی آگاهی نهادی از این مناسبت در رومانی وجود دارد. تکرار سالانه دقیق رویداد موزه تایید نشده، اما این نشان می‌دهد نوروز کاملاً ناشناخته نیست.'
                : "Nowruz: Bucharest's National Village Museum \"Dimitrie Gusti\" held a Nowruz festival in March 2024 directly co-organized with the Iranian Embassy (alongside the embassies of India, Kazakhstan, Turkmenistan, and Turkey) — featuring traditional dress, carpets, and music. Romania's official media (the AGERPRES news agency, national television) also write about \"March 21, UN International Nowruz Day\" every year, showing there's institutional awareness of the occasion in Romania. Whether the museum event recurs annually every year isn't confirmed, but it shows Nowruz isn't entirely unknown here."}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا در رومانی دسترسی به غذا و رستوران حلال آسان است؟' : 'Is halal food easily accessible in Romania?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'در بخارست و کلوژ-نپوکا چندین رستوران حلال فعال (عمدتاً ترکی/خاورمیانه‌ای) وجود دارد، اما نسبت به کشورهای با جامعه مسلمان بزرگ‌تر، گزینه‌ها محدودتر است؛ برای قصابی حلال باید وضعیت فعلی را جداگانه بررسی کنید.' : 'Several active halal restaurants (mostly Turkish/Middle Eastern) exist in both Bucharest and Cluj-Napoca, though options are more limited than in countries with a larger Muslim community; for halal butchers, verify current status separately.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چرا میزبان رومانیایی مدام اصرار می‌کند بنوشم؟' : "Why does my Romanian host keep insisting I drink?"}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'چون تعارف نوشیدنی (به‌خصوص تسویکا/شراب خانگی) بخش اصلی مهمان‌نوازی رومانیایی است، نه یک پیشنهاد جانبی. گفتن صریح و مودبانه «من نمی‌نوشم» از همان ابتدا معمولاً به‌سرعت پذیرفته می‌شود.' : "Because offering a drink (especially homemade țuică or wine) is a core part of Romanian hospitality, not a side offer. Saying clearly and politely \"I don't drink\" from the start is usually accepted quickly."}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا تاریخ عید پاک رومانی با تقویم معمول غربی یکی است؟' : "Does Romanian Easter fall on the same date as the Western calendar?"}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'نه لزوماً — رومانی از تقویم عید پاک ارتدوکس پیروی می‌کند که اغلب چند هفته با تقویم کاتولیک/پروتستان فرق دارد؛ همیشه تاریخ دقیق سال مورد نظر را جداگانه چک کنید، چون در این بازه بانک‌ها و ادارات تعطیل‌اند.' : "Not necessarily — Romania follows the Orthodox Easter calendar, which often falls several weeks apart from the Catholic/Protestant date; always check the exact date for the year in question separately, since banks and offices close during that period."}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="romania/society" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    // 3. CULTURE AND ARTS
    case 'culture-and-arts':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/culture-and-arts" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'فرهنگ، هنر و میراث تاریخی رومانی' : 'Culture, Arts & Cultural Heritage'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'معرفی تاریخ، معماری غنی بخارست و ترانسیلوانیا، موسیقی کلاسیک، آداب سنتی و موزوه‌ها.'
                : 'History, Bucharest architecture, Transylvanian heritage, classical music & museums.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: فهرست رسمی میراث جهانی یونسکو (unesco.org) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: Official UNESCO World Heritage List (unesco.org) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'میراث ثبت‌شده یونسکو' : 'UNESCO World Heritage Sites'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رومانی ۱۱ اثر ثبت‌شده در فهرست میراث جهانی یونسکو دارد؛ از جمله دلتای دانوب، کلیساهای چوبی مارامورش، مرکز تاریخی سیگیشوارا، روستاهای دارای کلیساهای مستحکم ترانسیلوانیا، صومعه‌های نقاشی‌شده بوکووینا (کلیساهای مولداوی) و مجموعه یادبود برانکوشی در تارگو ژیو (۲۰۲۴).' : 'Romania has 11 sites on the UNESCO World Heritage List, including the Danube Delta, the Wooden Churches of Maramureș, the Historic Centre of Sighișoara, the Villages with Fortified Churches of Transylvania, the Painted Monasteries of Bucovina (Churches of Moldavia), and the Brâncuși Monumental Ensemble in Târgu Jiu (2024).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{currentLang === 'fa' ? 'نکته: قلعه‌های معروف پلش و بران، با وجود شهرت گردشگری بالا، رسماً در فهرست میراث جهانی یونسکو ثبت نشده‌اند.' : 'Note: the famous Peleș and Bran castles, despite their high tourist profile, are not formally on the UNESCO World Heritage list.'}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'چهره‌های فرهنگی برجسته' : 'Notable Cultural Figures'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'جورج انسکو (George Enescu)، آهنگساز و نوازنده ویولن، از مطرح‌ترین چهره‌های موسیقی کلاسیک رومانی؛ جشنواره بین‌المللی انسکو هرساله در بخارست برگزار می‌شود.' : 'George Enescu, composer and violinist, is Romania\'s most prominent classical music figure; the international George Enescu Festival is held annually in Bucharest.'}</li>
                <li>{currentLang === 'fa' ? 'کنستانتین برانکوشی (Constantin Brâncuși) در مجسمه‌سازی مدرن، و اوژن یونسکو و امیل سیوران در ادبیات و فلسفه، از چهره‌های تأثیرگذار جهانی با ریشه رومانیایی هستند.' : 'Constantin Brâncuși in modern sculpture, and Eugène Ionesco and Emil Cioran in literature and philosophy, are internationally influential figures of Romanian origin.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'آیین‌های سنتی و موزه‌ها' : 'Traditional Customs & Museums'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'مارتیشور (Mărțișor)، آیین سنتی آغاز بهار در اول مارس، شامل هدیه دادن نشان‌های کوچک قرمز و سفید است و همچنان در سراسر رومانی زنده است.' : 'Mărțișor, the traditional start-of-spring custom on March 1st, involves gifting small red-and-white trinkets and remains widely practiced across Romania.'}</li>
                <li>{currentLang === 'fa' ? 'موزه ملی هنر رومانی و موزه روستا (Muzeul Satului) در بخارست از مهم‌ترین مقاصد فرهنگی پایتخت برای آشنایی با هنر و معماری سنتی روستایی رومانی هستند.' : 'The National Museum of Art of Romania and the Village Museum (Muzeul Satului) in Bucharest are among the capital\'s key cultural destinations for exploring Romanian art and traditional rural architecture.'}</li>
              </ul>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="romania/culture-and-arts" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    // 4. LAWS AND REGULATIONS
    case 'laws-and-regulations':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/laws-and-regulations" currentLang={currentLang} onNavigate={onNavigate} />

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
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منابع: قانون کار رومانی (Codul Muncii)، اداره ملی نظارت بر پردازش داده‌های شخصی (ANSPDCP) — dataprotection.ro، اداره ملی حمایت از مصرف‌کننده (ANPC) — anpc.ro — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Sources: Romanian Labour Code (Codul Muncii), National Supervisory Authority for Personal Data Processing (ANSPDCP) — dataprotection.ro, National Authority for Consumer Protection (ANPC) — anpc.ro — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed font-semibold">
            ⚖️ <strong>{currentLang === 'fa' ? 'سلب مسئولیت حقوقی:' : 'Legal Disclaimer:'}</strong> {currentLang === 'fa' ? 'این صفحه یک راهنمای عمومی است و جایگزین مشاوره حقوقی متناسب با پرونده شخصی نیست. متن و اجرای قوانین ممکن است تغییر کند؛ برای تصمیم‌گیری نهایی باید نسخه جاری قانون و نظر متخصص واجد صلاحیت بررسی شود.' : 'This page is a general guide and is not a substitute for legal advice tailored to your individual case. Laws and their enforcement can change; final decisions should rely on the current text of the law and the opinion of a qualified professional.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'قانون کار (Codul Muncii)' : 'Labour Code (Codul Muncii)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ساعت کاری استاندارد قانونی ۴۰ ساعت در هفته (۸ ساعت در روز، ۵ روز کاری) است.' : 'The standard legal work week is 40 hours (8 hours/day, 5 working days).'}</li>
                <li>{currentLang === 'fa' ? 'حداقل مرخصی سالانه با حقوق طبق قانون ۲۰ روز کاری است؛ قراردادها یا توافقات جمعی می‌توانند این حداقل را افزایش دهند، نه کاهش.' : 'The statutory minimum paid annual leave is 20 working days; individual contracts or collective agreements may increase this minimum, never reduce it.'}</li>
                <li>{currentLang === 'fa' ? 'برای موضوعات خاص مهاجرتی مانند مجوز کار و ویزای کاری، به بخش' : 'For immigration-specific employment topics like work permits and work visas, see the'} <Link href="/work" className="text-[#2F6FED] font-bold hover:underline">{currentLang === 'fa' ? 'کار و اشتغال' : 'Work'}</Link> {currentLang === 'fa' ? 'سایت مراجعه کنید.' : 'section of the site.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'حریم خصوصی و GDPR' : 'Data Privacy & GDPR'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رومانی، به‌عنوان عضو اتحادیه اروپا، مقررات عمومی حفاظت از داده (GDPR) را به‌طور کامل اجرا می‌کند.' : 'As an EU member, Romania fully enforces the General Data Protection Regulation (GDPR).'}</li>
                <li>{currentLang === 'fa' ? 'نهاد رسمی نظارتی، اداره ملی نظارت بر پردازش داده‌های شخصی (ANSPDCP) است که شکایات مربوط به سوءاستفاده از داده‌های شخصی را رسیدگی می‌کند.' : 'The official regulatory body is the National Supervisory Authority for Personal Data Processing (ANSPDCP), which handles complaints about personal-data misuse.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'حقوق مصرف‌کننده' : 'Consumer Rights'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اداره ملی حمایت از مصرف‌کننده (ANPC) نهاد رسمی رسیدگی به شکایات مصرف‌کنندگان درباره کالا و خدمات معیوب یا نقض حقوق مصرف‌کننده است.' : 'The National Authority for Consumer Protection (ANPC) is the official body handling consumer complaints about defective goods/services or consumer-rights violations.'}</li>
                <li>{currentLang === 'fa' ? 'به‌عنوان تبعه اتحادیه اروپا یا مقیم آن، از حقوق استاندارد مصرف‌کننده اروپا (مانند حق بازگشت کالا در خریدهای آنلاین) برخوردار خواهید بود.' : 'As an EU resident, you benefit from standard EU consumer rights (such as the right to return goods purchased online).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4 md:col-span-3">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'قوانین ایمنی روزمره‌ای که باید بدانید' : 'Everyday Safety Laws You Should Know'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رانندگی: سطح مجاز الکل خون صفر مطلق است (۰.۰۰ در هزار) — حتی یک نوشیدنی هم تخلف محسوب می‌شود؛ جریمه‌ها از حدود ۱,۳۰۰ تا ۲,۹۰۰ لئو به‌همراه ابطال ۹۰ روزه گواهینامه شروع می‌شود و در سطوح بالاتر جرم کیفری با حبس تا ۵ سال است.' : 'Driving: the legal blood-alcohol limit is absolute zero (0.00‰) — even one drink is an offense; fines start around 1,300–2,900 RON plus a 90-day license suspension, escalating to a criminal offense with up to 5 years imprisonment at higher levels.'}</li>
                <li>{currentLang === 'fa' ? 'مواد مخدر: نگهداری هر مقدار برای مصرف شخصی — حتی CBD/حشیش — می‌تواند تا ۳ سال حبس داشته باشد؛ رومانی برخلاف برخی همسایگان اروپایی، سیاست تحمل صفر دارد.' : 'Drugs: possession for personal use — of any type or quantity, including CBD/cannabis — can mean up to 3 years imprisonment; unlike some EU neighbors, Romania has a zero-tolerance policy.'}</li>
                <li>{currentLang === 'fa' ? 'نوشیدن الکل در معابر عمومی در اکثر شهرهای رومانی ممنوع است (خارج از تراس کافه/بار مجاز)؛ جریمه معمولاً بین ۱۱۰ تا ۵۰۰ لئو است.' : 'Drinking alcohol in public streets is banned in most Romanian cities (outside a licensed café/bar terrace); fines are typically 110–500 RON.'}</li>
                <li>{currentLang === 'fa' ? <>شماره تلفن اورژانس سراسری و رایگان رومانی <strong>۱۱۲</strong> است (پلیس، آمبولانس، آتش‌نشانی) — از هر خطی حتی بدون سیم‌کارت هم قابل تماس است و اپراتورها معمولاً انگلیسی هم صحبت می‌کنند.</> : <>Romania's unified, free emergency number is <strong>112</strong> (police, ambulance, fire) — reachable from any phone, even without a SIM card, and operators typically speak English.</>}</li>
              </ul>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="romania/laws-and-regulations" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    // 5. TOURISM
    case 'tourism':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/tourism" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'راهنمای جامع گردشگری رومانی' : 'Romania Tourism & Travel Guide'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'معرفی قلعه‌های ترانسیلوانیا (Peles & Bran)، طبیعت کارپات، سواحل دریای سیاه و دلتای دانوب.'
                : 'Transylvanian castles, Carpathian mountain nature, Black Sea resorts & Danube Delta.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: سایت رسمی گردشگری رومانی (romaniatourism.com)، فهرست میراث جهانی یونسکو — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: Official Romania Tourism site (romaniatourism.com), UNESCO World Heritage List — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'از آنجا که رومانی از ژانویه ۲۰۲۵ عضو کامل فضای شنگن است، سفر گردشگری به این کشور برای دارندگان ویزا یا اقامت معتبر شنگن بدون کنترل مرزی داخلی امکان‌پذیر است. رومانی طیف گسترده‌ای از جاذبه‌ها را ارائه می‌دهد: از قلعه‌های افسانه‌ای ترانسیلوانیا تا سواحل دریای سیاه، رشته‌کوه‌های کارپات و دلتای دانوب که یکی از بزرگ‌ترین ذخیره‌گاه‌های زیست‌کره جهان محسوب می‌شود.'
              : 'Because Romania has been a full Schengen member since January 2025, tourist travel to the country is possible without internal border checks for holders of a valid Schengen visa or residence permit. Romania offers a wide range of attractions: from Transylvania\'s legendary castles to the Black Sea coast, the Carpathian Mountains, and the Danube Delta — one of the world\'s largest biosphere reserves.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'قلعه‌ها و شهرهای تاریخی ترانسیلوانیا' : 'Transylvanian Castles & Historic Towns'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'قلعه پلش (Peleș) و قلعه بران (Bran، معروف به قلعه دراکولا) پربازدیدترین جاذبه‌های تاریخی کشورند؛ توجه: این دو رسماً در فهرست میراث جهانی یونسکو نیستند.' : 'Peleș Castle and Bran Castle (known as "Dracula\'s Castle") are the country\'s most-visited historic attractions; note that neither is formally on the UNESCO World Heritage list.'}</li>
                <li>{currentLang === 'fa' ? 'مرکز تاریخی سیگیشوارا در فهرست یونسکو ثبت شده و همراه با براشوف و سیبیو یکی از بهترین نمونه‌های معماری قرون‌وسطایی ترانسیلوانیا است.' : 'The Historic Centre of Sighișoara is UNESCO-listed and, along with Brașov and Sibiu, is among the finest examples of Transylvanian medieval architecture.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'طبیعت: کارپات و دلتای دانوب' : 'Nature: Carpathians & Danube Delta'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پویانا براشوف (Poiana Brașov) و سینایا (Sinaia) مهم‌ترین پیست‌های اسکی رومانی در رشته‌کوه کارپات هستند.' : 'Poiana Brașov and Sinaia are Romania\'s leading ski resorts in the Carpathian Mountains.'}</li>
                <li>{currentLang === 'fa' ? 'دلتای دانوب، ثبت‌شده در فهرست یونسکو از سال ۱۹۹۱ و شناخته‌شده به‌عنوان ذخیره‌گاه زیست‌کره، مقصدی برجسته برای طبیعت‌گردی و پرنده‌نگری است.' : 'The Danube Delta, UNESCO-listed since 1991 and recognized as a biosphere reserve, is a premier destination for nature tourism and birdwatching.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'سواحل دریای سیاه' : 'Black Sea Coast'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ماماییا (Mamaia) و کنستانتسا (Constanța) اصلی‌ترین مقاصد ساحلی رومانی برای فصل تابستان هستند.' : 'Mamaia and Constanța are Romania\'s primary coastal destinations for the summer season.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{currentLang === 'fa' ? 'بهترین فصل سفر برای اکثر جاذبه‌ها بهار تا اوایل پاییز است؛ برای پیست‌های اسکی، فصل زمستان مناسب‌تر است.' : 'The best travel season for most attractions is spring through early autumn; for ski resorts, winter is preferable.'}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4 md:col-span-3">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'ویزا برای گردشگر ایرانی و مسیر فرودگاه' : 'Visa for Iranian Tourists & Airport Transfer'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شهروندان ایرانی از معافیت ویزای شنگن برخوردار نیستند و برای سفر گردشگری به رومانی نیاز به ویزای شنگن دارند که باید حضوری در کنسولگری/مرکز ویزا ثبت شود؛ برای شرایط دقیق و مدارک مورد نیاز (از جمله احتمال نیاز به دعوت‌نامه) حتماً مستقیماً با کنسولگری رومانی تماس بگیرید، چون رویه‌ها تغییر می‌کند.' : 'Iranian citizens are not Schengen visa-exempt and need a Schengen visa for tourist travel to Romania, applied for in person at a consulate/visa center; contact the Romanian consulate directly for exact current requirements (including any invitation-letter rule), as procedures change.'}</li>
                <li>{currentLang === 'fa' ? 'از فرودگاه هنری کواندا (بخارست) تا مرکز شهر: قطار مستقیم تا گارا دو نورد حدود ۲۰-۲۵ دقیقه (ارزان‌ترین)، اتوبوس اکسپرس ۷۸۳ حدود ۴۰-۶۰ دقیقه، یا تاکسی/اوبر/بولت حدود ۱۰-۲۰ یورو.' : 'From Henri Coandă Airport (Bucharest) to the city center: direct train to Gara de Nord in ~20–25 min (cheapest), express bus 783 in ~40–60 min, or taxi/Uber/Bolt for ~€10–20.'}</li>
                <li>{currentLang === 'fa' ? 'اوبر و بولت در اکثر شهرهای بزرگ رومانی (بخارست، کلوژ، تیمیشوارا و دیگران) فعال هستند و گزینه‌ای مطمئن برای جابجایی درون‌شهری‌اند.' : 'Uber and Bolt operate in most major Romanian cities (Bucharest, Cluj, Timișoara, and others) and are a reliable option for getting around.'}</li>
              </ul>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="romania/tourism" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    // GEOGRAPHY
    case 'geography':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/geography" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'شناخت کشور رومانی' : 'Discover Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'جغرافیای رومانی: مناطق، آب‌وهوا و فاصله شهرها' : 'Geography of Romania: Regions, Climate & City Distances'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'اطلاعات کاربردی جغرافیایی برای تصمیم‌گیری درباره محل اقامت و سفر — نه فقط اطلاعات دایره‌المعارفی.'
                : "Practical geographic facts for deciding where to live and travel — not just encyclopedia trivia."}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منابع: مؤسسه ملی آمار رومانی (INS)، ویکی‌پدیا — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Sources: National Institute of Statistics Romania (INS), Wikipedia — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'رومانی سومین کشور بزرگ اروپای مرکزی-شرقی از نظر مساحت است و جغرافیای متنوعی از دشت‌های جنوبی گرم تا کوهستان‌های سرد کارپات دارد. این تنوع مستقیماً روی تجربه زندگی شما تأثیر می‌گذارد: تابستان بخارست با تابستان کلوژ یکی نیست، و انتخاب شهر محل زندگی باید این تفاوت‌ها را در نظر بگیرد.'
              : "Romania is the third-largest country in East-Central Europe by area, with geography ranging from hot southern plains to the cold Carpathian Mountains. This diversity directly shapes daily life: a Bucharest summer is not the same as a Cluj summer, and choosing where to live should factor these differences in."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'سه منطقه تاریخی و تفاوت آب‌وهوا' : 'Three Historic Regions & Climate Differences'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ترانسیلوانیا (شمال/مرکز، شامل کلوژ و براشوف) — کوهستانی و خنک‌تر، فضایی شبیه اروپای مرکزی.' : 'Transylvania (north/center, incl. Cluj and Brașov) — hilly and cooler, a more Central European feel.'}</li>
                <li>{currentLang === 'fa' ? 'والاچیا (جنوب، شامل بخارست) — دشت، تابستان‌های گرم و مرطوب، زمستان‌های نسبتاً ملایم‌تر.' : 'Wallachia (south, incl. Bucharest) — plains, hot humid summers, comparatively milder winters.'}</li>
                <li>{currentLang === 'fa' ? 'مولداوی (شمال‌شرق، شامل یاش) — آب‌وهوای قاره‌ای با نوسان دمای بیشتر بین فصول.' : 'Moldavia (northeast, incl. Iași) — continental climate with wider seasonal temperature swings.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'کوهستان، مرزها و دریای سیاه' : 'Mountains, Borders & the Black Sea'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بلندترین نقطه کشور قله مولدووآنو (۲,۵۴۵ متر) در کوه‌های فاگاراش (بخش جنوبی کارپات) است — مقصد کوهنوردان و طبیعت‌گردان.' : 'The highest point is Moldoveanu Peak (2,545 m) in the Făgăraș Mountains (Southern Carpathians) — a hiking/mountaineering destination.'}</li>
                <li>{currentLang === 'fa' ? 'رومانی با ۵ کشور هم‌مرز است: مجارستان، صربستان، بلغارستان، اوکراین و مولداوی؛ همچنین نوار ساحلی دریای سیاه (کونستانتسا و ماماییا) را دارد.' : 'Romania borders 5 countries — Hungary, Serbia, Bulgaria, Ukraine, and Moldova — plus a Black Sea coastline (Constanța/Mamaia).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4 md:col-span-2">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'فاصله و زمان سفر بین شهرهای اصلی' : 'Distance & Travel Time Between Major Cities'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بخارست تا کلوژ-نپوکا: حدود ۴۵۰ کیلومتر — با ماشین/قطار حدود ۵-۶ ساعت، با پرواز حدود ۱ ساعت.' : 'Bucharest to Cluj-Napoca: ~450 km — about 5–6 hours by car/train, ~1 hour by flight.'}</li>
                <li>{currentLang === 'fa' ? 'بخارست تا براشوف: حدود ۱۷۰ کیلومتر — با ماشین/قطار حدود ۲.۵ ساعت؛ مقصد محبوب سفر یک‌روزه از بخارست.' : 'Bucharest to Brașov: ~170 km — about 2.5 hours by car/train; a popular day-trip destination from Bucharest.'}</li>
                <li>{currentLang === 'fa' ? 'منطقه زمانی رومانی: EET/EEST (UTC+2 زمستان، UTC+3 تابستان)، با همان قواعد تغییر ساعت اتحادیه اروپا.' : "Romania's time zone: EET/EEST (UTC+2 winter, UTC+3 summer), following the same EU daylight-saving rules."}</li>
                <li><span className="text-[11px] italic text-slate-400">{currentLang === 'fa' ? 'زمان‌های سفر تخمینی‌اند و به شرایط جاده/ترافیک بستگی دارند؛ برای برنامه‌ریزی دقیق از سایت CFR یا اپلیکیشن نقشه استفاده کنید.' : 'Travel times are estimates and depend on road/traffic conditions; use the CFR site or a maps app for exact planning.'}</span></li>
              </ul>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="romania/geography" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    // HISTORY
    case 'history':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/history" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'شناخت کشور رومانی' : 'Discover Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'تاریخ رومانی: از دوران داکیا تا امروز' : 'History of Romania: From Dacia to Today'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'زمینه فرهنگی و تاریخی کافی برای درک بهتر جامعه امروز رومانی — نه یک خلاصه دانشنامه‌ای.'
                : 'Enough cultural/historical context to better understand Romanian society today — not a textbook summary.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منابع: romaniatourism.com، ویکی‌پدیا — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Sources: romaniatourism.com, Wikipedia — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'دانستن خطوط کلی تاریخ رومانی به شما کمک می‌کند بسیاری از جزئیات روزمره را بهتر بفهمید: چرا زبان رومانیایی لاتین است، چرا معماری برخی محله‌های بخارست دوره کمونیستی است، و چرا عضویت در ناتو و اتحادیه اروپا برای بسیاری از رومانیایی‌ها نمادین و مهم است.'
              : 'Knowing the broad strokes of Romanian history helps make sense of a lot of everyday details: why Romanian is a Latin-based language, why parts of Bucharest look distinctly Communist-era, and why NATO and EU membership carry real symbolic weight for many Romanians.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'ریشه‌های داکیایی-رومی' : 'Dacian-Roman Roots'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رومی‌ها در سال ۱۰۶ میلادی داکیا (رومانی امروزی) را فتح کردند؛ زبان لاتین باقی‌مانده از آن دوره، پایه زبان رومانیایی امروزی و حتی نام «رومانیا» است.' : 'The Romans conquered Dacia (modern-day Romania) in 106 AD; the Latin left behind from that era is the basis of the modern Romanian language and even the name "Romania" itself.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'شکل‌گیری رومانی مدرن' : 'Formation of Modern Romania'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? '۱۸۵۹: اتحاد والاچیا و مولداوی به رهبری الکساندرو یوان کوزا — تولد دولت مدرن رومانی.' : '1859: Union of Wallachia and Moldavia under Alexandru Ioan Cuza — the birth of the modern Romanian state.'}</li>
                <li>{currentLang === 'fa' ? '۱۸۷۷: استقلال از امپراتوری عثمانی؛ ۱۹۱۸: اتحاد با ترانسیلوانیا، بسارابیا و بوکووینا («رومانیای بزرگ»).' : '1877: Independence from the Ottoman Empire; 1918: Union with Transylvania, Bessarabia, and Bucovina ("Greater Romania").'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4 md:col-span-2">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'دوران کمونیستی و رومانی امروز' : 'The Communist Era & Modern Romania'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رومانی از ۱۹۴۷ تا ۱۹۸۹ زیر حکومت کمونیستی بود (چائوشسکو از ۱۹۶۵)؛ این دوره با انقلاب دسامبر ۱۹۸۹ به پایان رسید — این زمینه به درک نگرش نسل مسن‌تر رومانیایی‌ها و معماری برخی محله‌ها کمک می‌کند.' : 'Romania was under Communist rule from 1947 to 1989 (Ceaușescu from 1965), ending with the December 1989 revolution — useful context for understanding older Romanians\' attitudes and some neighborhoods\' architecture.'}</li>
                <li>{currentLang === 'fa' ? 'رومانی در ۲۰۰۴ به ناتو و در ۲۰۰۷ به اتحادیه اروپا پیوست؛ این دو عضویت برای بسیاری از رومانیایی‌ها نمادی از بازگشت قطعی به «اروپای غربی» پس از دوران کمونیستی محسوب می‌شود.' : 'Romania joined NATO in 2004 and the EU in 2007 — both memberships carry real symbolic weight for many Romanians as a definitive post-Communist "return to the West."'}</li>
              </ul>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="romania/history" currentLang={currentLang} onNavigate={onNavigate} />
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
              <CityCard key={city.id} city={city} currentLang={currentLang} href={`/romania/cities/${city.id}`} />
            ))}
          </div>
        </div>
      );
  }
};
