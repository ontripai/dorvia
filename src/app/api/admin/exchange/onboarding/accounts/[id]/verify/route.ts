import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/exchange/onboarding/accounts/[id]/verify
 *
 * Marks a customer bank destination account as verified.
 *
 * Rules:
 * - Requires 'exchange.onboarding' permission.
 * - verified_by_admin_id is ALWAYS derived from session (admin.adminUserId), NEVER from body.
 * - verified_at is generated server-side.
 * - Appends audit event to exchange_events.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to verify customer bank accounts.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const accountId = resolvedParams?.id?.trim();
    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Fetch account
    const { data: existingAccount, error: fetchError } = await supabaseAdmin
      .from('exchange_accounts')
      .select('id, lead_id, kind, value, holder_name, verified_at')
      .eq('id', accountId)
      .maybeSingle();

    if (fetchError) {
      console.error(`[AdminExchangeOnboarding] Error fetching account ${accountId}:`, fetchError);
      return NextResponse.json({ error: 'Failed to retrieve account.' }, { status: 500 });
    }

    if (!existingAccount) {
      return NextResponse.json({ error: 'Customer bank account not found.' }, { status: 404 });
    }

    const verifiedAt = new Date().toISOString();

    // 2. Perform verification update
    const { data: updatedAccount, error: updateError } = await supabaseAdmin
      .from('exchange_accounts')
      .update({
        verified_at: verifiedAt,
        verified_by_admin_id: admin.adminUserId,
        updated_at: verifiedAt,
      })
      .eq('id', accountId)
      .select()
      .single();

    if (updateError) {
      console.error(`[AdminExchangeOnboarding] Error verifying account ${accountId}:`, updateError);
      return NextResponse.json({ error: 'Failed to verify bank account.' }, { status: 500 });
    }

    // 3. Append audit event
    await supabaseAdmin
      .from('exchange_events')
      .insert({
        actor: 'staff',
        actor_user_id: admin.adminUserId,
        payload: {
          action: 'exchange_account_verified',
          account_id: accountId,
          lead_id: existingAccount.lead_id,
          account_kind: existingAccount.kind,
          verified_at: verifiedAt,
        },
      });

    return NextResponse.json({
      success: true,
      account: updatedAccount,
    });
  } catch (err: any) {
    console.error('[AdminExchangeOnboarding] Unexpected error in POST /api/admin/exchange/onboarding/accounts/[id]/verify:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
