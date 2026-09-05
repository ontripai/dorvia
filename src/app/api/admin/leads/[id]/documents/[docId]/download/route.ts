import { NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
    docId: string;
  };
}

/**
 * GET /api/admin/leads/[id]/documents/[docId]/download
 * Validates staff authentication, verifies role-based permissions against
 * document_types.allowed_roles, and returns a short-lived signed URL (or redirects).
 * Strictly enforces 403 if the staff member's role is not permitted.
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const admin = await getAdminContext(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized admin access.' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service unconfigured.' },
        { status: 500 }
      );
    }

    const leadId = params.id;
    const documentId = params.docId;

    if (!leadId || !documentId) {
      return NextResponse.json({ error: 'Lead ID and Document ID are required.' }, { status: 400 });
    }

    // 1. Fetch document and associated allowed_roles
    const { data: doc, error: docErr } = await supabaseAdmin
      .from('lead_documents')
      .select(`
        id,
        lead_id,
        storage_path,
        file_name,
        document_type,
        document_types (
          key,
          label_fa,
          allowed_roles
        )
      `)
      .eq('id', documentId)
      .eq('lead_id', leadId)
      .maybeSingle();

    if (docErr || !doc) {
      return NextResponse.json(
        { error: 'Document not found.' },
        { status: 404 }
      );
    }

    // 2. Compile staff effective roles for this lead
    const effectiveRoles = new Set<string>();
    if (admin.roleKey) effectiveRoles.add(admin.roleKey.toLowerCase());

    const { data: assignments } = await supabaseAdmin
      .from('lead_assignments')
      .select('assigned_role')
      .eq('lead_id', leadId)
      .eq('staff_id', admin.adminUserId);

    if (assignments) {
      for (const a of assignments) {
        if (a.assigned_role) effectiveRoles.add(a.assigned_role.toLowerCase());
      }
    }

    // 3. Check role authorization
    const isSupervisory = effectiveRoles.has('owner') || effectiveRoles.has('manager');
    const allowedRoles = (doc.document_types as any)?.allowed_roles || [];
    const isAuthorized = isSupervisory || allowedRoles.some((r: string) => effectiveRoles.has(r.toLowerCase()));

    if (!isAuthorized) {
      console.warn(
        `[Security Alert] Staff ${admin.adminUserId} (${admin.roleKey}) denied direct download access to document ${documentId} (type: ${doc.document_type})`
      );
      return NextResponse.json(
        { error: 'Access denied: Your staff role does not have permission to view or download this document.' },
        { status: 403 }
      );
    }

    // 4. Generate short-lived signed URL (60 seconds)
    const { data: signedData, error: signErr } = await supabaseAdmin.storage
      .from('lead-documents')
      .createSignedUrl(doc.storage_path, 60, {
        download: doc.file_name,
      });

    if (signErr || !signedData?.signedUrl) {
      console.error('Error generating signed URL for admin download:', signErr);
      return NextResponse.json(
        { error: 'Failed to generate download link.' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const isJsonRequested =
      url.searchParams.get('json') === 'true' ||
      request.headers.get('accept')?.includes('application/json');

    if (isJsonRequested) {
      return NextResponse.json({
        success: true,
        downloadUrl: signedData.signedUrl,
        fileName: doc.file_name,
      });
    }

    return NextResponse.redirect(signedData.signedUrl, 307);
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/leads/[id]/documents/[docId]/download:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
