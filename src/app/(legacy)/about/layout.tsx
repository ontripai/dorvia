import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';
import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const locale: Language = 'fa';
  return getLocalizedMetadata('about', locale);
}


export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
