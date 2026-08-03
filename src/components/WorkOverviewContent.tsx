'use client';

import React from 'react';
import Link from 'next/link';
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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'فرآیند اخذ مجوز کار در رومانی (Aviz de Muncă) گام اصلی برای اشتغال قانونی اتباع خارج از اتحادیه اروپا در این کشور است. برخلاف تصور عمومی، این مجوز منحصراً توسط کارفرمای رومانیایی و از طریق اداره کل مهاجرت (IGI) درخواست می‌شود، نه توسط خود فرد متقاضی. این بدان معناست که پیش‌نیاز قطعی صدور مجوز کار، داشتن یک پیشنهاد شغلی رسمی و قطعی از یک شرکت ثبت‌شده در رومانی است که نتوانسته آن موقعیت را با شهروندان محلی یا اروپایی پر کند. دریافت این سند برای ورود به مراحل بعدی نظیر اخذ ویزای بلندمدت کاری ضروری است.'
              : 'Obtaining a work permit in Romania (Aviz de Muncă) is the primary step for non-EU citizens seeking legal employment. Contrary to popular belief, this permit is exclusively requested by the Romanian employer through the General Inspectorate for Immigration (IGI), not by the applicant. This means that having a confirmed official job offer from a registered Romanian company—which could not fill the position with local or EU citizens—is a strict prerequisite. Securing this document is essential before moving forward with a long-stay work visa application.'}
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم خودم مستقیماً برای مجوز کار درخواست دهم؟' : 'Can I apply for the work permit directly by myself?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. درخواست مجوز کار منحصراً باید توسط کارفرمای رومانیایی شما به اداره مهاجرت (IGI) ارائه شود.' : 'No. The work permit application must be submitted exclusively by your Romanian employer to IGI.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'بررسی درخواست مجوز چقدر طول می‌کشد؟' : 'How long does the permit application process take?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'این زمان بسته به حجم پرونده‌های IGI متغیر است، اما معمولاً رسیدگی به آن چند هفته تا چند ماه زمان می‌برد.' : 'The timeline varies depending on IGI\'s workload, but it typically takes from a few weeks to several months.'}</p>
              </div>
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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'ویزای بلندمدت کاری رومانی (نوع D/AM) مجوزی است که به شما اجازه می‌دهد برای ورود به خاک رومانی با هدف اشتغال اقدام کنید. این ویزا تنها پس از آنکه کارفرمای شما مجوز کار (Aviz de Muncă) را با موفقیت از مراجع ذی‌ربط دریافت کرد، در سفارت یا کنسولگری رومانی قابل درخواست است. پس از ورود به رومانی با استفاده از این ویزا، شما مهلت مشخصی دارید تا پیش از پایان اعتبار حق اقامت اولیه خود، نسبت به دریافت کارت اقامت موقت کاری از IGI اقدام نمایید؛ در غیر این صورت، حضور شما غیرقانونی تلقی خواهد شد.'
              : 'The Romanian long-stay work visa (Type D/AM) is the authorization allowing you to enter Romania for employment purposes. You can only apply for this visa at a Romanian embassy or consulate after your employer has successfully obtained your work permit (Aviz de Muncă). Once you enter Romania using this visa, you have a specific timeframe to apply for a temporary residence permit at IGI before your initial right of stay expires; otherwise, your presence will be considered illegal.'}
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا با ویزای D/AM می‌توانم کارفرمای خود را تغییر دهم؟' : 'Can I change employers with a D/AM visa?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'تغییر کارفرما معمولاً نیازمند طی کردن مجدد روند قانونی و صدور مجوز کار جدید توسط کارفرمای جدید است.' : 'Changing employers usually requires going through the legal process again and issuing a new work permit by the new employer.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چه زمانی باید برای کارت اقامت موقت اقدام کنم؟' : 'When should I apply for the temporary residence permit?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'شما موظفید حداقل ۳۰ روز پیش از به پایان رسیدن اعتبار ویزای نوع D خود، درخواست کارت اقامت را به IGI تحویل دهید.' : 'You must submit your temporary residence permit application to IGI at least 30 days before your Type D visa expires.'}</p>
              </div>
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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'پیدا کردن کار در رومانی برای ایرانیان و سایر اتباع غیراروپایی نیازمند شناخت دقیق از منابع رسمی و نیازمندی‌های بازار کار است. برای جستجوی موقعیت‌های معتبر، استفاده از پورتال‌های رسمی مانند پورتال EURES و آژانس ملی استخدام رومانی (ANOFM) توصیه می‌شود که آگهی‌های تأییدشده را نمایش می‌دهند. با توجه به الزامات سخت‌گیرانه دریافت مجوز کار، تمرکز بر تخصص‌هایی که در بازار محلی رومانی با کمبود نیروی کار مواجه‌اند و همچنین ارتقای مهارت در زبان انگلیسی یا رومانیایی، می‌تواند شانس یافتن کارفرمایی که مایل به انجام امور اداری جذب نیروی خارجی باشد را به میزان قابل‌توجهی افزایش دهد.'
              : 'Finding a job in Romania as a non-EU citizen requires a clear understanding of official resources and job market demands. To find legitimate opportunities, it is highly recommended to use official portals such as the EU EURES network and the Romanian National Agency for Employment (ANOFM), which display verified postings. Given the strict requirements for obtaining a work permit, focusing on specialized skills facing local shortages and improving your English or Romanian proficiency will significantly increase your chances of finding an employer willing to navigate the hiring process for foreigners.'}
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
                  <Link href="/work/permit" className="text-[#2F6FED] font-medium hover:underline focus:outline-none">
                    {currentLang === 'fa' ? 'مجوز کار (Aviz de Muncă)' : 'Work Permit (Aviz de Muncă)'}
                  </Link>
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'حداقل حقوق قانونی در رومانی چقدر است؟' : 'What is the minimum legal salary in Romania?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بر اساس نرخ تعیین شده، حداقل حقوق ناخالص ۴,۳۲۵ لئو در ماه است که از ۱ ژوئیه ۲۰۲۶ در رومانی اعمال می‌شود.' : 'Based on the set rate, the minimum gross salary is 4,325 RON per month, applicable from July 1, 2026, in Romania.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا دانستن زبان رومانیایی برای استخدام الزامی است؟' : 'Is knowing the Romanian language mandatory for employment?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'اگرچه برای بسیاری از مشاغل بین‌المللی و شرکت‌های چندملیتی تسلط به زبان انگلیسی کافیست، اما دانستن زبان رومانیایی مزیت رقابتی بسیار بزرگی در کاریابی محسوب می‌شود.' : 'While English is sufficient for many international roles and multinational companies, proficiency in Romanian is a massive competitive advantage in finding a job.'}</p>
              </div>
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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'قرارداد استخدام در رومانی سند اصلی و رسمی است که حقوق، وظایف و شرایط کاری شما را تضمین می‌کند. بر اساس قانون کار رومانی (Codul Muncii)، هرگونه فعالیت کاری باید بر پایه یک قرارداد کتبی و رسمی استوار باشد که پیش از آغاز کار در سامانه ملی ثبت کارکنان (REVISAL) درج شده باشد. این قراردادها معمولاً شامل یک دوره آزمایشی مشخص (Perioada de Probă) هستند که طی آن هر دو طرف می‌توانند تناسب شغلی را ارزیابی کنند. نظارت بر اجرای صحیح این قراردادها مستقیماً بر عهده نهادی به نام بازرسی کار رومانی (Inspecția Muncii) است که از حقوق نیروی کار داخلی و خارجی محافظت می‌کند.'
              : 'An employment contract in Romania is the fundamental official document that guarantees your rights, duties, and working conditions. Based on the Romanian Labor Code (Codul Muncii), any employment activity must be founded on a formal written contract registered in the National Register of Employees (REVISAL) before work begins. These contracts typically include a designated probationary period (Perioada de Probă) allowing both parties to evaluate the occupational fit. The proper execution of these contracts is strictly overseen by the Romanian Labor Inspection (Inspecția Muncii), which protects the rights of both domestic and foreign workers.'}
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا قرارداد کاری می‌تواند بیش از یک دوره آزمایشی داشته باشد؟' : 'Can an employment contract have more than one probationary period?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'اصولاً فقط یک دوره آزمایشی مجاز است، مگر در موارد خاص مانند ارتقاء شغلی یا تغییر سمت نزد همان کارفرما.' : 'Generally, only one probationary period is permitted, except in special cases like a promotion or changing positions with the same employer.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر شرایط کارم تغییر کند چه اتفاقی می‌افتد؟' : 'What happens if my working conditions change?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'هرگونه تغییر در حقوق و دستمزد یا شرایط اصلی کار باید از طریق ثبت و امضای یک الحاقیه رسمی (act adițional) انجام شود.' : 'Any changes to your salary or main working conditions must be recorded and signed through a formal addendum (act adițional).'}</p>
              </div>
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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'سیستم پرداخت حقوق و مالیات بر درآمد در رومانی بر پایه کسر مستقیم از مبدأ بنا شده است؛ به این معنا که کارفرما موظف است تمام کسورات قانونی اعم از مالیات بر درآمد و حق بیمه‌های سلامت و بازنشستگی را پیش از واریز حقوق، محاسبه و مستقیماً به سازمان امور مالیاتی رومانی (ANAF) پرداخت کند. حقوقی که در قرارداد کار ذکر می‌شود، در واقع حقوق ناخالص (Salariu Brut) است، اما مبلغ نهایی که به حساب بانکی شما واریز می‌گردد، حقوق خالص (Net) خواهد بود. درک این تفاوت و آگاهی از سهم بیمه‌ها برای برنامه‌ریزی مالی هر فرد شاغل در رومانی از اهمیت بالایی برخوردار است.'
              : 'The salary and income tax system in Romania operates on a direct withholding basis; meaning the employer is obligated to calculate and pay all statutory deductions—including income tax, health, and pension insurance contributions—directly to the National Agency for Fiscal Administration (ANAF) before transferring your pay. The salary stated in your employment contract is actually the gross salary (Salariu Brut), while the final amount deposited into your bank account is the net salary (Net). Understanding this difference and the exact contribution rates is crucial for the financial planning of anyone working in Romania.'}
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'تفاوت حقوق ناخالص و خالص چقدر است؟' : 'What is the difference between gross and net salary?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'پس از کسر مالیات و بیمه‌های اجباری، حقوق خالصی که دریافت می‌کنید معمولاً حدود ۵۷ تا ۶۰ درصد حقوق ناخالص قرارداد شما خواهد بود.' : 'After mandatory tax and insurance deductions, the net salary you receive is typically around 57% to 60% of your gross contract salary.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا کارمند باید مالیات خود را جداگانه به دولت بپردازد؟' : 'Does the employee have to pay their taxes separately to the government?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، نیازی به پرداخت جداگانه نیست؛ تمام کسورات قانونی برای کارمندان مستقیماً توسط کارفرما محاسبه، کسر و به اداره مالیات پرداخت می‌شود.' : 'No, separate payment is not required; all statutory deductions for employees are calculated, withheld, and paid directly to the tax authorities by the employer.'}</p>
              </div>
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

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'نظام بیمه سلامت و بازنشستگی در رومانی، چتر حمایتی جامعی برای نیروی کار شاغل در این کشور فراهم می‌کند. هر فردی که با یک قرارداد رسمی در رومانی مشغول به کار است، با کسر خودکار سهم بیمه سلامت (CASS) و سهم بیمه بازنشستگی (CAS) از حقوق ماهیانه‌اش، تحت پوشش بیمه عمومی دولت (مجموعه‌های CNAS و CNPP) قرار می‌گیرد. با داشتن این بیمه و دریافت کارت ملی بیمه سلامت، کارمندان خارجی نیز درست همانند شهروندان رومانیایی حق دسترسی مستقیم به خدمات درمانی عمومی را پیدا می‌کنند و سوابق بازنشستگی آن‌ها به‌صورت رسمی و قانونی ثبت می‌شود.'
              : 'The health and pension insurance system in Romania provides a comprehensive safety net for the workforce in the country. Anyone legally employed in Romania with a formal contract automatically falls under the coverage of the state public insurance network (CNAS and CNPP authorities) through mandatory monthly salary deductions for health (CASS) and pension (CAS). By contributing to this system and obtaining the National Health Insurance Card, foreign employees gain the exact same right to directly access public medical services as Romanian citizens, while their pension history is officially and legally recorded.'}
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

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا دریافت خدمات درمانی با بیمه کارمندی رایگان است؟' : 'Are medical services free with employee health insurance?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'در بیمارستان‌ها و کلینیک‌های دولتی یا خصوصیِ طرف قرارداد با CNAS، خدمات پایه و اورژانسی عموماً رایگان یا با پوشش بسیار بالایی ارائه می‌شوند.' : 'In public hospitals and private clinics contracted with CNAS, basic and emergency services are generally free or highly subsidized.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر کارمند نباشم، آیا می‌توانم بیمه دولتی داشته باشم؟' : 'Can I get state insurance if I am not an employee?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، افراد بدون قرارداد کاری نیز می‌توانند از طریق ارسال اظهارنامه واحد (Declarația Unică) و پرداخت حق بیمه معادل، به‌صورت داوطلبانه خود را بیمه کنند.' : 'Yes, non-employees can voluntarily enroll in the health insurance system by submitting the Single Declaration (Declarația Unică) and paying the equivalent premium.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'کار و اشتغال در رومانی' : 'Work in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' 
                ? 'راهنمای بازار کار، قوانین اشتغال، ویزای کار و شرایط اخذ مجوز کار در رومانی.' 
                : 'Guide to the job market, employment laws, work visas, and work permit conditions in Romania.'}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? 'مسیرهای اشتغال' : 'Employment Pathways'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/work/finding-job" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'پیدا کردن کار' : 'Finding a Job'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'سایت‌های کاریابی و نگارش رزومه استاندارد' : 'Job portals and standard CV writing'}</p>
              </Link>
              <Link href="/work/work-permit" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'مجوز کار' : 'Work Permit'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'فرآیند دریافت Aviz de Munca توسط کارفرما' : 'The process for employers to get Aviz de Munca'}</p>
              </Link>
              <Link href="/work/work-visa" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'ویزای کاری' : 'Work Visa'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'اقدام برای ویزای نوع D/AM پس از دریافت مجوز' : 'Applying for the D/AM visa after permit approval'}</p>
              </Link>
              <Link href="/work/employment-contract" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'قرارداد استخدام' : 'Employment Contract'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'انواع قرارداد کاری و حقوق کارمند' : 'Types of contracts and employee rights'}</p>
              </Link>
              <Link href="/work/taxes-salaries" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'حقوق و مالیات' : 'Taxes & Salaries'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'نحوه محاسبه حقوق خالص و کسورات قانونی' : 'Calculating net salary and legal deductions'}</p>
              </Link>
              <Link href="/work/insurance" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'بیمه' : 'Insurance'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'پوشش بیمه تامین اجتماعی و درمانی' : 'Social and health insurance coverage'}</p>
              </Link>
            </div>
          </div>
        </div>
      );
  }
};
