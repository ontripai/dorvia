import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext();
    if (!admin || !hasPermission(admin, 'messages.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view messages.' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: messages, error } = await supabaseAdmin
      .from('lead_messages')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching lead messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages.' }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Unexpected error fetching lead messages:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext();
    if (!admin || !hasPermission(admin, 'messages.send')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to send messages.' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required.' }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const rawText = body?.text;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return NextResponse.json({ error: 'Message text is required.' }, { status: 400 });
    }

    const text = rawText.trim();
    if (text.length > 3000) {
      return NextResponse.json({ error: 'Message exceeds maximum length.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // Insert message as admin
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('lead_messages')
      .insert([
        {
          lead_id: leadId,
          sender_role: 'admin',
          sender_ref: admin.fullName || admin.email || 'DORVIA Support Team',
          text: text,
        },
      ])
      .select('*')
      .single();

    if (insertError) {
      console.error('Error sending admin message:', insertError);
      return NextResponse.json({ error: 'Failed to record message.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: inserted });
  } catch (error) {
    console.error('Unexpected error sending admin message:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
