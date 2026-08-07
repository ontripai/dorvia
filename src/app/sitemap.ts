import { MetadataRoute } from 'next';
import { ROUTE_REGISTRY } from '../lib/routeRegistry';
import { getCanonicalOrigin } from '../lib/metadata';

const BASE_URL = getCanonicalOrigin();

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL;

  const routes = Object.values(ROUTE_REGISTRY)
    .filter(route => route.indexable && route.inSitemap);

  const sitemapItems: MetadataRoute.Sitemap = [];

  const migratedCanonicalPaths = [
    '/', '/about', '/contact',
    '/legal/privacy', '/legal/terms', '/legal/disclaimer'
  ];

  for (const route of routes) {
    if (migratedCanonicalPaths.includes(route.canonical)) {
      const cleanPath = route.canonical === '/' ? '' : route.canonical;

      const faUrl = `${baseUrl}/fa${cleanPath}`;
      const enUrl = `${baseUrl}/en${cleanPath}`;

      const alternates = {
        languages: {
          'fa': faUrl,
          'en': enUrl,
          'x-default': faUrl,
        }
      };

      sitemapItems.push({
        url: faUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route.canonical === '/' ? 1 : 0.8,
        alternates,
      });

      sitemapItems.push({
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route.canonical === '/' ? 1 : 0.8,
        alternates,
      });
    } else {
      sitemapItems.push({
        url: `${baseUrl}${route.canonical}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return sitemapItems;
}
