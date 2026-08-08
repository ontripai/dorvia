import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalContentWrapper } from '@/app/(legacy)/legal/[slug]/LegalContentWrapper';
import { getLocalizedMetadata } from '@/lib/metadata';
import { LOCALES } from '@/lib/locale-router';

const VALID_SLUGS = ['privacy', 'terms', 'disclaimer'];

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    for (const slug of VALID_SLUGS) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export function generateMetadata({ params }: { params: { lang: string, slug: string } }): Metadata {
  return getLocalizedMetadata('legal/' + params.slug, params.lang);
}

export default function LocalizedLegalPage({ params }: { params: { lang: string, slug: string } }) {
  const { lang, slug } = params;
  if (!LOCALES.includes(lang as any)) notFound();
  if (!VALID_SLUGS.includes(slug)) notFound();

  return <LegalContentWrapper slug={slug} />;
}
