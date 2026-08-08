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
                <li>{currentLang === 'fa' ? 'میانگین زمان رسیدگی به پرونده‌های ماده ۸ در حال حاضر حدود ۲ سال است (بر اساس آمار رسمی ANC).' : 'The average processing time for Article 8 cases is currently around 2 years (based on official ANC statistics).'}</li>
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
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'پروسه بررسی پرونده تابعیت چقدر زمان می‌برد؟' : 'How long does the citizenship application process take?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بر اساس روال قانونی و آمارهای فعلی سازمان ملی تابعیت (ANC)، رسیدگی به درخواست‌های ماده ۸ معمولاً حدود ۲ سال زمان می‌برد.' : 'Based on legal procedures and current ANC statistics, processing Article 8 applications typically takes around 2 years.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا آزمون زبان و قانون اساسی برای دریافت تابعیت دشوار است؟' : 'Is the language and constitution exam difficult?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'متقاضی باید توانایی خواندن، نوشتن و مکالمه روان به زبان رومانیایی را داشته باشد و به پرسش‌هایی درباره تاریخ، جغرافیا و قانون اساسی پاسخ دهد که نیازمند مطالعه و آمادگی کامل است.' : 'The applicant must demonstrate the ability to read, write, and converse fluently in Romanian, and answer questions regarding the country\'s history, geography, and constitution, which requires thorough preparation.'}</p>
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
