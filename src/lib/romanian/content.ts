import {
  ALL_WORDS,
  ALL_VERBS,
  ALL_GRAPHEMES,
  ALL_PHRASES,
  ALL_DIALOGUES,
  ALL_DOMAINS,
} from '@/content/romanian/registry';
import { assertValidContent } from './validator';
import {
  RomanianCategory,
  RomanianPhrase,
  RomanianWord,
  RomanianVerb,
  RomanianGrapheme,
  RomanianDialogue,
  DomainMeta,
} from './types';
import { ROMANIAN_CATEGORIES } from './categories';

export const ALL_ROMANIAN_PHRASES: RomanianPhrase[] = [...ALL_PHRASES];
export const ALL_ROMANIAN_WORDS: RomanianWord[] = [...ALL_WORDS];
export const ALL_ROMANIAN_VERBS: RomanianVerb[] = [...ALL_VERBS];
export const ALL_ROMANIAN_GRAPHEMES: RomanianGrapheme[] = [...ALL_GRAPHEMES];
export const ALL_ROMANIAN_DIALOGUES: RomanianDialogue[] = [...ALL_DIALOGUES];
export const ALL_ROMANIAN_DOMAINS: DomainMeta[] = [...ALL_DOMAINS];

// Strictly validate all Romanian content at module evaluation / build time.
// Any violation of V1-V23 throws an exception and halts build immediately.
assertValidContent({
  phrases: ALL_ROMANIAN_PHRASES,
  words: ALL_ROMANIAN_WORDS,
  verbs: ALL_ROMANIAN_VERBS,
  graphemes: ALL_ROMANIAN_GRAPHEMES,
  dialogues: ALL_ROMANIAN_DIALOGUES,
  domains: ALL_ROMANIAN_DOMAINS,
});

// Status filter applied strictly once at module scope.
// This module does not know or expose drafts or unreviewed content.
const PUBLISHED_PHRASES: readonly RomanianPhrase[] = Object.freeze(
  ALL_ROMANIAN_PHRASES.filter(p => p.status === 'published')
);

const PUBLISHED_WORDS: readonly RomanianWord[] = Object.freeze(
  ALL_ROMANIAN_WORDS.filter(w => w.status === 'published')
);

const PUBLISHED_VERBS: readonly RomanianVerb[] = Object.freeze(
  ALL_ROMANIAN_VERBS.filter(v => v.status === 'published')
);

const PUBLISHED_GRAPHEMES: readonly RomanianGrapheme[] = Object.freeze(
  ALL_ROMANIAN_GRAPHEMES.filter(g => g.status === 'published')
);

const PUBLISHED_DIALOGUES: readonly RomanianDialogue[] = Object.freeze(
  ALL_ROMANIAN_DIALOGUES.filter(d => d.status === 'published')
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

/**
 * Returns all published words.
 * Guaranteed 0 non-published words.
 */
export function getPublishedWords(): RomanianWord[] {
  return [...PUBLISHED_WORDS];
}

/**
 * Returns all published verbs.
 * Guaranteed 0 non-published verbs.
 */
export function getPublishedVerbs(): RomanianVerb[] {
  return [...PUBLISHED_VERBS];
}

/**
 * Returns all published graphemes.
 * Guaranteed 0 non-published graphemes.
 */
export function getPublishedGraphemes(): RomanianGrapheme[] {
  return [...PUBLISHED_GRAPHEMES];
}

/**
 * Returns all published dialogues.
 * Guaranteed 0 non-published dialogues.
 */
export function getPublishedDialogues(): RomanianDialogue[] {
  return [...PUBLISHED_DIALOGUES];
}

/**
 * Returns all registered domain metadata.
 */
export function getDomains(): DomainMeta[] {
  return [...ALL_ROMANIAN_DOMAINS];
}

/**
 * Lookup published word by id.
 */
export function getWordById(id: string): RomanianWord | undefined {
  return PUBLISHED_WORDS.find(w => w.id === id);
}

/**
 * Lookup published grapheme by slug.
 */
export function getGraphemeBySlug(slug: string): RomanianGrapheme | undefined {
  return PUBLISHED_GRAPHEMES.find(g => g.slug === slug);
}

/**
 * Lookup published verb by id.
 */
export function getVerbById(id: string): RomanianVerb | undefined {
  return PUBLISHED_VERBS.find(v => v.id === id);
}

/**
 * Lookup published grapheme by id.
 */
export function getGraphemeById(id: string): RomanianGrapheme | undefined {
  return PUBLISHED_GRAPHEMES.find(g => g.id === id);
}

export interface PublishedStationInfo {
  id: string;
  slug: string;
  titleFa: string;
  titleRo: string;
  order: number;
  wordCount: number;
  phraseCount: number;
  totalCount: number;
}

/**
 * Returns all stations across domains that contain published content.
 * Strictly dynamically calculated from published words and phrases.
 */
export function getPublishedStations(): PublishedStationInfo[] {
  const stations: PublishedStationInfo[] = [];
  for (const domain of ALL_ROMANIAN_DOMAINS) {
    for (const st of domain.stations || []) {
      if (!st.slug) continue;
      const stWords = PUBLISHED_WORDS.filter(w => w.stationId === st.id);
      const stPhrases = PUBLISHED_PHRASES.filter(p => p.stationId === st.id);
      const total = stWords.length + stPhrases.length;
      if (total > 0) {
        stations.push({
          id: st.id,
          slug: st.slug,
          titleFa: st.titleFa,
          titleRo: st.titleRo,
          order: st.order,
          wordCount: stWords.length,
          phraseCount: stPhrases.length,
          totalCount: total,
        });
      }
    }
  }
  return stations.sort((a, b) => a.order - b.order);
}

/**
 * Lookup published station by slug.
 */
export function getStationBySlug(slug: string): PublishedStationInfo | undefined {
  const stations = getPublishedStations();
  return stations.find(s => s.slug === slug);
}

/**
 * Returns published words and phrases for a given stationId.
 */
export function getStationItems(stationId: string): {
  words: RomanianWord[];
  phrases: RomanianPhrase[];
} {
  return {
    words: PUBLISHED_WORDS.filter(w => w.stationId === stationId),
    phrases: PUBLISHED_PHRASES.filter(p => p.stationId === stationId),
  };
}
