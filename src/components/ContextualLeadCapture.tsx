'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { CheckCircle, ShieldCheck, ArrowLeft, ArrowRight, LockKeyhole } from './Icons';

interface ContextualLeadCaptureProps {
  topic: 'driving-license' | 'first-days-checklist' | 'banking' | 'study' | 'work' | 'housing' | 'general';
  currentLang: Language;
  className?: string;
  onOpenEvaluationModal?: () => void;
}

export const ContextualLeadCapture: React.FC<ContextualLeadCaptureProps> = ({
  topic,
  currentLang,
  className = '',
  onOpenEvaluationModal
}) => {
  const isFa = currentLang === 'fa';
  const ArrowIcon = isFa ? ArrowLeft : ArrowRight;

  const [contactInput, setContactInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const titles: Record<string, { fa: string; en: string }> = {
    'driving-license': {
      fa: 'درخواست راهنمایی اختصاصی پرونده گواهینامه رانندگی',
      en: 'Request Personalized Driving License Assistance'
    },
    'first-days-checklist': {
      fa: 'دریافت چک‌لیست کامل ورود و همراهی در استقرار اولیه',
      en: 'Get Full Arrival Checklist & Initial Relocation Guidance'
    },
    'banking': {
      fa: 'مشاوره بازگشایی حساب بانکی و انتقال قانونی سرمایه',
      en: 'Bank Account Setup & Legal Fund Transfer Advisory'
    },
    'study': {
      fa: 'ارزیابی شانس قبولی و دریافت چک‌لیست پذیرش دانشگاه‌ها',
      en: 'Evaluate Admission Eligibility & University Checklist'
    },
    'work': {
      fa: 'بررسی مدارک برای اخذ پیشنهاد کاری و مجوز Aviz de Munca',
      en: 'Job Offer & Work Authorization (Aviz de Munca) Review'
    },
    'housing': {
      fa: 'راهنمایی تنظیم و ثبت قرارداد اجاره مسکن در رومانی',
      en: 'Lease Contract & Rental Registration Support'
    },
    'general': {
      fa: 'دریافت آخرین به‌روزرسانی‌های قوانین اقامتی و مشاوره اولیه',
      en: 'Get Latest Immigration Regulatory Updates & Case Review'
    }
  };

  const subtitles: Record<string, { fa: string; en: string }> = {
    'driving-license': {
      fa: 'شماره واتس‌اپ یا ایمیل خود را وارد کنید تا کارشناسان دورویا مدارک شما را برای تبدیل یا صدور گواهینامه بررسی کنند.',
      en: 'Enter your WhatsApp or email so our specialists can review your driver credentials.'
    },
    'first-days-checklist': {
      fa: 'شماره تماس یا ایمیل خود را ثبت کنید تا چک‌لیست کامل و نکات عملیاتی به رایگان برای شما ارسال شود.',
      en: 'Submit your contact info to receive our verified arrival checklist and operational tips.'
    },
    'banking': {
      fa: 'با ثبت درخواست، کارشناسان ما آخرین شرایط شعب بانکی و مدارک لازم برای اتباع ایرانی را با شما به اشتراک می‌گذارند.',
      en: 'Submit your request for real-time bank branch compliance updates and required documentation.'
    },
    'study': {
      fa: 'اطلاعات تماس خود را وارد کنید تا راهنمای پذیرش رشته و دانشگاه مدنظرتان را بررسی و ارسال کنیم.',
      en: 'Enter your contact info to receive program-specific admission guidelines.'
    },
    'work': {
      fa: 'اطلاعات خود را وارد کنید تا کارشناسان کاریابی و قوانین کار رومانی شرایط شما را ارزیابی کنند.',
      en: 'Enter your contact details for an initial work permit eligibility review.'
    },
    'housing': {
      fa: 'راهنمای نمونه قرارداد و نکات پیشگیری از تخلفات اجاره را در ایمیل یا واتس‌اپ خود دریافت کنید.',
      en: 'Receive verified lease templates and tenant safety recommendations.'
    },
    'general': {
      fa: 'عضویت در خبرنامه حقوقی و دریافت بررسی اولیه رایگان شرایط شما توسط کارشناسان دورویا.',
      en: 'Join our regulatory newsletter and receive a free preliminary profile assessment.'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim() || !fullName.trim()) {
      setErrorMsg(
        isFa
          ? 'لطفاً نام کامل و راه ارتباطی (ایمیل یا واتس‌اپ) را وارد کنید.'
          : 'Please enter your full name and contact information.'
      );
      return;
    }

    if (!privacyConsent) {
      setErrorMsg(
        isFa
          ? 'لطفاً موافقت با بررسی مشاوره را تایید کنید.'
          : 'Please accept privacy terms to continue.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const isEmail = contactInput.includes('@');
      const payload = {
        fullName,
        email: isEmail ? contactInput : undefined,
        phone: !isEmail ? contactInput : undefined,
        mainGoal: topic,
        message: `Contextual Lead Capture on [${topic}]: ${contactInput}`,
        privacyConsent: true,
        marketingConsent: true,
      };

      const res = await fetch('/api/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed');

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch {
      setIsSubmitting(false);
      setErrorMsg(
        isFa
          ? 'متاسفانه در ارسال درخواست خطایی رخ داد. لطفاً دوباره تلاش کنید.'
          : 'Submission error. Please try again.'
      );
    }
  };

  const resolvedTitle = titles[topic] || titles.general;
  const resolvedSubtitle = subtitles[topic] || subtitles.general;

  return (
    <div
      className={`my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B224E] to-[#071735] text-white shadow-xl border border-blue-900/50 ${
        isFa ? 'text-right rtl' : 'text-left ltr'
      } ${className}`}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header with Topic Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED]/25 text-[#7FA8F7] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#2F6FED]/40 w-fit">
            <span>✨</span>
            <span>{isFa ? 'خدمت مشاوره‌ای و خبرنامه تخصصی' : 'Advisory & Dedicated Updates'}</span>
          </div>

          <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-slate-400">
            <LockKeyhole size={13} className="text-emerald-400" />
            <span>{isFa ? 'حریم خصوصی محفوظ و بدون اسپم' : 'Strictly Private & Zero Spam'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            {resolvedTitle[currentLang]}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {resolvedSubtitle[currentLang]}
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center space-x-3.5 rtl:space-x-reverse animate-fadeIn">
            <CheckCircle size={28} className="text-emerald-400 shrink-0" />
            <div className="space-y-1 text-xs sm:text-sm">
              <h4 className="font-bold text-white">
                {isFa ? 'درخواست شما با موفقیت ثبت شد!' : 'Your request has been submitted successfully!'}
              </h4>
              <p className="text-emerald-300/90 leading-relaxed">
                {isFa
                  ? 'کارشناسان دورویا ظرف ۲۴ ساعت کاری با شما از طریق واتس‌اپ یا ایمیل تماس خواهند گرفت.'
                  : 'Our advisors will follow up with you within 24 business hours.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isFa ? 'نام و نام خانوادگی شما' : 'Your Full Name'}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#5B93F5] transition-colors"
                />
              </div>

              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  placeholder={isFa ? 'شماره واتس‌اپ یا ایمیل' : 'WhatsApp or Email'}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#5B93F5] transition-colors"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 px-4 bg-[#2F6FED] hover:bg-[#2052b6] disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{isFa ? 'در حال ثبت...' : 'Sending...'}</span>
                  ) : (
                    <>
                      <span>{isFa ? 'ثبت درخواست' : 'Get Guidance'}</span>
                      <ArrowIcon size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-300 font-semibold">{errorMsg}</p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-400 pt-1">
              <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="rounded border-slate-600 bg-white/10 text-[#2F6FED] focus:ring-0"
                />
                <span>
                  {isFa
                    ? 'با قوانین حریم خصوصی و دریافت مشاوره DORVIA موافقم.'
                    : 'I agree to the privacy policy and case review terms.'}
                </span>
              </label>

              {onOpenEvaluationModal && (
                <button
                  type="button"
                  onClick={onOpenEvaluationModal}
                  className="text-[#7FA8F7] hover:underline font-bold"
                >
                  {isFa ? '🔎 تکمیل ارزیابی چندمرحله‌ای جامع' : '🔎 Full Assessment Form'}
                </button>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
