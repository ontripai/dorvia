import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/blog/categories
 * Public API to fetch all active blog categories.
 */
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: categories, error } = await supabaseAdmin
      .from('blog_categories')
      .select('id, key, label_fa, label_en, sort_order')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching blog categories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/blog/categories:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
