import { SITE_URL } from '@/config';
import { MetadataRoute } from 'next';
import { ROUTE_REGISTRY } from '../lib/routeRegistry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  // Add static routes that are not in the registry
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/universities',
    '/services',
    '/articles',
  ];

  const registryRoutes = Object.values(ROUTE_REGISTRY)
    .filter(route => route.indexable && route.inSitemap)
    .map(route => route.canonical);

  const allRoutes = Array.from(new Set([...staticRoutes, ...registryRoutes]));

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
