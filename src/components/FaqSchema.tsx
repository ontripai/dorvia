'use client';

import React from 'react';

export interface FaqSchemaItem {
  q: string;
  a: string;
}

interface FaqSchemaProps {
  items: FaqSchemaItem[];
}

// Emits FAQPage structured data (schema.org) matching the FAQ content
// already visible on the page. Renders no visible UI — JSON-LD only.
export const FaqSchema: React.FC<FaqSchemaProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
