import { SharedAboutPage } from '@/components/SharedAboutPage';
import { getLocalizedMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return getLocalizedMetadata('about', params.lang);
}

export default function LocalizedAboutPage() {
  return <SharedAboutPage />;
}
