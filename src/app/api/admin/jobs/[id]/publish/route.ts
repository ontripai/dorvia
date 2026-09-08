import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

/**
 * POST /api/admin/jobs/[id]/publish
 * Publishes a job listing.
 * Requires 'jobs.publish' permission (owner, manager).
 * Sets status to 'published' and populates published_at if null.
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'jobs.publish')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to publish job listings.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: job, error: fetchErr } = await supabaseAdmin
      .from('job_listings')
      .select('id, status, published_at')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchErr || !job) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 });
    }

    const updates: Record<string, any> = {
      status: 'published',
    };

    if (!job.published_at) {
      updates.published_at = new Date().toISOString();
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
      console.error('Error publishing job listing:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/jobs/[id]/publish:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
