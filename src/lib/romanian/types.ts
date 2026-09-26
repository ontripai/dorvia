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

/**
 * یک یادداشت کاربرد، به‌صورت دنباله‌ای از قطعه‌ها به‌جای یک رشته (dre-p175).
 *
 * چرا: V27 هر رشته‌ی لاتین در usageNote.fa را به‌عنوان صورت رومانیایی بررسی
 * می‌کرد. این کار می‌کرد فقط چون فارسی خط لاتین ندارد. با اضافه‌شدن زبان‌های
 * لاتین‌نویس (انگلیسی، فرانسوی، ترکی) آن فرض فرو می‌ریزد.
 *
 * حالا صورت رومانیایی متن نیست، ارجاع است. مترجم فقط `t` را ترجمه می‌کند و
 * اصلاً به صورت رومانیایی دسترسی ندارد.
 */
export type NoteSegment =
  /** متن ترجمه‌شدنی. فاصله‌ها و نقطه‌گذاری دقیقاً همین‌جا نگه داشته می‌شوند. */
  | { t: string }
  /** یک صورت رومانیایی، مجاز شده توسط مدخل `ref`. `display` برای صورت صرف‌شده. */
  | { ref: string; display?: string }
  /** صورتی که عمداً به‌عنوان غلط رایج نقل می‌شود؛ باید در counterExamples همان مدخل باشد. */
  | { bad: string; ref: string }
  /** واژه‌ی نقشی از FUNCTION_WORD_ALLOWLIST که مدخل مستقل ندارد. */
  | { fn: string };

/** یادداشت کاربرد به تفکیک زبان. کلیدها کد زبان‌اند: fa, en, ur, ne, … */
export type UsageNote = Partial<Record<string, NoteSegment[]>>;

export type RomanianWord = {
  id: string;
  lemma: string;
  pos: 'noun' | 'verb' | 'adj' | 'adv' | 'expression' | 'pronoun' | 'numeral' | 'prep' | 'interj';
  gender?: 'm' | 'f' | 'n';   // برای اسم اجباری — V11
  definiteForm?: string;      // برای اسم اجباری — V11
  plural?: string;
  formOf?: string;            // شناسه‌ی مدخل پایه — V18 referential integrity
  translations: { en: string; fa: string };
  domains: string[];
  stationId?: string;
  /** گام درون ایستگاه — V36. */
  stepId?: string;
  intendedUse: IntendedUse;
  source: PhraseSource;
  reviewer?: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  usageNote?: UsageNote;
  counterExamples?: string[];   // صورت‌هایی که عمداً به‌عنوان غلط رایج نقل می‌شوند
  invariable?: {
    reason: string;             // چرا این واژه صرف نمی‌شود
    source: string;             // آدرس صفحه‌ای که این را نشان می‌دهد
  };
};

export type RomanianVerb = {
  id: string;
  infinitive: string;
  translations: { en: string; fa: string };
  domains: string[];
  conjugation: {
    prezent: PersonSet;              // اجباری — V10
    conjunctiv?: PersonSet;          // صیغه‌ها بدون să ذخیره می‌شوند (V20, V21)
    perfect?: PersonSet;
    viitor?: PersonSet;
  };
  conjunctiv?: PersonSet;            // دسترسی مستقیم اختیاری به صیغه‌های conjunctiv بدون să
  participiu?: string;               // اجباری در حالت published — V20
  /** کدام صورت‌ها مستقیم از منبع آمده‌اند و کدام با قاعده مشتق شده‌اند */
  derivedTenses?: Array<'perfect' | 'viitor'>;
  source: VerbSource;
  reviewer?: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  usageNote?: UsageNote;
  /** برای افعال ناقص (مثل a trebui) که تمام اشخاص صرفی را ندارند */
  defective?: { reason: string; source: string };
};

export type AudioClip = {
  voice: string;      // 'Aoede' | 'Puck'
  src: string;        // مسیر از ریشه‌ی سایت، مثل '/audio/romanian/foundation/g-06-...mp3'
  durationMs: number; // از خود فایل خوانده شود، نه تایپ
};

