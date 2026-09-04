'use client';

import { useAppContext } from '@/components/AppLayout';
import { StudyDetailsContent } from '@/components/StudyDetailsContent';
import { PreparatoryYearContent } from '@/components/PreparatoryYearContent';
import { ScholarshipOverviewContent } from '@/components/ScholarshipOverviewContent';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function StudySubPage({ params }: { params: { slug: string } }) {
  const { currentLang , onOpenEvaluationModal } = useAppContext();

  if (params.slug === 'preparatory-year') {
    return <PreparatoryYearContent currentLang={currentLang} />;
  }

  if (params.slug === 'scholarships') {
    return (
      <div className="space-y-12">
        <ScholarshipOverviewContent currentLang={currentLang} />
        <EvaluationCTA variant="study" currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
      </div>
    );
  }

  return <StudyDetailsContent subRoute={params.slug} currentLang={currentLang} />;
}
