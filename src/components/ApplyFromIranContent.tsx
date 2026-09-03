'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';
import { RelatedGuidesCard } from './RelatedGuidesCard';
import { FaqSchema } from './FaqSchema';

interface ApplyFromIranContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const ApplyFromIranContent: React.FC<ApplyFromIranContentProps> = ({ currentLang, onNavigate }) => {
  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <Breadcrumb slugRoute="immigration/apply-from-iran" currentLang={currentLang} onNavigate={onNavigate} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
          <span>🇮🇷 {currentLang === 'fa' ? 'راهنمای اقدام برای مقیمان داخل ایران' : 'Guide for Applicants Residing in Iran'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {currentLang === 'fa'
            ? 'اقدام از داخل ایران: سفارت رومانی در تهران'
            : 'Applying from Inside Iran: The Romanian Embassy in Tehran'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'اگر ساکن ایران هستید، مسیر ویزای بلندمدت (نوع D) شما از طریق سفارت رومانی در تهران انجام می‌شود. این صفحه نکات مخصوص این مسیر — نوبت‌دهی، مسیر پرواز و ارتباط آن با مراحل کلی IGI — را خلاصه می‌کند.'
            : 'If you live in Iran, your Type D long-stay visa is processed through the Romanian Embassy in Tehran. This page summarizes the Iran-specific details — appointments, flight routing, and how this connects to the general IGI process.'}
        </p>
        <div className="text-xs text-slate-400 pt-2 flex items-center space-x-2 rtl:space-x-reverse border-t border-slate-700/60">
          <span>🏛️</span>
          <span>
            {currentLang === 'fa'
              ? 'منبع: فهرست نمایندگی‌های رسمی رومانی، وزارت امور خارجه رومانی (mae.ro)'
              : 'Source: Official list of Romanian diplomatic missions, Romanian MFA (mae.ro)'}
          </span>
        </div>
      </div>

      {/* QUICK ANSWER */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="font-extrabold text-lg text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>✅</span>
          <span>{currentLang === 'fa' ? 'پاسخ سریع' : 'Quick Answer'}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'رومانی در تهران سفارت فعال دارد و متقاضیان مقیم ایران درخواست ویزای نوع D را همان‌جا ثبت می‌کنند. ترتیب کار این‌گونه است: ۱) ابتدا مدارک پایه مسیر شما (پذیرش دانشگاه، مجوز کار، یا ثبت شرکت) در رومانی تایید و آماده می‌شود؛ ۲) سپس نوبت سفارت تهران برای ویزای D رزرو و در آن حضور می‌یابید؛ ۳) پس از صدور ویزا به رومانی سفر کرده و کارت اقامت را نزد IGI دریافت می‌کنید. حضور فیزیکی شما فقط در مرحلهٔ ۲ (مصاحبه/بیومتریک سفارت) و ۳ (ورود به رومانی) لازم است.'
            : "Romania maintains an active embassy in Tehran, and Iran-based applicants submit their Type D visa application there. The order of operations: 1) your underlying pathway documents (university acceptance, work permit, or company registration) are prepared and approved in Romania first; 2) you book and attend your Tehran embassy appointment for the D visa; 3) once issued, you travel to Romania and collect your residence card from IGI. Your physical presence is only required for step 2 (the embassy interview/biometrics) and step 3 (arrival)."}
        </p>
      </div>

      {/* PROCESS LINK-OUT */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="font-extrabold text-lg text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>🗂️</span>
          <span>{currentLang === 'fa' ? 'مراحل کامل نزد IGI' : 'Full IGI Process'}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'مراحل کامل — از ارزیابی اولیه مدارک تا صدور کارت اقامت — یکسان است چه در ایران، چه امارات و چه ترکیه اقدام کنید؛ فقط محل سفارت و مسیر پرواز فرق می‌کند. برای مرور کامل مراحل و مدارک لازم، راهنمای IGI را ببینید.'
            : 'The overall steps — from initial document review to residence-card issuance — are identical whether you apply from Iran, the UAE, or Turkey; only the embassy location and flight route differ. See the full IGI guide for the complete steps and required documents.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/immigration/igi-process#pre-arrival-docs" className="text-sm font-bold text-[#2F6FED] hover:underline">
            {currentLang === 'fa' ? '← ارزیابی اولیه مدارک' : '→ Initial document audit'}
          </Link>
          <Link href="/immigration/igi-process#visa-type-d-issuance" className="text-sm font-bold text-[#2F6FED] hover:underline">
            {currentLang === 'fa' ? '← صدور ویزای نوع D' : '→ Type D visa issuance'}
          </Link>
        </div>
      </div>

      {/* IRAN-SPECIFIC NOTES */}
      <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0] space-y-4">
        <h2 className="text-lg font-bold text-[#142033]">
          {currentLang === 'fa' ? 'نکات عملی: نوبت سفارت و مسیر پرواز' : 'Practical Notes: Embassy Appointments & Flight Routing'}
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'جزئیات به‌روز دربارهٔ محدودیت نوبت‌دهی سفارت تهران و وضعیت فعلی مسیرهای پروازی (تهران–استانبول در برابر مسیرهای دبی/دوحه) را در راهنمای «برنامه‌ریزی برای ورود» توضیح داده‌ایم تا این اطلاعات در یک‌جا به‌روز نگه داشته شود.'
            : "Up-to-date detail on Tehran embassy appointment availability and current flight-route conditions (Tehran–Istanbul vs. Dubai/Doha routings) is covered in our 'Planning Your Move' guide, kept in one place so it stays current."}
        </p>
        <Link href="/start-here/planning-to-come" className="inline-block text-sm font-bold text-[#2F6FED] hover:underline">
          {currentLang === 'fa' ? '← مشاهده نکات نوبت سفارت و پرواز' : '→ See embassy-appointment & flight notes'}
        </Link>
      </div>

