import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/exchange/onboarding/profiles/[leadId]
 *
 * Updates a customer exchange_profile status to 'approved', 'rejected', or 'suspended'.
 *
 * Rules:
 * - Requires 'exchange.onboarding' permission.
 * - approved_by is ALWAYS derived from session (admin.adminUserId).
 * - approved_at is generated server-side.
 * - Logs audit event to exchange_events with actor = 'staff' and actor_user_id = admin.adminUserId.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { leadId: string } | Promise<{ leadId: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to manage exchange customer onboarding.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const leadId = resolvedParams?.leadId?.trim();
    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { exchange_status, suspended_reason } = body;
    const cleanStatus = String(exchange_status || '').trim().toLowerCase();

    if (!['approved', 'rejected', 'suspended'].includes(cleanStatus)) {
      return NextResponse.json(
        { error: "exchange_status must be 'approved', 'rejected', or 'suspended'." },
        { status: 400 }
      );
    }

    // 1. Fetch current profile
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('exchange_profiles')
      .select('id, lead_id, exchange_status')
      .eq('lead_id', leadId)
      .maybeSingle();

    if (fetchError) {
      console.error(`[AdminExchangeOnboarding] Error fetching profile for lead ${leadId}:`, fetchError);
      return NextResponse.json({ error: 'Failed to find customer exchange profile.' }, { status: 500 });
    }

    if (!existingProfile) {
      return NextResponse.json({ error: 'Customer exchange profile not found.' }, { status: 404 });
    }

    const previousStatus = existingProfile.exchange_status;
    const nowIso = new Date().toISOString();

    const updatePayload: Record<string, any> = {
      exchange_status: cleanStatus,
      updated_at: nowIso,
    };

    if (cleanStatus === 'approved') {
      updatePayload.approved_by = admin.adminUserId;
      updatePayload.approved_at = nowIso;
      updatePayload.suspended_reason = null;
    } else if (cleanStatus === 'suspended') {
      updatePayload.suspended_reason = suspended_reason ? String(suspended_reason).trim() : null;
    } else if (cleanStatus === 'rejected') {
      updatePayload.suspended_reason = suspended_reason ? String(suspended_reason).trim() : null;
    }

    // 2. Perform update
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('exchange_profiles')
      .update(updatePayload)
      .eq('lead_id', leadId)
      .select()
      .single();

    if (updateError) {
      console.error(`[AdminExchangeOnboarding] Error updating profile for lead ${leadId}:`, updateError);
      return NextResponse.json({ error: 'Failed to update exchange profile.' }, { status: 500 });
    }

    // 3. Append audit event to exchange_events
    await supabaseAdmin
      .from('exchange_events')
      .insert({
        actor: 'staff',
        actor_user_id: admin.adminUserId,
        from_status: previousStatus,
        to_status: cleanStatus,
        payload: {
          action: 'exchange_profile_status_updated',
          lead_id: leadId,
          previous_status: previousStatus,
          new_status: cleanStatus,
          suspended_reason: updatePayload.suspended_reason || null,
        },
      });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (err: any) {
    console.error('[AdminExchangeOnboarding] Unexpected error in PATCH /api/admin/exchange/onboarding/profiles/[leadId]:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
