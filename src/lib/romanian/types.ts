export type RomanianCategory =
  | 'everyday' | 'transport' | 'shopping' | 'housing' | 'banking'
  | 'healthcare' | 'school' | 'university' | 'work' | 'business'
  | 'administration' | 'emergency' | 'social';

export type RomanianLevel = 'beginner' | 'elementary' | 'intermediate';

export type RomanianJourney = 'study' | 'work' | 'business' | 'family' | 'relocation';

/**
 * رجیستر تولید در این محصول روی رسمی قفل است.
 * formal  = صورت مؤدبانه/اداری، با dumneavoastră و صرف دومشخص جمع.
 * neutral = جملهای که اصلاً صورت خطاب ندارد (مثل «Am o programare.»).
 * informal= هرگز به کاربر بهعنوان جملهی پیشنهادی داده نمیشود. بخش ۹ را بخوان.
 */
export type RomanianRegister = 'formal' | 'neutral' | 'informal';

export type PhraseSource = {
  kind: 'official' | 'common-usage';
  label: string;
  url?: string;
  retrievedAt?: string;   // YYYY-MM-DD
};

export type RomanianPhrase = {
  id: string;                    // پایدار، هرگز تغییر نمیکند
  slug: string;
  category: RomanianCategory;
  level: RomanianLevel;
  register: RomanianRegister;    // اجباری
  text: { ro: string; en: string; fa: string };
  /** فقط برای درک شنیداری — هرگز بهعنوان جملهی پیشنهادی نمایش داده نشود. */
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
