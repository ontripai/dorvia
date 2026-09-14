import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/exchange/onboarding/leads/[leadId]/documents
 *
 * Retrieves metadata for documents associated with a specific customer lead
 * for use in onboarding selection dropdowns (e.g. attaching registered company identity/registration docs).
 *
 * Strict Rules:
 * - Requires 'exchange.onboarding' permission.
 * - leadId is extracted strictly from route params.
 * - Returns ONLY safe selection metadata: id, file_name, document_type, label, mime_type, created_at.
 * - NEVER returns file paths, storage paths, or download URLs.
 * - Returns admin object with serialized permissions.
 */
export async function GET(
  request: Request,
  { params }: { params: { leadId: string } | Promise<{ leadId: string }> }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'exchange.onboarding')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view customer documents.' },
        { status: 403 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const leadId = resolvedParams?.leadId?.trim();
    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // Verify target customer exists
    const { data: targetLead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .maybeSingle();

    if (leadErr || !targetLead) {
      return NextResponse.json({ error: 'Customer lead not found.' }, { status: 404 });
    }

    // Query safe selection metadata from lead_documents
    const { data: documents, error: docsErr } = await supabaseAdmin
      .from('lead_documents')
      .select('id, file_name, document_type, label, mime_type, created_at')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (docsErr) {
      console.error(`[AdminExchangeOnboarding] Error fetching documents for lead ${leadId}:`, docsErr);
      return NextResponse.json(
        { error: 'Failed to fetch customer documents.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      documents: documents || [],
      admin: {
        ...admin,
        permissions: Array.from(admin.permissions),
      },
    });
  } catch (err: any) {
    console.error('[AdminExchangeOnboarding] Unexpected error in GET /api/admin/exchange/onboarding/leads/[leadId]/documents:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
