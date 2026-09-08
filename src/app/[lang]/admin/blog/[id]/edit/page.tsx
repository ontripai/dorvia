'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import ReactMarkdown from 'react-markdown';
import { slugify } from '@/lib/slugHelper';
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  BriefcaseBusiness,
} from '@/components/Icons';

function UploadCloudIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <polyline points="12 13 12 8 9 11" />
      <polyline points="12 8 15 11" />
    </svg>
  );
}

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

function GlobeIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LockIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

interface Category {
  id: string;
  key: string;
  label_fa: string;
  label_en: string;
}

export default function EditBlogPostPage({ params }: { params: { lang: Language; id: string } }) {
  const router = useRouter();
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const postId = params.id;

  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [canPublish, setCanPublish] = useState(false);
  const [postStatus, setPostStatus] = useState<'draft' | 'published' | 'archived'>('draft');

  // Form fields
  const [titleFa, setTitleFa] = useState('');
  const [slugFa, setSlugFa] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [excerptFa, setExcerptFa] = useState('');
  const [contentFa, setContentFa] = useState('');

  // English fields
  const [showEnSection, setShowEnSection] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [slugEn, setSlugEn] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [contentEn, setContentEn] = useState('');

  // SEO fields
  const [showSeoSection, setShowSeoSection] = useState(false);
  const [metaTitleFa, setMetaTitleFa] = useState('');
  const [metaTitleEn, setMetaTitleEn] = useState('');
  const [metaDescFa, setMetaDescFa] = useState('');
  const [metaDescEn, setMetaDescEn] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // UI State
  const [activeTabFa, setActiveTabFa] = useState<'write' | 'preview'>('write');
  const [activeTabEn, setActiveTabEn] = useState<'write' | 'preview'>('write');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load post & categories
  useEffect(() => {
    async function loadData() {
      try {
        setInitialLoading(true);

        const [postRes, catRes] = await Promise.all([
          fetch(`/api/admin/blog/${postId}`),
          fetch('/api/blog/categories'),
        ]);

        if (postRes.status === 401) {
          router.replace(`/${currentLang}/admin/login`);
          return;
        }
        if (postRes.status === 403) {
          setError(isFa ? 'شما مجوز ویرایش این مقاله را ندارید.' : 'You do not have permission to edit this article.');
          setInitialLoading(false);
          return;
        }

        const postData = await postRes.json();
        const catData = await catRes.json();

        if (!postRes.ok) {
          throw new Error(postData.error || 'Failed to load article');
        }

        const p = postData.post;
        setPostStatus(p.status);
        setCanPublish(Boolean(postData.canPublish));
        setCategories(catData.categories || []);

        // Hydrate form
        setTitleFa(p.title_fa || '');
        setSlugFa(p.slug_fa || '');
        setCategoryId(p.category_id || '');
        setCoverImageUrl(p.cover_image_url || '');
        setExcerptFa(p.excerpt_fa || '');
        setContentFa(p.content_fa || '');

        setTitleEn(p.title_en || '');
        setSlugEn(p.slug_en || '');
        setExcerptEn(p.excerpt_en || '');
        setContentEn(p.content_en || '');
        if (p.title_en || p.content_en) {
          setShowEnSection(true);
        }

        setMetaTitleFa(p.meta_title_fa || '');
        setMetaTitleEn(p.meta_title_en || '');
        setMetaDescFa(p.meta_description_fa || '');
        setMetaDescEn(p.meta_description_en || '');
        setTagsInput(Array.isArray(p.tags) ? p.tags.join(', ') : '');
        if (p.meta_title_fa || p.meta_description_fa || (p.tags && p.tags.length > 0)) {
          setShowSeoSection(true);
        }
      } catch (err: any) {
        setError(err.message || 'Error loading article');
      } finally {
        setInitialLoading(false);
      }
    }

    loadData();
  }, [postId, currentLang, isFa, router]);

  // Image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError(isFa ? 'حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.' : 'Image size cannot exceed 10MB.');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/blog/images', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setCoverImageUrl(data.url);
    } catch (err: any) {
      setError(err.message || 'Image upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save changes (PATCH)
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!titleFa.trim()) {
      setError(isFa ? 'عنوان فارسی نمی‌تواند خالی باشد.' : 'Persian title cannot be empty.');
      return;
    }

    const finalSlugFa = slugify(slugFa || titleFa);
    if (!finalSlugFa) {
      setError(isFa ? 'نامک فارسی معتبر الزامی است.' : 'Valid Persian slug is required.');
      return;
    }

    try {
      setSaving(true);

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title_fa: titleFa.trim(),
        slug_fa: finalSlugFa,
        category_id: categoryId,
        cover_image_url: coverImageUrl.trim() || null,
        excerpt_fa: excerptFa.trim() || null,
        content_fa: contentFa,
        title_en: titleEn.trim() || null,
        slug_en: slugEn.trim() ? slugify(slugEn) : null,
        excerpt_en: excerptEn.trim() || null,
        content_en: contentEn || null,
        meta_title_fa: metaTitleFa.trim() || null,
        meta_title_en: metaTitleEn.trim() || null,
        meta_description_fa: metaDescFa.trim() || null,
        meta_description_en: metaDescEn.trim() || null,
        tags,
      };

      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update article');
      }

      setSuccessMessage(isFa ? 'تغییرات مقاله با موفقیت ذخیره شد.' : 'Article updated successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Error updating article');
    } finally {
      setSaving(false);
    }
  };

  // Publish article (Owner/Manager only)
  const handlePublish = async () => {
    setError(null);
    setSuccessMessage(null);

    try {
      setPublishing(true);

      // First save current changes to ensure latest content is published
      await handleSave();

      const res = await fetch(`/api/admin/blog/${postId}/publish`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish article');
      }

      setPostStatus('published');
      setSuccessMessage(isFa ? 'مقاله با موفقیت منتشر شد و اکنون روی سایت در دسترس است.' : 'Article published successfully.');
    } catch (err: any) {
      setError(err.message || 'Error publishing article');
    } finally {
      setPublishing(false);
    }
  };

  // Unpublish article (Owner/Manager only)
  const handleUnpublish = async () => {
    setError(null);
    setSuccessMessage(null);

    try {
      setPublishing(true);

      const res = await fetch(`/api/admin/blog/${postId}/unpublish`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to unpublish article');
      }

      setPostStatus('draft');
      setSuccessMessage(isFa ? 'مقاله از حالت انتشار خارج شد و به پیش‌نویس بازگشت.' : 'Article moved back to draft.');
    } catch (err: any) {
      setError(err.message || 'Error unpublishing article');
    } finally {
      setPublishing(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">{isFa ? 'در حال بارگذاری اطلاعات مقاله...' : 'Loading article...'}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {isFa ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {isFa ? 'ویرایش مقاله' : 'Edit Article'}
                </h1>
                {postStatus === 'published' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isFa ? 'منتشرشده' : 'Published'}
                  </span>
                )}
                {postStatus === 'draft' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Clock size={11} />
                    {isFa ? 'پیش‌نویس' : 'Draft'}
                  </span>
                )}
                {postStatus === 'archived' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-700/30 text-slate-400 border border-slate-600/30">
                    {isFa ? 'بایگانی' : 'Archived'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                ID: {postId}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            {postStatus === 'published' && (
              <a
                href={`/${currentLang}/romania/blog/${slugFa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                <GlobeIcon size={14} />
                <span>{isFa ? 'مشاهده در سایت' : 'View on Site'}</span>
              </a>
            )}

            {/* Publish / Unpublish Button */}
            {canPublish ? (
              postStatus === 'published' ? (
                <button
                  type="button"
                  onClick={handleUnpublish}
                  disabled={publishing || saving}
                  className="px-4 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-bold border border-amber-800/50 transition-all cursor-pointer"
                >
                  {publishing ? (
                    <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin inline-block" />
                  ) : (
                    <span>{isFa ? 'خروج از انتشار' : 'Unpublish'}</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing || saving}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {publishing ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  <span>{isFa ? 'انتشار مقاله' : 'Publish Article'}</span>
                </button>
              )
            ) : (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-[11px]"
                title={isFa ? 'فقط مدیران ارشد مجاز به انتشار مقاله هستند' : 'Only Managers/Owners can publish'}
              >
                <LockIcon size={12} />
                <span>{isFa ? 'نیازمند تأیید مدیر برای انتشار' : 'Pending Manager Review'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/40 p-4 flex items-center gap-3 text-red-300 text-xs sm:text-sm">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 flex items-center gap-3 text-emerald-300 text-xs sm:text-sm animate-in fade-in">
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {isFa ? 'اطلاعات اصلی (فارسی)' : 'Main Information (Persian)'}
            </h2>

            {/* Persian Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isFa ? 'عنوان مقاله (فارسی) *' : 'Article Title (FA) *'}
              </label>
              <input
                type="text"
                required
                value={titleFa}
                onChange={(e) => setTitleFa(e.target.value)}
                placeholder="عنوان فارسی مقاله..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isFa ? 'دسته‌بندی موضوعی *' : 'Category *'}
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isFa ? c.label_fa : c.label_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isFa ? 'نامک آدرس وب (Slug FA) *' : 'URL Slug (FA) *'}
                </label>
                <input
                  type="text"
                  required
                  value={slugFa}
                  onChange={(e) => setSlugFa(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500 ltr:text-left"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  /{currentLang}/romania/blog/<strong>{slugify(slugFa || 'slug')}</strong>
                </span>
              </div>
            </div>

            {/* Cover Image Upload (with automatic old image cleanup on change) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isFa ? 'تصویر کاور مقاله' : 'Cover Image'}
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {coverImageUrl ? (
                  <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                    <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverImageUrl('')}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-md text-[10px]"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-36 h-24 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 flex items-center justify-center text-slate-600 shrink-0">
                    <UploadCloudIcon size={24} />
                  </div>
                )}

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    id="cover-upload-edit"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <label
                    htmlFor="cover-upload-edit"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-all"
                  >
                    <UploadCloudIcon size={15} />
                    <span>
                      {uploadingImage
                        ? isFa
                          ? 'در حال آپلود...'
                          : 'Uploading...'
                        : isFa
                        ? 'تغییر یا آپلود تصویر کاور'
                        : 'Change Cover File'}
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    {isFa
                      ? 'در صورت بارگذاری تصویر جدید، تصویر قبلی به صورت خودکار از Storage حذف خواهد شد.'
                      : 'When replacing image, previous file is automatically deleted from storage.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Persian Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isFa ? 'خلاصه یا چکیده مقاله (فارسی)' : 'Excerpt (FA)'}
              </label>
              <textarea
                rows={2}
                value={excerptFa}
                onChange={(e) => setExcerptFa(e.target.value)}
                placeholder="چکیده‌ای مختصر از نکات کلیدی مقاله..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Persian Markdown Content & Safe Preview (No rehype-raw) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  {isFa ? 'محتوای کامل مقاله (Markdown فارسی) *' : 'Full Content (Markdown FA) *'}
                </label>
                <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTabFa('write')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      activeTabFa === 'write' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3Icon size={12} />
                    <span>{isFa ? 'ویرایشگر' : 'Editor'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabFa('preview')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      activeTabFa === 'preview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <EyeIcon size={12} />
                    <span>{isFa ? 'پیش‌نمایش امن' : 'Safe Preview'}</span>
                  </button>
                </div>
              </div>

              {activeTabFa === 'write' ? (
                <textarea
                  rows={14}
                  required
                  value={contentFa}
                  onChange={(e) => setContentFa(e.target.value)}
                  className="w-full font-mono text-xs bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              ) : (
                <div className="w-full min-h-[350px] max-h-[500px] overflow-y-auto bg-slate-950/90 border border-slate-800 rounded-xl p-6 text-slate-200 prose prose-invert prose-amber max-w-none text-sm leading-relaxed">
                  {contentFa ? (
                    // Strictly NO rehype-raw: HTML tags are escaped, blocking XSS
                    <ReactMarkdown>{contentFa}</ReactMarkdown>
                  ) : (
                    <p className="text-slate-500 italic text-xs">
                      {isFa ? 'هنوز محتوایی نوشته نشده است.' : 'No content to preview.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* English Translation Section (Collapsible) */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => setShowEnSection(!showEnSection)}
              className="w-full p-5 flex items-center justify-between text-left rtl:text-right hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  EN
                </span>
                <span className="text-sm font-bold text-slate-200">
                  {isFa ? 'ترجمه و محتوای انگلیسی (اختیاری)' : 'English Translation & Content (Optional)'}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {showEnSection ? '▲ بستن' : '▼ باز کردن'}
              </span>
            </button>

            {showEnSection && (
              <div className="p-6 border-t border-slate-800 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isFa ? 'عنوان انگلیسی (Title EN)' : 'English Title'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="English article title..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 ltr:text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isFa ? 'نامک انگلیسی (Slug EN)' : 'English Slug'}
                  </label>
                  <input
                    type="text"
                    value={slugEn}
                    onChange={(e) => setSlugEn(e.target.value)}
                    placeholder="english-article-slug"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500 ltr:text-left"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    /en/romania/blog/<strong>{slugify(slugEn || 'english-slug')}</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isFa ? 'خلاصه انگلیسی (Excerpt EN)' : 'English Excerpt'}
                  </label>
                  <textarea
                    rows={2}
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    placeholder="Brief summary for English readers..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 ltr:text-left"
                  />
                </div>

                {/* English Markdown Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      {isFa ? 'متن کامل انگلیسی (Markdown EN)' : 'English Markdown Content'}
                    </label>
                    <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setActiveTabEn('write')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                          activeTabEn === 'write' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Edit3Icon size={12} />
                        <span>Editor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTabEn('preview')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                          activeTabEn === 'preview' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <EyeIcon size={12} />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>

                  {activeTabEn === 'write' ? (
                    <textarea
                      rows={10}
                      value={contentEn}
                      onChange={(e) => setContentEn(e.target.value)}
                      placeholder="Markdown content in English..."
                      className="w-full font-mono text-xs bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 leading-relaxed ltr:text-left"
                    />
                  ) : (
                    <div className="w-full min-h-[250px] max-h-[400px] overflow-y-auto bg-slate-950/90 border border-slate-800 rounded-xl p-6 text-slate-200 prose prose-invert max-w-none text-sm leading-relaxed ltr:text-left">
                      {contentEn ? (
                        // Strictly NO rehype-raw
                        <ReactMarkdown>{contentEn}</ReactMarkdown>
                      ) : (
                        <p className="text-slate-500 italic text-xs">No English content to preview.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SEO & Meta Section (Collapsible) */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => setShowSeoSection(!showSeoSection)}
              className="w-full p-5 flex items-center justify-between text-left rtl:text-right hover:bg-slate-800/30 transition-colors"
            >
              <span className="text-sm font-bold text-slate-200">
                {isFa ? 'تنظیمات سئو و متا تگ‌ها (اختیاری)' : 'SEO & Metadata Settings (Optional)'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {showSeoSection ? '▲ بستن' : '▼ باز کردن'}
              </span>
            </button>

            {showSeoSection && (
              <div className="p-6 border-t border-slate-800 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isFa ? 'عنوان متا فارسی (Meta Title FA)' : 'Meta Title (FA)'}
                    </label>
                    <input
                      type="text"
                      value={metaTitleFa}
                      onChange={(e) => setMetaTitleFa(e.target.value)}
                      placeholder="عنوان بهینه‌شده برای نتایج گوگل"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isFa ? 'عنوان متا انگلیسی (Meta Title EN)' : 'Meta Title (EN)'}
                    </label>
                    <input
                      type="text"
                      value={metaTitleEn}
                      onChange={(e) => setMetaTitleEn(e.target.value)}
                      placeholder="Google search title in English"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 ltr:text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isFa ? 'توضیحات متا فارسی (Meta Description FA)' : 'Meta Description (FA)'}
                    </label>
                    <textarea
                      rows={2}
                      value={metaDescFa}
                      onChange={(e) => setMetaDescFa(e.target.value)}
                      placeholder="توضیحات جذاب برای نمایش در گوگل"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isFa ? 'توضیحات متا انگلیسی (Meta Description EN)' : 'Meta Description (EN)'}
                    </label>
                    <textarea
                      rows={2}
                      value={metaDescEn}
                      onChange={(e) => setMetaDescEn(e.target.value)}
                      placeholder="Google description snippet in English"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 ltr:text-left"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isFa ? 'برچسب‌ها (با کاما جدا کنید)' : 'Tags (Comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="رومانی, ویزای کار, اقامت اروپا, بخارست"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Link
              href="/admin/blog"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all"
            >
              {isFa ? 'بازگشت به فهرست' : 'Back to List'}
            </Link>

            <button
              type="submit"
              disabled={saving || publishing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              {saving && (
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isFa ? 'ذخیره تغییرات' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
