import React from 'react';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import { getCategoryCounts, getPublishedPhrases } from '@/lib/romanian/content';
import { RomanianHub } from '@/components/romanian/RomanianHub';

export default function LearnRomanianPage({
  params,
}: {
  params: { lang: string };
}) {
  if (!LOCALES.includes(params.lang as any)) {
    notFound();
  }

  const currentLang = params.lang as Language;
  const categoryCounts = getCategoryCounts();
  const samplePhrases = getPublishedPhrases().slice(0, 3);

  return (
    <RomanianHub
      currentLang={currentLang}
      categoryCounts={categoryCounts}
      samplePhrases={samplePhrases}
    />
  );
}
