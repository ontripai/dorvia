import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isJobBoardPubliclyEnabled } from '@/lib/jobBoardHelper';

export const dynamic = 'force-dynamic';

/**
 * GET /api/jobs/categories
 * Returns all active job categories sorted by sort_order.
 * Gated by app_settings.job_board_public_enabled.
 */
export async function GET() {
  try {
    const isPublicEnabled = await isJobBoardPubliclyEnabled();
    if (!isPublicEnabled) {
      return NextResponse.json(
        { error: 'Not found', categories: [] },
        { status: 404 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service unconfigured' }, { status: 500 });
    }

    const { data: categories, error } = await supabaseAdmin
      .from('job_categories')
      .select('id, key, label_fa, label_en, sort_order')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching job categories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/jobs/categories:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
