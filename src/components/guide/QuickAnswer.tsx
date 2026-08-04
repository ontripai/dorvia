import React from 'react';

interface QuickAnswerProps {
  answer: string;
  isRtl: boolean;
  translations: {
    quickOverview: string;
  };
}

export const QuickAnswer: React.FC<QuickAnswerProps> = ({ answer, isRtl, translations }) => {
  return (
    <div className="p-4 bg-[#f7f9fc] border border-[#dfe6ef] rounded-xl text-xs sm:text-sm text-[#142033]">
      <span className="font-extrabold text-[#2F6FED]">
        {translations.quickOverview}
      </span>
      <span>{answer}</span>
    </div>
  );
};
