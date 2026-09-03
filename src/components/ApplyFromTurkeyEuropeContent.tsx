'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';
import { RelatedGuidesCard } from './RelatedGuidesCard';
import { FaqSchema } from './FaqSchema';

interface ApplyFromTurkeyEuropeContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const ApplyFromTurkeyEuropeContent: React.FC<ApplyFromTurkeyEuropeContentProps> = ({ currentLang, onNavigate }) => {
  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <Breadcrumb slugRoute="immigration/apply-from-turkey-europe" currentLang={currentLang} onNavigate={onNavigate} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
          <span>🇹🇷 {currentLang === 'fa' ? 'راهنمای اقدام برای مقیمان ترکیه و کشورهای اروپایی' : 'Guide for Applicants Residing in Turkey & Europe'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {currentLang === 'fa'
            ? 'اقدام از ترکیه و کشورهای اروپایی'
            : 'Applying from Turkey & European Countries'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'این صفحه دو گروه را پوشش می‌دهد: کسانی که در ترکیه اقامت دارند، و کسانی که پیشتر به یکی از کشورهای اروپایی نقل‌مکان کرده‌اند (مثلاً با اقامت تحصیلی یا کاری) و اکنون می‌خواهند اقدام رومانی را از همان‌جا پیگیری کنند.'
            : 'This page covers two groups: applicants resident in Turkey, and applicants who have already relocated to a European country (for example on a student or work residence permit) and now want to pursue their Romania application from there.'}
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

      {/* TWO PATHS */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-3">
          <h2 className="font-extrabold text-base text-[#142033]">
            {currentLang === 'fa' ? '۱. مقیم ترکیه هستید' : '1. Resident in Turkey'}
          </h2>
          <p className="text-sm text-[#526174] leading-relaxed">
            {currentLang === 'fa'
              ? 'رومانی نمایندگی رسمی در ترکیه دارد و متقاضیان مقیم ترکیه درخواست ویزای نوع D را نزد همان نمایندگی ثبت می‌کنند. مسیر پروازی تهران–استانبول که در راهنمای «برنامه‌ریزی برای ورود» توضیح داده‌ایم، همین شهر را به‌عنوان گذرگاه پایدار معرفی می‌کند — اما آن بخش دربارهٔ عبور از استانبول برای مقیمان ایران است، نه اقدام مستقیم برای مقیمان ترکیه.'
              : "Romania maintains an official diplomatic mission in Turkey, and Turkey-resident applicants submit their Type D visa there. The Tehran–Istanbul flight routing described in our 'Planning Your Move' guide names this city as a stable transit point — but that note is about transiting through Istanbul for Iran-based applicants, not about applying directly as a Turkey resident."}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-3">
          <h2 className="font-extrabold text-base text-[#142033]">
            {currentLang === 'fa' ? '۲. در حال حاضر در یک کشور اروپایی هستید' : '2. Currently Living in a European Country'}
          </h2>
          <p className="text-sm text-[#526174] leading-relaxed">
            {currentLang === 'fa'
              ? 'اگر با اقامت قانونی (تحصیلی، کاری یا هر نوع دیگر) در یک کشور اروپایی دیگر زندگی می‌کنید، قاعدهٔ کلی این است که اقدام رومانی را نزد نمایندگی رومانی در همان کشور محل اقامت قانونی خود پیگیری کنید، نه از سفارت ایران. جزئیات دقیق بسته به وضعیت اقامتی فعلی شما (نوع ویزا/اقامت اروپایی) متفاوت است.'
              : 'If you hold a legal residence permit (student, work, or other) in another European country, the general rule is to pursue your Romania application through the Romanian mission in that country of legal residence, not the Iran embassy. The exact details vary depending on your current European visa/residence status.'}
          </p>
        </div>
      </div>

      {/* PROCESS LINK-OUT */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="font-extrabold text-lg text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>🗂️</span>
          <span>{currentLang === 'fa' ? 'مراحل کامل نزد IGI' : 'Full IGI Process'}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'ترتیب کلی مراحل — تایید مسیر در رومانی، سپس ویزای D نزد نمایندگی محل اقامت، سپس ورود و دریافت کارت اقامت نزد IGI — برای هر دو گروه بالا یکسان است.'
            : 'The general order of steps — approving your pathway in Romania, then the D visa at your mission of residence, then arrival and the residence card from IGI — is the same for both groups above.'}
        </p>
        <Link href="/immigration/igi-process#pre-arrival-docs" className="inline-block text-sm font-bold text-[#2F6FED] hover:underline">
          {currentLang === 'fa' ? '← مشاهده راهنمای کامل مراحل IGI' : '→ See the full IGI process guide'}
        </Link>
      </div>

      {/* COMPANY NOTE FOR TURKEY-BASED BUSINESS OWNERS */}
      <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0] space-y-3">
        <h2 className="text-lg font-bold text-[#142033]">
          {currentLang === 'fa' ? 'اگر در ترکیه شرکت فعالی دارید' : "If You Already Run an Active Company in Turkey"}
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'همان منطق ثبت شرکت/شعبه با وکالتنامهٔ محضری که برای صاحبان کسب‌وکار در امارات و حوزهٔ خلیج فارس توضیح دادیم، برای یک شرکت فعال در ترکیه هم به‌طور مشابه صادق است — با همان هشدار مهم: وکالت مرحلهٔ ثبت شرکت را بدون سفر ممکن می‌کند، اما مرحلهٔ درخواست اقامت (ویزای D) همچنان معمولاً به حضور فیزیکی شما نیاز دارد.'
            : 'The same branch/company registration by notarized power of attorney explained for business owners in the UAE and the Gulf applies similarly to an active company in Turkey — with the same important caveat: a power of attorney enables the company-registration step without travel, but the residency application step (the D visa) still generally requires your physical presence.'}
        </p>
        <Link href="/immigration/apply-from-uae-gulf" className="inline-block text-sm font-bold text-[#2F6FED] hover:underline">
          {currentLang === 'fa' ? '← مشاهده توضیح کامل ثبت شعبه با وکالت' : '→ See the full branch-by-power-of-attorney explanation'}
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
              {currentLang === 'fa' ? 'اگر در یک کشور اروپایی با اقامت تحصیلی هستم، از کجا اقدام کنم؟' : "If I'm in a European country on a student residence permit, where should I apply from?"}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {currentLang === 'fa'
                ? 'به‌طور کلی نزد نمایندگی رومانی در همان کشوری که در حال حاضر اقامت قانونی دارید. این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود، چون بسته به نوع اقامت فعلی شما ممکن است فرق کند.'
                : 'Generally through the Romanian mission in the country where you currently hold legal residence. This must be verified based on current regulations and individual circumstances, since it can vary with your current residence status.'}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#334155] mb-1.5 text-sm">
              {currentLang === 'fa' ? 'آیا مسیر ترکیه سریع‌تر از ایران است؟' : 'Is applying from Turkey faster than from Iran?'}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {currentLang === 'fa'
                ? 'مراحل و مدارک لازم یکسان است؛ آنچه ممکن است فرق کند، ظرفیت نوبت‌دهی و زمان انتظار نمایندگی محلی است که باید مستقیماً از خود نمایندگی استعلام شود.'
                : 'The required steps and documents are the same; what can differ is local appointment capacity and wait times at that specific mission, which should be checked directly with the mission itself.'}
            </p>
          </div>
        </div>
      </div>

