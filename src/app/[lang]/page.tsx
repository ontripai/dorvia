import { SharedHomePage } from '@/components/SharedHomePage';
import { getLocalizedMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return getLocalizedMetadata('home', params.lang);
}

export default function LocalizedHomePage() {
  return <SharedHomePage />;
}
