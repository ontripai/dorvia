'use client';

import { useAppContext } from '../../components/AppLayout';
import { ImmigrationOverviewContent } from '../../components/ImmigrationOverviewContent';
import { EvaluationCTA } from '../../components/EvaluationCTA';

export default function ImmigrationPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <ImmigrationOverviewContent
        subRoute="overview"
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
