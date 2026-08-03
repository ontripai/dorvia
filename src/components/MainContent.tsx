'use client';

import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';
import { featuredUniversities, featuredCities, mainServices, sampleArticles } from '../lib/data';
import { PathwayCard } from './PathwayCard';
import { UniversityCard } from './UniversityCard';
import { CityCard } from './CityCard';
import { ServiceCard } from './ServiceCard';
import { LeadForm } from './LeadForm';
import { TrustSection } from './TrustSection';
import { AudienceSelector } from './AudienceSelector';
import { ProcessTimeline } from './ProcessTimeline';
import { FAQAccordion } from './FAQAccordion';
import { OfficialResourceCard } from './OfficialResourceCard';
import { NeedsContent } from './NeedsContent';
import { RomaniaOverviewContent } from './RomaniaOverviewContent';
import { WorkOverviewContent } from './WorkOverviewContent';
import { StartHereContent } from './StartHereContent';
import { IgiProcessContent } from './IgiProcessContent';
import { PreparatoryYearContent } from './PreparatoryYearContent';
import { CompanyOverviewContent } from './CompanyOverviewContent';
import { ImmigrationOverviewContent } from './ImmigrationOverviewContent';
import { ScholarshipOverviewContent } from './ScholarshipOverviewContent';
import { Button } from './Button';
import { 
  GraduationCap, 
  BriefcaseBusiness, 
  Building2, 
  ChartNoAxesCombined, 
  Users, 
  House, 
  Landmark, 
  FileCheck2, 
  ShieldCheck, 
  LockKeyhole, 
  Scale, 
  Calendar, 
  ArrowRight, 
  ArrowLeft 
} from './Icons';

