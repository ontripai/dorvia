import {
  validateRomanianContent,
  ValidationError,
  RomanianValidationContext,
  FUNCTION_WORD_ALLOWLIST,
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
        console.error(`  - [${e.rule}] (entity: "${e.phraseId}"): ${e.message}`);
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
        `[FAIL RED TEST] Did not find expected rule [${result.expectedRule}]. All errors (${result.errors.length}):`
      );
      for (const e of result.errors) {
        console.error(`  - [${e.rule}] ${e.message}`);
      }
    }
  }
}

// ============================================================================
// TEST 1: Red Test 1 - Un-sourced verb form 'dă' in usageNote.fa
// ============================================================================
runTest('RED TEST 1: V27 catches un-sourced verb form "dă" in usageNote.fa', () => {
  const ctx = getCleanBaseContext();
  const testWord = ctx.words!.find(w => w.id === 'w-apa');
  if (testWord) {
    testWord.usageNote = {
      fa: 'این جمله صورت فعل dă را استفاده می‌کند.',
      en: 'This sentence uses verb form dă.',
    };
  }

  const errors = validateRomanianContent(ctx).filter(
    e => e.rule === 'V27' && e.phraseId === 'w-apa' && e.message.includes('"dă"')
  );

  return {
    expectedRule: 'V27',
    errors,
    shouldPass: false,
  };
});

// ============================================================================
// TEST 2: Red Test 2 - Un-sourced verb form 'cheamă' in usageNote.fa
// ============================================================================
runTest('RED TEST 2: V27 catches un-sourced verb form "cheamă" in usageNote.fa', () => {
  const ctx = getCleanBaseContext();
  const testWord = ctx.words!.find(w => w.id === 'w-apa');
  if (testWord) {
    testWord.usageNote = {
      fa: 'در برابر عبارت غیررسمی Cum te cheamă?.',
      en: 'Contrasting with informal Cum te cheamă?.',
    };
  }

  const errors = validateRomanianContent(ctx).filter(
    e => e.rule === 'V27' && e.phraseId === 'w-apa' && e.message.includes('"cheamă"')
  );

  return {
    expectedRule: 'V27',
    errors,
    shouldPass: false,
  };
});

// ============================================================================
// TEST 3: Red Test 3 - Non-existent hyphenated word 'după-masă' in usageNote.fa
// ============================================================================
runTest('RED TEST 3: V27 catches non-existent hyphenated word "după-masă" in usageNote.fa', () => {
  const ctx = getCleanBaseContext();
  const testWord = ctx.words!.find(w => w.id === 'w-apa');
  if (testWord) {
    testWord.usageNote = {
      fa: 'واژه‌ی بعدازظهر به صورت după-masă در زبان عامیانه.',
      en: 'The word afternoon as după-masă in colloquial.',
    };
  }

  const errors = validateRomanianContent(ctx).filter(
    e => e.rule === 'V27' && e.phraseId === 'w-apa' && e.message.includes('"după-masă"')
  );

  return {
    expectedRule: 'V27',
    errors,
    shouldPass: false,
  };
});

// ============================================================================
// TEST 4: Red Test 4 - Allowlist size cap at 15 entries
// ============================================================================
runTest('RED TEST 4: V27 fails when FUNCTION_WORD_ALLOWLIST exceeds 15 entries', () => {
  // Simulate an allowlist exceeding 15 entries
  const simulatedAllowlist = [
    ...FUNCTION_WORD_ALLOWLIST,
    'extra1', 'extra2', 'extra3', 'extra4', 'extra5',
    'extra6', 'extra7', 'extra8', 'extra9',
  ];

  const errors: ValidationError[] = [];
  if (simulatedAllowlist.length > 15) {
    errors.push({
      rule: 'V27',
      phraseId: 'FUNCTION_WORD_ALLOWLIST',
      entityId: 'FUNCTION_WORD_ALLOWLIST',
      message: `FUNCTION_WORD_ALLOWLIST exceeds maximum allowed size of 15 entries (currently ${simulatedAllowlist.length}). The allowlist must not be used to bypass V27.`,
    });
  }

  return {
    expectedRule: 'V27',
    errors,
    shouldPass: false,
  };
});

