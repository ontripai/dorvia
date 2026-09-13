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

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const matchId = params.id;
    if (!matchId) {
      return NextResponse.json({ error: 'شناسه معامله الزامی است.' }, { status: 400 });
    }

    // 1. Fetch match
    const { data: match, error: matchErr } = await supabaseAdmin
      .from('exchange_matches')
      .select(`
        id,
        request_id,
        status,
        eur_payer_lead_id,
        eur_receiver_lead_id,
        irr_payer_lead_id,
        irr_receiver_lead_id,
        destination_account_id,
        reserved_until,
        destination_account_revealed_at,
        destination_account:exchange_accounts(id, kind, value, holder_name)
      `)
      .eq('id', matchId)
      .maybeSingle();

    if (matchErr || !match) {
      return NextResponse.json({ error: 'معامله مورد نظر یافت نشد.' }, { status: 404 });
    }

    const isParticipant = [
      match.eur_payer_lead_id,
      match.eur_receiver_lead_id,
      match.irr_payer_lead_id,
      match.irr_receiver_lead_id,
    ].includes(lead.id);

    if (!isParticipant) {
      return NextResponse.json({ error: 'دسترسی به این معامله مجاز نیست.' }, { status: 403 });
    }

    // Lazy promotion: if match is RESERVED and reserved_until has passed, promote to ACCEPTED
    let effectiveStatus = match.status;
    if (match.status === 'RESERVED' && match.reserved_until && new Date() > new Date(match.reserved_until)) {
      effectiveStatus = 'ACCEPTED';
      await supabaseAdmin
        .from('exchange_matches')
        .update({
          status: 'ACCEPTED',
          updated_at: new Date().toISOString(),
        })
        .eq('id', match.id);

      await supabaseAdmin.from('exchange_events').insert({
        match_id: match.id,
        request_id: match.request_id,
        actor: 'system',
        from_status: 'RESERVED',
        to_status: 'ACCEPTED',
        payload: {
          action: 'lazy_transition_to_accepted',
          reason: 'reserved_until_expired_in_reveal_account',
          reserved_until: match.reserved_until,
        },
      });
    }

    // Only revealed after RESERVED
    const allowedStatuses = [
      'RESERVED',
      'ACCEPTED',
      'EUR_RECEIVED',
      'IRR_PROOF_SUBMITTED',
      'IRR_CONFIRMED',
      'SETTLED',
    ];

    if (!allowedStatuses.includes(effectiveStatus)) {
      return NextResponse.json(
        { error: 'شماره حساب تنها پس از رزرو معامله قابل مشاهده است.' },
        { status: 400 }
      );
    }

    // Record audit event in exchange_events
    await supabaseAdmin.from('exchange_events').insert({
      match_id: match.id,
      request_id: match.request_id,
      actor: 'customer',
      actor_user_id: user.id,
      from_status: effectiveStatus,
      to_status: effectiveStatus,
      payload: {
        action: 'view_destination_account',
        viewed_by_lead_id: lead.id,
        destination_account_id: match.destination_account_id,
      },
    });

    // Update destination_account_revealed_at if first time
    if (!match.destination_account_revealed_at) {
      await supabaseAdmin
        .from('exchange_matches')
        .update({ destination_account_revealed_at: new Date().toISOString() })
        .eq('id', match.id);
    }

    return NextResponse.json({
      success: true,
      destination_account: match.destination_account,
      effectiveStatus,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/exchange/matches/[id]/reveal-account:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