interface MainContentProps {
  currentLang: Language;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  currentLang,
  activeRoute,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const t = getTranslations(currentLang);
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  const [uniSearch, setUniSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  // HANDLE PREFIXED SUB-ROUTES FOR NEEDS AND ROMANIA
  if (activeRoute === 'study/preparatory-year') {
    return <PreparatoryYearContent currentLang={currentLang} />;
  }

  if (activeRoute === 'immigration/igi-process') {
    return <IgiProcessContent currentLang={currentLang} />;
  }

  if (activeRoute.startsWith('start-here')) {
    const sub = activeRoute.split('/')[1] || 'planning-to-come';
    return (
      <StartHereContent
        subRoute={sub}
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
    );
  }

  if (activeRoute.startsWith('needs')) {
    const sub = activeRoute.split('/')[1] || 'first-days-checklist';
    return (
      <NeedsContent
        subRoute={sub}
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
    );
  }

  if (activeRoute.startsWith('work')) {
    const sub = activeRoute.split('/')[1] || 'find-job';
    return (
      <WorkOverviewContent
        subRoute={sub}
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
    );
  }

  if (activeRoute.startsWith('company')) {
    const sub = activeRoute.split('/')[1] || 'overview';
    return (
      <div className="space-y-12">
        <CompanyOverviewContent
          subRoute={sub}
          currentLang={currentLang}
          onNavigate={onNavigate}
          onOpenEvaluationModal={onOpenEvaluationModal}
        />
        <LeadForm currentLang={currentLang} />
      </div>
    );
  }

  if (activeRoute.startsWith('immigration') && activeRoute !== 'immigration/igi-process') {
    const sub = activeRoute.split('/')[1] || 'overview';
    return (
      <div className="space-y-12">
        <ImmigrationOverviewContent
          subRoute={sub}
          currentLang={currentLang}
          onNavigate={onNavigate}
          onOpenEvaluationModal={onOpenEvaluationModal}
        />
        <LeadForm currentLang={currentLang} />
      </div>
    );
  }

  if (activeRoute === 'scholarships') {
    return (
      <div className="space-y-12">
        <ScholarshipOverviewContent currentLang={currentLang} />
        <LeadForm currentLang={currentLang} />
      </div>
    );
  }

  if (activeRoute.startsWith('romania')) {
    const sub = activeRoute.split('/')[1] || 'economy';
    return (
      <RomaniaOverviewContent
        subRoute={sub}
        currentLang={currentLang}
        onNavigate={onNavigate}
        onOpenEvaluationModal={onOpenEvaluationModal}
      />
    );
  }

  // RENDER PAGE BY ROUTE ID
  switch (activeRoute) {
    
    // -------------------------------------------------------------
    // 1. HOME PAGE (Master Visual Sequence & Mona Benchmarks)
    // -------------------------------------------------------------
    case 'home':
    default:
      return (
        <div className="space-y-0">
          
          {/* Focused Romania Hero (55% Content / 45% Visual Composition) */}
          <section className="dark-hero-panel py-20 sm:py-28 relative overflow-hidden rounded-b-[28px] shadow-2xl min-h-[680px] flex items-center">
            
            {/* Ambient Lighting Background */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#2f6bd1]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#2F6FED]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Content Column (55% desktop width = 7 cols) */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
                  
                  {/* Eyebrow Badge */}
                  <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-semibold text-[#F4F7FC]">
                    <ShieldCheck size={14} className="text-[#F4F7FC]" />
                    <span>{currentLang === 'fa' ? 'پلتفرم مستقل مشاوره برای متقاضیان سراسر جهان' : 'Independent Advisory Platform for Global Applicants'}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2]">
                    {currentLang === 'fa' ? 'مسیر آگاهانه شما برای تحصیل، کار و زندگی در رومانی' : 'Your Clear Pathway for Study, Career & Life in Romania'}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-medium">
                    {currentLang === 'fa'
                      ? 'اطلاعات قابل‌بررسی، ارزیابی اولیه و همراهی مرحله‌به‌مرحله برای ایرانیان داخل ایران، امارات، ترکیه و سایر کشورها.'
                      : 'Verified insights, eligibility audits, and structured advisory for global applicants exploring legal opportunities in Romania.'}
                  </p>

                  {/* Hero Action Buttons Hierarchy */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Button
                      variant="accent"
                      size="lg"
                      onClick={onOpenEvaluationModal}
                      rightIcon={<ArrowIcon size={16} />}
                      className="w-full sm:w-auto"
                    >
                      {t.hero.ctaPrimary}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => onNavigate('services')}
                      className="w-full sm:w-auto"
                    >
                      {currentLang === 'fa' ? 'مشاهده مسیرها' : 'Explore Pathways'}
                    </Button>
                  </div>

                  {/* Tertiary Link */}
                  <div className="pt-2 flex items-center justify-center lg:justify-start">
                    <button
                      onClick={onOpenEvaluationModal}
                      className="text-xs text-slate-300 hover:text-[#F4F7FC] font-semibold inline-flex items-center space-x-2 rtl:space-x-reverse transition-colors cursor-pointer"
                    >
                      <Calendar size={14} className="text-[#F4F7FC]" />
                      <span>{currentLang === 'fa' ? 'رزرو مشاوره تخصصی' : 'Schedule Personal Consultation'}</span>
                    </button>
                  </div>

                </div>

                {/* Visual Composition Column (45% desktop width = 5 cols) */}
                <div className="lg:col-span-5 relative">
                  <div className="relative mx-auto max-w-md lg:max-w-none">
                    
                    <div className="relative overflow-hidden rounded-[28px] border border-white/20 bg-slate-900/90 shadow-2xl p-6 space-y-4">
                      
                      <div className="flex items-center justify-between text-xs text-slate-200 font-bold border-b border-white/15 pb-3">
                        <span className="flex items-center space-x-2 rtl:space-x-reverse text-[#F4F7FC]">
                          <Landmark size={16} />
                          <span>Bucharest • European Union</span>
                        </span>
                        <span className="bg-[#2F6FED] px-2.5 py-1 rounded-md text-[11px] text-white border border-blue-400/30">Schengen Member</span>
                      </div>

                      <div className="space-y-3 pt-1 text-xs">
                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                          <span className="font-semibold text-white">🎓 Accredited Higher Education</span>
                          <span className="font-extrabold text-[#F4F7FC]">EU Degrees</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                          <span className="font-semibold text-white">💼 Employment & Work Permits</span>
                          <span className="font-extrabold text-[#F4F7FC]">Aviz de Munca</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                          <span className="font-semibold text-white">🏢 Corporate Registration (SRL)</span>
                          <span className="font-extrabold text-[#F4F7FC] leading-snug max-w-[200px] text-right">
                            {currentLang === 'fa' 
                              ? 'مالیات ۱٪ برای شرکتهای کوچک (گردش مالی زیر ۱۰۰,۰۰۰ یورو با حداقل یک کارمند)؛ در غیر این صورت ۱۶٪' 
                              : '1% tax for micro-companies (<€100k revenue, min 1 employee); otherwise 16%'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#2F6FED]/80 border border-[#2F6FED]/40 text-center text-xs text-slate-100 font-bold shadow-inner">
                        {currentLang === 'fa' ? 'ارزیابی حقوقی پرونده‌ها مطابق با قوانین اداره مهاجرت (IGI)' : 'Initial assessment compliant with official IGI immigration rules'}
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Compact Trust Strip */}
          <section className="bg-white border-b border-[#dfe6ef] py-6">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs font-bold text-[#142033]">
                
                <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse py-1">
                  <Landmark size={20} className="text-[#2F6FED]" />
                  <span>{currentLang === 'fa' ? 'اطلاعات مبتنی بر منابع رسمی' : 'Sourced from Official Portals'}</span>
                </div>

                <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse py-1 border-y md:border-y-0 md:border-x border-[#dfe6ef]">
                  <FileCheck2 size={20} className="text-[#2F6FED]" />
                  <span>{currentLang === 'fa' ? 'بررسی متناسب با شرایط متقاضی' : 'Tailored Applicant Assessment'}</span>
                </div>

                <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse py-1">
                  <ShieldCheck size={20} className="text-emerald-700" />
                  <span>{currentLang === 'fa' ? 'عدم ارائه وعده غیرواقعی' : 'No Unverified Promises'}</span>
                </div>

              </div>
            </div>
          </section>

          {/* Goal Selector */}
          <AudienceSelector
            currentLang={currentLang}
            onNavigate={onNavigate}
            onOpenEvaluationModal={onOpenEvaluationModal}
          />

          {/* Main Pathways Grid */}
          <section className="py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F6FED]">
                  {currentLang === 'fa' ? 'مسیرهای قانونی' : 'Legal Pathways'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142033]">
                  {t.pathways.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
                  {t.pathways.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.study.title}
                  desc={t.pathways.study.desc}
                  icon={GraduationCap}
                  badge={currentLang === 'fa' ? 'مسیر تحصیلی' : 'Academic'}
                  onClick={() => onNavigate('study')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.work.title}
                  desc={t.pathways.work.desc}
                  icon={BriefcaseBusiness}
                  badge={currentLang === 'fa' ? 'مسیر کاری' : 'Careers'}
                  onClick={() => onNavigate('work')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.company.title}
                  desc={t.pathways.company.desc}
                  icon={Building2}
                  badge={currentLang === 'fa' ? 'فعالیت تجاری' : 'Corporate'}
                  onClick={() => onNavigate('company')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.investment.title}
                  desc={t.pathways.investment.desc}
                  icon={ChartNoAxesCombined}
                  badge={currentLang === 'fa' ? 'بررسی فرصت‌ها' : 'Investment'}
                  onClick={() => onNavigate('immigration')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.family.title}
                  desc={t.pathways.family.desc}
                  icon={Users}
                  badge={currentLang === 'fa' ? 'پیوست خانواده' : 'Family'}
                  onClick={() => onNavigate('immigration')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.living.title}
                  desc={t.pathways.living.desc}
                  icon={House}
                  badge={currentLang === 'fa' ? 'راهنمای استقرار' : 'Settlement'}
                  onClick={() => onNavigate('needs/first-days-checklist')}
                />
              </div>

            </div>
          </section>

          {/* "Why Romania?" Editorial Split Section */}
          <section className="py-20 bg-[#f7f9fc] border-y border-[#dfe6ef]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-5 space-y-4">
                  <div className="editorial-card p-6 space-y-4 bg-white border border-[#dfe6ef]">
                    <div className="flex items-center justify-between border-b border-[#dfe6ef] pb-3 text-xs font-bold text-[#142033]">
                      <span>🇷🇴 {currentLang === 'fa' ? 'شناسنامه کشور رومانی' : 'Romania Country Profile'}</span>
                      <span className="text-[#2F6FED]">EU & Schengen</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#eef3f8] flex items-center justify-between font-medium">
                        <span>{currentLang === 'fa' ? 'پایتخت:' : 'Capital:'}</span>
                        <span className="font-bold text-[#142033]">Bucharest</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#eef3f8] flex items-center justify-between font-medium">
                        <span>{currentLang === 'fa' ? 'عضویت در شنگن:' : 'Schengen Area:'}</span>
                        <span className="font-bold text-emerald-700">{currentLang === 'fa' ? 'عضو رسمی' : 'Full Member'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#eef3f8] flex items-center justify-between font-medium">
                        <span>{currentLang === 'fa' ? 'زبان‌های تدریس:' : 'Languages of Instruction:'}</span>
                        <span className="font-bold text-[#142033]">English, French, Romanian</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F6FED]">
                      {t.whyRomania.eyebrow}
                    </span>
                    <h2 className="text-3xl font-extrabold text-[#142033]">
                      {currentLang === 'fa' ? 'کشوری اروپایی با فرصت‌های متنوع برای تحصیل، کار و کسب‌وکار' : 'A European Nation Offering Diverse Academic & Business Growth'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {t.whyRomania.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="editorial-card p-5 space-y-2 bg-white">
                        <h3 className="text-base font-extrabold text-[#142033]">{item.title}</h3>
                        <p className="text-xs text-[#526174] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Process Timeline */}
          <ProcessTimeline currentLang={currentLang} />

          {/* Featured Universities */}
          <section className="py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#dfe6ef] pb-4">
                <div className="space-y-1">
                  <span className="text-[#2F6FED] font-extrabold text-xs uppercase tracking-wider">
                    {currentLang === 'fa' ? 'دانشگاه‌های معتبر' : 'Higher Education'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                    {currentLang === 'fa' ? 'آموزش عالی رومانی' : 'Accredited Romanian Universities'}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('universities')}
                  rightIcon={<ArrowIcon size={14} />}
                >
                  {currentLang === 'fa' ? 'مشاهده همه دانشگاه‌ها' : 'View All Universities'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredUniversities.map((uni) => (
                  <UniversityCard
                    key={uni.id}
                    university={uni}
                    currentLang={currentLang}
                    onSelect={() => onNavigate('study')}
                  />
                ))}
              </div>

            </div>
          </section>

          {/* Featured Cities */}
          <section className="py-20 bg-[#f7f9fc] border-y border-[#dfe6ef]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#dfe6ef] pb-4">
                <div className="space-y-1">
                  <span className="text-[#2F6FED] font-extrabold text-xs uppercase tracking-wider">
                    {currentLang === 'fa' ? 'شهرهای اصلی' : 'Key Cities'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                    {currentLang === 'fa' ? 'شهرهای رومانی برای استقرار' : 'Top Cities for Relocation'}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('romania/cities')}
                  rightIcon={<ArrowIcon size={14} />}
                >
                  {currentLang === 'fa' ? 'مقایسه شهرهای رومانی' : 'Compare Cities'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredCities.slice(0, 3).map((city) => (
                  <CityCard
                    key={city.id}
                    city={city}
                    currentLang={currentLang}
                    onSelect={() => onNavigate('romania/cities')}
                  />
                ))}
              </div>

            </div>
          </section>

          {/* Official Resources Section */}
          <section className="py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F6FED]">
                  {currentLang === 'fa' ? 'منابع قانونی' : 'Official Portals'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                  {currentLang === 'fa' ? 'درگاه‌های رسمی و دولتی رومانی' : 'Official Romanian Authorities'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <OfficialResourceCard
                  currentLang={currentLang}
                  title={currentLang === 'fa' ? 'اداره کل مهاجرت (IGI)' : 'General Inspectorate for Immigration'}
                  category={currentLang === 'fa' ? 'اقامت و ویزا' : 'Residency & Visa'}
                  domain="igi.mai.gov.ro"
                  url="https://igi.mai.gov.ro"
                  lastChecked="2026"
                />
                <OfficialResourceCard
                  currentLang={currentLang}
                  title={currentLang === 'fa' ? 'وزارت امور خارجه (MAE)' : 'Ministry of Foreign Affairs'}
                  category={currentLang === 'fa' ? 'کنسولی' : 'Consular'}
                  domain="mae.ro"
                  url="https://mae.ro"
                  lastChecked="2026"
                />
                <OfficialResourceCard
                  currentLang={currentLang}
                  title={currentLang === 'fa' ? 'وزارت آموزش رومانی' : 'Ministry of Education'}
                  category={currentLang === 'fa' ? 'تاییدیه مدارک' : 'Academic Verification'}
                  domain="edu.ro"
                  url="https://edu.ro"
                  lastChecked="2026"
                />
                <OfficialResourceCard
                  currentLang={currentLang}
                  title={currentLang === 'fa' ? 'اداره ثبت شرکت‌ها (ONRC)' : 'National Trade Register Office'}
                  category={currentLang === 'fa' ? 'تجاری' : 'Corporate'}
                  domain="onrc.ro"
                  url="https://onrc.ro"
                  lastChecked="2026"
                />
              </div>
            </div>
          </section>

          {/* Multi-Step Assessment Form */}
          <section id="evaluation-form-section" className="py-20 bg-[#f7f9fc] border-y border-[#dfe6ef]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
              <LeadForm currentLang={currentLang} />
            </div>
          </section>

          {/* Working Principles */}
          <section className="py-20 bg-white border-b border-[#dfe6ef]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F6FED]">
                  {currentLang === 'fa' ? 'اصول اخلاقی و حقوقی' : 'Working Principles'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                  {currentLang === 'fa' ? 'شفافیت کامل در ارائه خدمات' : 'Our Professional Commitments'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="editorial-card p-6 bg-white space-y-3">
                  <FileCheck2 size={24} className="text-[#2F6FED]" />
                  <h3 className="text-base font-extrabold text-[#142033]">{currentLang === 'fa' ? 'اطلاعات قابل بررسی' : 'Verified Insights'}</h3>
                  <p className="text-xs text-[#526174] leading-relaxed">{currentLang === 'fa' ? 'مطالب مهم حقوقی و دانشگاهی همراه با منبع و تاریخ آخرین بررسی منتشر می‌شوند.' : 'Sourced from official Romanian embassy and IGI documentation.'}</p>
                </div>

                <div className="editorial-card p-6 bg-white space-y-3">
                  <Scale size={24} className="text-[#2F6FED]" />
                  <h3 className="text-base font-extrabold text-[#142033]">{currentLang === 'fa' ? 'شفافیت در حدود خدمات' : 'Scope Transparency'}</h3>
                  <p className="text-xs text-[#526174] leading-relaxed">{currentLang === 'fa' ? 'پیش از شروع همکاری، محدوده خدمات، هزینه‌ها و مسئولیت‌های طرفین توضیح داده می‌شود.' : 'Scope of service, timelines, and costs defined clearly in advance.'}</p>
                </div>

                <div className="editorial-card p-6 bg-white space-y-3">
                  <ShieldCheck size={24} className="text-[#2F6FED]" />
                  <h3 className="text-base font-extrabold text-[#142033]">{currentLang === 'fa' ? 'عدم تضمین نتیجه' : 'Honest Legal Limits'}</h3>
                  <p className="text-xs text-[#526174] leading-relaxed">{currentLang === 'fa' ? 'تصمیم نهایی درباره پذیرش، ویزا و اقامت صراحتاً در اختیار مراجع مربوطه است.' : 'Legal honesty acknowledging that visa issuance rests strictly with authorities.'}</p>
                </div>

                <div className="editorial-card p-6 bg-white space-y-3">
                  <LockKeyhole size={24} className="text-[#2F6FED]" />
                  <h3 className="text-base font-extrabold text-[#142033]">{currentLang === 'fa' ? 'حفظ حریم خصوصی' : 'GDPR Compliance'}</h3>
                  <p className="text-xs text-[#526174] leading-relaxed">{currentLang === 'fa' ? 'اطلاعات متقاضیان فقط برای ارائه خدمات و ارتباط مرتبط پردازش می‌شود.' : 'Data stored securely under European Union GDPR regulations.'}</p>
                </div>
              </div>

            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="py-20 bg-[#f7f9fc]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F6FED]">
                  {currentLang === 'fa' ? 'پرسش‌های متداول' : 'Frequently Asked Questions'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                  {currentLang === 'fa' ? 'پاسخ به سوالات کلیدی متقاضیان' : 'Key Information & Clarifications'}
                </h2>
              </div>

              <FAQAccordion currentLang={currentLang} />
            </div>
          </section>

          {/* Final CTA Banner */}
          <section className="dark-hero-panel py-16 text-white text-center space-y-6">
            <div className="max-w-[800px] mx-auto px-4 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                {currentLang === 'fa' ? 'برای انتخاب مسیر مناسب رومانی نیاز به راهنمایی دارید؟' : 'Ready to Assess Your Legal Eligibility?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl mx-auto">
                {currentLang === 'fa'
                  ? 'اطلاعات اولیه خود را ارسال کنید تا گزینه‌های قابل بررسی برای تحصیل، کار، کسب‌وکار یا زندگی در رومانی مشخص شوند.'
                  : 'Submit your basic background details for a clear, personalized evaluation of options in Romania.'}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="accent"
                  size="md"
                  onClick={onOpenEvaluationModal}
                  rightIcon={<ArrowIcon size={16} />}
                >
                  {currentLang === 'fa' ? 'شروع ارزیابی رایگان' : 'Start Free Assessment'}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={onOpenEvaluationModal}
                >
                  {currentLang === 'fa' ? 'رزرو مشاوره' : 'Schedule Consultation'}
                </Button>
              </div>
            </div>
          </section>

        </div>
      );

    // OTHER ROUTE PAGES
    case 'immigration':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'بررسی مسیرهای قانونی' : 'Legal Pathways Overview'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'مهاجرت به کشور رومانی' : 'Immigration to Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'بررسی کلیه روش‌های قانونی مهاجرت، دریافت اقامت موقت و دائم اتحادیه اروپا در کشور رومانی طبق قوانین اداره کل مهاجرت (IGI).'
                : 'Comprehensive legal overview of temporary and long-term European residency pathways in Romania.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="editorial-card p-6 space-y-3 bg-white">
              <h3 className="text-lg font-bold text-[#2F6FED]">🎓 {t.pathways.study.title}</h3>
              <p className="text-xs text-[#526174] leading-relaxed">{t.pathways.study.desc}</p>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('study')} rightIcon={<ArrowIcon size={14} />}>
                {currentLang === 'fa' ? 'جزئیات تحصیل در رومانی' : 'Study Details'}
              </Button>
            </div>

            <div className="editorial-card p-6 space-y-3 bg-white">
              <h3 className="text-lg font-bold text-[#2F6FED]">💼 {t.pathways.work.title}</h3>
              <p className="text-xs text-[#526174] leading-relaxed">{t.pathways.work.desc}</p>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('work')} rightIcon={<ArrowIcon size={14} />}>
                {currentLang === 'fa' ? 'جزئیات اشتغال و ویزای کار' : 'Work Permit Details'}
              </Button>
            </div>
          </div>

          <LeadForm currentLang={currentLang} />
        </div>
      );

    case 'study':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'آموزش عالی رومانی' : 'Higher Education'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'تحصیل در دانشگاه‌های معتبر رومانی' : 'Study in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'تحصیل به زبان‌های انگلیسی و فرانسوی با شهریه‌های اقتصادی، مدارک معتبر اتحادیه اروپا و امکان کار دانشجویی.'
                : 'Accredited European university degrees in English & French with balanced tuition and student work permits.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="editorial-card p-6 space-y-4 bg-white">
                <h2 className="text-lg font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'مزایای تحصیل در رومانی' : 'Why Study in Romania?'}
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-[#526174]">
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2F6FED] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>{currentLang === 'fa' ? 'پذیرش در رشته‌های پزشکی و مهندسی به زبان انگلیسی' : 'Medicine & Engineering in English'}</span>
                  </li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2F6FED] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>{currentLang === 'fa' ? 'شهریه سالانه متعادل بر اساس رشته و دانشگاه' : 'Balanced annual tuition rates'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#142033]">
                  {currentLang === 'fa' ? 'دانشگاه‌های پیشنهادی' : 'Featured Universities'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredUniversities.map((uni) => (
                    <UniversityCard key={uni.id} university={uni} currentLang={currentLang} onSelect={() => {}} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <LeadForm currentLang={currentLang} isModal={true} />
            </div>
          </div>
        </div>
      );

    case 'work':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'کار و اشتغال در رومانی' : 'Work in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای بازار کار، رشته‌های پرتقاضا (IT، مهندسی) و فرآیند صدور مجوز کار (Aviz de Munca).'
                : 'Job market overview, in-demand technical sectors, and Work Permit approval rules.'}
            </p>
          </div>

          <LeadForm currentLang={currentLang} />
        </div>
      );

    case 'universities':
      const filteredUnis = featuredUniversities.filter((uni) => {
        const nameMatches = uni.name[currentLang].toLowerCase().includes(uniSearch.toLowerCase());
        const cityMatches = uni.city[currentLang].toLowerCase().includes(uniSearch.toLowerCase());
        return nameMatches || cityMatches;
      });

      return (
        <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.universities}</h1>
            <p className="text-[#526174] text-xs sm:text-sm mt-1">
              {currentLang === 'fa' ? 'فهرست دانشگاه‌های معتبر رومانی' : 'Accredited Romanian Universities'}
            </p>
          </div>

          <div className="bg-[#eef3f8] p-4 rounded-2xl border border-[#dfe6ef]">
            <input
              type="text"
              value={uniSearch}
              onChange={(e) => setUniSearch(e.target.value)}
              placeholder={currentLang === 'fa' ? 'جستجوی دانشگاه یا شهر...' : 'Search university or city...'}
              className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnis.map((uni) => (
              <UniversityCard key={uni.id} university={uni} currentLang={currentLang} onSelect={() => onNavigate('study')} />
            ))}
          </div>
        </div>
      );

    case 'cities':
      const filteredCities = featuredCities.filter((c) =>
        c.name[currentLang].toLowerCase().includes(citySearch.toLowerCase()) ||
        c.romanianName.toLowerCase().includes(citySearch.toLowerCase())
      );

      return (
        <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.cities}</h1>
            <p className="text-[#526174] text-xs sm:text-sm mt-1">
              {currentLang === 'fa' ? 'شهرهای کلیدی کشور رومانی' : 'Key Romanian Cities'}
            </p>
          </div>

          <div className="bg-[#eef3f8] p-4 rounded-2xl border border-[#dfe6ef]">
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder={currentLang === 'fa' ? 'جستجوی شهر...' : 'Search city...'}
              className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard key={city.id} city={city} currentLang={currentLang} onSelect={() => {}} />
            ))}
          </div>
        </div>
      );

    case 'services':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.services}</h1>
            <p className="text-[#526174] text-xs sm:text-sm mt-1">
              {currentLang === 'fa' ? 'خدمات تخصصی ارزیابی و مشاوره اولیه' : 'Professional Case Advisory Services'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainServices.map((svc) => (
              <ServiceCard key={svc.id} service={svc} currentLang={currentLang} onSelect={onOpenEvaluationModal} />
            ))}
          </div>
        </div>
      );

    case 'articles':
      return (
        <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.articles}</h1>
            <p className="text-[#526174] text-xs sm:text-sm mt-1">
              {currentLang === 'fa' ? 'مقالات و راهنماهای آموزشی و مهاجرتی' : 'Articles & Legal Updates'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleArticles.map((art) => (
              <div key={art.id} className="editorial-card p-6 space-y-3 bg-white">
                <span className="text-xs text-[#2F6FED] bg-blue-50 px-2.5 py-1 rounded font-semibold">{art.category[currentLang]}</span>
                <h3 className="font-bold text-[#142033] text-base">{art.title[currentLang]}</h3>
                <p className="text-xs text-[#526174] leading-relaxed">{art.excerpt[currentLang]}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'about-romania':
      return (
        <RomaniaOverviewContent
          subRoute="economy"
          currentLang={currentLang}
          onNavigate={onNavigate}
          onOpenEvaluationModal={onOpenEvaluationModal}
        />
      );

    case 'about':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'درباره پلتفرم «در رومانی»' : 'About Dar Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {t.brand.description}
            </p>
          </div>

          <TrustSection currentLang={currentLang} />
        </div>
      );

    case 'contact':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{t.nav.contact}</h1>
            <p className="text-[#526174] text-xs sm:text-sm mt-1">
              {currentLang === 'fa' ? 'راه‌های ارتباطی با ما' : 'Contact Our Team'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="editorial-card p-6 space-y-2 bg-white">
                <div className="font-bold text-[#142033]">📍 {currentLang === 'fa' ? 'دفتر رومانی:' : 'Bucharest Office:'}</div>
                <p className="text-xs text-[#526174]">Bucharest, Romania</p>
              </div>
              <div className="bg-[#2F6FED] text-white p-6 rounded-2xl space-y-2 shadow-md">
                <div className="font-bold text-[#F4F7FC]">✉️ {currentLang === 'fa' ? 'ایمیل:' : 'Email:'}</div>
                <p className="text-xs text-slate-100"><span dir="ltr" className="inline-block">ontrip.ai@gmail.com</span></p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <LeadForm currentLang={currentLang} />
            </div>
          </div>
        </div>
      );

    case 'legal/privacy':
    case 'legal/terms':
    case 'legal/disclaimer':
      return (
        <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-[#dfe6ef] editorial-card">
          <h1 className="text-2xl font-bold text-[#142033] border-b border-[#dfe6ef] pb-4">
            {activeRoute.includes('privacy') 
              ? (currentLang === 'fa' ? 'سیاست حریم خصوصی' : 'Privacy Policy')
              : (currentLang === 'fa' ? 'شرایط و قوانین استفاده' : 'Terms & Disclaimer')}
          </h1>

          <div className="space-y-4 text-xs sm:text-sm text-[#526174] leading-relaxed">
            <p>{t.disclaimer.text}</p>
          </div>
        </div>
      );
  }
};
