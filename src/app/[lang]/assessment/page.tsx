import { SharedAssessmentPage } from '@/components/SharedAssessmentPage';
import { getLocalizedMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return getLocalizedMetadata('assessment', params.lang);
}

export default function LocalizedAssessmentPage() {
  return <SharedAssessmentPage />;
}
