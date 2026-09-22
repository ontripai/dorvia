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
import { RomanianPhrase, RomanianWord, RomanianVerb, DomainMeta } from '../src/lib/romanian/types';

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
console.log('DORVIA DRE-P152 RULES VALIDATION TEST SUITE (RED & GREEN)');
console.log('============================================================');

// --- RED TESTS ---

// 1. Red Test V9: Non-existent wordId in a phrase
runTest('RED TEST V9: Non-existent wordId referenced in phrase', () => {
  const ctx = getCleanBaseContext();
  ctx.phrases![0].wordIds = ['w-non-existent-999'];
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V9', errors, shouldPass: false };
});

// 2. Red Test V10: Remove source.url from v-a-fi
runTest('RED TEST V10: Remove source.url from published verb v-a-fi', () => {
  const ctx = getCleanBaseContext();
  const verb = ctx.verbs!.find(v => v.id === 'v-a-fi')!;
  verb.source.url = '';
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V10', errors, shouldPass: false };
});

// 3. Red Test V11: Remove definiteForm from w-cont
runTest('RED TEST V11: Remove definiteForm from published noun w-cont', () => {
  const ctx = getCleanBaseContext();
  const word = ctx.words!.find(w => w.id === 'w-cont')!;
  delete (word as Partial<RomanianWord>).definiteForm;
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V11', errors, shouldPass: false };
});

// 4. Red Test V12: Word in higher domain order used by phrase in lower domain order
runTest('RED TEST V12: Phrase in order 0 domain uses word introduced in order 1 domain', () => {
  const ctx = getCleanBaseContext();
  // Add domain with higher order (1)
  ctx.domains!.push({
    id: 'airport',
    titleFa: 'فرودگاه',
    titleEn: 'Airport',
    order: 1,
    estimatedWeeks: 1,
    stationOrder: 'grouped',
    stations: [],
    sourcingPolicy: 'common-usage-ok',
  });
  // Word introduced in domain 'airport' (order 1)
  ctx.words!.push({
    id: 'w-avion',
    lemma: 'avion',
    pos: 'noun',
    gender: 'n',
    definiteForm: 'avionul',
    translations: { en: 'airplane', fa: 'هواپیما' },
    domains: ['airport'],
    intendedUse: 'produce',
    source: { kind: 'common-usage', label: 'seed test' },
    status: 'published',
  });
  // Phrase in domain 'core' (order 0) attempts to use word from order 1
  ctx.phrases![0].domain = 'core';
  ctx.phrases![0].wordIds = ['w-avion'];

  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V12', errors, shouldPass: false };
});

// 5. Red Test V13: Remove estimatedWeeks from core domain
runTest('RED TEST V13: Remove estimatedWeeks from published core domain', () => {
  const ctx = getCleanBaseContext();
  const coreDomain = ctx.domains!.find(d => d.id === 'core')!;
  delete (coreDomain as Partial<DomainMeta>).estimatedWeeks;
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V13', errors, shouldPass: false };
});

// 6. Red Test V14: Temporary must-be-sourced domain with common-usage item
runTest('RED TEST V14: Temporary must-be-sourced domain with common-usage word', () => {
  const ctx = getCleanBaseContext();
  ctx.domains!.push({
    id: 'customs-official',
    titleFa: 'گمرک رسمی',
    titleEn: 'Official Customs',
    order: 2,
    estimatedWeeks: 1,
    stationOrder: 'grouped',
    stations: [],
    sourcingPolicy: 'must-be-sourced',
  });
  ctx.words!.push({
    id: 'w-vama',
    lemma: 'vamă',
    pos: 'noun',
    gender: 'f',
    definiteForm: 'vama',
    translations: { en: 'customs', fa: 'گمرک' },
    domains: ['customs-official'],
    intendedUse: 'produce',
    source: { kind: 'common-usage', label: 'not official' },
    status: 'published',
  });
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V14', errors, shouldPass: false };
});

// --- GREEN TESTS ---

// 7. Green Test 1: v-a-avea without conjunctiv stays green
runTest('GREEN TEST 1: v-a-avea with only prezent tense (optional tenses omitted) stays green', () => {
  const ctx = getCleanBaseContext();
  // Filter verbs to only test v-a-avea
  ctx.verbs = ctx.verbs!.filter(v => v.id === 'v-a-avea');
  const errors = validateRomanianContent(ctx).filter(
    e => e.phraseId === 'v-a-avea'
  );
  return { errors, shouldPass: true };
});

// 8. Green Test 2: Phrase with intendedUse: 'comprehend' and register: 'informal' stays green (V6 modification)
runTest("GREEN TEST 2: Published phrase with intendedUse: 'comprehend' and register: 'informal' stays green", () => {
  const ctx = getCleanBaseContext();
  const officerPhrase: RomanianPhrase = {
    id: 'airport-officer-001',
    slug: 'ai-ceva-de-declarat',
    category: 'everyday',
    level: 'beginner',
    register: 'informal',
    intendedUse: 'comprehend', // Officer speaking to traveler
    text: {
      ro: 'Ai ceva de declarat?',
      en: 'Do you have anything to declare?',
      fa: 'چیزی برای اظهار کردن دارید؟',
    },
    source: {
      kind: 'common-usage',
      label: 'Officer dialogue turn test',
    },
    status: 'published',
    isFree: true,
  };
  ctx.phrases!.push(officerPhrase);
  const errors = validateRomanianContent(ctx).filter(
    e => e.phraseId === 'airport-officer-001' && e.rule === 'V6'
  );
  return { errors, shouldPass: true };
});

console.log('\n============================================================');
if (passedAll) {
  console.log('🎉 ALL 6 RED TESTS AND 2 GREEN TESTS PASSED STRICTLY!');
  console.log('============================================================\n');
  process.exit(0);
} else {
  console.error('❌ ONE OR MORE TESTS FAILED.');
  console.log('============================================================\n');
  process.exit(1);
}
