import { NextResponse } from 'next/server';
import {
  getSignedInUserId,
  getOrCreateLearner,
  getItemStates,
  endSession,
  bumpStreak,
} from '@/lib/romanian/learnerStore';
import { todayInTimezone } from '@/lib/romanian/streak';
import { longTermCount } from '@/lib/romanian/scheduler';
import { meetsDailyGoal } from '@/lib/romanian/session';

export const dynamic = 'force-dynamic';

/**
 * بستن نشست، و اگر معیار روزانه گرفته شده باشد، جلو بردن روزشمار.
 *
 * شمارش پاسخ‌ها از **لاگ** گرفته نمی‌شود بلکه از بدنه می‌آید، ولی روزشمار فقط
 * وقتی جلو می‌رود که عدد از معیار بگذرد — و آن عدد را همان‌جا با حالت واقعی
 * قلم‌ها مقایسه می‌کنیم، نه با ادعای کلاینت تنها.
 */
export async function POST(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: 'not_signed_in' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : null;
  if (!sessionId) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const learner = await getOrCreateLearner(userId);
  if (!learner) {
    return NextResponse.json({ error: 'learner_unavailable' }, { status: 500 });
  }
  const today = todayInTimezone(learner.timezone);

  // منبع حقیقت برای «چند قلم امروز پاسخ داده شد» حالت واقعی است، نه بدنه.
  const states = await getItemStates(userId);
  const answeredToday = states.filter(
    s => s.totalSeen > 0 && s.dueOn >= today
  ).length;

  const total = Number(body?.itemsTotal);
  const correct = Number(body?.itemsCorrect);
  const itemsTotal = Number.isFinite(total) ? Math.max(0, Math.min(1000, Math.round(total))) : 0;
  const itemsCorrect = Number.isFinite(correct)
    ? Math.max(0, Math.min(itemsTotal, Math.round(correct)))
    : 0;

  await endSession(sessionId, itemsTotal, itemsCorrect);

  let streak = learner.streak;
  const goalMet = meetsDailyGoal(answeredToday, learner.dailyGoalItems);
  if (goalMet) {
    streak = await bumpStreak(learner, today);
  }

  return NextResponse.json({
    goalMet,
    streakDays: streak.streakDays,
    freezesLeft: streak.freezesLeft,
    longTerm: longTermCount(states),
    answeredToday,
    dailyGoalItems: learner.dailyGoalItems,
  });
}
