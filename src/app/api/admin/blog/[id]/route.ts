import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { deleteBlogImageFromStorage } from '@/lib/blogHelper';
import { slugify } from '@/lib/slugHelper';
import { translateBlogContentToEnglish, resolveUniqueEnSlug } from '@/lib/aiTranslate';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/admin/blog/[id]
 * Retrieves full details of a specific blog post.
 * Requires 'blog.edit' permission.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'blog.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view blog articles.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .select(`
        *,
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
      .eq('id', params.id)
      .maybeSingle();

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({
      post,
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
    console.error('Unexpected error in GET /api/admin/blog/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/blog/[id]
 * Updates content fields of an article.
 * Requires 'blog.edit' permission.
 * Strictly prevents direct status modifications (use /publish or /unpublish).
 * Cleans up old cover image from storage if replaced.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'blog.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to edit blog articles.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Fetch current post state
    const { data: currentPost, error: fetchErr } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchErr || !currentPost) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    const body = await request.json();

    // Whitelist update payload — strictly excluding 'status', 'published_at', 'author_admin_id', 'created_at', 'updated_at'
    const updates: Record<string, any> = {};

    if (body.title_fa !== undefined) {
      const titleFa = typeof body.title_fa === 'string' ? body.title_fa.trim() : '';
      if (!titleFa) {
        return NextResponse.json({ error: 'Persian title (title_fa) cannot be empty.' }, { status: 400 });
      }
      updates.title_fa = titleFa;
    }

    if (body.title_en !== undefined) {
      updates.title_en = typeof body.title_en === 'string' && body.title_en.trim() ? body.title_en.trim() : null;
    }

    if (body.category_id !== undefined) {
      if (!body.category_id) {
        return NextResponse.json({ error: 'Category (category_id) cannot be empty.' }, { status: 400 });
      }
      updates.category_id = body.category_id;
    }

    // Validate slug_fa if updated
    if (body.slug_fa !== undefined) {
      const slugFa = slugify(String(body.slug_fa));
      if (!slugFa) {
        return NextResponse.json({ error: 'Valid Persian slug (slug_fa) is required.' }, { status: 400 });
      }

      if (slugFa !== currentPost.slug_fa) {
        const { data: duplicateFa } = await supabaseAdmin
          .from('blog_posts')
          .select('id')
          .eq('slug_fa', slugFa)
          .neq('id', params.id)
          .maybeSingle();

        if (duplicateFa) {
          return NextResponse.json(
            { error: `Slug "${slugFa}" is already in use by another article.` },
            { status: 409 }
          );
        }
      }
      updates.slug_fa = slugFa;
    }

    // Validate slug_en if updated
    if (body.slug_en !== undefined) {
      const slugEn = body.slug_en ? slugify(String(body.slug_en)) : null;
      if (slugEn && slugEn !== currentPost.slug_en) {
        const { data: duplicateEn } = await supabaseAdmin
          .from('blog_posts')
          .select('id')
          .eq('slug_en', slugEn)
          .neq('id', params.id)
          .maybeSingle();

        if (duplicateEn) {
          return NextResponse.json(
            { error: `English slug "${slugEn}" is already in use by another article.` },
            { status: 409 }
          );
        }
      }
      updates.slug_en = slugEn;
    }

    if (body.excerpt_fa !== undefined) updates.excerpt_fa = body.excerpt_fa ? String(body.excerpt_fa).trim() : null;
    if (body.excerpt_en !== undefined) updates.excerpt_en = body.excerpt_en ? String(body.excerpt_en).trim() : null;
    if (body.content_fa !== undefined) updates.content_fa = typeof body.content_fa === 'string' ? body.content_fa : '';
    if (body.content_en !== undefined) updates.content_en = typeof body.content_en === 'string' ? body.content_en : null;

    if (body.meta_title_fa !== undefined) updates.meta_title_fa = body.meta_title_fa ? String(body.meta_title_fa).trim() : null;
    if (body.meta_title_en !== undefined) updates.meta_title_en = body.meta_title_en ? String(body.meta_title_en).trim() : null;
    if (body.meta_description_fa !== undefined) updates.meta_description_fa = body.meta_description_fa ? String(body.meta_description_fa).trim() : null;
    if (body.meta_description_en !== undefined) updates.meta_description_en = body.meta_description_en ? String(body.meta_description_en).trim() : null;

    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [];
    }

    // Storage cleanup: if cover_image_url is changed, clean up previous image
    if (body.cover_image_url !== undefined) {
      const newCoverUrl = body.cover_image_url ? String(body.cover_image_url).trim() : null;
      if (currentPost.cover_image_url && currentPost.cover_image_url !== newCoverUrl) {
        // Fire and forget or await storage removal
        await deleteBlogImageFromStorage(currentPost.cover_image_url);
      }
      updates.cover_image_url = newCoverUrl;
    }

    // Automated English Translation for empty fields
    const isTitleEnEmpty =
      (updates.title_en === undefined || updates.title_en === null || !String(updates.title_en).trim()) &&
      (!currentPost.title_en || !currentPost.title_en.trim());

    const isContentEnEmpty =
      (updates.content_en === undefined || updates.content_en === null || !String(updates.content_en).trim()) &&
      (!currentPost.content_en || !currentPost.content_en.trim());

    const isExcerptEnEmpty =
      (updates.excerpt_en === undefined || updates.excerpt_en === null || !String(updates.excerpt_en).trim()) &&
      (!currentPost.excerpt_en || !currentPost.excerpt_en.trim());

    const isMetaTitleEnEmpty =
      (updates.meta_title_en === undefined || updates.meta_title_en === null || !String(updates.meta_title_en).trim()) &&
      (!currentPost.meta_title_en || !currentPost.meta_title_en.trim());

    const isMetaDescEnEmpty =
      (updates.meta_description_en === undefined || updates.meta_description_en === null || !String(updates.meta_description_en).trim()) &&
      (!currentPost.meta_description_en || !currentPost.meta_description_en.trim());

    const isSlugEnEmpty =
      (updates.slug_en === undefined || updates.slug_en === null || !String(updates.slug_en).trim()) &&
      (!currentPost.slug_en || !currentPost.slug_en.trim());

    const effectiveTitleFa = (updates.title_fa !== undefined ? updates.title_fa : currentPost.title_fa) || '';
    const effectiveContentFa = (updates.content_fa !== undefined ? updates.content_fa : currentPost.content_fa) || '';
    const effectiveExcerptFa = (updates.excerpt_fa !== undefined ? updates.excerpt_fa : currentPost.excerpt_fa) || '';
    const effectiveMetaTitleFa = (updates.meta_title_fa !== undefined ? updates.meta_title_fa : currentPost.meta_title_fa) || '';
    const effectiveMetaDescFa = (updates.meta_description_fa !== undefined ? updates.meta_description_fa : currentPost.meta_description_fa) || '';

    const needTitle = isTitleEnEmpty && Boolean(effectiveTitleFa.trim());
    const needContent = isContentEnEmpty && Boolean(effectiveContentFa.trim());
    const needExcerpt = isExcerptEnEmpty && Boolean(effectiveExcerptFa.trim());
    const needMetaTitle = isMetaTitleEnEmpty && Boolean(effectiveMetaTitleFa.trim());
    const needMetaDesc = isMetaDescEnEmpty && Boolean(effectiveMetaDescFa.trim());

    if (needTitle || needContent || needExcerpt || needMetaTitle || needMetaDesc) {
      try {
        const translated = await translateBlogContentToEnglish(
          {
            title_fa: effectiveTitleFa,
            content_fa: effectiveContentFa,
            excerpt_fa: effectiveExcerptFa,
            meta_title_fa: effectiveMetaTitleFa,
            meta_description_fa: effectiveMetaDescFa,
          },
          {
            title: needTitle,
            content: needContent,
            excerpt: needExcerpt,
            meta_title: needMetaTitle,
            meta_description: needMetaDesc,
          }
        );

        if (translated) {
          if (needTitle && translated.title_en) {
            updates.title_en = translated.title_en;
          }
          if (needContent && translated.content_en) {
            updates.content_en = translated.content_en;
          }
          if (needExcerpt && translated.excerpt_en) {
            updates.excerpt_en = translated.excerpt_en;
          }
          if (needMetaTitle && translated.meta_title_en) {
            updates.meta_title_en = translated.meta_title_en;
          }
          if (needMetaDesc && translated.meta_description_en) {
            updates.meta_description_en = translated.meta_description_en;
          }
          if (isSlugEnEmpty && (translated.slug_en || updates.title_en || currentPost.title_en)) {
            updates.slug_en = await resolveUniqueEnSlug(
              supabaseAdmin,
              translated.slug_en || updates.title_en || currentPost.title_en || '',
              params.id
            );
          }
        }
      } catch (aiErr: any) {
        console.error(
          `[PATCH /api/admin/blog/${params.id}] Non-fatal error during AI translation:`,
          aiErr?.message || aiErr
        );
      }
    }

    if (isSlugEnEmpty && (updates.title_en || currentPost.title_en) && !updates.slug_en) {
      updates.slug_en = await resolveUniqueEnSlug(
        supabaseAdmin,
        updates.title_en || currentPost.title_en || '',
        params.id
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true, post: currentPost });
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
      console.error('Error updating blog post:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error('Unexpected error in PATCH /api/admin/blog/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/blog/[id]
 * Deletes a draft or archived article.
 * Rejects deletion if article is currently 'published'.
 * Cleans up cover image from storage bucket.
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'blog.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete blog articles.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: post, error: fetchErr } = await supabaseAdmin
      .from('blog_posts')
      .select('id, status, cover_image_url')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchErr || !post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    // Protection rule: Published posts must be archived or unpublished before deletion
    if (post.status === 'published') {
      return NextResponse.json(
        {
          error:
            'مقاله منتشرشده را نمی‌توان مستقیماً حذف کرد. لطفاً ابتدا وضعیت آن را به بایگانی یا پیش‌نویس تغییر دهید.',
        },
        { status: 400 }
      );
    }

    // Clean up cover image from storage
    if (post.cover_image_url) {
      await deleteBlogImageFromStorage(post.cover_image_url);
    }

    // Delete post record
    const { error: deleteErr } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', params.id);

    if (deleteErr) {
      console.error('Error deleting blog post:', deleteErr);
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in DELETE /api/admin/blog/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
