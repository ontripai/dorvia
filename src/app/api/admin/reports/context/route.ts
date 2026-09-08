import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/reports/context
 * Returns current admin user profile and allowed report tabs.
 * Requires 'reports.view' permission.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'reports.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view reports.' },
        { status: 403 }
      );
    }

    const isOwnerOrManager = ['owner', 'manager'].includes(admin.roleKey);
    const hasFinance = hasPermission(admin, 'finance.view');
    const isMarketing = ['marketing', 'owner', 'manager'].includes(admin.roleKey);

    const availableTabs: { id: string; labelFa: string; labelEn: string }[] = [];

    if (isOwnerOrManager) {
      availableTabs.push({ id: 'overview', labelFa: 'نمای کلی شرکت', labelEn: 'Company Overview' });
    }

    // "My Cases" is accessible to all roles
    availableTabs.push({ id: 'my-cases', labelFa: 'پرونده‌های من', labelEn: 'My Cases' });

    if (hasFinance) {
      availableTabs.push({ id: 'finance', labelFa: 'مالی', labelEn: 'Finance' });
    }

    if (isMarketing) {
      availableTabs.push({ id: 'marketing', labelFa: 'بازاریابی', labelEn: 'Marketing' });
    }

    return NextResponse.json({
      admin: {
        adminUserId: admin.adminUserId,
        email: admin.email,
        fullName: admin.fullName,
        roleKey: admin.roleKey,
        roleLabelFa: admin.roleLabelFa,
        roleLabelEn: admin.roleLabelEn,
        permissions: Array.from(admin.permissions),
      },
      availableTabs,
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/reports/context:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
