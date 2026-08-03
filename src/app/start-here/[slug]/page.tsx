'use client';

import { useAppContext } from '../../../components/AppLayout';
import { StartHereContent } from '../../../components/StartHereContent';

export default function StartHereSubPage({ params }: { params: { slug: string } }) {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <StartHereContent
      subRoute={params.slug}
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
