import { Metadata } from 'next';
import { PAGE_META } from '@/lib/pageMeta';
import { LegalContentWrapper } from './LegalContentWrapper';
import { getLocalizedMetadata } from '@/lib/metadata';
import { LOCALES } from '@/lib/locale-router';
import { notFound } from 'next/navigation';

const VALID_SLUGS = ['privacy', 'terms', 'disclaimer'];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  if (!VALID_SLUGS.includes(params.slug)) notFound();
  // Always map bare legacy routes to the primary 'fa' locale for SEO
  return getLocalizedMetadata(`legal/${params.slug}`, 'fa');
}

export default function LegacyLegalPage({ params }: { params: { slug: string } }) {
  if (!VALID_SLUGS.includes(params.slug)) notFound();
  return <LegalContentWrapper slug={params.slug} />;
}
