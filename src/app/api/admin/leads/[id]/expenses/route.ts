import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

const VALID_EXPENSE_TYPES = [
  'notary_fee',
  'translation_fee',
  'lawyer_fee',
  'government_fee',
  'referral_commission',
  'other',
] as const;

type ExpenseType = (typeof VALID_EXPENSE_TYPES)[number];

/**
 * GET /api/admin/leads/[id]/expenses
 * Lists all expenses recorded for this lead, ordered by incurred_at descending.
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
        { error: 'Forbidden. You do not have permission to view expenses.' },
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

    // 1. Fetch expenses with joined stage and creator info
    const { data: expenses, error: expErr } = await supabaseAdmin
      .from('case_expenses')
      .select(`
        id,
        lead_id,
        case_stage_id,
        expense_type,
        amount,
        currency,
        paid_to,
        incurred_at,
        notes,
        created_by,
        created_at,
        updated_at,
        stage:case_stages!case_expenses_case_stage_id_fkey (
          id,
          label_fa,
          stage_key
        ),
        creator:admin_users!case_expenses_created_by_fkey (
          id,
          full_name
        )
      `)
      .eq('lead_id', leadId)
      .order('incurred_at', { ascending: false });

    if (expErr) {
      console.error('Error fetching expenses:', expErr);
      return NextResponse.json({ error: 'Failed to fetch expenses.' }, { status: 500 });
    }

    // 2. Fetch case stages for dropdown reference in UI
    const { data: stages } = await supabaseAdmin
      .from('case_stages')
      .select('id, label_fa, stage_key')
      .eq('lead_id', leadId)
      .order('due_date', { ascending: true });

    const totalExpenses = (expenses || []).reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    const canEdit = hasPermission(admin, 'finance.edit');

    return NextResponse.json({
      success: true,
      expenses: expenses || [],
      totalExpenses,
      stages: stages || [],
      canEdit,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/leads/[id]/expenses:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * POST /api/admin/leads/[id]/expenses
 * Creates a new expense for the lead.
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
        { error: 'Forbidden. You do not have permission to add expenses.' },
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

    const {
      expense_type,
      amount,
      currency = 'RON',
      paid_to,
      incurred_at,
      case_stage_id = null,
      notes = null,
    } = body;

    // Strict validation
    if (!VALID_EXPENSE_TYPES.includes(expense_type as ExpenseType)) {
      return NextResponse.json(
        { error: `Invalid expense type. Must be one of: ${VALID_EXPENSE_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Expense amount must be a positive number greater than 0.' },
        { status: 400 }
      );
    }

    if (!paid_to || typeof paid_to !== 'string' || !paid_to.trim()) {
      return NextResponse.json(
        { error: 'Recipient (paid_to) is required.' },
        { status: 400 }
      );
    }

    const cleanCurrency = typeof currency === 'string' && currency.trim() ? currency.trim().toUpperCase() : 'RON';
    const effectiveIncurredAt = incurred_at && typeof incurred_at === 'string' && incurred_at.trim()
      ? incurred_at.trim()
      : new Date().toISOString().split('T')[0];

    // Optional: Validate that case_stage_id belongs to this lead
    if (case_stage_id) {
      const { data: stageRecord } = await supabaseAdmin
        .from('case_stages')
        .select('id, lead_id')
        .eq('id', case_stage_id)
        .maybeSingle();

      if (!stageRecord || stageRecord.lead_id !== leadId) {
        return NextResponse.json(
          { error: 'Selected case stage does not belong to this lead.' },
          { status: 400 }
        );
      }
    }

    // Insert into case_expenses
    const { data: newExpense, error: insertErr } = await supabaseAdmin
      .from('case_expenses')
      .insert({
        lead_id: leadId,
        case_stage_id: case_stage_id || null,
        expense_type: expense_type as ExpenseType,
        amount,
        currency: cleanCurrency,
        paid_to: paid_to.trim(),
        incurred_at: effectiveIncurredAt,
        notes: notes ? String(notes).trim() : null,
        created_by: admin.adminUserId,
      })
      .select(`
        id,
        lead_id,
        case_stage_id,
        expense_type,
        amount,
        currency,
        paid_to,
        incurred_at,
        notes,
        created_by,
        created_at,
        updated_at,
        stage:case_stages!case_expenses_case_stage_id_fkey (
          id,
          label_fa,
          stage_key
        ),
        creator:admin_users!case_expenses_created_by_fkey (
          id,
          full_name
        )
      `)
      .single();

    if (insertErr || !newExpense) {
      console.error('Error creating expense:', insertErr);
      return NextResponse.json({ error: 'Failed to record expense.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      expense: newExpense,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/leads/[id]/expenses:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
