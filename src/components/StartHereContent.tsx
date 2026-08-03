'use client';

import React from 'react';
import { Language } from '../types';
import { Button } from './Button';
import { ArrowRight, ArrowLeft } from './Icons';

interface StartHereContentProps {
  subRoute: string;
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const StartHereContent: React.FC<StartHereContentProps> = ({
  subRoute,
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  const disclaimer = currentLang === 'fa' 
    ? 'این مورد باید بر اساس مقررات جاری و شرایط فردی بررسی شود.'
    : 'This must be verified based on current regulations and individual circumstances.';

  switch (subRoute) {
    case 'planning-to-come':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'قصد آمدن به رومانی دارم' : 'Planning to come to Romania'}
            </h1>
            <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' 
                ? 'چک‌لیست کلی مراحل پیش از سفر: تعیین مسیر (تحصیل، کار یا تجاری)، جمع‌آوری مدارک اولیه لازم، تفاوت انواع ویزا (به‌ویژه ویزای طولانی‌مدت نوع D)، و زمان‌بندی تقریبی فرآیند.'
                : 'General pre-departure checklist: defining your pathway (study, work, or business), required initial documents, visa types (especially Long-stay Type D), and estimated processing timelines.'}
            </p>
            <p className="text-slate-400 text-xs italic">{disclaimer}</p>
          </div>
          
          <div className="editorial-card p-6 bg-white border border-[#dfe6ef] space-y-4 text-center max-w-md">
             <h3 className="text-lg font-bold text-[#142033]">
                {currentLang === 'fa' ? 'نمی‌دانید از کجا شروع کنید؟' : 'Not sure where to start?'}
             </h3>
             <Button variant="primary" size="lg" onClick={onOpenEvaluationModal} rightIcon={<ArrowIcon size={16} />}>
                {currentLang === 'fa' ? 'فرم ارزیابی اولیه' : 'Initial Assessment Form'}
             </Button>
          </div>
        </div>
      );

    case 'just-arrived':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'به‌تازگی وارد شده‌ام' : 'Just arrived in Romania'}
            </h1>
            <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' 
                ? 'کارهای فوری بعد از ورود: ثبت‌نام آدرس محل اقامت، دریافت کد شناسایی (CNP در صورت تایید اقامت)، افتتاح حساب بانکی، خرید سیم‌کارت، و پیگیری مراحل بعدی دریافت کارت اقامت.'
                : 'Immediate tasks upon arrival: registering your address, obtaining a personal identification number (CNP upon residency approval), opening a bank account, getting a local SIM card, and proceeding with your residence permit issuance.'}
            </p>
            <p className="text-slate-400 text-xs italic">{disclaimer}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => onNavigate('start-here/first-three-days')}>
              {currentLang === 'fa' ? 'سه روز اول' : 'First 3 Days'}
            </Button>
            <Button variant="outline" onClick={() => onNavigate('start-here/first-month')}>
              {currentLang === 'fa' ? 'ماه اول' : 'First Month'}
            </Button>
          </div>
        </div>
      );

    case 'living-here':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'در رومانی زندگی می‌کنم' : 'Living in Romania'}
            </h1>
            <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' 
                ? 'منابع مفید برای مقیمان: تمدید اقامت، تغییر وضعیت اقامتی، دسترسی به خدمات ضروری و نیازها، و آشنایی با انجمن‌ها یا جامعه ایرانیان مستقر در کشور.'
                : 'Resources for residents: renewing your residence permit, changing immigration status, accessing essential services, and connecting with the Iranian community.'}
            </p>
            <p className="text-slate-400 text-xs italic">{disclaimer}</p>
          </div>
          <div>
            <Button variant="primary" onClick={() => onNavigate('needs')} rightIcon={<ArrowIcon size={16} />}>
              {currentLang === 'fa' ? 'رفتن به بخش نیازها در رومانی' : 'Go to Essentials in Romania'}
            </Button>
          </div>
        </div>
      );

    case 'pre-departure-checklist':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'چک‌لیست قبل از سفر' : 'Pre-departure Checklist'}
            </h1>
            <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' 
                ? 'چک‌لیست عملیاتی برای سفر به رومانی: همراه داشتن پاسپورت معتبر، ویزا یا تأییدیه اقامت، مدارک تحصیلی و کاری ترجمه‌شده و تأییدشده، تهیه بیمه مسافرتی معتبر، رزرو محل اقامت اولیه، و تبدیل ارز اولیه به یورو یا رون (RON).'
                : 'Practical checklist for traveling to Romania: carrying a valid passport, visa or residency approval, translated and certified academic/work documents, valid travel insurance, initial accommodation booking, and basic currency exchange.'}
            </p>
            <p className="text-slate-400 text-xs italic">{disclaimer}</p>
          </div>
        </div>
      );

    case 'first-three-days':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'سه روز اول' : 'First 3 Days'}
            </h1>
            <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' 
                ? 'اولویت‌های ضروری در ۷۲ ساعت نخست: تهیه سیم‌کارت محلی، تبدیل ارز محدود بر اساس نرخ رسمی (BNR)، سازماندهی حمل‌ونقل از فرودگاه به محل اقامت، اطلاع‌رسانی ورود به دانشگاه یا کارفرما، و تهیه غذا و نیازهای فوری.'
                : 'Crucial priorities in the first 72 hours: acquiring a local SIM card, limited currency exchange based on official BNR rates, arranging airport transportation, notifying your university or employer of your arrival, and securing food and immediate needs.'}
            </p>
            <p className="text-slate-400 text-xs italic">{disclaimer}</p>
          </div>
        </div>
      );

    case 'first-month':
      return (
        <div className="space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ماه اول' : 'First Month'}
            </h1>
            <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa' 
                ? 'اقدامات اساسی در ۳۰ روز نخست: ثبت رسمی آدرس محل سکونت نزد مقامات (IGI)، شروع فرآیند صدور کارت اقامت، افتتاح حساب بانکی کامل، آشنایی با سیستم حمل‌ونقل عمومی، و پیدا کردن پزشک خانواده یا بررسی وضعیت بیمه درمانی.'
                : 'Essential actions during your first 30 days: officially registering your residential address with IGI, starting the residence permit issuance process, opening a full bank account, familiarizing yourself with public transit, and finding a GP or checking health insurance.'}
            </p>
            <p className="text-slate-400 text-xs italic">{disclaimer}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
};
