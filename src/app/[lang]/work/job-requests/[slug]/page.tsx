import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isJobBoardPubliclyEnabled } from '@/lib/jobBoardHelper';
import { Language } from '@/types';
import { JobListingView, JobListingData } from '@/components/JobListingView';
import { getCanonicalOrigin } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    lang: Language;
    slug: string;
  };
}

async function getJob(slug: string, lang: Language): Promise<JobListingData | null> {
  if (!supabaseAdmin) return null;

  const column = lang === 'en' ? 'slug_en' : 'slug_fa';

  const { data: job, error } = await supabaseAdmin
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
      requirements_fa,
      requirements_en,
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
    .eq(column, slug)
    .maybeSingle();

  if (error || !job) return null;

  // STRICT TRANSLATION COMPLETENESS CHECK:
  // As requested, for English pages, all 3 fields (title_en, slug_en, description_en)
  // MUST be non-empty strings. If any is missing, throw 404.
  if (lang === 'en') {
    if (
      !job.title_en?.trim() ||
      !job.slug_en?.trim() ||
      !job.description_en?.trim()
    ) {
      return null;
    }
  } else {
    // Persian page requires title_fa, slug_fa, description_fa
    if (
      !job.title_fa?.trim() ||
      !job.slug_fa?.trim() ||
      !job.description_fa?.trim()
    ) {
      return null;
    }
  }

  return job as unknown as JobListingData;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const isGateEnabled = await isJobBoardPubliclyEnabled();
  if (!isGateEnabled) {
    return {
      title: params.lang === 'fa' ? 'صفحه یافت نشد | دورویا' : 'Page Not Found | DORVIA',
    };
  }

  const { lang, slug } = params;
  const job = await getJob(slug, lang);

  if (!job) {
    return {
      title: lang === 'fa' ? 'موقعیت شغلی یافت نشد | دورویا' : 'Job Not Found | DORVIA',
    };
  }

  const isFa = lang === 'fa';
  const title = isFa ? job.title_fa : (job.title_en || job.title_fa);
  const description = isFa
    ? `${job.title_fa} در شهر ${job.city}. شرایط استخدام، قرارداد رسمی و اسکان در رومانی.`
    : `${job.title_en || job.title_fa} in ${job.city}, Romania. Employment contract, lodging, and work permit.`;

  const baseUrl = getCanonicalOrigin();
  const canonicalUrl = `${baseUrl}/${lang}/work/job-requests/${slug}`;

  // Alternate links
  const alternates: Record<string, string> = {
    canonical: canonicalUrl,
  };

  if (job.slug_en && job.title_en && job.description_en) {
    alternates['en'] = `${baseUrl}/en/work/job-requests/${job.slug_en}`;
  }
  if (job.slug_fa) {
    alternates['fa'] = `${baseUrl}/fa/work/job-requests/${job.slug_fa}`;
  }

  return {
    title: `${title} | ${isFa ? 'دورویا' : 'DORVIA'}`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title: `${title} | DORVIA`,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function SingleJobPage({ params }: PageProps) {
  // STRICT GATE CHECK:
  // If feature gate is false on database, completely 404
  const isGateEnabled = await isJobBoardPubliclyEnabled();
  if (!isGateEnabled) {
    notFound();
  }

  const { lang, slug } = params;
  const job = await getJob(slug, lang);

  if (!job) {
    notFound();
  }

  const isFa = lang === 'fa';
  const title = isFa ? job.title_fa : (job.title_en || job.title_fa);
  const description = isFa ? job.description_fa : (job.description_en || job.description_fa);

  // Google JobPosting Schema JSON-LD
  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: title,
    description: description,
    datePosted: job.published_at || job.created_at,
    employmentType: job.contract_type === 'permanent' ? 'FULL_TIME' : job.contract_type === 'seasonal' ? 'SEASONAL' : 'OTHER',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'DORVIA',
      sameAs: getCanonicalOrigin(),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city,
        addressCountry: 'RO',
      },
    },
    ...(job.salary_min && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salary_currency,
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary_min,
          maxValue: job.salary_max || job.salary_min,
          unitText: 'MONTH',
        },
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <JobListingView job={job} lang={lang} />
    </>
  );
}
