'use client';

import { useAppContext } from '@/components/AppLayout';
import { NeedsContent } from '@/components/NeedsContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function NeedsSubPage({ params }: { params: { slug: string } }) {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <NeedsContent
      subRoute={params.slug}
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