      {/* FAQ */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[#142033] border-b border-[#eef2f6] pb-2">
          {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-[#334155] mb-1.5 text-sm">
              {currentLang === 'fa' ? 'آیا می‌توانم بدون رفتن به سفارت تهران اقدام کنم؟' : 'Can I apply without going to the Tehran embassy in person?'}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {currentLang === 'fa'
                ? 'خیر. ویزای نوع D معمولاً نیازمند حضور فیزیکی برای ثبت بیومتریک (اثر انگشت و عکس) و مصاحبه است؛ این مرحله را نمی‌توان از طریق وکالت یا نماینده انجام داد. آنچه پیش از این مرحله (مثل ثبت شرکت یا اخذ پذیرش) قابل انجام است، جدا از خود درخواست ویزا محسوب می‌شود.'
                : 'No. A Type D visa generally requires your physical presence for biometric enrollment (fingerprints and photo) and an interview; this specific step cannot be delegated to a representative or power of attorney. Steps that happen before this stage (like company registration or securing an admission) are separate from the visa application itself.'}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#334155] mb-1.5 text-sm">
              {currentLang === 'fa' ? 'اگر تابعیت دومی هم دارم، باید از سفارت تهران اقدام کنم؟' : 'If I also hold a second nationality, do I still apply through the Tehran embassy?'}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {currentLang === 'fa'
                ? 'این بستگی به این دارد که با کدام پاسپورت و از کدام کشور محل اقامت قانونی اقدام می‌کنید. اگر عملاً و قانونی ساکن ایران هستید، سفارت تهران محل معمول اقدام است؛ در غیر این صورت باید بر اساس کشور اقامت واقعی خود تصمیم بگیرید — این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
                : "It depends on which passport you use and which country you are legally resident in. If you are actually and legally resident in Iran, Tehran is the standard place to apply; otherwise the decision should follow your actual country of residence — this must be verified based on current regulations and individual circumstances."}
            </p>
          </div>
        </div>
      </div>

      <FaqSchema items={[
        {
          q: currentLang === 'fa' ? 'آیا می‌توانم بدون رفتن به سفارت تهران اقدام کنم؟' : 'Can I apply without going to the Tehran embassy in person?',
          a: currentLang === 'fa'
            ? 'خیر. ویزای نوع D معمولاً نیازمند حضور فیزیکی برای ثبت بیومتریک و مصاحبه است و نمی‌توان آن را از طریق وکالت انجام داد.'
            : 'No. A Type D visa generally requires physical presence for biometric enrollment and an interview, which cannot be delegated to a representative.'
        },
        {
          q: currentLang === 'fa' ? 'اگر تابعیت دومی هم دارم، باید از سفارت تهران اقدام کنم؟' : 'If I also hold a second nationality, do I still apply through the Tehran embassy?',
          a: currentLang === 'fa'
            ? 'بستگی به کشور اقامت قانونی واقعی شما دارد؛ اگر ساکن ایران هستید سفارت تهران محل معمول اقدام است.'
            : 'It depends on your actual country of legal residence; if you are resident in Iran, Tehran is the standard place to apply.'
        }
      ]} />

      <RelatedGuidesCard
        items={['immigration/igi-process', 'start-here/planning-to-come', 'work/work-permit']}
        currentLang={currentLang}
        onNavigate={onNavigate}
      />

      <p className="text-xs text-[#94a3b8] leading-relaxed border-t border-[#eef2f6] pt-4">
        {currentLang === 'fa'
          ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
          : 'This must be verified based on current regulations and individual circumstances.'}
      </p>

      <ParentHubFooterCard slugRoute="immigration/apply-from-iran" currentLang={currentLang} onNavigate={onNavigate} />
    </div>
  );
};
