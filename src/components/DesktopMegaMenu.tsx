'use client';

import React, { useEffect, useRef } from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { ArrowLeft, ArrowRight, GraduationCap, BriefcaseBusiness, Building2, ChartNoAxesCombined, Users, House, Landmark } from './Icons';
import { Button } from './Button';

interface DesktopMegaMenuProps {
  type: 'starthere' | 'immigration' | 'study' | 'work' | 'business' | 'work-business' | 'needs' | 'romania';
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
                <li><Link href="/start-here/planning-to-come" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🎯 {currentLang === 'fa' ? 'قصد آمدن به رومانی دارم' : 'Planning to come'}</Link></li>
                <li><Link href="/start-here/newly-arrived" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🛬 {currentLang === 'fa' ? 'به‌تازگی وارد شده‌ام' : 'Just arrived'}</Link></li>
                <li><Link href="/start-here/settling-in" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🏠 {currentLang === 'fa' ? 'در رومانی زندگی می‌کنم' : 'Living in Romania'}</Link></li>
                <li><Link href="/start-here/long-term-stay" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>📆 {currentLang === 'fa' ? 'اقامت بلندمدت می‌خواهم' : 'Looking for long-term stay'}</Link></li>
                <li><Link href="/start-here/citizenship-goal" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🛂 {currentLang === 'fa' ? 'هدفم تابعیت رومانی است' : 'My goal is citizenship'}</Link></li>
                <li><Link href="/start-here" className="hover:text-[#2F6FED] py-1 cursor-pointer font-bold" onClick={onClose}>{currentLang === 'fa' ? 'مشاهده همه مراحل ←' : 'See all stages →'}</Link></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'چک‌لیست‌ها' : 'Checklists'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><Link href="/start-here/planning-to-come" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>📋 {currentLang === 'fa' ? 'چک‌لیست قبل از سفر' : 'Pre-departure Checklist'}</Link></li>
                <li><Link href="/start-here/newly-arrived" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>⏱️ {currentLang === 'fa' ? 'سه روز اول' : 'First 3 Days'}</Link></li>
                <li><Link href="/start-here/settling-in" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>📅 {currentLang === 'fa' ? 'ماه اول' : 'First Month'}</Link></li>
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
                {currentLang === 'fa' ? '🔎 ارزیابی رایگان شرایط من' : '🔎 Free Case Evaluation'}
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
                <li><Link href="/study" className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer" onClick={onClose}><GraduationCap size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'تحصیل در رومانی' : 'Study in Romania'}</span></Link></li>
                <li><Link href="/work" className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer" onClick={onClose}><BriefcaseBusiness size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'کار در رومانی' : 'Work in Romania'}</span></Link></li>
                <li><Link href="/company" className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer" onClick={onClose}><Building2 size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'ثبت شرکت (SRL)' : 'Company Registration'}</span></Link></li>
                <li><Link href="/company/investment" className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer" onClick={onClose}><ChartNoAxesCombined size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'فرصت‌های سرمایه‌گذاری' : 'Investment Routes'}</span></Link></li>
                <li><Link href="/immigration/family-reunification" className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer" onClick={onClose}><Users size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'پیوست خانواده' : 'Family Reunification'}</span></Link></li>
                <li><Link href="/immigration/residence-renewal" className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer" onClick={onClose}><Users size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'تمدید اقامت' : 'Residence Renewal'}</span></Link></li>
                <li><Link href="/immigration/long-term-residence" className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer" onClick={onClose}><BriefcaseBusiness size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'اقامت بلندمدت' : 'Long-term Residence'}</span></Link></li>
                <li><Link href="/immigration/citizenship" className="hover:text-[#2F6FED] flex items-center space-x-2 rtl:space-x-reverse py-1 cursor-pointer" onClick={onClose}><Building2 size={16} className="text-[#2F6FED]" /><span>{currentLang === 'fa' ? 'تابعیت' : 'Citizenship'}</span></Link></li>
              </ul>
            </div>

            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'مراحل اقامتی IGI' : 'IGI Residency Steps'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><Link href="/immigration/igi-process#pre-arrival-docs" className="hover:text-[#2F6FED] py-1 cursor-pointer text-right w-full" onClick={onClose}>{currentLang === 'fa' ? '۱. ارزیابی اولیه مدارک' : '1. Initial Document Audit'}</Link></li>
                <li><Link href="/immigration/igi-process#visa-type-d-issuance" className="hover:text-[#2F6FED] py-1 cursor-pointer text-right w-full" onClick={onClose}>{currentLang === 'fa' ? '۲. صدور ویزای بلندمدت (نوع D)' : '2. Long-stay Visa (Type D)'}</Link></li>
                <li><Link href="/immigration/igi-process#step-by-step" className="hover:text-[#2F6FED] py-1 cursor-pointer text-right w-full" onClick={onClose}>{currentLang === 'fa' ? '۳. درخواست کارت اقامت موقت' : '3. Temporary Residence Permit'}</Link></li>
                <li><Link href="/immigration/igi-process#step-4-biometrics" className="hover:text-[#2F6FED] py-1 cursor-pointer text-right w-full" onClick={onClose}>{currentLang === 'fa' ? '۴. ورود و صدور کارت اقامت' : '4. Arrival & Permit Issuance'}</Link></li>
              </ul>

