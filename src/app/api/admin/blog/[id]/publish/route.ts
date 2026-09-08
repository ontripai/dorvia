import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

/**
 * POST /api/admin/blog/[id]/publish
 * Publishes an article.
 * Requires 'blog.publish' permission (owner, manager).
 * Sets status to 'published' and populates published_at if null.
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'blog.publish')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to publish blog articles.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: post, error: fetchErr } = await supabaseAdmin
      .from('blog_posts')
      .select('id, status, published_at')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchErr || !post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    const updates: Record<string, any> = {
      status: 'published',
    };

    if (!post.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data: updatedPost, error: updateErr } = await supabaseAdmin
      .from('blog_posts')
      .update(updates)
      .eq('id', params.id)
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

    if (updateErr) {
      console.error('Error publishing blog post:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/blog/[id]/publish:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
