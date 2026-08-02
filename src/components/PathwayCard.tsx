import React from 'react';
import { Language } from '../types';
import { ArrowLeft, ArrowRight } from './Icons';

interface PathwayCardProps {
  currentLang: Language;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  onClick: () => void;
}

export const PathwayCard: React.FC<PathwayCardProps> = ({
  currentLang,
  title,
  desc,
  icon: IconComp,
  badge,
  onClick
}) => {
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  return (
    <div
      onClick={onClick}
      className="editorial-card p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
    >
      {/* Subtle Top Blue Hover Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F6FED] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2F6FED] flex items-center justify-center group-hover:bg-[#2F6FED] group-hover:text-white transition-colors">
            <IconComp size={22} />
          </div>

          {badge && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#eef3f8] text-[#142033] border border-[#dfe6ef]">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#142033] group-hover:text-[#2F6FED] transition-colors mb-2">
          {title}
        </h3>

        <p className="text-[#526174] text-xs sm:text-sm leading-relaxed mb-6">
          {desc}
        </p>
      </div>

      <div className="pt-4 border-t border-[#dfe6ef] flex items-center justify-between text-xs font-bold text-[#2F6FED]">
        <span>{currentLang === 'fa' ? 'بررسی شرایط و اطلاعات بیشتر' : 'Explore Pathway Details'}</span>
        <ArrowIcon size={16} className="transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
