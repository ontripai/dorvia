import React from 'react';
import { getCanonicalOrigin } from '@/lib/metadata';

export interface ArticleSchemaProps {
  headline: string;
  description?: string | null;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  url: string;
  inLanguage: 'fa' | 'en';
  categoryLabel?: string | null;
  categoryKey?: string | null;
}

/**
 * Server Component emitting Article / BlogPosting and BreadcrumbList structured data (JSON-LD)
 * strictly complying with Google Search Central specifications.
 */
export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  url,
  inLanguage,
  categoryLabel,
  categoryKey,
}: ArticleSchemaProps) {
  const origin = getCanonicalOrigin();
  const isFa = inLanguage === 'fa';

  const homeUrl = `${origin}/${inLanguage}`;
  const blogUrl = `${origin}/${inLanguage}/romania/blog`;
  const categoryUrl = categoryKey ? `${blogUrl}?category=${encodeURIComponent(categoryKey)}` : null;

  const breadcrumbItems: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: isFa ? 'خانه' : 'Home',
      item: homeUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: isFa ? 'رومانی / بلاگ' : 'Romania / Blog',
      item: blogUrl,
    },
  ];

  if (categoryLabel && categoryUrl) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: categoryLabel,
      item: categoryUrl,
    });
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 4,
      name: headline,
      item: url,
    });
  } else {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: headline,
      item: url,
    });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          name: 'DORVIA EUROP',
          url: origin,
        },
        headline,
        description: description || headline,
        image: image ? [image] : undefined,
        datePublished: datePublished || undefined,
        dateModified: dateModified || datePublished || undefined,
        inLanguage: isFa ? 'fa-IR' : 'en-US',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        author: {
          '@type': 'Organization',
          '@id': `${origin}/#organization`,
          name: 'DORVIA EUROP',
          url: origin,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${origin}/#organization`,
          name: 'DORVIA EUROP',
          url: origin,
          logo: {
            '@type': 'ImageObject',
            url: `${origin}/images/logo/dorvia-logo-primary-transparent-3000.png`,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
