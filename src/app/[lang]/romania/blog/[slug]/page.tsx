import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Language } from '@/types';
import { BlogPostView, BlogPostData } from '@/components/BlogPostView';
import { ArticleSchema } from '@/components/ArticleSchema';
import { getCanonicalOrigin } from '@/lib/metadata';

interface PageProps {
  params: {
    lang: Language;
    slug: string;
  };
}

// Force dynamic since blog posts are created and updated in real time via CMS
export const dynamic = 'force-dynamic';

async function getPost(slug: string, lang: Language): Promise<BlogPostData | null> {
  if (!supabaseAdmin) return null;

  // Query published post matching slug for the given language
  const column = lang === 'en' ? 'slug_en' : 'slug_fa';

  const { data: post, error } = await supabaseAdmin
    .from('blog_posts')
    .select(`
      id,
      category_id,
      status,
      title_fa,
      title_en,
      slug_fa,
      slug_en,
      excerpt_fa,
      excerpt_en,
      content_fa,
      content_en,
      cover_image_url,
      meta_title_fa,
      meta_title_en,
      meta_description_fa,
      meta_description_en,
      tags,
      published_at,
      updated_at,
      category:blog_categories!blog_posts_category_id_fkey (
        id,
        key,
        label_fa,
        label_en
      ),
      author:admin_users!blog_posts_author_admin_id_fkey (
        id,
        full_name
      )
    `)
    .eq('status', 'published')
    .eq(column, slug)
    .maybeSingle();

  if (error || !post) return null;

  // Language completeness check:
  if (lang === 'en') {
    if (!post.slug_en || !post.title_en || !post.content_en) {
      return null; // English content not ready -> trigger 404
    }
  } else {
    if (!post.slug_fa || !post.title_fa || !post.content_fa) {
      return null;
    }
  }

  return post as unknown as BlogPostData;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = params;
  const post = await getPost(slug, lang);

  if (!post) {
    return {
      title: lang === 'fa' ? 'مقاله یافت نشد | دورویا' : 'Article Not Found | DORVIA',
    };
  }

  const isFa = lang === 'fa';
  const rawPost = post as any;
  const title = isFa
    ? rawPost.meta_title_fa || rawPost.title_fa
    : rawPost.meta_title_en || rawPost.title_en || rawPost.title_fa;
  const description = isFa
    ? rawPost.meta_description_fa || rawPost.excerpt_fa || ''
    : rawPost.meta_description_en || rawPost.excerpt_en || '';

  const baseUrl = getCanonicalOrigin();
  const canonicalUrl = `${baseUrl}/${lang}/romania/blog/${slug}`;

  // Alternate language links
  const languages: Record<string, string> = {
    fa: `${baseUrl}/fa/romania/blog/${post.slug_fa}`,
  };

  if (post.slug_en && post.title_en && post.content_en) {
    languages.en = `${baseUrl}/en/romania/blog/${post.slug_en}`;
  }

  return {
    title: `${title} | DORVIA`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'DORVIA',
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      images: post.cover_image_url
        ? [
            {
              url: post.cover_image_url,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { lang, slug } = params;
  const post = await getPost(slug, lang);

  if (!post) {
    notFound();
  }

  const isFa = lang === 'fa';
  const title = isFa ? post.title_fa : (post.title_en || post.title_fa);
  const rawPost = post as any;
  const description = isFa
    ? rawPost.meta_description_fa || rawPost.excerpt_fa || ''
    : rawPost.meta_description_en || rawPost.excerpt_en || '';

  const baseUrl = getCanonicalOrigin();
  const pageUrl = `${baseUrl}/${lang}/romania/blog/${slug}`;
  const categoryLabel = isFa ? post.category?.label_fa : (post.category?.label_en || post.category?.label_fa);
  const categoryKey = post.category?.key;

  return (
    <>
      <ArticleSchema
        headline={title}
        description={description}
        image={post.cover_image_url || undefined}
        datePublished={post.published_at || undefined}
        dateModified={post.updated_at || undefined}
        authorName={post.author?.full_name || 'DORVIA Editorial Team'}
        url={pageUrl}
        inLanguage={lang}
        categoryLabel={categoryLabel}
        categoryKey={categoryKey}
      />
      <BlogPostView post={post} lang={lang} />
    </>
  );
}
