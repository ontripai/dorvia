'use client';

import { useAppContext } from '../../../components/AppLayout';
import { InvestmentOverviewContent } from '../../../components/InvestmentOverviewContent';
import { LeadForm } from '../../../components/LeadForm';

export default function CompanyInvestmentPage() {
  const { currentLang } = useAppContext();

  return (
    <div className="space-y-12">
      <InvestmentOverviewContent currentLang={currentLang} />
      <LeadForm currentLang={currentLang} />
    </div>
  );
}
