'use client';

import { useAppContext } from '../../components/AppLayout';
import { NeedsContent } from '../../components/NeedsContent';

export default function NeedsPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <NeedsContent
      subRoute="first-days-checklist"
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
