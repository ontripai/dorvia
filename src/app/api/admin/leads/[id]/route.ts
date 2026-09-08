import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
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
        ),
        referral_partner:referral_partners!leads_referred_by_partner_id_fkey (
          id,
          full_name,
          phone,
          email
        )
      `)
      .eq('id', leadId)
      .maybeSingle();

    if (error || !lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    // Fetch family members if this lead is part of a family group
    let familyMembers: any[] = [];
    if (lead.family_group_id) {
      const { data: members, error: famErr } = await supabaseAdmin
        .from('leads')
        .select('id, full_name, relation_to_primary, is_family_primary, status, date_of_birth, phone, created_at')
        .eq('family_group_id', lead.family_group_id)
        .order('is_family_primary', { ascending: false });

      if (!famErr && members) {
        familyMembers = members;
      }
    }

    return NextResponse.json({ lead, currentAdmin: admin, familyMembers });
  } catch (error) {
    console.error('Unexpected error fetching lead detail:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/leads/[id]
 * Updates lead record fields (such as referred_by_partner_id, status, dates, contact info).
 * Requires 'leads.edit' permission.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'leads.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to edit leads.' },
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

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.full_name !== undefined) {
      if (typeof body.full_name !== 'string' || body.full_name.trim().length < 2) {
        return NextResponse.json({ error: 'Full name must be at least 2 characters.' }, { status: 400 });
      }
      updates.full_name = body.full_name.trim().substring(0, 150);
    }

    if (body.email !== undefined) {
      updates.email = body.email && typeof body.email === 'string' ? body.email.trim().substring(0, 150) : null;
    }

    if (body.phone !== undefined) {
      updates.phone = body.phone && typeof body.phone === 'string' ? body.phone.trim().substring(0, 50) : null;
    }

    if (body.status !== undefined) {
      const validStatuses = ['new', 'contacted', 'qualified', 'closed', 'archived'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid lead status.' }, { status: 400 });
      }
      updates.status = body.status;
    }

    if (body.date_of_birth !== undefined) {
      updates.date_of_birth = body.date_of_birth && typeof body.date_of_birth === 'string' ? body.date_of_birth.trim() : null;
    }

    if (body.anniversary_date !== undefined) {
      updates.anniversary_date = body.anniversary_date && typeof body.anniversary_date === 'string' ? body.anniversary_date.trim() : null;
    }

    if (body.referred_by_partner_id !== undefined) {
      if (body.referred_by_partner_id === null || body.referred_by_partner_id === '') {
        updates.referred_by_partner_id = null;
      } else {
        const cleanPartnerId = String(body.referred_by_partner_id).trim();
        const { data: partnerCheck } = await supabaseAdmin
          .from('referral_partners')
          .select('id')
          .eq('id', cleanPartnerId)
          .maybeSingle();

        if (!partnerCheck) {
          return NextResponse.json({ error: 'Referral partner not found.' }, { status: 400 });
        }
        updates.referred_by_partner_id = partnerCheck.id;
      }
    }

    if (body.message !== undefined) {
      updates.message = body.message && typeof body.message === 'string' ? body.message.trim() : null;
    }

    const { data: updatedLead, error: updateErr } = await supabaseAdmin
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .select(`
        *,
        verifier:admin_users!leads_verified_by_fkey (
          id,
          full_name
        ),
        inviter:admin_users!leads_invited_by_fkey (
          id,
          full_name
        ),
        referral_partner:referral_partners!leads_referred_by_partner_id_fkey (
          id,
          full_name,
          phone,
          email
        )
      `)
      .maybeSingle();

    if (updateErr || !updatedLead) {
      console.error('Error updating lead:', updateErr);
      return NextResponse.json({ error: 'Failed to update lead.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error: any) {
    console.error('Unexpected error in PATCH /api/admin/leads/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
