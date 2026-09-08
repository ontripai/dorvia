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
 * GET /api/admin/referral-partners/[id]
 * Returns single referral partner details along with all referred leads.
 * Reporting only (no commission amount calculation, as specified in brief).
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !canViewReferralPartners(admin)) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view referral partners.' },
        { status: 403 }
      );
    }

    const partnerId = params.id;
    if (!partnerId) {
      return NextResponse.json({ error: 'Partner ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: partner, error: partnerErr } = await supabaseAdmin
      .from('referral_partners')
      .select('*')
      .eq('id', partnerId)
      .maybeSingle();

    if (partnerErr || !partner) {
      return NextResponse.json({ error: 'Referral partner not found.' }, { status: 404 });
    }

    // Fetch all linked leads for reporting
    const { data: linkedLeads, error: leadsErr } = await supabaseAdmin
      .from('leads')
      .select('id, full_name, email, phone, status, site_goal, created_at')
      .eq('referred_by_partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (leadsErr) {
      console.error('Error fetching referred leads:', leadsErr);
      return NextResponse.json({ error: 'Failed to fetch linked cases.' }, { status: 500 });
    }

    const leads = linkedLeads || [];

    return NextResponse.json({
      success: true,
      partner: {
        ...partner,
        leads_count: leads.length,
        leads,
      },
      canEdit: canEditReferralPartners(admin),
    });
  } catch (error: any) {
    console.error('Unexpected error in GET /api/admin/referral-partners/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/referral-partners/[id]
 * Updates referral partner information or active status.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !canEditReferralPartners(admin)) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to edit referral partners.' },
        { status: 403 }
      );
    }

    const partnerId = params.id;
    if (!partnerId) {
      return NextResponse.json({ error: 'Partner ID is required.' }, { status: 400 });
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
        return NextResponse.json(
          { error: 'Full name must be at least 2 characters.' },
          { status: 400 }
        );
      }
      updates.full_name = body.full_name.trim().substring(0, 150);
    }

    if (body.phone !== undefined) {
      updates.phone = body.phone && typeof body.phone === 'string' ? body.phone.trim().substring(0, 50) : null;
    }

    if (body.email !== undefined) {
      updates.email = body.email && typeof body.email === 'string' ? body.email.trim().substring(0, 150) : null;
    }

    if (body.notes !== undefined) {
      updates.notes = body.notes && typeof body.notes === 'string' ? body.notes.trim().substring(0, 2000) : null;
    }

    if (body.is_active !== undefined) {
      updates.is_active = Boolean(body.is_active);
    }

    const { data: updatedPartner, error: updateErr } = await supabaseAdmin
      .from('referral_partners')
      .update(updates)
      .eq('id', partnerId)
      .select('*')
      .maybeSingle();

    if (updateErr || !updatedPartner) {
      console.error('Error updating referral partner:', updateErr);
      return NextResponse.json({ error: 'Failed to update referral partner.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      partner: updatedPartner,
    });
  } catch (error: any) {
    console.error('Unexpected error in PATCH /api/admin/referral-partners/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/referral-partners/[id]
 * Deletes a referral partner only if no client leads are linked.
 * If linked leads exist, rejects with 400 to protect data integrity and advises deactivation.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !canEditReferralPartners(admin)) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to delete referral partners.' },
        { status: 403 }
      );
    }

    const partnerId = params.id;
    if (!partnerId) {
      return NextResponse.json({ error: 'Partner ID is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // Check if any leads are linked to this partner
    const { count, error: countErr } = await supabaseAdmin
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('referred_by_partner_id', partnerId);

    if (countErr) {
      console.error('Error checking linked leads before partner deletion:', countErr);
      return NextResponse.json({ error: 'Failed to check linked leads.' }, { status: 500 });
    }

    if (count && count > 0) {
      return NextResponse.json(
        {
          error: `امکان حذف همکار معرف وجود ندارد زیرا ${count} پرونده به ایشان متصل است. لطفاً به‌جای حذف، وضعیت ایشان را غیرفعال کنید.`,
          linkedLeadsCount: count,
        },
        { status: 400 }
      );
    }

    const { error: deleteErr } = await supabaseAdmin
      .from('referral_partners')
      .delete()
      .eq('id', partnerId);

    if (deleteErr) {
      console.error('Error deleting referral partner:', deleteErr);
      return NextResponse.json({ error: 'Failed to delete referral partner.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'همکار معرف با موفقیت حذف شد.',
    });
  } catch (error: any) {
    console.error('Unexpected error in DELETE /api/admin/referral-partners/[id]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
