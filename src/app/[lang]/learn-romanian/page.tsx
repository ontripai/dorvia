import React from 'react';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Language } from '@/types';
import {
  getCategoryCounts,
  getPublishedStations,
} from '@/lib/romanian/content';
import { ORDERED_CATEGORIES } from '@/lib/romanian/categories';
import { CONVERSATION_LESSONS } from '@/content/romanian/learning-collections';
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
  const stations = getPublishedStations();

  return (
    <RomanianHub
      currentLang={currentLang}
      conversationCount={CONVERSATION_LESSONS.length}
      moduleCount={stations.length}
      categoryCount={ORDERED_CATEGORIES.filter(category => categoryCounts[category.slug] > 0).length}
    />
  );
}
