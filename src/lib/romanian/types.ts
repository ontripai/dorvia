export type RomanianCategory =
  | 'everyday' | 'transport' | 'shopping' | 'housing' | 'banking'
  | 'healthcare' | 'school' | 'university' | 'work' | 'business'
  | 'administration' | 'emergency' | 'social';

export type RomanianLevel = 'beginner' | 'elementary' | 'intermediate';

export type RomanianJourney = 'study' | 'work' | 'business' | 'family' | 'relocation';

/**
 * رجیستر تولید در این محصول روی رسمی قفل است.
 * formal  = صورت مؤدبانه/اداری، با dumneavoastră و صرف دوم‌شخص جمع.
 * neutral = جمله‌ای که اصلاً صورت خطاب ندارد (مثل «Am o programare.»).
 * informal= هرگز به کاربر به‌عنوان جمله‌ی پیشنهادی داده نمی‌شود. بخش ۹ را بخوان.
 */
export type RomanianRegister = 'formal' | 'neutral' | 'informal';

export type IntendedUse = 'produce' | 'comprehend';

export type PersonSet = {
  eu: string; tu: string; el: string;
  noi: string; voi: string; ei: string;
};

export type VerbSource = {
  label: string;
  url: string;          // اجباری
  retrievedAt: string;  // YYYY-MM-DD
};

export type PhraseSource = {
  kind: 'official' | 'common-usage';
  label: string;
  url?: string;
  retrievedAt?: string;   // YYYY-MM-DD
};

export type RomanianWord = {
  id: string;
  lemma: string;
  pos: 'noun' | 'verb' | 'adj' | 'adv' | 'expression';
  gender?: 'm' | 'f' | 'n';   // برای اسم اجباری — V11
  definiteForm?: string;      // برای اسم اجباری — V11
  plural?: string;
  translations: { en: string; fa: string };
  domains: string[];
  stationId?: string;
  intendedUse: IntendedUse;
  source: PhraseSource;
  reviewer?: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  usageNote?: { fa: string; en: string };
};

export type RomanianVerb = {
  id: string;
  infinitive: string;
  translations: { en: string; fa: string };
  domains: string[];
  conjugation: {
    prezent: PersonSet;              // اجباری — V10
    conjunctiv?: PersonSet;
    perfect?: PersonSet;
    viitor?: PersonSet;
  };
  participiu?: string;
  /** کدام صورت‌ها مستقیم از منبع آمده‌اند و کدام با قاعده مشتق شده‌اند */
  derivedTenses?: Array<'perfect' | 'viitor'>;
  source: VerbSource;
  reviewer?: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
};

export type RomanianGrapheme = {
  id: string;
  grapheme: string;        // 'ș' یا 'ce'
  soundHintFa: string;     // توضیح صدا — نه آوانگاری جمله
  exampleWordId: string;   // به واژه وصل می‌شود (V18)
  exampleForm?: string;    // شکل نمایشی (پیش‌فرض lemma است، برای فرم‌های جمع مثل bani از پارسر می‌آید)
  matchPattern: string;    // الگوی regex برای اعتبارسنجی حضور گرافم در شکل نمایشی (V19)
  order: number;
  status: 'draft' | 'review' | 'published' | 'archived';
};

export type RomanianDialogue = {
  id: string;
  domain: string;
  stationId?: string;
  title: { ro: string; fa: string };
  turns: Array<{
    speaker: 'counterpart' | 'user';
    phraseId: string;         // هیچ رشته‌ی رومانیایی تکرار نمی‌شود
    contextNote?: { fa: string; en: string };
  }>;
  status: 'draft' | 'review' | 'published' | 'archived';
};

export type DomainMeta = {
  id: string;
  titleFa: string; titleEn: string;
  order: number;
  estimatedWeeks: number;                          // V13
  stationOrder: 'sequential' | 'grouped';          // V13
  stations: Array<{ id: string; titleFa: string; titleRo: string; order: number }>;
  sourcingPolicy: 'common-usage-ok' | 'must-be-sourced';
  categories: RomanianCategory[];                  // این حوزه از کدام دسته‌ها تغذیه می‌کند
  maxItems?: number;                               // بودجه — بخش ۳
};

export type RomanianPhrase = {
  id: string;                    // پایدار، هرگز تغییر نمی‌کند
  slug: string;
  category: RomanianCategory;
  level: RomanianLevel;
  register: RomanianRegister;    // اجباری
  intendedUse: IntendedUse;      // اجباری — بخش ۳ را بخوان
  wordIds?: string[];
  verbIds?: string[];
  stationId?: string;
  domain?: string;
  text: { ro: string; en: string; fa: string };
  /** فقط برای درک شنیداری — هرگز به‌عنوان جمله‌ی پیشنهادی نمایش داده نشود. */
  informalVariant?: { ro: string; note?: string };
  /** نکته‌ی کاربرد — کِی و چطور این عبارت گفته می‌شود. اختیاری. */
  usageNote?: { fa: string; en: string };
  pronunciationFa?: string;      // در این فاز برای همه undefined — بخش ۵
  vocabulary?: Array<{ ro: string; en: string; fa: string }>;
  audio?: { key: string; voice: string; generatedAt: string };  // در این فاز undefined
  context?: string[];
  journeys?: RomanianJourney[];
  source: PhraseSource;          // اجباری
  reviewer?: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  lastReviewed?: string | null;
  isFree: boolean;
};

export interface RomanianCategoryMeta {
  slug: RomanianCategory;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  order: number;
}
