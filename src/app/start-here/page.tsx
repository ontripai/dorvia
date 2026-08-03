'use client';

import { useAppContext } from '../../components/AppLayout';
import { StartHereContent } from '../../components/StartHereContent';

export default function StartHerePage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <StartHereContent
      subRoute="planning-to-come"
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
  );
}
