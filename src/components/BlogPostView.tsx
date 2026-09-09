'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { useAppContext } from '@/components/AppLayout';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EvaluationCTA } from '@/components/EvaluationCTA';

// Lucide-style SVG icons
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

function UserIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function TagIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

export interface BlogPostData {
  id: string;
  category_id: string;
  status: string;
  title_fa: string;
  title_en: string | null;
  slug_fa: string;
  slug_en: string | null;
  excerpt_fa: string | null;
  excerpt_en: string | null;
  content_fa: string;
  content_en: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  published_at: string | null;
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

interface BlogPostViewProps {
  post: BlogPostData;
  lang: Language;
}

export function BlogPostView({ post, lang }: BlogPostViewProps) {
  const isFa = lang === 'fa';
  const { setAlternateLanguageUrls, onOpenEvaluationModal } = useAppContext();

  const title = isFa ? post.title_fa : (post.title_en || post.title_fa);
  const excerpt = isFa ? post.excerpt_fa : (post.excerpt_en || post.excerpt_fa);
  const content = isFa ? post.content_fa : (post.content_en || '');
  const categoryLabel = post.category
    ? isFa
      ? post.category.label_fa
      : post.category.label_en
    : null;

  // Reading time estimate (approx 200 words/min)
  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Determine language switcher alternate URLs
  useEffect(() => {
    if (!setAlternateLanguageUrls) return;

    const hasEn = Boolean(post.slug_en && post.title_en && post.content_en);

    setAlternateLanguageUrls({
      fa: `/fa/romania/blog/${post.slug_fa}`,
      en: hasEn ? `/en/romania/blog/${post.slug_en}` : '/en/romania/blog',
    });

    return () => {
      setAlternateLanguageUrls(null);
    };
  }, [post, setAlternateLanguageUrls]);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: isFa ? 'رومانی' : 'Romania', href: '/romania' },
          { label: isFa ? 'بلاگ' : 'Blog', href: '/romania/blog' },
          { label: title },
        ]}
        currentLang={lang}
        disableJsonLd={true}
      />

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-950 overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
            {categoryLabel && (
              <span className="absolute top-4 right-4 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto px-3.5 py-1 rounded-full bg-[#071B3D]/85 backdrop-blur-md text-white text-xs font-bold shadow-lg">
                {categoryLabel}
              </span>
            )}
          </div>
        )}

        <div className="p-6 sm:p-10 lg:p-12 space-y-8">
          {/* Article Header */}
          <header className="space-y-4 border-b border-slate-100 pb-8">
            {!post.cover_image_url && categoryLabel && (
              <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 text-[#2F6FED] text-xs font-bold border border-blue-200">
                {categoryLabel}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#142033] leading-tight sm:leading-snug">
              {title}
            </h1>

            {excerpt && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium bg-slate-50 border-r-4 rtl:border-r-4 ltr:border-l-4 rtl:border-l-0 border-[#2F6FED] p-4 rounded-xl">
                {excerpt}
              </p>
            )}

            {/* Metadata (Author, Date, Reading time) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 pt-2 font-medium">
              {post.author?.full_name && (
                <div className="flex items-center gap-1.5">
                  <UserIcon size={14} className="text-[#2F6FED]" />
                  <span>{post.author.full_name}</span>
                </div>
              )}

              {formattedDate && (
                <div className="flex items-center gap-1.5">
                  <CalendarIcon size={14} className="text-slate-400" />
                  <span>{formattedDate}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <ClockIcon size={14} className="text-slate-400" />
                <span>
                  {readTimeMinutes} {isFa ? 'دقیقه زمان مطالعه' : 'min read'}
                </span>
              </div>
            </div>
          </header>

          {/* Article Content: Rendered safely with react-markdown (NO rehype-raw) */}
          <div className="prose prose-slate max-w-none text-[#1e293b] leading-relaxed text-sm sm:text-base selection:bg-blue-100 font-sans space-y-5">
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-xl sm:text-2xl font-black text-[#071B3D] mt-8 mb-4 border-b border-slate-100 pb-2"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-lg sm:text-xl font-bold text-[#0b2b55] mt-6 mb-3"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="leading-relaxed mb-4 text-slate-700" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside space-y-1.5 mb-4 text-slate-700" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside space-y-1.5 mb-4 text-slate-700" {...props} />
                ),
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-r-4 rtl:border-r-4 ltr:border-l-4 rtl:border-l-0 border-amber-500 bg-amber-50/60 p-4 rounded-xl my-4 text-slate-700 italic"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full border-collapse border border-slate-200 text-xs sm:text-sm" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="border border-slate-200 bg-slate-100 p-3 font-bold text-slate-800 text-right rtl:text-right ltr:text-left" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="border border-slate-200 p-3 text-slate-700" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-[#2F6FED] font-bold underline hover:text-blue-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                <TagIcon size={13} />
                <span>{isFa ? 'برچسب‌ها:' : 'Tags:'}</span>
              </span>
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Back to Blog catalog link */}
          <div className="pt-6 flex items-center justify-between border-t border-slate-100">
            <Link
              href="/romania/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2F6FED] hover:underline"
            >
              <span>{isFa ? '← بازگشت به فهرست مقالات' : '← Back to Blog Articles'}</span>
            </Link>
          </div>
        </div>
      </article>

      {/* Free Evaluation CTA */}
      <EvaluationCTA currentLang={lang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );
}
