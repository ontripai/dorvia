'use client';

import React from 'react';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface ScholarshipOverviewContentProps {
  currentLang: Language;
}

export const ScholarshipOverviewContent: React.FC<ScholarshipOverviewContentProps> = ({ currentLang }) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <Breadcrumb slugRoute="study/scholarships" currentLang={currentLang} />
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {currentLang === 'fa' ? 'بورسیه تحصیلی دولت رومانی' : 'Romanian Government Scholarship'}
        </h1>
        <div className="text-[11px] text-slate-400 mt-2">
          {currentLang === 'fa' 
            ? 'منبع: وزارت امور خارجه رومانی، پلتفرم رسمی Study in Romania (studyinromania.gov.ro) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
            : 'Source: Romanian Ministry of Foreign Affairs, Official Study in Romania Platform (studyinromania.gov.ro) — Last reviewed: August 2026'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
            <span>{currentLang === 'fa' ? 'چارچوب کلی برنامه' : 'General Program Framework'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'دولت رومانی هرساله از طریق وزارت امور خارجه، بورسیه‌های کامل (Fully-Funded) برای شهروندان کشورهای غیر عضو اتحادیه اروپا در مقاطع کارشناسی، کارشناسی ارشد و دکتری ارائه می‌دهد.' : 'Every year, through the Ministry of Foreign Affairs, the Romanian government offers fully-funded scholarships for citizens of non-EU countries in bachelor\'s, master\'s, and doctoral programs.'}</li>
            <li>{currentLang === 'fa' ? 'مزایا، رشته‌های مشمول، زبان تحصیل، کمک‌هزینه و مهلت درخواست در هر برنامه بورسیه متفاوت است و باید بر اساس فراخوان رسمی همان سال بررسی شود.' : 'Benefits, eligible fields, language of study, stipends, and application deadlines vary by scholarship program and must be verified based on the official call for that year.'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
            <span>{currentLang === 'fa' ? 'شرایط و زبان تحصیل' : 'Conditions and Language of Study'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'حداقل معدل مقطع تحصیلی قبلی باید ۷ از ۱۰ (بر اساس نظام نمره‌دهی رومانی) یا معادل آن باشد.' : 'The minimum GPA of the previous study level must be 7 out of 10 (based on the Romanian grading system) or its equivalent.'}</li>
            <li>{currentLang === 'fa' ? 'تحصیل در مقاطع کارشناسی و کارشناسی ارشد فقط به زبان رومانیایی است؛ برای افرادی که به این زبان مسلط نیستند، یک سال دوره آموزش رایگان زبان رومانیایی پیش از شروع دوره اصلی برگزار می‌شود. در مقطع دکتری امکان تحصیل به زبان انگلیسی یا سایر زبان‌های تعیین‌شده توسط دانشکده دکتری وجود دارد.' : 'Studies at the bachelor\'s and master\'s levels are exclusively in Romanian; for those not proficient in the language, a free one-year preparatory Romanian language course is provided before starting the main program. For doctoral studies, it is possible to study in English or other languages specified by the doctoral school.'}</li>
            <li>{currentLang === 'fa' ? 'رشته‌های پزشکی، دندانپزشکی و داروسازی از این برنامه مستثنا هستند.' : 'Medicine, dentistry, and pharmacy programs are excluded from this scholarship.'}</li>
            <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
            <span>{currentLang === 'fa' ? 'نحوه و بازه زمانی ثبت‌نام' : 'Application Process and Timeline'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'ثبت‌نام صرفاً از طریق پلتفرم رسمی Study in Romania (scholarships.studyinromania.gov.ro) امکان‌پذیر است؛ ارسال مدارک مستقیم به وزارتخانه‌ها یا سفارت‌ها بررسی نمی‌شود.' : 'Applications can only be submitted through the official Study in Romania platform (scholarships.studyinromania.gov.ro); documents sent directly to ministries or embassies will not be considered.'}</li>
            <li>{currentLang === 'fa' ? 'بازه ثبت‌نام و اعلام نتایج هرساله توسط وزارت امور خارجه رومانی به‌روزرسانی می‌شود؛ برای تاریخ‌های دقیق دوره جاری باید به همان پلتفرم رسمی مراجعه شود.' : 'The application and results timeline is updated annually by the Romanian Ministry of Foreign Affairs; for exact dates of the current cycle, refer to the official platform.'}</li>
            <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
          </ul>
        </div>
      </div>

      {/* CONFIRMED 2026-2027 CYCLE STATUS */}
      <div className="bg-[#071B3D] text-white rounded-2xl p-6 sm:p-8 space-y-3">
        <h3 className="text-lg sm:text-xl font-extrabold flex items-center space-x-2 rtl:space-x-reverse">
          <span>✅</span>
          <span>{currentLang === 'fa' ? 'وضعیت تایید‌شده چرخه ۲۰۲۶-۲۰۲۷' : 'Confirmed 2026-2027 Cycle Status'}</span>
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {currentLang === 'fa'
            ? 'طبق صفحه رسمی برنامه (scholarships.studyinromania.gov.ro)، این بورسیه برای چرخه تحصیلی ۲۰۲۶-۲۰۲۷ فعال بوده و بازه ثبت‌نام آن ۱۶ فوریه تا ۳۱ مارس ۲۰۲۶ اعلام شده بود. یک نکته مهم که کمتر جایی به آن اشاره می‌شود: پوشش خوابگاه «یارانه‌دار» است، نه لزوماً کاملاً رایگان — یعنی دانشجوی بورسیه بخشی از هزینه خوابگاه را با نرخ تخفیف‌دار خودش می‌پردازد، نه صفر مطلق. مبلغ دقیق کمک‌هزینه ماهانه (Stipend) به‌صورت رسمی روی همان صفحه اعلام نشده بود؛ ارقام غیررسمی که در برخی سایت‌های واسط دیده می‌شود را بدون تایید مستقیم از پلتفرم رسمی منتشر نکنید.'
            : 'Per the program\'s official page (scholarships.studyinromania.gov.ro), this scholarship was active for the 2026-2027 academic cycle, with an application window of February 16 to March 31, 2026. An important nuance rarely mentioned elsewhere: dormitory coverage is "subsidized," not necessarily fully free — the scholarship student still pays a discounted portion of the dorm fee, not zero. The exact monthly stipend amount was not officially published on that page; unofficial figures found on some third-party sites should not be treated as confirmed without checking the official platform directly.'}
        </p>
        <p className="text-[11px] text-slate-400">
          {currentLang === 'fa' ? 'منبع: scholarships.studyinromania.gov.ro/scholarship-about — این تاریخ‌ها مخصوص یک چرخه هستند و هرساله تغییر می‌کنند؛ برای فراخوان جاری همیشه همان صفحه رسمی را چک کنید.' : 'Source: scholarships.studyinromania.gov.ro/scholarship-about — these dates are cycle-specific and change every year; always check that official page for the current call.'}
        </p>
        <p className="text-sm text-amber-300 leading-relaxed border-t border-white/10 pt-3">
          {currentLang === 'fa'
            ? '⚠️ به‌روزرسانی: بازه بالا مربوط به چرخه ۲۰۲۶-۲۰۲۷ است و اکنون بسته شده (نتایج آن حدود میانه ژوئیه ۲۰۲۶ اعلام شد). تا لحظه انتشار این صفحه، تاریخ رسمی چرخهٔ بعدی هنوز روی پلتفرم منتشر نشده بود؛ بر اساس الگوی سال‌های قبل، فراخوان بعدی معمولاً حدود بهمن/فوریه شروع می‌شود، اما این فقط یک الگوی تقریبی است، نه تاریخ تایید‌شده — پیش از برنامه‌ریزی حتماً خودِ scholarships.studyinromania.gov.ro را برای اعلامیه رسمی چرخهٔ بعدی چک کنید.'
            : '⚠️ Update: the window above was for the 2026-2027 cycle and is now closed (results were announced around mid-July 2026). As of this page\'s publication, the next cycle\'s official dates had not yet been posted on the platform; based on the pattern of prior years, the next call typically opens around February, but that is only an approximate pattern, not a confirmed date — always check scholarships.studyinromania.gov.ro directly for the official announcement of the next cycle before planning around it.'}
        </p>
      </div>

      <ParentHubFooterCard slugRoute="study/scholarships" currentLang={currentLang} />
    </div>
  );
};
