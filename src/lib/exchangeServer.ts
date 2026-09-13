/**
 * Exchange Portal Server-Side Helper (dre-p127)
 * Repository: github.com/ontripai/dorvia
 *
 * Provides authoritative server-side session authentication, lead resolution,
 * exchange approval verification, and Bucharest calendar day limit enforcement.
 */

import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { ExchangeProfileStatus } from '@/types/exchange';

export interface AuthenticatedExchangeContext {
  user: { id: string; email?: string };
  lead: {
    id: string;
    user_id: string;
    email: string | null;
    full_name: string;
    phone: string | null;
    verified_at: string | null;
  };
  profile: {
    id: string;
    lead_id: string;
    exchange_status: ExchangeProfileStatus;
    approved_at: string | null;
    completed_trades: number;
    failed_trades: number;
    free_cancellations_30d: number;
  };
}

/**
 * Server-side gate verifying that the request originates from an authenticated user
 * with a linked lead profile and an approved exchange_profile.
 */
export async function requireApprovedExchangeUser(
  request: Request
): Promise<{ context?: AuthenticatedExchangeContext; response?: NextResponse }> {
  try {
    const supabase = createServerComponentClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        response: NextResponse.json(
          { error: 'Unauthorized. Please sign in to access exchange services.' },
          { status: 401 }
        ),
      };
    }

    if (!supabaseAdmin) {
      return {
        response: NextResponse.json(
          { error: 'Database service unconfigured.' },
          { status: 500 }
        ),
      };
    }

    // 1. Resolve lead linked to this auth user
    let { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('id, user_id, email, full_name, phone, verified_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!lead && user.email) {
      const userEmail = user.email.trim().toLowerCase();
      const { data: fallbackLead } = await supabaseAdmin
        .from('leads')
        .select('id, user_id, email, full_name, phone, verified_at')
        .eq('email', userEmail)
        .maybeSingle();

      if (fallbackLead) {
        await supabaseAdmin
          .from('leads')
          .update({ user_id: user.id })
          .eq('id', fallbackLead.id);

        lead = { ...fallbackLead, user_id: user.id };
      }
    }

    if (leadError || !lead) {
      return {
        response: NextResponse.json(
          { error: 'No active lead profile associated with this account.', code: 'no_lead' },
          { status: 403 }
        ),
      };
    }

    // 2. Fetch exchange profile
    let { data: profile, error: profileError } = await supabaseAdmin
      .from('exchange_profiles')
      .select('id, lead_id, exchange_status, approved_at, completed_trades, failed_trades, free_cancellations_30d')
      .eq('lead_id', lead.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error querying exchange_profiles:', profileError);
      return {
        response: NextResponse.json(
          { error: 'Error checking exchange profile status.' },
          { status: 500 }
        ),
      };
    }

    // Auto-initialize profile if missing
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabaseAdmin
        .from('exchange_profiles')
        .insert({ lead_id: lead.id, exchange_status: 'not_requested' })
        .select()
        .single();

      if (insertError) {
        console.error('Failed to create exchange profile:', insertError);
        return {
          response: NextResponse.json(
            { error: 'Failed to initialize exchange profile.' },
            { status: 500 }
          ),
        };
      }
      profile = newProfile;
    }

    if (!profile || profile.exchange_status !== 'approved') {
      return {
        response: NextResponse.json(
          {
            error: 'Exchange access is restricted. Your profile has not been approved yet.',
            code: 'exchange_not_approved',
            exchange_status: profile?.exchange_status || 'not_requested',
          },
          { status: 403 }
        ),
      };
    }

    return {
      context: {
        user: { id: user.id, email: user.email },
        lead,
        profile: profile as AuthenticatedExchangeContext['profile'],
      },
    };
  } catch (error) {
    console.error('Unexpected error in requireApprovedExchangeUser:', error);
    return {
      response: NextResponse.json(
        { error: 'Internal server error in exchange authorization.' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Server-side gate for checking status without throwing 403 when unapproved.
 * Used for status checking and access request.
 */
export async function getExchangeUserContext(
  request: Request
): Promise<{ context?: AuthenticatedExchangeContext; response?: NextResponse }> {
  try {
    const supabase = createServerComponentClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        response: NextResponse.json(
          { error: 'Unauthorized. Please sign in.' },
          { status: 401 }
        ),
      };
    }

    if (!supabaseAdmin) {
      return {
        response: NextResponse.json(
          { error: 'Database service unconfigured.' },
          { status: 500 }
        ),
      };
    }

    let { data: lead } = await supabaseAdmin
      .from('leads')
      .select('id, user_id, email, full_name, phone, verified_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!lead && user.email) {
      const { data: fallbackLead } = await supabaseAdmin
        .from('leads')
        .select('id, user_id, email, full_name, phone, verified_at')
        .eq('email', user.email.trim().toLowerCase())
        .maybeSingle();

      if (fallbackLead) {
        await supabaseAdmin.from('leads').update({ user_id: user.id }).eq('id', fallbackLead.id);
        lead = { ...fallbackLead, user_id: user.id };
      }
    }

    if (!lead) {
      return {
        response: NextResponse.json(
          { error: 'No active lead profile associated with this account.', code: 'no_lead' },
          { status: 403 }
        ),
      };
    }

    let { data: profile } = await supabaseAdmin
      .from('exchange_profiles')
      .select('id, lead_id, exchange_status, approved_at, completed_trades, failed_trades, free_cancellations_30d')
      .eq('lead_id', lead.id)
      .maybeSingle();

    if (!profile) {
      const { data: newProfile } = await supabaseAdmin
        .from('exchange_profiles')
        .insert({ lead_id: lead.id, exchange_status: 'not_requested' })
        .select()
        .single();
      profile = newProfile;
    }

    return {
      context: {
        user: { id: user.id, email: user.email },
        lead,
        profile: (profile || {
          id: '',
          lead_id: lead.id,
          exchange_status: 'not_requested',
          approved_at: null,
          completed_trades: 0,
          failed_trades: 0,
          free_cancellations_30d: 0,
        }) as AuthenticatedExchangeContext['profile'],
      },
    };
  } catch (error) {
    console.error('Unexpected error in getExchangeUserContext:', error);
    return {
      response: NextResponse.json(
        { error: 'Internal server error.' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Enforces the 9,000 EUR Bucharest Calendar Day Limit across all active roles for the customer.
 * Counts from ACCEPTED status onwards.
 */
export async function verifyBucharestDailyVolumeLimit(
  leadId: string,
  newAmountEur: number
): Promise<{ allowed: boolean; currentDailyEur: number; maxDailyLimit: number; error?: string }> {
  const MAX_DAILY_LIMIT_EUR = 9000.0;

  if (!supabaseAdmin) {
    return { allowed: false, currentDailyEur: 0, maxDailyLimit: MAX_DAILY_LIMIT_EUR, error: 'Database service unconfigured' };
  }

  // Calculate start of current day in Europe/Bucharest timezone
  // Bucharest is UTC+2 / UTC+3 depending on daylight saving
  const now = new Date();
  const bucharestDateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now); // format: YYYY-MM-DD

  // Parse midnight Europe/Bucharest as ISO timestamp range
  const startOfDayBucharest = new Date(`${bucharestDateStr}T00:00:00+03:00`).toISOString();

  // Query all matches created today where this lead participates in any role
  // and status is in active/committed state (ACCEPTED onwards)
  const activeStatuses = [
    'ACCEPTED',
    'EUR_RECEIVED',
    'IRR_PROOF_SUBMITTED',
    'IRR_CONFIRMED',
    'SETTLED',
    'DISPUTED',
  ];

  const { data: matches, error } = await supabaseAdmin
    .from('exchange_matches')
    .select('amount_eur, status, created_at')
    .or(`eur_payer_lead_id.eq.${leadId},eur_receiver_lead_id.eq.${leadId},irr_payer_lead_id.eq.${leadId},irr_receiver_lead_id.eq.${leadId}`)
    .in('status', activeStatuses)
    .gte('created_at', startOfDayBucharest);

  if (error) {
    console.error('Error checking Bucharest daily limit:', error);
    return { allowed: false, currentDailyEur: 0, maxDailyLimit: MAX_DAILY_LIMIT_EUR, error: 'Failed to verify daily limit' };
  }

  const currentDailyEur = (matches || []).reduce((sum, m) => sum + Number(m.amount_eur || 0), 0);

  if (currentDailyEur + newAmountEur > MAX_DAILY_LIMIT_EUR) {
    return {
      allowed: false,
      currentDailyEur,
      maxDailyLimit: MAX_DAILY_LIMIT_EUR,
      error: `سقف مجاز معاملات روزانه در تقویم بخارست (${MAX_DAILY_LIMIT_EUR.toLocaleString()} یورو) تکمیل می‌شود. حجم امروز: ${currentDailyEur.toLocaleString()} یورو، مبلغ درخواستی: ${newAmountEur.toLocaleString()} یورو.`,
    };
  }

  return {
    allowed: true,
    currentDailyEur,
    maxDailyLimit: MAX_DAILY_LIMIT_EUR,
  };
}
