'use client';

import { useAppContext } from '../../components/AppLayout';
import { WorkOverviewContent } from '../../components/WorkOverviewContent';
import { EvaluationCTA } from '../../components/EvaluationCTA';

export default function WorkPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <WorkOverviewContent
        subRoute="overview"
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
