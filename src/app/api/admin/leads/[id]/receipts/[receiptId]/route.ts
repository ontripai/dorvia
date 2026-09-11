import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/leads/[id]/receipts/[receiptId]
 * Cancels a receipt (status='cancelled').
 * Automatically rolls back associated receipt allocations and re-evaluates
 * the status of affected charges (restoring them to 'open' or 'partially_paid').
 * Requires 'finance.edit' permission.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; receiptId: string } | Promise<{ id: string; receiptId: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to modify receipts.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const leadId = resolvedParams?.id;
    const receiptId = resolvedParams?.receiptId;
    if (!leadId || !receiptId) {
      return NextResponse.json({ error: 'Lead ID and Receipt ID are required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body || body.status !== 'cancelled') {
      return NextResponse.json(
        { error: 'Invalid update payload. Only cancellation (status="cancelled") is permitted.' },
        { status: 400 }
      );
    }

    // 1. Fetch receipt
    const { data: receipt, error: recErr } = await supabaseAdmin
      .from('case_receipts')
      .select('id, lead_id, doc_number, amount, status')
      .eq('id', receiptId)
      .eq('lead_id', leadId)
      .single();

    if (recErr || !receipt) {
      return NextResponse.json({ error: 'Receipt not found.' }, { status: 404 });
    }

    if (receipt.status === 'cancelled') {
      return NextResponse.json({ success: true, message: 'این سند دریافتی قبلاً لغو شده است.', receipt });
    }

    // 2. Fetch linked allocations
    const { data: allocations, error: allocErr } = await supabaseAdmin
      .from('receipt_allocations')
      .select('id, charge_id, amount')
      .eq('receipt_id', receiptId);

    if (allocErr) {
      console.error('Error fetching allocations for receipt cancellation:', allocErr);
      return NextResponse.json({ error: allocErr.message }, { status: 500 });
    }

    const affectedChargeIds = Array.from(new Set((allocations || []).map((a) => a.charge_id)));

    // 3. Mark receipt as cancelled
    const { data: updatedReceipt, error: updateErr } = await supabaseAdmin
      .from('case_receipts')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', receiptId)
      .select('*')
      .single();

    if (updateErr) {
      console.error('Error cancelling receipt:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // 4. Soft-cancel allocations for this cancelled receipt (preserves financial audit trail)
    if (allocations && allocations.length > 0) {
      await supabaseAdmin
        .from('receipt_allocations')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancelled_by: admin.adminUserId,
        })
        .eq('receipt_id', receiptId);
    }

    // 5. Recompute status for all affected charges
    const updatedChargesReport: { id: string; docNumber: string; newStatus: string }[] = [];

    if (affectedChargeIds.length > 0) {
      const { data: charges } = await supabaseAdmin
        .from('case_charges')
        .select('id, doc_number, total_amount, status')
        .in('id', affectedChargeIds);

      // Query all remaining active allocations for these charges
      const { data: remainingAllocations } = await supabaseAdmin
        .from('receipt_allocations')
        .select(`
          charge_id,
          amount,
          status,
          receipt:case_receipts!receipt_allocations_receipt_id_fkey (
            status
          )
        `)
        .in('charge_id', affectedChargeIds)
        .eq('status', 'active');

      const remainingMap: Record<string, number> = {};
      (remainingAllocations || []).forEach((ra) => {
        const rec = ra.receipt as any;
        if (rec?.status === 'active') {
          remainingMap[ra.charge_id] = (remainingMap[ra.charge_id] || 0) + Number(ra.amount || 0);
        }
      });

      for (const chg of (charges || [])) {
        if (chg.status === 'cancelled') continue; // Don't uncancel a cancelled charge

        const activeSum = remainingMap[chg.id] || 0;
        let newStatus: 'open' | 'partially_paid' | 'paid' = 'open';

        if (activeSum >= Number(chg.total_amount || 0)) {
          newStatus = 'paid';
        } else if (activeSum > 0) {
          newStatus = 'partially_paid';
        } else {
          newStatus = 'open';
        }

        await supabaseAdmin
          .from('case_charges')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', chg.id);

        updatedChargesReport.push({
          id: chg.id,
          docNumber: chg.doc_number || chg.id,
          newStatus,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'سند دریافتی با موفقیت لغو شد و وضعیت بدهکاری‌های مرتبط به‌روزرسانی گردید.',
      receipt: updatedReceipt,
      updatedCharges: updatedChargesReport,
    });
  } catch (error: any) {
    console.error('Unexpected error in PATCH /api/admin/leads/[id]/receipts/[receiptId]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
