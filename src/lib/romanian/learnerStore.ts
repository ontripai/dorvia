/**
 * لایه‌ی داده‌ی یادگیرنده — dre-p183.
 *
 * تنها جایی که ماژول رومانیایی به دیتابیس می‌خورد. مرزی که از dre-p178 برقرار
 * است دست‌نخورده می‌ماند:
 *
 * > فایل = آنچه درباره‌ی رومانیایی درست است. دیتابیس = آنچه درباره‌ی این
 * > یادگیرنده درست است.
 *
 * پس اینجا هیچ محتوایی خوانده یا نوشته نمی‌شود؛ فقط حالت یادگیرنده. و هیچ
 * ریاضیِ فاصله‌گذاری اینجا نیست — آن در `scheduler.ts` است که خالص و آزمودنی
 * است. این ماژول فقط **می‌خواند، صدا می‌زند، و می‌نویسد**.
 *
 * ### امنیت
 * همه‌ی فراخوان‌ها با کلاینت سمت سرورِ کوکی‌دار انجام می‌شوند، یعنی با نقش
 * `authenticated` و زیر RLS. هیچ‌جا کلید سرویس استفاده نمی‌شود. اگر کاربری
 * وارد نشده باشد، هر تابع `null` یا آرایه‌ی خالی می‌دهد — ثبت‌نام اجباری است.
 *
 * ### چرا رویداد **پیش از** حالت نوشته می‌شود
 * یک پاسخ دو نوشتن دارد: یک ردیف در لاگ فقط‌افزودنی، و به‌روزرسانی حالت قلم.
 * کلاینت تراکنش ندارد، پس اگر دومی شکست بخورد، ترتیب تعیین می‌کند چه چیزی
 * از دست می‌رود.
 *
 * لاگ اول نوشته می‌شود، چون **حالت از لاگ قابل بازسازی است ولی برعکسش نه**.
 * اگر نوشتنِ حالت شکست بخورد، پاسخ یادگیرنده گم نشده؛ فقط سررسید یک قلم عقب
 * می‌ماند و دفعه‌ی بعد درست می‌شود. اگر ترتیب برعکس بود، یک شکست یعنی پاسخی
 * که هرگز ثبت نشد — و طراحی صریح گفته بود زمان‌بند تابعی روی این لاگ است.
 */
import { createServerComponentClient } from '@/lib/supabaseServer';
import { Database } from '@/types/supabase';
import { ItemState, ReviewMode, gradeItem, initialState } from './scheduler';
import {
  StreakState,
  applyDailyGoalMet,
  displayedStreak,
  todayInTimezone,
} from './streak';

type LearnerRow = Database['public']['Tables']['romanian_learners']['Row'];
type ItemStateRow = Database['public']['Tables']['romanian_item_state']['Row'];
type StepProgressRow = Database['public']['Tables']['romanian_step_progress']['Row'];

export interface Learner {
  userId: string;
  timezone: string;
  dailyGoalItems: number;
  streak: StreakState;
  currentStationId: string | null;
  currentStepId: string | null;
}

const DEFAULT_TIMEZONE = 'Europe/Bucharest';

function toLearner(row: LearnerRow): Learner {
  return {
    userId: row.user_id,
    timezone: row.timezone,
    dailyGoalItems: row.daily_goal_items,
    streak: {
      streakDays: row.streak_days,
      lastActiveDate: row.streak_last_active_date,
      freezesLeft: row.streak_freezes_left,
      freezesRenewedOn: row.streak_freezes_renewed_on,
    },
    currentStationId: row.current_station_id,
    currentStepId: row.current_step_id,
  };
}

function toItemState(row: ItemStateRow): ItemState {
  return {
    itemId: row.item_id,
    box: row.box,
    mode: row.mode,
    dueOn: row.due_on,
    consecutiveCorrect: row.consecutive_correct,
    totalSeen: row.total_seen,
    totalCorrect: row.total_correct,
  };
}

