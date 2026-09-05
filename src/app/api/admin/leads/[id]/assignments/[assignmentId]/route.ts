import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/admin/leads/[id]/assignments/[assignmentId]
 * Removes a staff assignment from the lead.
 * Requires 'assignments.manage' permission (owner/manager/agent).
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; assignmentId: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'assignments.manage')) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to remove case assignments.' },
        { status: 403 }
      );
    }

    const { id: leadId, assignmentId } = params;
    if (!leadId || !assignmentId) {
      return NextResponse.json(
        { error: 'Lead ID and Assignment ID are required.' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { error: deleteErr } = await supabaseAdmin
      .from('lead_assignments')
      .delete()
      .eq('id', assignmentId)
      .eq('lead_id', leadId);

    if (deleteErr) {
      console.error('Error deleting assignment:', deleteErr);
      return NextResponse.json({ error: 'Failed to remove assignment.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Assignment removed successfully.',
    });
  } catch (error) {
    console.error('Unexpected error in DELETE assignment:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
