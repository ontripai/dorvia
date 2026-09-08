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
 * Financial analytics report.
 * Requires 'finance.view' permission (finance, owner, manager).
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

    // 1. Fetch installments paid within date range
    const { data: installments, error: instErr } = await supabaseAdmin
      .from('invoice_installments')
      .select('id, invoice_id, amount, paid_amount, paid_at, status')
      .not('paid_at', 'is', null)
      .gte('paid_at', dateRange.fromIso)
      .lte('paid_at', dateRange.toIso);

    if (instErr) {
      console.error('Error fetching installments for finance report:', instErr);
      return NextResponse.json({ error: instErr.message }, { status: 500 });
    }

    const totalRevenue = (installments || []).reduce(
      (sum, item) => sum + Number(item.paid_amount || 0),
      0
    );

    // 2. Fetch expenses incurred within date range
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

    // 3. Time Series generation (daily if diffDays <= 31, weekly otherwise)
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

      (installments || []).forEach((inst) => {
        if (inst.paid_at) {
          const d = inst.paid_at.split('T')[0];
          if (revMap[d] !== undefined) {
            revMap[d] += Number(inst.paid_amount || 0);
          }
        }
      });

      (expenses || []).forEach((exp) => {
        if (exp.incurred_at) {
          const d = exp.incurred_at.split('T')[0];
          if (expMap[d] !== undefined) {
            expMap[d] += Number(exp.amount || 0);
          }
        }
      });

      timeSeries = dates.map((date) => {
        const rev = revMap[date] || 0;
        const exp = expMap[date] || 0;
        return {
          period: date,
          label: date,
          revenue: Math.round(rev * 100) / 100,
          expenses: Math.round(exp * 100) / 100,
          profit: Math.round((rev - exp) * 100) / 100,
        };
      });
    } else {
      // Group by weeks
      const weekRevMap: Record<string, number> = {};
      const weekExpMap: Record<string, number> = {};
      const weekOrder: string[] = [];

      const dates = generateDateList(dateRange.fromStr, dateRange.toStr);
      dates.forEach((d) => {
        const w = getWeekLabel(d);
        if (!weekOrder.includes(w)) {
          weekOrder.push(w);
          weekRevMap[w] = 0;
          weekExpMap[w] = 0;
        }
      });

      (installments || []).forEach((inst) => {
        if (inst.paid_at) {
          const w = getWeekLabel(inst.paid_at.split('T')[0]);
          if (weekRevMap[w] !== undefined) {
            weekRevMap[w] += Number(inst.paid_amount || 0);
          }
        }
      });

      (expenses || []).forEach((exp) => {
        if (exp.incurred_at) {
          const w = getWeekLabel(exp.incurred_at.split('T')[0]);
          if (weekExpMap[w] !== undefined) {
            weekExpMap[w] += Number(exp.amount || 0);
          }
        }
      });

      timeSeries = weekOrder.map((w) => {
        const rev = weekRevMap[w] || 0;
        const exp = weekExpMap[w] || 0;
        return {
          period: w,
          label: `هفته ${w}`,
          revenue: Math.round(rev * 100) / 100,
          expenses: Math.round(exp * 100) / 100,
          profit: Math.round((rev - exp) * 100) / 100,
        };
      });
    }

    // 4. Outstanding invoices (draft, sent, partially_paid)
    const { data: outstandingInvoicesRaw, error: outErr } = await supabaseAdmin
      .from('case_invoices')
      .select(`
        id,
        lead_id,
        currency,
        total_amount,
        status,
        created_at,
        lead:leads!case_invoices_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        installments:invoice_installments (
          id,
          amount,
          paid_amount,
          status,
          due_date
        )
      `)
      .in('status', ['draft', 'sent', 'partially_paid'])
      .order('created_at', { ascending: false });

    if (outErr) {
      console.error('Error fetching outstanding invoices:', outErr);
      return NextResponse.json({ error: outErr.message }, { status: 500 });
    }

    const outstandingInvoices = (outstandingInvoicesRaw || []).map((inv: any) => {
      const totalAmount = Number(inv.total_amount || 0);
      const paidSum = (inv.installments || []).reduce(
        (acc: number, inst: any) => acc + Number(inst.paid_amount || 0),
        0
      );
      const remainingAmount = Math.max(0, totalAmount - paidSum);

      return {
        invoiceId: inv.id,
        leadId: inv.lead_id,
        leadFullName: inv.lead?.full_name || 'نامشخص',
        leadEmail: inv.lead?.email || null,
        leadPhone: inv.lead?.phone || null,
        currency: inv.currency || 'RON',
        totalAmount,
        paidAmount: paidSum,
        remainingAmount: Math.round(remainingAmount * 100) / 100,
        status: inv.status,
        createdAt: inv.created_at,
      };
    });

    const summary = {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      outstandingInvoicesCount: outstandingInvoices.length,
      totalOutstandingAmount: Math.round(
        outstandingInvoices.reduce((s, inv) => s + inv.remainingAmount, 0) * 100
      ) / 100,
      timeSeriesMode: isDaily ? 'daily' : 'weekly',
      from: dateRange.fromStr,
      to: dateRange.toStr,
    };

    if (isCsv) {
      let csv = `گزارش مالی پورتال (${dateRange.fromStr} تا ${dateRange.toStr})\n\n`;

      csv += 'شاخص‌های کلیدی مالی\n';
      csv += toCsvString(
        ['درآمد بازه (RON)', 'هزینه‌های بازه (RON)', 'سود خالص (RON)', 'تعداد فاکتورهای دارای مانده', 'مجموع مانده مطالبات (RON)'],
        [[summary.totalRevenue, summary.totalExpenses, summary.netProfit, summary.outstandingInvoicesCount, summary.totalOutstandingAmount]]
      );
      csv += '\n\n';

      csv += `روند زمانی مالی (${isDaily ? 'روزانه' : 'هفتگی'})\n`;
      csv += toCsvString(
        ['بازه', 'درآمد', 'هزینه', 'سود خالص'],
        timeSeries.map((t) => [t.label, t.revenue, t.expenses, t.profit])
      );
      csv += '\n\n';

      csv += 'فهرست فاکتورهای دارای مانده و پیگیری مطالبات\n';
      csv += toCsvString(
        ['شناسه فاکتور', 'نام متقاضی', 'وضعیت', 'مبلغ کل', 'پرداخت‌شده', 'مانده مطالبات', 'ارز', 'تاریخ ثبت'],
        outstandingInvoices.map((inv) => [
          inv.invoiceId,
          inv.leadFullName,
          inv.status,
          inv.totalAmount,
          inv.paidAmount,
          inv.remainingAmount,
          inv.currency,
          inv.createdAt?.split('T')[0],
        ])
      );

      return createCsvResponse(csv, `finance-report-${dateRange.fromStr}-to-${dateRange.toStr}.csv`);
    }

    return NextResponse.json({
      dateRange: {
        from: dateRange.fromStr,
        to: dateRange.toStr,
        days: dateRange.diffDays,
      },
      summary,
      timeSeries,
      outstandingInvoices,
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/reports/finance:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
