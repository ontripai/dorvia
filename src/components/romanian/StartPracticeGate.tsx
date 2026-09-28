'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  isFa: boolean;
  browseHref: string;
}

/**
 * دروازه‌ی شروع تمرین (dre-p188).
 *
 * یک دکمه، بدون ایمیل و بدون رمز. پشتش یک نشست ناشناس ساخته می‌شود و صفحه
 * دوباره از سرور رندر می‌شود؛ همان `getSignedInUserId` که تا حالا بود جواب
 * می‌دهد و بقیه‌ی حلقه بی‌تغییر کار می‌کند.
 *
 * صادق بودن درباره‌ی مرزش عمدی است: پیشرفت به همین مرورگر بند است. اگر
 * ننویسیم، کاربری که گوشی‌اش را عوض می‌کند فکر می‌کند داده‌اش گم شده.
 */
export function StartPracticeGate({ isFa, browseHref }: Props) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<'disabled' | 'failed' | null>(null);

  async function start() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/romanian/start', { method: 'POST' });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error === 'anonymous_disabled' ? 'disabled' : 'failed');
        return;
      }
      // نشست در کوکی نشسته است؛ رندر تازه‌ی سرور حالا کاربر را می‌بیند.
      router.refresh();
    } catch {
      setError('failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-5 text-center">
      <h1 className="text-2xl font-extrabold text-[#142033]">
        {isFa ? 'تمرین امروز را شروع کنید' : "Start today's practice"}
      </h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        {isFa
          ? 'تمرین هر واژه را درست وقتی که در آستانه‌ی فراموشی است دوباره نشان می‌دهد. برای همین باید پیشرفت شما را به خاطر بسپارد — ولی به ایمیل و رمز نیازی نیست.'
          : 'Practice brings each word back just as you are about to forget it, so it has to remember your progress — but it needs no email and no password.'}
      </p>

      <button
        type="button"
        onClick={start}
        disabled={pending}
        className="inline-block px-6 py-3 rounded-xl bg-[#1554bd] text-white text-sm font-bold hover:bg-[#0f3f8f] transition-colors disabled:opacity-60"
      >
        {pending
          ? isFa ? 'یک لحظه…' : 'One moment…'
          : isFa ? 'شروع تمرین' : 'Start practising'}
      </button>

      <p className="text-xs text-slate-400 leading-relaxed">
        {isFa
          ? 'پیشرفت شما روی همین مرورگر نگه داشته می‌شود. اگر بعداً خواستید آن را روی گوشی یا رایانه‌ی دیگری داشته باشید، امکان وصل‌کردن ایمیل اضافه می‌شود.'
          : 'Your progress is kept in this browser. If you later want it on another device, linking an email will be possible.'}
      </p>

      {error === 'disabled' && (
        /*
          این پیام برای کاربر است، ولی متنش عمداً کارِ سمت ما را هم می‌گوید:
          تنها چیزی که این صفحه لازم دارد و کد نیست، همان تنظیم پروژه است.
        */
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          {isFa
            ? 'تمرین هنوز فعال نشده است. کمی بعد دوباره سر بزنید.'
            : 'Practice is not switched on yet. Please check back shortly.'}
        </div>
      )}
      {error === 'failed' && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
          {isFa
            ? 'شروع نشد. اتصال را بررسی کنید و دوباره بزنید.'
            : 'Could not start. Check your connection and try again.'}
        </div>
      )}

      <div className="pt-1">
        <a href={browseHref} className="text-sm text-[#1554bd] font-semibold hover:underline">
          {isFa ? 'یا اول درس‌ها را ببینید' : 'Or browse the lessons first'}
        </a>
      </div>
    </div>
  );
}
