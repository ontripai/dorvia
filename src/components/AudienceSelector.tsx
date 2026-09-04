'use client';

import React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { GraduationCap, BriefcaseBusiness, Building2, Users, ArrowRight, ArrowLeft, Sparkles } from './Icons';

interface AudienceSelectorProps {
  currentLang: Language;
  onNavigate?: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  currentLang,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const t = getTranslations(currentLang);
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  const cards = [
    {
      id: 'study',
      href: '/study',
      icon: GraduationCap,
      badge: currentLang === 'fa' ? 'مسیر تحصیلی' : 'Academic',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      title: t.pathways.study.title,
      desc: t.pathways.study.desc,
      hoverBorder: 'hover:border-blue-500',
    },
    {
      id: 'work',
      href: '/work',
      icon: BriefcaseBusiness,
      badge: currentLang === 'fa' ? 'مسیر کاری' : 'Career',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      title: t.pathways.work.title,
      desc: t.pathways.work.desc,
      hoverBorder: 'hover:border-emerald-500',
    },
    {
      id: 'company',
      href: '/company',
      icon: Building2,
      badge: currentLang === 'fa' ? 'کسب‌وکار و شرکت' : 'Corporate',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-600 text-white',
      title: t.pathways.company.title,
      desc: t.pathways.company.desc,
      hoverBorder: 'hover:border-amber-500',
    },
    {
      id: 'family',
      href: '/immigration/family-reunification',
      icon: Users,
      badge: currentLang === 'fa' ? 'پیوست خانواده' : 'Family',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-600 text-white',
      title: t.pathways.family.title,
      desc: t.pathways.family.desc,
      hoverBorder: 'hover:border-purple-500',
    },
  ];

  return (
    <section className="py-16 bg-[#eef3f8] border-y border-[#dfe6ef]" aria-labelledby="conversion-gateway-title">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#1554bd]">
            {currentLang === 'fa' ? 'انتخاب هدف اصلی' : 'Primary Goal Decision'}
          </span>
          <h2 id="conversion-gateway-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#142033]">
            {currentLang === 'fa' ? 'هدف اصلی شما از اقدام برای رومانی چیست؟' : 'What Is Your Primary Objective in Romania?'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
            {currentLang === 'fa'
              ? 'یکی از مسیرهای چهارگانه زیر را انتخاب کنید یا از ارزیابی هوشمند برای بررسی دقیق شرایط خود بهره‌مند شوید.'
              : 'Choose one of the four main pathways below or use our guided assessment to evaluate your profile.'}
          </p>
        </div>

        {/* 4 Big Conversion Gateway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                className={`group relative flex flex-col justify-between p-6 bg-white rounded-2xl border border-[#dfe6ef] ${card.hoverBorder} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${card.badgeBg}`}>
                      {card.badge}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <h3 className="text-lg font-extrabold text-[#142033] group-hover:text-[#2F6FED] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#526174] leading-relaxed line-clamp-3">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2F6FED]">
                  <span>{currentLang === 'fa' ? 'مشاهده و جزئیات مسیر' : 'Explore Pathway'}</span>
                  <ArrowIcon size={14} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pathfinder Assessment Banner Bar */}
        <div className="bg-gradient-to-r from-[#071B3D] to-[#0c2a5c] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
          <div className="flex items-center space-x-4 rtl:space-x-reverse text-center md:text-start flex-col sm:flex-row">
            <div className="w-14 h-14 rounded-2xl bg-[#2F6FED] text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {currentLang === 'fa' ? 'نمی‌دانید کدام مسیر مناسب شماست؟' : 'Not sure which path fits you?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {currentLang === 'fa'
                  ? 'با پاسخ به چند سوال در ارزیابی رایگان DORVIA PathFinder، شرایط خود را بسنجید و مناسب‌ترین گزینه‌ها را دریافت کنید.'
                  : 'Answer a few quick questions in the free DORVIA PathFinder assessment to evaluate your profile and find your best fit.'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEvaluationModal}
            className="w-full md:w-auto px-6 py-3.5 bg-[#2F6FED] hover:bg-[#1A5BB8] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#2F6FED]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <span>{currentLang === 'fa' ? '🔎 ارزیابی رایگان شرایط من' : '🔎 Free Case Evaluation'}</span>
            <ArrowIcon size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};
