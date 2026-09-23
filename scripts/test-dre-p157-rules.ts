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
import { RomanianVerb } from '../src/lib/romanian/types';

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
console.log('DRE-P157 RULES SUITE (V20 & V21 VERB VALIDATION)');
console.log('============================================================');

// 0. Base Clean Context Green Test
runTest('Green Test: Clean Base Dataset (Seed + Foundation + Core Verbs)', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 1. Red Test V20-A: Published verb missing participiu
runTest('Red Test V20-A: Published verb missing participiu', () => {
  const ctx = getCleanBaseContext();
  const verb = ctx.verbs!.find(v => v.id === 'v-a-fi')!;
  delete (verb as any).participiu;
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V20', errors, shouldPass: false };
});

// 2. Red Test V20-B: Published verb missing conjunctiv person
runTest('Red Test V20-B: Published verb missing conjunctiv person (e.g. tu)', () => {
  const ctx = getCleanBaseContext();
  const verb = ctx.verbs!.find(v => v.id === 'v-a-fi')!;
  verb.conjugation.conjunctiv!.tu = '';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V20', errors, shouldPass: false };
});

// 3. Green Test V20-C: Draft verb with missing conjunctiv persons does not trigger V20
runTest('Green Test V20-C: Draft defective verb (a trebui) does not trigger V20', () => {
  const ctx = getCleanBaseContext();
  // v-core-a-trebui has status: 'draft' and empty persons in conjunctiv
  const trebuiVerb = ctx.verbs!.find(v => v.id === 'v-core-a-trebui')!;
  trebuiVerb.status = 'draft';
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 4. Red Test V21-A: Stored form contains 'să'
runTest("Red Test V21-A: Stored conjunctiv form contains 'să'", () => {
  const ctx = getCleanBaseContext();
  const verb = ctx.verbs!.find(v => v.id === 'v-core-a-putea')!;
  verb.conjugation.conjunctiv!.el = 'să poată';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V21', errors, shouldPass: false };
});

// 5. Red Test V21-B: Stored form contains hyphen
runTest("Red Test V21-B: Stored form contains hyphen (e.g. enclitic ‑s or fostu‑)", () => {
  const ctx = getCleanBaseContext();
  const verb = ctx.verbs!.find(v => v.id === 'v-core-a-fi')!;
  verb.participiu = 'fostu‑';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V21', errors, shouldPass: false };
});

// 6. Red Test V21-C: Stored form contains HTML entity
runTest("Red Test V21-C: Stored form contains HTML entity (e.g. &#x2011;)", () => {
  const ctx = getCleanBaseContext();
  const verb = ctx.verbs!.find(v => v.id === 'v-core-a-merge')!;
  verb.conjugation.prezent.eu = 'merg&#x2011;';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V21', errors, shouldPass: false };
});

// 7. Red Test V21-D: Stored form contains whitespace
runTest("Red Test V21-D: Stored form contains whitespace (e.g. 'vor besc')", () => {
  const ctx = getCleanBaseContext();
  const verb = ctx.verbs!.find(v => v.id === 'v-core-a-vorbi')!;
  verb.conjugation.prezent.eu = 'vor besc';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V21', errors, shouldPass: false };
});

// 8. Green Test V21-E: Core verbs all have pure forms
runTest("Green Test V21-E: All 12 core verbs pass V21 purity check", () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  const v21Errors = errors.filter(e => e.rule === 'V21');
  return { errors: v21Errors, shouldPass: true };
});

console.log('\n============================================================');
if (passedAll) {
  console.log('✅ ALL DRE-P157 RULE TESTS PASSED!');
  process.exit(0);
} else {
  console.error('❌ SOME DRE-P157 RULE TESTS FAILED!');
  process.exit(1);
}
