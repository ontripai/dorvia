'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  Lock,
  Building2,
  FileText,
  User,
} from '@/components/Icons';

interface RequestAccessProps {
  params: { lang: Language };
}

export default function RequestAccessPage({ params }: RequestAccessProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [exchangeStatus, setExchangeStatus] = useState<string>('not_requested');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/portal/exchange/status');
      if (res.status === 401) {
        router.push(`/${currentLang}/portal/login`);
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.profile) {
        setExchangeStatus(data.profile.exchange_status || 'not_requested');
        if (data.profile.exchange_status === 'approved') {
          router.replace(`/${currentLang}/portal/exchange`);
        }
      }
    } catch (err) {
      console.error('Error fetching exchange status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRequestAccess = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/portal/exchange/request-access', {
        method: 'POST',
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(data?.error || (isFa ? 'خطا در ثبت درخواست دسترسی.' : 'Failed to request access.'));
        return;
      }

      setExchangeStatus(data.exchange_status || 'pending');
      setSuccessMessage(
        isFa
          ? 'درخواست دسترسی شما با موفقیت ثبت شد و مدارک پرونده در نوبت بررسی قرار گرفت.'
          : 'Your access request has been submitted successfully.'
      );
    } catch (err) {
      setErrorMessage(isFa ? 'خطای غیرمنتظره در ارسال درخواست.' : 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-300">
            {isFa ? 'در حال بررسی وضعیت دسترسی...' : 'Checking exchange access status...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 sm:p-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full space-y-8 pt-6 pb-12">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${currentLang}/portal/dashboard`}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            {isFa ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{isFa ? 'بازگشت به داشبورد' : 'Back to Dashboard'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {isFa ? 'پورتال تبادل ارز' : 'Exchange Portal'}
            </span>
          </div>
        </div>

        {/* Header Card */}
        <div className="bg-gradient-to-br from-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {isFa ? 'درخواست دسترسی به تبادل ارز' : 'Request Currency Exchange Access'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {isFa
                  ? 'خدمات همتا‌به‌همتای تبادل یورو و ریال ویژه متقاضیان و خانواده‌های تایید‌شده DORVIA'
                  : 'Peer-to-peer EUR and IRR currency exchange for verified DORVIA applicants'}
              </p>
            </div>
          </div>

          {/* Status Alert Banner */}
          {exchangeStatus === 'pending' && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-amber-300">
                  {isFa ? 'درخواست شما در حال بررسی است' : 'Application Under Review'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFa
                    ? 'کارشناسان تطبیق قوانین در حال بررسی مدارک هویتی و پرونده شما هستند. پس از تایید، بخش تبادل ارز به صورت خودکار در داشبورد شما فعال خواهد شد.'
                    : 'Our compliance team is verifying your identity and file documents. Once approved, the exchange section will automatically unlock in your dashboard.'}
                </p>
              </div>
            </div>
          )}

          {exchangeStatus === 'rejected' && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-rose-300">
                  {isFa ? 'درخواست دسترسی تایید نشد' : 'Access Request Rejected'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFa
                    ? 'مدارک ارائه شده کافی نبود یا شرایط لازم احراز نگردید. می‌توانید پس از بارگذاری مدارک کامل در بخش «مدارک من»، مجدداً درخواست دهید.'
                    : 'Your submitted credentials did not meet compliance criteria. Please upload complete documents and re-apply.'}
                </p>
              </div>
            </div>
          )}

          {exchangeStatus === 'suspended' && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Lock size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-rose-300">
                  {isFa ? 'حساب کاربری تبادل ارز تعلیق شده است' : 'Exchange Access Suspended'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFa
                    ? 'دسترسی به خدمات تبادل ارز برای این حساب به دلایل انضباطی یا پرونده معلق گردیده است. جهت پیگیری با پشتیبانی گفتگو نمایید.'
                    : 'Exchange privileges are temporarily suspended. Please reach out to support.'}
                </p>
              </div>
            </div>
          )}

          {/* Requirements Checklist */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-sm font-extrabold text-slate-200">
              {isFa ? 'مدارک و الزامات لازم جهت دریافت دسترسی:' : 'Prerequisites for Access Approval:'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <User size={18} />
                </div>
                <h4 className="text-xs font-bold text-white">
                  {isFa ? 'احراز هویت کامل' : 'Verified Identity'}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFa ? 'گذرنامه معتبر یا کارت شناسایی ثبت‌شده در پورتال' : 'Valid passport or national ID'}
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <h4 className="text-xs font-bold text-white">
                  {isFa ? 'حساب بانکی به نام خود' : 'Personal Bank Account'}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFa ? 'شماره شبا در ایران یا IBAN رومانی به نام متقاضی' : 'Active account in applicant’s legal name'}
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <h4 className="text-xs font-bold text-white">
                  {isFa ? 'پرونده فعال در دورویا' : 'Active DORVIA File'}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFa ? 'ثبت درخواست پذیرش تحصیلی، اقامت یا کاری' : 'Verified ongoing application file'}
                </p>
              </div>
            </div>
          </div>

          {/* Action / Submit button */}
          {(exchangeStatus === 'not_requested' || exchangeStatus === 'rejected') && (
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400 max-w-md">
                {isFa
                  ? 'با فشردن دکمه زیر، پرونده شما برای اخذ تاییدیه دسترسی به سامانه تبادل ارز ثبت خواهد شد.'
                  : 'Click below to submit your profile for currency exchange access verification.'}
              </p>
              <button
                type="button"
                onClick={handleRequestAccess}
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#2F6FED] hover:bg-blue-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle size={18} />
                )}
                <span>{isFa ? 'ثبت درخواست دسترسی' : 'Submit Access Request'}</span>
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 text-xs text-emerald-300">
              {successMessage}
            </div>
          )}

          {/* Terms / Legal Placeholder */}
          <div className="pt-4 text-xs text-slate-500 border-t border-slate-800/60">
            {/* TODO: [User Copy Review] - Legal terms of exchange service access, partner exchange custody policy, and compliance rules to be provided by owner */}
            <p className="italic text-[11px] text-slate-500">
              [TODO: متن رسمی شرایط و مقررات دسترسی به سامانه تبادل ارز — نگارش توسط صاحب پروژه]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
