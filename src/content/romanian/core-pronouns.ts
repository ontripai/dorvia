import { RomanianWord } from '@/lib/romanian/types';

/**
 * ضمایر هسته‌ی رومانیایی (dre-p161)
 * استخراج قطعی بر اساس نقش از جدول پارادایم dexonline (الحاقیه ۲)
 *
 * گروه الف — استخراج کامل پی‌بستی:
 *   eu · tu · noi · voi
 *   پی‌بستی‌ها: mă · îmi · te · îți · ne · vă
 *
 * گروه ب — فقط نومیناتیو:
 *   el · ea · ei · ele · dumneavoastră · dumneata
 *
 * گروه ج — ملکی اول‌شخص:
 *   meu · mea
 *
 * تمامی اقلام با status: 'published'، pos: 'pronoun'، stationId: 'core-pronouns'
 * و source.url صفحه‌ی پارادایم ثبت شده‌اند.
 */

export const CORE_PRONOUNS: RomanianWord[] = [
  // --- گروه الف: ضمایر فاعلی اول و دوم شخص ---
  {
    id: 'w-core-eu',
    lemma: 'eu',
    pos: 'pronoun',
    translations: {
      en: 'I',
      fa: 'من',
    },
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-1-subject',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P57)',
      url: 'https://dexonline.ro/definitie/eu/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'در زبان رومانیایی ضمایر فاعلی معمولاً حذف می‌شوند (مانند «' },
        { ref: 'v-core-a-vrea', display: 'Vreau' },
        { t: '»، نه «' },
        { ref: 'w-core-eu', display: 'Eu' },
        { t: ' ' },
        { ref: 'v-core-a-vrea', display: 'vreau' },
        { t: '»). ضمیر فقط برای تأکید یا تقابل به کار می‌رود.' },
      ],
      en: [
        { t: 'In Romanian, subject pronouns are usually omitted (e.g. ' },
      ],
    },
  },
  {
    id: 'w-core-tu',
    lemma: 'tu',
    pos: 'pronoun',
    translations: {
      en: 'you (informal)',
      fa: 'تو (غیررسمی)',
    },
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-1-subject',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P101)',
      url: 'https://dexonline.ro/definitie/tu/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-noi',
    lemma: 'noi',
    pos: 'pronoun',
    translations: {
      en: 'we',
      fa: 'ما',
    },
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-1-subject',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P57)',
      url: 'https://dexonline.ro/definitie/noi/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-voi',
    lemma: 'voi',
    pos: 'pronoun',
    translations: {
      en: 'you (plural, informal)',
      fa: 'شما (جمع، غیررسمی)',
    },
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-1-subject',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P101)',
      url: 'https://dexonline.ro/definitie/voi/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },

  // --- گروه الف (پی‌بستی‌ها): رایی و برایی اول و دوم شخص ---
  {
    id: 'w-core-ma',
    lemma: 'mă',
    pos: 'pronoun',
    translations: {
      en: 'me (direct object clitic)',
      fa: 'مرا، به من (رایی پی‌بستی)',
    },
    formOf: 'w-core-eu',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-2-clitics',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P57)',
      url: 'https://dexonline.ro/definitie/eu/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-imi',
    lemma: 'îmi',
    pos: 'pronoun',
    translations: {
      en: 'to me (indirect object clitic)',
      fa: 'به من (برایی پی‌بستی)',
    },
    formOf: 'w-core-eu',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-2-clitics',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P57)',
      url: 'https://dexonline.ro/definitie/eu/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-te',
    lemma: 'te',
    pos: 'pronoun',
    translations: {
      en: 'you (direct object clitic, informal)',
      fa: 'تو را (رایی پی‌بستی)',
    },
    formOf: 'w-core-tu',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-2-clitics',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P101)',
      url: 'https://dexonline.ro/definitie/tu/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-iti',
    lemma: 'îți',
    pos: 'pronoun',
    translations: {
      en: 'to you (indirect object clitic, informal)',
      fa: 'به تو (برایی پی‌بستی)',
    },
    formOf: 'w-core-tu',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-2-clitics',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P101)',
      url: 'https://dexonline.ro/definitie/tu/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-ne',
    lemma: 'ne',
    pos: 'pronoun',
    translations: {
      en: 'us, to us (clitic)',
      fa: 'ما را، به ما (رایی و برایی پی‌بستی)',
    },
    formOf: 'w-core-noi',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-2-clitics',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P57)',
      url: 'https://dexonline.ro/definitie/noi/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'صورت پی‌بستی «' },
        { ref: 'w-core-ne', display: 'ne' },
        { t: '» در هر دو حالت رایی (مفعول مستقیم) و برایی (مفعول غیرمستقیم) یکسان است و این یکسانی بار یادگیری را کم می‌کند.' },
      ],
      en: [
        { t: 'The clitic form ' },
      ],
    },
  },
  {
    id: 'w-core-va',
    lemma: 'vă',
    pos: 'pronoun',
    translations: {
      en: 'you, to you (plural/formal clitic)',
      fa: 'شما را، به شما (رایی و برایی پی‌بستی)',
    },
    formOf: 'w-core-voi',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-2-clitics',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P101)',
      url: 'https://dexonline.ro/definitie/voi/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'صورت پی‌بستی «' },
        { ref: 'w-core-va', display: 'vă' },
        { t: '» در هر دو حالت رایی (مفعول مستقیم) و برایی (مفعول غیرمستقیم) یکسان است و این یکسانی بار یادگیری را کم می‌کند.' },
      ],
      en: [
        { t: 'The clitic form ' },
      ],
    },
  },

  // --- گروه ب: فقط نومیناتیو (سوم‌شخص و احترامی) ---
  {
    id: 'w-core-el',
    lemma: 'el',
    pos: 'pronoun',
    translations: {
      en: 'he',
      fa: 'او (مذکر)',
    },
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-3-third',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P56)',
      url: 'https://dexonline.ro/definitie/el/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-ea',
    lemma: 'ea',
    pos: 'pronoun',
    translations: {
      en: 'she',
      fa: 'او (مؤنث)',
    },
    formOf: 'w-core-el',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-3-third',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P56)',
      url: 'https://dexonline.ro/definitie/ea/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-ei',
    lemma: 'ei',
    pos: 'pronoun',
    translations: {
      en: 'they (masculine)',
      fa: 'آن‌ها (مذکر)',
    },
    formOf: 'w-core-el',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-3-third',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P56)',
      url: 'https://dexonline.ro/definitie/ei/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-ele',
    lemma: 'ele',
    pos: 'pronoun',
    translations: {
      en: 'they (feminine)',
      fa: 'آن‌ها (مؤنث)',
    },
    formOf: 'w-core-el',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-3-third',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P56)',
      url: 'https://dexonline.ro/definitie/ele/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-dumneavoastra',
    lemma: 'dumneavoastră',
    pos: 'pronoun',
    translations: {
      en: 'you (formal)',
      fa: 'شما (رسمی)',
    },
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-3-third',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P54)',
      url: 'https://dexonline.ro/definitie/dumneavoastr%C4%83/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'واژه‌ی «' },
        { ref: 'w-core-dumneavoastra', display: 'dumneavoastră' },
        { t: '» هم برای مفرد و هم برای جمع به کار می‌رود و همواره با صیغه‌ی دوم‌شخص جمع صرف می‌شود («' },
        { ref: 'w-core-dumneavoastra', display: 'Dumneavoastră' },
        { t: ' ' },
        { ref: 'v-a-fi', display: 'sunteți' },
        { t: '»، نه «' },
        { ref: 'v-a-fi', display: 'este' },
        { t: '»). همچنین در نقش ملکی بدون تغییر می‌ماند («' },
        { ref: 'w-casa', display: 'casa' },
        { t: ' ' },
        { ref: 'w-core-dumneavoastra', display: 'dumneavoastră' },
        { t: '»).' },
      ],
    },
  },
  {
    id: 'w-core-dumneata',
    lemma: 'dumneata',
    pos: 'pronoun',
    translations: {
      en: 'you (semi-formal)',
      fa: 'شما (نیمه‌رسمی)',
    },
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-3-third',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P54)',
      url: 'https://dexonline.ro/definitie/dumneata/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },

  // --- گروه ج: ملکی اول‌شخص ---
  {
    id: 'w-core-meu',
    lemma: 'meu',
    pos: 'pronoun',
    translations: {
      en: 'my, mine (masculine/neuter)',
      fa: 'من، مال من (مذکر/خنثی مفرد)',
    },
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-4-possessive',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P73)',
      url: 'https://dexonline.ro/definitie/meu/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-core-mea',
    lemma: 'mea',
    pos: 'pronoun',
    translations: {
      en: 'my, mine (feminine)',
      fa: 'من، مال من (مؤنث مفرد)',
    },
    formOf: 'w-core-meu',
    domains: ['core'],
    stationId: 'core-pronouns',
    stepId: 'pron-4-possessive',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline — paradigma (P73)',
      url: 'https://dexonline.ro/definitie/mea/paradigma',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
];
