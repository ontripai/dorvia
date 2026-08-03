'use client';

import React from 'react';
import { Language } from '../types';

interface ScholarshipOverviewContentProps {
  currentLang: Language;
}

export const ScholarshipOverviewContent: React.FC<ScholarshipOverviewContentProps> = ({ currentLang }) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {currentLang === 'fa' ? 'بورسیه تحصیلی دولت رومانی' : 'Romanian Government Scholarship'}
        </h1>
        <div className="text-[11px] text-slate-400 mt-2">
          {currentLang === 'fa' 
            ? 'منبع: وزارت امور خارجه رومانی، پلتفرم رسمی Study in Romania (studyinromania.gov.ro) — آخرین بررسی: ۲۰۲۶'
            : 'Source: Romanian Ministry of Foreign Affairs, Official Study in Romania Platform (studyinromania.gov.ro) — Last reviewed: 2026'}
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
            <li>{currentLang === 'fa' ? 'این بورسیه شامل معافیت کامل از شهریه و هزینه ثبت‌نام، کمک‌هزینه ماهانه، و اقامتگاه دانشجویی (در صورت وجود ظرفیت) است.' : 'This scholarship includes a full waiver of tuition and registration fees, a monthly stipend, and student accommodation (subject to availability).'}</li>
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
    </div>
  );
};
