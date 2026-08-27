'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { CommentsSection } from './CommentsSection';
import { ExternalLink, CheckCircle, ShieldCheck, Clock, FileCheck2, AlertCircle, Users } from './Icons';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface FamilyReunificationContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const FamilyReunificationContent: React.FC<FamilyReunificationContentProps> = ({ currentLang, onNavigate }) => {
  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <Breadcrumb slugRoute="immigration/family-reunification" currentLang={currentLang} onNavigate={onNavigate} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
          <span>👨‍👩‍👧‍👦 {currentLang === 'fa' ? 'راهنمای جامع پیوست خانواده در رومانی' : 'Family Reunification Comprehensive Guide in Romania'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {currentLang === 'fa'
            ? 'شرایط، مدارک و مراحل قانونی الحاق اعضای خانواده نزد IGI'
            : 'Family Reunification Process, Eligible Sponsors & IGI Legal Regulations'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'راهنمای رسمی و تاییدشده قوانین اداره کل مهاجرت رومانی (IGI)، زمان‌بندی حداکثر ۳ ماهه رسیدگی، فهرست کامل حامیان واجد شرایط، تمکن مالی و مهلت ۶۰ روزه سفارت.'
            : 'Official verified guide to Romanian General Inspectorate for Immigration (IGI) family reunification rules, 3-month maximum processing timeline, eligible sponsors, financial & housing criteria.'}
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
          <a href="#sponsors-table" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۲. فهرست حامیان واجد شرایط' : '2. Eligible Sponsors Table'}
          </a>
          <a href="#reunification-steps" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۳. مراحل گام‌به‌گام' : '3. Step-by-Step Steps'}
          </a>
          <a href="#required-docs" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۴. مدارک لازم' : '4. Required Documents'}
          </a>
          <a href="#iran-doc-chain" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۴.۵ زنجیره تایید مدارک ایرانی' : '4.5 Iranian Document Chain'}
          </a>
          <a href="#timelines" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۵. زمان‌بندی قانونی (۳ ماه)' : '5. Official Timelines (3 Mos)'}
          </a>
          <a href="#rejection-grounds" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۶. دلایل رد درخواست' : '6. Rejection Grounds'}
          </a>
          <a href="#official-sources" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۷. منابع رسمی IGI' : '7. Official Sources (IGI)'}
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
            {currentLang === 'fa' ? 'پاسخ سریع: قوانین و مهلت قانونی پیوست خانواده در رومانی چیست؟' : 'Quick Answer: How Does Family Reunification Work in Romania?'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'فرآیند پیوست خانواده (Family Reunification / Reîntregirea Familiei) چارچوب قانونی است که به شهروندان رومانیایی و اتباع خارجی واجد شرایط اقامت اجازه می‌دهد همسر و فرزندان تحت تکفل خود را به رومانی منتقل کنند. طبق ضوابط رسمی اداره کل مهاجرت (igi.mai.gov.ro)، رسیدگی به درخواست پیوست خانواده حداکثر ظرف سه ماه از تاریخ ثبت پرونده در IGI انجام می‌شود. پس از موافقت IGI و صدور برگه تاییدیه کتبی، اعضای خانواده دقیقاً ۶۰ روز مهلت دارند تا با مراجعه به سفارت یا کنسولگری رومانی، درخواست ویزای بلندمدت نوع D اعطا نمایند.'
            : 'Family Reunification under Romanian law allows eligible foreign residents and Romanian citizens to bring their spouse and dependent minor children to live in Romania. Per official General Inspectorate for Immigration (IGI) regulations (igi.mai.gov.ro), applications are processed within a maximum of 3 months from the registration date. Upon IGI approval and issuance of a written decision, family members have exactly 60 days to submit their Type D long-stay visa application at a Romanian embassy or consulate.'}
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#142033] flex items-start space-x-3 rtl:space-x-reverse">
          <span className="text-base mt-0.5">💡</span>
          <div>
            <strong className="block font-bold">{currentLang === 'fa' ? 'اصلاح مهم زمان‌بندی رسیدگی:' : 'Important Processing Timeline Correction:'}</strong>
            {currentLang === 'fa'
              ? 'بر خلاف برخی اطلاعات نادرست، مهلت قانونی رسیدگی IGI به پرونده پیوست خانواده «حداکثر ۳ ماه از تاریخ ثبت» است (نه ۹۰ روز کاری).'
              : 'Per official IGI rules, legal processing time is a maximum of 3 months from registration date (not 90 working days).'}
          </div>
        </div>
      </div>

      {/* SECTION 3: SPONSORS TABLE */}
      <div id="sponsors-table" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <Users className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'فهرست کامل حامیان (Sponsor) واجد شرایط در رومانی' : 'Comprehensive Eligible Sponsors List'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'طبق مقررات رسمی IGI، افراد زیر حق درخواست پیوست خانواده برای همسر و فرزندان مجرد تحت سرپرستی خود را دارند:'
            : 'Under official IGI regulations, the following individuals are legally entitled to act as a sponsor for family reunification:'}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-right rtl text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#071B3D] text-white">
                <th className="p-3.5 rounded-r-xl">{currentLang === 'fa' ? 'دسته حامی (Sponsor)' : 'Sponsor Category'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'شرایط و اعتبار اقامت' : 'Residency Criteria'}</th>
                <th className="p-3.5 rounded-l-xl">{currentLang === 'fa' ? 'اعضای خانواده مشمول' : 'Eligible Family Members'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe6ef]">
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'دارنده اقامت موقت (Permis de Ședere)' : 'Temporary Residence Holder'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'اقامت موقت معتبر با اعتبار حداقل ۱ سال' : 'Valid temporary permit with min 1-year validity'}</td>
                <td className="p-3.5 text-[#526174]">{currentLang === 'fa' ? 'همسر قانونی + فرزندان مجرد زیر ۱۸ سال' : 'Legal spouse + unmarried minor children'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'دارنده کارت آبی اتحادیه اروپا (EU Blue Card)' : 'EU Blue Card Holder'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'دارنده کارت آبی معتبر یا متقاضی همزمان اولین کارت آبی' : 'Valid Blue Card holder or simultaneous first-time applicant'}</td>
                <td className="p-3.5 text-[#526174]">{currentLang === 'fa' ? 'همسر + فرزندان (فرآیند اولویت‌دار سریع)' : 'Spouse + children (priority processing)'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'دارنده مجوز ICT یا Mobile ICT' : 'ICT / Mobile ICT Permit Holder'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'انتقال درون‌شرکتی معتبر در رومانی' : 'Intra-corporate transferee permit holder'}</td>
                <td className="p-3.5 text-[#526174]">{currentLang === 'fa' ? 'همسر + فرزندان زیر سرپرستی' : 'Spouse + dependent children'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'دارنده اقامت بلندمدت (Rezidență pe Termen Lung)' : 'Long-Term Resident Holder'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'اقامت دائم/بلندمدت ۵ ساله رومانی یا EU' : 'Long-term 5-year resident in Romania or EU'}</td>
                <td className="p-3.5 text-[#526174]">{currentLang === 'fa' ? 'همسر + فرزندان (و در موارد خاص والدین نیازمند مراقبت)' : 'Spouse + children (and dependent parents in special cases)'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'وضعیت پناهندگی یا حمایت تکمیلی' : 'Refugee / Subsidiary Protection Holder'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'دارای وضعیت رسمی Protecție Subsidiară یا پناهندگی' : 'Official refugee status or Protecție Subsidiară'}</td>
                <td className="p-3.5 text-[#526174]">{currentLang === 'fa' ? 'همسر + فرزندان (معاف از برخی شرایط تمکن مالی)' : 'Spouse + children (exempt from certain income proofs)'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'شهروند رومانیایی (Cetățean Român)' : 'Romanian Citizen'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'تبعه رسمی رومانی' : 'Romanian national'}</td>
                <td className="p-3.5 text-[#526174]">{currentLang === 'fa' ? 'همسر غیر EU + فرزندان' : 'Non-EU spouse + children'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: STEP-BY-STEP PROCESS */}
      <div id="reunification-steps" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📋</span>
          <span>{currentLang === 'fa' ? 'مراحل گام‌به‌گام پیوست خانواده' : 'Step-by-Step Reunification Workflow'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۱</span>
              <h3>{currentLang === 'fa' ? 'ثبت پرونده حامی نزد IGI در رومانی' : 'Submit Sponsor Application at IGI'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'حامی پرونده را شامل اثبات نسبت، تمکن مالی و مسکن در دفتر استانی IGI محل سکونت ثبت می‌کند.'
                : 'The sponsor submits documents (relationship proof, income, housing) at their regional IGI office in Romania.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۲</span>
              <h3>{currentLang === 'fa' ? 'بررسی پرونده و استعلام IGI (حداکثر ۳ ماه)' : 'IGI Evaluation (Max 3 Months)'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'IGI درخواست را حداکثر ظرف سه ماه بررسی کرده و عدم صوری بودن ازدواج را استعلام می‌نماید.'
                : 'IGI processes the request within a maximum of 3 months and verifies marriage authenticity.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۳</span>
              <h3>{currentLang === 'fa' ? 'دریافت برگه تاییدیه و مهلت ۶۰ روزه سفارت' : 'Written Approval & 60-Day Visa Deadline'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'پس از موافقت، اعضای خانواده ظرف ۶۰ روز از تاریخ صدور تاییدیه برای ویزای بلندمدت نوع D در سفارت ثبت‌نام می‌کنند.'
                : 'Family members must apply for a Type D long-stay visa at a Romanian embassy within 60 days of approval.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۴</span>
              <h3>{currentLang === 'fa' ? 'ورود به رومانی و دریافت کارت اقامت' : 'Arrival in Romania & Residence Card'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'اعضای خانواده وارد کشور شده و ظرف ۳۰ روز مانده به انقضای ویزا، کارت اقامت موقت (Cartea de Rezidență) خود را دریافت می‌نمایند.'
                : 'Family members enter Romania and collect their residence card at IGI before visa expiry.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: REQUIRED DOCUMENTS CHECKLIST */}
      <div id="required-docs" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <FileCheck2 className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'چک‌لیست مدارک لازم (تمکن مالی، مسکن و مدارک نسبت)' : 'Required Documents Checklist'}</span>
        </h2>

        <ul className="space-y-3 text-xs sm:text-sm text-[#526174]">
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'اثبات نسبت خانوادگی:' : 'Proof of Family Relationship:'}</strong>
              <span>
                {currentLang === 'fa'
                  ? ' سند ازدواج رسمی، شناسنامه فرزندان، با ترجمه رسمی به زبان رومانیایی توسط مترجم رسمی ('
                  : ' Official marriage certificate, children birth certificates, with certified Romanian translation ('}
                <Link href="/needs/certified-translation" onClick={() => handleNav('needs/certified-translation')} className="text-[#2F6FED] font-bold hover:underline">
                  {currentLang === 'fa' ? 'صفحه دارالترجمه رسمی' : 'Translation Guide'}
                </Link>
                {currentLang === 'fa' ? ') و داشتن مهر آپوستیل یا تاییدیه کنسولی.' : ') and apostille/consular legalization.'}
              </span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'شرط تمکن مالی حامی:' : 'Sponsor Financial Requirements:'}</strong>
              <span> {currentLang === 'fa' ? 'اثبات تمکن مالی معادل حداقل حقوق پایه ناخالص کشوری به‌ازای هر عضو خانواده برای حداقل ۳ ماه (علاوه بر هزینه‌های شخصی حامی).' : 'Proof of income equal to at least the national gross minimum wage per family member for at least 3 months.'}</span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'شرط مسکن مناسب:' : 'Suitable Housing Proof:'}</strong>
              <span> {currentLang === 'fa' ? 'ارائه سند مالکیت یا قرارداد اجاره معتبر با متراژ و شرایط مناسب برای سکونت تمامی اعضای خانواده.' : 'Legal property ownership title or registered rental contract with sufficient living space.'}</span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'مدارک هویتی و سوء‌پیشینه:' : 'IDs & Criminal Background Check:'}</strong>
              <span> {currentLang === 'fa' ? 'کپی پاسپورت معتبر اعضای خانواده، گواهی عدم سوء‌پیشینه و عدم ابتلای به بیماری‌های واگیردار.' : 'Valid passports, clean criminal record certificates, and medical clearance certificates.'}</span>
            </div>
          </li>
        </ul>
      </div>

      {/* SECTION 4.5: IRANIAN DOCUMENT LEGALIZATION CHAIN — NARRATIVE */}
      <div id="iran-doc-chain" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📜</span>
          <span>{currentLang === 'fa' ? 'چرا سند ازدواج ایرانی شما نمی‌تواند فقط با آپوستیل تایید شود' : 'Why Your Iranian Marriage Certificate Can\'t Just Get an Apostille'}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'ایران عضو کنوانسیون آپوستیل لاهه نیست — دقیقاً همان مشکلی که در صفحه مدارک تحصیلی این سایت هم توضیح داده شده. برای همین، سند ازدواج یا شناسنامه فرزندان صادرشده در ایران نمی‌تواند با یک مهر آپوستیل ساده در رومانی معتبر شود، و باید مسیر «تصدیق کنسولی» (Supralegalizare) را طی کند: ابتدا مدرک باید نزد مرجع صالح ایرانی (وزارت دادگستری و/یا وزارت امور خارجه ایران) تایید شود، سپس توسط سفارت یا کنسولگری رومانی در تهران مهر تاییدیه بخورد، و در نهایت در رومانی توسط مترجم رسمی سوگندخورده ترجمه و نزد دفترخانه اسناد رسمی رومانیایی تصدیق شود.'
            : 'Iran is not a member of the Hague Apostille Convention — the same issue already documented on this site\'s study-documents page. That means an Iranian marriage certificate or children\'s birth certificate cannot be validated in Romania with a simple apostille stamp; it must go through the "consular legalization" (Supralegalizare) chain instead: first authenticated by the competent Iranian authority (Ministry of Justice and/or Iranian Ministry of Foreign Affairs), then legalized by the Romanian Embassy/Consulate in Tehran, and finally translated by a certified sworn translator and notarized at a Romanian notary public.'}
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-[#142033] leading-relaxed">
          <strong className="block font-bold mb-1">{currentLang === 'fa' ? 'یک سوال مهم که باید از وکیل خود بپرسید:' : 'An important question to ask your lawyer:'}</strong>
          {currentLang === 'fa'
            ? 'اگر ازدواج شما فقط به‌صورت عقد شرعی/مذهبی انجام شده و به‌طور رسمی نزد سازمان ثبت احوال ایران ثبت نشده، پیش از هرگونه اقدام حتماً با یک وکیل مهاجرت بررسی کنید که آیا این سند برای پرونده پیوست خانواده نزد IGI پذیرفته می‌شود یا خیر. این سایت نتوانست منبع رسمی روشنی برای این حالت خاص پیدا کند — پس این نکته را به‌عنوان یک ریسک احتمالی، نه یک قانون قطعی، در نظر بگیرید و حتماً پیش از اقدام شخصاً تایید بگیرید.'
            : 'If your marriage was performed only as a religious ceremony (aghd) and was not formally registered with Iran\'s civil registry (Sabt-e Ahval), check with an immigration lawyer before proceeding whether IGI will accept this certificate for a family reunification file. This site could not find a clear official source addressing this specific scenario — treat this as a potential risk to verify personally, not a settled rule.'}
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'یک نکته مهم دیگر برای برنامه‌ریزی: پلتفرم جدید و یکپارچه دولتی WorkinRomania.gov.ro (که در ۸ اوت ۲۰۲۶ به‌طور کامل راه‌اندازی شد) صراحتاً پرونده‌های پیوست خانواده را پوشش نمی‌دهد — طبق تایید شرکت مهاجرتی بین‌المللی Fragomen، این فرآیند همچنان کاملاً حضوری و کاغذی باقی می‌ماند. پس اگر انتظار یک فرآیند کاملاً آنلاین مشابه اجازه کار دارید، این انتظار برای پیوست خانواده درست نیست.'
            : 'One more planning note: the new unified government platform WorkinRomania.gov.ro (fully launched August 8, 2026) explicitly does not cover family reunification cases — per international immigration firm Fragomen, this process remains entirely in-person and paper-based. So if you were expecting a fully online process similar to work permits, that expectation does not hold for family reunification.'}
        </p>
        <p className="text-xs text-[#788697] leading-relaxed">
          {currentLang === 'fa'
            ? 'منابع: Schmidt & Schmidt (راهنمای تصدیق کنسولی ایران)، CNRED (صفحه رسمی Supralegalizare)، centruldevize.ro، Fragomen (تحلیل راه‌اندازی WorkinRomania.gov.ro، ۲۰۲۶). جزئیات پذیرش یا رد ازدواج غیرثبتی مذهبی توسط IGI در منبع رسمی یافت نشد.'
            : 'Sources: Schmidt & Schmidt (Iran consular legalization guide), CNRED (official Supralegalizare page), centruldevize.ro, Fragomen (WorkinRomania.gov.ro launch analysis, 2026). No official source was found addressing IGI\'s acceptance or rejection of unregistered religious marriages specifically.'}
        </p>
      </div>

      {/* SECTION 6: OFFICIAL TIMELINES */}
      <div id="timelines" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#2F6FED]">
          <Clock size={24} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'زمان‌بندی‌های تاییدشده قانونی IGI' : 'Official Legal Processing Timelines'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold pt-2">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
            <span className="block text-sm mb-1">⏳ {currentLang === 'fa' ? 'حداکثر ۳ ماه رسیدگی IGI' : 'Max 3 Months IGI Processing'}</span>
            <span className="font-normal text-emerald-800">
              {currentLang === 'fa'
                ? 'رسیدگی به درخواست اولیه پیوست خانواده در اداره IGI حداکثر ظرف سه ماه از تاریخ ثبت انجام می‌شود (در موارد استثنایی تا ۳۰ روز قابل تمدید است).'
                : 'Initial IGI application processing takes up to a maximum of 3 months from submission date.'}
            </span>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
            <span className="block text-sm mb-1">📅 {currentLang === 'fa' ? '۶۰ روز مهلت مراجعه به سفارت' : '60 Days Embassy Visa Deadline'}</span>
            <span className="font-normal text-amber-800">
              {currentLang === 'fa'
                ? 'اعضای خانواده باید ظرف ۶۰ روز از تاریخ صدور نامه تایید کتبی IGI، همراه با مدارک به سفارت رومانی مراجعه و ویزای نوع D را دریافت کنند.'
                : 'Family members must apply for their Type D visa at the Romanian consulate within 60 days of IGI approval date.'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 7: REJECTION GROUNDS */}
      <div id="rejection-grounds" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <AlertCircle className="text-amber-500" size={24} />
          <span>{currentLang === 'fa' ? 'دلایل اصلی رد درخواست پیوست خانواده' : 'Grounds for Rejection & Marriage Verification'}</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1">
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۱. احراز ازدواج صوری (Căsătorie de Conveniență):' : '1. Marriage of Convenience (Căsătorie de Conveniență):'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'اگر تحقیقات میدانی یا مصاحبه IGI نشان دهد که ازدواج تنها با هدف کسب منافع اقامتی صورت گرفته است، درخواست بلافاصله رد می‌گردد.'
                : 'If IGI investigations reveal that a marriage was contracted solely to gain immigration benefits, the application is rejected.'}
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1">
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۲. وضعیت چندهمسری (Poligamie):' : '2. Polygamous Relationships (Poligamie):'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'طبق قوانین رومانی، در صورتی که حامی همسر دیگری داشته باشد که با وی در رومانی زندگی می‌کند، درخواست پیوست همسر جدید رد می‌شود.'
                : 'Romanian law prohibits family reunification for a second spouse if the sponsor is already living with another spouse in Romania.'}
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1">
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۳. عدم کفایت تمکن مالی یا مسکن:' : '3. Insufficient Income or Substandard Housing:'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'در صورتی که حامی نتواند تمکن مالی حداقل حقوق پایه کشوری برای هر عضو خانواده یا متراژ مناسب مسکن را ثابت کند.'
                : 'Failure to demonstrate minimum wage earnings per dependent or adequate living space guarantees a rejection.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 7.5: FEES & LEGAL REMEDY */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>💳</span>
          <span>{currentLang === 'fa' ? 'هزینه صدور کارت اقامت اعضای خانواده' : 'Family Member Residence Card Fee'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'طبق جدول تعرفه سال ۲۰۲۵ اداره کل مهاجرت، هزینه صدور کارت اقامت برای عضو خانواده پس از تایید IGI و ورود با ویزای نوع D، همانند سایر دسته‌های رایج، معمولاً ۲۶۵ لئو عوارض دولتی + ۱۲۰ یورو کارمزد صدور کارت است؛ برای مبلغ دقیق در پرونده خودتان با اداره محلی IGI تماس بگیرید — '
            : 'Per the General Inspectorate for Immigration\'s 2025 fee schedule, the residence card fee for a family member — after IGI approval and entry on a Type D visa — is typically the same as other common categories: 265 RON state tax + 120 EUR card-issuance fee; confirm the exact amount for your case with your local IGI office — '}
          <Link href="/immigration/igi-process" className="text-[#2F6FED] font-bold hover:underline">
            {currentLang === 'fa' ? 'جزئیات کامل هزینه‌ها ←' : 'full fee details →'}
          </Link>
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#2F6FED]/30 shadow-sm space-y-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>⚖️</span>
          <span>{currentLang === 'fa' ? 'اگر IGI بیش از ۳ ماه بدون دلیل تاخیر کرد چه کنم؟' : 'What If IGI Delays Beyond 3 Months Without Reason?'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'اگر پرونده پیوست خانواده شما بدون توضیح از مهلت قانونی ۳ ماهه فراتر رفت، طبق قانون دادرسی اداری رومانی (Legea nr. 554/2004) حق دارید ظرف ۶ ماه از سررسید مهلت، با کمک وکیل متخصص حقوق اداری علیه سکوت یا تاخیر IGI به دادگاه اداری شکایت کنید.'
            : 'If your family reunification file exceeds the 3-month legal deadline without explanation, under the Administrative Contentious Law (Legea nr. 554/2004) you have the right to sue IGI\'s silence or delay in the administrative court within 6 months of the deadline, with the help of an administrative-law attorney.'}
        </p>
      </div>

      {/* SECTION 8: OFFICIAL SOURCES */}
      <div id="official-sources" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <ExternalLink className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'منابع رسمی اداره مهاجرت رومانی (IGI)' : 'Official IGI Sources'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'برای مشاهده متن رسمی آیین‌نامه OUG 194/2002 و ثبت‌نام آنلاین در پرتال رسمی اداره کل مهاجرت به لینک‌های زیر مراجعه کنید:'
            : 'Access official legal regulations and online portal forms directly at:'}
        </p>
        <div className="flex flex-wrap gap-3 text-xs font-bold">
          <a
            href="https://igi.mai.gov.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] p-3 rounded-xl border border-[#dfe6ef] transition-colors"
          >
            <span>🌐</span>
            <span>igi.mai.gov.ro (پرتال رسمی IGI)</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* SECTION 9: LAST REVIEWED DATE */}
      <div id="last-reviewed" className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-[#526174] flex items-center space-x-2 rtl:space-x-reverse">
        <Clock size={16} className="text-slate-400" />
        <span>
          {currentLang === 'fa'
            ? 'آخرین بررسی و به‌روزرسانی محتوا: سال ۲۰۲۶ (مطابق با مقررات رسمی اداره کل مهاجرت رومانی IGI)'
            : 'Last reviewed & updated: 2026 (Based on official General Inspectorate for Immigration IGI rules)'}
        </span>
      </div>

      {/* SECTION 10: RELATED CONTENT & COMMENTS */}
      <div id="related-content" className="space-y-6 pt-4">
        <h3 className="text-lg font-extrabold text-[#142033]">
          {currentLang === 'fa' ? 'مطالب مرتبط' : 'Related Guides'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => handleNav('immigration/igi-process')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🏛️</span>
              <span>{currentLang === 'fa' ? 'راهنمای جامع اداره کل مهاجرت IGI' : 'IGI Residency Process Guide'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'زمان‌بندی صدور کارت، ثبت آدرس و نوبت‌دهی در اداره IGI.'
                : 'Card processing timelines, address registration, and appointments.'}
            </p>
          </div>

          <div
            onClick={() => handleNav('immigration/citizenship')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🇷🇴</span>
              <span>{currentLang === 'fa' ? 'اقامت دائم و شهروندی رومانی' : 'Permanent Residence & Citizenship'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'مراحل دریافت اقامت دائم ۵ ساله و تابعیت رومانی برای اعضای خانواده.'
                : 'Requirements for 5-year permanent residence and citizenship.'}
            </p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
          <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
            {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'بررسی پرونده پیوست خانواده چقدر طول می‌کشد؟' : 'How long does IGI take to process a family reunification file?'}</h4>
              <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق مقررات رسمی IGI، رسیدگی حداکثر ظرف سه ماه از تاریخ ثبت پرونده انجام می‌شود؛ این مهلت «۳ ماه تقویمی» است، نه ۹۰ روز کاری.' : 'Per official IGI rules, processing takes a maximum of 3 calendar months from the file registration date — this is 3 months, not 90 working days.'}</p>
            </div>
            <div>
              <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'بعد از تایید IGI چقدر وقت برای اقدام در سفارت دارم؟' : 'How much time do I have to act at the embassy after IGI approval?'}</h4>
              <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'دقیقاً ۶۰ روز از تاریخ صدور تاییدیه کتبی IGI فرصت دارید تا برای ویزای بلندمدت نوع D در سفارت یا کنسولگری رومانی اقدام کنید.' : 'You have exactly 60 days from the date of IGI\'s written approval to apply for the Type D long-stay visa at a Romanian embassy or consulate.'}</p>
            </div>
            <div>
              <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر IGI به مهلت ۳ ماهه عمل نکند چه گزینه‌ای دارم؟' : 'What can I do if IGI misses the 3-month deadline?'}</h4>
              <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق قانون ۵۵۴/۲۰۰۴، می‌توانید ظرف ۶ ماه از سکوت یا تاخیر غیرموجه، با کمک وکیل حقوق اداری علیه IGI در دادگاه اداری شکایت کنید.' : 'Under Law 554/2004, you can sue IGI in the administrative court within 6 months of its unjustified silence or delay, with the help of an administrative-law attorney.'}</p>
            </div>
            <div>
              <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چرا سند ازدواج ایرانی من فقط با آپوستیل قبول نمی‌شود؟' : 'Why isn\'t a simple apostille enough for my Iranian marriage certificate?'}</h4>
              <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'چون ایران عضو کنوانسیون آپوستیل لاهه نیست؛ به‌جای آن باید مسیر تصدیق کنسولی (تایید مرجع ایرانی + مهر سفارت رومانی در تهران + ترجمه رسمی و تصدیق نزد دفترخانه رومانیایی) طی شود.' : 'Because Iran is not a member of the Hague Apostille Convention; instead you must go through consular legalization (Iranian authority authentication + Romanian Embassy in Tehran stamp + certified translation and notarization in Romania).'}</p>
            </div>
            <div>
              <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم از پلتفرم WorkinRomania.gov.ro برای پرونده پیوست خانواده استفاده کنم؟' : 'Can I use the WorkinRomania.gov.ro platform for my family reunification case?'}</h4>
              <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. این پلتفرم یکپارچه دولتی که در اوت ۲۰۲۶ کامل راه‌اندازی شد، پرونده‌های پیوست خانواده را پوشش نمی‌دهد؛ این فرآیند همچنان کاملاً حضوری و کاغذی نزد دفتر استانی IGI انجام می‌شود.' : 'No. This unified government platform, fully launched in August 2026, does not cover family reunification cases; this process remains entirely in-person and paper-based at your regional IGI office.'}</p>
            </div>
          </div>
        </div>

        <ParentHubFooterCard slugRoute="immigration/family-reunification" currentLang={currentLang} onNavigate={onNavigate} />

        {/* COMMENTS SECTION */}
        <div className="pt-6">
          <CommentsSection currentLang={currentLang} pagePath="immigration/family-reunification" />
        </div>
      </div>
    </div>
  );
};
