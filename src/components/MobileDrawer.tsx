'use client';

import React, { useEffect } from 'react';
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const navItems = [
    { id: 'start-here', label: currentLang === 'fa' ? 'شروع از اینجا' : 'Start Here' },
    { id: 'start-here/planning-to-come', label: currentLang === 'fa' ? '— قصد آمدن به رومانی دارم' : '— Planning to come' },
    { id: 'start-here/just-arrived', label: currentLang === 'fa' ? '— به‌تازگی وارد شده‌ام' : '— Just arrived' },
    { id: 'start-here/living-here', label: currentLang === 'fa' ? '— در رومانی زندگی می‌کنم' : '— Living in Romania' },
    { id: 'start-here/pre-departure-checklist', label: currentLang === 'fa' ? '— چک‌لیست قبل از سفر' : '— Pre-departure Checklist' },
    { id: 'start-here/first-three-days', label: currentLang === 'fa' ? '— سه روز اول' : '— First 3 Days' },
    { id: 'start-here/first-month', label: currentLang === 'fa' ? '— ماه اول' : '— First Month' },
    { id: 'immigration', label: currentLang === 'fa' ? 'مهاجرت' : 'Immigration' },
    { id: 'study', label: currentLang === 'fa' ? 'تحصیل' : 'Study' },
    { id: 'study/preparatory-year', label: currentLang === 'fa' ? '— سال زبان (پیش‌دانشگاهی)' : '— Language Preparatory Year' },
    { id: 'work', label: currentLang === 'fa' ? 'کار' : 'Work' },
    { id: 'work/find-job', label: currentLang === 'fa' ? '— پیدا کردن کار' : '— Find a Job' },
    { id: 'work/permit', label: currentLang === 'fa' ? '— مجوز کار (Aviz de Muncă)' : '— Work Permit' },
    { id: 'work/visa', label: currentLang === 'fa' ? '— ویزای کاری' : '— Work Visa' },
    { id: 'work/contract', label: currentLang === 'fa' ? '— قرارداد استخدام' : '— Employment Contract' },
    { id: 'work/tax', label: currentLang === 'fa' ? '— حقوق و مالیات' : '— Salary & Tax' },
    { id: 'work/insurance', label: currentLang === 'fa' ? '— بیمه' : '— Insurance' },
    { id: 'company', label: currentLang === 'fa' ? 'کسب‌وکار' : 'Business' },
    { id: 'company/registration', label: currentLang === 'fa' ? '— مراحل ثبت شرکت (SRL)' : '— Registration Steps (SRL)' },
    { id: 'company/tax-types', label: currentLang === 'fa' ? '— انواع نرخ‌های مالیاتی' : '— Tax Types' },
    { id: 'company/bank-account', label: currentLang === 'fa' ? '— افتتاح حساب بانکی' : '— Bank Account' },
    { id: 'company/residency', label: currentLang === 'fa' ? '— قوانین اقامتی مدیرعامل' : '— Executive Residency' },
    { id: 'living', label: currentLang === 'fa' ? 'زندگی در رومانی' : 'Living in Romania' },
    { id: 'about-romania', label: currentLang === 'fa' ? 'شناخت رومانی' : 'Discover Romania' },
    { id: 'universities', label: t.nav.universities },
    { id: 'cities', label: t.nav.cities },
    { id: 'services', label: t.nav.services },
    { id: 'articles', label: t.nav.articles },
    { id: 'about', label: t.nav.aboutUs },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#071B3D]/90 backdrop-blur-md flex flex-col justify-between p-6 overflow-y-auto animate-fadeIn">
      
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-lg bg-white text-[#071B3D] flex items-center justify-center font-bold text-sm">
            DR
          </div>
          <span className="font-extrabold text-white text-base">در رومانی</span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 text-white border border-white/20 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close Mobile Menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* Main Drawer Links */}
      <div className="py-6 space-y-1.5 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleLinkClick(item.id)}
            className={`w-full text-start px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] flex items-center justify-between ${
              activeRoute === item.id ? 'bg-[#2F6FED] text-white font-bold' : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <span>{item.label}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        ))}
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <Button
          variant="accent"
          size="md"
          onClick={() => {
            onClose();
            onOpenEvaluationModal();
          }}
          className="w-full"
        >
          {currentLang === 'fa' ? 'ارزیابی رایگان' : 'Free Assessment'}
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={() => handleLinkClick('contact')}
          className="w-full"
        >
          {currentLang === 'fa' ? 'تماس با ما' : 'Contact Us'}
        </Button>
      </div>

    </div>
  );
};
