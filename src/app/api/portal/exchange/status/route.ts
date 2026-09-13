import { NextResponse } from 'next/server';
import { getExchangeUserContext, verifyBucharestDailyVolumeLimit } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = await getExchangeUserContext(request);
    if (auth.response) return auth.response;
    const { lead, profile } = auth.context!;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // Fetch user's registered destination accounts
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('exchange_accounts')
      .select('id, kind, value, holder_name, related_party_id, authorized_recipient_id, verified_at, is_active, created_at')
      .eq('lead_id', lead.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (accountsError) {
      console.error('Error fetching exchange accounts:', accountsError);
    }

    // Fetch Bucharest daily limit usage
    const limitInfo = await verifyBucharestDailyVolumeLimit(lead.id, 0);

    return NextResponse.json({
      success: true,
      lead,
      profile,
      accounts: accounts || [],
      dailyVolume: {
        currentDailyEur: limitInfo.currentDailyEur,
        maxDailyLimit: limitInfo.maxDailyLimit,
        remainingEur: Math.max(0, limitInfo.maxDailyLimit - limitInfo.currentDailyEur),
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/portal/exchange/status:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
