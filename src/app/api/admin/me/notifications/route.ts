import { NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/me/notifications
 * Returns the current admin user's notification preferences.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: record, error } = await supabaseAdmin
      .from('admin_users')
      .select('telegram_chat_id, notify_email, notify_telegram')
      .eq('id', admin.adminUserId)
      .maybeSingle();

    if (error || !record) {
      return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      notifications: {
        telegram_chat_id: record.telegram_chat_id,
        notify_email: record.notify_email ?? true,
        notify_telegram: record.notify_telegram ?? false,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/me/notifications:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/me/notifications
 * Updates the current admin user's notification preferences.
 * Strict Whitelist: only telegram_chat_id, notify_email, notify_telegram can be modified.
 */
export async function PATCH(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    // Strict Whitelist
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if ('telegram_chat_id' in body) {
      if (body.telegram_chat_id === null || body.telegram_chat_id === '') {
        updates.telegram_chat_id = null;
      } else if (typeof body.telegram_chat_id === 'string') {
        updates.telegram_chat_id = body.telegram_chat_id.trim();
      } else {
        return NextResponse.json(
          { error: 'telegram_chat_id must be a string or null.' },
          { status: 400 }
        );
      }
    }

    if ('notify_email' in body) {
      if (typeof body.notify_email !== 'boolean') {
        return NextResponse.json(
          { error: 'notify_email must be a boolean.' },
          { status: 400 }
        );
      }
      updates.notify_email = body.notify_email;
    }

    if ('notify_telegram' in body) {
      if (typeof body.notify_telegram !== 'boolean') {
        return NextResponse.json(
          { error: 'notify_telegram must be a boolean.' },
          { status: 400 }
        );
      }
      updates.notify_telegram = body.notify_telegram;
    }

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('admin_users')
      .update(updates)
      .eq('id', admin.adminUserId)
      .select('telegram_chat_id, notify_email, notify_telegram')
      .single();

    if (updateErr || !updated) {
      console.error('Error updating notification preferences:', updateErr);
      return NextResponse.json({ error: 'Failed to update preferences.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      notifications: updated,
    });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/me/notifications:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
