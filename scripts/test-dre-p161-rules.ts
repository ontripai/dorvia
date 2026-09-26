import {
  validateRomanianContent,
  ValidationError,
  RomanianValidationContext,
} from '../src/lib/romanian/validator';
import {
  ALL_WORDS,
  ALL_VERBS,
  ALL_GRAPHEMES,
  ALL_PHRASES,
  ALL_DIALOGUES,
  ALL_DOMAINS,
} from '../src/content/romanian/registry';

function getCleanBaseContext(): RomanianValidationContext {
  return {
    phrases: JSON.parse(JSON.stringify(ALL_PHRASES)),
    words: JSON.parse(JSON.stringify(ALL_WORDS)),
    verbs: JSON.parse(JSON.stringify(ALL_VERBS)),
    graphemes: JSON.parse(JSON.stringify(ALL_GRAPHEMES)),
    dialogues: JSON.parse(JSON.stringify(ALL_DIALOGUES)),
    domains: JSON.parse(JSON.stringify(ALL_DOMAINS)),
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
        `[FAIL RED TEST] Expected rule [${result.expectedRule}] was NOT triggered! All errors:`,
        result.errors
      );
    }
  }
}

console.log('============================================================');
console.log('DRE-P161 RULES SUITE (V13 STATION HIERARCHY & V11 PRONOUN SCOPING)');
console.log('============================================================');

// 1. Green Test: Clean Base Dataset
runTest('Green Test: Clean Base Dataset passes V1 to V25', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 2. Red Test V13: Word referencing non-existent stationId fails V13
runTest('Red Test V13: Word referencing non-existent stationId fails V13', () => {
  const ctx = getCleanBaseContext();
  ctx.words![0].stationId = 'core-nonexistent-station';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V13', errors, shouldPass: false };
});

// 3. Red Test V13: Phrase referencing non-existent stationId fails V13
runTest('Red Test V13: Phrase referencing non-existent stationId fails V13', () => {
  const ctx = getCleanBaseContext();
  ctx.phrases![0].stationId = 'core-invalid-station';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V13', errors, shouldPass: false };
});

// 4. Green Test V13: Word with valid stationId passes V13
runTest('Green Test V13: Word with valid stationId ("core-pronouns") passes V13', () => {
  const ctx = getCleanBaseContext();
  ctx.words![0].stationId = 'core-pronouns';
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 5. Green Test V11: Word with pos: "pronoun" without gender/definiteForm passes V11
runTest('Green Test V11: Published pronoun does not require noun gender or definiteForm', () => {
  const ctx = getCleanBaseContext();
  // Add a test pronoun with pos: 'pronoun' and status: 'published'
  ctx.words!.push({
    id: 'w-test-pronoun',
    lemma: 'test-pronoun',
    pos: 'pronoun',
    translations: { en: 'unique-test-pronoun', fa: 'من-تست' },
    domains: ['core'],
    stationId: 'core-pronouns',
    intendedUse: 'produce',
    source: { kind: 'common-usage', label: 'DOOM 3' },
    status: 'published',
  });
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

if (!passedAll) {
  console.error('\n❌ SOME TESTS IN DRE-P161 SUITE FAILED!');
  process.exit(1);
} else {
  console.log('\n============================================================');
  console.log('✅ ALL DRE-P161 RULE TESTS PASSED!');
  console.log('============================================================');
}
