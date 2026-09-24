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
console.log('DRE-P163 RULES SUITE (V18 formOf REFERENTIAL INTEGRITY & NUMERALS)');
console.log('============================================================');

// 1. Green Test: Healthy Registry Data
runTest('Green Test V18-A: Healthy words with valid formOf and station hierarchy pass with 0 errors', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 2. Red Test: formOf to non-existent word ID
runTest('Red Test V18-B: word.formOf referencing non-existent word ID triggers V18', () => {
  const ctx = getCleanBaseContext();
  const una = ctx.words?.find(w => w.id === 'w-num-una');
  if (una) {
    una.formOf = 'w-non-existent-word-xyz';
  }
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V18', errors, shouldPass: false };
});

// 3. Red Test: formOf referencing another word that itself has formOf (two-level chain prohibited)
runTest('Red Test V18-C: two-level chained formOf triggers V18', () => {
  const ctx = getCleanBaseContext();
  const unu = ctx.words?.find(w => w.id === 'w-num-unu');
  const una = ctx.words?.find(w => w.id === 'w-num-una');
  if (unu && una) {
    // unu references doi, while una references unu -> chained!
    unu.formOf = 'w-num-doi';
    una.formOf = 'w-num-unu';
  }
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V18', errors, shouldPass: false };
});

// 4. Green Test: Numeral words do not trigger V11 even when published
runTest('Green Test V11-NUM: Numeral words do not require noun gender or definiteForm (V11 scoped to noun)', () => {
  const ctx = getCleanBaseContext();
  // Temporarily set all numeral words to published
  for (const w of ctx.words || []) {
    if (w.pos === 'numeral') {
      w.status = 'published';
    }
  }
  const errors = validateRomanianContent(ctx).filter(e => e.rule === 'V11');
  return { errors, shouldPass: true };
});

if (!passedAll) {
  console.error('\n❌ SOME DRE-P163 RULE TESTS FAILED!');
  process.exit(1);
} else {
  console.log('\n============================================================');
  console.log('✅ ALL DRE-P163 RULE TESTS PASSED!');
  console.log('============================================================\n');
  process.exit(0);
}
