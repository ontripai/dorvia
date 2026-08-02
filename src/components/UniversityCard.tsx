import React from 'react';
import { University, Language } from '../types';

interface UniversityCardProps {
  university: University;
  currentLang: Language;
  onSelect: (uni: University) => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, currentLang, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-r from-[#071B3D] to-[#2F6FED] p-5 text-white relative">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2F6FED] text-white mb-2">
          {university.ranking}
        </span>
        <h3 className="text-lg font-bold group-hover:text-[#2F6FED] transition-colors leading-snug">
          {university.name[currentLang]}
        </h3>
        <div className="text-xs text-slate-300 mt-1 flex items-center space-x-2 rtl:space-x-reverse">
          <span>📍 {university.city[currentLang]}</span>
          <span>•</span>
          <span>🏛️ {university.type[currentLang]}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4 flex-1">
        <p className="text-xs text-slate-600 leading-relaxed">
          {university.description[currentLang]}
        </p>

        <div className="space-y-1.5 pt-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {currentLang === 'fa' ? 'رشته‌های پرطرفدار:' : 'Popular Programs:'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {university.popularFields[currentLang].map((field, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">{currentLang === 'fa' ? 'حدود شهریه:' : 'Tuition:'}</span>
          <span className="font-bold text-[#071B3D]">{university.tuitionRange[currentLang]}</span>
        </div>
      </div>

      {/* Card Action */}
      <div className="px-5 pb-5 pt-0">
        <button
          onClick={() => onSelect(university)}
          className="w-full py-2.5 bg-slate-50 hover:bg-[#071B3D] text-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-200 hover:border-[#071B3D] flex items-center justify-center space-x-1 rtl:space-x-reverse"
        >
          <span>{currentLang === 'fa' ? 'مشاهده شرایط پذیرش' : 'View Admission Process'}</span>
        </button>
      </div>

    </div>
  );
};
