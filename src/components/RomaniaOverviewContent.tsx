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
              </ul>
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
          </div>

          <ParentHubFooterCard slugRoute="romania/tourism" currentLang={currentLang} onNavigate={onNavigate} />
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
