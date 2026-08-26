'use client';

import { useAppContext } from '@/components/AppLayout';
import { CityDetailContent } from '@/components/CityDetailContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function CityDetailPage({ params }: { params: { slug: string } }) {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <CityDetailContent
        citySlug={params.slug}
        currentLang={currentLang}
        onNavigate={onNavigate}
      />
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
