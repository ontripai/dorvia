import { supabaseAdmin } from './supabaseAdmin';

/**
 * Checks whether the public job board module is currently enabled.
 * Queries public.app_settings with key = 'job_board_public_enabled'.
 * Defaults strictly to false on any error or missing setting.
 */
export async function isJobBoardPubliclyEnabled(): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('app_settings')
      .select('value')
      .eq('key', 'job_board_public_enabled')
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    // Handles boolean true or string 'true' safely
    return data.value === true || data.value === 'true';
  } catch (err) {
    console.error('Error checking job_board_public_enabled in app_settings:', err);
    return false;
  }
}

/**
 * Normalizes text to a URL-friendly slug.
 * Supports Persian and Latin characters, numbers, and hyphens.
 */
export function slugifyJob(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .trim()
    .toLowerCase()
    // Replace spaces and special characters with hyphens
    .replace(/\s+/g, '-')
    // Remove unwanted punctuation except hyphens and letters/numbers
    .replace(/[^\u0600-\u06FFa-z0-9\-_]/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Trim hyphens from ends
    .replace(/^-+|-+$/g, '');
}
