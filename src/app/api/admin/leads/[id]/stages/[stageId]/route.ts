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
 * PATCH /api/admin/leads/[id]/stages/[stageId]
 * Updates status, due_date, responsible role/staff, or notes for a stage.
 * Requires 'case_stages.edit' permission.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; stageId: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'case_stages.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to edit case stages.' },
        { status: 403 }
      );
    }

    const { id: leadId, stageId } = params;
    if (!leadId || !stageId) {
      return NextResponse.json(
        { error: 'Lead ID and Stage ID are required.' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Fetch current stage
    const { data: existingStage, error: fetchErr } = await supabaseAdmin
      .from('case_stages')
      .select('id, status, completed_at')
      .eq('id', stageId)
      .eq('lead_id', leadId)
      .single();

    if (fetchErr || !existingStage) {
      return NextResponse.json({ error: 'Case stage not found.' }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: `Invalid status: ${body.status}` }, { status: 400 });
      }
      updatePayload.status = body.status;
      if (body.status === 'done' && existingStage.status !== 'done') {
        updatePayload.completed_at = new Date().toISOString();
      } else if (body.status !== 'done' && existingStage.status === 'done') {
        updatePayload.completed_at = null;
      }
    }

    if (body.due_date !== undefined) {
      updatePayload.due_date = body.due_date;
    }

    if (body.responsible_role !== undefined) {
      if (!VALID_ROLES.includes(body.responsible_role)) {
        return NextResponse.json({ error: `Invalid responsible role: ${body.responsible_role}` }, { status: 400 });
      }
      updatePayload.responsible_role = body.responsible_role;
    }

    if (body.responsible_staff_id !== undefined) {
      updatePayload.responsible_staff_id = body.responsible_staff_id || null;
    }

    if (body.label_fa !== undefined && typeof body.label_fa === 'string') {
      updatePayload.label_fa = body.label_fa.trim();
    }

    if (body.notes !== undefined) {
      updatePayload.notes = body.notes ? String(body.notes).trim() : null;
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update.' }, { status: 400 });
    }

    const { data: updatedStage, error: updateErr } = await supabaseAdmin
      .from('case_stages')
      .update(updatePayload)
      .eq('id', stageId)
      .eq('lead_id', leadId)
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

    if (updateErr) {
      console.error('Error updating case stage:', updateErr);
      return NextResponse.json({ error: 'Failed to update case stage.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      stage: updatedStage,
    });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/leads/[id]/stages/[stageId]:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/leads/[id]/stages/[stageId]
 * Deletes a stage from the lead.
 * Requires 'case_stages.edit' permission.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; stageId: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'case_stages.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete case stages.' },
        { status: 403 }
      );
    }

    const { id: leadId, stageId } = params;
    if (!leadId || !stageId) {
      return NextResponse.json(
        { error: 'Lead ID and Stage ID are required.' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { error: deleteErr } = await supabaseAdmin
      .from('case_stages')
      .delete()
      .eq('id', stageId)
      .eq('lead_id', leadId);

    if (deleteErr) {
      console.error('Error deleting case stage:', deleteErr);
      return NextResponse.json({ error: 'Failed to delete case stage.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Case stage deleted successfully.',
    });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/leads/[id]/stages/[stageId]:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
