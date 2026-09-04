import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    // 1. Authenticate user from session cookies
    const supabase = createServerComponentClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    // 2. Parse and validate message text
    const body = await request.json().catch(() => null);
    const rawText = body?.text;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return NextResponse.json({ error: 'Message text is required.' }, { status: 400 });
    }

    const text = rawText.trim();
    if (text.length > 3000) {
      return NextResponse.json({ error: 'Message exceeds maximum limit of 3000 characters.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Backend service unconfigured.' }, { status: 500 });
    }

    // 3. Resolve lead linked to this auth user
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('id, email')
      .eq('user_id', user.id)
      .maybeSingle();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'No active lead profile associated with this account.' }, { status: 403 });
    }

    // 4. Insert message into lead_messages
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('lead_messages')
      .insert([
        {
          lead_id: lead.id,
          sender_role: 'user',
          sender_ref: user.email || user.id,
          text: text,
        },
      ])
      .select('*')
      .single();

    if (insertError) {
      console.error('Failed to insert lead message (Internal)');
      return NextResponse.json({ error: 'Failed to save message.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: inserted });
  } catch (err) {
    console.error('Error handling portal message POST (Internal)');
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
