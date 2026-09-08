import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/admin/leads/[id]/expenses/[expenseId]
 * Deletes a recorded case expense (e.g. if entered erroneously).
 * Requires 'finance.edit' permission.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; expenseId: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete expenses.' },
        { status: 403 }
      );
    }

    const { id: leadId, expenseId } = params;
    if (!leadId || !expenseId) {
      return NextResponse.json(
        { error: 'Lead ID and Expense ID are required.' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Verify existence and ownership by leadId
    const { data: expense, error: fetchErr } = await supabaseAdmin
      .from('case_expenses')
      .select('id, lead_id')
      .eq('id', expenseId)
      .eq('lead_id', leadId)
      .maybeSingle();

    if (fetchErr || !expense) {
      return NextResponse.json({ error: 'Expense not found or does not belong to this lead.' }, { status: 404 });
    }

    // 2. Perform deletion
    const { error: delErr } = await supabaseAdmin
      .from('case_expenses')
      .delete()
      .eq('id', expenseId);

    if (delErr) {
      console.error('Error deleting expense:', delErr);
      return NextResponse.json({ error: 'Failed to delete expense.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/leads/[id]/expenses/[expenseId]:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
