import { NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/documentConstants';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * Helper to compile effective roles for a staff user on a specific lead.
 * Combines system roleKey (from admin_users) and any lead-specific assigned_role (from lead_assignments).
 */
async function getEffectiveRoles(adminUserId: string, baseRoleKey: string, leadId: string): Promise<Set<string>> {
  const roles = new Set<string>();
  if (baseRoleKey) roles.add(baseRoleKey.toLowerCase());

  if (supabaseAdmin) {
    const { data: assignments } = await supabaseAdmin
      .from('lead_assignments')
      .select('assigned_role')
      .eq('lead_id', leadId)
      .eq('staff_id', adminUserId);

    if (assignments) {
      for (const a of assignments) {
        if (a.assigned_role) {
          roles.add(a.assigned_role.toLowerCase());
        }
      }
    }
  }

  return roles;
}

/**
 * Checks whether the effective roles include supervisory access or the document's allowed_roles.
 */
function isRoleAuthorized(effectiveRoles: Set<string>, allowedRoles: string[]): boolean {
  if (effectiveRoles.has('owner') || effectiveRoles.has('manager')) {
    return true;
  }
  return allowedRoles.some((r) => effectiveRoles.has(r.toLowerCase()));
}

/**
 * GET /api/admin/leads/[id]/documents
 * Returns documents for this lead, STRICTLY filtered on the server by the staff member's
 * effective roles and document_types.allowed_roles.
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
    const effectiveRoles = await getEffectiveRoles(admin.adminUserId, admin.roleKey, leadId);
    const isSupervisory = effectiveRoles.has('owner') || effectiveRoles.has('manager');

    // 1. Fetch all document types
    const { data: allDocTypes, error: typesErr } = await supabaseAdmin
      .from('document_types')
      .select('key, label_fa, allowed_roles')
      .order('key', { ascending: true });

    if (typesErr || !allDocTypes) {
      console.error('Error fetching document types:', typesErr);
      return NextResponse.json(
        { error: 'Failed to fetch document types.' },
        { status: 500 }
      );
    }

    // Determine which document types this staff member is authorized to handle
    const allowedDocumentTypes = allDocTypes.filter((dt) =>
      isRoleAuthorized(effectiveRoles, dt.allowed_roles || [])
    );

    // 2. Fetch all lead documents for this lead
    const { data: allDocuments, error: docsErr } = await supabaseAdmin
      .from('lead_documents')
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
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (docsErr) {
      console.error('Error fetching admin lead documents:', docsErr);
      return NextResponse.json(
        { error: 'Failed to fetch lead documents.' },
        { status: 500 }
      );
    }

    // 3. Server-side role enforcement: Filter documents by staff effective roles
    const filteredDocuments = (allDocuments || []).filter((doc: any) => {
      const allowed = doc.document_types?.allowed_roles || [];
      return isRoleAuthorized(effectiveRoles, allowed);
    });

    return NextResponse.json({
      success: true,
      documents: filteredDocuments,
      allowedDocumentTypes,
      effectiveRoles: Array.from(effectiveRoles),
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/leads/[id]/documents:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/leads/[id]/documents
 * Allows an authorized staff member to upload a document on behalf of the lead.
 * Uploads file via service_role directly to Supabase Storage and records metadata.
 */
export async function POST(request: Request, { params }: RouteContext) {
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
    const effectiveRoles = await getEffectiveRoles(admin.adminUserId, admin.roleKey, leadId);

    // Parse multipart/form-data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const documentType = (formData.get('document_type') as string | null)?.trim();
    const language = (formData.get('language') as string | null)?.trim() || 'فارسی';
    const translationOfId = (formData.get('translation_of_document_id') as string | null)?.trim() || null;
    const translationOffice = (formData.get('translation_office') as string | null)?.trim() || null;
    const isCertified =
      formData.get('is_certified_translation') === 'true' ||
      formData.get('is_certified_translation') === '1';
    const label = (formData.get('label') as string | null)?.trim() || null;

    if (!file || !documentType) {
      return NextResponse.json(
        { error: 'File and document_type are required.' },
        { status: 400 }
      );
    }

    // 1. Role verification for this document type
    const { data: docTypeRecord, error: dtErr } = await supabaseAdmin
      .from('document_types')
      .select('key, label_fa, allowed_roles')
      .eq('key', documentType)
      .maybeSingle();

    if (dtErr || !docTypeRecord) {
      return NextResponse.json(
        { error: `Invalid document type: "${documentType}"` },
        { status: 400 }
      );
    }

    if (!isRoleAuthorized(effectiveRoles, docTypeRecord.allowed_roles || [])) {
      console.warn(`[Security] Staff ${admin.adminUserId} (${admin.roleKey}) unauthorized to upload ${documentType}`);
      return NextResponse.json(
        { error: 'Your staff role does not have permission to upload this document type.' },
        { status: 403 }
      );
    }

    // 2. Validate file type and size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File exceeds 50MB limit.' },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Disallowed file type.' },
        { status: 400 }
      );
    }

    // 3. If translation, verify parent document
    if (translationOfId) {
      const { data: parentDoc } = await supabaseAdmin
        .from('lead_documents')
        .select('id')
        .eq('id', translationOfId)
        .eq('lead_id', leadId)
        .maybeSingle();

      if (!parentDoc) {
        return NextResponse.json(
          { error: 'Parent document for translation not found on this lead.' },
          { status: 400 }
        );
      }
    }

    // 4. Upload file to Storage with service_role
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${leadId}/${documentType}/${Date.now()}-${cleanFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
      .from('lead-documents')
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadErr || !uploadData) {
      console.error('Error uploading file to Storage bucket via admin API:', uploadErr);
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadErr?.message || 'unknown error'}` },
        { status: 500 }
      );
    }

    // 5. Insert metadata into lead_documents
    const { data: insertedDoc, error: insertErr } = await supabaseAdmin
      .from('lead_documents')
      .insert({
        lead_id: leadId,
        document_type: documentType,
        language,
        translation_of_document_id: translationOfId,
        translation_office: translationOffice,
        is_certified_translation: isCertified,
        uploaded_by_role: 'admin',
        uploaded_by_admin_id: admin.adminUserId,
        storage_path: storagePath,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
        label,
      })
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

    if (insertErr || !insertedDoc) {
      console.error('Error recording admin uploaded document in database:', insertErr);
      return NextResponse.json(
        { error: 'Failed to record document metadata in database.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      document: insertedDoc,
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/leads/[id]/documents:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
