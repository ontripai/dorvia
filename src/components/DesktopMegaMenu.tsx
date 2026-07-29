'use client';

import React, { useEffect, useRef } from 'react';
import { Language } from '../types';
import { ArrowLeft, ArrowRight, GraduationCap, BriefcaseBusiness, Building2, ChartNoAxesCombined, Users, House, Landmark } from './Icons';
import { Button } from './Button';

interface DesktopMegaMenuProps {
  type: 'immigration' | 'study' | 'business' | 'romania';
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
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
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

  // IMMIGRATION MEGA MENU
  if (type === 'immigration') {
    return (
      <div ref={menuRef} className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 text-xs">
            
            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'مسیرهای اصلی' : 'Main Pathways'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><GraduationCap size={16} className="text-[#0038a8]" /><span>{currentLang === 'fa' ? 'تحصیل در رومانی' : 'Study in Romania'}</span></button></li>
                <li><button onClick={() => handleLinkClick('work')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><BriefcaseBusiness size={16} className="text-[#0038a8]" /><span>{currentLang === 'fa' ? 'کار در رومانی' : 'Work in Romania'}</span></button></li>
                <li><button onClick={() => handleLinkClick('company')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><Building2 size={16} className="text-[#0038a8]" /><span>{currentLang === 'fa' ? 'ثبت شرکت (SRL)' : 'Company Registration'}</span></button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><ChartNoAxesCombined size={16} className="text-[#0038a8]" /><span>{currentLang === 'fa' ? 'فرصت‌های سرمایه‌گذاری' : 'Investment Routes'}</span></button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><Users size={16} className="text-[#0038a8]" /><span>{currentLang === 'fa' ? 'پیوست خانواده' : 'Family Reunification'}</span></button></li>
              </ul>
            </div>

            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'مراحل اقامتی IGI' : 'IGI Residency Steps'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li className="py-1">{currentLang === 'fa' ? '۱. ارزیابی اولیه مدارک' : '1. Initial Document Audit'}</li>
                <li className="py-1">{currentLang === 'fa' ? '۲. صدور پذیرش / مجوز کار' : '2. Admission / Aviz de Munca'}</li>
                <li className="py-1">{currentLang === 'fa' ? '۳. درخواست ویزای تایپ D' : '3. Type D Visa Application'}</li>
                <li className="py-1">{currentLang === 'fa' ? '۴. ورود و صدور کارت اقامت' : '4. Residence Permit Issuance'}</li>
              </ul>
            </div>

            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'اقدام بر اساس محل سکونت' : 'Based on Current Location'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقدام از داخل ایران (سفارت تهران)' : 'Applying from Iran'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقدام از امارات و حوزه خلیج فارس' : 'Applying from UAE / Gulf'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقدام از ترکیه و کشورهای اروپایی' : 'Applying from Turkey / Europe'}</button></li>
              </ul>
            </div>

            <div className="col-span-3 bg-[#06162d] text-white p-5 rounded-2xl flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#fcd116] uppercase tracking-wider">
                  {currentLang === 'fa' ? 'ارزیابی اختصاصی' : 'Personal Audit'}
                </span>
                <h5 className="font-extrabold text-sm text-white leading-snug">
                  {currentLang === 'fa' ? 'مسیر مناسب خود را نمی‌دانید؟' : 'Not sure which pathway fits?'}
                </h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {currentLang === 'fa' ? 'اطلاعات اولیه خود را وارد کنید تا بهترین گزینه برای شما مشخص شود.' : 'Submit your background for a clear pathway recommendation.'}
                </p>
              </div>

              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenEvaluationModal();
                }}
                rightIcon={<ArrowIcon size={14} />}
                className="mt-4 w-full"
              >
                {currentLang === 'fa' ? 'شروع ارزیابی رایگان' : 'Start Free Assessment'}
              </Button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // STUDY MEGA MENU
  if (type === 'study') {
    return (
      <div ref={menuRef} className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 text-xs">
            
            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'راهنمای پذیرش تحصیلی' : 'Admission Guidance'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'مدارک و الزامات ترجمه رسمی' : 'Required Documents & Legalization'}</button></li>
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'ویزای تحصیلی تایپ D/SD' : 'Type D/SD Student Visa'}</button></li>
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'شهریه دانشگاه‌ها و هزینه خوابگاه' : 'Tuition Rates & Dormitories'}</button></li>
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'مجوز کار پاره‌پوقت دانشجویی' : 'Student Work Permits'}</button></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'رشته‌های اصلی' : 'Popular Fields'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] py-1 cursor-pointer">🩺 {currentLang === 'fa' ? 'پزشکی و دندانپزشکی (انگلیسی/فرانسوی)' : 'Medicine & Dentistry (EN/FR)'}</button></li>
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] py-1 cursor-pointer">💻 {currentLang === 'fa' ? 'مهندسی کامپیوتر و IT' : 'Computer Science & IT'}</button></li>
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] py-1 cursor-pointer">⚙️ {currentLang === 'fa' ? 'مهندسی برق و مکانیک' : 'Engineering Degrees'}</button></li>
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#0038a8] py-1 cursor-pointer">📊 {currentLang === 'fa' ? 'مدیریت و تجارت بین‌الملل' : 'Management & Business'}</button></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'دانشگاه‌های برجسته' : 'Featured Universities'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#0038a8] py-1 cursor-pointer">🎓 University of Bucharest</button></li>
                <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#0038a8] py-1 cursor-pointer">🎓 Babeș-Bolyai University (Cluj)</button></li>
                <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#0038a8] py-1 cursor-pointer">🩺 Carol Davila Medicine (Bucharest)</button></li>
                <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#0038a8] py-1 cursor-pointer">⚙️ Polytechnic University of Bucharest</button></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // BUSINESS MEGA MENU
  if (type === 'business') {
    return (
      <div ref={menuRef} className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 text-xs">
            
            <div className="col-span-6 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'ثبت شرکت و تجاری (SRL)' : 'Company Formation (SRL)'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('company')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'مراحل ثبت شرکت SRL و ثبت در اداره ONRC' : 'SRL Incorporation Steps at ONRC'}</button></li>
                <li><button onClick={() => handleLinkClick('company')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'انواع نرخ‌های مالیاتی (۱٪ تا ۱۶٪)' : 'Corporate Tax Options (1% to 16%)'}</button></li>
                <li><button onClick={() => handleLinkClick('company')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'افتتاح حساب بانکی شرکت در بخارست' : 'Corporate Bank Account Setup'}</button></li>
                <li><button onClick={() => handleLinkClick('company')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'شرایط دریافت اقامت مدیرعامل و سهامدار' : 'Executive Residence Criteria'}</button></li>
              </ul>
            </div>

            <div className="col-span-6 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'سرمایه‌گذاری و توسعه' : 'Investment & Expansion'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'سرمایه‌گذاری در املاک و مستغلات' : 'Real Estate Opportunities'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'استارت‌آپ‌ها و فناوری اطلاعات' : 'Tech Startups & Innovation'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'قوانین مالیاتی و گزارش‌دهی سالانه' : 'Annual Tax Compliance'}</button></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ROMANIA MEGA MENU
  return (
    <div ref={menuRef} className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-12 gap-8 text-xs">
          
          <div className="col-span-4 space-y-3">
            <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
              {currentLang === 'fa' ? 'کشور رومانی' : 'Discover Romania'}
            </h4>
            <ul className="space-y-2 text-[#526174] font-medium">
              <li><button onClick={() => handleLinkClick('about-romania')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'معرفی عمومی و عضویت در شنگن' : 'General Overview & Schengen Status'}</button></li>
              <li><button onClick={() => handleLinkClick('living')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'هزینه‌های زندگی، اجاره و مسکن' : 'Cost of Living & Rent'}</button></li>
              <li><button onClick={() => handleLinkClick('about-romania')} className="hover:text-[#0038a8] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقتصاد، فناوری و بازار کار' : 'Economy & Tech Industry'}</button></li>
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
              {currentLang === 'fa' ? 'منابع رسمی' : 'Official Resources'}
            </h4>
            <ul className="space-y-2 text-[#526174] font-medium">
              <li><a href="https://igi.mai.gov.ro" target="_blank" rel="noopener noreferrer" className="hover:text-[#0038a8] flex items-center space-x-1.5 rtl:space-x-reverse py-1 cursor-pointer"><Landmark size={14} className="text-[#0038a8]" /><span>IGI (اداره کل مهاجرت)</span></a></li>
              <li><a href="https://mae.ro" target="_blank" rel="noopener noreferrer" className="hover:text-[#0038a8] flex items-center space-x-1.5 rtl:space-x-reverse py-1 cursor-pointer"><Landmark size={14} className="text-[#0038a8]" /><span>MAE (وزارت امور خارجه)</span></a></li>
              <li><a href="https://edu.ro" target="_blank" rel="noopener noreferrer" className="hover:text-[#0038a8] flex items-center space-x-1.5 rtl:space-x-reverse py-1 cursor-pointer"><Landmark size={14} className="text-[#0038a8]" /><span>EDU (وزارت آموزش)</span></a></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
