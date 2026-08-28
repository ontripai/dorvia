'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface CityDetailContentProps {
  citySlug: string;
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const CityDetailContent: React.FC<CityDetailContentProps> = ({ citySlug, currentLang, onNavigate }) => {
  // Real photos are self-hosted under /public/images/cities (see scripts/fetch-wikimedia-photos.js).
  // If a photo file is ever missing, this hides the photo block gracefully instead of showing a broken-image icon.
  const [photoFailed, setPhotoFailed] = useState(false);

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

          {!photoFailed && (
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/cities/bucharest.jpg"
              alt={currentLang === 'fa' ? 'تالار آتنیوم رومانی در بخارست' : 'The Romanian Athenaeum in Bucharest'}
              className="w-full h-64 sm:h-80 object-cover"
              onError={() => setPhotoFailed(true)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-xs">
                {currentLang === 'fa'
                  ? 'تالار آتنیوم رومانی (۱۸۸۸)، یکی از نمادهای معماری بخارست — عکس: ویکی‌مدیا کامنز'
                  : "The Romanian Athenaeum (built 1888), one of Bucharest's architectural icons — Photo: Wikimedia Commons"}
              </p>
            </div>
          </div>
          )}

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <p>
              {currentLang === 'fa'
                ? 'بخارست، پایتخت و بزرگ‌ترین شهر رومانی، مرکز اصلی اقتصاد، آموزش عالی و فرصت‌های شغلی بین‌المللی کشور است. برخلاف سایر شهرهای رومانی، بخارست تنها شهری است که سیستم مترو دارد و همراه با شبکه گسترده اتوبوس و تراموا، جابجایی درون‌شهری را نسبتاً آسان می‌کند.'
                : "Bucharest, Romania's capital and largest city, is the country's main hub for economic activity, higher education, and international job opportunities. Unlike other Romanian cities, Bucharest is the only one with a metro system, which alongside its extensive bus and tram network makes intra-city travel relatively easy."}
            </p>
            <p>
              {currentLang === 'fa'
                ? 'با این حال، بخارست به‌دلیل ترافیک سنگین و آلودگی هوا نسبت به سایر شهرهای این راهنما شناخته می‌شود — نکته‌ای که در کنار هزینه‌های بالاتر مسکن باید در تصمیم‌گیری لحاظ شود. جالب اینکه بر اساس داده‌های فوریه ۲۰۲۶، میانگین قیمت آپارتمان در برخی مناطق کلوژ-نپوکا حتی از بخارست هم پیشی گرفته است.'
                : "That said, Bucharest is known for heavier traffic and air pollution than the other cities in this guide — worth weighing alongside its higher housing costs. Interestingly, as of February 2026 data, average apartment prices in parts of Cluj-Napoca have even overtaken Bucharest's."}
            </p>
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

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'موزه‌ها و فرهنگ' : 'Museums & Culture'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'موزه ملی هنر رومانی (در کاخ سلطنتی سابق، میدان انقلاب) — آثار هنری رومانیایی و اروپایی از جمله برانکوزی و رامبراند.' : 'National Museum of Art of Romania (former Royal Palace, Revolution Square) — Romanian and European art, including Brâncuși and Rembrandt.'}</li>
                <li>{currentLang === 'fa' ? 'موزه ملی تاریخ رومانی (خیابان کالئا ویکتوریه) — جواهرات سلطنتی رومانی و گنجینه پیتروآسله.' : "National History Museum of Romania (Calea Victoriei) — home to Romania's Crown Jewels and the Pietroasele treasure."}</li>
                <li>{currentLang === 'fa' ? 'موزه ملی روستایی دیمیتریه گوستی (داخل پارک شاه میهای اول) — موزه روباز با ۱۲۳ خانه و بنای سنتی از سراسر رومانی.' : "Dimitrie Gusti National Village Museum (inside King Michael I Park) — an open-air museum with 123 traditional houses and structures from across Romania."}</li>
                <li>{currentLang === 'fa' ? 'موزه ملی تاریخ طبیعی گریگوره آنتیپا — بیش از ۲ میلیون نمونه، از جمله تنها اسکلت کامل دینوتریوم جهان.' : "Grigore Antipa National Museum of Natural History — over 2 million specimens, including the world's only intact Deinotherium skeleton."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'مراکز خرید و فروشگاه‌ها' : 'Shopping & Malls'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ای‌اف‌آی کوتروچنی (AFI Cotroceni) — بزرگ‌ترین مرکز خرید رومانی (حدود ۹۰,۰۰۰ متر مربع)، غرب شهر.' : "AFI Cotroceni — Romania's largest mall (~90,000 m²), western Bucharest."}</li>
                <li>{currentLang === 'fa' ? 'باندئاسا شاپینگ سیتی (Băneasa Shopping City) — شمال شهر، بیش از ۲۸۰ فروشگاه.' : 'Băneasa Shopping City — northern Bucharest, 280+ stores.'}</li>
                <li>{currentLang === 'fa' ? 'سان پلازا (Sun Plaza) — جنوب شهر؛ پرومنادا مال (Promenada Mall) — شمال‌شرق، مرکز خریدی لوکس‌تر.' : 'Sun Plaza — southern Bucharest; Promenada Mall — northeast, a more upscale option.'}</li>
                <li>{currentLang === 'fa' ? 'برای خرید روزانه مواد غذایی: زنجیره‌های کافلند، لیدل، کارفور، مگا ایمیج، پروفی، اوشان و پنی در سراسر شهر فعال هستند.' : 'For everyday groceries: Kaufland, Lidl, Carrefour, Mega Image, Profi, Auchan, and Penny all operate widely across the city.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">7</span>
                <span>{currentLang === 'fa' ? 'پارک‌ها و تفرجگاه‌ها' : 'Parks & Recreation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'باغ چیشمیجیو (Cișmigiu Gardens) — قدیمی‌ترین پارک مرکز شهر (از ۱۸۴۷)، با دریاچه؛ محل معمول گردهمایی ساکنان.' : 'Cișmigiu Gardens — the city center\'s oldest park (since 1847), with a lake; a common everyday gathering spot for residents.'}</li>
                <li>{currentLang === 'fa' ? 'پارک شاه میهای اول (هرستراو سابق) — حدود ۱۸۷ هکتار، بزرگ‌ترین فضای سبز تفریحی شهر با قایقرانی.' : "King Michael I Park (formerly Herăstrău) — roughly 187 hectares, the city's largest recreational green space, with boating."}</li>
                <li>{currentLang === 'fa' ? 'بازار اوبور (Obor) — یکی از قدیمی‌ترین و بزرگ‌ترین بازارهای سنتی شهر برای خرید محصولات تازه.' : "Obor Market — one of the city's oldest and largest traditional markets for fresh produce."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">8</span>
                <span>{currentLang === 'fa' ? 'بیمارستان‌ها و درمان' : 'Hospitals & Healthcare'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بیمارستان اورژانس دانشگاهی بخارست (SUUB) و بیمارستان اورژانس فلوریاسکا — دو بیمارستان اصلی دولتی برای موارد اورژانسی.' : 'University Emergency Hospital of Bucharest (SUUB) and Floreasca Emergency Clinical Hospital — the two main public emergency hospitals.'}</li>
                <li>{currentLang === 'fa' ? 'شبکه خصوصی رجینا ماریا (بیمارستان پوندراس، یوروکلینیک) و شبکه مدلایف، گزینه‌های رایج درمان خصوصی برای مهاجران هستند.' : 'The private Regina Maria network (Ponderas Academic Hospital, Euroclinic) and the MedLife network are common private-care options for foreign residents.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">9</span>
                <span>{currentLang === 'fa' ? 'فرودگاه، ایستگاه قطار و اتوبوس' : 'Airport, Train & Bus Stations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'فرودگاه بین‌المللی هنری کواندا (OTP) — حدود ۱۶.۵ کیلومتری شمال شهر در اوتوپنی؛ اصلی‌ترین دروازه بین‌المللی رومانی. با قطار حدود ۲۰-۲۵ دقیقه و با اتوبوس خط ۱۰۰ حدود ۳۵-۵۰ دقیقه تا مرکز شهر.' : "Henri Coandă International Airport (OTP) — about 16.5 km north of the city in Otopeni; Romania's main international gateway. About 20–25 min to center by train, or 35–50 min by bus line 100."}</li>
                <li>{currentLang === 'fa' ? 'گارا دو نورد (Gara de Nord) — بزرگ‌ترین ایستگاه راه‌آهن کشور، مرکز اتصال به تمام شهرهای بزرگ و چند کشور همسایه.' : "Gara de Nord (Bucharest North) — Romania's largest railway station, the hub connecting all major cities and several neighboring countries."}</li>
                <li>{currentLang === 'fa' ? 'برای اتوبوس‌های بین‌شهری/بین‌المللی، اتوگارا میلیتاری (Autogara Militari) پرکاربردترین ترمینال است.' : 'For intercity/international coaches, Autogara Militari is the most-used terminal.'}</li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 -mt-4">
            {currentLang === 'fa'
              ? 'منابع بخش فرهنگ/خرید/سلامت/حمل‌ونقل: ویکی‌پدیا و سایت‌های رسمی موزه‌ها، مراکز خرید، بیمارستان‌ها و فرودگاه — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶. آدرس‌ها، ساعات کاری و پروازها ممکن است تغییر کنند؛ پیش از مراجعه از سایت رسمی هر مکان استعلام بگیرید.'
              : "Sources for culture/shopping/healthcare/transit: Wikipedia and official museum, mall, hospital, and airport sites — Last reviewed: August 2026. Addresses, hours, and flight routes may change; check each venue's official site before visiting."}
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

          {!photoFailed && (
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/cities/cluj-napoca.jpg"
              alt={currentLang === 'fa' ? 'کلیسای سنت میکائیل در میدان اتحاد کلوژ-نپوکا' : "St. Michael's Church on Union Square, Cluj-Napoca"}
              className="w-full h-64 sm:h-80 object-cover"
              onError={() => setPhotoFailed(true)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-xs">
                {currentLang === 'fa'
                  ? 'کلیسای سنت میکائیل در میدان اتحاد کلوژ-نپوکا — عکس: ویکی‌مدیا کامنز'
                  : "St. Michael's Church on Union Square, Cluj-Napoca — Photo: Wikimedia Commons"}
              </p>
            </div>
          </div>
          )}

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <p>
              {currentLang === 'fa'
                ? 'کلوژ-نپوکا، پایتخت غیررسمی ترانسیلوانیا، محبوب‌ترین شهر رومانی برای مهندسان نرم‌افزار، استارتاپ‌ها و دانشجویان بین‌المللی است. تقاضای بالا برای مسکن (ناشی از جمعیت دانشجویی و شاغلان فناوری) باعث شده اجاره در کلوژ گاهی به سطح بخارست نزدیک یا حتی بالاتر برود.'
                : "Cluj-Napoca, the unofficial capital of Transylvania, is Romania's most popular city for software engineers, startups, and international students. High demand for housing (driven by its student population and tech workforce) means rents in Cluj sometimes run close to or even above Bucharest's."}
            </p>
            <p>
              {currentLang === 'fa'
                ? 'کلوژ-نپوکا در چند رتبه‌بندی مستقل به‌عنوان برترین شهر دانشجویی رومانی معرفی شده و شهرت قوی به‌عنوان قطب فناوری کشور دارد — همین موقعیت بخشی از دلیل تقاضای بالای مسکن در این شهر است.'
                : "Cluj-Napoca has repeatedly ranked as Romania's top student city in independent rankings and carries a strong reputation as the country's leading tech hub — a status that helps explain its high housing demand."}
            </p>
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

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'موزه‌ها و فرهنگ' : 'Museums & Culture'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'موزه ملی تاریخ ترانسیلوانیا (میدان موزه) — بزرگ‌ترین مجموعه اشیای برنزی اروپا و آثار دوران داکیایی/رومی.' : "National Museum of Transylvanian History (Piața Muzeului) — Europe's largest bronze-artifact collection and Dacian/Roman-era finds."}</li>
                <li>{currentLang === 'fa' ? 'موزه هنر کلوژ-نپوکا (کاخ بارکو، میدان اتحاد) — هنر رومانیایی و اروپایی از قرن ۱۵ تا ۲۰.' : 'Art Museum of Cluj-Napoca (Bánffy Palace, Union Square) — Romanian and European fine art from the 15th–20th centuries.'}</li>
                <li>{currentLang === 'fa' ? 'موزه قوم‌نگاری ترانسیلوانیا — بیش از ۴۰,۰۰۰ شیء فرهنگ عامه، همراه با پارک روباز «رومولوس ووئیا».' : "Ethnographic Museum of Transylvania — 40,000+ folk-culture artifacts, plus the open-air \"Romulus Vuia\" park."}</li>
                <li>{currentLang === 'fa' ? 'خانه هینتز (Casa Hintz)، مجموعه تاریخ داروسازی — میدان اتحاد، داخل یک داروخانه قدیمی قرن ۱۸.' : 'Hintz House (Casa Hintz) Pharmacy History Collection — Union Square, inside a preserved 18th-century pharmacy.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'مراکز خرید و فروشگاه‌ها' : 'Shopping & Malls'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'یولیوس مال کلوژ (Iulius Mall) — بزرگ‌ترین مرکز خرید شهر (حدود ۶۴,۰۰۰ متر مربع)، محله گئورگنی.' : 'Iulius Mall Cluj — the city\'s largest mall (~64,000 m²), in the Gheorgheni district.'}</li>
                <li>{currentLang === 'fa' ? 'ویوو کلوژ-نپوکا (VIVO!) — حومه فلورشتی؛ پلاتینیا (Platinia) — محله مناشتور.' : 'VIVO! Cluj-Napoca — in suburban Florești; Platinia Shopping Center — in the Mănăștur district.'}</li>
                <li>{currentLang === 'fa' ? 'برای خرید روزانه مواد غذایی: کافلند، لیدل، کارفور، اوشان، مگا ایمیج و پروفی همگی در سطح شهر فعال هستند.' : 'For everyday groceries: Kaufland, Lidl, Carrefour, Auchan, Mega Image, and Profi all operate across the city.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">7</span>
                <span>{currentLang === 'fa' ? 'پارک‌ها و تفرجگاه‌ها' : 'Parks & Recreation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پارک مرکزی «سیمیون بارنوتسیو» (پارک بزرگ) — از سال ۱۸۳۰، با دریاچه قایقرانی؛ میزبان جشنواره‌های آنتولد (Untold) و جاز.' : 'Central Park "Simion Bărnuțiu" (Great Park) — dating to 1830, with a boating lake; hosts the Untold and Jazz in the Park festivals.'}</li>
                <li>{currentLang === 'fa' ? 'پارک/تپه چتاتسویا (Cetățuia) — فضای سبز بالای شهر با استحکامات قرن ۱۸ و چشم‌انداز پانورامیک.' : 'Cetățuia Park/Hill — a hilltop green space with an 18th-century fortification and panoramic city views.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">8</span>
                <span>{currentLang === 'fa' ? 'بیمارستان‌ها و درمان' : 'Hospitals & Healthcare'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بیمارستان بالینی اورژانس شهرستان کلوژ (خیابان کلینیچیلور) — بزرگ‌ترین بیمارستان دولتی ترانسیلوانیا.' : "County Emergency Clinical Hospital Cluj-Napoca (Str. Clinicilor) — the largest public hospital in Transylvania."}</li>
                <li>{currentLang === 'fa' ? 'بیمارستان خصوصی رجینا ماریا کلوژ (کالئا دوروبانتسیلور) — تنها بیمارستان دارای اعتبار بین‌المللی JCI در ترانسیلوانیا؛ بیمارستان مدلایف هومانیتاس نیز در شهر فعال است.' : "Regina Maria Hospital Cluj (Calea Dorobanților) — the only JCI-accredited hospital in Transylvania; MedLife Humanitas Cluj also operates in the city."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">9</span>
                <span>{currentLang === 'fa' ? 'فرودگاه، ایستگاه قطار و اتوبوس' : 'Airport, Train & Bus Stations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'فرودگاه بین‌المللی آورام یانکو کلوژ (CLJ) — حدود ۹ کیلومتر (۲۰ دقیقه) شرق شهر؛ دومین فرودگاه پرترافیک رومانی با پروازهایی به لندن، پاریس، مونیخ، بارسلون و استانبول.' : "Avram Iancu Cluj International Airport (CLJ) — about 9 km (20 min) east of the city; Romania's 2nd-busiest airport, with routes to London, Paris, Munich, Barcelona, and Istanbul."}</li>
                <li>{currentLang === 'fa' ? 'ایستگاه راه‌آهن کلوژ-نپوکا (میدان گاری) — حدود ۱۰۰ قطار روزانه به اکثر شهرهای رومانی، به‌همراه خطوط فرامرزی به بوداپست و وین.' : 'Cluj-Napoca railway station (Piața Gării) — about 100 daily trains to most Romanian cities, plus cross-border service to Budapest and Vienna.'}</li>
                <li>{currentLang === 'fa' ? 'اتوبوس‌های بین‌شهری/بین‌المللی از سه ترمینال اصلی حرکت می‌کنند: اتوگارا فنی، اتوگارا بتا و اتوگارا سنس وست.' : 'Intercity/international coaches depart from three main terminals: Autogara Fany, Autogara Beta, and Autogara Sens Vest.'}</li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 -mt-4">
            {currentLang === 'fa'
              ? 'منابع بخش فرهنگ/خرید/سلامت/حمل‌ونقل: ویکی‌پدیا و سایت‌های رسمی موزه‌ها، مراکز خرید، بیمارستان‌ها و فرودگاه — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶. آدرس‌ها، ساعات کاری و پروازها ممکن است تغییر کنند؛ پیش از مراجعه از سایت رسمی هر مکان استعلام بگیرید.'
              : "Sources for culture/shopping/healthcare/transit: Wikipedia and official museum, mall, hospital, and airport sites — Last reviewed: August 2026. Addresses, hours, and flight routes may change; check each venue's official site before visiting."}
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

          {!photoFailed && (
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/cities/timisoara.jpg"
              alt={currentLang === 'fa' ? 'میدان اتحاد در تیمیشوارا' : 'Piața Unirii (Union Square), Timișoara'}
              className="w-full h-64 sm:h-80 object-cover"
              onError={() => setPhotoFailed(true)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-xs">
                {currentLang === 'fa'
                  ? 'میدان اتحاد (Piața Unirii) در تیمیشوارا — عکس: ویکی‌مدیا کامنز'
                  : 'Piața Unirii (Union Square), Timișoara — Photo: Wikimedia Commons'}
              </p>
            </div>
          </div>
          )}

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <p>
              {currentLang === 'fa'
                ? 'تیمیشوارا در غرب رومانی و نزدیک مرزهای مجارستان و صربستان واقع شده و به دلیل معماری کلاسیک اروپایی و فضای شهری آرام، اغلب «اروپایی‌ترین» شهر رومانی توصیف می‌شود. هزینه زندگی در تیمیشوارا معمولاً پایین‌تر از بخارست و کلوژ-نپوکا است.'
                : 'Timișoara, located in western Romania near the Hungarian and Serbian borders, is often described as the "most European-feeling" Romanian city thanks to its classical European architecture and relaxed urban atmosphere. Its cost of living is typically lower than Bucharest and Cluj-Napoca.'}
            </p>
            <p>
              {currentLang === 'fa'
                ? 'در سال ۱۸۸۴، تیمیشوارا نخستین شهر اروپای قاره‌ای بود که روشنایی خیابانی برقی عمومی دریافت کرد — میراثی پیشگام که هنوز بخشی از هویت شهری آن است. این شهر همچنین در سال ۲۰۲۳ به‌عنوان پایتخت فرهنگی اروپا انتخاب شد و میراث فرهنگی ماندگاری از آن دوره به‌جا مانده است.'
                : "In 1884, Timișoara became the first city in continental Europe to have public electric street lighting — a pioneering legacy that remains part of its civic identity. The city also served as European Capital of Culture in 2023, leaving a lasting cultural legacy behind."}
            </p>
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

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'موزه‌ها و فرهنگ' : 'Museums & Culture'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'موزه ملی بانات (داخل قلعه هونیاده) — بزرگ‌ترین مجموعه باستان‌شناسی منطقه، شامل بازسازی معبد نوسنگی پارتسا.' : "National Museum of Banat (inside Huniade Castle) — the region's largest archaeology collection, including a reconstruction of the Parța Neolithic Sanctuary."}</li>
                <li>{currentLang === 'fa' ? 'موزه هنر تیمیشوارا (کاخ باروک، میدان اتحاد) — نقاشی‌های ایتالیایی، فلاندری، آلمانی و رومانیایی.' : 'Art Museum Timișoara (Baroque Palace, Union Square) — Italian, Flemish, German, and Romanian paintings.'}</li>
                <li>{currentLang === 'fa' ? 'موزه یادبود انقلاب ۱۹۸۹ (خیابان پوپا شاپکا) — روایت قیام مردمی که از تیمیشوارا آغاز شد.' : "Memorial Museum of the 1989 Revolution (Popa Șapca St.) — documents the anti-Ceaușescu uprising that began in Timișoara."}</li>
                <li>{currentLang === 'fa' ? 'موزه روباز روستایی بانات — در حاشیه جنگل سبز (Pădurea Verde)، خانه‌های سنتی اقوام منطقه بانات.' : "Banat Village Museum (open-air) — on the edge of the Green Forest (Pădurea Verde), with traditional houses from Banat's ethnic groups."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'مراکز خرید و فروشگاه‌ها' : 'Shopping & Malls'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'یولیوس تاون (Iulius Town) — بزرگ‌ترین مجتمع خرید ترکیبی خارج از بخارست (حدود ۱۰۲,۰۰۰ متر مربع).' : "Iulius Town — the largest mixed-use retail complex outside Bucharest (~102,000 m²)."}</li>
                <li>{currentLang === 'fa' ? 'شاپینگ سیتی تیمیشوارا (Shopping City) — ۱۱۰ فروشگاه، تنها سینمای IMAX/4DX رومانی.' : "Shopping City Timișoara — 110 shops, Romania's only IMAX/4DX cinema."}</li>
                <li>{currentLang === 'fa' ? 'بگا شاپینگ سنتر (Bega Shopping Center) — در مرکز تاریخی شهر، یکی از قدیمی‌ترین مراکز خرید رومانی (از ۱۹۷۳).' : "Bega Shopping Center — in the historic center, one of Romania's oldest shopping centers (since 1973)."}</li>
                <li>{currentLang === 'fa' ? 'برای خرید روزانه مواد غذایی: کافلند، اوشان و کارفور با چند شعبه فعال‌اند؛ لیدل، مگا ایمیج و پروفی نیز در سطح شهر حضور دارند.' : 'For everyday groceries: Kaufland, Auchan, and Carrefour have multiple branches; Lidl, Mega Image, and Profi are also present citywide.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">7</span>
                <span>{currentLang === 'fa' ? 'پارک‌ها و تفرجگاه‌ها' : 'Parks & Recreation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پارک رزها (Parcul Rozelor) — از سال ۱۸۹۱، بیش از ۹,۰۰۰ رقم گل رز؛ منشأ لقب «شهر رزها».' : 'Roses Park (Parcul Rozelor) — established 1891, with over 9,000 rose varieties; the source of Timișoara\'s "City of Roses" nickname.'}</li>
                <li>{currentLang === 'fa' ? 'میدان اتحاد (Piața Unirii) — قدیمی‌ترین میدان شهر، محل گردهمایی روزمره ساکنان.' : "Union Square (Piața Unirii) — the city's oldest square, an everyday local gathering spot."}</li>
                <li>{currentLang === 'fa' ? 'کناره رودخانه بگا — مسیرهای پیاده‌روی و دویدن در دل شهر.' : 'Bega River banks/promenade — walking and running paths running through the city.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">8</span>
                <span>{currentLang === 'fa' ? 'بیمارستان‌ها و درمان' : 'Hospitals & Healthcare'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بیمارستان بالینی اورژانس شهرستان «پیوس برین‌زئو» — بیمارستان اصلی دولتی؛ بیمارستان کودکان لوئی تسورکانو نیز در شهر فعال است.' : 'County Emergency Clinical Hospital "Pius Brînzeu" — the main public hospital; Louis Țurcanu Children\'s Hospital (pediatric) also operates in the city.'}</li>
                <li>{currentLang === 'fa' ? 'شبکه‌های خصوصی رجینا ماریا (از جمله درمانگاهی داخل یولیوس تاون) و مدلایف (منطقه دراگالینا) در دسترس هستند.' : 'Private networks Regina Maria (including a policlinic inside Iulius Town) and MedLife (Dragalina area) are also available.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">9</span>
                <span>{currentLang === 'fa' ? 'فرودگاه، ایستگاه قطار و اتوبوس' : 'Airport, Train & Bus Stations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'فرودگاه بین‌المللی تیمیشوارا «تریان وویا» (TSR) — حدود ۱۲ کیلومتر شمال‌شرق شهر؛ پروازهایی به لندن، مونیخ، میلان، بروکسل، استانبول و دبی.' : 'Timișoara Traian Vuia International Airport (TSR) — about 12 km northeast of the city; routes to London, Munich, Milan, Brussels, Istanbul, and Dubai.'}</li>
                <li>{currentLang === 'fa' ? 'ایستگاه راه‌آهن تیمیشوارا نورد — بزرگ‌ترین ایستگاه غرب رومانی، با خطوط به اوردیا، بخارست و یاش.' : 'Timișoara Nord railway station — the largest station in western Romania, with lines to Oradea, Bucharest, and Iași.'}</li>
                <li>{currentLang === 'fa' ? 'برای اتوبوس‌های بین‌شهری/بین‌المللی، اتوگارا نورماندیا و اتوگارا اتوتیم اصلی‌ترین ترمینال‌ها هستند (مسیرهایی به برلین، بوداپست، وین، پاریس و لندن).' : 'For intercity/international coaches, Autogara Normandia and Autogara Autotim are the main terminals (routes to Berlin, Budapest, Vienna, Paris, and London).'}</li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 -mt-4">
            {currentLang === 'fa'
              ? 'منابع بخش فرهنگ/خرید/سلامت/حمل‌ونقل: ویکی‌پدیا و سایت‌های رسمی موزه‌ها، مراکز خرید، بیمارستان‌ها و فرودگاه — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶. آدرس‌ها، ساعات کاری و پروازها ممکن است تغییر کنند؛ پیش از مراجعه از سایت رسمی هر مکان استعلام بگیرید.'
              : "Sources for culture/shopping/healthcare/transit: Wikipedia and official museum, mall, hospital, and airport sites — Last reviewed: August 2026. Addresses, hours, and flight routes may change; check each venue's official site before visiting."}
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

          {!photoFailed && (
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/cities/iasi.jpg"
              alt={currentLang === 'fa' ? 'کاخ فرهنگ یاش' : 'The Palace of Culture, Iași'}
              className="w-full h-64 sm:h-80 object-cover"
              onError={() => setPhotoFailed(true)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-xs">
                {currentLang === 'fa'
                  ? 'کاخ فرهنگ یاش (Palatul Culturii) — عکس: ویکی‌مدیا کامنز'
                  : 'The Palace of Culture (Palatul Culturii), Iași — Photo: Wikimedia Commons'}
              </p>
            </div>
          </div>
          )}

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <p>
              {currentLang === 'fa'
                ? 'یاش، پایتخت تاریخی و فرهنگی منطقه مولداوی، میزبان اولین و یکی از بزرگ‌ترین دانشگاه‌های رومانی است. نسبت به بخارست و کلوژ-نپوکا، منابع موجود به‌طور مستمر یاش را در ردیف شهرهای مقرون‌به‌صرفه‌تر برای هزینه زندگی قرار می‌دهند، هرچند رتبه‌بندی دقیق و رسمی «ارزان‌ترین شهر» یافت نشد.'
                : "Iași, the historic and cultural capital of the Moldavia region, is home to Romania's first and one of its largest universities. Compared to Bucharest and Cluj-Napoca, available sources consistently place Iași among the more affordable cities for cost of living, though no single authoritative \"cheapest city\" ranking was found."}
            </p>
            <p>
              {currentLang === 'fa'
                ? 'در آوریل ۲۰۲۳، مجتمع پالاس (Palas Campus) در یاش افتتاح شد که بزرگ‌ترین ساختمان اداری رومانی محسوب می‌شود و رشد سریع بخش خدمات و فناوری در این شهر را نشان می‌دهد — نشانه‌ای از اینکه یاش دیگر فقط یک شهر دانشگاهی سنتی نیست.'
                : "In April 2023, the Palas Campus office complex opened in Iași — Romania's largest office building — reflecting the city's fast-growing services and tech sector, a sign that Iași is no longer just a traditional university town."}
            </p>
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

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'موزه‌ها و فرهنگ' : 'Museums & Culture'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'کاخ فرهنگ (مرکز مدنی شهر) — یک بنا با چهار موزه ملی: تاریخ مولداوی، هنر، قوم‌نگاری و علم و فناوری «استفان پروکوپیو».' : "Palace of Culture (Civic Centre) — a single building housing four national museums: Moldavia History, Art, Ethnographic, and \"Ștefan Procopiu\" Science & Technology."}</li>
                <li>{currentLang === 'fa' ? 'موزه اتحاد (خیابان الکساندرو لاپوشنیانو) — در محل اقامت سابق شاهزاده الکساندرو یوان کوزا.' : 'Union Museum (Al. Lăpușneanu St.) — housed in the former residence of Prince Alexandru Ioan Cuza.'}</li>
                <li>{currentLang === 'fa' ? 'خانه یادبود میهای امینسکو (داخل پارک کوپو) — موزه ادبی شاعر ملی رومانی.' : 'Mihai Eminescu Memorial House (inside Copou Park) — a literary museum dedicated to Romania\'s national poet.'}</li>
                <li>{currentLang === 'fa' ? 'باغ گیاه‌شناسی یاش «آناستازیه فاتو» (کوپو) — قدیمی‌ترین و بزرگ‌ترین باغ گیاه‌شناسی رومانی (بیش از ۸۰ هکتار).' : 'Iași Botanical Garden "Anastasie Fătu" (Copou) — Romania\'s oldest and largest botanical garden (80+ hectares).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'مراکز خرید و فروشگاه‌ها' : 'Shopping & Malls'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پالاس مال (Palas Mall) — مرکز مدنی شهر، مجاور کاخ فرهنگ؛ بیش از ۲۷۰ فروشگاه و رستوران.' : 'Palas Mall — in the Civic Centre, next to the Palace of Culture; 270+ shops and restaurants.'}</li>
                <li>{currentLang === 'fa' ? 'یولیوس مال یاش (Iulius Mall) — بیش از ۲۰۰ فروشگاه، سینمای چندسالنه.' : 'Iulius Mall Iași — 200+ stores, a multi-screen cinema.'}</li>
                <li>{currentLang === 'fa' ? 'برای خرید روزانه مواد غذایی: کافلند، لیدل (بیش از ۸ شعبه)، کارفور، اوشان (داخل پالاس مال)، پروفی و مگا ایمیج در سطح شهر فعال هستند.' : 'For everyday groceries: Kaufland, Lidl (8+ locations), Carrefour, Auchan (inside Palas Mall), Profi, and Mega Image all operate citywide.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">7</span>
                <span>{currentLang === 'fa' ? 'پارک‌ها و تفرجگاه‌ها' : 'Parks & Recreation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پارک کوپو — قدیمی‌ترین پارک عمومی یاش (از ۱۸۳۴)، خانه «نارون امینسکو» و بنای یادبود شیرها.' : 'Copou Park — the oldest public park in Iași (since 1834), home to the "Eminescu Linden Tree" and the Lions\' Obelisk.'}</li>
                <li>{currentLang === 'fa' ? 'مجموعه پالاس — علاوه بر مرکز خرید، فضای باغ عمومی هم دارد که محل رفت‌وآمد روزمره ساکنان است.' : 'The Palas complex — beyond shopping, includes a public garden that functions as a daily gathering spot for residents.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">8</span>
                <span>{currentLang === 'fa' ? 'بیمارستان‌ها و درمان' : 'Hospitals & Healthcare'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بیمارستان بالینی اورژانس شهرستان «سفنتول اسپیریدون» (بلوار استقلال) — بزرگ‌ترین بیمارستان دولتی اورژانس منطقه.' : 'County Emergency Hospital "Sf. Spiridon" (Bd. Independenței) — the largest public emergency hospital in the region.'}</li>
                <li>{currentLang === 'fa' ? 'شبکه‌های خصوصی رجینا ماریا (کمپوس مدیکال) و مدلایف نیز درمانگاه‌های فعال در شهر دارند.' : 'The private Regina Maria (Campus Medical) and MedLife networks also operate clinics in the city.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">9</span>
                <span>{currentLang === 'fa' ? 'فرودگاه، ایستگاه قطار و اتوبوس' : 'Airport, Train & Bus Stations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'فرودگاه بین‌المللی یاش (IAS) — حدود ۸ کیلومتری شرق شهر؛ ترمینال جدید در مارس ۲۰۲۴ افتتاح شد؛ پروازهایی به پاریس، بروکسل و وین.' : 'Iași International Airport (IAS) — about 8 km east of the city; a new terminal opened in March 2024; routes to Paris, Brussels, and Vienna.'}</li>
                <li>{currentLang === 'fa' ? 'ایستگاه راه‌آهن یاش — روی کریدور پان‌اروپایی نهم، با حدود ۱۱۰ قطار روزانه به بخارست، کونستانتسا، براشوف و مسیرهایی به سمت کیشیناو (مولداوی).' : 'Gara Iași railway station — on Pan-European Corridor IX, with about 110 daily trains to Bucharest, Constanța, Brașov, and routes toward Chișinău (Moldova).'}</li>
                <li>{currentLang === 'fa' ? 'اتوگارا یاش وست (Autogara Iași Vest) — ترمینال اصلی اتوبوس‌های بین‌شهری/بین‌المللی با بیش از ۳۰۰ حرکت روزانه.' : 'Autogara Iași Vest — the main intercity/international coach terminal, with 300+ daily departures.'}</li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 -mt-4">
            {currentLang === 'fa'
              ? 'منابع بخش فرهنگ/خرید/سلامت/حمل‌ونقل: ویکی‌پدیا و سایت‌های رسمی موزه‌ها، مراکز خرید، بیمارستان‌ها و فرودگاه — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶. آدرس‌ها، ساعات کاری و پروازها ممکن است تغییر کنند؛ پیش از مراجعه از سایت رسمی هر مکان استعلام بگیرید.'
              : "Sources for culture/shopping/healthcare/transit: Wikipedia and official museum, mall, hospital, and airport sites — Last reviewed: August 2026. Addresses, hours, and flight routes may change; check each venue's official site before visiting."}
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

          {!photoFailed && (
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/cities/brasov.jpg"
              alt={currentLang === 'fa' ? 'میدان شورا در براشوف با پس‌زمینه کوه تامپا' : 'Piața Sfatului (Council Square), Brașov, with Mount Tâmpa behind it'}
              className="w-full h-64 sm:h-80 object-cover"
              onError={() => setPhotoFailed(true)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-xs">
                {currentLang === 'fa'
                  ? 'میدان شورا (Piața Sfatului) در براشوف، با کوه تامپا در پس‌زمینه — عکس: ویکی‌مدیا کامنز'
                  : 'Piața Sfatului (Council Square), Brașov, with Mount Tâmpa in the background — Photo: Wikimedia Commons'}
              </p>
            </div>
          </div>
          )}

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <p>
              {currentLang === 'fa'
                ? 'براشوف، محصور در کوهستان‌های سرسبز کارپات، توریستی‌ترین شهر رومانی و دروازه اصلی پیست اسکی پویانا براشوف است. توجه: بر اساس داده‌های موجود، اجاره مسکن در براشوف نسبت به جمعیت شهر بالاست که احتمالاً ناشی از تقاضای گردشگری است — پیش از تصمیم‌گیری حتماً قیمت‌های روز را از سایت‌های آگهی محلی استعلام کنید.'
                : "Brașov, nestled in the green Carpathian Mountains, is Romania's most touristic city and the main gateway to the Poiana Brașov ski resort. Note: based on available data, housing rent in Brașov runs high relative to the city's population, likely driven by tourism demand — be sure to check current listing-site prices before making a decision."}
            </p>
            <p>
              {currentLang === 'fa'
                ? 'در دوران کمونیستی، براشوف با نام «اوراشول استالین» (شهر استالین) شناخته می‌شد و در آن دوره به‌عنوان یک مرکز صنعتی بزرگ توسعه یافت؛ این پیشینه صنعتی هنوز تا حد زیادی الگوی محله‌بندی امروزی شهر را شکل می‌دهد.'
                : 'During the communist era, Brașov was known as "Orașul Stalin" (Stalin City) and was developed into a major industrial center — a history that still shapes much of the city\'s neighborhood layout today.'}
            </p>
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

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'موزه‌ها و بناهای تاریخی' : 'Museums & Landmarks'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'کلیسای سیاه (Biserica Neagră) — بزرگ‌ترین بنای گوتیک رومانی (قرن ۱۴-۱۵)، در قلب شهر قدیم.' : 'The Black Church (Biserica Neagră) — Romania\'s largest Gothic monument (14th–15th century), in the heart of the Old Town.'}</li>
                <li>{currentLang === 'fa' ? 'میدان شورا (Piața Sfatului) — میدان تاریخی مرکز شهر با حق بازاری از سال ۱۵۲۰.' : 'Council Square (Piața Sfatului) — the historic central square, with market rights dating to 1520.'}</li>
                <li>{currentLang === 'fa' ? 'موزه تاریخ شهرستان براشوف — داخل خانه شورای سابق (۱۴۲۰)، در همان میدان شورا.' : 'Brașov County Museum of History — housed in the former Council House (1420), on Council Square.'}</li>
                <li>{currentLang === 'fa' ? 'قلعه براشوف (Cetățuia) — استحکامات قرن ۱۶ بر فراز تپه‌ای مشرف به شهر.' : 'Brașov Citadel (Cetățuia) — a 16th-century fortification on a hill overlooking the city.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'مراکز خرید و فروشگاه‌ها' : 'Shopping & Malls'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'کورسی شاپینگ ریزورت (Coresi) — بزرگ‌ترین مرکز خرید براشوف، با هایپرمارکت اوشان و تنها سینمای مولتی‌پلکس شهر.' : "Coresi Shopping Resort — Brașov's largest mall, with an Auchan hypermarket and the city's only multiplex cinema."}</li>
                <li>{currentLang === 'fa' ? 'ای‌اف‌آی براشوف (AFI Brașov) — برندهایی مثل سفورا و آندر آرمور، به‌همراه سینما و باشگاه ورزشی.' : 'AFI Brașov — with brands like Sephora and Under Armour, plus a cinema and gym.'}</li>
                <li>{currentLang === 'fa' ? 'برای خرید روزانه مواد غذایی: کافلند، لیدل، پروفی و کارفور در سطح شهر فعال‌اند.' : 'For everyday groceries: Kaufland, Lidl, Profi, and Carrefour all operate across the city.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">7</span>
                <span>{currentLang === 'fa' ? 'کوهستان و تفرجگاه‌ها' : 'Mountains & Recreation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تله‌کابین کوه تامپا — از ارتفاع ۶۴۰ به ۹۶۰ متر، با مسیرهای پیاده‌روی در منطقه حفاظت‌شده قله.' : 'Tâmpa Mountain cable car — rising from 640 m to 960 m, with hiking trails in the protected summit area.'}</li>
                <li>{currentLang === 'fa' ? 'پویانا براشوف — پیست اسکی ۱۲ کیلومتری با حدود ۱۲۰ روز برف در سال، مقصد اصلی زمستانی ساکنان.' : 'Poiana Brașov — a ski resort 12 km away with about 120 days of snow cover per year, the main winter destination for residents.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">8</span>
                <span>{currentLang === 'fa' ? 'بیمارستان‌ها و درمان' : 'Hospitals & Healthcare'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بیمارستان بالینی اورژانس شهرستان براشوف (کالئا بوکورشتی) — بیمارستان اصلی دولتی.' : 'County Emergency Clinical Hospital Brașov (Calea București) — the main public hospital.'}</li>
                <li>{currentLang === 'fa' ? 'شبکه‌های خصوصی رجینا ماریا (از جمله کمپوس مدیکال براشوف) و مدلایف نیز در شهر فعال هستند.' : 'The private Regina Maria (including Campus Medical Brașov) and MedLife networks also operate in the city.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">9</span>
                <span>{currentLang === 'fa' ? 'فرودگاه، ایستگاه قطار و اتوبوس' : 'Airport, Train & Bus Stations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'فرودگاه بین‌المللی براشوف-گیمباو (GHV) — از سال ۲۰۲۳ فعال، حدود ۱۲ کیلومتری شهر؛ عمدتاً پروازهای ویزایر به بوداپست، لندن-لوتون و میلان. فرودگاه اوتوپنی بخارست همچنان دروازه اصلی بین‌المللی رومانی محسوب می‌شود (حدود ۲.۵ تا ۳ ساعت با ماشین یا حدود ۲ ساعت و ۱۶ دقیقه با قطار سریع‌السیر).' : "Brașov-Ghimbav International Airport (GHV) — operating since 2023, about 12 km from the city; mainly Wizz Air routes to Budapest, London-Luton, and Milan. Bucharest's Otopeni Airport remains Romania's main international gateway (about 2.5–3 hours by car, or ~2h16m by fast train)."}</li>
                <li>{currentLang === 'fa' ? 'ایستگاه راه‌آهن براشوف — با خطوطی به بخارست، سیگیشوارا، کلوژ و سیبیو.' : 'Brașov railway station — with lines to Bucharest, Sighișoara, Cluj, and Sibiu.'}</li>
                <li>{currentLang === 'fa' ? 'اتوگارا ۱ (بارتولومئو، حرکات بین‌المللی) و اتوگارا ۲ — دو ترمینال اصلی اتوبوس بین‌شهری.' : 'Autogara 1 (Bartolomeu, international departures) and Autogara 2 — the two main intercity bus terminals.'}</li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 -mt-4">
            {currentLang === 'fa'
              ? 'منابع بخش فرهنگ/خرید/سلامت/حمل‌ونقل: ویکی‌پدیا و سایت‌های رسمی موزه‌ها، مراکز خرید، بیمارستان‌ها و فرودگاه — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶. آدرس‌ها، ساعات کاری و پروازها ممکن است تغییر کنند؛ پیش از مراجعه از سایت رسمی هر مکان استعلام بگیرید.'
              : "Sources for culture/shopping/healthcare/transit: Wikipedia and official museum, mall, hospital, and airport sites — Last reviewed: August 2026. Addresses, hours, and flight routes may change; check each venue's official site before visiting."}
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

          {!photoFailed && (
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/cities/constanta.jpg"
              alt={currentLang === 'fa' ? 'کازینوی تاریخی کونستانتسا در کنار دریای سیاه' : 'The historic Constanța Casino on the Black Sea waterfront'}
              className="w-full h-64 sm:h-80 object-cover"
              onError={() => setPhotoFailed(true)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-xs">
                {currentLang === 'fa'
                  ? 'کازینوی تاریخی کونستانتسا (۱۹۱۰) در کنار دریای سیاه — عکس: ویکی‌مدیا کامنز'
                  : 'The historic Constanța Casino (built 1910) on the Black Sea waterfront — Photo: Wikimedia Commons'}
              </p>
            </div>
          </div>
          )}

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <p>
              {currentLang === 'fa'
                ? 'کونستانتسا، بزرگ‌ترین بندر دریای سیاه رومانی و مرکز اصلی صنایع دریانوردی و لجستیک کشور است. همسایگی با منطقه ساحلی ماماییا، آن را به یک شهر با اقتصاد فصلی گردشگری نیز تبدیل کرده که این ویژگی آن را از سایر شهرهای این راهنما متمایز می‌کند.'
                : "Constanța, Romania's largest Black Sea port, is the country's main hub for maritime and logistics industries. Its proximity to the Mamaia coastal resort area also gives it a seasonal tourism economy, a character distinct from the other cities in this guide."}
            </p>
            <p>
              {currentLang === 'fa'
                ? 'از سال ۲۰۲۲ به بعد، بندر کونستانتسا به یکی از مسیرهای اصلی جایگزین برای صادرات غلات اوکراین از طریق دریای سیاه تبدیل شده که اهمیت لجستیکی و اقتصادی این شهر را به‌طور چشمگیری افزایش داده است.'
                : "Since 2022, the port of Constanța has become one of Ukraine's key alternative Black Sea grain-export routes, significantly boosting the city's logistical and economic importance."}
            </p>
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

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'موزه‌ها و بناهای تاریخی' : 'Museums & Landmarks'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'موزه تاریخ و باستان‌شناسی کونستانتسا (میدان اوویدیو) — مجسمه مار «گلیکون» و آثار یونانی-رومی.' : "Constanța History and Archaeology Museum (Piața Ovidiu) — home to the 'Glykon' serpent statue and Greco-Roman artifacts."}</li>
                <li>{currentLang === 'fa' ? 'کازینوی کونستانتسا (بلوار رجینا الیزابتا) — بنای آرت‌نوو کنار دریا؛ بعد از بازسازی در مه ۲۰۲۵ به‌عنوان مکان فرهنگی بازگشایی شد.' : 'Constanța Casino (Bd. Regina Elisabeta) — an Art Nouveau seafront landmark, reopened as a cultural site in May 2025 after restoration.'}</li>
                <li>{currentLang === 'fa' ? 'فانوس دریایی ژنوی و مسجد بزرگ محمودیه (میدان اوویدیو) — از نمادهای تاریخی شهر بندری.' : 'The Genoese Lighthouse and the Great Mahmudiye Mosque (Ovidiu Square) — historic landmarks of the port city.'}</li>
                <li>{currentLang === 'fa' ? 'آکواریوم کونستانتسا — کنار دریا، بیش از ۶۰ گونه ماهی.' : 'Constanța Aquarium — on the seafront, with 60+ fish species.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'مراکز خرید و فروشگاه‌ها' : 'Shopping & Malls'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'سیتی پارک مال (City Park Mall) — بزرگ‌ترین مرکز خرید شهر (حدود ۵۹,۰۰۰ متر مربع)، محله توميس نورد.' : "City Park Mall — the city's largest mall (~59,000 m²), in the Tomis Nord district."}</li>
                <li>{currentLang === 'fa' ? 'توميس مال (Tomis Mall) — در مرکز شهر، از نخستین مراکز خرید کونستانتسا.' : "Tomis Mall — in the city center, one of Constanța's first shopping centers."}</li>
                <li>{currentLang === 'fa' ? 'برای خرید روزانه مواد غذایی: کافلند، لیدل، کارفور و پروفی بیشترین شعبه را دارند؛ مگا ایمیج، اوشان، کورا و پنی هم فعال‌اند.' : 'For everyday groceries: Kaufland, Lidl, Carrefour, and Profi have the widest footprint; Mega Image, Auchan, Cora, and Penny are also present.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">7</span>
                <span>{currentLang === 'fa' ? 'ساحل و تفرجگاه‌ها' : 'Beach & Recreation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ماماییا — نوار ساحلی حدود ۵ کیلومتری شمال شهر، با پیاده‌راه، هتل‌ها و تله‌کابین.' : 'Mamaia — a beach resort strip about 5 km north of the city, with a promenade, hotels, and a cable car.'}</li>
                <li>{currentLang === 'fa' ? 'پیاده‌راه کازینو — گذرگاه ساحلی محبوب برای پیاده‌روی روزمره ساکنان.' : "The Casino promenade/seafront — a popular boardwalk for residents' everyday walks."}</li>
                <li>{currentLang === 'fa' ? 'گرویتی پارک (Gravity Park) — بزرگ‌ترین پارک ورزش‌های اکستریم رومانی (اسکیت‌بورد، بی‌ام‌ایکس، سنگ‌نوردی).' : "Gravity Park — Romania's largest extreme-sports park (skateboarding, BMX, climbing)."}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">8</span>
                <span>{currentLang === 'fa' ? 'بیمارستان‌ها و درمان' : 'Hospitals & Healthcare'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بیمارستان بالینی اورژانس شهرستان «سفنتول آپوستول آندره‌ای» (بلوار توميس) — بیمارستان اصلی دولتی.' : 'County Emergency Hospital "Sf. Apostol Andrei" (Bd. Tomis) — the main public hospital.'}</li>
                <li>{currentLang === 'fa' ? 'بیمارستان خصوصی اوویدیوس (OCH) و شبکه‌های رجینا ماریا و مدلایف نیز گزینه‌های درمان خصوصی در شهر هستند.' : 'Ovidius Clinical Hospital (OCH), along with the Regina Maria and MedLife networks, are private-care options in the city.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">9</span>
                <span>{currentLang === 'fa' ? 'فرودگاه، ایستگاه قطار و اتوبوس' : 'Airport, Train & Bus Stations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'فرودگاه بین‌المللی میهایل کوگالنیچانو (CND) — حدود ۲۶ کیلومتری شهر؛ پروازهایی از جمله ترکیش ایرلاینز و بلو ایر.' : 'Mihail Kogălniceanu International Airport (CND) — about 26 km from the city; served by carriers including Turkish Airlines and Blue Air.'}</li>
                <li>{currentLang === 'fa' ? 'ایستگاه راه‌آهن کونستانتسا — روی خط اصلی بخارست-فتشتی-کونستانتسا-مانگالیا، با حدود ۵۰ قطار روزانه به شهرهای بزرگ رومانی.' : 'Constanța railway station — on the main Bucharest–Fetești–Constanța–Mangalia line, with about 50 daily trains to major Romanian cities.'}</li>
                <li>{currentLang === 'fa' ? 'اتوگارا سود (Autogara Sud، نزدیک ایستگاه قطار) — ترمینال اصلی اتوبوس بین‌شهری؛ اتوگارا توميس نورد به‌عنوان ترمینال فرعی.' : 'Autogara Sud (near the train station) — the main intercity bus terminal; Autogara Tomis Nord serves as a secondary hub.'}</li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 -mt-4">
            {currentLang === 'fa'
              ? 'منابع بخش فرهنگ/خرید/سلامت/حمل‌ونقل: ویکی‌پدیا و سایت‌های رسمی موزه‌ها، مراکز خرید، بیمارستان‌ها و فرودگاه — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶. آدرس‌ها، ساعات کاری و پروازها ممکن است تغییر کنند؛ پیش از مراجعه از سایت رسمی هر مکان استعلام بگیرید.'
              : "Sources for culture/shopping/healthcare/transit: Wikipedia and official museum, mall, hospital, and airport sites — Last reviewed: August 2026. Addresses, hours, and flight routes may change; check each venue's official site before visiting."}
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
