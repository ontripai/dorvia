import React from 'react';
import { Language } from '../types';

interface PathwayCardProps {
  currentLang: Language;
  title: string;
  desc: string;
  icon: string;
  badge?: string;
  onClick: () => void;
}

export const PathwayCard: React.FC<PathwayCardProps> = ({ currentLang, title, desc, icon, badge, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Hover Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002B7F] via-[#FCD116] to-[#CE1126] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#002B7F] flex items-center justify-center text-2xl group-hover:bg-[#002B7F] group-hover:text-white transition-colors">
            {icon}
          </div>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#002B7F] transition-colors mb-2">
          {title}
        </h3>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
          {desc}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#002B7F]">
        <span>{currentLang === 'fa' ? 'اطلاعات بیشتر و شرایط' : 'Learn More & Requirements'}</span>
        <span className="transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
          {currentLang === 'fa' ? '←' : '→'}
        </span>
      </div>
    </div>
  );
};
