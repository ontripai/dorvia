'use client';

import { useAppContext } from '@/components/AppLayout';
import { NeedsContent } from '@/components/NeedsContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function NeedsPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <NeedsContent
      subRoute="needs"
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
