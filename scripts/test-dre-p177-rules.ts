/**
 * dre-p177 — تست‌های گام‌ها (V36 · V37 · V38) و استثنای «فرمول ثابت» در V12.
 *
 * هر تست قرمز داده‌ی واقعی رجیستری را جهش می‌دهد و تابع واقعی
 * validateRomanianContent را صدا می‌زند. هیچ منطقی محلی بازپیاده‌سازی نمی‌شود —
 * درس dre-p164: ادعایی که نتواند شکست بخورد، تست نیست.
 */

import {
  validateRomanianContent,
  ValidationError,
  RomanianValidationContext,
} from '../src/lib/romanian/validator';
import {
  CORE_AUDIO,
  ALL_WORDS,
  ALL_VERBS,
  ALL_GRAPHEMES,
  ALL_PHRASES,
  ALL_DIALOGUES,
  ALL_DOMAINS,
} from '../src/content/romanian/registry';

type FullContext = Required<Pick<RomanianValidationContext,
  'phrases' | 'words' | 'verbs' | 'graphemes' | 'dialogues' | 'domains' | 'coreAudio'>> &
  RomanianValidationContext;

function getCleanBaseContext(): FullContext {
  return {
    phrases: JSON.parse(JSON.stringify(ALL_PHRASES)),
    words: JSON.parse(JSON.stringify(ALL_WORDS)),
    verbs: JSON.parse(JSON.stringify(ALL_VERBS)),
    graphemes: JSON.parse(JSON.stringify(ALL_GRAPHEMES)),
    dialogues: JSON.parse(JSON.stringify(ALL_DIALOGUES)),
    domains: JSON.parse(JSON.stringify(ALL_DOMAINS)),
    coreAudio: JSON.parse(JSON.stringify(CORE_AUDIO)),
  };
}

let passedAll = true;

function runTest(
  name: string,
  fn: () => { expectedRule?: string; errors: ValidationError[]; shouldPass: boolean }
) {
  console.log(`\n------------------------------------------------------------`);
  console.log(`RUNNING: ${name}`);
  console.log(`------------------------------------------------------------`);
  const result = fn();
  if (result.shouldPass) {
    if (result.errors.length === 0) {
      console.log(`[PASS GREEN TEST] Passed with 0 errors as expected.`);
    } else {
      passedAll = false;
      console.error(`[FAIL GREEN TEST] Expected 0 errors, received ${result.errors.length}:`);
      for (const e of result.errors) console.error(`  - [${e.rule}] (${e.phraseId}): ${e.message}`);
    }
  } else {
    const matching = result.errors.filter(e => e.rule === result.expectedRule);
    if (matching.length > 0) {
      console.log(`[PASS RED TEST] Correctly caught expected rule [${result.expectedRule}]:`);
      for (const e of matching.slice(0, 3)) console.log(`  - ${e.message}`);
    } else {
      passedAll = false;
      console.error(`[FAIL RED TEST] Did not find [${result.expectedRule}]. All errors (${result.errors.length}):`);
      for (const e of result.errors.slice(0, 5)) console.error(`  - [${e.rule}] ${e.message}`);
    }
  }
}

const STATION_WITH_STEPS = 'core-greetings';

function stationOf(ctx: FullContext, id: string) {
  for (const d of ctx.domains) {
    const st = (d.stations || []).find(s => s.id === id);
    if (st) return st;
  }
  throw new Error(`Fixture missing: station ${id}`);
}

// ============================================================================

runTest('GREEN: the live registry is clean under V12, V36, V37 and V38', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx).filter(
    e => e.rule === 'V12' || e.rule === 'V36' || e.rule === 'V37' || e.rule === 'V38'
  );
  return { errors, shouldPass: true };
});

// --- V36 ---

runTest('RED V36: an entry in a stepped station with no stepId', () => {
  const ctx = getCleanBaseContext();
  const w = ctx.words.find(x => x.stationId === STATION_WITH_STEPS && x.stepId);
  if (!w) throw new Error('Fixture missing: no stepped word in core-greetings.');
  delete (w as { stepId?: string }).stepId;
  return { expectedRule: 'V36', errors: validateRomanianContent(ctx), shouldPass: false };
});

