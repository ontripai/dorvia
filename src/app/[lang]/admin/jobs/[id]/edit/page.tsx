'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import ReactMarkdown from 'react-markdown';
import { slugifyJob } from '@/lib/slugHelper';
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  BriefcaseBusiness,
} from '@/components/Icons';

function EyeIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Edit3Icon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

interface Category {
  id: string;
  key: string;
  label_fa: string;
  label_en: string;
}

export default function EditJobListingPage({
  params,
}: {
  params: { lang: Language; id: string };
}) {
  const router = useRouter();
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const jobId = params.id;

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [canPublish, setCanPublish] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('draft');

  // Core fields
  const [titleFa, setTitleFa] = useState('');
  const [slugFa, setSlugFa] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [city, setCity] = useState('');
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [salaryMax, setSalaryMax] = useState<string>('');
  const [salaryCurrency, setSalaryCurrency] = useState('RON');
  const [contractType, setContractType] = useState('permanent');
  const [positionsAvailable, setPositionsAvailable] = useState<number>(1);
  const [accommodationProvided, setAccommodationProvided] = useState(false);
  const [isSample, setIsSample] = useState(false);

  // Markdown content (Persian)
  const [descriptionFa, setDescriptionFa] = useState('');
  const [requirementsFa, setRequirementsFa] = useState('');

  // English fields
  const [showEnSection, setShowEnSection] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [slugEn, setSlugEn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [requirementsEn, setRequirementsEn] = useState('');

  // UI State
  const [activeTabFa, setActiveTabFa] = useState<'write' | 'preview'>('write');
  const [activeTabEn, setActiveTabEn] = useState<'write' | 'preview'>('write');
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories and job details in parallel
        const [catRes, jobRes] = await Promise.all([
          fetch('/api/admin/jobs/categories'),
          fetch(`/api/admin/jobs/${jobId}`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }

        if (jobRes.status === 401 || jobRes.status === 403) {
          router.push(`/${currentLang}/admin/login`);
          return;
        }

        const jobData = await jobRes.json();
        if (!jobRes.ok) {
          throw new Error(jobData.error || 'Failed to fetch job listing');
        }

        const job = jobData.job;
        setCanPublish(Boolean(jobData.canPublish));
        setCurrentStatus(job.status);

        setTitleFa(job.title_fa || '');
        setSlugFa(job.slug_fa || '');
        setCategoryId(job.category_id || '');
        setCity(job.city || '');
        setSalaryMin(job.salary_min !== null ? String(job.salary_min) : '');
        setSalaryMax(job.salary_max !== null ? String(job.salary_max) : '');
        setSalaryCurrency(job.salary_currency || 'RON');
        setContractType(job.contract_type || 'full_time');
        setPositionsAvailable(job.positions_available || 1);
        setAccommodationProvided(Boolean(job.accommodation_provided));
        setIsSample(Boolean(job.is_sample));

        setDescriptionFa(job.description_fa || '');
        setRequirementsFa(job.requirements_fa || '');

        setTitleEn(job.title_en || '');
        setSlugEn(job.slug_en || '');
        setDescriptionEn(job.description_en || '');
        setRequirementsEn(job.requirements_en || '');

        if (job.title_en || job.description_en) {
          setShowEnSection(true);
        }
      } catch (err: any) {
        setError(err.message || 'Error loading job listing details');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [jobId, currentLang, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!titleFa.trim()) {
      setError(isFa ? 'لطفاً عنوان فارسی را وارد کنید.' : 'Persian title is required.');
      return;
    }
    if (!slugFa.trim()) {
      setError(isFa ? 'لطفاً نامک (slug) فارسی را وارد کنید.' : 'Persian slug is required.');
      return;
    }
    if (!categoryId) {
      setError(isFa ? 'لطفاً یک دسته‌بندی انتخاب کنید.' : 'Category is required.');
      return;
    }
    if (!city.trim()) {
      setError(isFa ? 'لطفاً شهر محل کار را مشخص کنید.' : 'City is required.');
      return;
    }
    if (!descriptionFa.trim()) {
      setError(isFa ? 'لطفاً شرح وظایف و موقعیت شغلی (فارسی) را بنویسید.' : 'Job description is required.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title_fa: titleFa.trim(),
        slug_fa: slugFa.trim(),
        category_id: categoryId,
        city: city.trim(),
        salary_min: salaryMin ? parseFloat(salaryMin) : null,
        salary_max: salaryMax ? parseFloat(salaryMax) : null,
        salary_currency: salaryCurrency,
        contract_type: contractType,
        positions_available: positionsAvailable,
        accommodation_provided: accommodationProvided,
        is_sample: isSample,
        description_fa: descriptionFa.trim(),
        requirements_fa: requirementsFa.trim() || null,
        title_en: titleEn.trim() || null,
        slug_en: slugEn.trim() || null,
        description_en: descriptionEn.trim() || null,
        requirements_en: requirementsEn.trim() || null,
      };

      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update job listing');
      }

      setSuccessMsg(isFa ? 'تغییرات با موفقیت ذخیره شد.' : 'Job listing updated successfully.');
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the job listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMsg(null);

      const res = await fetch(`/api/admin/jobs/${jobId}/publish`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish job listing');
      }

      setCurrentStatus('published');
      setSuccessMsg(isFa ? 'آگهی با موفقیت منتشر شد.' : 'Job listing published successfully.');
    } catch (err: any) {
      setError(err.message || 'Error publishing job listing');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async (target: 'draft' | 'archived') => {
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMsg(null);

      const res = await fetch(`/api/admin/jobs/${jobId}/unpublish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: target }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to unpublish job listing');
      }

      setCurrentStatus(target);
      setSuccessMsg(
        isFa
          ? target === 'draft' ? 'آگهی به حالت پیش‌نویس بازگشت.' : 'آگهی بایگانی شد.'
          : `Job listing set to ${target}.`
      );
    } catch (err: any) {
      setError(err.message || 'Error updating listing status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400">{isFa ? 'در حال دریافت اطلاعات آگهی...' : 'Loading listing...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/jobs"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              {isFa ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {isFa ? 'ویرایش موقعیت شغلی' : 'Edit Job Opportunity'}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    currentStatus === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : currentStatus === 'draft'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}
                >
                  {currentStatus === 'published'
                    ? (isFa ? 'منتشر شده' : 'Published')
                    : currentStatus === 'draft'
                    ? (isFa ? 'پیش‌نویس' : 'Draft')
                    : (isFa ? 'بایگانی' : 'Archived')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {titleFa}
              </p>
            </div>
          </div>

          {/* Publishing Controls */}
          {canPublish && (
            <div className="flex items-center gap-2">
              {currentStatus !== 'published' ? (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {actionLoading ? (isFa ? 'در حال انتشار...' : 'Publishing...') : (isFa ? 'انتشار آگهی' : 'Publish Listing')}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleUnpublish('draft')}
                    disabled={actionLoading}
                    className="px-3.5 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {actionLoading ? '...' : (isFa ? 'تبدیل به پیش‌نویس' : 'Revert to Draft')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnpublish('archived')}
                    disabled={actionLoading}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {isFa ? 'بایگانی' : 'Archive'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/80 flex items-center gap-3 text-red-300 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/80 flex items-center gap-3 text-emerald-300 text-sm">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info Box */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 space-y-6">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <BriefcaseBusiness size={16} />
              <span>{isFa ? 'اطلاعات اصلی موقعیت شغلی' : 'Job Essentials'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Persian Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isFa ? 'عنوان موقعیت شغلی (فارسی) *' : 'Job Title (Persian) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleFa}
                  onChange={(e) => setTitleFa(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Persian Slug */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isFa ? 'نامک URL (فارسی) *' : 'Slug (Persian) *'}
                </label>
                <input
                  type="text"
                  required
                  value={slugFa}
                  onChange={(e) => setSlugFa(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isFa ? 'دسته‌بندی شغلی *' : 'Industry Category *'}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isFa ? cat.label_fa : cat.label_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isFa ? 'شهر / منطقه *' : 'City / Region *'}
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Contract Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isFa ? 'نوع قرارداد' : 'Contract Type'}
                </label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="permanent">{isFa ? 'دائمی / تمام وقت' : 'Permanent / Full-Time'}</option>
                  <option value="seasonal">{isFa ? 'فصلی' : 'Seasonal'}</option>
                  <option value="temporary">{isFa ? 'موقت / معین' : 'Temporary'}</option>
                </select>
              </div>
            </div>

            {/* Compensation & Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isFa ? 'حداقل حقوق ماهانه' : 'Min Salary'}
                </label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isFa ? 'حداکثر حقوق ماهانه' : 'Max Salary'}
                </label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isFa ? 'ارز پرداختی' : 'Currency'}
                </label>
                <select
                  value={salaryCurrency}
                  onChange={(e) => setSalaryCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="RON">RON (لئو رومانی)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {isFa ? 'ظرفیت پذیرش (نفر)' : 'Positions'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={positionsAvailable}
                  onChange={(e) => setPositionsAvailable(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Checkboxes: Lodging & Sample */}
            <div className="flex flex-wrap gap-8 pt-2 border-t border-slate-800/60">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={accommodationProvided}
                  onChange={(e) => setAccommodationProvided(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-slate-200">
                  {isFa ? 'اسکان رایگان توسط کارفرما تأمین می‌شود' : 'Accommodation provided by employer'}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSample}
                  onChange={(e) => setIsSample(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-slate-400">
                  {isFa ? 'علامت‌گذاری به عنوان آگهی نمونه / پایلوت (Sample)' : 'Mark as sample listing'}
                </span>
              </label>
            </div>
          </div>

          {/* Persian Description & Requirements (Markdown) */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                {isFa ? 'توضیحات و شرایط احراز (فارسی)' : 'Description & Requirements (Persian)'}
              </h2>
              <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTabFa('write')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTabFa === 'write' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3Icon size={12} />
                  <span>{isFa ? 'ویرایش' : 'Write'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabFa('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTabFa === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <EyeIcon size={12} />
                  <span>{isFa ? 'پیش‌نمایش' : 'Preview'}</span>
                </button>
              </div>
            </div>

            {activeTabFa === 'write' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {isFa ? 'شرح وظایف و موقعیت شغلی (Markdown) *' : 'Job Description (Markdown) *'}
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={descriptionFa}
                    onChange={(e) => setDescriptionFa(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {isFa ? 'شرایط احراز و مهارت‌های لازم (Markdown)' : 'Requirements & Skills (Markdown)'}
                  </label>
                  <textarea
                    rows={5}
                    value={requirementsFa}
                    onChange={(e) => setRequirementsFa(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 min-h-[300px] space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2">{isFa ? 'شرح موقعیت:' : 'Description:'}</h4>
                  <div className="prose prose-invert prose-sm max-w-none text-slate-200">
                    <ReactMarkdown>{descriptionFa || (isFa ? '_متنی وارد نشده است_' : '_Empty_')}</ReactMarkdown>
                  </div>
                </div>
                {requirementsFa && (
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-400 mb-2">{isFa ? 'شرایط احراز:' : 'Requirements:'}</h4>
                    <div className="prose prose-invert prose-sm max-w-none text-slate-200">
                      <ReactMarkdown>{requirementsFa}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* English Section (Collapsible) */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                  {isFa ? 'ترجمه و نسخه انگلیسی (English Edition)' : 'English Translation'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isFa
                    ? 'طبق قوانین سیستم، برای نمایش نسخه انگلیسی در سایت باید هر سه فیلد Title، Slug و Description کامل باشند.'
                    : 'All three fields (Title, Slug, Description) must be filled for the English page to be accessible.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEnSection(!showEnSection)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
              >
                {showEnSection ? (isFa ? 'بستن فرم' : 'Hide') : (isFa ? 'نمایش فرم انگلیسی' : 'Show English Fields')}
              </button>
            </div>

            {showEnSection && (
              <div className="space-y-6 pt-4 border-t border-slate-800/60">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Job Title (English)
                    </label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Slug (English)
                    </label>
                    <input
                      type="text"
                      value={slugEn}
                      onChange={(e) => setSlugEn(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">English Description (Markdown)</span>
                  <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveTabEn('write')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        activeTabEn === 'write' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Edit3Icon size={12} />
                      <span>Write</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabEn('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        activeTabEn === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <EyeIcon size={12} />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

                {activeTabEn === 'write' ? (
                  <div className="space-y-4" dir="ltr">
                    <textarea
                      rows={6}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                    />
                    <textarea
                      rows={4}
                      value={requirementsEn}
                      onChange={(e) => setRequirementsEn(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 min-h-[200px]" dir="ltr">
                    <div className="prose prose-invert prose-sm max-w-none text-slate-200">
                      <ReactMarkdown>{descriptionEn || '_No English content provided_'}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
            <Link
              href="/admin/jobs"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
            >
              {isFa ? 'بازگشت به فهرست' : 'Back to Listings'}
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {submitting
                ? (isFa ? 'در حال ذخیره...' : 'Saving...')
                : (isFa ? 'ذخیره تغییرات' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
