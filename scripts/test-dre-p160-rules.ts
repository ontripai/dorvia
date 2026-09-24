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
console.log('DRE-P160 RULES SUITE (V1-V3 GRAPHEME SLUGS & V25 EXAMPLE WORD)');
console.log('============================================================');

// 1. Green Test: Clean Base Dataset
runTest('Green Test: Clean Base Dataset (24 published graphemes & 26 published words)', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 2. Red Test V2: Duplicate grapheme slug fails V2
runTest('Red Test V2: Duplicate grapheme slug fails V2', () => {
  const ctx = getCleanBaseContext();
  // Assign same slug 'a' to g-02-e
  ctx.graphemes![1].slug = 'a';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V2', errors, shouldPass: false };
});

// 3. Red Test V3: Invalid grapheme slug format fails V3
runTest('Red Test V3: Invalid grapheme slug format (e.g. uppercase or underscores) fails V3', () => {
  const ctx = getCleanBaseContext();
  ctx.graphemes![0].slug = 'A_Breve';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V3', errors, shouldPass: false };
});

// 4. Red Test V25: Published grapheme with draft example word fails V25
runTest('Red Test V25: Published grapheme with draft example word fails V25', () => {
  const ctx = getCleanBaseContext();
  // Make example word of g-01-a draft
  const word = ctx.words!.find(w => w.id === 'w-apa')!;
  word.status = 'draft';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V25', errors, shouldPass: false };
});

// 5. Green Test V25: Grapheme and its example word both published passes V25
runTest('Green Test V25: Published graphemes with published example words pass V25', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  const v25Errors = errors.filter(e => e.rule === 'V25');
  return { errors: v25Errors, shouldPass: true };
});

if (!passedAll) {
  console.error('\n❌ SOME DRE-P160 RULE TESTS FAILED!');
  process.exit(1);
} else {
  console.log('\n============================================================');
  console.log('✅ ALL DRE-P160 RULE TESTS PASSED!');
  console.log('============================================================\n');
  process.exit(0);
}
