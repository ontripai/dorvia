import { MetadataRoute } from 'next';
import { ROUTE_REGISTRY } from '../lib/routeRegistry';
import { getCanonicalOrigin } from '../lib/metadata';

const BASE_URL = getCanonicalOrigin();

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL;

  const routes = Object.values(ROUTE_REGISTRY)
    .filter(route => route.indexable && route.inSitemap);

  const sitemapItems: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const cleanPath = route.canonical === '/' ? '' : route.canonical;
    const hasEn = !route.missingTranslations?.includes('en');
    const hasFa = !route.missingTranslations?.includes('fa');

    const faUrl = `${baseUrl}/fa${cleanPath}`;
    const enUrl = `${baseUrl}/en${cleanPath}`;

    const alternates = {
      languages: {} as Record<string, string>
    };

    if (hasFa) alternates.languages['fa'] = faUrl;
    if (hasEn) alternates.languages['en'] = enUrl;
    if (hasFa) alternates.languages['x-default'] = faUrl;

    if (hasFa) {
      sitemapItems.push({
        url: faUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route.canonical === '/' ? 1 : 0.8,
        alternates: Object.keys(alternates.languages).length > 0 ? alternates : undefined,
      });
    }

    if (hasEn) {
      sitemapItems.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route.canonical === '/' ? 1 : 0.8,
        alternates: Object.keys(alternates.languages).length > 0 ? alternates : undefined,
      });
    }
  }

  return sitemapItems;
}
