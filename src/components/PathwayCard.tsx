import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { ArrowLeft, ArrowRight } from './Icons';

export type PathwayAccent = 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'teal';

const ACCENT_STYLES: Record<PathwayAccent, { bg: string; text: string; hoverBg: string }> = {
  blue:    { bg: 'bg-blue-50',    text: 'text-[#2F6FED]', hoverBg: 'group-hover:bg-[#2F6FED]' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-600' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',  hoverBg: 'group-hover:bg-amber-600' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600', hoverBg: 'group-hover:bg-violet-600' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',   hoverBg: 'group-hover:bg-rose-600' },
  teal:    { bg: 'bg-teal-50',    text: 'text-teal-600',   hoverBg: 'group-hover:bg-teal-600' },
};

interface PathwayCardProps {
  currentLang: Language;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  href: string;
  accentColor?: PathwayAccent;
}

export const PathwayCard: React.FC<PathwayCardProps> = ({
  currentLang,
  title,
  desc,
  icon: IconComp,
  badge,
  href,
  accentColor = 'blue',
}) => {
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;
  const accent = ACCENT_STYLES[accentColor];

  return (
    <Link
      href={href}
      className="editorial-card p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden block"
    >
      {/* Subtle Top Blue Hover Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F6FED] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${accent.bg} ${accent.text} flex items-center justify-center ${accent.hoverBg} group-hover:text-white transition-colors`}>
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
    </Link>
  );
};
