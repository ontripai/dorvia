'use client';

import { useAppContext } from '@/components/AppLayout';
import { MainContent } from '@/components/MainContent';

export function SharedHomePage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <MainContent
      currentLang={currentLang}
      activeRoute="home"
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
