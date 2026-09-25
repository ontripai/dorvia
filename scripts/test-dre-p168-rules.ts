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
import { CORE_TIME } from '../src/content/romanian/core-time';
import { SEED_DOMAINS } from '../src/content/romanian/seed';

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

console.log('============================================================');
console.log('DRE-P168 RULES SUITE (CORE STATIONS PUBLISHING, V11 & V28)');
console.log('============================================================');

// ----------------------------------------------------------------------------
// RED TEST 1: Published noun without definiteForm and without invariable fails V11
// ----------------------------------------------------------------------------
runTest('RED TEST 1: Published noun without definiteForm and without invariable fails V11', () => {
  const ctx = getCleanBaseContext();
  const casa = ctx.words?.find(w => w.id === 'w-casa');
  if (casa) {
    delete (casa as any).definiteForm;
    delete (casa as any).invariable;
  }
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V11', errors, shouldPass: false };
});

// ----------------------------------------------------------------------------
// RED TEST 2: Declared invariable noun with definiteForm fails V11
// ----------------------------------------------------------------------------
runTest('RED TEST 2: Declared invariable noun with definiteForm fails V11', () => {
  const ctx = getCleanBaseContext();
  const ianuarie = ctx.words?.find(w => w.id === 'w-time-ianuarie');
  if (ianuarie) {
    ianuarie.definiteForm = 'ianuariele';
  }
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V11', errors, shouldPass: false };
});

// ----------------------------------------------------------------------------
// RED TEST 3: Declared invariable noun with plural fails V11
// ----------------------------------------------------------------------------
runTest('RED TEST 3: Declared invariable noun with plural fails V11', () => {
  const ctx = getCleanBaseContext();
  const ianuarie = ctx.words?.find(w => w.id === 'w-time-ianuarie');
  if (ianuarie) {
    ianuarie.plural = 'ianuarii';
  }
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V11', errors, shouldPass: false };
});

// ----------------------------------------------------------------------------
// RED TEST 4: Declared invariable noun with empty reason fails V11
// ----------------------------------------------------------------------------
runTest('RED TEST 4: Declared invariable noun with empty reason fails V11', () => {
  const ctx = getCleanBaseContext();
  const ianuarie = ctx.words?.find(w => w.id === 'w-time-ianuarie');
  if (ianuarie && ianuarie.invariable) {
    ianuarie.invariable.reason = '  ';
  }
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V11', errors, shouldPass: false };
});

// ----------------------------------------------------------------------------
// RED TEST 5: Published word with formOf referencing draft word fails V28
// ----------------------------------------------------------------------------
runTest('RED TEST 5: Published word with formOf referencing draft word fails V28', () => {
  const ctx = getCleanBaseContext();
  const eu = ctx.words?.find(w => w.id === 'w-core-eu');
  if (eu) {
    eu.status = 'draft';
  }
  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V28', errors, shouldPass: false };
});

// ----------------------------------------------------------------------------
// GREEN TEST 1: The 12 months with declared invariable pass V11
// ----------------------------------------------------------------------------
runTest('GREEN TEST 1: The 12 months with declared invariable pass V11', () => {
  const monthLemmas = [
    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
  ];
  const errors: ValidationError[] = [];

  for (const lemma of monthLemmas) {
    const entry = CORE_TIME.find(w => w.lemma === lemma);
    if (!entry) {
      errors.push({ rule: 'V1', phraseId: lemma, message: `Missing month '${lemma}'` });
      continue;
    }
    if (entry.pos !== 'noun' || entry.gender !== 'm' || entry.definiteForm !== undefined || entry.plural !== undefined) {
      errors.push({
        rule: 'V11',
        phraseId: entry.id,
        message: `Month '${lemma}' must have no definiteForm and no plural`,
      });
    }
    if (!entry.invariable || !entry.invariable.reason?.trim() || !entry.invariable.source?.trim()) {
      errors.push({
        rule: 'V11',
        phraseId: entry.id,
        message: `Month '${lemma}' missing declared invariable with non-empty reason and source`,
      });
    }
  }

  return { errors, shouldPass: true };
});

