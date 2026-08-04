'use client';

import { useAppContext } from '../../components/AppLayout';
import { MainContent } from '../../components/MainContent';

export default function StudyHubPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <MainContent
      activeRoute="study"
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
