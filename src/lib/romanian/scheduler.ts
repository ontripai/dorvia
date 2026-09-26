/**
 * زمان‌بند جعبه‌ای — گام ۳ حلقه‌ی یادگیری (dre-p182).
 *
 * چرا جعبه‌ای و نه SM-2: **نه چون ساده‌تر است، چون قابل توضیح است.** «این واژه
 * در جعبه‌ی ۳ است، ۷ روز دیگر می‌بینیدش» چیزی است که یادگیرنده می‌فهمد و حس
 * پیشرفت می‌دهد. ضریب سهولتِ پنهانِ SM-2 چنین نمی‌کند، و هدف اعلام‌شده این است
 * که یادگیرنده **خودش** بخواهد برگردد.
 *
 * این ماژول **خالص** است: هیچ ورودی/خروجی، هیچ دیتابیس، هیچ ساعتی. «امروز» را
 * فراخوان می‌دهد، چون روزِ یادگیرنده در منطقه‌ی زمانی **خودش** شروع می‌شود، نه
 * منطقه‌ی سرور. (`romanian_learners.timezone` دقیقاً برای همین ذخیره می‌شود.)
 *
 * بازه‌ها در کد‌اند نه در دیتابیس: جدول‌ها فقط «در کدام جعبه» و «چه روزی سررسید»
 * را نگه می‌دارند، پس تغییر الگوریتم یک تغییر کد است، نه یک مهاجرت.
 */

export type ReviewMode = 'recognition' | 'listening' | 'production';

/** سررسید بعدی به‌ازای هر جعبه، بر حسب روز. اندیس = شماره‌ی جعبه. */
export const BOX_INTERVAL_DAYS: readonly number[] = Object.freeze([0, 1, 3, 7, 14, 30]);

export const MAX_BOX = BOX_INTERVAL_DAYS.length - 1; // 5

/**
 * آستانه‌ی «حافظه‌ی بلندمدت». جعبه‌ی ۴ یعنی قلم یک بازه‌ی ۱۴روزه را پشت سر
 * گذاشته و باز هم به یاد آمده است.
 *
 * این عدد چیزی است که در رابط به یادگیرنده نشان داده می‌شود («۲۳ واژه در
 * حافظه‌ی بلندمدت شما»). فقط وقتی بالا می‌رود که فاصله‌گذاری واقعاً جواب داده
 * باشد — انگیزه‌بخش است **چون راست است**.
 */
export const LONG_TERM_BOX = 4;

export interface ItemState {
  itemId: string;
  box: number;
  mode: ReviewMode;
  /** `YYYY-MM-DD` در روزِ یادگیرنده. */
  dueOn: string;
  consecutiveCorrect: number;
  totalSeen: number;
  totalCorrect: number;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * جمع روز روی یک تاریخ `YYYY-MM-DD`.
 *
 * عمداً با UTC حساب می‌شود و رشته می‌گیرد و رشته می‌دهد. اگر این تابع
 * `new Date()` محلی را لمس کند، جمع روز نزدیک نیمه‌شب یا در تغییر ساعت تابستانی
 * یک روز جابه‌جا می‌شود — همان کلاسِ باگی که کل روزشمار را بی‌صدا خراب می‌کند.
 */
export function addDays(isoDate: string, days: number): string {
  if (!ISO_DATE.test(isoDate)) {
    throw new Error(`addDays expects YYYY-MM-DD, received "${isoDate}"`);
  }
  const [y, m, d] = isoDate.split('-').map(Number);
  const t = Date.UTC(y, m - 1, d) + days * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/** اختلاف روز، `a - b`. منفی یعنی `a` پیش از `b` است. */
export function daysBetween(a: string, b: string): number {
  if (!ISO_DATE.test(a) || !ISO_DATE.test(b)) {
    throw new Error(`daysBetween expects YYYY-MM-DD, received "${a}" and "${b}"`);
  }
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(ay, am - 1, ad) - Date.UTC(by, bm - 1, bd)) / 86_400_000);
}

/** حالت یک قلم در لحظه‌ی معرفی — جعبه‌ی صفر، سررسید همین امروز. */
export function initialState(itemId: string, today: string): ItemState {
  return {
    itemId,
    box: 0,
    mode: 'recognition',
    dueOn: today,
    consecutiveCorrect: 0,
    totalSeen: 0,
    totalCorrect: 0,
  };
}

/**
 * یک پاسخ را روی حالت قلم اعمال می‌کند و حالت تازه را برمی‌گرداند.
 *
 * درست ⇒ یک جعبه بالا (سقف ۵). غلط ⇒ جعبه‌ی ۱، نه جعبه‌ی ۰.
 *
 * تفاوت ۱ و ۰ عمدی است: جعبه‌ی ۰ یعنی «معرفی شده، هنوز هیچ پاسخ درستی نداشته».
 * قلمی که قبلاً درست جواب داده شده و حالا فراموش شده، به آن حالتِ بِکر برنمی‌گردد
 * — فردا دوباره دیده می‌شود، نه همین امروز، وگرنه در همان نشست تکرار می‌شود و
 * یادگیرنده جوابش را از حافظه‌ی کوتاه‌مدت می‌دهد نه از یادگیری.
 *
 * **حالت (`mode`) اینجا جلو نمی‌رود.** نردبان دشواری (بازشناسی ← شنیدن ← تولید)
 * در طراحی هست، ولی تمرین شنیداری به صدای کامل نیاز دارد که هنوز نیست. نوشتن
 * نردبانی که نمی‌شود آزمودش، نوشتن کدی است که باید بعداً بیرون کشیده شود.
 */
export function gradeItem(state: ItemState, isCorrect: boolean, today: string): ItemState {
  const box = isCorrect ? Math.min(state.box + 1, MAX_BOX) : 1;
  return {
    ...state,
    box,
    dueOn: addDays(today, BOX_INTERVAL_DAYS[box]),
    consecutiveCorrect: isCorrect ? state.consecutiveCorrect + 1 : 0,
    totalSeen: state.totalSeen + 1,
    totalCorrect: state.totalCorrect + (isCorrect ? 1 : 0),
  };
}

/** چند قلم از آستانه‌ی حافظه‌ی بلندمدت گذشته‌اند. */
export function longTermCount(states: readonly ItemState[]): number {
  return states.filter(s => s.box >= LONG_TERM_BOX).length;
}

/** توضیح انسانی سررسید بعدی — همان چیزی که «قابل توضیح بودن» را می‌سازد. */
export function intervalForBox(box: number): number {
  return BOX_INTERVAL_DAYS[Math.max(0, Math.min(box, MAX_BOX))];
}
