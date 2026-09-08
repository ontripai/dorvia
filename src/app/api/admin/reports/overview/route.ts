import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  parseReportDates,
  generateDateList,
  toCsvString,
  createCsvResponse,
  escapeCsvCell,
} from '@/lib/reportsHelper';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/reports/overview
 * Company-wide overview report.
 * Accessible ONLY to 'owner' and 'manager' roles with 'reports.view' permission.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (
      !admin ||
      !hasPermission(admin, 'reports.view') ||
      !['owner', 'manager'].includes(admin.roleKey)
    ) {
      return NextResponse.json(
        { error: 'Forbidden. Company overview report requires owner or manager role.' },
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

    // 1. Status breakdown of all leads (current state across whole DB)
    const { data: allLeads, error: leadsErr } = await supabaseAdmin
      .from('leads')
      .select('id, status, created_at');

    if (leadsErr) {
      console.error('Error fetching leads for overview:', leadsErr);
      return NextResponse.json({ error: leadsErr.message }, { status: 500 });
    }

    const statusCounts: Record<string, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      closed: 0,
      archived: 0,
    };

    allLeads?.forEach((l) => {
      const st = l.status || 'new';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    // 2. Daily lead registration trend in chosen date range
    const rangeLeads = (allLeads || []).filter(
      (l) => l.created_at >= dateRange.fromIso && l.created_at <= dateRange.toIso
    );

    const dailyMap: Record<string, number> = {};
    const dateList = generateDateList(dateRange.fromStr, dateRange.toStr);
    dateList.forEach((d) => {
      dailyMap[d] = 0;
    });

    rangeLeads.forEach((l) => {
      const d = l.created_at.split('T')[0];
      if (dailyMap[d] !== undefined) {
        dailyMap[d] += 1;
      }
    });

    const dailyTrend = dateList.map((date) => ({
      date,
      count: dailyMap[date] || 0,
    }));

    // 3. Urgent cases needing attention: case_stages with status != 'done' and due_date <= today + 1
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];

    const { data: urgentStages, error: stagesErr } = await supabaseAdmin
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
        lead:leads!case_stages_lead_id_fkey (
          id,
          full_name,
          email,
          phone,
          status
        ),
        staff:admin_users!case_stages_responsible_staff_id_fkey (
          id,
          full_name
        )
      `)
      .neq('status', 'done')
      .not('due_date', 'is', null)
      .lte('due_date', tomorrowStr)
      .order('due_date', { ascending: true });

    if (stagesErr) {
      console.error('Error fetching urgent stages for overview:', stagesErr);
      return NextResponse.json({ error: stagesErr.message }, { status: 500 });
    }

    const urgentCases = (urgentStages || []).map((s: any) => ({
      stageId: s.id,
      leadId: s.lead_id,
      leadFullName: s.lead?.full_name || 'نامشخص',
      leadStatus: s.lead?.status || '',
      stageKey: s.stage_key,
      stageLabelFa: s.label_fa,
      status: s.status,
      dueDate: s.due_date,
      isOverdue: s.due_date < todayStr,
      responsibleRole: s.responsible_role,
      responsibleStaffId: s.responsible_staff_id,
      responsibleStaffName: s.staff?.full_name || null,
    }));

    // 4. Staff workload: All active admin users + assigned cases + pending/overdue stages
    const { data: staffList, error: staffErr } = await supabaseAdmin
      .from('admin_users')
      .select(`
        id,
        full_name,
        is_active,
        roles!admin_users_role_id_fkey (
          id,
          key,
          label_fa,
          label_en
        )
      `)
      .eq('is_active', true);

    if (staffErr) {
      console.error('Error fetching staff for overview:', staffErr);
      return NextResponse.json({ error: staffErr.message }, { status: 500 });
    }

    // Fetch all assignments
    const { data: assignments } = await supabaseAdmin
      .from('lead_assignments')
      .select('staff_id, lead_id');

    // Fetch all non-done stages
    const { data: openStages } = await supabaseAdmin
      .from('case_stages')
      .select('responsible_staff_id, due_date, status')
      .neq('status', 'done');

    const staffWorkload = (staffList || []).map((s: any) => {
      const assignedLeadIds = new Set(
        (assignments || [])
          .filter((a) => a.staff_id === s.id)
          .map((a) => a.lead_id)
      );

      const staffStages = (openStages || []).filter(
        (st) => st.responsible_staff_id === s.id
      );

      const overdueCount = staffStages.filter(
        (st) => st.due_date && st.due_date < todayStr
      ).length;

      const roleData = s.roles as any;

      return {
        staffId: s.id,
        fullName: s.full_name || 'بدون نام',
        roleKey: roleData?.key || 'unknown',
        roleLabelFa: roleData?.label_fa || roleData?.key || 'نامشخص',
        assignedCasesCount: assignedLeadIds.size,
        pendingStagesCount: staffStages.length,
        overdueStagesCount: overdueCount,
      };
    });

    // Summary KPIs
    const summary = {
      totalLeads: (allLeads || []).length,
      rangeLeadsCount: rangeLeads.length,
      urgentCasesCount: urgentCases.length,
      activeStaffCount: (staffList || []).length,
      from: dateRange.fromStr,
      to: dateRange.toStr,
    };

    // Return CSV format if requested
    if (isCsv) {
      let csv = `گزارش نمای کلی شرکت (${dateRange.fromStr} تا ${dateRange.toStr})\n\n`;

      csv += 'شاخص‌های کلیدی\n';
      csv += toCsvString(
        ['کل لیدها', 'لیدهای بازه انتخابی', 'پرونده‌های نیازمند اقدام فوری', 'تعداد کارمندان فعال'],
        [[summary.totalLeads, summary.rangeLeadsCount, summary.urgentCasesCount, summary.activeStaffCount]]
      );
      csv += '\n\n';

      csv += 'تفکیک وضعیت کل پرونده‌ها\n';
      csv += toCsvString(
        ['وضعیت', 'تعداد پرونده'],
        statusBreakdown.map((s) => [s.status, s.count])
      );
      csv += '\n\n';

      csv += 'روند روزانه ثبت لید در بازه انتخابی\n';
      csv += toCsvString(
        ['تاریخ', 'تعداد لید'],
        dailyTrend.map((d) => [d.date, d.count])
      );
      csv += '\n\n';

      csv += 'حجم کاری پرسنل\n';
      csv += toCsvString(
        ['شناسه پرسنل', 'نام پرسنل', 'نقش', 'پرونده‌های تخصیص‌یافته', 'مراحل باز', 'مراحل سررسیدگذشته'],
        staffWorkload.map((sw) => [
          sw.staffId,
          sw.fullName,
          sw.roleLabelFa,
          sw.assignedCasesCount,
          sw.pendingStagesCount,
          sw.overdueStagesCount,
        ])
      );
      csv += '\n\n';

      csv += 'پرونده‌ها و مراحل نیازمند اقدام فوری\n';
      csv += toCsvString(
        ['شناسه مرحله', 'نام متقاضی', 'عنوان مرحله', 'وضعیت', 'سررسید', 'سررسید گذشته؟', 'مسئول'],
        urgentCases.map((uc) => [
          uc.stageId,
          uc.leadFullName,
          uc.stageLabelFa,
          uc.status,
          uc.dueDate,
          uc.isOverdue ? 'بله' : 'خیر',
          uc.responsibleStaffName || uc.responsibleRole,
        ])
      );

      return createCsvResponse(csv, `overview-report-${dateRange.fromStr}-to-${dateRange.toStr}.csv`);
    }

    return NextResponse.json({
      dateRange: {
        from: dateRange.fromStr,
        to: dateRange.toStr,
        days: dateRange.diffDays,
      },
      summary,
      statusBreakdown,
      dailyTrend,
      staffWorkload,
      urgentCases,
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/reports/overview:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
