import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/**
 * POST /api/admin/blog/images
 * Uploads cover image to the public 'blog-images' bucket.
 * Requires 'blog.edit' permission.
 */
export async function POST(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'blog.edit')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to upload blog images.' },
        { status: 403 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'webp';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
    const storagePath = `covers/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await supabaseAdmin.storage
      .from('blog-images')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadErr) {
      console.error('Error uploading blog image to storage:', uploadErr);
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('blog-images').getPublicUrl(storagePath);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/admin/blog/images:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
