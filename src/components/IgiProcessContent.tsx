'use client';

import React from 'react';
import { Language } from '../types';

interface IgiProcessContentProps {
  currentLang: Language;
}

export const IgiProcessContent: React.FC<IgiProcessContentProps> = ({ currentLang }) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {currentLang === 'fa' ? 'مراحل اقامت تحصیلی نزد اداره کل مهاجرت (IGI)' : 'Study Residence Process at the General Inspectorate for Immigration (IGI)'}
        </h1>
        <div className="text-[11px] text-slate-400 mt-2">
          {currentLang === 'fa' 
            ? 'منبع: اداره کل مهاجرت رومانی (IGI) — igi.mai.gov.ro — آخرین بررسی: ۲۰۲۶'
            : 'Source: General Inspectorate for Immigration (IGI) — igi.mai.gov.ro — Last reviewed: 2026'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
            <span>{currentLang === 'fa' ? 'ارزیابی اولیه مدارک' : 'Initial Document Evaluation'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'نامه پذیرش از وزارت آموزش رومانی الزامی است.' : 'Letter of acceptance from the Romanian Ministry of Education is mandatory.'}</li>
            <li>{currentLang === 'fa' ? 'رسید پرداخت حداقل یک سال شهریه.' : 'Proof of payment for at least one year of tuition.'}</li>
            <li>
              {currentLang === 'fa' ? 'مدرک تمکن مالی (حداقل معادل حداقل دستمزد ماهانه رومانی برای طول مدت روادید).' : 'Proof of financial means (at least equivalent to the national minimum gross salary for the visa duration).'}
              <br/><span className="text-[11px] italic text-slate-400">{disclaimer}</span>
            </li>
            <li>{currentLang === 'fa' ? 'گواهی عدم سوءپیشینه.' : 'Criminal record certificate.'}</li>
            <li>{currentLang === 'fa' ? 'بیمه درمانی معتبر.' : 'Valid medical insurance.'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
            <span>{currentLang === 'fa' ? 'صدور ویزای بلندمدت (نوع D/تحصیلی)' : 'Long-stay Visa Issuance (Type D/Study)'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>
              {currentLang === 'fa' ? 'هزینه: ۱۲۰ یورو، که در کشور محل اقامت متقاضی پرداخت می‌شود.' : 'Fee: €120, payable in the applicant’s country of residence.'}
              <br/><span className="text-[11px] italic text-slate-400">{disclaimer}</span>
            </li>
            <li>{currentLang === 'fa' ? 'نظر مثبت IGI ظرف ۳۰ روز صادر می‌شود (قابل تمدید تا ۱۵ روز دیگر در صورت نیاز).' : 'Positive IGI opinion is issued within 30 days (extendable by 15 days if necessary).'}</li>
            <li>{currentLang === 'fa' ? 'ویزا برای ۹۰ روز صادر می‌شود.' : 'The visa is granted for a duration of 90 days.'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
            <span>{currentLang === 'fa' ? 'درخواست کارت اقامت موقت' : 'Temporary Residence Permit Application'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'باید حداقل ۳۰ روز قبل از پایان اعتبار حق اقامت فعلی، در ادارات محلی IGI درخواست داده شود.' : 'Must be submitted to local IGI offices at least 30 days before the expiration of the current right of stay.'}</li>
            <li>{currentLang === 'fa' ? 'رسیدگی ظرف ۳۰ روز انجام می‌پذیرد (قابل تمدید تا ۱۵ روز در صورت نیاز به بررسی بیشتر).' : 'Processing takes 30 days (extendable by 15 days for further checks).'}</li>
            <li>
              {currentLang === 'fa' ? 'دانشجویان می‌توانند بدون نیاز به مجوز جداگانه کار، حداکثر ۴ ساعت در روز کار پاره‌وقت داشته باشند.' : 'Students may work part-time up to 4 hours per day without requiring a separate work permit.'}
              <br/><span className="text-[11px] italic text-slate-400">{disclaimer}</span>
            </li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
            <span>{currentLang === 'fa' ? 'ورود و صدور کارت اقامت' : 'Arrival and Permit Issuance'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'پس از ورود به رومانی، ثبت‌نام در دانشگاه و دریافت نهایی کارت اقامت از IGI انجام می‌پذیرد.' : 'Following arrival in Romania, complete university registration and collect the final residence permit from IGI.'}</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#eef3f8] p-6 rounded-2xl border border-[#dfe6ef] text-center max-w-3xl mx-auto">
        <h4 className="font-bold text-[#2F6FED] mb-2">{currentLang === 'fa' ? 'نکته مهم پس از فارغ‌التحصیلی' : 'Important Note Post-Graduation'}</h4>
        <p className="text-sm text-[#142033] font-medium leading-relaxed">
          {currentLang === 'fa' 
            ? 'پس از فارغ‌التحصیلی، امکان تمدید اقامت تا ۹ ماه برای جست‌وجوی کار یا راه‌اندازی کسب‌وکار وجود دارد.'
            : 'Upon graduation, it is possible to extend the residence permit for up to 9 months to search for employment or start a business.'}
        </p>
      </div>

    </div>
  );
};
