import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/blog/posts
 * Public API to fetch published blog posts.
 * Strictly filters by status = 'published'.
 * Ensures posts match the requested language (no mixed-language fallback).
 */
export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'fa';
    const categoryKey = searchParams.get('category');
    const categoryId = searchParams.get('category_id');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('blog_posts')
      .select(`
        id,
        category_id,
        status,
        title_fa,
        title_en,
        slug_fa,
        slug_en,
        excerpt_fa,
        excerpt_en,
        cover_image_url,
        tags,
        published_at,
        created_at,
        category:blog_categories!blog_posts_category_id_fkey (
          id,
          key,
          label_fa,
          label_en
        ),
        author:admin_users!blog_posts_author_admin_id_fkey (
          id,
          full_name
        )
      `, { count: 'exact' })
      .eq('status', 'published');

    // Language completeness guard
    if (lang === 'en') {
      query = query.not('slug_en', 'is', null).not('content_en', 'is', null);
    } else {
      query = query.not('slug_fa', 'is', null).not('content_fa', 'is', null);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    } else if (categoryKey) {
      // Find category id by key
      const { data: cat } = await supabaseAdmin
        .from('blog_categories')
        .select('id')
        .eq('key', categoryKey)
        .maybeSingle();

      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    query = query
      .order('published_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    const { data: posts, count, error } = await query;
    if (error) {
      console.error('Error fetching public blog posts:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/blog/posts:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
