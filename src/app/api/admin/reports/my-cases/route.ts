import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  parseReportDates,
  toCsvString,
  createCsvResponse,
} from '@/lib/reportsHelper';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/reports/my-cases
 * Staff-specific cases and stages report.
 * Accessible to any authenticated admin with 'reports.view'.
 * Result is ALWAYS strictly isolated to the logged-in admin's own assigned cases and stages.
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

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service unconfigured.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dateRange = parseReportDates(searchParams);
    const isCsv = searchParams.get('format')?.toLowerCase() === 'csv';
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Fetch cases assigned to the current staff member from lead_assignments
    const { data: assignments, error: assignErr } = await supabaseAdmin
      .from('lead_assignments')
      .select(`
        id,
        lead_id,
        assigned_role,
        assigned_at,
        lead:leads!lead_assignments_lead_id_fkey (
          id,
          full_name,
          email,
          phone,
          status,
          source,
          site_goal,
          created_at
        )
      `)
      .eq('staff_id', admin.adminUserId)
      .order('assigned_at', { ascending: false });

    if (assignErr) {
      console.error('Error fetching assignments for my-cases:', assignErr);
      return NextResponse.json({ error: assignErr.message }, { status: 500 });
    }

    const assignedCases = (assignments || []).map((a: any) => ({
      assignmentId: a.id,
      leadId: a.lead_id,
      assignedRole: a.assigned_role,
      assignedAt: a.assigned_at,
      fullName: a.lead?.full_name || 'نامشخص',
      email: a.lead?.email || null,
      phone: a.lead?.phone || null,
      status: a.lead?.status || 'new',
      source: a.lead?.source || 'website',
      siteGoal: a.lead?.site_goal || null,
      createdAt: a.lead?.created_at,
    }));

    // Status distribution among my assigned cases
    const statusCounts: Record<string, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      closed: 0,
      archived: 0,
    };
    assignedCases.forEach((c) => {
      const st = c.status || 'new';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    // 2. Fetch pending and overdue stages assigned to this staff member
    const { data: openStages, error: stagesErr } = await supabaseAdmin
      .from('case_stages')
      .select(`
        id,
        lead_id,
        stage_key,
        label_fa,
        status,
        due_date,
        responsible_role,
        lead:leads!case_stages_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('responsible_staff_id', admin.adminUserId)
      .neq('status', 'done')
      .order('due_date', { ascending: true, nullsFirst: false });

    if (stagesErr) {
      console.error('Error fetching open stages for my-cases:', stagesErr);
      return NextResponse.json({ error: stagesErr.message }, { status: 500 });
    }

    const pendingStages = (openStages || []).map((s: any) => ({
      stageId: s.id,
      leadId: s.lead_id,
      leadFullName: s.lead?.full_name || 'نامشخص',
      leadEmail: s.lead?.email || null,
      leadPhone: s.lead?.phone || null,
      stageKey: s.stage_key,
      stageLabelFa: s.label_fa,
      status: s.status,
      dueDate: s.due_date,
      isOverdue: s.due_date ? s.due_date < todayStr : false,
      responsibleRole: s.responsible_role,
    }));

    // 3. Count completed stages in chosen date range
    const { data: completedStages, error: compErr } = await supabaseAdmin
      .from('case_stages')
      .select('id, completed_at, label_fa, stage_key, lead_id')
      .eq('responsible_staff_id', admin.adminUserId)
      .eq('status', 'done')
      .gte('completed_at', dateRange.fromIso)
      .lte('completed_at', dateRange.toIso);

    if (compErr) {
      console.error('Error fetching completed stages for my-cases:', compErr);
      return NextResponse.json({ error: compErr.message }, { status: 500 });
    }

    const overdueCount = pendingStages.filter((s) => s.isOverdue).length;

    const summary = {
      totalAssignedCases: assignedCases.length,
      pendingStagesCount: pendingStages.length,
      overdueStagesCount: overdueCount,
      completedStagesInRange: (completedStages || []).length,
      from: dateRange.fromStr,
      to: dateRange.toStr,
    };

    if (isCsv) {
      let csv = `گزارش پرونده‌های من - ${admin.fullName || admin.email} (${dateRange.fromStr} تا ${dateRange.toStr})\n\n`;

      csv += 'شاخص‌های کلیدی\n';
      csv += toCsvString(
        ['پرونده‌های تخصیص‌یافته', 'مراحل باز', 'مراحل سررسیدگذشته', 'مراحل انجام‌شده در بازه'],
        [[summary.totalAssignedCases, summary.pendingStagesCount, summary.overdueStagesCount, summary.completedStagesInRange]]
      );
      csv += '\n\n';

      csv += 'مراحل باز و نیازمند اقدام\n';
      csv += toCsvString(
        ['شناسه مرحله', 'نام متقاضی', 'عنوان مرحله', 'وضعیت', 'سررسید', 'سررسید گذشته؟'],
        pendingStages.map((s) => [
          s.stageId,
          s.leadFullName,
          s.stageLabelFa,
          s.status,
          s.dueDate || 'تعیین نشده',
          s.isOverdue ? 'بله' : 'خیر',
        ])
      );
      csv += '\n\n';

      csv += 'پرونده‌های تخصیص‌یافته\n';
      csv += toCsvString(
        ['شناسه پرونده', 'نام متقاضی', 'ایمیل', 'شماره تماس', 'نقش تخصیص‌یافته', 'وضعیت', 'منبع'],
        assignedCases.map((c) => [
          c.leadId,
          c.fullName,
          c.email,
          c.phone,
          c.assignedRole,
          c.status,
          c.source,
        ])
      );

      return createCsvResponse(csv, `my-cases-report-${dateRange.fromStr}-to-${dateRange.toStr}.csv`);
    }

    return NextResponse.json({
      dateRange: {
        from: dateRange.fromStr,
        to: dateRange.toStr,
        days: dateRange.diffDays,
      },
      summary,
      statusCounts,
      assignedCases,
      pendingStages,
      completedStagesInRange: completedStages || [],
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/reports/my-cases:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
