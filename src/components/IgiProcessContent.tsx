'use client';

import React, { useState } from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { CommentsSection } from './CommentsSection';
import { ExternalLink, CheckCircle, ShieldCheck, Clock, FileCheck2, AlertCircle } from './Icons';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';
import { RelatedGuidesCard } from './RelatedGuidesCard';
import { FaqSchema } from './FaqSchema';
import { SectionPhoto } from './SectionPhoto';

import { useAppContext } from './AppLayout';

interface IgiProcessContentProps {
  currentLang: Language;
}

export const IgiProcessContent: React.FC<IgiProcessContentProps> = ({ currentLang }) => {
  const { onOpenEvaluationModal } = useAppContext();

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
          <a href="#pre-arrival-docs" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۱.۵. پیش از سفر: مدارک و ویزای D' : '1.5 Before You Travel: Docs & Type D Visa'}
          </a>
          <a href="#prerequisites-table" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۲. جدول شرایط اولیه' : '2. Prerequisites Table'}
          </a>
          <a href="#step-by-step" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۳. مراحل گام‌به‌گام' : '3. Step-by-Step'}
          </a>
          <a href="#real-experience" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۳.۵. تجربه واقعی مراجعه‌کنندگان' : '3.5 Real Applicant Experience'}
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
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'برای یک تبعه ایرانی، IGI معمولاً اولین نهاد دولتی رومانی است که به‌صورت حضوری و مکرر با آن سروکار خواهید داشت — نه فقط یک‌بار برای گرفتن کارت، بلکه هر بار که کارت اقامت منقضی می‌شود (معمولاً سالانه در سال‌های اول). به همین دلیل، درک اینکه این اداره واقعاً چطور کار می‌کند (نه فقط چه چیزی روی کاغذ نوشته شده) اهمیت زیادی دارد. حجم پرونده‌های IGI در چند سال اخیر به‌شدت افزایش یافته — تعداد کارگران خارجی دارای مجوز رسمی از حدود ۵٬۵۰۰ نفر در سال ۲۰۱۶ به نزدیک ۱۰۰٬۰۰۰ نفر در سال‌های ۲۰۲۲-۲۰۲۳ رسید — و همین رشد است که هم باعث شلوغی روزافزون دفاتر شده و هم دلیل اصلی سرمایه‌گذاری IGI روی دفتر جدید و بزرگ‌تر بخارست بوده است (به بخش ۳.۵ زیر مراجعه کنید).'
            : 'For an Iranian applicant, IGI is usually the Romanian government body you deal with in person, repeatedly — not once for a single card, but every time your permit expires (typically annually in the first years). That is why understanding how this office actually functions — not just what the rulebook says — matters. Case volume at IGI has grown sharply: officially registered foreign workers rose from roughly 5,500 in 2016 to nearly 100,000 in 2022–2023 — a surge that both crowded existing offices and is the direct reason IGI invested in a larger new Bucharest office (see section 3.5 below).'}
        </p>
      </div>

      {/* SECTION 1.5: BEFORE YOU TRAVEL — DOCUMENT EVALUATION & TYPE D VISA */}
      <div id="pre-arrival-docs" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>✈️</span>
          <span>{currentLang === 'fa' ? 'پیش از سفر: ارزیابی مدارک و ویزای بلندمدت نوع D' : 'Before You Travel: Document Evaluation & the Type D Visa'}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'همه چیزی که در این صفحه تا اینجا خواندید (پورتال، مراجعه به اداره، بیومتریک) مربوط به مرحله‌ای است که شما از قبل وارد رومانی شده‌اید. اما برای اکثر ایرانیان، دو گام دیگر باید زودتر از آن، هنوز در ایران، طی شود: ارزیابی مدارک و گرفتن ویزای بلندمدت نوع D از سفارت رومانی.'
            : 'Everything you\'ve read on this page so far (the portal, the office visit, biometrics) happens after you\'re already inside Romania. But for most Iranians, two earlier steps happen first — while still in Iran: evaluating your documents, and obtaining the Type D long-stay visa from the Romanian Embassy.'}
        </p>

        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#142033] mb-2">
            {currentLang === 'fa' ? '۱. ارزیابی اولیه مدارک' : '1. Initial Document Evaluation'}
          </h3>
          <p className="text-sm text-[#526174] leading-relaxed mb-3">
            {currentLang === 'fa'
              ? 'پیش از مراجعه به سفارت، مدارک زیر معمولاً لازم هستند — اما دقیقاً کدام‌ها لازم است به هدف شما (تحصیل، کار، پیوست خانواده، سرمایه‌گذاری) بستگی دارد؛ فهرست کامل و رسمی را باید از سفارت یا evisa.mae.ro استعلام بگیرید:'
              : 'Before your embassy appointment, the following are commonly required — but exactly which ones apply depends on your purpose (study, work, family reunification, investment); get the full official list from the embassy or evisa.mae.ro:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#526174]">
            <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
              <span>{currentLang === 'fa' ? 'پاسپورت معتبر (حداقل ۳ ماه بیشتر از مدت اقامت، حداقل ۲ صفحه خالی)' : 'Valid passport (min. 3 months beyond stay, at least 2 blank pages)'}</span>
            </div>
            <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
              <span>{currentLang === 'fa' ? 'مدرک هدف اقامت (پذیرش دانشگاه، قرارداد کار + مجوز کار، یا مدرک خویشاوندی)' : 'Proof of purpose (university admission, work contract + permit, or proof of family relationship)'}</span>
            </div>
            <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
              <span>{currentLang === 'fa' ? 'مدرک محل اسکان در رومانی و تمکن مالی' : 'Proof of accommodation in Romania and financial means'}</span>
            </div>
            <div className="p-3.5 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
              <span>{currentLang === 'fa' ? 'بیمه درمانی معتبر برای رومانی، و برای برخی مسیرها گواهی عدم سوءپیشینه' : 'Valid health insurance for Romania, and for some pathways a criminal-record certificate'}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 leading-snug">
            {currentLang === 'fa'
              ? 'برای فهرست دقیق مدارک بر اساس هدف خودتان، به راهنمای همان بخش مراجعه کنید: '
              : 'For the exact document list based on your purpose, see the relevant section guide: '}
            <Link href="/study/requirements" className="text-[#2F6FED] font-bold hover:underline">{currentLang === 'fa' ? 'تحصیل' : 'Study'}</Link>
            {' · '}
            <Link href="/work/work-permit" className="text-[#2F6FED] font-bold hover:underline">{currentLang === 'fa' ? 'کار' : 'Work'}</Link>
            {' · '}
            <Link href="/immigration/family-reunification" className="text-[#2F6FED] font-bold hover:underline">{currentLang === 'fa' ? 'پیوست خانواده' : 'Family Reunification'}</Link>
          </p>
        </div>

        <div id="visa-type-d-issuance">
          <h3 className="text-base sm:text-lg font-extrabold text-[#142033] mb-2">
            {currentLang === 'fa' ? '۲. صدور ویزای بلندمدت نوع D در سفارت رومانی تهران' : '2. Type D Long-Stay Visa Issuance at the Romanian Embassy in Tehran'}
          </h3>
          <p className="text-sm text-[#526174] leading-relaxed mb-3">
            {currentLang === 'fa'
              ? 'برخلاف حدود ۲۶ کشور اروپایی دیگر که برای متقاضیان ایرانی از مرکز خدمات ویزا (VFS Global) در تهران استفاده می‌کنند، رومانی در این فهرست دیده نمی‌شود — یعنی درخواست ویزای نوع D معمولاً باید مستقیماً و حضوری در خود سفارت رومانی در تهران ثبت شود، نه یک مرکز واسط. ویزای نوع D معمولاً یک بازه ۹۰ روزه برای ورود به رومانی و ثبت‌نام نزد IGI می‌دهد؛ درخواست کارت اقامت باید طبق همان قاعده «حداقل ۳۰ روز پیش از پایان اعتبار» (که در گام ۲ بخش ۳ بالا هم دیدید) ثبت شود.'
              : 'Unlike roughly 26 other European countries that use a Visa Application Center (VFS Global) in Tehran for Iranian applicants, Romania does not appear on that list — meaning the Type D visa application typically must be lodged directly and in person at the Romanian Embassy in Tehran, not an intermediary center. The Type D visa generally grants a 90-day window to enter Romania and register with IGI; the residence-card application should follow the same "at least 30 days before expiration" rule you saw in Step 2 of Section 3 above.'}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-950 leading-relaxed space-y-1">
            <p className="font-bold">{currentLang === 'fa' ? 'این بخش را حتماً مستقیماً با سفارت تایید کنید' : 'Confirm this section directly with the embassy'}</p>
            <p>
              {currentLang === 'fa'
                ? 'زمان رسیدگی برای ویزای نوع D در منابع مختلف بین ۴۵ تا ۶۰ روز گزارش شده — این رقم را نتوانستیم مستقیماً از سایت سفارت تایید کنیم. اما هزینه ویزا اکنون رسمی و تاییدشده است: طبق صفحه رسمی کارمزد ویزای وزارت امور خارجه رومانی (eviza.mae.ro/VisaFees)، از تاریخ ۲۷ آوریل ۲۰۲۶ هزینه ویزای بلندمدت نوع D در تمام نمایندگی‌های رومانی در سراسر جهان (از جمله سفارت تهران) از ۱۲۰ یورو به ۳۰۰ یورو افزایش یافته است (این رقم متفاوت از هزینه ۱۲۰ یورویی صدور کارت اقامت داخل رومانی است که در بخش ۵ پایین آمده). درخواست‌های ثبت‌شده پیش از این تاریخ همچنان با تعرفه قدیم ۱۲۰ یورویی بررسی می‌شوند. سفارت رومانی در تهران این مبلغ را به دلار آمریکا دریافت می‌کند. پیش از اقدام، حتماً زمان رسیدگی و فهرست دقیق مدارک را مستقیماً از سفارت رومانی در تهران یا evisa.mae.ro استعلام بگیرید.'
                : 'Reported processing time for the Type D visa ranges from 45 to 60 days across secondary sources — we could not directly confirm this figure against the embassy\'s own site. The fee, however, is now official and confirmed: per Romania\'s Ministry of Foreign Affairs official visa-fee page (eviza.mae.ro/VisaFees), as of April 27, 2026 the Type D long-stay visa fee rose from 120 EUR to 300 EUR at all Romanian missions worldwide, including the Tehran embassy (a different figure from the 120 EUR in-Romania residence-card issuance fee covered in Section 5 below). Applications submitted before that date are still processed at the old 120 EUR rate. The Romanian Embassy in Tehran collects this fee in US dollars. Before applying, confirm the processing time and exact document list directly with the Romanian Embassy in Tehran or evisa.mae.ro.'}
            </p>
          </div>
        </div>
      </div>

      {/* INLINE CTA 1: MID-ARTICLE */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-[#2F6FED]/10 text-[#2F6FED] flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#142033]">
              {currentLang === 'fa' ? 'پرونده شما با این شرایط چگونه خواهد بود؟' : 'What would your case look like?'}
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa' ? 'ارزیابی رایگان شرایط و گزینه‌های قانونی متناسب با پروفایل شما' : 'Free case evaluation and legal eligibility review for your profile'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenEvaluationModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#2F6FED] hover:bg-[#2052b6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
        >
          <span>{currentLang === 'fa' ? '🔎 ارزیابی رایگان شرایط من' : '🔎 Free Case Evaluation'}</span>
        </button>
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
          <div id="step-4-biometrics" className="p-5 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-2 scroll-mt-24">
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

      {/* SECTION 3.5: REAL APPLICANT EXPERIENCE (BEYOND THE OFFICIAL RULEBOOK) */}
      <div id="real-experience" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>🔎</span>
          <span>{currentLang === 'fa' ? 'تجربه واقعی: چیزی که سایت‌های عمومی درباره IGI نمی‌گویند' : 'Real Experience: What Generic Sites Don\'t Tell You About IGI'}</span>
        </h2>

        <SectionPhoto
          src="/images/immigration/igi-process-carrefour.jpg"
          alt={currentLang === 'fa' ? 'مجتمع Grand Arena Mall در بخارست، محل اداره مهاجرت (IGI) بخارست' : 'The Grand Arena Mall complex in Bucharest, home to the Bucharest Immigration Directorate (IGI)'}
          captionFa="مجتمع Grand Arena Mall (بلوار Metalurgiei، بخش ۴) — دفتر IGI بخارست از سال ۲۰۲۳ در همین ساختمان مستقر است. عکس: Wikimedia Commons."
          captionEn="Grand Arena Mall complex (Bd. Metalurgiei, Sector 4) — the Bucharest IGI office has been housed here since 2023. Photo: Wikimedia Commons."
          currentLang={currentLang}
        />

        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'تا نوامبر ۲۰۲۳، دفتر مهاجرت بخارست فقط ۱۰ باجه در یک ساختمان کانتینری کوچک در خیابان Nicolae Iorga داشت که به‌وضوح جوابگوی حجم متقاضیان نبود. IGI رسماً اعلام کرد که با رشد متقاضیان از حدود ۵٬۵۰۰ نفر در سال ۲۰۱۶ به نزدیک ۱۰۰٬۰۰۰ نفر، دفتر جدیدی با ۳۰ باجه در ۵۰۰ مترمربع، همراه با سیستم نوبت‌دهی خودکار متصل به پورتال آنلاین، در مجتمع Grand Arena Mall راه‌اندازی کرد. این یعنی تجربه مراجعه به دفتر بخارست امروز به‌طور محسوسی بهتر از قبل از ۲۰۲۳ است.'
            : 'Until November 2023, the Bucharest immigration office had only 10 counters in a small container building on Nicolae Iorga Street — clearly insufficient for the volume of applicants. IGI officially cited growth from around 5,500 applicants in 2016 to nearly 100,000, and opened a new office with 30 counters across 500 m² inside the Grand Arena Mall complex, with an automated queue system tied to the online booking portal. In practice, this means the Bucharest office experience today is noticeably better than it was before 2023.'}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-950 leading-relaxed space-y-1">
          <p className="font-bold">{currentLang === 'fa' ? 'دفاتر شهرستان می‌توانند تجربه‌ی بسیار متفاوتی داشته باشند' : 'Regional offices can be a very different experience'}</p>
          <p>
            {currentLang === 'fa'
              ? 'در پاییز ۲۰۲۲، رسانه Romania Insider گزارش داد دفتر مهاجرت کلوژ (در مجتمع Iulius Mall) تنها ۲ باجه فعال داشت و روزانه فقط ۱۳ تا ۱۵ متقاضی غیر اتحادیه اروپا را از میان صف ۴۰ تا ۵۰ نفره پذیرش می‌کرد؛ برخی متقاضیان برای رسیدن به نوبت مجبور شدند شب را با پتو در تراس مجتمع سپری کنند. این گزارش مربوط به سال ۲۰۲۲ است و ما گزارش تازه‌تری (۲۰۲۴-۲۰۲۶) که وضعیت فعلی کلوژ یا سایر شهرها مثل تیمیشوارا و یاش را تایید کند پیدا نکردیم — پس این را به‌عنوان هشدار برای «آماده بودن برای احتمال صف طولانی در دفاتر کوچک‌تر» در نظر بگیرید، نه وضعیت قطعی امروز. توصیه عملی: اگر در شهری غیر از بخارست هستید، حتماً نوبت آنلاین را ماه‌ها زودتر رزرو کنید و از دانشگاه یا کارفرمای خود درباره تجربه اخیر دیگران در همان دفتر بپرسید.'
              : 'In autumn 2022, Romania Insider reported that the Cluj immigration office (inside Iulius Mall) had only 2 active counters and processed just 13–15 non-EU applicants per day against a queue of 40–50, with some applicants sleeping overnight on the mall terrace with blankets to secure a spot. That report is from 2022, and we could not find a more recent (2024–2026) update confirming Cluj\'s current state, or data for other cities like Timișoara or Iași — so treat this as a warning to "be prepared for a possibly long queue at smaller offices," not a confirmed picture of today. Practical tip: if you\'re outside Bucharest, book your online appointment months in advance and ask your university or employer about others\' recent experience at that specific office.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
            <span className="font-extrabold text-[#2F6FED]">{currentLang === 'fa' ? 'قرارداد اجاره غیررسمی، دلیل رایج توقف پرونده' : 'An unregistered rental contract is a common stopper'}</span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'برخلاف تصور رایج، «قرارداد اجاره ساده» همیشه کافی نیست. طبق تجربه گزارش‌شده مهاجران، قرارداد اجاره باید نزد اداره مالیات محلی (ANAF) ثبت (înregistrat) شده باشد؛ توافق‌های غیررسمی یا ثبت‌نشده یکی از رایج‌ترین نقاط گیر پرونده‌هاست.'
                : 'Contrary to common assumption, a simple rental agreement is not always enough. Based on reported migrant experience, the rental contract should be registered (înregistrat) with the local tax authority (ANAF); informal or unregistered arrangements are a commonly reported sticking point.'}
            </p>
          </div>
          <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
            <span className="font-extrabold text-[#2F6FED]">{currentLang === 'fa' ? 'نوع بیمه درمانی می‌تواند رد شود' : 'The type of health insurance can get rejected'}</span>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'برخی مهاجران گزارش کرده‌اند که بیمه خصوصی به‌تنهایی برای این مرحله پذیرفته نشده و بیمه مرتبط با سیستم دولتی (CNAS) درخواست شده است. این یک قاعده رسمی سراسری تایید‌شده نیست، اما نشان می‌دهد که نباید فرض کرد هر بیمه خصوصی معتبری لزوماً کافی خواهد بود — پیش از مراجعه، نوع بیمه مورد نیاز را از همان دفتر IGI استعلام بگیرید.'
                : 'Some migrants have reported that private insurance alone was not accepted at this step, and state-system (CNAS-linked) coverage was requested instead. This is not a confirmed nationwide official rule, but it shows you shouldn\'t assume any valid private policy will automatically be sufficient — confirm the accepted insurance type with your specific IGI office before your visit.'}
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs sm:text-sm text-red-950 leading-relaxed">
          <p className="font-bold mb-1">{currentLang === 'fa' ? '⚠️ هشدار: پرداخت غیررسمی برای «سریع‌تر شدن» یک جرم است، نه یک راه‌حل' : '⚠️ Warning: paying to "speed things up" is a crime, not a workaround'}</p>
          {currentLang === 'fa'
            ? 'در اکتبر ۲۰۲۴، اداره مبارزه با فساد رومانی (DNA) دو مأمور مهاجرت — یکی در اداره مهاجرت بخارست و دیگری در اداره ایالمیتسا — را به اتهام دریافت رشوه (به‌طور میانگین حدود ۶۸۰ یورو در هر پرونده، در مجموع نزدیک به ۴۳٬۰۰۰ یورو طی ۶۳ پرونده) برای تسریع صدور مجوز کار متهم کرد. این یعنی «واسطه غیررسمی برای سریع‌تر شدن کار» نه‌تنها تضمینی نیست، بلکه هم برای گیرنده و هم دهنده رشوه پیامد قانونی جدی دارد. اگر به کمک نیاز دارید، از یک وکیل یا مشاور مهاجرت رسمی و دارای مجوز استفاده کنید، نه واسطه غیررسمی.'
            : 'In October 2024, Romania\'s anti-corruption directorate (DNA) charged two immigration officers — one at the Bucharest Immigration Directorate, one at the Ialomița County office — with taking bribes (averaging roughly EUR 680 per case, about EUR 43,000 total across 63 cases) to expedite work-permit processing. In other words, an "informal facilitator to speed things up" is not a safe shortcut — it carries real legal consequences for both sides. If you need help, use a licensed immigration lawyer or consultant, not an informal intermediary.'}
        </div>

        <p className="text-xs sm:text-sm text-[#788697] leading-relaxed border-t border-[#dfe6ef] pt-4">
          {currentLang === 'fa'
            ? 'اصلاحیه مهم (اوت ۲۰۲۶): در ۶ اوت ۲۰۲۶ دولت رومانی سامانه دیجیتال جدید workinromania.gov.ro را رسماً راه‌اندازی کرد (طبق فرمان فوری GEO 32/2026 که سیستم قدیمی «Aviz de Muncă» کاغذی را حذف کرد). برخلاف تصور رایج، این سامانه فعلاً **فقط رویه‌های کارفرمامحور استخدام اتباع خارجی** را پوشش می‌دهد (ثبت کارفرما، مجوز آژانس کاریابی، مدارک استخدام) — نه کل سیستم صدور/تمدید اقامت IGI برای دانشجویان، پیوند خانواده، یا مدیران شرکت. مقامات گفته‌اند فازهای بعدی ممکن است ویزاهای بلندمدت کاری و تمدید اقامت مرتبط با کار را هم اضافه کند، اما تا امروز چنین چیزی اجرایی نشده و هیچ مهلت ۳۰ ژوئنی برای آن اعلام نشده است. اگر برای اقامت کاری اقدام می‌کنید، وضعیت را مستقیماً از IGI یا کارفرمای خود بپرسید. همچنین، اگر تمدید کارت شما با تاخیر مواجه شود، برخی متقاضیان گزارش کرده‌اند که در فاصله انقضای کارت قدیمی و صدور کارت جدید، حساب بانکی‌شان به‌طور موقت مسدود شده — پس تمدید هرچه زودتر (نه در آخرین روزها) واقعاً اهمیت عملی دارد، نه فقط توصیه‌ای احتیاطی.'
            : 'Correction (August 2026): on August 6, 2026, the Romanian government officially launched the new digital platform workinromania.gov.ro (under Emergency Ordinance GEO 32/2026, which abolished the old paper-based "Aviz de Muncă" system). Contrary to a common misconception, this platform currently covers only employer-driven procedures for hiring foreign workers (employer registration, staffing-agency authorization, employment documentation) — not the general IGI residence-permit system for students, family reunification, or company directors. Officials have said future phases may add employment-based long-stay visas and work-linked residence extensions, but as of now that has not happened, and there is no announced June 30 deadline tied to it. If you\'re applying for a work-based residence permit, check current status directly with IGI or your employer. Separately, if your renewal is delayed, some applicants have reported their bank account being temporarily frozen during the gap between an expired card and the new one — so renewing early (not in the final days) is a genuinely practical safeguard, not just a cautious suggestion.'}
        </p>
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
            ? 'آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶. منبع: آیین‌نامه اتباع خارجی رومانی (OUG 194/2002)، جدول تعرفه ۲۰۲۵، قانون ۵۵۴/۲۰۰۴ (igi.mai.gov.ro)، و گزارش‌های AGERPRES و Romania Insider درباره دفاتر IGI (نکته: برخی جزئیات تجربی این بخش مبتنی بر گزارش‌های خبری/مهاجران است، نه سند رسمی IGI؛ در متن مشخص شده است).'
            : 'Last Review: August 2026. Source: OUG 194/2002, the 2025 fee schedule, Law 554/2004 (igi.mai.gov.ro), and AGERPRES / Romania Insider reporting on IGI offices (note: some experiential details in this section come from news/migrant reports, not an official IGI document — this is flagged in the text).'}
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

      {/* INLINE CTA 2: POST-DOCUMENTS & PRE-FAQ */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-[#dfe6ef] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <FileCheck2 size={20} />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#142033]">
              {currentLang === 'fa' ? 'مدارک من کافی است؟' : 'Are my documents sufficient?'}
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa' ? 'بررسی جامع مدارک و شرایط پرونده بر اساس دستورالعمل‌های رسمی IGI' : 'Document verification and profile check according to official IGI guidelines'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenEvaluationModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#2F6FED] hover:bg-[#2052b6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
        >
          <span>{currentLang === 'fa' ? '🔎 ارزیابی رایگان شرایط من' : '🔎 Free Case Evaluation'}</span>
        </button>
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
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا پرداخت به یک واسطه برای سریع‌تر شدن کار جواب می‌دهد؟' : 'Does paying an informal facilitator to speed things up work?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر و این کار غیرقانونی است. در اکتبر ۲۰۲۴ دو مأمور اداره مهاجرت به اتهام دریافت رشوه برای تسریع مجوز کار تحت تعقیب قانونی قرار گرفتند. برای کمک واقعی، از وکیل یا مشاور مهاجرت دارای مجوز رسمی استفاده کنید.' : 'No, and it is illegal. In October 2024, two immigration officers were prosecuted for taking bribes to expedite work permits. For real help, use a licensed immigration lawyer or consultant instead.'}</p>
          </div>
          <div>
            <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چرا انتظار در دفتر بخارست با دفاتر شهرستان فرق دارد؟' : 'Why is the wait at the Bucharest office different from regional offices?'}</h4>
            <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'دفتر بخارست از سال ۲۰۲۳ با ۳۰ باجه و نوبت‌دهی خودکار به مجتمع Grand Arena Mall منتقل شد، اما دفاتر کوچک‌تر (مثل کلوژ) ظرفیت محدودتری داشته‌اند. اگر خارج از بخارست هستید، نوبت آنلاین را زودتر رزرو کنید.' : 'Since 2023 the Bucharest office moved to the Grand Arena Mall complex with 30 counters and automated queuing, while smaller offices (like Cluj) have historically had far more limited capacity. If you\'re outside Bucharest, book your online appointment well in advance.'}</p>
          </div>
        </div>
      </div>

      <FaqSchema items={[
        {
          q: currentLang === 'fa' ? 'صدور اولین کارت اقامت چقدر طول می‌کشد؟' : 'How long does the first residence card take to issue?',
          a: currentLang === 'fa' ? 'طبق مقررات IGI، صدور کارت برای اعضای خانواده غیر اتحادیه اروپا معمولاً ظرف ۹۰ روز از ثبت درخواست کامل انجام می‌شود.' : 'Under IGI regulations, issuance for non-EU family members is typically completed within 90 days of a complete application being registered.'
        },
        {
          q: currentLang === 'fa' ? 'اگر مدارکم ناقص باشد چه اتفاقی می‌افتد؟' : 'What happens if my documents are incomplete?',
          a: currentLang === 'fa' ? 'IGI حداکثر تا ۳۰ روز مهلت اضافه برای تکمیل مدارک می‌دهد؛ این بازه رسماً زمان‌بندی رسیدگی به پرونده را متوقف می‌کند تا مدارک کامل شود.' : 'IGI grants up to 30 extra days to complete the file; this period officially suspends the processing timeline until the documents are complete.'
        },
        {
          q: currentLang === 'fa' ? 'هزینه صدور کارت اقامت چقدر است؟' : 'How much does the residence card cost?',
          a: currentLang === 'fa' ? 'برای بیشتر دسته‌ها (کار، تحصیل، پیوست خانواده) هزینه استاندارد ۲۶۵ لئو عوارض دولتی به‌علاوه ۱۲۰ یورو کارمزد صدور کارت است؛ برخی مسیرها تعرفه متفاوت دارند و مبلغ دقیق باید نزد IGI محل خود استعلام شود.' : 'For most categories (work, study, family reunification) the standard cost is 265 RON state tax plus 120 EUR card-issuance fee; some pathways carry different rates, so confirm the exact amount with your local IGI office.'
        },
        {
          q: currentLang === 'fa' ? 'اگر IGI به مهلت قانونی عمل نکند چه گزینه‌ای دارم؟' : 'What can I do if IGI misses its legal deadline?',
          a: currentLang === 'fa' ? 'طبق قانون ۵۵۴/۲۰۰۴، می‌توانید ظرف ۶ ماه از سکوت یا رد غیرموجه اداره، با کمک وکیل حقوق اداری علیه IGI در دادگاه اداری شکایت کنید.' : 'Under Law 554/2004, you can sue IGI in the administrative court within 6 months of its silence or unjustified refusal, with the help of an administrative-law attorney.'
        },
        {
          q: currentLang === 'fa' ? 'آیا پرداخت به یک واسطه برای سریع‌تر شدن کار جواب می‌دهد؟' : 'Does paying an informal facilitator to speed things up work?',
          a: currentLang === 'fa' ? 'خیر و این کار غیرقانونی است. در اکتبر ۲۰۲۴ دو مأمور اداره مهاجرت به اتهام دریافت رشوه برای تسریع مجوز کار تحت تعقیب قانونی قرار گرفتند. برای کمک واقعی، از وکیل یا مشاور مهاجرت دارای مجوز رسمی استفاده کنید.' : 'No, and it is illegal. In October 2024, two immigration officers were prosecuted for taking bribes to expedite work permits. For real help, use a licensed immigration lawyer or consultant instead.'
        },
        {
          q: currentLang === 'fa' ? 'چرا انتظار در دفتر بخارست با دفاتر شهرستان فرق دارد؟' : 'Why is the wait at the Bucharest office different from regional offices?',
          a: currentLang === 'fa' ? 'دفتر بخارست از سال ۲۰۲۳ با ۳۰ باجه و نوبت‌دهی خودکار به مجتمع Grand Arena Mall منتقل شد، اما دفاتر کوچک‌تر (مثل کلوژ) ظرفیت محدودتری داشته‌اند. اگر خارج از بخارست هستید، نوبت آنلاین را زودتر رزرو کنید.' : 'Since 2023 the Bucharest office moved to the Grand Arena Mall complex with 30 counters and automated queuing, while smaller offices (like Cluj) have historically had far more limited capacity. If you\'re outside Bucharest, book your online appointment well in advance.'
        }
      ]} />

      {/* SECTION 9: COMMENTS SECTION */}
      <RelatedGuidesCard items={['start-here/newly-arrived', 'needs/first-days-checklist']} currentLang={currentLang} />
      <ParentHubFooterCard slugRoute="immigration/igi-process" currentLang={currentLang} />
      <CommentsSection pagePath="immigration/igi-process" currentLang={currentLang} />
    </div>
  );
};
