'use client';

import React from 'react';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';
import { SectionPhoto } from './SectionPhoto';
import { RelatedGuidesCard } from './RelatedGuidesCard';

interface PreparatoryYearContentProps {
  currentLang: Language;
}

export const PreparatoryYearContent: React.FC<PreparatoryYearContentProps> = ({ currentLang }) => {
  const disclaimer = currentLang === 'fa'
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  return (
    <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <Breadcrumb slugRoute="study/preparatory-year" currentLang={currentLang} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {currentLang === 'fa' ? 'سال آماده‌سازی زبان رومانیایی' : 'Romanian Language Preparatory Year'}
        </h1>
        <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
          {currentLang === 'fa' 
            ? 'برای دانشجویانی که قصد تحصیل به زبان رومانیایی دارند یا سطح زبانشان برای ورود مستقیم کافی نیست، دانشگاه‌های رومانی یک سال آماده‌سازی زبان پیش از شروع رشته اصلی ارائه می‌دهند. برای هزینه دقیق این دوره به سایت دانشگاه مورد نظر مراجعه کنید.'
            : 'For students intending to study in Romanian or those lacking sufficient language proficiency for direct entry, Romanian universities offer a language preparatory year prior to starting the main degree program. For the exact cost of this course, please visit the specific university\'s website.'}
        </p>
        <div className="text-[11px] text-slate-400 mt-2">
          {currentLang === 'fa' 
            ? 'منبع: دانشگاه بخارست (international.unibuc.ro) — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
            : 'Source: University of Bucharest (international.unibuc.ro) — Last reviewed: August 2026'}
        </div>
      </div>

      <SectionPhoto
        src="/images/study/preparatory-year.jpg"
        alt={currentLang === 'fa' ? 'دانشگاه بابش-بویای کلوژ-ناپوکا' : 'Babeș-Bolyai University, Cluj-Napoca'}
        captionFa="دانشگاه بابش-بویای کلوژ-ناپوکا — عکس: ویکیمدیا کامنز"
        captionEn="Babeș-Bolyai University, Cluj-Napoca — Photo: Wikimedia Commons"
        currentLang={currentLang}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
            <span>{currentLang === 'fa' ? 'برای چه کسانی مناسب است' : 'Who is it for'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'متقاضیانی که می‌خواهند به زبان رومانیایی (نه انگلیسی یا فرانسوی) تحصیل کنند.' : 'Applicants wishing to study in Romanian (instead of English or French).'}</li>
            <li>{currentLang === 'fa' ? 'متقاضیانی که مدرک زبان معتبر (مثل IELTS/TOEFL برای برنامه‌های انگلیسی) ندارند.' : 'Applicants without a recognized language certificate (such as IELTS/TOEFL for English programs).'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
            <span>{currentLang === 'fa' ? 'ساختار دوره' : 'Course Structure'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'معمولاً یک سال تحصیلی، با تمرکز بر آموزش زبان و اصطلاحات تخصصی رشته مورد نظر است.' : 'Typically one academic year, focusing on language instruction and specialized terminology for the chosen field.'}</li>
            <li>{currentLang === 'fa' ? 'در پایان دوره آزمون سطح زبان برگزار می‌شود.' : 'A language proficiency exam is held at the end of the course.'}</li>
          </ul>
        </div>

        <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
          <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
            <span>{currentLang === 'fa' ? 'پس از اتمام دوره' : 'After Completion'}</span>
          </h3>
          <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
            <li>{currentLang === 'fa' ? 'قبولی در آزمون پایان دوره، مسیر ورود به رشته اصلی (کارشناسی، ارشد یا دکتری) را باز می‌کند.' : 'Passing the final exam opens the pathway to the main degree program (Bachelor\'s, Master\'s, or PhD).'}</li>
            <li>
              <span className="text-[11px] italic text-slate-400">{disclaimer}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* REAL NAMED FEE EXAMPLE */}
      <div className="bg-[#f0f4f9] p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] space-y-3">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>💶</span>
          <span>{currentLang === 'fa' ? 'نمونه واقعی هزینه (دانشگاه بابش-بویای کلوژ)' : 'A Real Fee Example (Babeș-Bolyai University, Cluj)'}</span>
        </h3>
        <p className="text-sm text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'به‌عنوان یک نمونه واقعی و منبع‌دار: دانشگاه بابش-بویای کلوژ (UBB) هزینه سال آماده‌سازی زبان را ۳,۰۱۵ یورو به‌علاوه ۵۰ یورو هزینه ثبت‌نام اعلام کرده است. این رقم فقط برای این دانشگاه است — سایر دانشگاه‌ها (به‌خصوص دانشکده‌های پزشکی) معمولاً هزینه متفاوت و اغلب بالاتری دارند که باید مستقیماً از سایت بین‌الملل همان دانشگاه استعلام شود.'
            : 'As one real, sourced example: Babeș-Bolyai University (UBB) Cluj lists its preparatory year fee at 3,015 EUR plus a 50 EUR enrollment fee. This figure is specific to UBB only — other universities (especially medical schools) typically charge different, often higher fees, which should be confirmed directly on that university\'s international office website.'}
        </p>
        <p className="text-[11px] text-slate-400">
          {currentLang === 'fa' ? 'منبع: cci.ubbcluj.ro (دفتر بین‌الملل دانشگاه بابش-بویای کلوژ).' : 'Source: cci.ubbcluj.ro (Babeș-Bolyai University international office).'}
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-amber-950 leading-relaxed">
        {currentLang === 'fa'
          ? 'به‌روزرسانی: طبق چند دانشگاه رومانیایی (پلی‌تکنیک بخارست، اوویدیوس کنستانتا، UMF یاش)، مدرک پایان دوره معمولاً «certificat/atestat de absolvire a anului pregătitor» نامیده می‌شود (دانشگاه‌های مختلف از «certificat» یا «atestat» استفاده می‌کنند) و پس از گذراندن ۶۰ واحد و قبولی در آزمون نهایی زبان صادر می‌شود؛ اما نام انگلیسی این مدرک استاندارد نیست — دانشگاه‌ها آن را متفاوت ترجمه می‌کنند (مثلاً «Certificate of Proficiency in Romanian Language» یا «certificate of linguistic competence»). این نام‌گذاری بر اساس منبع اولیهٔ متن آیین‌نامهٔ وزارتی (شماره ۵۵۱۶/۲۰۲۴) تایید مستقیم نشده، بلکه از چند صفحه دانشگاهی مستقل استخراج شده. نکته دوم (آیا کارت اقامت جداگانه‌ای لازم است) هنوز به‌روشنی مشخص نشد؛ هر دو مورد را مستقیماً از دانشگاه و IGI استعلام بگیرید.'
          : 'Update: per several Romanian universities (Politehnica București, Ovidius Constanța, UMF Iași), the completion certificate is typically called "certificat/atestat de absolvire a anului pregătitor" (institutions use either "certificat" or "atestat"), issued after completing 60 credits and passing the final language exam — but there is no standardized English name; universities translate it differently (e.g., "Certificate of Proficiency in Romanian Language" or "certificate of linguistic competence"). This naming is not confirmed against the primary text of the governing ministerial order (No. 5516/2024) itself, but drawn from several independent university pages. The second question (whether a separate residence permit is required) remains unclear; confirm both directly with your university and IGI.'}
      </div>

      {/* RELATED GUIDES CARD */}
      <RelatedGuidesCard
        currentLang={currentLang}
        items={[
          {
            route: 'study/scholarships',
            icon: '🎓',
            titleFa: 'بورسیه تحصیلی دولت رومانی',
            titleEn: 'Romanian Government Scholarship',
            descriptionFa: 'شرایط بورسیه کامل دولتی وزارت امور خارجه شامل دوره رایگان کالج زبان.',
            descriptionEn: 'Full government scholarship program covering the preparatory language course.',
            badgeFa: 'بورسیه کامل',
            badgeEn: 'Scholarship'
          },
          {
            route: 'study/visa-type-d',
            icon: '🛂',
            titleFa: 'ویزای تحصیلی نوع D/SD',
            titleEn: 'Type D/SD Student Visa',
            descriptionFa: 'راهنمای اخذ ویزای دانشجویی برای حضور در دوره یک ساله زبان.',
            descriptionEn: 'Student visa checklist and consular requirements for the prep year.',
            badgeFa: 'ویزای سفارت',
            badgeEn: 'Student Visa'
          },
          {
            route: 'study/part-time-work',
            icon: '💼',
            titleFa: 'کار دانشجویی در رومانی',
            titleEn: 'Part-Time Student Work',
            descriptionFa: 'قوانین اشتغال پاره‌وقت دانشجویان در حین تحصیل (تا ۲۰ ساعت در هفته).',
            descriptionEn: 'Part-time student employment regulations and legal work limits.',
            badgeFa: 'قوانین کار',
            badgeEn: 'Student Work'
          }
        ]}
      />

      <ParentHubFooterCard slugRoute="study/preparatory-year" currentLang={currentLang} />
    </div>
  );
};
