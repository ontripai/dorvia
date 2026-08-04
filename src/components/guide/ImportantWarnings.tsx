import React from 'react';

interface ImportantWarningsProps {
  warnings: string[];
  isRtl: boolean;
  translations: {
    warningsTitle: string;
  };
}

export const ImportantWarnings: React.FC<ImportantWarningsProps> = ({ warnings, isRtl, translations }) => {
  if (!warnings || warnings.length === 0) return null;
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
      <h3 className="font-extrabold text-sm sm:text-base text-red-900 flex items-center space-x-2 rtl:space-x-reverse">
        <span>⚠️</span>
        <span>{translations.warningsTitle}</span>
      </h3>
      <ul className="text-xs sm:text-sm text-red-800 space-y-2">
        {warnings.map((warn, idx) => (
          <li key={idx} className="flex items-start space-x-2 rtl:space-x-reverse">
            <span className="font-bold mt-0.5">•</span>
            <span>{warn}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
