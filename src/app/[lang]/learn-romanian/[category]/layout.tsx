import React from 'react';
import type { Metadata } from 'next';
import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';
import { isValidCategory } from '@/lib/romanian/categories';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { lang: string; category: string };
}): Promise<Metadata> {
  if (!isValidCategory(params.category)) {
    notFound();
  }

  const routeKey = `learn-romanian/${params.category}`;
  const baseMeta = getLocalizedMetadata(routeKey, params.lang as Language);

  return {
    ...baseMeta,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
