import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';
import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const locale: Language = 'fa';
  return getLocalizedMetadata('contact', locale);
}


export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}