/** شناسه‌ی کاربر واردشده، یا `null`. هیچ تابع دیگری بدون این کار نمی‌کند. */
export async function getSignedInUserId(): Promise<string | null> {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user.id;
}

/**
 * پروفایل یادگیرنده را برمی‌گرداند و اگر نبود می‌سازد.
 *
 * `timezone` فقط در لحظه‌ی **ساخت** نوشته می‌شود. اگر بعداً بازنویسی می‌شد،
 * یک سفر کاری، روزِ یادگیرنده را جابه‌جا می‌کرد و روزشمارش را می‌شکست. تغییر
 * منطقه‌ی زمانی باید کار صریح خود کاربر باشد.
 */
export async function getOrCreateLearner(
  userId: string,
  timezoneHint?: string
): Promise<Learner | null> {
  const supabase = createServerComponentClient();

  const existing = await supabase
    .from('romanian_learners')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing.data) return toLearner(existing.data);
  if (existing.error) {
    console.error('[romanian] failed to read learner');
    return null;
  }

  const created = await supabase
    .from('romanian_learners')
    .insert({ user_id: userId, timezone: timezoneHint || DEFAULT_TIMEZONE })
    .select('*')
    .maybeSingle();

  if (created.data) return toLearner(created.data);

  // مسابقه‌ی دو درخواست هم‌زمان: سطر را دیگری ساخته. دوباره بخوان.
  const retry = await supabase
    .from('romanian_learners')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (retry.data) return toLearner(retry.data);

  console.error('[romanian] failed to create learner');
  return null;
}

export async function getItemStates(userId: string): Promise<ItemState[]> {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from('romanian_item_state')
    .select('*')
    .eq('user_id', userId);
  if (error || !data) {
    if (error) console.error('[romanian] failed to read item states');
    return [];
  }
  return data.map(toItemState);
}

export async function getStepProgress(userId: string): Promise<StepProgressRow[]> {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from('romanian_step_progress')
    .select('*')
    .eq('user_id', userId);
  if (error || !data) {
    if (error) console.error('[romanian] failed to read step progress');
    return [];
  }
  return data;
}

export async function startSession(
  userId: string,
  stationId: string | null,
  stepId: string | null
): Promise<string | null> {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from('romanian_sessions')
    .insert({ user_id: userId, station_id: stationId, step_id: stepId })
    .select('id')
    .maybeSingle();
  if (error || !data) {
    console.error('[romanian] failed to start session');
    return null;
  }
  return data.id;
}

export interface AnswerInput {
  userId: string;
  sessionId: string | null;
  itemId: string;
  mode: ReviewMode;
  isCorrect: boolean;
  latencyMs?: number | null;
  /** `YYYY-MM-DD` در منطقه‌ی یادگیرنده. */
  today: string;
  /** حالت فعلی قلم، یا undefined اگر تازه معرفی می‌شود. */
  current?: ItemState;
}

export interface AnswerResult {
  next: ItemState;
  eventWritten: boolean;
  stateWritten: boolean;
}

/**
 * یک پاسخ را ثبت می‌کند: اول رویداد در لاگ، بعد حالت قلم.
 *
 * حالتِ تازه با `gradeItem` حساب می‌شود — همان تابع خالصی که آزمون p182
 * می‌آزماید — و بعد نوشته می‌شود. ریاضی در کد می‌ماند، نه در SQL.
 */
