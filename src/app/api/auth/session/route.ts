import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

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
    const accessToken = body?.access_token;
    const refreshToken = body?.refresh_token;
    const flow = body?.flow === 'admin' ? 'admin' : 'portal';
    const lang = body?.lang === 'en' ? 'en' : 'fa';

    if (!accessToken || typeof accessToken !== 'string') {
      return createResponse(
        { error: 'invalid_token', redirectTo: `/${lang}/${flow}/login?error=invalid_link` },
        { status: 400 }
      );
    }

    let cookieStore: any = null;
    try {
      cookieStore = cookies();
    } catch {
      // In standalone tests or non-standard execution contexts outside requestAsyncStorage
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

    const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || '',
    });

    if (sessionErr || !sessionData?.user) {
      console.error('[Auth Session] Failed to set session from token:', sessionErr?.message);
      return createResponse(
        { error: 'invalid_link', redirectTo: `/${lang}/${flow}/login?error=invalid_link` },
        { status: 401 }
      );
    }

    const authUser = sessionData.user;

    if (flow === 'admin') {
      if (!supabaseAdmin) {
        return createResponse(
          { error: 'technical_error', redirectTo: `/${lang}/admin/login?error=technical_error` },
          { status: 500 }
        );
      }

      // Check if user is registered in admin_users and is_active is true
      const { data: adminRecord, error: adminErr } = await supabaseAdmin
        .from('admin_users')
        .select('id, is_active, role_id')
        .eq('id', authUser.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!adminErr && adminRecord) {
        return createResponse({
          success: true,
          redirectTo: `/${lang}/admin/leads`,
          user: {
            id: authUser.id,
            email: authUser.email,
          },
        });
      }

      // Not an active admin -> Sign out and redirect to admin login with unauthorized notice
      await supabase.auth.signOut();
      return createResponse(
        { error: 'unauthorized', redirectTo: `/${lang}/admin/login?error=unauthorized` },
        { status: 403 }
      );
    }

    if (flow === 'portal') {
      if (!authUser.email || !supabaseAdmin) {
        await supabase.auth.signOut();
        return createResponse(
          { error: 'account_not_found', redirectTo: `/${lang}/portal/login?error=account_not_found` },
          { status: 403 }
        );
      }

      const userEmail = authUser.email.trim().toLowerCase();

      // Find matching lead records for this invited email
      const { data: leads, error: leadQueryError } = await supabaseAdmin
        .from('leads')
        .select('id, email, user_id, invited_at')
        .eq('email', userEmail)
        .not('invited_at', 'is', null);

      if (!leadQueryError && leads) {
        // Case 1: Repeat login - lead already linked to this auth user
        const alreadyLinked = leads.find((l) => l.user_id === authUser.id);
        if (alreadyLinked) {
          return createResponse({
            success: true,
            redirectTo: `/${lang}/portal/dashboard`,
            user: {
              id: authUser.id,
              email: authUser.email,
            },
          });
        }

        // Case 2: First-time login - lead has invited_at but user_id is null
        const unlinkedLeads = leads.filter((l) => !l.user_id);
        if (unlinkedLeads.length === 1) {
          const targetLead = unlinkedLeads[0];
          const { error: updateError } = await supabaseAdmin
            .from('leads')
            .update({ user_id: authUser.id })
            .eq('id', targetLead.id);

          if (!updateError) {
            return createResponse({
              success: true,
              redirectTo: `/${lang}/portal/dashboard`,
              user: {
                id: authUser.id,
                email: authUser.email,
              },
            });
          }
        }
      }

      // Case 3: Abnormal condition -> sign out and redirect with error
      await supabase.auth.signOut();
      return createResponse(
        { error: 'account_not_found', redirectTo: `/${lang}/portal/login?error=account_not_found` },
        { status: 403 }
      );
    }

    return createResponse({ success: true, redirectTo: `/${lang}` });
  } catch (err) {
    console.error('[Auth Session] Unexpected error:', err);
    return createResponse(
      { error: 'technical_error', redirectTo: `/fa/admin/login?error=technical_error` },
      { status: 500 }
    );
  }
}
