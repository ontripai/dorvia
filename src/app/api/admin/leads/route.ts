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
      .select(`
        *,
        referral_partner:referral_partners!leads_referred_by_partner_id_fkey (
          id,
          full_name
        )
      `)
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

/**
 * POST /api/admin/leads
 * Creates a new lead directly from the admin panel with optional referred_by_partner_id.
 * Requires 'leads.edit' permission.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'leads.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to create leads.' },
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

    const {
      full_name,
      email,
      phone,
      site_goal,
      message,
      referred_by_partner_id,
      source = 'admin_manual',
    } = body;

    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'نام و نام‌خانوادگی متقاضی باید حداقل ۲ حرف باشد.' },
        { status: 400 }
      );
    }

    // If referred_by_partner_id is provided, verify it exists
    let cleanPartnerId: string | null = null;
    if (referred_by_partner_id && typeof referred_by_partner_id === 'string' && referred_by_partner_id.trim()) {
      const { data: partnerCheck } = await supabaseAdmin
        .from('referral_partners')
        .select('id')
        .eq('id', referred_by_partner_id.trim())
        .maybeSingle();

      if (!partnerCheck) {
        return NextResponse.json(
          { error: 'همکار معرف انتخاب‌شده معتبر نیست.' },
          { status: 400 }
        );
      }
      cleanPartnerId = partnerCheck.id;
    }

    const cleanName = full_name.trim().substring(0, 150);
    const cleanEmail = email && typeof email === 'string' ? email.trim().substring(0, 150) : null;
    const cleanPhone = phone && typeof phone === 'string' ? phone.trim().substring(0, 50) : null;
    const cleanGoal = site_goal && typeof site_goal === 'string' ? site_goal.trim() : null;
    const cleanMsg = message && typeof message === 'string' ? message.trim() : null;

    const { data: newLead, error: insertErr } = await supabaseAdmin
      .from('leads')
      .insert({
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        site_goal: cleanGoal,
        message: cleanMsg,
        source: typeof source === 'string' ? source.trim() : 'admin_manual',
        status: 'new',
        referred_by_partner_id: cleanPartnerId,
        consent_terms: true,
      })
      .select(`
        *,
        referral_partner:referral_partners!leads_referred_by_partner_id_fkey (
          id,
          full_name
        )
      `)
      .single();

    if (insertErr || !newLead) {
      console.error('Error inserting lead from admin:', insertErr);
      return NextResponse.json(
        { error: 'Failed to create lead.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        lead: newLead,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/leads:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
