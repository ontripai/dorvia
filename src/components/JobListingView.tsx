'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { useAppContext } from '@/components/AppLayout';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EvaluationCTA } from '@/components/EvaluationCTA';

// Lucide-style SVG icons
function MapPinIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BanknoteIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function HomeIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UsersIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CheckCircleIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertCircleIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ShieldCheckIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ArrowRightIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export interface JobListingData {
  id: string;
  category_id: string;
  status: string;
  title_fa: string;
  title_en: string | null;
  slug_fa: string;
  slug_en: string | null;
  city: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  contract_type: string;
  positions_available: number;
  accommodation_provided: boolean;
  description_fa: string;
  description_en: string | null;
  requirements_fa: string | null;
  requirements_en: string | null;
  is_sample: boolean;
  published_at: string | null;
  created_at: string;
  category?: {
    id: string;
    key: string;
    label_fa: string;
    label_en: string;
  };
}

interface JobListingViewProps {
  job: JobListingData;
  lang: Language;
}

export function JobListingView({ job, lang }: JobListingViewProps) {
  const isFa = lang === 'fa';
  const { setAlternateLanguageUrls, onOpenEvaluationModal } = useAppContext();

  // Set language switcher alternate URLs
  useEffect(() => {
    if (!setAlternateLanguageUrls) return;

    if (isFa) {
      // Current is FA, check if English is fully available
      if (job.slug_en && job.title_en && job.description_en) {
        setAlternateLanguageUrls({
          fa: `/fa/work/job-requests/${job.slug_fa}`,
          en: `/en/work/job-requests/${job.slug_en}`,
        });
      } else {
        // English translation incomplete: redirect to English job catalog
        setAlternateLanguageUrls({
          fa: `/fa/work/job-requests/${job.slug_fa}`,
          en: `/en/work/job-requests`,
        });
      }
    } else {
      // Current is EN
      setAlternateLanguageUrls({
        fa: `/fa/work/job-requests/${job.slug_fa}`,
        en: `/en/work/job-requests/${job.slug_en}`,
      });
    }

    return () => {
      setAlternateLanguageUrls(null);
    };
  }, [job, isFa, setAlternateLanguageUrls]);

  const title = isFa ? job.title_fa : (job.title_en || job.title_fa);
  const description = isFa ? job.description_fa : (job.description_en || job.description_fa);
  const requirements = isFa ? job.requirements_fa : (job.requirements_en || job.requirements_fa);
  const categoryLabel = job.category ? (isFa ? job.category.label_fa : job.category.label_en) : '';

  // Application form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');
  const [englishLevel, setEnglishLevel] = useState('intermediate');
  const [experienceYears, setExperienceYears] = useState('2');
  const [notes, setNotes] = useState('');
  const [gotcha, setGotcha] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setSubmitError(isFa ? 'لطفاً نام و نام خانوادگی خود را کامل وارد کنید.' : 'Please provide your full name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 7) {
      setSubmitError(isFa ? 'لطفاً شماره تماس معتبر (ترجیحاً واتساپ) وارد کنید.' : 'Please provide a valid contact number.');
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_listing_id: job.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          current_country: currentCountry.trim() || null,
          english_level: englishLevel,
          experience_years: parseInt(experienceYears, 10) || 0,
          notes: notes.trim() || null,
          _gotcha: gotcha,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmittedSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: isFa ? 'صفحه اصلی' : 'Home', href: `/${lang}` },
    { label: isFa ? 'مهاجرت کاری' : 'Work in Romania', href: `/${lang}/work` },
    { label: isFa ? 'درخواست نیرو و فرصت‌های شغلی' : 'Job Opportunities', href: `/${lang}/work/job-requests` },
    { label: title },
  ];

  return (
    <article className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Subtle Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbs} currentLang={lang} />
        </div>

        {/* Header Hero Card */}
        <header className="mb-10 rounded-3xl bg-slate-900/70 border border-slate-800/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {categoryLabel && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {categoryLabel}
              </span>
            )}
            <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {job.contract_type === 'permanent'
                ? (isFa ? 'قرارداد دائمی / تمام‌وقت' : 'Permanent Contract')
                : job.contract_type === 'seasonal'
                ? (isFa ? 'قرارداد فصلی' : 'Seasonal Contract')
                : (isFa ? 'قرارداد موقت' : 'Temporary Contract')}
            </span>
            {job.is_sample && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40">
                {isFa ? 'موقعیت نمونه' : 'Sample Listing'}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            {title}
          </h1>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            {/* City */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <MapPinIcon size={18} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{isFa ? 'محل کار' : 'Location'}</span>
                <span className="text-sm font-bold text-slate-200">{job.city}</span>
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <BanknoteIcon size={18} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{isFa ? 'حقوق پرداختی' : 'Salary Range'}</span>
                <span className="text-sm font-bold text-slate-200">
                  {job.salary_min && job.salary_max
                    ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.salary_currency}`
                    : job.salary_min
                    ? `از ${job.salary_min.toLocaleString()} ${job.salary_currency}`
                    : isFa ? 'توافقی' : 'Negotiable'}
                </span>
              </div>
            </div>

            {/* Accommodation */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <HomeIcon size={18} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{isFa ? 'وضعیت اسکان' : 'Lodging'}</span>
                <span className="text-sm font-bold text-slate-200">
                  {job.accommodation_provided
                    ? (isFa ? 'اسکان رایگان' : 'Lodging Included')
                    : (isFa ? 'بدون اسکان' : 'Not Included')}
                </span>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <UsersIcon size={18} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{isFa ? 'ظرفیت استخدام' : 'Positions'}</span>
                <span className="text-sm font-bold text-slate-200">
                  {job.positions_available} {isFa ? 'نفر' : 'openings'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Layout: Main Text & Application Form Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Description Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Job Description */}
            <section className="rounded-3xl bg-slate-900/50 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-lg font-black text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
                <span>{isFa ? 'شرح موقعیت شغلی و وظایف' : 'Job Description & Duties'}</span>
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm sm:text-base leading-relaxed">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            </section>

            {/* Requirements & Qualifications */}
            {requirements && (
              <section className="rounded-3xl bg-slate-900/50 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-sm">
                <h2 className="text-lg font-black text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
                  <span>{isFa ? 'شرایط احراز و مهارت‌های مورد نیاز' : 'Candidate Requirements & Qualifications'}</span>
                </h2>
                <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm sm:text-base leading-relaxed">
                  <ReactMarkdown>{requirements}</ReactMarkdown>
                </div>
              </section>
            )}

            {/* Legal Notice & ANOFM Transparency Banner */}
            <div className="rounded-2xl bg-blue-950/30 border border-blue-800/40 p-5 flex items-start gap-4 text-xs text-blue-200 leading-relaxed">
              <div className="mt-0.5 text-blue-400 shrink-0">
                <ShieldCheckIcon size={20} />
              </div>
              <div>
                <span className="font-bold block mb-1">
                  {isFa ? 'شفافیت و انطباق با قوانین کار رومانی (ANOFM / IGI)' : 'Compliance with Romanian Labor Law'}
                </span>
                <span>
                  {isFa
                    ? 'تمام مراحل استخدام نیروهای کار خارجی در کشور رومانی تحت نظارت وزارت کار و آژانس ملی اشتغال (ANOFM) و اداره کل بازرسی مهاجرت (IGI) صورت می‌گیرد. دورویا پس از بررسی مدارک اولیه، پرونده متقاضیان واجد شرایط را به کارفرمایان رسمی در رومانی معرفی می‌کند.'
                    : 'Foreign worker recruitment and visa issuance comply with the National Employment Agency (ANOFM) and the General Inspectorate for Immigration (IGI) in Romania.'}
                </span>
              </div>
            </div>
          </div>

          {/* Sticky Application Form Column */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <CheckCircleIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {isFa ? 'ثبت درخواست استخدام' : 'Apply for this Position'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isFa ? 'بررسی اولیه توسط کارشناسان دورویا' : 'Initial review by DORVIA specialists'}
                  </p>
                </div>
              </div>

              {submittedSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircleIcon size={32} />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {isFa ? 'درخواست شما با موفقیت ثبت شد' : 'Application Submitted!'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                    {isFa
                      ? 'اطلاعات شما در سیستم CRM دورویا ثبت گردید. کارشناسان ما پس از ارزیابی رزومه و شرایط شغلی با شما تماس خواهند گرفت.'
                      : 'Your application has been registered. Our recruitment consultants will contact you shortly.'}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/work/job-requests"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                    >
                      <span>{isFa ? 'مشاهده سایر موقعیت‌ها' : 'Explore other jobs'}</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 flex items-start gap-2.5 text-red-300 text-xs">
                      <AlertCircleIcon size={16} className="shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="_gotcha"
                    value={gotcha}
                    onChange={(e) => setGotcha(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isFa ? 'نام و نام خانوادگی *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isFa ? 'علی رضایی' : 'John Doe'}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isFa ? 'شماره تماس یا واتساپ *' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+98 912 345 6789"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-all font-mono"
                      dir="ltr"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isFa ? 'ایمیل (اختیاری)' : 'Email Address (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-all font-mono"
                      dir="ltr"
                    />
                  </div>

                  {/* Current Country & Experience Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {isFa ? 'کشور فعلی' : 'Current Country'}
                      </label>
                      <input
                        type="text"
                        value={currentCountry}
                        onChange={(e) => setCurrentCountry(e.target.value)}
                        placeholder={isFa ? 'ایران، ترکیه...' : 'Iran, Turkey...'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {isFa ? 'سابقه کار مرتبط' : 'Experience'}
                      </label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="0">{isFa ? 'کمتر از ۱ سال' : '< 1 Year'}</option>
                        <option value="2">{isFa ? '۱ تا ۳ سال' : '1-3 Years'}</option>
                        <option value="4">{isFa ? '۳ تا ۵ سال' : '3-5 Years'}</option>
                        <option value="7">{isFa ? 'بیش از ۵ سال' : '5+ Years'}</option>
                      </select>
                    </div>
                  </div>

                  {/* English Level */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isFa ? 'سطح زبان انگلیسی' : 'English Proficiency'}
                    </label>
                    <select
                      value={englishLevel}
                      onChange={(e) => setEnglishLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="basic">{isFa ? 'پایه / آشنایی محدود' : 'Basic'}</option>
                      <option value="intermediate">{isFa ? 'متوسط (مکالمه کاری)' : 'Intermediate (Working)'}</option>
                      <option value="fluent">{isFa ? 'پیشرفته / روان' : 'Fluent / Advanced'}</option>
                    </select>
                  </div>

                  {/* Applicant Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isFa ? 'توضیحات و سوابق کلیدی' : 'Additional Notes / Summary'}
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isFa ? 'خلاصه‌ای از مهارت‌ها یا مدارک تخصصی خود را بنویسید...' : 'Brief summary of relevant skills or certificates...'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Consent Note */}
                  <p className="text-[11px] text-slate-400 leading-normal pt-1">
                    {isFa
                      ? 'با ارسال فرم، موافقت خود را با بررسی اطلاعات و برقراری تماس از سوی مشاورین دورویا اعلام می‌دارید.'
                      : 'By submitting, you consent to being contacted regarding this employment vacancy.'}
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-50"
                  >
                    {submitting
                      ? (isFa ? 'در حال ثبت درخواست...' : 'Submitting...')
                      : (isFa ? 'ارسال مدارک و درخواست اولیه' : 'Submit Application')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Global Evaluation CTA */}
        <div className="mt-16">
          <EvaluationCTA currentLang={lang} onOpenModal={onOpenEvaluationModal} variant="work" />
        </div>
      </div>
    </article>
  );
}
