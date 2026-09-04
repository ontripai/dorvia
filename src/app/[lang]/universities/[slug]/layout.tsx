import { Language } from '@/types';
import { SITE_URL, isProduction } from '@/config';
import type { Metadata } from 'next';
import { universitiesData } from '@/lib/universities';
import { PAGE_META } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: { slug: string; lang: string } }): Promise<Metadata> {
  const uni = universitiesData.find(u => u.id === params.slug);
  const lang = params.lang as Language;
  const fallback = PAGE_META['universities'];

  if (!uni) {
    return {
      title: fallback?.seoTitleFa || 'دانشگاه‌ها | DORVIA EUROP',
      robots: { index: false, follow: true }
    };
  }

  const name = lang === 'fa' ? uni.nameFa : uni.nameEn;
  const title = lang === 'fa'
    ? `${name} — شهریه، رشته‌ها و رتبهبندی | DORVIA EUROP`
    : `${name} — Tuition, Programs & Rankings | DORVIA EUROP`;
  const description = (lang === 'fa' ? uni.descriptionFa : uni.descriptionEn).slice(0, 155);
  const path = `universities/${uni.id}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${path}` },
    openGraph: { title, description, url: `${SITE_URL}/${path}` },
    robots: isProduction ? { index: true, follow: true } : { index: false, follow: false }
  };
}

export default function UniversityDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
