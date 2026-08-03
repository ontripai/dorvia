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
          {currentLang === 'fa' ? 'مراحل اقامت نزد اداره کل مهاجرت (IGI)' : 'Residence Process at the General Inspectorate for Immigration (IGI)'}
        </h1>
        <div className="text-[11px] text-slate-400 mt-2">
          {currentLang === 'fa' 
            ? 'منبع: اداره کل مهاجرت رومانی (IGI) — igi.mai.gov.ro — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
            : 'Source: General Inspectorate for Immigration (IGI) — igi.mai.gov.ro — Last reviewed: August 2026'}
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
        {currentLang === 'fa' 
          ? 'اداره کل مهاجرت رومانی (IGI) نهاد مرجع برای بررسی و صدور کارت اقامت تمامی اتباع خارجی در رومانی است. برای متقاضیانی که از طریق تحصیلی، کاری یا سایر روش‌ها وارد رومانی می‌شوند، طی کردن مراحل اداری در این نهاد، پس از ورود با ویزای معتبر (مانند ویزای نوع D)، الزامی است. این مراحل شامل ارزیابی دقیق مدارک شناسایی، مالی و اثبات هدف اقامت است و منجر به صدور کارت اقامت موقت می‌گردد. آشنایی با روند کاری IGI و آماده‌سازی کامل مدارک پیش از مراجعه، می‌تواند از تأخیرهای قانونی و بروز مشکلات اقامتی جلوگیری کند.'
          : 'The General Inspectorate for Immigration (IGI) is the primary authority responsible for processing and issuing residence permits to all foreign nationals in Romania. For applicants entering Romania for studies, work, or other purposes, completing the administrative procedures at this institution after arriving with a valid visa (such as Type D) is mandatory. These steps involve a thorough evaluation of identification, financial documents, and proof of the purpose of stay, ultimately leading to the issuance of a temporary residence permit. Familiarity with IGI\'s workflow and preparing complete documentation beforehand can prevent legal delays and residency issues.'}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
            <span>{currentLang === 'fa' ? 'ارزیابی اولیه مدارک (نمونه تحصیلی)' : 'Initial Document Evaluation (Study Example)'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'نامه پذیرش از نهاد مربوطه (مانند وزارت آموزش) الزامی است.' : 'Letter of acceptance from the relevant institution (e.g., Ministry of Education) is mandatory.'}</li>
            <li>{currentLang === 'fa' ? 'رسید پرداخت هزینه‌های مرتبط (مثل شهریه یا عوارض).' : 'Proof of payment for related fees (e.g., tuition or taxes).'}</li>
            <li>
              {currentLang === 'fa' ? 'مدرک تمکن مالی (حداقل معادل حداقل دستمزد ماهانه رومانی برای طول مدت روادید).' : 'Proof of financial means (at least equivalent to the national minimum gross salary for the visa duration).'}
              <br/><span className="text-[11px] italic text-slate-400">{disclaimer}</span>
            </li>
            <li>{currentLang === 'fa' ? 'گواهی عدم سوءپیشینه و بیمه درمانی معتبر.' : 'Criminal record certificate and valid medical insurance.'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
            <span>{currentLang === 'fa' ? 'صدور ویزای بلندمدت (نوع D)' : 'Long-stay Visa Issuance (Type D)'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>
              {currentLang === 'fa' ? 'هزینه ویزا معمولاً ۱۲۰ یورو است که در کشور مبدأ پرداخت می‌شود.' : 'The visa fee is usually €120, payable in the country of origin.'}
              <br/><span className="text-[11px] italic text-slate-400">{disclaimer}</span>
            </li>
            <li>{currentLang === 'fa' ? 'نظر مثبت IGI معمولاً ظرف ۳۰ تا ۴۵ روز صادر می‌شود.' : 'Positive IGI opinion is usually issued within 30 to 45 days.'}</li>
            <li>{currentLang === 'fa' ? 'ویزا معمولاً برای اقامت اولیه ۹۰ روزه صادر می‌شود.' : 'The visa is typically granted for an initial 90-day stay.'}</li>
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
            <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
            <span>{currentLang === 'fa' ? 'ورود و صدور کارت اقامت' : 'Arrival and Permit Issuance'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'پس از ورود به رومانی، ثبت‌نام در نهاد مربوطه و دریافت نهایی کارت اقامت از IGI انجام می‌پذیرد.' : 'Following arrival in Romania, complete the relevant registration and collect the final residence permit from IGI.'}</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#eef3f8] p-6 rounded-2xl border border-[#dfe6ef] text-center max-w-3xl mx-auto">
        <h4 className="font-bold text-[#2F6FED] mb-2">{currentLang === 'fa' ? 'نکته مهم پس از فارغ‌التحصیلی' : 'Important Note Post-Graduation'}</h4>
        <p className="text-sm text-[#142033] font-medium leading-relaxed">
          {currentLang === 'fa' 
            ? 'دانشجویان پس از فارغ‌التحصیلی، امکان تمدید اقامت تا ۹ ماه را برای جست‌وجوی کار یا راه‌اندازی کسب‌وکار دارند.'
            : 'Upon graduation, students have the possibility to extend their residence permit for up to 9 months to search for employment or start a business.'}
        </p>
      </div>

      <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
        <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
          {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چه زمانی باید به IGI مراجعه کنم؟' : 'When should I visit IGI?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'شما باید حداقل ۳۰ روز پیش از انقضای اعتبار ویزای فعلی خود (مثلاً ویزای نوع D)، درخواست صدور کارت اقامت موقت را در شعبه محلی IGI ثبت کنید.' : 'You must submit your temporary residence permit application at the local IGI branch at least 30 days before your current visa (e.g., Type D) expires.'}</p>
          </div>
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'بررسی درخواست اقامت من چقدر طول می‌کشد؟' : 'How long does it take to process my residence application?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق قانون، بررسی درخواست معمولاً تا ۳۰ روز زمان می‌برد که در صورت نیاز به بررسی‌های بیشتر از سوی اداره مهاجرت، این مدت تا ۱۵ روز دیگر قابل تمدید است.' : 'Legally, the evaluation typically takes up to 30 days, which can be extended by another 15 days if further checks are required by the immigration office.'}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
