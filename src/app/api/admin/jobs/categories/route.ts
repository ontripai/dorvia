import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/jobs/categories
 * Admin endpoint for job categories catalog.
 * Requires 'jobs.edit' permission.
 * Available to staff regardless of public release gate status.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'jobs.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to access job categories.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: categories, error } = await supabaseAdmin
      .from('job_categories')
      .select('id, key, label_fa, label_en, sort_order')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching admin job categories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/jobs/categories:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
