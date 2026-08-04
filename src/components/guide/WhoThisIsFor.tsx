import React from 'react';

interface WhoThisIsForProps {
  audiences: string[];
  isRtl: boolean;
  translations: {
    appliesTo: string;
  };
}

export const WhoThisIsFor: React.FC<WhoThisIsForProps> = ({ audiences, isRtl, translations }) => {
  if (!audiences || audiences.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="font-extrabold text-base text-[#142033]">
        {translations.appliesTo}
      </h3>
      <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#526174] ${isRtl ? 'text-right' : 'text-left'}`}>
        {audiences.map((aud, idx) => (
          <li key={idx} className="p-2.5 bg-[#f8fafc] rounded-lg border border-[#dfe6ef] flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-blue-600 font-bold">•</span>
            <span>{aud}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
