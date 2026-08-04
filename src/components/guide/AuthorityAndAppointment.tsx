import React from 'react';

interface AuthorityAndAppointmentProps {
  authority?: string;
  actionLink?: {
    url: string;
    label: string;
  };
  isRtl: boolean;
  translations: {
    authorityTitle: string;
    actionLabel: string;
  };
}

export const AuthorityAndAppointment: React.FC<AuthorityAndAppointmentProps> = ({ authority, actionLink, isRtl, translations }) => {
  if (!authority && !actionLink) return null;

  return (
    <div className={`p-4 bg-slate-50 border border-[#dfe6ef] rounded-xl text-xs sm:text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
      {authority && (
        <div className="mb-2">
          <span className="font-extrabold text-[#142033]">{translations.authorityTitle}: </span>
          <span className="text-[#526174]">{authority}</span>
        </div>
      )}
      {actionLink && (
        <div className="mt-4">
          <a href={actionLink.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-[#2F6FED] hover:bg-[#1a51ba] text-white font-bold rounded-lg transition-colors">
            <span>{actionLink.label || translations.actionLabel}</span>
            <span>{isRtl ? '←' : '→'}</span>
          </a>
        </div>
      )}
    </div>
  );
};
