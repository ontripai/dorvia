'use client';

import React from 'react';
import { useAppContext } from '@/components/AppLayout';
import { CostOfLivingCalculator } from '@/components/CostOfLivingCalculator';
import { EvaluationCTA } from '@/components/EvaluationCTA';

export default function CostOfLivingPage() {
  const { currentLang, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12">
      <CostOfLivingCalculator currentLang={currentLang} />
      <div className="max-w-[1280px] mx-auto px-4 pb-8">
        <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
      </div>
    </div>
  );
}
