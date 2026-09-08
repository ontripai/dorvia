import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { slugifyJob } from '@/lib/jobBoardHelper';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/jobs
 * Lists all job listings across all statuses (draft, published, archived).
 * Requires 'jobs.edit' permission (owner, manager, marketing).
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'jobs.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view or manage job listings.' },
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
        author_admin_id,
        published_at,
        created_at,
        updated_at,
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
      .order('created_at', { ascending: false });

    if (statusFilter && ['draft', 'published', 'archived'].includes(statusFilter)) {
      query = query.eq('status', statusFilter);
    }

    if (categoryFilter) {
      query = query.eq('category_id', categoryFilter);
    }

    if (search) {
      query = query.or(`title_fa.ilike.%${search}%,title_en.ilike.%${search}%,slug_fa.ilike.%${search}%,city.ilike.%${search}%`);
    }

    const { data: jobs, error: jobsErr } = await query;
    if (jobsErr) {
      console.error('Error fetching admin jobs:', jobsErr);
      return NextResponse.json({ error: jobsErr.message }, { status: 500 });
    }

    // Fetch categories catalog
    const { data: categories } = await supabaseAdmin
      .from('job_categories')
      .select('id, key, label_fa, label_en, sort_order')
      .order('sort_order', { ascending: true });

    return NextResponse.json({
      jobs: jobs || [],
      categories: categories || [],
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
    console.error('Unexpected error in GET /api/admin/jobs:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/jobs
 * Creates a new draft job listing.
 * Requires 'jobs.edit' permission.
 * Status is ALWAYS strictly set to 'draft'.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'jobs.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to create job listings.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json();

    const titleFa = typeof body.title_fa === 'string' ? body.title_fa.trim() : '';
    if (!titleFa) {
      return NextResponse.json(
        { error: 'عنوان فارسی موقعیت شغلی (title_fa) الزامی است.' },
        { status: 400 }
      );
    }

    const slugFa = slugifyJob(String(body.slug_fa || titleFa));
    if (!slugFa) {
      return NextResponse.json(
        { error: 'نامک آدرس وب معتبر فارسی (slug_fa) الزامی است.' },
        { status: 400 }
      );
    }

    if (!body.category_id) {
      return NextResponse.json(
        { error: 'انتخاب دسته‌بندی موضوعی (category_id) الزامی است.' },
        { status: 400 }
      );
    }

    // Check slug_fa uniqueness
    const { data: existingFa } = await supabaseAdmin
      .from('job_listings')
      .select('id')
      .eq('slug_fa', slugFa)
      .maybeSingle();

    if (existingFa) {
      return NextResponse.json(
        { error: `نامک فارسی "${slugFa}" قبلاً برای آگهی دیگری ثبت شده است.` },
        { status: 409 }
      );
    }

    // Check slug_en uniqueness if provided
    let slugEn: string | null = null;
    if (body.slug_en) {
      slugEn = slugifyJob(String(body.slug_en));
      if (slugEn) {
        const { data: existingEn } = await supabaseAdmin
          .from('job_listings')
          .select('id')
          .eq('slug_en', slugEn)
          .maybeSingle();

        if (existingEn) {
          return NextResponse.json(
            { error: `English slug "${slugEn}" is already registered.` },
            { status: 409 }
          );
        }
      }
    }

    const titleEn = typeof body.title_en === 'string' && body.title_en.trim() ? body.title_en.trim() : null;
    const city = typeof body.city === 'string' && body.city.trim() ? body.city.trim() : null;
    const salaryMin = typeof body.salary_min === 'number' ? body.salary_min : (body.salary_min ? parseFloat(body.salary_min) : null);
    const salaryMax = typeof body.salary_max === 'number' ? body.salary_max : (body.salary_max ? parseFloat(body.salary_max) : null);
    const salaryCurrency = ['EUR', 'RON', 'USD'].includes(body.salary_currency) ? body.salary_currency : 'EUR';
    const contractType = ['permanent', 'seasonal', 'temporary'].includes(body.contract_type) ? body.contract_type : 'permanent';
    const positionsAvailable = typeof body.positions_available === 'number' ? Math.max(1, body.positions_available) : (body.positions_available ? parseInt(body.positions_available) : 1);
    const accommodationProvided = Boolean(body.accommodation_provided);
    const descriptionFa = typeof body.description_fa === 'string' ? body.description_fa : null;
    const descriptionEn = typeof body.description_en === 'string' ? body.description_en : null;
    const requirementsFa = typeof body.requirements_fa === 'string' ? body.requirements_fa : null;
    const requirementsEn = typeof body.requirements_en === 'string' ? body.requirements_en : null;
    const isSample = Boolean(body.is_sample);

    const { data: newJob, error: insertErr } = await supabaseAdmin
      .from('job_listings')
      .insert({
        title_fa: titleFa,
        title_en: titleEn,
        slug_fa: slugFa,
        slug_en: slugEn,
        category_id: body.category_id,
        city,
        salary_min: salaryMin,
        salary_max: salaryMax,
        salary_currency: salaryCurrency,
        contract_type: contractType,
        positions_available: positionsAvailable,
        accommodation_provided: accommodationProvided,
        description_fa: descriptionFa,
        description_en: descriptionEn,
        requirements_fa: requirementsFa,
        requirements_en: requirementsEn,
        is_sample: isSample,
        status: 'draft', // Strictly enforced on creation
        author_admin_id: admin.adminUserId,
      })
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

    if (insertErr) {
      console.error('Error inserting job listing:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/jobs:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
