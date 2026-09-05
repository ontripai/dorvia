import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

const VALID_RELATIONS = ['spouse', 'child', 'parent', 'sibling', 'other'] as const;

/**
 * GET /api/portal/family
 * Lists all family members sharing the same family_group_id as the authenticated lead.
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

    const { data: lead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('id, family_group_id, is_family_primary')
      .eq('user_id', user.id)
      .maybeSingle();

    if (leadErr || !lead) {
      return NextResponse.json(
        { error: 'No active lead profile found.' },
        { status: 403 }
      );
    }

    if (!lead.family_group_id) {
      return NextResponse.json({
        success: true,
        familyGroupId: null,
        isPrimary: false,
        familyMembers: [],
      });
    }

    const { data: members, error: membersErr } = await supabaseAdmin
      .from('leads')
      .select('id, full_name, relation_to_primary, is_family_primary, date_of_birth, phone, national_id_or_passport, status, created_at')
      .eq('family_group_id', lead.family_group_id)
      .order('is_family_primary', { ascending: false });

    if (membersErr) {
      console.error('Error querying family members:', membersErr);
      return NextResponse.json(
        { error: 'Failed to fetch family members.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      familyGroupId: lead.family_group_id,
      isPrimary: lead.is_family_primary,
      familyMembers: members || [],
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/portal/family:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portal/family
 * Adds a new family member to the authenticated lead's family group.
 * If the current lead does not have a family_group_id yet, creates one and marks current lead as primary.
 * Creates a NEW row in public.leads with status='new' and user_id=null (does not auto-create a portal auth account).
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
      .select('id, family_group_id, is_family_primary')
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
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : '';
    const relation = body.relation_to_primary;
    const dateOfBirth = typeof body.date_of_birth === 'string' ? body.date_of_birth.trim() : null;
    const phone = typeof body.phone === 'string' ? body.phone.trim() : null;
    const nationalId = typeof body.national_id_or_passport === 'string' ? body.national_id_or_passport.trim() : null;

    if (!fullName) {
      return NextResponse.json(
        { error: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (!VALID_RELATIONS.includes(relation)) {
      return NextResponse.json(
        { error: `Relation must be one of: ${VALID_RELATIONS.join(', ')}` },
        { status: 400 }
      );
    }

    let familyGroupId = currentLead.family_group_id;

    // 1. If lead is not yet in a family group, generate UUID and mark lead as primary
    if (!familyGroupId) {
      familyGroupId = crypto.randomUUID();
      const { error: setPrimaryErr } = await supabaseAdmin
        .from('leads')
        .update({
          family_group_id: familyGroupId,
          is_family_primary: true,
          relation_to_primary: 'self',
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentLead.id);

      if (setPrimaryErr) {
        console.error('Error initializing family group on primary lead:', setPrimaryErr);
        return NextResponse.json(
          { error: 'Failed to initialize family group.' },
          { status: 500 }
        );
      }
    }

    // 2. Insert new row in public.leads for the family member
    const { data: newMember, error: insertErr } = await supabaseAdmin
      .from('leads')
      .insert({
        full_name: fullName,
        family_group_id: familyGroupId,
        relation_to_primary: relation,
        is_family_primary: false,
        date_of_birth: dateOfBirth || null,
        phone: phone || null,
        national_id_or_passport: nationalId || null,
        source: 'website',
        status: 'new',
        user_id: null,
        consent_terms: true,
        marketing_consent: false,
      })
      .select('id, full_name, relation_to_primary, is_family_primary, date_of_birth, phone, national_id_or_passport, status, created_at')
      .single();

    if (insertErr || !newMember) {
      console.error('Error inserting family member lead:', insertErr);
      return NextResponse.json(
        { error: 'Failed to add family member.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      member: newMember,
      familyGroupId,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/family:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
