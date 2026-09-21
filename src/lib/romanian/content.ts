import { PILOT_PHRASES } from '@/content/romanian/pilot';
import { STAGE0_PHRASES } from '@/content/romanian/stage0';
import { assertValidPhrases } from './validator';
import { RomanianCategory, RomanianPhrase } from './types';
import { ROMANIAN_CATEGORIES } from './categories';

export const ALL_ROMANIAN_PHRASES: RomanianPhrase[] = [
  ...PILOT_PHRASES,
  ...STAGE0_PHRASES,
];

// Strictly validate all phrases at module evaluation / build time.
// Any violation of V1-V7 throws an exception and halts build immediately.
assertValidPhrases(ALL_ROMANIAN_PHRASES);

// Status filter applied strictly once at module scope.
// This module does not know or expose drafts or unreviewed content.
const PUBLISHED_PHRASES: readonly RomanianPhrase[] = Object.freeze(
  ALL_ROMANIAN_PHRASES.filter(p => p.status === 'published')
);

// Pre-index by category
const PHRASES_BY_CATEGORY: Readonly<Record<RomanianCategory, readonly RomanianPhrase[]>> = (() => {
  const map = {} as Record<RomanianCategory, RomanianPhrase[]>;
  for (const catKey of Object.keys(ROMANIAN_CATEGORIES) as RomanianCategory[]) {
    map[catKey] = [];
  }
  for (const phrase of PUBLISHED_PHRASES) {
    if (map[phrase.category]) {
      map[phrase.category].push(phrase);
    }
  }
  const frozenMap = {} as Record<RomanianCategory, readonly RomanianPhrase[]>;
  for (const catKey of Object.keys(ROMANIAN_CATEGORIES) as RomanianCategory[]) {
    frozenMap[catKey] = Object.freeze(map[catKey]);
  }
  return Object.freeze(frozenMap);
})();

// Precompute category counts
const CATEGORY_COUNTS: Readonly<Record<RomanianCategory, number>> = (() => {
  const counts = {} as Record<RomanianCategory, number>;
  for (const catKey of Object.keys(ROMANIAN_CATEGORIES) as RomanianCategory[]) {
    counts[catKey] = PHRASES_BY_CATEGORY[catKey]?.length || 0;
  }
  return Object.freeze(counts);
})();

/**
 * Returns all published phrases.
 * Immutable; guaranteed 0 non-published phrases.
 */
export function getPublishedPhrases(): RomanianPhrase[] {
  return [...PUBLISHED_PHRASES];
}

/**
 * Returns published phrases for a given category.
 * Guaranteed 0 non-published phrases.
 */
export function getPhrasesByCategory(c: RomanianCategory): RomanianPhrase[] {
  return [...(PHRASES_BY_CATEGORY[c] || [])];
}

/**
 * Returns counts of published phrases across all 13 categories.
 */
export function getCategoryCounts(): Record<RomanianCategory, number> {
  return { ...CATEGORY_COUNTS };
}