export async function recordAnswer(input: AnswerInput): Promise<AnswerResult> {
  const supabase = createServerComponentClient();
  const before = input.current ?? initialState(input.itemId, input.today);
  const next = gradeItem(before, input.isCorrect, input.today);

  const event = await supabase.from('romanian_review_events').insert({
    user_id: input.userId,
    session_id: input.sessionId,
    item_id: input.itemId,
    mode: input.mode,
    is_correct: input.isCorrect,
    latency_ms: input.latencyMs ?? null,
    box_before: before.box,
    box_after: next.box,
  });
  const eventWritten = !event.error;
  if (event.error) console.error('[romanian] failed to append review event');

  const state = await supabase.from('romanian_item_state').upsert(
    {
      user_id: input.userId,
      item_id: next.itemId,
      box: next.box,
      mode: next.mode,
      due_on: next.dueOn,
      consecutive_correct: next.consecutiveCorrect,
      total_seen: next.totalSeen,
      total_correct: next.totalCorrect,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,item_id' }
  );
  const stateWritten = !state.error;
  if (state.error) console.error('[romanian] failed to upsert item state');

  return { next, eventWritten, stateWritten };
}

export async function endSession(
  sessionId: string,
  itemsTotal: number,
  itemsCorrect: number
): Promise<boolean> {
  const supabase = createServerComponentClient();
  const { error } = await supabase
    .from('romanian_sessions')
    .update({
      ended_at: new Date().toISOString(),
      items_total: itemsTotal,
      items_correct: itemsCorrect,
    })
    .eq('id', sessionId);
  if (error) console.error('[romanian] failed to close session');
  return !error;
}

/** موقعیت درون درس — همان «تا کجا خوانده». */
export async function saveStepPosition(
  userId: string,
  stationId: string,
  stepId: string,
  lastItemIndex: number,
  itemsIntroduced: number,
  completed = false
): Promise<boolean> {
  const supabase = createServerComponentClient();
  const { error } = await supabase.from('romanian_step_progress').upsert(
    {
      user_id: userId,
      step_id: stepId,
      station_id: stationId,
      last_item_index: lastItemIndex,
      items_introduced: itemsIntroduced,
      // قید دیتابیس این دو را جدا از هم نمی‌پذیرد، پس با هم نوشته می‌شوند.
      status: completed ? 'completed' : 'in_progress',
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: 'user_id,step_id' }
  );
  if (error) console.error('[romanian] failed to save step position');
  return !error;
}

/**
 * وقتی یادگیرنده معیار روزانه را گرفت، روزشمار را جلو ببر.
 *
 * حساب در `streak.ts` انجام می‌شود؛ اینجا فقط نتیجه نوشته می‌شود. اگر امروز
 * قبلاً شمرده شده باشد، هیچ نوشتنی انجام نمی‌شود.
 */
export async function bumpStreak(learner: Learner, today: string): Promise<StreakState> {
  const outcome = applyDailyGoalMet(learner.streak, today);
  if (!outcome.extended && outcome.freezesLeft === learner.streak.freezesLeft) {
    return learner.streak;
  }

  const supabase = createServerComponentClient();
  const { error } = await supabase
    .from('romanian_learners')
    .update({
      streak_days: outcome.streakDays,
      streak_last_active_date: outcome.lastActiveDate,
      streak_freezes_left: outcome.freezesLeft,
      streak_freezes_renewed_on: outcome.freezesRenewedOn,
    })
    .eq('user_id', learner.userId);
  if (error) {
    console.error('[romanian] failed to update streak');
    return learner.streak;
  }
  return outcome;
}

export async function saveCurrentPosition(
  userId: string,
  stationId: string | null,
  stepId: string | null
): Promise<boolean> {
  const supabase = createServerComponentClient();
  const { error } = await supabase
    .from('romanian_learners')
    .update({ current_station_id: stationId, current_step_id: stepId })
    .eq('user_id', userId);
  if (error) console.error('[romanian] failed to save current position');
  return !error;
}

/** هر چیزی که صفحه‌ی تمرین برای رندر اولیه لازم دارد، در یک رفت‌وبرگشت. */
export interface LearnerSnapshot {
  learner: Learner;
  states: ItemState[];
  today: string;
  streakForDisplay: number;
}

export async function loadLearnerSnapshot(
  userId: string,
  timezoneHint?: string
): Promise<LearnerSnapshot | null> {
  const learner = await getOrCreateLearner(userId, timezoneHint);
  if (!learner) return null;
  const states = await getItemStates(userId);
  const today = todayInTimezone(learner.timezone);
  return {
    learner,
    states,
    today,
    streakForDisplay: displayedStreak(learner.streak, today),
  };
}
