import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/leads/[id]/invoice/installments/[installmentId]
 * Updates payment details (paid_amount, payment_method, paid_at, notes) for an installment.
 * Automatically updates installment status ('paid' | 'partial' | 'pending' | 'overdue').
 * Synchronizes parent case_invoices status ('draft' <-> 'partially_paid' <-> 'paid') without
 * overwriting manual statuses ('cancelled' or 'sent').
 * Requires 'finance.edit' permission.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; installmentId: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to edit installments.' },
        { status: 403 }
      );
    }

    const { id: leadId, installmentId } = params;
    if (!leadId || !installmentId) {
      return NextResponse.json(
        { error: 'Lead ID and Installment ID are required.' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Fetch current installment with parent invoice verification
    const { data: installment, error: fetchErr } = await supabaseAdmin
      .from('invoice_installments')
      .select(`
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
        invoice:case_invoices!invoice_installments_invoice_id_fkey (
          id,
          lead_id,
          total_amount,
          status
        )
      `)
      .eq('id', installmentId)
      .single();

    if (fetchErr || !installment) {
      return NextResponse.json({ error: 'Installment not found.' }, { status: 404 });
    }

    const parentInvoice = installment.invoice as any;
    if (!parentInvoice || parentInvoice.lead_id !== leadId) {
      return NextResponse.json(
        { error: 'Installment does not belong to this lead.' },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { paid_amount, payment_method, paid_at, notes } = body;

    // Strict non-negative numeric validation (>= 0; negative numbers strictly rejected)
    if (typeof paid_amount !== 'number' || isNaN(paid_amount) || paid_amount < 0) {
      return NextResponse.json(
        { error: 'Paid amount must be a non-negative number (greater than or equal to 0).' },
        { status: 400 }
      );
    }

    const installmentAmount = Number(installment.amount) || 0;

    // 2. Automatic status determination for the installment
    let newStatus: 'paid' | 'partial' | 'pending' | 'overdue' = 'pending';
    if (paid_amount >= installmentAmount) {
      newStatus = 'paid';
    } else if (paid_amount > 0) {
      newStatus = 'partial';
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      if (installment.due_date && installment.due_date < todayStr) {
        newStatus = 'overdue';
      } else {
        newStatus = 'pending';
      }
    }

    // Determine timestamp
    const effectivePaidAt = paid_amount > 0
      ? (paid_at ? new Date(paid_at).toISOString() : (installment.paid_at || new Date().toISOString()))
      : null;

    // 3. Update the installment
    const { data: updatedInstallment, error: updateErr } = await supabaseAdmin
      .from('invoice_installments')
      .update({
        paid_amount,
        paid_at: effectivePaidAt,
        payment_method: payment_method !== undefined ? (payment_method ? String(payment_method).trim() : null) : installment.payment_method,
        status: newStatus,
        notes: notes !== undefined ? (notes ? String(notes).trim() : null) : installment.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', installmentId)
      .select()
      .single();

    if (updateErr || !updatedInstallment) {
      console.error('Error updating installment:', updateErr);
      return NextResponse.json({ error: 'Failed to update installment.' }, { status: 500 });
    }

    // 4. Synchronize parent case_invoices status:
    // User instruction: If manual status is 'cancelled' or 'sent', DO NOT overwrite it.
    // Only transition between 'draft', 'partially_paid', and 'paid'.
    const currentInvoiceStatus = parentInvoice.status;
    const canAutoSyncInvoiceStatus = !['cancelled', 'sent'].includes(currentInvoiceStatus);

    if (canAutoSyncInvoiceStatus) {
      // Calculate total paid across all installments for this invoice
      const { data: allInstallments } = await supabaseAdmin
        .from('invoice_installments')
        .select('id, paid_amount')
        .eq('invoice_id', parentInvoice.id);

      const totalInvoicePaid = (allInstallments || []).reduce(
        (sum, inst) => sum + (Number(inst.paid_amount) || 0),
        0
      );
      const invoiceTotalAmount = Number(parentInvoice.total_amount) || 0;

      let targetInvoiceStatus: 'draft' | 'partially_paid' | 'paid' = 'draft';
      if (totalInvoicePaid >= invoiceTotalAmount && invoiceTotalAmount > 0) {
        targetInvoiceStatus = 'paid';
      } else if (totalInvoicePaid > 0) {
        targetInvoiceStatus = 'partially_paid';
      } else {
        targetInvoiceStatus = 'draft';
      }

      if (targetInvoiceStatus !== currentInvoiceStatus) {
        await supabaseAdmin
          .from('case_invoices')
          .update({
            status: targetInvoiceStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', parentInvoice.id);
      }
    }

    return NextResponse.json({
      success: true,
      installment: updatedInstallment,
    });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/leads/[id]/invoice/installments/[installmentId]:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
