'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { CommentsSection } from './CommentsSection';
import { ExternalLink, CheckCircle, ShieldCheck, Clock, FileCheck2, AlertCircle, Users } from './Icons';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface HealthGuideContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const HealthGuideContent: React.FC<HealthGuideContentProps> = ({ currentLang, onNavigate }) => {
  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <Breadcrumb slugRoute="needs/health" currentLang={currentLang} onNavigate={onNavigate} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
          <span>🏥 {currentLang === 'fa' ? 'راهنمای جامع نظام درمانی و ثبت‌نام CNAS رومانی' : 'CNAS Healthcare System & Family Doctor Registration Guide'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {currentLang === 'fa'
            ? 'بیمه سلامت عمومی، ثبت‌نام پزشک خانواده و کارت CEASS'
            : 'Public Health Insurance, Family Doctor Registration & CEASS Card'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'راهنمای رسمی و تاییدشده پوشش بیمه سلامت رومانی از طریق CNAS، شرایط هم‌بیمه (Coasigurat)، مراحل ثبت‌نام نزد پزشک خانواده (Medic de Familie) و استعلام آنی وضعیت بیمه با کد CNP.'
            : 'Official verified guide to Romania’s CNAS health insurance system, co-insured family coverage (Coasigurat), family doctor (Medic de Familie) registration, and instant CNP status verification.'}
        </p>
        <div className="text-xs text-slate-400 pt-2 flex items-center space-x-2 rtl:space-x-reverse border-t border-slate-700/60">
          <span>🏛️</span>
          <span>
            {currentLang === 'fa'
              ? 'منبع رسمی: سازمان ملی بیمه سلامت رومانی (CNAS) — cnas.ro'
              : 'Official Source: National Health Insurance House of Romania (CNAS) — cnas.ro'}
          </span>
        </div>
      </div>

      {/* EMERGENCY NUMBER CALLOUT */}
      <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-900">
        <span className="text-2xl">🚨</span>
        <p className="text-sm font-semibold leading-relaxed">
          {currentLang === 'fa'
            ? <>شماره تلفن اورژانس سراسری و رایگان رومانی <strong className="text-lg">۱۱۲</strong> است (پلیس، آمبولانس، آتش‌نشانی) — از هر خطی حتی بدون سیم‌کارت هم قابل تماس است و اپراتورها معمولاً انگلیسی هم صحبت می‌کنند. این شماره را همین حالا در گوشی خود ذخیره کنید.</>
            : <>Romania's unified, free emergency number is <strong className="text-lg">112</strong> (police, ambulance, fire) — reachable from any phone, even without a SIM card, and operators typically speak English. Save this number now.</>}
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
          <a href="#coverage-table" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۲. جدول شرایط پوشش' : '2. Coverage Table'}
          </a>
          <a href="#registration-steps" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۳. ثبت‌نام پزشک خانواده' : '3. Family Doctor Steps'}
          </a>
          <a href="#required-docs" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۴. مدارک لازم' : '4. Required Documents'}
          </a>
          <a href="#european-card" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۵. کارت اروپایی بیمه (CEASS)' : '5. European Card (CEASS)'}
          </a>
          <a href="#common-issues" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۶. مشکلات متداول' : '6. Troubleshooting'}
          </a>
          <a href="#official-sources" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۷. منابع رسمی و SIUI' : '7. Official Sources & SIUI'}
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
            {currentLang === 'fa' ? 'پاسخ سریع: سیستم بیمه سلامت رومانی (CNAS) چگونه عمل می‌کند؟' : 'Quick Answer: How Does CNAS Insurance System Work?'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'سیستم درمان عمومی در رومانی توسط سازمان ملی بیمه سلامت (Casa Națională de Asigurări de Sănătate – CNAS) و ۴۳ صندوق استانی زیرمجموعه‌اش (Case Județene de Asigurări de Sănătate) اداره می‌شود. تمامی افراد شاغل قانونی که سهمیه CASS از حقوق آن‌ها کسر می‌گردد، خودکار بیمه‌شده (Asigurat) بوده و حق استفاده از خدمات درمانی عمومی را دارند. اعضای خانواده بدون درآمد مستقیم (مانند همسر) نیز می‌توانند به عنوان «هم‌بیمه» (Coasigurat) ثبت شده و بدون پرداخت حق بیمه جداگانه، از پوشش کامل بهره‌مند گردند. دروازه اصلی دسترسی به تمام خدمات غیر اورژانسی، ثبت‌نام نزد یک پزشک خانواده (Medic de Familie) است.'
            : 'The public healthcare system in Romania is managed by the National Health Insurance House (CNAS) and its 43 county houses (CJAS). Any legally employed resident contributing CASS payroll tax is automatically insured (Asigurat). Non-earning family members (e.g. spouses) can be registered as co-insured (Coasigurat) under an insured relative without paying extra premiums. To access non-emergency public care, registration with a CNAS-contracted Family Doctor (Medic de Familie) is mandatory.'}
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#142033] flex items-start space-x-3 rtl:space-x-reverse">
          <span className="text-base mt-0.5">💡</span>
          <div>
            <strong className="block font-bold">{currentLang === 'fa' ? 'نکته کلیدی استعلام بیمه:' : 'Key Insurance Verification Note:'}</strong>
            {currentLang === 'fa'
              ? 'معتبر بودن بیمه هر شخص نیازمند دفترچه کاغذی نیست؛ پزشکان وضعیت بیمه‌شده را بلافاصله با وارد کردن کد شناسایی ملی (CNP) در سیستم یکپارچه SIUI استعلام می‌کنند.'
              : 'Active insurance status does not require a paper booklet; doctors verify coverage instantly online using your Personal Numeric Code (CNP) in the SIUI system.'}
          </div>
        </div>
      </div>

      {/* SECTION 3: PREREQUISITES & COVERAGE TABLE */}
      <div id="coverage-table" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📊</span>
          <span>{currentLang === 'fa' ? 'جدول شرایط پوشش بیمه‌ای در رومانی' : 'Insurance Coverage & Eligibility Summary Table'}</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#071B3D] text-white">
                <th className="p-3.5 rounded-r-xl">{currentLang === 'fa' ? 'دسته‌بندی متقاضی' : 'Applicant Category'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'مبنای حق بیمه (CASS)' : 'CASS Contribution Basis'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'وضعیت پوشش CNAS' : 'CNAS Coverage Status'}</th>
                <th className="p-3.5 rounded-l-xl">{currentLang === 'fa' ? 'ملاحظات و راهنما' : 'Notes & Guide'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe6ef]">
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'شاغلین با قرارداد کار (Contract de Muncă)' : 'Employed Contract Workers'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'کسر خودکار سهم CASS از حقوق توسط کارفرما' : 'Automatic CASS payroll deduction'}</td>
                <td className="p-3.5 font-bold text-emerald-600">{currentLang === 'fa' ? 'بیمه‌شده کامل (Asigurat)' : 'Fully Insured (Asigurat)'}</td>
                <td className="p-3.5">
                  <Link href="/work/insurance" onClick={() => handleNav('work/insurance')} className="text-[#2F6FED] font-bold hover:underline">
                    {currentLang === 'fa' ? 'جزئیات مالیات بیمه کار 🔗' : 'Labor Insurance Details 🔗'}
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'اعضای خانواده بدون درآمد (Coasigurat)' : 'Co-Insured Family (Coasigurat)'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'بدون پرداخت حق بیمه جداگانه (تحت تکفل)' : 'No extra premium (Dependents)'}</td>
                <td className="p-3.5 font-bold text-emerald-600">{currentLang === 'fa' ? 'بیمه‌شده وابسته (Coasigurat)' : 'Co-Insured Status'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'ثبت مدارک همسر/والدین در صندوق استانی CJAS' : 'Submit spouse/parent docs to CJAS'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'افراد بدون درآمد مستقیم / خویش‌فرما' : 'Unemployed / Non-income Individuals'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'پرداخت اختیاری حق بیمه سالانه (Declarația Unică)' : 'Optional annual CASS contribution'}</td>
                <td className="p-3.5 font-bold text-amber-600">{currentLang === 'fa' ? 'نیازمند استعلام مستقیم' : 'Direct Inquiry Required'}</td>
                <td className="p-3.5 text-[#526174]">
                  {currentLang === 'fa'
                    ? '⚠️ قوانین پرداخت اختیاری یا معافیت‌ها بستگی به نوع اقامت دارد؛ جهت بررسی گزینه‌ها حتماً مستقیماً از صندوق استانی CNAS استعلام بگیرید.'
                    : '⚠️ Optional CASS rates depend on residency type; verify exact options directly with your regional CJAS office.'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: STEP-BY-STEP REGISTRATION */}
      <div id="registration-steps" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📋</span>
          <span>{currentLang === 'fa' ? 'مراحل گام‌به‌گام ثبت‌نام نزد پزشک خانواده (Medic de Familie)' : 'Step-by-Step Family Doctor Registration'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۱</span>
              <h3>{currentLang === 'fa' ? 'انتخاب پزشک خانواده در منطقه سکونت' : 'Select a Local Family Doctor'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'یک پزشک خانواده (Medic de Familie) طرف قرارداد با CNAS در نزدیک‌ترین درمانگاه یا کلینیک محل سکونت خود پیدا کنید.'
                : 'Locate a CNAS-contracted family doctor near your residential address in Romania.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۲</span>
              <h3>{currentLang === 'fa' ? 'مراجعه حضوری و ارائه مدارک' : 'Visit Clinic & Present Documents'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'با در دست داشتن کارت اقامت (Permis de Ședere)، کد CNP و مدارک اثبات بیمه به مطب پزشک مراجعه نمایید.'
                : 'Visit the doctor’s office with your valid residence permit (Permis de Ședere) containing your CNP.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۳</span>
              <h3>{currentLang === 'fa' ? 'استعلام آنی CNP در سامانه SIUI' : 'Instant SIUI System Verification'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'پزشک وضعیت فعال بودن بیمه شما را از طریق سامانه آنلاین SIUI با وارد کردن CNP فوراً بررسی می‌کند.'
                : 'The doctor inputs your CNP code into the online SIUI database to confirm active coverage immediately.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۴</span>
              <h3>{currentLang === 'fa' ? 'تکمیل فرم Cerere de Înscriere' : 'Complete Registration Form'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'فرم درخواست ثبت‌نام را در محل مطب امضا کرده و نام شما در فهرست بیماران (Lista de Pacienți) پزشک وارد می‌شود.'
                : 'Sign the Cerere de Înscriere form at the clinic to enter the doctor’s official patient roster.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: REQUIRED DOCUMENTS CHECKLIST */}
      <div id="required-docs" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <FileCheck2 className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'چک‌لیست مدارک لازم برای ثبت‌نام پزشک خانواده' : 'Required Documents Checklist'}</span>
        </h2>

        <ul className="space-y-3 text-xs sm:text-sm text-[#526174]">
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'کارت اقامت معتبر (Permis de Ședere):' : 'Valid Residence Permit (Permis de Ședere):'}</strong>
              <span> {currentLang === 'fa' ? 'مدرک اصلی هویتی شما در رومانی که کد ۱۰ یا ۱۳ رقمی CNP روی آن درج شده است.' : 'Your primary ID card in Romania containing your CNP code.'}</span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'کارت ملی سلامت (Cardul Național de Sănătate):' : 'National Health Card (Cardul Național de Sănătate):'}</strong>
              <span> {currentLang === 'fa' ? 'در صورت صدور توسط CNAS (اگر هنوز صادر نشده، استعلام با CNP در SIUI کافی است).' : 'If already issued by CNAS (if not issued yet, SIUI lookup with CNP is sufficient).'}</span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'فرم درخواست ثبت‌نام (Cerere de Înscriere):' : 'Registration Application Form (Cerere de Înscriere):'}</strong>
              <span> {currentLang === 'fa' ? 'در محل مطب پزشک خانواده تکمیل و امضا می‌شود.' : 'Filled out and signed directly at the doctor’s office.'}</span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'گواهی اثبات اشتغال / بیمه:' : 'Proof of Insurance Contribution:'}</strong>
              <span>
                {currentLang === 'fa'
                  ? ' گواهی اشتغال به کار، فیش حقوقی نشان‌دهنده پرداخت CASS، یا مدرک هم‌بیمه (Coasigurat). برای اطلاعات بیشتر در خصوص بیمه کار، به '
                  : ' Employment certificate or payslip showing CASS deduction. For labor insurance details, visit '}
                <Link href="/work/insurance" onClick={() => handleNav('work/insurance')} className="text-[#2F6FED] font-bold hover:underline">
                  {currentLang === 'fa' ? 'صفحه بیمه کار در رومانی' : 'Work Insurance Guide'}
                </Link>
                {currentLang === 'fa' ? ' مراجعه فرمایید.' : '.'}
              </span>
            </div>
          </li>
        </ul>
      </div>

      {/* SECTION 6: EUROPEAN HEALTH INSURANCE CARD (CEASS) */}
      <div id="european-card" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#2F6FED]">
          <ShieldCheck size={24} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'کارت اروپایی بیمه سلامت (CEASS / EHIC) چیست؟' : 'European Health Insurance Card (CEASS / EHIC)'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'کارت اروپایی بیمه سلامت (Cardul European de Asigurări de Sănătate – CEASS) مدرکی است که به افراد بیمه‌شده در CNAS امکان می‌دهد حین سفرهای موقت (گردشگری، کاری یا تحصیلی کوتاه) به سایر کشورهای عضو اتحادیه اروپا، EEA یا سوئیس، از خدمات درمانی ضروری و اورژانسی عمومی بهره‌مند شوند.'
            : 'The European Health Insurance Card (CEASS / EHIC) allows CNAS-insured residents to access necessary state-provided healthcare during temporary stays in other EU/EEA countries or Switzerland.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold pt-2">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
            <span className="block text-sm mb-1">✈️ {currentLang === 'fa' ? 'مخصوص سفر موقت' : 'Temporary Travel Only'}</span>
            <span className="font-normal text-amber-800">
              {currentLang === 'fa' ? 'این کارت فقط برای سفرهای خارج از رومانی است و جایگزین درمان داخلی در رومانی نمی‌شود.' : 'For travel outside Romania only; not used for daily domestic Romanian healthcare.'}
            </span>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
            <span className="block text-sm mb-1">💳 {currentLang === 'fa' ? 'صدور رایگان' : 'Free Issuance'}</span>
            <span className="font-normal text-emerald-800">
              {currentLang === 'fa' ? 'صدور کارت CEASS برای تمامی بیمه‌شدگان فعّال در CNAS کاملاً رایگان است.' : 'Issued free of charge to any resident with active CNAS coverage.'}
            </span>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
            <span className="block text-sm mb-1">📅 {currentLang === 'fa' ? 'اعتبار ۲ ساله' : '2-Year Validity'}</span>
            <span className="font-normal text-blue-800">
              {currentLang === 'fa' ? 'مدت اعتبار کارت اروپایی ۲ سال از تاریخ صدور می‌باشد.' : 'Valid for 2 years from the date of issuance.'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 7: COMMON ISSUES & TROUBLESHOOTING */}
      <div id="common-issues" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <AlertCircle className="text-amber-500" size={24} />
          <span>{currentLang === 'fa' ? 'مشکلات متداول و راه‌حل‌ها' : 'Common Issues & Solutions'}</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1">
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۱. ظرفیت پذیرش پزشک خانواده پر است:' : '1. Family Doctor List is Full:'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'پزشکان خانواده سقف مشخصی برای پذیرش بیمار دارند. در صورت رد درخواست، به سایر پزشکان خانواده حوزه استانی محل سکونت مراجعه کنید.'
                : 'Doctors have max patient list limits. If rejected, contact another CNAS family doctor in your district.'}
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1">
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۲. کارت ملی سلامت (Cardul Național de Sănătate) صادر نشده:' : '2. National Health Card Not Yet Issued:'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'عدم صدور یا تاخیر در تحویل کارت فیزیکی مانع دریافت خدمات نیست؛ استعلام مستقیم کد CNP در سیستم SIUI یا دریافت برگه Adeverință de Asigurat از صندوق استانی جایگزین قانونی آن است.'
                : 'Physical card delays do not block care. SIUI CNP verification or an Adeverință de Asigurat certificate from CJAS serves as legal proof.'}
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1">
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۳. تغییر پزشک خانواده:' : '3. Changing Your Family Doctor:'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'طبق قوانین CNAS، تغییر پزشک خانواده تنها پس از گذشت حداقل ۶ ماه از ثبت‌نام نزد پزشک قبلی با ارائه درخواست کتبی امکان‌پذیر است.'
                : 'Under CNAS regulations, you can switch family doctors after a minimum of 6 months with your current doctor.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 8: OFFICIAL SOURCES & SIUI */}
      <div id="official-sources" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <ExternalLink className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'منابع رسمی و استعلام آنلاین SIUI' : 'Official Sources & SIUI Verification Portal'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'برای استعلام مستقیم وضعیت بیمه‌شده با کد CNP و دسترسی به بخشنامه‌های رسمی، می‌توانید به پرتال‌های زیر مراجعه فرمایید:'
            : 'For direct CNP insurance status check and official CNAS guidelines, refer to the official portals below:'}
        </p>
        <div className="flex flex-wrap gap-3 text-xs font-bold">
          <a
            href="https://cnas.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] p-3 rounded-xl border border-[#dfe6ef] transition-colors"
          >
            <span>🌐</span>
            <span>cnas.ro (پرتال رسمی CNAS)</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* SECTION 9: LAST REVIEWED DATE */}
      <div id="last-reviewed" className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-[#526174] flex items-center space-x-2 rtl:space-x-reverse">
        <Clock size={16} className="text-slate-400" />
        <span>
          {currentLang === 'fa'
            ? 'آخرین بررسی و به‌روزرسانی محتوا: سال ۲۰۲۶ (بر اساس ضوابط سازمان ملی بیمه سلامت رومانی CNAS)'
            : 'Last reviewed & updated: 2026 (Based on official Romanian National Health Insurance House CNAS guidelines)'}
        </span>
      </div>

      {/* SECTION 10: RELATED CONTENT & COMMENTS */}
      <div id="related-content" className="space-y-6 pt-4">
        <h3 className="text-lg font-extrabold text-[#142033]">
          {currentLang === 'fa' ? 'مطالب مرتبط' : 'Related Guides'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => handleNav('work/insurance')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>💼</span>
              <span>{currentLang === 'fa' ? 'بیمه و مالیات نیروی کار در رومانی' : 'Labor Insurance & Taxes in Romania'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'نرخ مالیات، کسورات CASS و CAS، و حقوق قانونی نیروهای کار.'
                : 'CASS tax deductions, employment contributions, and worker coverage rights.'}
            </p>
          </div>

          <div
            onClick={() => handleNav('immigration/igi-process')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🏛️</span>
              <span>{currentLang === 'fa' ? 'مراحل کارت اقامت و قوانین IGI' : 'IGI Residence Permit Guide'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'زمان‌بندی صدور کارت اقامت، CNP و مدارک لازم در اداره کل مهاجرت.'
                : 'IGI residence card processing timelines, CNP assignment, and renewal procedures.'}
            </p>
          </div>
        </div>

        <ParentHubFooterCard slugRoute="needs/health" currentLang={currentLang} onNavigate={onNavigate} />

        {/* COMMENTS SECTION */}
        <div className="pt-6">
          <CommentsSection currentLang={currentLang} pagePath="needs/health" />
        </div>
      </div>
    </div>
  );
};
