import { Metadata } from 'next';
import { ROUTE_REGISTRY } from './routeRegistry';
import { PAGE_META } from './pageMeta';

export function getCanonicalOrigin(): string {
  const fallback = 'https://dorvia.vercel.app';
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!rawUrl) return fallback;
  if (!rawUrl.startsWith('https://')) return fallback;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:') return fallback;
    return url.origin.replace(/\/+$/, '');
  } catch (e) {
    return fallback;
  }
}

const BASE_URL = getCanonicalOrigin();

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

  const metaItem = PAGE_META[routeKey];
  if (metaItem) {
    if (isFa && metaItem.seoTitleFa) title = metaItem.seoTitleFa;
    if (!isFa && metaItem.seoTitleEn) title = metaItem.seoTitleEn;
  }

  const description = isFa
    ? (metaItem?.seoDescFa || 'پورتال جامع اطلاعات و خدمات برای ارزیابی و مشاوره رایگان مهاجرت به رومانی و اتحادیه اروپا.')
    : (metaItem?.seoDescEn || 'Comprehensive information and service portal for free assessment and consultation for immigration to Romania and the EU.');

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
