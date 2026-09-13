import { NextResponse } from 'next/server';
import { requireApprovedExchangeUser } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portal/exchange/my-requests
 * Returns all exchange requests created by the authenticated customer.
 */
export async function GET(request: Request) {
  try {
    const auth = await requireApprovedExchangeUser(request);
    if (auth.response) return auth.response;
    const { lead } = auth.context!;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: requests, error } = await supabaseAdmin
      .from('exchange_requests')
      .select(`
        id,
        direction,
        eur_currency,
        eur_amount,
        rate,
        irr_amount,
        allow_partial,
        min_chunk,
        status,
        expires_at,
        renewed_count,
        price_version,
        created_at,
        updated_at,
        destination_account:exchange_accounts(id, kind, value, holder_name),
        matches:exchange_matches(id, amount_eur, status, created_at),
        prices:exchange_request_prices(version, rate, irr_amount, changed_at)
      `)
      .eq('requester_lead_id', lead.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer exchange requests:', error);
      return NextResponse.json({ error: 'Failed to fetch your requests.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      requests: requests || [],
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/portal/exchange/my-requests:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
