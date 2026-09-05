import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

const VALID_ASSIGNED_ROLES = [
  'agent',
  'consultant',
  'lawyer',
  'notary',
  'finance',
  'marketing',
] as const;

/**
 * GET /api/admin/leads/[id]/assignments
 * Returns current staff assignments for the lead and a list of active staff members.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'leads.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view leads.' },
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

    // 1. Fetch assignments with staff and role info
    const { data: assignments, error: assignErr } = await supabaseAdmin
      .from('lead_assignments')
      .select(`
        id,
        lead_id,
        staff_id,
        assigned_role,
        assigned_at,
        staff:admin_users!lead_assignments_staff_id_fkey (
          id,
          full_name,
          is_active,
          roles (
            id,
            key,
            label_fa,
            label_en
          )
        )
      `)
      .eq('lead_id', leadId)
      .order('assigned_at', { ascending: false });

    if (assignErr) {
      console.error('Error fetching lead assignments:', assignErr);
      return NextResponse.json({ error: 'Failed to fetch assignments.' }, { status: 500 });
    }

    // 2. Fetch available active staff for the assignment dropdown
    const { data: activeStaff, error: staffErr } = await supabaseAdmin
      .from('admin_users')
      .select(`
        id,
        full_name,
        roles (
          id,
          key,
          label_fa,
          label_en
        )
      `)
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (staffErr) {
      console.error('Error fetching active staff:', staffErr);
    }

    const canManage = hasPermission(admin, 'assignments.manage');

    return NextResponse.json({
      success: true,
      assignments: assignments || [],
      availableStaff: activeStaff || [],
      canManage,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/leads/[id]/assignments:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * POST /api/admin/leads/[id]/assignments
 * Assigns a staff member to this lead with a specific role.
 * Requires 'assignments.manage' permission (owner/manager/agent).
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'assignments.manage')) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to assign staff to cases.' },
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
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const staffId = typeof body.staff_id === 'string' ? body.staff_id.trim() : '';
    const assignedRole = body.assigned_role;

    if (!staffId) {
      return NextResponse.json({ error: 'Staff member selection is required.' }, { status: 400 });
    }

    if (!VALID_ASSIGNED_ROLES.includes(assignedRole)) {
      return NextResponse.json(
        {
          error: `Assigned role must be one of: ${VALID_ASSIGNED_ROLES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Verify staff exists and is active
    const { data: staffRecord, error: staffErr } = await supabaseAdmin
      .from('admin_users')
      .select('id, full_name, is_active')
      .eq('id', staffId)
      .maybeSingle();

    if (staffErr || !staffRecord) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    if (!staffRecord.is_active) {
      return NextResponse.json(
        { error: 'Cannot assign an inactive staff member.' },
        { status: 400 }
      );
    }

    // Insert assignment into lead_assignments
    const { data: assignment, error: insertErr } = await supabaseAdmin
      .from('lead_assignments')
      .insert({
        lead_id: leadId,
        staff_id: staffId,
        assigned_role: assignedRole,
      })
      .select(`
        id,
        lead_id,
        staff_id,
        assigned_role,
        assigned_at,
        staff:admin_users!lead_assignments_staff_id_fkey (
          id,
          full_name,
          roles (
            id,
            key,
            label_fa,
            label_en
          )
        )
      `)
      .single();

    if (insertErr) {
      // Check for unique constraint violation (duplicate assignment)
      if (insertErr.code === '23505') {
        return NextResponse.json(
          { error: 'این کارمند قبلاً با همین نقش به این پرونده تخصیص داده شده است.' },
          { status: 409 }
        );
      }
      console.error('Error inserting assignment:', insertErr);
      return NextResponse.json({ error: 'Failed to assign staff member.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/leads/[id]/assignments:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
