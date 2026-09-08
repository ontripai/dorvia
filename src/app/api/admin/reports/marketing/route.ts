import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  parseReportDates,
  generateDateList,
  toCsvString,
  createCsvResponse,
} from '@/lib/reportsHelper';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/reports/marketing
 * Marketing and acquisition analytics report.
 * Requires 'reports.view' permission and role in ['marketing', 'owner', 'manager'].
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (
      !admin ||
      !hasPermission(admin, 'reports.view') ||
      !['marketing', 'owner', 'manager'].includes(admin.roleKey)
    ) {
      return NextResponse.json(
        { error: 'Forbidden. Marketing report requires marketing, owner, or manager role.' },
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

    // 1. Fetch leads registered within the date range
    const { data: rangeLeads, error: leadsErr } = await supabaseAdmin
      .from('leads')
      .select('id, source, status, site_goal, unified_category, created_at')
      .gte('created_at', dateRange.fromIso)
      .lte('created_at', dateRange.toIso)
      .order('created_at', { ascending: true });

    if (leadsErr) {
      console.error('Error fetching leads for marketing report:', leadsErr);
      return NextResponse.json({ error: leadsErr.message }, { status: 500 });
    }

    const totalLeads = (rangeLeads || []).length;

    // 2. Breakdown by source
    const sourceCounts: Record<string, number> = {
      website: 0,
      telegram_bot: 0,
      whatsapp: 0,
    };

    let qualifiedCount = 0;
    const recognizedSources = new Set(['website', 'telegram_bot', 'whatsapp']);

    (rangeLeads || []).forEach((lead) => {
      const src = lead.source || 'website';
      if (recognizedSources.has(src)) {
        sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      } else {
        sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      }

      if (lead.status === 'qualified') {
        qualifiedCount += 1;
      }
    });

    const sourcesBreakdown = Object.entries(sourceCounts).map(([source, count]) => ({
      source,
      count,
      percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 1000) / 10 : 0,
    }));

    const conversionRatePercent =
      totalLeads > 0 ? Math.round((qualifiedCount / totalLeads) * 1000) / 10 : 0;

    // 3. Daily registration trend in date range by source
    const dates = generateDateList(dateRange.fromStr, dateRange.toStr);
    const dailyMap: Record<
      string,
      { website: number; telegram_bot: number; whatsapp: number; other: number; total: number }
    > = {};

    dates.forEach((d) => {
      dailyMap[d] = {
        website: 0,
        telegram_bot: 0,
        whatsapp: 0,
        other: 0,
        total: 0,
      };
    });

    (rangeLeads || []).forEach((lead) => {
      const d = lead.created_at.split('T')[0];
      if (dailyMap[d]) {
        dailyMap[d].total += 1;
        const src = lead.source || 'website';
        if (src === 'website') {
          dailyMap[d].website += 1;
        } else if (src === 'telegram_bot') {
          dailyMap[d].telegram_bot += 1;
        } else if (src === 'whatsapp') {
          dailyMap[d].whatsapp += 1;
        } else {
          dailyMap[d].other += 1;
        }
      }
    });

    const dailyTrendBySource = dates.map((date) => ({
      date,
      ...dailyMap[date],
    }));

    const summary = {
      totalLeadsInRange: totalLeads,
      qualifiedCount,
      conversionRatePercent,
      sourcesCount: Object.keys(sourceCounts).length,
      from: dateRange.fromStr,
      to: dateRange.toStr,
    };

    if (isCsv) {
      let csv = `گزارش بازاریابی و جذب متقاضیان (${dateRange.fromStr} تا ${dateRange.toStr})\n\n`;

      csv += 'شاخص‌های کلیدی بازاریابی\n';
      csv += toCsvString(
        ['کل لیدهای ثبت‌شده در بازه', 'لیدهای واجد شرایط (Qualified)', 'نرخ تبدیل (%)'],
        [[summary.totalLeadsInRange, summary.qualifiedCount, `${summary.conversionRatePercent}%`]]
      );
      csv += '\n\n';

      csv += 'تفکیک لیدها بر اساس کانال ورودی (Source)\n';
      csv += toCsvString(
        ['کانال ورودی', 'تعداد', 'درصد سهم (%)'],
        sourcesBreakdown.map((s) => [s.source, s.count, `${s.percentage}%`])
      );
      csv += '\n\n';

      csv += 'روند روزانه ثبت لید به تفکیک کانال\n';
      csv += toCsvString(
        ['تاریخ', 'وب‌سایت', 'بات تلگرام', 'واتساپ', 'سایر', 'مجموع روزانه'],
        dailyTrendBySource.map((d) => [
          d.date,
          d.website,
          d.telegram_bot,
          d.whatsapp,
          d.other,
          d.total,
        ])
      );

      return createCsvResponse(csv, `marketing-report-${dateRange.fromStr}-to-${dateRange.toStr}.csv`);
    }

    return NextResponse.json({
      dateRange: {
        from: dateRange.fromStr,
        to: dateRange.toStr,
        days: dateRange.diffDays,
      },
      summary,
      sourcesBreakdown,
      dailyTrendBySource,
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/reports/marketing:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