export type RomanianGrapheme = {
  id: string;
  slug: string;            // اسلاگ پایدار و خوانا برای مسیرهای URL (مانند 'a-breve')
  grapheme: string;        // 'ș' یا 'ce'
  soundHintFa: string;     // توضیح صدا — نه آوانگاری جمله
  exampleWordId: string;   // به واژه وصل می‌شود (V18)
  exampleForm?: string;    // شکل نمایشی (پیش‌فرض lemma است، برای فرم‌های جمع مثل bani از پارسر می‌آید)
  matchPattern: string;    // الگوی regex برای اعتبارسنجی حضور گرافم در شکل نمایشی (V19)
  order: number;
  status: 'draft' | 'review' | 'published' | 'archived';
  audio?: AudioClip[];
};

export type RomanianDialogue = {
  id: string;
  domain: string;
  stationId?: string;
  /** گام درون ایستگاه — V36. */
  stepId?: string;
  title: { ro: string; fa: string };
  turns: Array<{
    speaker: 'counterpart' | 'user';
    phraseId: string;         // هیچ رشته‌ی رومانیایی تکرار نمی‌شود
    contextNote?: { fa: string; en: string };
  }>;
  status: 'draft' | 'review' | 'published' | 'archived';
};

/**
 * یک گام: کوچک‌ترین واحدی که یادگیرنده در یک نشست تمام می‌کند (dre-p177).
 *
 * چرا لازم شد: «تا کجای این درس را خوانده‌ای» با فهرست ۵۵تایی اعداد پاسخی
 * نداشت. گام هم موقعیت قابل‌ذخیره می‌دهد، هم بار شناختی را به ۷±۲ می‌رساند،
 * هم واحدی است که فاصله‌گذاری رویش کار می‌کند.
 *
 * `can` عمداً جمله‌ی توانایی است، نه عنوان موضوع: هر گام با کاری که یادگیرنده
 * از آن پس می‌تواند بکند تمام می‌شود.
 */
export type RomanianStep = {
  id: string;
  order: number;
  titleFa: string;
  titleRo: string;
  canFa: string;
  canEn: string;
};

export type DomainMeta = {
  id: string;
  titleFa: string; titleEn: string;
  order: number;
  estimatedWeeks: number;                          // V13
  stationOrder: 'sequential' | 'grouped';          // V13
  stations: Array<{
    id: string;
    slug?: string;
    titleFa: string;
    titleRo: string;
    /** ترتیب **آموزشی**، نه ترتیب وابستگی داده (dre-p177). */
    order: number;
    /** رایگان و بدون دیوار پرداخت. باید پیشوند ترتیب آموزشی باشد — V37. */
    isFree?: boolean;
    steps?: RomanianStep[];
  }>;
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
  /** گام درون ایستگاه — V36. */
  stepId?: string;
  domain?: string;
  text: { ro: string; en: string; fa: string };
  /** فقط برای درک شنیداری — هرگز به‌عنوان جمله‌ی پیشنهادی نمایش داده نشود. */
  informalVariant?: { ro: string; note?: string };
  /**
   * این عبارت به‌صورت **فرمول ثابت** آموزش داده می‌شود (dre-p177).
   *
   * یادگیرنده کلش را حفظ می‌کند و اجزایش بعداً در ایستگاه خودشان تحلیل
   * می‌شوند — همان‌طور که هیچ‌کس روز اول نمی‌داند «vă» ضمیر مفعولی جمع
   * مؤدبانه است، ولی «Vă rog» را می‌گوید.
   *
   * `analysedAt` باید **دقیقاً** ایستگاه‌هایی را نام ببرد که آن واژه‌ها را
   * معرفی می‌کنند — نه کمتر، نه بیشتر. V12 این را بررسی می‌کند، پس این
   * اعلان راه فرار نیست: ادعایی است که خودش آزموده می‌شود.
   */
  taughtAsFormula?: { reason: string; analysedAt: string[] };

  /** نکته‌ی کاربرد — کِی و چطور این عبارت گفته می‌شود. اختیاری. */
  usageNote?: UsageNote;
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
