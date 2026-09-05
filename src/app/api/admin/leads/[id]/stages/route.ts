import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['pending', 'in_progress', 'done', 'blocked'] as const;
const VALID_ROLES = [
  'agent',
  'consultant',
  'lawyer',
  'notary',
  'finance',
  'marketing',
  'manager',
  'owner',
] as const;

/**
 * GET /api/admin/leads/[id]/stages
 * Returns all case stages for a given lead, ordered by due_date ascending.
 * Requires 'case_stages.view' permission.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'case_stages.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view case stages.' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Fetch stages with responsible staff information
    const { data: stages, error: stagesErr } = await supabaseAdmin
      .from('case_stages')
      .select(`
        id,
        lead_id,
        stage_key,
        label_fa,
        status,
        due_date,
        responsible_role,
        responsible_staff_id,
        completed_at,
        notes,
        created_at,
        updated_at,
        responsible_staff:admin_users!case_stages_responsible_staff_id_fkey (
          id,
          full_name,
          roles (
            id,
            key,
            label_fa
          )
        )
      `)
      .eq('lead_id', leadId)
      .order('due_date', { ascending: true });

    if (stagesErr) {
      console.error('Error fetching case stages:', stagesErr);
      return NextResponse.json({ error: 'Failed to fetch case stages.' }, { status: 500 });
    }

    // 2. Fetch assigned staff for dropdown convenience
    const { data: assignments } = await supabaseAdmin
      .from('lead_assignments')
      .select(`
        staff_id,
        assigned_role,
        staff:admin_users!lead_assignments_staff_id_fkey (
          id,
          full_name
        )
      `)
      .eq('lead_id', leadId);

    const canEdit = hasPermission(admin, 'case_stages.edit');

    return NextResponse.json({
      success: true,
      stages: stages || [],
      assignedStaff: assignments || [],
      canEdit,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/leads/[id]/stages:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * POST /api/admin/leads/[id]/stages
 * Creates a new milestone / stage for the given lead.
 * Requires 'case_stages.edit' permission.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'case_stages.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to edit case stages.' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const {
      stage_key,
      label_fa,
      status = 'pending',
      due_date,
      responsible_role = 'agent',
      responsible_staff_id = null,
      notes = null,
    } = body;

    if (!stage_key || typeof stage_key !== 'string' || !stage_key.trim()) {
      return NextResponse.json({ error: 'Stage key is required.' }, { status: 400 });
    }

    if (!label_fa || typeof label_fa !== 'string' || !label_fa.trim()) {
      return NextResponse.json({ error: 'Stage label (FA) is required.' }, { status: 400 });
    }

    if (!due_date || typeof due_date !== 'string') {
      return NextResponse.json({ error: 'Due date is required.' }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(status as any)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }

    if (!VALID_ROLES.includes(responsible_role as any)) {
      return NextResponse.json({ error: `Invalid responsible role. Must be one of: ${VALID_ROLES.join(', ')}` }, { status: 400 });
    }

    const completed_at = status === 'done' ? new Date().toISOString() : null;

    const { data: newStage, error: insertErr } = await supabaseAdmin
      .from('case_stages')
      .insert({
        lead_id: leadId,
        stage_key: stage_key.trim(),
        label_fa: label_fa.trim(),
        status,
        due_date,
        responsible_role,
        responsible_staff_id: responsible_staff_id || null,
        completed_at,
        notes: notes ? String(notes).trim() : null,
      })
      .select(`
        id,
        lead_id,
        stage_key,
        label_fa,
        status,
        due_date,
        responsible_role,
        responsible_staff_id,
        completed_at,
        notes,
        created_at,
        updated_at,
        responsible_staff:admin_users!case_stages_responsible_staff_id_fkey (
          id,
          full_name,
          roles (
            id,
            key,
            label_fa
          )
        )
      `)
      .single();

    if (insertErr) {
      console.error('Error creating case stage:', insertErr);
      return NextResponse.json({ error: 'Failed to create case stage.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      stage: newStage,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/leads/[id]/stages:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
