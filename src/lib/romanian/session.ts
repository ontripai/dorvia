/**
 * ساخت نشست — گام ۳ حلقه‌ی یادگیری (dre-p182).
 *
 * این ماژول یک مسئله را حل می‌کند که سند طراحی آن را **قاتل اصلی این محصولات**
 * نامید:
 *
 * > یادگیرنده یک هفته غیبت می‌کند، برمی‌گردد و ۲۰۰ قلم سررسیده می‌بیند و می‌رود.
 *
 * دو قاعده جلویش را می‌گیرند، و هر دو باید از روز اول باشند نه وصله‌ی بعدی:
 *
 * ۱. **سقف نشست.** هر نشست حداکثر `cap` قلم دارد، هرچقدر هم عقب‌افتادگی باشد.
 *    بقیه سررسیده می‌مانند و فردا دیده می‌شوند — انباشته نمی‌شوند، چون سررسیدِ
 *    گذشته با گذشتِ زمان بزرگ‌تر نمی‌شود، فقط قدیمی‌تر.
 *
 * ۲. **دروازه‌ی قلم نو.** تا وقتی عقب‌افتادگی بزرگ است، **هیچ قلم تازه‌ای معرفی
 *    نمی‌شود.** بدون این قاعده، سقف نشست به‌تنهایی کافی نیست: یادگیرنده هر روز
 *    ۱۰ قلم می‌بیند ولی صف پشت سرش بلندتر می‌شود، چون هر قلم نو خودش فردا
 *    سررسید می‌شود. این قاعده است که صف را **کوچک می‌کند**، نه فقط پنهان.
 *
 * ماژول خالص است: «امروز» و حالت‌ها را فراخوان می‌دهد.
 */
import { ItemState } from './scheduler';

export interface SessionPlanInput {
  /** حالت هر قلمی که یادگیرنده تا امروز دیده است. */
  states: readonly ItemState[];
  /** `YYYY-MM-DD` در روزِ یادگیرنده. */
  today: string;
  /**
   * قلم‌های آماده‌ی معرفی، به **ترتیب آموزشی** — گام جاری اول. فراخوان ترتیب را
   * تعیین می‌کند؛ این ماژول ترتیب را عوض نمی‌کند، فقط از ابتدایش برمی‌دارد.
   */
  candidateNewItemIds: readonly string[];
  /** سقف کل نشست. پیش‌فرض ۱۰ — حدود دو دقیقه، همان معیار روزشمار. */
  cap?: number;
  /**
   * دروازه‌ی قلم نو: اگر تعداد سررسیدها از این بیشتر باشد، چیز تازه‌ای معرفی
   * نمی‌شود. پیش‌فرض نصف سقف.
   */
  newItemGate?: number;
}

export interface SessionPlan {
  /** شناسه‌ی قلم‌هایی که مرور می‌شوند، از قدیمی‌ترین سررسید. */
  reviewItemIds: string[];
  /** شناسه‌ی قلم‌هایی که تازه معرفی می‌شوند. */
  newItemIds: string[];
  /** کل سررسیدهای امروز — می‌تواند خیلی بزرگ‌تر از `reviewItemIds` باشد. */
  dueCount: number;
  /** سررسیدهایی که امروز جا نشدند. عددی که رابط می‌تواند صادقانه نشان دهد. */
  backlogCount: number;
  /** آیا دروازه بسته است (یعنی امروز روزِ جبران است، نه روزِ یادگیریِ نو). */
  newItemsHeldBack: boolean;
  cap: number;
}

export const DEFAULT_SESSION_CAP = 10;

export function planSession(input: SessionPlanInput): SessionPlan {
  const cap = Math.max(1, input.cap ?? DEFAULT_SESSION_CAP);
  const gate = input.newItemGate ?? Math.floor(cap / 2);

  const due = input.states
    .filter(s => s.dueOn <= input.today)
    // قدیمی‌ترین سررسید اول؛ در سررسید برابر، ضعیف‌ترین جعبه اول.
    .sort((a, b) => (a.dueOn < b.dueOn ? -1 : a.dueOn > b.dueOn ? 1 : a.box - b.box));

  const reviewItemIds = due.slice(0, cap).map(s => s.itemId);

  const newItemsHeldBack = due.length > gate;
  const room = cap - reviewItemIds.length;
  const seen = new Set(input.states.map(s => s.itemId));
  const newItemIds = newItemsHeldBack
    ? []
    : input.candidateNewItemIds.filter(id => !seen.has(id)).slice(0, room);

  return {
    reviewItemIds,
    newItemIds,
    dueCount: due.length,
    backlogCount: Math.max(0, due.length - reviewItemIds.length),
    newItemsHeldBack,
    cap,
  };
}

/**
 * آیا نشست امروز معیار روزشمار را برآورده می‌کند.
 *
 * معیار عمداً **پایین** است: یک نشست کوتاه کافی است، نه خالی‌کردن همه‌ی
 * سررسیدها. اگر معیار «صفر شدن صف» بود، یادگیرنده‌ای که یک هفته غیبت کرده
 * هیچ‌وقت نمی‌توانست روزشمارش را نگه دارد — یعنی دقیقاً همان کسی که بیشترین
 * نیاز را به برگشتن دارد، بیشترین دلیل را برای نیامدن پیدا می‌کرد.
 */
export function meetsDailyGoal(answeredCount: number, dailyGoalItems: number): boolean {
  return answeredCount >= Math.max(1, dailyGoalItems);
}
