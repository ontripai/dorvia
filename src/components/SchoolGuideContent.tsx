'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { CommentsSection } from './CommentsSection';
import { ExternalLink, CheckCircle, ShieldCheck, Clock, FileCheck2, AlertCircle, GraduationCap, Building2 } from './Icons';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';
import { FaqSchema } from './FaqSchema';

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

  const schoolFaqs = [
    {
      q: currentLang === 'fa' ? 'بچه‌ام در چه سنی وارد مدرسه می‌شود؟' : 'At what age does my child start school?',
      a: currentLang === 'fa'
        ? 'مقطع ابتدایی در رومانی با «کلاس آمادگی» (clasa pregătitoare) شروع می‌شود که پیش از کلاس اول است. طبق ماده ۳۱(۲) قانون آموزش پیش‌دانشگاهی (قانون ۱۹۸/۲۰۲۳)، کودکانی در کلاس آمادگی ثبت‌نام می‌شوند که پیش‌دبستانی را گذرانده باشند و تا ۳۱ آگوست همان سال ۶ ساله شوند. نکته‌ای که مخصوص خانواده‌های تازه‌رسیده از ایران است: اگر کودک شما بین ۱ سپتامبر تا ۳۱ دسامبر ۶ ساله می‌شود، ثبت‌نامش خودکار نیست. طبق راهنمای وزارت آموزش، در این حالت یا باید توصیه‌ی مهدکودکی که کودک در آن بوده ارائه شود، یا — و این حالت شماست اگر کودک مهدکودک رومانیایی نرفته یا تازه از خارج آمده — کودک باید ارزیابی مرکز کمک روانشناختی-آموزشی شهرستان (CJRAE/CMBRAE) را بگذراند. این ارزیابی پنجره‌ی زمانی مشخصی دارد که هر سال اعلام می‌شود (برای سال تحصیلی ۲۰۲۶–۲۰۲۷ در بازه‌ی مارس ۲۰۲۶ بود)، پس اگر ورودتان نزدیک این بازه است زودتر پیگیری کنید.'
        : 'Primary education in Romania begins with a "preparatory class" (clasa pregătitoare) that comes before first grade. Under Article 31(2) of the pre-university education law (Law 198/2023), children enrol in the preparatory class if they have attended preschool and turn 6 by 31 August of that year. A point that specifically affects families newly arrived from Iran: if your child turns 6 between 1 September and 31 December, enrolment is not automatic. Per the Ministry of Education\'s guidance, you need either a recommendation from the kindergarten the child attended, or — and this is your situation if the child has not attended Romanian kindergarten or has just arrived from abroad — an assessment by the county psycho-pedagogical assistance centre (CJRAE/CMBRAE). This assessment has a defined application window announced each year (for the 2026–2027 school year it fell in March 2026), so if your arrival is near that window, start early.'
    },
    {
      q: currentLang === 'fa' ? 'ساختار مقاطع تحصیلی در رومانی چگونه است؟' : 'How is the Romanian school system structured?',
      a: currentLang === 'fa'
        ? 'آموزش زودهنگام (creșă از ۳ ماهگی تا ۳ سال، و grădiniță از ۳ تا ۶ سال) → ابتدایی که پنج سال است (کلاس آمادگی به‌علاوه‌ی کلاس‌های ۱ تا ۴) → gimnaziu (کلاس‌های ۵ تا ۸) → liceu (کلاس‌های ۹ تا ۱۲). نکته‌ای که خیلی‌ها نمی‌دانند: مهدکودک در رومانی اجباری است، البته مرحله‌ای. گروه بزرگ (grupa mare) از سال تحصیلی ۲۰۲۰–۲۰۲۱ و گروه میانی (grupa mijlocie) از سپتامبر ۲۰۲۳ اجباری شده‌اند. عملاً یعنی کودک ۴ یا ۵ ساله‌ی شما قانوناً باید به مهدکودک برود، در حالی که برای کودک ۳ ساله هنوز الزامی نیست. (توجه: اجباری‌شدن گروه کوچک / grupa mică برای سال‌های آینده برنامه‌ریزی شده اما تاریخ دقیق آن در متن رسمی مشخص نشده است).'
        : 'Early education (creșă from 3 months to 3 years, grădiniță from 3 to 6) → primary, which is five years (the preparatory class plus grades I–IV) → gimnaziu (grades V–VIII) → liceu (grades IX–XII). Something many families don\'t realise: kindergarten in Romania is compulsory, in phases. The senior group (grupa mare) became compulsory from the 2020–2021 school year and the middle group (grupa mijlocie) from September 2023. In practice this means your 4- or 5-year-old is legally required to attend kindergarten, while it is not yet compulsory for a 3-year-old. (Note: Making the junior group / grupa mică compulsory is planned for a future year, but the exact date has not been officially confirmed).'
    },
    {
      q: currentLang === 'fa' ? 'اگر وسط سال تحصیلی برسیم چه می‌شود؟' : 'What happens if we arrive mid-school-year?',
      a: currentLang === 'fa'
        ? 'کودک بلافاصله می‌تواند به مدرسه برود. تا وقتی پرونده‌ی معادلسازی مدارک در حال رسیدگی است، دانش‌آموز به‌عنوان «audient» (شنونده) ثبت می‌شود و فعالیتش در دفاتر موقت کلاس ثبت می‌گردد — یعنی عملاً سر کلاس حاضر است و درس می‌خواند، فقط نمراتش هنوز رسمی نشده. بازرسی آموزش شهرستان (ISJ) طبق رویه ۳۰ روز کاری از تاریخ تحویل پرونده‌ی کامل برای صدور گواهی معادلسازی زمان دارد، و پس از دریافت گواهی، دانش‌آموز حداکثر ظرف ۱۵ روز در دفتر رسمی کلاس ثبت می‌شود. پرونده معمولاً از طریق همان مدرسه‌ای که کودک در آن حاضر می‌شود تحویل داده می‌شود.'
        : 'The child can start school immediately. While the credential-recognition (echivalare) file is being processed, the pupil is enrolled as an "audient" and their work is recorded in provisional class registers — meaning they attend and study normally; only the formal grades are pending. The county school inspectorate (ISJ) has, per procedure, 30 working days from submission of a complete file to issue the equivalence certificate, and once it is issued the pupil is entered in the official class register within 15 days at most. The file is normally submitted through the school the child is attending as an audient.'
    },
    {
      q: currentLang === 'fa' ? 'اگر فرزندم رومانیایی بلد نیست، دوره‌ی زبان رایگان هست؟' : 'If my child doesn\'t speak Romanian, is there a free language course?',
      a: currentLang === 'fa'
        ? 'بر اساس توصیف رسمی سیستم آموزشی رومانی در پایگاه Eurydice کمیسیون اروپا، برای فرزندان کارگران مهاجری که رومانیایی نمی‌دانند یک دوره‌ی مقدماتی رایگان زبان رومانیایی به‌مدت یک سال تحصیلی پیش‌بینی شده که در مدارس دولتی برگزار و توسط شوراهای محلی تامین مالی می‌شود، با گروه‌بندی سنی. کودکی که رومانیایی می‌داند به‌جای آن آزمون تعیین سطح می‌دهد. اما روی این حساب باز نکنید تا خودتان تایید بگیرید: ما نتوانستیم این حق را به شماره‌ی ماده‌ی مشخصی از قانون فعلی گره بزنیم، عبارت منبع «فرزندان کارگران مهاجر» است و تعمیمش به همه‌ی کودکان تبعه‌ی خارجی تایید نشد، و از همه مهم‌تر نتوانستیم تایید کنیم که این دوره در عمل در هر شهر و هر مدرسه‌ای واقعاً برگزار می‌شود. پیش از انتخاب مدرسه، مستقیماً از خود مدرسه و از ISJ شهرستان بپرسید چه پشتیبانی زبانی مشخصی ارائه می‌دهند. (یک مسیر جداگانه و روشن‌تر برای دارندگان حمایت بین‌المللی/پناهندگی وجود دارد که شامل خانواده‌ی دارای اقامت کاری یا خانوادگی نمی‌شود).'
        : 'According to the European Commission\'s Eurydice description of the Romanian education system, children of migrant workers who do not speak Romanian are provided a free Romanian-language initiation course lasting one school year, organised in state schools and funded by local councils, with pupils grouped by age. A child who already speaks Romanian sits a placement test instead. But do not count on this until you confirm it yourself: we could not tie this entitlement to a specific article of the current law, the source wording refers to "children of migrant workers" and we could not confirm it extends to all foreign-national children, and — most importantly — we could not confirm that the course actually runs in every city and every school in practice. Before choosing a school, ask the school itself and the county ISJ what specific language support they provide. (A separate, clearer track exists for holders of international protection, which does not cover a family on a work or family residence permit).'
    },
    {
      q: currentLang === 'fa' ? '«افترسکول» که می‌شنویم چیست؟' : 'What is "afterschool"?',
      a: currentLang === 'fa'
        ? 'دو چیز متفاوت با یک اسم است: یکی برنامه‌ی دولتی «Școala după școală» که داخل خود مدارس دولتی و با مجوز سالانه برگزار می‌شود، و دیگری مراکز خصوصی تجاری که معمولاً شامل بردن کودک از مدرسه، ناهار، انجام تکالیف زیر نظر مربی و فعالیت‌های جانبی هستند — بیشتر برای مقطع ابتدایی. هر دو در رومانی رایج‌اند. توجه: هزینه‌ها از منبع رسمی و معتبری قابل تایید نیست و بین ارائه‌دهندگان بسیار متفاوت است، بنابراین باید مستقیماً از خود مرکز یا مدرسه استعلام شود.'
        : 'Two different things share the name: the state-regulated "Școala după școală" programme run inside public schools with annual approval, and private commercial centres that typically include collecting the child from school, lunch, supervised homework and extra activities — mostly for primary-age children. Both are common in Romania. Note: Costs could not be verified from an official credible source and vary widely between providers; inquire directly with the specific centre or school.'
    },
    {
      q: currentLang === 'fa' ? 'آیا فرزندان اتباع خارجی حق تحصیل در مدارس دولتی رایگان رومانی را دارند؟' : 'Can expat children attend free public schools in Romania?',
      a: currentLang === 'fa'
        ? 'بله، طبق قانون اساسی و مقررات آموزشی رومانی، تمامی کودکان دارای اقامت قانونی از حق تحصیل رایگان در سیستم مدارس دولتی برخوردارند.'
        : 'Yes, children of foreign legal residents have the constitutional right to attend tuition-free Romanian public schools.'
    },
    {
      q: currentLang === 'fa' ? 'معادلسازی کارنامه تحصیلی (Echivalare) توسط چه نهادی انجام می‌شود؟' : 'Which authority handles school report card recognition?',
      a: currentLang === 'fa'
        ? 'معادلسازی پایه‌های تحصیلی مدرسه توسط بازرسی آموزش استان مربوطه (ISJ در استان‌ها و ISMB در بخارست) انجام می‌گیرد.'
        : 'School report card equivalency is processed by County School Inspectorates (ISJ / ISMB in Bucharest).'
    }
  ];

  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <FaqSchema items={schoolFaqs} />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold">
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
          <a href="#faq" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۸. سوالات متداول' : '8. Frequently Asked Questions'}
          </a>
          <a href="#related-content" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۹. مطالب مرتبط و نظرات' : '9. Related & Comments'}
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

      {/* SECTION 6.5: IRAN-SPECIFIC CONTEXT */}
      <div id="iran-specific-context" className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>🇮🇷</span>
          <span>{currentLang === 'fa' ? 'ویژه خانواده‌های ایرانی' : 'Iran-Specific Context'}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'یک خبر خوب برای خانواده‌هایی که در میانه سال تحصیلی وارد رومانی می‌شوند: طبق مقررات وزارت آموزش رومانی (edu.ro)، ثبت‌نام دانش‌آموزان غیر اتحادیه اروپا محدود به آغاز سال تحصیلی (شهریور/سپتامبر) نیست و می‌تواند در طول سال، از طریق بازرسی آموزشی (ISJ/ISMB) و اداره کل روابط بین‌الملل وزارت آموزش (DGRIAE)، بر اساس مدارک تحصیلی موجود انجام شود. این یعنی لازم نیست منتظر سال تحصیلی بعد بمانید — از همان روزهای اول ورود می‌توانید روند ثبت‌نام را آغاز کنید.'
            : 'Good news for families arriving mid-school-year: under Romanian Ministry of Education (edu.ro) rules, enrollment for non-EU students is not restricted to the September start of the school year — it can happen during the year, through the School Inspectorate (ISJ/ISMB) and the Ministry\'s international relations directorate (DGRIAE), based on the student\'s existing academic records. You do not need to wait for the next school year to start — you can begin the enrollment process as soon as you arrive.'}
        </p>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'نکته دیگر: چون ایران عضو کنوانسیون آپوستیل لاهه نیست، کارنامه‌ها و مدارک تحصیلی صادرشده در ایران معمولاً نمی‌توانند صرفاً با آپوستیل تایید شوند و باید مسیر تصدیق کنسولی را طی کنند — معمولاً از طریق تاییدیه وزارت آموزش ایران، سپس وزارت امور خارجه ایران، و در نهایت تصدیق سفارت رومانی در تهران، پیش از آنکه ترجمه رسمی رومانیایی و تصدیق نوتاری در رومانی انجام شود. توصیه می‌شود این زنجیره را پیش از سفر، مستقیماً با سفارت رومانی در تهران هماهنگ کنید. از نظر ساختاری هم بدانید که نظام آموزشی فعلی ایران (از حدود سال ۱۳۹۲) بر پایه ۶ سال دبستان + ۳ سال متوسطه اول + ۳ سال متوسطه دوم است، هفته تحصیلی از شنبه تا پنج‌شنبه (نه دوشنبه تا جمعه مثل رومانی) است، و نمرات روی مقیاس ۰ تا ۲۰ محاسبه می‌شوند — بازرسی آموزشی رومانی این تفاوت‌ها را در ارزیابی معادلسازی در نظر می‌گیرد.'
            : 'Another point: since Iran is not a Hague Apostille Convention member, transcripts and academic records issued in Iran generally cannot simply be apostilled — they need the consular legalization route, typically Iranian Ministry of Education attestation, then Iranian Ministry of Foreign Affairs attestation, and finally legalization by the Romanian Embassy in Tehran, before a certified Romanian translation and notarization can happen in Romania. We recommend coordinating this chain directly with the Romanian Embassy in Tehran before you travel. Structurally, it also helps to know that Iran\'s current school system (since roughly 2013) is 6 years primary + 3 years lower secondary + 3 years upper secondary, the school week runs Saturday–Thursday (not Monday–Friday like Romania), and grades are calculated on a 0–20 scale — Romanian school inspectorates account for these differences during the equivalency evaluation.'}
        </p>
        <div className="p-4 bg-white border border-amber-200 rounded-xl text-xs text-[#142033]">
          {currentLang === 'fa'
            ? 'ما نتوانستیم هیچ مدرسهٔ ایرانی یا فارسی‌زبانِ ثبت‌شدهٔ رسمی برای کودکان در رومانی شناسایی کنیم. خانواده‌هایی که به دنبال ادامهٔ تحصیل فارسی فرزندشان هستند معمولاً از گزینهٔ آموزش از راه دور مدارس ایرانی استفاده می‌کنند؛ برای اطلاع از آخرین وضعیت و راهکارهای آموزشی، بهتر است مستقیماً از سفارت ایران در بخارست پرس‌وجو فرمایید.'
            : 'We were unable to identify any officially registered Iranian or Persian-language schools for children in Romania. Families wishing to continue their children\'s Persian education typically utilize distance-learning options offered by Iranian remote schooling programs; for the most up-to-date status and guidance, it is best to inquire directly with the Iranian Embassy in Bucharest.'}
        </div>
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

      {/* SECTION 8.5: FREQUENTLY ASKED QUESTIONS */}
      <div id="faq" className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
        <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
          {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
        </h3>
        <div className="space-y-6">
          {schoolFaqs.map((faq, index) => (
            <div key={index}>
              <h4 className="font-bold text-[#334155] mb-2">{faq.q}</h4>
              <p className="text-sm text-[#475569] leading-relaxed">{faq.a}</p>
            </div>
          ))}
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
