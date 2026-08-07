import { Metadata } from 'next';
import { ROUTE_REGISTRY } from './routeRegistry';

// 1. Use NEXT_PUBLIC_SITE_URL when it is present and valid.
// 2. Otherwise fall back to: https://romania-eight.vercel.app
let BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://romania-eight.vercel.app';

// 3. Normalize trailing slashes so generated URLs contain no accidental double slash.
BASE_URL = BASE_URL.replace(/\/+$/, '');

export function getLocalizedMetadata(routeKey: string, lang: string): Metadata {
  const route = ROUTE_REGISTRY[routeKey];
  
  // Clean path calculation
  const cleanPath = route?.canonical === '/' ? '' : (route?.canonical || '');
  
  // 5. Generated canonical and hreflang URLs must always be absolute HTTPS URLs.
  const canonical = `${BASE_URL}/${lang}${cleanPath}`;
  const faUrl = `${BASE_URL}/fa${cleanPath}`;
  const enUrl = `${BASE_URL}/en${cleanPath}`;

  const isFa = lang === 'fa';
  
  let title = route ? (isFa ? route.titleFa : route.titleEn) : 'DORVIA EUROP';
  
  if (routeKey === 'home') {
    title = isFa 
      ? 'دوریا اروپا | DORVIA EUROP - مرجع مهاجرت، اقامت، کار و ویزای تحصیلی در رومانی'
      : 'DORVIA EUROP - Immigration, Residence, Work and Study in Romania';
  } else if (route) {
    title = `${title} | DORVIA EUROP`;
  }

  const description = isFa 
    ? 'اپلیکیشن جامع برای ارزیابی و مشاوره رایگان مهاجرت به رومانی و اتحادیه اروپا.'
    : 'Comprehensive portal for free assessment and consultation for immigration to Romania and the EU.';

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonical,
      languages: {
        'fa': faUrl,
        'en': enUrl,
        'x-default': faUrl,
      },
    },
  };
}
