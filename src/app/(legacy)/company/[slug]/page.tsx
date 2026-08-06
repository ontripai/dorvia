'use client';

import { useAppContext } from '@/components/AppLayout';
import { CompanyOverviewContent } from '@/components/CompanyOverviewContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

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
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
