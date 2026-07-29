import React from 'react';
import { City, Language } from '../types';

interface CityCardProps {
  city: City;
  currentLang: Language;
  onSelect: (city: City) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, currentLang, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      
      {/* Header Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-900 to-indigo-900 p-5 text-white relative flex flex-col justify-end">
        <span className="absolute top-4 right-4 rtl:right-auto rtl:left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur text-white border border-white/30">
          {city.romanianName}
        </span>
        <h3 className="text-xl font-extrabold group-hover:text-[#FCD116] transition-colors">
          {city.name[currentLang]}
        </h3>
        <p className="text-xs text-slate-300">
          📍 {city.region[currentLang]} • {city.population}
        </p>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-4 flex-1">
        <p className="text-xs text-slate-600 leading-relaxed">
          {city.description[currentLang]}
        </p>

        <div className="space-y-1.5 pt-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {currentLang === 'fa' ? 'ویژگی‌های کلیدی:' : 'Key Highlights:'}
          </div>
          <ul className="space-y-1 text-xs text-slate-700">
            {city.highlights[currentLang].map((highlight, idx) => (
              <li key={idx} className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Action */}
      <div className="px-5 pb-5 pt-0">
        <button
          onClick={() => onSelect(city)}
          className="w-full py-2.5 bg-blue-50 hover:bg-[#002B7F] text-[#002B7F] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 rtl:space-x-reverse"
        >
          <span>{currentLang === 'fa' ? 'راهنمای زندگی و تحصیل در این شهر' : 'City & University Guide'}</span>
        </button>
      </div>

    </div>
  );
};
