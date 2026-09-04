'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { CommentsSection } from './CommentsSection';
import { ExternalLink, CheckCircle, ShieldCheck, Clock, FileCheck2, AlertCircle, Landmark } from './Icons';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';
import { SectionPhoto } from './SectionPhoto';
import { FaqSchema } from './FaqSchema';
import { ContextualLeadCapture } from './ContextualLeadCapture';

interface BankingGuideContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const BankingGuideContent: React.FC<BankingGuideContentProps> = ({ currentLang, onNavigate }) => {
  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const bankingFaqs = [
    {
      q: currentLang === 'fa' ? 'آیا بدون کارت اقامت (Permis de Ședere) می‌توان در رومانی حساب بانکی باز کرد؟' : 'Can foreign nationals open a Romanian bank account without a residence permit?',
      a: currentLang === 'fa'
        ? 'بیشتر بانک‌های تجاری برای فعال‌سازی کامل حساب به ارائه کارت اقامت دارای کد شناسایی ملی (CNP) نیاز دارند؛ با این حال برخی بانک‌ها با ویزای تایپ D و پاسپورت حساب اولیه باز می‌کنند.'
        : 'Most commercial banks require a physical residence permit card bearing a CNP; however, select branches may open non-resident accounts with a Type D visa and passport.'
    },
    {
      q: currentLang === 'fa' ? 'کدام بانک‌های رومانی بیشترین شعبه و سهولت افتتاح حساب را برای خارجی‌ها دارند؟' : 'Which Romanian banks are most expat-friendly?',
      a: currentLang === 'fa'
        ? 'بانک‌های BCR (گروه Erste)، Banca Transilvania (BT)، BRD (گروه سوسته‌ژنرال) و ING رومانی دارای بیشترین شعب و پشتیبانی آنلاین زبان انگلیسی هستند.'
        : 'BCR (Erste Group), Banca Transilvania (BT), BRD (Société Générale), and ING Romania offer extensive branch networks and English-language mobile banking.'
    },
    {
      q: currentLang === 'fa' ? 'آیا استفاده از نئوبانک‌هایی مانند Revolut در رومانی رایج است؟' : 'Is Revolut widely used in Romania?',
      a: currentLang === 'fa'
        ? 'بله، Revolut دارای مجوز رسمی بانکی در رومانی با شماره شبا (IBAN) محلی لئو است و برای پرداخت‌های روزمره بسیار محبوب است.'
        : 'Yes, Revolut operates with a local Romanian IBAN (via partner banks) and is exceptionally popular for daily transactions.'
    }
  ];

  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <FaqSchema items={bankingFaqs} />
      <Breadcrumb slugRoute="needs/banking" currentLang={currentLang} onNavigate={onNavigate} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
          <span>🏦 {currentLang === 'fa' ? 'راهنمای جامع امور بانکی در رومانی' : 'Bank Account Opening Guide in Romania'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {currentLang === 'fa'
            ? 'افتتاح حساب بانکی برای اتباع خارجی در رومانی'
            : 'Opening a Bank Account for Foreign Residents in Romania'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'راهنمای تاییدشده مدارک لازم، مقایسه بانک‌های اصلی (BCR, BRD, BT, ING, Raiffeisen)، ضوابط کارت اقامت، و استفاده از نئوبانک‌های مکمل (Revolut, Wise).'
            : 'Verified guide to required documents, top commercial banks (BCR, BRD, BT, ING, Raiffeisen), residency permit requirements, and complementary neobanks (Revolut, Wise).'}
        </p>
        <div className="text-xs text-slate-400 pt-2 flex items-center space-x-2 rtl:space-x-reverse border-t border-slate-700/60">
          <span>🏛️</span>
          <span>
            {currentLang === 'fa'
              ? 'منبع: بانک ملی رومانی (BNR) و مقررات تجاری بانک‌های رومانی'
              : 'Source: National Bank of Romania (BNR) & commercial banking policies'}
          </span>
        </div>
      </div>

      <SectionPhoto
        src="/images/needs/banking.jpg"
        alt={currentLang === 'fa' ? 'ورودی ساختمان مرکزی بانک BCR در بخارست' : 'Gate of the BCR headquarters building in Bucharest'}
        captionFa="ساختمان مرکزی بانک BCR، بخارست — عکس: ویکیمدیا کامنز"
        captionEn="BCR headquarters building, Bucharest — Photo: Wikimedia Commons"
        currentLang={currentLang}
      />

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
          <a href="#required-docs" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۲. جدول مدارک لازم' : '2. Required Documents'}
          </a>
          <a href="#opening-steps" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۳. مراحل افتتاح حساب' : '3. Step-by-Step Process'}
          </a>
          <a href="#bank-comparison" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۴. مقایسه بانک‌های اصلی' : '4. Major Banks Comparison'}
          </a>
          <a href="#neobanks" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۵. نئوبانک‌ها (Wise & Revolut)' : '5. Neobanks (Wise & Revolut)'}
          </a>
          <a href="#common-issues" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۶. مشکلات متداول' : '6. Common Troubleshooting'}
          </a>
          <a href="#disclaimer" className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#142033] hover:text-[#2F6FED] rounded-xl border border-[#dfe6ef] transition-colors text-center">
            {currentLang === 'fa' ? '۷. هشدار و منابع رسمی' : '7. Official Disclaimer'}
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
            {currentLang === 'fa' ? 'پاسخ سریع: شرایط کلی افتتاح حساب بانکی در رومانی چیست؟' : 'Quick Answer: Key Principles for Opening a Bank Account'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'اتباع خارجی دارای کارت اقامت رومانی (Permis de Ședere) یا گواهی ثبت‌نام اتحادیه اروپا (Certificat de Înregistrare) می‌توانند در بانک‌های تجاری معتبر رومانی (نظیر BCR, BRD, Banca Transilvania, Raiffeisen, ING) حساب جاری به ارز RON و EUR افتتاح کنند. داشتن پاسپورت معتبر به همراه کارت اقامت حاوی CNP الزامی است. افتتاح حساب برای متقاضیان غیرمقیم (تنها با پاسپورت و ویزای کوتاه مدت) در بیشتر بانک‌ها محدود بوده و نیازمند بررسی‌های ویژه ارزیابی ریسک است.'
            : 'Foreign residents holding a valid Romanian residence permit (Permis de Ședere) or EU registration certificate can open current accounts in RON and EUR with major commercial banks (e.g. BCR, BRD, Banca Transilvania, Raiffeisen, ING). A valid passport along with your Romanian residence card containing a Personal Numeric Code (CNP) is standard. Opening accounts for non-residents (with tourist visas only) is strictly restricted across most institutions due to compliance audits.'}
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#142033] flex items-start space-x-3 rtl:space-x-reverse">
          <span className="text-base mt-0.5">💡</span>
          <div>
            <strong className="block font-bold">{currentLang === 'fa' ? 'نکته مهم حساب‌های جاری محلی:' : 'Essential Local IBAN Note:'}</strong>
            {currentLang === 'fa'
              ? 'داشتن یک حساب بانکی با شماره IBAN رومانیایی (که با RO شروع می‌شود) برای دریافت حقوق قانونی، پرداخت مالیات ANAF و قراردادهای رسمی مسکن ضروری است.'
              : 'Having a Romanian IBAN account (starting with RO) is essential for legal salary deposits, ANAF tax payments, and formal utility/rent contracts.'}
          </div>
        </div>
      </div>

      {/* SECTION 3: REQUIRED DOCUMENTS TABLE */}
      <div id="required-docs" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <FileCheck2 className="text-[#2F6FED]" size={24} />
          <span>{currentLang === 'fa' ? 'جدول مدارک لازم برای افتتاح حساب' : 'Required Documents Summary Table'}</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#071B3D] text-white">
                <th className="p-3.5 rounded-r-xl">{currentLang === 'fa' ? 'نوع مدرک' : 'Document Type'}</th>
                <th className="p-3.5">{currentLang === 'fa' ? 'محتوا / الزامات' : 'Requirements & Details'}</th>
                <th className="p-3.5 rounded-l-xl">{currentLang === 'fa' ? 'سطح الزام' : 'Requirement Level'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe6ef]">
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'پاسپورت معتبر (Pașaport)' : 'Valid Passport'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'اصل گذرنامه با حداقل ۶ ماه اعتبار مجاز' : 'Original passport with at least 6 months validity'}</td>
                <td className="p-3.5 font-bold text-emerald-600">{currentLang === 'fa' ? 'اجباری عمومی' : 'Mandatory (All Banks)'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'کارت اقامت یا گواهی ثبت‌نام' : 'Residence Permit / EU Certificate'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'Permis de Ședere / Certificat de Înregistrare حاوی کد CNP' : 'Residence card containing your Romanian CNP'}</td>
                <td className="p-3.5 font-bold text-emerald-600">{currentLang === 'fa' ? 'اجباری عمومی' : 'Mandatory (All Banks)'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'اثبات آدرس سکونت در رومانی' : 'Proof of Local Romanian Address'}
                </td>
                <td className="p-3.5">{currentLang === 'fa' ? 'آدرس ثبت‌شده روی کارت اقامت یا قرارداد اجاره معتبر' : 'Address printed on residence card or lease agreement'}</td>
                <td className="p-3.5 font-bold text-emerald-600">{currentLang === 'fa' ? 'اجباری عمومی' : 'Mandatory'}</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3.5 font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'مدارک تکمیلی (فیش حقوقی / اقامت بلندمدت)' : 'Additional Documents (Payslips / Long-term ID)'}
                </td>
                <td className="p-3.5 text-[#526174]">
                  {currentLang === 'fa'
                    ? 'برخی بانک‌ها (مانند Libra Bank یا Alpha Bank) ممکن است برای متقاضیان تازه وارد، اثبات منبع درآمد، قرارداد کار یا کد مالیاتی خاص درخواست کنند.'
                    : 'Some banks (e.g. Libra Bank or Alpha Bank) may request additional proof of income, work contract, or tax identification for recent arrivals.'}
                </td>
                <td className="p-3.5 font-bold text-amber-600">{currentLang === 'fa' ? 'متغیر (بسته به سیاست بانک)' : 'Varies by Bank'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: STEP-BY-STEP PROCESS */}
      <div id="opening-steps" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📋</span>
          <span>{currentLang === 'fa' ? 'مراحل گام‌به‌گام افتتاح حساب بانکی' : 'Step-by-Step Account Opening Process'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۱</span>
              <h3>{currentLang === 'fa' ? 'انتخاب بانک و شعبه مناسب' : 'Select Bank & Branch'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'بانک مورد نظر را بر اساس کارمزدها، کیفیت اپلیکیشن و دسترسی به شعب انتخاب نمایید.'
                : 'Choose a suitable bank based on fees, mobile app functionality, and branch accessibility.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۲</span>
              <h3>{currentLang === 'fa' ? 'مراجعه حضوری به شعبه با اصل مدارک' : 'Visit Branch with Original IDs'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'با اصل پاسپورت و کارت اقامت (Permis de Ședere) به شعبه بانک مراجعه کنید.'
                : 'Present your physical passport and residence permit to the customer desk officer.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۳</span>
              <h3>{currentLang === 'fa' ? 'تکمیل فرم‌های انطباق و KYC' : 'Complete Compliance & KYC Forms'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'فرم‌های اطلاعات شخصی، منبع وجوه و وضعیت اقامت مالیاتی (FATCA/CRS) را امضا نمایید.'
                : 'Fill out know-your-customer (KYC), tax residency status, and source of funds declarations.'}
            </p>
          </div>

          <div className="p-5 bg-[#f8fafc] border border-[#dfe6ef] rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#2F6FED] font-bold text-sm">
              <span className="w-7 h-7 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-extrabold text-xs">۴</span>
              <h3>{currentLang === 'fa' ? 'دریافت IBAN و فعال‌سازی همراه بانک' : 'Receive IBAN & Activate Mobile App'}</h3>
            </div>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'شماره IBAN صادر شده و کارت بانکی فیزیکی (معمولاً ظرف ۳ تا ۵ روز کاری) تحویل یا ارسال می‌گردد.'
                : 'Your IBAN code is generated immediately; debit cards are delivered or collected in 3-5 business days.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: MAJOR BANKS COMPARISON */}
      <div id="bank-comparison" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#2F6FED]">
          <Landmark size={24} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'مرور بانک‌های اصلی رومانی برای اتباع خارجی' : 'Major Commercial Banks Overview in Romania'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'در جدول زیر ویژگی‌های عمومی و رویکرد چند بانک مطرح کشور رومانی مرور شده است (بدون جنبه تبلیغاتی یا رتبه‌بندی):'
            : 'Below is a neutral, factual overview of key commercial banks in Romania regarding foreign customer onboarding:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1.5">
            <h4 className="font-extrabold text-[#142033] text-sm">Banca Transilvania (BT)</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'بزرگ‌ترین بانک رومانی از نظر سهم بازار با شبکه وسیع شعب. دارای اپلیکیشن BT Pay و رویکرد استاندارد برای دارندگان کارت اقامت.'
                : 'Romania’s largest bank by assets with an extensive branch network. Offers BT Pay app and standard onboarding for residents.'}
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1.5">
            <h4 className="font-extrabold text-[#142033] text-sm">BCR (Banca Comercială Română)</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'عضو گروه Erste. دارای پلتفرم دیجیتال پرکاربرد George. افتتاح حساب برای اتباع دارای کارت اقامت منظم انجام می‌شود.'
                : 'Member of Erste Group. Features the popular George banking app. Standard account opening procedures for resident cardholders.'}
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1.5">
            <h4 className="font-extrabold text-[#142033] text-sm">BRD (Groupe Société Générale)</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'از بانک‌های قدیمی و معتبر رومانی با شعب فراوان در شهرهای اصلی و پشتیبانی از حساب‌های چندارزی (RON/EUR).'
                : 'Established bank with strong network across major cities; supports multi-currency accounts (RON/EUR).'}
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1.5">
            <h4 className="font-extrabold text-[#142033] text-sm">ING Bank & Raiffeisen Bank</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'خدمات بانکداری همراه مدرن. برخی از این بانک‌ها امکان افتتاح حساب آنلاین را با کارت شناسایی رومانی فراهم کرده‌اند اما برای اتباع خارجی ممکن است تایید حضوری مدارک الزامی باشد.'
                : 'Modern digital mobile banking apps. Some offer online registration for resident ID holders, though in-person ID checks may apply.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 6: NEOBANKS (WISE & REVOLUT) */}
      <div id="neobanks" className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#2F6FED]">
          <Landmark size={24} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'نئوبانک‌ها (Revolut و Wise) به عنوان گزینه تکمیلی' : 'Complementary Neobanks: Revolut & Wise'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'پلتفرم‌های مالی بین‌المللی نظیر Revolut و Wise در بین مقیمان و اتباع خارجی در رومانی فوق‌العاده محبوب هستند. این ابزارها امکان تبدیل ارز با نرخ مناسب، خرید روزمره و انتقال پول بین‌المللی را فراهم می‌سازند. با این حال، توجه داشته باشید که نئوبانک‌ها به عنوان «ابزار تکمیلی» شناخته می‌شوند و جایگزین کامل حساب بانکی محلی نیستند، زیرا برای برخی امور حقوقی، واریز رسمی حقوق و تعامل با اداره دارایی (ANAF)، داشتن حساب جاری در یک بانک تجاری محلی رومانی الزامی است.'
            : 'Digital financial platforms like Revolut and Wise are extremely popular among foreign residents in Romania for currency conversion and daily card payments. However, they should be viewed as complementary tools rather than a total replacement for a local Romanian bank account, as formal employment payrolls, ANAF tax filings, and certain local contracts require a traditional Romanian commercial bank account.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold pt-2">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
            <span className="block text-sm mb-1">⚡ {currentLang === 'fa' ? 'مزایای نئوبانک‌ها' : 'Neobank Benefits'}</span>
            <span className="font-normal text-emerald-800">
              {currentLang === 'fa' ? 'افتتاح سریع آنی، نرخ‌های تبدیل ارز عالی و کارمزد پایین در خریدهای بین‌المللی.' : 'Instant app setup, competitive exchange rates, and multi-currency balances.'}
            </span>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
            <span className="block text-sm mb-1">📌 {currentLang === 'fa' ? 'محدودیت‌های نئوبانک‌ها' : 'Neobank Limitations'}</span>
            <span className="font-normal text-amber-800">
              {currentLang === 'fa' ? 'عدم امکان واریز برخی حقوق‌های دولتی/شرکتی محلی یا خدمات نقدینگی حضوری.' : 'Some employers require traditional local IBANs for payroll tax compliance.'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 6.5: IRAN-SPECIFIC SANCTIONS CONTEXT */}
      <div id="iran-sanctions-context" className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-amber-700">
          <AlertCircle size={24} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'ویژه ایرانیان: چرا افتتاح حساب گاهی سخت‌تر به‌نظر می‌رسد' : 'Iran-Specific: Why Account Opening Can Feel Harder'}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'این نکته‌ای است که در راهنماهای عمومی بانکی رومانی معمولاً دیده نمی‌شود. در سپتامبر ۲۰۲۵، پس از فعال‌سازی مکانیزم «بازگشت تحریم‌ها» (Snapback) توسط شورای امنیت سازمان ملل، اتحادیه اروپا تحریم‌های مالی علیه بانک‌ها و نهادهای ایرانی را به‌طور کامل احیا کرد. این تحریم‌ها عمدتاً نهادهای بانکی ایران را هدف می‌گیرند، نه لزوماً شهروندان عادی ایرانی که به‌طور قانونی در رومانی اقامت دارند — اما به‌دلیل همین فضای مقرراتی حساس، بانک‌های تجاری معمولاً محتاط‌تر عمل می‌کنند و ممکن است مدارک تکمیلی (اثبات منبع درآمد، توضیح تراکنش‌ها) از متقاضیان ایرانی درخواست کنند. یک نمونه مستند: در سال ۲۰۲۱، First Bank رومانی به‌دلیل ۷۰ تراکنش مرتبط با ایران و سوریه بیش از ۸۵۰,۰۰۰ دلار به وزارت خزانه‌داری آمریکا (OFAC) جریمه پرداخت کرد — همین موضوع توضیح می‌دهد چرا بانک‌های رومانیایی نسبت به تراکنش‌های مرتبط با ایران محتاط‌اند.'
            : 'This is a point most general Romanian banking guides skip. In September 2025, after the UN Security Council\'s "snapback" mechanism was triggered, the EU fully reimposed financial sanctions on Iranian banks and institutions. These measures mainly target Iranian financial institutions, not individual Iranian nationals legally resident in Romania — but because of this sensitive regulatory climate, commercial banks tend to act more cautiously and may ask Iranian applicants for extra documentation (proof of income source, explanation of transaction history). One documented example: in 2021, First Bank Romania paid over $850,000 to the US Treasury (OFAC) over 70 Iran- and Syria-related transactions — which helps explain why Romanian banks are cautious around anything Iran-linked.'}
        </p>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'ما هیچ سند یا گزارش رسمی پیدا نکردیم که نشان دهد یک بانک خاص رومانیایی به‌طور رسمی از افتتاح حساب برای دارندگان پاسپورت ایرانی خودداری می‌کند؛ اما در کشورهای دیگر اتحادیه اروپا (مثلاً ایتالیا و آلمان) گزارش‌های مستند از بستن یا رد حساب اتباع ایرانی توسط برخی بانک‌ها به‌دلیل ملیت وجود دارد. توصیه عملی: مدارک اثبات منبع درآمد و اقامت قانونی خود را کامل و آماده داشته باشید، و اگر یک شعبه درخواست شما را رد کرد، شعبه یا بانک دیگری را امتحان کنید — رویه‌های داخلی می‌توانند بین بانک‌ها و حتی بین شعب یک بانک متفاوت باشند. برای انتقال پول بین‌المللی هم توجه داشته باشید که سرویس‌هایی مانند Western Union، Wise و Remitly قادر به پردازش مستقیم حواله به/از ایران نیستند (چون تحت مقررات آمریکا و بدون مجوز OFAC فعالیت می‌کنند)؛ برای جزئیات بیشتر به راهنمای '
            : 'We found no official record of any specific Romanian bank formally refusing to open accounts for Iranian passport holders; however, other EU countries (e.g. Italy and Germany) have documented reports of banks closing or rejecting accounts for Iranian nationals specifically due to nationality. Practical advice: have your proof-of-income and legal-residence documents complete and ready, and if one branch declines your application, try another branch or bank — internal policies can differ between banks and even between branches of the same bank. For international transfers, note that services like Western Union, Wise, and Remitly cannot process direct transfers to/from Iran (they operate under US regulation without an OFAC license); see the '}
            <Link href="/needs/currency-exchange" className="text-[#2F6FED] font-bold hover:underline">
              {currentLang === 'fa' ? 'راهنمای صرافی و پرداخت‌ها' : 'Currency Exchange & Payments guide'}
            </Link>
          {currentLang === 'fa' ? ' مراجعه کنید.' : ' for more.'}
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
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۱. رد درخواست به دلیل نداشتن کارت اقامت صادرشده:' : '1. Rejection Due to Lack of Issued Residence Card:'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'اگر کارت اقامت (Permis de Ședere) شما هنوز صادر نشده و تنها برگه رسید IGI دارید، بیشتر بانک‌ها درخواست را تا زمان صدور کارت فیزیکی حاوی CNP معلق می‌کنند.'
                : 'If your residence card is pending and you only have an IGI receipt, most banks will defer account activation until your physical card with a CNP is presented.'}
            </p>
          </div>

          <div className="p-4 bg-[#f8fafc] border border-[#dfe6ef] rounded-xl space-y-1">
            <h4 className="font-bold text-[#142033]">{currentLang === 'fa' ? '۲. تفاوت ضوابط شعب مختلف یک بانک:' : '2. Differing Branch Policies within the Same Bank:'}</h4>
            <p className="text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'گاهی کارمندان شعب مختلف یک بانک به دلیل آشنایی متفاوت با ضوابط اقامتی اتباع خارجی، مدارک متفاوتی درخواست می‌کنند. در صورت مواجهه با مشکل، به شعبه اصلی بانک در شهر مراجعه فرمایید.'
                : 'Staff familiarity with expat documentation can vary between branches. Visiting central city branches usually yields a smoother experience.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 8: OFFICIAL DISCLAIMER */}
      <div id="disclaimer" className="bg-[#071B3D] text-white p-6 sm:p-8 rounded-2xl space-y-3 shadow-sm">
        <h3 className="font-extrabold text-base flex items-center space-x-2 rtl:space-x-reverse text-amber-400">
          <span>⚠️</span>
          <span>{currentLang === 'fa' ? 'هشدار حقوقی و شرایط بانک‌ها' : 'Official Banking Compliance Disclaimer'}</span>
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
          {currentLang === 'fa'
            ? 'هر بانک تجاری در رومانی طبق قوانین مبارزه با پول‌شویی (AML) و ارزیابی ریسک، ضوابط داخلی و اختیارات مستقل خود را دارد. ممکن است برخی بانک‌ها (نظیر Libra Bank یا Alpha Bank) مدارک اضافی نظیر اقامت بلندمدت را درخواست کنند. حتماً پیش از مراجعه حضوری، شرایط بروز را از وب‌سایت یا شعبه رسمی بانک مورد نظر استعلام بگیرید.'
            : 'Each commercial bank in Romania maintains independent internal compliance policies under AML regulations. Certain institutions (e.g. Libra Bank or Alpha Bank) may enforce stricter eligibility criteria for non-EU nationals. Always confirm current account opening requirements directly with your chosen bank branch.'}
        </p>
      </div>

      {/* SECTION 9: LAST REVIEWED DATE */}
      <div id="last-reviewed" className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-[#526174] flex items-center space-x-2 rtl:space-x-reverse">
        <Clock size={16} className="text-slate-400" />
        <span>
          {currentLang === 'fa'
            ? 'آخرین بررسی و به‌روزرسانی محتوا: سال ۲۰۲۶ (بر اساس آیین‌نامه‌های بانکی رومانی)'
            : 'Last reviewed & updated: 2026 (Based on official Romanian banking compliance standards)'}
        </span>
      </div>

      {/* SECTION 10: RELATED CONTENT & COMMENTS */}
      <div id="related-content" className="space-y-6 pt-4">
        <h3 className="text-lg font-extrabold text-[#142033]">
          {currentLang === 'fa' ? 'مطالب مرتبط' : 'Related Guides'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => handleNav('needs/currency-exchange')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🏦</span>
              <span>{currentLang === 'fa' ? 'صرافی و نرخ‌های مرجع BNR' : 'Currency Exchange & BNR Rates'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'فید زنده نرخ‌های بانک ملی رومانی، صرافی‌های مجاز و روش‌های پرداخت.'
                : 'Live BNR exchange rates feed, licensed exchange offices, and payment methods.'}
            </p>
          </div>

          <div
            onClick={() => handleNav('immigration/igi-process')}
            className="editorial-card p-5 bg-white border border-[#dfe6ef] rounded-2xl hover:border-[#2F6FED] transition-all cursor-pointer space-y-2"
          >
            <h4 className="font-bold text-sm text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🏛️</span>
              <span>{currentLang === 'fa' ? 'مراحل کارت اقامت و IGI' : 'IGI Residence Permit Guide'}</span>
            </h4>
            <p className="text-xs text-[#526174]">
              {currentLang === 'fa'
                ? 'زمان‌بندی صدور کارت اقامت حاوی CNP برای ارائه به بانک‌ها.'
                : 'Residency permit timelines and CNP assignment required for bank accounts.'}
            </p>
          </div>
        </div>
        
        <ContextualLeadCapture topic="banking" currentLang={currentLang} />

        <ParentHubFooterCard slugRoute="needs/banking" currentLang={currentLang} onNavigate={onNavigate} />

        {/* COMMENTS SECTION */}
        <div className="pt-6">
          <CommentsSection currentLang={currentLang} pagePath="needs/banking" />
        </div>
      </div>
    </div>
  );
};
