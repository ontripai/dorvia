'use client';

import React from 'react';
import Link from 'next/link';
import { Language } from '../types';
import { CommentsSection } from './CommentsSection';
import { ExternalLink, CheckCircle, ShieldCheck, Clock, FileCheck2, AlertCircle, GraduationCap, Building2 } from './Icons';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';

interface SchoolGuideContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const SchoolGuideContent: React.FC<SchoolGuideContentProps> = ({ currentLang, onNavigate }) => {
  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <Breadcrumb slugRoute="needs/school" currentLang={currentLang} onNavigate={onNavigate} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
          <span>🎓 {currentLang === 'fa' ? 'راهنمای جامع ثبت‌نام مدارس و معادلسازی مدارک در رومانی' : 'School Enrollment & Credential Equivalency Guide in Romania'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {currentLang === 'fa'
            ? 'ثبت‌نام فرزندان در مدارس دولتی و بین‌المللی رومانی'
            : 'School Enrollment & Credential Recognition for Foreign Children in Romania'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'راهنمای رسمی و تاییدشده ثبت‌نام در مدارس دولتی (رایگان)، فرآیند معادلسازی مدارک تحصیلی (Echivalarea Studiilor) نزد بازرسی آموزشی (ISJ/ISMB) و شرایط مدارس بین‌المللی.'
            : 'Verified guide to tuition-free public school enrollment, academic credential equivalency (Echivalarea Studiilor) via County School Inspectorates (ISJ/ISMB), and international private schools.'}
        </p>
        <div className="text-xs text-slate-400 pt-2 flex items-center space-x-2 rtl:space-x-reverse border-t border-slate-700/60">
          <span>🏛️</span>
          <span>
            {currentLang === 'fa'
              ? 'منبع رسمی: وزارت آموزش رومانی (Ministerul Educației — edu.ro) و بازرسی‌های آموزشی استانی (ISJ/ISMB)'
              : 'Official Source: Romanian Ministry of Education (edu.ro) & County School Inspectorates (ISJ/ISMB)'}
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
          <a href="#school-comparison" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۲. دولتی در مقابل بین‌المللی' : '2. Public vs International'}
          </a>
          <a href="#equivalency-steps" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۳. مراحل معادلسازی مدارک' : '3. Credential Equivalency'}
          </a>
          <a href="#required-docs" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۴. مدارک لازم' : '4. Required Documents'}
          </a>
          <a href="#international-options" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۵. مدارس بین‌المللی' : '5. International Options'}
          </a>
          <a href="#common-issues" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۶. مشکلات متداول' : '6. Troubleshooting'}
          </a>
          <a href="#official-sources" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۷. منابع رسمی (edu.ro)' : '7. Official Sources (edu.ro)'}
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
            {currentLang === 'fa' ? 'پاسخ سریع: آیا فرزندان اتباع غیر اتحادیه اروپا می‌توانند در مدارس دولتی رومانی ثبت‌نام کنند؟' : 'Quick Answer: Can Non-EU Children Enroll in Romanian Public Schools?'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'بله. طبق قوانین وزارت آموزش رومانی (edu.ro)، کلیه فرزندان اتباع خارجی غیر اتحادیه اروپا که مقیم قانونی رومانی هستند حق ثبت‌نام و تحصیل رایگان در سیستم مدارس دولتی رومانی را دارند. نهاد مسئول هماهنگی و تعیین پایه تحصیلی، «بازرسی آموزشی استانی» (Inspectoratul Școlar Județean – ISJ) یا «بازرسی آموزشی بخارست» (ISMB) است. اگر دانش‌آموز دارای مدارک رسمی تحصیلی مبدا باشد، مدارک وی معادلسازی (Echivalarea Studiilor) می‌شوند؛ اما در صورت نداشتن مدارک کارنامه‌ای رسمی، بازرسی آموزشی از طریق ارزیابی سطح دانش دانش‌آموز، پایه مناسب وی را تعیین می‌نماید.'
            : 'Yes. Under Romanian Ministry of Education (edu.ro) regulations, children of legally resident non-EU foreign nationals have full rights to enroll in tuition-free state public schools. The regional authority overseeing enrollment and grade placement is the County School Inspectorate (Inspectoratul Școlar Județean – ISJ) or Bucharest School Inspectorate (ISMB). If foreign transcripts are available, an equivalency evaluation (Echivalarea Studiilor) is conducted. If official transcripts are unavailable, ISJ/ISMB conducts a level assessment to place the student in the appropriate grade.'}
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#142033] flex items-start space-x-3 rtl:space-x-reverse">
          <span className="text-base mt-0.5">💡</span>
          <div>
            <strong className="block font-bold">{currentLang === 'fa' ? 'زبان آموزش در مدارس دولتی:' : 'Instruction Language in Public Schools:'}</strong>
            {currentLang === 'fa'
              ? 'زبان اصلی آموزش در مدارس دولتی رومانیایی است. مدارس برای دانش‌آموزان خارجی دوره‌های پشتیبانی زبان رومانیایی پیش‌بینی می‌کنند.'
              : 'Primary instruction in state schools is in Romanian. Intensive language orientation classes are offered to non-native students.'}
          </div>
        </div>
      </div>

      {/* SECTION 3: CONDITIONS & OPTIONS TABLE */}
      <div id="school-comparison" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📊</span>
          <span>{currentLang === 'fa' ? 'جدول مقایسه مدارس دولتی و مدارس بین‌المللی در رومانی' : 'Public vs International Schools Options Table'}</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#071B3D] text-white">
                <th className="p-3.5 rounded-r-xl">{currentLang === 'fa' ? 'نوع مدرسه' : 'School Type'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'شهریه و هزینه' : 'Tuition & Fees'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'زبان آموزش' : 'Language of Instruction'}</th>
                <th className="p-3.5 rounded-l-xl">{currentLang === 'fa' ? 'فرآیند ثبت‌نام / ارزیابی' : 'Enrollment & Evaluation'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe6ef]">
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'مدارس دولتی (Școli Publice / De Stat)' : 'Public State Schools'}
                </td>
                <td className="p-3.5 font-bold text-emerald-600">{currentLang === 'fa' ? 'رایگان (بدون شهریه)' : 'Tuition-Free (Public)'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'رومانیایی (با کلاس‌های کمکی)' : 'Romanian (with support classes)'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'معادلسازی مدارک نزد ISJ/ISMB یا ارزیابی تعیین سطح' : 'Credential equivalency via ISJ/ISMB or placement test'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'مدارس بین‌المللی خصوصی (Școli Internaționale Private)' : 'Private International Schools'}
                </td>
                <td className="p-3.5 text-[#526174]">
                  {currentLang === 'fa'
                    ? 'شهریه‌دار (متغیر؛ نیازمند استعلام مستقیم از هر مدرسه)'
                    : 'Tuition-based (Varies; must check directly with each school)'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'انگلیسی، فرانسوی، آلمانی و غیره' : 'English, French, German, etc.'}</td>
                <td className="p-3.5">{currentLang === 'fa' ? 'مصاحبه، آزمون ورودی و ارزیابی داخلی مدرسه' : 'Direct school application, interview & assessment'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: EQUIVALENCY PROCESS (ECHIVALAREA STUDIILOR) STEPS */}
      <div id="equivalency-steps" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <GraduationCap className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'مراحل معادلسازی مدارک تحصیلی (Echivalarea Studiilor) نزد ISJ/ISMB' : 'Credential Recognition Steps (Echivalarea Studiilor) via ISJ/ISMB'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۱</span>
              <h3>{currentLang === 'fa' ? 'آماده‌سازی مدارک و ترجمه رسمی' : 'Prepare Original Transcripts & Translations'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'کارنامه‌ها و مدارک تحصیلی سال‌های قبل فرزند را ترجمه رسمی به زبان رومانیایی کنید.'
                : 'Obtain certified Romanian translations of your child’s academic records and transcripts.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۲</span>
              <h3>{currentLang === 'fa' ? 'ارائه پرونده به بازرسی آموزشی (ISJ/ISMB)' : 'Submit File to School Inspectorate'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'پرونده مدارک را به اداره بازرسی آموزشی استان محل سکونت (ISJ) یا بخارست (ISMB) تحویل دهید.'
                : 'Submit the application file to your county School Inspectorate (ISJ) or Bucharest (ISMB).'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۳</span>
              <h3>{currentLang === 'fa' ? 'پرداخت هزینه ارزیابی و بررسی کمیسیون' : 'Evaluation Fee & Commission Review'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'پرداخت هزینه پرونده (طبق برخی منابع حدود ۱۰-۱۰۰ لِی، اما مبلغ دقیق را مستقیماً از ISJ استعلام کنید) و بررسی کمیسیون ارزشیابی.'
                : 'Pay the processing fee (reported by sources around 100 RON; verify exact amount with ISJ) for commission review.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۴</span>
              <h3>{currentLang === 'fa' ? 'صدور گواهی معادلسازی (Atestat de Echivalare)' : 'Issuance of Equivalency Certificate'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'دریافت گواهی رسمی تعیین پایه تحصیلی برای ارائه و ثبت‌نام در مدرسه دولتی انتخاب‌شده.'
                : 'Receive the official Atestat certificate declaring equivalent Romanian grade level for school registration.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: REQUIRED DOCUMENTS CHECKLIST */}
      <div id="required-docs" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <FileCheck2 className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'چک‌لیست مدارک لازم برای معادلسازی و ثبت‌نام' : 'Required Documents Checklist'}</span>
        </h2>

        <ul className="space-y-3 text-xs sm:text-sm text-[#526174]">
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'مدارک هویتی دانش‌آموز و والدین:' : 'Student & Parent Identification Documents:'}</strong>
              <span> {currentLang === 'fa' ? 'پاسپورت معتبر، کارت اقامت رومانی (Permis de Ședere) و شناسنامه/گواهی تولد دانش‌آموز.' : 'Valid passports, Romanian residence permits (Permis de Ședere), and child birth certificate.'}</span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'اصل مدارک و کارنامه‌های تحصیلی سال‌های قبل:' : 'Original Academic Transcripts & Diplomas:'}</strong>
              <span> {currentLang === 'fa' ? 'اصل کارنامه‌های سنوات گذشته با مهر رسمی آموزش و پرورش کشور مبدا.' : 'Original report cards and school records stamped by home country authorities.'}</span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'ترجمه رسمی مدارک به زبان رومانیایی:' : 'Certified Romanian Translation:'}</strong>
              <span>
                {currentLang === 'fa'
                  ? ' تمامی مدارک تحصیلی باید توسط مترجم رسمی مجاز ترجمه گردند. برای اطلاعات بیشتر، به '
                  : ' Transcripts must be translated by a certified Romanian translator. See '}
                <Link href="/needs/certified-translation" onClick={() => handleNav('needs/certified-translation')} className="text-[#2F6FED] font-bold hover:underline">
                  {currentLang === 'fa' ? 'صفحه راهنمای دارالترجمه رسمی' : 'Certified Translation Guide'}
                </Link>
                {currentLang === 'fa' ? ' مراجعه فرمایید.' : '.'}
              </span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'تاییدیه کنسولی یا آپوستیل (Apostille):' : 'Apostille or Consular Legalization:'}</strong>
              <span> {currentLang === 'fa' ? 'بسته به کشور مبدا صادره‌کننده مدارک، تاییدیه کنسولی یا آپوستیل ممکن است توسط ISJ/ISMB درخواست شود.' : 'Depending on country of origin, apostille or consular authentication may be requested.'}</span>
            </div>
          </li>
          <li className="flex items-start space-x-3 rtl:space-x-reverse bg-[#f8fafc] p-3.5 rounded-xl border border-[#dfe6ef]">
            <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={18} />
            <div>
              <strong className="text-[#142033]">{currentLang === 'fa' ? 'فیش پرداخت هزینه ارزیابی پرونده:' : 'Proof of Evaluation Processing Fee:'}</strong>
              <span> {currentLang === 'fa' ? 'طبق برخی منابع حدود ۱۰۰ لِی است، اما مبلغ دقیق باید مستقیماً با بازرسی آموزشی استان تایید گردد.' : 'Reported around 100 RON by some sources; verify exact fee directly with your regional ISJ.'}</span>
            </div>
          </li>
        </ul>
      </div>

      {/* SECTION 6: PUBLIC VS INTERNATIONAL SCHOOLS QUALITATIVE ANALYSIS */}
      <div id="international-options" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#2F6FED]">
          <Building2 size={24} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'تفاوت مدارس دولتی و مدارس بین‌المللی خصوصی' : 'Public vs International Private Schools'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'والدین خارجی در رومانی دو گزینه اصلی برای تحصیل فرزندان دارند: مدارس دولتی رومانی که کاملاً رایگان بوده و فرصتی عالی برای جامعه‌پذیری و یادگیری زبان رومانیایی فراهم می‌کنند؛ و مدارس بین‌المللی خصوصی (با برنامه‌های درسی بریتانیایی، آمریکایی، فرانسوی یا IB) که آموزش را به زبان‌های بین‌المللی ارائه می‌دهند. شهریه مدارس بین‌المللی بسته به پایه، سیستم آموزشی و خدمات جانبی کاملاً متغیر است (معمولاً از چند صد تا چند هزار یورو در سال)؛ بنابراین اکیداً توصیه می‌شود نرخ قطعی شهریه و شرایط ثبت‌نام را مستقیماً از وب‌سایت یا دفتر پذیرش هر مدرسه استعلام فرمایید.'
            : 'Expat parents in Romania have two main schooling pathways: state public schools which are tuition-free and provide immersive Romanian language integration; and private international schools (offering British, American, French, or IB curriculums) taught in international languages. International school tuition fees vary widely based on grade level, curriculum, and extra services (ranging from a few hundred to several thousand euros per year). It is strongly advised to verify exact tuition structures directly with each individual school.'}
        </p>
      </div>

      {/* SECTION 7: COMMON TROUBLESHOOTING */}
      <div id="common-issues" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <AlertCircle className="text-amber-500" size={24} />
          <span>{currentLang === 'fa' ? 'مشکلات متداول و راه‌حل‌ها' : 'Common Issues & Troubleshooting'}</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1">
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۱. نبود کارنامه رسمی تحصیلی از کشور مبدا:' : '1. Missing Official Home Country Transcripts:'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'در صورت فقدان کارنامه‌ها یا مدارک رسمی، بازرسی آموزشی (ISJ/ISMB) از طریق برگزاری آزمون یا مصاحبه ارزیابی دانش، سطح علمی دانش‌آموز را سنجیده و پایه مناسب را تعیین می‌کند.'
                : 'If official transcripts are lost or unavailable, ISJ/ISMB arranges a level assessment test/interview to determine grade placement.'}
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1">
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۲. تاخیر در صدور گواهی معادلسازی (Atestat):' : '2. Delays in Equivalency Processing:'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'فرآیند ارزشیابی ممکن است چند هفته طول بکشد. در این مدت دانش‌آموز می‌تواند با هماهنگی مدیریت مدرسه به‌عنوان «مستمع آزاد» (Auditor) در کلاس‌ها شرکت کند.'
                : 'Equivalency processing may take weeks. Schools often allow students to attend classes provisionally as "auditors" (Auditor) while awaiting paperwork.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 8: OFFICIAL SOURCES */}
      <div id="official-sources" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <ExternalLink className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'منابع رسمی و بخشنامه‌های آموزشی' : 'Official Sources & Guidelines'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'برای دسترسی به آخرین بخشنامه‌ها و فرم‌های رسمی معادلسازی مدارک تحصیلی می‌توانید به پرتال‌های رسمی مراجعه فرمایید:'
            : 'For official guidelines, forms, and regulations regarding student equivalency, refer to:'}
        </p>
        <div className="flex flex-wrap gap-3 text-xs font-bold">
          <a
            href="https://edu.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] p-3 rounded-xl border border-[#dfe6ef] transition-colors"
          >
            <span>🌐</span>
            <span>edu.ro (وزارت آموزش رومانی)</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* SECTION 9: LAST REVIEWED DATE */}
      <div id="last-reviewed" className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-[#526174] flex items-center space-x-2 rtl:space-x-reverse">
        <Clock size={16} className="text-slate-400" />
        <span>
          {currentLang === 'fa'
            ? 'آخرین بررسی و به‌روزرسانی محتوا: سال ۲۰۲۶ (بر اساس ضوابط رسمی وزارت آموزش رومانی edu.ro)'
            : 'Last reviewed & updated: 2026 (Based on official Romanian Ministry of Education guidelines)'}
        </span>
      </div>

      {/* SECTION 10: RELATED CONTENT & COMMENTS */}
      <div id="related-content" className="space-y-6 pt-4">
        <h3 className="text-lg font-extrabold text-[#142033]">
          {currentLang === 'fa' ? 'مطالب مرتبط' : 'Related Guides'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => handleNav('needs/certified-translation')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>📄</span>
              <span>{currentLang === 'fa' ? 'دارالترجمه رسمی در رومانی' : 'Certified Translation Services'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'ترجمه رسمی مدارک تحصیلی و هویتی به زبان رومانیایی توسط مترجمین مجاز.'
                : 'Certified translation requirements for foreign academic and civil documents.'}
            </p>
          </div>

          <div
            onClick={() => handleNav('needs/first-days-checklist')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>✓</span>
              <span>{currentLang === 'fa' ? 'چک‌لیست روزهای نخست ورود' : 'First-Days Arrival Checklist'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'اقدامات اداری و استقرار خانواده در ۳۰ روز اول ورود.'
                : 'Essential settlement steps for families in their first 30 days.'}
            </p>
          </div>
        </div>

        <ParentHubFooterCard slugRoute="needs/school" currentLang={currentLang} onNavigate={onNavigate} />

        {/* COMMENTS SECTION */}
        <div className="pt-6">
          <CommentsSection currentLang={currentLang} pagePath="needs/school" />
        </div>
      </div>
    </div>
  );
};
