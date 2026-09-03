'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';
import { RelatedGuidesCard } from './RelatedGuidesCard';
import { FaqSchema } from './FaqSchema';

interface ApplyFromUaeGulfContentProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
}

export const ApplyFromUaeGulfContent: React.FC<ApplyFromUaeGulfContentProps> = ({ currentLang, onNavigate }) => {
  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${currentLang === 'fa' ? 'text-right rtl' : 'text-left ltr'}`}>
      <Breadcrumb slugRoute="immigration/apply-from-uae-gulf" currentLang={currentLang} onNavigate={onNavigate} />

      {/* HERO PANEL */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/20 text-[#2F6FED] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/30">
          <span>🇦🇪 {currentLang === 'fa' ? 'راهنمای اقدام برای مقیمان امارات و حوزه خلیج فارس' : 'Guide for Applicants Residing in the UAE & the Gulf'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {currentLang === 'fa'
            ? 'اقدام از امارات و حوزه خلیج فارس'
            : 'Applying from the UAE & the Persian Gulf Region'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'اگر در امارات، قطر، عربستان، کویت، عمان یا بحرین اقامت دارید، محل ثبت درخواست ویزای نوع D و نمایندگی رسمی رومانی که باید با آن هماهنگ کنید، با ایران فرق دارد. اگر یک شرکت فعال در منطقه دارید، مسیر ثبت شعبه در رومانی هم نکات خاص خود را دارد که در ادامه توضیح داده‌ایم.'
            : 'If you are resident in the UAE, Qatar, Saudi Arabia, Kuwait, Oman, or Bahrain, the mission you coordinate your Type D visa with differs from Iran. If you already run an active company in the region, registering a Romanian branch also has its own specifics, covered below.'}
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

      {/* NEAREST MISSION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="font-extrabold text-lg text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
          <span>📍</span>
          <span>{currentLang === 'fa' ? 'نزدیک‌ترین نمایندگی رومانی' : 'Nearest Romanian Mission'}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'رومانی در امارات هم سفارت (ابوظبی) و هم سرکنسولگری (دبی) دارد، و در عربستان سعودی سفارت مجزا (ریاض) دارد. برای سایر کشورهای حوزهٔ خلیج فارس (قطر، کویت، عمان، بحرین)، حوزهٔ کاری دقیق هر نمایندگی می‌تواند تغییر کند — پیشنهاد می‌کنیم پیش از رزرو نوبت، مستقیماً با نزدیک‌ترین نمایندگی تماس بگیرید تا حوزهٔ فعلی آن را برای کشور محل اقامت خودتان تایید کنید.'
            : 'Romania maintains both an embassy (Abu Dhabi) and a Consulate General (Dubai) in the UAE, plus a separate embassy in Saudi Arabia (Riyadh). For the other Gulf states (Qatar, Kuwait, Oman, Bahrain), exact consular jurisdiction can shift — we recommend contacting the nearest mission directly before booking an appointment to confirm current coverage for your country of residence.'}
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
            ? 'ترتیب کلی مراحل — تایید مسیر در رومانی، سپس ویزای D نزد نمایندگی محل اقامت، سپس ورود و دریافت کارت اقامت نزد IGI — همان چیزی است که در راهنمای کامل IGI شرح داده‌ایم.'
            : 'The general order of steps — approving your pathway in Romania, then the D visa at your mission of residence, then arrival and the residence card from IGI — is the same sequence covered in our full IGI guide.'}
        </p>
        <Link href="/immigration/igi-process#pre-arrival-docs" className="inline-block text-sm font-bold text-[#2F6FED] hover:underline">
          {currentLang === 'fa' ? '← مشاهده راهنمای کامل مراحل IGI' : '→ See the full IGI process guide'}
        </Link>
      </div>

      {/* BRANCH / POA NUANCE — the section requested */}
      <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0] space-y-4">
        <h2 className="text-lg font-bold text-[#142033]">
          {currentLang === 'fa'
            ? 'اگر شرکت فعالی در منطقه دارید: ثبت شعبه در رومانی با وکالت'
            : 'If You Already Run an Active Company in the Region: Registering a Romanian Branch by Power of Attorney'}
        </h2>
        <p className="text-sm sm:text-base text-[#526174] leading-relaxed">
          {currentLang === 'fa'
            ? 'اگر در امارات یا سایر کشورهای منطقه یک شرکت فعال دارید، مرحلهٔ ثبت شرکت/شعبه (sucursală) در رومانی را می‌توان از طریق وکالتنامهٔ رسمی محضری، بدون سفر شما به رومانی، توسط یک وکیل یا مشاور حقوقی محلی در رومانی انجام داد. مدارک معمول لازم شامل اساسنامه و گواهی ثبت شرکت مادر، مصوبهٔ هیئت‌مدیره برای تاسیس شعبه، و ترجمهٔ رسمی و تاییدشدهٔ این مدارک به رومانیایی است.'
            : "If you have an active company in the UAE or elsewhere in the region, the Romanian registration step itself — a new SRL or a branch (sucursală) of your existing company — can be handled by a local Romanian lawyer or corporate agent under a notarized power of attorney, without you traveling to Romania for that step. Typically required documents include the parent company's articles of association and certificate of incorporation, a board resolution authorizing the branch, and certified Romanian translations of these documents."}
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-bold text-amber-900">
            {currentLang === 'fa' ? '⚠️ نکتهٔ مهم: ثبت شرکت با اقامت یکی نیست' : '⚠️ Important: Company Registration Is Not the Same as Residency'}
          </p>
          <p className="text-sm text-amber-900/90 leading-relaxed">
            {currentLang === 'fa'
              ? 'ثبت شرکت یا شعبه با وکالت فقط مرحلهٔ تاسیس کسب‌وکار را تسریع می‌کند و می‌تواند مبنای قانونی درخواست «اقامت از طریق ثبت شرکت» شما باشد؛ اما خودِ درخواست اقامت (ویزای نوع D و کارت اقامت IGI) یک مرحلهٔ جداست و طبق رویهٔ معمول همچنان به حضور فیزیکی شما برای مصاحبه/بیومتریک نزد نمایندگی رومانی و سپس سفر به رومانی برای دریافت کارت اقامت نیاز دارد. به بیان دیگر: وکالت سفر «ثبت شرکت» را حذف می‌کند، نه سفر «اقامت» را. ارقام دقیق سرمایه‌گذاری/شغل لازم برای این مسیر در صفحهٔ اقامت از طریق ثبت شرکت آمده است.'
              : "Registering the company or branch by power of attorney only speeds up the incorporation step and can serve as the legal basis for a 'residency via business' application; it does not replace the residency application itself. The visa D interview/biometrics and the IGI residence-card pickup generally still require your physical presence. In short: a power of attorney removes the incorporation trip, not the residency trip. The exact investment/job-creation thresholds for this pathway are covered on the residency via business page."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/company/registration" className="text-sm font-bold text-[#2F6FED] hover:underline">
            {currentLang === 'fa' ? '← ثبت شرکت (SRL)' : '→ Company registration (SRL)'}
          </Link>
          <Link href="/company/residency" className="text-sm font-bold text-[#2F6FED] hover:underline">
            {currentLang === 'fa' ? '← اقامت از طریق ثبت شرکت (ارقام دقیق)' : '→ Residency via business (exact thresholds)'}
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[#142033] border-b border-[#eef2f6] pb-2">
          {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-bold text-[#334155] mb-1.5 text-sm">
              {currentLang === 'fa' ? 'آیا با ثبت شعبه به‌تنهایی اقامت می‌گیرم؟' : 'Does registering a branch by itself grant me residency?'}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {currentLang === 'fa'
                ? 'خیر. ثبت شعبه یا شرکت مبنای قانونی لازم را فراهم می‌کند، اما اقامت از طریق درخواست جداگانهٔ ویزای نوع D و بررسی IGI صادر می‌شود، نه با خودِ ثبت شرکت.'
                : 'No. Registering the branch or company provides the necessary legal basis, but residency is granted through a separate Type D visa application and IGI review — not by the company registration itself.'}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#334155] mb-1.5 text-sm">
              {currentLang === 'fa' ? 'آیا برای درخواست ویزای D هم می‌توانم وکالت بدهم؟' : 'Can I also use a power of attorney for the visa D application itself?'}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {currentLang === 'fa'
                ? 'به‌طور معمول خیر — مرحلهٔ مصاحبه و ثبت بیومتریک ویزای نوع D نیازمند حضور شخص متقاضی است. وکالت معمولاً فقط برای مراحل شرکتی (نه خودِ ویزا) کاربرد دارد؛ این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
                : 'Typically no — the Type D visa interview and biometric enrollment step normally requires the applicant to appear in person. A power of attorney is generally usable for the company-formation steps, not the visa step itself; this must be verified based on current regulations and individual circumstances.'}
            </p>
          </div>
        </div>
      </div>

      <FaqSchema items={[
        {
          q: currentLang === 'fa' ? 'آیا با ثبت شعبه به‌تنهایی اقامت می‌گیرم؟' : 'Does registering a branch by itself grant me residency?',
          a: currentLang === 'fa'
            ? 'خیر. ثبت شعبه مبنای قانونی را فراهم می‌کند، اما اقامت با درخواست جداگانهٔ ویزای نوع D و بررسی IGI صادر می‌شود.'
            : 'No. Registering the branch provides the legal basis, but residency is granted through a separate Type D visa application and IGI review.'
        },
        {
          q: currentLang === 'fa' ? 'آیا برای درخواست ویزای D هم می‌توانم وکالت بدهم؟' : 'Can I also use a power of attorney for the visa D application itself?',
          a: currentLang === 'fa'
            ? 'به‌طور معمول خیر؛ مرحلهٔ مصاحبه و بیومتریک ویزای نوع D نیازمند حضور شخص متقاضی است.'
            : 'Typically no; the Type D visa interview and biometric step normally requires the applicant to appear in person.'
        }
      ]} />

      <RelatedGuidesCard
        items={['company/residency', 'company/registration', 'work/digital-nomad']}
        currentLang={currentLang}
        onNavigate={onNavigate}
      />

      <p className="text-xs text-[#94a3b8] leading-relaxed border-t border-[#eef2f6] pt-4">
        {currentLang === 'fa'
          ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
          : 'This must be verified based on current regulations and individual circumstances.'}
      </p>

      <ParentHubFooterCard slugRoute="immigration/apply-from-uae-gulf" currentLang={currentLang} onNavigate={onNavigate} />
    </div>
  );
};
