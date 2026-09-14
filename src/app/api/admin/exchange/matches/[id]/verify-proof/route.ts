import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/exchange/matches/[id]/verify-proof
 *
 * Records staff verification and cross-checking on an Iranian transfer statement/proof.
 *
 * Rules:
 * - Requires 'exchange.manage' permission.
 * - verified_by_admin_id is ALWAYS derived from server session (admin.adminUserId).
 * - match_id is extracted from route parameters.
 * - STRICTLY DOES NOT change match status (pure staff verification audit).
 * - Appends audit event to exchange_events.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.manage')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to verify transfer proofs.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const matchId = resolvedParams?.id?.trim();
    if (!matchId) {
      return NextResponse.json({ error: 'Match ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { proof_id, verification_channel, verification_result, verification_note } = body;

    const cleanProofId = proof_id ? String(proof_id).trim() : '';
    if (!cleanProofId) {
      return NextResponse.json({ error: 'proof_id is required.' }, { status: 400 });
    }

    const cleanResult = verification_result ? String(verification_result).trim().toLowerCase() : '';
    if (!['confirmed', 'inconclusive', 'rejected'].includes(cleanResult)) {
      return NextResponse.json(
        { error: "verification_result must be 'confirmed', 'inconclusive', or 'rejected'." },
        { status: 400 }
      );
    }

    const cleanChannel = verification_channel ? String(verification_channel).trim() : null;
    if (cleanChannel && cleanChannel.length > 32) {
      return NextResponse.json(
        { error: 'verification_channel must not exceed 32 characters.' },
        { status: 400 }
      );
    }

    const cleanNote = verification_note ? String(verification_note).trim() : null;

    // 1. Verify proof belongs to this match
    const { data: existingProof, error: findError } = await supabaseAdmin
      .from('exchange_transfer_proofs')
      .select('id, match_id')
      .eq('id', cleanProofId)
      .eq('match_id', matchId)
      .maybeSingle();

    if (findError) {
      console.error(`[AdminExchange] Error finding proof ${cleanProofId}:`, findError);
      return NextResponse.json({ error: 'Failed to find transfer proof.' }, { status: 500 });
    }

    if (!existingProof) {
      return NextResponse.json(
        { error: 'Transfer proof not found for this match.' },
        { status: 404 }
      );
    }

    const verifiedAt = new Date().toISOString();

    // 2. Update proof verification metadata (NEVER modifies exchange_matches status)
    const { data: updatedProof, error: updateError } = await supabaseAdmin
      .from('exchange_transfer_proofs')
      .update({
        verified_by_admin_id: admin.adminUserId,
        verified_at: verifiedAt,
        verification_channel: cleanChannel,
        verification_result: cleanResult,
        verification_note: cleanNote,
      })
      .eq('id', cleanProofId)
      .select()
      .single();

    if (updateError) {
      console.error(`[AdminExchange] Error updating proof verification:`, updateError);
      return NextResponse.json(
        { error: 'Failed to update proof verification.' },
        { status: 500 }
      );
    }

    // 3. Append audit log
    await supabaseAdmin
      .from('exchange_events')
      .insert({
        match_id: matchId,
        actor: 'staff',
        actor_user_id: admin.adminUserId,
        from_status: null,
        to_status: null,
        payload: {
          event: 'proof_verification_updated',
          proof_id: cleanProofId,
          verification_result: cleanResult,
          verification_channel: cleanChannel,
          verified_at: verifiedAt,
        },
      });

    return NextResponse.json({
      success: true,
      proof: updatedProof,
    });
  } catch (err: any) {
    console.error('[AdminExchange] Unexpected error in POST /api/admin/exchange/matches/[id]/verify-proof:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
