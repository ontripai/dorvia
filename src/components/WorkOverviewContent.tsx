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

    case 'contract':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'قرارداد استخدام در رومانی' : 'Employment Contract in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: قانون کار رومانی (Legea 53/2003)، بازرسی کار رومانی (Inspecţia Muncii، inspectiamuncii.ro) — آخرین بررسی: ۲۰۲۶'
                : 'Source: Romanian Labor Code (Legea 53/2003), Romanian Labor Inspection (Inspecţia Muncii, inspectiamuncii.ro) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'الزامات قانونی قرارداد' : 'Legal Contract Requirements'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'طبق قانون کار رومانی (Legea 53/2003 – Codul Muncii)، هر قرارداد استخدام باید پیش از شروع فعالیت در سامانه ملی ثبت کارکنان (Registrul General de Evidenţă a Salariaţilor / REVISAL) ثبت شود.' : 'According to the Romanian Labor Code (Legea 53/2003 – Codul Muncii), every employment contract must be registered in the National Register of Employees (Registrul General de Evidenţă a Salariaţilor / REVISAL) prior to starting work.'}</li>
                <li>{currentLang === 'fa' ? 'کارفرما موظف است پیش از شروع کار، یک نسخه از قرارداد را به کارمند تحویل دهد.' : 'The employer is obligated to provide the employee with a copy of the contract before they commence work.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'دوره آزمایشی (Perioada de Probă)' : 'Probationary Period (Perioada de Probă)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'در طول یک قرارداد استخدام، فقط یک دوره آزمایشی مجاز است، مگر در موارد استثنا (مثل شروع در سمت یا حرفه جدید نزد همان کارفرما، یا مشاغل با شرایط سخت/مضر/خطرناک).' : 'During an employment contract, only one probationary period is permitted, except in special cases (such as starting a new position/profession with the same employer, or jobs with difficult/harmful/dangerous conditions).'}</li>
                <li>{currentLang === 'fa' ? 'دوره آزمایشی به‌عنوان سابقه کار محسوب می‌شود.' : 'The probationary period is counted as official employment history.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نظارت و مرجع رسمی' : 'Supervision and Official Authority'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بازرسی کار رومانی (Inspecţia Muncii) و ادارات منطقه‌ای آن (Inspectoratul Teritorial de Muncă) مرجع رسمی نظارت بر اجرای صحیح قراردادهای کار هستند.' : 'The Romanian Labor Inspection (Inspecţia Muncii) and its regional offices (Inspectoratul Teritorial de Muncă) are the official authorities overseeing the proper execution of labor contracts.'}</li>
                <li>{currentLang === 'fa' ? 'هرگونه تغییر در بندهای قرارداد در طول اجرای آن نیاز به الحاقیه رسمی (act adiţional) دارد، مگر در مواردی که قانون صراحتاً استثنا کرده باشد.' : 'Any modification to contract clauses during its execution requires a formal addendum (act adiţional), unless the law explicitly provides an exception.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'tax':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'حقوق و مالیات' : 'Salary and Taxes'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: سازمان امور مالیاتی رومانی (ANAF)، قانون مالیاتی رومانی (Codul Fiscal) — آخرین بررسی: ۲۰۲۶'
                : 'Source: Romanian National Agency for Fiscal Administration (ANAF), Romanian Fiscal Code (Codul Fiscal) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'کسورات قانونی از حقوق' : 'Statutory Salary Deductions'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'از حقوق ناخالص (Salariu Brut) هر کارمند سه کسر اجباری انجام می‌شود: مالیات بر درآمد ۱۰٪، سهم بازنشستگی (CAS) ۲۵٪، و سهم بیمه سلامت (CASS) ۱۰٪.' : 'Three mandatory deductions are made from each employee\'s gross salary (Salariu Brut): 10% income tax, 25% pension contribution (CAS), and 10% health insurance contribution (CASS).'}</li>
                <li>{currentLang === 'fa' ? 'این کسورات توسط کارفرما محاسبه و مستقیماً به سازمان امور مالیاتی (ANAF) پرداخت می‌شود؛ کارمند حقوق خالص (Net) را دریافت می‌کند.' : 'These deductions are calculated by the employer and paid directly to the National Agency for Fiscal Administration (ANAF); the employee receives the net salary (Net).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'سهم کارفرما' : 'Employer Contributions'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'علاوه بر کسورات کارمند، کارفرما موظف است سهم بیمه کار (CAM) به میزان ۲.۲۵٪ روی حقوق ناخالص بپردازد که صرف بیمه بیکاری و حوادث کاری می‌شود.' : 'In addition to employee deductions, the employer is obligated to pay a 2.25% work insurance contribution (CAM) on the gross salary, covering unemployment and workplace accidents.'}</li>
                <li>{currentLang === 'fa' ? 'حقوق خالص معمولاً حدود ۵۷ تا ۶۰ درصد حقوق ناخالص است.' : 'The net salary is typically around 57 to 60 percent of the gross salary.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'تکالیف اظهارنامه' : 'Declaration Obligations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'کارفرما موظف است هرماه اظهارنامه ۱۱۲ (Declarația 112) شامل کسورات و بیمه کارکنان را به‌صورت الکترونیکی به ANAF ارسال کند.' : 'The employer must electronically submit Declaration 112 (Declarația 112), detailing employee deductions and insurance, to ANAF on a monthly basis.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'insurance':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'بیمه' : 'Insurance'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: سازمان ملی بیمه سلامت رومانی (CNAS)، سازمان ملی بازنشستگی عمومی (CNPP) — آخرین بررسی: ۲۰۲۶'
                : 'Source: National Health Insurance House (CNAS), National Public Pension House (CNPP) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'بیمه سلامت خودکار' : 'Automatic Health Insurance'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'هر فردی که در رومانی به‌صورت قانونی استخدام باشد و سهم CASS از حقوقش کسر شود، به‌طور خودکار تحت پوشش بیمه سلامت عمومی (Casa Națională de Asigurări de Sănătate / CNAS) قرار می‌گیرد.' : 'Anyone legally employed in Romania with the CASS contribution deducted from their salary is automatically covered by the public health insurance system (Casa Națională de Asigurări de Sănătate / CNAS).'}</li>
                <li>{currentLang === 'fa' ? 'کارت ملی بیمه سلامت (Cardul Național de Asigurări de Sănătate) برای دریافت خدمات درمانی در مراکز طرف‌قرارداد استفاده می‌شود.' : 'The National Health Insurance Card (Cardul Național de Asigurări de Sănătate) is used to access medical services at contracted facilities.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'بیمه بازنشستگی' : 'Pension Insurance'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'سهم CAS کسرشده از حقوق به صندوق ملی بازنشستگی عمومی (Casa Națională de Pensii Publice / CNPP) واریز می‌شود و سابقه بیمه بازنشستگی فرد را می‌سازد.' : 'The CAS contribution deducted from the salary is deposited into the National Public Pension House (Casa Națională de Pensii Publice / CNPP), building the individual\'s pension history.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'وضعیت افراد بدون قرارداد کاری' : 'Status of Non-Employees'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'افرادی که کارمند نیستند نیز می‌توانند با ارائه اظهارنامه واحد (Declarația Unică / فرم D212) به‌صورت داوطلبانه در سیستم بیمه سلامت ثبت‌نام کنند.' : 'Non-employees can also voluntarily enroll in the health insurance system by submitting the Single Declaration (Declarația Unică / Form D212).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    default: {
      const getTitle = () => {
        switch (subRoute) {
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
