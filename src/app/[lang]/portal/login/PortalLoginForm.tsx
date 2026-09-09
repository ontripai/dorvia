'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, CheckCircle, AlertCircle, KeyRound, Lock } from '@/components/Icons';

interface PortalLoginFormProps {
  currentLang: Language;
}

function LoginFormContent({ currentLang }: { currentLang: Language }) {
  const isFa = currentLang === 'fa';
  const ArrowIcon = isFa ? ArrowLeft : ArrowRight;

  const searchParams = useSearchParams();
  const errorQuery = searchParams.get('error');

  // Mode: 'magic' (default) or 'password'
  const [loginMode, setLoginMode] = useState<'magic' | 'password'>('magic');

  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [technicalError, setTechnicalError] = useState<string | null>(null);
  const [authenticatingToken, setAuthenticatingToken] = useState(false);

  // Auto-recovery: If user lands on /portal/login with #access_token=...
  // (e.g. from an old link or redirect preservation), exchange tokens and sign in automatically.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    if (hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken) {
        setAuthenticatingToken(true);
        fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            flow: 'portal',
            lang: currentLang,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.success && data?.redirectTo) {
              window.location.replace(data.redirectTo);
            } else {
              setAuthenticatingToken(false);
            }
          })
          .catch(() => {
            setAuthenticatingToken(false);
          });
      }
    }
  }, [currentLang]);

  // Handle Magic Link Submit
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
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

  // Handle Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || loading) return;

    setLoading(true);
    setTechnicalError(null);

    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          flow: 'portal',
          lang: currentLang,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        if (data?.error === 'invalid_credentials' || res.status === 401) {
          setTechnicalError(
            isFa
              ? 'ایمیل یا رمز عبور نادرست است.'
              : 'Invalid email or password.'
          );
        } else if (data?.error === 'account_not_found') {
          setTechnicalError(
            isFa
              ? 'حساب کاربری یا دعوت‌نامه معتبری برای این پرونده یافت نشد. لطفاً با پشتیبانی تماس بگیرید.'
              : 'No active invitation or case file linked to this account.'
          );
        } else {
          setTechnicalError(
            data?.message || (isFa ? 'خطا در احراز هویت. لطفاً دوباره تلاش کنید.' : 'Authentication failed. Please try again.')
          );
        }
        setLoading(false);
        return;
      }

      window.location.replace(data.redirectTo || `/${currentLang}/portal/dashboard`);
    } catch (err) {
      console.error('[Portal Login] Unexpected password auth exception:', err);
      setTechnicalError(
        isFa
          ? 'خطای ارتباط با سرور رخ داد. لطفاً دوباره تلاش کنید.'
          : 'Network error occurred. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#f7f9fc] via-white to-[#f7f9fc]" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white border border-[#dfe6ef] rounded-3xl shadow-xl p-8 sm:p-10 space-y-7 animate-fadeIn">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <Image
              src="/images/logo/dorvia-logo-primary-transparent-3000.png"
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
            {loginMode === 'magic'
              ? (isFa
                  ? 'ورود امن از طریق لینک ایمیل مستقیم (بدون نیاز به تعیین یا به‌خاطرسپاری رمز عبور).'
                  : 'Secure access via magic link delivered directly to your email without passwords.')
              : (isFa
                  ? 'ورود سریع با ایمیل و رمز عبوری که در پورتال تنظیم کرده‌اید.'
                  : 'Fast access using your registered email and portal password.')}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        {!submitted && (
          <div className="flex rounded-2xl bg-[#eef3f8] p-1 border border-[#dfe6ef]">
            <button
              type="button"
              onClick={() => {
                setLoginMode('magic');
                setTechnicalError(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse ${
                loginMode === 'magic'
                  ? 'bg-white text-[#2F6FED] shadow-sm border border-[#dfe6ef]'
                  : 'text-[#526174] hover:text-[#142033]'
              }`}
            >
              <Mail size={14} />
              <span>{isFa ? 'ورود با لینک ایمیل' : 'Magic Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('password');
                setTechnicalError(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 rtl:space-x-reverse ${
                loginMode === 'password'
                  ? 'bg-white text-[#2F6FED] shadow-sm border border-[#dfe6ef]'
                  : 'text-[#526174] hover:text-[#142033]'
              }`}
            >
              <KeyRound size={14} />
              <span>{isFa ? 'ورود با رمز عبور' : 'Password'}</span>
            </button>
          </div>
        )}

        {/* Token Auto-Recovery Notice */}
        {authenticatingToken && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-center space-x-3 rtl:space-x-reverse animate-fadeIn">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
            <span className="font-bold">
              {isFa ? 'در حال ورود به پورتال پرونده...' : 'Validating case session and logging in...'}
            </span>
          </div>
        )}

        {/* Error Notification (from URL redirect) */}
        {errorQuery && !submitted && !technicalError && !authenticatingToken && (
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
                {isFa ? 'خطا در ورود' : 'Sign-In Error'}
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
        ) : loginMode === 'magic' ? (
          /* MAGIC LINK FORM */
          <form onSubmit={handleMagicLinkSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="magic-email" className="block text-xs font-bold text-[#142033]">
                {isFa ? 'آدرس ایمیل ثبت‌شده شما:' : 'Your registered email address:'}
              </label>
              <div className="relative">
                <input
                  id="magic-email"
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
        ) : (
          /* PASSWORD FORM */
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="pwd-email" className="block text-xs font-bold text-[#142033]">
                {isFa ? 'آدرس ایمیل:' : 'Email address:'}
              </label>
              <div className="relative">
                <input
                  id="pwd-email"
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
            </div>

            <div className="space-y-2">
              <label htmlFor="pwd-password" className="block text-xs font-bold text-[#142033]">
                {isFa ? 'رمز عبور:' : 'Password:'}
              </label>
              <div className="relative">
                <input
                  id="pwd-password"
                  type="password"
                  required
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-[#dfe6ef] text-sm text-[#142033] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F6FED] focus:border-transparent transition-all"
                />
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {isFa
                    ? 'رمز عبوری که قبلاً در پورتال تنظیم کرده‌اید.'
                    : 'The password set inside your case portal.'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('magic');
                    setTechnicalError(null);
                  }}
                  className="text-[#2F6FED] hover:underline font-semibold cursor-pointer"
                >
                  {isFa ? 'ورود با لینک ایمیل' : 'Use Magic Link'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2F6FED] hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-60 cursor-pointer"
            >
              <span>
                {loading
                  ? (isFa ? 'در حال ورود...' : 'Signing in...')
                  : (isFa ? 'ورود به پورتال پرونده' : 'Sign in to Portal')}
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

export function PortalLoginForm({ currentLang }: PortalLoginFormProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginFormContent currentLang={currentLang} />
    </Suspense>
  );
}
