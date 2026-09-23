import {
  validateRomanianContent,
  ValidationError,
  RomanianValidationContext,
} from '../src/lib/romanian/validator';
import {
  SEED_DOMAINS,
  SEED_WORDS,
  SEED_VERBS,
  SEED_GRAPHEMES,
  SEED_DIALOGUES,
} from '../src/content/romanian/seed';
import {
  FOUNDATION_WORDS,
  FOUNDATION_GRAPHEMES,
} from '../src/content/romanian/foundation';
import { CORE_VERBS } from '../src/content/romanian/core-verbs';
import { PILOT_PHRASES } from '../src/content/romanian/pilot';
import { STAGE0_PHRASES } from '../src/content/romanian/stage0';
import { RomanianGrapheme } from '../src/lib/romanian/types';

function getCleanBaseContext(): RomanianValidationContext {
  return {
    phrases: JSON.parse(JSON.stringify([...PILOT_PHRASES, ...STAGE0_PHRASES])),
    words: JSON.parse(JSON.stringify([...SEED_WORDS, ...FOUNDATION_WORDS])),
    verbs: JSON.parse(JSON.stringify([...SEED_VERBS, ...CORE_VERBS])),
    graphemes: JSON.parse(JSON.stringify([...SEED_GRAPHEMES, ...FOUNDATION_GRAPHEMES])),
    dialogues: JSON.parse(JSON.stringify(SEED_DIALOGUES)),
    domains: JSON.parse(JSON.stringify(SEED_DOMAINS)),
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
      console.error(
        `[FAIL GREEN TEST] Expected 0 errors, but received ${result.errors.length}:`
      );
      for (const e of result.errors) {
        console.error(`  - [${e.rule}] ${e.message}`);
      }
    }
  } else {
    const matchingErrors = result.errors.filter(e => e.rule === result.expectedRule);
    if (matchingErrors.length > 0) {
      console.log(
        `[PASS RED TEST] Correctly caught expected rule [${result.expectedRule}]:`
      );
      for (const e of matchingErrors) {
        console.log(`  - ${e.message}`);
      }
    } else {
      passedAll = false;
      console.error(
        `[FAIL RED TEST] Expected rule [${result.expectedRule}], but got:`,
        result.errors
      );
    }
  }
}

console.log('============================================================');
console.log('DRE-P158 RULES SUITE (V22 & V23 AUDIO VALIDATION)');
console.log('============================================================');

// 0. Base Clean Context Green Test
runTest('Green Test: Clean Base Dataset (Seed + Foundation + Core Verbs)', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 1. Red Test V22-A: Published grapheme missing audio
runTest('Red Test V22-A: Published grapheme completely missing audio clips fails V22', () => {
  const ctx = getCleanBaseContext();
  const g = ctx.graphemes!.find(x => x.id === 'g-01-a')!;
  g.status = 'published';
  delete g.audio;
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V22', errors, shouldPass: false };
});

// 2. Red Test V22-B: Published grapheme with only 1 voice
runTest('Red Test V22-B: Published grapheme with only one voice fails V22', () => {
  const ctx = getCleanBaseContext();
  const g = ctx.graphemes!.find(x => x.id === 'g-01-a')!;
  g.status = 'published';
  g.audio = [
    {
      voice: 'Aoede',
      src: '/audio/romanian/foundation/g-01-a-aoede.mp3',
      durationMs: 1280,
    },
  ];
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V22', errors, shouldPass: false };
});

// 3. Red Test V22-C: Published grapheme with empty src
runTest('Red Test V22-C: Published grapheme with empty src fails V22', () => {
  const ctx = getCleanBaseContext();
  const g = ctx.graphemes!.find(x => x.id === 'g-01-a')!;
  g.status = 'published';
  g.audio = [
    { voice: 'Aoede', src: '', durationMs: 1200 },
    { voice: 'Puck', src: '/audio/romanian/foundation/g-01-a-puck.mp3', durationMs: 1300 },
  ];
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V22', errors, shouldPass: false };
});

// 4. Red Test V22-D: Published grapheme with invalid durationMs (<= 0)
runTest('Red Test V22-D: Published grapheme with durationMs <= 0 fails V22', () => {
  const ctx = getCleanBaseContext();
  const g = ctx.graphemes!.find(x => x.id === 'g-01-a')!;
  g.status = 'published';
  g.audio = [
    { voice: 'Aoede', src: '/audio/romanian/foundation/g-01-a-aoede.mp3', durationMs: 0 },
    { voice: 'Puck', src: '/audio/romanian/foundation/g-01-a-puck.mp3', durationMs: 1300 },
  ];
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V22', errors, shouldPass: false };
});

// 5. Green Test V22-E: Published grapheme with 2 valid distinct voices passes V22
runTest('Green Test V22-E: Published grapheme with 2 distinct voices and valid durations passes V22', () => {
  const ctx = getCleanBaseContext();
  const g = ctx.graphemes!.find(x => x.id === 'g-01-a')!;
  g.status = 'published';
  g.audio = [
    { voice: 'Aoede', src: '/audio/romanian/foundation/g-01-a-aoede.mp3', durationMs: 1280 },
    { voice: 'Puck', src: '/audio/romanian/foundation/g-01-a-puck.mp3', durationMs: 2240 },
  ];
  const errors = validateRomanianContent(ctx);
  const v22Errors = errors.filter(e => e.rule === 'V22');
  return { errors: v22Errors, shouldPass: true };
});

// 6. Red Test V23-A: Audio clip referencing non-existent file on disk fails V23
runTest('Red Test V23-A: Audio clip referencing non-existent file on disk fails V23', () => {
  const ctx = getCleanBaseContext();
  const g = ctx.graphemes!.find(x => x.id === 'g-01-a')!;
  g.audio = [
    { voice: 'Aoede', src: '/audio/romanian/foundation/non-existent-audio-xyz.mp3', durationMs: 1200 },
  ];
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V23', errors, shouldPass: false };
});

// 7. Green Test V23-B: All audio clips reference real existing files on disk
runTest('Green Test V23-B: All audio clips in base context reference real files on disk', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  const v23Errors = errors.filter(e => e.rule === 'V23');
  return { errors: v23Errors, shouldPass: true };
});

console.log('\n============================================================');
if (passedAll) {
  console.log('✅ ALL DRE-P158 RULE TESTS PASSED!');
  process.exit(0);
} else {
  console.error('❌ SOME DRE-P158 RULE TESTS FAILED!');
  process.exit(1);
}
