/**
 * Isomorphic/Client-safe URL slugification and path formatting utilities.
 * ZERO server or database dependencies — completely safe for client bundles.
 */

/**
 * Normalizes Persian or English text into an SEO-friendly URL slug (Blog format).
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
 * Normalizes text to a URL-friendly slug (Job Board format).
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