      <FaqSchema items={[
        {
          q: currentLang === 'fa' ? 'اگر در یک کشور اروپایی با اقامت تحصیلی هستم، از کجا اقدام کنم؟' : "If I'm in a European country on a student residence permit, where should I apply from?",
          a: currentLang === 'fa'
            ? 'به‌طور کلی نزد نمایندگی رومانی در همان کشوری که در حال حاضر اقامت قانونی دارید.'
            : 'Generally through the Romanian mission in the country where you currently hold legal residence.'
        },
        {
          q: currentLang === 'fa' ? 'آیا مسیر ترکیه سریع‌تر از ایران است؟' : 'Is applying from Turkey faster than from Iran?',
          a: currentLang === 'fa'
            ? 'مراحل و مدارک یکسان است؛ آنچه فرق می‌کند ظرفیت نوبت‌دهی همان نمایندگی محلی است.'
            : 'The required steps are the same; what differs is that specific mission’s appointment capacity.'
        }
      ]} />

      <RelatedGuidesCard
        items={['immigration/igi-process', 'start-here/planning-to-come', 'company/residency']}
        currentLang={currentLang}
        onNavigate={onNavigate}
      />

      <p className="text-xs text-[#94a3b8] leading-relaxed border-t border-[#eef2f6] pt-4">
        {currentLang === 'fa'
          ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
          : 'This must be verified based on current regulations and individual circumstances.'}
      </p>

      <ParentHubFooterCard slugRoute="immigration/apply-from-turkey-europe" currentLang={currentLang} onNavigate={onNavigate} />
    </div>
  );
};
