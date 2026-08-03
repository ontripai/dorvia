'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { Button } from './Button';
import { Landmark, House, FileCheck2, ShieldCheck, LockKeyhole, ExternalLink, ArrowRight, ArrowLeft } from './Icons';

interface NeedsContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const NeedsContent: React.FC<NeedsContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;
  const [housingTab, setHousingTab] = useState<'rent' | 'buy'>('rent');

  // SUB-ROUTE CONTENT ROUTING
  switch (subRoute) {

    // 0. NEEDS LANDING HUB
    case 'needs':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'نیازهای زندگی روزمره در رومانی' : 'Essentials in Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'نیازمندی‌ها و کارهای اداری ورود و استقرار' : 'Essentials & Settlement Guide'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای کارهای اداری، مالی، مسکن، خدمات درمانی، مدارس فرزندان، گواهینامه رانندگی و زندگی در رومانی.'
                : 'Your comprehensive directory for daily life, banking, renting, healthcare, schooling, and local compliance.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/first-days-checklist')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">✓</span>
                  <span>{currentLang === 'fa' ? 'چک‌لیست روزهای نخست ورود' : 'First-Days Arrival Checklist'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'اقدامات حیاتی ۷۲ ساعت، ۷ روز و ۳۰ روز اول ورود به کشور رومانی.' : 'Essential tasks for your first 72 hours, 7 days, and 30 days.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/currency-exchange')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🏦</span>
                  <span>{currentLang === 'fa' ? 'صرافی و پرداخت‌ها' : 'Currency Exchange & Payments'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'نرخ‌های مرجع بانک ملی (BNR)، صرافی‌های معتبر و افتتاح حساب بانکی.' : 'BNR rates, banking, local card setup, and money transfers.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/housing')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🏠</span>
                  <span>{currentLang === 'fa' ? 'اجاره و خرید مسکن' : 'Renting & Buying Property'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'چک‌لیست قرارداد اجاره، ثبت در دارایی (ANAF)، ودیعه و مالکیت ملک.' : 'Rental contracts, security deposits, ANAF registration, and buying rules.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/driving-license')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🚗</span>
                  <span>{currentLang === 'fa' ? 'گواهینامه رانندگی' : 'Driving License'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'شرایط رانندگی با گواهینامه بین‌المللی و تبدیل آن در DGPCI.' : 'Rules for international driving permits and license exchange.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/certified-translation')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">📄</span>
                  <span>{currentLang === 'fa' ? 'دارالترجمه رسمی' : 'Certified Translation'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'ترجمه رسمی مدارک هویتی و تحصیلی به زبان رومانیایی توسط مترجمین مجاز.' : 'Authorized translations of academic and civil documents.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/notary-public')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">⚖️</span>
                  <span>{currentLang === 'fa' ? 'دفتر اسناد رسمی' : 'Notary Public'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'ثبت اسناد رسمی، اساسنامه‌های شرکتی و وکالت‌نامه‌ها (Procura).' : 'Legalizing contracts, power of attorney, and corporate deeds.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/iranian-embassy-and-mikhak')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🏛️</span>
                  <span>{currentLang === 'fa' ? 'سفارت ایران و میخک' : 'Iranian Embassy & Mikhak'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'امور کنسولی، تایید مدرک تحصیلی و وکالت‌نامه‌ها از طریق سامانه میخک.' : 'Consular services, document authentication, and mikhak registry.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/health')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">❤️</span>
                  <span>{currentLang === 'fa' ? 'خدمات درمانی و سلامت' : 'Healthcare & Insurance'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'آشنایی با بیمه سلامت عمومی (CNAS)، پزشک خانواده و فوریت‌های پزشکی.' : 'National health insurance (CNAS), family doctors, and clinics.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/school')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🎓</span>
                  <span>{currentLang === 'fa' ? 'مدارس و سیستم آموزشی' : 'Schools & Education'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'سیستم مدارس دولتی رومانی و گزینه‌های مدارس بین‌المللی برای فرزندان.' : 'Public primary and secondary school systems and international schools.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('needs/telecom')}>
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">📱</span>
                  <span>{currentLang === 'fa' ? 'تلفن همراه و اینترنت' : 'Telecom & Connectivity'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'خرید سیم‌کارت‌های اعتباری و دائمی (Orange, Vodafone, Digi) و اینترنت خانگی.' : 'Orange, Vodafone, Digi mobile plans and high-speed fiber broadband.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </div>
          </div>
        </div>
      );

    case 'health':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'راهنمای خدمات درمانی و سلامت در رومانی' : 'Healthcare & Medical Guide'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' ? 'پزشک خانواده، ثبت‌نام در سازمان بیمه دولتی (CNAS)، و مراکز درمانی خصوصی.' : 'Family doctors, national insurance registration (CNAS), and private medical centers.'}
            </p>
          </div>
          <div className="editorial-card p-8 bg-white border border-[#dfe6ef] space-y-4 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-[#142033]">{currentLang === 'fa' ? 'مراقبت‌های درمانی و ثبت‌نام بیمه سلامت رومانی' : 'Healthcare Access in Romania'}</h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa' 
                ? 'ثبت‌نام در سازمان ملی بیمه سلامت (CNAS) برای مهاجرین مقیم قانونی از طریق پرداخت‌های سهمیه بیمه یا معافیت‌های دانشجویی امکان‌پذیر است. در گام اول باید یک پزشک خانواده (Medic de Familie) را انتخاب کنید تا به عنوان دروازه ورود شما به سیستم ارجاعات درمانی باشد.'
                : 'Registration with the National Health Insurance House (CNAS) is mandatory for long-term residents. Students and employees are generally covered automatically through university registration or payroll tax deductions. Your first action should be registering with a local family doctor (Medic de Familie).'}
            </p>
            <div className="p-4 bg-[#F8FAFC] border border-[#e2e8f0] rounded-xl text-xs text-[#526174] font-semibold">
              ℹ️ {currentLang === 'fa' ? 'بررسی شرایط درمانی و مدارک لازم باید با مراجعه مستقیم به وب‌سایت رسمی CNAS (cnas.ro) انجام شود.' : 'Please cross-reference current health coverage details on the official CNAS website (cnas.ro).'}
            </div>
          </div>
        </div>
      );

    case 'school':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مدارس و سیستم آموزشی مدارس در رومانی' : 'Primary & Secondary Schools in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' ? 'سیستم ثبت‌نام مدارس عمومی رومانی و گزینه‌های مدارس بین‌المللی.' : 'Enrollment procedures in public schools and options for international curriculums.'}
            </p>
          </div>
          <div className="editorial-card p-8 bg-white border border-[#dfe6ef] space-y-4 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-[#142033]">{currentLang === 'fa' ? 'ثبت‌نام فرزندان در سیستم مدارس رومانی' : 'School Enrollment Procedures'}</h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa' 
                ? 'فرزندان مهاجرین مقیم قانونی حق تحصیل در سیستم آموزش عمومی رومانی را دارند. تحصیل در مدارس دولتی به زبان رومانیایی است. مدارس بین‌المللی مختلفی نیز در بخارست با برنامه‌های درسی بریتانیایی، آمریکایی یا فرانسوی فعال هستند.'
                : 'Children of legal residents have full access to the public school system in Romania. While public school instruction is in Romanian, multiple international schools (British, American, and French curriculums) operate in major hubs like Bucharest.'}
            </p>
            <div className="p-4 bg-[#F8FAFC] border border-[#e2e8f0] rounded-xl text-xs text-[#526174] font-semibold">
              ℹ️ {currentLang === 'fa' ? 'شرایط ثبت‌نام و تطبیق تحصیلی از طریق اداره کل بازرسی مدارس هر استان پیگیری می‌شود.' : 'Contact the local county School Inspectorate (Inspectorat Scolar) for enrollment requirements.'}
            </div>
          </div>
        </div>
      );

    case 'telecom':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'تلفن همراه و اینترنت در رومانی' : 'Mobile & Internet Services in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' ? 'خرید سیم‌کارت‌های اعتباری (Cartela SIM)، قراردادهای دائمی و اینترنت فیبر نوری.' : 'Prepaid SIM cards (Cartela SIM), postpaid subscriptions, and high-speed broadband.'}
            </p>
          </div>
          <div className="editorial-card p-8 bg-white border border-[#dfe6ef] space-y-4 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-[#142033]">{currentLang === 'fa' ? 'خدمات مخابراتی و اینترنت خانگی' : 'Telecom Providers & Broadband'}</h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa' 
                ? 'اپراتورهای اصلی تلفن همراه در رومانی Orange، Vodafone و Digi هستند. برای روزهای نخست ورود، خرید سیم‌کارت اعتباری (Prepaid) بدون نیاز به مدارک اقامتی آسان‌ترین گزینه است. اینترنت فیبر نوری خانگی نیز با پهنای باند بالا و هزینه‌های بسیار مناسب عرضه می‌شود.'
                : 'The primary telecom operators are Orange, Vodafone, and Digi. For your first days, a prepaid SIM card is the easiest option since it requires no residency registration. Romania boasts some of the fastest and cheapest fiber broadband internet in the world.'}
            </p>
            <div className="p-4 bg-[#F8FAFC] border border-[#e2e8f0] rounded-xl text-xs text-[#526174] font-semibold">
              ℹ️ {currentLang === 'fa' ? 'برای خرید اشتراک دائمی (Abonament)، ارائه کارت اقامت رومانیایی (Permis de Ședere) الزامی است.' : 'Note that postpaid subscription contracts (Abonament) require a valid residence card.'}
            </div>
          </div>
        </div>
      );

    case 'currency-exchange':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'نیازهای ضروری در رومانی' : 'Essentials in Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'صرافی، تبدیل پول و پرداخت‌ها' : 'Currency Exchange & Payments'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای نرخ‌های مرجع بانک ملی رومانی (BNR)، تفکیک بانک‌ها و صرافی‌های مجاز، و انتقال قانونی پول.'
                : 'Guide to BNR reference rates, licensed banks vs exchange offices, and legal funds transfers.'}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'مدیریت تبدیل ارز و پرداخت‌های روزمره در رومانی، در صورت آشنایی با سیستم محلی، بسیار ساده است. ارز رسمی این کشور لئوی رومانی (RON) است؛ اگرچه برای معاملات کلان مانند خرید ملک یا خودرو ممکن است یورو استفاده شود، اما تمام خریدهای روزمره باید با RON انجام شود. بانک ملی رومانی (BNR) روزانه نرخ‌های مرجع را اعلام می‌کند که به‌عنوان معیار اصلی شناخته می‌شود. برای جلوگیری از پرداخت کارمزدهای پنهان و نرخ‌های نامناسب، توصیه می‌شود منحصراً از بانک‌های معتبر یا صرافی‌های مجازی (Case de Schimb Valutar) استفاده کنید که به‌وضوح عبارت "بدون کارمزد" (0% Comision) را درج کرده‌اند.'
              : 'Navigating currency exchange and everyday payments in Romania is straightforward once you understand the local system. The official currency is the Romanian Leu (RON), and while euros are widely accepted for large transactions like real estate or car purchases, daily expenses are strictly handled in RON. The National Bank of Romania (BNR) sets the official daily reference rates, which serve as a benchmark. To avoid hidden fees and unfavorable rates, it is highly recommended to use licensed commercial banks or authorized exchange offices (Case de Schimb Valutar) that explicitly display "0% Comision".'}
          </div>

          <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
            <div className="flex items-center justify-between border-b border-[#dfe6ef] pb-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#142033]">
                <Landmark size={20} className="text-[#2F6FED]" />
                <h3 className="font-extrabold text-base">{currentLang === 'fa' ? 'نرخ مرجع بانک ملی رومانی (BNR)' : 'National Bank of Romania (BNR) Reference Rates'}</h3>
              </div>
              <span className="text-[11px] text-[#788697] font-semibold">{currentLang === 'fa' ? 'آخرین بروزرسانی: مرداد ۱۴۰۵ / اوت ۲۰۲۶' : 'Updated: August 2026'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 EUR</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">4.97 RON</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 USD</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">4.58 RON</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 GBP</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">5.82 RON</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 AED</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">1.24 RON</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f7f9fc] border border-[#dfe6ef]">
                <div className="text-xs text-[#788697] font-bold">1 TRY</div>
                <div className="text-base font-extrabold text-[#2F6FED] mt-1">0.14 RON</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold">
              ⚠️ {currentLang === 'fa' ? 'تذکر مهم: نرخ مرجع بانک ملی رومانی الزاماً همان نرخ نهایی صرافی یا کارمزد کارت‌های بانکی نیست.' : 'Important Notice: BNR reference rates are benchmark indicators and may differ from commercial bank exchange spreads.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
              <h4 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'مقایسه صرافی‌ها و بانک‌ها' : 'Banks vs Exchange Offices'}</h4>
              <p className="text-sm text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'بانک‌های معتبر رومانی (Banca Transilvania, BCR, BRD) امن‌ترین گزینه برای مبالغ بالا هستند. در صرافی‌های شهری همیشه تابلو بدون کارمزد (Comision 0%) و ارائه رسید رسمی با گذرنامه را چک کنید.'
                  : 'Commercial banks provide maximum security for high-value transfers. Always verify zero commission boards and demand official receipts.'}
              </p>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
              <h4 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'هشدار کلاهبرداری ارز' : 'Currency Fraud Prevention'}</h4>
              <p className="text-sm text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'هیچ‌گاه پول یا مدارک بانکی خود را در اختیار افراد یا صرافی‌های فاقد هویت و مجوز رسمی قرار ندهید. کلیه پرداخت‌های اجاره مسکن باید همراه با رسید بانکی ثبت شوند.'
                  : 'Never transfer funds through unlicensed informal dealers. All rental deposits must be accompanied by verifiable bank transfers.'}
              </p>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'همراه داشتن یورو بهتر است یا دلار آمریکا؟' : 'Should I bring euros or US dollars?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'یورو (Euro) بسیار ارجحیت دارد؛ بهترین نرخ‌های تبدیل و کمترین حاشیه ضرر در رومانی به یورو اختصاص دارد.' : 'Euros are highly preferred and offer the best exchange rates and lowest spreads locally compared to US dollars.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم از Revolut یا Wise در رومانی استفاده کنم؟' : 'Can I use Revolut or Wise in Romania?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، این نئوبانک‌ها در رومانی بسیار محبوب هستند و نرخ تبدیل بسیار خوبی برای مصارف روزمره ارائه می‌دهند.' : 'Yes, these digital banks are extremely popular in Romania and offer excellent exchange rates for daily use.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    // 2. DRIVING LICENSE
    case 'driving-license':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'گواهینامه رانندگی و شرایط تبدیل' : 'Driving License & Exchange Rules'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'ضوابط رانندگی با گواهینامه بین‌المللی، مراحل ثبت‌نام در DGPCI، و الزامات معاینات پزشکی.'
                : 'Regulations for international permits, DGPCI exchange procedures, and medical checkups.'}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'رانندگی در رومانی برای بسیاری از مهاجرین یک نیاز اساسی است، اما با الزامات قانونی خاصی همراه است. شهروندان کشورهای غیراروپایی می‌توانند در ماه‌های اولیه حضور خود با در دست داشتن گواهینامه بین‌المللی معتبر (در کنار گواهینامه کشور مبدأ) رانندگی کنند. با این حال، پس از دریافت کارت اقامت، ممکن است ملزم شوید گواهینامه خود را از طریق اداره پلیس راهنمایی و رانندگی (DGPCI) به گواهینامه رومانیایی تبدیل کنید. امکان تبدیل مستقیم بستگی به وجود توافقنامه دوجانبه با کشور شما دارد؛ در غیر این صورت، شرکت در آزمون‌های تئوری و عملی رانندگی رومانی الزامی خواهد بود.'
              : 'Driving in Romania is an essential part of settling in for many expats, but it comes with specific legal requirements. Non-EU citizens can typically drive using an International Driving Permit (alongside their valid home country license) during their initial temporary stay. However, once you become a resident, you may be required to exchange your foreign license for a Romanian one through the Driving License and Vehicle Registration Directorate (DGPCI). The ability to directly exchange your license depends on bilateral agreements between Romania and your home country; if no agreement exists, you must pass the Romanian driving exams.'}
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-[#2F6FED] font-bold">
              ℹ️ {currentLang === 'fa' ? 'وضعیت تبدیل گواهینامه باید بر اساس آخرین فهرست و دستورالعمل رسمی DGPCI و وزارت امور داخلی رومانی بررسی شود.' : 'Driving license exchange status must be verified against current DGPCI directives.'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-[#142033]">۱. رانندگی موقت</h4>
                <p className="text-sm text-[#526174] leading-relaxed">استفاده از گواهینامه بین‌المللی همراه با ترجمه رسمی تاییدشده تا زمان صدور کارت اقامت موقت مجاز است.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-[#142033]">۲. پرونده DGPCI</h4>
                <p className="text-sm text-[#526174] leading-relaxed">ارائه گواهینامه اصل، ترجمه رسمی به زبان رومانیایی، کارت اقامت و گواهی سلامت پزشکی از مراکز معتمد.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-[#142033]">۳. آزمون در صورت لزوم</h4>
                <p className="text-sm text-[#526174] leading-relaxed">در صورت عدم امکان تعویض مستقیم، شرکت در آکادمی رانندگی و آزمون‌های تئوری و عملی به زبان انگلیسی.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم با گواهینامه ایرانی در رومانی رانندگی کنم؟' : 'Can I drive in Romania with an Iranian driver\'s license?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، در صورتی که همراه با گواهینامه بین‌المللی معتبر باشد، اما این شرایط تنها تا ۹۰ روز نخست یا تا پیش از اخذ اقامت بلندمدت اعتبار دارد و پس از آن باید تبدیل شود.' : 'Yes, if accompanied by an International Driving Permit, but only for the first 90 days or until you obtain residency; after that, you must look into exchanging it.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا امکان شرکت در آزمون رانندگی به زبان انگلیسی وجود دارد؟' : 'Is the driving test available in English?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، متقاضیان خارجی می‌توانند درخواست دهند تا آزمون تئوری کامپیوتری رانندگی را به زبان انگلیسی بگذرانند.' : 'Yes, foreign applicants can request to take the computerized theoretical driving exam in English.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    // 3. CERTIFIED TRANSLATION
    case 'certified-translation':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ترجمه رسمی و مترجمین مجاز' : 'Certified Translation'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'معرفی مترجمین مجاز دادگستری (Traducator Autorizat) و تاییدیه دفاتر اسناد رسمی.'
                : 'Ministry of Justice authorized translators and notarization steps.'}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'در رومانی، ترجمه اسناد رسمی و قانونی یک حرفه به‌شدت تحت نظارت است. چه برای پذیرش دانشگاه به ترجمه مدارک تحصیلی نیاز داشته باشید، چه برای اداره مهاجرت نیازمند ارائه شناسنامه باشید، فقط باید به سراغ مترجمین رسمی و دارای مجوز از وزارت دادگستری رومانی (Traducator Autorizat) بروید. علاوه بر مهر و تاییدیه مترجم، بسیاری از نهادهای دولتی (مانند IGI) از شما می‌خواهند که امضای مترجم در دفتر اسناد رسمی (Notar Public) تصدیق و تأیید شود، که به این نوع مدارک «ترجمه محضری» (Traducere Legalizata) می‌گویند.'
              : 'In Romania, the translation of official documents is a highly regulated profession. Whether you are translating diplomas for university admission, birth certificates for immigration, or contracts for your business, you must use a translator explicitly authorized by the Romanian Ministry of Justice (Traducator Autorizat). For documents to be legally recognized by state institutions like IGI or ANAF, the translation often needs to be not simply certified by the translator, but also legalized by a Notary Public (Traducere Legalizata) who verifies the translator\'s signature.'}
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <h3 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'تفاوت انواع ترجمه مدارک' : 'Types of Legal Document Translation'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">Traducere Autorizata</span>
                <p className="text-[#526174]">ترجمه توسط مترجم دارای پروانه رسمی از وزارت دادگستری رومانی همراه با مهر و شماره مجوز.</p>
              </div>
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">Traducere Legalizata</span>
                <p className="text-[#526174]">ترجمه مجاز که امضای مترجم توسط دفتر اسناد رسمی (Notar Public) در رومانی تایید شده است.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <a href="https://just.ro" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" rightIcon={<ExternalLink size={14} />}>
                  {currentLang === 'fa' ? 'جستجوی مترجم مجاز دادگستری' : 'Ministry of Justice Translator Search'}
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم از ترجمه‌های رسمی کشور خودم در رومانی استفاده کنم؟' : 'Can I use translations done in my home country?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'ادارات دولتی رومانی غالباً ترجیح می‌دهند ترجمه‌ها توسط مترجمین مجاز داخلی انجام شود؛ ترجمه‌های خارجی معمولاً نیازمند مهر آپوستیل یا تایید سفارت رومانی هستند تا معتبر شناخته شوند.' : 'Generally, Romanian authorities prefer translations done locally by Romanian-authorized translators, though embassy-legalized translations may be accepted in some cases.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چگونه یک مترجم مجاز زبان خودم را پیدا کنم؟' : 'Where can I find an authorized translator?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'شما می‌توانید در وب‌سایت وزارت دادگستری رومانی جستجو کنید یا به دفاتر اسناد رسمی (Notar Public) مراجعه نمایید که معمولاً با شبکه‌ای از مترجمین معتبر همکاری دارند.' : 'You can search the official registry on the Ministry of Justice website or visit local notary offices, which often have authorized translators on call.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    // 4. NOTARY PUBLIC
    case 'notary-public':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'دفتر اسناد رسمی و خدمات نوتاری' : 'Notary Public Services'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'تنظیم وکالت‌نامه، تایید امضا، گواهی مطابقت تصویر با اصل مدارک و ثبت قراردادها.'
                : 'Powers of attorney, signature legalizations, and real estate notarial deeds.'}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'دفتر اسناد رسمی (Notar Public) در سیستم حقوقی و مدنی رومانی نقشی کلیدی و غیرقابل چشم‌پوشی ایفا می‌کند. برخلاف برخی کشورها که نقش سردفتر صرفاً تایید امضا است، نوتاری‌های رومانی حقوق‌دانانی مجرب هستند که اسناد حساس اعم از انتقال مالکیت املاک، صدور انواع وکالت‌نامه (Procură)، اساسنامه‌های شرکتی و تایید مدارک ترجمه‌شده را تنظیم و رسمیت می‌بخشند. درک زمان و نحوه مراجعه به این دفاتر می‌تواند شما را از پیچیدگی‌های قانونی نجات داده و اعتبار مدارک شما را در نهادهای دولتی تضمین کند.'
              : 'The Notary Public (Notar Public) plays a central and indispensable role in Romanian civil and commercial life. Unlike in some jurisdictions where a notary simply witnesses signatures, Romanian notaries are highly qualified legal professionals tasked with authenticating a wide range of critical documents. From finalizing real estate purchases and drafting powers of attorney (Procură) to legalizing translations and authenticating corporate statutes, their seal is required for most significant legal transactions. Understanding when you need notarial services will save you time and ensure your documents are legally binding.'}
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <h3 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'خدمات اصلی دفاتر اسناد رسمی' : 'Main Notarial Services'}</h3>
            <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
              <li>{currentLang === 'fa' ? 'تأیید صحت امضا و کپی برابر اصل مدارک.' : 'Signature authentication and certified true copies of documents.'}</li>
              <li>{currentLang === 'fa' ? 'تنظیم اسناد انتقال مالکیت ملک و وسایل نقلیه.' : 'Drafting deeds for the transfer of real estate and vehicle ownership.'}</li>
              <li>{currentLang === 'fa' ? 'ثبت انواع وکالت‌نامه‌های عمومی و خاص.' : 'Registering general and specific powers of attorney.'}</li>
              <li>{currentLang === 'fa' ? 'تصدیق ترجمه‌های رسمی (Legalizare).' : 'Notarization of certified translations (Legalizare).'}</li>
            </ul>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا برای مراجعه به دفتر اسناد رسمی باید وقت قبلی بگیرم؟' : 'Do I need an appointment for notary services?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'برای خدمات ساده مثل کپی برابر اصل معمولاً نیازی به وقت قبلی نیست، اما برای تنظیم قراردادهای ملکی یا وکالت‌نامه‌ها رزرو وقت قبلی الزامی است.' : 'For complex acts like property purchases or corporate setups, an appointment is mandatory, but for simple document legalizations, walk-ins are often accepted.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر من به زبان رومانیایی مسلط نباشم چه اتفاقی می‌افتد؟' : 'What if I don\'t speak Romanian?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق قانون، حضور یک مترجم شفاهی مجاز (Translator Autorizat) در زمان امضای اسناد برای تفهیم کامل مفاد قرارداد به زبان مادری شما یا انگلیسی الزامی است.' : 'If you do not speak Romanian, the law requires an authorized interpreter to be present at the notary office to translate the document verbally before you sign.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    // 5. IRANIAN EMBASSY & MIKHAK
    case 'iranian-embassy-and-mikhak':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'خدمات کنسولی' : 'Consular Services'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'سفارت ایران در بخارست و سامانه میخک' : 'Iranian Embassy in Bucharest & Mikhak System'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای ثبت درخواست‌های گذرنامه، تشکیل پرونده دانشجویی و تایید مدارک.'
                : 'Official consular guide for passport renewals, and student files via Mikhak.'}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'برای شهروندان ایرانی مقیم رومانی، سفارت جمهوری اسلامی ایران در بخارست مرجع اصلی دریافت خدمات کنسولی است. امروزه اکثر روندهای اداری—از جمله تمدید گذرنامه، ثبت ازدواج و تشکیل پرونده‌های دانشجویی جهت برخورداری از معافیت‌های ارزی—به‌صورت الکترونیکی و از طریق سامانه یکپارچه «میخک» انجام می‌شود. شدیداً توصیه می‌گردد پیش از مراجعه حضوری به سفارت، حتماً مدارک خود را در سامانه میخک بارگذاری کرده و کد رهگیری دریافت نمایید تا فرآیند صدور اسناد شما با سرعت و دقت بیشتری طی شود.'
              : 'For Iranian nationals residing in Romania, the Embassy of the Islamic Republic of Iran in Bucharest serves as the primary hub for all consular services. Whether you need to renew your passport, register a marriage, or process student files, most administrative workflows are now integrated with the "Mikhak" online system. It is highly recommended to complete your online registration and upload all necessary documents through the Mikhak portal before scheduling an in-person appointment at the consulate, as this drastically reduces processing times and ensures a smoother experience.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
              <h3 className="font-extrabold text-[#142033] text-base">📍 {currentLang === 'fa' ? 'اطلاعات تماس سفارت' : 'Embassy Contact Information'}</h3>
              <ul className="space-y-2 text-sm text-[#526174]">
                <li><strong>{currentLang === 'fa' ? 'آدرس:' : 'Address:'}</strong> Lascăr Catargiu 39, București</li>
                <li><strong>{currentLang === 'fa' ? 'تلفن:' : 'Phone:'}</strong> <span dir="ltr" className="inline-block">+40 21 312 0493</span></li>
                <li><strong>{currentLang === 'fa' ? 'سامانه میخک:' : 'Mikhak System:'}</strong> mikhak.mfa.gov.ir</li>
              </ul>
              <a href="https://mikhak.mfa.gov.ir" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm" className="w-full mt-2" rightIcon={<ExternalLink size={14} />}>
                  {currentLang === 'fa' ? 'ورود به سامانه رسمی میخک' : 'Access Mikhak Portal'}
                </Button>
              </a>
            </div>

            <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
              <h3 className="font-extrabold text-[#142033] text-base">⚠️ {currentLang === 'fa' ? 'هشدار امنیتی سامانه میخک' : 'Mikhak Security Warning'}</h3>
              <p className="text-sm text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'سامانه میخک فقط از طریق دامنه رسمی وزارت امور خارجه ایران در دسترس است. اطلاعات ورود، کد رهگیری و مدارک هویتی خود را هرگز در اختیار افراد ناشناس قرار ندهید.'
                  : 'Access Mikhak strictly through official Ministry of Foreign Affairs domains. Protect account credentials.'}
              </p>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا مراجعه به سفارت نیاز به وقت قبلی دارد؟' : 'Do I need to book an appointment before visiting the embassy?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، برای اکثر خدمات کنسولی داشتن کد رهگیری از سامانه میخک و گرفتن نوبت تلفنی یا اینترنتی الزامی است.' : 'Yes, most consular services require a pre-booked appointment, often initiated after submitting your application on the Mikhak system.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا سفارت خدمات ترجمه رسمی هم ارائه می‌دهد؟' : 'Does the embassy provide translation services?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، سفارت وظیفه تایید اسناد را برعهده دارد؛ شما باید برای مدارک مورد نیاز دولت رومانی به مترجمین مجاز محلی مراجعه کنید.' : 'No, the embassy does not translate documents; you must use a Romanian-authorized translator for documents submitted to local authorities.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    // 6. HOUSING (RENT & BUY)
    case 'housing':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'راهنمای اجاره و خرید مسکن در رومانی' : 'Renting & Buying Property in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'چک‌لیست قراردادهای اجاره، ثبت آدرس مسکونی برای کارت اقامت و ضوابط خرید ملک.'
                : 'Rental contracts, residence address registration, and property acquisition rules.'}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'پیدا کردن محل سکونت مناسب یکی از مهم‌ترین دغدغه‌های مهاجران تازه‌وارد در رومانی است. بازار مسکن گزینه‌های متنوعی از آپارتمان‌های مدرن تا خانه‌های حومه‌شهری را پیش روی شما می‌گذارد. در زمان اجاره، پرداخت یک ماه پیش‌پرداخت و یک ماه ودیعه (Garantie) امری رایج است و حتماً باید بر امضای یک قرارداد رسمی و ثبت‌شده پافشاری کنید تا از آن برای تشکیل پرونده اقامت خود در اداره مهاجرت بهره ببرید. شرایط خرید ملک و زمین برای اتباع کشورهای خارج از اتحادیه اروپا به تابعیت، نوع ملک، ساختار معامله و مقررات جاری بستگی دارد. پیش از پرداخت بیعانه یا امضای قرارداد، بررسی مستقل حقوقی و ثبتی ضروری است.'
              : 'Finding a suitable place to live is one of the most critical steps for newcomers to Romania. The housing market offers a variety of options, from modern apartments in vibrant city centers to quieter suburban houses. When renting, it is standard practice to pay one month\'s rent upfront alongside a security deposit, and it is crucial to insist on a formal, written contract registered with the tax authorities (ANAF). For those looking to buy, non-EU citizens can freely purchase the physical building (apartments/houses), though direct ownership of land requires a registered Romanian company or a specific bilateral treaty.'}
          </div>

          <div className="flex border-b border-[#dfe6ef] space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setHousingTab('rent')}
              className={`pb-3 font-bold text-sm border-b-2 cursor-pointer ${housingTab === 'rent' ? 'border-[#2F6FED] text-[#2F6FED]' : 'border-transparent text-[#788697]'}`}
            >
              {currentLang === 'fa' ? 'اجاره مسکن' : 'Renting Property'}
            </button>
            <button
              onClick={() => setHousingTab('buy')}
              className={`pb-3 font-bold text-sm border-b-2 cursor-pointer ${housingTab === 'buy' ? 'border-[#2F6FED] text-[#2F6FED]' : 'border-transparent text-[#788697]'}`}
            >
              {currentLang === 'fa' ? 'خرید ملک' : 'Buying Property'}
            </button>
          </div>

          {housingTab === 'rent' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
                <h4 className="font-extrabold text-base text-[#142033]">چک‌لیست قرارداد اجاره (Contract de Inchiriere)</h4>
                <p className="text-sm text-[#526174] leading-relaxed">ثبت قرارداد در اداره مالیات (ANAF)، تصریح مبلغ اجاره به RON، تعیین تکلیف شارژ ساختمان (Intretinere) و حق ثبت آدرس برای اقامت.</p>
              </div>
              <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
                <h4 className="font-extrabold text-base text-[#142033]">ودیعه و پیش‌پرداخت</h4>
                <p className="text-sm text-[#526174] leading-relaxed">معمولاً ۱ ماه اجاره به‌عنوان ودیعه (Garantie) دریافت می‌شود. حتماً صورت‌جلسه تحویل اثاثیه (Proces Verbal) را امضا کنید.</p>
              </div>
            </div>
          ) : (
            <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
              <h4 className="font-extrabold text-base text-[#142033]">ضوابط خرید ملک برای اتباع غیر EU</h4>
              <p className="text-sm text-[#526174] leading-relaxed">شرایط خرید ملک و زمین برای اتباع کشورهای خارج از اتحادیه اروپا به تابعیت، نوع ملک، ساختار معامله و مقررات جاری بستگی دارد. پیش از پرداخت بیعانه یا امضای قرارداد، بررسی مستقل حقوقی و ثبتی ضروری است.</p>
            </div>
          )}

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'کمیسیون آژانس املاک را چه کسی پرداخت می‌کند؟' : 'Who pays the real estate agency fee?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'مبلغ و مسئول پرداخت کمیسیون به قرارداد آژانس و شرایط معامله بستگی دارد و یک نرخ ثابت قانونی برای همه معاملات نیست.' : 'Typically, the tenant and the landlord each pay a commission to the agency, usually equivalent to 50% of one month\'s rent.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم با قرارداد اجاره برای اقامت درخواست دهم؟' : 'Can I use my rental contract for my residence permit application?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، یک قرارداد اجاره رسمی که در اداره مالیات ثبت شده باشد، از مدارک اصلی و الزامی برای تایید آدرس توسط اداره مهاجرت است.' : 'Yes, a legally registered rental contract is a mandatory document for proving your address to IGI for your residence card.'}</p>
              </div>
            </div>
          </div>
        </div>
      );

    // 7. FIRST DAYS CHECKLIST
    case 'first-days-checklist':
    default:
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'راهنمای تازه واردین' : 'New Arrivals Guide'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'چک‌لیست روزهای نخست ورود به رومانی' : 'First-Days Arrival Checklist'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'اقدامات حیاتی در ۷۲ ساعت، ۷ روز و ۳۰ روز اول ورود برای دانشجویان، کارکنان و خانواده‌ها.'
                : 'Essential checklist for your first 72 hours, 7 days, and 30 days in Romania.'}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'روزهای نخست ورود به رومانی می‌تواند چالش‌برانگیز باشد، اما با یک برنامه‌ریزی دقیق همه‌چیز به‌خوبی پیش خواهد رفت. از لحظه فرود، اولویت شما باید انجام کارهای اداری سریع مانند تهیه سیم‌کارت محلی، آشنایی با نقشه حمل‌ونقل عمومی و باز کردن یک حساب بانکی اولیه باشد. بلافاصله پس از آن، لازم است مکان اقامت دائم خود را با امضای قرارداد مسکن قطعی کرده و وضعیت خود را به دانشگاه یا کارفرما اطلاع دهید تا بتوانید پیش از پایان مهلت ویزا، پرونده اقامت خود را با موفقیت در سامانه IGI به ثبت برسانید.'
              : 'Your first few days in Romania can be overwhelming, but a structured approach will help you settle in smoothly. From the moment you land, prioritizing immediate administrative tasks will set the foundation for your stay. Securing a local SIM card, understanding the public transport system, and opening a bank account are your initial milestones. Shortly after, you must finalize your housing contract and report your arrival to your university or employer, ensuring you meet the strict legal deadlines for your residence permit application at the General Inspectorate for Immigration (IGI).'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
              <span className="bg-blue-100 text-[#2F6FED] px-3 py-1 rounded-full text-xs font-bold">۷۲ ساعت اول</span>
              <ul className="space-y-2 text-sm text-[#526174] pt-2">
                <li>✓ تهیه سیم‌کارت رومانی (Orange, Vodafone)</li>
                <li>✓ تهیه کارت حمل و نقل شهری (STB)</li>
                <li>✓ تبدیل ارز اولیه به RON</li>
              </ul>
            </div>
            <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
              <span className="bg-blue-100 text-[#2F6FED] px-3 py-1 rounded-full text-xs font-bold">۷ روز اول</span>
              <ul className="space-y-2 text-sm text-[#526174] pt-2">
                <li>✓ ثبت‌نام در دانشگاه / کارفرما</li>
                <li>✓ امضای قرارداد اجاره مسکن</li>
                <li>✓ افتتاح حساب بانکی اولیه</li>
              </ul>
            </div>
            <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
              <span className="bg-blue-100 text-[#2F6FED] px-3 py-1 rounded-full text-xs font-bold">۳۰ روز اول</span>
              <ul className="space-y-2 text-sm text-[#526174] pt-2">
                <li>✓ نوبت‌دهی و مراجعه به IGI کارت اقامت</li>
                <li>✓ ثبت معاینات پزشکی اقامت</li>
                <li>✓ تشکیل پرونده در سامانه میخک</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا باید پاسپورتم را همیشه در شهر به همراه داشته باشم؟' : 'Do I need to carry my passport with me at all times?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، تا زمانی که کارت اقامت رومانیایی (Permis de Ședere) خود را دریافت نکرده‌اید، داشتن پاسپورت به همراه ویزای معتبر برای اثبات هویت الزامی است.' : 'Yes, until you receive your Romanian residence card, you should carry your original passport with the valid visa to prove your legal status.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چه زمانی باید درخواست کارت اقامت خود را ثبت کنم؟' : 'How soon should I apply for my residence permit?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'شما باید به محض داشتن قرارداد مسکن قطعی و حداکثر ۳۰ روز قبل از پایان مهلت قانونی ویزای فعلی، فرآیند را در سامانه آنلاین IGI آغاز کنید.' : 'You should initiate the process on the IGI online portal as soon as you have your housing contract, and strictly at least 30 days before your 90-day visa expires.'}</p>
              </div>
            </div>
          </div>
        </div>
      );
  }
};
