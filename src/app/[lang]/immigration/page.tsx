'use client';

import { useAppContext } from '@/components/AppLayout';
import { ImmigrationOverviewContent } from '@/components/ImmigrationOverviewContent';

export default function ImmigrationPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <ImmigrationOverviewContent
      subRoute="overview"
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
