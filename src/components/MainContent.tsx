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

  // Filter states
  const [uniSearch, setUniSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const ArrowChar = currentLang === 'fa' ? '←' : '→';

  // RENDER PAGE BY ROUTE ID
  switch (activeRoute) {
    
    // -------------------------------------------------------------
    // 1. HOME PAGE (Mona Aesthetics Inspired Layout & Theme)
    // -------------------------------------------------------------
    case 'home':
    default:
      return (
        <div className="space-y-0 -mt-8 sm:-mt-12">
          
          {/* Hero Section (Deep Navy Panel Inspired by monaproject dark-plum-panel) */}
          <section className="bg-gradient-to-br from-[#061A35] via-[#002B7F] to-[#071E3D] text-white py-16 sm:py-24 relative overflow-hidden rounded-b-[32px] shadow-2xl">
            {/* Background Ambient Accents */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#0038A8]/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FCD116]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Right Column: Headline & Description */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
                  
                  {/* Eyebrow Badge */}
                  <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-semibold text-[#FCD116]">
                    <span>🇪🇺</span>
                    <span>{t.hero.badge}</span>
                  </div>

                  <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.25]">
                    {t.hero.headline}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                    {t.hero.subheadline}
                  </p>

                  {/* Hero Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <button
                      onClick={onOpenEvaluationModal}
                      className="w-full sm:w-auto bg-[#FCD116] hover:bg-yellow-400 text-[#071E3D] font-extrabold px-8 py-4 rounded-2xl text-sm flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-xl transition-all cursor-pointer"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#002B7F] animate-ping" />
                      <span>{t.hero.ctaPrimary}</span>
                    </button>

                    <button
                      onClick={() => onNavigate('services')}
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl text-sm border border-white/30 backdrop-blur transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
                    >
                      <span>{t.hero.ctaSecondary}</span>
                      <span>{ArrowChar}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 pt-1 font-medium">
                    ✓ {t.hero.trustNote}
                  </p>
                </div>

                {/* Left Column: Visual Hub Card */}
                <div className="lg:col-span-5 relative">
                  <div className="relative mx-auto max-w-md lg:max-w-none">
                    <div className="relative overflow-hidden rounded-2xl border border-[#FCD116]/30 bg-slate-900/90 backdrop-blur-md p-6 space-y-4 shadow-2xl">
                      
                      <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-white/15 pb-3">
                        <span className="flex items-center space-x-2 rtl:space-x-reverse text-[#FCD116]">
                          <span>🏛️</span>
                          <span>Romania • European Union</span>
                        </span>
                        <span className="bg-[#0038A8]/80 px-2.5 py-1 rounded-md text-[11px] text-blue-100 border border-blue-600/50">Schengen Member</span>
                      </div>

                      <div className="space-y-3 pt-1 text-xs">
                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                          <span className="font-semibold text-white">🏛️ Bucharest (Capital Hub)</span>
                          <span className="font-extrabold text-[#FCD116]">EU Center</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                          <span className="font-semibold text-white">💻 Cluj-Napoca (Tech Hub)</span>
                          <span className="font-extrabold text-[#FCD116]">IT Sector</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between">
                          <span className="font-semibold text-white">🎓 Accredited Universities</span>
                          <span className="font-extrabold text-[#FCD116]">Global Degrees</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0038A8]/70 border border-[#FCD116]/40 text-center text-xs text-slate-100 font-bold shadow-inner">
                        {currentLang === 'fa' ? 'ارزیابی حقوقی و اولیه مطابق با ضوابط اداره مهاجرت رومانی (IGI)' : 'Initial case audit compliant with official IGI standards'}
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Section 2: 5-Column Stats & Trust Banner (Mona Aesthetics Inspired) */}
          <section className="bg-[#FBF7F2] border-y border-[#E5D9D4] py-6">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center items-center text-xs">
                
                <div className="space-y-1">
                  <div className="flex justify-center text-[#FCD116]">
                    <span>★★★★★</span>
                  </div>
                  <p className="font-bold text-[#122033]">{currentLang === 'fa' ? 'استاندارد عالی' : '5.0 Verified Score'}</p>
                </div>

                <div className="space-y-0.5">
                  <p className="font-bold text-[#122033]">{currentLang === 'fa' ? '+۵۰۰ پرونده موفق' : '500+ Legal Audits'}</p>
                  <p className="text-[11px] text-[#516174]">{currentLang === 'fa' ? 'ارزیابی و همراهی' : 'Case Consultation'}</p>
                </div>

                <div className="space-y-0.5">
                  <p className="font-bold text-[#122033]">Bucharest & Cluj</p>
                  <p className="text-[11px] text-[#516174]">{currentLang === 'fa' ? 'دفتر رسمی و پشتیبانی' : 'Romania Center'}</p>
                </div>

                <div className="space-y-0.5">
                  <p className="font-bold text-[#122033]">{currentLang === 'fa' ? 'پاسخگویی سریع' : '24-48h Response'}</p>
                  <p className="text-[11px] text-[#516174]">{currentLang === 'fa' ? 'بررسی تخصصی مدارک' : 'Initial Document Review'}</p>
                </div>

                <div className="col-span-2 md:col-span-1 space-y-0.5">
                  <p className="font-bold text-emerald-700">{currentLang === 'fa' ? 'شفافیت و قوانین IGI' : 'Official Compliance'}</p>
                  <p className="text-[11px] text-[#516174]">{currentLang === 'fa' ? 'مطابق ضوابط اتحادیه اروپا' : 'EU GDPR Compliant'}</p>
                </div>

              </div>
            </div>
          </section>

          {/* Section 3: Legal Pathways Grid (Luxury Cards) */}
          <section className="py-20 bg-[#FFFDF9]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0038A8]">
                  {currentLang === 'fa' ? 'مسیرهای اصلی مهاجرت' : 'Legal Pathways'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#122033]">
                  {t.pathways.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#516174] leading-relaxed">
                  {t.pathways.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.study.title}
                  desc={t.pathways.study.desc}
                  icon="🎓"
                  badge={currentLang === 'fa' ? 'پذیرش تحصیلی' : 'Popular'}
                  onClick={() => onNavigate('study')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.work.title}
                  desc={t.pathways.work.desc}
                  icon="💼"
                  badge={currentLang === 'fa' ? 'فرصت‌های کاری' : 'Careers'}
                  onClick={() => onNavigate('work')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.company.title}
                  desc={t.pathways.company.desc}
                  icon="🏢"
                  badge={currentLang === 'fa' ? 'ثبت شرکت' : 'Corporate'}
                  onClick={() => onNavigate('company')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.investment.title}
                  desc={t.pathways.investment.desc}
                  icon="📈"
                  onClick={() => onNavigate('immigration')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.family.title}
                  desc={t.pathways.family.desc}
                  icon="👨‍👩‍👧‍👦"
                  onClick={() => onNavigate('immigration')}
                />
                <PathwayCard
                  currentLang={currentLang}
                  title={t.pathways.living.title}
                  desc={t.pathways.living.desc}
                  icon="🏛️"
                  onClick={() => onNavigate('living')}
                />
              </div>

            </div>
          </section>

          {/* Section 4: "Our Approach" Quote Panel (Mona Project Inspired) */}
          <section className="bg-gradient-to-r from-[#061A35] via-[#002B7F] to-[#071E3D] py-20 relative text-white">
            <div className="max-w-[900px] mx-auto px-4 text-center space-y-8 relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FCD116]">
                {t.whyRomania.eyebrow}
              </span>
              
              <blockquote className="text-2xl sm:text-4xl font-extrabold text-white leading-snug">
                “{t.whyRomania.title}”
              </blockquote>

              <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto">
                <p>{t.whyRomania.subtitle}</p>
                
                <div className="py-2 space-y-1.5 text-white font-semibold">
                  <p>✓ {currentLang === 'fa' ? 'بررسی دقیق مدارک تحصیلی و شغلی پیش از اقدام' : 'Careful document & eligibility audit'}</p>
                  <p>✓ {currentLang === 'fa' ? 'شفافیت کامل در هزینه‌ها و عدم ارائه وعده‌های غیرواقعی' : '100% transparent process & legal honesty'}</p>
                  <p>✓ {currentLang === 'fa' ? 'پشتیبانی تا دریافت اجازه اقامت رسمی موقت و دائم' : 'End-to-end support until residency issuance'}</p>
                </div>

                <p>{t.disclaimer.text}</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenEvaluationModal}
                  className="bg-[#FCD116] hover:bg-yellow-400 text-[#071E3D] font-extrabold px-8 py-4 rounded-2xl text-xs inline-flex items-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg"
                >
                  <span>✨</span>
                  <span>{t.hero.ctaPrimary}</span>
                  <span>{ArrowChar}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 5: "What Would You Like Help With?" 5-Column Pill Grid */}
          <section className="py-20 bg-[#FBF7F2] border-y border-[#E5D9D4]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#122033]">
                  {currentLang === 'fa' ? 'هدف اصلی شما از مهاجرت چیست؟' : 'What Is Your Primary Goal?'}
                </h2>
                <p className="text-xs sm:text-sm text-[#516174]">
                  {currentLang === 'fa' ? 'یک مورد را انتخاب کنید تا اطلاعات مربوطه نمایش داده شود.' : 'Select a pathway to explore details.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => onNavigate('study')}
                  className="bg-white rounded-2xl border border-[#E5D9D4] p-4 text-center hover:shadow-md transition-all group flex flex-col justify-center items-center min-h-[90px] cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#122033] group-hover:text-[#0038A8] transition-colors leading-snug">
                    🎓 {t.pathways.study.title}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('work')}
                  className="bg-white rounded-2xl border border-[#E5D9D4] p-4 text-center hover:shadow-md transition-all group flex flex-col justify-center items-center min-h-[90px] cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#122033] group-hover:text-[#0038A8] transition-colors leading-snug">
                    💼 {t.pathways.work.title}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('company')}
                  className="bg-white rounded-2xl border border-[#E5D9D4] p-4 text-center hover:shadow-md transition-all group flex flex-col justify-center items-center min-h-[90px] cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#122033] group-hover:text-[#0038A8] transition-colors leading-snug">
                    🏢 {t.pathways.company.title}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('universities')}
                  className="bg-white rounded-2xl border border-[#E5D9D4] p-4 text-center hover:shadow-md transition-all group flex flex-col justify-center items-center min-h-[90px] cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#122033] group-hover:text-[#0038A8] transition-colors leading-snug">
                    🏛️ {t.nav.universities}
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('living')}
                  className="bg-white rounded-2xl border border-[#E5D9D4] p-4 text-center hover:shadow-md transition-all group flex flex-col justify-center items-center min-h-[90px] cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#122033] group-hover:text-[#0038A8] transition-colors leading-snug">
                    🌐 {t.nav.living}
                  </span>
                </button>
              </div>

            </div>
          </section>

          {/* Section 6: Featured Universities */}
          <section className="py-20 bg-[#FFFDF9]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#E5D9D4] pb-4">
                <div className="space-y-1">
                  <span className="text-[#0038A8] font-bold text-xs uppercase tracking-wider">
                    {currentLang === 'fa' ? 'دانشگاه‌های معتبر' : 'Featured Universities'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122033]">
                    {currentLang === 'fa' ? 'آموزش عالی رومانی' : 'Accredited Romanian Universities'}
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('universities')}
                  className="text-xs sm:text-sm font-bold text-[#0038A8] hover:underline flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
                >
                  <span>{currentLang === 'fa' ? 'مشاهده همه' : 'View All'}</span>
                  <span>{ArrowChar}</span>
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

          {/* Section 7: Key Cities */}
          <section className="py-20 bg-[#FBF7F2] border-y border-[#E5D9D4]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#E5D9D4] pb-4">
                <div className="space-y-1">
                  <span className="text-[#0038A8] font-bold text-xs uppercase tracking-wider">
                    {currentLang === 'fa' ? 'شهرهای کلیدی' : 'Key Cities'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122033]">
                    {currentLang === 'fa' ? 'شهرهای رومانی برای استقرار' : 'Top Cities for Relocation'}
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('cities')}
                  className="text-xs sm:text-sm font-bold text-[#0038A8] hover:underline flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
                >
                  <span>{currentLang === 'fa' ? 'مشاهده همه' : 'Explore All'}</span>
                  <span>{ArrowChar}</span>
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

          {/* Section 8: Interactive Lead Form */}
          <section id="evaluation-form-section" className="py-20 bg-[#FFFDF9]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <LeadForm currentLang={currentLang} />
            </div>
          </section>

          {/* Section 9: Trust & Legal Compliance */}
          <section className="py-20 bg-[#FBF7F2] border-t border-[#E5D9D4]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
              <TrustSection currentLang={currentLang} />
            </div>
          </section>

        </div>
      );

    // -------------------------------------------------------------
    // OTHER ROUTE PAGES (IMMIGRATION, STUDY, WORK, etc.)
    // -------------------------------------------------------------
    case 'immigration':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-[#061A35] to-[#0038A8] rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl text-white">
            <span className="text-[#FCD116] font-bold text-xs uppercase tracking-wider">
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
            <div className="bg-white p-6 rounded-2xl border border-[#E5D9D4] space-y-3 shadow-sm">
              <h3 className="text-lg font-bold text-[#0038A8]">🎓 {t.pathways.study.title}</h3>
              <p className="text-xs text-[#516174] leading-relaxed">{t.pathways.study.desc}</p>
              <button onClick={() => onNavigate('study')} className="text-xs font-bold text-[#0038A8] hover:underline flex items-center space-x-1 rtl:space-x-reverse cursor-pointer">
                <span>{currentLang === 'fa' ? 'جزئیات تحصیل در رومانی' : 'Study Details'}</span>
                <span>{ArrowChar}</span>
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5D9D4] space-y-3 shadow-sm">
              <h3 className="text-lg font-bold text-[#0038A8]">💼 {t.pathways.work.title}</h3>
              <p className="text-xs text-[#516174] leading-relaxed">{t.pathways.work.desc}</p>
              <button onClick={() => onNavigate('work')} className="text-xs font-bold text-[#0038A8] hover:underline flex items-center space-x-1 rtl:space-x-reverse cursor-pointer">
                <span>{currentLang === 'fa' ? 'جزئیات اشتغال و ویزای کار' : 'Work Permit Details'}</span>
                <span>{ArrowChar}</span>
              </button>
            </div>
          </div>

          <TrustSection currentLang={currentLang} />
          <LeadForm currentLang={currentLang} />
        </div>
      );

    case 'study':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-[#061A35] to-[#002B7F] rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl text-white">
            <span className="text-[#FCD116] font-bold text-xs uppercase tracking-wider">
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
              <div className="bg-white p-6 rounded-2xl border border-[#E5D9D4] space-y-4 shadow-sm">
                <h2 className="text-lg font-bold text-[#122033]">
                  {currentLang === 'fa' ? 'مزایای تحصیل در رومانی' : 'Why Study in Romania?'}
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-[#516174]">
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-[#0038A8] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>{currentLang === 'fa' ? 'پذیرش در رشته‌های پزشکی و مهندسی به زبان انگلیسی' : 'Medicine & Engineering in English'}</span>
                  </li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-[#0038A8] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>{currentLang === 'fa' ? 'شهریه سالانه متعادل بر اساس رشته و دانشگاه' : 'Balanced annual tuition rates'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#122033]">
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
        <div className="space-y-12 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-[#061A35] to-[#0038A8] rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl text-white">
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
        <div className="space-y-12 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-[#061A35] to-[#002B7F] rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl text-white">
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
        <div className="space-y-12 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-[#061A35] to-[#0038A8] rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl text-white">
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
        <div className="space-y-8 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#122033]">{t.nav.universities}</h1>
            <p className="text-[#516174] text-xs sm:text-sm mt-1">
              {currentLang === 'fa' ? 'فهرست دانشگاه‌های معتبر رومانی' : 'Accredited Romanian Universities'}
            </p>
          </div>

          <div className="bg-[#FBF7F2] p-4 rounded-2xl border border-[#E5D9D4]">
            <input
              type="text"
              value={uniSearch}
              onChange={(e) => setUniSearch(e.target.value)}
              placeholder={currentLang === 'fa' ? 'جستجوی دانشگاه یا شهر...' : 'Search university or city...'}
              className="w-full px-4 py-3 rounded-xl border border-[#E5D9D4] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0038A8] bg-white"
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
        <div className="space-y-8 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#122033]">{t.nav.cities}</h1>
            <p className="text-[#516174] text-xs sm:text-sm mt-1">
              {currentLang === 'fa' ? 'شهرهای کلیدی کشور رومانی' : 'Key Romanian Cities'}
            </p>
          </div>

          <div className="bg-[#FBF7F2] p-4 rounded-2xl border border-[#E5D9D4]">
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder={currentLang === 'fa' ? 'جستجوی شهر...' : 'Search city...'}
              className="w-full px-4 py-3 rounded-xl border border-[#E5D9D4] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0038A8] bg-white"
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
        <div className="space-y-12 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-[#061A35] to-[#0038A8] rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl text-white">
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
        <div className="space-y-12 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#122033]">{t.nav.services}</h1>
            <p className="text-[#516174] text-xs sm:text-sm mt-1">
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
        <div className="space-y-8 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#122033]">{t.nav.articles}</h1>
            <p className="text-[#516174] text-xs sm:text-sm mt-1">
              {currentLang === 'fa' ? 'مقالات و راهنماهای آموزشی و مهاجرتی' : 'Articles & Legal Updates'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleArticles.map((art) => (
              <div key={art.id} className="bg-white p-6 rounded-2xl border border-[#E5D9D4] space-y-3 shadow-sm">
                <span className="text-xs text-[#0038A8] bg-blue-50 px-2.5 py-1 rounded font-semibold">{art.category[currentLang]}</span>
                <h3 className="font-bold text-[#122033] text-base">{art.title[currentLang]}</h3>
                <p className="text-xs text-[#516174] leading-relaxed">{art.excerpt[currentLang]}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'about':
      return (
        <div className="space-y-12 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-[#061A35] to-[#002B7F] rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl text-white">
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
        <div className="space-y-12 animate-fadeIn max-w-[1200px] mx-auto px-4 py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#122033]">{t.nav.contact}</h1>
            <p className="text-[#516174] text-xs sm:text-sm mt-1">
              {currentLang === 'fa' ? 'راه‌های ارتباطی با ما' : 'Contact Our Team'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E5D9D4] space-y-2 shadow-sm">
                <div className="font-bold text-[#122033]">📍 {currentLang === 'fa' ? 'دفتر رومانی:' : 'Bucharest Office:'}</div>
                <p className="text-xs text-[#516174]">Bucharest, Romania</p>
              </div>
              <div className="bg-[#0038A8] text-white p-6 rounded-2xl space-y-2 shadow-md">
                <div className="font-bold text-[#FCD116]">✉️ {currentLang === 'fa' ? 'ایمیل:' : 'Email:'}</div>
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
        <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-[#E5D9D4] shadow-sm">
          <h1 className="text-2xl font-bold text-[#122033] border-b border-[#E5D9D4] pb-4">
            {activeRoute.includes('privacy') 
              ? (currentLang === 'fa' ? 'سیاست حریم خصوصی' : 'Privacy Policy')
              : (currentLang === 'fa' ? 'شرایط و قوانین استفاده' : 'Terms & Disclaimer')}
          </h1>

          <div className="space-y-4 text-xs sm:text-sm text-[#516174] leading-relaxed">
            <p>{t.disclaimer.text}</p>
          </div>
        </div>
      );
  }
};
