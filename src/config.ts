export const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (isProduction && !siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is missing in production.");
}
if (!siteUrl) {
  siteUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000';
}
export const SITE_URL = siteUrl;
