'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  Settings,
  Bell,
  Mail,
  Send,
  CheckCircle,
  LogOut,
  ArrowRight,
  ArrowLeft,
  LockKeyhole,
} from '@/components/Icons';

interface SettingsPageProps {
  params: { lang: Language };
}

export default function AdminSettingsPage({ params }: SettingsPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyTelegram, setNotifyTelegram] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setErrorMessage(null);
      const res = await fetch('/api/admin/me/notifications');
      if (res.status === 401) {
        router.replace(`/${currentLang}/admin/login`);
        return;
      }
      const data = await res.json();
      if (data.success && data.notifications) {
        setTelegramChatId(data.notifications.telegram_chat_id || '');
        setNotifyEmail(Boolean(data.notifications.notify_email));
        setNotifyTelegram(Boolean(data.notifications.notify_telegram));
      } else {
        setErrorMessage(data.error || (isFa ? 'خطا در بارگذاری تنظیمات.' : 'Failed to load settings.'));
      }
    } catch (err) {
      console.error('Error fetching notification settings:', err);
      setErrorMessage(isFa ? 'خطا در ارتباط با سرور.' : 'Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [currentLang]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace(`/${currentLang}/admin/login`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admin/me/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_chat_id: telegramChatId.trim() || null,
          notify_email: notifyEmail,
          notify_telegram: notifyTelegram,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          isFa ? 'تنظیمات اعلان‌ها با موفقیت ذخیره شد.' : 'Notification preferences saved successfully.'
        );
      } else {
        setErrorMessage(data.error || (isFa ? 'خطا در ذخیره تنظیمات.' : 'Failed to save settings.'));
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setErrorMessage(isFa ? 'خطا در ارتباط با سرور.' : 'Network connection error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#f7f9fc]">
        <div className="w-10 h-10 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs sm:text-sm text-[#526174] font-medium">
          {isFa ? 'در حال بارگذاری تنظیمات کاربری...' : 'Loading user settings...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8 sm:py-10" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="max-w-[840px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        
        {/* Top Header Bar */}
        <div className="bg-[#071B3D] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#0b2b55]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                <Settings size={13} />
                <span>{isFa ? 'تنظیمات شخصی پرسنل' : 'Personal Staff Preferences'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isFa ? 'کانال‌های دریافت اعلان و پیام' : 'Notification Channels'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              {isFa
                ? 'تنظیم نحوه دریافت رویدادهای پرونده، پیام‌های متقاضیان و هشدارهای روزانه.'
                : 'Configure how you receive case updates, client messages, and daily system alerts.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <span>{isFa ? 'پرونده‌ها' : 'Case Files'}</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold border border-red-500/30 transition-all cursor-pointer"
            >
              <LogOut size={15} />
              <span>{isFa ? 'خروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">✕</button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-between">
            <span>✓ {successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-800">✕</button>
          </div>
        )}

        {/* Settings Form Card */}
        <form onSubmit={handleSave} className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Email Notification Channel */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2F6FED] flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#142033]">
                  {isFa ? 'دریافت اعلان‌های ایمیلی' : 'Email Notifications'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  {isFa
                    ? 'ارسال ایمیل به محض ورود متقاضی جدید، ارسال مدرک، یا پیام متقاضی در پرونده‌های تحت نظارت شما.'
                    : 'Receive transactional emails for new leads, uploaded documents, or client messages.'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-2">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2F6FED]"></div>
            </label>
          </div>

          {/* Telegram Notification Channel */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Send size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#142033]">
                  {isFa ? 'دریافت اعلان‌های تلگرام' : 'Telegram Bot Notifications'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  {isFa
                    ? 'دریافت هشدارهای فوری و اعلان‌های پرونده مستقیماً روی حساب تلگرام کاری شما.'
                    : 'Receive real-time instant alerts directly to your personal Telegram.'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-2">
              <input
                type="checkbox"
                checked={notifyTelegram}
                onChange={(e) => setNotifyTelegram(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2F6FED]"></div>
            </label>
          </div>

          {/* Telegram Chat ID Input & Instructions */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              {isFa ? 'شناسه عددی تلگرام (Chat ID)' : 'Telegram Numeric Chat ID'}
            </label>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                placeholder="123456789"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:border-[#2F6FED] focus:outline-none transition-colors"
              />
            </div>

            {/* Explanatory instruction box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <span className="font-bold text-[#142033] block">
                {isFa ? '💡 نحوه به‌دست آوردن شناسه عددی تلگرام:' : '💡 How to retrieve your Telegram Chat ID:'}
              </span>
              <p>
                {isFa
                  ? '۱. در تلگرام به ربات رسمی شرکت پیام دهید یا دستور /myid را ارسال کنید.'
                  : '1. Message the official company bot or send the /myid command.'}
              </p>
              <p>
                {isFa
                  ? '۲. در صورتی که ربات داخلی در دسترس نیست، می‌توانید به ربات شناسه کاربری (مانند @userinfobot) پیام دهید تا عدد شناسه (ID) شما را نشان دهد.'
                  : '2. Alternatively, message an identity helper bot like @userinfobot to view your numeric Telegram ID.'}
              </p>
              <p>
                {isFa
                  ? '۳. این عدد را در کادر بالا وارد کرده و کلید «ذخیره تنظیمات» را بزنید.'
                  : '3. Enter this numeric ID above and click Save Preferences.'}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#2F6FED] hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 rtl:space-x-reverse cursor-pointer disabled:opacity-50"
            >
              <CheckCircle size={16} />
              <span>{saving ? (isFa ? 'در حال ذخیره‌سازی...' : 'Saving...') : (isFa ? 'ذخیره تنظیمات' : 'Save Preferences')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
