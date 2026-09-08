import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/leads/[id]/invoice/installments
 * Adds a new installment to the case invoice.
 * Requires 'finance.edit' permission.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to add installments.' },
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

    // 1. Fetch existing invoice for this lead
    const { data: invoice, error: invErr } = await supabaseAdmin
      .from('case_invoices')
      .select('id, total_amount, currency')
      .eq('lead_id', leadId)
      .maybeSingle();

    if (invErr || !invoice) {
      return NextResponse.json(
        { error: 'No invoice found for this lead. Please create an invoice first.' },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { amount, due_date, notes = null } = body;

    // Strict positive numeric validation (must be > 0)
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Installment amount must be a positive number greater than 0.' },
        { status: 400 }
      );
    }

    if (!due_date || typeof due_date !== 'string' || !due_date.trim()) {
      return NextResponse.json(
        { error: 'Due date is required.' },
        { status: 400 }
      );
    }

    // Calculate installment_no
    const { data: existingInstallments, error: listErr } = await supabaseAdmin
      .from('invoice_installments')
      .select('installment_no')
      .eq('invoice_id', invoice.id);

    if (listErr) {
      console.error('Error fetching existing installments:', listErr);
      return NextResponse.json({ error: 'Failed to verify existing installments.' }, { status: 500 });
    }

    const currentMax = existingInstallments && existingInstallments.length > 0
      ? Math.max(...existingInstallments.map((i) => i.installment_no))
      : 0;
    const installmentNo = currentMax + 1;

    // Insert installment
    const { data: newInstallment, error: insertErr } = await supabaseAdmin
      .from('invoice_installments')
      .insert({
        invoice_id: invoice.id,
        installment_no: installmentNo,
        amount,
        due_date: due_date.trim(),
        paid_amount: 0,
        paid_at: null,
        status: 'pending',
        payment_method: null,
        notes: notes ? String(notes).trim() : null,
      })
      .select()
      .single();

    if (insertErr || !newInstallment) {
      console.error('Error adding installment:', insertErr);
      return NextResponse.json({ error: 'Failed to create installment.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      installment: newInstallment,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/leads/[id]/invoice/installments:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
