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

    // 1. Fetch match and check receiver authority
    const { data: match, error: matchErr } = await supabaseAdmin
      .from('exchange_matches')
      .select('id, request_id, status, irr_receiver_lead_id')
      .eq('id', matchId)
      .maybeSingle();

    if (matchErr || !match) {
      return NextResponse.json({ error: 'معامله مورد نظر یافت نشد.' }, { status: 404 });
    }

    if (match.irr_receiver_lead_id !== lead.id) {
      return NextResponse.json(
        { error: 'تنها گیرنده ریال مجاز به تایید دریافت وجه است.' },
        { status: 403 }
      );
    }

    if (!['ACCEPTED', 'EUR_RECEIVED', 'IRR_PROOF_SUBMITTED'].includes(match.status)) {
      return NextResponse.json(
        { error: `در وضعیت جاری (${match.status}) امکان تایید دریافت ریال وجود ندارد.` },
        { status: 400 }
      );
    }

    // 2. Verify receiver proof of transfer exists in exchange_transfer_proofs
    const { count: receiverProofCount, error: countErr } = await supabaseAdmin
      .from('exchange_transfer_proofs')
      .select('id', { count: 'exact', head: true })
      .eq('match_id', match.id)
      .eq('side', 'receiver');

    if (countErr) {
      console.error('Error checking receiver proof count:', countErr);
      return NextResponse.json({ error: 'خطا در بررسی اسناد گیرنده.' }, { status: 500 });
    }

    if (!receiverProofCount || receiverProofCount === 0) {
      return NextResponse.json(
        {
          error: 'برای تایید دریافت، بارگذاری پرینت حساب بانکی گیرنده (صورتحساب نشان‌دهنده نشست واریز) الزامی است.',
          code: 'receiver_proof_required',
        },
        { status: 400 }
      );
    }

    // 3. Update status to IRR_CONFIRMED (guarded by DB trigger trg_exchange_matches_validate_irr_confirmed)
    const { data: updatedMatch, error: updateErr } = await supabaseAdmin
      .from('exchange_matches')
      .update({
        status: 'IRR_CONFIRMED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', match.id)
      .select()
      .single();

    if (updateErr || !updatedMatch) {
      console.error('Error confirming IRR receipt:', updateErr);
      return NextResponse.json(
        { error: updateErr?.message || 'خطا در تایید دریافت ریال.' },
        { status: 500 }
      );
    }

    // 4. Audit event log
    await supabaseAdmin.from('exchange_events').insert({
      match_id: match.id,
      request_id: match.request_id,
      actor: 'customer',
      actor_user_id: user.id,
      from_status: match.status,
      to_status: 'IRR_CONFIRMED',
      payload: {
        action: 'confirm_irr_received',
        confirmed_by_lead_id: lead.id,
      },
    });

    return NextResponse.json({
      success: true,
      match: updatedMatch,
      message: 'دریافت ریال با موفقیت تایید شد.',
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/exchange/matches/[id]/confirm-irr:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
