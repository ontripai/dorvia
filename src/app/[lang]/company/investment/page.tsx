'use client';

import { useAppContext } from '@/components/AppLayout';
import { InvestmentOverviewContent } from '@/components/InvestmentOverviewContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function CompanyInvestmentPage() {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <InvestmentOverviewContent currentLang={currentLang} onNavigate={onNavigate} />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
