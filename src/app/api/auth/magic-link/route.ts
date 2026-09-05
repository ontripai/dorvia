import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawEmail = body?.email;
    const flow = body?.flow === 'admin' ? 'admin' : 'portal';
    const lang = body?.lang === 'en' ? 'en' : 'fa';

    if (!rawEmail || typeof rawEmail !== 'string' || !rawEmail.includes('@')) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();

    if (!supabaseAdmin) {
      console.error('[Auth OTP] supabaseAdmin is not configured.');
      return NextResponse.json(
        { error: 'technical_error', message: 'Backend service unconfigured' },
        { status: 500 }
      );
    }

    // Determine base origin and callback URL
    const url = new URL(request.url);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
    const callbackUrl = `${origin}/${lang}/${flow}/callback`;

    console.log('[Auth OTP] computed callbackUrl:', callbackUrl, '| NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL, '| request origin:', url.origin, `| email: [${email}], flow: [${flow}]`);

    const { data, error } = await supabaseAdmin.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: callbackUrl,
      },
    });

    if (error) {
      // If error is because user is not registered / signups not allowed with shouldCreateUser: false
      const isSignupNotAllowed =
        error.message?.toLowerCase().includes('signup') ||
        error.message?.toLowerCase().includes('not allowed') ||
        (error as any).code === 'otp_disabled';

      if (isSignupNotAllowed) {
        console.log(`[Auth OTP] Email [${email}] is not registered in auth.users (non-revealing response).`);
        // Non-revealing: Return success so an attacker cannot probe registered emails
        return NextResponse.json({ success: true });
      }

      // Handle email rate limit specifically
      const isRateLimit =
        (error as any).code === 'over_email_send_rate_limit' ||
        (error as any).status === 429 ||
        error.message?.toLowerCase().includes('rate limit');

      if (isRateLimit) {
        console.warn(`[Auth OTP] Rate limit exceeded for [${email}]`);
        return NextResponse.json(
          {
            error: 'rate_limit',
            message: 'تعداد درخواست‌های ارسالی بیش از حد مجاز است. لطفاً ۶۰ ثانیه صبر کرده و مجدداً تلاش نمایید.',
          },
          { status: 429 }
        );
      }

      // Any other genuine technical error (network, misconfiguration)
      console.error('[Auth OTP] Supabase API technical error:', error);
      return NextResponse.json(
        { error: 'technical_error', message: error.message },
        { status: (error as any).status || 500 }
      );
    }

    console.log(`[Auth OTP] Successfully sent magic link to [${email}]`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Auth OTP] Unexpected server exception:', err);
    return NextResponse.json(
      { error: 'technical_error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
