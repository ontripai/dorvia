import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

/**
 * شروع تمرین — ساخت یک نشست ناشناس (dre-p188).
 *
 * ### چرا ناشناس و نه ورود با ایمیل
 * مسیر ورود موجود (`/api/auth/magic-link` + `portal/callback`) عمداً فقط با
 * دعوت کار می‌کند: `shouldCreateUser: false`، و کال‌بک هر کسی را که سطر `leads`
 * با `invited_at` ندارد `signOut` می‌کند. یادگیرنده‌ی رومانیایی مخاطب آن نیست.
 *
 * باز کردن ثبت‌نام عمومی روی همان مسیر یک خطر مشخص داشت: ایمیل‌های ورود از
 * سهمیه‌ی ایمیل Supabase می‌روند، و یک هجوم ثبت‌نام می‌توانست **ایمیل ورود
 * مشتریان پرونده** را هم بخواباند. نشست ناشناس هیچ ایمیلی نمی‌فرستد، پس مسیر
 * احراز هویت پورتال کاملاً دست‌نخورده می‌ماند.
 *
 * ### چرا چیزی در دیتابیس لازم نبود
 * هر پنج سیاست RLS این ماژول فقط روی `auth.uid()` تکیه دارند و هیچ‌کدام ایمیل
 * را نمی‌بینند (سنجیده شد، روی خود دیتابیس). کاربر ناشناس `auth.uid()` دارد و
 * سطری در `auth.users`، پس `romanian_learners` و بقیه بدون تغییر کار می‌کنند.
 *
 * ### محدودسازی نرخ
 * اینجا محدودساز دستی **نگذاشتم**، و این یک انتخاب است نه فراموشی: روی سرورلس،
 * شمارنده‌ی درون‌حافظه‌ای per-instance است و آرامش خیالِ دروغ می‌دهد. سقف واقعی
 * همان محدودساز خودِ Supabase برای ورود ناشناس است (تنظیم پروژه، پیش‌فرض
 * محدود به IP). اگر روزی این عدد کم بود، جای درستش همان تنظیم است یا یک
 * محدودساز مشترک (KV)، نه یک شمارنده‌ی محلی.
 */
export async function POST() {
  const supabase = createServerComponentClient();

  // اگر از قبل نشستی هست — ناشناس یا واقعی — کاربر تازه‌ای ساخته نمی‌شود.
  // بدون این، هر بار زدن دکمه یک سطر تازه در `auth.users` می‌گذاشت.
  const { data: existing } = await supabase.auth.getUser();
  if (existing?.user) {
    return NextResponse.json({ ok: true, created: false });
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    /*
      حالت «ورود ناشناس در پروژه فعال نیست» باید **به اسم** گزارش شود. اگر با
      بقیه‌ی خطاها یکی می‌شد، تنها تنظیمی که این صفحه لازم دارد می‌توانست
      ساعت‌ها پشت پیام «خطای فنی» پنهان بماند.
    */
    const code = (error as { code?: string }).code ?? '';
    const disabled =
      code === 'anonymous_provider_disabled' ||
      /anonymous/i.test(error.message ?? '') && /disab/i.test(error.message ?? '');

    console.error('[romanian/start] anonymous sign-in failed:', code || error.message);
    return NextResponse.json(
      { ok: false, error: disabled ? 'anonymous_disabled' : 'sign_in_failed' },
      { status: disabled ? 503 : 500 }
    );
  }

  if (!data?.user) {
    return NextResponse.json({ ok: false, error: 'sign_in_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, created: true });
}