            </div>

            <div className="col-span-3 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'اقدام بر اساس محل سکونت' : 'Based on Current Location'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><Link href="/immigration/apply-from-iran" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>{currentLang === 'fa' ? 'اقدام از داخل ایران (سفارت تهران)' : 'Applying from Iran'}</Link></li>
                <li><Link href="/immigration/apply-from-uae-gulf" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>{currentLang === 'fa' ? 'اقدام از امارات و حوزه خلیج فارس' : 'Applying from UAE / Gulf'}</Link></li>
                <li><Link href="/immigration/apply-from-turkey-europe" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>{currentLang === 'fa' ? 'اقدام از ترکیه و کشورهای اروپایی' : 'Applying from Turkey / Europe'}</Link></li>
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
                {currentLang === 'fa' ? '🔎 ارزیابی رایگان شرایط من' : '🔎 Free Case Evaluation'}
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
                <li><Link href="/study/requirements" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>{currentLang === 'fa' ? 'مدارک و الزامات پذیرش' : 'Required Documents & Legalization'}</Link></li>
                <li><Link href="/study/visa-type-d" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>{currentLang === 'fa' ? 'ویزای تحصیلی تایپ D' : 'Type D/SD Student Visa'}</Link></li>
                <li><Link href="/study/tuition-overview" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>{currentLang === 'fa' ? 'شهریه‌های تحصیلی (نمای کلی)' : 'Tuition Rates & Dormitories'}</Link></li>
                <li><Link href="/study/preparatory-year" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>{currentLang === 'fa' ? 'سال زبان (پیش‌دانشگاهی)' : 'Language Preparatory Year'}</Link></li>
                <li><Link href="/study/scholarships" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>{currentLang === 'fa' ? 'بورسیه تحصیلی دولتی' : 'Government Scholarships'}</Link></li>
                <li><Link href="/study/part-time-work" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>{currentLang === 'fa' ? 'مجوز کار پاره‌وقت دانشجویی' : 'Student Work Permits'}</Link></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'رشته‌های اصلی' : 'Popular Fields'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><Link href="/universities?area=medicine_dentistry" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🩺 {currentLang === 'fa' ? 'پزشکی و دندانپزشکی (انگلیسی/فرانسوی)' : 'Medicine & Dentistry (EN/FR)'}</Link></li>
                <li><Link href="/universities?area=computer_it" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>💻 {currentLang === 'fa' ? 'مهندسی کامپیوتر و IT' : 'Computer Science & IT'}</Link></li>
                <li><Link href="/universities?area=engineering" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>⚙️ {currentLang === 'fa' ? 'مهندسی برق و مکانیک' : 'Engineering Degrees'}</Link></li>
                <li><Link href="/universities?area=management_business" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>📊 {currentLang === 'fa' ? 'مدیریت و تجارت بین‌الملل' : 'Management & Business'}</Link></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'دانشگاه‌های برجسته' : 'Featured Universities'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><Link href="/universities" className="font-bold text-[#2F6FED] py-1 cursor-pointer block mb-2" onClick={onClose}>🇷🇴 {currentLang === 'fa' ? 'دانشگاه‌های رومانی' : 'Universities in Romania'}</Link></li>
                <li><Link href="/universities" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🎓 University of Bucharest</Link></li>
                <li><Link href="/universities" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🎓 Babeș-Bolyai University (Cluj)</Link></li>
                <li><Link href="/universities" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🩺 Carol Davila Medicine (Bucharest)</Link></li>
                <li><Link href="/universities" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>⚙️ Polytechnic University of Bucharest</Link></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 3. WORK & BUSINESS MEGA MENU ("کار و کسب‌وکار")
  if (type === 'work-business' || type === 'work' || type === 'business') {
    return (
      <div ref={menuRef} className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#dfe6ef] shadow-2xl py-8 animate-fadeIn">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 text-xs">
            
            {/* Column 1: Employment & Work (6 subroutes + hub link) */}
            <div className="col-span-6 space-y-3 border-r border-[#dfe6ef] rtl:border-r-0 rtl:border-l pl-0 pr-0 rtl:pl-6 ltr:pr-6">
              <div className="flex items-center justify-between border-b border-[#dfe6ef] pb-2">
                <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider">
                  💼 {currentLang === 'fa' ? 'استخدام و کار' : 'Employment & Career'}
                </h4>
                <Link
                  href="/work"
                  onClick={onClose}
                  className="text-[11px] font-bold text-[#2F6FED] hover:underline flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <span>{currentLang === 'fa' ? 'هاب اصلی کار' : 'Work Hub'}</span>
                  <ArrowIcon size={12} />
                </Link>
              </div>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><Link href="/work/finding-job" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>🔍</span> <span>{currentLang === 'fa' ? 'پیدا کردن کار' : 'Find a Job'}</span></Link></li>
                <li><Link href="/work/work-permit" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>📄</span> <span>{currentLang === 'fa' ? 'مجوز کار (Aviz de Muncă)' : 'Work Permit'}</span></Link></li>
                <li><Link href="/work/work-visa" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>🛂</span> <span>{currentLang === 'fa' ? 'ویزای کاری' : 'Work Visa'}</span></Link></li>
                <li><Link href="/work/employment-contract" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>📜</span> <span>{currentLang === 'fa' ? 'قرارداد استخدام' : 'Employment Contract'}</span></Link></li>
                <li><Link href="/work/taxes-salaries" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>💰</span> <span>{currentLang === 'fa' ? 'حقوق و مالیات' : 'Salary & Tax'}</span></Link></li>
                <li><Link href="/work/insurance" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>🏥</span> <span>{currentLang === 'fa' ? 'بیمه (اجتماعی/درمانی)' : 'Insurance'}</span></Link></li>
                <li><Link href="/work/digital-nomad" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>💻</span> <span>{currentLang === 'fa' ? 'ویزای دیجیتال نومد' : 'Digital Nomad Visa'}</span></Link></li>
              </ul>
            </div>

            {/* Column 2: Business & Investment (7 subroutes + hub link) */}
            <div className="col-span-6 space-y-3">
              <div className="flex items-center justify-between border-b border-[#dfe6ef] pb-2">
                <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider">
                  🏢 {currentLang === 'fa' ? 'کسب‌وکار و سرمایه‌گذاری' : 'Business & Investment'}
                </h4>
                <Link
                  href="/company"
                  onClick={onClose}
                  className="text-[11px] font-bold text-[#2F6FED] hover:underline flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <span>{currentLang === 'fa' ? 'هاب اصلی کسب‌وکار' : 'Business Hub'}</span>
                  <ArrowIcon size={12} />
                </Link>
              </div>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><Link href="/company/registration" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>🏛️</span> <span>{currentLang === 'fa' ? 'مراحل ثبت شرکت SRL و ثبت در ONRC' : 'SRL Incorporation Steps at ONRC'}</span></Link></li>
                <li><Link href="/company/tax-types" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>📊</span> <span>{currentLang === 'fa' ? 'انواع نرخ‌های مالیاتی (۱٪ تا ۱۶٪)' : 'Corporate Tax Options (1% to 16%)'}</span></Link></li>
                <li><Link href="/company/bank-account" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>💳</span> <span>{currentLang === 'fa' ? 'افتتاح حساب بانکی شرکت در بخارست' : 'Corporate Bank Account Setup'}</span></Link></li>
                <li><Link href="/company/residency" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>👔</span> <span>{currentLang === 'fa' ? 'شرایط دریافت اقامت مدیرعامل و سهامدار' : 'Executive Residence Criteria'}</span></Link></li>
                <li><Link href="/company/real-estate-investment" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>🏙️</span> <span>{currentLang === 'fa' ? 'سرمایه‌گذاری در املاک و مستغلات' : 'Real Estate Opportunities'}</span></Link></li>
                <li><Link href="/company/startup-tech-investment" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>🚀</span> <span>{currentLang === 'fa' ? 'استارت‌آپ‌ها و فناوری اطلاعات' : 'Tech Startups & Innovation'}</span></Link></li>
                <li><Link href="/company/annual-tax-reporting" className="hover:text-[#2F6FED] py-1 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse" onClick={onClose}><span>⚖️</span> <span>{currentLang === 'fa' ? 'قوانین مالیاتی و گزارش‌دهی سالانه' : 'Annual Tax Compliance'}</span></Link></li>
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
                <li><Link href="/needs/currency-exchange" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>💵 {currentLang === 'fa' ? 'صرافی و تبدیل پول (نرخ مرجع BNR)' : 'Currency Exchange & BNR Rates'}</Link></li>
                <li><Link href="/needs/driving-license" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🚗 {currentLang === 'fa' ? 'گواهینامه رانندگی و شرایط تبدیل' : 'Driving License Exchange'}</Link></li>
                <li><Link href="/needs/certified-translation" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>📄 {currentLang === 'fa' ? 'دارالترجمه و مترجمین مجاز دادگستری' : 'Authorized Certified Translators'}</Link></li>
                <li><Link href="/needs/romanian-language-courses" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🗣️ {currentLang === 'fa' ? 'آموزش زبان رومانیایی' : 'Romanian Language Courses'}</Link></li>
              </ul>
            </div>

            <div className="col-span-4 space-y-3">
              <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
                {currentLang === 'fa' ? 'استقرار و حقوقی' : 'Housing & Consular'}
              </h4>
              <ul className="space-y-2 text-[#526174] font-medium">
                <li><Link href="/needs/notary-public" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>⚖️ {currentLang === 'fa' ? 'دفتر اسناد رسمی (Notar Public)' : 'Notary Public Services'}</Link></li>
                <li><Link href="/needs/iranian-embassy-and-mikhak" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🇮🇷 {currentLang === 'fa' ? 'سفارت ایران در بخارست و سامانه میخک' : 'Iranian Embassy & Mikhak System'}</Link></li>
                <li><Link href="/needs/housing" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🏠 {currentLang === 'fa' ? 'راهنمای اجاره و خرید مسکن' : 'Renting & Buying Property'}</Link></li>
                <li><Link href="/needs/cost-of-living" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>💰 {currentLang === 'fa' ? 'محاسبه‌گر هزینه زندگی' : 'Cost of Living Calculator'}</Link></li>
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
              <li><Link href="/romania/economy" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>📊 {currentLang === 'fa' ? 'اقتصاد، صنایع و درآمدها' : 'Economy, Industries & Wages'}</Link></li>
              <li><Link href="/romania/society" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>👥 {currentLang === 'fa' ? 'جامعه، زبان و زندگی اجتماعی' : 'Society & Social Etiquette'}</Link></li>
              <li><Link href="/romania/culture-and-arts" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🎨 {currentLang === 'fa' ? 'فرهنگ، هنر و تاریخ رومانی' : 'Culture, Arts & Heritage'}</Link></li>
            </ul>
          </div>

          <div className="col-span-4 space-y-3">
            <h4 className="font-extrabold text-[#142033] text-sm uppercase tracking-wider border-b border-[#dfe6ef] pb-2">
              {currentLang === 'fa' ? 'قوانین و گردشگری' : 'Laws & Tourism'}
            </h4>
            <ul className="space-y-2 text-[#526174] font-medium">
              <li><Link href="/romania/laws-and-regulations" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>⚖️ {currentLang === 'fa' ? 'قوانین و مقررات مهم' : 'Key Laws & Regulations'}</Link></li>
              <li><Link href="/romania/tourism" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🏰 {currentLang === 'fa' ? 'راهنمای گردشگری و جاذبه‌ها' : 'Tourism & Itineraries'}</Link></li>
              <li><Link href="/romania/cities" className="hover:text-[#2F6FED] py-1 cursor-pointer" onClick={onClose}>🏛️ {currentLang === 'fa' ? 'شهرهای اصلی رومانی' : 'Key Romanian Cities'}</Link></li>
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