// ----------------------------------------------------------------------------
// GREEN TEST 2: Regular noun (casă) with definiteForm passes V11
// ----------------------------------------------------------------------------
runTest('GREEN TEST 2: Regular noun (casă) with definiteForm passes V11', () => {
  const ctx = getCleanBaseContext();
  const casa = ctx.words?.find(w => w.id === 'w-casa');
  const errors: ValidationError[] = [];

  if (!casa || casa.status !== 'published' || casa.pos !== 'noun') {
    errors.push({ rule: 'V11', phraseId: 'w-casa', message: 'w-casa not found or not published noun' });
  } else if (!casa.gender || !casa.definiteForm) {
    errors.push({ rule: 'V11', phraseId: 'w-casa', message: 'w-casa missing gender or definiteForm' });
  }

  const vErrors = validateRomanianContent(ctx).filter(e => e.phraseId === 'w-casa' && e.rule === 'V11');
  errors.push(...vErrors);

  return { errors, shouldPass: true };
});

// ----------------------------------------------------------------------------
// GREEN TEST 3: Active dataset passes all rules V1 through V28
// ----------------------------------------------------------------------------
runTest('GREEN TEST 3: Active dataset passes all rules V1 through V28', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

// ----------------------------------------------------------------------------
// GREEN TEST 4: All 5 core stations are non-empty after publishing
// ----------------------------------------------------------------------------
runTest('GREEN TEST 4: All 5 core stations are non-empty with published content', () => {
  const ctx = getCleanBaseContext();
  const coreStations = [
    'core-pronouns',
    'core-question-words',
    'core-numbers',
    'core-time',
    'core-greetings',
  ];

  const errors: ValidationError[] = [];

  for (const stId of coreStations) {
    const pubWords = (ctx.words || []).filter(w => w.status === 'published' && w.stationId === stId);
    const pubPhrases = (ctx.phrases || []).filter(p => p.status === 'published' && p.stationId === stId);
    const total = pubWords.length + pubPhrases.length;
    if (total === 0) {
      errors.push({
        rule: 'V13',
        phraseId: stId,
        message: `Station "${stId}" has 0 published items. Must be non-empty after publishing.`,
      });
    }
  }

  return { errors, shouldPass: true };
});

// ----------------------------------------------------------------------------
// GREEN TEST 5: All 5 core stations have valid slugs
// ----------------------------------------------------------------------------
runTest('GREEN TEST 5: All 5 core stations have valid slugs in SEED_DOMAINS', () => {
  const errors: ValidationError[] = [];
  const coreDomain = SEED_DOMAINS.find(d => d.id === 'core');

  if (!coreDomain) {
    errors.push({ rule: 'V13', phraseId: 'core', message: 'Missing core domain in SEED_DOMAINS' });
    return { errors, shouldPass: true };
  }

  const expectedSlugs: Record<string, string> = {
    'core-pronouns': 'pronume',
    'core-question-words': 'cuvinte-interogative',
    'core-numbers': 'numere',
    'core-time': 'timp',
    'core-greetings': 'salutari',
  };

  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  for (const [stId, expectedSlug] of Object.entries(expectedSlugs)) {
    const st = coreDomain.stations.find(s => s.id === stId);
    if (!st) {
      errors.push({ rule: 'V13', phraseId: stId, message: `Station "${stId}" not found in core domain` });
      continue;
    }
    if (st.slug !== expectedSlug) {
      errors.push({
        rule: 'V3',
        phraseId: stId,
        message: `Station "${stId}" slug "${st.slug}" !== expected "${expectedSlug}"`,
      });
    }
    if (!st.slug || !slugRegex.test(st.slug)) {
      errors.push({
        rule: 'V3',
        phraseId: stId,
        message: `Station "${stId}" slug "${st.slug}" does not match regex ^[a-z0-9]+(-[a-z0-9]+)*$`,
      });
    }
  }

  return { errors, shouldPass: true };
});

if (!passedAll) {
  console.error('\nFAILED: One or more tests in DRE-P168 rules suite failed.');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All DRE-P168 tests passed successfully.');
}
