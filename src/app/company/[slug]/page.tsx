'use client';

import { useAppContext } from '../../../components/AppLayout';
import { CompanyOverviewContent } from '../../../components/CompanyOverviewContent';
import { LeadForm } from '../../../components/LeadForm';

export default function CompanySubPage({ params }: { params: { slug: string } }) {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <CompanyOverviewContent
        subRoute={params.slug}
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
      <LeadForm currentLang={currentLang} />
    </div>
  );
}
