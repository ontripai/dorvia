import { NextResponse } from 'next/server';
import { requireApprovedExchangeUser } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireApprovedExchangeUser(request);
    if (auth.response) return auth.response;
    const { lead, user } = auth.context!;

    const matchId = params.id;
    if (!matchId) {
      return NextResponse.json({ error: 'Match ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Fetch match and verify it is currently RESERVED and user is party
    const { data: match, error: matchError } = await supabaseAdmin
      .from('exchange_matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (matchError || !match) {
      return NextResponse.json({ error: 'Match not found.' }, { status: 404 });
    }

    if (match.status !== 'RESERVED') {
      return NextResponse.json(
        { error: 'امکان انصراف بدون جریمه فقط در وضعیت RESERVED (طی بازه ۳۰ دقیقه‌ای اولیه) مجاز است.' },
        { status: 400 }
      );
    }

    const isParty = [
      match.eur_payer_lead_id,
      match.eur_receiver_lead_id,
      match.irr_payer_lead_id,
      match.irr_receiver_lead_id,
      match.acceptor_lead_id,
    ].includes(lead.id);

    if (!isParty) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    // 2. Update match status to CANCELLED_FREE
    const { error: updateError } = await supabaseAdmin
      .from('exchange_matches')
      .update({
        status: 'CANCELLED_FREE',
        updated_at: new Date().toISOString(),
      })
      .eq('id', matchId);

    if (updateError) {
      console.error('Error cancelling match:', updateError);
      return NextResponse.json({ error: 'Failed to cancel match.' }, { status: 500 });
    }

    // 3. Increment free_cancellations_30d
    const { data: curProfile } = await supabaseAdmin
      .from('exchange_profiles')
      .select('free_cancellations_30d')
      .eq('lead_id', lead.id)
      .maybeSingle();

    if (curProfile) {
      await supabaseAdmin
        .from('exchange_profiles')
        .update({ free_cancellations_30d: (curProfile.free_cancellations_30d || 0) + 1 })
        .eq('lead_id', lead.id);
    }

    // 4. Log event
    await supabaseAdmin.from('exchange_events').insert({
      match_id: matchId,
      request_id: match.request_id,
      actor: 'client',
      actor_user_id: user.id,
      from_status: 'RESERVED',
      to_status: 'CANCELLED_FREE',
      payload: { action: 'cancel_free_reservation', cancelled_by_lead_id: lead.id },
    });

    return NextResponse.json({
      success: true,
      message: 'رزرو معامله بدون جریمه با موفقیت لغو شد و ظرفیت آزاد گردید.',
      status: 'CANCELLED_FREE',
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/exchange/matches/[id]/cancel-free:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
