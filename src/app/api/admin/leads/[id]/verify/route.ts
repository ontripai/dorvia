import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext();
    if (!admin || !hasPermission(admin, 'leads.verify')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to verify leads.' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // Check if lead exists
    const { data: lead, error: fetchErr } = await supabaseAdmin
      .from('leads')
      .select('id, verified_at')
      .eq('id', leadId)
      .maybeSingle();

    if (fetchErr || !lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    const now = new Date().toISOString();

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('leads')
      .update({
        verified_at: now,
        verified_by: admin.adminUserId,
      })
      .eq('id', leadId)
      .select('id, verified_at, verified_by')
      .single();

    if (updateErr) {
      console.error('Error verifying lead:', updateErr);
      return NextResponse.json({ error: 'Failed to verify lead.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('Unexpected error in verify lead:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
