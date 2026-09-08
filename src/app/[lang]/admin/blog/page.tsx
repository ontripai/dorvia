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

// Lucide-style icons
function BookOpenIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

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

function ExternalLinkIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

interface BlogPost {
  id: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
  title_fa: string;
  title_en: string | null;
  slug_fa: string;
  slug_en: string | null;
  cover_image_url: string | null;
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

interface BlogCategory {
  id: string;
  key: string;
  label_fa: string;
  label_en: string;
  sort_order: number;
}

export default function AdminBlogPage({ params }: { params: { lang: Language } }) {
  const router = useRouter();
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [canPublish, setCanPublish] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (categoryFilter !== 'all') params.set('category_id', categoryFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/blog?${params.toString()}`);
      if (res.status === 401) {
        router.replace(`/${currentLang}/admin/login`);
        return;
      }
      if (res.status === 403) {
        setError(isFa ? 'شما مجوز دسترسی به بخش مدیریت بلاگ را ندارید.' : 'You do not have permission to access Blog Management.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch blog posts');
      }

      setPosts(data.posts || []);
      setCategories(data.categories || []);
      setCanPublish(Boolean(data.canPublish));
      if (data.admin) setAdminUser(data.admin);
    } catch (err: any) {
      setError(err.message || 'Error loading blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace(`/${currentLang}/admin/login`);
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/blog/${deletingPost.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete post');
      }

      // Remove from state
      setPosts((prev) => prev.filter((p) => p.id !== deletingPost.id));
      setDeletingPost(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting post');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Navigation */}
        <header className="mb-8 border-b border-slate-800/80 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <BookOpenIcon size={20} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {isFa ? 'مدیریت مقالات و بلاگ' : 'Blog & Content Management'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {isFa
                      ? 'تولید، ویرایش، سئو و انتشار مقالات تخصصی رومانی و اروپا'
                      : 'Create, edit, optimize and publish Romania & European relocation articles'}
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
                <BriefcaseBusiness size={14} />
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

              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
                <BookOpenIcon size={14} />
                <span>{isFa ? 'بلاگ' : 'Blog'}</span>
              </span>

              <Link
                href="/admin/jobs"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-all"
              >
                <BriefcaseBusiness size={14} />
                <span>{isFa ? 'فرصت‌های شغلی' : 'Jobs'}</span>
              </Link>

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

        {/* Action Bar: Create New Post & Search */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <PlusIcon size={18} />
              <span>{isFa ? 'مقاله جدید' : 'New Article'}</span>
            </Link>

            {/* Status Tabs */}
            <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
              {(['all', 'draft', 'published', 'archived'] as const).map((st) => {
                const active = statusFilter === st;
                const labels: Record<string, { fa: string; en: string }> = {
                  all: { fa: 'همه', en: 'All' },
                  draft: { fa: 'پیش‌نویس', en: 'Draft' },
                  published: { fa: 'منتشرشده', en: 'Published' },
                  archived: { fa: 'بایگانی', en: 'Archived' },
                };
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isFa ? labels[st].fa : labels[st].en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">{isFa ? 'همه دسته‌بندی‌ها' : 'All Categories'}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {isFa ? c.label_fa : c.label_en}
                </option>
              ))}
            </select>

            <form onSubmit={handleSearchSubmit} className="relative min-w-[220px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFa ? 'جستجو در عنوان یا اسلاگ...' : 'Search title or slug...'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400"
              >
                <SearchIcon size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/40 p-4 flex items-center gap-3 text-red-300 text-sm">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Table Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span>{isFa ? 'در حال بارگذاری مقالات...' : 'Loading articles...'}</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
              <BookOpenIcon size={36} className="text-slate-600" />
              <p className="font-semibold text-slate-300">
                {isFa ? 'مقاله‌ای یافت نشد' : 'No articles found'}
              </p>
              <p className="text-xs text-slate-500">
                {isFa
                  ? 'هنوز مقاله‌ای با این فیلترها ایجاد نشده است.'
                  : 'No posts match your selected filters.'}
              </p>
              <Link
                href="/admin/blog/new"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
              >
                <PlusIcon size={14} />
                <span>{isFa ? 'ایجاد اولین مقاله' : 'Create First Article'}</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">{isFa ? 'تصویر و عنوان' : 'Cover & Title'}</th>
                    <th className="px-5 py-3.5">{isFa ? 'دسته‌بندی' : 'Category'}</th>
                    <th className="px-5 py-3.5">{isFa ? 'زبان‌ها' : 'Languages'}</th>
                    <th className="px-5 py-3.5">{isFa ? 'وضعیت' : 'Status'}</th>
                    <th className="px-5 py-3.5">{isFa ? 'نویسنده' : 'Author'}</th>
                    <th className="px-5 py-3.5">{isFa ? 'تاریخ ایجاد' : 'Created'}</th>
                    <th className="px-5 py-3.5 text-center">{isFa ? 'عملیات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {posts.map((post) => {
                    const hasEn = Boolean(post.title_en && post.slug_en);
                    return (
                      <tr key={post.id} className="hover:bg-slate-800/30 transition-colors">
                        {/* Title & Cover */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {post.cover_image_url ? (
                              <img
                                src={post.cover_image_url}
                                alt={post.title_fa}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-500 shrink-0">
                                <BookOpenIcon size={18} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-slate-100 line-clamp-1 text-sm">
                                {post.title_fa}
                              </p>
                              {post.title_en && (
                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {post.title_en}
                                </p>
                              )}
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                /{post.slug_fa}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/50">
                            {post.category ? (isFa ? post.category.label_fa : post.category.label_en) : '—'}
                          </span>
                        </td>

                        {/* Languages Indicator */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              FA
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                hasEn
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : 'bg-slate-800/60 text-slate-500 border-slate-700/40'
                              }`}
                              title={hasEn ? 'English translation available' : 'Persian only'}
                            >
                              EN
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {post.status === 'published' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {isFa ? 'منتشرشده' : 'Published'}
                            </span>
                          )}
                          {post.status === 'draft' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              <Clock size={11} />
                              {isFa ? 'پیش‌نویس' : 'Draft'}
                            </span>
                          )}
                          {post.status === 'archived' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-700/30 text-slate-400 border border-slate-600/30">
                              {isFa ? 'بایگانی' : 'Archived'}
                            </span>
                          )}
                        </td>

                        {/* Author */}
                        <td className="px-5 py-4 text-slate-400">
                          {post.author?.full_name || '—'}
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-[11px] text-slate-400 font-mono">
                          {new Date(post.created_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US')}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {post.status === 'published' && (
                              <a
                                href={`/${currentLang}/romania/blog/${post.slug_fa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title={isFa ? 'مشاهده در وبسایت' : 'View on site'}
                              >
                                <ExternalLinkIcon size={14} />
                              </a>
                            )}

                            <Link
                              href={`/admin/blog/${post.id}/edit`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-800/40 transition-all"
                            >
                              <EditIcon size={13} />
                              <span>{isFa ? 'ویرایش' : 'Edit'}</span>
                            </Link>

                            <button
                              onClick={() => {
                                setDeleteError(null);
                                setDeletingPost(post);
                              }}
                              disabled={post.status === 'published'}
                              className={`p-1.5 rounded-lg border transition-all ${
                                post.status === 'published'
                                  ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-600'
                                  : 'bg-red-950/30 hover:bg-red-900/50 text-red-400 border-red-800/40 cursor-pointer'
                              }`}
                              title={
                                post.status === 'published'
                                  ? isFa
                                    ? 'مقاله منتشرشده را ابتدا بایگانی کنید'
                                    : 'Archive published article before deleting'
                                  : isFa
                                  ? 'حذف مقاله'
                                  : 'Delete'
                              }
                            >
                              <TrashIcon size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
              <TrashIcon size={22} />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {isFa ? 'حذف مقاله' : 'Delete Article'}
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {isFa
                ? `آیا از حذف دائمی مقاله «${deletingPost.title_fa}» اطمینان دارید؟ تمام محتوا و فایل تصویر کاور از Storage حذف خواهد شد.`
                : `Are you sure you want to permanently delete "${deletingPost.title_fa}"? All content and the cover image will be removed from storage.`}
            </p>

            {deleteError && (
              <div className="mb-4 rounded-lg bg-red-950/50 border border-red-800/50 p-3 text-red-300 text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingPost(null)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {isFa ? 'انصراف' : 'Cancel'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                {deleteLoading && (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isFa ? 'حذف قطعی' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
