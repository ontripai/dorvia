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
 * Helper to compute ISO week label (e.g. "2026-W36") from date string.
 */
function getWeekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * GET /api/admin/reports/finance
 * Upgraded professional financial analytics report (dre-p85).
 * All metrics strictly in EUR.
 * Reads from case_charges, case_receipts, and case_expenses.
 * Includes per-client receivables and balance breakdown.
 * Requires 'finance.view' permission.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view financial reports.' },
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

    // 1. Fetch active receipts received within date range
    const { data: receiptsInRange, error: recErr } = await supabaseAdmin
      .from('case_receipts')
      .select('id, lead_id, amount, received_at, status')
      .eq('status', 'active')
      .gte('received_at', dateRange.fromStr)
      .lte('received_at', dateRange.toStr);

    if (recErr) {
      console.error('Error fetching receipts for finance report:', recErr);
      return NextResponse.json({ error: recErr.message }, { status: 500 });
    }

    const totalRevenue = (receiptsInRange || []).reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    // 2. Fetch non-cancelled charges created within date range
    const { data: chargesInRange, error: chgErr } = await supabaseAdmin
      .from('case_charges')
      .select('id, lead_id, total_amount, created_at, status')
      .neq('status', 'cancelled')
      .gte('created_at', dateRange.fromIso)
      .lte('created_at', dateRange.toIso);

    if (chgErr) {
      console.error('Error fetching charges for finance report:', chgErr);
      return NextResponse.json({ error: chgErr.message }, { status: 500 });
    }

    const totalCharges = (chargesInRange || []).reduce(
      (sum, item) => sum + Number(item.total_amount || 0),
      0
    );

    // 3. Fetch expenses incurred within date range
    const { data: expenses, error: expErr } = await supabaseAdmin
      .from('case_expenses')
      .select('id, lead_id, expense_type, amount, currency, incurred_at, paid_to')
      .gte('incurred_at', dateRange.fromIso)
      .lte('incurred_at', dateRange.toIso);

    if (expErr) {
      console.error('Error fetching expenses for finance report:', expErr);
      return NextResponse.json({ error: expErr.message }, { status: 500 });
    }

    const totalExpenses = (expenses || []).reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const netProfit = totalRevenue - totalExpenses;

    // 4. Time Series generation (daily if diffDays <= 31, weekly otherwise)
    const isDaily = dateRange.diffDays <= 31;
    let timeSeries: { period: string; label: string; revenue: number; expenses: number; profit: number }[] = [];

    if (isDaily) {
      const dates = generateDateList(dateRange.fromStr, dateRange.toStr);
      const revMap: Record<string, number> = {};
      const expMap: Record<string, number> = {};

      dates.forEach((d) => {
        revMap[d] = 0;
        expMap[d] = 0;
      });

      (receiptsInRange || []).forEach((r) => {
        if (r.received_at && revMap[r.received_at] !== undefined) {
          revMap[r.received_at] += Number(r.amount || 0);
        }
      });

      (expenses || []).forEach((e) => {
        const d = e.incurred_at?.split('T')[0];
        if (d && expMap[d] !== undefined) {
          expMap[d] += Number(e.amount || 0);
        }
      });

      timeSeries = dates.map((d) => {
        const rev = revMap[d] || 0;
        const exp = expMap[d] || 0;
        return {
          period: d,
          label: d.slice(5), // "MM-DD"
          revenue: Math.round(rev * 100) / 100,
          expenses: Math.round(exp * 100) / 100,
          profit: Math.round((rev - exp) * 100) / 100,
        };
      });
    } else {
      const revMap: Record<string, number> = {};
      const expMap: Record<string, number> = {};
      const weekLabels: Record<string, string> = {};

      (receiptsInRange || []).forEach((r) => {
        if (r.received_at) {
          const w = getWeekLabel(r.received_at);
          revMap[w] = (revMap[w] || 0) + Number(r.amount || 0);
          weekLabels[w] = w;
        }
      });

      (expenses || []).forEach((e) => {
        const d = e.incurred_at?.split('T')[0];
        if (d) {
          const w = getWeekLabel(d);
          expMap[w] = (expMap[w] || 0) + Number(e.amount || 0);
          weekLabels[w] = w;
        }
      });

      const sortedWeeks = Object.keys(weekLabels).sort();
      timeSeries = sortedWeeks.map((w) => {
        const rev = revMap[w] || 0;
        const exp = expMap[w] || 0;
        return {
          period: w,
          label: `هفته ${w.slice(5)}`,
          revenue: Math.round(rev * 100) / 100,
          expenses: Math.round(exp * 100) / 100,
          profit: Math.round((rev - exp) * 100) / 100,
        };
      });
    }

    // 5. Per-Client Breakdown Table (every client with charges or receipts)
    // Query all non-cancelled charges with joined lead info
    const { data: allCharges, error: allChgErr } = await supabaseAdmin
      .from('case_charges')
      .select(`
        id,
        lead_id,
        total_amount,
        status,
        lead:leads!case_charges_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)
      .neq('status', 'cancelled');

    if (allChgErr) {
      console.error('Error fetching all charges for client breakdown:', allChgErr);
      return NextResponse.json({ error: allChgErr.message }, { status: 500 });
    }

    // Query all active receipts
    const { data: allReceipts, error: allRecErr } = await supabaseAdmin
      .from('case_receipts')
      .select('id, lead_id, amount, status')
      .eq('status', 'active');

    if (allRecErr) {
      console.error('Error fetching all receipts for client breakdown:', allRecErr);
      return NextResponse.json({ error: allRecErr.message }, { status: 500 });
    }

    // Aggregate by lead_id
    const clientMap: Record<
      string,
      {
        leadId: string;
        leadFullName: string;
        leadEmail: string | null;
        leadPhone: string | null;
        totalCharges: number;
        totalReceipts: number;
        remainingBalance: number;
        openChargesCount: number;
      }
    > = {};

    (allCharges || []).forEach((c: any) => {
      const lid = c.lead_id;
      if (!clientMap[lid]) {
        clientMap[lid] = {
          leadId: lid,
          leadFullName: c.lead?.full_name || 'متقاضی نامشخص',
          leadEmail: c.lead?.email || null,
          leadPhone: c.lead?.phone || null,
          totalCharges: 0,
          totalReceipts: 0,
          remainingBalance: 0,
          openChargesCount: 0,
        };
      }
      clientMap[lid].totalCharges += Number(c.total_amount || 0);
      if (c.status === 'open' || c.status === 'partially_paid') {
        clientMap[lid].openChargesCount += 1;
      }
    });

    (allReceipts || []).forEach((r: any) => {
      const lid = r.lead_id;
      if (!clientMap[lid]) {
        clientMap[lid] = {
          leadId: lid,
          leadFullName: 'متقاضی نامشخص',
          leadEmail: null,
          leadPhone: null,
          totalCharges: 0,
          totalReceipts: 0,
          remainingBalance: 0,
          openChargesCount: 0,
        };
      }
      clientMap[lid].totalReceipts += Number(r.amount || 0);
    });

    const clientBreakdown = Object.values(clientMap).map((client) => {
      const charges = Math.round(client.totalCharges * 100) / 100;
      const receipts = Math.round(client.totalReceipts * 100) / 100;
      const balance = Math.round((charges - receipts) * 100) / 100;
      return {
        ...client,
        totalCharges: charges,
        totalReceipts: receipts,
        remainingBalance: balance,
      };
    });

    // Sort: highest remaining balance first, then name
    clientBreakdown.sort((a, b) => b.remainingBalance - a.remainingBalance);

    const totalOutstandingBalance = clientBreakdown.reduce(
      (sum, c) => sum + (c.remainingBalance > 0 ? c.remainingBalance : 0),
      0
    );

    const summary = {
      currency: 'EUR',
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCharges: Math.round(totalCharges * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      totalClientsWithBalance: clientBreakdown.filter((c) => c.remainingBalance > 0).length,
      totalOutstandingBalance: Math.round(totalOutstandingBalance * 100) / 100,
      timeSeriesMode: isDaily ? 'daily' : 'weekly',
      from: dateRange.fromStr,
      to: dateRange.toStr,
    };

    if (isCsv) {
      let csv = `گزارش مالی پورتال DORVIA (${dateRange.fromStr} تا ${dateRange.toStr}) - مبالغ به یورو (EUR)\n\n`;

      csv += 'شاخص‌های کلیدی مالی\n';
      csv += toCsvString(
        ['درآمد بازه (EUR)', 'بدهکاری‌های ثبت‌شده (EUR)', 'هزینه‌های بازه (EUR)', 'سود خالص (EUR)', 'مجموع مانده مطالبات (EUR)'],
        [[summary.totalRevenue, summary.totalCharges, summary.totalExpenses, summary.netProfit, summary.totalOutstandingBalance]]
      );
      csv += '\n\n';

      csv += `روند زمانی مالی (${isDaily ? 'روزانه' : 'هفتگی'})\n`;
      csv += toCsvString(
        ['بازه', 'درآمد (EUR)', 'هزینه (EUR)', 'سود خالص (EUR)'],
        timeSeries.map((t) => [t.label, t.revenue, t.expenses, t.profit])
      );
      csv += '\n\n';

      csv += 'جدول تفکیکی مطالبات و گردش حساب مشتریان\n';
      csv += toCsvString(
        ['شناسه مشتری', 'نام متقاضی', 'شماره تماس', 'ایمیل', 'کل بدهکاری‌ها (EUR)', 'کل دریافتی‌ها (EUR)', 'مانده حساب (EUR)', 'تعداد خدمات باز'],
        clientBreakdown.map((c) => [
          c.leadId,
          c.leadFullName,
          c.leadPhone || '-',
          c.leadEmail || '-',
          c.totalCharges,
          c.totalReceipts,
          c.remainingBalance,
          c.openChargesCount,
        ])
      );

      return createCsvResponse(csv, `finance-report-${dateRange.fromStr}-to-${dateRange.toStr}.csv`);
    }

    return NextResponse.json({
      currency: 'EUR',
      dateRange: {
        from: dateRange.fromStr,
        to: dateRange.toStr,
        days: dateRange.diffDays,
      },
      summary,
      timeSeries,
      clientBreakdown,
      // Backward compatibility alias for UI components reading outstandingInvoices
      outstandingInvoices: clientBreakdown
        .filter((c) => c.remainingBalance > 0)
        .map((c) => ({
          invoiceId: c.leadId,
          leadId: c.leadId,
          leadFullName: c.leadFullName,
          leadEmail: c.leadEmail,
          leadPhone: c.leadPhone,
          currency: 'EUR',
          totalAmount: c.totalCharges,
          paidAmount: c.totalReceipts,
          remainingAmount: c.remainingBalance,
          status: c.openChargesCount > 0 ? 'partially_paid' : 'open',
          createdAt: dateRange.fromIso,
        })),
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/reports/finance:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
