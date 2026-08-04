const fs = require('fs');

const paths = [
  { p: 'src/app/work/[slug]/layout.tsx', prefix: 'work' },
  { p: 'src/app/romania/[slug]/layout.tsx', prefix: 'romania' },
  { p: 'src/app/needs/[slug]/layout.tsx', prefix: 'needs' },
  { p: 'src/app/study/[slug]/layout.tsx', prefix: 'study' },
  { p: 'src/app/start-here/[slug]/layout.tsx', prefix: 'start-here' },
  { p: 'src/app/company/[slug]/layout.tsx', prefix: 'company' }
];

paths.forEach(({p, prefix}) => {
  if (fs.existsSync(p)) {
    const code = `import { SITE_URL, isProduction } from '@/config';
import type { Metadata } from 'next';
import { PAGE_META } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fullPath = \`${prefix}/\${params.slug}\`;
  const meta = PAGE_META[fullPath] || PAGE_META[params.slug] || PAGE_META['${prefix}'];
  
  const title = meta?.seoTitleFa || (meta?.titleFa ? \`\${meta.titleFa} | در رومانی – DORVIA EUROP\` : 'در رومانی – DORVIA EUROP');
  const description = meta?.seoDescFa || 'راهنمای جامع خدمات حقوقی، تحصیلی و مهاجرتی در کشور رومانی.';

  return {
    title,
    description,
    alternates: {
      canonical: \`\${SITE_URL}/\${fullPath}\`,
    },
    openGraph: {
      title,
      description,
      url: \`\${SITE_URL}/\${fullPath}\`,
    },
    robots: isProduction 
      ? (!meta?.indexable ? { index: false, follow: true } : { index: true, follow: true }) 
      : { index: false, follow: false }
  };
}

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
    fs.writeFileSync(p, code, 'utf8');
    console.log('Updated', p);
  }
});
