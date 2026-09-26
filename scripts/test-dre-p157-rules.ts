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
import { RomanianVerb } from '../src/lib/romanian/types';

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

// 3. Red Test V20-C: Published defective verb (a trebui) without defective declaration fails V20
runTest('Red Test V20-C: Published defective verb without defective declaration fails V20', () => {
  const ctx = getCleanBaseContext();
  const trebuiVerb = ctx.verbs!.find(v => v.id === 'v-core-a-trebui')!;
  trebuiVerb.status = 'published';
  delete trebuiVerb.defective;
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V20', errors, shouldPass: false };
});

// 4. Green Test V20-D: Published defective verb WITH defective declaration passes V20
runTest('Green Test V20-D: Published defective verb with defective declaration passes V20', () => {
  const ctx = getCleanBaseContext();
  const trebuiVerb = ctx.verbs!.find(v => v.id === 'v-core-a-trebui')!;
  trebuiVerb.status = 'published';
  trebuiVerb.defective = {
    reason: 'Verb unipersonal / defectiv de persoana I și a II-a; se folosește doar la persoana a III-a.',
    source: 'DOOM 3 (V343) / dexonline',
  };
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// 5. Red Test V20-E: Published defective verb with empty defective reason/source fails V20
runTest('Red Test V20-E: Published defective verb with empty defective reason/source fails V20', () => {
  const ctx = getCleanBaseContext();
  const trebuiVerb = ctx.verbs!.find(v => v.id === 'v-core-a-trebui')!;
  trebuiVerb.status = 'published';
  trebuiVerb.defective = {
    reason: '',
    source: 'DOOM 3',
  };
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V20', errors, shouldPass: false };
});

// 6. Red Test V21-A: Stored form contains 'să' without whitespace (e.g. 'săpoată')
runTest("Red Test V21-A: Stored conjunctiv form contains 'să' without whitespace (e.g. 'săpoată')", () => {
  const ctx = getCleanBaseContext();
  const verb = ctx.verbs!.find(v => v.id === 'v-core-a-putea')!;
  verb.conjugation.conjunctiv!.el = 'săpoată';
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
