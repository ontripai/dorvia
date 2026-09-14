import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/exchange/onboarding/profiles
 *
 * Lists customer exchange profiles with optional status filtering.
 * Embeds primary lead information (id, full_name, email, phone).
 *
 * Requires 'exchange.onboarding' permission.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to review exchange customer onboarding.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('exchange_profiles')
      .select(`
        id,
        lead_id,
        exchange_status,
        approved_by,
        approved_at,
        suspended_reason,
        completed_trades,
        failed_trades,
        free_cancellations_30d,
        created_at,
        updated_at,
        lead:leads!exchange_profiles_lead_id_fkey (
          id,
          full_name,
          email,
          phone,
          status,
          verified_at
        ),
        approver:admin_users!exchange_profiles_approved_by_fkey (
          id,
          full_name
        )
      `, { count: 'exact' });

    if (statusParam && statusParam.toLowerCase() !== 'all') {
      if (statusParam.includes(',')) {
        const statuses = statusParam.split(',').map((s) => s.trim().toLowerCase());
        query = query.in('exchange_status', statuses);
      } else {
        query = query.eq('exchange_status', statusParam.toLowerCase());
      }
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: profiles, error, count } = await query;

    if (error) {
      console.error('[AdminExchangeOnboarding] Error listing exchange profiles:', error);
      return NextResponse.json({ error: 'Failed to fetch exchange profiles.' }, { status: 500 });
    }

    const total = count ?? (profiles?.length || 0);

    return NextResponse.json({
      profiles: profiles || [],
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
    console.error('[AdminExchangeOnboarding] Unexpected error in GET /api/admin/exchange/onboarding/profiles:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
