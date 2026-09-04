import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext();
    if (!admin || !hasPermission(admin, 'leads.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view leads.' },
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

    const { data: lead, error } = await supabaseAdmin
      .from('leads')
      .select(`
        *,
        verifier:admin_users!leads_verified_by_fkey (
          id,
          full_name
        ),
        inviter:admin_users!leads_invited_by_fkey (
          id,
          full_name
        )
      `)
      .eq('id', leadId)
      .maybeSingle();

    if (error || !lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    return NextResponse.json({ lead, currentAdmin: admin });
  } catch (error) {
    console.error('Unexpected error fetching lead detail:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
