import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/team
 * Lists all admin users with their role, email, and active status.
 * Requires 'team.manage' permission (owner/manager).
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'team.manage')) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions to view or manage team members.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service unconfigured.' },
        { status: 500 }
      );
    }

    // 1. Query all roles
    const { data: roles, error: rolesErr } = await supabaseAdmin
      .from('roles')
      .select('*')
      .order('key');

    if (rolesErr) {
      console.error('Error fetching roles:', rolesErr);
      return NextResponse.json({ error: 'Failed to fetch roles.' }, { status: 500 });
    }

    // 2. Query all admin_users with their roles
    const { data: adminUsers, error: usersErr } = await supabaseAdmin
      .from('admin_users')
      .select(`
        id,
        role_id,
        full_name,
        is_active,
        telegram_chat_id,
        notify_email,
        notify_telegram,
        created_at,
        updated_at,
        roles (
          id,
          key,
          label_fa,
          label_en
        )
      `)
      .order('created_at', { ascending: true });

    if (usersErr) {
      console.error('Error fetching admin users:', usersErr);
      return NextResponse.json({ error: 'Failed to fetch team members.' }, { status: 500 });
    }

    // 3. Resolve emails from Supabase Auth
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });

    const emailMap = new Map<string, string>();
    if (!authErr && authData?.users) {
      for (const u of authData.users) {
        if (u.email) {
          emailMap.set(u.id, u.email);
        }
      }
    }

    const team = (adminUsers || []).map((u) => ({
      id: u.id,
      full_name: u.full_name,
      email: emailMap.get(u.id) || null,
      role_id: u.role_id,
      role: u.roles,
      is_active: u.is_active,
      telegram_chat_id: u.telegram_chat_id,
      notify_email: u.notify_email,
      notify_telegram: u.notify_telegram,
      created_at: u.created_at,
      updated_at: u.updated_at,
    }));

    return NextResponse.json({
      success: true,
      team,
      roles: roles || [],
      currentAdmin: {
        id: admin.adminUserId,
        email: admin.email,
        fullName: admin.fullName,
        roleKey: admin.roleKey,
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/team:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
