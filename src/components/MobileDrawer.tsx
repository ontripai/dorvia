'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { X, ChevronDown } from './Icons';
import { Button } from './Button';

interface MobileDrawerProps {
  currentLang: Language;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onClose: () => void;
  onOpenEvaluationModal: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  currentLang,
  activeRoute,
  onNavigate,
  onClose,
  onOpenEvaluationModal
}) => {
  const t = getTranslations(currentLang);
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Save previous overflow value
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      document.getElementById('mobile-menu-button')?.focus();
    };
  }, [onClose]);

  const navItems = [
    { id: 'start-here', label: currentLang === 'fa' ? 'شروع از اینجا' : 'Start Here' },
    { id: 'start-here/planning-to-come', label: currentLang === 'fa' ? '— قصد آمدن به رومانی دارم' : '— Planning to come' },
    { id: 'start-here/newly-arrived', label: currentLang === 'fa' ? '— به‌تازگی وارد شده‌ام' : '— Just arrived' },
    { id: 'start-here/settling-in', label: currentLang === 'fa' ? '— استقرار و ماه اول' : '— Settling In' },
    { id: 'immigration', label: currentLang === 'fa' ? 'مهاجرت و اقامت' : 'Immigration & Residence' },
    { id: 'immigration/residence-renewal', label: currentLang === 'fa' ? '— تمدید اقامت' : '— Residence Renewal' },
    { id: 'immigration/long-term-residence', label: currentLang === 'fa' ? '— اقامت بلندمدت' : '— Long-term Residence' },
    { id: 'immigration/citizenship', label: currentLang === 'fa' ? '— تابعیت' : '— Citizenship' },
    { id: 'immigration/family-reunification', label: currentLang === 'fa' ? '— پیوست خانواده' : '— Family Reunification' },
    { id: 'study', label: currentLang === 'fa' ? 'تحصیل و بورسیه' : 'Study & Scholarships' },
    { id: 'study/requirements', label: currentLang === 'fa' ? '— مدارک و الزامات پذیرش' : '— Required Documents' },
    { id: 'study/visa-type-d', label: currentLang === 'fa' ? '— ویزای تحصیلی تایپ D' : '— Type D Visa' },
    { id: 'study/tuition-overview', label: currentLang === 'fa' ? '— شهریه‌های تحصیلی' : '— Tuition Rates' },
    { id: 'study/preparatory-year', label: currentLang === 'fa' ? '— سال زبان' : '— Preparatory Year' },
    { id: 'study/scholarships', label: currentLang === 'fa' ? '— بورسیه تحصیلی' : '— Scholarships' },
    { id: 'study/part-time-work', label: currentLang === 'fa' ? '— مجوز کار دانشجویی' : '— Student Work Permits' },
    { id: 'work', label: currentLang === 'fa' ? 'کار و اشتغال' : 'Work & Employment' },
    { id: 'work/finding-job', label: currentLang === 'fa' ? '— پیدا کردن کار' : '— Find a Job' },
    { id: 'work/work-permit', label: currentLang === 'fa' ? '— مجوز کار (Aviz de Muncă)' : '— Work Permit' },
    { id: 'work/work-visa', label: currentLang === 'fa' ? '— ویزای کاری' : '— Work Visa' },
    { id: 'work/employment-contract', label: currentLang === 'fa' ? '— قرارداد استخدام' : '— Employment Contract' },
    { id: 'work/taxes-salaries', label: currentLang === 'fa' ? '— حقوق و مالیات' : '— Salary & Tax' },
    { id: 'work/insurance', label: currentLang === 'fa' ? '— بیمه' : '— Insurance' },
    { id: 'company', label: currentLang === 'fa' ? 'ثبت شرکت و سرمایه‌گذاری' : 'Business & Investment' },
    { id: 'company/registration', label: currentLang === 'fa' ? '— مراحل ثبت شرکت (SRL)' : '— Registration Steps (SRL)' },
    { id: 'company/tax-types', label: currentLang === 'fa' ? '— انواع مالیات شرکتی' : '— Tax Types' },
    { id: 'company/bank-account', label: currentLang === 'fa' ? '— افتتاح حساب بانکی' : '— Bank Account' },
    { id: 'company/residency', label: currentLang === 'fa' ? '— اقامت از طریق ثبت شرکت' : '— Executive Residency' },
    { id: 'company/real-estate-investment', label: currentLang === 'fa' ? '— سرمایه‌گذاری در املاک' : '— Real Estate Investment' },
    { id: 'company/startup-tech-investment', label: currentLang === 'fa' ? '— سرمایه‌گذاری استارتاپ' : '— Tech Startups' },
    { id: 'company/annual-tax-reporting', label: currentLang === 'fa' ? '— گزارش مالیاتی سالانه' : '— Tax Compliance' },
    { id: 'romania', label: currentLang === 'fa' ? 'درباره رومانی' : 'About Romania' },
    { id: 'universities', label: t.nav.universities },
    { id: 'romania/cities', label: t.nav.cities },
    { id: 'services', label: t.nav.services },
    { id: 'articles', label: t.nav.articles },
    { id: 'about', label: t.nav.aboutUs },
    { id: 'contact', label: t.nav.contact },
  ];

  if (!mounted) return null;

  const drawerContent = (
    <div 
      className="fixed inset-0 bg-[#071B3D] flex flex-col justify-between overflow-y-auto overscroll-contain animate-fadeIn"
      style={{
        zIndex: 2147483647,
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 6rem)',
        minHeight: '100dvh',
        height: '100dvh'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 px-6 pt-4">
        <Link
          href="/"
          className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse cursor-pointer shrink min-w-0"
          onClick={() => {
            onClose();
            onNavigate('home');
          }}
        >
          <img src="/images/logo/dorvia-logo-primary-transparent-3000.png" alt="DORVIA" className="h-[28px] w-auto brightness-0 invert" />
          <span className="inline-block text-base sm:text-lg font-extrabold tracking-tight text-white leading-none whitespace-nowrap">
            {currentLang === 'fa' ? t.brand.siteName : t.brand.siteName.toUpperCase()}
          </span>
        </Link>

        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 text-white border border-white/20 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close Mobile Menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* Main Drawer Links */}
      <div className="py-6 space-y-1.5 flex-1 px-6">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={`/${item.id === 'home' ? '' : item.id}`}
            onClick={() => {
              onClose();
              onNavigate(item.id);
            }}
            className={`w-full text-start px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] flex items-center justify-between block ${
              activeRoute === item.id ? 'bg-[#2F6FED] text-white font-bold' : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <span>{item.label}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </Link>
        ))}
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="pt-4 border-t border-slate-800 space-y-3 px-6 mt-4">
        <Button
          variant="accent"
          size="md"
          onClick={() => {
            onClose();
            onOpenEvaluationModal();
          }}
          className="w-full min-h-[44px]"
        >
          {currentLang === 'fa' ? 'ارزیابی رایگان' : 'Free Assessment'}
        </Button>

        <Button
          variant="outline"
          size="md"
          href="/contact"
          onClick={() => {
            onClose();
            onNavigate('contact');
          }}
          className="w-full min-h-[44px]"
        >
          {currentLang === 'fa' ? 'تماس با ما' : 'Contact Us'}
        </Button>
      </div>

    </div>
  );

  return createPortal(drawerContent, document.body);
};
