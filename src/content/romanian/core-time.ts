import { RomanianWord } from '@/lib/romanian/types';

/**
 * ماژول زمان و تقویم رومانیایی (dre-p164)
 * ایستگاه ۴ از حوزه‌ی هسته (core-time)
 *
 * شامل ۴۴ مدخل در ۴ گروه:
 * - گروه ۱ (۷ مدخل): روزهای هفته (همه با حروف کوچک، مفرد و جمع طبق منبع معتبر DOOM 3 / DOR)
 * - گروه ۲ (۱۲ مدخل): ماه‌ها (همه با حروف کوچک، substantiv masculin invar.)
 * - گروه ۳ (۷ مدخل): ساعت و اجزای بیان زمان
 * - گروه ۴ (۱۸ مدخل): زمان نسبی، دوره‌ها، بخش‌های روز و صفت‌های زمانی
 *
 * تمامی اقلام با status: 'published'، reviewer: 'ai-only'، stationId: 'core-time'،
 * domains: ['core'] و منبع واقعی بدون فاصله یا %20 ثبت شده‌اند.
 */

export const CORE_TIME: RomanianWord[] = [
  // ==========================================================================
  // گروه ۱: روزهای هفته (۷ مدخل)
  // ==========================================================================
  {
    id: 'w-time-luni',
    lemma: 'luni',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'lunea',
    plural: 'luni',
    translations: {
      en: 'Monday',
      fa: 'دوشنبه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DOOM 3 / DOR)',
      url: 'https://dexonline.ro/definitie/luni',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'نام روزهای هفته در زبان رومانیایی با حروف کوچک نوشته می‌شود (' },
        { ref: 'w-time-luni', display: 'luni' },
        { t: '، نه ' },
        { ref: 'w-time-luni', display: 'Luni' },
        { t: '). واژه‌ی «' },
        { ref: 'w-time-luni', display: 'luni' },
        { t: '» هم به معنای «دوشنبه» است و هم صورت جمع «' },
        { ref: 'w-time-luna', display: 'lună' },
        { t: '» (ماه‌ها). صورت معرفه‌ی آن «' },
        { ref: 'w-time-luni', display: 'lunea' },
        { t: '» است و برای بیان عادت یا برنامه‌ی کاری هفتگی به کار می‌رود («دوشنبه‌ها»).' },
      ],
      en: [
        { t: 'Days of the week in Romanian are written in lowercase (' },
        { ref: 'w-time-luni', display: 'luni' },
        { t: ', not ' },
        { ref: 'w-time-luni', display: 'Luni' },
        { t: '). The word ' },
      ],
    },
  },
  {
    id: 'w-time-marti',
    lemma: 'marți',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'marțea',
    plural: 'marți',
    translations: {
      en: 'Tuesday',
      fa: 'سه‌شنبه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DOOM 3 / DOR)',
      url: 'https://dexonline.ro/definitie/mar%C8%9Bi',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود. صورت معرفه‌ی آن «' },
        { ref: 'w-time-marti', display: 'marțea' },
        { t: '» به معنای «سه‌شنبه‌ها» (به طور مرتب) است. توجه کنید که این واژه با «' },
        { ref: 'w-time-martie', display: 'martie' },
        { t: '» (ماه مارس) که یک حرف بیشتر دارد اشتباه نشود.' },
      ],
      en: [
        { t: 'Written in lowercase. The definite form ' },
      ],
    },
  },
  {
    id: 'w-time-miercuri',
    lemma: 'miercuri',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'miercurea',
    plural: 'miercuri',
    translations: {
      en: 'Wednesday',
      fa: 'چهارشنبه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DOOM 3 / DOR)',
      url: 'https://dexonline.ro/definitie/miercuri',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود. صورت معرفه‌ی آن «' },
        { ref: 'w-time-miercuri', display: 'miercurea' },
        { t: '» بیانگر استمرار هفتگی («چهارشنبه‌ها») است.' },
      ],
      en: [
        { t: 'Written in lowercase. The definite form ' },
      ],
    },
  },
  {
    id: 'w-time-joi',
    lemma: 'joi',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'joia',
    plural: 'joi',
    translations: {
      en: 'Thursday',
      fa: 'پنج‌شنبه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DOOM 3 / DOR)',
      url: 'https://dexonline.ro/definitie/joi',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود. صورت معرفه‌ی آن «' },
        { ref: 'w-time-joi', display: 'joia' },
        { t: '» به معنای «پنج‌شنبه‌ها» است.' },
      ],
      en: [
        { t: 'Written in lowercase. The definite form ' },
      ],
    },
  },
  {
    id: 'w-time-vineri',
    lemma: 'vineri',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'vinerea',
    plural: 'vineri',
    translations: {
      en: 'Friday',
      fa: 'جمعه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DOOM 3 / DOR)',
      url: 'https://dexonline.ro/definitie/vineri',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود. صورت معرفه‌ی آن «' },
        { ref: 'w-time-vineri', display: 'vinerea' },
        { t: '» به معنای «جمعه‌ها» به کار می‌رود.' },
      ],
      en: [
        { t: 'Written in lowercase. The definite form ' },
      ],
    },
  },
  {
    id: 'w-time-sambata',
    lemma: 'sâmbătă',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'sâmbăta',
    plural: 'sâmbete',
    translations: {
      en: 'Saturday',
      fa: 'شنبه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DOOM 3 / DOR)',
      url: 'https://dexonline.ro/definitie/s%C3%A2mb%C4%83t%C4%83',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'بر خلاف پنج روز نخست هفته که صورت جمع هم‌شکل با مفرد دارند، واژه‌ی «' },
        { ref: 'w-time-sambata', display: 'sâmbătă' },
        { t: '» دارای صورت جمع متمایز «' },
        { ref: 'w-time-sambata', display: 'sâmbete' },
        { t: '» است. صورت معرفه‌ی مفرد آن «' },
        { ref: 'w-time-sambata', display: 'sâmbăta' },
        { t: '» به معنای «شنبه‌ها» است.' },
      ],
      en: [
        { t: 'Unlike the first five days of the week which have identical plural forms, ' },
      ],
    },
  },
  {
    id: 'w-time-duminica',
    lemma: 'duminică',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'duminica',
    plural: 'duminici',
    translations: {
      en: 'Sunday',
      fa: 'یکشنبه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DOOM 3 / DOR)',
      url: 'https://dexonline.ro/definitie/duminic%C4%83',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'دارای صورت جمع متمایز «' },
        { ref: 'w-time-duminica', display: 'duminici' },
        { t: '» است. صورت معرفه‌ی آن «' },
        { ref: 'w-time-duminica', display: 'duminica' },
        { t: '» به معنای «یکشنبه‌ها» استفاده می‌شود.' },
      ],
      en: [
        { t: 'Features the distinct plural form ' },
      ],
    },
  },

  // ==========================================================================
  // گروه ۲: ماه‌ها (۱۲ مدخل)
  // ==========================================================================
  {
    id: 'w-time-ianuarie',
    lemma: 'ianuarie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/ianuarie/paradigma',
    },
    translations: {
      en: 'January',
      fa: 'ژانویه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/ianuarie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'نام ماه‌ها در رومانیایی با حرف کوچک نوشته می‌شود. اسم مذکر بدون صرف است.' },
      ],
      en: [
        { t: 'Month names in Romanian are written in lowercase. It is an invariable masculine noun.' },
      ],
    },
  },
  {
    id: 'w-time-februarie',
    lemma: 'februarie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/februarie/paradigma',
    },
    translations: {
      en: 'February',
      fa: 'فوریه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/februarie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود.' },
      ],
      en: [
        { t: 'Written in lowercase.' },
      ],
    },
  },
  {
    id: 'w-time-martie',
    lemma: 'martie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/martie/paradigma',
    },
    translations: {
      en: 'March',
      fa: 'مارس',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/martie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قاعده‌ی تاریخ: برای روز اول ماه از عدد ترتیبی استفاده می‌شود («' },
        { ref: 'w-num-intai', display: 'întâi' },
        { t: ' ' },
        { ref: 'w-time-martie', display: 'martie' },
        { t: '»)، اما برای روزهای دیگر از عدد اصلی استفاده می‌شود («' },
        { ref: 'w-num-doi', display: 'doi' },
        { t: ' ' },
        { ref: 'w-time-martie', display: 'martie' },
        { t: '»، نه «' },
        { ref: 'w-num-al-doilea', display: 'al doilea' },
        { t: '»). توجه: با «' },
        { ref: 'w-time-marti', display: 'marți' },
        { t: '» (سه‌شنبه) اشتباه نشود.' },
      ],
      en: [
        { t: 'Date rule: The first day of the month uses an ordinal numeral (' },
      ],
    },
  },
  {
    id: 'w-time-aprilie',
    lemma: 'aprilie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/aprilie/paradigma',
    },
    translations: {
      en: 'April',
      fa: 'آوریل',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/aprilie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود.' },
      ],
      en: [
        { t: 'Written in lowercase.' },
      ],
    },
  },
  {
    id: 'w-time-mai',
    lemma: 'mai',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/mai/paradigma',
    },
    translations: {
      en: 'May',
      fa: 'مه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/mai',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'واژه‌ی «' },
        { ref: 'w-time-mai', display: 'mai' },
        { t: '» دارای سه کاربرد کاملاً متمایز است: ۱) اسم ماه پنجم سال (ماه مه؛ همین مدخل)، ۲) قید احوال‌پرسی و تفضیلی، که مدخل جداگانه‌ای دارد، ۳) جزء صرفی.' },
      ],
      en: [
        { t: 'The word ' },
      ],
    },
  },
  {
    id: 'w-time-iunie',
    lemma: 'iunie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/iunie/paradigma',
    },
    translations: {
      en: 'June',
      fa: 'ژوئن',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/iunie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود.' },
      ],
      en: [
        { t: 'Written in lowercase.' },
      ],
    },
  },
  {
    id: 'w-time-iulie',
    lemma: 'iulie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/iulie/paradigma',
    },
    translations: {
      en: 'July',
      fa: 'ژوئیه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/iulie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود.' },
      ],
      en: [
        { t: 'Written in lowercase.' },
      ],
    },
  },
  {
    id: 'w-time-august',
    lemma: 'august',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/august/paradigma',
    },
    translations: {
      en: 'August',
      fa: 'اوت',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/august',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'این مدخل نشان‌دهنده‌ی ماه هشتم سال (اوت) است. همنگاشت آن صفت «' },
        { ref: 'w-time-august', display: 'august' },
        { t: '» به معنای «باشکوه/والامقام» و لقب امپراتوران روم است.' },
      ],
      en: [
        { t: 'This entry represents the eighth month of the year (August). Its homograph is the adjective ' },
      ],
    },
  },
  {
    id: 'w-time-septembrie',
    lemma: 'septembrie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/septembrie/paradigma',
    },
    translations: {
      en: 'September',
      fa: 'سپتامبر',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/septembrie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود.' },
      ],
      en: [
        { t: 'Written in lowercase.' },
      ],
    },
  },
  {
    id: 'w-time-octombrie',
    lemma: 'octombrie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/octombrie/paradigma',
    },
    translations: {
      en: 'October',
      fa: 'اکتبر',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/octombrie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود.' },
      ],
      en: [
        { t: 'Written in lowercase.' },
      ],
    },
  },
  {
    id: 'w-time-noiembrie',
    lemma: 'noiembrie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/noiembrie/paradigma',
    },
    translations: {
      en: 'November',
      fa: 'نوامبر',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/noiembrie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود.' },
      ],
      en: [
        { t: 'Written in lowercase.' },
      ],
    },
  },
  {
    id: 'w-time-decembrie',
    lemma: 'decembrie',
    pos: 'noun',
    gender: 'm',
    invariable: {
      reason: 'اسم مذکر نامتصرف؛ نام ماه حرف تعریف پی‌بستی نمی‌گیرد.',
      source: 'https://dexonline.ro/definitie/decembrie/paradigma',
    },
    translations: {
      en: 'December',
      fa: 'دسامبر',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'comprehend',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/decembrie',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'با حرف کوچک نوشته می‌شود.' },
      ],
      en: [
        { t: 'Written in lowercase.' },
      ],
    },
  },

  // ==========================================================================
  // گروه ۳: ساعت و اجزای بیان زمان (۷ مدخل)
  // ==========================================================================
  {
    id: 'w-time-ora',
    lemma: 'oră',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'ora',
    plural: 'ore',
    translations: {
      en: 'hour / time (clock)',
      fa: 'ساعت (واحد زمان)',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/or%C4%83',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قاعده‌ی بیان زمان و ساعت: ۱) برای ساعت ۱، صورت پایه استفاده می‌شود: «' },
        { ref: 'w-time-ora', display: 'ora' },
        { t: ' ' },
        { ref: 'w-num-unu', display: 'unu' },
        { t: '» (نه «' },
        { ref: 'w-num-una', display: 'una' },
        { t: '»؛ زیرا به عنوان شماره و برچسب به کار می‌رود). ۲) برای ساعت‌های ۲ و ۱۲ از صورت مؤنث عدد استفاده می‌شود: «' },
        { ref: 'w-time-ora', display: 'ora' },
        { t: ' ' },
        { ref: 'w-num-doua', display: 'două' },
        { t: '» و «' },
        { ref: 'w-time-ora', display: 'ora' },
        { t: ' ' },
        { ref: 'w-num-douasprezece', display: 'douăsprezece' },
        { t: '». ۳) برای گذشت زمان از «' },
        { fn: 'și' },
        { t: '» («' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { fn: 'și' },
        { t: ' ' },
        { ref: 'w-num-zece', display: 'zece' },
        { t: '»، «' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { fn: 'și' },
        { t: ' ' },
        { ref: 'w-time-jumatate', display: 'jumătate' },
        { t: '»، «' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { fn: 'și' },
        { t: ' ' },
        { fn: 'un' },
        { t: ' ' },
        { ref: 'w-time-sfert', display: 'sfert' },
        { t: '») و برای مانده تا ساعت بعدی از «' },
        { ref: 'w-time-fara', display: 'fără' },
        { t: '» («' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { ref: 'w-time-fara', display: 'fără' },
        { t: ' ' },
        { ref: 'w-num-zece', display: 'zece' },
        { t: '»، «' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { ref: 'w-time-fara', display: 'fără' },
        { t: ' ' },
        { fn: 'un' },
        { t: ' ' },
        { ref: 'w-time-sfert', display: 'sfert' },
        { t: '») استفاده می‌شود. ۴) جمله‌ی رایج پرسیدن ساعت: «' },
        { fn: 'La' },
        { t: ' ' },
        { ref: 'w-core-ce', display: 'ce' },
        { t: ' ' },
        { ref: 'w-time-ora', display: 'oră' },
        { t: '?» (در چه ساعتی؟) و پاسخ: «' },
        { fn: 'La' },
        { t: ' ' },
        { ref: 'w-time-ora', display: 'ora' },
        { t: ' ' },
        { ref: 'w-num-doua', display: 'două' },
        { t: '.» (در ساعت ۲).' },
      ],
      en: [
        { t: 'Telling time rules: 1) Hour 1 uses the base cardinal: ' },
      ],
    },
  },
  {
    id: 'w-time-minut',
    lemma: 'minut',
    pos: 'noun',
    gender: 'n',
    definiteForm: 'minutul',
    plural: 'minute',
    translations: {
      en: 'minute',
      fa: 'دقیقه',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/minut',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'اسم خنثی؛ جمع آن «' },
        { ref: 'w-time-minut', display: 'minute' },
        { t: '» است.' },
      ],
      en: [
        { t: 'Neuter noun; its plural is ' },
      ],
    },
  },
  {
    id: 'w-time-ceas',
    lemma: 'ceas',
    pos: 'noun',
    gender: 'n',
    definiteForm: 'ceasul',
    plural: 'ceasuri',
    translations: {
      en: 'clock / watch',
      fa: 'ساعت (دستگاه)',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/ceas',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'برای دستگاه ساعت فیزیکی (مچی یا دیواری) به کار می‌رود؛ بر خلاف «' },
        { ref: 'w-time-ora', display: 'oră' },
        { t: '» که واحد سنجش زمان است.' },
      ],
      en: [
        { t: 'Refers to the physical clock or watch device, in contrast to ' },
      ],
    },
  },
  {
    id: 'w-time-jumatate',
    lemma: 'jumătate',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'jumătatea',
    plural: 'jumătăți',
    translations: {
      en: 'half',
      fa: 'نیم',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/jum%C4%83tate',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'در بیان ساعت همراه با «' },
        { fn: 'și' },
        { t: '» می‌آید: «' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { fn: 'și' },
        { t: ' ' },
        { ref: 'w-time-jumatate', display: 'jumătate' },
        { t: '» (ساعت دو و نیم).' },
      ],
      en: [
        { t: 'Used with ' },
      ],
    },
  },
  {
    id: 'w-time-sfert',
    lemma: 'sfert',
    pos: 'noun',
    gender: 'n',
    definiteForm: 'sfertul',
    plural: 'sferturi',
    translations: {
      en: 'quarter',
      fa: 'ربع',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/sfert',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'در بیان ساعت با حرف تعریف نامعین می‌آید: «' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { fn: 'și' },
        { t: ' ' },
        { fn: 'un' },
        { t: ' ' },
        { ref: 'w-time-sfert', display: 'sfert' },
        { t: '» (دو و ربع) و «' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { ref: 'w-time-fara', display: 'fără' },
        { t: ' ' },
        { fn: 'un' },
        { t: ' ' },
        { ref: 'w-time-sfert', display: 'sfert' },
        { t: '» (یک ربع مانده به دو).' },
      ],
      en: [
        { t: 'Used with the indefinite article in clock times: ' },
      ],
    },
  },
  {
    id: 'w-time-fara',
    lemma: 'fără',
    pos: 'prep',
    translations: {
      en: 'minus / without',
      fa: 'بدون / مانده به (در ساعت)',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/f%C4%83r%C4%83',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'حرف اضافه برای بیان مانده به ساعت بعدی: «' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { ref: 'w-time-fara', display: 'fără' },
        { t: ' ' },
        { ref: 'w-num-zece', display: 'zece' },
        { t: '» (ده دقیقه به دو) و «' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { ref: 'w-time-fara', display: 'fără' },
        { t: ' ' },
        { fn: 'un' },
        { t: ' ' },
        { ref: 'w-time-sfert', display: 'sfert' },
        { t: '» (یک ربع به دو).' },
      ],
      en: [
        { t: 'Preposition indicating minutes to the next hour: ' },
      ],
    },
  },
  {
    id: 'w-time-fix',
    lemma: 'fix',
    pos: 'adv',
    translations: {
      en: 'sharp / on the dot',
      fa: 'دقیقاً / سرِ ساعت',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/fix',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'به عنوان قید برای نشان دادن ساعت دقیق به کار می‌رود: «' },
        { ref: 'w-time-ora', display: 'ora' },
        { t: ' ' },
        { ref: 'w-num-doua', display: 'două' },
        { t: ' ' },
        { ref: 'w-time-fix', display: 'fix' },
        { t: '» (ساعت دو دقیقاً).' },
      ],
      en: [
        { t: 'Used adverbially to designate exact time: ' },
      ],
    },
  },

  // ==========================================================================
  // گروه ۴: زمان نسبی، دوره‌ها، بخش‌های روز و صفت‌ها (۱۸ مدخل)
  // ==========================================================================
  // --- قیدها (۸ مدخل) ---
  {
    id: 'w-time-azi',
    lemma: 'azi',
    pos: 'adv',
    translations: {
      en: 'today (= astăzi)',
      fa: 'امروز',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/azi',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قید زمان به معنای امروز؛ هم‌معنی کوتاه‌تر «' },
        { ref: 'w-time-astazi', display: 'astăzi' },
        { t: '».' },
      ],
      en: [
        { t: 'Adverb of time meaning today; shorter equivalent of ' },
      ],
    },
  },
  {
    id: 'w-time-astazi',
    lemma: 'astăzi',
    pos: 'adv',
    translations: {
      en: 'today (= azi)',
      fa: 'امروز',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/ast%C4%83zi',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قید زمان به معنای امروز؛ مترادف «' },
        { ref: 'w-time-azi', display: 'azi' },
        { t: '».' },
      ],
      en: [
        { t: 'Adverb of time meaning today; synonym of ' },
      ],
    },
  },
  {
    id: 'w-time-maine',
    lemma: 'mâine',
    pos: 'adv',
    translations: {
      en: 'tomorrow',
      fa: 'فردا',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/m%C3%A2ine',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قید زمان به معنای روز بعد.' },
      ],
      en: [
        { t: 'Adverb of time meaning tomorrow.' },
      ],
    },
  },
  {
    id: 'w-time-poimaine',
    lemma: 'poimâine',
    pos: 'adv',
    translations: {
      en: 'the day after tomorrow',
      fa: 'پس‌فردا',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/poim%C3%A2ine',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قید زمان به معنای روز بعد از فردا.' },
      ],
      en: [
        { t: 'Adverb of time meaning the day after tomorrow.' },
      ],
    },
  },
  {
    id: 'w-time-ieri',
    lemma: 'ieri',
    pos: 'adv',
    translations: {
      en: 'yesterday',
      fa: 'دیروز',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/ieri',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قید زمان به معنای روز گذشته.' },
      ],
      en: [
        { t: 'Adverb of time meaning yesterday.' },
      ],
    },
  },
  {
    id: 'w-time-acum',
    lemma: 'acum',
    pos: 'adv',
    translations: {
      en: 'now',
      fa: 'اکنون / حالا',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/acum',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قید زمان برای زمان حال و زمان حاضر.' },
      ],
      en: [
        { t: 'Adverb of time indicating the present moment.' },
      ],
    },
  },
  {
    id: 'w-time-devreme',
    lemma: 'devreme',
    pos: 'adv',
    translations: {
      en: 'early',
      fa: 'زود',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/devreme',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قید به معنای در وقت اولیه یا پیش از موعد مقرر.' },
      ],
      en: [
        { t: 'Adverb meaning early or ahead of schedule.' },
      ],
    },
  },
  {
    id: 'w-time-tarziu',
    lemma: 'târziu',
    pos: 'adv',
    translations: {
      en: 'late',
      fa: 'دیر',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/t%C3%A2rziu',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'قید به معنای پس از موعد یا دیر وقت.' },
      ],
      en: [
        { t: 'Adverb meaning late or after the expected time.' },
      ],
    },
  },

  // --- اسم‌های دوره (۴ مدخل) ---
  {
    id: 'w-time-zi',
    lemma: 'zi',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'ziua',
    plural: 'zile',
    translations: {
      en: 'day',
      fa: 'روز',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/zi',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'اسم مؤنث؛ صورت معرفه‌ی آن «' },
        { ref: 'w-time-zi', display: 'ziua' },
        { t: '» و جمع آن «' },
        { ref: 'w-time-zi', display: 'zile' },
        { t: '» است.' },
      ],
      en: [
        { t: 'Feminine noun; definite form is ' },
      ],
    },
  },
  {
    id: 'w-time-saptamana',
    lemma: 'săptămână',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'săptămâna',
    plural: 'săptămâni',
    translations: {
      en: 'week',
      fa: 'هفته',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/s%C4%83pt%C4%83m%C3%A2n%C4%83',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'اسم مؤنث؛ صورت معرفه «' },
        { ref: 'w-time-saptamana', display: 'săptămâna' },
        { t: '» و جمع آن «' },
        { ref: 'w-time-saptamana', display: 'săptămâni' },
        { t: '» است.' },
      ],
      en: [
        { t: 'Feminine noun; definite form is ' },
      ],
    },
  },
  {
    id: 'w-time-luna',
    lemma: 'lună',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'luna',
    plural: 'luni',
    translations: {
      en: 'month / moon',
      fa: 'ماه (تقویمی و آسمان)',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/lun%C4%83',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'واژه‌ی «' },
        { ref: 'w-time-luna', display: 'lună' },
        { t: '» همنگاشت است و دارای دو معنای بنیادین است: ۱) ماه تقویمی (دوازدهمین بخش از سال)، ۲) کره‌ی ماه در آسمان. صورت جمع آن «' },
        { ref: 'w-time-luna', display: 'luni' },
        { t: '» با نام روز دوشنبه هم‌شکل است.' },
      ],
      en: [
        { t: 'The word ' },
      ],
    },
  },
  {
    id: 'w-time-an',
    lemma: 'an',
    pos: 'noun',
    gender: 'm',
    definiteForm: 'anul',
    plural: 'ani',
    translations: {
      en: 'year',
      fa: 'سال',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/an',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'اسم مذکر؛ صورت معرفه «' },
        { ref: 'w-time-an', display: 'anul' },
        { t: '» و جمع آن «' },
        { ref: 'w-time-an', display: 'ani' },
        { t: '» است.' },
      ],
      en: [
        { t: 'Masculine noun; definite form is ' },
      ],
    },
  },

  // --- بخش‌های روز (۴ مدخل) ---
  {
    id: 'w-time-dimineata',
    lemma: 'dimineață',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'dimineața',
    plural: 'dimineți',
    translations: {
      en: 'morning',
      fa: 'صبح',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/diminea%C8%9B%C4%83',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'صورت معرفه‌ی آن «' },
        { ref: 'w-time-dimineata', display: 'dimineața' },
        { t: '» علاوه بر «صبح»، به صورت قیدی به معنای «صبح‌ها / هر روز صبح» به کار می‌رود.' },
      ],
      en: [
        { t: 'The definite form ' },
      ],
    },
  },
  {
    id: 'w-time-dupa-amiaza',
    lemma: 'după-amiază',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'după-amiaza',
    plural: 'după-amiezi',
    translations: {
      en: 'afternoon',
      fa: 'بعدازظهر',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/dup%C4%83-amiaz%C4%83',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'واژه‌ی مرکب استاندارد با خط‌تیره‌ی میانی. صورت معرفه‌ی آن «' },
        { ref: 'w-time-dupa-amiaza', display: 'după-amiaza' },
        { t: '» است.' },
      ],
      en: [
        { t: 'Standard compound noun with an internal hyphen. Its definite form is ' },
      ],
    },
  },
  {
    id: 'w-time-seara',
    lemma: 'seară',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'seara',
    plural: 'seri',
    translations: {
      en: 'evening',
      fa: 'عصر / غروب',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/sear%C4%83',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'صورت معرفه‌ی آن «' },
        { ref: 'w-time-seara', display: 'seara' },
        { t: '» به صورت قیدی به معنای «شب‌ها / عصرها (به‌طور مرتب)» نیز به کار می‌رود.' },
      ],
      en: [
        { t: 'The definite form ' },
      ],
    },
  },
  {
    id: 'w-time-noapte',
    lemma: 'noapte',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'noaptea',
    plural: 'nopți',
    translations: {
      en: 'night',
      fa: 'شب',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/noapte',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'صورت معرفه‌ی آن «' },
        { ref: 'w-time-noapte', display: 'noaptea' },
        { t: '» به صورت قیدی به معنای «شب‌ها / در طول شب» کاربرد دارد.' },
      ],
      en: [
        { t: 'The definite form ' },
      ],
    },
  },

  // --- صفت‌ها (۲ مدخل) ---
  {
    id: 'w-time-viitor',
    lemma: 'viitor',
    pos: 'adj',
    translations: {
      en: 'next / future',
      fa: 'آینده / بعدی',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/viitor',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'صفت برای اشاره به دوره‌ی بعدی؛ مانند هفته‌ی بعد یا سال بعد.' },
      ],
      en: [
        { t: 'Adjective used to refer to subsequent time periods, e.g. next week or next year.' },
      ],
    },
  },
  {
    id: 'w-time-trecut',
    lemma: 'trecut',
    pos: 'adj',
    translations: {
      en: 'past / last',
      fa: 'گذشته / قبلی',
    },
    domains: ['core'],
    stationId: 'core-time',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'dexonline (DEX / DOOM)',
      url: 'https://dexonline.ro/definitie/trecut',
      retrievedAt: '2026-09-24',
    },
    reviewer: 'ai-only',
    status: 'published',
    usageNote: {
      fa: [
        { t: 'صفت برای اشاره به دوره‌ی زمانی سپری‌شده؛ مانند هفته‌ی گذشته.' },
      ],
      en: [
        { t: 'Adjective used to refer to past time periods, e.g. last week.' },
      ],
    },
  },
];
