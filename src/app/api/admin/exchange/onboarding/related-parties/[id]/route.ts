import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/exchange/onboarding/related-parties/[id]
 *
 * Updates a related party's approval status to 'approved' or 'rejected'.
 *
 * Rules:
 * - Requires 'exchange.onboarding' permission.
 * - verified_by_admin_id is ALWAYS derived from session (admin.adminUserId), NEVER from body.
 * - verified_at is generated server-side.
 * - Guard: If party_type is 'company' and id_document_id is null, rejecting approval before reaching DB constraint.
 * - Logs audit event to exchange_events.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to review related parties.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const partyId = resolvedParams?.id?.trim();
    if (!partyId) {
      return NextResponse.json({ error: 'Party ID is required.' }, { status: 400 });
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

    if (!['approved', 'rejected'].includes(cleanStatus)) {
      return NextResponse.json(
        { error: "status must be either 'approved' or 'rejected'." },
        { status: 400 }
      );
    }

    // 1. Fetch existing related party
    const { data: existingParty, error: fetchError } = await supabaseAdmin
      .from('exchange_related_parties')
      .select('id, lead_id, party_type, full_name, relationship, national_id, id_document_id, status')
      .eq('id', partyId)
      .maybeSingle();

    if (fetchError) {
      console.error(`[AdminExchangeOnboarding] Error fetching related party ${partyId}:`, fetchError);
      return NextResponse.json({ error: 'Failed to retrieve related party.' }, { status: 500 });
    }

    if (!existingParty) {
      return NextResponse.json({ error: 'Related party not found.' }, { status: 404 });
    }

    // 2. Pre-check constraint: chk_related_party_company_doc
    // Company cannot be approved without id_document_id
    if (cleanStatus === 'approved' && existingParty.party_type === 'company' && !existingParty.id_document_id) {
      return NextResponse.json(
        { error: 'شرکت متعلق به مشتری نمی‌تواند بدون بارگذاری مدارک هویتی و ثبتی تایید شود.' },
        { status: 400 }
      );
    }

    const previousStatus = existingParty.status;
    const nowIso = new Date().toISOString();

    const updatePayload: Record<string, any> = {
      status: cleanStatus,
      verified_by_admin_id: admin.adminUserId,
      verified_at: nowIso,
      updated_at: nowIso,
    };

    // 3. Perform update
    const { data: updatedParty, error: updateError } = await supabaseAdmin
      .from('exchange_related_parties')
      .update(updatePayload)
      .eq('id', partyId)
      .select()
      .single();

    if (updateError) {
      console.error(`[AdminExchangeOnboarding] Error updating related party ${partyId}:`, updateError);
      return NextResponse.json(
        { error: updateError.message || 'Failed to update related party status.' },
        { status: 400 }
      );
    }

    // 4. Append audit event
    await supabaseAdmin
      .from('exchange_events')
      .insert({
        actor: 'staff',
        actor_user_id: admin.adminUserId,
        from_status: previousStatus,
        to_status: cleanStatus,
        payload: {
          action: 'exchange_related_party_status_updated',
          party_id: partyId,
          lead_id: existingParty.lead_id,
          party_type: existingParty.party_type,
          full_name: existingParty.full_name,
          previous_status: previousStatus,
          new_status: cleanStatus,
        },
      });

    return NextResponse.json({
      success: true,
      relatedParty: updatedParty,
    });
  } catch (err: any) {
    console.error('[AdminExchangeOnboarding] Unexpected error in PATCH /api/admin/exchange/onboarding/related-parties/[id]:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
