'use client';

import { useAppContext } from '@/components/AppLayout';
import { RomaniaOverviewContent } from '@/components/RomaniaOverviewContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function RomaniaSubPage({ params }: { params: { slug: string } }) {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <RomaniaOverviewContent
      subRoute={params.slug}
      currentLang={currentLang}
      onNavigate={onNavigate}
      onOpenEvaluationModal={onOpenEvaluationModal}
    />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
