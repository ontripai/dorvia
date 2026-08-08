'use client';

import { useAppContext } from '@/components/AppLayout';
import { CompanyOverviewContent } from '@/components/CompanyOverviewContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function CompanyPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <CompanyOverviewContent
        subRoute="overview"
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
