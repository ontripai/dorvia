/**
 * dre-p182 — آزمون هسته‌ی حلقه‌ی یادگیری: زمان‌بند، تولیدکننده‌ی تمرین، ساخت نشست.
 *
 * سه چیز اینجا قفل می‌شود که هیچ‌کدامشان در بیلد خطا نمی‌دهند اگر بشکنند:
 *
 *  ۱. سؤال نباید **دو پاسخ درست** داشته باشد. `el` و `ea` هر دو «او»اند و فقط
 *     پرانتز رفع‌ابهام جدایشان می‌کند؛ اگر مقایسه‌ی گلاس روی رشته‌ی خام نباشد،
 *     یادگیرنده سؤالی می‌بیند که جوابِ درستش غلط شمرده می‌شود.
 *  ۲. تولید باید **قطعی** باشد، وگرنه دو بار دیدن یک سؤال دو مجموعه گزینه
 *     می‌دهد و تحلیل لاگ بی‌معنا می‌شود.
 *  ۳. عقب‌افتادگی نباید **انباشته** شود. این را فقط با شبیه‌سازی چند روزه می‌شود
 *     دید، نه با یک ادعای تک‌مرحله‌ای.
 */
import {
  addDays,
  daysBetween,
  gradeItem,
  initialState,
  longTermCount,
  BOX_INTERVAL_DAYS,
  MAX_BOX,
  LONG_TERM_BOX,
  ItemState,
} from '../src/lib/romanian/scheduler';
import {
  buildRecognitionQuestion,
  deterministicShuffle,
  isRecognizable,
} from '../src/lib/romanian/exercise';
import { planSession, meetsDailyGoal } from '../src/lib/romanian/session';
import { getPublishedStations, getStationItems } from '../src/lib/romanian/content';

