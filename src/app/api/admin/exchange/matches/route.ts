import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/exchange/matches
 *
 * Lists exchange matches with pagination and status filtering for staff review.
 * Requires 'exchange.view' permission.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view exchange matches.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
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
          role
        )
      `, { count: 'exact' });

    if (statusParam && statusParam.toLowerCase() !== 'all') {
      if (statusParam.includes(',')) {
        const statuses = statusParam.split(',').map((s) => s.trim().toUpperCase());
        query = query.in('status', statuses);
      } else {
        query = query.eq('status', statusParam.toUpperCase());
      }
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: matches, error, count } = await query;

    if (error) {
      console.error('[AdminExchange] Error fetching matches:', error);
      return NextResponse.json({ error: 'Failed to fetch exchange matches.' }, { status: 500 });
    }

    const total = count ?? (matches?.length || 0);

    return NextResponse.json({
      matches: matches || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      admin: {
        ...admin,
        permissions: Array.from(admin.permissions),
      },
    });
  } catch (err: any) {
    console.error('[AdminExchange] Unexpected error in GET /api/admin/exchange/matches:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
