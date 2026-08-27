'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { CommentsSection } from './CommentsSection';
import { ExternalLink, CheckCircle, ShieldCheck, Clock, FileCheck2, AlertCircle, PhoneCall, Globe } from './Icons';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface TelecomGuideContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const TelecomGuideContent: React.FC<TelecomGuideContentProps> = ({ currentLang, onNavigate }) => {
  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <Breadcrumb slugRoute="needs/telecom" currentLang={currentLang} onNavigate={onNavigate} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
          <span>📱 {currentLang === 'fa' ? 'راهنمای جامع اینترنت، سیم‌کارت و تلویزیون در رومانی' : 'Mobile, Broadband & Bundled TV Services Guide in Romania'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {currentLang === 'fa'
            ? 'خدمات تلفن همراه، اینترنت فیبر نوری و بسته‌های ترکیبی'
            : 'Mobile Plans, High-Speed Fiber Internet & Bundled Services in Romania'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'راهنمای کاربری سه اپراتور اصلی (Orange, Vodafone, Digi)، تفاوت سیم‌کارت اعتباری و دائمی، اینترنت پرسرعت خانگی و بسته‌های اقتصادی ترکیبی (اینترنت + تلویزیون + موبایل).'
            : 'Comprehensive guide to Romania’s top telecom operators (Orange, Vodafone, Digi), prepaid vs postpaid SIM contracts, fiber broadband, and cost-effective TV/internet bundles.'}
        </p>
        <div className="text-xs text-slate-400 pt-2 flex items-center space-x-2 rtl:space-x-reverse border-t border-slate-700/60">
          <span>🏛️</span>
          <span>
            {currentLang === 'fa'
              ? 'منبع: اپراتورهای معتبر مخابراتی رومانی (Orange, Vodafone, Digi)'
              : 'Source: Official Romanian Telecom Service Providers (Orange, Vodafone, Digi)'}
          </span>
        </div>
      </div>

      {/* MANDATORY ID REGISTRATION NOTICE */}
      <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm font-semibold leading-relaxed">
          {currentLang === 'fa'
            ? 'برخلاف بسیاری از کشورها، در رومانی از سال ۲۰۱۹ حتی سیم‌کارت‌های اعتباری (Prepaid) هم باید با مدرک شناسایی معتبر ثبت شوند — سیم‌کارت ناشناس/بدون ثبت وجود ندارد. برای خرید هر نوع سیم‌کارت، پاسپورت یا کارت اقامت خود را همراه داشته باشید.'
            : "Unlike many countries, Romania has required ID registration for all SIM cards — including prepaid — since 2019; there is no anonymous/unregistered SIM option. Bring your passport or residence card to buy any SIM card."}
        </p>
      </div>

      {/* SECTION 1: TABLE OF CONTENTS (پرش سریع) */}
      <div className="bg-white p-6 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📌</span>
          <span>{currentLang === 'fa' ? 'فهرست محتوای این راهنما (پرش سریع)' : 'Table of Contents'}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <a href="#quick-answer" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۱. پاسخ سریع' : '1. Quick Answer'}
          </a>
          <a href="#operators-comparison" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۲. مقایسه سه اپراتور اصلی' : '2. Top 3 Operators'}
          </a>
          <a href="#sim-types" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۳. سیم‌کارت اعتباری در مقابل دائمی' : '3. Prepaid vs Postpaid'}
          </a>
          <a href="#home-bundles" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۴. اینترنت خانگی و بسته‌های ترکیبی' : '4. Home Fiber & Bundles'}
          </a>
          <a href="#tv-options" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۵. گزینه‌های تلویزیون و استریم' : '5. TV & Streaming Options'}
          </a>
          <a href="#official-links" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۶. منابع و استعلام نرخ‌ها' : '6. Official Portals & Rates'}
          </a>
          <a href="#last-reviewed" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۷. تاریخ آخرین بررسی' : '7. Last Update'}
          </a>
          <a href="#related-content" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۸. مطالب مرتبط و نظرات' : '8. Related & Comments'}
          </a>
        </div>
      </div>

      {/* SECTION 2: QUICK ANSWER */}
      <div id="quick-answer" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#2F6FED]">
          <ShieldCheck size={24} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'پاسخ سریع: بازار مخابرات و ارتباطات در رومانی چگونه است؟' : 'Quick Answer: How Does Telecom & Internet Work in Romania?'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'رومانی یکی از پیشرفته‌ترین و اقتصادی‌ترین شبکه‌های اینترنت فیبر نوری خانگی و ارتباطات موبایل را در اتحادیه اروپا دارد. سه اپراتور اصلی کشور Orange، Vodafone و Digi (RCS-RDS) هستند (Telekom Romania نیز به‌تدریج در اپراتورهای اصلی ادغام می‌شود). برای روزهای نخست ورود، خرید سیم‌کارت اعتباری (Prepay) تنها با ارائه پاسپورت یا کارت شناسایی فوراً امکان‌پذیر است. پس از استقرار، خرید بسته‌های ترکیبی خانگی (شامل اینترنت فیبر نوری + تلویزیون دیجیتال + خط موبایل) از اپراتورهایی نظیر Digi یا Orange بسیار مقرون‌به‌صرفه‌تر از خرید جداگانه هر خدمت است.'
            : 'Romania offers some of the fastest and most affordable fiber optic home broadband and mobile networks in Europe. The market is led by three main operators: Orange, Vodafone, and Digi (RCS-RDS), with Telekom Romania progressively merging into these main networks. For quick setup upon arrival, prepaid SIM cards (Prepay) require only a valid passport or ID card. Once settled in an apartment, bundled packages (combining fiber internet + digital TV + mobile plans) provide significant cost savings compared to subscribing to services separately.'}
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#142033] flex items-start space-x-3 rtl:space-x-reverse">
          <span className="text-base mt-0.5">💡</span>
          <div>
            <strong className="block font-bold">{currentLang === 'fa' ? 'توصیه خرید برای ورود اولیه:' : 'Initial Arrival Recommendation:'}</strong>
            {currentLang === 'fa'
              ? 'در هفته اول، یک سیم‌کارت اعتباری (Cartela Prepay) تهیه کنید که نیازی به قرارداد یا کارت اقامت ندارد. پس از دریافت قرارداد مسکن، برای نصب اینترنت فیبر خانگی اقدام فرمایید.'
              : 'Get a prepaid SIM card during your first week. It requires no long-term commitment or residency permit, giving you immediate data connectivity.'}
          </div>
        </div>
      </div>

      {/* SECTION 3: TOP 3 OPERATORS COMPARISON TABLE */}
      <div id="operators-comparison" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📊</span>
          <span>{currentLang === 'fa' ? 'جدول مقایسه سه اپراتور اصلی در رومانی' : 'Top 3 Telecom Operators Comparison Table'}</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#071B3D] text-white">
                <th className="p-3.5 rounded-r-xl">{currentLang === 'fa' ? 'اپراتور' : 'Operator'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'نقاط قوت و پوشش' : 'Coverage & Strengths'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'خدمات همراه و ثابت' : 'Services Offered'}</th>
                <th className="p-3.5 rounded-l-xl">{currentLang === 'fa' ? 'ملاحظات کاربردی' : 'User Considerations'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe6ef]">
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">Digi (RCS-RDS)</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'شبکه فیبر نوری فوق‌العاده قوی خانگی و قیمت‌های رقابتی' : 'Extremely strong fiber optic home network & competitive pricing'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'اینترنت خانگی، موبایل، تلویزیون کابلی' : 'Home fiber, mobile, cable TV'}</td>
                <td className="p-3.5 text-[#526174]">{currentLang === 'fa' ? 'محبوب‌ترین گزینه برای اینترنت ثابت و بسته‌های ترکیبی' : 'Most popular choice for home fiber and total bundles'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">Orange Romania</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'بزرگ‌ترین پوشش شبکه 5G/4G موبایل و سرعت بالای داده' : 'Largest 5G/4G mobile coverage & high data speeds'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'سیم‌کارت‌های Prepay، اشتراک دائمی، اینترنت فیبر' : 'Prepaid SIMs, postpaid subscriptions, fiber'}</td>
                <td className="p-3.5 text-[#526174]">{currentLang === 'fa' ? 'کیفیت عالی پوشش آنتن‌دهی در سراسر رومانی' : 'Excellent mobile coverage across all regions'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">Vodafone Romania</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'شبکه موبایل با سابقه بالا، کیفیت مکالمه و اینترنت همراه' : 'Established mobile network, high voice quality & mobile data'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'سیم‌کارت‌های اعتباری/دائمی، اینترنت و تلویزیون' : 'Prepaid/postpaid SIMs, internet & TV'}</td>
                <td className="p-3.5 text-[#526174]">{currentLang === 'fa' ? 'ارائه‌دهنده تنوع در طرح‌های اعتباری و بسته‌های رومینگ' : 'Diverse prepaid recharge options & roaming bundles'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: REQUIRED DOCUMENTS PREPAID VS POSTPAID */}
      <div id="sim-types" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <FileCheck2 className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'مدارک لازم: سیم‌کارت اعتباری (Prepay) در مقابل اشتراک دائمی (Abonament)' : 'Required Documents: Prepaid SIM vs Postpaid Contract'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-600 font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-xs">✓</span>
              <h3>{currentLang === 'fa' ? 'سیم‌کارت اعتباری (Cartela Prepay)' : 'Prepaid SIM Card (Cartela Prepay)'}</h3>
            </div>
            <ul className="text-xs text-[#526174] space-y-2">
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <span>▪</span>
                <span><strong>{currentLang === 'fa' ? 'مدارک:' : 'Documents:'}</strong> {currentLang === 'fa' ? 'اصل پاسپورت معتبر یا کارت شناسایی هویتی.' : 'Valid original passport or ID card.'}</span>
              </li>
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <span>▪</span>
                <span><strong>{currentLang === 'fa' ? 'مزایا:' : 'Benefits:'}</strong> {currentLang === 'fa' ? 'فعال‌سازی آنی، بدون تعهد قرارداد سالانه، شارژ مجدد آسان آنلاین یا از دکه‌ها.' : 'Instant activation, no annual contract, easy online recharges.'}</span>
              </li>
            </ul>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">📋</span>
              <h3>{currentLang === 'fa' ? 'اشتراک دائمی (Abonament)' : 'Postpaid Subscription (Abonament)'}</h3>
            </div>
            <ul className="text-xs text-[#526174] space-y-2">
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <span>▪</span>
                <span><strong>{currentLang === 'fa' ? 'مدارک:' : 'Documents:'}</strong> {currentLang === 'fa' ? 'پاسپورت + کارت اقامت معتبر (Permis de Ședere) یا مدرک آدرس ثبت‌شده.' : 'Passport + valid residence card (Permis de Ședere) or registered lease.'}</span>
              </li>
              <li className="flex items-start space-x-2 rtl:space-x-reverse">
                <span>▪</span>
                <span><strong>{currentLang === 'fa' ? 'مزایا:' : 'Benefits:'}</strong> {currentLang === 'fa' ? 'صورتحساب ماهانه، حجم اینترنت بیشتر، و تخفیف خرید گوشی تلفن همراه.' : 'Monthly billing, higher data allowances, and smartphone discount deals.'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 5: HOME FIBER INTERNET & BUNDLED PACKAGES */}
      <div id="home-bundles" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#2F6FED]">
          <Globe size={24} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'اینترنت خانگی و بسته‌های ترکیبی (Digi Total و مشابه)' : 'Home Fiber Broadband & Bundled Services'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'در رومانی بسیار رایج است که اپراتورها (به‌ویژه Digi/RCS-RDS و Orange) بسته‌های ترکیبی شامل «اینترنت فیبر نوری پرسرعت خانگی + تلویزیون دیجیتال/کابلی + خط تلفن همراه» ارائه می‌دهند. تهیه این بسته‌های واحد (مانند طرح‌های Digi Total) بسیار مقرون‌به‌صرفه‌تر از خرید و پرداخت جداگانه هر خدمت است. برای سفارش اینترنت خانگی، داشتن قرارداد اجاره مسکن معتبر و هماهنگی جهت نصب تجهیزات (مودم و روتر فیبر نوری) در آدرس منزل الزامی است.'
            : 'In Romania, it is standard practice for providers (especially Digi/RCS-RDS and Orange) to offer unified bundled packages combining high-speed fiber internet + digital/cable TV + mobile connections. Opting for these all-in-one bundles (such as Digi Total deals) offers significant savings compared to paying for separate standalone subscriptions. Installing home broadband requires presenting a valid tenancy agreement for equipment setup at your residence address.'}
        </p>
      </div>

      {/* SECTION 6: LOCAL CABLE TV VS INTERNATIONAL STREAMING */}
      <div id="tv-options" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📺</span>
          <span>{currentLang === 'fa' ? 'گزینه‌های تلویزیون: کابلی محلی در مقابل سرویس‌های آنلاین بین‌المللی' : 'TV Viewing Options: Local Cable vs International Streaming'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold pt-2">
          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-2">
            <span className="block text-sm text-[#142033]">📡 {currentLang === 'fa' ? 'تلویزیون کابلی/دیجیتال محلی' : 'Local Cable & Digital TV'}</span>
            <p className="font-normal text-[#526174]">
              {currentLang === 'fa'
                ? 'شامل ده‌ها شبکه ورزشی، خبری و سرگرمی محلی به همراه شبکه‌های بین‌المللی (معمولاً با زیرنویس رومانیایی). همراه با بسته‌های اینترنت خانگی عرضه می‌شوند.'
                : 'Includes dozens of local Romanian channels, sports, and international channels (usually subtitled). Supplied alongside home fiber packages.'}
            </p>
          </div>
          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-2">
            <span className="block text-sm text-[#142033]">🎬 {currentLang === 'fa' ? 'سرویس‌های استریم بین‌المللی' : 'International Streaming Services'}</span>
            <p className="font-normal text-[#526174]">
              {currentLang === 'fa'
                ? 'سرویس‌های پخش آنلاین نظیر Netflix, Amazon Prime, Max و غیره کاملاً مستقل از اپراتور محلی روی هر اتصال اینترنتی پرسرعت قابل استفاده هستند.'
                : 'Global platforms such as Netflix, Amazon Prime, and Max operate independently over any fast internet connection in Romania.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 7: OFFICIAL RESOURCES & DISCLAIMER */}
      <div id="official-links" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <ExternalLink className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'منابع رسمی و پرتال‌های استعلام به روز نرخ‌ها' : 'Official Operator Portals for Live Plan Rates'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'به دلیل تغییرات مداوم تعرفه‌ها و پیشنهادهای فصلی، ما رقم یا تعرفه خاصی را درج نمی‌کنیم. جهت مقایسه و مشاهده به‌روزترین قیمت بسته‌ها مستقیماً به وب‌سایت رسمی اپراتورها مراجعه فرمایند:'
            : 'To ensure accuracy amidst frequent promotional updates, we do not hardcode static tariff rates. Please visit the official provider websites below to compare active plans:'}
        </p>

        <div className="flex flex-wrap gap-3 text-xs font-bold">
          <a
            href="https://www.orange.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] p-3 rounded-xl border border-[#dfe6ef] transition-colors"
          >
            <span>🍊</span>
            <span>orange.ro</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="https://www.vodafone.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] p-3 rounded-xl border border-[#dfe6ef] transition-colors"
          >
            <span>🔴</span>
            <span>vodafone.ro</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="https://www.digi.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] p-3 rounded-xl border border-[#dfe6ef] transition-colors"
          >
            <span>🌐</span>
            <span>digi.ro</span>
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#526174]">
          ⚠️ {currentLang === 'fa' ? 'توجه: تعرفه‌ها، هزینه‌های نصب و بسته‌های ترویجی به صورت دوره‌ای بروزرسانی می‌شوند. پیش از امضای قرارداد حتماً شرایط مندرج در وب‌سایت رسمی اپراتور را مطالعه فرمایید.' : 'Notice: Plan pricing, installation fees, and promotional bundles update regularly. Check the official operator website before signing any long-term contract.'}
        </div>
      </div>

      {/* SECTION 8: LAST REVIEWED DATE & COMMENTS */}
      <div id="last-reviewed" className="space-y-6 pt-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-[#526174] flex items-center space-x-2 rtl:space-x-reverse">
          <Clock size={16} className="text-slate-400" />
          <span>
            {currentLang === 'fa'
              ? 'آخرین بررسی و به‌روزرسانی محتوا: سال ۲۰۲۶ (بر اساس اطلاعات رسمی اپراتورهای مخابراتی رومانی)'
              : 'Last reviewed & updated: 2026 (Based on official Romanian telecom service provider data)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => handleNav('needs/first-days-checklist')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>✓</span>
              <span>{currentLang === 'fa' ? 'چک‌لیست روزهای نخست ورود' : 'First-Days Arrival Checklist'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'اقدامات اداری و ارتباطی در ۷۲ ساعت اولیه ورود.'
                : 'Essential arrival steps and communication tasks in your first 72 hours.'}
            </p>
          </div>

          <div
            onClick={() => handleNav('needs/housing')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🏠</span>
              <span>{currentLang === 'fa' ? 'اجاره و خرید مسکن در رومانی' : 'Renting & Buying Property'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'قراردادهای مسکن و الزامات ثبت آدرس برای نصب اینترنت.'
                : 'Lease contracts required for home fiber installation.'}
            </p>
          </div>
        </div>

        <ParentHubFooterCard slugRoute="needs/telecom" currentLang={currentLang} onNavigate={onNavigate} />

        {/* COMMENTS SECTION */}
        <div id="related-content" className="pt-6">
          <CommentsSection currentLang={currentLang} pagePath="needs/telecom" />
        </div>
      </div>
    </div>
  );
};
