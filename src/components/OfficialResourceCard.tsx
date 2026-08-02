import React from 'react';
import { Language } from '../types';
import { Landmark, ExternalLink } from './Icons';

interface OfficialResourceCardProps {
  currentLang: Language;
  title: string;
  category: string;
  domain: string;
  url: string;
  lastChecked: string;
}

export const OfficialResourceCard: React.FC<OfficialResourceCardProps> = ({
  currentLang,
  title,
  category,
  domain,
  url,
  lastChecked
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="editorial-card p-5 bg-white border border-[#dfe6ef] flex flex-col justify-between space-y-4 hover:border-[#2F6FED] group transition-all"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#788697]">
          <span className="bg-[#eef3f8] px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#142033]">
            {category}
          </span>
          <ExternalLink size={14} className="group-hover:text-[#2F6FED] transition-colors" />
        </div>

        <div className="flex items-start space-x-3 rtl:space-x-reverse pt-1">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2F6FED] flex items-center justify-center shrink-0">
            <Landmark size={18} />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#142033] group-hover:text-[#2F6FED] transition-colors leading-snug">
              {title}
            </h4>
            <span className="text-[11px] text-[#2F6FED] font-semibold">{domain}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#dfe6ef] flex items-center justify-between text-[11px] text-[#788697]">
        <span>{currentLang === 'fa' ? 'تایید منبع رسمی' : 'Verified Official Portal'}</span>
        <span>{lastChecked}</span>
      </div>
    </a>
  );
};
