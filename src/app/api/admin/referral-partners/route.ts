import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

function canViewReferralPartners(admin: any): boolean {
  if (!admin) return false;
  return (
    admin.roleKey === 'owner' ||
    admin.roleKey === 'manager' ||
    hasPermission(admin, 'finance.view') ||
    hasPermission(admin, 'finance.edit')
  );
}

function canEditReferralPartners(admin: any): boolean {
  if (!admin) return false;
  return (
    admin.roleKey === 'owner' ||
    admin.roleKey === 'manager' ||
    hasPermission(admin, 'finance.edit')
  );
}

/**
 * GET /api/admin/referral-partners
 * Lists all referral partners along with their referred lead counts.
 * Restricted to owner, manager, and finance roles.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !canViewReferralPartners(admin)) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view referral partners.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const activeFilter = searchParams.get('is_active');
    const search = searchParams.get('search')?.trim();

    let query = supabaseAdmin
      .from('referral_partners')
      .select(`
        id,
        full_name,
        phone,
        email,
        notes,
        is_active,
        created_at,
        updated_at,
        leads:leads!leads_referred_by_partner_id_fkey (
          id,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (activeFilter === 'true') {
      query = query.eq('is_active', true);
    } else if (activeFilter === 'false') {
      query = query.eq('is_active', false);
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data: partners, error } = await query;

    if (error) {
      console.error('Error fetching referral partners:', error);
      return NextResponse.json({ error: 'Failed to fetch referral partners.' }, { status: 500 });
    }

    // Transform to include leads_count and status counts
    const formatted = (partners || []).map((p: any) => {
      const leadsList = Array.isArray(p.leads) ? p.leads : [];
      return {
        id: p.id,
        full_name: p.full_name,
        phone: p.phone,
        email: p.email,
        notes: p.notes,
        is_active: p.is_active,
        created_at: p.created_at,
        updated_at: p.updated_at,
        leads_count: leadsList.length,
        qualified_leads_count: leadsList.filter((l: any) => l.status === 'qualified').length,
        closed_leads_count: leadsList.filter((l: any) => l.status === 'closed').length,
      };
    });

    return NextResponse.json({
      success: true,
      partners: formatted,
      canEdit: canEditReferralPartners(admin),
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/referral-partners:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/referral-partners
 * Creates a new referral partner.
 * Restricted to owner, manager, and finance edit roles.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !canEditReferralPartners(admin)) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to manage referral partners.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { full_name, phone, email, notes, is_active = true } = body;

    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Partner full name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    const cleanName = full_name.trim().substring(0, 150);
    const cleanPhone = phone && typeof phone === 'string' ? phone.trim().substring(0, 50) : null;
    const cleanEmail = email && typeof email === 'string' ? email.trim().substring(0, 150) : null;
    const cleanNotes = notes && typeof notes === 'string' ? notes.trim().substring(0, 2000) : null;
    const cleanIsActive = Boolean(is_active);

    const { data: newPartner, error: insertErr } = await supabaseAdmin
      .from('referral_partners')
      .insert({
        full_name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        notes: cleanNotes,
        is_active: cleanIsActive,
      })
      .select('*')
      .single();

    if (insertErr || !newPartner) {
      console.error('Error inserting referral partner:', insertErr);
      return NextResponse.json(
        { error: 'Failed to create referral partner.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        partner: {
          ...newPartner,
          leads_count: 0,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/referral-partners:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
