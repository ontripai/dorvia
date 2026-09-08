import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

/**
 * POST /api/admin/blog/[id]/unpublish
 * Reverts an article to 'draft' or 'archived'.
 * Requires 'blog.publish' permission.
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'blog.publish')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to unpublish or archive blog articles.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    let targetStatus = 'draft';
    try {
      const body = await request.json();
      if (body.status === 'archived' || body.status === 'draft') {
        targetStatus = body.status;
      }
    } catch {
      // Default to draft if body is empty or malformed
    }

    const { data: updatedPost, error: updateErr } = await supabaseAdmin
      .from('blog_posts')
      .update({ status: targetStatus })
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
      console.error('Error unpublishing blog post:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/blog/[id]/unpublish:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
