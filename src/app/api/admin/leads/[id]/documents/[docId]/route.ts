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
 * PATCH /api/admin/leads/[id]/documents/[docId]
 * Updates translation metadata for a document (is_certified_translation and translation_office).
 */
export async function PATCH(request: Request, { params }: RouteContext) {
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

    // 1. Fetch document and allowed_roles
    const { data: doc, error: docErr } = await supabaseAdmin
      .from('lead_documents')
      .select(`
        id,
        lead_id,
        document_type,
        translation_of_document_id,
        document_types (
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

    const isSupervisory = effectiveRoles.has('owner') || effectiveRoles.has('manager');
    const allowedRoles = (doc.document_types as any)?.allowed_roles || [];
    const isAuthorized = isSupervisory || allowedRoles.some((r: string) => effectiveRoles.has(r.toLowerCase()));

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Permission denied for this document type.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};

    if (typeof body.is_certified_translation === 'boolean') {
      updatePayload.is_certified_translation = body.is_certified_translation;
    }
    if (body.translation_office !== undefined) {
      updatePayload.translation_office = typeof body.translation_office === 'string' ? body.translation_office.trim() || null : null;
    }
    if (body.language !== undefined && typeof body.language === 'string') {
      updatePayload.language = body.language.trim() || null;
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No valid update fields provided.' }, { status: 400 });
    }

    const { data: updatedDoc, error: updateErr } = await supabaseAdmin
      .from('lead_documents')
      .update(updatePayload)
      .eq('id', documentId)
      .eq('lead_id', leadId)
      .select(`
        *,
        document_types (
          key,
          label_fa,
          allowed_roles
        ),
        uploader:admin_users!lead_documents_uploaded_by_admin_id_fkey (
          id,
          full_name
        )
      `)
      .single();

    if (updateErr || !updatedDoc) {
      console.error('Error updating translation metadata:', updateErr);
      return NextResponse.json(
        { error: 'Failed to update document metadata.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      document: updatedDoc,
    });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/leads/[id]/documents/[docId]:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
