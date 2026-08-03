'use client';

import { useAppContext } from '../../../components/AppLayout';
import { ImmigrationOverviewContent } from '../../../components/ImmigrationOverviewContent';
import { LeadForm } from '../../../components/LeadForm';

export default function ImmigrationSubPage({ params }: { params: { slug: string } }) {
  const { currentLang, onNavigate, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <ImmigrationOverviewContent
        subRoute={params.slug}
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
      {params.slug !== 'igi-process' && <LeadForm currentLang={currentLang} />}
    </div>
  );
}
