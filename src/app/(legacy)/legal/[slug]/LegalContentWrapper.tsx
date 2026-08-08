'use client';

import React from 'react';
import { useAppContext } from '@/components/AppLayout';
import { PrivacyContent } from './PrivacyContent';
import { TermsContent } from './TermsContent';
import { DisclaimerContent } from './DisclaimerContent';

export const LegalContentWrapper = ({ slug }: { slug: string }) => {
  const { currentLang, onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-[#dfe6ef] editorial-card mt-8">
      {slug === 'privacy' && <PrivacyContent currentLang={currentLang} />}
      {slug === 'terms' && <TermsContent currentLang={currentLang} />}
      {slug === 'disclaimer' && <DisclaimerContent currentLang={currentLang} />}
      
      <div className="pt-8 border-t border-[#dfe6ef] text-center">
        <button onClick={onOpenEvaluationModal} className="text-sm font-bold text-[#2F6FED] hover:underline">
          {currentLang === 'fa' ? 'ارزیابی اولیه رایگان' : 'Free Evaluation'}
        </button>
      </div>
    </div>
  );
};
