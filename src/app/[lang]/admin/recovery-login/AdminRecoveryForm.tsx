'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { ArrowLeft, ArrowRight, Mail, AlertCircle, KeyRound, LockKeyhole } from '@/components/Icons';

interface AdminRecoveryFormProps {
  currentLang: Language;
}

export default function AdminRecoveryForm({ currentLang }: AdminRecoveryFormProps) {
  const isFa = currentLang === 'fa';
  const ArrowIcon = isFa ? ArrowLeft : ArrowRight;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || loading) return;

    setLoading(true);
    setErrorMessage(null);
    setErrorType(null);

    try {
      const res = await fetch('/api/auth/admin-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          lang: currentLang,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setErrorType(data?.error || 'error');
        if (data?.error === 'rate_limit') {
          setErrorMessage(
            data?.message ||
              (isFa
                ? 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً ۱۵ دقیقه دیگر مجدداً تلاش فرمایید.'
                : 'Too many recovery attempts. Please try again in 15 minutes.')
          );
        } else if (data?.error === 'unauthorized') {
          setErrorMessage(
            data?.message ||
              (isFa
                ? 'این حساب کاربری دسترسی معتبری به عنوان مدیر ندارد.'
                : 'This account is not authorized for DORVIA administration.')
          );
        } else if (data?.error === 'invalid_credentials') {
          setErrorMessage(
            data?.message ||
              (isFa
                ? 'آدرس ایمیل یا گذرواژه بازیابی نادرست است.'
                : 'Invalid recovery email or password.')
          );
        } else {
          setErrorMessage(
            data?.message ||
              (isFa
                ? 'خطای فنی در برقراری ارتباط رخ داد. لطفاً دوباره تلاش فرمایید.'
                : 'A technical issue occurred. Please try again.')
          );
        }
      } else if (data?.redirectTo) {
        // Successful authentication: navigate immediately using window.location.replace
        // so this emergency recovery submission is not retained in browser back-history.
        window.location.replace(data.redirectTo);
      }
    } catch (err) {
      console.error('[Admin Recovery] Network/client error:', err);
      setErrorType('network');
      setErrorMessage(
        isFa
          ? 'خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی نمایید.'
          : 'Network error occurred. Please verify your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#0a1628] via-[#071322] to-[#040d18] text-white"
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md bg-[#0d1e38] border border-amber-900/40 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-8 animate-fadeIn">
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

          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-xs font-bold">
            <KeyRound size={14} />
            <span>{isFa ? 'مسیر بازیابی اضطراری پنل مدیریت' : 'Emergency Admin Recovery Access'}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {isFa ? 'ورود با گذرواژه اضطراری' : 'Emergency Recovery Login'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isFa
              ? 'این درگاه صرفاً در شرایط اضطراری (عدم دسترسی به ایمیل یا لینک جادویی) برای مدیران فعال در سامانه طراحی شده است.'
              : 'This endpoint is strictly reserved for active administrators when magic-link email delivery is unavailable.'}
          </p>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start space-x-2.5 rtl:space-x-reverse animate-fadeIn ${
              errorType === 'rate_limit'
                ? 'bg-amber-950/80 border-amber-800 text-amber-200'
                : 'bg-rose-950/80 border-rose-800 text-rose-200'
            }`}
          >
            <AlertCircle
              size={18}
              className={`shrink-0 mt-0.5 ${
                errorType === 'rate_limit' ? 'text-amber-400' : 'text-rose-400'
              }`}
            />
            <div className="space-y-1">
              <span className="font-bold">
                {errorType === 'rate_limit'
                  ? isFa
                    ? 'محدودیت تعداد تلاش'
                    : 'Rate Limit Exceeded'
                  : isFa
                  ? 'خطا در احراز هویت'
                  : 'Authentication Error'}
              </span>
              <p className="text-xs leading-relaxed opacity-90">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Recovery Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="recovery-email" className="block text-xs font-bold text-slate-200">
              {isFa ? 'آدرس ایمیل مدیر فعال:' : 'Authorized administrator email:'}
            </label>
            <div className="relative">
              <input
                id="recovery-email"
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
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="recovery-password" className="block text-xs font-bold text-slate-200">
              {isFa ? 'گذرواژه اختصاصی حساب:' : 'Account recovery password:'}
            </label>
            <div className="relative">
              <input
                id="recovery-password"
                type={showPassword ? 'text' : 'password'}
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pl-11 pr-11 rounded-xl bg-[#091526] border border-blue-900 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2F6FED] focus:border-transparent transition-all"
              />
              <LockKeyhole size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {isFa
                ? 'پسورد باید از قبل در حساب کاربری مدیریت تعریف شده باشد.'
                : 'Password must already be configured on the administrator user account.'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:from-amber-700 active:to-amber-800 text-white font-extrabold text-sm shadow-lg hover:shadow-amber-900/30 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-60 cursor-pointer"
          >
            <span>
              {loading
                ? isFa
                  ? 'در حال اعتبارسنجی نشست مدیریت...'
                  : 'Authenticating administrator...'
                : isFa
                ? 'ورود اضطراری به پنل'
                : 'Emergency Sign In'}
            </span>
            {!loading && <ArrowIcon size={16} />}
          </button>
        </form>

        {/* Footer Navigation: Back to standard login */}
        <div className="pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/admin/login"
            className="hover:text-amber-300 transition-colors flex items-center space-x-1.5 rtl:space-x-reverse font-semibold"
          >
            <span>{isFa ? '← بازگشت به ورود عادی با لینک ایمیل' : '← Standard magic-link login'}</span>
          </Link>
          <Link href="/" className="hover:text-slate-300 transition-colors font-semibold">
            {isFa ? 'صفحه اصلی' : 'Main Site'}
          </Link>
        </div>
      </div>
    </div>
  );
}
