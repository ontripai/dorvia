'use client';

import { useAppContext } from '../../components/AppLayout';
import { WorkOverviewContent } from '../../components/WorkOverviewContent';

export default function WorkPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <WorkOverviewContent
      subRoute="overview"
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
