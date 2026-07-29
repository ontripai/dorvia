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

  // RENDER PAGE BY ROUTE ID
  switch (activeRoute) {
    
    // -------------------------------------------------------------
    // 1. HOME PAGE (Premium European Editorial Experience)
    // -------------------------------------------------------------
    case 'home':
    default:
      return (
        <div className="space-y-0 -mt-8 sm:-mt-12">
          
          {/* Section 1: Premium Editorial Hero (55% Content / 45% Image Composition) */}
          <section className="dark-hero-panel py-20 sm:py-28 relative overflow-hidden rounded-b-[28px] shadow-2xl min-h-[680px] flex items-center">
            
            {/* Ambient Lighting Background */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#2f6bd1]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#fcd116]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Content Column (55% desktop width = 7 cols) */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
                  
                  {/* Eyebrow Badge */}
                  <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-semibold text-[#fcd116]">
                    <ShieldCheck size={14} className="text-[#fcd116]" />
                    <span>{currentLang === 'fa' ? 'راهنمای جامع رومانی برای ایرانیان سراسر جهان' : 'Official Romanian Platform for Global Applicants'}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2]">
                    {currentLang === 'fa' ? 'مسیر آگاهانه شما برای تحصیل، کار و زندگی در رومانی' : 'Your Clear Pathway for Study, Career & Life in Romania'}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-medium">
                    {currentLang === 'fa'
                      ? 'اطلاعات قابل‌بررسی، ارزیابی اولیه و همراهی مرحله‌به‌مرحله برای ایرانیان داخل ایران، امارات، ترکیه و سایر کشورها.'
                      : 'Verified insights, eligibility audits, and structured advisory for global applicants exploring legal opportunities in Romania.'}
                  </p>

                  {/* Hero Action Button Hierarchy */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <button
                      onClick={onOpenEvaluationModal}
                      className="w-full sm:w-auto bg-[#fcd116] hover:bg-yellow-400 text-[#06162d] font-extrabold px-8 py-4 rounded-xl text-sm flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-xl transition-all cursor-pointer"
                    >
                      <span>{t.hero.ctaPrimary}</span>
                      <ArrowIcon size={16} />
                    </button>

                    <button
                      onClick={() => onNavigate('services')}
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-sm border border-white/30 backdrop-blur transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
                    >
                      <span>{currentLang === 'fa' ? 'مشاهده مسیرهای رومانی' : 'Explore Legal Pathways'}</span>
                    </button>
                  </div>

                  {/* Tertiary Link */}
                  <div className="pt-2 flex items-center justify-center lg:justify-start">
                    <button
                      onClick={onOpenEvaluationModal}
                      className="text-xs text-slate-300 hover:text-[#fcd116] font-semibold inline-flex items-center space-x-2 rtl:space-x-reverse transition-colors cursor-pointer"
                    >
                      <Calendar size={14} className="text-[#fcd116]" />
                      <span>{currentLang === 'fa' ? 'رزرو مشاوره تخصصی' : 'Schedule Personal Consultation'}</span>
                    </button>
                  </div>

                </div>

                {/* Visual Image Composition Column (45% desktop width = 5 cols) */}
                <div className="lg:col-span-5 relative">
                  <div className="relative mx-auto max-w-md lg:max-w-none">
                    
                    {/* Primary Photo Container */}
                    <div className="relative overflow-hidden rounded-[28px] border border-white/20 bg-slate-900/90 shadow-2xl p-6 space-y-4">
                      
                      <div className="flex items-center justify-between text-xs text-slate-200 font-bold border-b border-white/15 pb-3">
                        <span className="flex items-center space-x-2 rtl:space-x-reverse text-[#fcd116]">
                          <Landmark size={16} />
                          <span>Bucharest • European Union</span>
                        </span>
                        <span className="bg-[#0038a8] px-2.5 py-1 rounded-md text-[11px] text-white border border-blue-400/30">Schengen Zone</span>
                      </div>

                      <div className="space-y-3 pt-1 text-xs">
                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                          <span className="font-semibold text-white">🎓 Accredited Higher Education</span>
                          <span className="font-extrabold text-[#fcd116]">EU Degrees</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                          <span className="font-semibold text-white">💼 Employment & Work Permits</span>
                          <span className="font-extrabold text-[#fcd116]">Aviz de Munca</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                          <span className="font-semibold text-white">🏢 Corporate Registration (SRL)</span>
                          <span className="font-extrabold text-[#fcd116]">1% Tax Option</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0038a8]/80 border border-[#fcd116]/30 text-center text-xs text-slate-100 font-bold shadow-inner">
                        {currentLang === 'fa' ? 'ارزیابی حقوقی پرونده‌ها مطابق با قوانین اداره مهاجرت (IGI)' : 'Initial assessment compliant with official IGI immigration rules'}
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Section 2: Official Trust Strip */}
          <section className="bg-white border-b border-[#dfe6ef] py-6">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs font-bold text-[#142033]">
                
                <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse py-1">
                  <Landmark size={20} className="text-[#0038a8]" />
                  <span>{currentLang === 'fa' ? 'اطلاعات قابل‌بررسی از منابع رسمی' : 'Verified Official Sources'}</span>
                </div>

                <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse py-1 border-y md:border-y-0 md:border-x border-[#dfe6ef]">
                  <FileCheck2 size={20} className="text-[#0038a8]" />
                  <span>{currentLang === 'fa' ? 'ارزیابی متناسب با شرایط شخصی' : 'Tailored Eligibility Audit'}</span>
                </div>

                <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse py-1">
                  <ShieldCheck size={20} className="text-emerald-700" />
                  <span>{currentLang === 'fa' ? 'پاسخگویی بدون وعده‌های غیرواقعی' : 'Transparent & Legal Compliance'}</span>
                </div>

              </div>
            </div>
          </section>

          {/* Section 3: Interactive Audience Goal Selector */}
          <AudienceSelector
            currentLang={currentLang}
            onNavigate={onNavigate}
            onOpenEvaluationModal={onOpenEvaluationModal}
          />

          {/* Section 4: Main Pathways Grid (3 cols x 2 rows) */}
          <section className="py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0038a8]">
                  {currentLang === 'fa' ? 'مسیرهای ورود قانونی' : 'Primary Pathways'}
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
                  onClick={() => onNavigate('living')}
                />
              </div>

            </div>
          </section>

          {/* Section 5: "Why Romania?" Editorial Two-Column Section */}
          <section className="py-20 bg-[#f7f9fc] border-y border-[#dfe6ef]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Facts & Images */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="editorial-card p-6 space-y-4 bg-white border border-[#dfe6ef]">
                    <div className="flex items-center justify-between border-b border-[#dfe6ef] pb-3 text-xs font-bold text-[#142033]">
                      <span>🇷🇴 {currentLang === 'fa' ? 'شناسنامه کشور رومانی' : 'Romania Snapshot'}</span>
                      <span className="text-[#0038a8]">EU & Schengen</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#eef3f8] flex items-center justify-between font-medium">
                        <span>{currentLang === 'fa' ? 'پایتخت:' : 'Capital:'}</span>
                        <span className="font-bold text-[#142033]">Bucharest</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#eef3f8] flex items-center justify-between font-medium">
                        <span>{currentLang === 'fa' ? 'عضویت در شنگن:' : 'Schengen Status:'}</span>
                        <span className="font-bold text-emerald-700">{currentLang === 'fa' ? 'عضو رسمی' : 'Full Member'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#eef3f8] flex items-center justify-between font-medium">
                        <span>{currentLang === 'fa' ? 'زبان رسمی / تدریس:' : 'Official Languages:'}</span>
                        <span className="font-bold text-[#142033]">Romanian, English, French</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: 4 Editorial Advantages */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#0038a8]">
                      {t.whyRomania.eyebrow}
                    </span>
                    <h2 className="text-3xl font-extrabold text-[#142033]">
                      {t.whyRomania.title}
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

          {/* Section 6: Process Timeline */}
          <ProcessTimeline currentLang={currentLang} />

          {/* Section 7: Featured Universities */}
          <section className="py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#dfe6ef] pb-4">
                <div className="space-y-1">
                  <span className="text-[#0038a8] font-extrabold text-xs uppercase tracking-wider">
                    {currentLang === 'fa' ? 'دانشگاه‌های معتبر' : 'Higher Education'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                    {currentLang === 'fa' ? 'آموزش عالی رومانی' : 'Accredited Romanian Universities'}
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('universities')}
                  className="text-xs font-bold text-[#0038a8] hover:underline flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
                >
                  <span>{currentLang === 'fa' ? 'مشاهده همه دانشگاه‌ها' : 'View All Universities'}</span>
                  <ArrowIcon size={14} />
                </button>
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

          {/* Section 8: Key Cities */}
          <section className="py-20 bg-[#f7f9fc] border-y border-[#dfe6ef]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#dfe6ef] pb-4">
                <div className="space-y-1">
                  <span className="text-[#0038a8] font-extrabold text-xs uppercase tracking-wider">
                    {currentLang === 'fa' ? 'شهرهای اصلی' : 'Key Cities'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                    {currentLang === 'fa' ? 'شهرهای رومانی برای استقرار' : 'Top Cities for Relocation'}
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('cities')}
                  className="text-xs font-bold text-[#0038a8] hover:underline flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
                >
                  <span>{currentLang === 'fa' ? 'مقایسه شهرهای رومانی' : 'Compare Cities'}</span>
                  <ArrowIcon size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredCities.slice(0, 3).map((city) => (
                  <CityCard
                    key={city.id}
                    city={city}
                    currentLang={currentLang}
                    onSelect={() => onNavigate('cities')}
                  />
                ))}
              </div>

            </div>
          </section>

          {/* Section 9: Interactive Multi-Step Lead Form */}
          <section id="evaluation-form-section" className="py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
              <LeadForm currentLang={currentLang} />
            </div>
          </section>

          {/* Section 10: Trust Principles Section */}
          <section className="py-20 bg-[#f7f9fc] border-t border-[#dfe6ef]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0038a8]">
                  {currentLang === 'fa' ? 'اصول اخلاقی و حقوقی ما' : 'Trust Principles'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
                  {currentLang === 'fa' ? 'شفافیت کامل در ارائه خدمات' : 'Our Professional Commitments'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="editorial-card p-6 bg-white space-y-3">
                  <FileCheck2 size={24} className="text-[#0038a8]" />
                  <h3 className="text-base font-extrabold text-[#142033]">{currentLang === 'fa' ? 'اطلاعات قابل بررسی' : 'Verified Insights'}</h3>
                  <p className="text-xs text-[#526174] leading-relaxed">{currentLang === 'fa' ? 'تمام قوانین و ضوابط اعلام شده مستقیماً از منابع رسمی سفارت و IGI می‌باشد.' : 'Content sourced directly from official Embassy and IGI documentation.'}</p>
                </div>

                <div className="editorial-card p-6 bg-white space-y-3">
                  <Scale size={24} className="text-[#0038a8]" />
                  <h3 className="text-base font-extrabold text-[#142033]">{currentLang === 'fa' ? 'شفافیت در حدود خدمات' : 'Scope Clarity'}</h3>
                  <p className="text-xs text-[#526174] leading-relaxed">{currentLang === 'fa' ? 'تعهد کامل به شفاف‌سازی هزینه‌ها و عدم ارائه وعده‌های بدون پشتوانه.' : 'Clear scope definition and fee transparency without unbacked claims.'}</p>
                </div>

                <div className="editorial-card p-6 bg-white space-y-3">
                  <ShieldCheck size={24} className="text-[#0038a8]" />
                  <h3 className="text-base font-extrabold text-[#142033]">{currentLang === 'fa' ? 'عدم تضمین نتیجه' : 'Honest Legal Limits'}</h3>
                  <p className="text-xs text-[#526174] leading-relaxed">{currentLang === 'fa' ? 'صداقت حقوقی درباره اینکه صدور ویزا صراحتاً در صلاحیت سفارت است.' : 'Legal honesty acknowledging that visa decisions rest strictly with embassies.'}</p>
                </div>

                <div className="editorial-card p-6 bg-white space-y-3">
                  <LockKeyhole size={24} className="text-[#0038a8]" />
                  <h3 className="text-base font-extrabold text-[#142033]">{currentLang === 'fa' ? 'حفظ حریم خصوصی' : 'GDPR Compliance'}</h3>
                  <p className="text-xs text-[#526174] leading-relaxed">{currentLang === 'fa' ? 'نگهداری محرمانه تمامی اطلاعات ارزیابی طبق استانداردهای GDPR اتحادیه اروپا.' : 'Strict data privacy compliance under European GDPR standards.'}</p>
                </div>
              </div>

            </div>
          </section>

          {/* Section 11: Final CTA Banner */}
          <section className="dark-hero-panel py-16 text-white text-center space-y-6">
            <div className="max-w-[800px] mx-auto px-4 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                {currentLang === 'fa' ? 'آماده بررسی اولیه شرایط پرونده خود هستید؟' : 'Ready to Assess Your Legal Eligibility?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl mx-auto">
                {currentLang === 'fa'
                  ? 'ارزیابی اولیه بدون هزینه انجام می‌شود و مشاوران ما بهترین گزینه‌های ممکن را پیشنهاد خواهند داد.'
                  : 'Start your free assessment today and receive structured guidance from our Romanian advisory team.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenEvaluationModal}
                  className="bg-[#fcd116] hover:bg-yellow-400 text-[#06162d] font-extrabold px-8 py-4 rounded-xl text-xs inline-flex items-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowIcon size={16} />
                </button>
              </div>
            </div>
          </section>

        </div>
      );

    // -------------------------------------------------------------
    // OTHER ROUTE PAGES (IMMIGRATION, STUDY, WORK, etc.)
    // -------------------------------------------------------------
    case 'immigration':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#fcd116] font-bold text-xs uppercase tracking-wider">
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
              <h3 className="text-lg font-bold text-[#0038a8]">🎓 {t.pathways.study.title}</h3>
              <p className="text-xs text-[#526174] leading-relaxed">{t.pathways.study.desc}</p>
              <button onClick={() => onNavigate('study')} className="text-xs font-bold text-[#0038a8] hover:underline flex items-center space-x-1 rtl:space-x-reverse cursor-pointer">
                <span>{currentLang === 'fa' ? 'جزئیات تحصیل در رومانی' : 'Study Details'}</span>
                <ArrowIcon size={14} />
              </button>
            </div>

            <div className="editorial-card p-6 space-y-3 bg-white">
              <h3 className="text-lg font-bold text-[#0038a8]">💼 {t.pathways.work.title}</h3>
              <p className="text-xs text-[#526174] leading-relaxed">{t.pathways.work.desc}</p>
              <button onClick={() => onNavigate('work')} className="text-xs font-bold text-[#0038a8] hover:underline flex items-center space-x-1 rtl:space-x-reverse cursor-pointer">
                <span>{currentLang === 'fa' ? 'جزئیات اشتغال و ویزای کار' : 'Work Permit Details'}</span>
                <ArrowIcon size={14} />
              </button>
            </div>
          </div>

          <LeadForm currentLang={currentLang} />
        </div>
      );

    case 'study':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <span className="text-[#fcd116] font-bold text-xs uppercase tracking-wider">
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
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-[#0038a8] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>{currentLang === 'fa' ? 'پذیرش در رشته‌های پزشکی و مهندسی به زبان انگلیسی' : 'Medicine & Engineering in English'}</span>
                  </li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-[#0038a8] flex items-center justify-center text-[10px] font-bold">✓</span>
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

    case 'company':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'ثبت شرکت در رومانی (SRL)' : 'Company Registration'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'بررسی قوانین ثبت شرکت SRL، ضوابط مالیاتی بر اساس نوع فعالیت و مسیرهای اقامتی مرتبط.'
                : 'SRL company formation steps, corporate tax rules, and executive residency criteria.'}
            </p>
          </div>

          <LeadForm currentLang={currentLang} />
        </div>
      );

    case 'living':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'زندگی و استقرار در رومانی' : 'Living in Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'بررسی هزینه‌های زندگی، اجاره مسکن، بیمه درمانی و شاخص‌های امنیت اجتماعی.'
                : 'Living costs, apartment rentals, healthcare, and safety index across Romania.'}
            </p>
          </div>
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
              className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0038a8] bg-white"
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
              className="w-full px-4 py-3 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0038a8] bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard key={city.id} city={city} currentLang={currentLang} onSelect={() => {}} />
            ))}
          </div>
        </div>
      );

    case 'about-romania':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
          <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {currentLang === 'fa' ? 'درباره کشور رومانی' : 'About Romania'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {t.aboutRomaniaIntro.desc}
            </p>
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
                <span className="text-xs text-[#0038a8] bg-blue-50 px-2.5 py-1 rounded font-semibold">{art.category[currentLang]}</span>
                <h3 className="font-bold text-[#142033] text-base">{art.title[currentLang]}</h3>
                <p className="text-xs text-[#526174] leading-relaxed">{art.excerpt[currentLang]}</p>
              </div>
            ))}
          </div>
        </div>
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
              <div className="bg-[#0038a8] text-white p-6 rounded-2xl space-y-2 shadow-md">
                <div className="font-bold text-[#fcd116]">✉️ {currentLang === 'fa' ? 'ایمیل:' : 'Email:'}</div>
                <p className="text-xs text-slate-100">info@darromania.com</p>
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
