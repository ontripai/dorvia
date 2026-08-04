import React from 'react';

interface EligibilityAndExceptionsProps {
  exceptions: string[];
  isRtl: boolean;
  translations: {
    exceptionsTitle: string;
  };
}

export const EligibilityAndExceptions: React.FC<EligibilityAndExceptionsProps> = ({ exceptions, isRtl, translations }) => {
  if (!exceptions || exceptions.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="font-extrabold text-base text-[#142033]">
        {translations.exceptionsTitle}
      </h3>
      <ul className={`text-xs sm:text-sm text-[#526174] space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
        {exceptions.map((ex, idx) => (
          <li key={idx} className="flex items-start space-x-2 rtl:space-x-reverse">
            <span className="text-amber-500 font-bold mt-0.5">⚠️</span>
            <span>{ex}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
