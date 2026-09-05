import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/team/invite
 * Invites a new staff member to the admin panel and creates their admin_users row.
 * Requires 'team.manage' permission (owner/manager).
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'team.manage')) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to invite team members.' },
        { status: 403 }
      );
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

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const roleId = typeof body.role_id === 'string' ? body.role_id.trim() : '';
    const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    if (!roleId) {
      return NextResponse.json({ error: 'Role selection is required.' }, { status: 400 });
    }

    // Verify role exists
    const { data: roleRecord, error: roleErr } = await supabaseAdmin
      .from('roles')
      .select('id, key, label_fa')
      .eq('id', roleId)
      .maybeSingle();

    if (roleErr || !roleRecord) {
      return NextResponse.json({ error: 'Selected role does not exist.' }, { status: 400 });
    }

    // Security Guard: Only an existing Owner can invite another Owner
    if (roleRecord.key === 'owner' && admin.roleKey !== 'owner') {
      return NextResponse.json(
        { error: 'Only existing Owners can assign or invite another Owner.' },
        { status: 403 }
      );
    }

    // Determine redirect URL
    const url = new URL(request.url);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
    const callbackUrl = `${origin}/fa/admin/callback`;

    // 1. Invite user via Supabase Auth admin API
    const inviteRes = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: callbackUrl,
      data: {
        full_name: fullName || email.split('@')[0],
      },
    });

    let targetUserId: string;

    if (inviteRes.error) {
      // If user already exists in auth.users, check if they are already in admin_users
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      const existingAuth = listData?.users?.find((u) => u.email?.toLowerCase() === email);

      if (!existingAuth) {
        console.error('Failed to invite user by email:', inviteRes.error);
        return NextResponse.json(
          { error: inviteRes.error.message || 'Failed to send invitation email.' },
          { status: 400 }
        );
      }

      targetUserId = existingAuth.id;

      // Check if already an admin
      const { data: existingAdmin } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('id', targetUserId)
        .maybeSingle();

      if (existingAdmin) {
        return NextResponse.json(
          { error: 'This user is already a member of the admin team.' },
          { status: 409 }
        );
      }
    } else {
      if (!inviteRes.data.user) {
        return NextResponse.json({ error: 'Failed to create auth user.' }, { status: 500 });
      }
      targetUserId = inviteRes.data.user.id;
    }

    // 2. Insert into admin_users
    const { data: newAdminUser, error: insertErr } = await supabaseAdmin
      .from('admin_users')
      .insert({
        id: targetUserId,
        role_id: roleRecord.id,
        full_name: fullName || email.split('@')[0],
        is_active: true,
      })
      .select('id, full_name, role_id, is_active, created_at')
      .single();

    if (insertErr) {
      console.error('Failed to create admin_users record:', insertErr);
      return NextResponse.json(
        { error: 'Failed to register team member profile.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      member: {
        ...newAdminUser,
        email,
        role: roleRecord,
      },
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/team/invite:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
