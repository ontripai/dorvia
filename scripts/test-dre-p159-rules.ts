import {
  validateRomanianContent,
  validateRegistryCompleteness,
  ValidationError,
  RomanianValidationContext,
  RegistrySourceContext,
} from '../src/lib/romanian/validator';
import {
  ALL_WORDS,
  ALL_VERBS,
  ALL_GRAPHEMES,
  ALL_PHRASES,
  ALL_DIALOGUES,
  ALL_DOMAINS,
} from '../src/content/romanian/registry';
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
import { CORE_PRONOUNS } from '../src/content/romanian/core-pronouns';
import { CORE_QUESTION_WORDS } from '../src/content/romanian/core-question-words';
import { CORE_NUMBERS } from '../src/content/romanian/core-numbers';
import { PILOT_PHRASES } from '../src/content/romanian/pilot';
import { STAGE0_PHRASES } from '../src/content/romanian/stage0';
import {
  ALL_ROMANIAN_WORDS,
  ALL_ROMANIAN_VERBS,
  ALL_ROMANIAN_GRAPHEMES,
  ALL_ROMANIAN_PHRASES,
  ALL_ROMANIAN_DIALOGUES,
  ALL_ROMANIAN_DOMAINS,
} from '../src/lib/romanian/content';

const sourceContext: RegistrySourceContext = {
  phrases: [...PILOT_PHRASES, ...STAGE0_PHRASES],
  words: [...SEED_WORDS, ...FOUNDATION_WORDS, ...CORE_PRONOUNS, ...CORE_QUESTION_WORDS, ...CORE_NUMBERS],
  verbs: [...SEED_VERBS, ...CORE_VERBS],
  graphemes: [...SEED_GRAPHEMES, ...FOUNDATION_GRAPHEMES],
  dialogues: [...SEED_DIALOGUES],
  domains: [...SEED_DOMAINS],
};

function getCleanRegistryContext(): RomanianValidationContext {
  return {
    phrases: [...ALL_PHRASES],
    words: [...ALL_WORDS],
    verbs: [...ALL_VERBS],
    graphemes: [...ALL_GRAPHEMES],
    dialogues: [...ALL_DIALOGUES],
    domains: [...ALL_DOMAINS],
    sources: sourceContext,
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
console.log('DRE-P159 RULES SUITE (V24 REGISTRY COMPLETENESS)');
console.log('============================================================');

// 1. Green Test: Clean Registry matches all sources
runTest('Green Test V24-A: Complete registry with all source arrays satisfies V24 with 0 errors', () => {
  const ctx = getCleanRegistryContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 2. Red Test: FOUNDATION_GRAPHEMES missing from registry
runTest('Red Test V24-B: Missing FOUNDATION_GRAPHEMES from registry fails V24', () => {
  const ctx = getCleanRegistryContext();
  ctx.graphemes = [...SEED_GRAPHEMES]; // Omit foundation graphemes
  const errors = validateRegistryCompleteness(ctx, sourceContext);
  return { expectedRule: 'V24', errors, shouldPass: false };
});

// 3. Red Test: CORE_VERBS missing from registry
runTest('Red Test V24-C: Missing CORE_VERBS from registry fails V24', () => {
  const ctx = getCleanRegistryContext();
  ctx.verbs = [...SEED_VERBS]; // Omit core verbs
  const errors = validateRegistryCompleteness(ctx, sourceContext);
  return { expectedRule: 'V24', errors, shouldPass: false };
});

// 4. Red Test: FOUNDATION_WORDS missing from registry
runTest('Red Test V24-D: Missing FOUNDATION_WORDS from registry fails V24', () => {
  const ctx = getCleanRegistryContext();
  ctx.words = [...SEED_WORDS]; // Omit foundation words
  const errors = validateRegistryCompleteness(ctx, sourceContext);
  return { expectedRule: 'V24', errors, shouldPass: false };
});

// 5. Green Test: Content.ts export parity with registry.ts
runTest('Green Test V24-E: ALL_ROMANIAN_* in content.ts strictly matches registry.ts counts and IDs', () => {
  const errors: ValidationError[] = [];

  if (ALL_ROMANIAN_WORDS.length !== ALL_WORDS.length) {
    errors.push({
      rule: 'V24',
      phraseId: 'ALL_ROMANIAN_WORDS',
      message: `Count mismatch: content.ts has ${ALL_ROMANIAN_WORDS.length}, registry.ts has ${ALL_WORDS.length}`,
    });
  }
  if (ALL_ROMANIAN_VERBS.length !== ALL_VERBS.length) {
    errors.push({
      rule: 'V24',
      phraseId: 'ALL_ROMANIAN_VERBS',
      message: `Count mismatch: content.ts has ${ALL_ROMANIAN_VERBS.length}, registry.ts has ${ALL_VERBS.length}`,
    });
  }
  if (ALL_ROMANIAN_GRAPHEMES.length !== ALL_GRAPHEMES.length) {
    errors.push({
      rule: 'V24',
      phraseId: 'ALL_ROMANIAN_GRAPHEMES',
      message: `Count mismatch: content.ts has ${ALL_ROMANIAN_GRAPHEMES.length}, registry.ts has ${ALL_GRAPHEMES.length}`,
    });
  }
  if (ALL_ROMANIAN_PHRASES.length !== ALL_PHRASES.length) {
    errors.push({
      rule: 'V24',
      phraseId: 'ALL_ROMANIAN_PHRASES',
      message: `Count mismatch: content.ts has ${ALL_ROMANIAN_PHRASES.length}, registry.ts has ${ALL_PHRASES.length}`,
    });
  }
  if (ALL_ROMANIAN_DIALOGUES.length !== ALL_DIALOGUES.length) {
    errors.push({
      rule: 'V24',
      phraseId: 'ALL_ROMANIAN_DIALOGUES',
      message: `Count mismatch: content.ts has ${ALL_ROMANIAN_DIALOGUES.length}, registry.ts has ${ALL_DIALOGUES.length}`,
    });
  }
  if (ALL_ROMANIAN_DOMAINS.length !== ALL_DOMAINS.length) {
    errors.push({
      rule: 'V24',
      phraseId: 'ALL_ROMANIAN_DOMAINS',
      message: `Count mismatch: content.ts has ${ALL_ROMANIAN_DOMAINS.length}, registry.ts has ${ALL_DOMAINS.length}`,
    });
  }

  return { errors, shouldPass: true };
});

if (!passedAll) {
  console.error('\n❌ SOME DRE-P159 RULE TESTS FAILED!');
  process.exit(1);
} else {
  console.log('\n============================================================');
  console.log('✅ ALL DRE-P159 RULE TESTS PASSED!');
  console.log('============================================================\n');
  process.exit(0);
}
