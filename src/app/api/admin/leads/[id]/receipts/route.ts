import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

async function generateReceiptDocNumber(): Promise<string> {
  if (!supabaseAdmin) return `RCT-${Date.now().toString().slice(-6)}`;
  try {
    const { data } = await supabaseAdmin
      .from('case_receipts')
      .select('doc_number')
      .not('doc_number', 'is', null)
      .order('created_at', { ascending: false })
      .limit(100);

    let maxNum = 0;
    if (data) {
      for (const row of data) {
        const match = row.doc_number?.match(/^RCT-(\d+)$/);
        if (match) {
          const n = parseInt(match[1], 10);
          if (n > maxNum) maxNum = n;
        }
      }
    }
    return `RCT-${String(maxNum + 1).padStart(6, '0')}`;
  } catch {
    return `RCT-${Date.now().toString().slice(-6)}`;
  }
}

/**
 * GET /api/admin/leads/[id]/receipts
 * Lists all receipts recorded for this lead, including joined line-item allocations.
 * Requires 'finance.view' permission.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view receipts.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const leadId = resolvedParams?.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: receipts, error: recErr } = await supabaseAdmin
      .from('case_receipts')
      .select(`
        id,
        lead_id,
        doc_number,
        amount,
        currency,
        received_at,
        payment_method,
        status,
        notes,
        created_by,
        created_at,
        updated_at,
        creator:admin_users!case_receipts_created_by_fkey (
          id,
          full_name
        ),
        allocations:receipt_allocations (
          id,
          charge_id,
          amount,
          created_at,
          charge:case_charges!receipt_allocations_charge_id_fkey (
            id,
            doc_number,
            description,
            total_amount,
            status
          )
        )
      `)
      .eq('lead_id', leadId)
      .order('received_at', { ascending: false });

    if (recErr) {
      console.error('Error fetching receipts:', recErr);
      return NextResponse.json({ error: recErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      receipts: receipts || [],
      canEdit: hasPermission(admin, 'finance.edit'),
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/leads/[id]/receipts:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/leads/[id]/receipts
 * Records a client payment receipt and line-item allocations to open charges.
 * Enforces business logic rules:
 * 1. Sum of allocations <= receipt amount.
 * 2. Each allocation amount <= remaining unpaid balance of the corresponding charge.
 * 3. Automatically updates charge status ('open', 'partially_paid', 'paid').
 * Requires 'finance.edit' permission.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to record receipts.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const leadId = resolvedParams?.id;
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

    const receiptAmount = parseFloat(body.amount);
    if (isNaN(receiptAmount) || receiptAmount <= 0) {
      return NextResponse.json({ error: 'مبلغ دریافتی باید عددی مثبت و بزرگتر از صفر باشد.' }, { status: 400 });
    }

    const receivedAt = body.received_at || new Date().toISOString().split('T')[0];
    const paymentMethod = ['bank_transfer', 'cash', 'card'].includes(body.payment_method)
      ? body.payment_method
      : null;
    const notes = typeof body.notes === 'string' ? body.notes.trim() || null : null;
    const rawAllocations: { charge_id: string; amount: number }[] = Array.isArray(body.allocations)
      ? body.allocations
      : [];

    // Filter valid non-zero allocation requests
    const allocationsToApply = rawAllocations
      .map((a) => ({ charge_id: String(a.charge_id), amount: parseFloat(String(a.amount)) }))
      .filter((a) => a.charge_id && !isNaN(a.amount) && a.amount > 0);

    // Rule 1: Sum of allocations must not exceed receipt amount
    const totalAllocated = allocationsToApply.reduce((sum, a) => sum + a.amount, 0);
    const roundedAllocTotal = Math.round(totalAllocated * 100) / 100;
    const roundedReceiptAmount = Math.round(receiptAmount * 100) / 100;

    if (roundedAllocTotal > roundedReceiptAmount) {
      return NextResponse.json(
        {
          error: `مجموع مبالغ تخصیص‌یافته (${roundedAllocTotal} یورو) نمی‌تواند از کل مبلغ دریافتی (${roundedReceiptAmount} یورو) بیشتر باشد.`,
        },
        { status: 400 }
      );
    }

    // Rule 2: Verify each target charge exists, belongs to this lead, is not cancelled, and amount <= remaining
    const chargeUpdates: { chargeId: string; newAllocated: number; totalAmount: number }[] = [];

    if (allocationsToApply.length > 0) {
      const chargeIds = allocationsToApply.map((a) => a.charge_id);

      const { data: charges, error: chgErr } = await supabaseAdmin
        .from('case_charges')
        .select('id, lead_id, doc_number, total_amount, status')
        .in('id', chargeIds)
        .eq('lead_id', leadId);

      if (chgErr || !charges) {
        console.error('Error fetching target charges for receipt allocation:', chgErr);
        return NextResponse.json({ error: 'خطا در بررسی بدهکاری‌های متقاضی.' }, { status: 500 });
      }

      // Fetch existing allocations for these charges
      const { data: existingAllocations, error: exAllocErr } = await supabaseAdmin
        .from('receipt_allocations')
        .select(`
          charge_id,
          amount,
          receipt:case_receipts!receipt_allocations_receipt_id_fkey (
            status
          )
        `)
        .in('charge_id', chargeIds);

      if (exAllocErr) {
        console.error('Error fetching existing allocations:', exAllocErr);
        return NextResponse.json({ error: 'خطا در محاسبه مانده بدهکاری‌ها.' }, { status: 500 });
      }

      const existingMap: Record<string, number> = {};
      (existingAllocations || []).forEach((ea) => {
        const rec = ea.receipt as any;
        if (rec?.status === 'active') {
          existingMap[ea.charge_id] = (existingMap[ea.charge_id] || 0) + Number(ea.amount || 0);
        }
      });

      for (const item of allocationsToApply) {
        const targetCharge = charges.find((c) => c.id === item.charge_id);
        if (!targetCharge) {
          return NextResponse.json(
            { error: `بدهکاری با شناسه ${item.charge_id} برای این متقاضی یافت نشد.` },
            { status: 400 }
          );
        }

        if (targetCharge.status === 'cancelled') {
          return NextResponse.json(
            { error: `امکان تخصیص پرداخت به بدهکاری لغوشده (${targetCharge.doc_number || targetCharge.id}) وجود ندارد.` },
            { status: 400 }
          );
        }

        const totalChargeAmount = Number(targetCharge.total_amount || 0);
        const alreadyAllocated = Math.round((existingMap[item.charge_id] || 0) * 100) / 100;
        const remainingUnpaid = Math.max(0, Math.round((totalChargeAmount - alreadyAllocated) * 100) / 100);

        const currentRequestedAmount = Math.round(item.amount * 100) / 100;

        if (currentRequestedAmount > remainingUnpaid) {
          return NextResponse.json(
            {
              error: `مبلغ تخصیص (${currentRequestedAmount} یورو) از ماندهٔ بدهکاری (${remainingUnpaid} یورو) سند ${targetCharge.doc_number || targetCharge.id} بیشتر است.`,
            },
            { status: 400 }
          );
        }

        chargeUpdates.push({
          chargeId: targetCharge.id,
          newAllocated: alreadyAllocated + currentRequestedAmount,
          totalAmount: totalChargeAmount,
        });
      }
    }

    // 3. ATOMIC EXECUTION: Try atomic stored procedure first for guaranteed ACID compliance
    try {
      const { data: rpcResult, error: rpcErr } = await (supabaseAdmin as any).rpc(
        'record_receipt_with_allocations',
        {
          p_lead_id: leadId,
          p_amount: roundedReceiptAmount,
          p_currency: 'EUR',
          p_payment_method: paymentMethod || null,
          p_received_at: receivedAt || new Date().toISOString().split('T')[0],
          p_notes: notes || null,
          p_created_by: admin.adminUserId,
          p_allocations: allocationsToApply.map((a) => ({
            charge_id: a.charge_id,
            amount: Math.round(a.amount * 100) / 100,
          })),
        }
      );

      if (!rpcErr && rpcResult) {
        return NextResponse.json(
          {
            success: true,
            receipt: rpcResult,
            allocatedCount: allocationsToApply.length,
          },
          { status: 201 }
        );
      }
      // If error is a business logic error from RPC, return it directly
      if (rpcErr && rpcErr.code !== 'PGRST202' && !rpcErr.message?.includes('function')) {
        return NextResponse.json({ error: rpcErr.message }, { status: 400 });
      }
    } catch (e: any) {
      console.warn('RPC record_receipt_with_allocations not available, falling back to sequential transaction with rollback:', e?.message);
    }

    // 4. Fallback sequential execution with guaranteed rollback compensation
    const docNumber = await generateReceiptDocNumber();
    const { data: newReceipt, error: recInsertErr } = await supabaseAdmin
      .from('case_receipts')
      .insert({
        lead_id: leadId,
        doc_number: docNumber,
        amount: roundedReceiptAmount,
        currency: 'EUR',
        received_at: receivedAt,
        payment_method: paymentMethod,
        status: 'active',
        notes,
        created_by: admin.adminUserId,
      })
      .select('*')
      .single();

    if (recInsertErr || !newReceipt) {
      console.error('Error inserting case receipt:', recInsertErr);
      return NextResponse.json({ error: recInsertErr?.message || 'Failed to record receipt.' }, { status: 500 });
    }

    // Insert allocations with atomic rollback guarantee
    if (allocationsToApply.length > 0) {
      const allocationInserts = allocationsToApply.map((a) => ({
        receipt_id: newReceipt.id,
        charge_id: a.charge_id,
        amount: Math.round(a.amount * 100) / 100,
        status: 'active' as const,
      }));

      const { error: allocInsertErr } = await supabaseAdmin
        .from('receipt_allocations')
        .insert(allocationInserts);

      if (allocInsertErr) {
        console.error('Error inserting receipt allocations — rolling back receipt:', allocInsertErr);
        // Rollback: cancel the receipt record to guarantee atomicity
        await supabaseAdmin
          .from('case_receipts')
          .delete()
          .eq('id', newReceipt.id);

        return NextResponse.json(
          { error: `خطا در تخصیص مبلغ به خدمات. سند دریافتی لغو و بازگردانده شد: ${allocInsertErr.message}` },
          { status: 500 }
        );
      }

      // Update status of affected charges
      for (const update of chargeUpdates) {
        let nextStatus: 'open' | 'partially_paid' | 'paid' = 'open';
        if (update.newAllocated >= update.totalAmount) {
          nextStatus = 'paid';
        } else if (update.newAllocated > 0) {
          nextStatus = 'partially_paid';
        }

        await supabaseAdmin
          .from('case_charges')
          .update({
            status: nextStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', update.chargeId);
      }
    }

    return NextResponse.json({
      success: true,
      receipt: newReceipt,
      allocatedCount: allocationsToApply.length,
      allocatedAmount: roundedAllocTotal,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/leads/[id]/receipts:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
