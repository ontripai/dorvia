import { createServerComponentClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface AdminContext {
  adminUserId: string;
  email: string;
  fullName: string | null;
  roleId: string;
  roleKey: string;
  roleLabelFa: string;
  roleLabelEn: string;
  permissions: Set<string>;
}

/**
 * Validates current session against public.admin_users and compiles effective permissions.
 * Returns null if user is unauthenticated, inactive, or not registered as an admin.
 */
export async function getAdminContext(): Promise<AdminContext | null> {
  try {
    const supabase = createServerComponentClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    if (!supabaseAdmin) {
      console.error('Supabase admin client unconfigured.');
      return null;
    }

    // 1. Fetch admin_users record with role details
    const { data: adminUser, error: adminErr } = await supabaseAdmin
      .from('admin_users')
      .select(`
        id,
        full_name,
        is_active,
        permission_overrides,
        role_id,
        roles (
          id,
          key,
          label_fa,
          label_en
        )
      `)
      .eq('id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (adminErr || !adminUser || !adminUser.roles) {
      return null;
    }

    const roleData = adminUser.roles as any;
    const roleId = adminUser.role_id;

    // 2. Fetch all permissions granted to this role
    const { data: rolePerms, error: permErr } = await supabaseAdmin
      .from('role_permissions')
      .select(`
        permission_id,
        permissions (
          key
        )
      `)
      .eq('role_id', roleId);

    const permissions = new Set<string>();

    if (!permErr && rolePerms) {
      for (const rp of rolePerms) {
        const perm = rp.permissions as any;
        if (perm?.key) {
          permissions.add(perm.key);
        }
      }
    }

    // 3. Apply permission_overrides if present on the admin user
    const overrides = (adminUser.permission_overrides as Record<string, boolean>) || {};
    for (const [key, granted] of Object.entries(overrides)) {
      if (granted === true) {
        permissions.add(key);
      } else if (granted === false) {
        permissions.delete(key);
      }
    }

    return {
      adminUserId: adminUser.id,
      email: user.email || '',
      fullName: adminUser.full_name,
      roleId: roleData.id,
      roleKey: roleData.key,
      roleLabelFa: roleData.label_fa || roleData.key,
      roleLabelEn: roleData.label_en || roleData.key,
      permissions,
    };
  } catch (error) {
    console.error('Error in getAdminContext:', error);
    return null;
  }
}

/**
 * Checks if the given admin context possesses the required permission.
 */
export function hasPermission(context: AdminContext | null, permissionKey: string): boolean {
  if (!context) return false;
  return context.permissions.has(permissionKey);
}
