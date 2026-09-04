'use client';

import React from 'react';
import { Language } from '../types';

interface EvaluationCTAProps {
  currentLang: Language;
  onOpenModal: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  variant?: 'general' | 'study' | 'work' | 'business' | 'consultation';
}

export const EvaluationCTA: React.FC<EvaluationCTAProps> = ({
  currentLang,
  onOpenModal,
  title,
  subtitle,
  buttonText,
  variant = 'general'
}) => {
  const getDefaultButtonText = () => {
    switch (variant) {
      case 'study':
        return currentLang === 'fa' ? '🎓 ارزیابی مسیر تحصیلی' : '🎓 Study Pathway Assessment';
      case 'work':
        return currentLang === 'fa' ? '💼 ارزیابی مسیر کاری' : '💼 Work Pathway Assessment';
      case 'business':
        return currentLang === 'fa' ? '🏢 ارزیابی مسیر کسب‌وکار' : '🏢 Business Pathway Assessment';
      case 'consultation':
        return currentLang === 'fa' ? '📅 رزرو مشاوره تخصصی' : '📅 Book Personal Consultation';
      case 'general':
      default:
        return currentLang === 'fa' ? '🔎 ارزیابی رایگان شرایط من' : '🔎 Free Case Evaluation';
    }
  };

  const defaultTitle = currentLang === 'fa' 
    ? 'می‌خواهید شرایط خودتان را بررسی کنیم؟' 
    : 'Want us to evaluate your profile?';

  const defaultSubtitle = currentLang === 'fa'
    ? 'اطلاعات اولیه خود را ارسال کنید تا مسیر مناسب شما مشخص شود.'
    : 'Submit your basic information to find the right path for you.';

  const resolvedButtonText = buttonText || getDefaultButtonText();

  return (
    <div className={`mt-16 mb-8 bg-gradient-to-br from-[#f8fafc] to-[#eef3f8] border border-[#dfe6ef] rounded-3xl p-8 sm:p-10 shadow-sm max-w-4xl mx-auto text-center space-y-6 ${currentLang === 'fa' ? 'rtl' : 'ltr'}`}>
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#dfe6ef]">
        <span className="text-2xl">📋</span>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
          {title || defaultTitle}
        </h3>
        <p className="text-sm sm:text-base text-[#526174] max-w-2xl mx-auto leading-relaxed">
          {subtitle || defaultSubtitle}
        </p>
      </div>

      <button
        onClick={onOpenModal}
        className="inline-flex items-center space-x-2 rtl:space-x-reverse px-8 py-4 bg-[#2F6FED] hover:bg-[#2052b6] text-white rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-[#2F6FED]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      >
        <span>
          {resolvedButtonText}
        </span>
        <span className="text-lg group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
          {currentLang === 'fa' ? '←' : '→'}
        </span>
      </button>
    </div>
  );
};
