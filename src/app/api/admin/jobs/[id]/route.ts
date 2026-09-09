import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { slugifyJob } from '@/lib/slugHelper';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/admin/jobs/[id]
 * Retrieves details of a specific job listing.
 * Requires 'jobs.edit' permission.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'jobs.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view job listings.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: job, error } = await supabaseAdmin
      .from('job_listings')
      .select(`
        *,
        category:job_categories!job_listings_category_id_fkey (
          id,
          key,
          label_fa,
          label_en
        ),
        author:admin_users!job_listings_author_admin_id_fkey (
          id,
          full_name
        )
      `)
      .eq('id', params.id)
      .maybeSingle();

    if (error || !job) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 });
    }

    return NextResponse.json({
      job,
      canPublish: hasPermission(admin, 'jobs.publish'),
      admin: {
        id: admin.adminUserId,
        fullName: admin.fullName,
        email: admin.email,
        roleKey: admin.roleKey,
        permissions: Array.from(admin.permissions || []),
      },
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/jobs/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/jobs/[id]
 * Updates content fields of a job listing.
 * Strictly prevents direct status modifications (use /publish or /unpublish).
 * Requires 'jobs.edit' permission.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'jobs.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to edit job listings.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: currentJob, error: fetchErr } = await supabaseAdmin
      .from('job_listings')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchErr || !currentJob) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.title_fa !== undefined) {
      const titleFa = typeof body.title_fa === 'string' ? body.title_fa.trim() : '';
      if (!titleFa) {
        return NextResponse.json({ error: 'عنوان فارسی موقعیت شغلی الزامی است.' }, { status: 400 });
      }
      updates.title_fa = titleFa;
    }

    if (body.title_en !== undefined) {
      updates.title_en = typeof body.title_en === 'string' && body.title_en.trim() ? body.title_en.trim() : null;
    }

    if (body.category_id !== undefined) {
      if (!body.category_id) {
        return NextResponse.json({ error: 'دسته‌بندی شغلی الزامی است.' }, { status: 400 });
      }
      updates.category_id = body.category_id;
    }

    // Validate slug_fa if updated
    if (body.slug_fa !== undefined) {
      const slugFa = slugifyJob(String(body.slug_fa));
      if (!slugFa) {
        return NextResponse.json({ error: 'نامک فارسی معتبر الزامی است.' }, { status: 400 });
      }

      if (slugFa !== currentJob.slug_fa) {
        const { data: duplicateFa } = await supabaseAdmin
          .from('job_listings')
          .select('id')
          .eq('slug_fa', slugFa)
          .neq('id', params.id)
          .maybeSingle();

        if (duplicateFa) {
          return NextResponse.json(
            { error: `نامک فارسی "${slugFa}" قبلاً برای آگهی دیگری ثبت شده است.` },
            { status: 409 }
          );
        }
      }
      updates.slug_fa = slugFa;
    }

    // Validate slug_en if updated
    if (body.slug_en !== undefined) {
      const slugEn = body.slug_en ? slugifyJob(String(body.slug_en)) : null;
      if (slugEn && slugEn !== currentJob.slug_en) {
        const { data: duplicateEn } = await supabaseAdmin
          .from('job_listings')
          .select('id')
          .eq('slug_en', slugEn)
          .neq('id', params.id)
          .maybeSingle();

        if (duplicateEn) {
          return NextResponse.json(
            { error: `English slug "${slugEn}" is already registered.` },
            { status: 409 }
          );
        }
      }
      updates.slug_en = slugEn;
    }

    if (body.city !== undefined) updates.city = body.city ? String(body.city).trim() : null;
    if (body.salary_min !== undefined) updates.salary_min = body.salary_min !== null ? parseFloat(body.salary_min) : null;
    if (body.salary_max !== undefined) updates.salary_max = body.salary_max !== null ? parseFloat(body.salary_max) : null;
    if (body.salary_currency !== undefined) updates.salary_currency = body.salary_currency || 'EUR';
    if (body.contract_type !== undefined) updates.contract_type = body.contract_type || 'permanent';
    if (body.positions_available !== undefined) updates.positions_available = Math.max(1, parseInt(body.positions_available) || 1);
    if (body.accommodation_provided !== undefined) updates.accommodation_provided = Boolean(body.accommodation_provided);

    if (body.description_fa !== undefined) updates.description_fa = typeof body.description_fa === 'string' ? body.description_fa : null;
    if (body.description_en !== undefined) updates.description_en = typeof body.description_en === 'string' ? body.description_en : null;
    if (body.requirements_fa !== undefined) updates.requirements_fa = typeof body.requirements_fa === 'string' ? body.requirements_fa : null;
    if (body.requirements_en !== undefined) updates.requirements_en = typeof body.requirements_en === 'string' ? body.requirements_en : null;
    if (body.is_sample !== undefined) updates.is_sample = Boolean(body.is_sample);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true, job: currentJob });
    }

    const { data: updatedJob, error: updateErr } = await supabaseAdmin
      .from('job_listings')
      .update(updates)
      .eq('id', params.id)
      .select(`
        *,
        category:job_categories!job_listings_category_id_fkey (
          id,
          key,
          label_fa,
          label_en
        )
      `)
      .single();

    if (updateErr) {
      console.error('Error updating job listing:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error: any) {
    console.error('Unexpected error in PATCH /api/admin/jobs/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/jobs/[id]
 * Deletes a draft or archived job listing.
 * Strictly rejects deletion if listing is currently 'published' (must be archived or moved to draft first).
 * Requires 'jobs.edit' permission.
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'jobs.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete job listings.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: job, error: fetchErr } = await supabaseAdmin
      .from('job_listings')
      .select('id, status')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchErr || !job) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 });
    }

    // Protection rule: Published jobs must be archived or moved to draft before deletion
    if (job.status === 'published') {
      return NextResponse.json(
        {
          error:
            'آگهی منتشرشده را نمی‌توان مستقیماً حذف کرد. لطفاً ابتدا وضعیت آن را به بایگانی یا پیش‌نویس تغییر دهید.',
        },
        { status: 400 }
      );
    }

    const { error: deleteErr } = await supabaseAdmin
      .from('job_listings')
      .delete()
      .eq('id', params.id);

    if (deleteErr) {
      console.error('Error deleting job listing:', deleteErr);
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in DELETE /api/admin/jobs/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
