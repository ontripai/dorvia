/**
 * روزشمار — dre-p183.
 *
 * سند طراحی سه چیز را تعیین‌کننده دانست که روزشمار کمک باشد یا آسیب:
 *
 * ۱. **معیار روز پایین باشد.** یک نشست کوتاه کافی است، نه خالی‌کردن همه‌ی
 *    سررسیدها. اگر معیار «صفر شدن صف» بود، کسی که یک هفته غیبت کرده هرگز
 *    نمی‌توانست روزشمارش را نگه دارد — یعنی دقیقاً همان کسی که بیشترین نیاز
 *    را به برگشتن دارد، بیشترین دلیل را برای نیامدن پیدا می‌کرد.
 *
 * ۲. **فریز از روز اول، نه وصله‌ی بعدی.** بدون آن، یک روز غیبت هفته‌ها
 *    سرمایه‌گذاری را نابود می‌کند و یادگیرنده می‌رود.
 *
 * ۳. **منطقه‌ی زمانی ذخیره شود.** «نیمه‌شب» به وقت سرور، روزشمار کاربر را در
 *    منطقه‌ی دیگر می‌شکند. منبع کلاسیک باگ — و دلیل اینکه این ماژول هم مثل
 *    زمان‌بند «امروز» را **می‌گیرد** و خودش ساعت را نمی‌خواند.
 *
 * ماژول خالص است.
 */
import { addDays, daysBetween } from './scheduler';

export const DEFAULT_FREEZES = 2;
export const MAX_FREEZES = DEFAULT_FREEZES;

export interface StreakState {
  streakDays: number;
  /** `YYYY-MM-DD`، یا null اگر هنوز هیچ روزی معیار را نگرفته. */
  lastActiveDate: string | null;
  freezesLeft: number;
  /** `YYYY-MM-DD` روزی که فریزها آخرین بار تجدید شدند. */
  freezesRenewedOn: string | null;
}

export interface StreakOutcome extends StreakState {
  /** آیا امروز روزِ تازه‌ای به روزشمار افزود. */
  extended: boolean;
  /** چند فریز برای پر کردن فاصله خرج شد. */
  freezesSpent: number;
  /** آیا روزشمار شکست و از یک شروع شد. */
  broken: boolean;
}

/**
 * فریزها ماهانه تجدید می‌شوند — یعنی وقتی ماه تقویمیِ `today` با ماه
 * `freezesRenewedOn` فرق کند. عمداً «هر ۳۰ روز» نیست: «اول هر ماه دو فریز
 * تازه» چیزی است که یادگیرنده می‌تواند پیش‌بینی کند، و پیش‌بینی‌پذیری همان
 * چیزی است که به آن اعتماد می‌سازد.
 */
export function renewFreezes(state: StreakState, today: string): StreakState {
  const sameMonth =
    state.freezesRenewedOn !== null && state.freezesRenewedOn.slice(0, 7) === today.slice(0, 7);
  if (sameMonth) return state;
  return { ...state, freezesLeft: MAX_FREEZES, freezesRenewedOn: today };
}

/**
 * معیار امروز گرفته شد — روزشمار را جلو ببر.
 *
 * `gap` فاصله‌ی روز از آخرین روز فعال است:
 *   ۰  همین امروز قبلاً شمرده شده ⇒ هیچ تغییری
 *   ۱  دیروز فعال بوده ⇒ یک روز اضافه
 *   ≥۲ فاصله افتاده ⇒ به‌ازای هر روزِ خالی یک فریز. اگر فریز کافی بود
 *      روزشمار **حفظ** می‌شود و امروز هم اضافه می‌شود؛ اگر نبود، از ۱ شروع.
 */
export function applyDailyGoalMet(state: StreakState, today: string): StreakOutcome {
  const renewed = renewFreezes(state, today);

  if (renewed.lastActiveDate === null) {
    return {
      ...renewed,
      streakDays: 1,
      lastActiveDate: today,
      extended: true,
      freezesSpent: 0,
      broken: false,
    };
  }

  const gap = daysBetween(today, renewed.lastActiveDate);

  // ساعت یادگیرنده عقب رفته یا داده‌ی قدیمی رسیده — چیزی را خراب نکن.
  if (gap <= 0) {
    return { ...renewed, extended: false, freezesSpent: 0, broken: false };
  }

  if (gap === 1) {
    return {
      ...renewed,
      streakDays: renewed.streakDays + 1,
      lastActiveDate: today,
      extended: true,
      freezesSpent: 0,
      broken: false,
    };
  }

  const missedDays = gap - 1;
  if (missedDays <= renewed.freezesLeft) {
    return {
      ...renewed,
      streakDays: renewed.streakDays + 1,
      lastActiveDate: today,
      freezesLeft: renewed.freezesLeft - missedDays,
      extended: true,
      freezesSpent: missedDays,
      broken: false,
    };
  }

  return {
    ...renewed,
    streakDays: 1,
    lastActiveDate: today,
    freezesLeft: renewed.freezesLeft,
    extended: true,
    freezesSpent: 0,
    broken: true,
  };
}

/**
 * روزشماری که **برای نمایش** درست است، بدون نوشتن در دیتابیس.
 *
 * لازم است چون سطر یادگیرنده فقط وقتی به‌روز می‌شود که معیار روزی گرفته شود.
 * اگر صفحه عدد خام `streak_days` را نشان دهد، کسی که سه روز نیامده هنوز
 * «۱۲ روز» می‌بیند — عددی که دیگر راست نیست. این تابع همان حساب را بدون
 * نوشتن انجام می‌دهد.
 */
export function displayedStreak(state: StreakState, today: string): number {
  if (state.lastActiveDate === null) return 0;
  const gap = daysBetween(today, state.lastActiveDate);
  if (gap <= 0) return state.streakDays;
  const missedDays = gap - 1;
  return missedDays <= state.freezesLeft ? state.streakDays : 0;
}

/** روز `YYYY-MM-DD` در منطقه‌ی زمانی یادگیرنده — تنها جایی که ساعت خوانده می‌شود. */
export function todayInTimezone(timezone: string, now: Date = new Date()): string {
  try {
    // en-CA چون خروجی‌اش دقیقاً YYYY-MM-DD است.
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
  } catch {
    // منطقه‌ی نامعتبر نباید صفحه را بیندازد؛ UTC بدترین حالتِ قابل قبول است.
    return now.toISOString().slice(0, 10);
  }
}

/** فردا در منطقه‌ی یادگیرنده — برای «دفعه‌ی بعد کِی می‌بینیدش». */
export function tomorrowInTimezone(timezone: string, now: Date = new Date()): string {
  return addDays(todayInTimezone(timezone, now), 1);
}
