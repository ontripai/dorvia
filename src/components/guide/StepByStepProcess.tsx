import React from 'react';

interface StepByStepProcessProps {
  steps: Array<{ title: string; description: string }>;
  isRtl: boolean;
  translations: {
    stepsTitle: string;
  };
}

export const StepByStepProcess: React.FC<StepByStepProcessProps> = ({ steps, isRtl, translations }) => {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="space-y-3">
      <h3 className="font-extrabold text-base text-[#142033]">
        {translations.stepsTitle}
      </h3>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
        {steps.map((step, idx) => (
          <div key={idx} className="p-4 bg-[#f7f9fc] rounded-xl border border-[#dfe6ef] space-y-1">
            <span className="font-extrabold text-[#2F6FED]">
              {isRtl ? `گام ${idx + 1}: ` : `Step ${idx + 1}: `} {step.title}
            </span>
            <p className="text-[#526174] leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
