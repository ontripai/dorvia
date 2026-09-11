import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export interface LedgerEntry {
  id: string;
  type: 'charge' | 'receipt';
  docNumber: string;
  date: string;
  description: string;
  debit: number;   // بدهکار (Charge amount)
  credit: number;  // بستانکار (Receipt amount)
  status: string;
  runningBalance: number;
  paymentMethod?: string | null;
  notes?: string | null;
  allocations?: {
    chargeDocNumber?: string;
    chargeDescription?: string;
    amount: number;
  }[];
}

/**
 * GET /api/admin/leads/[id]/ledger
 * Detailed financial ledger for a specific client file.
 * Returns chronological ledger entries (charges + receipts) with running balance,
 * plus total balance summary in EUR.
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
        { error: 'Forbidden. You do not have permission to view the financial ledger.' },
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

    // 1. Fetch non-cancelled charges
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
        created_at,
        created_by
      `)
      .eq('lead_id', leadId)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: true });

    if (chgErr) {
      console.error('Error fetching charges for ledger:', chgErr);
      return NextResponse.json({ error: chgErr.message }, { status: 500 });
    }

    // 2. Fetch non-cancelled receipts with allocations
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
        created_at,
        created_by,
        allocations:receipt_allocations (
          id,
          amount,
          charge:case_charges!receipt_allocations_charge_id_fkey (
            id,
            doc_number,
            description
          )
        )
      `)
      .eq('lead_id', leadId)
      .neq('status', 'cancelled')
      .order('received_at', { ascending: true });

    if (recErr) {
      console.error('Error fetching receipts for ledger:', recErr);
      return NextResponse.json({ error: recErr.message }, { status: 500 });
    }

    // 3. Merge entries chronologically
    type RawEvent = {
      sortKey: string;
      type: 'charge' | 'receipt';
      data: any;
    };

    const events: RawEvent[] = [];

    (charges || []).forEach((c) => {
      events.push({
        sortKey: c.created_at,
        type: 'charge',
        data: c,
      });
    });

    (receipts || []).forEach((r) => {
      // Use received_at (date) combined with created_at time for exact chronological sorting
      const sortKey = r.received_at ? `${r.received_at}T${r.created_at?.split('T')[1] || '00:00:00'}` : r.created_at;
      events.push({
        sortKey,
        type: 'receipt',
        data: r,
      });
    });

    events.sort((a, b) => (a.sortKey > b.sortKey ? 1 : -1));

    // 4. Compute running balance
    let currentBalance = 0;
    const entries: LedgerEntry[] = [];

    for (const ev of events) {
      if (ev.type === 'charge') {
        const amount = Number(ev.data.total_amount || 0);
        currentBalance = Math.round((currentBalance + amount) * 100) / 100;

        entries.push({
          id: ev.data.id,
          type: 'charge',
          docNumber: ev.data.doc_number || 'INV-000000',
          date: ev.data.created_at?.split('T')[0] || '',
          description: ev.data.description || 'خدمت / بدهکاری',
          debit: amount,
          credit: 0,
          status: ev.data.status,
          runningBalance: currentBalance,
          notes: ev.data.notes,
        });
      } else {
        const amount = Number(ev.data.amount || 0);
        currentBalance = Math.round((currentBalance - amount) * 100) / 100;

        const allocList = (ev.data.allocations || []).map((a: any) => ({
          chargeDocNumber: a.charge?.doc_number || '',
          chargeDescription: a.charge?.description || '',
          amount: Number(a.amount || 0),
        }));

        entries.push({
          id: ev.data.id,
          type: 'receipt',
          docNumber: ev.data.doc_number || 'RCT-000000',
          date: ev.data.received_at || ev.data.created_at?.split('T')[0] || '',
          description: ev.data.notes || 'دریافت وجه از متقاضی',
          debit: 0,
          credit: amount,
          status: ev.data.status,
          runningBalance: currentBalance,
          paymentMethod: ev.data.payment_method,
          notes: ev.data.notes,
          allocations: allocList,
        });
      }
    }

    const totalCharges = (charges || []).reduce((sum, c) => sum + Number(c.total_amount || 0), 0);
    const totalReceipts = (receipts || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const finalBalance = Math.round((totalCharges - totalReceipts) * 100) / 100;

    const openChargesCount = (charges || []).filter(
      (c) => c.status === 'open' || c.status === 'partially_paid'
    ).length;

    return NextResponse.json({
      success: true,
      currency: 'EUR',
      balance: finalBalance,
      summary: {
        totalCharges: Math.round(totalCharges * 100) / 100,
        totalReceipts: Math.round(totalReceipts * 100) / 100,
        balance: finalBalance,
        openChargesCount,
        chargesCount: charges?.length || 0,
        receiptsCount: receipts?.length || 0,
      },
      entries,
      canEdit: hasPermission(admin, 'finance.edit'),
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/leads/[id]/ledger:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
