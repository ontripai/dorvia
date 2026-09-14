import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/exchange/matches/[id]
 *
 * Retrieves complete case dossier for an exchange match:
 * - Match record with parties (payer, receiver) and request specifications
 * - Bank destination account
 * - Office cash/counter receipts
 * - Office cash/counter payouts
 * - Iranian transfer statements/proofs and verification notes
 * - Authorized cash recipients for the EUR receiver
 * - Append-only immutable audit trail (exchange_events)
 *
 * Requires 'exchange.view' permission.
 */
/**
 * Masks sensitive bank account numbers (IBAN, Sheba, Card) unless the caller
 * has full 'exchange.manage' authority.
 * Shows only the last 4 characters preceded by bullet dots (e.g. ••••1234).
 */
function maskAccountValue(value: string | null | undefined, canManage: boolean): string | null {
  if (!value) return null;
  if (canManage) return value;
  const str = String(value).trim();
  if (str.length <= 4) return '••••';
  return `••••${str.slice(-4)}`;
}

function sanitizeAccount<T extends { value?: string | null }>(
  account: T | T[] | null | undefined,
  canManage: boolean
): any {
  if (!account) return account;
  if (Array.isArray(account)) {
    return account.map((acc) =>
      acc
        ? {
            ...acc,
            value: maskAccountValue(acc.value, canManage),
          }
        : acc
    );
  }
  return {
    ...account,
    value: maskAccountValue(account.value, canManage),
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view exchange matches.' },
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

    // 1. Fetch match dossier
    const { data: match, error: matchError } = await supabaseAdmin
      .from('exchange_matches')
      .select(`
        id,
        request_id,
        acceptor_lead_id,
        amount_eur,
        rate_snapshot,
        amount_irr,
        fee_eur,
        status,
        eur_payer_lead_id,
        eur_receiver_lead_id,
        irr_payer_lead_id,
        irr_receiver_lead_id,
        destination_account_id,
        reserved_until,
        eur_due_at,
        proof_due_at,
        confirm_due_at,
        destination_account_revealed_at,
        partner_id,
        partner_confirmed_at,
        partner_note,
        created_at,
        updated_at,
        request:exchange_requests!exchange_matches_request_id_fkey (
          id,
          direction,
          eur_amount,
          rate,
          irr_amount,
          min_chunk,
          requester_lead_id
        ),
        eur_payer:leads!exchange_matches_eur_payer_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        eur_receiver:leads!exchange_matches_eur_receiver_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        irr_payer:leads!exchange_matches_irr_payer_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        irr_receiver:leads!exchange_matches_irr_receiver_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        partner:exchange_partners!exchange_matches_partner_id_fkey (
          id,
          name,
          country,
          license_number,
          role,
          access_level
        ),
        destination_account:exchange_accounts!exchange_matches_destination_account_id_fkey (
          id,
          kind,
          value,
          holder_name,
          verified_at,
          is_active
        )
      `)
      .eq('id', matchId)
      .maybeSingle();

    if (matchError) {
      console.error(`[AdminExchange] Error querying match ${matchId}:`, matchError);
      return NextResponse.json({ error: 'Failed to retrieve match.' }, { status: 500 });
    }

    if (!match) {
      return NextResponse.json({ error: 'Exchange match not found.' }, { status: 404 });
    }

    // 2. Fetch related office receipts, payouts, transfer proofs, authorized recipients, events in parallel
    const [receiptsRes, payoutsRes, proofsRes, eventsRes, authRecipientsRes] = await Promise.all([
      supabaseAdmin
        .from('exchange_office_receipts')
        .select(`
          id,
          amount,
          currency,
          handled_by,
          partner_reference,
          receipt_no,
          occurred_at,
          note,
          created_at,
          staff_admin:admin_users!exchange_office_receipts_staff_admin_id_fkey (
            id,
            full_name
          ),
          partner:exchange_partners!exchange_office_receipts_partner_id_fkey (
            id,
            name
          )
        `)
        .eq('match_id', matchId)
        .order('occurred_at', { ascending: true }),

      supabaseAdmin
        .from('exchange_office_payouts')
        .select(`
          id,
          amount,
          currency,
          handled_by,
          partner_reference,
          paid_to_lead_id,
          receipt_no,
          occurred_at,
          note,
          created_at,
          paid_to:leads!exchange_office_payouts_paid_to_lead_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          staff_admin:admin_users!exchange_office_payouts_staff_admin_id_fkey (
            id,
            full_name
          ),
          partner:exchange_partners!exchange_office_payouts_partner_id_fkey (
            id,
            name
          )
        `)
        .eq('match_id', matchId)
        .order('occurred_at', { ascending: true }),

      supabaseAdmin
        .from('exchange_transfer_proofs')
        .select(`
          id,
          side,
          proof_type,
          instrument,
          bank_reference,
          statement_period_from,
          statement_period_to,
          submitted_at,
          verified_at,
          verification_channel,
          verification_result,
          verification_note,
          created_at,
          uploader:leads!exchange_transfer_proofs_uploaded_by_lead_id_fkey (
            id,
            full_name
          ),
          account:exchange_accounts!exchange_transfer_proofs_account_id_fkey (
            id,
            kind,
            value,
            holder_name
          ),
          document:lead_documents!exchange_transfer_proofs_document_id_fkey (
            id,
            file_name,
            mime_type,
            size_bytes,
            storage_path
          ),
          verified_by:admin_users!exchange_transfer_proofs_verified_by_admin_id_fkey (
            id,
            full_name
          )
        `)
        .eq('match_id', matchId)
        .order('submitted_at', { ascending: true }),

      supabaseAdmin
        .from('exchange_events')
        .select(`
          id,
          actor,
          actor_user_id,
          from_status,
          to_status,
          payload,
          created_at
        `)
        .eq('match_id', matchId)
        .order('created_at', { ascending: true }),

      supabaseAdmin
        .from('exchange_authorized_recipients')
        .select(`
          id,
          lead_id,
          recipient_lead_id,
          relationship,
          status,
          verified_at,
          recipient:leads!exchange_authorized_recipients_recipient_lead_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('lead_id', match.eur_receiver_lead_id)
        .eq('status', 'approved'),
    ]);

    const canManage = hasPermission(admin, 'exchange.manage');

    const sanitizedMatch = match
      ? {
          ...match,
          destination_account: sanitizeAccount(match.destination_account, canManage),
        }
      : match;

    const rawProofs = proofsRes.data || [];
    const transferProofs = rawProofs.map((proof: any) => ({
      ...proof,
      account: sanitizeAccount(proof.account, canManage),
    }));

    return NextResponse.json({
      match: sanitizedMatch,
      receipts: receiptsRes.data || [],
      payouts: payoutsRes.data || [],
      transferProofs,
      events: eventsRes.data || [],
      authorizedRecipients: authRecipientsRes.data || [],
    });
  } catch (err: any) {
    console.error('[AdminExchange] Unexpected error in GET /api/admin/exchange/matches/[id]:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
