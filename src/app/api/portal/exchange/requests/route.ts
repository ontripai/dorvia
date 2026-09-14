import { NextResponse } from 'next/server';
import { requireApprovedExchangeUser, verifyBucharestDailyVolumeLimit } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portal/exchange/requests
 * Order book: lists open requests from other users without leaking account details.
 */
export async function GET(request: Request) {
  try {
    const auth = await requireApprovedExchangeUser(request);
    if (auth.response) return auth.response;
    const { lead } = auth.context!;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const nowIso = new Date().toISOString();

    // STRICT PRIVACY: Do NOT select destination_account_id or any bank details
    const { data: requests, error: reqError } = await supabaseAdmin
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
        created_at
      `)
      .in('status', ['open', 'partially_matched'])
      .gt('expires_at', nowIso)
      .neq('requester_lead_id', lead.id)
      .order('created_at', { ascending: false });

    if (reqError) {
      console.error('Error fetching order book requests:', reqError);
      return NextResponse.json({ error: 'Failed to fetch active requests.' }, { status: 500 });
    }

    // Compute remaining capacity for each request
    const requestIds = (requests || []).map((r) => r.id);
    let activeMatchesByReq: Record<string, number> = {};

    if (requestIds.length > 0) {
      const { data: matches } = await supabaseAdmin
        .from('exchange_matches')
        .select('request_id, amount_eur, status')
        .in('request_id', requestIds)
        .not('status', 'in', '("CANCELLED_FREE","REFUNDED","EXPIRED")');

      (matches || []).forEach((m) => {
        activeMatchesByReq[m.request_id] = (activeMatchesByReq[m.request_id] || 0) + Number(m.amount_eur || 0);
      });
    }

    const orderBook = (requests || []).map((r) => {
      const allocated = activeMatchesByReq[r.id] || 0;
      const remainingEur = Math.max(0, Number(r.eur_amount) - allocated);
      return {
        id: r.id,
        direction: r.direction,
        eur_currency: r.eur_currency,
        eur_amount: Number(r.eur_amount),
        rate: Number(r.rate),
        irr_amount: Number(r.irr_amount),
        allow_partial: r.allow_partial,
        min_chunk: r.min_chunk ? Number(r.min_chunk) : null,
        status: r.status,
        expires_at: r.expires_at,
        created_at: r.created_at,
        remaining_eur: remainingEur,
      };
    }).filter((r) => r.remaining_eur > 0);

    return NextResponse.json({
      success: true,
      requests: orderBook,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/portal/exchange/requests:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * POST /api/portal/exchange/requests
 * Creates a new exchange request from the authenticated lead.
 */
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

    const {
      direction,
      eur_currency = 'EUR',
      eur_amount,
      rate,
      allow_partial = false,
      min_chunk,
      destination_account_id,
    } = body;

    // 1. Basic validation
    if (!['RO_TO_IR', 'IR_TO_RO'].includes(direction)) {
      return NextResponse.json({ error: 'Invalid exchange direction.' }, { status: 400 });
    }

    if (!['EUR', 'RON'].includes(eur_currency)) {
      return NextResponse.json({ error: 'Invalid currency (must be EUR or RON).' }, { status: 400 });
    }

    const parsedEur = Number(eur_amount);
    const parsedRate = Number(rate);

    if (isNaN(parsedEur) || parsedEur <= 0) {
      return NextResponse.json({ error: 'EUR amount must be a positive number.' }, { status: 400 });
    }

    if (isNaN(parsedRate) || parsedRate <= 0) {
      return NextResponse.json({ error: 'Rate must be a positive number.' }, { status: 400 });
    }

    const parsedMinChunk = min_chunk ? Number(min_chunk) : null;
    if (allow_partial && parsedMinChunk && (parsedMinChunk <= 0 || parsedMinChunk > parsedEur)) {
      return NextResponse.json(
        { error: 'Minimum chunk must be greater than zero and less than total amount.' },
        { status: 400 }
      );
    }

    // 2. Server-side Daily Bucharest 9,000 EUR Limit Check
    const limitCheck = await verifyBucharestDailyVolumeLimit(lead.id, parsedEur);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.error || 'Exceeded daily Bucharest volume limit.' },
        { status: 400 }
      );
    }

    // 3. Verify destination_account_id belongs to this lead and matches currency requirements
    if (!destination_account_id) {
      return NextResponse.json({ error: 'Destination account is required.' }, { status: 400 });
    }

    const { data: account, error: accError } = await supabaseAdmin
      .from('exchange_accounts')
      .select('id, lead_id, kind, is_active, verified_at')
      .eq('id', destination_account_id)
      .eq('lead_id', lead.id)
      .eq('is_active', true)
      .maybeSingle();

    if (accError || !account) {
      return NextResponse.json(
        { error: 'Selected destination account is invalid, inactive, or not owned by you.' },
        { status: 400 }
      );
    }

    if (!account.verified_at) {
      return NextResponse.json(
        { error: 'حساب مقصد انتخابی هنوز توسط کارشناسان دورویا تایید نشده است. تا زمان تایید، امکان ثبت درخواست وجود ندارد.' },
        { status: 400 }
      );
    }

    // Account kind validation by direction:
    // If RO_TO_IR (giving EUR, receiving IRR), destination account MUST be Iranian (IR_SHEBA / IR_CARD)
    // If IR_TO_RO (giving IRR, receiving EUR), destination account MUST be Romanian (RO_IBAN)
    if (direction === 'RO_TO_IR' && !['IR_SHEBA', 'IR_CARD'].includes(account.kind)) {
      return NextResponse.json(
        { error: 'برای جهت ارسال یورو به ایران، حساب مقصد دریافت ریال باید شماره شبا یا کارت معتبر ایرانی باشد.' },
        { status: 400 }
      );
    }

    if (direction === 'IR_TO_RO' && account.kind !== 'RO_IBAN') {
      return NextResponse.json(
        { error: 'برای جهت ارسال ریال به رومانی، حساب مقصد دریافت یورو باید شماره شبا رومانیایی (RO IBAN) باشد.' },
        { status: 400 }
      );
    }

    // 4. Calculate IRR Amount: rounded to nearest integer
    const parsedIrr = Math.round(parsedEur * parsedRate);

    // Automatic 24 hours expiry
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 5. Insert exchange_requests
    const { data: newRequest, error: insertError } = await supabaseAdmin
      .from('exchange_requests')
      .insert({
        requester_lead_id: lead.id,
        direction,
        eur_currency,
        eur_amount: parsedEur,
        rate: parsedRate,
        irr_amount: parsedIrr,
        allow_partial,
        min_chunk: allow_partial ? parsedMinChunk : null,
        destination_account_id: account.id,
        status: 'open',
        expires_at: expiresAt,
        price_version: 1,
      })
      .select()
      .single();

    if (insertError || !newRequest) {
      console.error('Error inserting exchange request:', insertError);
      return NextResponse.json({ error: insertError?.message || 'Failed to create exchange request.' }, { status: 500 });
    }

    // 6. Record price audit version 1
    await supabaseAdmin.from('exchange_request_prices').insert({
      request_id: newRequest.id,
      version: 1,
      rate: parsedRate,
      irr_amount: parsedIrr,
      changed_by: null,
    });

    // 7. Audit log event
    await supabaseAdmin.from('exchange_events').insert({
      request_id: newRequest.id,
      actor: 'client',
      actor_user_id: user.id,
      from_status: null,
      to_status: 'open',
      payload: {
        action: 'create_request',
        direction,
        eur_amount: parsedEur,
        rate: parsedRate,
        irr_amount: parsedIrr,
      },
    });

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: 'درخواست تبادل ارز با موفقیت ثبت شد و به مدت ۲۴ ساعت در دفتر سفارش‌ها فعال است.',
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/exchange/requests:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
