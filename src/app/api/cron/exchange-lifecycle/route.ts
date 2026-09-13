import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { addBankingDays } from '@/lib/exchangeCalendar';

export const dynamic = 'force-dynamic';

/**
 * POST /api/cron/exchange-lifecycle
 * 
 * Scheduled cron job (and manual lifecycle maintenance endpoint) that:
 * 1. Promotes matches stuck in RESERVED past reserved_until to ACCEPTED,
 *    setting the initial eur_due_at deadline via banking calendar.
 * 2. Expires matches that have exceeded their stage deadlines (eur_due_at,
 *    proof_due_at, confirm_due_at) by transitioning them to EXPIRED, freeing up capacity.
 * 
 * Records an immutable audit event in exchange_events for every transition with actor = 'system'.
 * Note: Does NOT record punitive sanctions (failed_trades/suspension) at this phase.
 */
export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // 1. Authenticate Cron Request if CRON_SECRET is configured
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET?.trim();

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[ExchangeCron] Invalid or missing Authorization Bearer token.');
      return NextResponse.json(
        { error: 'Unauthorized: Invalid cron authorization token' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const now = new Date();
    const nowIso = now.toISOString();

    let promotedToAcceptedCount = 0;
    let expiredMatchesCount = 0;
    const actionsLog: Array<{ matchId: string; fromStatus: string; toStatus: string; reason: string }> = [];

    // =========================================================================
    // TASK 1: Promote expired RESERVED matches to ACCEPTED
    // =========================================================================
    const { data: reservedMatches, error: resError } = await supabaseAdmin
      .from('exchange_matches')
      .select('id, request_id, status, reserved_until, eur_due_at')
      .eq('status', 'RESERVED')
      .lt('reserved_until', nowIso);

    if (resError) {
      console.error('[ExchangeCron] Error querying overdue RESERVED matches:', resError);
    } else if (reservedMatches && reservedMatches.length > 0) {
      for (const m of reservedMatches) {
        // Calculate Romanian banking deadline for EUR handover if not set
        const eurDueAt = m.eur_due_at || (await addBankingDays(now, 2, 'RO')).toISOString();

        const { error: updateErr } = await supabaseAdmin
          .from('exchange_matches')
          .update({
            status: 'ACCEPTED',
            eur_due_at: eurDueAt,
            updated_at: nowIso,
          })
          .eq('id', m.id);

        if (!updateErr) {
          promotedToAcceptedCount++;
          actionsLog.push({
            matchId: m.id,
            fromStatus: 'RESERVED',
            toStatus: 'ACCEPTED',
            reason: 'reserved_until_expired',
          });

          await supabaseAdmin.from('exchange_events').insert({
            match_id: m.id,
            request_id: m.request_id,
            actor: 'system',
            actor_user_id: null,
            from_status: 'RESERVED',
            to_status: 'ACCEPTED',
            payload: {
              action: 'cron_transition_to_accepted',
              reason: 'reserved_until_expired',
              previous_reserved_until: m.reserved_until,
              eur_due_at: eurDueAt,
            },
          });
        } else {
          console.error(`[ExchangeCron] Failed to promote match ${m.id}:`, updateErr);
        }
      }
    }

    // =========================================================================
    // TASK 2: Expire matches exceeding stage action deadlines
    // =========================================================================

    // Stage 1: Overdue EUR counter handover
    const { data: overdueEurMatches } = await supabaseAdmin
      .from('exchange_matches')
      .select('id, request_id, status, eur_due_at')
      .eq('status', 'ACCEPTED')
      .not('eur_due_at', 'is', null)
      .lt('eur_due_at', nowIso);

    // Stage 2: Overdue IRR bank transfer proof upload (Iranian banking deadline)
    const { data: overdueProofMatches } = await supabaseAdmin
      .from('exchange_matches')
      .select('id, request_id, status, proof_due_at')
      .eq('status', 'EUR_RECEIVED')
      .not('proof_due_at', 'is', null)
      .lt('proof_due_at', nowIso);

    // Stage 3: Overdue IRR receipt confirmation (Iranian banking deadline)
    const { data: overdueConfirmMatches } = await supabaseAdmin
      .from('exchange_matches')
      .select('id, request_id, status, confirm_due_at')
      .eq('status', 'IRR_PROOF_SUBMITTED')
      .not('confirm_due_at', 'is', null)
      .lt('confirm_due_at', nowIso);

    const matchesToExpire = [
      ...(overdueEurMatches || []).map((m) => ({ ...m, overdueReason: 'eur_due_at_expired' })),
      ...(overdueProofMatches || []).map((m) => ({ ...m, overdueReason: 'proof_due_at_expired' })),
      ...(overdueConfirmMatches || []).map((m) => ({ ...m, overdueReason: 'confirm_due_at_expired' })),
    ];

    for (const m of matchesToExpire) {
      const { error: expireErr } = await supabaseAdmin
        .from('exchange_matches')
        .update({
          status: 'EXPIRED',
          updated_at: nowIso,
        })
        .eq('id', m.id);

      if (!expireErr) {
        expiredMatchesCount++;
        actionsLog.push({
          matchId: m.id,
          fromStatus: m.status,
          toStatus: 'EXPIRED',
          reason: m.overdueReason,
        });

        await supabaseAdmin.from('exchange_events').insert({
          match_id: m.id,
          request_id: m.request_id,
          actor: 'system',
          actor_user_id: null,
          from_status: m.status,
          to_status: 'EXPIRED',
          payload: {
            action: 'cron_expire_match',
            overdue_stage: m.status,
            reason: m.overdueReason,
          },
        });
      } else {
        console.error(`[ExchangeCron] Failed to expire match ${m.id}:`, expireErr);
      }
    }

    return NextResponse.json({
      success: true,
      processedAt: nowIso,
      promotedToAcceptedCount,
      expiredMatchesCount,
      actionsLog,
      durationMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('[ExchangeCron] Unexpected error during exchange lifecycle cron:', error);
    return NextResponse.json(
      { error: 'Internal server error in exchange lifecycle cron.', details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
