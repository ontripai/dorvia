import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/exchange/onboarding/related-parties
 * Lists related parties with optional filtering (?lead_id=...&status=...)
 *
 * POST /api/admin/exchange/onboarding/related-parties
 * Creates a first-degree relative or customer-owned company on behalf of the customer.
 *
 * Rules:
 * - Requires 'exchange.onboarding' permission.
 * - POST accepts lead_id in body (staff creating on behalf of customer).
 * - status defaults to 'pending'.
 * - If immediately approved, verified_by_admin_id comes strictly from admin.adminUserId.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view related parties.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const leadIdParam = searchParams.get('lead_id')?.trim();
    const statusParam = searchParams.get('status')?.trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('exchange_related_parties')
      .select(`
        id,
        lead_id,
        party_type,
        full_name,
        relationship,
        national_id,
        id_document_id,
        country,
        status,
        verified_by_admin_id,
        verified_at,
        created_at,
        updated_at,
        lead:leads!exchange_related_parties_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        id_document:lead_documents!exchange_related_parties_id_document_id_fkey (
          id,
          document_type,
          storage_path
        ),
        verified_by:admin_users!exchange_related_parties_verified_by_admin_id_fkey (
          id,
          full_name
        )
      `, { count: 'exact' });

    if (leadIdParam) {
      query = query.eq('lead_id', leadIdParam);
    }

    if (statusParam && statusParam !== 'all') {
      query = query.eq('status', statusParam);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: parties, error, count } = await query;

    if (error) {
      console.error('[AdminExchangeOnboarding] Error listing related parties:', error);
      return NextResponse.json({ error: 'Failed to fetch related parties.' }, { status: 500 });
    }

    const total = count ?? (parties?.length || 0);

    return NextResponse.json({
      relatedParties: parties || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      admin: {
        ...admin,
        permissions: Array.from(admin.permissions),
      },
    });
  } catch (err: any) {
    console.error('[AdminExchangeOnboarding] Unexpected error in GET /api/admin/exchange/onboarding/related-parties:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to register related parties.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const {
      lead_id,
      party_type,
      full_name,
      relationship,
      national_id,
      id_document_id,
    } = body;

    const cleanLeadId = String(lead_id || '').trim();
    if (!cleanLeadId) {
      return NextResponse.json({ error: 'lead_id is required.' }, { status: 400 });
    }

    const cleanPartyType = String(party_type || '').trim().toLowerCase();
    if (!['person', 'company'].includes(cleanPartyType)) {
      return NextResponse.json({ error: "party_type must be 'person' or 'company'." }, { status: 400 });
    }

    const cleanFullName = String(full_name || '').trim();
    if (!cleanFullName) {
      return NextResponse.json({ error: 'full_name is required.' }, { status: 400 });
    }

    const cleanRelationship = String(relationship || '').trim().toLowerCase();
    const validRelationships = ['father', 'mother', 'spouse', 'child', 'sibling', 'own_company'];
    if (!validRelationships.includes(cleanRelationship)) {
      return NextResponse.json(
        { error: `relationship must be one of: ${validRelationships.join(', ')}.` },
        { status: 400 }
      );
    }

    if (cleanPartyType === 'company' && cleanRelationship !== 'own_company') {
      return NextResponse.json(
        { error: "شرکت باید دارای نسبت 'own_company' باشد." },
        { status: 400 }
      );
    }

    const cleanNationalId = String(national_id || '').trim();
    if (!cleanNationalId) {
      return NextResponse.json({ error: 'national_id is required.' }, { status: 400 });
    }

    const cleanDocId = id_document_id ? String(id_document_id).trim() : null;

    // Verify target lead exists
    const { data: targetLead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('id', cleanLeadId)
      .maybeSingle();

    if (leadErr || !targetLead) {
      return NextResponse.json({ error: 'Target customer lead not found.' }, { status: 404 });
    }

    // Insert new related party with pending status
    const { data: createdParty, error: insertError } = await supabaseAdmin
      .from('exchange_related_parties')
      .insert({
        lead_id: cleanLeadId,
        party_type: cleanPartyType,
        full_name: cleanFullName,
        relationship: cleanRelationship,
        national_id: cleanNationalId,
        id_document_id: cleanDocId,
        country: 'IR',
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[AdminExchangeOnboarding] Error inserting related party:', insertError);
      return NextResponse.json(
        { error: 'ثبت اطلاعات بستگان یا شرکت با خطا مواجه شد. لطفاً ورودی‌ها را بررسی نمایید.' },
        { status: 400 }
      );
    }

    // Append audit event
    await supabaseAdmin
      .from('exchange_events')
      .insert({
        actor: 'staff',
        actor_user_id: admin.adminUserId,
        payload: {
          action: 'exchange_related_party_created',
          party_id: createdParty.id,
          lead_id: cleanLeadId,
          party_type: cleanPartyType,
          full_name: cleanFullName,
          relationship: cleanRelationship,
        },
      });

    return NextResponse.json({
      success: true,
      relatedParty: createdParty,
    }, { status: 201 });
  } catch (err: any) {
    console.error('[AdminExchangeOnboarding] Unexpected error in POST /api/admin/exchange/onboarding/related-parties:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
