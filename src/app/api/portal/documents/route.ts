import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/documentConstants';

/**
 * GET /api/portal/documents
 * Fetches the list of uploaded documents for the currently authenticated portal lead,
 * along with the available document_types list for UI labeling and options.
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

    // Resolve lead linked to this auth user
    const { data: lead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (leadErr || !lead) {
      return NextResponse.json(
        { error: 'No active lead profile found.' },
        { status: 403 }
      );
    }

    // Fetch documents belonging to this lead
    const { data: documents, error: docErr } = await supabaseAdmin
      .from('lead_documents')
      .select('*, document_types(key, label_fa, allowed_roles)')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false });

    if (docErr) {
      console.error('Error fetching portal documents:', docErr);
      return NextResponse.json(
        { error: 'Failed to fetch documents.' },
        { status: 500 }
      );
    }

    // Fetch document types
    const { data: documentTypes, error: typesErr } = await supabaseAdmin
      .from('document_types')
      .select('key, label_fa')
      .order('key', { ascending: true });

    if (typesErr) {
      console.error('Error fetching document types:', typesErr);
    }

    return NextResponse.json({
      success: true,
      documents: documents || [],
      documentTypes: documentTypes || [],
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/portal/documents:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portal/documents
 * Registers metadata for a document that was uploaded to the private Storage bucket
 * `lead-documents` directly by the authenticated portal lead.
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

    // Resolve lead linked to this auth user
    const { data: lead, error: leadErr } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (leadErr || !lead) {
      return NextResponse.json(
        { error: 'No active lead profile found.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid JSON body.' },
        { status: 400 }
      );
    }

    const {
      document_type,
      language,
      translation_of_document_id,
      storage_path,
      file_name,
      mime_type,
      size_bytes,
      label,
    } = body;

    if (!document_type || !storage_path || !file_name) {
      return NextResponse.json(
        { error: 'Missing required document fields: document_type, storage_path, or file_name.' },
        { status: 400 }
      );
    }

    // Enforce Storage Path Isolation: the path MUST start with the user's lead id
    const expectedPrefix = `${lead.id}/`;
    if (!storage_path.startsWith(expectedPrefix)) {
      console.warn(`[Security Alert] Lead ${lead.id} attempted to register document at unauthorized path: ${storage_path}`);
      return NextResponse.json(
        { error: 'Unauthorized storage path prefix.' },
        { status: 403 }
      );
    }

    // Validate size limit
    if (typeof size_bytes === 'number' && size_bytes > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File exceeds 50MB limit.' },
        { status: 400 }
      );
    }

    // Validate MIME type if provided
    if (mime_type && !ALLOWED_MIME_TYPES.includes(mime_type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Disallowed file type.' },
        { status: 400 }
      );
    }

    // If translation_of_document_id is provided, verify it belongs to this lead
    if (translation_of_document_id) {
      const { data: parentDoc, error: parentErr } = await supabaseAdmin
        .from('lead_documents')
        .select('id')
        .eq('id', translation_of_document_id)
        .eq('lead_id', lead.id)
        .maybeSingle();

      if (parentErr || !parentDoc) {
        return NextResponse.json(
          { error: 'Parent document for translation not found.' },
          { status: 400 }
        );
      }
    }

    // Insert metadata record in lead_documents
    const { data: insertedDoc, error: insertErr } = await supabaseAdmin
      .from('lead_documents')
      .insert({
        lead_id: lead.id,
        document_type,
        language: language?.trim() || 'فارسی',
        translation_of_document_id: translation_of_document_id || null,
        translation_office: null,
        is_certified_translation: false,
        uploaded_by_role: 'lead',
        uploaded_by_admin_id: null,
        storage_path,
        file_name: file_name.trim(),
        mime_type: mime_type || null,
        size_bytes: typeof size_bytes === 'number' ? size_bytes : null,
        label: label?.trim() || null,
      })
      .select('*, document_types(key, label_fa, allowed_roles)')
      .single();

    if (insertErr || !insertedDoc) {
      console.error('Error inserting portal lead document:', insertErr);
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
    console.error('Unexpected error in POST /api/portal/documents:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
