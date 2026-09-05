import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'leads.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view leads.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin leads:', error);
      return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
    }

    return NextResponse.json({
      leads: leads || [],
      admin: {
        ...admin,
        permissions: Array.from(admin.permissions),
      },
    });
  } catch (error) {
    console.error('Unexpected error fetching admin leads:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
