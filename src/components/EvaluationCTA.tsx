'use client';

import React from 'react';
import { Language } from '../types';

interface EvaluationCTAProps {
  currentLang: Language;
  onOpenModal: () => void;
}

export const EvaluationCTA: React.FC<EvaluationCTAProps> = ({ currentLang, onOpenModal }) => {
  return (
    <div className={`mt-16 mb-8 bg-gradient-to-br from-[#f8fafc] to-[#eef3f8] border border-[#dfe6ef] rounded-3xl p-8 sm:p-10 shadow-sm max-w-4xl mx-auto text-center space-y-6 ${currentLang === 'fa' ? 'rtl' : 'ltr'}`}>
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#dfe6ef]">
        <span className="text-2xl">📋</span>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
          {currentLang === 'fa' 
            ? 'می‌خواهید شرایط خودتان را بررسی کنیم؟' 
            : 'Want us to evaluate your profile?'}
        </h3>
        <p className="text-sm sm:text-base text-[#526174] max-w-2xl mx-auto leading-relaxed">
          {currentLang === 'fa'
            ? 'اطلاعات اولیه خود را ارسال کنید تا مسیر مناسب شما مشخص شود.'
            : 'Submit your basic information to find the right path for you.'}
        </p>
      </div>

      <button
        onClick={onOpenModal}
        className="inline-flex items-center space-x-2 rtl:space-x-reverse px-8 py-4 bg-[#2F6FED] hover:bg-[#2052b6] text-white rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-[#2F6FED]/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        <span>
          {currentLang === 'fa' ? 'شروع ارزیابی رایگان' : 'Start Free Evaluation'}
        </span>
        <span className="text-lg group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
          {currentLang === 'fa' ? '←' : '→'}
        </span>
      </button>
    </div>
  );
};
