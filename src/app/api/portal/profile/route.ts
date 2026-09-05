import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portal/profile
 * Retrieves the full profile of the authenticated portal lead,
 * including read-only status/metadata fields and family members if grouped.
 */
export async function GET(request: Request) {
  try {
    const supabase = createServerComponentClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service unconfigured.' },
        { status: 500 }
      );
    }

    // 1. Fetch current lead
    const { data: lead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (leadErr || !lead) {
      return NextResponse.json(
        { error: 'No active lead profile found.' },
        { status: 403 }
      );
    }

    // 2. If lead has a family group, fetch all other family members in the group
    let familyMembers: any[] = [];
    if (lead.family_group_id) {
      const { data: members, error: memErr } = await supabaseAdmin
        .from('leads')
        .select('id, full_name, relation_to_primary, is_family_primary, date_of_birth, phone, status, created_at')
        .eq('family_group_id', lead.family_group_id)
        .order('is_family_primary', { ascending: false });

      if (!memErr && members) {
        familyMembers = members;
      }
    }

    return NextResponse.json({
      success: true,
      lead,
      familyMembers,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/portal/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portal/profile
 * Updates allowed personal profile fields for the authenticated lead.
 * STRICT WHITELIST: Only personal contact and profile info may be edited.
 * Administrative fields (status, admin_comment, verified_at, invited_at, etc.)
 * are strictly ignored and never modified.
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerComponentClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service unconfigured.' },
        { status: 500 }
      );
    }

    const { data: currentLead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('id, email')
      .eq('user_id', user.id)
      .maybeSingle();

    if (leadErr || !currentLead) {
      return NextResponse.json(
        { error: 'No active lead profile found.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid JSON body.' },
        { status: 400 }
      );
    }

    // STRICT WHITELIST of customer-editable fields
    const allowedUpdates: Record<string, any> = {};

    if (typeof body.phone === 'string') {
      allowedUpdates.phone = body.phone.trim() || null;
    }
    if (typeof body.address_line === 'string') {
      allowedUpdates.address_line = body.address_line.trim() || null;
    }
    if (typeof body.address_city === 'string') {
      allowedUpdates.address_city = body.address_city.trim() || null;
    }
    if (typeof body.address_postal_code === 'string') {
      allowedUpdates.address_postal_code = body.address_postal_code.trim() || null;
    }
    if (typeof body.date_of_birth === 'string') {
      allowedUpdates.date_of_birth = body.date_of_birth.trim() || null;
    }
    if (typeof body.anniversary_date === 'string') {
      allowedUpdates.anniversary_date = body.anniversary_date.trim() || null;
    }
    if (typeof body.national_id_or_passport === 'string') {
      allowedUpdates.national_id_or_passport = body.national_id_or_passport.trim() || null;
    }
    if (typeof body.employment_status === 'string') {
      allowedUpdates.employment_status = body.employment_status.trim() || null;
    }
    if (typeof body.education_level === 'string') {
      allowedUpdates.education_level = body.education_level.trim() || null;
    }

    allowedUpdates.updated_at = new Date().toISOString();

    const { data: updatedLead, error: updateErr } = await supabaseAdmin
      .from('leads')
      .update(allowedUpdates)
      .eq('id', currentLead.id)
      .select('*')
      .single();

    if (updateErr || !updatedLead) {
      console.error('Error updating lead profile:', updateErr);
      return NextResponse.json(
        { error: 'Failed to update profile.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
