'use client';

import React, { useState } from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EvaluationCTA } from '@/components/EvaluationCTA';
import { useAppContext } from '@/components/AppLayout';

function MapPinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BanknoteIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function HomeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UsersIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ArrowRightIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export interface CatalogJob {
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
  is_sample: boolean;
  published_at: string | null;
  created_at: string;
  category?: {
    id: string;
    key: string;
    label_fa: string;
    label_en: string;
  } | {
    id: string;
    key: string;
    label_fa: string;
    label_en: string;
  }[];
}

export interface CatalogCategory {
  id: string;
  key: string;
  label_fa: string;
  label_en: string;
  sort_order: number;
}

interface JobCatalogViewProps {
  initialJobs: CatalogJob[];
  categories: CatalogCategory[];
  lang: Language;
}

export function JobCatalogView({ initialJobs, categories, lang }: JobCatalogViewProps) {
  const isFa = lang === 'fa';
  const { onOpenEvaluationModal } = useAppContext();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const breadcrumbs = [
    { label: isFa ? 'صفحه اصلی' : 'Home', href: `/${lang}` },
    { label: isFa ? 'مهاجرت کاری' : 'Work in Romania', href: `/${lang}/work` },
    { label: isFa ? 'درخواست نیرو و فرصت‌های شغلی' : 'Job Opportunities' },
  ];

  const filteredJobs = initialJobs.filter((job) => {
    // 1. Category filter
    if (selectedCategoryKey !== 'all') {
      const catObj = Array.isArray(job.category) ? job.category[0] : job.category;
      if (!catObj || catObj.key !== selectedCategoryKey) return false;
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (isFa ? job.title_fa : (job.title_en || job.title_fa)).toLowerCase().includes(q);
      const cityMatch = job.city.toLowerCase().includes(q);
      if (!titleMatch && !cityMatch) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbs} currentLang={lang} />
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4">
            <span>{isFa ? 'کاریابی بین‌المللی رومانی' : 'Romania Foreign Recruitment'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {isFa ? 'فرصت‌های شغلی و استخدام در رومانی' : 'Job Opportunities in Romania'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {isFa
              ? 'موقعیت‌های استخدامی با قرارداد رسمی، اسکان، بیمه درمانی و مجوز کار در سراسر شهرهای رومانی.'
              : 'Direct employment opportunities with official labor contracts, lodging, medical insurance, and work permits.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFa ? 'جستجو بر اساس عنوان موقعیت یا شهر...' : 'Search by job title or city...'}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all shadow-inner placeholder-slate-500"
          />
        </div>

        {/* Categories Pills */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedCategoryKey('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategoryKey === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {isFa ? 'همه دسته‌ها' : 'All Fields'}
            </button>
            {categories.map((cat) => {
              const isActive = selectedCategoryKey === cat.key;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryKey(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {isFa ? cat.label_fa : cat.label_en}
                </button>
              );
            })}
          </div>
        )}

        {/* Listings Grid */}
        {filteredJobs.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-300 mb-2">
              {isFa ? 'موقعیت شغلی با شرایط انتخابی یافت نشد' : 'No listings matching your search'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {isFa
                ? 'لطفاً عبارت دیگری را جستجو فرمایید یا فیلتر دسته‌بندی را تغییر دهید.'
                : 'Please try another search keyword or clear category filters.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategoryKey('all');
                setSearchQuery('');
              }}
              className="inline-block px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              {isFa ? 'نمایش همه آگهی‌ها' : 'Reset filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const jobTitle = isFa ? job.title_fa : (job.title_en || job.title_fa);
              const jobSlug = isFa ? job.slug_fa : (job.slug_en || job.slug_fa);
              const catObj = Array.isArray(job.category) ? job.category[0] : job.category;
              const catLabel = catObj ? (isFa ? catObj.label_fa : catObj.label_en) : '';

              return (
                <Link
                  key={job.id}
                  href={`/work/job-requests/${jobSlug}`}
                  className="group flex flex-col rounded-3xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {catLabel}
                    </span>
                    {job.is_sample && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40">
                        {isFa ? 'نمونه' : 'Sample'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-4">
                    {jobTitle}
                  </h2>

                  <div className="mt-auto space-y-2.5 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPinIcon size={14} />
                        <span className="text-slate-300">{job.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <BanknoteIcon size={14} />
                        <span>
                          {job.salary_min && job.salary_max
                            ? `${job.salary_min.toLocaleString()}-${job.salary_max.toLocaleString()} ${job.salary_currency}`
                            : job.salary_min
                            ? `از ${job.salary_min.toLocaleString()} ${job.salary_currency}`
                            : isFa ? 'توافقی' : 'Negotiable'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <HomeIcon size={14} />
                        <span>
                          {job.accommodation_provided
                            ? (isFa ? 'اسکان رایگان' : 'Lodging incl.')
                            : (isFa ? 'بدون اسکان' : 'No lodging')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UsersIcon size={14} />
                        <span>{job.positions_available} {isFa ? 'نفر' : 'openings'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 flex items-center justify-end text-blue-400 text-xs font-semibold group-hover:translate-x-[-2px] rtl:group-hover:translate-x-2 transition-transform">
                    <span className="flex items-center gap-1">
                      {isFa ? 'مشاهده شرایط و ارسال درخواست' : 'View Details & Apply'}
                      <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Global CTA */}
        <div className="mt-16">
          <EvaluationCTA currentLang={lang} onOpenModal={onOpenEvaluationModal} variant="work" />
        </div>
      </div>
    </div>
  );
}
