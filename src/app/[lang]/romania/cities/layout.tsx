import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  return getLocalizedMetadata('romania-cities', params.lang as Language);
}

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
