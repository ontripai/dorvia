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
import { PILOT_PHRASES } from '../src/content/romanian/pilot';
import { STAGE0_PHRASES } from '../src/content/romanian/stage0';
import { RomanianPhrase } from '../src/lib/romanian/types';

function getCleanBaseContext(): RomanianValidationContext {
  return {
    phrases: JSON.parse(JSON.stringify([...PILOT_PHRASES, ...STAGE0_PHRASES])),
    words: JSON.parse(JSON.stringify(SEED_WORDS)),
    verbs: JSON.parse(JSON.stringify(SEED_VERBS)),
    graphemes: JSON.parse(JSON.stringify(SEED_GRAPHEMES)),
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
console.log('DORVIA DRE-P153 RULES VALIDATION TEST SUITE (RED & GREEN)');
console.log('============================================================');

// --- RED TESTS ---

// 1. Red Test V15: Category of a core phrase changed to 'banking'
runTest("RED TEST V15: Change category of a 'core' phrase to 'banking' (not in core.categories)", () => {
  const ctx = getCleanBaseContext();
  const phrase = ctx.phrases!.find(p => p.id === 'everyday-001')!;
  phrase.domain = 'core';
  phrase.category = 'banking'; // banking is NOT in core.categories
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V15', errors, shouldPass: false };
});

// 2. Red Test V16: maxItems of domain 'core' temporarily set to 5
runTest("RED TEST V16: Set maxItems of domain 'core' to 5 (currently has 35 published items)", () => {
  const ctx = getCleanBaseContext();
  const coreDomain = ctx.domains!.find(d => d.id === 'core')!;
  coreDomain.maxItems = 5;
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V16', errors, shouldPass: false };
});

// 3. Red Test V14: Republish healthcare-001 with common-usage source in must-be-sourced domain
runTest("RED TEST V14: Republish healthcare-001 (common-usage) in must-be-sourced healthcare domain", () => {
  const ctx = getCleanBaseContext();
  const phrase = ctx.phrases!.find(p => p.id === 'healthcare-001')!;
  phrase.status = 'published'; // Force published in must-be-sourced domain without official source
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V14', errors, shouldPass: false };
});

// --- GREEN TESTS ---

// 4. Green Test 1: transport-001 with category: 'transport' and domain: 'core'
runTest("GREEN TEST 1: transport-001 with category: 'transport' and domain: 'core' stays green", () => {
  const ctx = getCleanBaseContext();
  const phrase = ctx.phrases!.find(p => p.id === 'transport-001')!;
  phrase.category = 'transport';
  phrase.domain = 'core';
  const errors = validateRomanianContent(ctx).filter(e => e.phraseId === 'transport-001');
  return { errors, shouldPass: true };
});

// 5. Green Test 2: Phrase without domain (domain undefined) does not trigger V15
runTest("GREEN TEST 2: Phrase with no domain specified does not trigger V15", () => {
  const ctx = getCleanBaseContext();
  const testPhrase: RomanianPhrase = {
    id: 'legacy-unmapped-phrase',
    slug: 'legacy-unmapped',
    category: 'banking',
    level: 'beginner',
    register: 'formal',
    intendedUse: 'produce',
    text: {
      ro: 'Test fără domeniu.',
      en: 'Test without domain.',
      fa: 'آزمون بدون حوزه.',
    },
    source: {
      kind: 'common-usage',
      label: 'test',
    },
    status: 'published',
    isFree: true,
  };
  delete (testPhrase as Partial<RomanianPhrase>).domain;
  ctx.phrases!.push(testPhrase);
  const errors = validateRomanianContent(ctx).filter(
    e => e.phraseId === 'legacy-unmapped-phrase' && e.rule === 'V15'
  );
  return { errors, shouldPass: true };
});

console.log('\n============================================================');
if (passedAll) {
  console.log('🎉 ALL 3 RED TESTS AND 2 GREEN TESTS PASSED STRICTLY!');
  console.log('============================================================\n');
  process.exit(0);
} else {
  console.error('❌ ONE OR MORE TESTS FAILED.');
  console.log('============================================================\n');
  process.exit(1);
}
