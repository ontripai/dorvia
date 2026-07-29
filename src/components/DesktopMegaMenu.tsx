'use client';

import React, { useEffect, useRef } from 'react';
import { Language } from '../types';
import { ArrowLeft, ArrowRight, GraduationCap, BriefcaseBusiness, Building2, ChartNoAxesCombined, Users, House } from './Icons';

interface DesktopMegaMenuProps {
  type: 'immigration' | 'romania';
  currentLang: Language;
  onNavigate: (route: string) => void;
  onClose: () => void;
  onOpenEvaluationModal: () => void;
}

export const DesktopMegaMenu: React.FC<DesktopMegaMenuProps> = ({
  type,
  currentLang,
  onNavigate,
  onClose,
  onOpenEvaluationModal
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    onClose();
  };

  if (type === 'immigration') {
    return (
      <div
        ref={menuRef}
        className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn"
      >
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 text-xs">
            
            {/* Col 1: Pathways */}
            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'مسیرهای قانونی' : 'Legal Pathways'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li>
                  <button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer">
                    <GraduationCap size={16} className="text-[#0038a8]" />
                    <span>{currentLang === 'fa' ? 'تحصیل در دانشگاه‌ها' : 'University Education'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('work')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer">
                    <BriefcaseBusiness size={16} className="text-[#0038a8]" />
                    <span>{currentLang === 'fa' ? 'اشتغال و مجوز کار' : 'Work Authorization'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('company')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer">
                    <Building2 size={16} className="text-[#0038a8]" />
                    <span>{currentLang === 'fa' ? 'ثبت شرکت (SRL)' : 'Company Registration'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer">
                    <ChartNoAxesCombined size={16} className="text-[#0038a8]" />
                    <span>{currentLang === 'fa' ? 'فرصت‌های سرمایه‌گذاری' : 'Investment Routes'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer">
                    <Users size={16} className="text-[#0038a8]" />
                    <span>{currentLang === 'fa' ? 'پیوست خانواده' : 'Family Reunification'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 2: Steps */}
            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'مراحل و قوانین' : 'Steps & Regulations'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li className="py-1">{currentLang === 'fa' ? '۱. ارزیابی اولیه مدارک' : '1. Initial Document Audit'}</li>
                <li className="py-1">{currentLang === 'fa' ? '۲. دریافت پذیرش / مجوز کار' : '2. Admission / Work Permit'}</li>
                <li className="py-1">{currentLang === 'fa' ? '۳. در خواست ویزای تایپ D' : '3. Type D Visa Application'}</li>
                <li className="py-1">{currentLang === 'fa' ? '۴. ورود و صدور کارت اقامت' : '4. Entry & Residence Card'}</li>
                <li className="py-1">{currentLang === 'fa' ? '۵. تمدید و اقامت دائم EU' : '5. Renewal & EU Residency'}</li>
              </ul>
            </div>

            {/* Col 3: Regional Guidance */}
            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'راهنمای ایرانیان' : 'For Iranian Applicants'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقدام از داخل ایران (سفارت تهران)' : 'Applying from Iran'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقدام از امارات و کشورهای خلیج فارس' : 'Applying from UAE / Gulf'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقدام از ترکیه و اروپا' : 'Applying from Turkey / Europe'}</button></li>
              </ul>
            </div>

            {/* Col 4: Highlight CTA Card */}
            <div className="col-span-3 bg-gradient-to-br from-[#06162d] to-[#0038a8] text-white p-5 rounded-2xl flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#fcd116] uppercase tracking-wider">
                  {currentLang === 'fa' ? 'مشاوره اولیه تخصصی' : 'Personal Assessment'}
                </span>
                <h5 className="font-extrabold text-sm text-white leading-snug">
                  {currentLang === 'fa' ? 'نمیدانید کدام مسیر برای شما مناسب‌تر است؟' : 'Not sure which pathway fits your profile?'}
                </h5>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  {currentLang === 'fa' ? 'شرایط تحصیلی، شغلی و بودجه خود را وارد کنید تا کارشناسان ما دقیق‌ترین مسیر را پیشنهاد دهند.' : 'Submit your details for a personalized eligibility review.'}
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenEvaluationModal();
                }}
                className="mt-4 w-full bg-[#fcd116] hover:bg-yellow-400 text-[#06162d] text-xs font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer"
              >
                <span>{currentLang === 'fa' ? 'شروع ارزیابی رایگان' : 'Start Free Assessment'}</span>
                <ArrowIcon size={14} />
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn"
    >
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-12 gap-8 text-xs">
          
          <div className="col-span-4 space-y-3">
            <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
              {currentLang === 'fa' ? 'کشور رومانی' : 'Discover Romania'}
            </h4>
            <ul className="space-y-2 text-[#526174] font-medium">
              <li><button onClick={() => handleLinkClick('about-romania')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'معرفی عمومی و عضویت در شنگن' : 'General Overview & Schengen Access'}</button></li>
              <li><button onClick={() => handleLinkClick('living')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'هزینه‌های زندگی و مسکن' : 'Cost of Living & Housing'}</button></li>
              <li><button onClick={() => handleLinkClick('about-romania')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقتصاد، فناوری و بازار کار' : 'Economy & Tech Sector'}</button></li>
            </ul>
          </div>

          <div className="col-span-4 space-y-3">
            <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
              {currentLang === 'fa' ? 'شهرهای اصلی' : 'Key Cities'}
            </h4>
            <ul className="space-y-2 text-[#526174] font-medium">
              <li><button onClick={() => handleLinkClick('cities')} className="hover:text-[#0038a8] py-1 cursor-pointer">🏛️ Bucharest (پایتخت و مرکز اقتصادی)</button></li>
              <li><button onClick={() => handleLinkClick('cities')} className="hover:text-[#0038a8] py-1 cursor-pointer">💻 Cluj-Napoca (قطب فناوری و دانشگاهی)</button></li>
              <li><button onClick={() => handleLinkClick('cities')} className="hover:text-[#0038a8] py-1 cursor-pointer">⚙️ Timișoara (مرکز صنعتی و مهندسی)</button></li>
            </ul>
          </div>

          <div className="col-span-4 space-y-3">
            <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
              {currentLang === 'fa' ? 'آموزش عالی' : 'Higher Education'}
            </h4>
            <ul className="space-y-2 text-[#526174] font-medium">
              <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#0038a8] py-1 cursor-pointer">🎓 University of Bucharest</button></li>
              <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#0038a8] py-1 cursor-pointer">🎓 Babeș-Bolyai University (Cluj)</button></li>
              <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#0038a8] py-1 cursor-pointer">🩺 Carol Davila Medical University</button></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
