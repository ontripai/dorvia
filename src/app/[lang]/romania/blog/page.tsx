'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { useAppContext } from '@/components/AppLayout';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EvaluationCTA } from '@/components/EvaluationCTA';

// Lucide-style SVG icons
function SearchIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CalendarIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ArrowUpRightIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

interface PublicBlogPost {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  category?: {
    id: string;
    key: string;
    label_fa: string;
    label_en: string;
  };
}

interface BlogCategory {
  id: string;
  key: string;
  label_fa: string;
  label_en: string;
}

export default function BlogCatalogPage({ params }: { params: { lang: Language } }) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const { onOpenEvaluationModal } = useAppContext();

  const [posts, setPosts] = useState<PublicBlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [postsRes, catRes] = await Promise.all([
          fetch(`/api/blog/posts?lang=${currentLang}`),
          fetch('/api/blog/categories'),
        ]);

        const postsData = await postsRes.json();
        const catData = await catRes.json();

        if (postsData.posts) setPosts(postsData.posts);
        if (catData.categories) setCategories(catData.categories);
      } catch (err) {
        console.error('Failed to load blog catalog data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [currentLang]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCat = selectedCategory === 'all' || post.category_id === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: isFa ? 'رومانی' : 'Romania', href: '/romania' },
          { label: isFa ? 'بلاگ و مقالات' : 'Blog & Articles' },
        ]}
        currentLang={currentLang}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071B3D] via-[#0b2b55] to-[#143d75] text-white p-8 sm:p-12 shadow-2xl border border-blue-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
            <span>🇷🇴</span>
            <span>{isFa ? 'مرجع تخصصی اطلاعات و مقالات رومانی' : 'Romania Insights & Knowledge Base'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {isFa ? 'بلاگ، اخبار و مقالات تحلیلی رومانی' : 'Romania Blog & Strategic Articles'}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            {isFa
              ? 'راهنمای جامع اقامت، اشتغال، ثبت شرکت، هزینه‌های زندگی، قوانین جدید شنگن و فرصت‌های تحصیلی و اقتصادی رومانی.'
              : 'In-depth analyses, legal updates, business pathways, work permits, and living costs across Romania and the EU.'}
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#071B3D] text-white shadow-md shadow-blue-950/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isFa ? 'همه موضوعات' : 'All Topics'}
            </button>
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    active
                      ? 'bg-[#071B3D] text-white shadow-md shadow-blue-950/20'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isFa ? cat.label_fa : cat.label_en}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFa ? 'جستجو در مقالات...' : 'Search articles...'}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2F6FED] shadow-sm"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <SearchIcon size={15} />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section>
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#2F6FED] border-t-transparent rounded-full animate-spin" />
            <span>{isFa ? 'در حال بارگذاری مقالات...' : 'Loading articles...'}</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-16 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
            <p className="text-base font-bold text-slate-700">
              {isFa ? 'مقاله‌ای یافت نشد' : 'No articles found'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isFa
                ? 'با تغییر موضوع انتخابی یا عبارت جستجو می‌توانید مقالات دیگر را مشاهده کنید.'
                : 'Try adjusting your search terms or filter selection to find relevant articles.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const categoryLabel = post.category
                ? isFa
                  ? post.category.label_fa
                  : post.category.label_en
                : '';

              const formattedDate = post.published_at
                ? new Date(post.published_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : null;

              return (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Article Cover */}
                  <Link
                    href={`/romania/blog/${post.slug}`}
                    className="relative aspect-video w-full overflow-hidden bg-slate-100 block"
                  >
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                        <span className="text-3xl font-black text-slate-300">DORVIA</span>
                      </div>
                    )}

                    {categoryLabel && (
                      <span className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto px-3 py-1 rounded-full bg-[#071B3D]/80 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                        {categoryLabel}
                      </span>
                    )}
                  </Link>

                  {/* Article Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      {/* Meta (Date) */}
                      {formattedDate && (
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={12} />
                            <span>{formattedDate}</span>
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-base sm:text-lg font-bold text-[#142033] group-hover:text-[#2F6FED] transition-colors line-clamp-2 leading-snug">
                        <Link href={`/romania/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Footer / Read Link */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2F6FED]">
                      <span>{isFa ? 'مطالعه مقاله' : 'Read Article'}</span>
                      <span className="transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        <ArrowUpRightIcon size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Free Evaluation CTA */}
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
