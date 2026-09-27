import { NextResponse } from 'next/server';
import { buildRecognitionQuestion } from '@/lib/romanian/exercise';
import {
  getSignedInUserId,
  getItemStates,
  recordAnswer,
} from '@/lib/romanian/learnerStore';
import { todayInTimezone } from '@/lib/romanian/streak';
import { getOrCreateLearner } from '@/lib/romanian/learnerStore';

export const dynamic = 'force-dynamic';

/**
 * ثبت یک پاسخ.
 *
 * ### چرا سرور خودش درستی را تعیین می‌کند
 * کلاینت فقط می‌گوید «گزینه‌ی X را زدم». **نمی‌گوید درست بود یا نه.** سرور
 * همان سؤال را با همان seed دوباره می‌سازد — تولیدکننده قطعی است، پس عیناً
 * همان چهار گزینه درمی‌آید — و خودش مقایسه می‌کند.
 *
 * بدون این، هر کسی می‌توانست `isCorrect: true` بفرستد و جعبه‌ها را بالا ببرد.
 * آن تقلب به کسی جز خودِ یادگیرنده آسیب نمی‌زد، ولی لاگ را دروغ می‌کرد — و
 * زمان‌بند تابعی روی همان لاگ است.
 *
 * ### چرا `userId` از بدنه خوانده نمی‌شود
 * از نشست کوکی گرفته می‌شود. هر شناسه‌ای که کلاینت بفرستد نادیده است.
 */
export async function POST(request: Request) {
  const userId = await getSignedInUserId();
  if (!userId) {
    return NextResponse.json({ error: 'not_signed_in' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const itemId = typeof body?.itemId === 'string' ? body.itemId : null;
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : null;
  const selectedOptionId =
    typeof body?.selectedOptionId === 'string' ? body.selectedOptionId : null;
  const latencyMsRaw = Number(body?.latencyMs);
  const latencyMs =
    Number.isFinite(latencyMsRaw) && latencyMsRaw >= 0 && latencyMsRaw <= 600_000
      ? Math.round(latencyMsRaw)
      : null;

  if (!itemId || !sessionId || !selectedOptionId) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  // همان سؤالی که به کلاینت داده شد، از همان seed دوباره ساخته می‌شود.
  const question = buildRecognitionQuestion(itemId, sessionId);
  if (!question) {
    return NextResponse.json({ error: 'unknown_item' }, { status: 400 });
  }
  if (!question.options.some(o => o.id === selectedOptionId)) {
    return NextResponse.json({ error: 'option_not_in_question' }, { status: 400 });
  }

  const isCorrect = selectedOptionId === question.correctOptionId;

  const learner = await getOrCreateLearner(userId);
  if (!learner) {
    return NextResponse.json({ error: 'learner_unavailable' }, { status: 500 });
  }
  const today = todayInTimezone(learner.timezone);

  const states = await getItemStates(userId);
  const current = states.find(s => s.itemId === itemId);

  const result = await recordAnswer({
    userId,
    sessionId,
    itemId,
    mode: 'recognition',
    isCorrect,
    latencyMs,
    today,
    current,
  });

  return NextResponse.json({
    isCorrect,
    correctOptionId: question.correctOptionId,
    box: result.next.box,
    dueOn: result.next.dueOn,
    recorded: result.eventWritten,
  });
}
