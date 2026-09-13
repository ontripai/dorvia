import { NextResponse } from 'next/server';
import { requireApprovedExchangeUser } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = await requireApprovedExchangeUser(request);
    if (auth.response) return auth.response;
    const { lead, user } = auth.context!;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Query all matches where this lead is one of the 4 roles
    const { data: matches, error: matchError } = await supabaseAdmin
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
        created_at,
        updated_at,
        destination_account:exchange_accounts(id, kind, value, holder_name),
        request:exchange_requests(direction, eur_currency),
        proofs:exchange_transfer_proofs(
          id,
          side,
          uploaded_by_lead_id,
          proof_type,
          instrument,
          document_id,
          bank_reference,
          submitted_at,
          verification_result
        )
      `)
      .or(`eur_payer_lead_id.eq.${lead.id},eur_receiver_lead_id.eq.${lead.id},irr_payer_lead_id.eq.${lead.id},irr_receiver_lead_id.eq.${lead.id}`)
      .order('created_at', { ascending: false });

    if (matchError) {
      console.error('Error fetching customer matches:', matchError);
      return NextResponse.json({ error: 'Failed to fetch your matches.' }, { status: 500 });
    }

    // 2. Format matches with role determination and actor assignment
    const formattedMatches = (matches || []).map((m) => {
      // Determine user's active role(s)
      const userRoles: string[] = [];
      if (m.eur_payer_lead_id === lead.id) userRoles.push('eur_payer');
      if (m.eur_receiver_lead_id === lead.id) userRoles.push('eur_receiver');
      if (m.irr_payer_lead_id === lead.id) userRoles.push('irr_payer');
      if (m.irr_receiver_lead_id === lead.id) userRoles.push('irr_receiver');

      // Determine next actionable party
      let nextStep = {
        actorRole: '',
        isMyTurn: false,
        actionLabelFa: '',
        actionLabelEn: '',
        deadline: null as string | null,
      };

      switch (m.status) {
        case 'RESERVED':
          nextStep = {
            actorRole: 'eur_payer',
            isMyTurn: userRoles.includes('eur_payer'),
            actionLabelFa: 'تایید معامله و پرداخت ارز به پیشخوان صرافی در بخارست',
            actionLabelEn: 'Confirm trade and present EUR at Bucharest counter',
            deadline: m.reserved_until,
          };
          break;
        case 'ACCEPTED':
          nextStep = {
            actorRole: 'eur_payer',
            isMyTurn: userRoles.includes('eur_payer'),
            actionLabelFa: 'تحویل یورو/رون به پیشخوان صرافی همکار در بخارست',
            actionLabelEn: 'Hand over EUR/RON at Bucharest partner counter',
            deadline: m.eur_due_at,
          };
          break;
        case 'EUR_RECEIVED':
          nextStep = {
            actorRole: 'irr_payer',
            isMyTurn: userRoles.includes('irr_payer'),
            actionLabelFa: 'انتقال بانکی ریال در ایران و بارگذاری پرینت واریز',
            actionLabelEn: 'Execute IRR bank transfer in Iran and upload statement',
            deadline: m.proof_due_at,
          };
          break;
        case 'IRR_PROOF_SUBMITTED':
          nextStep = {
            actorRole: 'irr_receiver',
            isMyTurn: userRoles.includes('irr_receiver'),
            actionLabelFa: 'بررسی نشست واریز در حساب ایران، بارگذاری پرینت و تایید دریافت',
            actionLabelEn: 'Check bank statement, upload receiver proof, and confirm receipt',
            deadline: m.confirm_due_at,
          };
          break;
        case 'IRR_CONFIRMED':
          nextStep = {
            actorRole: 'partner_exchange',
            isMyTurn: false,
            actionLabelFa: 'آماده‌سازی خروج و تحویل وجه یورو/رون به گیرنده در بخارست توسط صرافی همکار',
            actionLabelEn: 'Partner counter preparing EUR payout to receiver in Bucharest',
            deadline: null,
          };
          break;
        case 'SETTLED':
          nextStep = {
            actorRole: 'none',
            isMyTurn: false,
            actionLabelFa: 'معامله با موفقیت تسویه شد و خاتمه یافت',
            actionLabelEn: 'Trade settled and completed',
            deadline: null,
          };
          break;
        default:
          nextStep = {
            actorRole: 'admin',
            isMyTurn: false,
            actionLabelFa: 'در حال بررسی یا رسیدگی کارشناسان',
            actionLabelEn: 'Under review',
            deadline: null,
          };
      }

      // Revealed destination account:
      // Destination account is visible to the party paying that currency:
      // - IRR payer needs the IRR receiver's destination account
      // - EUR payer needs office instructions (custody at partner counter)
      const hasAccountRevealed = ['RESERVED', 'ACCEPTED', 'EUR_RECEIVED', 'IRR_PROOF_SUBMITTED', 'IRR_CONFIRMED', 'SETTLED'].includes(m.status);

      return {
        ...m,
        userRoles,
        nextStep,
        destination_account: hasAccountRevealed ? m.destination_account : null,
      };
    });

    return NextResponse.json({
      success: true,
      matches: formattedMatches,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/portal/exchange/matches:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
