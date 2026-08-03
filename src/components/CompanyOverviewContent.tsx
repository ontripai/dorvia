'use client';

import React from 'react';
import { Language } from '../types';

interface CompanyOverviewContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const CompanyOverviewContent: React.FC<CompanyOverviewContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  switch (subRoute) {
    case 'registration':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مراحل ثبت شرکت SRL در رومانی' : 'SRL Company Registration Steps in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره ثبت شرکت‌های رومانی (ONRC) — onrc.ro — آخرین بررسی: ۲۰۲۶'
                : 'Source: Romanian National Trade Register Office (ONRC) — onrc.ro — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'آماده‌سازی مقدماتی' : 'Preliminary Preparation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رزرو نام شرکت نزد اداره ثبت شرکت‌ها (ONRC).' : 'Reserving the company name with the Trade Register (ONRC).'}</li>
                <li>{currentLang === 'fa' ? 'تعیین آدرس دفتر ثبت‌شده (سدیو سوشیال / sediu social).' : 'Establishing the registered office address (sediu social).'}</li>
                <li>{currentLang === 'fa' ? 'تدوین اساسنامه شرکت (act constitutiv).' : 'Drafting the Articles of Association (act constitutiv).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'مدارک برای شهروندان غیر اتحادیه اروپا' : 'Documents for Non-EU Citizens'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'غیر اتحادیه‌ای‌ها می‌توانند سهامدار و مدیرعامل باشند.' : 'Non-EU citizens can act as shareholders and directors.'}</li>
                <li>{currentLang === 'fa' ? 'مدارک هویتی باید ترجمه رسمی و تأییدشده (آپوستیل یا تأییدیه سفارت) داشته باشند.' : 'Identity documents must be officially translated and certified (Apostille or embassy legalization).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'ثبت نهایی' : 'Final Registration'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ارسال پرونده به ONRC، معمولاً از طریق پلتفرم دیجیتال با امضای الکترونیکی معتبر.' : 'Submitting the file to ONRC, usually via the digital platform with a valid electronic signature.'}</li>
                <li>{currentLang === 'fa' ? 'پس از تأیید، شرکت رسمی ثبت و کد مالیاتی صادر می‌شود.' : 'Upon approval, the company is officially registered and the tax code is issued.'}</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'tax-types':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'نرخ‌های مالیاتی شرکت‌های کوچک در رومانی' : 'Small Business Tax Rates in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: قانون مالیاتی رومانی، سازمان امور مالیاتی (ANAF) — آخرین بررسی: ۲۰۲۶'
                : 'Source: Romanian Tax Code, National Agency for Fiscal Administration (ANAF) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'مالیات ۱٪ بر درآمد (میکرو-شرکت)' : '1% Income Tax (Micro-Enterprise)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'فقط برای شرکت‌هایی با گردش مالی سالانه زیر ۱۰۰,۰۰۰ یورو و حداقل یک کارمند تمام‌وقت.' : 'Only for companies with an annual turnover under €100,000 and at least one full-time employee.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'مالیات ۱۶٪ بر سود شرکتی' : '16% Corporate Profit Tax'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'برای شرکت‌هایی که از سقف ۱۰۰,۰۰۰ یورو گردش مالی عبور کنند، از همان فصل مالی نرخ ۱۶٪ اعمال می‌شود.' : 'For companies exceeding the €100,000 turnover threshold, the 16% rate applies from the same fiscal quarter.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'سایر مالیات‌ها' : 'Other Taxes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'مالیات بر ارزش افزوده (VAT) برای شرکت‌های بالای آستانه معین.' : 'Value Added Tax (VAT) for companies exceeding the designated threshold.'}</li>
                <li>{currentLang === 'fa' ? 'سهم بیمه‌های اجتماعی کارفرما در صورت داشتن کارمند.' : 'Employer\'s social security contributions if employing staff.'}</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'bank-account':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'افتتاح حساب بانکی برای شرکت در رومانی' : 'Opening a Corporate Bank Account in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'این بخش راهنمای عمومی است؛ شرایط دقیق هر بانک باید مستقیماً از آن بانک استعلام شود.'
                : 'This section is a general guide; exact conditions should be verified directly with each respective bank.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'مدارک لازم' : 'Required Documents'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'مدارک ثبت شرکت (از ONRC).' : 'Company registration documents (from ONRC).'}</li>
                <li>{currentLang === 'fa' ? 'مدرک هویت مدیرعامل/سهامدار.' : 'Identity document of the director/shareholder.'}</li>
                <li>{currentLang === 'fa' ? 'در برخی بانک‌ها ممکن است حضور فیزیکی مدیرعامل لازم باشد.' : 'Some banks may require the physical presence of the director.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'نکات عملی' : 'Practical Considerations'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'انتخاب بانک بر اساس نیاز به خدمات بین‌المللی (کارت‌های ارزی، انتقال وجه بین‌المللی).' : 'Choosing a bank based on international service needs (foreign currency cards, international wire transfers).'}</li>
                <li>{currentLang === 'fa' ? 'برخی بانک‌ها امکان افتتاح آنلاین برای اتباع خارجی محدود ارائه می‌دهند.' : 'Some banks offer limited online account opening options for foreign nationals.'}</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'residency':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'اقامت برای مدیرعامل و سهامدار شرکت' : 'Residency for Company Director and Shareholder'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره کل مهاجرت رومانی (IGI) — igi.mai.gov.ro — آخرین بررسی: ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI) — igi.mai.gov.ro — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'نکته مهم' : 'Important Note'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ثبت شرکت به‌تنهایی اقامت نمی‌دهد.' : 'Registering a company alone does not grant residency.'}</li>
                <li>{currentLang === 'fa' ? 'نیاز به درخواست جداگانه اقامت برای فعالیت تجاری نزد اداره کل مهاجرت (IGI) است، معمولاً همراه با ارائه طرح کسب‌وکار و اثبات سرمایه‌گذاری واقعی.' : 'A separate application for commercial residency must be submitted to IGI, typically requiring a business plan and proof of actual investment.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ثبت شرکت در رومانی (SRL)' : 'Company Registration'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'بررسی قوانین ثبت شرکت SRL، ضوابط مالیاتی بر اساس نوع فعالیت و مسیرهای اقامتی مرتبط.'
                : 'SRL company formation steps, corporate tax rules, and executive residency criteria.'}
            </p>
          </div>
        </div>
      );
  }
};
