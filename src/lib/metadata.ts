import { Metadata } from 'next';
import { ROUTE_REGISTRY } from './routeRegistry';
import { SITE_URL } from '@/config';

export function getLocalizedMetadata(routeKey: string, lang: string): Metadata {
  const route = ROUTE_REGISTRY[routeKey];
  
  // Clean path calculation
  const cleanPath = route?.canonical === '/' ? '' : (route?.canonical || '');
  
  const canonical = `${SITE_URL}/${lang}${cleanPath}`;
  const faUrl = `${SITE_URL}/fa${cleanPath}`;
  const enUrl = `${SITE_URL}/en${cleanPath}`;

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
    metadataBase: new URL(SITE_URL),
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
