'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { CommentsSection } from './CommentsSection';
import { ExternalLink, CheckCircle, ShieldCheck, Clock, FileCheck2, AlertCircle } from './Icons';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface IgiProcessContentProps {
  currentLang: Language;
}

export const IgiProcessContent: React.FC<IgiProcessContentProps> = ({ currentLang }) => {
  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 text-right rtl">
      <Breadcrumb slugRoute="immigration/igi-process" currentLang={currentLang} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
          <span>{currentLang === 'fa' ? 'راهنمای جامع اداره کل مهاجرت رومانی' : 'General Inspectorate for Immigration (IGI) Guide'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {currentLang === 'fa'
            ? 'مراحل اقامت و قوانین صدور کارت نزد اداره IGI'
            : 'Residency Process & Permit Regulations at IGI'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'راهنمای رسمی و تاییدشده قوانین اداره کل مهاجرت رومانی (IGI)، زمان‌بندی‌های ۹۰ و ۳۰ روزه صدور کارت اقامت، گواهی اتباع اتحادیه اروپا و نحوه تمدید.'
            : 'Official verified guide to Romanian General Inspectorate for Immigration (IGI) rules, 90/30-day timelines, EU certificates, and renewal procedures.'}
        </p>
        <div className="text-xs text-slate-400 pt-2 flex items-center space-x-2 rtl:space-x-reverse border-t border-slate-700/60">
          <span>🏛️</span>
          <span>
            {currentLang === 'fa'
              ? 'منبع رسمی: اداره کل مهاجرت رومانی (IGI) — igi.mai.gov.ro'
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
          <a href="#quick-answer" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۱. پاسخ سریع' : '1. Quick Answer'}
          </a>
          <a href="#prerequisites-table" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۲. جدول شرایط اولیه' : '2. Prerequisites Table'}
          </a>
          <a href="#step-by-step" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۳. مراحل گام‌به‌گام' : '3. Step-by-Step'}
          </a>
          <a href="#required-docs" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۴. مدارک لازم' : '4. Required Documents'}
          </a>
          <a href="#fees-and-office" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۵. هزینه‌ها و آدرس اداره بخارست' : '5. Fees & Bucharest Office'}
          </a>
          <a href="#official-timelines" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۶. مهلت‌های ۹۰ و ۳۰ روزه' : '6. Official Timelines'}
          </a>
          <a href="#common-issues" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۷. نقص مدارک و توقف' : '7. Incomplete Files'}
          </a>
          <a href="#legal-remedy" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۸. اعتراض قانونی به تاخیر' : '8. Legal Remedy for Delays'}
          </a>
          <a href="#official-references" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۹. منابع رسمی' : '9. Official References'}
          </a>
          <a href="#related-content" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۱۰. مطالب مرتبط' : '10. Related Content'}
          </a>
        </div>
      </div>

      {/* SECTION 1: QUICK ANSWER */}
      <div id="quick-answer" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#2F6FED]">
          <ShieldCheck size={24} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'پاسخ سریع: اداره IGI چیست و روند صدور کارت چگونه است؟' : 'Quick Answer: What is IGI & Residency Process?'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'اداره کل مهاجرت رومانی (Inspectoratul General pentru Imigrări – IGI) زیرمجموعه وزارت کشور رومانی (MAI)، مرجع نهادهای اجرایی ثبت اقامت، صدور گواهی اتباع اتحادیه اروپا (Certificat de Înregistrare) و کارت اقامت (Cartea de Rezidență) برای اتباع خارجی و اعضای خانواده آن‌هاست. تمامی متقاضیان موظفند درخواست‌های اولیه یا تمدید خود را نزد اداره منطقه‌ای IGI محل سکونت خود ثبت نمایند.'
            : 'The General Inspectorate for Immigration (IGI), under the Romanian Ministry of Internal Affairs, is the sole authority managing foreign residency, EU registration certificates, and residence cards. All applicants must register their initial or renewal applications at their regional IGI office.'}
        </p>
      </div>

      {/* SECTION 2: PREREQUISITES TABLE */}
      <div id="prerequisites-table" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📊</span>
          <span>{currentLang === 'fa' ? 'جدول خلاصه شرایط و مهلت‌های قانونی IGI' : 'Prerequisites & Legal Regulations Summary Table'}</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#071B3D] text-white">
                <th className="p-3.5 rounded-r-xl">{currentLang === 'fa' ? 'نوع مدرک / کارت' : 'Document Type'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'مشمولین' : 'Eligible Categories'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'مهلت صدور قانونی' : 'Legal Processing Time'}</th>
                <th className="p-3.5 rounded-l-xl">{currentLang === 'fa' ? 'حداکثر اعتبار' : 'Maximum Validity'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe6ef] text-[#526174]">
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">Certificat de Înregistrare</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'اتباع اتحادیه اروپا / EEA / سوئیس' : 'EU / EEA / Swiss Citizens'}</td>
                <td className="p-3.5 font-bold text-emerald-600">{currentLang === 'fa' ? 'همان روز (Same Day)' : 'Same Day'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'تا ۵ سال (حداقل ۱ سال)' : 'Up to 5 years (Min 1 yr)'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">Cartea de Rezidență (درخواست اولیه)</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'اعضای خانواده غیر EU اتباع اتحادیه اروپا' : 'Non-EU Family Members of EU Citizens'}</td>
                <td className="p-3.5 font-bold text-amber-600">{currentLang === 'fa' ? 'ظرف ۹۰ روز از ثبت درخواست' : 'Within 90 days'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'حداکثر ۵ سال (مطابق با اقامت شهروند EU)' : 'Up to 5 yrs (Matches EU citizen)'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">Cartea de Rezidență (تمدید)</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'درخواست‌های بعدی تمدید اقامت' : 'Subsequent Renewal Applications'}</td>
                <td className="p-3.5 font-bold text-blue-600">{currentLang === 'fa' ? 'حداکثر ۳۰ روز' : 'Maximum 30 days'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'حداکثر ۵ سال' : 'Up to 5 years'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">Permis de Ședere (تحصیلی / کاری)</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'اتباع کشورهای ثالث (غیر اتحادیه اروپا)' : 'Third-country Nationals'}</td>
                <td className="p-3.5">
                  <div className="font-bold">{currentLang === 'fa' ? 'حدود ۳۰ تا ۴۵ روز' : 'Around 30-45 days'}</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {currentLang === 'fa' 
                      ? 'طبق تجربه رایج و منابع حقوقی رومانیایی؛ برای مهلت قانونی دقیق به IGI مراجعه کنید.'
                      : 'Based on common experience & Romanian legal sources; check with IGI for exact statutory deadlines.'}
                  </div>
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? '۱ سال (قابل تمدید سالانه)' : '1 year (Renewable annually)'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: STEP-BY-STEP PROCESS */}
      <div id="step-by-step" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
          {currentLang === 'fa' ? 'مراحل گام‌به‌گام ثبت پرونده و تمدید نزد IGI' : 'Step-by-Step IGI Application & Renewal Process'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-5 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-2">
            <span className="font-extrabold text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-xs">۱</span>
              <span>{currentLang === 'fa' ? 'گام ۱: ثبت‌نام در پورتال آنلاین IGI' : 'Step 1: Online Portal Registration'}</span>
            </span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'ثبت اولیه مدارک و رزرو وقت مراجعه از طریق پورتال آنلاین اداره مهاجرت (portal.igi.mai.gov.ro).'
                : 'Initial document submission and appointment booking via portal.igi.mai.gov.ro.'}
            </p>
          </div>
          <div className="p-5 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-2">
            <span className="font-extrabold text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-xs">۲</span>
              <span>{currentLang === 'fa' ? 'گام ۲: آماده‌سازی حداقل ۳۰ روز قبل' : 'Step 2: Timely Preparation (Min 30 Days)'}</span>
            </span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'توصیه رسمی: تمام مدارک تمدید باید حداقل ۳۰ روز پیش از انقضای کارت فعلی ثبت شوند.'
                : 'Official recommendation: All renewal files must be submitted at least 30 days before permit expiration.'}
            </p>
          </div>
          <div className="p-5 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-2">
            <span className="font-extrabold text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-xs">۳</span>
              <span>{currentLang === 'fa' ? 'گام ۳: مراجعه به اداره منطقه‌ای IGI' : 'Step 3: Regional IGI Visit'}</span>
            </span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'مراجعه حضوری به اداره IGI استان محل اقامت، ارائه اصل مدارک، پرداخت عوارض و اخذ رسید ثبت.'
                : 'In-person submission at the provincial IGI office of residence, presenting originals and receiving registration receipt.'}
            </p>
          </div>
          <div className="p-5 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-2">
            <span className="font-extrabold text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-xs">۴</span>
              <span>{currentLang === 'fa' ? 'گام ۴: بیومتریک و صدور کارت' : 'Step 4: Biometrics & Card Issuance'}</span>
            </span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'ثبت اثر انگشت، چهره‌نگاری و دریافت کارت اقامت جدید پس از طی مهلت قانونی رسیدگی.'
                : 'Fingerprint scanning, photo capture, and final residence card pickup after legal processing.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: REQUIRED DOCUMENTS CHECKLIST */}
      <div id="required-docs" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <FileCheck2 size={24} className="text-[#2F6FED]" />
          <span>{currentLang === 'fa' ? 'چک‌لیست مدارک لازم برای تشکیل پرونده و تمدید اقامت' : 'Required Documents Checklist'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#526174]">
          <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>{currentLang === 'fa' ? 'پاسپورت معتبر (با حداقل ۶ ماه اعتبار)' : 'Valid passport (min 6 months validity)'}</span>
          </div>
          <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>
              {currentLang === 'fa' ? 'مدرک محل اسکان معتبر — ' : 'Proof of accommodation — '}
              <Link href="/needs/housing" className="text-[#2F6FED] font-bold hover:underline">
                {currentLang === 'fa' ? 'راهنمای مسکن در رومانی' : 'Housing Guide'}
              </Link>
            </span>
          </div>
          <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>{currentLang === 'fa' ? 'مدرک تمکن مالی (حساب بانکی / حقوق / فیش درآمد)' : 'Proof of financial means'}</span>
          </div>
          <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>
              {currentLang === 'fa' ? 'بیمه درمانی معتبر در رومانی — ' : 'Valid health insurance — '}
              <Link href="/needs" className="text-[#2F6FED] font-bold hover:underline">
                {currentLang === 'fa' ? 'خدمات بیمه و بهداشت' : 'Health & Insurance Needs'}
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4.5: FEES & BUCHAREST OFFICE */}
      <div id="fees-and-office" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>💳</span>
          <span>{currentLang === 'fa' ? 'هزینه‌های رسمی صدور کارت اقامت' : 'Official Residence Permit Fees'}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'طبق جدول تعرفه سال ۲۰۲۵ اداره کل مهاجرت (igi.mai.gov.ro)، هزینه استاندارد صدور یا تمدید کارت اقامت موقت (Permis de Ședere) برای بیشتر دسته‌های اتباع کشورهای ثالث (کار، تحصیل، پیوست خانواده) از دو بخش تشکیل می‌شود: '
            : 'Per the General Inspectorate for Immigration\'s official 2025 fee schedule (igi.mai.gov.ro), the standard cost of issuing or renewing a temporary residence permit (Permis de Ședere) for most third-country categories (work, study, family reunification) has two components: '}
          <strong className="text-[#142033]">{currentLang === 'fa' ? '۲۶۵ لئو (عوارض دولتی) + ۱۲۰ یورو (کارمزد صدور کارت با تراشه)' : '265 RON (state tax) + 120 EUR (chip-card issuance fee)'}</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
            <span className="font-extrabold text-[#2F6FED]">265 RON</span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'عوارض دولتی (taxă) که نزد خزانه‌داری یا از طریق پورتال ghiseul.ro قابل پرداخت است.'
                : 'State tax (taxă), payable at the treasury or online via ghiseul.ro.'}
            </p>
          </div>
          <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
            <span className="font-extrabold text-[#2F6FED]">120 EUR</span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'کارمزد صدور کارت اقامت بیومتریک (معادل ریالی به لئو در روز پرداخت محاسبه می‌شود).'
                : 'Biometric residence-card issuance fee (charged in RON equivalent on the day of payment).'}
            </p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-950 leading-relaxed">
          {currentLang === 'fa'
            ? 'توجه: این تعرفه برای اکثر دسته‌های رایج (کار، تحصیل، پیوست خانواده، تمدید) صدق می‌کند، اما برخی مسیرها (مثلاً برخی پرونده‌های پناهندگی یا موارد استثنایی خانوادگی) تعرفه متفاوتی دارند و ممکن است دوره‌ای تجدیدنظر شوند. پیش از پرداخت، مبلغ دقیق را از اداره IGI محل خود یا پورتال رسمی استعلام بگیرید.'
            : 'Note: this fee applies to most common categories (work, study, family reunification, renewal), but some pathways (e.g. certain asylum or exceptional family cases) carry different rates, and fees are periodically revised. Confirm the exact current amount with your local IGI office or the official portal before paying.'}
        </div>

        <h3 className="text-lg font-extrabold text-[#142033] pt-2 flex items-center space-x-2 rtl:space-x-reverse">
          <span>📍</span>
          <span>{currentLang === 'fa' ? 'آدرس و ساعات کاری اداره IGI بخارست' : 'Bucharest IGI Office — Address & Hours'}</span>
        </h3>
        <div className="p-5 bg-[#071B3D] text-white rounded-2xl space-y-2 text-xs sm:text-sm">
          <p>
            <strong>{currentLang === 'fa' ? 'آدرس: ' : 'Address: '}</strong>
            {currentLang === 'fa'
              ? 'مجتمع Grand Arena Mall، بلوار Metalurgiei شماره ۱۲-۱۸، بخش ۴، بخارست (اداره مهاجرت بخارست — DIMB).'
              : 'Grand Arena Mall complex, Bd. Metalurgiei nr. 12-18, Sector 4, Bucharest (Bucharest Immigration Directorate — DIMB).'}
          </p>
          <p>
            <strong>{currentLang === 'fa' ? 'تلفن: ' : 'Phone: '}</strong>021.303.70.80
          </p>
          <p>
            <strong>{currentLang === 'fa' ? 'ایمیل: ' : 'Email: '}</strong>dimb.igi@mai.gov.ro
          </p>
          <p>
            <strong>{currentLang === 'fa' ? 'ساعات کاری با مراجعه‌کننده: ' : 'Public visiting hours: '}</strong>
            {currentLang === 'fa'
              ? 'دوشنبه، سه‌شنبه و پنج‌شنبه ۸:۳۰ تا ۱۳:۳۰ — چهارشنبه ۱۲:۳۰ تا ۱۸:۰۰ (جمعه بدون مراجعه حضوری عمومی).'
              : 'Monday, Tuesday & Thursday 8:30–13:30 — Wednesday 12:30–18:00 (no public walk-in hours on Friday).'}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            {currentLang === 'fa'
              ? 'اکثر مراجعات نیازمند نوبت قبلی از طریق portal.igi.mai.gov.ro هستند؛ ساعات کاری بر اساس اطلاعیه‌های اداره ممکن است تغییر کند.'
              : 'Most visits require a prior appointment via portal.igi.mai.gov.ro; hours may change per office announcements.'}
          </p>
        </div>
      </div>

      {/* SECTION 5: OFFICIAL TIMELINES */}
      <div id="official-timelines" className="bg-[#f0f4f9] p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <Clock size={24} className="text-[#2F6FED]" />
          <span>{currentLang === 'fa' ? 'زمان‌بندی‌های قانونی تاییدشده IGI (مهلت‌های ۹۰ و ۳۰ روزه)' : 'Official Verified IGI Processing Timelines (90/30 Days)'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-white rounded-xl border border-[#dfe6ef] text-center space-y-1 shadow-sm">
            <span className="text-2xl font-extrabold text-emerald-600">همان روز</span>
            <div className="font-bold text-[#142033]">{currentLang === 'fa' ? 'Certificat de Înregistrare' : 'EU Registration Certificate'}</div>
            <p className="text-[11px] text-[#788697]">{currentLang === 'fa' ? 'برای اتباع اتحادیه اروپا / EEA در روز مراجعه صادر می‌شود.' : 'Issued on the same day for EU/EEA citizens.'}</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#dfe6ef] text-center space-y-1 shadow-sm">
            <span className="text-2xl font-extrabold text-amber-600">۹۰ روز</span>
            <div className="font-bold text-[#142033]">{currentLang === 'fa' ? 'درخواست اولیه کارت اقامت' : 'Initial Residence Card'}</div>
            <p className="text-[11px] text-[#788697]">{currentLang === 'fa' ? 'برای اعضای خانواده غیر EU ظرف ۹۰ روز صادر می‌شود.' : 'Issued within 90 days for non-EU family members.'}</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#dfe6ef] text-center space-y-1 shadow-sm">
            <span className="text-2xl font-extrabold text-[#2F6FED]">حداکثر ۳۰ روز</span>
            <div className="font-bold text-[#142033]">{currentLang === 'fa' ? 'درخواست‌های تمدید بعدی' : 'Subsequent Renewals'}</div>
            <p className="text-[11px] text-[#788697]">{currentLang === 'fa' ? 'تمدیدهای بعدی ظرف حداکثر ۳۰ روز انجام می‌پذیرد.' : 'Renewals processed within maximum 30 days.'}</p>
          </div>
        </div>
      </div>

      {/* SECTION 6: INCOMPLETE FILES & FROZEN TIMELINE */}
      <div id="common-issues" className="bg-amber-50 p-6 sm:p-8 rounded-2xl border border-amber-200 space-y-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-amber-900 flex items-center space-x-2 rtl:space-x-reverse">
          <AlertCircle size={24} className="text-amber-600" />
          <span>{currentLang === 'fa' ? 'پرونده‌های ناقص و توقف مهلت قانونی رسیدگی' : 'Incomplete Files & Suspended Processing Timelines'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          {currentLang === 'fa'
            ? 'طبق قوانین رسمی اداره کل مهاجرت (igi.mai.gov.ro)، در صورتی که مدارک ارائه‌شده ناقص باشند، IGI حداکثر تا ۳۰ روز مهلت اضافه برای تکمیل و تحویل مدارک اعطا می‌کند. این بازه مهلت اضافه، بازه زمانی قانونی رسیدگی پرونده را رسماً متوقف (Suspend) می‌کند تا پرونده به صورت کامل تکمیل گردد.'
            : 'According to official IGI regulations, if submitted documents are incomplete, IGI grants up to 30 days extension to complement the file. This extension period officially suspends the processing timeframe until complete documentation is presented.'}
        </p>
      </div>

      {/* SECTION 6.5: LEGAL REMEDY FOR DELAYS */}
      <div id="legal-remedy" className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#2F6FED]/30 shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>⚖️</span>
          <span>{currentLang === 'fa' ? 'اگر IGI بدون دلیل تاخیر کرد یا پاسخ نداد چه کنم؟' : 'What If IGI Delays or Fails to Respond?'}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'بسیاری از سایت‌ها فقط می‌گویند «صبر کنید»، اما قانون رومانی یک راه‌حل مشخص در اختیار شما می‌گذارد. طبق قانون دادرسی اداری رومانی (Legea contenciosului administrativ nr. 554/2004)، اگر یک نهاد دولتی مانند IGI یا ANC در مهلت قانونی به درخواست شما پاسخ ندهد یا تاخیر غیرموجه داشته باشد، شما حق دارید علیه این «سکوت اداری» (tăcere administrativă) یا امتناع بدون توجیه، به دادگاه اداری (Tribunalul de Contencios Administrativ) شکایت کنید.'
            : 'Most sites simply say "wait," but Romanian law gives you a concrete remedy. Under the Administrative Contentious Law (Legea contenciosului administrativ nr. 554/2004), if a public authority like IGI or ANC fails to respond within its legal deadline, or unjustifiably delays or refuses your file, you have the right to sue that "administrative silence" (tăcere administrativă) or unjustified refusal before the Administrative Contentious Court (Tribunalul de Contencios Administrativ).'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
            <span className="font-extrabold text-[#2F6FED]">{currentLang === 'fa' ? 'مهلت شکایت' : 'Filing Deadline'}</span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'طبق ماده ۱۱ قانون ۵۵۴/۲۰۰۴، شکایت باید ظرف حداکثر ۶ ماه از تاریخی که پاسخ می‌بایست دریافت می‌شد یا از تاریخ ابلاغ رد درخواست ثبت شود.'
                : 'Under Article 11 of Law 554/2004, the lawsuit must be filed within a maximum of 6 months from the date a response was legally due, or from the date the refusal was communicated.'}
            </p>
          </div>
          <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
            <span className="font-extrabold text-[#2F6FED]">{currentLang === 'fa' ? 'مرحله پیش از دادگاه' : 'Prior Administrative Complaint'}</span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'معمولاً پیش از مراجعه به دادگاه باید یک «شکایت اداری قبلی» (plângere prealabilă) کتباً به همان نهاد ارسال شود تا فرصت اصلاح داشته باشد.'
                : 'Before going to court, a written "prior administrative complaint" (plângere prealabilă) is typically sent to the same authority, giving it a chance to correct the issue.'}
            </p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs sm:text-sm text-blue-950 leading-relaxed">
          {currentLang === 'fa'
            ? 'این یک ابزار حقوقی واقعی و کمتر شناخته‌شده است، اما تشکیل پرونده دادرسی اداری نیازمند دقت رویه‌ای است. توصیه می‌شود برای طرح این نوع شکایت با یک وکیل متخصص حقوق اداری رومانی (avocat specializat în drept administrativ) مشورت کنید؛ این صفحه راهنمای عمومی است، نه مشاوره حقوقی فردی.'
            : 'This is a real and under-publicized legal tool, but filing an administrative-contentious case requires procedural precision. It is recommended to consult a Romanian administrative-law attorney (avocat specializat în drept administrativ) to pursue this remedy; this page is general guidance, not individual legal advice.'}
        </div>
      </div>

      {/* SECTION 7: OFFICIAL REFERENCES */}
      <div id="official-references" className="bg-[#071B3D] text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg sm:text-xl font-extrabold border-b border-slate-700 pb-3 flex items-center space-x-2 rtl:space-x-reverse">
          <span>🔗</span>
          <span>{currentLang === 'fa' ? 'منابع رسمی و استعلامات قوانین اقامتی IGI' : 'Official IGI Immigration References'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a href="https://igi.mai.gov.ro" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0b2b55] hover:bg-[#2F6FED] rounded-xl flex items-center justify-between transition-colors">
            <span>{currentLang === 'fa' ? 'پورتال رسمی IGI رومانی' : 'Official IGI Portal'}</span>
            <ExternalLink size={14} />
          </a>
          <a href="https://portal.igi.mai.gov.ro" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0b2b55] hover:bg-[#2F6FED] rounded-xl flex items-center justify-between transition-colors">
            <span>{currentLang === 'fa' ? 'سامانه ثبت وقت آنلاین IGI' : 'IGI Online Appointment Portal'}</span>
            <ExternalLink size={14} />
          </a>
          <a href="https://www.mai.gov.ro" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0b2b55] hover:bg-[#2F6FED] rounded-xl flex items-center justify-between transition-colors">
            <span>{currentLang === 'fa' ? 'وزارت کشور رومانی (MAI)' : 'Ministry of Internal Affairs (MAI)'}</span>
            <ExternalLink size={14} />
          </a>
          <a href="https://legislatie.just.ro/Public/DetaliiDocument/58323" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#0b2b55] hover:bg-[#2F6FED] rounded-xl flex items-center justify-between transition-colors">
            <span>{currentLang === 'fa' ? 'متن کامل قانون ۵۵۴/۲۰۰۴ (دادرسی اداری)' : 'Full Text: Law 554/2004 (Administrative Contentious)'}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* SECTION 8: DATE TAG & RELATED CONTENT */}
      <div id="related-content" className="space-y-6">
        <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl text-center text-xs text-[#788697] font-semibold">
          {currentLang === 'fa'
            ? 'آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶. منبع: آیین‌نامه اتباع خارجی رومانی (OUG 194/2002)، جدول تعرفه ۲۰۲۵ و قانون ۵۵۴/۲۰۰۴ — igi.mai.gov.ro.'
            : 'Last Review: August 2026. Source: OUG 194/2002, the 2025 fee schedule, and Law 554/2004 — igi.mai.gov.ro.'}
        </div>

        {/* RELATED CONTENT BOX */}
        <div className="bg-white p-6 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span>📚</span>
            <span>{currentLang === 'fa' ? 'مطالب مرتبط و گام‌های بعدی' : 'Related Guides & Next Steps'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            <Link href="/immigration/long-term-residence" className="p-4 bg-[#f8fafc] hover:bg-[#eef3f8] border border-[#dfe6ef] rounded-xl space-y-1 block transition-colors">
              <span className="text-[#2F6FED]">🇮🇷 ➔ 🇷🇴</span>
              <div className="text-[#142033] font-extrabold">{currentLang === 'fa' ? 'اقامت بلندمدت و دائم رومانی' : 'Long-Term & Permanent Residence'}</div>
              <p className="text-[11px] text-[#788697] font-normal">{currentLang === 'fa' ? 'شرایط اخذ اقامت ۵ ساله و دائم' : 'Conditions for 5-year permanent status'}</p>
            </Link>
            <Link href="/immigration/citizenship" className="p-4 bg-[#f8fafc] hover:bg-[#eef3f8] border border-[#dfe6ef] rounded-xl space-y-1 block transition-colors">
              <span className="text-[#2F6FED]">🏛️</span>
              <div className="text-[#142033] font-extrabold">{currentLang === 'fa' ? 'شهروندی و تابعیت رومانی' : 'Romanian Citizenship'}</div>
              <p className="text-[11px] text-[#788697] font-normal">{currentLang === 'fa' ? 'قوانین و مراحل پاسپورت رومانی' : 'Passport regulations and requirements'}</p>
            </Link>
            <Link href="/needs/driving-license" className="p-4 bg-[#f8fafc] hover:bg-[#eef3f8] border border-[#dfe6ef] rounded-xl space-y-1 block transition-colors">
              <span className="text-[#2F6FED]">🚗</span>
              <div className="text-[#142033] font-extrabold">{currentLang === 'fa' ? 'تبدیل گواهی‌نامه رانندگی' : 'Driving License Conversion'}</div>
              <p className="text-[11px] text-[#788697] font-normal">{currentLang === 'fa' ? 'مراحل تبدیل گواهی‌نامه پس از دریافت کارت اقامت' : 'License conversion after residency card'}</p>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 8.5: FAQ */}
      <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
        <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
          {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'صدور اولین کارت اقامت چقدر طول می‌کشد؟' : 'How long does the first residence card take to issue?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق مقررات IGI، صدور کارت برای اعضای خانواده غیر اتحادیه اروپا معمولاً ظرف ۹۰ روز از ثبت درخواست کامل انجام می‌شود.' : 'Under IGI regulations, issuance for non-EU family members is typically completed within 90 days of a complete application being registered.'}</p>
          </div>
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر مدارکم ناقص باشد چه اتفاقی می‌افتد؟' : 'What happens if my documents are incomplete?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'IGI حداکثر تا ۳۰ روز مهلت اضافه برای تکمیل مدارک می‌دهد؛ این بازه رسماً زمان‌بندی رسیدگی به پرونده را متوقف می‌کند تا مدارک کامل شود.' : 'IGI grants up to 30 extra days to complete the file; this period officially suspends the processing timeline until the documents are complete.'}</p>
          </div>
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'هزینه صدور کارت اقامت چقدر است؟' : 'How much does the residence card cost?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'برای بیشتر دسته‌ها (کار، تحصیل، پیوست خانواده) هزینه استاندارد ۲۶۵ لئو عوارض دولتی به‌علاوه ۱۲۰ یورو کارمزد صدور کارت است؛ برخی مسیرها تعرفه متفاوت دارند و مبلغ دقیق باید نزد IGI محل خود استعلام شود.' : 'For most categories (work, study, family reunification) the standard cost is 265 RON state tax plus 120 EUR card-issuance fee; some pathways carry different rates, so confirm the exact amount with your local IGI office.'}</p>
          </div>
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر IGI به مهلت قانونی عمل نکند چه گزینه‌ای دارم؟' : 'What can I do if IGI misses its legal deadline?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق قانون ۵۵۴/۲۰۰۴، می‌توانید ظرف ۶ ماه از سکوت یا رد غیرموجه اداره، با کمک وکیل حقوق اداری علیه IGI در دادگاه اداری شکایت کنید.' : 'Under Law 554/2004, you can sue IGI in the administrative court within 6 months of its silence or unjustified refusal, with the help of an administrative-law attorney.'}</p>
          </div>
        </div>
      </div>

      {/* SECTION 9: COMMENTS SECTION */}
      <ParentHubFooterCard slugRoute="immigration/igi-process" currentLang={currentLang} />
      <CommentsSection pagePath="immigration/igi-process" currentLang={currentLang} />
    </div>
  );
};
