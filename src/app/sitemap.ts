import { SITE_URL } from '@/config';
import { MetadataRoute } from 'next';
import { ROUTE_REGISTRY } from '../lib/routeRegistry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const allRoutes = Object.values(ROUTE_REGISTRY)
    .filter(route => route.indexable && route.inSitemap)
    .map(route => route.canonical);

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
