import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/signout
 * Clears authoritative HTTP-only session cookies and signs out from Supabase Auth.
 */
export async function POST(request: Request) {
  const pendingCookies: Array<{ name: string; value: string; options: any }> = [];

  const createResponse = (body: any) => {
    const res = NextResponse.json(body);
    for (const c of pendingCookies) {
      res.cookies.set(c.name, c.value, c.options);
    }
    return res;
  };

  try {
    let cookieStore: any = null;
    try {
      cookieStore = cookies();
    } catch {}

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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
          pendingCookies.push({ name, value: '', options: { ...options, maxAge: 0, path: '/' } });
        },
      },
    });

    await serverClient.auth.signOut();

    // Explicitly delete any sb-* cookies from cookieStore or request
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieNames = cookieHeader.split(';').map((c) => c.trim().split('=')[0]);
    for (const name of cookieNames) {
      if (name.startsWith('sb-')) {
        pendingCookies.push({ name, value: '', options: { maxAge: 0, path: '/' } });
      }
    }

    return createResponse({ success: true });
  } catch (err: any) {
    console.error('[Auth SignOut] Error signing out:', err);
    return createResponse({ success: false, error: err?.message });
  }
}
