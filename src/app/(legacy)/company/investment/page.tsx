'use client';

import { useAppContext } from '@/components/AppLayout';
import { InvestmentOverviewContent } from '@/components/InvestmentOverviewContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function CompanyInvestmentPage() {
  const { currentLang , onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <InvestmentOverviewContent currentLang={currentLang} />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
