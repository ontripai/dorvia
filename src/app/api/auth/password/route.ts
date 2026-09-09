import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { maskEmail } from '@/lib/privacy';
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabaseConfig';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/password
 * Authenticates client portal leads with password on the server side and sets authoritative session cookies.
 */
export async function POST(request: Request) {
  const pendingCookies: Array<{ name: string; value: string; options: any }> = [];

  const createResponse = (body: any, init?: { status?: number }) => {
    const res = NextResponse.json(body, init);
    for (const c of pendingCookies) {
      res.cookies.set(c.name, c.value, c.options);
    }
    return res;
  };

  try {
    const body = await request.json().catch(() => null);
    const rawEmail = body?.email;
    const password = body?.password;
    const flow = body?.flow === 'admin' ? 'admin' : 'portal';
    const lang = body?.lang === 'en' ? 'en' : 'fa';

    if (!rawEmail || typeof rawEmail !== 'string' || !password || typeof password !== 'string') {
      return createResponse(
        {
          success: false,
          error: 'invalid_request',
          message: lang === 'fa' ? 'ایمیل و رمز عبور الزامی است.' : 'Email and password are required.',
        },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();

    if (!supabaseAdmin) {
      return createResponse(
        {
          success: false,
          error: 'technical_error',
          message: lang === 'fa' ? 'سرویس احراز هویت در دسترس نیست.' : 'Authentication service unconfigured.',
        },
        { status: 500 }
      );
    }

    // 1. Authenticate with Supabase Auth using Admin Client
    const { data: authData, error: authErr } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (authErr || !authData?.session || !authData.user) {
      console.warn('[Auth Password] Credentials rejected for email:', maskEmail(email), authErr?.message);
      return createResponse(
        {
          success: false,
          error: 'invalid_credentials',
          message: lang === 'fa' ? 'ایمیل یا رمز عبور نادرست است.' : 'Invalid email or password.',
        },
        { status: 401 }
      );
    }

    const authUser = authData.user;
    const session = authData.session;

    // 2. Set authoritative cookies via createServerClient
    let cookieStore: any = null;
    try {
      cookieStore = cookies();
    } catch {
      // In non-standard execution contexts
    }

    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

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
          if (cookieStore) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {}
          }
          pendingCookies.push({ name, value, options });
        },
        remove(name: string, options: any) {
          if (cookieStore) {
            try {
              cookieStore.delete({ name, ...options });
            } catch {}
          }
          pendingCookies.push({ name, value: '', options: { ...options, maxAge: 0 } });
        },
      },
    });

    await serverClient.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // 3. For portal flow, verify lead record association
    if (flow === 'portal') {
      const { data: leads, error: leadQueryError } = await supabaseAdmin
        .from('leads')
        .select('id, email, user_id, invited_at')
        .eq('email', email)
        .not('invited_at', 'is', null);

      if (!leadQueryError && leads && leads.length > 0) {
        const alreadyLinked = leads.find((l) => l.user_id === authUser.id);
        if (!alreadyLinked) {
          const unlinkedLeads = leads.filter((l) => !l.user_id);
          if (unlinkedLeads.length > 0) {
            await supabaseAdmin
              .from('leads')
              .update({ user_id: authUser.id })
              .eq('id', unlinkedLeads[0].id);
          }
        }
      }

      return createResponse({
        success: true,
        redirectTo: `/${lang}/portal/dashboard`,
        user: {
          id: authUser.id,
          email: authUser.email,
        },
      });
    }

    return createResponse({
      success: true,
      redirectTo: `/${lang}`,
      user: {
        id: authUser.id,
        email: authUser.email,
      },
    });
  } catch (err: any) {
    console.error('[Auth Password] Unexpected exception:', err);
    return createResponse(
      {
        success: false,
        error: 'technical_error',
        message: 'Internal server error occurred.',
      },
      { status: 500 }
    );
  }
}
