import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/leads/[id]/invoice
 * Fetches the case invoice with joined installments and calculated financial summary (net profit).
 * Requires 'finance.view' permission.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view financial details.' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Fetch invoice with installments and creator info
    const { data: invoice, error: invErr } = await supabaseAdmin
      .from('case_invoices')
      .select(`
        id,
        lead_id,
        currency,
        total_amount,
        status,
        created_by,
        notes,
        created_at,
        updated_at,
        creator:admin_users!case_invoices_created_by_fkey (
          id,
          full_name
        ),
        installments:invoice_installments (
          id,
          invoice_id,
          installment_no,
          amount,
          due_date,
          paid_amount,
          paid_at,
          status,
          payment_method,
          notes,
          created_at,
          updated_at
        )
      `)
      .eq('lead_id', leadId)
      .maybeSingle();

    if (invErr) {
      console.error('Error fetching case invoice:', invErr);
      return NextResponse.json({ error: 'Failed to fetch case invoice.' }, { status: 500 });
    }

    // 2. Fetch all expenses for this lead
    const { data: expenses, error: expErr } = await supabaseAdmin
      .from('case_expenses')
      .select('id, amount, currency')
      .eq('lead_id', leadId);

    if (expErr) {
      console.error('Error fetching case expenses for summary:', expErr);
      return NextResponse.json({ error: 'Failed to fetch case expenses.' }, { status: 500 });
    }

    // Sort installments in ascending order of installment_no
    const installments = (invoice?.installments as any[]) || [];
    installments.sort((a, b) => a.installment_no - b.installment_no);

    // 3. Compute server-side financial summary:
    // - total_paid = sum of paid_amount of all installments
    // - total_expenses = sum of amount of all expenses
    // - net_profit = total_paid - total_expenses (Server-side calculation)
    const totalAmount = invoice ? Number(invoice.total_amount) || 0 : 0;
    const totalPaid = installments.reduce((sum, inst) => sum + (Number(inst.paid_amount) || 0), 0);
    const remainingBalance = Math.max(0, totalAmount - totalPaid);
    const totalExpenses = (expenses || []).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const netProfit = totalPaid - totalExpenses;

    const canEdit = hasPermission(admin, 'finance.edit');

    return NextResponse.json({
      success: true,
      invoice: invoice
        ? {
            ...invoice,
            total_amount: totalAmount,
            installments,
          }
        : null,
      summary: {
        total_amount: totalAmount,
        total_paid: totalPaid,
        remaining_balance: remainingBalance,
        total_expenses: totalExpenses,
        net_profit: netProfit,
        currency: invoice?.currency || 'RON',
      },
      canEdit,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/leads/[id]/invoice:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * POST /api/admin/leads/[id]/invoice
 * Creates a case invoice for the lead.
 * Requires 'finance.edit' permission. Only one invoice is allowed per lead.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to edit invoices.' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { total_amount, currency = 'RON', notes = null } = body;

    // Strict numeric validation: positive number > 0 (negative and zero strictly rejected)
    if (typeof total_amount !== 'number' || isNaN(total_amount) || total_amount <= 0) {
      return NextResponse.json(
        { error: 'Total amount must be a positive number greater than 0.' },
        { status: 400 }
      );
    }

    const cleanCurrency = typeof currency === 'string' && currency.trim() ? currency.trim().toUpperCase() : 'RON';

    // Verify if lead exists
    const { data: leadExists, error: leadCheckErr } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .maybeSingle();

    if (leadCheckErr || !leadExists) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    // Check if an invoice already exists for this lead
    const { data: existingInvoice } = await supabaseAdmin
      .from('case_invoices')
      .select('id')
      .eq('lead_id', leadId)
      .maybeSingle();

    if (existingInvoice) {
      return NextResponse.json(
        { error: 'An invoice already exists for this lead. Only one invoice per case is supported.' },
        { status: 400 }
      );
    }

    // Insert new case invoice
    const { data: newInvoice, error: insertErr } = await supabaseAdmin
      .from('case_invoices')
      .insert({
        lead_id: leadId,
        currency: cleanCurrency,
        total_amount,
        status: 'draft',
        created_by: admin.adminUserId,
        notes: notes ? String(notes).trim() : null,
      })
      .select(`
        id,
        lead_id,
        currency,
        total_amount,
        status,
        created_by,
        notes,
        created_at,
        updated_at,
        creator:admin_users!case_invoices_created_by_fkey (
          id,
          full_name
        )
      `)
      .single();

    if (insertErr || !newInvoice) {
      console.error('Error creating case invoice:', insertErr);
      return NextResponse.json({ error: 'Failed to create case invoice.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      invoice: {
        ...newInvoice,
        installments: [],
      },
      summary: {
        total_amount: Number(newInvoice.total_amount),
        total_paid: 0,
        remaining_balance: Number(newInvoice.total_amount),
        total_expenses: 0,
        net_profit: 0,
        currency: newInvoice.currency,
      },
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/leads/[id]/invoice:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
