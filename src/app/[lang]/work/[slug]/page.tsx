'use client';

import { useAppContext } from '@/components/AppLayout';
import { WorkOverviewContent } from '@/components/WorkOverviewContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function WorkSubPage({ params }: { params: { slug: string } }) {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <WorkOverviewContent
        subRoute={params.slug}
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
      <EvaluationCTA variant="work" currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
