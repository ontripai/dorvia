export const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

// Single source of truth for the site's primary origin.
// In production, NEXT_PUBLIC_SITE_URL is preferred with a safe fallback to https://dorvia.ro.
// In development/preview, falls back to NEXT_PUBLIC_VERCEL_URL or localhost.
let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) {
  if (isProduction) {
    siteUrl = 'https://dorvia.ro';
  } else {
    siteUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000';
  }
}
export const SITE_URL = siteUrl;

