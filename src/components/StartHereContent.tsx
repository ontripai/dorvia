'use client';

import React from 'react';
import Link from 'next/link';
import { Language } from '../types';
import { Button } from './Button';
import { ArrowRight, ArrowLeft } from './Icons';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

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
    ? 'منبع: اداره کل مهاجرت رومانی (IGI) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
    : 'Source: General Inspectorate for Immigration (IGI) — Last reviewed: August 2026';

  switch (subRoute) {
    case 'planning-to-come':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="start-here/planning-to-come" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'قصد آمدن به رومانی را دارم' : 'Planning to come to Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'تصمیم‌گیری برای مهاجرت به رومانی گام اول و هیجان‌انگیزی است، اما نیازمند استراتژی دقیق و انتظارات واقع‌بینانه می‌باشد. چه هدف شما تحصیل در دانشگاه‌های تاریخی باشد، چه کار در بخش رو به رشد فناوری اطلاعات، و چه راه‌اندازی یک استارتاپ در اتحادیه اروپا، مسیر ورود شما تمام فرآیند اداری بعدی را تعیین می‌کند. درک تفاوت‌های این مسیرها، هزینه‌های مرتبط و زمان‌بندی‌های دقیق بسیار حیاتی است. شروع برنامه‌ریزی از ماه‌ها قبل و تکیه صرف بر منابع رسمی مانند اداره کل مهاجرت (IGI) شما را از افتادن در دام مشکلات رایج بوروکراتیک نجات خواهد داد.'
              : 'Making the decision to move to Romania is an exciting first step, but it requires a clear strategy and realistic expectations. Whether you are aiming to study at a historic university, secure employment in the booming IT sector, or launch a startup in the European Union, your entry pathway dictates your entire administrative journey. Understanding the distinctions between these routes, the associated costs, and the strict timelines involved is crucial. Starting your preparation months in advance and relying exclusively on official sources like the General Inspectorate for Immigration (IGI) will save you from common bureaucratic pitfalls.'}
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
                  <Link href="/study" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'تحصیل' : 'Study'}</Link>{', '}
                  <Link href="/work" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'کار' : 'Work'}</Link>{', '}
                  <Link href="/company" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'ثبت شرکت' : 'Business'}</Link>
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

          
          <h3 className="text-2xl font-bold text-[#142033] mt-12 mb-6 px-2">{currentLang === 'fa' ? 'چک‌لیست نهایی پیش از سفر' : 'Final Pre-departure Checklist'}</h3>
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
          
          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'کل فرآیند مهاجرت چقدر طول می‌کشد؟' : 'How long does the entire relocation process take?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بسته به مسیر انتخابی (مثل انتظار برای پذیرش دانشگاه یا مجوز کار)، کل فرآیند از برنامه‌ریزی تا رسیدن به رومانی می‌تواند بین ۳ تا ۸ ماه زمان ببرد.' : 'Depending on your pathway—such as waiting for university acceptance or a work permit—the entire process from planning to arriving can take anywhere from 3 to 8 months.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا برای مهاجرت به وکیل نیاز دارم؟' : 'Do I need an immigration lawyer to move to Romania?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'اگرچه از نظر قانونی اجباری نیست، اما برای مسیرهای پیچیده‌ای مانند ثبت شرکت یا مجوز کار، داشتن یک مشاور یا وکیل مهاجرتی به‌شدت توصیه می‌شود.' : 'While not legally required, hiring a specialized consultant or lawyer is highly recommended for complex pathways like company registration or work permits.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="start-here/planning-to-come" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'newly-arrived':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="start-here/newly-arrived" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'تازه به رومانی رسیده‌ام' : 'Just arrived in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'به رومانی خوش آمدید! از لحظه‌ای که از فرودگاه خارج می‌شوید، زمان برای انجام چندین کار اداری حیاتی آغاز می‌شود. اگرچه گشت‌وگذار در محیط جدید وسوسه‌انگیز است، اما اولویت مطلق شما باید تضمین وضعیت قانونی‌تان باشد. ویزای ورود شما (تایپ D) تنها یک پل موقت است؛ شما باید فوراً پروسه دریافت کارت اقامت موقت را از اداره کل مهاجرت (IGI) آغاز کنید. همزمان، ساماندهی زندگی عملی—مانند دریافت شماره تلفن محلی، یافتن مسکن دائم و افتتاح حساب بانکی—پایه‌های زندگی روزمره جدید شما را شکل خواهد داد.'
              : 'Welcome to Romania! The moment you step out of the airport, the clock starts ticking on several critical administrative tasks. While it is natural to want to explore your new surroundings, your absolute first priority must be securing your legal status. Your entry visa (Type D) is only a temporary bridge; you must immediately begin the process of obtaining your temporary residence permit from the General Inspectorate for Immigration (IGI). Simultaneously, setting up your practical life—such as getting a local phone number, finding permanent housing, and opening a bank account—will form the foundation of your new daily routine.'}
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
                  <Link href="/needs/insurance" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'بیمه' : 'Insurance'}</Link>
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
                  <Link href="/romania/embassy-iran" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'سفارت ایران و سامانه میخک' : 'Embassy of Iran & Mikhak'}</Link>
                </li>
              </ul>
            </div>
          </div>

          
          <h3 className="text-2xl font-bold text-[#142033] mt-12 mb-6 px-2">{currentLang === 'fa' ? 'راهنمای ۷۲ ساعت نخست' : 'First 72 Hours Guide'}</h3>
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
          
          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم بلافاصله پس از ورود کار کنم؟' : 'Can I start working immediately after I arrive?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'تنها در صورتی که با ویزای کاری مرتبط با مجوز کار از پیش تاییدشده وارد شده باشید؛ دانشجویان و همراهان خانواده شرایط متفاوتی برای کار دارند.' : 'Only if you arrived on a specific work visa with a pre-approved work permit; students and family members have different working rights.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر ویزای من پیش از صدور کارت اقامت منقضی شود چه؟' : 'What happens if my visa expires before I get my residence card?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'مادامی که درخواست اقامت خود را پیش از انقضای ویزا به‌طور رسمی در سامانه IGI ثبت کرده باشید، اقامت شما تا زمان صدور رای نهایی به‌صورت خودکار تمدید می‌شود.' : 'As long as you have officially submitted your residence permit application to IGI before your visa expires, your legal stay is automatically extended until a decision is made.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="start-here/newly-arrived" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'settling-in':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="start-here/settling-in" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ساکن رومانی هستم' : 'Living in Romania'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">{disclaimer}</div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'تثبیت زندگی در رومانی به معنای تغییر تمرکز از موانع اداری اولیه به سمت ادغام در جامعه و برنامه‌ریزی بلندمدت است. پس از دریافت کارت اقامت معتبر، شما به بخشی از سیستم محلی تبدیل می‌شوید و به امکاناتی چون نظام سلامت عمومی، بانکداری کامل و شبکه‌های اجتماعی دسترسی پیدا می‌کنید. حفظ وضعیت قانونی نیازمند هوشیاری است، زیرا کارت‌های اقامت باید پیش از انقضا تمدید شوند. فراتر از کاغذبازی‌ها، این مرحله درباره ساختن زندگی است—یادگیری زبان رومانیایی، درک تعهدات مالیاتی محلی و شاید هدف‌گذاری برای رسیدن به اقامت دائم یا حتی شهروندی در آینده.'
              : 'Settling into long-term life in Romania means shifting your focus from immediate administrative hurdles to social integration and long-term planning. Once you hold a valid residence permit, you become part of the local system, gaining access to public healthcare, banking, and community networks. Maintaining your legal status requires vigilance, as residence permits must be renewed well before they expire. Beyond paperwork, this phase is about building a life—learning the Romanian language, understanding local tax obligations, and perhaps setting your sights on the ultimate goals of long-term residency or even citizenship.'}
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
                  <Link href="/immigration/residence-renewal" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'تمدید اقامت' : 'Residence Renewal'}</Link>
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
                  <Link href="/needs/insurance" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'بیمه' : 'Insurance'}</Link>
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
                  <Link href="/immigration/long-term-residence" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'اقامت بلندمدت' : 'Long-term Residence'}</Link>
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
                  <Link href="/work/taxes-salaries" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'حقوق و مالیات' : 'Taxes & Salaries'}</Link>
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
                  <Link href="/needs/housing" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'اجاره و خرید مسکن' : 'Housing & Rentals'}</Link>
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
                  <Link href="/needs/driving-license" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'تبدیل گواهینامه' : 'Driving License Ex'}</Link>
                </li>
              </ul>
            </div>
          </div>

          
          <h3 className="text-2xl font-bold text-[#142033] mt-12 mb-6 px-2">{currentLang === 'fa' ? 'اقدامات ضروری ماه اول' : 'Essential First-Month Actions'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'ثبت رسمی اقامت' : 'Official Residency Registration'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>
                  {currentLang === 'fa' ? 'درخواست کارت اقامت موقت نزد IGI باید در این بازه انجام شود. رجوع به ' : 'Requesting a temporary residence permit at IGI must be done in this timeframe. See '}
                  <Link href="/immigration/igi-process" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'مراحل IGI' : 'IGI Process'}</Link>
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
                  <Link href="/needs/housing" className="text-[#2F6FED] hover:underline font-medium">{currentLang === 'fa' ? 'اجاره و خرید مسکن' : 'Housing & Rentals'}</Link>
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
          
          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چه زمانی می‌توانم برای اقامت دائم درخواست دهم؟' : 'How soon can I apply for permanent residency?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'اتباع غیراروپایی عموماً می‌توانند پس از ۵ سال اقامت قانونی و مستمر در رومانی، مشروط به احراز شرایط خاص، برای اقامت بلندمدت اقدام کنند.' : 'Non-EU citizens can generally apply for long-term residency after 5 years of continuous, legal stay in Romania, subject to specific conditions.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم خانواده‌ام را برای زندگی به رومانی بیاورم؟' : 'Can I bring my family to live with me?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، در صورتی که کارت اقامتی با اعتبار حداقل یک سال داشته باشید، ممکن است واجد شرایط ثبت درخواست پیوست خانواده برای همسر و فرزندان زیر سن قانونی خود باشید.' : 'Yes, if you hold a valid residence permit valid for at least one year, you may be eligible to apply for Family Reunification for your spouse and minor children.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="start-here/settling-in" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    default:
      return null;
  }
};
