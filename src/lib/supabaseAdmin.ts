import { createClient } from '@supabase/supabase-js';

// Server-only admin client for the unified DORVIA leads backend.
// Deliberately separate from `./supabase.ts` (which uses the public anon key
// for browser-side reads/writes like page comments): this client uses the
// service_role key, must NEVER be imported from client components, and must
// NEVER be exposed via a NEXT_PUBLIC_* env var.
//
// Env vars (server-side only, set in Vercel — not NEXT_PUBLIC_*):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//
// Feeds the same `leads` / `lead_messages` tables that the Irani Romani
// Telegram bot writes to (source='telegram_bot') and, eventually, WhatsApp
// (source='whatsapp') — see claude/dorvia-supabase-schema-v1-2026-09-03.sql
// in the project docs.

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isConfigured = supabaseUrl !== '' && supabaseServiceRoleKey !== '';

export const supabaseAdmin = isConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

const SITE_GOALS = ['study', 'work', 'company', 'family', 'living'] as const;
type SiteGoal = (typeof SITE_GOALS)[number];

function toSiteGoal(value: string): SiteGoal | null {
  return (SITE_GOALS as readonly string[]).includes(value) ? (value as SiteGoal) : null;
}

export interface WebsiteLeadInput {
  fullName: string;
  phone?: string;
  email?: string;
  mainGoal?: string;
  message?: string;
  marketingConsent?: boolean;
  channelRef?: string;
}

/**
 * Best-effort insert into the unified `leads` table. Never throws — a
 * failure here must never block the primary Telegram-based success
 * response in /api/evaluation, since Telegram remains the source of truth
 * for the team's day-to-day workflow. Errors are logged (no PII) and
 * swallowed, matching the pattern already used in src/lib/supabase.ts.
 */
export async function recordWebsiteLead(input: WebsiteLeadInput): Promise<{ success: boolean }> {
  if (!supabaseAdmin) {
    // Not configured yet — silent no-op, not an error condition.
    return { success: false };
  }

  try {
    const goal = input.mainGoal || '';
    const { error } = await supabaseAdmin.from('leads').insert([
      {
        source: 'website',
        channel_ref: input.channelRef || null,
        full_name: input.fullName,
        phone: input.phone || null,
        email: input.email || null,
        site_goal: toSiteGoal(goal),
        unified_category: goal || null,
        message: input.message || null,
        consent_terms: true,
        marketing_consent: Boolean(input.marketingConsent),
      },
    ]);

    if (error) {
      console.error('Supabase leads insert error (Internal)');
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.error('Error recording website lead to Supabase (Internal)');
    return { success: false };
  }
}

// ---------------------------------------------------------------------------
// DORVIA PathFinder — Assessment leads
// ---------------------------------------------------------------------------
// Kept as a separate function (rather than extending recordWebsiteLead) so
// the existing, already-validated /api/evaluation write path is untouched.
// PathFinder writes to the SAME `leads` table (source='website_pathfinder')
// per the architecture decision in
// claude/dorvia-conversion-audit-and-pathfinder-spec-2026-09-03.md — no new
// table/migration. The full question-by-question answers and computed
// scores are stored in `raw_meta` (jsonb), which already exists on the
// table for exactly this kind of structured payload.

export interface PathfinderLeadInput {
  fullName: string;
  whatsapp?: string;
  email?: string;
  preferredLanguage?: string;
  primaryRoute: string;
  secondaryRoute?: string | null;
  profileScore: number;
  leadTemperature: string;
  channelRef?: string;
  rawMeta: Record<string, unknown>;
}

export async function recordPathfinderLead(input: PathfinderLeadInput): Promise<{ success: boolean }> {
  if (!supabaseAdmin) {
    return { success: false };
  }

  try {
    const { error } = await supabaseAdmin.from('leads').insert([
      {
        source: 'website_pathfinder',
        channel_ref: input.channelRef || null,
        full_name: input.fullName,
        phone: input.whatsapp || null,
        email: input.email || null,
        site_goal: toSiteGoal(input.primaryRoute),
        unified_category: input.primaryRoute || null,
        message: `PathFinder — primary: ${input.primaryRoute} (${input.profileScore}/100)${
          input.secondaryRoute ? `, secondary: ${input.secondaryRoute}` : ''
        }, lead: ${input.leadTemperature}`,
        status: input.leadTemperature === 'hot' ? 'new' : 'new',
        consent_terms: true,
        marketing_consent: false,
        raw_meta: input.rawMeta,
      },
    ]);

    if (error) {
      console.error('Supabase PathFinder lead insert error (Internal)');
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.error('Error recording PathFinder lead to Supabase (Internal)');
    return { success: false };
  }
}