runTest('RED V36: a stepId belonging to a DIFFERENT station is not accepted', () => {
  const ctx = getCleanBaseContext();
  const w = ctx.words.find(x => x.stationId === STATION_WITH_STEPS && x.stepId);
  const other = stationOf(ctx, 'core-numbers');
  if (!w || !other.steps?.length) throw new Error('Fixture missing.');
  w.stepId = other.steps[0].id;   // a real step id — but of the wrong station
  return { expectedRule: 'V36', errors: validateRomanianContent(ctx), shouldPass: false };
});

// --- V37 ---

runTest('RED V37: a free station sitting after a paid one', () => {
  const ctx = getCleanBaseContext();
  const time = stationOf(ctx, 'core-time');
  const greet = stationOf(ctx, STATION_WITH_STEPS);
  if (!greet.isFree) throw new Error('Fixture broken: core-greetings should be free.');
  time.isFree = true;                    // free at order 3, paid at order 2 -> striped
  return { expectedRule: 'V37', errors: validateRomanianContent(ctx), shouldPass: false };
});

runTest('GREEN V37: extending free to the SECOND station keeps the prefix intact', () => {
  const ctx = getCleanBaseContext();
  stationOf(ctx, 'core-numbers').isFree = true;   // orders 1 and 2 free
  const errors = validateRomanianContent(ctx).filter(e => e.rule === 'V37');
  return { errors, shouldPass: true };
});

// --- V38 ---

runTest('RED V38: emptying a step below the minimum', () => {
  const ctx = getCleanBaseContext();
  const st = stationOf(ctx, STATION_WITH_STEPS);
  const victim = st.steps![0].id;
  const target = st.steps![1].id;
  for (const p of ctx.phrases) if (p.stepId === victim) p.stepId = target;
  for (const w of ctx.words) if (w.stepId === victim) w.stepId = target;
  return { expectedRule: 'V38', errors: validateRomanianContent(ctx), shouldPass: false };
});

// --- V12, the fixed-formula declaration ---

runTest('RED V12: removing taughtAsFormula from "Vă rog." reopens the order violation', () => {
  const ctx = getCleanBaseContext();
  const p = ctx.phrases.find(x => x.id === 'p-core-va-rog');
  if (!p) throw new Error('Fixture missing: p-core-va-rog.');
  if (!p.taughtAsFormula) throw new Error('Fixture broken: it should be declared.');
  delete (p as { taughtAsFormula?: unknown }).taughtAsFormula;
  return { expectedRule: 'V12', errors: validateRomanianContent(ctx), shouldPass: false };
});

runTest('RED V12: the declaration must be TRUE — a wrong analysedAt is caught', () => {
  const ctx = getCleanBaseContext();
  const p = ctx.phrases.find(x => x.id === 'p-core-va-rog');
  if (!p?.taughtAsFormula) throw new Error('Fixture missing: p-core-va-rog declaration.');
  // `vă` is analysed in core-pronouns; naming core-time instead is a false claim
  p.taughtAsFormula = { reason: p.taughtAsFormula.reason, analysedAt: ['core-time'] };
  return { expectedRule: 'V12', errors: validateRomanianContent(ctx), shouldPass: false };
});

runTest('RED V12: an empty analysedAt is not a free pass either', () => {
  const ctx = getCleanBaseContext();
  const p = ctx.phrases.find(x => x.id === 'p-core-ma-numesc');
  if (!p?.taughtAsFormula) throw new Error('Fixture missing: p-core-ma-numesc declaration.');
  p.taughtAsFormula = { reason: p.taughtAsFormula.reason, analysedAt: [] };
  return { expectedRule: 'V12', errors: validateRomanianContent(ctx), shouldPass: false };
});

runTest('GREEN V12: a phrase whose words all come earlier needs no declaration', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx).filter(e => e.rule === 'V12');
  return { errors, shouldPass: true };
});

console.log(`\n============================================================`);
if (passedAll) {
  console.log(`ALL DRE-P177 TESTS PASSED SUCCESSFULLY!`);
  console.log(`============================================================`);
  process.exit(0);
} else {
  console.error(`SOME TESTS IN DRE-P177 SUITE REPORTED DISCREPANCIES!`);
  console.log(`============================================================`);
  process.exit(1);
}
