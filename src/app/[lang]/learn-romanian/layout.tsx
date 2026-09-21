import React from 'react';
import type { Metadata } from 'next';
import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const baseMeta = getLocalizedMetadata('learn-romanian', params.lang as Language);

  return {
    ...baseMeta,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function LearnRomanianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
