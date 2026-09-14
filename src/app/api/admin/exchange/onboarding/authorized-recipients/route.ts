import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/exchange/onboarding/authorized-recipients
 * Lists authorized recipients with optional filters (?lead_id=...&recipient_lead_id=...&status=...)
 *
 * POST /api/admin/exchange/onboarding/authorized-recipients
 * Creates an authorized cash/IBAN recipient for a customer in Romania.
 *
 * Rules:
 * - Requires 'exchange.onboarding' permission.
 * - POST accepts lead_id and recipient_lead_id in body (staff creating on behalf of customer).
 * - Enforces chk_auth_recipient_not_self: lead_id != recipient_lead_id.
 * - status defaults to 'pending'.
 * - Appends audit event to exchange_events.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view authorized recipients.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const leadIdParam = searchParams.get('lead_id')?.trim();
    const recipientLeadIdParam = searchParams.get('recipient_lead_id')?.trim();
    const statusParam = searchParams.get('status')?.trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('exchange_authorized_recipients')
      .select(`
        id,
        lead_id,
        recipient_lead_id,
        relationship,
        status,
        verified_by_admin_id,
        verified_at,
        created_at,
        updated_at,
        lead:leads!exchange_authorized_recipients_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        recipient:leads!exchange_authorized_recipients_recipient_lead_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        verified_by:admin_users!exchange_authorized_recipients_verified_by_admin_id_fkey (
          id,
          full_name
        )
      `, { count: 'exact' });

    if (leadIdParam) {
      query = query.eq('lead_id', leadIdParam);
    }

    if (recipientLeadIdParam) {
      query = query.eq('recipient_lead_id', recipientLeadIdParam);
    }

    if (statusParam && statusParam !== 'all') {
      query = query.eq('status', statusParam);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: recipients, error, count } = await query;

    if (error) {
      console.error('[AdminExchangeOnboarding] Error listing authorized recipients:', error);
      return NextResponse.json({ error: 'Failed to fetch authorized recipients.' }, { status: 500 });
    }

    const total = count ?? (recipients?.length || 0);

    return NextResponse.json({
      authorizedRecipients: recipients || [],
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
    console.error('[AdminExchangeOnboarding] Unexpected error in GET /api/admin/exchange/onboarding/authorized-recipients:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to create authorized recipients.' },
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
      recipient_lead_id,
      relationship,
    } = body;

    const cleanLeadId = String(lead_id || '').trim();
    if (!cleanLeadId) {
      return NextResponse.json({ error: 'lead_id is required.' }, { status: 400 });
    }

    const cleanRecipientLeadId = String(recipient_lead_id || '').trim();
    if (!cleanRecipientLeadId) {
      return NextResponse.json({ error: 'recipient_lead_id is required.' }, { status: 400 });
    }

    if (cleanLeadId === cleanRecipientLeadId) {
      return NextResponse.json({ error: 'گیرنده مجاز نمی‌تواند خود مشتری باشد.' }, { status: 400 });
    }

    const cleanRelationship = String(relationship || '').trim();
    if (!cleanRelationship) {
      return NextResponse.json({ error: 'relationship is required.' }, { status: 400 });
    }

    // Check that customer lead exists
    const { data: customerLead, error: custErr } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('id', cleanLeadId)
      .maybeSingle();

    if (custErr || !customerLead) {
      return NextResponse.json({ error: 'Customer lead not found.' }, { status: 404 });
    }

    // Check that recipient lead exists
    const { data: recipientLead, error: recErr } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('id', cleanRecipientLeadId)
      .maybeSingle();

    if (recErr || !recipientLead) {
      return NextResponse.json({ error: 'Recipient lead not found.' }, { status: 404 });
    }

    // Insert with status = 'pending'
    const { data: createdRecipient, error: insertError } = await supabaseAdmin
      .from('exchange_authorized_recipients')
      .insert({
        lead_id: cleanLeadId,
        recipient_lead_id: cleanRecipientLeadId,
        relationship: cleanRelationship,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[AdminExchangeOnboarding] Error inserting authorized recipient:', insertError);
      return NextResponse.json(
        { error: 'ثبت گیرنده مجاز با خطا مواجه شد. لطفاً اطلاعات ورودی را بررسی نمایید.' },
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
          action: 'exchange_authorized_recipient_created',
          recipient_id: createdRecipient.id,
          lead_id: cleanLeadId,
          recipient_lead_id: cleanRecipientLeadId,
          relationship: cleanRelationship,
        },
      });

    return NextResponse.json({
      success: true,
      authorizedRecipient: createdRecipient,
    }, { status: 201 });
  } catch (err: any) {
    console.error('[AdminExchangeOnboarding] Unexpected error in POST /api/admin/exchange/onboarding/authorized-recipients:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
