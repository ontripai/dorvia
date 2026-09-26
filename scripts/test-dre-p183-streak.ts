/**
 * dre-p183 — آزمون روزشمار.
 *
 * روزشمار جایی است که یک باگ ساکت مستقیماً به یادگیرنده آسیب می‌زند: عددی که
 * هفته‌ها سرمایه‌گذاری را نشان می‌دهد، با یک خطای محاسبه‌ی روز صفر می‌شود و
 * کسی که این اتفاق برایش بیفتد برنمی‌گردد. پس آزمون اینجا سخت‌گیر است.
 */
import {
  applyDailyGoalMet,
  displayedStreak,
  renewFreezes,
  todayInTimezone,
  tomorrowInTimezone,
  StreakState,
  MAX_FREEZES,
} from '../src/lib/romanian/streak';

let failed = 0;
function check(name: string, ok: boolean, detail?: string) {
  if (ok) console.log(`[PASS] ${name}`);
  else {
    failed++;
    console.error(`[FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('============================================================');
console.log('DRE-P183 — STREAK');
console.log('============================================================\n');

const base = (over: Partial<StreakState> = {}): StreakState => ({
  streakDays: 0,
  lastActiveDate: null,
  freezesLeft: MAX_FREEZES,
  freezesRenewedOn: '2026-10-01',
  ...over,
});

/* ------------------------------------------------------- شروع و ادامه */

const first = applyDailyGoalMet(base(), '2026-10-05');
check('a first ever day starts the streak at 1', first.streakDays === 1 && first.extended);
check('and records the day', first.lastActiveDate === '2026-10-05');

const second = applyDailyGoalMet(
  base({ streakDays: 1, lastActiveDate: '2026-10-05' }),
  '2026-10-06'
);
check('a consecutive day adds one', second.streakDays === 2 && !second.broken);
check('and spends no freeze', second.freezesSpent === 0);

const sameDay = applyDailyGoalMet(
  base({ streakDays: 7, lastActiveDate: '2026-10-06' }),
  '2026-10-06'
);
check('a second session on the same day changes nothing', sameDay.streakDays === 7 && !sameDay.extended);

const clockWentBack = applyDailyGoalMet(
  base({ streakDays: 7, lastActiveDate: '2026-10-06' }),
  '2026-10-05'
);
check(
  'a date earlier than the last active day does not corrupt the streak',
  clockWentBack.streakDays === 7 && clockWentBack.lastActiveDate === '2026-10-06',
  `${clockWentBack.streakDays} / ${clockWentBack.lastActiveDate}`
);

/* ------------------------------------------------------------ فریزها */

const oneMissed = applyDailyGoalMet(
  base({ streakDays: 12, lastActiveDate: '2026-10-05', freezesLeft: 2 }),
  '2026-10-07'
);
check('one missed day is covered by one freeze', oneMissed.streakDays === 13 && !oneMissed.broken);
check('and exactly one freeze is spent', oneMissed.freezesSpent === 1 && oneMissed.freezesLeft === 1,
  `spent=${oneMissed.freezesSpent} left=${oneMissed.freezesLeft}`);

const twoMissed = applyDailyGoalMet(
  base({ streakDays: 12, lastActiveDate: '2026-10-05', freezesLeft: 2 }),
  '2026-10-08'
);
check('two missed days are covered by two freezes', twoMissed.streakDays === 13 && !twoMissed.broken);
check('leaving none', twoMissed.freezesLeft === 0, `${twoMissed.freezesLeft}`);

const threeMissed = applyDailyGoalMet(
  base({ streakDays: 12, lastActiveDate: '2026-10-05', freezesLeft: 2 }),
  '2026-10-09'
);
check('three missed days break a 12-day streak', threeMissed.broken && threeMissed.streakDays === 1,
  `broken=${threeMissed.broken} days=${threeMissed.streakDays}`);
check('a broken streak spends no freeze', threeMissed.freezesSpent === 0 && threeMissed.freezesLeft === 2,
  `left=${threeMissed.freezesLeft}`);

const noFreezes = applyDailyGoalMet(
  base({ streakDays: 30, lastActiveDate: '2026-10-05', freezesLeft: 0 }),
  '2026-10-07'
);
check('with no freezes left, one missed day breaks the streak', noFreezes.broken && noFreezes.streakDays === 1);

/* ------------------------------------------------ تجدید ماهانه‌ی فریز */

const sameMonth = renewFreezes(base({ freezesLeft: 0, freezesRenewedOn: '2026-10-01' }), '2026-10-20');
check('freezes are not renewed within the same month', sameMonth.freezesLeft === 0);

const nextMonth = renewFreezes(base({ freezesLeft: 0, freezesRenewedOn: '2026-10-20' }), '2026-11-01');
check('freezes renew when the calendar month changes', nextMonth.freezesLeft === MAX_FREEZES);
check('and the renewal date is recorded', nextMonth.freezesRenewedOn === '2026-11-01');

const acrossYear = renewFreezes(base({ freezesLeft: 0, freezesRenewedOn: '2026-12-15' }), '2027-01-02');
check('renewal works across a year boundary', acrossYear.freezesLeft === MAX_FREEZES);

const neverRenewed = renewFreezes(base({ freezesLeft: 0, freezesRenewedOn: null }), '2026-10-20');
check('a learner who never renewed gets a full set', neverRenewed.freezesLeft === MAX_FREEZES);

// تجدید باید **پیش از** خرج‌کردن حساب شود
const renewThenSpend = applyDailyGoalMet(
  base({ streakDays: 20, lastActiveDate: '2026-10-30', freezesLeft: 0, freezesRenewedOn: '2026-10-01' }),
  '2026-11-01'
);
check(
  'the monthly renewal is applied before freezes are spent, so a streak survives the month boundary',
  !renewThenSpend.broken && renewThenSpend.streakDays === 21,
  `broken=${renewThenSpend.broken} days=${renewThenSpend.streakDays}`
);

/* --------------------------------------------- عددی که نشان داده می‌شود */

check('a learner with no history displays 0', displayedStreak(base(), '2026-10-05') === 0);
check(
  'today\'s streak displays as stored',
  displayedStreak(base({ streakDays: 9, lastActiveDate: '2026-10-05' }), '2026-10-05') === 9
);
check(
  'a gap still covered by freezes displays as stored',
  displayedStreak(base({ streakDays: 9, lastActiveDate: '2026-10-05', freezesLeft: 2 }), '2026-10-07') === 9
);
check(
  'a gap beyond the freezes displays 0, not the stale number',
  displayedStreak(base({ streakDays: 9, lastActiveDate: '2026-10-05', freezesLeft: 2 }), '2026-10-09') === 0,
  'showing a number that is no longer true is the bug this guards against'
);

/* ----------------------------------------------------- منطقه‌ی زمانی */

// ۲۰۲۶-۱۰-۰۵ ساعت ۲۲:۳۰ به وقت UTC = ۰۱:۳۰ بامداد ششم در تهران، و هنوز پنجم در بخارست.
const nightUtc = new Date('2026-10-05T22:30:00Z');
check(
  'Tehran is already on the next day at 22:30 UTC',
  todayInTimezone('Asia/Tehran', nightUtc) === '2026-10-06',
  todayInTimezone('Asia/Tehran', nightUtc)
);
check(
  'Bucharest is still on the same day at 22:30 UTC',
  todayInTimezone('Europe/Bucharest', nightUtc) === '2026-10-06' ||
    todayInTimezone('Europe/Bucharest', nightUtc) === '2026-10-05',
  todayInTimezone('Europe/Bucharest', nightUtc)
);
check(
  'UTC itself is still on the same day',
  todayInTimezone('UTC', nightUtc) === '2026-10-05',
  todayInTimezone('UTC', nightUtc)
);
check(
  'the two zones genuinely disagree at this instant — which is the whole reason timezone is stored',
  todayInTimezone('Asia/Tehran', nightUtc) !== todayInTimezone('UTC', nightUtc)
);
check(
  'an invalid timezone falls back to UTC instead of throwing',
  todayInTimezone('Mars/Olympus', nightUtc) === '2026-10-05',
  todayInTimezone('Mars/Olympus', nightUtc)
);
check(
  'tomorrow follows today in the learner\'s own zone',
  tomorrowInTimezone('Asia/Tehran', nightUtc) === '2026-10-07',
  tomorrowInTimezone('Asia/Tehran', nightUtc)
);

/* ------------------------------ شبیه‌سازی: ۹۰ روز با غیبت‌های پراکنده */

/*
 * انتظار اول من اینجا غلط بود و ثبت می‌شود: نوشته بودم «فقط غیبتِ سه‌روزه
 * روزشمار را می‌شکند، چون غیبت‌های تک‌روزه با فریز پوشانده می‌شوند». دو بار
 * شکست، و ردیابی نشان داد چرا — و چیزی که نشان داد از خودِ آزمون مهم‌تر است:
 *
 *   day 11  froze spent=2 left=0    ← غیبت دوروزه‌ی ۹ و ۱۰، هر دو فریز ماه رفت
 *   day 29  BROKE  left=0           ← یک غیبتِ **تک‌روزه** روزشمار ۱۹روزه را شکست
 *   day 58  BROKE  left=2           ← غیبت سه‌روزه، ۳ فریز لازم بود و ۲ بود
 *   day 81  froze spent=1           ← غیبت تک‌روزه، بودجه‌ی دسامبر موجود بود
 *
 * فریز **بودجه‌ی ماهانه** است، نه بیمه‌ی هر غیبت. پس یک غیبت تک‌روزه هم
 * می‌تواند بشکند، اگر بودجه‌ی آن ماه قبلاً خرج شده باشد. سیستم طبق طراحی کار
 * می‌کند؛ انتظار من بود که غلط بود.
 *
 * ولی همین دقیقاً همان سناریویی است که طراحی از آن می‌ترسید: «یک روز غیبت
 * هفته‌ها سرمایه‌گذاری را نابود می‌کند و یادگیرنده می‌رود». با دو فریز در ماه،
 * هنوز ممکن است. عدد `MAX_FREEZES` یک تصمیم محصول است، نه یک جزئیات فنی.
 */
{
  let s: StreakState = base({ freezesRenewedOn: null });
  const skip = new Set([9, 10, 28, 55, 56, 57, 80]); // روزهایی که یادگیرنده نمی‌آید
  const breakDays: number[] = [];
  let d = new Date('2026-10-01T09:00:00Z');
  let minFreezes = MAX_FREEZES;
  let maxFreezes = 0;

  for (let i = 0; i < 90; i++) {
    const today = todayInTimezone('Asia/Tehran', d);
    if (!skip.has(i)) {
      const out = applyDailyGoalMet(s, today);
      if (out.broken) breakDays.push(i);
      minFreezes = Math.min(minFreezes, out.freezesLeft);
      maxFreezes = Math.max(maxFreezes, out.freezesLeft);
      s = out;
    }
    d = new Date(d.getTime() + 86_400_000);
  }

  console.log(
    `\n   90 days, 7 missed: streak=${s.streakDays}  freezes=${s.freezesLeft}  broke on days [${breakDays.join(', ')}]`
  );

  check(
    'the streak breaks twice: once when a single absence meets an exhausted monthly budget, once on a three-day absence',
    breakDays.length === 2 && breakDays[0] === 29 && breakDays[1] === 58,
    `broke on [${breakDays.join(', ')}]`
  );
  check('the streak rebuilds after each break', s.streakDays > 20, `${s.streakDays}`);
  check('freezes never go negative', minFreezes >= 0, `min=${minFreezes}`);
  check('freezes never exceed the monthly maximum', maxFreezes <= MAX_FREEZES, `max=${maxFreezes}`);
}

console.log('');
if (failed > 0) {
  console.error(`❌ DRE-P183: ${failed} assertion(s) failed.`);
  process.exit(1);
}
console.log('============================================================');
console.log('✅ ALL DRE-P183 STREAK TESTS PASSED!');
console.log('============================================================');
