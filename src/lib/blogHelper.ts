import { supabaseAdmin } from '@/lib/supabaseAdmin';

import { extractBlogImagePath } from './slugHelper';

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
