'use client';

import React from 'react';
import { Language } from '../types';

interface WorkOverviewContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const WorkOverviewContent: React.FC<WorkOverviewContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  const sourceLine = (
    <div className="text-[11px] text-slate-400 mt-2">
      {currentLang === 'fa' 
        ? 'منبع: اداره کل مهاجرت رومانی (IGI) — igi.mai.gov.ro — آخرین بررسی: ۲۰۲۶'
        : 'Source: General Inspectorate for Immigration (IGI) — igi.mai.gov.ro — Last reviewed: 2026'}
    </div>
  );

  switch (subRoute) {
    case 'permit':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مجوز کار در رومانی (Aviz de Muncă)' : 'Work Permit (Aviz de Muncă)'}
            </h1>
            {sourceLine}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'نقش کارفرما' : 'Employer\'s Role'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'درخواست مجوز کار توسط کارفرمای رومانیایی نزد IGI ثبت می‌شود، نه خودِ متقاضی.' : 'The work permit application is submitted by the Romanian employer to IGI, not by the applicant.'}</li>
                <li>{currentLang === 'fa' ? 'معمولاً کارفرما باید نشان دهد این جایگاه شغلی توسط شهروند رومانی/اتحادیه اروپا/فضای اقتصادی اروپا پر نشده است.' : 'Generally, the employer must demonstrate that the position could not be filled by a Romanian/EU/EEA citizen.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'مدارک موردنیاز متقاضی' : 'Applicant\'s Required Documents'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'قرارداد کاری یا پیشنهاد رسمی استخدام.' : 'Employment contract or official job offer.'}</li>
                <li>{currentLang === 'fa' ? 'مدارک تحصیلی و/یا سوابق کاری مرتبط با جایگاه شغلی.' : 'Educational degrees and/or work experience relevant to the position.'}</li>
                <li>{currentLang === 'fa' ? 'گواهی عدم سوءپیشینه.' : 'Criminal record certificate.'}</li>
                <li>{currentLang === 'fa' ? 'مدرک تسلط به زبان (در صورت نیاز جایگاه شغلی).' : 'Proof of language proficiency (if required for the role).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'پس از صدور مجوز' : 'After Issuance'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'مجوز کار، پایه‌ی درخواست ویزای بلندمدت کاری (نوع D/AM) نزد سفارت رومانی است.' : 'The work permit serves as the basis for the long-stay work visa (Type D/AM) application at the Romanian embassy.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'visa':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ویزای بلندمدت کاری (D/AM)' : 'Long-Stay Work Visa (D/AM)'}
            </h1>
            {sourceLine}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'مراحل درخواست' : 'Application Process'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پس از دریافت مجوز کار توسط کارفرما، متقاضی می‌تواند برای ویزای بلندمدت کاری در سفارت/کنسولگری رومانی اقدام کند.' : 'After the employer obtains the work permit, the applicant can apply for the long-stay work visa at the Romanian embassy/consulate.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'پس از ورود به رومانی' : 'After Arrival in Romania'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'درخواست کارت اقامت موقت برای اشتغال نزد ادارات محلی IGI، حداقل ۳۰ روز قبل از پایان اعتبار حق اقامت اولیه.' : 'Apply for a temporary residence permit for employment at local IGI offices, at least 30 days before the initial right of stay expires.'}</li>
                <li>{currentLang === 'fa' ? 'رسیدگی معمولاً ظرف ۳۰ روز (قابل تمدید تا ۱۵ روز در صورت نیاز به بررسی بیشتر).' : 'Processing typically takes 30 days (extendable by up to 15 days for further checks).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'تغییر کارفرما' : 'Changing Employers'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تغییر کارفرما معمولاً نیازمند بازبینی یا صدور مجدد مجوز کار است.' : 'Changing employers usually requires a review or re-issuance of the work permit.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'find-job':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'پیدا کردن کار در رومانی' : 'Finding a Job in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: پورتال EURES اتحادیه اروپا، آژانس ملی استخدام رومانی (ANOFM) — آخرین بررسی: ۲۰۲۶'
                : 'Source: EU EURES Portal, National Agency for Employment (ANOFM) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'منابع رسمی کاریابی' : 'Official Job Search Resources'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پورتال EURES رومانی (eures.europa.eu / eures.anofm.ro)، بخشی از شبکه رسمی کاریابی اتحادیه اروپا، آگهی‌های تأییدشده را نمایش می‌دهد.' : 'The Romanian EURES portal (eures.europa.eu / eures.anofm.ro), part of the official EU employment network, displays verified job postings.'}</li>
                <li>{currentLang === 'fa' ? 'آژانس ملی استخدام رومانی (ANOFM، anofm.ro) زیر نظر وزارت کار رومانی فعالیت می‌کند و آگهی‌های داخلی کشور را منتشر می‌کند.' : 'The National Agency for Employment (ANOFM, anofm.ro) operates under the Romanian Ministry of Labor and publishes domestic job advertisements.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'شرایط برای اتباع خارج از اتحادیه اروپا' : 'Conditions for Non-EU Citizens'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'اتباع خارج از اتحادیه اروپا/منطقه اقتصادی اروپا برای اشتغال قانونی نیاز به ' : 'Non-EU/EEA citizens require a '}
                  <button onClick={() => onNavigate('work/permit')} className="text-[#2F6FED] font-medium hover:underline focus:outline-none">
                    {currentLang === 'fa' ? 'مجوز کار (Aviz de Muncă)' : 'Work Permit (Aviz de Muncă)'}
                  </button>
                  {currentLang === 'fa' ? ' دارند که باید توسط کارفرما از اداره کل مهاجرت (IGI) درخواست شود.' : ' for legal employment, which must be requested by the employer from the General Inspectorate for Immigration (IGI).'}
                </li>
                <li>{currentLang === 'fa' ? 'پیش‌نیاز شروع این فرآیند، داشتن پیشنهاد شغلی رسمی از یک کارفرمای ثبت‌شده در رومانی است.' : 'A prerequisite to initiating this process is having an official job offer from a registered employer in Romania.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکات عملی' : 'Practical Considerations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'حداقل حقوق قانونی رومانی: ۴,۳۲۵ لئو در ماه (حدود ۸۵۰ یورو)، معتبر از ۱ ژوئیه ۲۰۲۶ به بعد.' : 'Minimum legal salary in Romania: 4,325 RON per month (approx. €850), valid from July 1, 2026 onwards.'}</li>
                <li>{currentLang === 'fa' ? 'تسلط به زبان رومانیایی یا انگلیسی مزیت رقابتی مهمی در بازار کار محسوب می‌شود.' : 'Proficiency in Romanian or English is considered a significant competitive advantage in the job market.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    default: {
      const getTitle = () => {
        switch (subRoute) {
          case 'contract':
            return currentLang === 'fa' ? 'قرارداد استخدام در رومانی' : 'Employment Contract in Romania';
          case 'tax':
            return currentLang === 'fa' ? 'حقوق و مالیات کارمندان' : 'Employee Salary and Taxes';
          case 'insurance':
            return currentLang === 'fa' ? 'بیمه اجتماعی و درمانی' : 'Social and Health Insurance';
          default:
            return currentLang === 'fa' ? 'بخش کار' : 'Work Section';
        }
      };

      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {getTitle()}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' 
                ? 'محتوای این بخش در حال تکمیل است. برای اطلاعات فعلی درباره فرصت‌های شغلی و قوانین کار در رومانی، می‌توانید از طریق فرم ارزیابی رایگان با ما در تماس باشید.' 
                : 'This section is being completed. For current information on job opportunities and labor laws in Romania, please contact us through the free assessment form.'}
            </p>
          </div>
        </div>
      );
    }
  }
};
