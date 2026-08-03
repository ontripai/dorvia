'use client';

import React from 'react';
import { Language } from '../types';

interface PreparatoryYearContentProps {
  currentLang: Language;
}

export const PreparatoryYearContent: React.FC<PreparatoryYearContentProps> = ({ currentLang }) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {currentLang === 'fa' ? 'سال آماده‌سازی زبان رومانیایی' : 'Romanian Language Preparatory Year'}
        </h1>
        <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
          {currentLang === 'fa' 
            ? 'برای دانشجویانی که قصد تحصیل به زبان رومانیایی دارند یا سطح زبانشان برای ورود مستقیم کافی نیست، دانشگاه‌های رومانی یک سال آماده‌سازی زبان پیش از شروع رشته اصلی ارائه می‌دهند. برای هزینه دقیق این دوره به سایت دانشگاه مورد نظر مراجعه کنید.'
            : 'For students intending to study in Romanian or those lacking sufficient language proficiency for direct entry, Romanian universities offer a language preparatory year prior to starting the main degree program. For the exact cost of this course, please visit the specific university\'s website.'}
        </p>
        <div className="text-[11px] text-slate-400 mt-2">
          {currentLang === 'fa' 
            ? 'منبع: دانشگاه بخارست (international.unibuc.ro) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
            : 'Source: University of Bucharest (international.unibuc.ro) — Last reviewed: August 2026'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
            <span>{currentLang === 'fa' ? 'برای چه کسانی مناسب است' : 'Who is it for'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'متقاضیانی که می‌خواهند به زبان رومانیایی (نه انگلیسی یا فرانسوی) تحصیل کنند.' : 'Applicants wishing to study in Romanian (instead of English or French).'}</li>
            <li>{currentLang === 'fa' ? 'متقاضیانی که مدرک زبان معتبر (مثل IELTS/TOEFL برای برنامه‌های انگلیسی) ندارند.' : 'Applicants without a recognized language certificate (such as IELTS/TOEFL for English programs).'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
            <span>{currentLang === 'fa' ? 'ساختار دوره' : 'Course Structure'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'معمولاً یک سال تحصیلی، با تمرکز بر آموزش زبان و اصطلاحات تخصصی رشته مورد نظر است.' : 'Typically one academic year, focusing on language instruction and specialized terminology for the chosen field.'}</li>
            <li>{currentLang === 'fa' ? 'در پایان دوره آزمون سطح زبان برگزار می‌شود.' : 'A language proficiency exam is held at the end of the course.'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
            <span>{currentLang === 'fa' ? 'پس از اتمام دوره' : 'After Completion'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'قبولی در آزمون پایان دوره، مسیر ورود به رشته اصلی (کارشناسی، ارشد یا دکتری) را باز می‌کند.' : 'Passing the final exam opens the pathway to the main degree program (Bachelor\'s, Master\'s, or PhD).'}</li>
            <li>
              <span className="text-[11px] italic text-slate-400">{disclaimer}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
