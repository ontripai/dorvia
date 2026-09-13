import { NextResponse } from 'next/server';
import { requireApprovedExchangeUser, verifyBucharestDailyVolumeLimit } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const auth = await requireApprovedExchangeUser(request);
    if (auth.response) return auth.response;
    const { lead, user } = auth.context!;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { request_id, amount_eur, destination_account_id } = body;

    if (!request_id) {
      return NextResponse.json({ error: 'Request ID is required.' }, { status: 400 });
    }

    const parsedAmount = Number(amount_eur);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Amount EUR must be a positive number.' }, { status: 400 });
    }

    if (!destination_account_id) {
      return NextResponse.json({ error: 'Destination account is required.' }, { status: 400 });
    }

    // 1. Enforce 9,000 EUR Bucharest Daily Limit for acceptor
    const limitCheck = await verifyBucharestDailyVolumeLimit(lead.id, parsedAmount);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.error || 'Exceeded daily Bucharest volume limit.' },
        { status: 400 }
      );
    }

    // 2. Fetch the target exchange request
    const { data: targetReq, error: targetError } = await supabaseAdmin
      .from('exchange_requests')
      .select('id, requester_lead_id, direction, status, allow_partial, min_chunk, eur_amount')
      .eq('id', request_id)
      .maybeSingle();

    if (targetError || !targetReq) {
      return NextResponse.json({ error: 'Exchange request not found.' }, { status: 404 });
    }

    if (targetReq.requester_lead_id === lead.id) {
      return NextResponse.json({ error: 'شما نمی‌توانید درخواست ثبت‌شده‌ی خودتان را بپذیرید.' }, { status: 400 });
    }

    if (!['open', 'partially_matched'].includes(targetReq.status)) {
      return NextResponse.json({ error: 'این درخواست دیگر برای پذیرش فعال نیست.' }, { status: 400 });
    }

    // 3. Verify destination_account_id belongs to the acceptor
    const { data: accData, error: accError } = await supabaseAdmin
      .from('exchange_accounts')
      .select('id, lead_id, kind, is_active')
      .eq('id', destination_account_id)
      .eq('lead_id', lead.id)
      .eq('is_active', true)
      .maybeSingle();

    if (accError || !accData) {
      return NextResponse.json(
        { error: 'حساب مقصد انتخابی معتبر نیست یا به شما تعلق ندارد.' },
        { status: 400 }
      );
    }

    // Direction check for acceptor:
    // If request is RO_TO_IR: Requester gives EUR, receives IRR.
    // Acceptor gives IRR, receives EUR -> Acceptor destination account MUST be Romanian (RO_IBAN).
    // If request is IR_TO_RO: Requester gives IRR, receives EUR.
    // Acceptor gives EUR, receives IRR -> Acceptor destination account MUST be Iranian (IR_SHEBA / IR_CARD).
    if (targetReq.direction === 'RO_TO_IR' && accData.kind !== 'RO_IBAN') {
      return NextResponse.json(
        { error: 'در این معامله شما در رومانی یورو تحویل می‌گیرید؛ حساب مقصد شما باید حساب بانکی رومانیایی (RO IBAN) باشد.' },
        { status: 400 }
      );
    }

    if (targetReq.direction === 'IR_TO_RO' && !['IR_SHEBA', 'IR_CARD'].includes(accData.kind)) {
      return NextResponse.json(
        { error: 'در این معامله شما در ایران ریال تحویل می‌گیرید؛ حساب مقصد شما باید شبا یا کارت معتبر ایرانی باشد.' },
        { status: 400 }
      );
    }

    // 4. Call authoritative database function with row-level locking
    const { data: matchResult, error: rpcError } = await supabaseAdmin.rpc(
      'fn_exchange_reserve_request_match',
      {
        p_request_id: request_id,
        p_acceptor_lead_id: lead.id,
        p_amount_eur: parsedAmount,
        p_destination_account_id: destination_account_id,
        p_reserved_minutes: 30,
      }
    );

    if (rpcError) {
      console.error('Error in fn_exchange_reserve_request_match:', rpcError);
      return NextResponse.json(
        { error: rpcError.message || 'خطا در رزرو معامله. ظرفیت ممکن است هم‌اکنون رزرو شده باشد.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      match: matchResult,
      message: 'معامله با موفقیت به مدت ۳۰ دقیقه رزرو شد.',
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/exchange/matches/reserve:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
