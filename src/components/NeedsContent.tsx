'use client';

import React, { useState } from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { Button } from './Button';
import { Landmark, House, FileCheck2, ShieldCheck, LockKeyhole, ExternalLink, ArrowRight, ArrowLeft } from './Icons';
import { BnrRatesFeed } from './BnrRatesFeed';
import { CommentsSection } from './CommentsSection';
import { HealthGuideContent } from './HealthGuideContent';
import { BankingGuideContent } from './BankingGuideContent';
import { SchoolGuideContent } from './SchoolGuideContent';
import { TelecomGuideContent } from './TelecomGuideContent';
import { Breadcrumb } from './Breadcrumb';
import { ParentHubFooterCard } from './ParentHubFooterCard';
import { OperationalGuideLayout } from './guide/OperationalGuideLayout';
import { SectionPhoto } from './SectionPhoto';
import { FaqSchema } from './FaqSchema';
import { drivingLicenseEN } from '../content/guides/driving-license/en';
import { drivingLicenseFA } from '../content/guides/driving-license/fa';
import { firstDaysChecklistEN } from '../content/guides/first-days-checklist/en';
import { firstDaysChecklistFA } from '../content/guides/first-days-checklist/fa';

interface NeedsContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const NeedsContent: React.FC<NeedsContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;
  const [housingTab, setHousingTab] = useState<'rent' | 'buy'>('rent');

  // SUB-ROUTE CONTENT ROUTING
  switch (subRoute) {

    // 0. NEEDS LANDING HUB
    case 'needs':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'نیازهای زندگی روزمره در رومانی' : 'Essentials in Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'نیازمندی‌ها و کارهای اداری ورود و استقرار' : 'Essentials & Settlement Guide'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای کارهای اداری، مالی، مسکن، خدمات درمانی، مدارس فرزندان، گواهینامه رانندگی و زندگی در رومانی.'
                : 'Your comprehensive directory for daily life, banking, renting, healthcare, schooling, and local compliance.'}
            </p>
          </div>

          <SectionPhoto
            src="/images/needs/needs-hub.jpg"
            alt={currentLang === 'fa' ? 'خیابان لیپسکانی در بخارست' : 'Lipscani Street in central Bucharest'}
            captionFa="خیابان لیپسکانی، بخارست — عکس: ویکیمدیا کامنز"
            captionEn="Lipscani Street, central Bucharest — Photo: Wikimedia Commons"
            currentLang={currentLang}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/needs/first-days-checklist" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">✓</span>
                  <span>{currentLang === 'fa' ? 'چک‌لیست روزهای نخست ورود' : 'First-Days Arrival Checklist'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'اقدامات حیاتی ۷۲ ساعت، ۷ روز و ۳۰ روز اول ورود به کشور رومانی.' : 'Essential tasks for your first 72 hours, 7 days, and 30 days.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/banking" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🏦</span>
                  <span>{currentLang === 'fa' ? 'افتتاح حساب بانکی' : 'Bank Account Opening'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'راهنمای بانک‌های اصلی (BCR, BT, BRD)، مدارک اقامت و نئوبانک‌ها.' : 'Guide to major banks (BCR, BT, BRD), residence permits, and neobanks.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/currency-exchange" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">💱</span>
                  <span>{currentLang === 'fa' ? 'صرافی و پرداخت‌ها' : 'Currency Exchange & Payments'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'نرخ‌های مرجع بانک ملی (BNR)، صرافی‌های معتبر و پرداخت روزمره.' : 'BNR rates, licensed exchange offices, and daily payments.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/housing" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🏠</span>
                  <span>{currentLang === 'fa' ? 'اجاره و خرید مسکن' : 'Renting & Buying Property'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'چک‌لیست قرارداد اجاره، ثبت در دارایی (ANAF)، ودیعه و مالکیت ملک.' : 'Rental contracts, security deposits, ANAF registration, and buying rules.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/driving-license" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🚗</span>
                  <span>{currentLang === 'fa' ? 'گواهینامه رانندگی' : 'Driving License'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'شرایط رانندگی با گواهینامه بین‌المللی و تبدیل آن در DGPCI.' : 'Rules for international driving permits and license exchange.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/certified-translation" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">📄</span>
                  <span>{currentLang === 'fa' ? 'دارالترجمه رسمی' : 'Certified Translation'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'ترجمه رسمی مدارک هویتی و تحصیلی به زبان رومانیایی توسط مترجمین مجاز.' : 'Authorized translations of academic and civil documents.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/romanian-language-courses" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🗣️</span>
                  <span>{currentLang === 'fa' ? 'آموزش زبان رومانیایی' : 'Romanian Language Courses'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'دوره‌های رایگان دولتی و IOM، و گزینه‌های خصوصی برای یادگیری زبان رومانیایی.' : 'Free government/IOM-backed courses and private options for learning Romanian.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/notary-public" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">⚖️</span>
                  <span>{currentLang === 'fa' ? 'دفتر اسناد رسمی' : 'Notary Public'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'ثبت اسناد رسمی، اساسنامه‌های شرکتی و وکالت‌نامه‌ها (Procura).' : 'Legalizing contracts, power of attorney, and corporate deeds.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/iranian-embassy-and-mikhak" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🏛️</span>
                  <span>{currentLang === 'fa' ? 'سفارت ایران و میخک' : 'Iranian Embassy & Mikhak'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'امور کنسولی، تایید مدرک تحصیلی و وکالت‌نامه‌ها از طریق سامانه میخک.' : 'Consular services, document authentication, and mikhak registry.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/health" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">❤️</span>
                  <span>{currentLang === 'fa' ? 'خدمات درمانی و سلامت' : 'Healthcare & Insurance'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'آشنایی با بیمه سلامت عمومی (CNAS)، پزشک خانواده و فوریت‌های پزشکی.' : 'National health insurance (CNAS), family doctors, and clinics.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/school" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🎓</span>
                  <span>{currentLang === 'fa' ? 'مدارس و سیستم آموزشی' : 'Schools & Education'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'سیستم مدارس دولتی رومانی و گزینه‌های مدارس بین‌المللی برای فرزندان.' : 'Public primary and secondary school systems and international schools.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/telecom" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">📱</span>
                  <span>{currentLang === 'fa' ? 'تلفن همراه و اینترنت' : 'Telecom & Connectivity'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'خرید سیم‌کارت‌های اعتباری و دائمی (Orange, Vodafone, Digi) و اینترنت خانگی.' : 'Orange, Vodafone, Digi mobile plans and high-speed fiber broadband.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>

            <Link href="/needs/transportation" className="editorial-card p-6 bg-white space-y-3 hover:border-[#2F6FED] transition-all cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F6FED] flex items-center justify-center">🚌</span>
                  <span>{currentLang === 'fa' ? 'حمل‌ونقل عمومی و بین‌شهری' : 'Public Transportation'}</span>
                </h4>
                <p className="text-xs text-[#526174] leading-relaxed mt-2">{currentLang === 'fa' ? 'فرودگاه تا شهر، مترو و اتوبوس شهری، قطار و اتوبوس بین‌شهری.' : 'Airport to city, city metro/bus, and intercity train & coach.'}</p>
              </div>
              <span className="text-xs font-bold text-[#2F6FED] inline-flex items-center space-x-1 rtl:space-x-reverse pt-4">{currentLang === 'fa' ? 'مطالعه بیشتر' : 'Read More'} <ArrowIcon size={12} className="rtl:mr-1 ltr:ml-1" /></span>
            </Link>
          </div>
        </div>
      );

    case 'banking':
      return <BankingGuideContent currentLang={currentLang} onNavigate={onNavigate} />;

    case 'health':
      return <HealthGuideContent currentLang={currentLang} onNavigate={onNavigate} />;

    case 'school':
      return <SchoolGuideContent currentLang={currentLang} onNavigate={onNavigate} />;

    case 'telecom':
      return <TelecomGuideContent currentLang={currentLang} onNavigate={onNavigate} />;

    case 'currency-exchange':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'نیازهای ضروری در رومانی' : 'Essentials in Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'صرافی، تبدیل پول و پرداخت‌ها' : 'Currency Exchange & Payments'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای نرخ‌های مرجع بانک ملی رومانی (BNR)، تفکیک بانک‌ها و صرافی‌های مجاز، و انتقال قانونی پول.'
                : 'Guide to BNR reference rates, licensed banks vs exchange offices, and legal funds transfers.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: بانک ملی رومانی (BNR) — bnr.ro — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: National Bank of Romania (BNR) — bnr.ro — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'مدیریت تبدیل ارز و پرداخت‌های روزمره در رومانی، در صورت آشنایی با سیستم محلی، بسیار ساده است. ارز رسمی این کشور لئوی رومانی (RON) است؛ اگرچه برای معاملات کلان مانند خرید ملک یا خودرو ممکن است یورو استفاده شود، اما تمام خریدهای روزمره باید با RON انجام شود. بانک ملی رومانی (BNR) روزانه نرخ‌های مرجع را اعلام می‌کند که به‌عنوان معیار اصلی شناخته می‌شود. برای جلوگیری از پرداخت کارمزدهای پنهان و نرخ‌های نامناسب، توصیه می‌شود منحصراً از بانک‌های معتبر یا دفاتر تبدیل ارز یا صرافی‌های مجاز (Case de Schimb Valutar) استفاده کنید که به‌وضوح عبارت "بدون کارمزد" (0% Comision) را درج کرده‌اند.'
              : 'Navigating currency exchange and everyday payments in Romania is straightforward once you understand the local system. The official currency is the Romanian Leu (RON), and while euros are widely accepted for large transactions like real estate or car purchases, daily expenses are strictly handled in RON. The National Bank of Romania (BNR) sets the official daily reference rates, which serve as a benchmark. To avoid hidden fees and unfavorable rates, it is highly recommended to use licensed commercial banks or authorized exchange offices (Case de Schimb Valutar) that explicitly display "0% Comision".'}
          </div>

          <BnrRatesFeed currentLang={currentLang} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
              <h4 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'مقایسه صرافی‌ها و بانک‌ها' : 'Banks vs Exchange Offices'}</h4>
              <p className="text-sm text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'بانک‌های معتبر رومانی (Banca Transilvania, BCR, BRD) امن‌ترین گزینه برای مبالغ بالا هستند. در صرافی‌های شهری همیشه تابلو بدون کارمزد (Comision 0%) و ارائه رسید رسمی با گذرنامه را چک کنید.'
                  : 'Commercial banks provide maximum security for high-value transfers. Always verify zero commission boards and demand official receipts.'}
              </p>
            </div>

            <div className="editorial-card p-6 bg-white space-y-3 border border-[#dfe6ef]">
              <h4 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'هشدار کلاهبرداری ارز' : 'Currency Fraud Prevention'}</h4>
              <p className="text-sm text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'هیچ‌گاه پول یا مدارک بانکی خود را در اختیار افراد یا صرافی‌های فاقد هویت و مجوز رسمی قرار ندهید. کلیه پرداخت‌های اجاره مسکن باید همراه با رسید بانکی ثبت شوند.'
                  : 'Never transfer funds through unlicensed informal dealers. All rental deposits must be accompanied by verifiable bank transfers.'}
              </p>
            </div>
          </div>

          <div className="editorial-card p-6 sm:p-8 bg-white space-y-4 border border-amber-200 bg-amber-50/40">
            <h3 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>⚠️</span>
              <span>{currentLang === 'fa' ? 'چالش ویژه: انتقال پول از/به ایران زیر سایه تحریم‌ها' : 'The Iran-Specific Challenge: Moving Money Under Sanctions'}</span>
            </h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'این بخشی است که در راهنماهای عمومی رومانی معمولاً دیده نمی‌شود، اما برای شهروندان ایرانی اهمیت عملی زیادی دارد. سیستم بانکی ایران از نوامبر ۲۰۱۸ از شبکه سوئیفت (SWIFT) قطع است، و در ۲۹ سپتامبر ۲۰۲۵ اتحادیه اروپا پس از فعال‌سازی مکانیزم «بازگشت تحریم‌ها» (Snapback) توسط شورای امنیت سازمان ملل، تحریم‌های مالی علیه نهادهای بانکی ایران را به‌طور کامل احیا کرد (مقررات EU 2025/1975). این تحریم‌ها عمدتاً بانک‌ها و نهادهای ایرانی را هدف می‌گیرند، نه لزوماً شهروندان عادی ایرانی مقیم اتحادیه اروپا؛ حواله‌های شخصی زیر حدود ۱۰,۰۰۰ یورو معمولاً از این محدودیت‌ها معاف هستند. با این حال، در عمل این وضعیت باعث شده سرویس‌های محبوب انتقال پول بین‌المللی مانند Western Union، Wise و Remitly قادر به پردازش مستقیم حواله به/از ایران نباشند (چون این شرکت‌ها تحت مقررات آمریکا فعالیت می‌کنند و مجوز صادراتی OFAC ندارند)؛ راهکار رایج، انتقال از طریق یک حساب یا صرافی در یک کشور ثالث (مانند ترکیه یا امارات) است.'
                : 'This is a gap most general Romania guides miss, but it matters in practice for Iranian nationals. Iran\'s banking system has been disconnected from SWIFT since November 2018, and on September 29, 2025 the EU fully reimposed financial sanctions on Iranian banking institutions after the UN Security Council\'s "snapback" mechanism was triggered (EU Regulation 2025/1975). These measures mainly target Iranian banks and institutions, not individual Iranian nationals resident in the EU personally — personal remittances under roughly €10,000 are generally exempt. In practice, however, this means popular transfer services like Western Union, Wise, and Remitly cannot process direct transfers to/from Iran (they operate under US regulation and lack an OFAC export license); the common workaround is routing through an account or exchange bureau in a third country such as Turkey or the UAE.'}
            </p>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'نکته دیگر: صرافی‌های ایرانی سبک «حواله» که در شهرهایی مانند لندن، فرانکفورت، هامبورگ، استکهلم و اسلو فعالیت می‌کنند و وجه را با تطبیق سفارش‌های خرید/فروش بین دو طرف (بدون عبور واقعی پول از مرز) جابه‌جا می‌کنند، تا زمان تهیه این راهنما هیچ نمونه شناخته‌شده و مستندی در رومانی برای‌مان پیدا نشد — اگر به چنین خدماتی نیاز دارید، نزدیک‌ترین مراکز شناخته‌شده این نوع صرافی آلمان، بریتانیا و کشورهای اسکاندیناوی هستند. درباره استفاده از رمزارز (مانند تتر/USDT) به‌عنوان جایگزین هم هشیار باشید: در آگوست ۲۰۲۶ وزارت خزانه‌داری آمریکا (OFAC) دو صرافی مرتبط با ایران (Shelbit و Aban Tether) را به‌دلیل تراکنش با صرافی‌های داخلی ایران (نوبیتکس، والکس، بیت‌پین، رمزینکس) تحریم کرد، و در ژوئیه ۲۰۲۶ شرکت Tether حدود ۱۳۱ میلیون دلار دارایی USDT مرتبط با بانک مرکزی ایران را مسدود کرد. نتیجه عملی: تتری که سابقه تراکنش آن به یک صرافی ایرانی برسد، حتی بدون اینکه شخص شما تحریم باشید، ممکن است هنگام تبدیل در صرافی مقصد مسدود یا رد شود — این راهنما به‌عمد هیچ صرافی خاصی را توصیه نمی‌کند چون این مقررات به‌سرعت در حال تغییرند.'
                : 'Also worth knowing: Iranian "hawala-style" exchange bureaus operating in cities like London, Frankfurt, Hamburg, Stockholm, and Oslo move funds by matching buy/sell orders between two parties (without money physically crossing the border) — as of this writing we could not find a documented example of this kind of service in Romania itself; if you need it, the nearest known hubs are Germany, the UK, and the Nordic countries. Be cautious about crypto (e.g. USDT) as a workaround too: in August 2026, the US Treasury (OFAC) sanctioned two Iran-linked exchanges (Shelbit and Aban Tether) over transactions with Iranian domestic exchanges (Nobitex, Wallex, Bitpin, Ramzinex), and in July 2026 Tether froze roughly $131 million in USDT linked to Iran\'s central bank. The practical effect: USDT with a transaction history tracing to an Iranian exchange can be frozen or rejected at the receiving exchange even if you personally are not sanctioned — this guide deliberately does not recommend a specific platform, since the rules here are shifting quickly.'}
            </p>
            <div className="p-4 bg-white border border-amber-200 rounded-xl text-xs text-[#142033]">
              {currentLang === 'fa'
                ? '💶 یادآوری قانونی مهم: طبق مقررات اتحادیه اروپا، ورود یا خروج نقدینگی به ارزش ۱۰,۰۰۰ یورو یا بیشتر از مرزهای خارجی اتحادیه اروپا (از جمله فرودگاه‌های رومانی) باید اظهار شود. در رومانی عدم اظهار جریمه‌ای بین ۳,۰۰۰ تا ۵۰,۰۰۰ لئو (حداکثر ۶۰٪ مبلغ اظهارنشده) دارد؛ برخلاف قوانین قبلی، پول دیگر به‌طور خودکار ضبط نمی‌شود (تصمیم HG 1.184/2021). عضویت رومانی در شینگن برای مرزهای زمینی (از ۱ ژانویه ۲۰۲۵) این آستانه را تغییر نمی‌دهد چون قانون مربوط به مرز خارجی اتحادیه اروپاست، یعنی جایی که پول برای اولین بار وارد فضای شینگن می‌شود.'
                : '💶 Important legal reminder: under EU rules, entering or leaving the EU\'s external border (including Romanian airports) with €10,000 or more in cash must be declared. In Romania, failing to declare carries a fine of 3,000–50,000 RON (capped at 60% of the undeclared amount); unlike older rules, cash is no longer automatically confiscated (Government Decision HG 1.184/2021). Romania joining Schengen at land borders (since January 1, 2025) does not change this threshold, since the rule applies at the EU\'s external border — wherever the cash first enters the Schengen area.'}
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'همراه داشتن یورو بهتر است یا دلار آمریکا؟' : 'Should I bring euros or US dollars?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'یورو (Euro) بسیار ارجحیت دارد؛ بهترین نرخ‌های تبدیل و کمترین حاشیه ضرر در رومانی به یورو اختصاص دارد.' : 'Euros are highly preferred and offer the best exchange rates and lowest spreads locally compared to US dollars.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم از Revolut یا Wise در رومانی استفاده کنم؟' : 'Can I use Revolut or Wise in Romania?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، این نئوبانک‌ها در رومانی بسیار محبوب هستند و نرخ تبدیل بسیار خوبی برای مصارف روزمره ارائه می‌دهند.' : 'Yes, these digital banks are extremely popular in Romania and offer excellent exchange rates for daily use.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا صرافی ایرانی (سبک حواله) در رومانی وجود دارد؟' : 'Is there an Iranian-style hawala exchange bureau in Romania?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'در تحقیق ما نمونه مستند و شناخته‌شده‌ای در رومانی پیدا نشد؛ نزدیک‌ترین مراکز شناخته‌شده این نوع خدمات در آلمان، بریتانیا و کشورهای اسکاندیناوی فعال‌اند.' : 'Our research did not find a documented, known example in Romania; the nearest known hubs for this kind of service are in Germany, the UK, and the Nordic countries.'}</p>
              </div>
            </div>
          </div>

          <FaqSchema items={[
            {
              q: currentLang === 'fa' ? 'همراه داشتن یورو بهتر است یا دلار آمریکا؟' : 'Should I bring euros or US dollars?',
              a: currentLang === 'fa' ? 'یورو (Euro) بسیار ارجحیت دارد؛ بهترین نرخ‌های تبدیل و کمترین حاشیه ضرر در رومانی به یورو اختصاص دارد.' : 'Euros are highly preferred and offer the best exchange rates and lowest spreads locally compared to US dollars.'
            },
            {
              q: currentLang === 'fa' ? 'آیا می‌توانم از Revolut یا Wise در رومانی استفاده کنم؟' : 'Can I use Revolut or Wise in Romania?',
              a: currentLang === 'fa' ? 'بله، این نئوبانک‌ها در رومانی بسیار محبوب هستند و نرخ تبدیل بسیار خوبی برای مصارف روزمره ارائه می‌دهند.' : 'Yes, these digital banks are extremely popular in Romania and offer excellent exchange rates for daily use.'
            },
            {
              q: currentLang === 'fa' ? 'آیا صرافی ایرانی (سبک حواله) در رومانی وجود دارد؟' : 'Is there an Iranian-style hawala exchange bureau in Romania?',
              a: currentLang === 'fa' ? 'در تحقیق ما نمونه مستند و شناخته‌شده‌ای در رومانی پیدا نشد؛ نزدیک‌ترین مراکز شناخته‌شده این نوع خدمات در آلمان، بریتانیا و کشورهای اسکاندیناوی فعال‌اند.' : 'Our research did not find a documented, known example in Romania; the nearest known hubs for this kind of service are in Germany, the UK, and the Nordic countries.'
            }
          ]} />
        </div>
      );

    // 2. DRIVING LICENSE
    case 'driving-license': {
      const guideData = currentLang === 'fa' ? drivingLicenseFA : drivingLicenseEN;
      const translations = currentLang === 'fa' ? {
        tocTitle: 'فهرست محتوای این راهنما',
        quickOverview: 'پاسخ سریع: ',
        appliesTo: 'این بخش برای چه کسانی است؟',
        exceptionsTitle: 'استثنائات و محدودیت‌ها',
        documentsTitle: 'مدارک مورد نیاز',
        stepsTitle: 'مراحل انجام کار',
        feesTitle: 'هزینه‌های مربوطه',
        timelinesTitle: 'زمان‌بندی فرآیند',
        amountHeader: 'مبلغ',
        notesHeader: 'توضیحات',
        durationHeader: 'مدت زمان',
        authorityTitle: 'مرجع مسئول',
        actionLabel: 'پورتال رسمی اقدام',
        warningsTitle: 'هشدارهای مهم',
        sourcesTitle: 'منابع رسمی استناد شده',
        accessedOn: 'تاریخ دسترسی',
        lastReviewed: 'آخرین بازبینی',
        statusLabel: 'وضعیت محتوا',
        factCheckLabel: 'وضعیت راستی‌آزمایی',
        smeReviewLabel: 'بازبینی تخصصی/حقوقی',
        statusDraft: 'پیشنویس',
        statusPublished: 'منتشر شده',
        factCheckVerified: 'تایید شده',
        factCheckPartially: 'بخشی تأیید شده',
        smeReviewPending: 'در انتظار بررسی',
        smeReviewApproved: 'تایید شده'
      } : {
        tocTitle: 'Table of Contents',
        quickOverview: 'Quick Overview: ',
        appliesTo: 'Who this applies to',
        exceptionsTitle: 'Exceptions & Limitations',
        documentsTitle: 'Required Documents',
        stepsTitle: 'Step-by-Step Process',
        feesTitle: 'Applicable Fees',
        timelinesTitle: 'Process Timelines',
        amountHeader: 'Amount',
        notesHeader: 'Notes',
        durationHeader: 'Duration',
        authorityTitle: 'Responsible Authority',
        actionLabel: 'Official Action Portal',
        warningsTitle: 'Important Warnings',
        sourcesTitle: 'Official Sources Cited',
        accessedOn: 'Accessed on',
        lastReviewed: 'Last Reviewed',
        statusLabel: 'Content status',
        factCheckLabel: 'Fact-check status',
        smeReviewLabel: 'SME/legal review',
        statusDraft: 'Draft',
        statusPublished: 'Published',
        factCheckVerified: 'Verified',
        factCheckPartially: 'Partially verified',
        smeReviewPending: 'Pending',
        smeReviewApproved: 'Approved'
      };

      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="needs/driving-license" currentLang={currentLang} onNavigate={onNavigate} />
          <OperationalGuideLayout guide={guideData} translations={translations} />
          <ParentHubFooterCard
            currentLang={currentLang}
            slugRoute="needs/driving-license"
            onNavigate={onNavigate}
          />
          <CommentsSection pagePath={`needs/${subRoute}`} currentLang={currentLang} />
        </div>
      );
    }

    // 3. CERTIFIED TRANSLATION
    case 'certified-translation':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="needs/certified-translation" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ترجمه رسمی و مترجمین مجاز' : 'Certified Translation'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'معرفی مترجمین مجاز دادگستری (Traducator Autorizat) و تاییدیه دفاتر اسناد رسمی.'
                : 'Ministry of Justice authorized translators and notarization steps.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: وزارت دادگستری رومانی (just.ro)، اتحادیه ملی نوتاری‌های رومانی (UNNPR) — uniuneanotarilor.ro — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: Romanian Ministry of Justice (just.ro), National Union of Romanian Public Notaries (UNNPR) — uniuneanotarilor.ro — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'در رومانی، ترجمه اسناد رسمی و قانونی یک حرفه به‌شدت تحت نظارت است. چه برای پذیرش دانشگاه به ترجمه مدارک تحصیلی نیاز داشته باشید، چه برای اداره مهاجرت نیازمند ارائه شناسنامه باشید، فقط باید به سراغ مترجمین رسمی و دارای مجوز از وزارت دادگستری رومانی (Traducator Autorizat) بروید. علاوه بر مهر و تاییدیه مترجم، بسیاری از نهادهای دولتی (مانند IGI) از شما می‌خواهند که امضای مترجم در دفتر اسناد رسمی (Notar Public) تصدیق و تأیید شود، که به این نوع مدارک «ترجمه محضری» (Traducere Legalizata) می‌گویند.'
              : 'In Romania, the translation of official documents is a highly regulated profession. Whether you are translating diplomas for university admission, birth certificates for immigration, or contracts for your business, you must use a translator explicitly authorized by the Romanian Ministry of Justice (Traducator Autorizat). For documents to be legally recognized by state institutions like IGI or ANAF, the translation often needs to be not simply certified by the translator, but also legalized by a Notary Public (Traducere Legalizata) who verifies the translator\'s signature.'}
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <h3 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'تفاوت انواع ترجمه مدارک' : 'Types of Legal Document Translation'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">Traducere Autorizata</span>
                <p className="text-[#526174]">ترجمه توسط مترجم دارای پروانه رسمی از وزارت دادگستری رومانی همراه با مهر و شماره مجوز.</p>
              </div>
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">Traducere Legalizata</span>
                <p className="text-[#526174]">ترجمه مجاز که امضای مترجم توسط دفتر اسناد رسمی (Notar Public) در رومانی تایید شده است.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <a href="https://just.ro" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" rightIcon={<ExternalLink size={14} />}>
                  {currentLang === 'fa' ? 'جستجوی مترجم مجاز دادگستری' : 'Ministry of Justice Translator Search'}
                </Button>
              </a>
            </div>
          </div>

          <div className="editorial-card p-6 sm:p-8 bg-white space-y-4 border border-amber-200 bg-amber-50/40">
            <h3 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🇮🇷</span>
              <span>{currentLang === 'fa' ? 'ویژه ایرانیان: ترجمه فارسی-رومانیایی نایاب است' : 'Iran-Specific: Persian-Romanian Translation Is Rare'}</span>
            </h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'برخلاف زبان‌های پرکاربردی مانند انگلیسی یا فرانسوی که ده‌ها مترجم مجاز دارند، فارسی یک زبان کاملاً کمیاب در فهرست مترجمین رسمی رومانی است. بررسی چند فهرست عمومی مترجمین (که فهرست رسمی و کامل وزارت دادگستری نیست) تنها یک تا دو نام برای کل کشور نشان داد — از جمله مترجمی در بخارست. به همین دلیل، برخلاف زبان‌های رایج که نرخ ثابت حدود ۱۵ تا ۳۵ لِی به‌ازای هر صفحه دارند، برای فارسی هیچ دفتر ترجمه‌ای نرخ ثابتی اعلام نمی‌کند — انتظار داشته باشید که استعلام قیمت اختصاصی بگیرید و معمولاً هزینه بالاتری نسبت به زبان‌های رایج پرداخت کنید. توصیه می‌شود در صورت امکان، زودتر (پیش از نیاز فوری) با یک مترجم تماس بگیرید، چون تعداد گزینه‌ها محدود است.'
                : 'Unlike widely-used languages such as English or French, which have dozens of authorized translators, Persian is a genuinely scarce language pair in Romania\'s official translator registry. Checking several public translator directories (not the complete official Ministry of Justice list) turned up only one or two names for the entire country — including one based in Bucharest. As a result, unlike common languages that publish baseline rates around 15–35 RON per page, no bureau we found lists a fixed Persian rate — expect to request a custom quote, typically at a premium over common-language pricing. It\'s worth reaching out to a translator well before you actually need the documents, since the pool of options is small.'}
            </p>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'نکته حقوقی مهم دیگر: ایران عضو کنوانسیون آپوستیل لاهه نیست. بنابراین مدارک ایرانی (شناسنامه، سند ازدواج، دیپلم و غیره) با آپوستیل ساده قابل قبول نیستند و باید مسیر «تصدیق کنسولی» را طی کنند. بر اساس الگوی استاندارد مستندشده برای مدارک خروجی از ایران، این مسیر معمولاً شامل ترجمه رسمی و تاییدیه دادگستری در ایران، سپس تاییدیه وزارت امور خارجه ایران، و در نهایت تصدیق سفارت رومانی در تهران است؛ پس از آن، مدرک در رومانی نیازمند ترجمه رسمی به زبان رومانیایی و تصدیق امضای مترجم نزد دفتر اسناد رسمی (Notar Public) خواهد بود. این زنجیره کلی برای مدارک ایرانی است، اما اکیداً توصیه می‌شود پیش از اقدام، جزئیات دقیق و فعلی را مستقیماً از سفارت رومانی در تهران استعلام بگیرید، چون این نوع رویه‌ها می‌توانند تغییر کنند.'
                : 'Another important legal point: Iran is not a member of the Hague Apostille Convention. This means Iranian civil documents (birth certificates, marriage certificates, diplomas, etc.) cannot simply be apostilled — they require the "consular legalization" route instead. Based on the standard documented pattern for documents leaving Iran, this typically involves an official translation and Ministry of Justice (Dadgostari) attestation in Iran, then Iranian Ministry of Foreign Affairs attestation, and finally legalization by the Romanian Embassy in Tehran; the document then needs a certified Romanian translation and notarization of the translator\'s signature once in Romania. This is the general chain for Iranian documents, but we strongly recommend confirming the exact, current requirements directly with the Romanian Embassy in Tehran before you begin, since these procedures can change.'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم از ترجمه‌های رسمی کشور خودم در رومانی استفاده کنم؟' : 'Can I use translations done in my home country?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'ادارات دولتی رومانی غالباً ترجیح می‌دهند ترجمه‌ها توسط مترجمین مجاز داخلی انجام شود؛ ترجمه‌های خارجی معمولاً نیازمند مهر آپوستیل یا تایید سفارت رومانی هستند تا معتبر شناخته شوند.' : 'Generally, Romanian authorities prefer translations done locally by Romanian-authorized translators, though embassy-legalized translations may be accepted in some cases.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چگونه یک مترجم مجاز زبان خودم را پیدا کنم؟' : 'Where can I find an authorized translator?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'شما می‌توانید در وب‌سایت وزارت دادگستری رومانی جستجو کنید یا به دفاتر اسناد رسمی (Notar Public) مراجعه نمایید که معمولاً با شبکه‌ای از مترجمین معتبر همکاری دارند.' : 'You can search the official registry on the Ministry of Justice website or visit local notary offices, which often have authorized translators on call.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چرا مترجم فارسی پیدا کردن این‌قدر سخت است؟' : 'Why is finding a Persian translator so hard?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'فارسی در مقایسه با زبان‌های اروپایی رایج، تقاضای بسیار کمتری در رومانی دارد؛ در نتیجه تعداد مترجمین مجاز دادگستری برای این زبان بسیار محدود است. جستجوی زودهنگام و تماس مستقیم با دفاتر اسناد رسمی توصیه می‌شود.' : 'Persian has far lower demand in Romania than common European languages, so the pool of Ministry-of-Justice-authorized translators for it is very small. Search early and consider contacting notary offices directly, as they often work with an authorized translator network.'}</p>
              </div>
            </div>
          </div>

          <FaqSchema items={[
            {
              q: currentLang === 'fa' ? 'آیا می‌توانم از ترجمه‌های رسمی کشور خودم در رومانی استفاده کنم؟' : 'Can I use translations done in my home country?',
              a: currentLang === 'fa' ? 'ادارات دولتی رومانی غالباً ترجیح می‌دهند ترجمه‌ها توسط مترجمین مجاز داخلی انجام شود؛ ترجمه‌های خارجی معمولاً نیازمند مهر آپوستیل یا تایید سفارت رومانی هستند تا معتبر شناخته شوند.' : 'Generally, Romanian authorities prefer translations done locally by Romanian-authorized translators, though embassy-legalized translations may be accepted in some cases.'
            },
            {
              q: currentLang === 'fa' ? 'چگونه یک مترجم مجاز زبان خودم را پیدا کنم؟' : 'Where can I find an authorized translator?',
              a: currentLang === 'fa' ? 'شما می‌توانید در وب‌سایت وزارت دادگستری رومانی جستجو کنید یا به دفاتر اسناد رسمی (Notar Public) مراجعه نمایید که معمولاً با شبکه‌ای از مترجمین معتبر همکاری دارند.' : 'You can search the official registry on the Ministry of Justice website or visit local notary offices, which often have authorized translators on call.'
            },
            {
              q: currentLang === 'fa' ? 'چرا مترجم فارسی پیدا کردن این‌قدر سخت است؟' : 'Why is finding a Persian translator so hard?',
              a: currentLang === 'fa' ? 'فارسی در مقایسه با زبان‌های اروپایی رایج، تقاضای بسیار کمتری در رومانی دارد؛ در نتیجه تعداد مترجمین مجاز دادگستری برای این زبان بسیار محدود است. جستجوی زودهنگام و تماس مستقیم با دفاتر اسناد رسمی توصیه می‌شود.' : 'Persian has far lower demand in Romania than common European languages, so the pool of Ministry-of-Justice-authorized translators for it is very small. Search early and consider contacting notary offices directly, as they often work with an authorized translator network.'
            }
          ]} />

          <ParentHubFooterCard slugRoute="needs/certified-translation" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    case 'romanian-language-courses':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="needs/romanian-language-courses" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'آموزش زبان رومانیایی' : 'Romanian Language Courses'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'برنامه‌های رایگان دولتی و بین‌المللی، و گزینه‌های آموزشی خصوصی برای یادگیری زبان رومانیایی در رومانی.'
                : 'Free government and international programs, plus private course options for learning Romanian.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منابع: اداره کل مهاجرت رومانی (IGI)، سازمان بین‌المللی مهاجرت (IOM Romania)، مؤسسه فرهنگی رومانی (ICR) — آخرین بررسی: شهریور ۱۴۰۵ / سپتامبر ۲۰۲۶'
                : 'Sources: Romanian General Inspectorate for Immigration (IGI), IOM Romania, Romanian Cultural Institute (ICR) — Last reviewed: September 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'دانستن زبان رومانیایی برای پیدا کردن کار، مراجعه به ادارات دولتی و ادغام روزمره در رومانی بسیار کمک‌کننده است. خبر خوب این است که اگر مجوز اقامت معتبر رومانی دارید، معمولاً به یک یا چند برنامهٔ رایگان دسترسی دارید که هم توسط دولت رومانی و هم از طریق سازمان بین‌المللی مهاجرت (IOM) و شرکای اجرایی‌اش تأمین مالی می‌شوند. علاوه بر این، گزینه‌های آموزشی خصوصی و ساختاریافته‌تر (پولی) نیز برای کسانی که به برنامهٔ فشرده‌تر یا مدرک رسمی سطح زبان نیاز دارند، وجود دارد.'
              : 'Speaking Romanian makes a real difference for finding work, dealing with government offices, and everyday integration in Romania. The good news: if you hold a valid Romanian residence permit, you typically have access to one or more free programs, funded both by the Romanian state and by the International Organization for Migration (IOM) and its implementing partners. Structured private course options (paid) also exist for those who want a faster track or a formal proficiency certificate.'}
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <h3 className="font-extrabold text-base text-[#142033]">
              {currentLang === 'fa' ? 'برنامهٔ رسمی ادغام اجتماعی اتباع خارجی (رایگان) — اداره کل مهاجرت (IGI)' : 'Official Social Integration Program (Free) — General Inspectorate for Immigration (IGI)'}
            </h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'اداره کل مهاجرت رومانی (IGI) به‌همراه وزارت آموزش رومانی، برای «اتباع خارجی که حق اقامت در رومانی کسب کرده‌اند» (و نیز شهروندان اتحادیه اروپا/EEA/سوئیس) برنامهٔ ادغام اجتماعی برگزار می‌کند که شامل دوره‌های زبان رومانیایی، جلسات آشناسازی فرهنگی با آداب و سنن رومانیایی، و مشاوره است. در پایان دوره، گواهی سطح زبان صادر می‌شود.'
                : 'IGI, in collaboration with Romania\'s Ministry of Education, runs a social integration program for "foreigners who have acquired a right of residence in Romania" (as well as EU/EEA/Swiss citizens). It includes Romanian language courses, cultural-accommodation sessions on Romanian traditions and customs, and counseling. A language-level certificate is issued on completion.'}
            </p>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'توجه: این برنامهٔ عمومی را با یک برنامهٔ جداگانه و محدودتر IGI که مخصوص پناهندگان/دارندگان حمایت فرعی است و مهلت ثبت‌نام ۹۰ روزه دارد اشتباه نگیرید — آن برنامه شرایط متفاوتی دارد.'
                : 'Note: don\'t confuse this general program with a separate, narrower IGI program specifically for refugees/subsidiary-protection holders, which has a strict 90-day enrollment deadline — that program has different conditions.'}
            </p>
            <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] text-sm text-[#526174]">
              {currentLang === 'fa' ? 'آدرس: بخارست، خیابان Lt. Col. Marinescu C-tin، پلاک ۱۵A، بخش ۵ (Sector 5)' : 'Address: Bucharest, str. Lt. Col. Marinescu C-tin, nr. 15A, Sector 5'}
            </div>
            <div className="pt-2 flex justify-end">
              <a href="https://igi.mai.gov.ro/en/the-program-of-social-integration-of-foreigners-who-have-a-right-to-stay-in-romania/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" rightIcon={<ExternalLink size={14} />}>
                  {currentLang === 'fa' ? 'صفحهٔ رسمی برنامه IGI' : 'Official IGI Program Page'}
                </Button>
              </a>
            </div>
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <h3 className="font-extrabold text-base text-[#142033]">
              {currentLang === 'fa' ? 'دوره‌های رایگان با تأمین مالی IOM — از طریق مراکز ادغام منطقه‌ای' : 'IOM-Funded Free Courses — via Regional Integration Centers'}
            </h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'سازمان بین‌المللی مهاجرت (IOM Romania) دوره‌های زبان رومانیایی و آشناسازی فرهنگی رایگان را برای «دارندگان حمایت بین‌المللی» (BPI) و «اتباع کشورهای ثالث دارای اقامت قانونی» (RTT) — از طریق مراکز ادغام منطقه‌ای (CRI) و شرکای اجرایی محلی تأمین مالی می‌کند. در بخارست: Fundația Schottener Servicii Sociale مسئول رسیدگی به افراد زیر ۲۶ سال است، و AIDRom (Asociația Ecumenică a Bisericilor din România) مسئول بزرگسالان بالای ۲۶ سال — یعنی گزینهٔ اصلی برای اکثر مهاجران بزرگسال ایرانی.'
                : 'IOM Romania funds free Romanian language and cultural-orientation courses for "beneficiaries of international protection" (BPI) and "third-country nationals with legal residence" (TCN/RTT), delivered through Regional Integration Centers (CRI) and local implementing partners. In Bucharest: Fundația Schottener Servicii Sociale handles people under 26, and AIDRom (Asociația Ecumenică a Bisericilor din România) handles adults over 26 — the main option for most adult Iranian migrants.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">AIDRom {currentLang === 'fa' ? '(بزرگسالان بالای ۲۶ سال)' : '(adults over 26)'}</span>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'آدرس: بخارست، خیابان Ilarie Chendi، پلاک ۱۴، بخش ۲' : 'Address: Bucharest, Strada Ilarie Chendi, nr. 14, Sector 2'}</p>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'تلفن: ۴۸.۲۱۲.۴۸ ۰۲۱ ۴+ — ایمیل: aidrom@gmail.com' : 'Phone: +4 021 212 48 68 — Email: aidrom@gmail.com'}</p>
              </div>
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">Fundația Schottener {currentLang === 'fa' ? '(زیر ۲۶ سال)' : '(under 26)'}</span>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'تلفن: ۱۱۵-۹۱۴ ۳۷۴ ۴۰+ — ایمیل: info@fundatia-schottener.eu' : 'Phone: +40 374 914-115 — Email: info@fundatia-schottener.eu'}</p>
              </div>
            </div>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'برای شروع، می‌توانید همچنین با یکی از ۸ «مرکز منابع مهاجرین» IOM در سراسر رومانی (از جمله بخارست، براشوف و کلوژ-ناپوکا) تماس بگیرید — همهٔ خدمات این مراکز رایگان است.'
                : 'As a starting point, you can also contact one of IOM\'s 8 Migrant Resource Centres across Romania (including Bucharest, Brașov, and Cluj-Napoca) — all services at these centres are free.'}
            </p>
            <div className="pt-2 flex justify-end">
              <a href="https://romania.iom.int/migrant-resource-centres" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" rightIcon={<ExternalLink size={14} />}>
                  {currentLang === 'fa' ? 'مراکز منابع مهاجرین IOM' : 'IOM Migrant Resource Centres'}
                </Button>
              </a>
            </div>
          </div>

          <div className="editorial-card p-6 sm:p-8 bg-white space-y-3 border border-amber-200 bg-amber-50/40">
            <h3 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>ℹ️</span>
              <span>{currentLang === 'fa' ? 'نکتهٔ مهم: «Fundația România ProCulture» آموزش زبان رومانیایی ارائه نمی‌دهد' : 'Important: "Fundația România ProCulture" does not teach Romanian'}</span>
            </h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'سازمانی واقعی به نام «Fundația România Pro Culture» در بخارست وجود دارد، اما بر اساس معرفی رسمی خودش، فعالیتش حول رهبری کسب‌وکار اخلاقی، رشد شخصیتی جوانان و برنامه‌های تقویت خانواده است — نه آموزش زبان. اگر دنبال یک «فوندیشن» برای آموزش رایگان زبان رومانیایی به مهاجران و پناهندگان می‌گردید، سازمانی که واقعاً این نقش را ایفا می‌کند Fundația Schottener Servicii Sociale (شریک اجرایی IOM، معرفی‌شده در بالا) است.'
                : 'A real organization called "Fundația România Pro Culture" does exist in Bucharest, but based on its own official description, its work centers on ethical business leadership, youth character development, and family-strengthening programs — not language instruction. If you\'re looking for a foundation that provides free Romanian language teaching to migrants and refugees, the organization that actually does this is Fundația Schottener Servicii Sociale (IOM\'s implementing partner, introduced above).'}
            </p>
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <h3 className="font-extrabold text-base text-[#142033]">
              {currentLang === 'fa' ? 'گزینه‌های آموزشی خصوصی (پولی)' : 'Private Course Options (Paid)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'مؤسسه فرهنگی رومانی (ICR) — بخارست' : 'Romanian Cultural Institute (ICR) — Bucharest'}</span>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'دوره‌های آکادمیک سطح‌بندی‌شده از مبتدی تا پیشرفته؛ هر ماژول ۸۵۰ لِی یا ۲۰۰ یورو. آدرس: خیابان Şcoala Floreasca شماره ۵، بخارست.' : 'Structured academic courses from beginner to advanced; 850 RON or 200 EUR per module. Location: Şcoala Floreasca Street No. 5, Bucharest.'}</p>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'تماس: ana.borca@icr.ro — تلفن ۰۳۱ ۷۱۰۰ ۶۷۲' : 'Contact: ana.borca@icr.ro — Phone: 031 7100 672'}</p>
              </div>
              <div className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
                <span className="font-bold text-[#2F6FED]">FIDES Centre</span>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'دوره‌های خصوصی/گروه‌های کوچک، سطوح A1 تا C2، مناسب افراد شاغل و دانشجویان خارجی.' : 'Private/small-group courses, levels A1 through C2, aimed at professionals and foreign students.'}</p>
                <p className="text-[#526174]">{currentLang === 'fa' ? 'ایمیل: cursuri@fidescentre.ro' : 'Email: cursuri@fidescentre.ro'}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا این دوره‌ها واقعاً رایگان‌اند؟' : 'Are these courses really free?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله — برنامهٔ IGI و برنامه‌های تأمین‌مالی‌شده توسط IOM (از طریق AIDRom و Fundația Schottener) برای افراد واجد شرایط (دارندگان اقامت قانونی یا حمایت بین‌المللی) رایگان هستند. گزینه‌های ICR و FIDES Centre خصوصی و پولی‌اند.' : 'Yes — the IGI program and the IOM-funded programs (via AIDRom and Fundația Schottener) are free for eligible participants (legal residents or international-protection holders). ICR and FIDES Centre are private, paid options.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا با اقامت رومانی (نه پناهندگی) هم می‌توانم در دورهٔ رایگان ثبت‌نام کنم؟' : 'Can I enroll in a free course with a Romanian residence permit (not refugee status)?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله — هم برنامهٔ IGI و هم برنامه‌های IOM/AIDRom صراحتاً شامل «اتباع کشورهای ثالث دارای اقامت قانونی» می‌شوند، نه فقط پناهندگان.' : 'Yes — both the IGI program and the IOM/AIDRom programs explicitly cover "third-country nationals with legal residence," not just refugees.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'چرا «Fundația România ProCulture» در این صفحه نیست؟' : 'Why isn\'t "Fundația România ProCulture" listed here?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'این سازمان واقعی است اما — طبق معرفی رسمی خودش — آموزش زبان ارائه نمی‌دهد؛ فعالیتش رهبری، کسب‌وکار اخلاقی و برنامه‌های خانواده است. سازمانی که این نقش را در عمل ایفا می‌کند Fundația Schottener Servicii Sociale است که در بالا معرفی شد.' : 'It\'s a real organization, but — per its own official description — it does not offer language instruction; its work is leadership, ethical business, and family programs. The organization that actually fills this role is Fundația Schottener Servicii Sociale, introduced above.'}</p>
              </div>
            </div>
          </div>

          <FaqSchema items={[
            {
              q: currentLang === 'fa' ? 'آیا این دوره‌ها واقعاً رایگان‌اند؟' : 'Are these courses really free?',
              a: currentLang === 'fa' ? 'بله — برنامهٔ IGI و برنامه‌های تأمین‌مالی‌شده توسط IOM (از طریق AIDRom و Fundația Schottener) برای افراد واجد شرایط (دارندگان اقامت قانونی یا حمایت بین‌المللی) رایگان هستند. گزینه‌های ICR و FIDES Centre خصوصی و پولی‌اند.' : 'Yes — the IGI program and the IOM-funded programs (via AIDRom and Fundația Schottener) are free for eligible participants (legal residents or international-protection holders). ICR and FIDES Centre are private, paid options.'
            },
            {
              q: currentLang === 'fa' ? 'آیا با اقامت رومانی (نه پناهندگی) هم می‌توانم در دورهٔ رایگان ثبت‌نام کنم؟' : 'Can I enroll in a free course with a Romanian residence permit (not refugee status)?',
              a: currentLang === 'fa' ? 'بله — هم برنامهٔ IGI و هم برنامه‌های IOM/AIDRom صراحتاً شامل «اتباع کشورهای ثالث دارای اقامت قانونی» می‌شوند، نه فقط پناهندگان.' : 'Yes — both the IGI program and the IOM/AIDRom programs explicitly cover "third-country nationals with legal residence," not just refugees.'
            },
            {
              q: currentLang === 'fa' ? 'چرا «Fundația România ProCulture» در این صفحه نیست؟' : 'Why isn\'t "Fundația România ProCulture" listed here?',
              a: currentLang === 'fa' ? 'این سازمان واقعی است اما — طبق معرفی رسمی خودش — آموزش زبان ارائه نمی‌دهد؛ فعالیتش رهبری، کسب‌وکار اخلاقی و برنامه‌های خانواده است. سازمانی که این نقش را در عمل ایفا می‌کند Fundația Schottener Servicii Sociale است که در بالا معرفی شد.' : 'It\'s a real organization, but — per its own official description — it does not offer language instruction; its work is leadership, ethical business, and family programs. The organization that actually fills this role is Fundația Schottener Servicii Sociale, introduced above.'
            }
          ]} />

          <ParentHubFooterCard slugRoute="needs/romanian-language-courses" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    // 4. NOTARY PUBLIC
    case 'notary-public':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="needs/notary-public" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'دفتر اسناد رسمی و خدمات نوتاری' : 'Notary Public Services'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'تنظیم وکالت‌نامه، تایید امضا، گواهی مطابقت تصویر با اصل مدارک و ثبت قراردادها.'
                : 'Powers of attorney, signature legalizations, and real estate notarial deeds.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: اتحادیه ملی نوتاری‌های رومانی (UNNPR) — uniuneanotarilor.ro — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: National Union of Romanian Public Notaries (UNNPR) — uniuneanotarilor.ro — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'دفتر اسناد رسمی (Notar Public) در سیستم حقوقی و مدنی رومانی نقشی کلیدی و غیرقابل چشم‌پوشی ایفا می‌کند. برخلاف برخی کشورها که نقش سردفتر صرفاً تایید امضا است، نوتاری‌های رومانی حقوق‌دانانی مجرب هستند که اسناد حساس اعم از انتقال مالکیت املاک، صدور انواع وکالت‌نامه (Procură)، اساسنامه‌های شرکتی و تایید مدارک ترجمه‌شده را تنظیم و رسمیت می‌بخشند. درک زمان و نحوه مراجعه به این دفاتر می‌تواند شما را از پیچیدگی‌های قانونی نجات داده و اعتبار مدارک شما را در نهادهای دولتی تضمین کند.'
              : 'The Notary Public (Notar Public) plays a central and indispensable role in Romanian civil and commercial life. Unlike in some jurisdictions where a notary simply witnesses signatures, Romanian notaries are highly qualified legal professionals tasked with authenticating a wide range of critical documents. From finalizing real estate purchases and drafting powers of attorney (Procură) to legalizing translations and authenticating corporate statutes, their seal is required for most significant legal transactions. Understanding when you need notarial services will save you time and ensure your documents are legally binding.'}
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <h3 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'خدمات اصلی دفاتر اسناد رسمی' : 'Main Notarial Services'}</h3>
            <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
              <li>{currentLang === 'fa' ? 'تأیید صحت امضا و کپی برابر اصل مدارک.' : 'Signature authentication and certified true copies of documents.'}</li>
              <li>{currentLang === 'fa' ? 'تنظیم اسناد انتقال مالکیت ملک و وسایل نقلیه.' : 'Drafting deeds for the transfer of real estate and vehicle ownership.'}</li>
              <li>{currentLang === 'fa' ? 'ثبت انواع وکالت‌نامه‌های عمومی و خاص.' : 'Registering general and specific powers of attorney.'}</li>
              <li>{currentLang === 'fa' ? 'تصدیق ترجمه‌های رسمی (Legalizare).' : 'Notarization of certified translations (Legalizare).'}</li>
            </ul>
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <h3 className="font-extrabold text-base text-[#142033]">
              {currentLang === 'fa' ? 'قوانین حضور مترجم رسمی نزد نوتاری' : 'Rules on Interpreter Presence at the Notary'}
            </h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'طبق مادهٔ ۸۲ بند ۲ قانون شماره ۳۶/۱۹۹۵ (قانون نوتاری‌های رومانی)، اگر طرف یک سند نوتاری به زبان رومانیایی مسلط نباشد یا از اقلیت‌های زبانی باشد، مفاد سند باید از طریق یک مترجم/مفسر رسمی مجاز برایش تفهیم شود؛ این مترجم باید همراه با نوتاری، ذیل سند را امضا کند.'
                : 'Under Article 82(2) of Law No. 36/1995 (the Romanian Notaries Law), if a party to a notarial act does not know Romanian, or belongs to a national minority, the content of the act must be conveyed to them through an authorized interpreter/translator — who must sign the closing statement alongside the notary.'}
            </p>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'چه کسی می‌تواند مترجم باشد؟ خودِ نوتاری در صورتی می‌تواند این نقش را ایفا کند که آن زبان خارجی، زبان مادری‌اش باشد یا خودش مترجم رسمی مجاز باشد؛ در غیر این صورت باید یک مترجم رسمی مجاز از سوی وزارت دادگستری رومانی در جلسه حاضر شود. این هزینه‌ای جداگانه و اضافه بر تعرفه‌های جدول بالاست و معمولاً مستقیماً با خودِ مترجم توافق می‌شود.'
                : 'Who can serve as interpreter? The notary may act as interpreter only if the foreign language is their own mother tongue or they are themselves an authorized translator; otherwise, an interpreter authorized by Romania\'s Ministry of Justice must attend in person. This is a separate cost on top of the fee table above, typically arranged and paid directly with the interpreter.'}
            </p>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'مدارکی که از قبل به زبان خارجی نوشته شده‌اند: طبق مادهٔ ۸۲ بند ۴، نوتاری فقط در صورتی می‌تواند با چنین سندی کار کند که خودش آن زبان را بداند یا از طریق مترجم رسمی محتوایش را درک کرده باشد — در هر دو حالت، یک ترجمهٔ رومانیایی امضاشده توسط مترجم باید به پرونده ضمیمه شود. برای رونوشت‌های برابر اصل از مدارک خارجی هم طبق مادهٔ ۱۵۲ بند ۱۱، ترجمهٔ رسمی باید همراه رونوشت تصدیق‌شده باشد.'
                : 'Documents already drafted in a foreign language: per Article 82(4), the notary may only work with such a document if they personally know that language or have understood it via an authorized interpreter — either way, a Romanian translation signed by the translator must be attached to the file. For certified true copies of foreign documents, Article 152(11) likewise requires an official translation to accompany the certified copy.'}
            </p>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'راه انصراف از مترجم: اگر یک شهروند خارجی خودش اعلام کند که رومانیایی را به‌اندازهٔ کافی می‌داند، می‌تواند طی یک اعلامیهٔ دست‌نویس، حضور مترجم رسمی را نخواهد؛ نوتاری این انصراف را در متن ذیل سند ثبت می‌کند (مادهٔ ۲۲۴ بند ۴ آیین‌نامهٔ اجرایی قانون ۳۶/۱۹۹۵). اسناد دوزبانه هم مجازند — رومانیایی و زبان خارجی در دو ستون یا پشت‌سرهم، با تقدم متن رومانیایی (مادهٔ ۸۲ بند ۵).'
                : 'Opting out of an interpreter: if a foreign citizen declares that they know Romanian well enough, they may waive the authorized interpreter\'s presence via a handwritten declaration; the notary records this waiver in the act\'s closing statement (Article 224(4) of the Regulation implementing Law 36/1995). Bilingual acts are also permitted — Romanian and the foreign language in two columns or in sequence, with the Romanian text taking precedence (Article 82(5)).'}
            </p>
            <div className="text-[11px] text-slate-400 pt-1">
              {currentLang === 'fa'
                ? 'منبع: بولتن اتحادیهٔ نوتاری‌های رومانی (Buletinul Notarilor Publici) و مادهٔ ۸۲/۱۵۲ قانون ۳۶/۱۹۹۵ — آخرین بررسی: شهریور ۱۴۰۵ / سپتامبر ۲۰۲۶'
                : 'Source: Buletinul Notarilor Publici (Romanian Notaries Bulletin) and Articles 82/152 of Law 36/1995 — Last reviewed: September 2026'}
            </div>
          </div>

          <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
            <h3 className="font-extrabold text-base text-[#142033]">{currentLang === 'fa' ? 'حداقل تعرفه‌های رسمی نوتاری (۲۰۲۴)' : 'Official Minimum Notary Fees (2024)'}</h3>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'طبق آیین‌نامه تعرفه‌های حداقل خدمات نوتاری (Ordinul MJ 177/C/2024)، این ارقام کف قانونی هستند — دفاتر واقعی در بخارست و شهرهای بزرگ می‌توانند بیشتر از این دریافت کنند؛ پیش از مراجعه حتماً استعلام بگیرید.'
                : 'Per the official minimum-fee regulation (Ordinul MJ 177/C/2024), these are legal floors — actual Bucharest and major-city offices may charge more; always confirm before your visit.'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl text-xs border-collapse">
                <thead>
                  <tr className="bg-[#071B3D] text-white">
                    <th className="p-2.5 rounded-r-xl">{currentLang === 'fa' ? 'خدمت' : 'Service'}</th>
                    <th className="p-2.5 rounded-l-xl">{currentLang === 'fa' ? 'حداقل هزینه' : 'Minimum Fee'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe6ef]">
                  <tr><td className="p-2.5 font-bold text-[#142033]">{currentLang === 'fa' ? 'تأیید صحت امضا روی اسناد' : 'Signature authentication on documents'}</td><td className="p-2.5">250 RON</td></tr>
                  <tr><td className="p-2.5 font-bold text-[#142033]">{currentLang === 'fa' ? 'کپی برابر اصل (هر صفحه، مدرک ارائه‌شده توسط متقاضی)' : 'Certified true copy (per page, document supplied by applicant)'}</td><td className="p-2.5">5 RON</td></tr>
                  <tr><td className="p-2.5 font-bold text-[#142033]">{currentLang === 'fa' ? 'کپی برابر اصل از آرشیو نوتاری (هر صفحه)' : 'Certified copy from notary archive (per page)'}</td><td className="p-2.5">7 RON</td></tr>
                  <tr><td className="p-2.5 font-bold text-[#142033]">{currentLang === 'fa' ? 'وکالت‌نامه (انتقال/تحصیل اموال منقول یا غیرمنقول، نمایندگی در ارث)' : 'Power of attorney (transfer/acquisition of movable or immovable assets, inheritance representation)'}</td><td className="p-2.5">100 RON</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="editorial-card p-6 sm:p-8 bg-white space-y-4 border border-amber-200 bg-amber-50/40">
            <h3 className="font-extrabold text-base text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🇮🇷</span>
              <span>{currentLang === 'fa' ? 'ویژه ایرانیان: وکالت‌نامه به ایران و اعتبار مدارک ایرانی' : 'Iran-Specific: Power of Attorney to Iran & Validating Iranian Documents'}</span>
            </h3>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'اگر می‌خواهید از رومانی وکالت‌نامه‌ای برای انجام کاری در ایران (مثل فروش ملک) بدهید، یک دفتر اسناد رسمی رومانیایی به‌تنهایی کافی نیست — چون ایران عضو کنوانسیون آپوستیل لاهه نیست. دو مسیر شناخته‌شده وجود دارد: (۱) ثبت مستقیم درخواست وکالت‌نامه از طریق سامانه میخک سفارت ایران («mikhak.mfa.gov.ir») و حضور در سفارت/کنسولگری با پاسپورت معتبر ایرانی و مشخصات کامل وکیل در ایران (نام، کد ملی، نام پدر، تاریخ تولد، آدرس)؛ یا (۲) تنظیم سند نزد نوتاری رومانیایی، سپس تصدیق (Supralegalizare) در وزارت امور خارجه رومانی، و در نهایت تصدیق نهایی توسط سفارت ایران در بخارست. جزئیات دقیق هزینه و وقت ملاقات سفارت را مستقیماً از سفارت ایران در بخارست استعلام بگیرید.'
                : 'If you need to issue a power of attorney from Romania for something in Iran (e.g. selling property there), a Romanian notary alone is not enough — because Iran is not a Hague Apostille Convention member. Two known routes exist: (1) apply directly through the Iranian Embassy\'s Mikhak system (mikhak.mfa.gov.ir) and attend in person with a valid Iranian passport and your representative\'s full details in Iran (name, national ID, father\'s name, date of birth, address); or (2) have the deed drawn up at a Romanian notary, then legalized ("supralegalizare") at Romania\'s Ministry of Foreign Affairs, and finally legalized by the Iranian Embassy in Bucharest. Confirm exact fees and appointment requirements directly with the Iranian Embassy in Bucharest.'}
            </p>
            <p className="text-sm text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'در جهت عکس هم همین منطق برقرار است: مدارک صادرشده در ایران (مثل وکالت‌نامه یا سند رسمی) برای اعتبار در رومانی نمی‌توانند صرفاً آپوستیل بگیرند و باید مسیر تصدیق کنسولی را طی کنند (تاییدیه دادگستری ایران → تاییدیه وزارت امور خارجه ایران → تصدیق سفارت رومانی در تهران)، پیش از آنکه یک نوتاری رومانیایی بتواند ترجمه رسمی آن را تصدیق کند. طبق ماده ۸۲ قانون ۳۶/۱۹۹۵ رومانی، اگر به زبان رومانیایی مسلط نباشید، نوتاری موظف است یا خودش به زبان شما مسلط باشد یا مترجم رسمی مجاز را در جلسه حاضر کند و ترجمه او را به پرونده ضمیمه نماید — این هزینه‌ای اضافه بر تعرفه‌های بالا خواهد بود.'
                : 'The reverse direction follows the same logic: documents issued in Iran (like a power of attorney or official deed) cannot simply be apostilled to be valid in Romania — they must go through consular legalization (Iranian Ministry of Justice attestation → Iranian Ministry of Foreign Affairs attestation → legalization by the Romanian Embassy in Tehran) before a Romanian notary can certify a translation of it. Under Article 82 of Romanian Law 36/1995, if you are not fluent in Romanian, the notary must either be personally fluent in your language or bring in an authorized interpreter and attach their translation to the file — this is an added cost on top of the fee table above.'}
            </p>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا برای مراجعه به دفتر اسناد رسمی باید وقت قبلی بگیرم؟' : 'Do I need an appointment for notary services?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'برای خدمات ساده مثل کپی برابر اصل معمولاً نیازی به وقت قبلی نیست، اما برای تنظیم قراردادهای ملکی یا وکالت‌نامه‌ها رزرو وقت قبلی الزامی است.' : 'For complex acts like property purchases or corporate setups, an appointment is mandatory, but for simple document legalizations, walk-ins are often accepted.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر من به زبان رومانیایی مسلط نباشم چه اتفاقی می‌افتد؟' : 'What if I don\'t speak Romanian?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'طبق مادهٔ ۸۲ قانون ۳۶/۱۹۹۵، باید یک مترجم رسمی مجاز حاضر باشد و ذیل سند را امضا کند — مگر آنکه خودِ نوتاری به آن زبان مسلط باشد، یا شما با یک اعلامیهٔ دست‌نویس رسماً از حضور مترجم انصراف دهید (چون رومانیایی را کافی می‌دانید). این خدمت جداگانه هزینه دارد و از قبل باید هماهنگ شود.' : 'Under Article 82 of Law 36/1995, an authorized interpreter must be present and sign the closing statement — unless the notary is personally fluent in your language, or you formally waive the interpreter with a handwritten declaration (because you know Romanian well enough). This is a separately arranged, separately charged service, so coordinate it in advance.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'می‌خواهم به کسی در ایران وکالت بدهم؛ آیا یک نوتاری رومانیایی کافی است؟' : 'I need to give someone in Iran power of attorney — is a Romanian notary enough?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'به‌تنهایی نه. چون ایران عضو کنوانسیون آپوستیل نیست، یا باید مستقیماً از طریق سامانه میخک سفارت ایران اقدام کنید، یا سند نوتاری رومانیایی را از مسیر وزارت امور خارجه رومانی و سپس سفارت ایران در بخارست تصدیق کنید.' : 'Not by itself. Since Iran is not an Apostille Convention member, either apply directly through the Iranian Embassy\'s Mikhak system, or have the Romanian notarial deed legalized via Romania\'s Ministry of Foreign Affairs and then the Iranian Embassy in Bucharest.'}</p>
              </div>
            </div>
          </div>

          <FaqSchema items={[
            {
              q: currentLang === 'fa' ? 'آیا برای مراجعه به دفتر اسناد رسمی باید وقت قبلی بگیرم؟' : 'Do I need an appointment for notary services?',
              a: currentLang === 'fa' ? 'برای خدمات ساده مثل کپی برابر اصل معمولاً نیازی به وقت قبلی نیست، اما برای تنظیم قراردادهای ملکی یا وکالت‌نامه‌ها رزرو وقت قبلی الزامی است.' : 'For complex acts like property purchases or corporate setups, an appointment is mandatory, but for simple document legalizations, walk-ins are often accepted.'
            },
            {
              q: currentLang === 'fa' ? 'اگر من به زبان رومانیایی مسلط نباشم چه اتفاقی می‌افتد؟' : 'What if I don\'t speak Romanian?',
              a: currentLang === 'fa' ? 'طبق مادهٔ ۸۲ قانون ۳۶/۱۹۹۵، باید یک مترجم رسمی مجاز حاضر باشد و ذیل سند را امضا کند — مگر آنکه خودِ نوتاری به آن زبان مسلط باشد، یا شما با یک اعلامیهٔ دست‌نویس رسماً از حضور مترجم انصراف دهید (چون رومانیایی را کافی می‌دانید). این خدمت جداگانه هزینه دارد و از قبل باید هماهنگ شود.' : 'Under Article 82 of Law 36/1995, an authorized interpreter must be present and sign the closing statement — unless the notary is personally fluent in your language, or you formally waive the interpreter with a handwritten declaration (because you know Romanian well enough). This is a separately arranged, separately charged service, so coordinate it in advance.'
            },
            {
              q: currentLang === 'fa' ? 'می‌خواهم به کسی در ایران وکالت بدهم؛ آیا یک نوتاری رومانیایی کافی است؟' : 'I need to give someone in Iran power of attorney — is a Romanian notary enough?',
              a: currentLang === 'fa' ? 'به‌تنهایی نه. چون ایران عضو کنوانسیون آپوستیل نیست، یا باید مستقیماً از طریق سامانه میخک سفارت ایران اقدام کنید، یا سند نوتاری رومانیایی را از مسیر وزارت امور خارجه رومانی و سپس سفارت ایران در بخارست تصدیق کنید.' : 'Not by itself. Since Iran is not an Apostille Convention member, either apply directly through the Iranian Embassy\'s Mikhak system, or have the Romanian notarial deed legalized via Romania\'s Ministry of Foreign Affairs and then the Iranian Embassy in Bucharest.'
            }
          ]} />

          <ParentHubFooterCard slugRoute="needs/notary-public" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    // 5. IRANIAN EMBASSY & MIKHAK
    case 'iranian-embassy-and-mikhak':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="needs/iranian-embassy-and-mikhak" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'خدمات کنسولی' : 'Consular Services'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'سفارت ایران در بخارست و سامانه میخک' : 'Iranian Embassy in Bucharest & Mikhak System'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای ثبت درخواست‌های گذرنامه، تشکیل پرونده دانشجویی و تایید مدارک.'
                : 'Official consular guide for passport renewals, and student files via Mikhak.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منبع: سامانه رسمی میخک وزارت امور خارجه ایران — mikhak.mfa.gov.ir — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Source: Official Mikhak system of the Iranian Ministry of Foreign Affairs — mikhak.mfa.gov.ir — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa' 
              ? 'برای شهروندان ایرانی مقیم رومانی، سفارت جمهوری اسلامی ایران در بخارست مرجع اصلی دریافت خدمات کنسولی است. امروزه اکثر روندهای اداری—از جمله تمدید گذرنامه، ثبت ازدواج و تشکیل پرونده‌های دانشجویی جهت برخورداری از معافیت‌های ارزی—به‌صورت الکترونیکی و از طریق سامانه یکپارچه «میخک» انجام می‌شود. شدیداً توصیه می‌گردد پیش از مراجعه حضوری به سفارت، حتماً مدارک خود را در سامانه میخک بارگذاری کرده و کد رهگیری دریافت نمایید تا فرآیند صدور اسناد شما با سرعت و دقت بیشتری طی شود.'
              : 'For Iranian nationals residing in Romania, the Embassy of the Islamic Republic of Iran in Bucharest serves as the primary hub for all consular services. Whether you need to renew your passport, register a marriage, or process student files, most administrative workflows are now integrated with the "Mikhak" online system. It is highly recommended to complete your online registration and upload all necessary documents through the Mikhak portal before scheduling an in-person appointment at the consulate, as this drastically reduces processing times and ensures a smoother experience.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
              <h3 className="font-extrabold text-[#142033] text-base">📍 {currentLang === 'fa' ? 'اطلاعات تماس سفارت' : 'Embassy Contact Information'}</h3>
              <ul className="space-y-2 text-sm text-[#526174]">
                <li><strong>{currentLang === 'fa' ? 'آدرس:' : 'Address:'}</strong> Lascăr Catargiu 39, București</li>
                <li><strong>{currentLang === 'fa' ? 'تلفن:' : 'Phone:'}</strong> <span dir="ltr" className="inline-block">+40 21 312 0493</span></li>
                <li><strong>{currentLang === 'fa' ? 'سامانه میخک:' : 'Mikhak System:'}</strong> mikhak.mfa.gov.ir</li>
              </ul>
              <a href="https://mikhak.mfa.gov.ir" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm" className="w-full mt-2" rightIcon={<ExternalLink size={14} />}>
                  {currentLang === 'fa' ? 'ورود به سامانه رسمی میخک' : 'Access Mikhak Portal'}
                </Button>
              </a>
            </div>

            <div className="editorial-card p-6 bg-white space-y-4 border border-[#dfe6ef]">
              <h3 className="font-extrabold text-[#142033] text-base">⚠️ {currentLang === 'fa' ? 'هشدار امنیتی سامانه میخک' : 'Mikhak Security Warning'}</h3>
              <p className="text-sm text-[#526174] leading-relaxed">
                {currentLang === 'fa'
                  ? 'سامانه میخک فقط از طریق دامنه رسمی وزارت امور خارجه ایران در دسترس است. اطلاعات ورود، کد رهگیری و مدارک هویتی خود را هرگز در اختیار افراد ناشناس قرار ندهید.'
                  : 'Access Mikhak strictly through official Ministry of Foreign Affairs domains. Protect account credentials.'}
              </p>
            </div>
          </div>

          {/* PASSPORT PROCESS — step by step via Mikhak */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm space-y-5">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
              <span>🛂</span>
              <span>{currentLang === 'fa' ? 'مراحل تمدید یا صدور گذرنامه از طریق میخک' : 'Steps to renew or issue a passport via Mikhak'}</span>
            </h2>
            <ol className="space-y-3 text-sm text-[#526174] list-decimal list-inside marker:font-bold marker:text-[#2F6FED]">
              <li>{currentLang === 'fa' ? 'ثبتنام در سامانه میخک با مشخصات هویتی و اقامتی خود و دریافت کد رهگیری.' : 'Register on the Mikhak system with your identity and residency details to receive a tracking code.'}</li>
              <li>{currentLang === 'fa' ? 'بارگذاری مدارک لازم (تصویر شناسنامه، کارت ملی، گذرنامه قبلی، عکس بیومتریک) با فرمت JPG و حجم محدود.' : 'Upload the required documents (birth certificate, national ID, previous passport, biometric photo) as JPG files under the system\'s size limit.'}</li>
              <li>{currentLang === 'fa' ? 'در صورت نیاز، از طریق همان کد رهگیری برای مراجعه حضوری به سفارت بخارست نوبت بگیرید.' : 'If required, book an in-person appointment at the Bucharest embassy using your tracking code.'}</li>
              <li>{currentLang === 'fa' ? 'مراجعه حضوری برای ثبت اثرانگشت و عکس بیومتریک (برای گذرنامههای الکترونیکی الزامی است).' : 'Attend in person for fingerprinting and a biometric photo (mandatory for e-passports).'}</li>
              <li>{currentLang === 'fa' ? 'پرداخت هزینه — روش پرداخت (کارتخوان، واریز بانکی یا نقدی) را از خود سفارت بخارست استعلام بگیرید، چون هزینه به یورو تعیین میشود اما تبدیل به لئو و روش دریافت آن را هر نمایندگی جداگانه مشخص میکند.' : 'Pay the fee — confirm the accepted payment method (card, bank transfer, or cash) directly with the Bucharest embassy, since the fee is set in euros but each mission sets its own RON conversion and collection method.'}</li>
              <li>{currentLang === 'fa' ? 'دریافت گذرنامه حضوری یا از طریق پست سفارشی (در صورت ارائه این گزینه توسط سفارت).' : 'Collect the passport in person, or by registered mail if the embassy offers that option.'}</li>
            </ol>
            <p className="text-xs text-[#526174] leading-relaxed">
              {currentLang === 'fa'
                ? 'مدت زمان معمول رسیدگی حدود ۱ تا ۳ هفته است، اما در بازههای پرتردد (نوروز، تابستان) ممکن است به ۴ تا ۶ هفته برسد.'
                : 'Typical processing time is 1–3 weeks, though busy periods (Nowruz, summer) can extend this to 4–6 weeks.'}
            </p>

            <div className="pt-4 border-t border-[#dfe6ef] space-y-3">
              <h3 className="font-bold text-[#142033] text-sm">{currentLang === 'fa' ? 'هزینههای مرجع سامانه میخک (بر اساس مصوبه هیئت وزیران، مهر ۱۴۰۴)' : 'Reference Mikhak fees (per the Cabinet decree, October 2025)'}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-[#526174] border-collapse">
                  <tbody>
                    <tr className="border-b border-[#eef3f8]">
                      <td className="py-2 pr-2">{currentLang === 'fa' ? 'صدور یا تمدید گذرنامه' : 'Passport issuance / renewal'}</td>
                      <td className="py-2 font-bold text-[#142033] text-left" dir="ltr">115 EUR</td>
                    </tr>
                    <tr className="border-b border-[#eef3f8]">
                      <td className="py-2 pr-2">{currentLang === 'fa' ? 'اولین گذرنامه کودک زیر ۲ سال' : 'First passport for a child under 2'}</td>
                      <td className="py-2 font-bold text-[#142033] text-left" dir="ltr">58 EUR</td>
                    </tr>
                    <tr className="border-b border-[#eef3f8]">
                      <td className="py-2 pr-2">{currentLang === 'fa' ? 'گذرنامه مفقودی/آسیبدیده (بار اول)' : 'Lost/damaged passport (1st occurrence)'}</td>
                      <td className="py-2 font-bold text-[#142033] text-left" dir="ltr">207 EUR</td>
                    </tr>
                    <tr className="border-b border-[#eef3f8]">
                      <td className="py-2 pr-2">{currentLang === 'fa' ? 'ثبت ازدواج' : 'Marriage registration'}</td>
                      <td className="py-2 font-bold text-[#142033] text-left" dir="ltr">40 EUR</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-2">{currentLang === 'fa' ? 'وکالتنامه امور اداری/بانکی' : 'Power of attorney (admin/banking matters)'}</td>
                      <td className="py-2 font-bold text-[#142033] text-left" dir="ltr">23 EUR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {currentLang === 'fa'
                  ? 'این ارقام یورویی مصوبه سراسری وزارت امور خارجه است؛ هر سفارت (از جمله بخارست) آن را به لئوی رومانی تبدیل میکند و ممکن است مبلغ نهایی کمی متفاوت باشد — پیش از پرداخت حتماً مبلغ دقیق را از خود سفارت بخارست استعلام بگیرید. منبع: مصوبه هیئت وزیران مورخ ۱۴۰۴/۷/۱۶ (نقلشده توسط رسانههای واسطه؛ برای تایید نهایی به bucharest.mfa.ir مراجعه شود).'
                  : 'These are the ministry-wide euro figures; each embassy (Bucharest included) converts them to Romanian lei, so the final charged amount may vary slightly — confirm the exact figure with the Bucharest embassy before paying. Source: Cabinet decree dated 1404/7/16 (Oct 2025), as reported by intermediary outlets; for final confirmation see bucharest.mfa.ir.'}
              </p>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا مراجعه به سفارت نیاز به وقت قبلی دارد؟' : 'Do I need to book an appointment before visiting the embassy?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، برای اکثر خدمات کنسولی داشتن کد رهگیری از سامانه میخک و گرفتن نوبت تلفنی یا اینترنتی الزامی است.' : 'Yes, most consular services require a pre-booked appointment, often initiated after submitting your application on the Mikhak system.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا سفارت خدمات ترجمه رسمی هم ارائه می‌دهد؟' : 'Does the embassy provide translation services?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر، سفارت وظیفه تایید اسناد را برعهده دارد؛ شما باید برای مدارک مورد نیاز دولت رومانی به مترجمین مجاز محلی مراجعه کنید.' : 'No, the embassy does not translate documents; you must use a Romanian-authorized translator for documents submitted to local authorities.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'اگر گذرنامه‌ام مفقود یا سرقت شود چه باید کرد؟' : 'What if my passport is lost or stolen?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'ابتدا باید موضوع را به پلیس محلی رومانی گزارش داده و گزارش رسمی (Poliția Română) دریافت کنید، سپس درخواست صدور گذرنامه جدید را در سامانه میخک با ذکر مفقودی ثبت کنید. هزینه گذرنامه مفقودی معمولاً بیشتر از تمدید عادی است.' : 'First, report the loss to the Romanian police (Poliția Română) and obtain an official report, then file a new passport application on Mikhak, noting it as a loss/theft case. The fee for a lost passport is typically higher than a standard renewal.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توان مدارک را بدون حضور فیزیکی ارسال کرد؟' : 'Can documents be submitted without visiting in person?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'ثبت اولیه و بارگذاری مدارک در میخک آنلاین است، اما ثبت اثرانگشت و عکس بیومتریک برای گذرنامه الکترونیکی معمولاً نیازمند حضور فیزیکی است؛ برخی خدمات غیرگذرنامه‌ای ممکن است امکان ارسال پستی داشته باشند که باید مستقیماً از سفارت بخارست استعلام شود.' : 'Initial registration and document upload on Mikhak is online, but fingerprinting and the biometric photo for an e-passport generally require an in-person visit; some non-passport services may allow mail submission — confirm directly with the Bucharest embassy.'}</p>
              </div>
            </div>
          </div>

          <FaqSchema items={[
            {
              q: currentLang === 'fa' ? 'آیا مراجعه به سفارت نیاز به وقت قبلی دارد؟' : 'Do I need to book an appointment before visiting the embassy?',
              a: currentLang === 'fa' ? 'بله، برای اکثر خدمات کنسولی داشتن کد رهگیری از سامانه میخک و گرفتن نوبت تلفنی یا اینترنتی الزامی است.' : 'Yes, most consular services require a pre-booked appointment, often initiated after submitting your application on the Mikhak system.'
            },
            {
              q: currentLang === 'fa' ? 'آیا سفارت خدمات ترجمه رسمی هم ارائه می‌دهد؟' : 'Does the embassy provide translation services?',
              a: currentLang === 'fa' ? 'خیر، سفارت وظیفه تایید اسناد را برعهده دارد؛ شما باید برای مدارک مورد نیاز دولت رومانی به مترجمین مجاز محلی مراجعه کنید.' : 'No, the embassy does not translate documents; you must use a Romanian-authorized translator for documents submitted to local authorities.'
            },
            {
              q: currentLang === 'fa' ? 'اگر گذرنامه‌ام مفقود یا سرقت شود چه باید کرد؟' : 'What if my passport is lost or stolen?',
              a: currentLang === 'fa' ? 'ابتدا باید موضوع را به پلیس محلی رومانی گزارش داده و گزارش رسمی (Poliția Română) دریافت کنید، سپس درخواست صدور گذرنامه جدید را در سامانه میخک با ذکر مفقودی ثبت کنید. هزینه گذرنامه مفقودی معمولاً بیشتر از تمدید عادی است.' : 'First, report the loss to the Romanian police (Poliția Română) and obtain an official report, then file a new passport application on Mikhak, noting it as a loss/theft case. The fee for a lost passport is typically higher than a standard renewal.'
            },
            {
              q: currentLang === 'fa' ? 'آیا می‌توان مدارک را بدون حضور فیزیکی ارسال کرد؟' : 'Can documents be submitted without visiting in person?',
              a: currentLang === 'fa' ? 'ثبت اولیه و بارگذاری مدارک در میخک آنلاین است، اما ثبت اثرانگشت و عکس بیومتریک برای گذرنامه الکترونیکی معمولاً نیازمند حضور فیزیکی است؛ برخی خدمات غیرگذرنامه‌ای ممکن است امکان ارسال پستی داشته باشند که باید مستقیماً از سفارت بخارست استعلام شود.' : 'Initial registration and document upload on Mikhak is online, but fingerprinting and the biometric photo for an e-passport generally require an in-person visit; some non-passport services may allow mail submission — confirm directly with the Bucharest embassy.'
            }
          ]} />

          <ParentHubFooterCard slugRoute="needs/iranian-embassy-and-mikhak" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    // 6. HOUSING (RENT & BUY)
    case 'housing': {
      const housingDisclaimer = currentLang === 'fa'
        ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی (از جمله تابعیت شما و نوع دقیق ملک) با یک وکیل یا نوتار رومانیایی بررسی شود.'
        : 'This must be verified based on current regulations and your individual circumstances (including your citizenship and the exact property type) with a Romanian lawyer or notary.';

      const housingSourceLine = (
        <div className="text-[11px] text-slate-400 mt-2">
          {currentLang === 'fa'
            ? 'منابع: قانون ۳۱۲/۲۰۰۵ (تملک زمین توسط اتباع خارجی)، اداره کل مالیات رومانی (ANAF) — anaf.ro، اداره کل مهاجرت رومانی (IGI) — igi.mai.gov.ro — آخرین بررسی: مرداد ۱۴۰۵ / آگوست ۲۰۲۶'
            : 'Sources: Law 312/2005 (land acquisition by foreign citizens), Romanian Tax Authority (ANAF) — anaf.ro, General Inspectorate for Immigration (IGI) — igi.mai.gov.ro — Last reviewed: August 2026'}
        </div>
      );

      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="needs/housing" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'راهنمای اجاره و خرید مسکن در رومانی' : 'Renting & Buying Property in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'مدارک اجاره، ثبت قرارداد نزد ANAF، ثبت آدرس برای کارت اقامت نزد IGI، و ضوابط دقیق خرید آپارتمان و زمین برای اتباع غیر اتحادیه اروپا.'
                : 'Rental documents, ANAF contract registration, address registration for your IGI residence permit, and the precise rules for non-EU citizens buying apartments and land.'}
            </p>
            {housingSourceLine}
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'پیدا کردن محل سکونت مناسب یکی از مهم‌ترین دغدغه‌های مهاجران تازه‌وارد در رومانی است. بازار مسکن گزینه‌های متنوعی از آپارتمان‌های مدرن تا خانه‌های حومه‌شهری را پیش روی شما می‌گذارد. آدرس محل سکونت شما فقط یک موضوع مسکن نیست؛ چون قرارداد اجاره‌ی ثبت‌شده، مدرک اصلی «اثبات محل سکونت» برای پرونده‌ی کارت اقامت شما نزد اداره کل مهاجرت (IGI) است. برای خرید ملک، تفاوت اساسی بین مالکیت «ساختمان/آپارتمان» و مالکیت «زمین» وجود دارد؛ اتباع غیر اتحادیه اروپا (از جمله اکثر شهروندان ایرانی) در مالکیت زمین با محدودیت قانونی مواجه‌اند، مگر از طریق ثبت شرکت رومانیایی. پیش از پرداخت بیعانه یا امضای هر قراردادی، بررسی مستقل حقوقی و ثبتی ضروری است.'
              : 'Finding a suitable place to live is one of the most critical steps for newcomers to Romania. The housing market offers a variety of options, from modern apartments in vibrant city centers to quieter suburban houses. Your address is not just a housing matter — a registered rental contract is the primary "proof of dwelling" document for your residence permit file at the General Inspectorate for Immigration (IGI). For buying property, there is a fundamental distinction between owning a "building/apartment" and owning "land": non-EU citizens (including most Iranian nationals) face a legal restriction on direct land ownership, unless they go through a Romanian-registered company. Before paying a deposit or signing any contract, independent legal and land-registry review is essential.'}
          </div>

          <div className="flex border-b border-[#dfe6ef] space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setHousingTab('rent')}
              className={`pb-3 font-bold text-sm border-b-2 cursor-pointer ${housingTab === 'rent' ? 'border-[#2F6FED] text-[#2F6FED]' : 'border-transparent text-[#788697]'}`}
            >
              {currentLang === 'fa' ? 'اجاره مسکن' : 'Renting Property'}
            </button>
            <button
              onClick={() => setHousingTab('buy')}
              className={`pb-3 font-bold text-sm border-b-2 cursor-pointer ${housingTab === 'buy' ? 'border-[#2F6FED] text-[#2F6FED]' : 'border-transparent text-[#788697]'}`}
            >
              {currentLang === 'fa' ? 'خرید ملک' : 'Buying Property'}
            </button>
          </div>

          {housingTab === 'rent' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
                <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                  <span>{currentLang === 'fa' ? 'مدارک لازم برای اجاره' : 'Documents Needed to Rent'}</span>
                </h2>
                <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                  <li>{currentLang === 'fa' ? 'پاسپورت یا کارت شناسایی معتبر؛ در صورت وجود، کپی کارت اقامت یا ویزا.' : 'A valid passport or ID card; a copy of your residence permit or visa, if you already have one.'}</li>
                  <li>{currentLang === 'fa' ? 'در صورت داشتن، کد شناسایی مالیاتی (CNP) — نداشتن آن معمولاً مانع امضای قرارداد اولیه نیست.' : 'Your personal tax number (CNP), if you have one — not having it yet usually doesn\'t block signing an initial contract.'}</li>
                  <li>{currentLang === 'fa' ? 'اثبات درآمد یا اشتغال/تحصیل (پذیرش دانشگاه، قرارداد کار)، و گاهی یک نامه‌ی کوتاه معرفی خود به موجر.' : 'Proof of income or your employment/study status (admission letter, work contract), and sometimes a short letter of introduction to the landlord.'}</li>
                  <li><span className="text-[11px] italic text-slate-400">{currentLang === 'fa' ? 'برخی موجران یا آژانس‌ها مدارک اضافه (مثل گواهی عدم سوءپیشینه) درخواست می‌کنند؛ این یک رویه رسمی و اجباری سراسری نیست.' : 'Some landlords or agencies request extra documents (e.g. a criminal record certificate); this is not a mandatory nationwide requirement.'}</span></li>
                </ul>
              </div>

              <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
                <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                  <span>{currentLang === 'fa' ? 'قرارداد و ثبت نزد ANAF (فرم C168)' : 'Contract & ANAF Registration (Form C168)'}</span>
                </h2>
                <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                  <li>{currentLang === 'fa' ? 'قرارداد اجاره (Contract de Închiriere) باید مشخصات کامل طرفین، کد ملی (CNP) مستأجر، آدرس دقیق و ترجیحاً شماره پرونده ثبتی ملک (Carte Funciară) را داشته باشد.' : 'The rental contract (Contract de Închiriere) must state full identification of both parties, the tenant\'s national ID (CNP), the exact address, and ideally the property\'s Land Registry (Carte Funciară) number.'}</li>
                  <li>{currentLang === 'fa' ? 'موجر موظف است ظرف ۳۰ روز از امضا، قرارداد را با فرم C168 نزد ANAF ثبت کند؛ این وظیفه‌ی قانونی موجر است، نه مستأجر.' : 'The landlord is legally required to register the contract with ANAF using Form C168 within 30 days of signing — this is the landlord\'s obligation, not the tenant\'s.'}</li>
                  <li>{currentLang === 'fa' ? 'ثبت قرارداد آن را به «سند لازم‌الاجرا» تبدیل می‌کند (امکان وصول اجاره بدون نیاز به حکم دادگاه جداگانه) و برای شما مدرک رسمی اثبات آدرس است.' : 'Registration turns the contract into an "enforceable title" (rent can be pursued without a separate court judgment) and serves as your official proof-of-address document.'}</li>
                </ul>
              </div>

              <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
                <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                  <span>{currentLang === 'fa' ? 'ودیعه، کمیسیون و تحویل' : 'Deposit, Commission & Handover'}</span>
                </h2>
                <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                  <li>{currentLang === 'fa' ? 'ودیعه (Garanție) معمولاً معادل ۱ تا ۲ ماه اجاره است و در پایان قرارداد، در صورت نبود خسارت، بازگردانده می‌شود.' : 'The security deposit (Garanție) is typically equal to 1–2 months\' rent and is refunded at the end of the contract if there is no damage.'}</li>
                  <li>{currentLang === 'fa' ? 'در صورت استفاده از آژانس املاک، کمیسیون رایج معادل یک ماه اجاره است؛ اما مسئول پرداخت (موجر یا مستأجر) و مبلغ دقیق، تابع توافق است، نه نرخ ثابت قانونی.' : 'When a real estate agency is involved, a commission of around one month\'s rent is common; but who pays it and the exact amount depend on the agreement, not a fixed legal rate.'}</li>
                  <li>{currentLang === 'fa' ? 'در روز تحویل، صورت‌جلسه تحویل ملک (Proces Verbal de Predare-Primire) را با ثبت کنتورهای برق/گاز/آب امضا کنید، و انتقال قبوض به نام خودتان را نزد شرکت‌های آب/برق/گاز محلی پیگیری کنید.' : 'On move-in day, sign a handover protocol (Proces Verbal de Predare-Primire) that records the electricity/gas/water meter readings, and follow up with the local utility providers to transfer the bills into your name.'}</li>
                  <li>{currentLang === 'fa' ? 'در قرارداد باید مشخص شود شارژ ساختمان/انجمن مالکین (Întreținere) — که هزینه‌های مشترک نظیر نظافت راه‌پله، آسانسور و گرمایش مرکزی را پوشش می‌دهد — بر عهده چه کسی است.' : 'The contract should clarify who is responsible for the building/homeowners\' association fee (Întreținere), which covers shared costs like stairwell cleaning, elevator maintenance, and central heating.'}</li>
                </ul>
              </div>

              <div className="editorial-card p-6 bg-[#071B3D] text-white space-y-4">
                <h2 className="text-lg font-bold flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                  <span>{currentLang === 'fa' ? 'ثبت آدرس برای کارت اقامت (IGI)' : 'Registering Your Address for the IGI Residence Permit'}</span>
                </h2>
                <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                  <li>{currentLang === 'fa' ? 'برای هر درخواست یا تمدید کارت اقامت، IGI «اثبات تصرف قانونی محل سکونت» را به‌صورت اصل و کپی می‌خواهد؛ قرارداد اجاره‌ی ثبت‌شده نزد ANAF معمولاً برای این منظور کافی است.' : 'For any residence permit application or renewal, IGI requires "proof of legal possession of the living space" in original and copy; an ANAF-registered rental contract is generally sufficient for this.'}</li>
                  <li>{currentLang === 'fa' ? 'اگر صاحب‌خانه نیستید، ممکن است علاوه بر قرارداد، یک اعلامیه یا رضایت مالک (که برخی ادارات آن را نزد نوتار می‌خواهند) نیز لازم شود؛ این جزئیات بین شهرها و ادارات محلی IGI کمی متفاوت است — پیش از مراجعه با اداره محلی خود هماهنگ کنید.' : 'If you are not the owner, some IGI territorial offices may also ask for a landlord\'s consent/hosting declaration (sometimes notarized) in addition to the contract; this detail varies somewhat by city and local office — confirm with your local IGI office before your appointment.'}</li>
                  <li className="font-bold">{currentLang === 'fa' ? 'اگر آدرس محل سکونت خود را تغییر دهید، طبق مقررات IGI موظفید ظرف ۳۰ روز آن را به اداره محلی مهاجرت اطلاع دهید و برای صدور کارت اقامت جدید با آدرس به‌روز اقدام کنید.' : 'If you change your address, IGI regulations require you to notify your local immigration office within 30 days and apply for a new residence permit reflecting the updated address.'}</li>
                  <li><span className="text-[11px] italic text-slate-400">{housingDisclaimer}</span></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
                <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                  <span>{currentLang === 'fa' ? 'خرید آپارتمان و ساختمان' : 'Buying an Apartment or Building'}</span>
                </h2>
                <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                  <li>{currentLang === 'fa' ? 'اتباع اتحادیه اروپا/فضای اقتصادی اروپا دقیقاً مانند شهروندان رومانیایی، بدون هیچ محدودیتی می‌توانند آپارتمان، خانه یا زمین بخرند.' : 'EU/EEA citizens can buy an apartment, house, or land exactly like Romanian citizens, with no restrictions.'}</li>
                  <li>{currentLang === 'fa' ? 'اتباع غیر اتحادیه اروپا (از جمله اکثر شهروندان ایرانی) می‌توانند مالکیت «ساختمان» — یعنی خودِ واحد آپارتمانی یا بنا — را آزادانه و بدون نیاز به مجوز خاص خریداری کنند.' : 'Non-EU citizens (including most Iranian nationals) may freely buy ownership of the "building" itself — i.e. the apartment unit or the structure — without needing any special permit.'}</li>
                  <li>{currentLang === 'fa' ? 'نکته‌ی مهم: هر آپارتمان به‌طور طبیعی شامل یک سهم مشاع از زمین زیربنا هم می‌شود. سازوکار رایج برای این مورد، «حق سطحی» (Drept de Superficie) است: شما مالک واحد هستید و حق استفاده از زمین را دارید، بدون آنکه لزوماً مالک رسمی سهم زمین باشید — جزئیات دقیق در هر معامله باید توسط نوتار بررسی شود.' : 'Important nuance: every apartment naturally includes a share of the land underneath the building. The common legal mechanism for this is the "right of superficies" (Drept de Superficie): you own the unit and hold a right to use the land, without necessarily being the formal owner of that land share — the exact structure must be reviewed by a notary in each transaction.'}</li>
                </ul>
              </div>

              <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
                <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                  <span>{currentLang === 'fa' ? 'زمین و اصل «تقابل تابعیتی» (Reciprocity)' : 'Land & the "Reciprocity" Principle'}</span>
                </h2>
                <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                  <li>{currentLang === 'fa' ? 'طبق قانون ۳۱۲/۲۰۰۵، اتباع کشورهای خارج از اتحادیه اروپا فقط در صورت وجود یک «معاهده تقابل تابعیتی» (Reciprocity Treaty) بین رومانی و کشور متبوع‌شان می‌توانند مستقیماً مالک زمین (کشاورزی، جنگل یا زمین خالی) شوند.' : 'Under Law 312/2005, non-EU citizens can only directly own land (agricultural, forest, or bare land) if a "reciprocity treaty" exists between Romania and their home country.'}</li>
                  <li className="font-bold">{currentLang === 'fa' ? 'در حال حاضر رومانی چنین معاهده‌ای با اکثر کشورهای غیر اروپایی — از جمله ایران — ندارد؛ یعنی برای اکثریت قریب‌به‌اتفاق شهروندان ایرانی، مالکیت مستقیم زمین به‌عنوان شخص حقیقی عملاً ممکن نیست.' : 'Romania currently has no such treaty with most non-European countries — including Iran — meaning direct land ownership as an individual is, in practice, not available to the vast majority of Iranian nationals.'}</li>
                  <li className="font-bold">{currentLang === 'fa' ? 'مهم: این محدودیت بر اساس «تابعیت» شماست، نه وضعیت اقامتی. داشتن کارت اقامت رومانی (تحصیلی، کاری یا هر نوع دیگر) به‌تنهایی این محدودیت زمین را برطرف نمی‌کند.' : 'Important: this restriction is based on your citizenship, not your residency status. Holding a Romanian residence permit (study, work, or otherwise) does not by itself remove this land restriction.'}</li>
                </ul>
              </div>

              <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
                <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                  <span>{currentLang === 'fa' ? 'راه‌حل رایج: ثبت شرکت رومانیایی (SRL)' : 'The Common Solution: A Romanian Company (SRL)'}</span>
                </h2>
                <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                  <li>{currentLang === 'fa' ? 'یک شرکت ثبت‌شده در رومانی (مثلاً SRL) از نظر قانونی «تابعیت رومانیایی» دارد و طبق قوانین عمومی مالکیت (نه قوانین محدودکننده اتباع خارجی) عمل می‌کند — صرف‌نظر از تابعیت سهامداران آن.' : 'A company registered in Romania (e.g. an SRL) legally holds "Romanian nationality" and is governed by general property law (not the foreign-ownership restrictions) — regardless of the nationality of its shareholders.'}</li>
                  <li>{currentLang === 'fa' ? 'این یعنی یک شهروند ایرانی می‌تواند با ثبت یک SRL (حتی با مالکیت ۱۰۰٪ خودش)، از طریق آن شرکت زمین، خانه ویلایی یا هر نوع ملکی را بخرد — این روشی است که سرمایه‌گذاران خارجی سال‌هاست به‌طور رایج از آن استفاده می‌کنند.' : 'This means an Iranian citizen can register an SRL (even 100% owned by themselves) and use that company to buy land, a villa, or any type of property — this is a route foreign investors have long used routinely.'}</li>
                  <li>{currentLang === 'fa' ? 'این مسیر هزینه و تعهدات نگهداری شرکت (حسابداری، اظهارنامه مالیاتی سالانه و غیره) را هم به همراه دارد و باید در تصمیم‌گیری لحاظ شود.' : 'This route also comes with company-maintenance costs and obligations (bookkeeping, annual tax filings, etc.) that should factor into the decision.'}</li>
                  <li>
                    <button
                      onClick={() => onNavigate('company/registration')}
                      className="text-[#2F6FED] font-bold hover:underline cursor-pointer text-sm"
                    >
                      {currentLang === 'fa' ? '← مراحل ثبت شرکت (SRL) را ببینید' : '→ See the SRL Company Registration Steps'}
                    </button>
                  </li>
                </ul>
              </div>

              <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
                <h2 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                  <span>{currentLang === 'fa' ? 'فرآیند رسمی خرید ملک' : 'The Official Purchase Process'}</span>
                </h2>
                <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                  <li>{currentLang === 'fa' ? 'استعلام سابقه ثبتی ملک (Extras de Carte Funciară) از دفتر ثبت املاک برای اطمینان از نبود بدهی، رهن یا ادعای مالکیت دیگران.' : 'Requesting a Land Registry extract (Extras de Carte Funciară) to confirm the property is free of debts, mortgages, or competing ownership claims.'}</li>
                  <li>{currentLang === 'fa' ? 'تنظیم سند نهایی خرید (Contract de Vânzare-Cumpărare) الزاماً نزد یک نوتار عمومی (Notar Public)؛ معاملات ملکی در رومانی بدون سند نوتاری رسمی و قابل‌ثبت نیستند.' : 'The final sale-purchase contract (Contract de Vânzare-Cumpărare) must be executed before a Public Notary; property transactions in Romania are not valid/registrable without a notarial deed.'}</li>
                  <li>{currentLang === 'fa' ? 'هزینه‌های معامله معمولاً شامل حق‌الزحمه نوتار، مالیات نقل‌وانتقال و هزینه ثبت در دفتر املاک است؛ نرخ‌های دقیق را باید از نوتار طرف معامله استعلام کنید، نه از منابع عمومی.' : 'Transaction costs typically include the notary fee, a transfer tax, and a land-registry filing fee; get exact current rates from the notary handling your transaction, not from general sources.'}</li>
                  <li><span className="text-[11px] italic text-slate-400">{housingDisclaimer}</span></li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'کمیسیون آژانس املاک را چه کسی پرداخت می‌کند؟' : 'Who pays the real estate agency fee?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'مبلغ و مسئول پرداخت کمیسیون به قرارداد آژانس و شرایط معامله بستگی دارد و یک نرخ ثابت قانونی برای همه معاملات نیست؛ رقم رایج نزدیک به یک ماه اجاره است.' : 'The amount and who pays the commission depends on the agency agreement and deal terms — there is no fixed legal rate for all transactions; a commission near one month\'s rent is common.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم با قرارداد اجاره برای اقامت درخواست دهم؟' : 'Can I use my rental contract for my residence permit application?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'بله، یک قرارداد اجاره رسمی که نزد ANAF ثبت شده باشد، از مدارک اصلی و معمولاً کافی برای اثبات آدرس نزد اداره مهاجرت (IGI) است.' : 'Yes, a formal rental contract registered with ANAF is a primary document and is generally sufficient to prove your address to the Immigration Office (IGI).'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'با کارت اقامت رومانی می‌توانم مثل یک رومانیایی زمین بخرم؟' : 'Can I buy land like a Romanian citizen if I hold a Romanian residence permit?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر. محدودیت مالکیت زمین بر اساس تابعیت شماست، نه وضعیت اقامتی. کارت اقامت این محدودیت را برطرف نمی‌کند؛ راه رایج، خرید از طریق یک شرکت رومانیایی (SRL) است.' : 'No. The land-ownership restriction is based on your citizenship, not your residency status. A residence permit does not remove it; the common route is buying through a Romanian company (SRL).'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا می‌توانم آپارتمان بخرم بدون اینکه نگران محدودیت زمین باشم؟' : 'Can I buy an apartment without worrying about the land restriction?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'در عمل بله؛ مالکیت خودِ واحد آپارتمانی برای اتباع غیر اتحادیه اروپا آزاد است و سهم زمین معمولاً از طریق «حق سطحی» مدیریت می‌شود، نه مالکیت مستقیم. با این حال، سازوکار دقیق را نوتار طرف معامله باید در سند خرید مشخص کند.' : 'In practice, yes — non-EU citizens can freely own the apartment unit itself, and the land share is typically handled via a "right of superficies" rather than direct ownership. Even so, the exact mechanism must be specified by your notary in the purchase deed.'}</p>
              </div>
            </div>
          </div>

          <FaqSchema items={[
            {
              q: currentLang === 'fa' ? 'کمیسیون آژانس املاک را چه کسی پرداخت می‌کند؟' : 'Who pays the real estate agency fee?',
              a: currentLang === 'fa' ? 'مبلغ و مسئول پرداخت کمیسیون به قرارداد آژانس و شرایط معامله بستگی دارد و یک نرخ ثابت قانونی برای همه معاملات نیست؛ رقم رایج نزدیک به یک ماه اجاره است.' : 'The amount and who pays the commission depends on the agency agreement and deal terms — there is no fixed legal rate for all transactions; a commission near one month\'s rent is common.'
            },
            {
              q: currentLang === 'fa' ? 'آیا می‌توانم با قرارداد اجاره برای اقامت درخواست دهم؟' : 'Can I use my rental contract for my residence permit application?',
              a: currentLang === 'fa' ? 'بله، یک قرارداد اجاره رسمی که نزد ANAF ثبت شده باشد، از مدارک اصلی و معمولاً کافی برای اثبات آدرس نزد اداره مهاجرت (IGI) است.' : 'Yes, a formal rental contract registered with ANAF is a primary document and is generally sufficient to prove your address to the Immigration Office (IGI).'
            },
            {
              q: currentLang === 'fa' ? 'با کارت اقامت رومانی می‌توانم مثل یک رومانیایی زمین بخرم؟' : 'Can I buy land like a Romanian citizen if I hold a Romanian residence permit?',
              a: currentLang === 'fa' ? 'خیر. محدودیت مالکیت زمین بر اساس تابعیت شماست، نه وضعیت اقامتی. کارت اقامت این محدودیت را برطرف نمی‌کند؛ راه رایج، خرید از طریق یک شرکت رومانیایی (SRL) است.' : 'No. The land-ownership restriction is based on your citizenship, not your residency status. A residence permit does not remove it; the common route is buying through a Romanian company (SRL).'
            },
            {
              q: currentLang === 'fa' ? 'آیا می‌توانم آپارتمان بخرم بدون اینکه نگران محدودیت زمین باشم؟' : 'Can I buy an apartment without worrying about the land restriction?',
              a: currentLang === 'fa' ? 'در عمل بله؛ مالکیت خودِ واحد آپارتمانی برای اتباع غیر اتحادیه اروپا آزاد است و سهم زمین معمولاً از طریق «حق سطحی» مدیریت می‌شود، نه مالکیت مستقیم. با این حال، سازوکار دقیق را نوتار طرف معامله باید در سند خرید مشخص کند.' : 'In practice, yes — non-EU citizens can freely own the apartment unit itself, and the land share is typically handled via a "right of superficies" rather than direct ownership. Even so, the exact mechanism must be specified by your notary in the purchase deed.'
            }
          ]} />

          <ParentHubFooterCard slugRoute="needs/housing" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );
    }

    // 7. FIRST DAYS CHECKLIST
    case 'first-days-checklist': {
      const guideData = currentLang === 'fa' ? firstDaysChecklistFA : firstDaysChecklistEN;
      const translations = currentLang === 'fa' ? {
        tocTitle: 'فهرست محتوای این راهنما',
        quickOverview: 'پاسخ سریع: ',
        appliesTo: 'این بخش برای چه کسانی است؟',
        exceptionsTitle: 'استثنائات و محدودیت‌ها',
        documentsTitle: 'مدارک مورد نیاز',
        stepsTitle: 'مراحل انجام کار',
        feesTitle: 'هزینه‌های مربوطه',
        timelinesTitle: 'زمان‌بندی فرآیند',
        amountHeader: 'مبلغ',
        notesHeader: 'توضیحات',
        durationHeader: 'مدت زمان',
        authorityTitle: 'مرجع مسئول',
        actionLabel: 'پورتال رسمی اقدام',
        warningsTitle: 'هشدارهای مهم',
        sourcesTitle: 'منابع رسمی استناد شده',
        accessedOn: 'تاریخ دسترسی',
        lastReviewed: 'آخرین بازبینی',
        statusLabel: 'وضعیت محتوا',
        factCheckLabel: 'وضعیت راستی‌آزمایی',
        smeReviewLabel: 'بازبینی تخصصی/حقوقی',
        statusDraft: 'پیشنویس',
        statusPublished: 'منتشر شده',
        factCheckVerified: 'تایید شده',
        factCheckPartially: 'بخشی تأیید شده',
        smeReviewPending: 'در انتظار بررسی',
        smeReviewApproved: 'تایید شده'
      } : {
        tocTitle: 'Table of Contents',
        quickOverview: 'Quick Overview: ',
        appliesTo: 'Who this applies to',
        exceptionsTitle: 'Exceptions & Limitations',
        documentsTitle: 'Required Documents',
        stepsTitle: 'Step-by-Step Process',
        feesTitle: 'Applicable Fees',
        timelinesTitle: 'Process Timelines',
        amountHeader: 'Amount',
        notesHeader: 'Notes',
        durationHeader: 'Duration',
        authorityTitle: 'Responsible Authority',
        actionLabel: 'Official Action Portal',
        warningsTitle: 'Important Warnings',
        sourcesTitle: 'Official Sources Cited',
        accessedOn: 'Accessed on',
        lastReviewed: 'Last Reviewed',
        statusLabel: 'Content status',
        factCheckLabel: 'Fact-check status',
        smeReviewLabel: 'SME/legal review',
        statusDraft: 'Draft',
        statusPublished: 'Published',
        factCheckVerified: 'Verified',
        factCheckPartially: 'Partially verified',
        smeReviewPending: 'Pending',
        smeReviewApproved: 'Approved'
      };

      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="needs/first-days-checklist" currentLang={currentLang} onNavigate={onNavigate} />
          <OperationalGuideLayout guide={guideData} translations={translations} />
          <ParentHubFooterCard
            currentLang={currentLang}
            slugRoute="needs/first-days-checklist"
            onNavigate={onNavigate}
          />
          <CommentsSection pagePath={`needs/${subRoute}`} currentLang={currentLang} />
        </div>
      );
    }
    // 9. TRANSPORTATION
    case 'transportation':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <Breadcrumb slugRoute="needs/transportation" currentLang={currentLang} onNavigate={onNavigate} />

          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#2F6FED] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'جابجایی درون‌شهری و بین‌شهری' : 'Getting Around Romania'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'حمل‌ونقل عمومی و بین‌شهری در رومانی' : 'Public Transportation & Intercity Travel'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'از فرودگاه تا شهر، درون شهر و بین شهرها — با اپراتورهای واقعی و نکات عملی.'
                : 'From the airport to the city, around town, and between cities — with real operators and practical tips.'}
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              {currentLang === 'fa'
                ? 'منابع: راه‌آهن رومانی (CFR Călători) — cfrcalatori.ro، متروی بخارست (Metrorex)، فرودگاه هنری کواندا — bucharestairports.ro — آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
                : 'Sources: CFR Călători (national rail) — cfrcalatori.ro, Metrorex (Bucharest metro), Henri Coandă Airport — bucharestairports.ro — Last reviewed: August 2026'}
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-[#526174] text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-[#dfe6ef] shadow-sm">
            {currentLang === 'fa'
              ? 'رومانی شبکه حمل‌ونقل عمومی به‌نسبت گسترده‌ای دارد: راه‌آهن ملی تقریباً همه شهرهای بزرگ را به هم وصل می‌کند، هر شهر بزرگ اتوبوس/تراموای شهری خودش را دارد (بخارست تنها شهر دارای مترو است)، و اتوبوس‌های بین‌شهری خصوصی گزینه‌ای ارزان‌تر برای مسیرهای کوتاه‌تر هستند. برای تازه‌واردان، دانستن نام اپراتورهای واقعی و نحوه خرید بلیت از سردرگمی اولیه جلوگیری می‌کند.'
              : "Romania has a reasonably extensive public transit network: national rail connects nearly all major cities, every major city runs its own city bus/tram network (Bucharest is the only one with a metro), and private intercity coaches are a cheaper option for shorter routes. For newcomers, knowing the real operator names and how to actually buy a ticket avoids a lot of early confusion."}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">1</span>
                <span>{currentLang === 'fa' ? 'فرودگاه تا مرکز شهر (بخارست)' : 'Airport to City Center (Bucharest)'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'خط ریلی مستقیم فرودگاه هنری کواندا (OTP) به گارا دو نورد — حدود ۲۰-۲۵ دقیقه، ارزان‌ترین گزینه.' : 'Direct rail link from Henri Coandă Airport (OTP) to Gara de Nord — about 20–25 min, the cheapest option.'}</li>
                <li>{currentLang === 'fa' ? 'اتوبوس اکسپرس خط ۷۸۰/۷۸۳ — حدود ۴۰-۶۰ دقیقه بسته به ترافیک.' : 'Express bus line 780/783 — about 40–60 min depending on traffic.'}</li>
                <li>{currentLang === 'fa' ? 'تاکسی/اوبر/بولت از فرودگاه — حدود ۱۰-۲۰ یورو تا مرکز؛ فقط از باجه رسمی تاکسی داخل ترمینال سوار شوید تا از کرایه‌های غیررسمی جلوگیری کنید.' : 'Taxi/Uber/Bolt from the airport — roughly €10–20 to the center; use only the official taxi booth inside the terminal to avoid unofficial/overpriced rides.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">2</span>
                <span>{currentLang === 'fa' ? 'حمل‌ونقل درون‌شهری' : 'City Public Transit'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'بخارست: تنها شهر با مترو (Metrorex، ۵ خط) + اتوبوس/تراموا/ترالی‌بوس (STB).' : 'Bucharest: the only city with a metro (Metrorex, 5 lines) plus bus/tram/trolleybus (STB).'}</li>
                <li>{currentLang === 'fa' ? 'سایر شهرهای بزرگ اپراتور محلی خودشان را دارند (مثلاً CTP Cluj، STPT تیمیشوارا، RATBV براشوف) — بلیت معمولاً از طریق اپلیکیشن اپراتور یا دستگاه داخل وسیله خریداری می‌شود.' : 'Other major cities have their own local operator (e.g. CTP Cluj, STPT in Timișoara, RATBV in Brașov) — tickets are usually bought via the operator\'s app or an on-board machine.'}</li>
                <li>{currentLang === 'fa' ? 'دانشجویان معمولاً با کارت دانشجویی معتبر تخفیف ۵۰٪ یا بیشتر روی بلیت ماهانه دریافت می‌کنند؛ رقم دقیق را از دانشگاه یا اپراتور محلی استعلام کنید.' : 'Students with a valid student card typically get 50% or more off monthly passes; check the exact figure with your university or the local operator.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">3</span>
                <span>{currentLang === 'fa' ? 'قطار بین‌شهری' : 'Intercity Train'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'اپراتور ملی راه‌آهن CFR Călători (cfrcalatori.ro) تقریباً همه شهرهای بزرگ را به هم وصل می‌کند؛ بلیت آنلاین یا در باجه ایستگاه قابل خرید است.' : 'National rail operator CFR Călători (cfrcalatori.ro) connects nearly all major cities; tickets can be bought online or at the station counter.'}</li>
                <li>{currentLang === 'fa' ? 'قطارهای اینترسیتی (IC) سریع‌تر و گران‌تر از قطارهای اینترریجیو (IR) هستند؛ رزرو صندلی برای IC توصیه می‌شود.' : 'InterCity (IC) trains are faster and pricier than InterRegio (IR) trains; seat reservation is recommended for IC.'}</li>
                <li>{currentLang === 'fa' ? 'شرکت خصوصی Softrans/دیگر اپراتورهای خصوصی هم روی برخی مسیرها فعالند و ممکن است ارزان‌تر باشند.' : 'Private operators also run on some routes and can be cheaper than CFR — worth comparing before booking.'}</li>
              </ul>
            </div>

            <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4">
              <h3 className="text-lg font-bold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm">4</span>
                <span>{currentLang === 'fa' ? 'اتوبوس بین‌شهری و بین‌المللی' : 'Intercity & International Coach'}</span>
              </h3>
              <ul className="space-y-2 text-sm text-[#526174] list-disc list-inside">
                <li>{currentLang === 'fa' ? 'FlixBus و BlaBlaCar Bus شبکه گسترده‌ای بین شهرهای رومانی و کشورهای همسایه (مجارستان، بلغارستان، صربستان، مولداوی) دارند؛ بلیت فقط آنلاین.' : 'FlixBus and BlaBlaCar Bus run extensive routes between Romanian cities and neighboring countries (Hungary, Bulgaria, Serbia, Moldova); tickets are booked online.'}</li>
                <li>{currentLang === 'fa' ? 'هر شهر معمولاً چند «اتوگارا» (ترمینال اتوبوس بین‌شهری) محلی هم دارد که اپراتورهای منطقه‌ای کوچک‌تر از آنجا حرکت می‌کنند — نام و آدرس دقیق هر ترمینال در صفحه راهنمای همان شهر آمده است.' : 'Each city also has one or more local "autogara" (intercity coach terminals) used by smaller regional operators — the exact name and address for each city is listed on that city\'s guide page.'}</li>
                <li><span className="text-[11px] italic text-slate-400">{currentLang === 'fa' ? 'ساعت حرکت و قیمت بلیت به‌طور مکرر تغییر می‌کند؛ همیشه از سایت رسمی اپراتور استعلام بگیرید.' : 'Departure times and fares change frequently; always check the operator\'s official site before travel.'}</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <h3 className="text-xl font-bold text-[#1e293b] mb-6 border-b border-[#cbd5e1] pb-2">
              {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'آیا رومانی کارت حمل‌ونقل یکپارچه سراسری دارد؟' : 'Does Romania have one nationwide transit card?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'خیر؛ هر شهر اپراتور و کارت/اپلیکیشن بلیت جداگانه خودش را دارد. برای قطار بین‌شهری، بلیت CFR جداست و ارتباطی به کارت شهری ندارد.' : 'No; each city has its own operator and ticket card/app. Intercity rail tickets (CFR) are separate and unrelated to any city transit card.'}</p>
              </div>
              <div>
                <h4 className="font-bold text-[#334155] mb-2">{currentLang === 'fa' ? 'کدام گزینه برای سفر بین شهرهای نزدیک ارزان‌تر است، قطار یا اتوبوس؟' : 'Which is cheaper for travel between nearby cities, train or bus?'}</h4>
                <p className="text-sm text-[#475569]">{currentLang === 'fa' ? 'برای مسیرهای کوتاه‌تر، اتوبوس‌های خصوصی معمولاً ارزان‌تر و گاهی سریع‌تر از قطار اینترریجیو هستند؛ برای مسیرهای طولانی‌تر بین شهرهای بزرگ، قطار اینترسیتی معمولاً راحت‌تر و قابل‌اعتمادتر است.' : 'For shorter routes, private coaches are often cheaper and sometimes faster than InterRegio trains; for longer routes between major cities, InterCity trains are usually more comfortable and reliable.'}</p>
              </div>
            </div>
          </div>

          <FaqSchema items={[
            {
              q: currentLang === 'fa' ? 'آیا رومانی کارت حمل‌ونقل یکپارچه سراسری دارد؟' : 'Does Romania have one nationwide transit card?',
              a: currentLang === 'fa' ? 'خیر؛ هر شهر اپراتور و کارت/اپلیکیشن بلیت جداگانه خودش را دارد. برای قطار بین‌شهری، بلیت CFR جداست و ارتباطی به کارت شهری ندارد.' : 'No; each city has its own operator and ticket card/app. Intercity rail tickets (CFR) are separate and unrelated to any city transit card.'
            },
            {
              q: currentLang === 'fa' ? 'کدام گزینه برای سفر بین شهرهای نزدیک ارزان‌تر است، قطار یا اتوبوس؟' : 'Which is cheaper for travel between nearby cities, train or bus?',
              a: currentLang === 'fa' ? 'برای مسیرهای کوتاه‌تر، اتوبوس‌های خصوصی معمولاً ارزان‌تر و گاهی سریع‌تر از قطار اینترریجیو هستند؛ برای مسیرهای طولانی‌تر بین شهرهای بزرگ، قطار اینترسیتی معمولاً راحت‌تر و قابل‌اعتمادتر است.' : 'For shorter routes, private coaches are often cheaper and sometimes faster than InterRegio trains; for longer routes between major cities, InterCity trains are usually more comfortable and reliable.'
            }
          ]} />

          <ParentHubFooterCard slugRoute="needs/transportation" currentLang={currentLang} onNavigate={onNavigate} />
        </div>
      );

    default:
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <p>Guide not found.</p>
        </div>
      );
  }
};
