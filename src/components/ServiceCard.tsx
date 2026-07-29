import React from 'react';
import { ServiceItem, Language } from '../types';

interface ServiceCardProps {
  service: ServiceItem;
  currentLang: Language;
  onSelect: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, currentLang, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#002B7F]/10 text-[#002B7F] flex items-center justify-center text-2xl mb-4 group-hover:bg-[#002B7F] group-hover:text-white transition-colors">
          ✦
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#002B7F] transition-colors mb-2">
          {service.title[currentLang]}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          {service.shortDesc[currentLang]}
        </p>

        <div className="space-y-2 mb-6">
          {service.features[currentLang].map((feat, idx) => (
            <div key={idx} className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-700">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-[#002B7F] flex items-center justify-center text-[10px] font-bold">✓</span>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSelect(service)}
        className="w-full py-3 bg-[#002B7F] hover:bg-[#002266] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all"
      >
        {currentLang === 'fa' ? 'جزئیات خدمات و مشاوره' : 'Service Details & Consultation'}
      </button>
    </div>
  );
};
