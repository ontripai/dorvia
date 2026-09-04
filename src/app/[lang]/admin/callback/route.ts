import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { lang: string } }) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const lang = params.lang || 'fa';
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  // 1. Server-side PKCE or TokenHash exchange (if query parameters are present)
  if (code || (tokenHash && type)) {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options });
        },
      },
    });

    let authUser = null;

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.user) {
        authUser = data.user;
      }
    } else if (tokenHash && type) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as any,
      });
      if (!error && data?.user) {
        authUser = data.user;
      }
    }

    if (authUser && supabaseAdmin) {
      // Check if user is registered in admin_users and is_active is true
      const { data: adminRecord, error: adminErr } = await supabaseAdmin
        .from('admin_users')
        .select('id, is_active, role_id')
        .eq('id', authUser.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!adminErr && adminRecord) {
        // Valid active admin: redirect directly to the admin leads management page
        return NextResponse.redirect(`${origin}/${lang}/admin/leads`);
      }

      // Not an active admin -> Sign out and redirect to admin login with unauthorized notice
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/${lang}/admin/login?error=unauthorized`);
    }

    // If server code/token verification failed
    return NextResponse.redirect(`${origin}/${lang}/admin/login?error=invalid_link`);
  }

  // 2. Implicit / Hash-based callback handling
  // When Supabase generates implicit magic links (#access_token=...&refresh_token=...),
  // the hash fragment is never sent over HTTP to the server. We return a minimal client receiver
  // to extract the tokens and establish the cookie-based session via POST /api/auth/session.
  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'fa' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <title>${lang === 'fa' ? 'در حال ورود به پنل مدیریت...' : 'Authenticating Admin Session...'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      background-color: #071322;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .spinner {
      width: 42px;
      height: 42px;
      border: 3px solid rgba(59, 130, 246, 0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div style="text-align: center; padding: 24px;">
    <div class="spinner"></div>
    <div style="font-size: 14px; font-weight: bold; color: #cbd5e1;">
      ${lang === 'fa' ? 'در حال اعتبارسنجی نشست امن مدیریت...' : 'Validating secure admin session...'}
    </div>
  </div>
  <script>
    (async function() {
      try {
        console.log('[Admin Callback] Checking location hash for session tokens...');
        var hash = window.location.hash || '';
        if (!hash || !hash.includes('access_token=')) {
          console.error('[Admin Callback] No access_token found in URL hash. Hash is empty or invalid.');
          window.location.replace('/${lang}/admin/login?error=invalid_link');
          return;
        }

        var params = new URLSearchParams(hash.replace(/^#/, ''));
        var accessToken = params.get('access_token');
        var refreshToken = params.get('refresh_token');

        if (!accessToken) {
          console.error('[Admin Callback] Failed to parse access_token from hash fragment.');
          window.location.replace('/${lang}/admin/login?error=invalid_link');
          return;
        }

        console.log('[Admin Callback] Valid token parsed from hash. Dispatching to /api/auth/session...');
        var res = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            flow: 'admin',
            lang: '${lang}'
          })
        });

        var data = await res.json().catch(function() { return null; });
        console.log('[Admin Callback] /api/auth/session response:', res.status, data);

        if (res.ok && data && data.success && data.redirectTo) {
          console.log('[Admin Callback] Session established successfully. Navigating to:', data.redirectTo);
          window.location.replace(data.redirectTo);
        } else {
          var errCode = (data && data.error) ? data.error : ('http_' + res.status);
          console.error('[Admin Callback] Session verification failed with error code:', errCode, 'full response:', data);
          window.location.replace(data && data.redirectTo ? data.redirectTo : ('/${lang}/admin/login?error=' + errCode));
        }
      } catch (err) {
        console.error('[Admin Callback] Exception caught during callback processing:', err);
        window.location.replace('/${lang}/admin/login?error=technical_error');
      }
    })();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
