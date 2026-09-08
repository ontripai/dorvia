import { MetadataRoute } from 'next';
import { ROUTE_REGISTRY } from '../lib/routeRegistry';
import { getCanonicalOrigin } from '../lib/metadata';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const BASE_URL = getCanonicalOrigin();

// A fixed build-time date, not `new Date()` evaluated per-request: reporting every
// URL as "modified right now" on every crawl gives Google no real freshness signal
// and can even look suspicious. Bump this manually when a broad content pass ships
// (e.g. a dre-pNN patch that touches many pages at once).
const SITE_LAST_MODIFIED = new Date('2026-09-03');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
        lastModified: SITE_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: route.canonical === '/' ? 1 : 0.8,
        alternates: Object.keys(alternates.languages).length > 0 ? alternates : undefined,
      });
    }

    if (hasEn) {
      sitemapItems.push({
        url: enUrl,
        lastModified: SITE_LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: route.canonical === '/' ? 1 : 0.8,
        alternates: Object.keys(alternates.languages).length > 0 ? alternates : undefined,
      });
    }
  }

  // Dynamically include published blog posts
  if (supabaseAdmin) {
    try {
      const { data: posts } = await supabaseAdmin
        .from('blog_posts')
        .select('slug_fa, slug_en, title_en, content_en, updated_at, published_at')
        .eq('status', 'published');

      if (posts && posts.length > 0) {
        for (const post of posts) {
          const hasFa = Boolean(post.slug_fa);
          const hasEn = Boolean(post.slug_en && post.title_en && post.content_en);
          const postModified = post.updated_at
            ? new Date(post.updated_at)
            : (post.published_at ? new Date(post.published_at) : SITE_LAST_MODIFIED);

          const faUrl = `${baseUrl}/fa/romania/blog/${post.slug_fa}`;
          const enUrl = hasEn ? `${baseUrl}/en/romania/blog/${post.slug_en}` : null;

          const alternates = {
            languages: {} as Record<string, string>,
          };

          if (hasFa) alternates.languages['fa'] = faUrl;
          if (hasEn && enUrl) alternates.languages['en'] = enUrl;
          if (hasFa) alternates.languages['x-default'] = faUrl;

          if (hasFa) {
            sitemapItems.push({
              url: faUrl,
              lastModified: postModified,
              changeFrequency: 'weekly',
              priority: 0.7,
              alternates: Object.keys(alternates.languages).length > 0 ? alternates : undefined,
            });
          }

          if (hasEn && enUrl) {
            sitemapItems.push({
              url: enUrl,
              lastModified: postModified,
              changeFrequency: 'weekly',
              priority: 0.7,
              alternates: Object.keys(alternates.languages).length > 0 ? alternates : undefined,
            });
          }
        }
      }
    } catch (err) {
      console.error('Error adding blog posts to sitemap:', err);
    }
  }

  return sitemapItems;
}
