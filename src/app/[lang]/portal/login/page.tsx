'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, CheckCircle, AlertCircle } from '@/components/Icons';

interface PortalLoginPageProps {
  params: { lang: Language };
}

function LoginForm({ currentLang }: { currentLang: Language }) {
  const isFa = currentLang === 'fa';
  const ArrowIcon = isFa ? ArrowLeft : ArrowRight;

  const searchParams = useSearchParams();
  const errorQuery = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [technicalError, setTechnicalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setTechnicalError(null);

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          flow: 'portal',
          lang: currentLang,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        console.error('[Portal Login] Magic link dispatch failed:', data);
        if (data?.error === 'rate_limit') {
          setTechnicalError(
            isFa
              ? (data.message || 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً یک دقیقه صبر نموده و مجدداً تلاش فرمایید.')
              : 'Too many requests. Please wait a minute before requesting another link.'
          );
        } else {
          setTechnicalError(
            isFa
              ? 'متاسفانه در برقراری ارتباط با سامانه ورود مشکلی پیش آمد. لطفاً اتصال اینترنت خود را بررسی نموده و مجدداً تلاش فرمایید.'
              : 'A technical issue occurred while sending the login link. Please check your connection and try again.'
          );
        }
      } else {
        // Genuine success or non-revealing generic response
        setSubmitted(true);
      }
    } catch (err) {
      console.error('[Portal Login] Unexpected error:', err);
      setTechnicalError(
        isFa
          ? 'خطای ارتباط با سرور رخ داد. لطفاً دوباره تلاش کنید.'
          : 'Network error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#f7f9fc] via-white to-[#f7f9fc]" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white border border-[#dfe6ef] rounded-3xl shadow-xl p-8 sm:p-10 space-y-8 animate-fadeIn">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <Image
              src="/images/logo/dorvia-logo-standard-transparent-3000.png"
              alt="DORVIA EUROP"
              width={3000}
              height={679}
              priority
              className="h-9 w-auto mx-auto"
            />
          </Link>
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 bg-blue-50 border border-blue-200 text-[#2F6FED] rounded-full text-xs font-bold">
            <ShieldCheck size={14} />
            <span>{isFa ? 'پورتال اختصاصی متقاضیان' : 'Applicant Portal'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#142033]">
            {isFa ? 'ورود به پورتال پرونده' : 'Sign in to your Case Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
            {isFa
              ? 'ورود امن از طریق لینک ایمیل مستقیم (بدون نیاز به تعیین یا به‌خاطرسپاری رمز عبور).'
              : 'Secure access via magic link delivered directly to your email without passwords.'}
          </p>
        </div>

        {/* Error Notification (from URL redirect) */}
        {errorQuery && !submitted && !technicalError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start space-x-2.5 rtl:space-x-reverse">
            <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">
                {isFa ? 'خطا در احراز هویت' : 'Authentication Notice'}
              </span>
              <p className="text-xs text-amber-800 leading-relaxed">
                {errorQuery === 'invalid_or_expired_link'
                  ? (isFa ? 'لینک ورود منقضی یا نامعتبر است. لطفاً ایمیل خود را برای دریافت لینک جدید وارد کنید.' : 'The login link is invalid or has expired. Please request a new one below.')
                  : (isFa ? 'حساب کاربری یا دعوت‌نامه معتبری برای این شناسه یافت نشد. لطفاً با تیم DORVIA تماس بگیرید.' : 'No active invitation was found. Please contact the DORVIA team.')}
              </p>
            </div>
          </div>
        )}

        {/* Technical Error Notification */}
        {technicalError && !submitted && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start space-x-2.5 rtl:space-x-reverse animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">
                {isFa ? 'خطا در برقراری ارتباط' : 'Communication Error'}
              </span>
              <p className="text-xs text-rose-800 leading-relaxed">
                {technicalError}
              </p>
            </div>
          </div>
        )}

        {/* Form Body or Success Confirmation */}
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
              <CheckCircle size={26} />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-emerald-900 text-base">
                {isFa ? 'لینک ورود ارسال شد' : 'Magic Link Dispatched'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                {isFa
                  ? 'اگر این ایمیل در سیستم ما ثبت و دعوت شده باشد، یک لینک ورود امن برایش ارسال شد. لطفاً صندوق ورودی و پوشه هرزنامه (Spam) خود را بررسی کنید.'
                  : 'If this email is registered with us, a login link has been sent. Please check your inbox and spam folder.'}
              </p>
            </div>
            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="inline-block text-xs font-bold text-[#2F6FED] hover:underline cursor-pointer pt-2"
            >
              {isFa ? 'ورود با ایمیل دیگر ←' : 'Try another email →'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-[#142033]">
                {isFa ? 'آدرس ایمیل ثبت‌شده شما:' : 'Your registered email address:'}
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-[#dfe6ef] text-sm text-[#142033] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F6FED] focus:border-transparent transition-all"
                />
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-500">
                {isFa
                  ? 'تنها متقاضیانی که فرم ارزیابی را تکمیل و دعوت‌نامه دریافت کرده‌اند مجاز به ورود هستند.'
                  : 'Only invited applicants with completed assessments are eligible to enter.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-60 cursor-pointer"
            >
              <span>
                {loading
                  ? (isFa ? 'در حال ارسال درخواست...' : 'Dispatching link...')
                  : (isFa ? 'ارسال لینک اختصاصی ورود' : 'Send Login Link')}
              </span>
              {!loading && <ArrowIcon size={16} />}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-[#dfe6ef] flex items-center justify-between text-xs text-[#526174]">
          <Link href="/" className="hover:text-[#2F6FED] transition-colors flex items-center space-x-1.5 rtl:space-x-reverse font-semibold">
            <span>{isFa ? '← بازگشت به صفحه اصلی' : '← Back to Home'}</span>
          </Link>
          <Link href="/assessment" className="hover:text-[#2F6FED] transition-colors font-semibold">
            {isFa ? 'فرم ارزیابی اولیه PathFinder' : 'Start PathFinder'}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function PortalLoginPage({ params }: PortalLoginPageProps) {
  const currentLang = params.lang || 'fa';
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm currentLang={currentLang} />
    </Suspense>
  );
}

