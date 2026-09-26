/**
 * dre-p180 — آزمون گروه‌بندی گام‌ها (getStationStepGroups)
 *
 * این سوئیت قاعده‌ی اعتبارسنجی نمی‌آزماید؛ **تابع گروه‌بندی** را می‌آزماید که
 * صفحه‌ی ایستگاه با آن رندر می‌شود. چیزی که باید تضمین شود این است:
 *
 *   هر قلم منتشرشده‌ی یک ایستگاه، دقیقاً **یک بار** روی صفحه ظاهر شود.
 *
 * بدون این تضمین، گروه‌بندی می‌تواند بی‌صدا قلمی را بیندازد (گامی که هیچ‌کس
 * نامش را نبرده) یا دو بار نشان دهد (صورتی که هم لانه شده و هم کارت جدا دارد).
 * هیچ‌یک از دو حالت در بیلد خطا نمی‌دهد — فقط درس را خراب می‌کند.
 */
import {
  getPublishedStations,
  getStationItems,
  getStationStepGroups,
} from '../src/lib/romanian/content';

let failed = 0;

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`[PASS] ${name}`);
  } else {
    failed++;
    console.error(`[FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('============================================================');
console.log('DRE-P180 — STEP GROUPING');
console.log('============================================================\n');

const stations = getPublishedStations();
const withSteps = stations.filter(s => s.stepCount > 0);
const withoutSteps = stations.filter(s => s.stepCount === 0);

check(
  'at least one station defines steps',
  withSteps.length > 0,
  `found ${withSteps.length}`
);

// 1. ایستگاه بدون گام باید آرایه‌ی خالی بدهد تا فهرست تخت رندر شود.
for (const st of withoutSteps) {
  check(
    `station "${st.id}" defines no steps -> empty groups (flat list)`,
    getStationStepGroups(st.id).length === 0
  );
}

for (const st of withSteps) {
  const groups = getStationStepGroups(st.id);
  const { words, phrases } = getStationItems(st.id);

  check(
    `${st.id}: every declared step produced a group`,
    groups.length === st.stepCount,
    `groups=${groups.length} stepCount=${st.stepCount}`
  );

  // 2. هیچ گامی خالی نیست.
  const empty = groups.filter(g => g.itemCount === 0).map(g => g.step.id);
  check(`${st.id}: no empty step`, empty.length === 0, `empty: ${empty.join(', ')}`);

  // 3. مجموع = کل ایستگاه. اگر قلمی stepId نداشته باشد اینجا لو می‌رود.
  const summed = groups.reduce((n, g) => n + g.itemCount, 0);
  check(
    `${st.id}: step item counts sum to the station total`,
    summed === st.totalCount,
    `summed=${summed} total=${st.totalCount}`
  );

  // 4. هر قلم دقیقاً یک بار — کارت، لانه‌شده، یا عبارت.
  const seen = new Map<string, number>();
  const bump = (id: string) => seen.set(id, (seen.get(id) || 0) + 1);
  for (const g of groups) {
    for (const card of g.words) {
      bump(card.word.id);
      for (const dep of card.nested) bump(dep.id);
    }
    for (const p of g.phrases) bump(p.id);
  }

  const expected = [...words.map(w => w.id), ...phrases.map(p => p.id)];
  const missing = expected.filter(id => !seen.has(id));
  const duplicated = [...seen.entries()].filter(([, n]) => n > 1).map(([id, n]) => `${id}×${n}`);
  const extra = [...seen.keys()].filter(id => !expected.includes(id));

  check(`${st.id}: no item missing from the step groups`, missing.length === 0, missing.join(', '));
  check(`${st.id}: no item rendered twice`, duplicated.length === 0, duplicated.join(', '));
  check(`${st.id}: no item invented`, extra.length === 0, extra.join(', '));

  // 5. یک صورت لانه‌شده هرگز `shownApartFrom` ندارد، و برعکس.
  for (const g of groups) {
    for (const card of g.words) {
      if (card.shownApartFrom) {
        check(
          `${st.id}/${g.step.id}: "${card.word.id}" shown apart from "${card.shownApartFrom.id}" is a real formOf`,
          card.word.formOf === card.shownApartFrom.id,
          `formOf=${card.word.formOf}`
        );
      }
      for (const dep of card.nested) {
        check(
          `${st.id}/${g.step.id}: nested "${dep.id}" is a formOf of its card word`,
          dep.formOf === card.word.id
        );
        check(
          `${st.id}/${g.step.id}: nested "${dep.id}" shares the card's step`,
          dep.stepId === card.word.stepId
        );
      }
    }
  }
}

// 6. حالت مشخصی که کل این طراحی به‌خاطرش لازم شد: شش پی‌بست ضمایر.
//    صورت ضمایر فاعلی‌اند ولی در گام دوم آموزش داده می‌شوند، پس باید کارت
//    مستقل داشته باشند و نه لانه‌شده در گام اول.
const CLITICS = ['w-core-ma', 'w-core-imi', 'w-core-te', 'w-core-iti', 'w-core-ne', 'w-core-va'];
const pronounGroups = getStationStepGroups('core-pronouns');
const cliticStep = pronounGroups.find(g => g.step.id === 'pron-2-clitics');

check('core-pronouns declares step "pron-2-clitics"', !!cliticStep);

if (cliticStep) {
  const cardIds = cliticStep.words.map(c => c.word.id);
  for (const id of CLITICS) {
    const card = cliticStep.words.find(c => c.word.id === id);
    check(`clitic "${id}" has its own card in pron-2-clitics`, !!card, `cards: ${cardIds.join(', ')}`);
    if (card) {
      check(
        `clitic "${id}" names the subject pronoun it is a form of`,
        !!card.shownApartFrom,
        'shownApartFrom is empty, so the learner sees no link back to the head'
      );
    }
  }

  const step1 = pronounGroups.find(g => g.step.id === 'pron-1-subject');
  const leakedIntoStep1 = (step1?.words || [])
    .flatMap(c => c.nested.map(d => d.id))
    .filter(id => CLITICS.includes(id));
  check(
    'no clitic leaks into pron-1-subject as a nested form',
    leakedIntoStep1.length === 0,
    leakedIntoStep1.join(', ')
  );
}

// 7. مرز پرداخت: تنها ایستگاه رایگان باید اولین ایستگاه ترتیب آموزشی باشد.
const free = stations.filter(s => s.isFree);
check('exactly one free station', free.length === 1, `free: ${free.map(s => s.id).join(', ')}`);
check(
  'the free station is first in the teaching order',
  free.length === 1 && stations[0].id === free[0].id,
  `first=${stations[0]?.id} free=${free[0]?.id}`
);

console.log('');
if (failed > 0) {
  console.error(`❌ DRE-P180: ${failed} assertion(s) failed.`);
  process.exit(1);
}
console.log('============================================================');
console.log('✅ ALL DRE-P180 GROUPING TESTS PASSED!');
console.log('============================================================');
