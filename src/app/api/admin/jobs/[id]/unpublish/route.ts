import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

/**
 * POST /api/admin/jobs/[id]/unpublish
 * Reverts a job listing to 'draft' or 'archived'.
 * Requires 'jobs.publish' permission.
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'jobs.publish')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to unpublish or archive job listings.' },
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

    const { data: updatedJob, error: updateErr } = await supabaseAdmin
      .from('job_listings')
      .update({ status: targetStatus })
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
      console.error('Error unpublishing job listing:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/jobs/[id]/unpublish:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
