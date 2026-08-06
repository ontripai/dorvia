'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Language } from '../types';
import { GraduationCap, BriefcaseBusiness, Building2, Users, House, ArrowRight, ArrowLeft } from './Icons';

interface AudienceSelectorProps {
  currentLang: Language;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string>('study');
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  const goals = [
    {
      id: 'study',
      icon: GraduationCap,
      title: currentLang === 'fa' ? 'تحصیل در دانشگاه' : 'University Study',
      route: 'study',
      summary: currentLang === 'fa'
        ? 'پذیرش از دانشگاه‌های معتبر اروپا به زبان‌های انگلیسی و فرانسوی با امکان اخذ ویزا و اقامت دانشجویی.'
        : 'Admissions across accredited European universities taught in English & French with student residency.'
    },
    {
      id: 'work',
      icon: BriefcaseBusiness,
      title: currentLang === 'fa' ? 'پیدا کردن کار' : 'Work & Career',
      route: 'work',
      summary: currentLang === 'fa'
        ? 'فرصت‌های شغلی حوزه IT، مهندسی و صنایع با دریافت مجوز رسمی کار (Aviz de Munca) و اقامت قانونی.'
        : 'Career opportunities in IT, engineering, and industries backed by official work permits (Aviz de Munca).'
    },
    {
      id: 'company',
      icon: Building2,
      title: currentLang === 'fa' ? 'راه‌اندازی کسب‌وکار' : 'Business & SRL',
      route: 'company',
      summary: currentLang === 'fa'
        ? 'ثبت شرکت SRL با نرخ مالیات رقابتی (۱ تا ۱۶ درصد) و دریافت اقامت تجاری در اتحادیه اروپا.'
        : 'Company formation (SRL) options and potential residency routes, subject to current business and tax regulations.'
    },
    {
      id: 'family',
      icon: Users,
      title: currentLang === 'fa' ? 'پیوستن به خانواده' : 'Family Reunification',
      route: 'immigration',
      summary: currentLang === 'fa'
        ? 'رویه قانونی الحاق همسر و فرزندان به دارنده اقامت معتبر کاری، تحصیلی یا تجاری در رومانی.'
        : 'Legal framework for family members to join valid residency holders in Romania.'
    },
    {
      id: 'living',
      icon: House,
      title: currentLang === 'fa' ? 'زندگی و استقرار' : 'Living & Relocation',
      route: 'living',
      summary: currentLang === 'fa'
        ? 'هزینه‌های زندگی مقرون‌به‌صرفه و امنیت اجتماعی بالا.'
        : 'Affordable lifestyle, safety standards, and full Schengen zone mobility.'
    },
  ];

  const activeObj = goals.find((g) => g.id === selectedGoal) || goals[0];
  const IconComp = activeObj.icon;

  return (
    <section className="py-16 bg-[#eef3f8] border-y border-[#dfe6ef]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#1554bd]">
            {currentLang === 'fa' ? 'انتخاب بر اساس نیاز شما' : 'Guided Decision'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'هدف اصلی شما از اقدام برای رومانی چیست؟' : 'What Is Your Primary Objective in Romania?'}
          </h2>
        </div>

        {/* Goal Selector Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {goals.map((g) => {
            const isSelected = g.id === selectedGoal;
            const ItemIcon = g.icon;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center space-y-2 min-h-[110px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#2F6FED] border-[#2F6FED] text-white shadow-md scale-102'
                    : 'bg-white border-[#dfe6ef] text-[#142033] hover:border-[#2F6FED]/40 hover:shadow-xs'
                }`}
              >
                <ItemIcon size={24} className={isSelected ? 'text-[#1554bd]' : 'text-[#1554bd]'} />
                <span className="text-xs font-bold leading-tight">{g.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Panel for Selected Goal */}
        <div className="bg-white rounded-2xl border border-[#dfe6ef] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm animate-fadeIn">
          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1554bd] flex items-center justify-center shrink-0">
              <IconComp size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#142033]">{activeObj.title}</h3>
              <p className="text-xs sm:text-sm text-[#526174] leading-relaxed max-w-2xl">{activeObj.summary}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse w-full md:w-auto shrink-0">
            <Link
              href={`/${activeObj.route}`}
              className="flex-1 md:flex-initial bg-[#eef3f8] hover:bg-slate-200 text-[#142033] font-bold text-xs px-5 py-3 rounded-xl border border-[#dfe6ef] transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer block text-center"
            >
              <span>{currentLang === 'fa' ? 'مطالعه جزئیات این مسیر' : 'Explore Pathway'}</span>
              <ArrowIcon size={14} />
            </Link>

            <button
              onClick={onOpenEvaluationModal}
              className="flex-1 md:flex-initial bg-[#2F6FED] hover:bg-[#1A5BB8] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
            >
              <span>{currentLang === 'fa' ? 'ارزیابی رایگان شرایط' : 'Free Case Audit'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
