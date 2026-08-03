'use client';

import { useAppContext } from '../../components/AppLayout';
import { RomaniaOverviewContent } from '../../components/RomaniaOverviewContent';

export default function RomaniaPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <RomaniaOverviewContent
      subRoute="economy"
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
