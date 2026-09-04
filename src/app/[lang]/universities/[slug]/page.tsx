'use client';

import { useAppContext } from '@/components/AppLayout';
import { UniversityDetailContent } from '@/components/UniversityDetailContent';

export default function UniversityDetailPage({ params }: { params: { slug: string } }) {
  const { currentLang, onOpenEvaluationModal } = useAppContext();

  return (
    <UniversityDetailContent
      slug={params.slug}
      currentLang={currentLang}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
