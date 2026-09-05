import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/team/[staffId]
 * Updates role or active status of a team member.
 * Requires 'team.manage' permission (owner/manager).
 * Protects the sole active Owner from being deactivated or demoted.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { staffId: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'team.manage')) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to update team members.' },
        { status: 403 }
      );
    }

    const staffId = params.staffId;
    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service unconfigured.' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    // 1. Fetch current staff member
    const { data: targetStaff, error: targetErr } = await supabaseAdmin
      .from('admin_users')
      .select(`
        id,
        role_id,
        is_active,
        full_name,
        roles (
          id,
          key
        )
      `)
      .eq('id', staffId)
      .maybeSingle();

    if (targetErr || !targetStaff) {
      return NextResponse.json({ error: 'Team member not found.' }, { status: 404 });
    }

    const currentRole = targetStaff.roles as any;
    const isTargetOwner = currentRole?.key === 'owner';

    // Security Guard: Only an Owner can modify an Owner's role or status
    if (isTargetOwner && admin.roleKey !== 'owner') {
      return NextResponse.json(
        { error: 'Only an Owner can modify another Owner.' },
        { status: 403 }
      );
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    // 2. Validate role change
    let newRoleRecord: any = null;
    if (typeof body.role_id === 'string' && body.role_id !== targetStaff.role_id) {
      const { data: roleData, error: roleErr } = await supabaseAdmin
        .from('roles')
        .select('id, key, label_fa')
        .eq('id', body.role_id)
        .maybeSingle();

      if (roleErr || !roleData) {
        return NextResponse.json({ error: 'Selected role does not exist.' }, { status: 400 });
      }

      // If assigning Owner role, only an Owner can do that
      if (roleData.key === 'owner' && admin.roleKey !== 'owner') {
        return NextResponse.json(
          { error: 'Only an Owner can promote a user to Owner.' },
          { status: 403 }
        );
      }

      newRoleRecord = roleData;
      updates.role_id = body.role_id;
    }

    // 3. Validate active status change
    if (typeof body.is_active === 'boolean') {
      updates.is_active = body.is_active;
    }

    // 4. Sole Active Owner Protection Guard
    const isBeingDeactivated = updates.is_active === false && targetStaff.is_active === true;
    const isOwnerRoleBeingChanged = isTargetOwner && updates.role_id && newRoleRecord?.key !== 'owner';

    if (isTargetOwner && (isBeingDeactivated || isOwnerRoleBeingChanged)) {
      // Count total active owners in admin_users
      const { data: ownerRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('key', 'owner')
        .single();

      if (ownerRole) {
        const { data: activeOwners, error: countErr } = await supabaseAdmin
          .from('admin_users')
          .select('id')
          .eq('role_id', ownerRole.id)
          .eq('is_active', true);

        if (!countErr && activeOwners && activeOwners.length <= 1) {
          return NextResponse.json(
            {
              error:
                'حداقل یک مالک (Owner) فعال باید در سیستم باقی بماند. امکان غیرفعال‌سازی یا تغییر نقش تنها مالک وجود ندارد.',
            },
            { status: 400 }
          );
        }
      }
    }

    // 5. Update admin_users record
    const { data: updatedStaff, error: updateErr } = await supabaseAdmin
      .from('admin_users')
      .update(updates)
      .eq('id', staffId)
      .select(`
        id,
        role_id,
        full_name,
        is_active,
        telegram_chat_id,
        notify_email,
        notify_telegram,
        updated_at,
        roles (
          id,
          key,
          label_fa,
          label_en
        )
      `)
      .single();

    if (updateErr) {
      console.error('Failed to update team member:', updateErr);
      return NextResponse.json(
        { error: 'Failed to update team member.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      member: updatedStaff,
    });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/team/[staffId]:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
