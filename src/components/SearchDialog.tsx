'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { Search, X, ChevronLeft, Landmark, GraduationCap, BriefcaseBusiness, Building2, House } from './Icons';

interface SearchItem {
  id: string;
  title: Record<Language, string>;
  category: Record<Language, string>;
  route: string;
  icon?: React.ReactNode;
}

interface SearchDialogProps {
  currentLang: Language;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  currentLang,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const searchItems: SearchItem[] = [
    {
      id: 'currency',
      title: { fa: 'صرافی، تبدیل پول و نرخ مرجع بانک ملی رومانی', en: 'Currency Exchange & BNR Rates' },
      category: { fa: 'نیازها در رومانی', en: 'Essentials' },
      route: 'needs/currency-exchange',
      icon: <Landmark size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'driving',
      title: { fa: 'گواهینامه رانندگی و شرایط تبدیل گواهینامه', en: 'Driving License Exchange' },
      category: { fa: 'نیازها در رومانی', en: 'Essentials' },
      route: 'needs/driving-license',
      icon: <House size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'translation',
      title: { fa: 'دارالترجمه و مترجمین مجاز وزارت دادگستری', en: 'Authorized Translators & Legalization' },
      category: { fa: 'نیازها در رومانی', en: 'Essentials' },
      route: 'needs/certified-translation',
      icon: <Landmark size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'notary',
      title: { fa: 'دفتر اسناد رسمی و خدمات نوتاری در رومانی', en: 'Notary Public Services' },
      category: { fa: 'نیازها در رومانی', en: 'Essentials' },
      route: 'needs/notary-public',
      icon: <Landmark size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'embassy',
      title: { fa: 'سفارت ایران در بخارست و خدمات سامانه میخک', en: 'Iranian Embassy & Mikhak Portal' },
      category: { fa: 'نیازها در رومانی', en: 'Essentials' },
      route: 'needs/iranian-embassy-and-mikhak',
      icon: <Landmark size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'housing',
      title: { fa: 'راهنمای اجاره و خرید مسکن در رومانی', en: 'Renting & Buying Property' },
      category: { fa: 'نیازها در رومانی', en: 'Essentials' },
      route: 'needs/housing',
      icon: <House size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'checklist',
      title: { fa: 'چک‌لیست روزهای نخست ورود به رومانی', en: 'First-Days Arrival Checklist' },
      category: { fa: 'نیازها در رومانی', en: 'Essentials' },
      route: 'needs/first-days-checklist',
      icon: <House size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'economy',
      title: { fa: 'اقتصاد رومانی، صنایع، درآمدها و حقوق قانونی', en: 'Economy of Romania & Industry Wages' },
      category: { fa: 'شناخت رومانی', en: 'Discover Romania' },
      route: 'romania/economy',
      icon: <Building2 size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'society',
      title: { fa: 'جامعه، زبان و آداب زندگی اجتماعی در رومانی', en: 'Romanian Society & Social Etiquette' },
      category: { fa: 'شناخت رومانی', en: 'Discover Romania' },
      route: 'romania/society',
      icon: <Building2 size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'culture',
      title: { fa: 'فرهنگ، هنر، معماری و جاذبه‌های رومانی', en: 'Culture, Arts & Heritage' },
      category: { fa: 'شناخت رومانی', en: 'Discover Romania' },
      route: 'romania/culture-and-arts',
      icon: <Building2 size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'laws',
      title: { fa: 'قوانین و مقررات مهم مهاجرت، کار و کارفرمایی', en: 'Laws & Regulatory Overview' },
      category: { fa: 'شناخت رومانی', en: 'Discover Romania' },
      route: 'romania/laws-and-regulations',
      icon: <Building2 size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'tourism',
      title: { fa: 'راهنمای گردشگری و برنامه‌های سفر در رومانی', en: 'Romania Tourism & Travel Guides' },
      category: { fa: 'شناخت رومانی', en: 'Discover Romania' },
      route: 'romania/tourism',
      icon: <Building2 size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'study',
      title: { fa: 'تحصیل در دانشگاه‌های معتبر رومانی', en: 'Study in Romanian Universities' },
      category: { fa: 'تحصیل', en: 'Study' },
      route: 'study',
      icon: <GraduationCap size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'work',
      title: { fa: 'ویزای کار و مجوز اشتغال Aviz de Munca', en: 'Work Permit & Employment' },
      category: { fa: 'کار', en: 'Work' },
      route: 'work',
      icon: <BriefcaseBusiness size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'company',
      title: { fa: 'ثبت شرکت SRL و قوانین مالیاتی رومانی', en: 'Company Formation (SRL) & Tax Rules' },
      category: { fa: 'کسب‌وکار', en: 'Business' },
      route: 'company',
      icon: <Building2 size={16} className="text-[#2F6FED]" />
    }
  ];

  const normalize = (str: string) => str.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, ' ').trim();

  const filteredResults = searchItems.filter(item => {
    if (!query.trim()) return true;
    const q = normalize(query);
    const titleFa = normalize(item.title.fa);
    const titleEn = normalize(item.title.en);
    return titleFa.includes(q) || titleEn.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#071B3D]/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 lg:p-20 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#dfe6ef] flex flex-col max-h-[80vh]">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#dfe6ef] flex items-center space-x-3 rtl:space-x-reverse bg-[#f7f9fc]">
          <Search size={20} className="text-[#2F6FED] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={currentLang === 'fa' ? 'جستجوی راهنماها، خدمات، شهرها و قوانین...' : 'Search guides, services, cities & laws...'}
            className="w-full bg-transparent border-none text-sm sm:text-base font-semibold text-[#142033] focus:outline-none placeholder-[#788697]"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-200 text-[#142033] hover:bg-slate-300 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {filteredResults.length === 0 ? (
            <div className="text-center py-10 text-xs sm:text-sm text-[#788697]">
              {currentLang === 'fa' ? 'نتیجه‌ای برای عبارت جستجویافته پیدا نشد.' : 'No results found for your search query.'}
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.route);
                  onClose();
                }}
                className="w-full text-start p-3.5 rounded-xl border border-[#dfe6ef] hover:border-[#2F6FED] hover:bg-[#f3f7ff] transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  {item.icon}
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#142033] group-hover:text-[#2F6FED] transition-colors">
                      {item.title[currentLang]}
                    </h4>
                    <span className="text-[11px] text-[#788697] font-semibold">{item.category[currentLang]}</span>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-[#788697] group-hover:text-[#2F6FED] transition-colors rtl:rotate-0 rotate-180" />
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
