import { SharedContactPage } from '@/components/SharedContactPage';
import { getLocalizedMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return getLocalizedMetadata('contact', params.lang);
}

export default function LocalizedContactPage() {
  return <SharedContactPage />;
}
