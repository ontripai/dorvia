import { NextResponse } from 'next/server';
import { requireApprovedExchangeUser } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { addBankingDays } from '@/lib/exchangeCalendar';

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

    // 1. Fetch match and verify customer is a participant
    const { data: match, error: matchErr } = await supabaseAdmin
      .from('exchange_matches')
      .select('id, request_id, status, eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id, destination_account_id')
      .eq('id', matchId)
      .maybeSingle();

    if (matchErr || !match) {
      return NextResponse.json({ error: 'معامله مورد نظر یافت نشد.' }, { status: 404 });
    }

    const isIrrPayer = match.irr_payer_lead_id === lead.id;
    const isIrrReceiver = match.irr_receiver_lead_id === lead.id;

    if (!isIrrPayer && !isIrrReceiver) {
      return NextResponse.json(
        { error: 'شما مجاز به بارگذاری سند برای این معامله نیستید.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      side: reqSide,
      instrument,
      proof_type,
      document_id,
      account_id,
      bank_reference,
      statement_period_from,
      statement_period_to,
    } = body;

    // Determine authoritative side
    let side: 'payer' | 'receiver';
    if (isIrrPayer && !isIrrReceiver) {
      side = 'payer';
    } else if (isIrrReceiver && !isIrrPayer) {
      side = 'receiver';
    } else {
      side = reqSide === 'receiver' ? 'receiver' : 'payer';
    }

    // Decision 1: Persian transfer instruments allowed: 'card_to_card', 'satna', 'paya'
    const allowedInstruments = ['card_to_card', 'satna', 'paya'];
    if (!allowedInstruments.includes(instrument)) {
      return NextResponse.json(
        { error: 'ابزار انتقال نامعتبر است. فقط کارت‌به‌کارت، ساتنا و پایا مجاز هستند.' },
        { status: 400 }
      );
    }

    // Proof type validation
    const validProofTypes = side === 'receiver' ? ['account_statement'] : ['transfer_receipt', 'account_statement'];
    if (!validProofTypes.includes(proof_type)) {
      return NextResponse.json(
        { error: side === 'receiver' ? 'برای گیرنده فقط پرینت صورتحساب مجاز است.' : 'نوع سند نامعتبر است.' },
        { status: 400 }
      );
    }

    // Verify document_id belongs to this lead
    if (!document_id) {
      return NextResponse.json({ error: 'شناسه سند بارگذاری‌شده الزامی است.' }, { status: 400 });
    }
    const { data: doc, error: docErr } = await supabaseAdmin
      .from('lead_documents')
      .select('id, lead_id')
      .eq('id', document_id)
      .eq('lead_id', lead.id)
      .maybeSingle();

    if (docErr || !doc) {
      return NextResponse.json(
        { error: 'سند بارگذاری‌شده معتبر نبوده یا به این حساب کاربری تعلق ندارد.' },
        { status: 400 }
      );
    }

    // Verify or default account_id
    const targetAccountId = account_id || match.destination_account_id;
    if (!targetAccountId) {
      return NextResponse.json({ error: 'حساب بانکی مربوطه الزامی است.' }, { status: 400 });
    }

    // Insert into exchange_transfer_proofs
    const { data: newProof, error: proofInsertErr } = await supabaseAdmin
      .from('exchange_transfer_proofs')
      .insert({
        match_id: match.id,
        side,
        uploaded_by_lead_id: lead.id,
        proof_type,
        instrument,
        document_id: doc.id,
        account_id: targetAccountId,
        bank_reference: bank_reference ? String(bank_reference).trim() : null,
        statement_period_from: statement_period_from || null,
        statement_period_to: statement_period_to || null,
      })
      .select()
      .single();

    if (proofInsertErr || !newProof) {
      console.error('Error inserting exchange transfer proof:', proofInsertErr);
      return NextResponse.json({ error: 'خطا در ثبت سند انتقال.' }, { status: 500 });
    }

    let updatedMatchStatus = match.status;

    // If payer uploaded proof and match is in ACCEPTED or EUR_RECEIVED, advance status to IRR_PROOF_SUBMITTED
    if (side === 'payer' && ['ACCEPTED', 'EUR_RECEIVED'].includes(match.status)) {
      // Calculate confirmation deadline based on Iranian banking calendar
      const confirmDueAt = await addBankingDays(new Date(), 2, 'IR');

      const { data: updatedMatch, error: statusUpdateErr } = await supabaseAdmin
        .from('exchange_matches')
        .update({
          status: 'IRR_PROOF_SUBMITTED',
          confirm_due_at: confirmDueAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', match.id)
        .select()
        .single();

      if (!statusUpdateErr && updatedMatch) {
        updatedMatchStatus = updatedMatch.status;
      }
    }

    // Append audit trail to exchange_events
    await supabaseAdmin.from('exchange_events').insert({
      match_id: match.id,
      request_id: match.request_id,
      actor: 'customer',
      actor_user_id: user.id,
      from_status: match.status,
      to_status: updatedMatchStatus,
      payload: {
        action: 'upload_transfer_proof',
        proof_id: newProof.id,
        side,
        instrument,
        bank_reference: newProof.bank_reference,
      },
    });

    return NextResponse.json({
      success: true,
      proof: newProof,
      matchStatus: updatedMatchStatus,
      message: 'سند با موفقیت ثبت شد.',
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/exchange/matches/[id]/proofs:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
