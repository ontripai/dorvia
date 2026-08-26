'use client';

import React from 'react';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface CityDetailContentProps {
  citySlug: string;
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const CityDetailContent: React.FC<CityDetailContentProps> = ({ citySlug, currentLang, onNavigate }) => {
  const disclaimer = currentLang === 'fa'
    ? 'ارقام اجاره و هزینه زندگی به‌طور مداوم تغییر می‌کنند و بر اساس داده‌های خودگزارشی (نه آمار رسمی دولتی) تخمین زده شده‌اند؛ پیش از هر تصمیم، قیمت‌های روز را از سایت‌های آگهی املاک محلی یا دانشگاه مقصد استعلام کنید.'
    : 'Rent and cost-of-living figures change constantly and are estimated from self-reported (not official government) data; before making any decision, check current prices via local property-listing sites or your destination university.';

  const sourceLine = (extraFa: string, extraEn: string) => (
    <div className="text-[11px] text-slate-400 mt-2">
      {currentLang === 'fa'
        ? `منابع: Numbeo (شاخص هزینه زندگی و امنیت، داده‌های خودگزارشی کاربران)، ${extraFa} — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶`
        : `Sources: Numbeo (crowdsourced cost-of-living & safety index), ${extraEn} — Last reviewed: August 2026`}
    </div>
  );

  const faqBlock = (items: { qFa: string; qEn: string; aFa: string; aEn: string }[]) => (
    <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
      <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
        {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
      </h3>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx}>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? item.qFa : item.qEn}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? item.aFa : item.aEn}</p>
          </div>
        ))}
      </div>
    </div>
  );

  switch (citySlug) {
    case 'bucharest':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/cities/bucharest" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">{currentLang === 'fa' ? 'پایتخت رومانی' : 'Capital of Romania'}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{currentLang === 'fa' ? 'راهنمای زندگی و تحصیل در بخارست' : 'Living & Studying Guide: Bucharest'}</h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'بزرگ‌ترین بازار کار رومانی، تنها شهر دارای مترو، و میزبان بزرگ‌ترین دانشگاه‌های کشور.'
                : "Romania's largest job market, its only metro system, and home to the country's largest universities."}
            </p>
            {sourceLine('اداره مترو بخارست (Metrorex) — metroulbucuresti.org', 'Bucharest Metro Authority (Metrorex) — metroulbucuresti.org')}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'بخارست، پایتخت و بزرگ‌ترین شهر رومانی، مرکز اصلی اقتصاد، آموزش عالی و فرصت‌های شغلی بین‌المللی کشور است. برخلاف سایر شهرهای رومانی، بخارست تنها شهری است که سیستم مترو دارد و همراه با شبکه گسترده اتوبوس و تراموا، جابجایی درون‌شهری را نسبتاً آسان می‌کند.'
              : "Bucharest, Romania's capital and largest city, is the country's main hub for economic activity, higher education, and international job opportunities. Unlike other Romanian cities, Bucharest is the only one with a metro system, which alongside its extensive bus and tram network makes intra-city travel relatively easy."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'هزینه مسکن و زندگی (تخمینی)' : 'Cost of Housing & Living (Estimated)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اجاره آپارتمان یک‌خوابه در مرکز شهر: تقریباً ۲۵۰۰ تا ۴۲۰۰ لئو (حدود ۵۰۰ تا ۸۴۰ یورو) در ماه.' : 'A 1-bedroom apartment in the city center: roughly 2,500–4,200 RON (~€500–840) per month.'}</li>
                <li>{currentLang === 'fa' ? 'اجاره خارج از مرکز شهر: تقریباً ۱۶۰۰ تا ۳۱۵۰ لئو (حدود ۳۲۰ تا ۶۳۰ یورو) در ماه.' : 'Outside the city center: roughly 1,600–3,150 RON (~€320–630) per month.'}</li>
                <li>{currentLang === 'fa' ? 'قبوض آب/برق/گاز/زباله: تقریباً ۶۰۰ تا ۱۲۰۰ لئو در ماه، بسته به فصل و متراژ.' : 'Utilities (water/electricity/gas/waste): roughly 600–1,200 RON per month, depending on season and apartment size.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'حمل‌ونقل و دانشگاه‌ها' : 'Transit & Universities'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تنها شهر رومانی با سیستم مترو (Metrorex، ۵ خط) به‌همراه اتوبوس، تراموا و ترالی‌بوس (STB).' : "Romania's only city with a metro system (Metrorex, 5 lines), plus buses, trams, and trolleybuses (STB)."}</li>
                <li>{currentLang === 'fa' ? 'بلیت ماهانه عادی حدود ۱۰۰ لئو؛ دانشجویان با تخفیف ۵۰٪ حدود ۵۰ لئو پرداخت می‌کنند و برخی مشمول بلیت رایگان می‌شوند.' : 'A regular monthly pass costs about 100 RON; students get a 50% discount (~50 RON), and some qualify for a free pass.'}</li>
                <li>{currentLang === 'fa' ? 'میزبان دانشگاه بخارست و دانشگاه پلی‌تکنیک بخارست، از بزرگ‌ترین و معتبرترین دانشگاه‌های کشور.' : 'Home to the University of Bucharest and Politehnica University of Bucharest, among Romania\'s largest and most prominent universities.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'محله‌های پیشنهادی' : 'Recommended Neighborhoods'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اونیورسیتاته (Universitate) — قلب دانشجویی و دانشگاهی، در مرکز شهر.' : 'Universitate — the central student/academic hub.'}</li>
                <li>{currentLang === 'fa' ? 'کوتروچنی (Cotroceni) — محبوب دانشجویان و جوانان شاغل، نزدیک باغ گیاه‌شناسی.' : 'Cotroceni — popular with students and young professionals, near the Botanical Garden.'}</li>
                <li>{currentLang === 'fa' ? 'دوروبانتی/فلوریاسکا (Dorobanți/Floreasca) — منطقه‌ای مرفه، محل سفارتخانه‌ها و مهاجران خارجی.' : 'Dorobanți/Floreasca — an upscale area, home to embassies and the expat community.'}</li>
                <li>{currentLang === 'fa' ? 'هرستراو (Herăstrău) — سرسبز و آرام‌تر، نزدیک پارک بزرگ شهر.' : 'Herăstrău — greener and quieter, near the city\'s large park.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'امنیت و نکات کاربردی' : 'Safety & Practical Notes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بخارست عموماً شهری امن با احتیاط‌های معمول شهری در نظر گرفته می‌شود؛ شاخص امنیت Numbeo (یک شاخص برداشتی و خودگزارشی، نه آمار رسمی جرم) رقمی نسبتاً بالا برای بخارست نشان می‌دهد.' : "Bucharest is generally considered safe with normal urban precautions; Numbeo's safety index (a crowdsourced perception index, not official crime data) shows a relatively high score for Bucharest."}</li>
                <li>{currentLang === 'fa' ? 'به‌عنوان پایتخت و بزرگ‌ترین بازار کار کشور، بخارست بیشترین تراکم شرکت‌های بین‌المللی و فرصت‌های شغلی را دارد.' : "As the capital and largest job market in the country, Bucharest has the highest concentration of multinational companies and job opportunities."}</li>
              </ul>
            </div>
          </div>

          {faqBlock([
            {
              qFa: 'آیا بخارست گران‌تر از سایر شهرهای رومانی است؟',
              qEn: 'Is Bucharest more expensive than other Romanian cities?',
              aFa: 'به‌طور کلی بله، هرچند کلوژ-نپوکا در برخی موارد به بخارست نزدیک یا حتی بالاتر می‌رود؛ یاش و تیمیشوارا معمولاً ارزان‌تر هستند.',
              aEn: 'Generally yes, though Cluj-Napoca sometimes runs close to or even above Bucharest; Iași and Timișoara are typically cheaper.'
            },
            {
              qFa: 'برای دانشجویان تازه‌وارد کدام محله مناسب‌تر است؟',
              qEn: 'Which neighborhood is best for newly arrived students?',
              aFa: 'اونیورسیتاته و کوتروچنی به دلیل نزدیکی به دانشگاه‌ها و حمل‌ونقل عمومی، معمولاً گزینه‌های اول دانشجویان هستند.',
              aEn: 'Universitate and Cotroceni are typically the top picks for students due to their proximity to universities and public transit.'
            }
          ])}

          <ParentHubFooterCard slugRoute="romania/cities/bucharest" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'cluj-napoca':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/cities/cluj-napoca" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">{currentLang === 'fa' ? 'قطب فناوری رومانی' : "Romania's Tech Hub"}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{currentLang === 'fa' ? 'راهنمای زندگی و تحصیل در کلوژ-نپوکا' : 'Living & Studying Guide: Cluj-Napoca'}</h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'ملقب به «سیلیکون‌ولی اروپای شرقی»، شهری جوان و دانشگاهی با بازار کار فناوری قوی.'
                : 'Nicknamed the "Silicon Valley of Eastern Europe," a young university city with a strong tech job market.'}
            </p>
            {sourceLine('شرکت حمل‌ونقل عمومی کلوژ (CTP Cluj) — ctpcj.ro', 'Cluj Public Transport Company (CTP Cluj) — ctpcj.ro')}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'کلوژ-نپوکا، پایتخت غیررسمی ترانسیلوانیا، محبوب‌ترین شهر رومانی برای مهندسان نرم‌افزار، استارتاپ‌ها و دانشجویان بین‌المللی است. تقاضای بالا برای مسکن (ناشی از جمعیت دانشجویی و شاغلان فناوری) باعث شده اجاره در کلوژ گاهی به سطح بخارست نزدیک یا حتی بالاتر برود.'
              : "Cluj-Napoca, the unofficial capital of Transylvania, is Romania's most popular city for software engineers, startups, and international students. High demand for housing (driven by its student population and tech workforce) means rents in Cluj sometimes run close to or even above Bucharest's."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'هزینه مسکن و زندگی (تخمینی)' : 'Cost of Housing & Living (Estimated)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اجاره آپارتمان یک‌خوابه در مرکز شهر: تقریباً ۳۰۹۰ لئو (حدود ۶۲۰ یورو) در ماه — گاهی بالاتر از بخارست.' : 'A 1-bedroom apartment in the city center: roughly 3,090 RON (~€620) per month — sometimes above Bucharest.'}</li>
                <li>{currentLang === 'fa' ? 'اجاره خارج از مرکز شهر: تقریباً ۲۵۶۰ لئو (حدود ۵۱۴ یورو) در ماه.' : 'Outside the city center: roughly 2,560 RON (~€514) per month.'}</li>
                <li>{currentLang === 'fa' ? 'قبوض آب/برق/گاز/زباله: تقریباً ۷۷۵ لئو در ماه.' : 'Utilities (water/electricity/gas/waste): roughly 775 RON per month.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'حمل‌ونقل و دانشگاه‌ها' : 'Transit & Universities'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شبکه تراموا، اتوبوس و ترالی‌بوس (CTP Cluj)؛ دانشجویان تا سن ۲۶ سال با کارت دانشجویی معتبر تا ۱۲۰ سفر رایگان در ماه دریافت می‌کنند.' : "A network of trams, buses, and trolleybuses (CTP Cluj); students up to age 26 with a valid student card get up to 120 free trips per month."}</li>
                <li>{currentLang === 'fa' ? 'میزبان دانشگاه بابش-بویائی (بزرگ‌ترین دانشگاه رومانی) و دانشگاه فنی کلوژ-نپوکا.' : "Home to Babeș-Bolyai University (Romania's largest) and the Technical University of Cluj-Napoca."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'محله‌های پیشنهادی' : 'Recommended Neighborhoods'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'هاشدئو (Hașdeu) — بزرگ‌ترین منطقه خوابگاهی و دانشجویی شهر.' : "Hașdeu — the city's largest student/campus area."}</li>
                <li>{currentLang === 'fa' ? 'پلوپیلور (Plopilor) — نزدیک به دانشگاه‌ها.' : 'Plopilor — close to the universities.'}</li>
                <li>{currentLang === 'fa' ? 'مناشتور (Mănăștur) — مقرون‌به‌صرفه‌تر، کمی دورتر از مرکز.' : 'Mănăștur — more affordable, a bit further from the center.'}</li>
                <li>{currentLang === 'fa' ? 'گئورگنی (Gheorgheni) — مرکزی، نزدیک فرودگاه.' : 'Gheorgheni — central, near the airport.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'امنیت و نکات کاربردی' : 'Safety & Practical Notes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شاخص امنیت Numbeo برای کلوژ-نپوکا، بالاترین رقم را در میان شهرهای بررسی‌شده این راهنما دارد (شاخص برداشتی/خودگزارشی، نه آمار رسمی).' : "Cluj-Napoca has the highest Numbeo safety index among the cities covered in this guide (a crowdsourced perception index, not official statistics)."}</li>
                <li>{currentLang === 'fa' ? 'بازار کار فناوری اطلاعات قوی، حقوق‌های بالاتر از میانگین ملی، اما هزینه مسکن نیز بالاتر است.' : 'A strong IT job market with above-national-average salaries, but also higher housing costs.'}</li>
              </ul>
            </div>
          </div>

          {faqBlock([
            {
              qFa: 'چرا اجاره در کلوژ گاهی از بخارست هم بالاتر است؟',
              qEn: 'Why is rent in Cluj sometimes higher than in Bucharest?',
              aFa: 'تقاضای بالای شرکت‌های فناوری و جمعیت دانشجویی بزرگ، عرضه مسکن محدود را زیر فشار گذاشته و قیمت‌ها را بالا برده است.',
              aEn: 'High demand from tech companies and a large student population has put pressure on limited housing supply, pushing prices up.'
            },
            {
              qFa: 'آیا کلوژ برای کار در حوزه فناوری اطلاعات مناسب است؟',
              qEn: 'Is Cluj a good fit for IT careers?',
              aFa: 'بله، کلوژ‌-نپوکا مهم‌ترین قطب فناوری اطلاعات رومانی محسوب می‌شود و شرکت‌های بین‌المللی متعددی در آن دفتر دارند.',
              aEn: "Yes, Cluj-Napoca is Romania's leading IT hub, with numerous multinational companies maintaining offices there."
            }
          ])}

          <ParentHubFooterCard slugRoute="romania/cities/cluj-napoca" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'timisoara':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/cities/timisoara" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">{currentLang === 'fa' ? 'دروازه اروپای مرکزی' : 'Gateway to Central Europe'}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{currentLang === 'fa' ? 'راهنمای زندگی و تحصیل در تیمیشوارا' : 'Living & Studying Guide: Timișoara'}</h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'شهری اروپایی در غرب رومانی، نزدیک مرز مجارستان و صربستان، با هزینه زندگی پایین‌تر از بخارست.'
                : 'A European-feeling city in western Romania, close to the Hungarian and Serbian borders, with a lower cost of living than Bucharest.'}
            </p>
            {sourceLine('شرکت حمل‌ونقل عمومی تیمیشوارا (STPT) — stpt.ro', 'Timișoara Public Transport Company (STPT) — stpt.ro')}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'تیمیشوارا در غرب رومانی و نزدیک مرزهای مجارستان و صربستان واقع شده و به دلیل معماری کلاسیک اروپایی و فضای شهری آرام، اغلب «اروپایی‌ترین» شهر رومانی توصیف می‌شود. هزینه زندگی در تیمیشوارا معمولاً پایین‌تر از بخارست و کلوژ-نپوکا است.'
              : 'Timișoara, located in western Romania near the Hungarian and Serbian borders, is often described as the "most European-feeling" Romanian city thanks to its classical European architecture and relaxed urban atmosphere. Its cost of living is typically lower than Bucharest and Cluj-Napoca.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'هزینه مسکن و زندگی (تخمینی)' : 'Cost of Housing & Living (Estimated)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اجاره آپارتمان یک‌خوابه در مرکز شهر: تقریباً ۲۵۵۰ لئو (حدود ۵۱۲ یورو) در ماه.' : 'A 1-bedroom apartment in the city center: roughly 2,550 RON (~€512) per month.'}</li>
                <li>{currentLang === 'fa' ? 'اجاره خارج از مرکز شهر: تقریباً ۱۷۰۰ لئو (حدود ۳۴۱ یورو) در ماه.' : 'Outside the city center: roughly 1,700 RON (~€341) per month.'}</li>
                <li>{currentLang === 'fa' ? 'قبوض آب/برق/گاز/زباله: تقریباً ۸۰۷ لئو در ماه.' : 'Utilities (water/electricity/gas/waste): roughly 807 RON per month.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'حمل‌ونقل و دانشگاه‌ها' : 'Transit & Universities'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شبکه تراموا، اتوبوس و ترالی‌بوس (STPT)؛ دانشجویان تخفیف ۱۰٪ می‌گیرند و دانشجویان تمام‌وقت طبق قانون ۱۹۹/۲۰۲۳ می‌توانند تا ۹۰٪ تخفیف حمل‌ونقل محلی/ریلی دریافت کنند.' : 'A network of trams, buses, and trolleybuses (STPT); students get a 10% discount, and full-time students under Law 199/2023 can receive up to a 90% discount on local/rail transport.'}</li>
                <li>{currentLang === 'fa' ? 'میزبان دانشگاه غرب تیمیشوارا و دانشگاه پلی‌تکنیک تیمیشوارا.' : 'Home to the West University of Timișoara and Politehnica University of Timișoara.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'محله‌های پیشنهادی' : 'Recommended Neighborhoods'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'چتاته (Cetate) — مرکزی، قابل پیاده‌روی، پر از کافه.' : 'Cetate — central, walkable, full of cafes.'}</li>
                <li>{currentLang === 'fa' ? 'کمپلکس استودنتسک (Complex Studențesc) — مجتمع دانشجویی با زندگی شبانه فعال.' : 'Complex Studențesc — a student compound with active nightlife.'}</li>
                <li>{currentLang === 'fa' ? 'کارتیه‌رول سوارلوی (Cartierul Soarelui) — مقرون‌به‌صرفه، نزدیک دانشگاه‌ها.' : 'Cartierul Soarelui — budget-friendly, near the universities.'}</li>
                <li>{currentLang === 'fa' ? 'بوکووینا (Bucovina) — آرام، مناسب خانواده.' : 'Bucovina — quiet, family-friendly.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'امنیت و نکات کاربردی' : 'Safety & Practical Notes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شاخص امنیت Numbeo برای تیمیشوارا وضعیت خوبی نشان می‌دهد (شاخص برداشتی/خودگزارشی، نه آمار رسمی).' : "Timișoara's Numbeo safety index shows a good rating (a crowdsourced perception index, not official statistics)."}</li>
                <li>{currentLang === 'fa' ? 'موقعیت جغرافیایی نزدیک به مجارستان و صربستان، دسترسی زمینی سریع به اروپای مرکزی را فراهم می‌کند.' : "Its location near Hungary and Serbia provides fast overland access to Central Europe."}</li>
              </ul>
            </div>
          </div>

          {faqBlock([
            {
              qFa: 'آیا تیمیشوارا از بخارست ارزان‌تر است؟',
              qEn: 'Is Timișoara cheaper than Bucharest?',
              aFa: 'بله، بر اساس داده‌های موجود، اجاره در تیمیشوارا معمولاً پایین‌تر از بخارست و کلوژ-نپوکا است.',
              aEn: 'Yes, available data shows rent in Timișoara is typically lower than in Bucharest and Cluj-Napoca.'
            },
            {
              qFa: 'دسترسی به سایر کشورهای اروپایی از تیمیشوارا چطور است؟',
              qEn: 'How accessible is the rest of Europe from Timișoara?',
              aFa: 'به دلیل نزدیکی به مرز مجارستان و صربستان، سفر زمینی به اروپای مرکزی از تیمیشوارا نسبت به سایر شهرهای رومانی سریع‌تر است.',
              aEn: "Because of its proximity to the Hungarian and Serbian borders, overland travel to Central Europe from Timișoara is faster than from most other Romanian cities."
            }
          ])}

          <ParentHubFooterCard slugRoute="romania/cities/timisoara" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'iasi':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/cities/iasi" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">{currentLang === 'fa' ? 'پایتخت فرهنگی و دانشگاهی' : 'Cultural & University Capital'}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{currentLang === 'fa' ? 'راهنمای زندگی و تحصیل در یاش' : 'Living & Studying Guide: Iași'}</h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'یکی از بزرگ‌ترین مراکز دانشجویی رومانی با هزینه زندگی نسبتاً اقتصادی.'
                : "One of Romania's largest student centers, with relatively affordable living costs."}
            </p>
            {sourceLine('شرکت حمل‌ونقل عمومی یاش (CTP Iași) — sctpiasi.ro', 'Iași Public Transport Company (CTP Iași) — sctpiasi.ro')}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'یاش، پایتخت تاریخی و فرهنگی منطقه مولداوی، میزبان اولین و یکی از بزرگ‌ترین دانشگاه‌های رومانی است. نسبت به بخارست و کلوژ-نپوکا، منابع موجود به‌طور مستمر یاش را در ردیف شهرهای مقرون‌به‌صرفه‌تر برای هزینه زندگی قرار می‌دهند، هرچند رتبه‌بندی دقیق و رسمی «ارزان‌ترین شهر» یافت نشد.'
              : "Iași, the historic and cultural capital of the Moldavia region, is home to Romania's first and one of its largest universities. Compared to Bucharest and Cluj-Napoca, available sources consistently place Iași among the more affordable cities for cost of living, though no single authoritative \"cheapest city\" ranking was found."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'هزینه مسکن و زندگی (تخمینی)' : 'Cost of Housing & Living (Estimated)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اجاره آپارتمان یک‌خوابه در مرکز شهر: تقریباً ۲۵۰۰ لئو (حدود ۵۳۲ یورو) در ماه.' : 'A 1-bedroom apartment in the city center: roughly 2,500 RON (~€532) per month.'}</li>
                <li>{currentLang === 'fa' ? 'اجاره خارج از مرکز شهر: تقریباً ۱۹۹۰ لئو (حدود ۴۲۴ یورو) در ماه.' : 'Outside the city center: roughly 1,990 RON (~€424) per month.'}</li>
                <li>{currentLang === 'fa' ? 'قبوض آب/برق/گاز/زباله: تقریباً ۸۳۸ لئو در ماه.' : 'Utilities (water/electricity/gas/waste): roughly 838 RON per month.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'حمل‌ونقل و دانشگاه‌ها' : 'Transit & Universities'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شبکه تراموا و اتوبوس (CTP Iași)؛ تخفیف دانشجویی بسته به توافق هر دانشگاه متفاوت است (مثلاً دانشجویان دانشگاه الکساندرو یوان کوزا بلیت بسیار ارزان حدود ۱۱ لئو دریافت می‌کنند).' : "A network of trams and buses (CTP Iași); student discounts vary by university agreement (e.g., Alexandru Ioan Cuza University students get a heavily discounted pass around 11 RON)."}</li>
                <li>{currentLang === 'fa' ? 'میزبان دانشگاه الکساندرو یوان کوزا و دانشگاه فنی گئورگه آساکی — یاش یکی از بزرگ‌ترین مراکز دانشجویی رومانی از نظر جمعیت دانشجویی است.' : "Home to Alexandru Ioan Cuza University and Gheorghe Asachi Technical University — Iași is one of Romania's largest university centers by student population."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'محله‌های پیشنهادی' : 'Recommended Neighborhoods'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'کوپو (Copou) — آرام، نزدیک پارک‌ها و دانشگاه.' : 'Copou — quiet, near parks and the university.'}</li>
                <li>{currentLang === 'fa' ? 'تاتاراشی (Tătărași) — مقرون‌به‌صرفه، نزدیک خوابگاه دانشجویی تودور ولادیمیرسکو.' : 'Tătărași — affordable, near the Tudor Vladimirescu student campus.'}</li>
                <li>{currentLang === 'fa' ? 'مرکز شهر — قابل پیاده‌روی و نزدیک حمل‌ونقل.' : 'City Center — walkable and close to transit.'}</li>
                <li>{currentLang === 'fa' ? 'پودو روش (Podu Roș) — نزدیک منطقه تجاری پالاس.' : 'Podu Roș — near the Palas business district.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'امنیت و نکات کاربردی' : 'Safety & Practical Notes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شاخص امنیت Numbeo برای یاش نسبت به سایر ۵ شهر این راهنما پایین‌تر است، اما همچنان در محدوده «عموماً امن با احتیاط‌های معمول شهری» قرار می‌گیرد (شاخص برداشتی/خودگزارشی، نه آمار رسمی).' : "Iași's Numbeo safety index is lower than the other 5 cities in this guide, but still falls within a \"generally safe with normal urban precautions\" range (a crowdsourced perception index, not official statistics)."}</li>
                <li>{currentLang === 'fa' ? 'به دلیل جمعیت بزرگ دانشجویی، فضای شهر دانشجومحور و پرتحرک است.' : 'Thanks to its large student population, the city has a lively, student-centered atmosphere.'}</li>
              </ul>
            </div>
          </div>

          {faqBlock([
            {
              qFa: 'آیا یاش برای دانشجویان با بودجه محدود مناسب‌تر است؟',
              qEn: 'Is Iași a better fit for budget-conscious students?',
              aFa: 'بر اساس منابع موجود، یاش در کنار تیمیشوارا معمولاً ارزان‌تر از بخارست و کلوژ-نپوکا است، هرچند رتبه‌بندی دقیق رسمی وجود ندارد.',
              aEn: 'Per available sources, Iași — alongside Timișoara — is typically cheaper than Bucharest and Cluj-Napoca, though no precise official ranking exists.'
            },
            {
              qFa: 'تخفیف حمل‌ونقل دانشجویی در یاش چگونه است؟',
              qEn: 'How does the student transit discount work in Iași?',
              aFa: 'میزان تخفیف بسته به توافق هر دانشگاه با شرکت حمل‌ونقل شهری متفاوت است؛ برای رقم دقیق باید از دانشگاه مقصد خود استعلام کنید.',
              aEn: "The discount level depends on each university's agreement with the local transit company; check with your specific university for the exact figure."
            }
          ])}

          <ParentHubFooterCard slugRoute="romania/cities/iasi" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'brasov':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/cities/brasov" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">{currentLang === 'fa' ? 'دروازه کارپات' : 'Gateway to the Carpathians'}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{currentLang === 'fa' ? 'راهنمای زندگی و تحصیل در براشوف' : 'Living & Studying Guide: Brașov'}</h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'شهری کوهستانی محصور در طبیعت کارپات، نزدیک پیست اسکی پویانا براشوف.'
                : 'A mountain city nestled in the Carpathians, near the Poiana Brașov ski resort.'}
            </p>
            {sourceLine('شرکت حمل‌ونقل عمومی براشوف (RATBV) — ratbv.ro', 'Brașov Public Transport Company (RATBV) — ratbv.ro')}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'براشوف، محصور در کوهستان‌های سرسبز کارپات، توریستی‌ترین شهر رومانی و دروازه اصلی پیست اسکی پویانا براشوف است. توجه: بر اساس داده‌های موجود، اجاره مسکن در براشوف نسبت به جمعیت شهر بالاست که احتمالاً ناشی از تقاضای گردشگری است — پیش از تصمیم‌گیری حتماً قیمت‌های روز را از سایت‌های آگهی محلی استعلام کنید.'
              : "Brașov, nestled in the green Carpathian Mountains, is Romania's most touristic city and the main gateway to the Poiana Brașov ski resort. Note: based on available data, housing rent in Brașov runs high relative to the city's population, likely driven by tourism demand — be sure to check current listing-site prices before making a decision."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'هزینه مسکن و زندگی (تخمینی)' : 'Cost of Housing & Living (Estimated)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اجاره آپارتمان یک‌خوابه در مرکز شهر: تقریباً ۳۲۱۰ لئو (حدود ۶۴۵ یورو) در ماه — نسبتاً بالا، احتمالاً به دلیل تقاضای گردشگری.' : 'A 1-bedroom apartment in the city center: roughly 3,210 RON (~€645) per month — notably high, likely driven by tourism demand.'}</li>
                <li>{currentLang === 'fa' ? 'اجاره خارج از مرکز شهر: تقریباً ۲۲۱۰ لئو (حدود ۴۴۴ یورو) در ماه.' : 'Outside the city center: roughly 2,210 RON (~€444) per month.'}</li>
                <li>{currentLang === 'fa' ? 'قبوض آب/برق/گاز/زباله: تقریباً ۸۵۲ لئو در ماه.' : 'Utilities (water/electricity/gas/waste): roughly 852 RON per month.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'حمل‌ونقل و دانشگاه‌ها' : 'Transit & Universities'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شبکه اتوبوس و ترالی‌بوس (RATBV)؛ بدون خط تراموا. دانشگاه ترانسیلوانیا ترتیبات ویژه حمل‌ونقل برای دانشجویان خود دارد.' : 'A network of buses and trolleybuses (RATBV); no tram line. Transilvania University has special transit arrangements for its students.'}</li>
                <li>{currentLang === 'fa' ? 'میزبان دانشگاه ترانسیلوانیا براشوف.' : 'Home to Transilvania University of Brașov.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'محله‌های پیشنهادی' : 'Recommended Neighborhoods'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شهر قدیم (Centrul Vechi) — تاریخی، قابل پیاده‌روی، نزدیک دانشگاه.' : 'Old Town (Centrul Vechi) — historic, walkable, near the university.'}</li>
                <li>{currentLang === 'fa' ? 'شکی (Șchei) — آرام‌تر، با فضای قرون‌وسطایی.' : 'Șchei — quieter, with a medieval character.'}</li>
                <li>{currentLang === 'fa' ? 'آسترا (Astra) — آرام، حدود ۳۰ دقیقه از مرکز، مقرون‌به‌صرفه‌تر.' : 'Astra — calm, about 30 minutes from the center, more affordable.'}</li>
                <li>{currentLang === 'fa' ? 'بلومانا (Blumana) — نزدیک مرکز، هزینه پایین‌تر، چشم‌انداز کوهستانی.' : 'Blumana — near the center, lower cost, mountain views.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'امنیت و نکات کاربردی' : 'Safety & Practical Notes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شاخص امنیت Numbeo برای براشوف وضعیت خوبی نشان می‌دهد (شاخص برداشتی/خودگزارشی، نه آمار رسمی).' : "Brașov's Numbeo safety index shows a good rating (a crowdsourced perception index, not official statistics)."}</li>
                <li>{currentLang === 'fa' ? 'سبک زندگی کوهستانی و نزدیکی به پیست اسکی پویانا براشوف، جذابیتی منحصربه‌فرد در میان شهرهای این راهنما ایجاد می‌کند.' : "Its mountain lifestyle and proximity to the Poiana Brașov ski resort give it a lifestyle appeal unique among the cities in this guide."}</li>
              </ul>
            </div>
          </div>

          {faqBlock([
            {
              qFa: 'چرا اجاره در براشوف با وجود جمعیت کمتر بالاست؟',
              qEn: 'Why is rent in Brașov high despite its smaller population?',
              aFa: 'به احتمال زیاد به دلیل تقاضای بالای گردشگری و اقامت‌های کوتاه‌مدت (Airbnb) در فصل اسکی و تابستان است؛ حتماً قیمت‌های به‌روز را استعلام کنید.',
              aEn: 'Most likely due to high tourism demand and short-term rentals (Airbnb) during ski season and summer; be sure to check current prices.'
            },
            {
              qFa: 'آیا براشوف برای علاقه‌مندان به طبیعت و کوهستان گزینه خوبی است؟',
              qEn: 'Is Brașov a good choice for nature/mountain enthusiasts?',
              aFa: 'بله، دسترسی مستقیم به پیست‌های اسکی و طبیعت کارپات از ویژگی‌های منحصربه‌فرد براشوف نسبت به سایر شهرهای این راهنماست.',
              aEn: "Yes, direct access to ski slopes and Carpathian nature is one of Brașov's distinguishing features compared to the other cities in this guide."
            }
          ])}

          <ParentHubFooterCard slugRoute="romania/cities/brasov" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'constanta':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="romania/cities/constanta" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">{currentLang === 'fa' ? 'شهر بندری دریای سیاه' : 'Black Sea Port City'}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{currentLang === 'fa' ? 'راهنمای زندگی و تحصیل در کونستانتسا' : 'Living & Studying Guide: Constanța'}</h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'بزرگ‌ترین بندر دریای سیاه رومانی، در همسایگی منطقه ساحلی و تفریحی ماماییا.'
                : "Romania's largest Black Sea port, neighboring the Mamaia coastal resort area."}
            </p>
            {sourceLine('شرکت حمل‌ونقل عمومی کونستانتسا (CT BUS) — ctbus.ro', 'Constanța Public Transport Company (CT BUS) — ctbus.ro')}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'کونستانتسا، بزرگ‌ترین بندر دریای سیاه رومانی و مرکز اصلی صنایع دریانوردی و لجستیک کشور است. همسایگی با منطقه ساحلی ماماییا، آن را به یک شهر با اقتصاد فصلی گردشگری نیز تبدیل کرده که این ویژگی آن را از سایر شهرهای این راهنما متمایز می‌کند.'
              : "Constanța, Romania's largest Black Sea port, is the country's main hub for maritime and logistics industries. Its proximity to the Mamaia coastal resort area also gives it a seasonal tourism economy, a character distinct from the other cities in this guide."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'هزینه مسکن و زندگی (تخمینی)' : 'Cost of Housing & Living (Estimated)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اجاره آپارتمان یک‌خوابه در مرکز شهر: تقریباً ۲۸۴۵ لئو (حدود ۵۷۰ یورو) در ماه.' : 'A 1-bedroom apartment in the city center: roughly 2,845 RON (~€570) per month.'}</li>
                <li>{currentLang === 'fa' ? 'اجاره خارج از مرکز شهر: تقریباً ۲۲۵۰ لئو (حدود ۴۵۲ یورو) در ماه.' : 'Outside the city center: roughly 2,250 RON (~€452) per month.'}</li>
                <li>{currentLang === 'fa' ? 'قبوض آب/برق/گاز/زباله: تقریباً ۷۹۶ لئو در ماه؛ در فصل تابستان و اوج گردشگری قیمت‌های اجاره کوتاه‌مدت افزایش می‌یابد.' : 'Utilities (water/electricity/gas/waste): roughly 796 RON per month; short-term rental prices rise during the summer tourist peak.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'حمل‌ونقل و دانشگاه‌ها' : 'Transit & Universities'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شبکه اتوبوس و تراموا (CT BUS)؛ بلیت دانشجویی تک‌خط حدود ۲۷.۵ لئو و همه‌خط حدود ۶۲.۵ لئو در ماه.' : 'A network of buses and trams (CT BUS); a single-line student pass costs about 27.5 RON, an all-lines pass about 62.5 RON per month.'}</li>
                <li>{currentLang === 'fa' ? 'میزبان دانشگاه اویدیوس کونستانتسا و آکادمی دریایی میرچا چل باترین.' : 'Home to Ovidius University of Constanța and the Mircea cel Bătrân Naval Academy.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'محله‌های پیشنهادی' : 'Recommended Neighborhoods'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'توميس نورد (Tomis Nord) — نزدیک پردیس‌های دانشجویی و منطقه ماماییا.' : 'Tomis Nord — near student campuses and the Mamaia area.'}</li>
                <li>{currentLang === 'fa' ? 'شهر قدیم/شبه‌جزیره (Old Town/Peninsula) — مرکزی، نزدیک ساحل، زندگی شبانه فعال.' : 'Old Town/Peninsula — central, beach-adjacent, active nightlife.'}</li>
                <li>{currentLang === 'fa' ? 'بورئال (Boreal) — مدرن، حومه‌ای، مناسب شاغلان جوان.' : 'Boreal — modern, suburban, popular with young professionals.'}</li>
                <li>{currentLang === 'fa' ? 'ای.سی. براتیانو (I.C. Brătianu) — ساخت‌وسازهای جدیدتر، آرام‌تر.' : 'I.C. Brătianu — newer buildings, quieter.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'امنیت و نکات کاربردی' : 'Safety & Practical Notes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'کونستانتسا در مجموع شهری با احتیاط‌های معمول شهری امن در نظر گرفته می‌شود؛ در فصل تابستان و در مناطق شلوغ گردشگری/شبانه، رعایت احتیاط بیشتر توصیه می‌شود. (شاخص Numbeo یک برآورد برداشتی/خودگزارشی است، نه آمار رسمی جرم.)' : 'Constanța is generally considered safe with normal urban precautions; extra care is advised during summer in crowded tourist/nightlife areas. (The Numbeo index is a crowdsourced perception estimate, not official crime data.)'}</li>
                <li>{currentLang === 'fa' ? 'اقتصاد شهر به‌شدت فصلی است؛ تابستان‌ها با رونق گردشگری و بندری همراه است.' : "The city's economy is highly seasonal, with summer bringing a surge in tourism and port activity."}</li>
              </ul>
            </div>
          </div>

          {faqBlock([
            {
              qFa: 'آیا کونستانتسا برای زندگی سالانه یا فقط تابستان مناسب است؟',
              qEn: 'Is Constanța suitable for year-round living, or just summer?',
              aFa: 'کونستانتسا شهری با دانشگاه و بازار کار بندری/لجستیکی فعال در تمام سال است؛ گردشگری فقط بخشی از اقتصاد فصلی تابستانی شهر را تشکیل می‌دهد.',
              aEn: "Constanța is a year-round city with an active university and port/logistics job market; tourism is only part of its seasonal summer economy."
            },
            {
              qFa: 'آیا اجاره در فصل تابستان در کونستانتسا گران‌تر می‌شود؟',
              qEn: 'Does rent get more expensive in Constanța during summer?',
              aFa: 'بله، به‌ویژه اجاره‌های کوتاه‌مدت نزدیک ساحل و ماماییا در فصل اوج گردشگری معمولاً افزایش می‌یابد.',
              aEn: 'Yes, short-term rentals near the beach and Mamaia in particular typically rise during peak tourist season.'
            }
          ])}

          <ParentHubFooterCard slugRoute="romania/cities/constanta" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    default:
      return null;
  }
};
