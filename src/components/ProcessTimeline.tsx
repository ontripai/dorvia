'use client';

import React from 'react';
import { Language } from '../types';

interface ProcessTimelineProps {
  currentLang: Language;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ currentLang }) => {
  const steps = [
    {
      num: '01',
      title: currentLang === 'fa' ? 'ارسال اطلاعات اولیه' : '1. Initial Intake',
      desc: currentLang === 'fa' ? 'تکمیل فرم ارزیابی رایگان بدون نیاز به ارائه مدارک حساس.' : 'Complete the free evaluation form with basic background details.'
    },
    {
      num: '02',
      title: currentLang === 'fa' ? 'بررسی شرایط و مدارک' : '2. Eligibility Review',
      desc: currentLang === 'fa' ? 'تطبیق سوابق شما با ضوابط قانونی و دانشگاهی رومانی.' : 'Assessment against official university & IGI immigration criteria.'
    },
    {
      num: '03',
      title: currentLang === 'fa' ? 'جلسه مشاوره اختصاصی' : '3. Advisory Session',
      desc: currentLang === 'fa' ? 'بررسی جزئیات، شفاف‌سازی هزینه‌ها و انتخاب بهترین مسیر.' : 'Direct discussion detailing timeline, costs, and strategic options.'
    },
    {
      num: '04',
      title: currentLang === 'fa' ? 'پیشنهاد مسیر و خدمات' : '4. Action Plan',
      desc: currentLang === 'fa' ? 'ارائه توافق‌نامه شفاف و جدول زمان‌بندی مراحل پرونده.' : 'Transparent agreement and clear step-by-step roadmap.'
    },
    {
      num: '05',
      title: currentLang === 'fa' ? 'شروع همراهی تا اقامت' : '5. Full Support',
      desc: currentLang === 'fa' ? 'همراهی در دریافت پذیرش، ویزای D و کارت اقامت موقت.' : 'End-to-end support through admission, visa D, and residence permit.'
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#dfe6ef]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0038a8]">
            {currentLang === 'fa' ? 'فرآیند گام‌به‌گام' : 'How It Works'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'مراحل اقدام و همراهی با شما' : 'Clear & Transparent Process Timeline'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
            {currentLang === 'fa'
              ? 'مراحل کار شفاف، بدون سردرگمی و بر اساس چارچوب‌های قانونی اداره مهاجرت رومانی (IGI).'
              : 'Structured workflow adhering to official Romanian immigration standards without unverified promises.'}
          </p>
        </div>

        {/* Timeline Desktop Grid / Mobile Vertical */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((s, idx) => (
            <div key={idx} className="editorial-card p-6 flex flex-col justify-between space-y-4 relative group">
              <div className="flex items-center justify-between border-b border-[#dfe6ef] pb-3">
                <span className="text-2xl font-black text-[#0038a8]">{s.num}</span>
                <span className="w-2 h-2 rounded-full bg-[#fcd116]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-[#142033] group-hover:text-[#0038a8] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-[#526174] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
