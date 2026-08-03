'use client';

import React from 'react';
import { Language } from '../types';
import { Button } from './Button';
import { ArrowRight, ArrowLeft } from './Icons';

interface StartHereContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const StartHereContent: React.FC<StartHereContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  const disclaimer = currentLang === 'fa' 
    ? 'منبع: اداره کل مهاجرت رومانی (IGI) — آخرین بررسی: ۲۰۲۶'
    : 'Source: General Inspectorate for Immigration (IGI) — Last reviewed: 2026';

  switch (subRoute) {
    case 'planning-to-come':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'قصد آمدن به رومانی را دارم' : 'Planning to come to Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'انتخاب مسیر مناسب' : 'Choosing the Right Pathway'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'مسیر ورود به رومانی بسته به هدف شما متفاوت است: ' : 'Your entry pathway varies depending on your purpose: '}
                  <button onClick={() => onNavigate('study')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'تحصیل' : 'Study'}</button>{', '}
                  <button onClick={() => onNavigate('work')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'کار' : 'Work'}</button>{', '}
                  <button onClick={() => onNavigate('company')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'ثبت شرکت' : 'Business'}</button>
                  {currentLang === 'fa' ? ' یا پیوست خانواده.' : ' or Family Reunification.'}
                </li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'زمان‌بندی واقع‌بینانه' : 'Realistic Timeline'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'فرآیندهای اداری (ویزا، اقامت) معمولاً هفته‌ها تا ماه‌ها زمان می‌برند؛ بهتر است برنامه‌ریزی از حداقل چند ماه قبل از تاریخ موردنظر شروع شود.' : 'Administrative processes (visa, residency) often take weeks to months; it is best to start planning several months ahead of your target date.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'منابع رسمی برای شروع' : 'Official Starting Resources'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'معرفی IGI (اداره کل مهاجرت) و سفارت/کنسولگری رومانی به‌عنوان مراجع اصلی برای اطلاعات به‌روز.' : 'The General Inspectorate for Immigration (IGI) and the Romanian Embassy/Consulate are the primary official sources for up-to-date information.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'بازه هزینه‌ای تقریبی' : 'Estimated Cost Ranges'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تخمین کلی هزینه‌های شروع (شهریه/ سرمایه شرکت، ویزا، بیمه، پرواز) برای هر مسیر اصلی. ارقام دقیق در صفحات مرتبط موجود است.' : 'Estimated initial costs (tuition/capital, visa, insurance, flight) vary by pathway. Check specific pages for exact figures.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'اشتباهات رایج متقاضیان' : 'Common Mistakes'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'شروع دیرهنگام فرآیند، عدم تطبیق مدارک ترجمه‌شده با استانداردهای رومانی، و نداشتن بیمه معتبر بین‌المللی.' : 'Starting late, failing to match translated documents with Romanian standards, and lacking valid international insurance.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'چک اولیه واجد شرایط بودن' : 'Initial Eligibility Check'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'سوالات کلیدی پیش از شروع: آیا مدرک تحصیلی/تجربه کاری مرتبط دارم؟ آیا تمکن مالی کافی اثبات شده است؟' : 'Key questions before starting: Do I have a relevant degree or work experience? Can I prove sufficient financial means?'}</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'just-arrived':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'تازه به رومانی رسیده‌ام' : 'Just arrived in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'اولویت فوری' : 'Immediate Priority'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ثبت‌نام دریافت کارت اقامت موقت نزد IGI باید ظرف مهلت قانونی (معمولاً پیش از پایان اعتبار ویزای D) انجام شود.' : 'Registering for a temporary residence permit with IGI must be done within the legal timeframe (usually before the Type D visa expires).'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'کارهای عملی روزهای اول' : 'Practical First Tasks'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تهیه سیم‌کارت محلی، افتتاح حساب بانکی (نیاز به CNP یا مدرک اقامت دارد)، و پیدا کردن محل اسکان موقت.' : 'Getting a local SIM card, opening a bank account (requires CNP or residency document), and finding temporary accommodation.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکته مهم آدرس' : 'Important Address Note'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'آدرس محل سکونت باید در مدارک اقامتی ثبت شود؛ تغییر آدرس باید به IGI اطلاع داده شود.' : 'Your residential address must be registered on your residency documents; any change of address must be reported to IGI.'}</li>
              </ul>
            </div>
            
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'رزرو نوبت IGI' : 'IGI Appointment Booking'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'درخواست کارت اقامت نیاز به نوبت قبلی نزد شعبه محلی IGI دارد؛ این نوبت‌ها گاهی پر می‌شوند، لذا زودهنگام اقدام کنید.' : 'Applying for a residence permit requires an appointment at the local IGI branch; these slots fill up quickly, so act early.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
            
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'نظام سلامت اورژانسی' : 'Emergency Healthcare'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'چگونگی دسترسی به خدمات درمانی اورژانسی در روزهای اول (پیش از تکمیل بیمه رسمی CASS). اطلاعات در بخش ' : 'How to access emergency medical services in the first days (before CASS insurance). See '}
                  <button onClick={() => onNavigate('needs/insurance')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'بیمه' : 'Insurance'}</button>
                  {currentLang === 'fa' ? '.' : '.'}
                </li>
              </ul>
            </div>
            
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'مخاطبین ضروری' : 'Emergency Contacts'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'شماره اورژانس رومانی (112) و دسترسی به کنسولگری ایران. ' : 'Romanian emergency number (112) and Iranian consulate access. '}
                  <button onClick={() => onNavigate('romania/embassy-iran')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'سفارت ایران و سامانه میخک' : 'Embassy of Iran & Mikhak'}</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'living-here':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ساکن رومانی هستم' : 'Living in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'تمدید و نگهداری وضعیت اقامتی' : 'Residency Maintenance'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'یادآوری اینکه تمدید کارت اقامت باید پیش از پایان اعتبار انجام شود. اطلاعات بیشتر در ' : 'Permit renewal must be done before expiration. Read more in '}
                  <button onClick={() => onNavigate('immigration/residence-renewal')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'تمدید اقامت' : 'Residence Renewal'}</button>
                  {currentLang === 'fa' ? '.' : '.'}
                </li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'ادغام در جامعه' : 'Social Integration'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'دسترسی به نظام سلامت عمومی (' : 'Accessing the public health system ('}
                  <button onClick={() => onNavigate('needs/insurance')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'بیمه' : 'Insurance'}</button>
                  {currentLang === 'fa' ? ')، امکان یادگیری زبان رومانیایی، و شبکه‌های جامعه ایرانیان مقیم.' : '), learning the Romanian language, and Iranian community networks.'}
                </li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'مسیر بلندمدت' : 'Long-term Pathways'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'پس از دوره‌ای مشخص از اقامت قانونی مستمر، امکان اقدام برای ' : 'After a specific period of continuous legal residency, you may apply for '}
                  <button onClick={() => onNavigate('immigration/long-term-residence')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'اقامت بلندمدت' : 'Long-term Residence'}</button>
                  {currentLang === 'fa' ? ' یا تابعیت وجود دارد.' : ' or Citizenship.'}
                </li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'امور مالی روزمره' : 'Day-to-day Finances'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'افتتاح و مدیریت حساب بانکی و آشنایی با نظام مالیاتی. ' : 'Opening a bank account and understanding personal taxes. '}
                  <button onClick={() => onNavigate('work/taxes-salaries')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'حقوق و مالیات' : 'Taxes & Salaries'}</button>
                </li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'مسکن و اجاره بلندمدت' : 'Long-term Housing'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'نکات کلیدی برای امضای قرارداد اجاره طولانی‌مدت. ' : 'Key tips for signing a long-term rental contract. '}
                  <button onClick={() => onNavigate('needs/housing')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'اجاره و خرید مسکن' : 'Housing & Rentals'}</button>
                </li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'گواهینامه رانندگی' : 'Driving License'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'امکان تبدیل گواهینامه ایرانی یا اخذ گواهینامه جدید. ' : 'Exchanging your Iranian license or getting a new one. '}
                  <button onClick={() => onNavigate('needs/driving-license')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'تبدیل گواهینامه' : 'Driving License Ex'}</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'pre-departure-checklist':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'چک‌لیست پیش از سفر' : 'Pre-departure Checklist'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'مدارک ضروری' : 'Essential Documents'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پاسپورت با حداقل ۳ ماه اعتبار بیشتر از تاریخ انقضای ویزا، ویزای D معتبر، بیمه درمانی بین‌المللی، مدرک تمکن مالی.' : 'Passport valid for at least 3 months beyond visa expiration, a valid Type D visa, international travel insurance, and proof of funds.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'آماده‌سازی مالی و ارتباطی' : 'Financial & Comm Prep'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تبدیل حداقلی ارز برای هزینه‌های اولیه، اطلاع‌رسانی به بانک درباره سفر (در صورت استفاده از کارت بین‌المللی)، ذخیره نسخه دیجیتال از مدارک مهم.' : 'Exchanging a minimum amount of currency for initial expenses, notifying your bank (if using international cards), and saving digital copies of key documents.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'هماهنگی محل اسکان' : 'Accommodation Setup'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تایید رزرو محل اقامت موقت یا خوابگاه پیش از پرواز، توصیه به داشتن آدرس دقیق مقصد.' : 'Confirming your temporary housing or dorm reservation before the flight, and having the exact destination address at hand.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'موارد قابل حمل توصیه شده' : 'Recommended Items'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'مدارک اصل و کپی، پول نقد اولیه، داروهای ضروری با نسخه پزشک در صورت نیاز، و مبدل دوشاخه برق اروپایی.' : 'Original docs and copies, initial cash, essential prescription medications, and a European power adapter.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'هماهنگی ارتباطی پیش از پرواز' : 'Pre-flight Communications'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اطلاع‌رسانی به خانواده از برنامه پرواز، و ذخیره شماره تماس اضطراری سفارت و دانشگاه/کارفرما در موبایل.' : 'Informing family of your flight itinerary, and saving emergency contacts for the embassy and university/employer on your phone.'}</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'first-three-days':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? '۳ روز اول در رومانی' : 'First 3 Days'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'روز ورود' : 'Arrival Day'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'عبور از گمرک و کنترل مرزی، دریافت مهر ورود، اطمینان از صحت اطلاعات پاسپورت.' : 'Clearing customs and border control, getting the entry stamp, and ensuring passport details are correctly processed.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'کارهای فوری' : 'Urgent Tasks'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'تهیه سیم‌کارت محلی برای ارتباط، شناسایی نزدیک‌ترین شعبه IGI محل اقامت برای مراحل بعدی.' : 'Purchasing a local SIM card for communication, and locating the nearest IGI branch for your upcoming residency steps.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'نکته ایمنی' : 'Safety Note'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'نگهداری نسخه از مدارک هویتی به‌صورت جداگانه از اصل مدارک.' : 'Keep copies of your identity documents stored separately from the originals.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'حمل‌ونقل از فرودگاه' : 'Airport Transfer'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'گزینه‌های رایج انتقال از فرودگاه اوتوپنی (OTP) به مرکز شهر شامل تاکسی‌های رسمی، اتوبوس اکسپرس، و قطار/مترو است.' : 'Common transfer options from Otopeni (OTP) airport to the city center include official taxis, express buses, and trains.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'خریدهای ضروری روز اول' : 'Day 1 Essentials'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'سیم‌کارت، وسایل اولیه اسکان، آب و غذای آماده برای ساعات اولیه.' : 'Local SIM card, basic accommodation supplies, water, and ready-to-eat food for the first hours.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'آشنایی اولیه با محیط' : 'Initial Orientation'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پیدا کردن نزدیک‌ترین سوپرمارکت، داروخانه، و ایستگاه حمل‌ونقل عمومی به محل اقامت موقت.' : 'Locating the nearest supermarket, pharmacy, and public transit stop to your temporary accommodation.'}</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'first-month':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ماه اول اقامت' : 'First Month'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'ثبت رسمی اقامت' : 'Official Residency Registration'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'درخواست کارت اقامت موقت نزد IGI باید در این بازه انجام شود. رجوع به ' : 'Requesting a temporary residence permit at IGI must be done in this timeframe. See '}
                  <button onClick={() => onNavigate('immigration/igi-process')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'مراحل IGI' : 'IGI Process'}</button>
                  {currentLang === 'fa' ? '.' : '.'}
                </li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'امور بانکی و مالی' : 'Banking & Finance'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'افتتاح حساب بانکی دائم، دریافت شماره شناسایی مالیاتی در صورت نیاز (برای اجاره ملک یا فعالیت اقتصادی).' : 'Opening a permanent bank account and obtaining a tax identification number if necessary (for renting property or economic activities).'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'ثبت‌نام در خدمات' : 'Service Enrollment'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ثبت‌نام تحصیلی (در صورت دانشجو بودن) یا شروع رسمی کار (در صورت داشتن قرارداد)، ثبت آدرس محل سکونت.' : 'University enrollment (if a student) or officially starting work (if employed), and registering your residential address.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'تثبیت محل زندگی' : 'Securing Housing'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'در صورت اجاره ملک، ثبت قرارداد اجاره و اطلاع آدرس به IGI الزامی است. ' : 'If renting long-term, registering the lease and updating IGI is mandatory. '}
                  <button onClick={() => onNavigate('needs/housing')} className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'اجاره و خرید مسکن' : 'Housing & Rentals'}</button>
                </li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">5</span>
                <span>{currentLang === 'fa' ? 'شبکه‌سازی اولیه' : 'Initial Networking'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'عضویت در گروه‌های محلی جامعه ایرانیان، شرکت در رویدادهای دانشگاه/محل کار برای آشنایی بهتر با محیط.' : 'Joining local Iranian community groups and attending university or workplace events to integrate.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">6</span>
                <span>{currentLang === 'fa' ? 'بررسی وضعیت پرونده' : 'Tracking Application Status'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'پیگیری مداوم وضعیت درخواست کارت اقامت نزد IGI در صورت طولانی شدن روند معمول.' : 'Continuously tracking your residence permit application status with IGI, especially if the timeline exceeds usual estimates.'}</li>
              </ul>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
