import { getLocalizedMetadata } from '@/lib/metadata';
import { ROUTE_REGISTRY } from '@/lib/routeRegistry';
import { isProduction } from '@/config';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string; lang: string };
}): Promise<Metadata> {
  const hub = 'romania';
  let routeKey = `${hub}/${params.slug}`;

  if (routeKey === 'romania/cities') {
    routeKey = 'romania-cities';
  }

  if (!(routeKey in ROUTE_REGISTRY)) {
    if (params.slug in ROUTE_REGISTRY) {
      routeKey = params.slug;
    } else if (hub in ROUTE_REGISTRY) {
      routeKey = hub;
    }
  }

  const baseMeta = getLocalizedMetadata(routeKey, params.lang);
  const route = ROUTE_REGISTRY[routeKey];
  const isIndexable = route ? route.indexable : true;

  const robots = isProduction
    ? (!isIndexable ? { index: false, follow: true } : { index: true, follow: true })
    : { index: false, follow: false };

  return {
    ...baseMeta,
    robots,
  };
}

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
