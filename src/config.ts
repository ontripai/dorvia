export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL 
  || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'https://romania-ontrip.vercel.app');
