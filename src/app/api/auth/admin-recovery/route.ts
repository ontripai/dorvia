import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { maskEmail } from '@/lib/privacy';
import { checkRateLimit, hashClientIp } from '@/lib/rateLimit';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabaseConfig';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/admin-recovery
 * Emergency password recovery authentication for DORVIA admin panel.
 * - Stricter dual rate limiting (IP bucket: 5 req/15m, Email bucket: 3 req/15m)
 * - GoTrue authentication via standard SSR client (anon key)
 * - Authoritative admin role check against public.admin_users (is_active = true) via supabaseAdmin
 * - Session cookies are committed ONLY after successful admin role verification
 * - Detailed audit logging for all attempts (IP, country, masked email, result)
 */
export async function POST(request: Request) {
  const pendingCookies: Array<{ name: string; value: string; options: any }> = [];

  const createResponse = (body: any, init?: { status?: number }, shouldSetCookies: boolean = false) => {
    const res = NextResponse.json(body, init);
    if (shouldSetCookies) {
      for (const c of pendingCookies) {
        res.cookies.set(c.name, c.value, c.options);
      }
    }
    return res;
  };

  const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const clientIp = rawIp.split(',')[0].trim();
  const country = request.headers.get('x-vercel-ip-country') || 'unknown';

  let email = '';
  let lang = 'fa';

  try {
    const body = await request.json().catch(() => null);
    const rawEmail = body?.email;
    const password = body?.password;
    lang = body?.lang === 'en' ? 'en' : 'fa';

    if (!rawEmail || typeof rawEmail !== 'string' || !password || typeof password !== 'string') {
      console.warn(`[Admin Recovery Auth] AUDIT - INVALID_REQUEST from IP [${hashClientIp(clientIp)}] country [${country}]`);
      return createResponse(
        {
          success: false,
          error: 'invalid_request',
          message: lang === 'fa' ? 'آدرس ایمیل و رمز عبور الزامی است.' : 'Email and password are required.',
        },
        { status: 400 }
      );
    }

    email = rawEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn(`[Admin Recovery Auth] AUDIT - INVALID_EMAIL_FORMAT for [${maskEmail(email)}] from IP [${hashClientIp(clientIp)}]`);
      return createResponse(
        {
          success: false,
          error: 'invalid_request',
          message: lang === 'fa' ? 'فرمت آدرس ایمیل واردشده نامعتبر است.' : 'Invalid email format.',
        },
        { status: 400 }
      );
    }

    // 1. Strict Dual Rate Limiting (IP bucket: 5 requests / 15 minutes)
    const ipRateLimit = await checkRateLimit({
      endpoint: 'admin-recovery:ip',
      ip: clientIp,
      maxRequests: 5,
      windowSeconds: 15 * 60,
    });

    if (!ipRateLimit.allowed) {
      console.warn(
        `[Admin Recovery Auth] AUDIT - RATE_LIMIT_IP_EXCEEDED for masked email [${maskEmail(email)}] from IP [${hashClientIp(clientIp)}] country [${country}]`
      );
      return createResponse(
        {
          success: false,
          error: 'rate_limit',
          message:
            lang === 'fa'
              ? 'تعداد درخواست‌های ارسالی از این آدرس بیش از حد مجاز است. لطفاً ۱۵ دقیقه دیگر مجدداً تلاش فرمایید.'
              : 'Too many recovery attempts from this IP. Please try again in 15 minutes.',
        },
        { status: 429 }
      );
    }

    // 2. Strict Dual Rate Limiting (Email bucket: 3 requests / 15 minutes)
    const emailRateLimit = await checkRateLimit({
      endpoint: 'admin-recovery:email',
      identifier: email,
      maxRequests: 3,
      windowSeconds: 15 * 60,
    });

    if (!emailRateLimit.allowed) {
      console.warn(
        `[Admin Recovery Auth] AUDIT - RATE_LIMIT_EMAIL_EXCEEDED for target [${maskEmail(email)}] from IP [${hashClientIp(clientIp)}] country [${country}]`
      );
      return createResponse(
        {
          success: false,
          error: 'rate_limit',
          message:
            lang === 'fa'
              ? 'تعداد دفعات تلاش ناموفق برای این حساب کاربری بیش از حد مجاز است. لطفاً ۱۵ دقیقه دیگر مجدداً تلاش فرمایید.'
              : 'Too many recovery attempts for this email. Please try again in 15 minutes.',
        },
        { status: 429 }
      );
    }

    // 3. Prepare SSR Client with Anon Key (GoTrue Auth)
    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    let cookieStore: any = null;
    try {
      cookieStore = cookies();
    } catch {
      // Standalone execution outside standard requestAsyncStorage
    }

    const serverClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          if (cookieStore) {
            try {
              return cookieStore.get(name)?.value;
            } catch {}
          }
          const cookieHeader = request.headers.get('cookie') || '';
          const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
          return match ? decodeURIComponent(match[1]) : undefined;
        },
        set(name: string, value: string, options: any) {
          // Buffer cookie in pendingCookies only; do NOT commit to browser before admin role check passes!
          pendingCookies.push({ name, value, options });
        },
        remove(name: string, options: any) {
          pendingCookies.push({ name, value: '', options: { ...options, maxAge: 0 } });
        },
      },
    });

    // 4. Authenticate using SSR client (Anon Key)
    const { data: authData, error: authErr } = await serverClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authErr || !authData?.user || !authData?.session) {
      // Discard any session cookies
      pendingCookies.length = 0;
      console.warn(
        `[Admin Recovery Auth] AUDIT - INVALID_CREDENTIALS for email [${maskEmail(email)}] from IP [${hashClientIp(clientIp)}] country [${country}] - error: ${authErr?.message}`
      );
      return createResponse(
        {
          success: false,
          error: 'invalid_credentials',
          message: lang === 'fa' ? 'ایمیل یا رمز عبور بازیابی نادرست است.' : 'Invalid recovery email or password.',
        },
        { status: 401 }
      );
    }

    const authUser = authData.user;
    const session = authData.session;

    // 5. Authoritative Admin Role Verification via supabaseAdmin (service_role)
    if (!supabaseAdmin) {
      pendingCookies.length = 0;
      console.error('[Admin Recovery Auth] AUDIT - TECHNICAL_ERROR: supabaseAdmin is unconfigured.');
      return createResponse(
        {
          success: false,
          error: 'technical_error',
          message: lang === 'fa' ? 'خطای پیکربندی سرور رخ داد.' : 'Internal authentication service unavailable.',
        },
        { status: 500 }
      );
    }

    const { data: adminRecord, error: adminErr } = await supabaseAdmin
      .from('admin_users')
      .select('id, is_active, role_id')
      .eq('id', authUser.id)
      .eq('is_active', true)
      .maybeSingle();

    if (adminErr || !adminRecord) {
      // User has valid password in auth.users, but is NOT an active admin in admin_users!
      // Invalidate session immediately and discard cookies
      pendingCookies.length = 0;
      await serverClient.auth.signOut().catch(() => {});

      console.warn(
        `[Admin Recovery Auth] AUDIT - UNAUTHORIZED_PORTAL_OR_INACTIVE: User [${maskEmail(email)}] (ID: ${authUser.id}) authenticated but is NOT in admin_users or is inactive. Session revoked.`
      );

      return createResponse(
        {
          success: false,
          error: 'unauthorized',
          message:
            lang === 'fa'
              ? 'این حساب کاربری دسترسی معتبری به عنوان مدیر یا مشاور ندارد.'
              : 'This account is not authorized for administrative access.',
        },
        { status: 403 }
      );
    }

    // 6. Admin Role Verified: Now, and ONLY now, commit session cookies!
    console.log(
      `[Admin Recovery Auth] AUDIT - SUCCESS: Admin [${maskEmail(email)}] (ID: ${authUser.id}, Role: ${adminRecord.role_id}) authenticated successfully via emergency recovery route from IP [${hashClientIp(clientIp)}] country [${country}].`
    );

    return createResponse(
      {
        success: true,
        redirectTo: `/${lang}/admin/leads`,
        user: {
          id: authUser.id,
          email: authUser.email,
        },
      },
      { status: 200 },
      true // commit cookies to response
    );
  } catch (err: any) {
    pendingCookies.length = 0;
    console.error(`[Admin Recovery Auth] AUDIT - UNEXPECTED_EXCEPTION for [${maskEmail(email)}]:`, err);
    return createResponse(
      {
        success: false,
        error: 'technical_error',
        message: lang === 'fa' ? 'خطای غیرمنتظره در سرور رخ داد.' : 'An unexpected server error occurred.',
      },
      { status: 500 }
    );
  }
}
