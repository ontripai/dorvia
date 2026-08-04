import { SITE_URL, isProduction } from '@/config';
import type { Metadata } from 'next';
import { PAGE_META } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fullPath = `start-here/${params.slug}`;
  const meta = PAGE_META[fullPath] || PAGE_META[params.slug] || PAGE_META['start-here'];
  
  const title = meta?.seoTitleFa || (meta?.titleFa ? `${meta.titleFa} | در رومانی – DORVIA EUROP` : 'در رومانی – DORVIA EUROP');
  const description = meta?.seoDescFa || 'راهنمای جامع خدمات حقوقی، تحصیلی و مهاجرتی در کشور رومانی.';

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${fullPath}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${fullPath}`,
    },
    robots: isProduction ? (!meta?.indexable ? { index: false, follow: true } : undefined) : undefined
  };
}

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
