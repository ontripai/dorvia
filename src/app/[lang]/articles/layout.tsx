import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';
import { SITE_URL, isProduction } from '@/config';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  return getLocalizedMetadata('articles', params.lang as Language);
}


export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}