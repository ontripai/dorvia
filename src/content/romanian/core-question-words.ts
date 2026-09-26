import { RomanianWord } from '@/lib/romanian/types';

/**
 * کلمات پرسشی هسته‌ی رومانیایی (dre-p162)
 * استخراج قطعی از dexonline (ایستگاه ۲ حوزه‌ی core)
 *
 * گروه ۱ — بدون صرف (invariable):
 *   ce (pronoun) · unde (adv) · când (adv) · cum (adv)
 *
 * گروه ۲ — خانواده‌ی cât (چهار صورت صرفی P37):
 *   cât · câtă · câți · câte
 *
 * گروه ۳ — فقط نومیناتیو:
 *   cine (pronoun) · care (pronoun)
 *
 * استثنا — ترکیب دوواژه‌ای:
 *   de ce (expression — زیرمدخل ce در dexonline)
 *
 * تمامی اقلام با status: 'published' و stationId: 'core-question-words' ثبت شده‌اند.
 */

export const CORE_QUESTION_WORDS: RomanianWord[] = [
  // --- گروه ۱: بدون صرف ---
  {
    id: 'w-core-ce',
    lemma: 'ce',
    pos: 'pronoun',
    translations: {
      en: 'what',
      fa: 'چه، چی',
    },
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (I13)',
      url: 'https://dexonline.ro/definitie/ce/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  // 'unde' لمای مشترک با foundation است و در w-unde زندگی می‌کند
  // (ایستگاه core-question-words روی همان مدخل ثبت شده). dre-p166
  {
    id: 'w-core-cand',
    lemma: 'când',
    pos: 'adv',
    translations: {
      en: 'when',
      fa: 'کِی، چه وقت',
    },
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (I8)',
      url: 'https://dexonline.ro/definitie/c%C3%A2nd/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-cum',
    lemma: 'cum',
    pos: 'adv',
    translations: {
      en: 'how',
      fa: 'چطور، چگونه',
    },
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (I8)',
      url: 'https://dexonline.ro/definitie/cum/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },

  // --- گروه ۲: خانواده‌ی cât (چهار صورت متمایز از جدول دو ستونی P37) ---
  {
    id: 'w-core-cat',
    lemma: 'cât',
    pos: 'pronoun',
    translations: {
      en: 'how much (masculine/neuter singular)',
      fa: 'چقدر، چند (مذکر/خنثی مفرد)',
    },
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P37)',
      url: 'https://dexonline.ro/definitie/c%C3%A2t/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قالب کلیدی روزمره: «' },
        { ref: 'shopping-001', display: 'Cât costă' },
        { t: ' …?» به‌معنای «… چقدر است؟ / قیمتش چنده؟». واژه‌ی «' },
        { ref: 'w-core-cat', display: 'cât' },
        { t: '» با اسم پس از خود مطابقت جنسی و شماری پیدا می‌کند: «' },
        { ref: 'shopping-001', display: 'Cât costă' },
        { t: '?» (قیمت، بدون اسم)، «' },
        { ref: 'w-core-cata', display: 'Câtă' },
        { t: ' ' },
        { ref: 'w-apa', display: 'apă' },
        { t: '?» (مؤنث مفرد)، «' },
        { ref: 'w-core-cati', display: 'Câți' },
        { t: ' ' },
        { ref: 'w-ban', display: 'bani' },
        { t: '?» (مذکر جمع).' },
      ],
      en: [
        { t: 'Key everyday pattern: ' },
      ],
    },
  },
  {
    id: 'w-core-cata',
    lemma: 'câtă',
    pos: 'pronoun',
    translations: {
      en: 'how much (feminine singular)',
      fa: 'چقدر، چند (مؤنث مفرد)',
    },
    formOf: 'w-core-cat',
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P37)',
      url: 'https://dexonline.ro/definitie/c%C3%A2t/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-cati',
    lemma: 'câți',
    pos: 'pronoun',
    translations: {
      en: 'how many (masculine plural)',
      fa: 'چندتا، چند (مذکر جمع)',
    },
    formOf: 'w-core-cat',
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P37)',
      url: 'https://dexonline.ro/definitie/c%C3%A2t/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-cate',
    lemma: 'câte',
    pos: 'pronoun',
    translations: {
      en: 'how many (feminine plural)',
      fa: 'چندتا، چند (مؤنث جمع)',
    },
    formOf: 'w-core-cat',
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P37)',
      url: 'https://dexonline.ro/definitie/c%C3%A2t/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },

  // --- گروه ۳: فقط نومیناتیو ---
  {
    id: 'w-core-cine',
    lemma: 'cine',
    pos: 'pronoun',
    translations: {
      en: 'who',
      fa: 'چه کسی، کی',
    },
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P35)',
      url: 'https://dexonline.ro/definitie/cine/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-care',
    lemma: 'care',
    pos: 'pronoun',
    translations: {
      en: 'which',
      fa: 'کدام، کدوم',
    },
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P27)',
      url: 'https://dexonline.ro/definitie/care/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },

  // --- ترکیب استثنایی: de ce ---
  {
    id: 'w-core-de-ce',
    lemma: 'de ce',
    pos: 'expression',
    translations: {
      en: 'why',
      fa: 'چرا',
    },
    domains: ['core'],
    stationId: 'core-question-words',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — definitie ce (DEX \'09)',
      url: 'https://dexonline.ro/definitie/ce',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
];
