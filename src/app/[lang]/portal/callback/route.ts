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

    if (authUser && authUser.email && supabaseAdmin) {
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
          return NextResponse.redirect(`${origin}/${lang}/portal/dashboard`);
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
            return NextResponse.redirect(`${origin}/${lang}/portal/dashboard`);
          }
        }
      }

      // Case 3: Abnormal condition (0 or multiple ambiguous unlinked records) -> sign out and redirect with error
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/${lang}/portal/login?error=account_not_found`);
    }
  }

  // If code exchange failed or expired
  return NextResponse.redirect(`${origin}/${lang}/portal/login?error=invalid_or_expired_link`);
}
