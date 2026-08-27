'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { CommentsSection } from './CommentsSection';
import { IgiProcessContent } from './IgiProcessContent';
import { FamilyReunificationContent } from './FamilyReunificationContent';
import { EvaluationCTA } from './EvaluationCTA';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface ImmigrationOverviewContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const ImmigrationOverviewContent: React.FC<ImmigrationOverviewContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  switch (subRoute) {
    case 'igi-process':
      return <IgiProcessContent currentLang={currentLang} />;

    case 'residence-renewal':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 text-right rtl">
          <Breadcrumb slugRoute="immigration/residence-renewal" currentLang={currentLang} onNavigate={onNavigate} />

          {/* HERO PANEL */}
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
              <span>{currentLang === 'fa' ? 'راهنمای رسمی تمدید کارت اقامت رومانی' : 'Official Residence Renewal Guide'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {currentLang === 'fa' ? 'راهنمای تمدید اقامت موقت نزد اداره مهاجرت (IGI)' : 'Temporary Residence Renewal Guide at IGI'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای کامل مراحل قانونی تمدید کارت اقامت، مهلت ۳۰ روزه درخواست، زمان‌بندی‌های تاییدشده و مدارک لازم بر اساس آیین‌نامه OUG 194/2002.'
                : 'Complete guide to legal residence permit renewal, 30-day advance application rule, verified timelines, and required documents.'}
            </p>
            <div className="text-xs text-slate-400 pt-2 flex items-center space-x-2 rtl:space-x-reverse border-t border-slate-700/60">
              <span>🏛️</span>
              <span>
                {currentLang === 'fa'
                  ? 'منبع رسمی: اداره کل مهاجرت رومانی (IGI)، قوانین OUG 194/2002 — igi.mai.gov.ro'
                  : 'Official Source: General Inspectorate for Immigration — igi.mai.gov.ro'}
              </span>
            </div>
          </div>

          {/* SECTION 0: TABLE OF CONTENTS (پرش سریع) */}
          <div className="bg-white p-6 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>📌</span>
              <span>{currentLang === 'fa' ? 'فهرست محتوای این راهنما (پرش سریع)' : 'Table of Contents'}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              <a href="#renewal-quick-answer" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
                {currentLang === 'fa' ? '۱. پاسخ سریع' : '1. Quick Answer'}
              </a>
              <a href="#renewal-prerequisites" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
                {currentLang === 'fa' ? '۲. جدول شرایط تمدید' : '2. Renewal Table'}
              </a>
              <a href="#renewal-reality" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
                {currentLang === 'fa' ? '۲.۵ واقعیت صف و تاخیر IGI' : '2.5 Real Queues & Delays'}
              </a>
              <a href="#renewal-steps" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
                {currentLang === 'fa' ? '۳. مراحل گام‌به‌گام' : '3. Step-by-Step'}
              </a>
              <a href="#renewal-docs" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
                {currentLang === 'fa' ? '۴. مدارک لازم' : '4. Required Documents'}
              </a>
              <a href="#renewal-timelines" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
                {currentLang === 'fa' ? '۵. مهلت ۳۰ روزه درخواست' : '5. 30-Day Rule'}
              </a>
              <a href="#renewal-incomplete" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
                {currentLang === 'fa' ? '۶. پرونده‌های ناقص' : '6. Incomplete Files'}
              </a>
              <a href="#renewal-references" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
                {currentLang === 'fa' ? '۷. منابع رسمی' : '7. Official References'}
              </a>
              <a href="#renewal-related" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
                {currentLang === 'fa' ? '۸. مطالب مرتبط' : '8. Related Content'}
              </a>
            </div>
          </div>

          {/* SECTION 1: QUICK ANSWER */}
          <div id="renewal-quick-answer" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
              {currentLang === 'fa' ? 'پاسخ سریع: شرایط تمدید کارت اقامت چیست؟' : 'Quick Answer: What are the Residence Renewal Requirements?'}
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'تمدید کارت اقامت موقت در رومانی نزد اداره کل مهاجرت (IGI) انجام می‌پذیرد. طبق قوانین رسمی، درخواست تمدید باید حداقل ۳۰ روز پیش از انقضای کارت فعلی ثبت گردد. تا زمانی که هدف اولیه اقامت (تحصیل، کار، ازدواج یا ثبت شرکت) برقرار باشد، اقامت شما برای دوره‌های جدید قابل تمدید است.'
                : 'Temporary residence permit renewal is handled by the General Inspectorate for Immigration (IGI). By law, applications must be submitted at least 30 days before current permit expiration. As long as your original purpose of stay (study, work, marriage, business) remains valid, your residence permit will be extended.'}
            </p>
          </div>

          {/* SECTION 2: PREREQUISITES TABLE */}
          <div id="renewal-prerequisites" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>📊</span>
              <span>{currentLang === 'fa' ? 'جدول ضوابط تمدید کارت اقامت بر اساس دسته اتباع' : 'Residence Renewal Regulations Table'}</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#071B3D] text-white">
                    <th className="p-3.5 rounded-r-xl">{currentLang === 'fa' ? 'دسته متقاضی' : 'Applicant Category'}</th>
                    <th className="p-3.5">{currentLang === 'fa' ? 'مهلت قانونی ثبت درخواست' : 'Application Submission Rule'}</th>
                    <th className="p-3.5">{currentLang === 'fa' ? 'مدت رسیدگی قانونی IGI' : 'IGI Processing Time'}</th>
                    <th className="p-3.5 rounded-l-xl">{currentLang === 'fa' ? 'مدت اعتبار جدید' : 'New Permit Validity'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe6ef] text-[#526174]">
                  <tr className="hover:bg-[#f8fafc]">
                    <td className="p-3.5 font-bold text-[#142033]">{currentLang === 'fa' ? 'دانشجویان غیر EU' : 'Non-EU Students'}</td>
                    <td className="p-3.5">{currentLang === 'fa' ? 'حداقل ۳۰ روز قبل از انقضا' : 'Min 30 days before expiration'}</td>
                    <td className="p-3.5 font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'حداکثر ۳۰ روز' : 'Maximum 30 days'}</td>
                    <td className="p-3.5">{currentLang === 'fa' ? '۱ سال (تکرار تا پایان تحصیل)' : '1 year (Renewable for study duration)'}</td>
                  </tr>
                  <tr className="hover:bg-[#f8fafc]">
                    <td className="p-3.5 font-bold text-[#142033]">{currentLang === 'fa' ? 'نیروی کار / کارمندان' : 'Employees / Work Permit'}</td>
                    <td className="p-3.5">{currentLang === 'fa' ? 'حداقل ۳۰ روز قبل از انقضا' : 'Min 30 days before expiration'}</td>
                    <td className="p-3.5 font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'حداکثر ۳۰ روز' : 'Maximum 30 days'}</td>
                    <td className="p-3.5">{currentLang === 'fa' ? 'مطابق با قرارداد کاری (۱ تا ۲ سال)' : 'Matches employment contract (1-2 yrs)'}</td>
                  </tr>
                  <tr className="hover:bg-[#f8fafc]">
                    <td className="p-3.5 font-bold text-[#142033]">{currentLang === 'fa' ? 'اعضای خانواده غیر EU اتباع EU' : 'Non-EU Family Members of EU Citizens'}</td>
                    <td className="p-3.5">{currentLang === 'fa' ? 'پیش از انقضای کارت فعلی' : 'Before current card expiration'}</td>
                    <td className="p-3.5 font-bold text-emerald-600">{currentLang === 'fa' ? 'حداکثر ۳۰ روز (تمدیدهای بعدی)' : 'Max 30 days (renewals)'}</td>
                    <td className="p-3.5">{currentLang === 'fa' ? 'حداکثر ۵ سال' : 'Up to 5 years'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2.5: THE REAL EXPERIENCE — QUEUES, BACKLOG, AND REGIONAL GAPS */}
          <div id="renewal-reality" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🕰️</span>
              <span>{currentLang === 'fa' ? 'واقعیت میدانی: چرا نوبت‌دهی IGI گاهی خیلی طول می‌کشد؟' : 'The Real Experience: Why IGI Appointments Sometimes Take So Long'}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'قوانین بالا مهلت‌های رسمی هستند، اما تجربه واقعی متقاضیان همیشه با همین سرعت پیش نمی‌رود. بر اساس تحلیل رسمی خود اداره کل مهاجرت (IGI) که در سال ۲۰۲۶ منتشر شد، جمعیت اتباع خارجی تحت پوشش این اداره در ۵ سال اخیر حدود ۴ برابر شده و به نزدیک ۲۹۹ هزار نفر رسیده، در حالی که تعداد کارکنان اداره از ۱٬۸۰۰ نفر فراتر نرفته است. همین گزارش نشان می‌دهد از ۱۳۲٬۳۴۷ درخواست مجوز کار سال ۲۰۲۴، فقط ۱۰۵٬۹۸۸ مورد (حدود ۸۰٪) تایید شده — نشانه‌ای روشن از حجم بالای پرونده‌های معطل در سیستم.'
                : 'The rules above are the official deadlines, but real applicant experience does not always move that fast. According to IGI\'s own official 2026 analysis, the number of foreign nationals under its management grew roughly 4x in five years to nearly 299,000, while staffing has stayed under 1,800 people. The same report shows that of 132,347 work-permit applications filed in 2024, only 105,988 (~80%) were approved — a clear sign of a system carrying a heavy backlog.'}
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 leading-relaxed">
              <strong className="block font-bold mb-1">{currentLang === 'fa' ? 'یک مورد واقعی گزارش‌شده:' : 'A reported real case:'}</strong>
              {currentLang === 'fa'
                ? 'طبق گزارش نشریه The Bite (وابسته به مدرسه بین‌المللی بخارست)، یکی از کارمندان خارجی شرکت Dacia/Renault با وجود ثبت درخواست تمدید ۳ ماه پیش از انقضا، تا ۲ ماه پس از انقضای کارت نوبتی دریافت نکرد و ناچار به مراجعه حضوری چندروزه شد؛ در همین بازه، حساب‌های بانکی او (از جمله Revolut) به‌طور موقت مسدود شدند تا کارت جدید صادر شود. این نمونه نشان می‌دهد چرا داشتن نسخه چاپی رسید ثبت درخواست (نه فقط اعتماد به تاریخ انقضای کارت قدیم) در این بازه گذار اهمیت دارد.'
                : 'Per a report from The Bite (affiliated with the American International School of Bucharest), a foreign employee at Dacia/Renault filed her renewal 3 months before expiry but received no appointment until 2 months after her card had already expired, and had to queue in person for several days. During that gap her bank accounts (including Revolut) were temporarily frozen until the new card was issued — a concrete illustration of why keeping your renewal filing receipt on hand matters during this transition window, not just trusting the old card\'s expiry date.'}
            </div>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'خبر خوب: در تاریخ ۳۰ اکتبر ۲۰۲۴، اداره IGI به‌طور رسمی محدودیت قبلی «حداکثر ۹۰ روز پیش از نوبت» را در پورتال آنلاین (portal.igi.mai.gov.ro) حذف کرد و یک ایمیل اختصاصی برای گزارش مشکلات فنی پورتال راه‌اندازی نمود: '
                : 'The good news: on October 30, 2024, IGI officially removed the portal\'s previous "book at most 90 days ahead" restriction on portal.igi.mai.gov.ro, and set up a dedicated email address for reporting portal technical issues: '}
              <span className="font-mono font-bold text-[#142033]">sesizariportal.igi@mai.gov.ro</span>
              {currentLang === 'fa'
                ? '. اگر پورتال خطا داد یا نوبت خالی پیدا نکردید، پیش از ناامید شدن، مستقیماً از همین ایمیل استفاده کنید. همچنین طبق قانون شماره ۲۸/۲۰۲۴ (اصلاحیه OUG 194/2002، اجرایی از ۵ مارس ۲۰۲۴)، مهلت ۳۰ روزه تکمیل مدارک ناقص که در بخش ۶ همین صفحه توضیح داده شد، رسماً در قانون تثبیت شده است.'
                : '. If the portal errors out or shows no available slots, use this email directly before giving up. Separately, under Law 28/2024 (amending OUG 194/2002, effective March 5, 2024), the 30-day incomplete-file cure period described in Section 6 below was formally written into law.'}
            </p>
            <p className="text-xs text-[#788697] leading-relaxed">
              {currentLang === 'fa'
                ? 'منابع: HotNews (مارس و می ۲۰۲۶)، The Bite – AISB، پورتال رسمی IGI (اطلاعیه ۳۰ اکتبر ۲۰۲۴)، Universul Juridic (تحلیل قانون ۲۸/۲۰۲۴). داده‌های تفاوت زمان انتظار بین استان‌ها (مثلاً بخارست در برابر شهرهای کوچک‌تر) برای دسته‌های اقامتی متفاوت است و به‌روز نمی‌شود؛ آنچه بالا آمد میانگین کلی سیستم است، نه تضمین برای هر پرونده.'
                : 'Sources: HotNews (March & May 2026), The Bite – AISB, official IGI portal notice (Oct 30, 2024), Universul Juridic (Law 28/2024 analysis). County-to-county wait-time gaps vary by permit category and are not tracked in real time; the figures above describe overall system strain, not a guarantee for any specific case.'}
            </p>
          </div>

          {/* SECTION 3: STEP-BY-STEP RENEWAL */}
          <div id="renewal-steps" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
              {currentLang === 'fa' ? 'مراحل تمدید گام‌به‌گام کارت اقامت در IGI' : 'Step-by-Step Residence Permit Renewal'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-5 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-2">
                <span className="font-extrabold text-[#2F6FED]">۱. تمدید مدرک اصلی (گواهی اشتغال/تحصیل)</span>
                <p className="text-[#526174] leading-relaxed">
                  {currentLang === 'fa'
                    ? 'دریافت گواهی اشتغال به تحصیل جدید، تمدید قرارداد کاری یا مدرک ثبت شرکت.'
                    : 'Obtain updated enrollment certificate, extended work contract, or business standing.'}
                </p>
              </div>
              <div className="p-5 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-2">
                <span className="font-extrabold text-[#2F6FED]">۲. ثبت پورتال آنلاین IGI</span>
                <p className="text-[#526174] leading-relaxed">
                  {currentLang === 'fa'
                    ? 'بارگذاری اسکن مدارک در پورتال آنلاین portal.igi.mai.gov.ro و اخذ نوبت مراجعه.'
                    : 'Upload document scans on portal.igi.mai.gov.ro and receive appointment receipt.'}
                </p>
              </div>
              <div className="p-[#f7f9fc] p-5 rounded-xl border border-[#dfe6ef] space-y-2">
                <span className="font-extrabold text-[#2F6FED]">۳. مراجعه حضوری به IGI</span>
                <p className="text-[#526174] leading-relaxed">
                  {currentLang === 'fa'
                    ? 'مراجع به اداره IGI محلی در زمان تعیین‌شده، ارائه اصل مدارک و پرداخت تعرفه صدور کارت.'
                    : 'Visit local IGI office at scheduled time, submit original files, and pay state issuance fee.'}
                </p>
              </div>
              <div className="p-5 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-2">
                <span className="font-extrabold text-[#2F6FED]">۴. تحویل کارت اقامت جدید</span>
                <p className="text-[#526174] leading-relaxed">
                  {currentLang === 'fa'
                    ? 'پس از طی بازه ۳۰ روزه رسیدگی، تحویل کارت اقامت تمدیدشده جدید.'
                    : 'Receive your new renewed residence card after the 30-day legal processing period.'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: REQUIRED DOCUMENTS CHECKLIST */}
          <div id="renewal-docs" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
              {currentLang === 'fa' ? 'چک‌لیست مدارک لازم برای تمدید اقامت' : 'Renewal Documents Checklist'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#526174]">
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{currentLang === 'fa' ? 'اصل و کپی پاسپورت معتبر' : 'Original & copy of valid passport'}</span>
              </div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{currentLang === 'fa' ? 'کارت اقامت فعلی (اصل و کپی)' : 'Current residence card'}</span>
              </div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  {currentLang === 'fa' ? 'مدرک محل اسکان معتبر — ' : 'Proof of accommodation — '}
                  <Link href="/needs/housing" className="text-[#2F6FED] font-bold hover:underline">
                    {currentLang === 'fa' ? 'راهنمای اجاره و مسکن' : 'Housing & Lease Guide'}
                  </Link>
                </span>
              </div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  {currentLang === 'fa' ? 'بیمه درمانی معتبر در رومانی — ' : 'Valid health insurance — '}
                  <Link href="/needs" className="text-[#2F6FED] font-bold hover:underline">
                    {currentLang === 'fa' ? 'راهنمای بیمه درمانی' : 'Health Insurance Guide'}
                  </Link>
                </span>
              </div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{currentLang === 'fa' ? 'مدرک تمکن مالی (حساب بانکی / حقوق)' : 'Proof of financial means'}</span>
              </div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{currentLang === 'fa' ? 'رسید پرداخت عوارض صدور کارت اقامت' : 'Permit fee payment receipt'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: OFFICIAL 30-DAY TIMELINE */}
          <div id="renewal-timelines" className="bg-[#eef3f8] p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
              {currentLang === 'fa' ? 'مهلت قانونی ثبت درخواست: حداقل ۳۰ روز پیش از انقضای کارت فعلی' : 'Legal Rule: Apply at Least 30 Days Before Expiration'}
            </h2>
            <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'توصیه رسمی و الزام قانونی IGI: تمامی متقاضیان موظفند پرونده تمدید اقامت خود را حداقل ۳۰ روز پیش از انقضای کارت فعلی ثبت نمایند. ثبت درخواست پس از این مهلت قانونی می‌تواند منجر به جریمه نقدی یا اختلال در روند قانونی اقامت گردد.'
                : 'Official IGI requirement: All applicants must submit their renewal applications at least 30 days prior to their permit expiration date. Late submissions may lead to fines or residency status complications.'}
            </p>
          </div>

          {/* SECTION 6: INCOMPLETE FILES */}
          <div id="renewal-incomplete" className="bg-amber-50 p-6 sm:p-8 rounded-2xl border border-amber-200 space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-900">
              {currentLang === 'fa' ? 'نقص مدارک و مهلت ۳۰ روزه اضافه IGI' : 'Incomplete Files & 30-Day Extension Period'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              {currentLang === 'fa'
                ? 'اگر مدارک ارائه‌شده در زمان تحویل ناقص باشند، اداره IGI تا ۳۰ روز مهلت برای ارائه مدارک تکمیلی اعطا می‌کند. این مهلت اضافه، بازه زمانی رسیدگی به پرونده را رسماً متوقف (Suspend) می‌کند تا مدرک جدید ارائه گردد.'
                : 'If submitted documents are incomplete, IGI allows up to 30 days to complement the file. This extension officially suspends the processing period until missing items are submitted.'}
            </p>
          </div>

          {/* SECTION 6.5: LEGAL REMEDY FOR UNJUSTIFIED DELAY */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#2F6FED]/30 shadow-sm space-y-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>⚖️</span>
              <span>{currentLang === 'fa' ? 'اگر تمدید بدون دلیل به تاخیر افتاد چه کنم؟' : 'What If My Renewal Is Unjustifiably Delayed?'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'اگر پرونده تمدید شما فراتر از مهلت‌های قانونی ذکرشده بدون توضیح معلق بماند، طبق قانون دادرسی اداری رومانی (Legea nr. 554/2004) حق دارید ظرف ۶ ماه از تاریخ سررسید پاسخ، علیه این تاخیر یا سکوت اداری IGI به دادگاه اداری شکایت کنید. این مسیر نیازمند مشورت با وکیل متخصص حقوق اداری است — '
                : 'If your renewal file remains pending beyond the legal deadlines above without explanation, under the Administrative Contentious Law (Legea nr. 554/2004) you have the right to sue IGI\'s delay or administrative silence in the administrative court within 6 months of the deadline. This route requires consulting an administrative-law attorney — '}
              <Link href="/immigration/igi-process" className="text-[#2F6FED] font-bold hover:underline">
                {currentLang === 'fa' ? 'جزئیات این راهکار قانونی را در راهنمای IGI ببینید ←' : 'see full details in the IGI process guide →'}
              </Link>
            </p>
          </div>

          {/* SECTION 7: OFFICIAL REFERENCES */}
          <div id="renewal-references" className="bg-[#071B3D] text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg sm:text-xl font-extrabold border-b border-slate-700 pb-3 flex items-center space-x-2 rtl:space-x-reverse">
              <span>🔗</span>
              <span>{currentLang === 'fa' ? 'منابع رسمی استعلام تمدید اقامت IGI' : 'Official Residence Renewal References'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a href="https://igi.mai.gov.ro" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0b2b55] hover:bg-[#2F6FED] rounded-xl flex items-center justify-between transition-colors">
                <span>{currentLang === 'fa' ? 'پورتال اصلی اداره مهاجرت IGI — igi.mai.gov.ro' : 'Official IGI Portal'}</span>
                <span>↗</span>
              </a>
              <a href="https://portal.igi.mai.gov.ro" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0b2b55] hover:bg-[#2F6FED] rounded-xl flex items-center justify-between transition-colors">
                <span>{currentLang === 'fa' ? 'سامانه نوبت‌دهی آنلاین IGI' : 'IGI Online Portal'}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* SECTION 8: DATE TAG & RELATED CONTENT */}
          <div id="renewal-related" className="space-y-6">
            <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl text-center text-xs text-[#788697] font-semibold">
              {currentLang === 'fa'
                ? 'آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶. منبع: igi.mai.gov.ro و OUG 194/2002.'
                : 'Last Review: August 2026. Source: igi.mai.gov.ro & OUG 194/2002.'}
            </div>

            {/* RELATED CONTENT BOX */}
            <div className="bg-white p-6 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span>📚</span>
                <span>{currentLang === 'fa' ? 'مطالب مرتبط و گام‌های بعدی' : 'Related Content & Next Steps'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
                <Link href="/immigration/long-term-residence" className="p-4 bg-[#f8fafc] hover:bg-[#eef3f8] border border-[#dfe6ef] rounded-xl space-y-1 block transition-colors">
                  <span className="text-[#2F6FED]">🇷🇴</span>
                  <div className="text-[#142033] font-extrabold">{currentLang === 'fa' ? 'اقامت بلندمدت و دائم رومانی' : 'Long-Term Residence'}</div>
                  <p className="text-[11px] text-[#788697] font-normal">{currentLang === 'fa' ? 'شرایط تبدیل اقامت موقت به ۵ ساله دائم' : 'Transition from temporary to permanent'}</p>
                </Link>
                <Link href="/immigration/citizenship" className="p-4 bg-[#f8fafc] hover:bg-[#eef3f8] border border-[#dfe6ef] rounded-xl space-y-1 block transition-colors">
                  <span className="text-[#2F6FED]">🏛️</span>
                  <div className="text-[#142033] font-extrabold">{currentLang === 'fa' ? 'شهروندی و پاسپورت رومانی' : 'Romanian Citizenship'}</div>
                  <p className="text-[11px] text-[#788697] font-normal">{currentLang === 'fa' ? 'شرایط و قوانین اخذ تابعیت رومانی' : 'Citizenship requirements & laws'}</p>
                </Link>
                <Link href="/needs/driving-license" className="p-4 bg-[#f8fafc] hover:bg-[#eef3f8] border border-[#dfe6ef] rounded-xl space-y-1 block transition-colors">
                  <span className="text-[#2F6FED]">🚗</span>
                  <div className="text-[#142033] font-extrabold">{currentLang === 'fa' ? 'تبدیل گواهی‌نامه رانندگی' : 'Driving License Conversion'}</div>
                  <p className="text-[11px] text-[#788697] font-normal">{currentLang === 'fa' ? 'تبدیل گواهی‌نامه پس از اخذ کارت اقامت' : 'Convert foreign license with residency card'}</p>
                </Link>
              </div>
            </div>
          </div>

          {/* SECTION 8.5: FAQ */}
          <div className="mt-2 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چند وقت قبل از انقضای کارت اقامت باید برای تمدید اقدام کنم؟' : 'How long before my residence card expires should I apply for renewal?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'درخواست تمدید باید حداقل ۳۰ روز پیش از تاریخ انقضای کارت فعلی نزد اداره محلی IGI ثبت شود؛ ثبت دیرهنگام می‌تواند منجر به وقفه در وضعیت قانونی اقامت شود.' : 'The renewal application must be filed with your local IGI office at least 30 days before your current card expires; filing late can create a gap in your legal residence status.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر آدرس محل سکونتم عوض شده چه مدرکی لازم دارم؟' : 'What proof do I need if I changed my address?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'باید مدرک به‌روز اثبات محل سکونت (مثلاً قرارداد اجاره‌ی ثبت‌شده نزد ANAF) ارائه دهید؛ برای جزئیات کامل به' : 'You must present up-to-date proof of address (e.g. a rental contract registered with ANAF); see'} <Link href="/needs/housing" className="text-[#2F6FED] font-bold hover:underline">{currentLang === 'fa' ? 'صفحه مسکن' : 'the housing page'}</Link> {currentLang === 'fa' ? 'مراجعه کنید.' : 'for full details.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر پورتال IGI خطا داد یا نوبت خالی پیدا نکردم چه کنم؟' : 'What if the IGI portal errors out or shows no available appointments?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'از ۳۰ اکتبر ۲۰۲۴ اداره IGI یک ایمیل رسمی برای گزارش مشکلات فنی پورتال راه‌اندازی کرده: sesizariportal.igi@mai.gov.ro — پیش از تسلیم شدن، مشکل را دقیق (با اسکرین‌شات) به همین ایمیل گزارش دهید.' : 'Since October 30, 2024, IGI has run a dedicated email for reporting portal technical issues: sesizariportal.igi@mai.gov.ro — describe the problem in detail (with a screenshot) before assuming there is nothing you can do.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چرا گاهی نوبت تمدید حتی تا ماه‌ها بعد از انقضای کارت داده می‌شود؟' : 'Why can renewal appointments sometimes fall months after the card expires?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق تحلیل رسمی IGI برای سال ۲۰۲۶، جمعیت خارجیان تحت پوشش این اداره در ۵ سال حدود ۴ برابر شده در حالی که تعداد کارکنان ثابت مانده؛ این فشار سیستمی می‌تواند در برخی مواقع و برخی استان‌ها به تاخیر منجر شود. رسید ثبت درخواست خود را همیشه همراه داشته باشید.' : 'Per IGI\'s own official 2026 analysis, the foreign population it manages grew roughly 4x in five years while staffing stayed flat — this systemic pressure can cause delays in some periods and counties. Always keep your application receipt on hand as proof you filed on time.'}</p>
              </div>
            </div>
          </div>

          {/* SECTION 9: COMMENTS SECTION */}
          <ParentHubFooterCard slugRoute="immigration/residence-renewal" currentLang={currentLang} onNavigate={onNavigate} />
          <CommentsSection pagePath="immigration/residence-renewal" currentLang={currentLang} />
        </div>
      );

    case 'long-term-residence':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="immigration/long-term-residence" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'اقامت بلندمدت' : 'Long-term Residence'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: اداره کل مهاجرت رومانی (IGI) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: General Inspectorate for Immigration (IGI) — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'اقامت بلندمدت (Drept de Ședere pe Termen Lung) در رومانی نقطه‌عطفی در مسیر مهاجرتی اتباع غیراروپایی است که ثبات و حقوقی تقریباً برابر با شهروندان محلی (به جز حق رأی) را برای آن‌ها به ارمغان می‌آورد. این نوع اقامت، پس از اثبات حضور قانونی و مستمر در خاک رومانی به مدت زمان مشخص (معمولاً ۵ سال) و با احراز شرایطی نظیر داشتن درآمد کافی، مسکن مناسب و آشنایی با زبان رومانیایی، توسط IGI اعطا می‌شود. دارندگان این وضعیت می‌توانند بدون نیاز به مجوز کار مجزا در بازار کار رومانی فعالیت کنند و مسیر بسیار هموارتری برای اخذ تابعیت این کشور خواهند داشت.'
              : 'Long-term residence (Drept de Ședere pe Termen Lung) in Romania is a milestone in the immigration journey of non-EU citizens, offering stability and rights almost equal to those of local citizens (except voting rights). This status is granted by IGI after proving continuous and legal physical presence in Romanian territory for a specified period (typically 5 years) and meeting requirements such as sufficient income, appropriate housing, and familiarity with the Romanian language. Holders of this status can participate in the labor market without needing a separate work permit and enjoy a much smoother path toward acquiring citizenship.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'چیستی اقامت بلندمدت' : 'What is Long-term Residence'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'کارت اقامت ۵ ساله با قابلیت تمدید نامحدود' : '5-year residence card with unlimited renewals'}</li>
                <li>{currentLang === 'fa' ? 'دسترسی آزاد به بازار کار بدون نیاز به Aviz de Muncă' : 'Free access to the labor market without work permits'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'شرایط احراز' : 'Eligibility Requirements'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'حداقل ۵ سال حضور قانونی و پیوسته در رومانی' : 'At least 5 years of continuous legal residence'}</li>
                <li>{currentLang === 'fa' ? 'عدم غیبت بیش از ۶ ماه متوالی یا ۱۰ ماه مجموع در ۵ سال' : 'Absence under 6 consecutive months or 10 months total'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'مدارک و زبان' : 'Docs & Language'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اثبات تمکن مالی و بیمه درمانی فعال' : 'Proof of financial means & health insurance'}</li>
                <li>{currentLang === 'fa' ? 'آزمون مقدماتی زبان رومانیایی نزد کمیسیون IGI' : 'Basic Romanian language exam at IGI'}</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-amber-950 leading-relaxed">
            {currentLang === 'fa'
              ? 'توجه: مبلغ دقیق عوارض صدور کارت اقامت بلندمدت ممکن است بسته به دسته اقامتی متفاوت باشد و به‌روزرسانی شود؛ برای مبلغ دقیق در پرونده خودتان با اداره محلی IGI تماس بگیرید یا از صفحه '
              : 'Note: the exact fee for long-term residence issuance can vary by category and is periodically updated; confirm the precise figure for your case with your local IGI office, or see the '}
            <Link href="/immigration/igi-process" className="text-amber-900 font-bold hover:underline">
              {currentLang === 'fa' ? 'راهنمای عمومی هزینه‌های IGI' : 'general IGI fee guide'}
            </Link>
            {currentLang === 'fa' ? ' برای بازه هزینه‌های استاندارد استفاده کنید.' : ' for the standard fee range.'}
          </div>

          {/* NARRATIVE: WHAT THE LANGUAGE TEST ACTUALLY IS, SCHENGEN MYTH, AND THE 5-YEAR CALCULATION TRAP */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🔍</span>
              <span>{currentLang === 'fa' ? 'نکاتی که در آزمون زبان و محاسبه ۵ سال معمولاً اشتباه فهمیده می‌شود' : 'What Gets Commonly Misunderstood About the Language Test & the 5-Year Count'}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'برخلاف تصور رایج، «آزمون زبان رومانیایی» برای اقامت بلندمدت یک آزمون رسمی مجزا با سطح مشخص (مثل A1 یا A2 چارچوب اروپایی CEFR) نیست. متن قانون فقط عبارت «آشنایی حداقل در سطح رضایت‌بخش با زبان رومانیایی» را به کار می‌برد، و طبق اطلاعیه‌های رسمی IGI، این ارزیابی معمولاً به‌صورت غیررسمی و در همان جلسه تحویل مدارک توسط کارمند IGI انجام می‌شود — نه یک آزمون کتبی استاندارد جداگانه. این بدان معناست که تشخیص «کافی بودن» سطح زبان تا حدی به صلاحدید همان کارمند بستگی دارد، پس توصیه می‌شود پیش از مراجعه، حداقل توانایی مکالمه ساده و خواندن مدارک رسمی رومانیایی را تمرین کنید.'
                : 'Contrary to common belief, the "Romanian language test" for long-term residence is not a separate, formally certified exam with a defined level (like CEFR A1 or A2). The law\'s actual wording only requires "at least a satisfactory level" of Romanian, and per official IGI guidance this is typically assessed informally by the IGI officer during the same document-submission appointment — not a standardized written test. That means the officer retains some discretion in judging what counts as "satisfactory," so it is worth practicing basic conversation and reading official Romanian documents before your appointment.'}
            </p>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'یک تصور غلط رایج دیگر: پیوستن رومانی به منطقه شنگن (مرزهای هوایی/دریایی از مارس ۲۰۲۴، مرزهای زمینی از ژانویه ۲۰۲۵) هیچ تغییری در قوانین یا حقوق جابجایی اقامت بلندمدت ایجاد نکرده است. حقوق محدود جابجایی برای دارندگان اقامت بلندمدت اتحادیه اروپا (طبق دستورالعمل ۲۰۰۳/۱۰۹/EC) از زمان پیوستن رومانی به اتحادیه اروپا در سال ۲۰۰۷ برقرار بوده، کاملاً مستقل از شنگن. عضویت شنگن فقط کنترل‌های مرزی فیزیکی بین کشورها را حذف کرده، نه چارچوب قانونی وضعیت اقامت بلندمدت را.'
                : 'Another common misconception: Romania joining the Schengen Area (air/sea borders since March 2024, land borders since January 2025) did not change any rules or mobility rights tied to long-term residence status. The limited EU mobility right for holders of EU long-term resident status (under Directive 2003/109/EC) has existed since Romania joined the EU in 2007 — entirely separate from Schengen. Schengen membership only removed physical border checks between countries; it did not amend the long-term residence legal framework.'}
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 leading-relaxed">
              <strong className="block font-bold mb-1">{currentLang === 'fa' ? 'تله‌ی رایج در محاسبه ۵ سال:' : 'The common 5-year calculation trap:'}</strong>
              {currentLang === 'fa'
                ? 'طبق اطلاعیه رسمی IGI، مدت زمانی که با ویزای کوتاه‌مدت، ویزای دیپلماتیک/خدماتی یا وضعیت کارگر فصلی/Au Pair سپری شده اصلاً در محاسبه ۵ سال لحاظ نمی‌شود. مهم‌تر برای دانشجویان: مدت اقامت با کارت اقامت دانشجویی فقط ۵۰٪ از مدت واقعی آن محاسبه می‌شود — یعنی ۴ سال تحصیل فقط معادل ۲ سال برای این هدف حساب می‌شود. همچنین قانون غیبت هم‌زمان دو شرط دارد: نه هیچ غیبت منفردی بیش از ۶ ماه متوالی، و نه مجموع غیبت‌ها بیش از ۱۰ ماه در کل ۵ سال — هر دو شرط باید همزمان رعایت شوند.'
                : 'Per official IGI guidance, time spent on a short-stay visa, diplomatic/service visa, or seasonal-worker/au-pair status does not count toward the 5 years at all. More importantly for students: time held on a student residence permit counts at only 50% of its actual duration — so 4 years of study only counts as 2 years toward this total. The absence rule also has two simultaneous conditions: no single absence over 6 consecutive months, AND total absences must stay under 10 months across the full 5 years — both must hold at once, not either/or.'}
            </div>
            <p className="text-xs text-[#788697] leading-relaxed">
              {currentLang === 'fa'
                ? 'منابع: اطلاعیه رسمی IGI درباره اقامت بلندمدت (igi.mai.gov.ro)، متن تلفیقی OUG 194/2002 (تا ۶ مارس ۲۰۲۴)، Ziua Constanța، Fragomen و شورای اتحادیه اروپا (اعلامیه پیوستن به شنگن، دسامبر ۲۰۲۴). آمار دقیق نرخ تایید یا رد پرونده‌های اقامت بلندمدت به تفکیک ملیت (از جمله ایرانیان) در منابع رسمی یافت نشد — تحلیل سالانه ۲۰۲۵ اداره IGI ملیت‌های نپال، ترکیه و سریلانکا را در صدر آمار عمومی اقامت ذکر می‌کند.'
                : 'Sources: official IGI notice on long-term residence (igi.mai.gov.ro), consolidated OUG 194/2002 text (as of March 6, 2024), Ziua Constanța, Fragomen, and the Council of the EU (Schengen accession announcement, December 2024). Nationality-specific approval/rejection statistics for long-term residence (including Iranian applicants) were not found in official sources — IGI\'s 2025 annual analysis lists Nepal, Turkey, and Sri Lanka as the top overall resident nationalities.'}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#2F6FED]/30 shadow-sm space-y-3">
            <h3 className="text-lg font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>⚖️</span>
              <span>{currentLang === 'fa' ? 'در صورت تاخیر غیرموجه IGI' : 'If IGI Unjustifiably Delays Your File'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'طبق قانون ۵۵۴/۲۰۰۴، در صورت سکوت یا تاخیر بدون توجیه IGI فراتر از مهلت قانونی، می‌توانید ظرف ۶ ماه با کمک وکیل حقوق اداری علیه این تاخیر به دادگاه اداری شکایت کنید.'
                : 'Under Law 554/2004, if IGI is unjustifiably silent or delayed beyond its legal deadline, you may sue this delay in the administrative court within 6 months, with the help of an administrative-law attorney.'}
            </p>
          </div>

          <div className="mt-2 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا اقامت بلندمدت همان تابعیت رومانی است؟' : 'Is long-term residence the same as Romanian citizenship?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. اقامت بلندمدت یک وضعیت اقامتی (نه شهروندی) است که حقوق گسترده‌ای می‌دهد اما شامل حق رأی یا پاسپورت رومانیایی نمی‌شود؛ برای تابعیت باید مسیر جداگانه‌ای طی شود.' : 'No. Long-term residence is a residency status (not citizenship) that grants broad rights but not voting rights or a Romanian passport; citizenship requires a separate application path.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا هر نوع کارت اقامت موقت برای این مسیر شمارش می‌شود؟' : 'Does every type of temporary residence permit count toward this?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. ویزای کوتاه‌مدت، دیپلماتیک/خدماتی و وضعیت کارگر فصلی/Au Pair اصلاً محاسبه نمی‌شوند، و اقامت با کارت اقامت دانشجویی فقط ۵۰٪ مدت واقعی خود را می‌سازد؛ وضعیت دقیق پرونده شما را باید IGI بر اساس نوع اجازه اقامتتان بررسی کند.' : 'No. Short-stay, diplomatic/service visas, and seasonal-worker/au-pair status do not count at all, and time on a student residence permit only counts at 50% of its actual duration; IGI must review your specific case based on your permit type.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا برای این اقامت باید در آزمون زبان رسمی A1 یا A2 قبول شوم؟' : 'Do I need to pass a formal A1 or A2 language exam for this?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. قانون فقط «سطح رضایت‌بخش» زبان رومانیایی را می‌خواهد و این معمولاً طی همان جلسه تحویل مدارک و به تشخیص کارمند IGI ارزیابی می‌شود، نه یک آزمون کتبی جداگانه با سطح CEFR مشخص.' : 'No. The law only requires a "satisfactory level" of Romanian, typically assessed informally by the IGI officer during the document-submission appointment itself, not a separate written exam with a defined CEFR level.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="immigration/long-term-residence" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'citizenship':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="immigration/citizenship" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'تابعیت و شهروندی رومانی' : 'Romanian Citizenship'}
            </h1>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa' 
                ? 'منبع: سازمان ملی تابعیت (ANC) — قوانین قانون شماره ۲۱/۱۹۹۱'
                : 'Source: National Authority for Citizenship (ANC) — Law 21/1991'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'دریافت تابعیت رومانی بالاترین سطح ادغام در این کشور است که به شما پاسپورت رومانیایی و تمامی حقوق شهروندی اتحادیه اروپا را اعطا می‌کند. مسیر اصلی برای اتباع خارجی جهت کسب این تابعیت، تقاضا بر اساس قانون تابعیت رومانی (ماده ۸ قانون ۲۱/۱۹۹۱) است که نیازمند حداقل ۸ سال اقامت قانونی مستمر (یا ۵ سال در صورت ازدواج با شهروند رومانیایی) می‌باشد. علاوه بر رعایت مدت زمان حضور، سازمان ملی تابعیت (ANC) متقاضیان را از نظر وفاداری به دولت، نداشتن سابقه کیفری، استقلال مالی، و موفقیت در آزمون زبان، فرهنگ و قانون اساسی رومانی مورد ارزیابی دقیق قرار می‌دهد.'
              : 'Acquiring Romanian citizenship is the highest level of integration, granting you a Romanian passport and all EU citizenship rights. The primary pathway for foreign nationals is applying under Article 8 of the Romanian Citizenship Law (Law 21/1991), which requires at least 8 years of continuous legal residence (or 5 years if married to a Romanian citizen). Beyond the residency duration, the National Authority for Citizenship (ANC) strictly evaluates applicants on their loyalty to the state, clean criminal record, financial independence, and success in passing an exam on the Romanian language, culture, and constitution.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'شرایط اصلی اخذ تابعیت' : 'Main Conditions for Citizenship'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'سکونت قانونی مستمر حداقل ۸ سال در خاک رومانی؛ این مدت برای فردی که با شهروند رومانیایی ازدواج کرده و با او زندگی می‌کند، به ۵ سال از تاریخ ازدواج کاهش می‌یابد.' : 'Continuous legal residence of at least 8 years in Romanian territory; this period is reduced to 5 years from the date of marriage for an individual married to and living with a Romanian citizen.'}</li>
                <li>{currentLang === 'fa' ? 'غیبت بیش از ۶ ماه در یک سال، آن سال را از محاسبه دوره سکونت حذف می‌کند.' : 'Absence of more than 6 months in a single year excludes that year from the calculation of the residence period.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'سایر شرایط قانونی' : 'Other Legal Requirements'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اثبات وفاداری به دولت رومانی از طریق رفتار و عملکرد، و نداشتن سابقه اقدام علیه نظم عمومی یا امنیت ملی.' : 'Proving loyalty to the Romanian state through conduct and actions, and having no record of activities against public order or national security.'}</li>
                <li>{currentLang === 'fa' ? 'آشنایی با زبان رومانیایی (خواندن و نوشتن)، قانون اساسی و سرود ملی، و آگاهی مقدماتی از فرهنگ و تمدن رومانی.' : 'Familiarity with the Romanian language (reading and writing), the constitution, the national anthem, and basic knowledge of Romanian culture and civilization.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'زمان‌بندی و مرجع رسیدگی' : 'Timeline and Processing Authority'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'درخواست‌ها نزد سازمان ملی تابعیت (Autoritatea Națională pentru Cetățenie / ANC) ثبت می‌شود.' : 'Applications are submitted to the National Authority for Citizenship (Autoritatea Națională pentru Cetățenie / ANC).'}</li>
                <li>{currentLang === 'fa' ? 'طبق قانون ۱۴/۲۰۲۵ (اصلاحیه قانون ۲۱/۱۹۹۱)، مهلت قانونی رسیدگی ANC از ۵ ماه به ۲ سال افزایش یافت (با امکان تمدید ۶ ماهه در موارد موجه) — این عدد اکنون سقف رسمی است، نه صرفاً میانگین آماری.' : 'Under Law 14/2025 (amending Law 21/1991), ANC\'s statutory processing deadline was extended from 5 months to 2 years (with a possible 6-month extension in justified cases) — this is now the official legal ceiling, not just a statistical average.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{disclaimer}</span></li>
              </ul>
            </div>
          </div>

          {/* NARRATIVE: REAL ANC BACKLOG DATA + IRAN DUAL-CITIZENSHIP INTERSECTION */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>📈</span>
              <span>{currentLang === 'fa' ? '«۲ سال» واقعاً یعنی چه؟ آمار واقعی رسیدگی ANC' : 'What "2 Years" Actually Means: ANC\'s Real Backlog'}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'مهلت ۲ ساله دقیقاً به این دلیل در قانون ۱۴/۲۰۲۵ گنجانده شد که ANC دیگر قادر به رعایت مهلت قبلی ۵ ماهه نبود و با شکایات متعدد بابت تاخیر مواجه شده بود. آمار واقعی نگران‌کننده‌تر از این عدد است: طبق تحلیل حقوقی Legal500، از ۳۸٬۹۸۱ درخواست ثبت‌شده در سال ۲۰۲۳، فقط ۰٫۳۷٪ تا پایان همان سال تایید نهایی شدند؛ در سال ۲۰۲۴، از ۵۰٬۳۵۰ درخواست جدید، تا پایان سال هیچ پرونده‌ای تایید نشد؛ و تا مارس ۲۰۲۵، با وجود ۳٬۹۷۶ درخواست تازه دیگر، همچنان هیچ‌کدام تایید نشده بود. این یعنی «۲ سال» را باید یک کف انتظار در نظر گرفت، نه سقف تضمین‌شده.'
                : 'The 2-year deadline was written into Law 14/2025 precisely because ANC could no longer meet its previous 5-month deadline and was facing repeated lawsuits over delays. The actual backlog data is more sobering than that number suggests: per Legal500\'s legal analysis, of 38,981 applications filed in 2023, only 0.37% received final approval by year-end; of 50,350 new applications filed in 2024, none were approved by year-end; and through March 2025, with 3,976 more applications filed, still none had been approved. In practice, treat "2 years" as a floor for realistic planning, not a guaranteed ceiling.'}
            </p>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-[#142033] leading-relaxed">
              <strong className="block font-bold mb-1">{currentLang === 'fa' ? 'مهم‌ترین نکته برای ایرانیان: تابعیت دوگانه' : 'The Most Important Point for Iranians: Dual Citizenship'}</strong>
              {currentLang === 'fa'
                ? 'قانون رومانی (ماده ۸ قانون ۲۱/۱۹۹۱) نیازی به انصراف از تابعیت قبلی برای اخذ تابعیت رومانی ندارد — رومانی به‌صراحت تابعیت چندگانه را برای تازه‌تابعیت‌شدگان می‌پذیرد. اما نکته کلیدی از سمت ایران است: قانون ایران به‌طور خودکار تابعیت ایرانی کسی که تابعیت کشور دیگری می‌گیرد را باطل نمی‌کند؛ در واقع اگر این کار بدون طی تشریفات رسمی ترک تابعیت انجام شود، دولت ایران عملاً آن تابعیت خارجی را نادیده می‌گیرد و همچنان فرد را صرفاً ایرانی می‌داند. ترک رسمی تابعیت ایران نیازمند رأی هیئت وزیران، حداقل ۲۵ سال سن، انجام خدمت سربازی (برای آقایان)، انتقال املاک ایرانی به اتباع ایرانی ظرف یک سال، و خروج از ایران ظرف سه ماه پس از ترک تابعیت است — فرآیندی که اغلب برای مردان مشمول سربازی رد می‌شود. پیش از هرگونه اقدام، حتماً با یک وکیل متخصص حقوق تابعیت مشورت کنید؛ شماره دقیق ماده قانونی ایران در منابع مختلف متفاوت ذکر شده (برخی ماده ۹۸۸ قانون تابعیت ۱۹۳۴، برخی ماده ۹۷۶ قانون مدنی) و نیاز به تایید نهایی حقوقی دارد.'
                : 'Romanian law (Article 8 of Law 21/1991) does not require renouncing your prior citizenship to acquire Romanian citizenship — Romania explicitly permits multiple nationality for newly naturalized citizens. But the key issue is on Iran\'s side: Iranian law does not automatically strip Iranian citizenship from someone who acquires another nationality; if done without following Iran\'s own formal renunciation procedure, the Iranian government simply disregards the new foreign nationality and continues to treat the person as solely Iranian. Formally renouncing Iranian citizenship requires Council of Ministers approval, being over 25, having completed military service (for men), transferring any Iranian real estate to Iranian nationals within one year, and leaving Iran within three months of renunciation — a process frequently denied for men of military-service age. Consult a citizenship-law attorney before taking any action; the exact Iranian legal article is cited differently across sources (some cite Article 988 of the 1934 Citizenship Law, others Article 976 of the Civil Code) and needs final legal confirmation for your specific case.'}
            </div>
            <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'مصاحبه/آزمون این مرحله رسماً یک «مصاحبه» نزد کمیسیون تابعیت است، نه یک آزمون کتبی استاندارد: طبق صفحه رسمی ماده ۸ در cetatenie.just.ro، محتوای آن شامل خواندن و نوشتن رومانیایی، آشنایی با اصول قانون اساسی، خواندن سرود ملی، و اطلاعات مقدماتی از فرهنگ، تاریخ و جغرافیای رومانی است. همان سایت رسمی بانک سوالات نمونه را نیز برای دانلود و آمادگی منتشر کرده است.'
                : 'This stage is officially an "interview" before the Citizenship Commission, not a standardized written exam: per the official Article 8 page on cetatenie.just.ro, it covers reading/writing Romanian, familiarity with constitutional principles, reciting the national anthem, and elementary knowledge of Romanian culture, history, and geography. The same official site publishes a downloadable sample question bank for preparation.'}
            </p>
            <p className="text-xs text-[#788697] leading-relaxed">
              {currentLang === 'fa'
                ? 'منابع: avocatpavel.com (تحلیل قانون ۱۴/۲۰۲۵)، Legal500 (تحلیل آماری رسیدگی ANC)، cetatenie.just.ro (صفحه رسمی ماده ۸)، Library of Congress – گزارش قوانین تابعیت ایران، globalcit.eu (متن تلفیقی قانون ۲۱/۱۹۹۱). شماره دقیق ماده قانون تابعیت ایران بین منابع متفاوت است و نیاز به تایید حقوقی نهایی دارد؛ نرخ قبولی مصاحبه ANC در منابع رسمی منتشر نشده است.'
                : 'Sources: avocatpavel.com (Law 14/2025 analysis), Legal500 (ANC processing statistics analysis), cetatenie.just.ro (official Article 8 page), Library of Congress — report on Iranian citizenship law, globalcit.eu (consolidated Law 21/1991 text). The exact Iranian legal article number varies across sources and needs final legal confirmation; ANC interview pass rates are not published in official sources.'}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-amber-950 leading-relaxed">
            {currentLang === 'fa'
              ? 'توجه: مبلغ دقیق عوارض پرونده تابعیت و آدرس/ساعات کاری دقیق دفاتر سازمان ملی تابعیت (ANC) به‌صورت رسمی روی cetatenie.just.ro منتشر می‌شود و ممکن است به‌روزرسانی شود؛ پیش از اقدام، مبلغ و آدرس دقیق را از همان سایت یا با تماس تلفنی با ANC تایید کنید.'
              : 'Note: the exact citizenship application fee and the precise address/hours of the National Authority for Citizenship (ANC) offices are published officially on cetatenie.just.ro and may be updated; confirm the exact figures and address there or by calling ANC before proceeding.'}
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#2F6FED]/30 shadow-sm space-y-3">
            <h3 className="text-lg font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>⚖️</span>
              <span>{currentLang === 'fa' ? 'در صورت تاخیر غیرموجه ANC' : 'If ANC Unjustifiably Delays Your File'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'همانند IGI، سازمان ملی تابعیت (ANC) نیز یک نهاد دولتی است و مشمول قانون دادرسی اداری رومانی (Legea nr. 554/2004) می‌شود. اگر پرونده شما فراتر از مهلت قانونی جدید ۲ ساله (با احتساب تمدید احتمالی ۶ ماهه) بدون توضیح معلق بماند، حق دارید با کمک وکیل حقوق اداری علیه این سکوت یا تاخیر به دادگاه اداری شکایت کنید — این ابزار قانونی کمتر شناخته‌شده اما واقعی است.'
                : 'Like IGI, the National Authority for Citizenship (ANC) is a public authority subject to the Administrative Contentious Law (Legea nr. 554/2004). If your file remains pending beyond the new 2-year statutory deadline (plus any 6-month extension) without explanation, you have the right to sue this silence or delay in the administrative court with the help of an administrative-law attorney — a real, under-publicized legal tool.'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'پروسه بررسی پرونده تابعیت چقدر زمان می‌برد؟' : 'How long does the citizenship application process take?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق قانون ۱۴/۲۰۲۵، مهلت قانونی رسمی ۲ سال است (با امکان تمدید ۶ ماهه)؛ اما آمار واقعی ANC نشان می‌دهد بسیاری از پرونده‌های ۲۰۲۳ و ۲۰۲۴ حتی تا پایان همان بازه هم تایید نشدند، پس بهتر است این عدد را یک کف انتظار در نظر بگیرید نه یک تضمین.' : 'Under Law 14/2025, the official statutory deadline is 2 years (with a possible 6-month extension); but ANC\'s actual data shows many 2023 and 2024 applications were still not approved even by the end of that window, so treat this figure as a floor for planning, not a guarantee.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر تابعیت رومانی را بگیرم، آیا تابعیت ایرانی‌ام را از دست می‌دهم؟' : 'If I acquire Romanian citizenship, do I lose my Iranian citizenship?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'رومانی نیازی به انصراف از تابعیت قبلی ندارد. اما ایران هم به‌طور خودکار تابعیت شما را باطل نمی‌کند مگر از طریق فرآیند رسمی و دشوار ترک تابعیت (تایید هیئت وزیران) اقدام کنید؛ در عمل بسیاری افراد بدون طی این فرآیند، از دید ایران همچنان صرفاً ایرانی محسوب می‌شوند. پیش از تصمیم‌گیری حتماً با وکیل متخصص مشورت کنید.' : 'Romania does not require you to renounce your prior citizenship. Iran also does not automatically revoke your citizenship unless you go through its formal, difficult renunciation process (Council of Ministers approval); in practice, many people who don\'t complete that process remain considered solely Iranian by Iran. Consult a specialized attorney before deciding.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا آزمون زبان و قانون اساسی برای دریافت تابعیت دشوار است؟' : 'Is the language and constitution exam difficult?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'این مرحله رسماً یک مصاحبه نزد کمیسیون تابعیت است (نه آزمون کتبی استاندارد) و شامل خواندن/نوشتن رومانیایی، اصول قانون اساسی، سرود ملی و اطلاعات مقدماتی فرهنگ/تاریخ/جغرافیای رومانی است؛ ANC بانک سوالات نمونه را روی cetatenie.just.ro منتشر کرده که می‌توانید از قبل مطالعه کنید.' : 'This stage is officially an interview before the Citizenship Commission (not a standardized written exam) covering Romanian reading/writing, constitutional principles, the national anthem, and elementary Romanian culture/history/geography; ANC publishes a sample question bank on cetatenie.just.ro that you can study in advance.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر پرونده‌ام بیش از حد معمول طول کشید چه اقدامی می‌توانم انجام دهم؟' : 'What can I do if my file takes far longer than usual?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق قانون ۵۵۴/۲۰۰۴، می‌توانید ظرف ۶ ماه از تاخیر یا سکوت غیرموجه فراتر از مهلت ۲ ساله جدید، با کمک وکیل متخصص حقوق اداری علیه ANC در دادگاه اداری شکایت کنید.' : 'Under Law 554/2004, you can sue ANC in the administrative court within 6 months of an unjustified delay or silence beyond the new 2-year deadline, with the help of an administrative-law attorney.'}</p>
              </div>
            </div>
          </div>

          <ParentHubFooterCard slugRoute="immigration/citizenship" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'family-reunification':
      return <FamilyReunificationContent currentLang={currentLang} onNavigate={onNavigate} />;

    default:
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          {/* 1. HERO PANEL */}
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مهاجرت و اقامت در رومانی' : 'Immigration & Residence in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'مروری بر مسیرهای قانونی اقامت، مراحل تمدید، پیوست خانواده و دریافت شهروندی رومانی.'
                : 'An overview of legal residence pathways, renewal procedures, family reunification, and acquiring Romanian citizenship.'}
            </p>
          </div>

          {/* 2. WHICH SITUATION ARE YOU IN? (کدام وضعیت شمایید؟) */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🎯</span>
              <span>{currentLang === 'fa' ? 'کدام وضعیت شمایید؟ (انتخاب سریع مسیر)' : 'Which situation matches your goal?'}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/immigration/igi-process" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">🚪</span>
                  <h4 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'می‌خواهم وارد رومانی شوم' : 'I want to enter Romania'}
                  </h4>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'راهنمای ویزای ورود و ثبت پرونده اولیه در IGI.' : 'Entry visa guide and initial IGI registration.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'مشاهده مراحل ورود ←' : 'View Entry Steps →'}
                </span>
              </Link>

              <Link href="/immigration/igi-process" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">🪪</span>
                  <h4 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'کارت اقامت می‌خواهم' : 'I need a Residence Card'}
                  </h4>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'فرآیند نوبت‌دهی و صدور Permis de Ședere در IGI.' : 'Appointment booking and Permis de Ședere issuance.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'مشاهده مراحل کارت اقامت ←' : 'View Residence Card Steps →'}
                </span>
              </Link>

              <Link href="/immigration/residence-renewal" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">🔄</span>
                  <h4 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'می‌خواهم اقامتم را تمدید کنم' : 'I want to renew my residence'}
                  </h4>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'مهلت ۳۰ روزه، مدارک تمدید و عدم جریمه در IGI.' : '30-day window, renewal checklist and deadlines.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'راهنمای تمدید اقامت ←' : 'View Renewal Guide →'}
                </span>
              </Link>

              <Link href="/immigration/family-reunification" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  <h4 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'قصد پیوست خانواده دارم' : 'Family Reunification'}
                  </h4>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'آوردن همسر و فرزندان با مهلت قانونی ۳ ماهه IGI.' : 'Bringing spouse and children under 3-month IGI timeline.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'شرایط پیوست خانواده ←' : 'Family Reunification Rules →'}
                </span>
              </Link>

              <Link href="/immigration/long-term-residence" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">📌</span>
                  <h4 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'اقامت بلندمدت می‌خواهم' : 'Long-Term Permanent Residence'}
                  </h4>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'شرایط ۵ سال اقامت قانونی مداوم برای کارت ۵ ساله دائم.' : '5-year continuous residence rules for permanent card.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'شرایط اقامت دائم ←' : 'Permanent Residence Rules →'}
                </span>
              </Link>

              <Link href="/immigration/citizenship" className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-2xl">🇷🇴</span>
                  <h4 className="font-extrabold text-[#142033] text-sm sm:text-base">
                    {currentLang === 'fa' ? 'درباره تابعیت تحقیق می‌کنم' : 'Romanian Citizenship'}
                  </h4>
                  <p className="text-xs text-[#526174] leading-relaxed">
                    {currentLang === 'fa' ? 'ماده ۸ قانون تابعیت، آزمون زبان و پاسپورت رومانی.' : 'Article 8 citizenship law, language test & passport.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2F6FED] pt-3 inline-block">
                  {currentLang === 'fa' ? 'مسیر دریافت پاسپورت ←' : 'Citizenship Passport Rules →'}
                </span>
              </Link>
            </div>
          </div>

          {/* 3. WHERE SHOULD I START? (از کجا شروع کنم؟ - DECISION HELPER) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-2xl border border-blue-100 space-y-4">
            <h3 className="text-lg font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>💡</span>
              <span>{currentLang === 'fa' ? 'از کجا شروع کنم؟ (راهنمای تصمیم‌گیری)' : 'Where Should I Start? (Decision Helper)'}</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-[#526174]">
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <span className="text-[#2F6FED] font-bold">▪</span>
                <span>
                  {currentLang === 'fa' ? 'هنوز خارج از رومانی هستید و ویزا ندارید؟ ' : 'Still outside Romania without a visa? '}
                  <Link href="/immigration/igi-process" className="text-[#2F6FED] font-bold hover:underline">
                    {currentLang === 'fa' ? 'مسیر ورود، ویزای نوع D و نوبت‌دهی IGI را ببینید ←' : 'See entry visa & IGI process guide →'}
                  </Link>
                </span>
              </div>
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <span className="text-[#2F6FED] font-bold">▪</span>
                <span>
                  {currentLang === 'fa' ? 'در رومانی هستید و کارت اقامتتان رو به انقضاست؟ ' : 'Already in Romania with an expiring residence card? '}
                  <Link href="/immigration/residence-renewal" className="text-[#2F6FED] font-bold hover:underline">
                    {currentLang === 'fa' ? 'راهنمای تمدید اقامت بدون جریمه را ببینید ←' : 'See residence renewal guide →'}
                  </Link>
                </span>
              </div>
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <span className="text-[#2F6FED] font-bold">▪</span>
                <span>
                  {currentLang === 'fa' ? 'قصد دارید همسر و فرزندان را کنار خود بیاورید؟ ' : 'Planning to bring your spouse and children to Romania? '}
                  <Link href="/immigration/family-reunification" className="text-[#2F6FED] font-bold hover:underline">
                    {currentLang === 'fa' ? 'شرایط و مدارک پیوست خانواده در IGI را ببینید ←' : 'See family reunification rules →'}
                  </Link>
                </span>
              </div>
            </div>
          </div>

          {/* 4. PATHWAYS SECTION (MANDATORY PRESERVED) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? 'مسیرهای مهاجرت' : 'Immigration Pathways'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/immigration/igi-process" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'مراحل IGI' : 'IGI Process'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'مراحل ثبت و دریافت کارت اقامت' : 'Steps to register and get your residence card'}</p>
              </Link>
              <Link href="/immigration/residence-renewal" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'تمدید اقامت' : 'Residence Renewal'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'نحوه و زمان‌بندی تمدید کارت اقامت' : 'How and when to renew your residence permit'}</p>
              </Link>
              <Link href="/immigration/long-term-residence" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'اقامت بلندمدت' : 'Long-term Residence'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'شرایط اخذ اقامت دائم رومانی' : 'Conditions for obtaining permanent residency'}</p>
              </Link>
              <Link href="/immigration/citizenship" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'تابعیت' : 'Citizenship'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'مسیر رسیدن به پاسپورت رومانیایی' : 'The pathway to acquiring a Romanian passport'}</p>
              </Link>
              <Link href="/immigration/family-reunification" className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" >
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'پیوست خانواده' : 'Family Reunification'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'آوردن همسر و فرزندان به رومانی' : 'Bringing your spouse and children to Romania'}</p>
              </Link>
            </div>
          </div>

          {/* 5. EVALUATION CTA AT BOTTOM */}
          <div className="pt-6">
            <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
          </div>
        </div>
      );
  }
};