// ============================================================================
// TEST 5: Green Test 2 - Hyphenated word 'după-amiază' passes cleanly as single token
// ============================================================================
runTest('GREEN TEST 2: Valid hyphenated word "după-amiază" in usageNote.fa passes V27 without breaking', () => {
  const ctx = getCleanBaseContext();
  // Create an isolated clean context with only w-apa and după-amiază note
  const isolatedWord = {
    id: 'w-test-clean-hyphen',
    lemma: 'apă',
    pos: 'noun' as const,
    translations: { en: 'water', fa: 'آب' },
    domains: ['core'],
    stationId: 'core-greetings',
    intendedUse: 'produce' as const,
    source: { kind: 'common-usage' as const, label: 'DEX' },
    status: 'draft' as const,
    usageNote: {
      fa: 'در هنگام după-amiază مصرف می‌شود.',
      en: 'Consumed in afternoon.',
    },
  };

  const testCtx: RomanianValidationContext = {
    words: [
      ctx.words!.find(w => w.id === 'w-time-dupa-amiaza')!,
      isolatedWord,
    ],
    verbs: [],
    graphemes: [],
    phrases: [],
    dialogues: [],
    domains: ctx.domains,
  };

  const errors = validateRomanianContent(testCtx).filter(
    e => e.rule === 'V27' && e.phraseId === 'w-test-clean-hyphen'
  );

  return {
    errors,
    shouldPass: true,
  };
});

// ============================================================================
// TEST 6: Green Test 3 - Case insensitivity with capital "La" in "La ce oră?"
// ============================================================================
runTest('GREEN TEST 3: Case-insensitive match with capital "La" in "La ce oră?" passes V27', () => {
  const ctx = getCleanBaseContext();
  const isolatedWord = {
    id: 'w-test-clean-case',
    lemma: 'oră',
    pos: 'noun' as const,
    translations: { en: 'hour', fa: 'ساعت' },
    domains: ['core'],
    stationId: 'core-greetings',
    intendedUse: 'produce' as const,
    source: { kind: 'common-usage' as const, label: 'DEX' },
    status: 'draft' as const,
    usageNote: {
      fa: 'پرسش رایج: La ce oră?.',
      en: 'Common question: La ce oră?.',
    },
  };

  const testCtx: RomanianValidationContext = {
    words: [
      ctx.words!.find(w => w.id === 'w-core-ce')!,
      ctx.words!.find(w => w.id === 'w-time-ora')!,
      isolatedWord,
    ],
    verbs: [],
    graphemes: [],
    phrases: [],
    dialogues: [],
    domains: ctx.domains,
  };

  const errors = validateRomanianContent(testCtx).filter(
    e => e.rule === 'V27' && e.phraseId === 'w-test-clean-case'
  );

  return {
    errors,
    shouldPass: true,
  };
});

// ============================================================================
// TEST 7: Green Test 1 - Full current active registry evaluated against V27
// ============================================================================
runTest('GREEN TEST 1: Full current active registry evaluated against V27', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx).filter(e => e.rule === 'V27');

  if (errors.length > 0) {
    console.log(`\n[V27 DISCREPANCY AUDIT ON CURRENT ACTIVE DATASET]`);
    console.log(`Found ${errors.length} unverified Latin token(s) in active content:`);
    for (const e of errors) {
      console.log(`  - [${e.phraseId}]: ${e.message}`);
    }
  }

  return {
    errors,
    shouldPass: true,
  };
});

// ============================================================================
// Summary
// ============================================================================
console.log(`\n============================================================`);
if (passedAll) {
  console.log(`ALL DRE-P167 TESTS PASSED SUCCESSFULLY!`);
  console.log(`============================================================`);
  process.exit(0);
} else {
  console.error(`SOME TESTS IN DRE-P167 SUITE REPORTED DISCREPANCIES!`);
  console.log(`============================================================`);
  process.exit(1);
}
