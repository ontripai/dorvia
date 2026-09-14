import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/exchange/onboarding/accounts
 *
 * Lists customer destination accounts with filtering (default: unverified accounts where verified_at IS NULL).
 * Supports filter ?status=unverified | verified | all
 *
 * Requires 'exchange.onboarding' permission.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to review customer bank accounts.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status')?.trim().toLowerCase() || 'unverified';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('exchange_accounts')
      .select(`
        id,
        lead_id,
        kind,
        value,
        holder_name,
        related_party_id,
        authorized_recipient_id,
        verified_at,
        verified_by_admin_id,
        is_active,
        created_at,
        updated_at,
        lead:leads!exchange_accounts_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        related_party:exchange_related_parties!exchange_accounts_related_party_id_fkey (
          id,
          full_name,
          relationship,
          party_type,
          status
        ),
        authorized_recipient:exchange_authorized_recipients!exchange_accounts_authorized_recipient_id_fkey (
          id,
          recipient_lead_id,
          relationship,
          status
        ),
        verified_by:admin_users!exchange_accounts_verified_by_admin_id_fkey (
          id,
          full_name
        )
      `, { count: 'exact' });

    if (statusParam === 'unverified') {
      query = query.is('verified_at', null);
    } else if (statusParam === 'verified') {
      query = query.not('verified_at', 'is', null);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: accounts, error, count } = await query;

    if (error) {
      console.error('[AdminExchangeOnboarding] Error listing accounts:', error);
      return NextResponse.json({ error: 'Failed to fetch customer bank accounts.' }, { status: 500 });
    }

    const total = count ?? (accounts?.length || 0);

    return NextResponse.json({
      accounts: accounts || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      admin: {
        ...admin,
        permissions: Array.from(admin.permissions),
      },
    });
  } catch (err: any) {
    console.error('[AdminExchangeOnboarding] Unexpected error in GET /api/admin/exchange/onboarding/accounts:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
