import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request, { params }: { params: { lang: string } }) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const lang = params.lang || 'fa';
  const origin = requestUrl.origin;

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
  }

  // If code exchange failed or expired
  return NextResponse.redirect(`${origin}/${lang}/admin/login?error=invalid_link`);
}
