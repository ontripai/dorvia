'use client';

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
}

/**
 * Emits Article / BlogPosting structured data (schema.org) matching Google's guidelines.
 * Renders JSON-LD only without visible UI.
 */
export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName = 'DORVIA Editorial Team',
  url,
  inLanguage,
}) => {
  const origin = getCanonicalOrigin();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description: description || headline,
    image: image ? [image] : undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    inLanguage: inLanguage === 'fa' ? 'fa-IR' : 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Person',
      name: authorName || (inLanguage === 'fa' ? 'تیم تحریریه دورویا' : 'DORVIA Editorial Team'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'DORVIA EUROP',
      url: origin,
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/images/logo/dorvia-logo-primary-transparent-3000.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
