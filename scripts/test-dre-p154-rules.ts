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
import { PILOT_PHRASES } from '../src/content/romanian/pilot';
import { STAGE0_PHRASES } from '../src/content/romanian/stage0';
import { RomanianWord, RomanianGrapheme } from '../src/lib/romanian/types';

function getCleanBaseContext(): RomanianValidationContext {
  return {
    phrases: JSON.parse(JSON.stringify([...PILOT_PHRASES, ...STAGE0_PHRASES])),
    words: JSON.parse(JSON.stringify([...SEED_WORDS, ...FOUNDATION_WORDS])),
    verbs: JSON.parse(JSON.stringify(SEED_VERBS)),
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
        console.log(`  - [${e.rule}] (${e.phraseId}): ${e.message}`);
      }
    } else {
      passedAll = false;
      console.error(
        `[FAIL RED TEST] Did NOT catch expected rule [${result.expectedRule}]. Total errors: ${result.errors.length}`
      );
      for (const e of result.errors) {
        console.error(`  - [${e.rule}] (${e.phraseId}): ${e.message}`);
      }
    }
  }
}

console.log('============================================================');
console.log('DORVIA DRE-P154 RULES VALIDATION TEST SUITE (RED & GREEN)');
console.log('============================================================');

// --- RED TESTS ---

// 1. Red Test V17: Duplicate entity ID between SEED_WORDS and FOUNDATION_WORDS
runTest('RED TEST V17: Duplicate ID across combined dataset', () => {
  const ctx = getCleanBaseContext();
  // Introduce duplicate ID: a foundation word duplicating seed word w-cont
  const dupWord: RomanianWord = {
    ...ctx.words![0],
    id: 'w-ban', // duplicate of existing w-ban
  };
  ctx.words!.push(dupWord);
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V17', errors, shouldPass: false };
});

// 2. Red Test V18: Grapheme references non-existent exampleWordId
runTest('RED TEST V18: Grapheme references non-existent exampleWordId', () => {
  const ctx = getCleanBaseContext();
  const targetGrapheme = ctx.graphemes!.find(g => g.id === 'g-01-a')!;
  targetGrapheme.exampleWordId = 'w-non-existent-word-xyz';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V18', errors, shouldPass: false };
});

// 3. Red Test V19: Display form does not contain lesson grapheme (lesson 23 ban vs bani)
runTest('RED TEST V19: Lesson 23 exampleForm set to "ban" instead of "bani" fails pattern /i$/', () => {
  const ctx = getCleanBaseContext();
  const g23 = ctx.graphemes!.find(g => g.id === 'g-23-i-final')!;
  // Deliberately set to 'ban' (which does not end with 'i')
  g23.exampleForm = 'ban';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V19', errors, shouldPass: false };
});

// 4. Red Test V19 (Mandatory matchPattern): Grapheme without matchPattern fails V19
runTest('RED TEST V19 (dre-p155): Grapheme missing required matchPattern fails V19', () => {
  const ctx = getCleanBaseContext();
  const targetGrapheme = ctx.graphemes!.find(g => g.id === 'g-01-a')!;
  // Deliberately delete matchPattern
  delete (targetGrapheme as any).matchPattern;
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V19', errors, shouldPass: false };
});

// --- GREEN TESTS ---

// 5. Green Test 1: Clean combined dataset (SEED + FOUNDATION) passes strictly with 0 errors
runTest('GREEN TEST 1: Full combined dataset with 24 foundation words and graphemes stays green', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 6. Green Test 2: Lesson 23 with exampleForm "bani" correctly satisfies pattern /i$/
runTest('GREEN TEST 2: Lesson 23 with exampleForm "bani" satisfies pattern /i$/ with 0 errors', () => {
  const ctx = getCleanBaseContext();
  const g23 = ctx.graphemes!.find(g => g.id === 'g-23-i-final')!;
  // Verify g23 has exampleForm === 'bani' and matchPattern === 'i$'
  if (g23.exampleForm !== 'bani' || g23.matchPattern !== 'i$') {
    throw new Error(`g23 fixture modified unexpectedly`);
  }
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

console.log('\n============================================================');
if (passedAll) {
  console.log('🎉 ALL 4 RED TESTS AND 2 GREEN TESTS PASSED STRICTLY!');
  console.log('============================================================\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED IN DRE-P154/P155 TEST SUITE.');
  console.log('============================================================\n');
  process.exit(1);
}
