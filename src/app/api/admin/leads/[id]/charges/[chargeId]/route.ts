import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/leads/[id]/charges/[chargeId]
 * Cancels a charge (status='cancelled').
 * Strictly rejected if any active receipt allocations are linked to this charge.
 * Financial records are never physically deleted.
 * Requires 'finance.edit' permission.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; chargeId: string } | Promise<{ id: string; chargeId: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to modify financial charges.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const leadId = resolvedParams?.id;
    const chargeId = resolvedParams?.chargeId;
    if (!leadId || !chargeId) {
      return NextResponse.json({ error: 'Lead ID and Charge ID are required.' }, { status: 400 });
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

    // 1. Fetch the target charge
    const { data: charge, error: chgErr } = await supabaseAdmin
      .from('case_charges')
      .select('id, lead_id, doc_number, status, total_amount')
      .eq('id', chargeId)
      .eq('lead_id', leadId)
      .single();

    if (chgErr || !charge) {
      return NextResponse.json({ error: 'Charge not found.' }, { status: 404 });
    }

    if (charge.status === 'cancelled') {
      return NextResponse.json({ success: true, message: 'این بدهکاری قبلاً لغو شده است.', charge });
    }

    // 2. Check for active receipt allocations
    const { data: allocations, error: allocErr } = await supabaseAdmin
      .from('receipt_allocations')
      .select(`
        id,
        amount,
        status,
        receipt:case_receipts!receipt_allocations_receipt_id_fkey (
          id,
          doc_number,
          status
        )
      `)
      .eq('charge_id', chargeId)
      .eq('status', 'active');

    if (allocErr) {
      console.error('Error checking allocations before charge cancellation:', allocErr);
      return NextResponse.json({ error: allocErr.message }, { status: 500 });
    }

    const activeAllocations = (allocations || []).filter((a) => a.status === 'active');

    if (activeAllocations.length > 0) {
      const totalAllocated = activeAllocations.reduce((sum, a) => sum + Number(a.amount || 0), 0);
      return NextResponse.json(
        {
          error: `ابتدا تخصیص‌های این بدهکاری را لغو کنید. این بدهکاری دارای ${totalAllocated} یورو پرداخت تخصیص‌یافته در ${activeAllocations.length} سند دریافتی فعال است.`,
        },
        { status: 400 }
      );
    }

    // 3. Update charge status to cancelled
    const { data: updatedCharge, error: updateErr } = await supabaseAdmin
      .from('case_charges')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', chargeId)
      .select('*')
      .single();

    if (updateErr) {
      console.error('Error cancelling case charge:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'بدهکاری با موفقیت لغو شد.',
      charge: updatedCharge,
    });
  } catch (error: any) {
    console.error('Unexpected error in PATCH /api/admin/leads/[id]/charges/[chargeId]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
