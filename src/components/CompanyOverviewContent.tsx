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
    case 'real-estate-investment':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'سرمایه‌گذاری در املاک و مستغلات' : 'Real Estate Investment'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: اداره ثبت اسناد و املاک رومانی (OCPI)، سازمان امور مالیاتی رومانی (ANAF) — آخرین بررسی: ۲۰۲۶'
                : 'Source: National Agency for Cadastre and Land Registration (OCPI), National Agency for Fiscal Administration (ANAF) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'قانون مالکیت برای اتباع خارجی' : 'Foreign Ownership Rights'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اتباع کشورهای غیرعضو اتحادیه اروپا می‌توانند آپارتمان، خانه یا ساختمان تجاری در رومانی بخرند، دقیقاً با همان شرایط شهروندان رومانیایی.' : 'Non-EU citizens can purchase apartments, houses, or commercial buildings in Romania under the exact same conditions as Romanian citizens.'}</li>
                <li>{currentLang === 'fa' ? 'محدودیت اصلی مربوط به مالکیت زمین است: مالکیت مستقیم زمین برای اتباع خارج از اتحادیه اروپا فقط در صورت وجود معاهده متقابل بین رومانی و کشور متقاضی امکان‌پذیر است؛ در غیر این صورت فقط حق مالکیت بنا (نه زمین زیر آن) قابل خرید است.' : 'The main restriction concerns land ownership: direct ownership of land by non-EU citizens is only possible if a bilateral treaty exists between Romania and the applicant\'s country; otherwise, only the right to own the building (not the land beneath it) can be purchased.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'راه‌حل رایج برای مالکیت زمین' : 'Common Solution for Land Ownership'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'رایج‌ترین روش برای دور زدن این محدودیت، خرید ملک از طریق یک شرکت رومانیایی (SRL) است که خودِ متقاضی مالک آن باشد؛ شرکت‌ها محدودیتی در مالکیت زمین ندارند.' : 'The most common method to bypass this restriction is purchasing the property through a Romanian company (SRL) owned by the applicant; companies have no restrictions on land ownership.'}</li>
                <li>{currentLang === 'fa' ? 'برای هرگونه معامله ملکی، خریدار خارجی باید ابتدا شماره شناسایی مالیاتی (Cod de Identificare Fiscală / CIF) از سازمان امور مالیاتی رومانی (ANAF) دریافت کند.' : 'For any real estate transaction, a foreign buyer must first obtain a Fiscal Identification Code (CIF) from the National Agency for Fiscal Administration (ANAF).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'مراحل رسمی معامله' : 'Official Transaction Steps'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'معامله باید نزد دفتر اسناد رسمی (Notar Public) ثبت و تایید شود.' : 'The transaction must be authenticated and registered by a Notary Public (Notar Public).'}</li>
                <li>{currentLang === 'fa' ? 'ثبت نهایی مالکیت در دفتر املاک (Carte Funciară) از طریق اداره ثبت اسناد و املاک (OCPI) انجام می‌شود.' : 'Final registration of ownership in the Land Registry (Carte Funciară) is processed through the National Agency for Cadastre and Land Registration (OCPI).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'startup-tech-investment':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'استارت‌آپ‌ها و فناوری اطلاعات' : 'Tech Startups & Innovation'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: قانون مالیاتی رومانی (Legea 227/2015)، سازمان امور مالیاتی رومانی (ANAF) — آخرین بررسی: ۲۰۲۶'
                : 'Source: Romanian Fiscal Code (Legea 227/2015), National Agency for Fiscal Administration (ANAF) — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'معافیت مالیاتی برنامه‌نویسان' : 'Tax Exemption for Programmers'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'طبق قانون مالیاتی رومانی (Legea 227/2015، ماده ۶۰)، کارکنان شاغل در شرکت‌هایی که فعالیت اصلی یا فرعی‌شان «تولید نرم‌افزار» است (با کدهای فعالیت CAEN مشخص: 5821، 5829، 6201، 6202، 6209) از پرداخت مالیات ۱۰٪ بر درآمد حقوق معاف هستند.' : 'According to the Romanian Fiscal Code (Law 227/2015, Article 60), employees working in companies whose main or secondary activity is "software creation" (specific CAEN codes: 5821, 5829, 6201, 6202, 6209) are exempt from the 10% income tax on salaries.'}</li>
                <li>{currentLang === 'fa' ? 'این معافیت فقط مالیات بر درآمد را پوشش می‌دهد؛ کارمند همچنان باید سهم کامل بازنشستگی (CAS) و بیمه سلامت (CASS) را بپردازد.' : 'This exemption only covers income tax; the employee must still pay the full pension (CAS) and health insurance (CASS) contributions.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'شرایط شرکت و کارمند' : 'Company and Employee Requirements'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شرکت باید حداقل درآمد ۱۰,۰۰۰ یورو (معادل به لئو) به‌ازای هر کارمند مشمول در سال مالی قبل کسب کرده باشد (شرکت‌های تازه‌تاسیس از این شرط معاف‌اند).' : 'The company must have generated a minimum revenue of €10,000 (equivalent in RON) per eligible employee in the previous fiscal year (newly established companies are exempt from this condition).'}</li>
                <li>{currentLang === 'fa' ? 'سمت کارمند باید در فهرست مشخص‌شده قانونی باشد (مثل برنامه‌نویس، مهندس نرم‌افزار، تحلیلگر سیستم، مدیر پروژه فناوری اطلاعات).' : 'The employee\'s position must be on the legally specified list (e.g., programmer, software engineer, systems analyst, IT project manager).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکته برای کارآفرینان استارت‌آپی' : 'Tip for Startup Entrepreneurs'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ثبت شرکت با کد فعالیت مناسب (CAEN) اولین قدم برای بهره‌مندی از این معافیت است؛ جزئیات ثبت شرکت در صفحه «مراحل ثبت شرکت» موجود است.' : 'Registering a company with the appropriate activity code (CAEN) is the first step to benefit from this exemption; details are available on the "Registration Steps" page.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'annual-tax-reporting':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'قوانین مالیاتی و گزارش‌دهی سالانه' : 'Annual Tax Compliance'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: سازمان امور مالیاتی رومانی (ANAF)، وزارت دارایی رومانی — آخرین بررسی: ۲۰۲۶'
                : 'Source: National Agency for Fiscal Administration (ANAF), Romanian Ministry of Finance — Last reviewed: 2026'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'الزام گزارش‌دهی سالانه' : 'Annual Reporting Obligation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'هر شرکت ثبت‌شده در رومانی (از جمله SRL) موظف است صورت‌های مالی سالانه را به‌صورت الکترونیکی و با امضای دیجیتال معتبر به سازمان امور مالیاتی رومانی (ANAF) ارسال کند.' : 'Every company registered in Romania (including SRLs) is required to submit annual financial statements electronically, using a valid digital signature, to the National Agency for Fiscal Administration (ANAF).'}</li>
                <li>{currentLang === 'fa' ? 'مهلت معمول ارسال صورت‌های مالی سالانه، ۳۱ می هر سال است (در صورت مصادف شدن با تعطیلات رسمی، ممکن است چند روز تمدید شود).' : 'The standard deadline for submitting annual financial statements is May 31st of each year (this may be extended by a few days if it falls on a public holiday).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'عواقب عدم ارسال به‌موقع' : 'Consequences of Late Submission'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'عدم ارسال صورت‌های مالی می‌تواند جریمه نقدی (بین ۲,۰۰۰ تا ۵,۰۰۰ لئو) به همراه داشته باشد.' : 'Failure to submit financial statements can result in fines ranging from 2,000 to 5,000 RON.'}</li>
                <li>{currentLang === 'fa' ? 'اگر شرکت بیش از ۵ ماه بعد از مهلت قانونی هم صورت مالی ارسال نکند، ممکن است از سوی ANAF به‌عنوان «غیرفعال مالیاتی» اعلام شود که پیامدهای جدی‌تری (مثل از دست دادن حق کسر مالیاتی طرف‌های معامله) دارد.' : 'If a company fails to submit financial statements for more than 5 months past the legal deadline, it may be declared "fiscally inactive" by ANAF, which carries severe consequences (such as business partners losing the right to deduct taxes).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'شرکت‌های بدون فعالیت' : 'Dormant Companies'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شرکت‌هایی که از زمان ثبت تا پایان سال مالی هیچ فعالیتی نداشته‌اند، نیازی به تهیه صورت مالی کامل ندارند؛ در عوض باید ظرف ۶۰ روز از پایان سال مالی، اظهارنامه عدم‌فعالیت را به ANAF ارسال کنند.' : 'Companies that have had no activity from registration until the end of the financial year do not need to prepare full financial statements; instead, they must submit a declaration of inactivity to ANAF within 60 days of the financial year-end.'}</li>
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
