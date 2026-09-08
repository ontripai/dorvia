import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isJobBoardPubliclyEnabled } from '@/lib/jobBoardHelper';
import { Language } from '@/types';
import { JobCatalogView, CatalogJob, CatalogCategory } from '@/components/JobCatalogView';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    lang: Language;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const isFa = params.lang === 'fa';
  return {
    title: isFa
      ? 'فرصت‌های شغلی و استخدام در رومانی | کاریابی دورویا'
      : 'Job Opportunities & Recruitment in Romania | DORVIA',
    description: isFa
      ? 'فهرست موقعیت‌های شغلی فعال، قرارداد رسمی کاری، اسکان رایگان و ویزای کار رومانی با پشتیبانی کامل حقوقی دورویا.'
      : 'Active job openings, official labor contracts, lodging, and work visa support in Romania with DORVIA.',
  };
}

export default async function JobCatalogPage({ params }: PageProps) {
  // STRICT GATE CHECK:
  // If feature gate is false on database, completely 404 (zero leakage)
  const isGateEnabled = await isJobBoardPubliclyEnabled();
  if (!isGateEnabled) {
    notFound();
  }

  if (!supabaseAdmin) {
    notFound();
  }

  const lang = params.lang || 'fa';

  // 1. Fetch categories
  const { data: categories } = await supabaseAdmin
    .from('job_categories')
    .select('id, key, label_fa, label_en, sort_order')
    .order('sort_order', { ascending: true });

  // 2. Fetch published listings
  const { data: jobs } = await supabaseAdmin
    .from('job_listings')
    .select(`
      id,
      category_id,
      status,
      title_fa,
      title_en,
      slug_fa,
      slug_en,
      city,
      salary_min,
      salary_max,
      salary_currency,
      contract_type,
      positions_available,
      accommodation_provided,
      description_fa,
      description_en,
      is_sample,
      published_at,
      created_at,
      category:job_categories!job_listings_category_id_fkey (
        id,
        key,
        label_fa,
        label_en
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const jobList = (jobs || []).filter((job) => {
    // If English, enforce completeness: title_en, slug_en, description_en
    if (lang === 'en') {
      return Boolean(job.title_en?.trim() && job.slug_en?.trim() && job.description_en?.trim());
    }
    return Boolean(job.title_fa?.trim() && job.slug_fa?.trim() && job.description_fa?.trim());
  });

  return (
    <JobCatalogView
      initialJobs={jobList as unknown as CatalogJob[]}
      categories={(categories || []) as CatalogCategory[]}
      lang={lang}
    />
  );
}
