import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/exchange/onboarding/authorized-recipients/[id]
 *
 * Updates an authorized recipient's status to 'approved' or 'revoked'.
 *
 * Rules:
 * - Requires 'exchange.onboarding' permission.
 * - verified_by_admin_id is ALWAYS derived from session (admin.adminUserId), NEVER from body.
 * - verified_at is generated server-side.
 * - Enforces DB trigger fn_exchange_authorized_recipients_validate_approval:
 *   Recipient lead must have an approved exchange_profile to be approved.
 *   Returns a clear message if trigger check fails.
 * - Appends audit event to exchange_events.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to manage authorized recipients.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const recipientId = resolvedParams?.id?.trim();
    if (!recipientId) {
      return NextResponse.json({ error: 'Recipient ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { status } = body;
    const cleanStatus = String(status || '').trim().toLowerCase();

    if (!['approved', 'revoked'].includes(cleanStatus)) {
      return NextResponse.json(
        { error: "status must be either 'approved' or 'revoked'." },
        { status: 400 }
      );
    }

    // 1. Fetch current record
    const { data: existingRecipient, error: fetchError } = await supabaseAdmin
      .from('exchange_authorized_recipients')
      .select('id, lead_id, recipient_lead_id, relationship, status')
      .eq('id', recipientId)
      .maybeSingle();

    if (fetchError) {
      console.error(`[AdminExchangeOnboarding] Error fetching authorized recipient ${recipientId}:`, fetchError);
      return NextResponse.json({ error: 'Failed to find authorized recipient record.' }, { status: 500 });
    }

    if (!existingRecipient) {
      return NextResponse.json({ error: 'Authorized recipient record not found.' }, { status: 404 });
    }

    const previousStatus = existingRecipient.status;
    const nowIso = new Date().toISOString();

    const updatePayload: Record<string, any> = {
      status: cleanStatus,
      verified_by_admin_id: admin.adminUserId,
      verified_at: nowIso,
      updated_at: nowIso,
    };

    // 2. Perform update
    const { data: updatedRecipient, error: updateError } = await supabaseAdmin
      .from('exchange_authorized_recipients')
      .update(updatePayload)
      .eq('id', recipientId)
      .select()
      .single();

    if (updateError) {
      console.error(`[AdminExchangeOnboarding] Error updating authorized recipient ${recipientId}:`, updateError);

      // Handle DB trigger error gracefully
      if (updateError.message && updateError.message.includes('must have an approved exchange_profile')) {
        return NextResponse.json(
          { error: 'گیرنده انتخابی فاقد پرونده تبادل تاییدشده (approved) است و نمی‌تواند به عنوان گیرنده مجاز تایید شود.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: updateError.message || 'Failed to update authorized recipient status.' },
        { status: 400 }
      );
    }

    // 3. Append audit event
    await supabaseAdmin
      .from('exchange_events')
      .insert({
        actor: 'staff',
        actor_user_id: admin.adminUserId,
        from_status: previousStatus,
        to_status: cleanStatus,
        payload: {
          action: 'exchange_authorized_recipient_status_updated',
          recipient_id: recipientId,
          lead_id: existingRecipient.lead_id,
          recipient_lead_id: existingRecipient.recipient_lead_id,
          previous_status: previousStatus,
          new_status: cleanStatus,
        },
      });

    return NextResponse.json({
      success: true,
      authorizedRecipient: updatedRecipient,
    });
  } catch (err: any) {
    console.error('[AdminExchangeOnboarding] Unexpected error in PATCH /api/admin/exchange/onboarding/authorized-recipients/[id]:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
