'use client';

import React from 'react';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface InvestmentOverviewContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const InvestmentOverviewContent: React.FC<InvestmentOverviewContentProps> = ({ currentLang, onNavigate }) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <Breadcrumb slugRoute="company/investment" currentLang={currentLang} onNavigate={onNavigate} />

      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {currentLang === 'fa' ? 'اقامت از طریق سرمایه‌گذاری و تجارت' : 'Residency through Investment and Business'}
        </h1>
        <div className="text-[11px] text-slate-400 mt-2">
          {currentLang === 'fa' 
            ? 'منبع: آژانس رومانیایی سرمایه‌گذاری و تجارت خارجی (ARICE، arice.gov.ro)، آیین‌نامه اتباع خارجی (OUG 194/2002) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
            : 'Source: Romanian Agency for Investment and Foreign Trade (ARICE, arice.gov.ro), Foreigners Regime (OUG 194/2002) — Last reviewed: August 2026'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
            <span>{currentLang === 'fa' ? 'مسیر فعلی اقامت از طریق فعالیت تجاری' : 'Current Pathway for Commercial Residency'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'طبق آیین‌نامه اتباع خارجی رومانی (OUG 194/2002)، فردی که برای انجام فعالیت‌های تجاری وارد رومانی شده، می‌تواند برای اقامت موقت با هدف فعالیت تجاری اقدام کند.' : 'According to the Romanian Foreigners Regime (OUG 194/2002), individuals entering Romania to conduct commercial activities can apply for a temporary residence permit for commercial purposes.'}</li>
            <li>{currentLang === 'fa' ? 'این مسیر نیازمند تاییدیه فنی تخصصی (aviz tehnic de specialitate) از آژانس رومانیایی سرمایه‌گذاری و تجارت خارجی (ARICE) روی طرح تجاری متقاضی است.' : 'This pathway requires a specialized technical endorsement (aviz tehnic de specialitate) from the Romanian Agency for Investment and Foreign Trade (ARICE) on the applicant\'s business plan.'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
            <span>{currentLang === 'fa' ? 'نقش آژانس ARICE' : 'The Role of ARICE'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'آژانس رومانیایی سرمایه‌گذاری و تجارت خارجی (ARICE، arice.gov.ro) نهاد رسمی دولتی است که طرح‌های تجاری سرمایه‌گذاران خارجی را بررسی و تاییدیه فنی صادر می‌کند.' : 'The Romanian Agency for Investment and Foreign Trade (ARICE, arice.gov.ro) is the official government body that evaluates foreign investors\' business plans and issues the technical endorsement.'}</li>
            <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
            <span>{currentLang === 'fa' ? 'وضعیت مسیرهای اقامت سرمایه‌گذاری‌محور' : 'Status of Investment-based Residency'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'در حال حاضر، رومانی برنامه رسمی و فعالی مثل «اقامت طلایی» (Golden Visa) ندارد؛ متداول‌ترین مسیرهای اقامت بلندمدت که سرمایه‌گذاران استفاده می‌کنند، همچنان از طریق ثبت شرکت و فعالیت تجاری/اقتصادی (طبق OUG 194/2002) است.' : 'Currently, Romania does not have an active official "Golden Visa" program; the most common long-term residency pathways utilized by investors remain company registration and commercial/economic activity (per OUG 194/2002).'}</li>
            <li>{currentLang === 'fa' ? 'وضعیت قوانین مهاجرت و سرمایه‌گذاری پیوسته در حال تغییر است و اکیداً توصیه می‌شود فرصت‌های موجود از طریق منابع رسمی به‌روز بررسی شود تا با برنامه‌های منسوخ اشتباه گرفته نشود.' : 'Immigration and investment laws are constantly evolving; it is strongly advised to verify current opportunities through official sources to avoid confusion with outdated or inactive programs.'}</li>
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
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا رومانی برنامه «اقامت طلایی» (Golden Visa) دارد؟' : 'Does Romania have a "Golden Visa" program?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، در حال حاضر رومانی هیچ برنامه رسمی اقامت طلایی مبتنی بر خرید ملک یا سپرده‌گذاری صرف ندارد؛ مسیر رسمی همچنان از طریق فعالیت تجاری واقعی و تاییدیه ARICE است.' : 'No, Romania currently has no official golden-visa program based on simply buying property or making a deposit; the formal pathway remains genuine commercial activity endorsed by ARICE.'}</p>
          </div>
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا صرفِ ثبت شرکت برای اقامت کافی است؟' : 'Is registering a company alone enough for residency?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، ثبت شرکت گام اول است؛ برای اقامت تجاری باید طرح کسب‌وکار به ARICE ارائه و درخواست مجزا نزد اداره مهاجرت (IGI) ثبت شود. برای جزئیات بیشتر به' : 'No, company registration is only the first step; for commercial residency you must submit a business plan to ARICE and file a separate application with the Immigration Office (IGI). See'} <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('company/residency'); }} className="text-[#2F6FED] font-bold hover:underline">{currentLang === 'fa' ? 'صفحه اقامت شرکتی' : 'the company-residency page'}</a> {currentLang === 'fa' ? 'مراجعه کنید.' : 'for details.'}</p>
          </div>
        </div>
      </div>

      <ParentHubFooterCard slugRoute="company/investment" currentLang={currentLang} onNavigate={onNavigate} />
    </div>
  );
};
