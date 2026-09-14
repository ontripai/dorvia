import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/exchange/matches/[id]/payout
 *
 * Atomically records physical/counter EUR/RON release to the customer (or approved authorized recipient),
 * transitioning the match state machine from IRR_CONFIRMED to SETTLED.
 *
 * Security & Integrity:
 * - Requires 'exchange.manage' permission.
 * - staff_admin_id is ALWAYS derived from the authenticated session (admin.adminUserId), NEVER from body.
 * - match_id is extracted strictly from URL parameters.
 * - Enforces recipient identity verification against public.exchange_authorized_recipients.
 * - Triggers db-level constraint fn_exchange_matches_validate_settled.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.manage')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to record exchange payouts.' },
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

    const {
      amount,
      currency = 'EUR',
      handled_by = 'partner_exchange',
      partner_id = null,
      partner_reference,
      paid_to_lead_id,
      receipt_no,
      occurred_at,
      note,
    } = body;

    // 1. Strict input validation
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Valid positive amount is required.' }, { status: 400 });
    }

    const cleanCurrency = String(currency).toUpperCase().trim();
    if (!['EUR', 'RON'].includes(cleanCurrency)) {
      return NextResponse.json({ error: 'Currency must be EUR or RON.' }, { status: 400 });
    }

    const cleanHandledBy = String(handled_by).trim();
    if (!['dorvia_office', 'partner_exchange'].includes(cleanHandledBy)) {
      return NextResponse.json(
        { error: "handled_by must be 'dorvia_office' or 'partner_exchange'." },
        { status: 400 }
      );
    }

    const cleanPartnerRef = partner_reference ? String(partner_reference).trim() : '';
    if (!cleanPartnerRef) {
      return NextResponse.json({ error: 'Partner reference is required.' }, { status: 400 });
    }

    const cleanPaidToLeadId = paid_to_lead_id ? String(paid_to_lead_id).trim() : '';
    if (!cleanPaidToLeadId) {
      return NextResponse.json({ error: 'Recipient Lead ID (paid_to_lead_id) is required.' }, { status: 400 });
    }

    const cleanReceiptNo = receipt_no ? String(receipt_no).trim() : '';
    if (!cleanReceiptNo) {
      return NextResponse.json({ error: 'Receipt / voucher number is required.' }, { status: 400 });
    }

    const cleanNote = note ? String(note).trim() : null;
    if (cleanCurrency === 'RON' && !cleanNote) {
      return NextResponse.json(
        { error: 'Note with exchange rate conversion details is required when paying out RON.' },
        { status: 400 }
      );
    }

    // 2. Atomic invocation of stored procedure
    const { data: payoutId, error: rpcError } = await supabaseAdmin.rpc(
      'fn_exchange_record_office_payout',
      {
        p_match_id: matchId,
        p_amount: numAmount,
        p_currency: cleanCurrency,
        p_handled_by: cleanHandledBy,
        p_partner_id: partner_id || null,
        p_partner_reference: cleanPartnerRef,
        p_paid_to_lead_id: cleanPaidToLeadId,
        p_receipt_no: cleanReceiptNo,
        p_staff_admin_id: admin.adminUserId, // Enforced from server session
        p_occurred_at: occurred_at || new Date().toISOString(),
        p_note: cleanNote,
      }
    );

    if (rpcError) {
      console.error(`[AdminExchange] Error recording office payout for match ${matchId}:`, rpcError);

      const msg = rpcError.message || '';
      if (msg.includes('uq_exchange_office_payouts_match') || msg.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'A payout has already been recorded for this match.' },
          { status: 409 }
        );
      }
      if (msg.includes('expected IRR_CONFIRMED') || msg.includes('not in IRR_CONFIRMED status')) {
        return NextResponse.json(
          { error: 'Match is not in IRR_CONFIRMED status. Payout can only be released after Iranian transfer confirmation.' },
          { status: 409 }
        );
      }
      if (msg.includes('neither EUR receiver') || msg.includes('approved authorized recipient')) {
        return NextResponse.json(
          { error: 'The recipient is neither the primary EUR receiver nor an approved authorized recipient.' },
          { status: 403 }
        );
      }
      if (msg.includes('Invalid EUR payout amount')) {
        return NextResponse.json(
          { error: 'Payout amount does not match expected EUR trade amount (fee is retained by platform).' },
          { status: 400 }
        );
      }
      if (msg.includes('not found')) {
        return NextResponse.json({ error: 'Exchange match not found.' }, { status: 404 });
      }

      return NextResponse.json(
        { error: msg || 'Failed to record exchange payout.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      payoutId,
      matchId,
      status: 'SETTLED',
    });
  } catch (err: any) {
    console.error('[AdminExchange] Unexpected error in POST /api/admin/exchange/matches/[id]/payout:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
