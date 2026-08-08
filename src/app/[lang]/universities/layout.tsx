import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';
import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  return getLocalizedMetadata('universities', params.lang as Language);
}


export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}