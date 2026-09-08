'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  Users,
  LogOut,
  Settings,
  ChartNoAxesCombined,
  AlertCircle,
  CheckCircle,
  Clock,
  BriefcaseBusiness,
} from '@/components/Icons';

function PlusIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function EditIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function ShieldAlertIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function BookOpenIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

interface JobListing {
  id: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
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
  is_sample: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    key: string;
    label_fa: string;
    label_en: string;
  };
  author?: {
    id: string;
    full_name: string;
  };
}

interface Category {
  id: string;
  key: string;
  label_fa: string;
  label_en: string;
}

export default function AdminJobsPage({ params }: { params: { lang: Language } }) {
  const router = useRouter();
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [canPublish, setCanPublish] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Delete modal state
  const [deletingJob, setDeletingJob] = useState<JobListing | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, categoryFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (categoryFilter !== 'all') params.set('category_id', categoryFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/jobs?${params.toString()}`);
      if (res.status === 401 || res.status === 403) {
        router.push(`/${currentLang}/admin/login`);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch job listings');
      }

      setJobs(data.jobs || []);
      setCategories(data.categories || []);
      setCanPublish(Boolean(data.canPublish));
      setAdminUser(data.admin || null);
    } catch (err: any) {
      setError(err.message || 'Error loading job listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push(`/${currentLang}/admin/login`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingJob) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      const res = await fetch(`/api/admin/jobs/${deletingJob.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete job listing');
      }

      setJobs((prev) => prev.filter((j) => j.id !== deletingJob.id));
      setDeletingJob(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting job listing');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Navigation */}
        <header className="mb-8 border-b border-slate-800/80 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <BriefcaseBusiness size={20} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {isFa ? 'مدیریت موقعیت‌های شغلی (درخواست نیرو)' : 'Job Listings Management'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {isFa
                      ? 'مدیریت آگهی‌های استخدام نیروی کار خارجی در رومانی'
                      : 'Manage foreign recruitment listings and vacancies in Romania'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-all"
              >
                <Users size={14} />
                <span>{isFa ? 'پرونده‌ها' : 'Leads'}</span>
              </Link>

              {(adminUser?.roleKey === 'owner' || adminUser?.roleKey === 'manager' || adminUser?.permissions?.includes('team.manage')) && (
                <Link
                  href="/admin/team"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-all"
                >
                  <Users size={14} />
                  <span>{isFa ? 'تیم' : 'Team'}</span>
                </Link>
              )}

              <Link
                href="/admin/reports"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-all"
              >
                <ChartNoAxesCombined size={14} />
                <span>{isFa ? 'گزارش‌ها' : 'Reports'}</span>
              </Link>

              <Link
                href="/admin/blog"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-all"
              >
                <BookOpenIcon size={14} />
                <span>{isFa ? 'بلاگ' : 'Blog'}</span>
              </Link>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-500/30">
                <BriefcaseBusiness size={14} />
                <span>{isFa ? 'فرصت‌های شغلی' : 'Jobs'}</span>
              </span>

              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-all"
              >
                <Settings size={14} />
                <span>{isFa ? 'تنظیمات' : 'Settings'}</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 hover:text-red-200 text-xs font-medium border border-red-800/40 transition-all cursor-pointer"
              >
                <LogOut size={14} />
                <span>{isFa ? 'خروج' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Public Release Gate Alert Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3.5 text-amber-200 text-xs sm:text-sm">
          <div className="mt-0.5 shrink-0 text-amber-400">
            <ShieldAlertIcon size={20} />
          </div>
          <div>
            <span className="font-bold">
              {isFa ? 'توجه — گیت ایمنی انتشار عمومی فعال است: ' : 'Notice — Public Release Gate Active: '}
            </span>
            <span>
              {isFa
                ? 'تا زمان اخذ و اعتبارسنجی مجوز رسمی کارگزاری خارجی در ANOFM، نمایش عمومی فرصت‌های شغلی در سایت پنهان و مسدود است. در این بخش می‌توانید آگهی‌ها را ثبت و ویرایش کرده و وضعیت آن‌ها را آماده‌سازی کنید.'
                : 'Until official foreign recruitment agency licensing via ANOFM is finalized, public job board pages are locked. Staff may draft and manage listings in this console.'}
            </span>
          </div>
        </div>

        {/* Action Bar: Create New Job & Search */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
            >
              <PlusIcon size={18} />
              <span>{isFa ? 'ثبت آگهی جدید' : 'New Job Listing'}</span>
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                <SearchIcon size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFa ? 'جستجو در عنوان یا شهر...' : 'Search title or city...'}
                className="w-full pl-4 pr-9 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all"
            >
              {isFa ? 'بیاب' : 'Search'}
            </button>
          </form>
        </div>

        {/* Filters: Status Tabs + Category Dropdown */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'all', label: isFa ? 'همه وضعیت‌ها' : 'All Statuses' },
              { key: 'published', label: isFa ? 'منتشر شده' : 'Published' },
              { key: 'draft', label: isFa ? 'پیش‌نویس' : 'Draft' },
              { key: 'archived', label: isFa ? 'بایگانی' : 'Archived' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {isFa ? 'دسته‌بندی:' : 'Category:'}
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="all">{isFa ? 'همه دسته‌ها' : 'All Categories'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isFa ? cat.label_fa : cat.label_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-red-300 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Table / Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">{isFa ? 'در حال بارگذاری موقعیت‌ها...' : 'Loading listings...'}</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800/60 p-8">
            <BriefcaseBusiness size={40} className="mx-auto text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-slate-300 mb-1">
              {isFa ? 'موقعیت شغلی یافت نشد' : 'No Job Listings Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {isFa
                ? 'با فیلترهای انتخابی آگهی‌ای موجود نیست یا هنوز آگهی‌ای ثبت نکرده‌اید.'
                : 'No vacancies found matching current filters. Create a new listing to get started.'}
            </p>
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all"
            >
              <PlusIcon size={14} />
              <span>{isFa ? 'ثبت اولین موقعیت' : 'Create First Listing'}</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl backdrop-blur-sm">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">{isFa ? 'عنوان موقعیت و رده' : 'Title & Category'}</th>
                  <th className="py-3.5 px-4">{isFa ? 'شهر / ظرفیت' : 'City / Capacity'}</th>
                  <th className="py-3.5 px-4">{isFa ? 'حقوق / اسکان' : 'Salary / Lodging'}</th>
                  <th className="py-3.5 px-4">{isFa ? 'وضعیت' : 'Status'}</th>
                  <th className="py-3.5 px-4">{isFa ? 'تاریخ ثبت' : 'Date'}</th>
                  <th className="py-3.5 px-4 text-center">{isFa ? 'عملیات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {jobs.map((job) => {
                  const statusColors: Record<string, string> = {
                    published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    draft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    archived: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                  };

                  const statusLabels: Record<string, string> = {
                    published: isFa ? 'منتشر شده' : 'Published',
                    draft: isFa ? 'پیش‌نویس' : 'Draft',
                    archived: isFa ? 'بایگانی' : 'Archived',
                  };

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-850/50 transition-colors group"
                    >
                      {/* Title & Category */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                          {isFa ? job.title_fa : (job.title_en || job.title_fa)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {job.category ? (isFa ? job.category.label_fa : job.category.label_en) : '—'}
                          </span>
                          {job.is_sample && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                              {isFa ? 'نمونه' : 'Sample'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* City / Positions */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{job.city}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {job.positions_available} {isFa ? 'نفر' : 'positions'}
                        </div>
                      </td>

                      {/* Salary & Housing */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">
                          {job.salary_min && job.salary_max
                            ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.salary_currency}`
                            : job.salary_min
                            ? `از ${job.salary_min.toLocaleString()} ${job.salary_currency}`
                            : isFa ? 'توافقی' : 'Negotiable'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {job.accommodation_provided
                            ? (isFa ? '✓ اسکان رایگان' : '✓ Lodging incl.')
                            : (isFa ? 'بدون اسکان' : 'No lodging')}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            statusColors[job.status] || 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {statusLabels[job.status] || job.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(job.created_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US')}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/jobs/${job.id}/edit`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors"
                            title={isFa ? 'ویرایش' : 'Edit'}
                          >
                            <EditIcon size={14} />
                          </Link>

                          {job.status !== 'published' ? (
                            <button
                              onClick={() => {
                                setDeletingJob(job);
                                setDeleteError(null);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 transition-colors cursor-pointer"
                              title={isFa ? 'حذف' : 'Delete'}
                            >
                              <TrashIcon size={14} />
                            </button>
                          ) : (
                            <span
                              className="p-1.5 rounded-lg bg-slate-900 text-slate-600 cursor-not-allowed"
                              title={isFa ? 'آگهی‌های منتشر شده ابتدا باید پیش‌نویس شوند' : 'Unpublish before deletion'}
                            >
                              <TrashIcon size={14} />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <TrashIcon size={20} />
                </div>
                <h4 className="text-base font-bold text-white">
                  {isFa ? 'حذف موقعیت شغلی' : 'Delete Job Listing'}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                {isFa
                  ? `آیا از حذف موقعیت شغلی «${deletingJob.title_fa}» مطمئن هستید؟ این عملیات غیرقابل بازگشت است.`
                  : `Are you sure you want to delete "${deletingJob.title_fa}"? This action cannot be undone.`}
              </p>

              {deleteError && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300">
                  {deleteError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setDeletingJob(null)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all disabled:opacity-50"
                >
                  {deleteLoading ? (isFa ? 'در حال حذف...' : 'Deleting...') : (isFa ? 'بله، حذف کن' : 'Confirm Delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
