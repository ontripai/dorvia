import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isJobBoardPubliclyEnabled } from '@/lib/jobBoardHelper';

export const dynamic = 'force-dynamic';

/**
 * GET /api/jobs
 * Public API for published job listings.
 * Hard-gated by app_settings.job_board_public_enabled.
 * If gate is disabled, returns 404 (zero information leakage).
 */
export async function GET(request: Request) {
  try {
    const isPublicEnabled = await isJobBoardPubliclyEnabled();
    if (!isPublicEnabled) {
      return NextResponse.json(
        { error: 'Not found', jobs: [], total: 0 },
        { status: 404 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service unconfigured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const categoryKey = searchParams.get('category')?.trim();
    const city = searchParams.get('city')?.trim();
    const search = searchParams.get('search')?.trim() || searchParams.get('q')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('job_listings')
      .select(`
        id,
        category_id,
        status,
        title_fa,
        title_en,
        slug_fa,
        slug_en,
        city,
        salary_min,
        salary_max,
        salary_currency,
        contract_type,
        positions_available,
        accommodation_provided,
        description_fa,
        description_en,
        requirements_fa,
        requirements_en,
        is_sample,
        published_at,
        created_at,
        category:job_categories!job_listings_category_id_fkey (
          id,
          key,
          label_fa,
          label_en
        )
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (search) {
      query = query.or(`title_fa.ilike.%${search}%,title_en.ilike.%${search}%,description_fa.ilike.%${search}%,description_en.ilike.%${search}%`);
    }

    // Filter by category key if supplied
    if (categoryKey) {
      // Find category id for this key
      const { data: catData } = await supabaseAdmin
        .from('job_categories')
        .select('id')
        .eq('key', categoryKey)
        .maybeSingle();

      if (catData?.id) {
        query = query.eq('category_id', catData.id);
      } else {
        // Unknown category, return empty
        return NextResponse.json({
          jobs: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        });
      }
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error, count } = await query;

    if (error) {
      console.error('Error fetching public jobs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      jobs: jobs || [],
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/jobs:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
