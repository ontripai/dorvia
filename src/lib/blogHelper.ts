import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Normalizes Persian or English text into an SEO-friendly URL slug.
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep Unicode letters & numbers & hyphens
    .replace(/\s+/g, '-')             // Replace whitespace with hyphen
    .replace(/-+/g, '-')              // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');         // Trim leading/trailing hyphens
}

/**
 * Extracts the storage file path from a public URL of the 'blog-images' bucket.
 * Example URL:
 * https://.../storage/v1/object/public/blog-images/covers/12345.webp
 * Returns: 'covers/12345.webp'
 */
export function extractBlogImagePath(publicUrl: string | null | undefined): string | null {
  if (!publicUrl) return null;
  const marker = '/blog-images/';
  const idx = publicUrl.indexOf(marker);
  if (idx !== -1) {
    return decodeURIComponent(publicUrl.substring(idx + marker.length));
  }
  return null;
}

/**
 * Deletes a cover image from the 'blog-images' bucket to prevent orphan files.
 */
export async function deleteBlogImageFromStorage(publicUrl: string | null | undefined): Promise<boolean> {
  const filePath = extractBlogImagePath(publicUrl);
  if (!filePath || !supabaseAdmin) return false;

  try {
    const { error } = await supabaseAdmin.storage.from('blog-images').remove([filePath]);
    if (error) {
      console.warn(`[Storage] Failed to delete orphan image "${filePath}":`, error.message);
      return false;
    }
    console.log(`[Storage] Successfully removed orphan image from blog-images: "${filePath}"`);
    return true;
  } catch (err) {
    console.error(`[Storage] Unexpected error deleting image "${filePath}":`, err);
    return false;
  }
}
