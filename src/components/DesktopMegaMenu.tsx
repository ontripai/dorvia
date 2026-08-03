'use client';

import React, { useEffect, useRef } from 'react';
import { Language } from '../types';
import { ArrowLeft, ArrowRight, GraduationCap, BriefcaseBusiness, Building2, ChartNoAxesCombined, Users, House, Landmark } from './Icons';
import { Button } from './Button';

interface DesktopMegaMenuProps {
  type: 'starthere' | 'immigration' | 'study' | 'work' | 'business' | 'needs' | 'romania';
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

  // 0. START HERE MEGA MENU
  if (type === 'starthere') {
    return (
      <div ref={menuRef} className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 text-xs">
            
            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'وضعیت شما' : 'Your Status'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('start-here/planning-to-come')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🎯 {currentLang === 'fa' ? 'قصد آمدن به رومانی دارم' : 'Planning to come'}</button></li>
                <li><button onClick={() => handleLinkClick('start-here/just-arrived')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🛬 {currentLang === 'fa' ? 'به‌تازگی وارد شده‌ام' : 'Just arrived'}</button></li>
                <li><button onClick={() => handleLinkClick('start-here/living-here')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🏠 {currentLang === 'fa' ? 'در رومانی زندگی می‌کنم' : 'Living in Romania'}</button></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'چک‌لیست‌ها' : 'Checklists'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('start-here/pre-departure-checklist')} className="hover:text-[#2F6FED] py-1 cursor-pointer">📋 {currentLang === 'fa' ? 'چک‌لیست قبل از سفر' : 'Pre-departure Checklist'}</button></li>
                <li><button onClick={() => handleLinkClick('start-here/first-three-days')} className="hover:text-[#2F6FED] py-1 cursor-pointer">⏱️ {currentLang === 'fa' ? 'سه روز اول' : 'First 3 Days'}</button></li>
                <li><button onClick={() => handleLinkClick('start-here/first-month')} className="hover:text-[#2F6FED] py-1 cursor-pointer">📅 {currentLang === 'fa' ? 'ماه اول' : 'First Month'}</button></li>
              </ul>
            </div>

            <div className="col-span-4 bg-[#071B3D] text-white p-5 rounded-2xl flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#2F6FED] uppercase tracking-wider">
                  {currentLang === 'fa' ? 'شروع سریع' : 'Quick Start'}
                </span>
                <h5 className="font-extrabold text-sm text-white leading-snug">
                  {currentLang === 'fa' ? 'ارزیابی اولیه' : 'Initial Assessment'}
                </h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {currentLang === 'fa' ? 'مسیر مهاجرتی خود را با پر کردن فرم ارزیابی ما آغاز کنید.' : 'Start your journey by filling out our free assessment form.'}
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

  // 1. IMMIGRATION MEGA MENU
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
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><GraduationCap size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'تحصیل در رومانی' : 'Study in Romania'}</span></button></li>
                <li><button onClick={() => handleLinkClick('work')} className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><BriefcaseBusiness size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'کار در رومانی' : 'Work in Romania'}</span></button></li>
                <li><button onClick={() => handleLinkClick('company')} className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><Building2 size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'ثبت شرکت (SRL)' : 'Company Registration'}</span></button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><ChartNoAxesCombined size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'فرصت‌های سرمایه‌گذاری' : 'Investment Routes'}</span></button></li>
                <li><button onClick={() => handleLinkClick('immigration/family-reunification')} className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><Users size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'پیوست خانواده' : 'Family Reunification'}</span></button></li>
                <li><button onClick={() => handleLinkClick('immigration/residence-renewal')} className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><Users size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'تمدید اقامت' : 'Residence Renewal'}</span></button></li>
                <li><button onClick={() => handleLinkClick('immigration/long-term-residence')} className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><BriefcaseBusiness size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'اقامت بلندمدت' : 'Long-term Residence'}</span></button></li>
                <li><button onClick={() => handleLinkClick('immigration/citizenship')} className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer"><Building2 size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'تابعیت' : 'Citizenship'}</span></button></li>
              </ul>
            </div>

            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'مراحل اقامتی IGI' : 'IGI Residency Steps'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('immigration/igi-process')} className="hover:text-[#2F6FED] py-1 cursor-pointer text-right w-full">{currentLang === 'fa' ? '۱. ارزیابی اولیه مدارک' : '1. Initial Document Audit'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration/igi-process')} className="hover:text-[#2F6FED] py-1 cursor-pointer text-right w-full">{currentLang === 'fa' ? '۲. صدور ویزای بلندمدت (نوع D)' : '2. Long-stay Visa (Type D)'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration/igi-process')} className="hover:text-[#2F6FED] py-1 cursor-pointer text-right w-full">{currentLang === 'fa' ? '۳. درخواست کارت اقامت موقت' : '3. Temporary Residence Permit'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration/igi-process')} className="hover:text-[#2F6FED] py-1 cursor-pointer text-right w-full">{currentLang === 'fa' ? '۴. ورود و صدور کارت اقامت' : '4. Arrival & Permit Issuance'}</button></li>
              </ul>

            </div>

            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'اقدام بر اساس محل سکونت' : 'Based on Current Location'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقدام از داخل ایران (سفارت تهران)' : 'Applying from Iran'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقدام از امارات و حوزه خلیج فارس' : 'Applying from UAE / Gulf'}</button></li>
                <li><button onClick={() => handleLinkClick('immigration')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'اقدام از ترکیه و کشورهای اروپایی' : 'Applying from Turkey / Europe'}</button></li>
              </ul>
            </div>

            <div className="col-span-3 bg-[#071B3D] text-white p-5 rounded-2xl flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#2F6FED] uppercase tracking-wider">
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

  // 2. STUDY MEGA MENU
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
                <li><button onClick={() => handleLinkClick('study/requirements')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'مدارک و الزامات پذیرش' : 'Required Documents & Legalization'}</button></li>
                <li><button onClick={() => handleLinkClick('study/visa-type-d')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'ویزای تحصیلی تایپ D' : 'Type D/SD Student Visa'}</button></li>
                <li><button onClick={() => handleLinkClick('study/tuition-overview')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'شهریه‌های تحصیلی (نمای کلی)' : 'Tuition Rates & Dormitories'}</button></li>
                <li><button onClick={() => handleLinkClick('study/preparatory-year')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'سال زبان (پیش‌دانشگاهی)' : 'Language Preparatory Year'}</button></li>
                <li><button onClick={() => handleLinkClick('study/scholarships')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'بورسیه تحصیلی دولتی' : 'Government Scholarships'}</button></li>
                <li><button onClick={() => handleLinkClick('study/part-time-work')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'مجوز کار پاره‌وقت دانشجویی' : 'Student Work Permits'}</button></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'رشته‌های اصلی' : 'Popular Fields'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🩺 {currentLang === 'fa' ? 'پزشکی و دندانپزشکی (انگلیسی/فرانسوی)' : 'Medicine & Dentistry (EN/FR)'}</button></li>
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#2F6FED] py-1 cursor-pointer">💻 {currentLang === 'fa' ? 'مهندسی کامپیوتر و IT' : 'Computer Science & IT'}</button></li>
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#2F6FED] py-1 cursor-pointer">⚙️ {currentLang === 'fa' ? 'مهندسی برق و مکانیک' : 'Engineering Degrees'}</button></li>
                <li><button onClick={() => handleLinkClick('study')} className="hover:text-[#2F6FED] py-1 cursor-pointer">📊 {currentLang === 'fa' ? 'مدیریت و تجارت بین‌الملل' : 'Management & Business'}</button></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'دانشگاه‌های برجسته' : 'Featured Universities'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🎓 University of Bucharest</button></li>
                <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🎓 Babeș-Bolyai University (Cluj)</button></li>
                <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🩺 Carol Davila Medicine (Bucharest)</button></li>
                <li><button onClick={() => handleLinkClick('universities')} className="hover:text-[#2F6FED] py-1 cursor-pointer">⚙️ Polytechnic University of Bucharest</button></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 3. WORK MEGA MENU
  if (type === 'work') {
    return (
      <div ref={menuRef} className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 text-xs">
            
            <div className="col-span-6 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'اشتغال در رومانی' : 'Employment in Romania'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('work/find-job')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'پیدا کردن کار' : 'Find a Job'}</button></li>
                <li><button onClick={() => handleLinkClick('work/permit')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'مجوز کار (Aviz de Muncă)' : 'Work Permit'}</button></li>
                <li><button onClick={() => handleLinkClick('work/visa')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'ویزای کاری' : 'Work Visa'}</button></li>
              </ul>
            </div>

            <div className="col-span-6 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'قرارداد و شرایط' : 'Contracts & Conditions'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('work/contract')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'قرارداد استخدام' : 'Employment Contract'}</button></li>
                <li><button onClick={() => handleLinkClick('work/tax')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'حقوق و مالیات' : 'Salary & Tax'}</button></li>
                <li><button onClick={() => handleLinkClick('work/insurance')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'بیمه (اجتماعی/درمانی)' : 'Insurance'}</button></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 4. BUSINESS MEGA MENU
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
                <li><button onClick={() => handleLinkClick('company/registration')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'مراحل ثبت شرکت SRL و ثبت در اداره ONRC' : 'SRL Incorporation Steps at ONRC'}</button></li>
                <li><button onClick={() => handleLinkClick('company/tax-types')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'انواع نرخ‌های مالیاتی (۱٪ تا ۱۶٪)' : 'Corporate Tax Options (1% to 16%)'}</button></li>
                <li><button onClick={() => handleLinkClick('company/bank-account')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'افتتاح حساب بانکی شرکت در بخارست' : 'Corporate Bank Account Setup'}</button></li>
                <li><button onClick={() => handleLinkClick('company/residency')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'شرایط دریافت اقامت مدیرعامل و سهامدار' : 'Executive Residence Criteria'}</button></li>
              </ul>
            </div>

            <div className="col-span-6 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'سرمایه‌گذاری و توسعه' : 'Investment & Expansion'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('company/real-estate-investment')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'سرمایه‌گذاری در املاک و مستغلات' : 'Real Estate Opportunities'}</button></li>
                <li><button onClick={() => handleLinkClick('company/startup-tech-investment')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'استارت‌آپ‌ها و فناوری اطلاعات' : 'Tech Startups & Innovation'}</button></li>
                <li><button onClick={() => handleLinkClick('company/annual-tax-reporting')} className="hover:text-[#2F6FED] py-1 cursor-pointer">{currentLang === 'fa' ? 'قوانین مالیاتی و گزارش‌دهی سالانه' : 'Annual Tax Compliance'}</button></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 4. NEEDS MEGA MENU ("نیازها در رومانی")
  if (type === 'needs') {
    return (
      <div ref={menuRef} className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 text-xs">
            
            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'امور اداری و رسمی' : 'Official Services'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('needs/currency-exchange')} className="hover:text-[#2F6FED] py-1 cursor-pointer">💵 {currentLang === 'fa' ? 'صرافی و تبدیل پول (نرخ مرجع BNR)' : 'Currency Exchange & BNR Rates'}</button></li>
                <li><button onClick={() => handleLinkClick('needs/driving-license')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🚗 {currentLang === 'fa' ? 'گواهینامه رانندگی و شرایط تبدیل' : 'Driving License Exchange'}</button></li>
                <li><button onClick={() => handleLinkClick('needs/certified-translation')} className="hover:text-[#2F6FED] py-1 cursor-pointer">📄 {currentLang === 'fa' ? 'دارالترجمه و مترجمین مجاز دادگستری' : 'Authorized Certified Translators'}</button></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'استقرار و حقوقی' : 'Housing & Consular'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><button onClick={() => handleLinkClick('needs/notary-public')} className="hover:text-[#2F6FED] py-1 cursor-pointer">⚖️ {currentLang === 'fa' ? 'دفتر اسناد رسمی (Notar Public)' : 'Notary Public Services'}</button></li>
                <li><button onClick={() => handleLinkClick('needs/iranian-embassy-and-mikhak')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🇮🇷 {currentLang === 'fa' ? 'سفارت ایران در بخارست و سامانه میخک' : 'Iranian Embassy & Mikhak System'}</button></li>
                <li><button onClick={() => handleLinkClick('needs/housing')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🏠 {currentLang === 'fa' ? 'راهنمای اجاره و خرید مسکن' : 'Renting & Buying Property'}</button></li>
              </ul>
            </div>

            <div className="col-span-4 bg-[#071B3D] text-white p-5 rounded-2xl flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#2F6FED] uppercase tracking-wider">
                  {currentLang === 'fa' ? 'تازه واردین' : 'New Arrivals'}
                </span>
                <h5 className="font-extrabold text-sm text-white leading-snug">
                  {currentLang === 'fa' ? 'چک‌لیست روزهای نخست ورود' : 'First-Days Arrival Checklist'}
                </h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {currentLang === 'fa' ? 'اقدامات ضروری در ۷۲ ساعت، ۷ روز و ۳۰ روز اول ورود به رومانی.' : 'Essential tasks for your first 72 hours, 7 days & 30 days.'}
                </p>
              </div>

              <Button
                variant="accent"
                size="sm"
                onClick={() => handleLinkClick('needs/first-days-checklist')}
                rightIcon={<ArrowIcon size={14} />}
                className="mt-4 w-full"
              >
                {currentLang === 'fa' ? 'مشاهده چک‌لیست ورود' : 'View Arrival Checklist'}
              </Button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 5. ROMANIA MEGA MENU ("رومانی")
  return (
    <div ref={menuRef} className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-12 gap-8 text-xs">
          
          <div className="col-span-4 space-y-3">
            <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
              {currentLang === 'fa' ? 'شناخت رومانی' : 'Discover Romania'}
            </h4>
            <ul className="space-y-2 text-[#526174] font-medium">
              <li><button onClick={() => handleLinkClick('romania/economy')} className="hover:text-[#2F6FED] py-1 cursor-pointer">📊 {currentLang === 'fa' ? 'اقتصاد، صنایع و درآمدها' : 'Economy, Industries & Wages'}</button></li>
              <li><button onClick={() => handleLinkClick('romania/society')} className="hover:text-[#2F6FED] py-1 cursor-pointer">👥 {currentLang === 'fa' ? 'جامعه، زبان و زندگی اجتماعی' : 'Society & Social Etiquette'}</button></li>
              <li><button onClick={() => handleLinkClick('romania/culture-and-arts')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🎨 {currentLang === 'fa' ? 'فرهنگ، هنر و تاریخ رومانی' : 'Culture, Arts & Heritage'}</button></li>
            </ul>
          </div>

          <div className="col-span-4 space-y-3">
            <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
              {currentLang === 'fa' ? 'قوانین و گردشگری' : 'Laws & Tourism'}
            </h4>
            <ul className="space-y-2 text-[#526174] font-medium">
              <li><button onClick={() => handleLinkClick('romania/laws-and-regulations')} className="hover:text-[#2F6FED] py-1 cursor-pointer">⚖️ {currentLang === 'fa' ? 'قوانین و مقررات مهم' : 'Key Laws & Regulations'}</button></li>
              <li><button onClick={() => handleLinkClick('romania/tourism')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🏰 {currentLang === 'fa' ? 'راهنمای گردشگری و جاذبه‌ها' : 'Tourism & Itineraries'}</button></li>
              <li><button onClick={() => handleLinkClick('romania/cities')} className="hover:text-[#2F6FED] py-1 cursor-pointer">🏛️ {currentLang === 'fa' ? 'شهرهای اصلی رومانی' : 'Key Romanian Cities'}</button></li>
            </ul>
          </div>

          <div className="col-span-4 space-y-3">
            <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
              {currentLang === 'fa' ? 'درگاه‌های قانونی رسمی' : 'Official Government Sites'}
            </h4>
            <ul className="space-y-2 text-[#526174] font-medium">
              <li><a href="https://igi.mai.gov.ro" target="_blank" rel="noopener noreferrer" className="hover:text-[#2F6FED] flex items-center space-x-1.5 rtl:space-x-reverse py-1 cursor-pointer"><Landmark size={14} className="text-[#2F6FED]" /><span>IGI (اداره کل مهاجرت)</span></a></li>
              <li><a href="https://mae.ro" target="_blank" rel="noopener noreferrer" className="hover:text-[#2F6FED] flex items-center space-x-1.5 rtl:space-x-reverse py-1 cursor-pointer"><Landmark size={14} className="text-[#2F6FED]" /><span>MAE (وزارت امور خارجه)</span></a></li>
              <li><a href="https://edu.ro" target="_blank" rel="noopener noreferrer" className="hover:text-[#2F6FED] flex items-center space-x-1.5 rtl:space-x-reverse py-1 cursor-pointer"><Landmark size={14} className="text-[#2F6FED]" /><span>EDU (وزارت آموزش)</span></a></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
