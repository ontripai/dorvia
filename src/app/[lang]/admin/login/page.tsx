'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, CheckCircle, AlertCircle, LockKeyhole } from '@/components/Icons';

interface AdminLoginPageProps {
  params: { lang: Language };
}

function AdminLoginForm({ currentLang }: { currentLang: Language }) {
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
          flow: 'admin',
          lang: currentLang,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        console.error('[Admin Login] Magic link dispatch failed:', data);
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
      console.error('[Admin Login] Unexpected error:', err);
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#0a1628] via-[#071322] to-[#040d18] text-white" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-[#0d1e38] border border-blue-900/60 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-8 animate-fadeIn">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <Image
              src="/images/logo/dorvia-logo-standard-transparent-3000.png"
              alt="DORVIA EUROP"
              width={3000}
              height={679}
              priority
              className="h-9 w-auto mx-auto brightness-200 contrast-125"
            />
          </Link>
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded-full text-xs font-bold">
            <LockKeyhole size={14} />
            <span>{isFa ? 'پنل مدیریت داخلی DORVIA' : 'DORVIA Internal Admin'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {isFa ? 'ورود مدیران و مشاورین' : 'Staff & Advisor Login'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isFa
              ? 'ورود دو مرحله‌ای و ایمن از طریق لینک اختصاصی ارسالی به ایمیل سازمانی.'
              : 'Secure passwordless login via administrative magic link sent to your authorized email.'}
          </p>
        </div>

        {/* Error Notification from URL */}
        {errorQuery && !submitted && !technicalError && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-start space-x-2.5 rtl:space-x-reverse">
            <AlertCircle size={18} className="shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">
                {isFa ? 'عدم دسترسی به پنل مدیریت' : 'Access Denied'}
              </span>
              <p className="text-xs text-rose-300 leading-relaxed">
                {errorQuery === 'unauthorized'
                  ? (isFa ? 'این حساب کاربری دسترسی معتبری به پنل مدیریت DORVIA ندارد.' : 'This account is not authorized for DORVIA administration.')
                  : (isFa ? 'لینک ورود نامعتبر یا منقضی شده است.' : 'The login link is invalid or has expired.')}
              </p>
            </div>
          </div>
        )}

        {/* Technical Error Notification from Form Submission */}
        {technicalError && !submitted && (
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs sm:text-sm flex items-start space-x-2.5 rtl:space-x-reverse animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">
                {isFa ? 'خطا در ارتباط با سرور' : 'Communication Error'}
              </span>
              <p className="text-xs text-amber-300 leading-relaxed">
                {technicalError}
              </p>
            </div>
          </div>
        )}

        {/* Form Body or Success Confirmation */}
        {submitted ? (
          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 bg-emerald-900 text-emerald-300 rounded-full flex items-center justify-center mx-auto text-xl">
              <CheckCircle size={26} />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-emerald-200 text-base">
                {isFa ? 'لینک ورود ارسال شد' : 'Magic Link Sent'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-300/90 leading-relaxed">
                {isFa
                  ? 'اگر این ایمیل به عنوان مدیر یا مشاور در سامانه ثبت شده باشد، لینک ورود امن برای شما ارسال گردید.'
                  : 'If this email belongs to an authorized staff member, a secure login link has been dispatched.'}
              </p>
            </div>
            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="inline-block text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer pt-2"
            >
              {isFa ? 'ورود با ایمیل دیگر ←' : 'Try another email →'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="block text-xs font-bold text-slate-200">
                {isFa ? 'آدرس ایمیل سازمانی شما:' : 'Authorized staff email:'}
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoFocus
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dorvia.com"
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-[#091526] border border-blue-900 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2F6FED] focus:border-transparent transition-all"
                />
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                {isFa
                  ? 'تنها پرسنل دارای نقش در سامانه احراز هویت مجاز به ورود می‌باشند.'
                  : 'Only authorized team members with active roles are permitted.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-600 active:bg-blue-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-60 cursor-pointer"
            >
              <span>
                {loading
                  ? (isFa ? 'در حال بررسی...' : 'Dispatching...')
                  : (isFa ? 'ارسال لینک ورود به پنل' : 'Send Admin Login Link')}
              </span>
              {!loading && <ArrowIcon size={16} />}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-blue-900/50 flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="hover:text-blue-300 transition-colors flex items-center space-x-1.5 rtl:space-x-reverse font-semibold">
            <span>{isFa ? '← صفحه اصلی سایت' : '← Main Site'}</span>
          </Link>
          <Link href="/portal/login" className="hover:text-blue-300 transition-colors font-semibold">
            {isFa ? 'پورتال متقاضیان' : 'Applicant Portal'}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function AdminLoginPage({ params }: AdminLoginPageProps) {
  const currentLang = params.lang || 'fa';
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center bg-[#071322]">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AdminLoginForm currentLang={currentLang} />
    </Suspense>
  );
}
