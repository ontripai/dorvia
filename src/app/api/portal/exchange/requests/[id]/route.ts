import { NextResponse } from 'next/server';
import { requireApprovedExchangeUser } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireApprovedExchangeUser(request);
    if (auth.response) return auth.response;
    const { lead, user } = auth.context!;

    const requestId = params.id;
    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.action) {
      return NextResponse.json({ error: 'Action is required (rate_adjust, renew, cancel).' }, { status: 400 });
    }

    // 1. Fetch request and check ownership
    const { data: exchangeReq, error: reqError } = await supabaseAdmin
      .from('exchange_requests')
      .select('*')
      .eq('id', requestId)
      .eq('requester_lead_id', lead.id)
      .maybeSingle();

    if (reqError || !exchangeReq) {
      return NextResponse.json({ error: 'Request not found or unauthorized.' }, { status: 404 });
    }

    // 2. Check for active matches on this request
    const { data: activeMatches, error: matchError } = await supabaseAdmin
      .from('exchange_matches')
      .select('id, status')
      .eq('request_id', requestId)
      .not('status', 'in', '("CANCELLED_FREE","REFUNDED","EXPIRED")');

    if (matchError) {
      console.error('Error querying active matches:', matchError);
      return NextResponse.json({ error: 'Error checking request matches.' }, { status: 500 });
    }

    const hasActiveMatches = (activeMatches || []).length > 0;

    // Handle Actions
    if (body.action === 'rate_adjust') {
      if (hasActiveMatches) {
        return NextResponse.json(
          { error: 'امکان تغییر نرخ برای درخواستی که دارای معامله فعال یا رزروشده است وجود ندارد.' },
          { status: 400 }
        );
      }

      const newRate = Number(body.new_rate);
      if (isNaN(newRate) || newRate <= 0) {
        return NextResponse.json({ error: 'نرخ جدید باید عددی مثبت باشد.' }, { status: 400 });
      }

      const newIrr = Math.round(Number(exchangeReq.eur_amount) * newRate);
      const newVersion = (exchangeReq.price_version || 1) + 1;

      // Update request rate & irr_amount & price_version
      const { error: updateError } = await supabaseAdmin
        .from('exchange_requests')
        .update({
          rate: newRate,
          irr_amount: newIrr,
          price_version: newVersion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) {
        return NextResponse.json({ error: 'خطا در به‌روزرسانی نرخ درخواست.' }, { status: 500 });
      }

      // Record in exchange_request_prices
      await supabaseAdmin.from('exchange_request_prices').insert({
        request_id: requestId,
        version: newVersion,
        rate: newRate,
        irr_amount: newIrr,
        changed_by: null,
      });

      // Audit event
      await supabaseAdmin.from('exchange_events').insert({
        request_id: requestId,
        actor: 'client',
        actor_user_id: user.id,
        from_status: exchangeReq.status,
        to_status: exchangeReq.status,
        payload: { action: 'rate_adjust', old_rate: exchangeReq.rate, new_rate: newRate, new_version: newVersion },
      });

      return NextResponse.json({
        success: true,
        message: 'نرخ جدید با موفقیت اعمال شد.',
        rate: newRate,
        irr_amount: newIrr,
        price_version: newVersion,
      });
    }

    if (body.action === 'renew') {
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const newRenewedCount = (exchangeReq.renewed_count || 0) + 1;

      const { error: renewError } = await supabaseAdmin
        .from('exchange_requests')
        .update({
          expires_at: newExpiresAt,
          renewed_count: newRenewedCount,
          status: hasActiveMatches ? 'partially_matched' : 'open',
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (renewError) {
        return NextResponse.json({ error: 'خطا در تمدید درخواست.' }, { status: 500 });
      }

      await supabaseAdmin.from('exchange_events').insert({
        request_id: requestId,
        actor: 'client',
        actor_user_id: user.id,
        from_status: exchangeReq.status,
        to_status: exchangeReq.status,
        payload: { action: 'renew', expires_at: newExpiresAt, renewed_count: newRenewedCount },
      });

      return NextResponse.json({
        success: true,
        message: 'درخواست به مدت ۲۴ ساعت دیگر تمدید شد.',
        expires_at: newExpiresAt,
        renewed_count: newRenewedCount,
      });
    }

    if (body.action === 'cancel') {
      if (hasActiveMatches) {
        return NextResponse.json(
          { error: 'امکان لغو درخواستی که دارای معامله فعال است وجود ندارد.' },
          { status: 400 }
        );
      }

      const { error: cancelError } = await supabaseAdmin
        .from('exchange_requests')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (cancelError) {
        return NextResponse.json({ error: 'خطا در لغو درخواست.' }, { status: 500 });
      }

      await supabaseAdmin.from('exchange_events').insert({
        request_id: requestId,
        actor: 'client',
        actor_user_id: user.id,
        from_status: exchangeReq.status,
        to_status: 'cancelled',
        payload: { action: 'cancel_request' },
      });

      return NextResponse.json({
        success: true,
        message: 'درخواست با موفقیت لغو شد.',
        status: 'cancelled',
      });
    }

    return NextResponse.json({ error: 'عملیات درخواستی نامعتبر است.' }, { status: 400 });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/portal/exchange/requests/[id]:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
