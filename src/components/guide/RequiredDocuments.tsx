import React from 'react';

interface RequiredDocumentsProps {
  documents: Array<{ name: string; description?: string; isMandatory: boolean }>;
  isRtl: boolean;
  translations: {
    documentsTitle: string;
  };
}

export const RequiredDocuments: React.FC<RequiredDocumentsProps> = ({ documents, isRtl, translations }) => {
  if (!documents || documents.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="font-extrabold text-base text-[#142033]">
        {translations.documentsTitle}
      </h3>
      <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#526174] ${isRtl ? 'text-right' : 'text-left'}`}>
        {documents.map((doc, idx) => (
          <li key={idx} className="p-2.5 bg-[#f8fafc] rounded-lg border border-[#dfe6ef] flex items-start space-x-2 rtl:space-x-reverse">
            <span className={doc.isMandatory ? "text-emerald-600 font-bold mt-0.5" : "text-gray-400 font-bold mt-0.5"}>
              {doc.isMandatory ? '✓' : '○'}
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-[#142033]">{doc.name}</span>
              {doc.description && <span className="text-xs text-[#64748b] mt-0.5">{doc.description}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
