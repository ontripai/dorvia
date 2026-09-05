import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * GET /api/portal/documents/[id]/download
 * Generates a short-lived (60s) secure signed URL from the private Storage bucket
 * and either redirects the client (HTTP 307) or returns JSON if requested.
 * NEVER exposes the raw bucket storage path.
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const documentId = params.id;
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required.' }, { status: 400 });
    }

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

    // Fetch document verifying ownership
    const { data: doc, error: docErr } = await supabaseAdmin
      .from('lead_documents')
      .select('id, storage_path, file_name')
      .eq('id', documentId)
      .eq('lead_id', lead.id)
      .maybeSingle();

    if (docErr || !doc) {
      return NextResponse.json(
        { error: 'Document not found or unauthorized.' },
        { status: 404 }
      );
    }

    // Generate short-lived signed URL (60 seconds)
    const { data: signedData, error: signErr } = await supabaseAdmin.storage
      .from('lead-documents')
      .createSignedUrl(doc.storage_path, 60, {
        download: doc.file_name,
      });

    if (signErr || !signedData?.signedUrl) {
      console.error('Error generating signed URL for portal document:', signErr);
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
    console.error('Unexpected error in GET /api/portal/documents/[id]/download:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
