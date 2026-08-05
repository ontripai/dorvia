import React from 'react';
import { OperationalGuide } from '../../types/content';
import { QuickAnswer } from './QuickAnswer';
import { WhoThisIsFor } from './WhoThisIsFor';
import { EligibilityAndExceptions } from './EligibilityAndExceptions';
import { RequiredDocuments } from './RequiredDocuments';
import { StepByStepProcess } from './StepByStepProcess';
import { FeesAndTimelines } from './FeesAndTimelines';
import { AuthorityAndAppointment } from './AuthorityAndAppointment';
import { ImportantWarnings } from './ImportantWarnings';
import { OfficialSources } from './OfficialSources';

interface OperationalGuideLayoutProps {
  guide: OperationalGuide;
  translations: {
    tocTitle: string;
    quickOverview: string;
    appliesTo: string;
    exceptionsTitle: string;
    documentsTitle: string;
    stepsTitle: string;
    feesTitle: string;
    timelinesTitle: string;
    amountHeader: string;
    notesHeader: string;
    durationHeader: string;
    authorityTitle: string;
    actionLabel: string;
    warningsTitle: string;
    sourcesTitle: string;
    accessedOn: string;
    lastReviewed: string;
  };
}

export const OperationalGuideLayout: React.FC<OperationalGuideLayoutProps> = ({ guide, translations }) => {
  const isRtl = guide.locale === 'fa';

  return (
    <div className={`space-y-10 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Hero Section */}
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {guide.title}
        </h1>
        <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {guide.shortDescription}
        </p>
      </div>

      <QuickAnswer answer={guide.quickAnswer} isRtl={isRtl} translations={translations} />

      {/* Table of Contents */}
      {guide.situations && guide.situations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-[#dfe6ef] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-[#142033] border-b border-[#dfe6ef] pb-3">
            <span className="text-lg">📋</span>
            <h3 className="font-extrabold text-base sm:text-lg">
              {translations.tocTitle}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm font-semibold">
            {guide.situations.map((sit, idx) => (
              <a key={idx} href={`#scenario-${sit.id}`} className="p-3 bg-[#f7f9fc] hover:bg-[#eef3f8] text-[#2F6FED] rounded-xl border border-[#dfe6ef] flex items-center space-x-2 rtl:space-x-reverse transition-colors min-h-[44px]">
                <span>{idx + 1}. {sit.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Scenarios */}
      {guide.situations?.map((scenario, idx) => (
        <div key={scenario.id} id={`scenario-${scenario.id}`} className="editorial-card p-6 sm:p-8 bg-white border border-[#dfe6ef] space-y-6 shadow-sm scroll-mt-32">
          <h2 className="text-xl font-extrabold text-[#142033] border-b border-[#dfe6ef] pb-3">
            {idx + 1}. {scenario.title}
          </h2>

          <WhoThisIsFor audiences={scenario.appliesTo} isRtl={isRtl} translations={translations} />
          <EligibilityAndExceptions exceptions={scenario.exceptions} isRtl={isRtl} translations={translations} />
          <RequiredDocuments documents={scenario.documents} isRtl={isRtl} translations={translations} />
          <StepByStepProcess steps={scenario.steps} isRtl={isRtl} translations={translations} />
          <FeesAndTimelines fees={scenario.fees} timelines={scenario.timeline} isRtl={isRtl} translations={translations} />
          <AuthorityAndAppointment authority={scenario.authority} actionLink={scenario.actionLink} isRtl={isRtl} translations={translations} />
        </div>
      ))}

      {/* General Warnings & Exceptions */}
      <ImportantWarnings warnings={guide.warnings} isRtl={isRtl} translations={translations} />
      
      {/* Official Sources */}
      <OfficialSources sources={guide.officialSources} isRtl={isRtl} translations={translations} />

      {/* Meta Footer */}
      <div className="text-xs text-slate-500 text-center space-y-1">
        <p>{translations.lastReviewed}: {guide.lastReviewed}</p>
        <p>Status: {guide.contentStatus} | Fact Check: {guide.factCheckStatus}</p>
      </div>

    </div>
  );
};
