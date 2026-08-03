'use client';

import { useAppContext } from '../../../components/AppLayout';
import { NeedsContent } from '../../../components/NeedsContent';

export default function NeedsSubPage({ params }: { params: { slug: string } }) {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <NeedsContent
      subRoute={params.slug}
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
