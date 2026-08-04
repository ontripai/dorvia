'use client';

import { useAppContext } from '../../components/AppLayout';
import { StartHereContent } from '../../components/StartHereContent';
import { EvaluationCTA } from '../../components/EvaluationCTA';

export default function StartHerePage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <StartHereContent
      subRoute="planning-to-come"
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
