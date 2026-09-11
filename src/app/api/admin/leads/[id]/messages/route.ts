import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendTelegramMessage, escapeTelegramHtml } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
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
    const admin = await getAdminContext(request);
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

    // Best-effort Telegram delivery: only for leads originating from telegram_bot with non-empty channel_ref
    let telegramDelivered: boolean | null = null;
    let telegramError: string | undefined;

    try {
      const { data: lead, error: leadError } = await supabaseAdmin
        .from('leads')
        .select('id, source, channel_ref')
        .eq('id', leadId)
        .single();

      if (leadError) {
        console.warn(`[LeadMessage] Failed to query lead ${leadId} for telegram delivery:`, leadError);
      } else if (lead && lead.source === 'telegram_bot' && lead.channel_ref && lead.channel_ref.trim()) {
        const brandedMessage = `💬 <b>پیام جدید از تیم DORVIA</b>\n\n${escapeTelegramHtml(text)}`;
        const tgRes = await sendTelegramMessage(lead.channel_ref.trim(), brandedMessage, 'HTML');

        telegramDelivered = tgRes.success;
        if (!tgRes.success) {
          telegramError = tgRes.error;
          console.warn(
            `[LeadMessage] Telegram delivery failed for lead ${leadId} (${lead.channel_ref}):`,
            tgRes.error
          );
        } else {
          console.log(
            `[LeadMessage] Telegram delivery succeeded for lead ${leadId} (messageId: ${tgRes.messageId})`
          );
        }
      }
    } catch (err: any) {
      console.error(`[LeadMessage] Unexpected error delivering telegram message to lead ${leadId}:`, err);
      telegramDelivered = false;
      telegramError = err?.message || 'Telegram delivery exception';
    }

    return NextResponse.json({
      success: true,
      message: inserted,
      telegramDelivered,
      ...(telegramError ? { telegramError } : {}),
    });
  } catch (error) {
    console.error('Unexpected error sending admin message:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
