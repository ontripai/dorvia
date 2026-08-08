import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';
import { isProduction } from '@/config';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const locale: Language = 'fa';
  return getLocalizedMetadata('legal/[slug]', locale);
}


export default function LegalSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}