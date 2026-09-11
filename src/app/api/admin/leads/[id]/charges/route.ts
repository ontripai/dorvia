import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

async function generateChargeDocNumber(): Promise<string> {
  if (!supabaseAdmin) return `INV-${Date.now().toString().slice(-6)}`;
  try {
    const { data } = await supabaseAdmin
      .from('case_charges')
      .select('doc_number')
      .not('doc_number', 'is', null)
      .order('created_at', { ascending: false })
      .limit(100);

    let maxNum = 0;
    if (data) {
      for (const row of data) {
        const match = row.doc_number?.match(/^INV-(\d+)$/);
        if (match) {
          const n = parseInt(match[1], 10);
          if (n > maxNum) maxNum = n;
        }
      }
    }
    return `INV-${String(maxNum + 1).padStart(6, '0')}`;
  } catch {
    return `INV-${Date.now().toString().slice(-6)}`;
  }
}

/**
 * GET /api/admin/leads/[id]/charges
 * Lists all charges recorded for this lead, with active allocation calculations.
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
        { error: 'Forbidden. You do not have permission to view financial charges.' },
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

    // 1. Fetch charges with creator info
    const { data: charges, error: chgErr } = await supabaseAdmin
      .from('case_charges')
      .select(`
        id,
        lead_id,
        doc_number,
        description,
        total_amount,
        currency,
        status,
        notes,
        created_by,
        created_at,
        updated_at,
        creator:admin_users!case_charges_created_by_fkey (
          id,
          full_name
        )
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });

    if (chgErr) {
      console.error('Error fetching case charges:', chgErr);
      return NextResponse.json({ error: chgErr.message }, { status: 500 });
    }

    // 2. Fetch allocations for these charges to compute paid/remaining balances
    const chargeIds = (charges || []).map((c) => c.id);
    let allocationsMap: Record<string, number> = {};

    if (chargeIds.length > 0) {
      const { data: allocations, error: allocErr } = await supabaseAdmin
        .from('receipt_allocations')
        .select(`
          id,
          charge_id,
          amount,
          receipt:case_receipts!receipt_allocations_receipt_id_fkey (
            id,
            status
          )
        `)
        .in('charge_id', chargeIds);

      if (!allocErr && allocations) {
        for (const alloc of allocations) {
          const rec = alloc.receipt as any;
          // Only count allocations for active (non-cancelled) receipts
          if (rec?.status === 'active') {
            const current = allocationsMap[alloc.charge_id] || 0;
            allocationsMap[alloc.charge_id] = current + Number(alloc.amount || 0);
          }
        }
      }
    }

    const enrichedCharges = (charges || []).map((charge) => {
      const totalAmount = Number(charge.total_amount || 0);
      const allocatedAmount = Math.round((allocationsMap[charge.id] || 0) * 100) / 100;
      const remainingAmount = Math.max(0, Math.round((totalAmount - allocatedAmount) * 100) / 100);

      return {
        ...charge,
        allocated_amount: allocatedAmount,
        remaining_amount: remainingAmount,
      };
    });

    return NextResponse.json({
      success: true,
      charges: enrichedCharges,
      canEdit: hasPermission(admin, 'finance.edit'),
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/leads/[id]/charges:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/leads/[id]/charges
 * Creates a new charge / fee for the lead. Multiple charges per lead are supported.
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
        { error: 'Forbidden. You do not have permission to edit financial charges.' },
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

    const description = typeof body.description === 'string' ? body.description.trim() : '';
    if (!description) {
      return NextResponse.json({ error: 'شرح خدمت الزامی است.' }, { status: 400 });
    }

    const totalAmount = parseFloat(body.amount ?? body.total_amount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ error: 'مبلغ بدهکاری باید عددی مثبت و بزرگتر از صفر باشد.' }, { status: 400 });
    }

    const currency = 'EUR'; // Standardized strictly to EUR
    const notes = typeof body.notes === 'string' ? body.notes.trim() || null : null;
    const docNumber = await generateChargeDocNumber();

    const { data: newCharge, error: insertErr } = await supabaseAdmin
      .from('case_charges')
      .insert({
        lead_id: leadId,
        doc_number: docNumber,
        description,
        total_amount: Math.round(totalAmount * 100) / 100,
        currency,
        status: 'open',
        notes,
        created_by: admin.adminUserId,
      })
      .select(`
        id,
        lead_id,
        doc_number,
        description,
        total_amount,
        currency,
        status,
        notes,
        created_by,
        created_at,
        updated_at
      `)
      .single();

    if (insertErr) {
      console.error('Error creating case charge:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      charge: {
        ...newCharge,
        allocated_amount: 0,
        remaining_amount: newCharge.total_amount,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/leads/[id]/charges:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
