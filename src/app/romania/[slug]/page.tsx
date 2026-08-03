'use client';

import { useAppContext } from '../../../components/AppLayout';
import { RomaniaOverviewContent } from '../../../components/RomaniaOverviewContent';

export default function RomaniaSubPage({ params }: { params: { slug: string } }) {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <RomaniaOverviewContent
      subRoute={params.slug}
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
