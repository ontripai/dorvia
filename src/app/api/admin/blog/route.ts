import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugHelper';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/blog
 * Lists blog posts across all statuses (draft, published, archived).
 * Requires 'blog.edit' permission (owner, manager, marketing).
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'blog.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view or manage blog articles.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const categoryFilter = searchParams.get('category_id');
    const search = searchParams.get('search')?.trim();

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
        author_admin_id,
        published_at,
        created_at,
        updated_at,
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
      `)
      .order('created_at', { ascending: false });

    if (statusFilter && ['draft', 'published', 'archived'].includes(statusFilter)) {
      query = query.eq('status', statusFilter);
    }

    if (categoryFilter) {
      query = query.eq('category_id', categoryFilter);
    }

    if (search) {
      query = query.or(`title_fa.ilike.%${search}%,title_en.ilike.%${search}%,slug_fa.ilike.%${search}%`);
    }

    const { data: posts, error: postsErr } = await query;
    if (postsErr) {
      console.error('Error fetching admin blog posts:', postsErr);
      return NextResponse.json({ error: postsErr.message }, { status: 500 });
    }

    // Also fetch categories catalog for filters
    const { data: categories } = await supabaseAdmin
      .from('blog_categories')
      .select('id, key, label_fa, label_en, sort_order')
      .order('sort_order', { ascending: true });

    return NextResponse.json({
      posts: posts || [],
      categories: categories || [],
      canPublish: hasPermission(admin, 'blog.publish'),
      admin: {
        id: admin.adminUserId,
        fullName: admin.fullName,
        email: admin.email,
        roleKey: admin.roleKey,
        permissions: Array.from(admin.permissions || []),
      },
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/blog:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blog
 * Creates a new draft blog article.
 * Requires 'blog.edit' permission.
 * Status is ALWAYS strictly set to 'draft'.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'blog.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to create blog articles.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json();

    const titleFa = typeof body.title_fa === 'string' ? body.title_fa.trim() : '';
    if (!titleFa) {
      return NextResponse.json({ error: 'Persian title (title_fa) is required.' }, { status: 400 });
    }

    const categoryId = body.category_id || null;
    if (!categoryId) {
      return NextResponse.json({ error: 'Category (category_id) is required.' }, { status: 400 });
    }

    // Slug generation and validation
    let slugFa = typeof body.slug_fa === 'string' && body.slug_fa.trim() ? slugify(body.slug_fa) : slugify(titleFa);
    if (!slugFa) {
      slugFa = `article-${Date.now()}`;
    }

    // Check slug_fa uniqueness
    const { data: existingFaSlug } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .eq('slug_fa', slugFa)
      .maybeSingle();

    if (existingFaSlug) {
      return NextResponse.json(
        { error: `Slug "${slugFa}" already exists. Please choose a unique slug.` },
        { status: 409 }
      );
    }

    let slugEn: string | null = null;
    if (typeof body.slug_en === 'string' && body.slug_en.trim()) {
      slugEn = slugify(body.slug_en);
      const { data: existingEnSlug } = await supabaseAdmin
        .from('blog_posts')
        .select('id')
        .eq('slug_en', slugEn)
        .maybeSingle();

      if (existingEnSlug) {
        return NextResponse.json(
          { error: `English slug "${slugEn}" already exists. Please choose a unique slug.` },
          { status: 409 }
        );
      }
    }

    const newPostData = {
      category_id: categoryId,
      status: 'draft', // Forced to draft on create
      title_fa: titleFa,
      title_en: typeof body.title_en === 'string' && body.title_en.trim() ? body.title_en.trim() : null,
      slug_fa: slugFa,
      slug_en: slugEn,
      excerpt_fa: typeof body.excerpt_fa === 'string' ? body.excerpt_fa.trim() : null,
      excerpt_en: typeof body.excerpt_en === 'string' ? body.excerpt_en.trim() : null,
      content_fa: typeof body.content_fa === 'string' ? body.content_fa : '',
      content_en: typeof body.content_en === 'string' ? body.content_en : null,
      cover_image_url: typeof body.cover_image_url === 'string' ? body.cover_image_url.trim() : null,
      meta_title_fa: typeof body.meta_title_fa === 'string' ? body.meta_title_fa.trim() : null,
      meta_title_en: typeof body.meta_title_en === 'string' ? body.meta_title_en.trim() : null,
      meta_description_fa: typeof body.meta_description_fa === 'string' ? body.meta_description_fa.trim() : null,
      meta_description_en: typeof body.meta_description_en === 'string' ? body.meta_description_en.trim() : null,
      tags: Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      author_admin_id: admin.adminUserId,
    };

    const { data: createdPost, error: insertErr } = await supabaseAdmin
      .from('blog_posts')
      .insert(newPostData)
      .select(`
        *,
        category:blog_categories!blog_posts_category_id_fkey (
          id,
          key,
          label_fa,
          label_en
        )
      `)
      .single();

    if (insertErr) {
      console.error('Error creating blog post:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: createdPost }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/blog:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
