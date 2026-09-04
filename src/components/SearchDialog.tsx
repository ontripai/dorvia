'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { Search, X, ChevronLeft, Landmark, GraduationCap, BriefcaseBusiness, Building2, House, Users, Home, Scale, MessageSquare, PhoneCall } from './Icons';

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
      id: 'start-here',
      title: { fa: 'شروع از اینجا — راهنمای گام به گام مهاجرت', en: 'Start Here — Step-by-step Relocation Guide' },
      category: { fa: 'شروع از اینجا', en: 'Start Here' },
      route: 'start-here',
      icon: <Home size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'planning-to-come',
      title: { fa: 'قصد آمدن به رومانی دارم — چک‌لیست قبل از سفر', en: 'Planning to come to Romania — Pre-departure' },
      category: { fa: 'شروع از اینجا', en: 'Start Here' },
      route: 'start-here/planning-to-come',
      icon: <Home size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'newly-arrived',
      title: { fa: 'به‌تازگی وارد رومانی شده‌ام — سه روز اول', en: 'Just arrived in Romania — First 3 Days' },
      category: { fa: 'شروع از اینجا', en: 'Start Here' },
      route: 'start-here/newly-arrived',
      icon: <Home size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'immigration',
      title: { fa: 'مهاجرت و اقامت در رومانی — مسیرها و مراحل IGI', en: 'Immigration & Residence in Romania — IGI Pathways' },
      category: { fa: 'مهاجرت و اقامت', en: 'Immigration' },
      route: 'immigration',
      icon: <Users size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'citizenship',
      title: { fa: 'تابعیت رومانی — شرایط و مراحل درخواست', en: 'Romanian Citizenship — Requirements & Process' },
      category: { fa: 'مهاجرت و اقامت', en: 'Immigration' },
      route: 'immigration/citizenship',
      icon: <Users size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'family-reunification',
      title: { fa: 'پیوست خانواده — اقامت برای همسر و فرزندان', en: 'Family Reunification — Spouse & Children Residence' },
      category: { fa: 'مهاجرت و اقامت', en: 'Immigration' },
      route: 'immigration/family-reunification',
      icon: <Users size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'long-term-residence',
      title: { fa: 'اقامت بلندمدت (دائم) در رومانی', en: 'Long-term Residence in Romania' },
      category: { fa: 'مهاجرت و اقامت', en: 'Immigration' },
      route: 'immigration/long-term-residence',
      icon: <Users size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'universities',
      title: { fa: 'دانشگاه‌های رومانی — همه رشته‌ها و شهریه‌ها', en: 'Universities in Romania — Fields & Tuition' },
      category: { fa: 'تحصیل', en: 'Study' },
      route: 'universities',
      icon: <GraduationCap size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'scholarships',
      title: { fa: 'بورسیه تحصیلی دولتی رومانی', en: 'Romanian Government Scholarships' },
      category: { fa: 'تحصیل', en: 'Study' },
      route: 'study/scholarships',
      icon: <GraduationCap size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'cities',
      title: { fa: 'شهرهای اصلی رومانی — بخارست، کلوژ، تیمیشوارا', en: 'Key Romanian Cities — Bucharest, Cluj, Timișoara' },
      category: { fa: 'شناخت رومانی', en: 'Discover Romania' },
      route: 'romania/cities',
      icon: <Building2 size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'legal-privacy',
      title: { fa: 'حریم خصوصی، شرایط استفاده و سلب مسئولیت', en: 'Privacy, Terms & Disclaimer' },
      category: { fa: 'صفحات حقوقی', en: 'Legal' },
      route: 'legal/privacy',
      icon: <Scale size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'articles',
      title: { fa: 'مقالات و راهنماهای تکمیلی', en: 'Articles & Additional Guides' },
      category: { fa: 'مقالات', en: 'Articles' },
      route: 'articles',
      icon: <MessageSquare size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'about',
      title: { fa: 'درباره ما — تیم DORVIA EUROP', en: 'About Us — The DORVIA EUROP Team' },
      category: { fa: 'درباره ما', en: 'About' },
      route: 'about',
      icon: <Landmark size={16} className="text-[#2F6FED]" />
    },
    {
      id: 'contact',
      title: { fa: 'تماس با ما و مشاوره', en: 'Contact Us & Consultation' },
      category: { fa: 'تماس', en: 'Contact' },
      route: 'contact',
      icon: <PhoneCall size={16} className="text-[#2F6FED]" />
    },
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
      id: 'romanian-language',
      title: { fa: 'آموزش زبان رومانیایی — دوره‌های رایگان و خصوصی', en: 'Romanian Language Courses — Free & Private' },
      category: { fa: 'نیازها در رومانی', en: 'Essentials' },
      route: 'needs/romanian-language-courses',
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
