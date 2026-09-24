import {
  DomainMeta,
  RomanianDialogue,
  RomanianGrapheme,
  RomanianPhrase,
  RomanianVerb,
  RomanianWord,
} from '@/lib/romanian/types';

import {
  SEED_DOMAINS,
  SEED_WORDS,
  SEED_VERBS,
  SEED_GRAPHEMES,
  SEED_DIALOGUES,
} from './seed';
import { FOUNDATION_WORDS, FOUNDATION_GRAPHEMES } from './foundation';
import { CORE_VERBS } from './core-verbs';
import { CORE_PRONOUNS } from './core-pronouns';
import { CORE_QUESTION_WORDS } from './core-question-words';
import { CORE_NUMBERS } from './core-numbers';
import { PILOT_PHRASES } from './pilot';
import { STAGE0_PHRASES } from './stage0';

export const ALL_WORDS: RomanianWord[] = [
  ...SEED_WORDS,
  ...FOUNDATION_WORDS,
  ...CORE_PRONOUNS,
  ...CORE_QUESTION_WORDS,
  ...CORE_NUMBERS,
];
export const ALL_VERBS: RomanianVerb[] = [...SEED_VERBS, ...CORE_VERBS];
export const ALL_GRAPHEMES: RomanianGrapheme[] = [...SEED_GRAPHEMES, ...FOUNDATION_GRAPHEMES];
export const ALL_PHRASES: RomanianPhrase[] = [...PILOT_PHRASES, ...STAGE0_PHRASES];
export const ALL_DIALOGUES: RomanianDialogue[] = [...SEED_DIALOGUES];
export const ALL_DOMAINS: DomainMeta[] = [...SEED_DOMAINS];
