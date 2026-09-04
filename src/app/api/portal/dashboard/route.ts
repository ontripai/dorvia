import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Authenticate user from session cookies via server-side Supabase client
    const supabase = createServerComponentClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service unconfigured.' },
        { status: 500 }
      );
    }

    // 2. Resolve lead linked to this auth user
    let { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // Fallback: If not yet linked by user_id, check by invited email
    if (!lead && user.email) {
      const userEmail = user.email.trim().toLowerCase();
      const { data: fallbackLead } = await supabaseAdmin
        .from('leads')
        .select('*')
        .eq('email', userEmail)
        .not('invited_at', 'is', null)
        .maybeSingle();

      if (fallbackLead) {
        await supabaseAdmin
          .from('leads')
          .update({ user_id: user.id })
          .eq('id', fallbackLead.id);

        lead = { ...fallbackLead, user_id: user.id };
      }
    }

    if (leadError) {
      console.error('Error fetching portal lead:', leadError);
      return NextResponse.json(
        { error: 'Failed to fetch lead profile.' },
        { status: 500 }
      );
    }

    if (!lead) {
      return NextResponse.json(
        { error: 'No active lead profile associated with this account.', code: 'account_not_found' },
        { status: 403 }
      );
    }

    // 3. Resolve messages for this lead
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('lead_messages')
      .select('*')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching portal lead messages:', messagesError);
      return NextResponse.json(
        { error: 'Failed to fetch messages.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lead,
      messages: messages || [],
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/portal/dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