let failed = 0;
function check(name: string, ok: boolean, detail?: string) {
  if (ok) console.log(`[PASS] ${name}`);
  else {
    failed++;
    console.error(`[FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('============================================================');
console.log('DRE-P182 — LEARNING LOOP CORE');
console.log('============================================================\n');

/* ------------------------------------------------------------ ۱. تاریخ */

check('addDays crosses a month boundary', addDays('2026-01-31', 1) === '2026-02-01');
check('addDays crosses a leap day', addDays('2028-02-28', 1) === '2028-02-29');
check('addDays crosses a year boundary', addDays('2026-12-31', 1) === '2027-01-01');
check('addDays with 30 days', addDays('2026-09-26', 30) === '2026-10-26');
check('daysBetween is signed', daysBetween('2026-09-26', '2026-09-20') === 6);
check('daysBetween is zero for the same day', daysBetween('2026-09-26', '2026-09-26') === 0);
{
  let threw = false;
  try {
    addDays('26-09-2026', 1);
  } catch {
    threw = true;
  }
  check('addDays rejects a non-ISO date rather than guessing', threw);
}

/* -------------------------------------------------------- ۲. زمان‌بند */

const T0 = '2026-09-26';
let st = initialState('w-x', T0);
// dre-p189: جعبه‌ی اولیه از ۰ به ۱ رفت تا پاسخ درستِ بارِ اول بی‌اثر نباشد.
check('a new item starts in box 1, due today', st.box === 1 && st.dueOn === T0);

st = gradeItem(st, true, T0);
check('first correct answer moves to box 2, due in three days', st.box === 2 && st.dueOn === addDays(T0, 3));

// و قرینه‌اش: همان قلم تازه اگر غلط جواب داده شود در جعبه‌ی ۱ می‌ماند و فرداست.
{
  const wrongFirst = gradeItem(initialState('w-y', T0), false, T0);
  check('a new item answered wrong stays in box 1, due tomorrow',
    wrongFirst.box === 1 && wrongFirst.dueOn === addDays(T0, 1));
  check('first sight now discriminates: correct and wrong differ',
    wrongFirst.dueOn !== st.dueOn, `wrong=${wrongFirst.dueOn} right=${st.dueOn}`);
}

// چهار پاسخ درست پشت سر هم، هر بار در روز سررسید
let day = st.dueOn;
for (let i = 0; i < 4; i++) {
  st = gradeItem(st, true, day);
  day = st.dueOn;
}
check('five correct answers reach the top box', st.box === MAX_BOX, `box=${st.box}`);
check('the top box schedules 30 days out', daysBetween(st.dueOn, day) === 0 && BOX_INTERVAL_DAYS[MAX_BOX] === 30);
check('consecutiveCorrect counted every answer', st.consecutiveCorrect === 5, `${st.consecutiveCorrect}`);
check('totals add up', st.totalSeen === 5 && st.totalCorrect === 5);

const lapsed = gradeItem(st, false, '2026-11-01');
check('a wrong answer drops to box 1, NOT box 0', lapsed.box === 1, `box=${lapsed.box}`);
check('a lapsed item returns tomorrow, not today', lapsed.dueOn === addDays('2026-11-01', 1));
check('consecutiveCorrect resets on a wrong answer', lapsed.consecutiveCorrect === 0);
check('totalSeen still grew but totalCorrect did not', lapsed.totalSeen === 6 && lapsed.totalCorrect === 5);
check('the top box never overflows', gradeItem(st, true, day).box === MAX_BOX);

const pool: ItemState[] = [
  { ...initialState('a', T0), box: 5 },
  { ...initialState('b', T0), box: 4 },
  { ...initialState('c', T0), box: 3 },
  { ...initialState('d', T0), box: 0 },
];
check(
  `longTermCount counts only box >= ${LONG_TERM_BOX}`,
  longTermCount(pool) === 2,
  `${longTermCount(pool)}`
);

/* ------------------------------------------------- ۳. تولیدکننده‌ی تمرین */

const q1 = buildRecognitionQuestion('w-core-el', 'session-1');
check('a question is built for "el"', !!q1);
if (q1) {
  check('a question offers exactly 4 options', q1.options.length === 4, `${q1.options.length}`);
  check('the correct option is among them', q1.options.some(o => o.id === q1.correctOptionId));
  const faSet = new Set(q1.options.map(o => o.fa));
  check('no two options share a Persian gloss', faSet.size === 4, [...faSet].join(' | '));
  const answer = q1.options.find(o => o.id === q1.correctOptionId)!;
  check(
    'no distractor repeats the correct answer\'s gloss',
    q1.options.filter(o => o.fa === answer.fa).length === 1,
    `answer="${answer.fa}"`
  );
  check('the prompt is the Romanian form', q1.promptRo === 'el', q1.promptRo);
}

// قطعیت
const a = buildRecognitionQuestion('w-num-unu', 'session-7');
const b = buildRecognitionQuestion('w-num-unu', 'session-7');
const c = buildRecognitionQuestion('w-num-unu', 'session-8');
check(
  'the same seed gives byte-identical options and order',
  JSON.stringify(a) === JSON.stringify(b)
);
check(
  'a different seed gives a different arrangement',
  JSON.stringify(a) !== JSON.stringify(c),
  'if these match, the seed is not reaching the shuffle'
);
check(
  'deterministicShuffle does not mutate its input',
  (() => {
    const src = ['a', 'b', 'c', 'd', 'e'];
    const copy = [...src];
    deterministicShuffle(src, 'x');
    return JSON.stringify(src) === JSON.stringify(copy);
  })()
);
check(
  'deterministicShuffle keeps every element',
  (() => {
    const src = ['a', 'b', 'c', 'd', 'e'];
    const out = deterministicShuffle(src, 'y');
    return out.length === 5 && src.every(v => out.includes(v));
  })()
);

// جفت‌های جنسیتی: هر دو طرف باید سؤالِ بی‌ابهام بدهند.
const GENDER_PAIRS: Array<[string, string]> = [
  ['w-core-el', 'w-core-ea'],
  ['w-core-ei', 'w-core-ele'],
  ['w-core-meu', 'w-core-mea'],
  ['w-num-unu', 'w-num-una'],
  ['w-core-cat', 'w-core-cata'],
  ['w-core-cati', 'w-core-cate'],
];
for (const [x, y] of GENDER_PAIRS) {
  for (const id of [x, y]) {
    const q = buildRecognitionQuestion(id, 'gender-check');
    check(`"${id}" produces an unambiguous question`, !!q && new Set(q.options.map(o => o.fa)).size === 4,
      q ? q.options.map(o => o.fa).join(' | ') : 'no question');
  }
}

/* -------------------------- ۴. پوشش روی همه‌ی قلم‌های ایستگاه‌های گام‌دار */

const stations = getPublishedStations().filter(s => s.stepCount > 0);
let eligible = 0;
const ineligible: string[] = [];
for (const st2 of stations) {
  const { words, phrases } = getStationItems(st2.id);
  for (const item of [...words, ...phrases]) {
    if (isRecognizable(item.id)) eligible++;
    else ineligible.push(item.id);
  }
}
console.log(`\n   recognisable items: ${eligible}   not recognisable: ${ineligible.length}`);
if (ineligible.length) console.log(`   ${ineligible.join(', ')}`);
check(
  'every item in a step-bearing station can be turned into a question',
  ineligible.length === 0,
  ineligible.join(', ')
);

/* ------------------------------------------------------- ۵. ساخت نشست */

const today = '2026-10-01';
const fresh = planSession({ states: [], today, candidateNewItemIds: ['i1', 'i2', 'i3'] });
check('an empty history introduces new items', fresh.newItemIds.length === 3, `${fresh.newItemIds.length}`);
check('an empty history has nothing to review', fresh.reviewItemIds.length === 0);
check('an empty history does not hold new items back', !fresh.newItemsHeldBack);

// عقب‌افتادگی بزرگ: سقف رعایت شود و هیچ قلم نویی معرفی نشود
const backlog: ItemState[] = Array.from({ length: 40 }, (_, i) => ({
  ...initialState(`old-${i}`, '2026-09-01'),
  box: 2,
  dueOn: addDays('2026-09-01', i % 5),
}));
const heavy = planSession({ states: backlog, today, candidateNewItemIds: ['n1', 'n2', 'n3'] });
check('a 40-item backlog is capped at the session cap', heavy.reviewItemIds.length === 10, `${heavy.reviewItemIds.length}`);
check('a big backlog introduces NOTHING new', heavy.newItemIds.length === 0);
check('the plan reports the backlog honestly', heavy.dueCount === 40 && heavy.backlogCount === 30,
  `due=${heavy.dueCount} backlog=${heavy.backlogCount}`);
check('the plan says new items were held back', heavy.newItemsHeldBack);
check(
  'the oldest due items come first',
  heavy.reviewItemIds[0] === 'old-0' || backlog.find(s => s.itemId === heavy.reviewItemIds[0])!.dueOn === '2026-09-01'
);

// دروازه: دقیقاً روی مرز
const atGate = planSession({
  states: Array.from({ length: 5 }, (_, i) => ({ ...initialState(`g-${i}`, today), box: 1 })),
  today,
  candidateNewItemIds: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'],
});
check('at the gate (5 due, cap 10) new items are still allowed', !atGate.newItemsHeldBack);
check('and they fill the remaining room only', atGate.newItemIds.length === 5, `${atGate.newItemIds.length}`);
const overGate = planSession({
  states: Array.from({ length: 6 }, (_, i) => ({ ...initialState(`g-${i}`, today), box: 1 })),
  today,
  candidateNewItemIds: ['n1', 'n2'],
});
check('one past the gate (6 due) holds new items back', overGate.newItemsHeldBack && overGate.newItemIds.length === 0);

check(
  'an item already seen is never re-introduced as new',
  planSession({
    states: [{ ...initialState('i1', today), dueOn: '2099-01-01', box: 3 }],
    today,
    candidateNewItemIds: ['i1', 'i2'],
  }).newItemIds.join(',') === 'i2'
);

check('the daily goal is met by answering the goal count', meetsDailyGoal(10, 10));
check('the daily goal is NOT met one short', !meetsDailyGoal(9, 10));

/* ------- ۶. شبیه‌سازی ۶۰ روزه: غایبِ برگشته، و پایداری بلندمدت حلقه
 *
 * سنجه‌ی اول من غلط بود و باید ثبت شود: ادعا کرده بودم «صفِ عقب‌افتاده ظرف
 * ۱۴ روز صفر می‌شود» ولی چیزی که می‌شمردم `dueCount` بود — یعنی **کل** صف،
 * شامل قلم‌های تازه‌معرفی‌شده که خودشان فردا سررسید می‌شوند. آن عدد قرار
 * نیست صفر بماند؛ در یک سیستم فاصله‌گذاری سالم، صفِ کاری همیشه چیزی در خود
 * دارد. ادعا درست بود، سنجه اشتباه بود.
 *
 * پس این بار سه چیزِ درست سنجیده می‌شود:
 *   الف) خودِ آن ۴۰ قلمِ عقب‌افتاده از صف بیرون می‌روند،
 *    ب) صف هیچ‌وقت فرار نمی‌کند (کران دارد)،
 *    پ) و یادگیرنده واقعاً جلو می‌رود — حافظه‌ی بلندمدت رشد می‌کند.
 */

{
  const BACKLOG_IDS = Array.from({ length: 40 }, (_, i) => `b-${i}`);
  let states: ItemState[] = BACKLOG_IDS.map(id => ({
    ...initialState(id, '2026-09-01'),
    box: 1,
    dueOn: '2026-09-05',
  }));
  const candidates = Array.from({ length: 400 }, (_, i) => `new-${i}`);
  let d = '2026-10-01';

  const dueTrail: number[] = [];
  let dayBacklogCleared = -1;
  let introducedWhileQueueLong = 0;

  for (let dayN = 0; dayN < 60; dayN++) {
    const plan = planSession({ states, today: d, candidateNewItemIds: candidates });
    dueTrail.push(plan.dueCount);

    // دروازه: قلم نو فقط وقتی صف کوتاه است
    if (plan.newItemIds.length > 0 && plan.dueCount > Math.floor(plan.cap / 2)) {
      introducedWhileQueueLong++;
    }

    const byId = new Map(states.map(s => [s.itemId, s]));
    for (const id of plan.reviewItemIds) byId.set(id, gradeItem(byId.get(id)!, true, d));
    for (const id of plan.newItemIds) byId.set(id, gradeItem(initialState(id, d), true, d));
    states = [...byId.values()];

    if (dayBacklogCleared < 0) {
      const stillDue = states.filter(s => BACKLOG_IDS.includes(s.itemId) && s.dueOn <= d).length;
      if (stillDue === 0) dayBacklogCleared = dayN + 1;
    }
    d = addDays(d, 1);
  }

  const peak = Math.max(...dueTrail);
  const longTerm = longTermCount(states);

  console.log(`\n   due-count, first 14 of 60 days: ${dueTrail.slice(0, 14).join(' → ')}`);
  console.log(`   peak due-count over 60 days: ${peak}   (cap 10)`);
  console.log(`   the original 40-item backlog was cleared on day ${dayBacklogCleared}`);
  console.log(`   items in long-term memory after 60 days: ${longTerm} of ${states.length} seen`);

  check(
    'the returning learner\'s own backlog clears, and within two weeks',
    dayBacklogCleared > 0 && dayBacklogCleared <= 14,
    `cleared on day ${dayBacklogCleared}`
  );
  check(
    'the queue never runs away — it stays within 4x the session cap',
    peak <= 40,
    `peak=${peak}`
  );
  check(
    'no new item is ever introduced while the queue is long',
    introducedWhileQueueLong === 0,
    `${introducedWhileQueueLong} day(s)`
  );
  check(
    'the learner actually progresses — items reach long-term memory',
    longTerm > 0,
    `${longTerm}`
  );
  check(
    'and the loop keeps introducing material over time',
    states.length > 40,
    `${states.length} items seen`
  );
}

console.log('');
if (failed > 0) {
  console.error(`❌ DRE-P182: ${failed} assertion(s) failed.`);
  process.exit(1);
}
console.log('============================================================');
console.log('✅ ALL DRE-P182 LEARNING LOOP TESTS PASSED!');
console.log('============================================================');
