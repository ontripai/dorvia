import React from 'react';
import { OfficialSource } from '../../types/content';

interface OfficialSourcesProps {
  sources: OfficialSource[];
  isRtl: boolean;
  translations: {
    sourcesTitle: string;
    accessedOn: string;
  };
}

export const OfficialSources: React.FC<OfficialSourcesProps> = ({ sources, isRtl, translations }) => {
  if (!sources || sources.length === 0) return null;
  return (
    <div className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
      <h3 className="font-extrabold text-lg text-[#142033] border-b border-[#dfe6ef] pb-2">
        {translations.sourcesTitle}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source, idx) => (
          <div key={idx} className="p-4 bg-white border border-[#dfe6ef] rounded-xl shadow-sm space-y-2">
            <h4 className="font-bold text-sm text-[#2F6FED]">
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {source.sourceTitle}
              </a>
            </h4>
            <div className="text-xs text-[#526174] space-y-1">
              <p><span className="font-semibold">{source.organization}</span></p>
              {source.applicableSection && <p>Section: {source.applicableSection}</p>}
              <p className="text-[#94a3b8]">{translations.accessedOn}: {source.dateAccessed}</p>
            </div>
            <div className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-[10px] text-slate-600 font-semibold">
              {source.sourceType.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
