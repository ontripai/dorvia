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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'اولویت فوری' : 'Immediate Priority'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'ثبت‌نام دریافت کارت اقامت موقت نزد IGI باید ظرف مهلت قانونی (معمولاً پیش از پایان اعتبار ویزای D) انجام شود.' : 'Registering for a temporary residence permit with IGI must be done within the legal timeframe (usually before the Type D visa expires).'}</li>
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
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
