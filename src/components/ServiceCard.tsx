import React from 'react';
import Link from 'next/link';
import { ServiceItem, Language } from '../types';

interface ServiceCardProps {
  service: ServiceItem;
  currentLang: Language;
  onSelect?: (service: ServiceItem) => void;
  href?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, currentLang, onSelect, href }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#071B3D]/10 text-[#071B3D] flex items-center justify-center text-2xl mb-4 group-hover:bg-[#071B3D] group-hover:text-white transition-colors">
          ✦
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#071B3D] transition-colors mb-2">
          {service.title[currentLang]}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          {service.shortDesc[currentLang]}
        </p>

        <div className="space-y-2 mb-6">
          {service.features[currentLang].map((feat, idx) => (
            <div key={idx} className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-700">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-[#071B3D] flex items-center justify-center text-[10px] font-bold">✓</span>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {href ? (
        <Link
          href={href}
          className="w-full mt-6 py-3 bg-[#eef3f8] hover:bg-[#071B3D] text-[#071B3D] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse group/btn block text-center"
        >
          <span>{currentLang === 'fa' ? 'جزئیات خدمات و مشاوره' : 'Request This Service'}</span>
          <span className="group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform">→</span>
        </Link>
      ) : (
        <button
          onClick={() => onSelect && onSelect(service)}
          className="w-full mt-6 py-3 bg-[#eef3f8] hover:bg-[#071B3D] text-[#071B3D] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse group/btn"
        >
          <span>{currentLang === 'fa' ? 'جزئیات خدمات و مشاوره' : 'Request This Service'}</span>
          <span className="group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform">→</span>
        </button>
      )}
    </div>
  );
};
