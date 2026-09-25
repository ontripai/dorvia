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
import { CORE_GREETING_WORDS, CORE_GREETING_PHRASES } from '../src/content/romanian/core-greetings';
import { CORE_VERBS } from '../src/content/romanian/core-verbs';
import { FOUNDATION_WORDS } from '../src/content/romanian/foundation';
import { CORE_QUESTION_WORDS } from '../src/content/romanian/core-question-words';

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
        `[FAIL RED TEST] Did not find expected rule [${result.expectedRule}]. All errors (${result.errors.length}):`
      );
      for (const e of result.errors) {
        console.error(`  - [${e.rule}] ${e.message}`);
      }
    }
  }
}

// ============================================================================
// TEST 1: Red Test for Rule V26 (Duplicate lemma + pos)
// ============================================================================
runTest('RED TEST: Rule V26 catches duplicate (lemma, pos) pair', () => {
  const ctx = getCleanBaseContext();
  // Inject duplicate entry with same lemma 'mai' and same pos 'adv'
  ctx.words!.push({
    id: 'w-fake-duplicate-mai',
    lemma: 'mai',
    pos: 'adv',
    translations: { en: 'more', fa: 'دیگر' },
    domains: ['core'],
    stationId: 'core-greetings',
    intendedUse: 'produce',
    source: {
      kind: 'common-usage',
      label: 'test',
      url: 'https://dexonline.ro/definitie/mai',
      retrievedAt: '2026-09-25',
    },
    reviewer: 'ai-only',
    status: 'draft',
  });

  const errors = validateRomanianContent(ctx);
  return {
    expectedRule: 'V26',
    errors,
    shouldPass: false,
  };
});

// ============================================================================
// TEST 2: Green Test for Rule V26 (Homophone with different pos is allowed)
// ============================================================================
runTest('GREEN TEST: Rule V26 allows identical lemmas with different pos (mai noun vs mai adv)', () => {
  const ctx = getCleanBaseContext();
  const maiEntries = ctx.words!.filter(w => w.lemma === 'mai');
  if (maiEntries.length !== 2) {
    throw new Error(`Expected exactly 2 'mai' entries, found ${maiEntries.length}`);
  }
  const posList = maiEntries.map(w => w.pos).sort();
  if (posList[0] !== 'adv' || posList[1] !== 'noun') {
    throw new Error(`Expected pos 'adv' and 'noun', got: ${posList.join(', ')}`);
  }

  const errors = validateRomanianContent(ctx).filter(e => e.rule === 'V26');
  return {
    errors,
    shouldPass: true,
  };
});

// ============================================================================
// TEST 3: Green Test - Full Registry passes all validation rules
// ============================================================================
runTest('GREEN TEST: Full Registry passes all validation rules (0 errors)', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return {
    errors,
    shouldPass: true,
  };
});

// ============================================================================
// TEST 4: Green Test - Interjection 'pa' does not trigger V11 (Noun Gender)
// ============================================================================
runTest('GREEN TEST: Interjection pos: "interj" does not trigger V11', () => {
  const ctx = getCleanBaseContext();
  const paWord = ctx.words!.find(w => w.id === 'w-core-pa');
  if (!paWord) {
    throw new Error('w-core-pa not found');
  }
  if (paWord.pos !== 'interj') {
    throw new Error(`Expected w-core-pa to have pos: 'interj', found '${paWord.pos}'`);
  }

  const errors = validateRomanianContent(ctx).filter(
    e => e.rule === 'V11' && e.phraseId === 'w-core-pa'
  );
  return {
    errors,
    shouldPass: true,
  };
});

// ============================================================================
// TEST 5: Green Test - 4 New Verbs present, correct paradigms & structural claim
// ============================================================================
runTest('GREEN TEST: 4 new verbs (a mulțumi, a ruga, a numi, a părea) valid and match structural claim', () => {
  const expectedVerbs = [
    {
      id: 'v-core-a-multumi',
      infinitive: 'a mulțumi',
      euPrez: 'mulțumesc',
      hasEsc: true,
      participiu: 'mulțumit',
    },
    {
      id: 'v-core-a-ruga',
      infinitive: 'a ruga',
      euPrez: 'rog',
      hasEsc: false,
      participiu: 'rugat',
    },
    {
      id: 'v-core-a-numi',
      infinitive: 'a numi',
      euPrez: 'numesc',
      hasEsc: true,
      participiu: 'numit',
    },
    {
      id: 'v-core-a-parea',
      infinitive: 'a părea',
      euPrez: 'par',
      hasEsc: false,
      participiu: 'părut',
    },
  ];

  const errors: ValidationError[] = [];

  for (const vMeta of expectedVerbs) {
    const verb = CORE_VERBS.find(v => v.id === vMeta.id);
    if (!verb) {
      errors.push({
        rule: 'V9',
        phraseId: vMeta.id,
        message: `Verb ${vMeta.id} not found in CORE_VERBS`,
      });
      continue;
    }

    if (verb.participiu !== vMeta.participiu) {
      errors.push({
        rule: 'V20',
        phraseId: vMeta.id,
        message: `Verb ${vMeta.id} participiu is '${verb.participiu}', expected '${vMeta.participiu}'`,
      });
    }

    if (verb.conjugation?.prezent?.eu !== vMeta.euPrez) {
      errors.push({
        rule: 'V10',
        phraseId: vMeta.id,
        message: `Verb ${vMeta.id} prezent.eu is '${verb.conjugation?.prezent?.eu}', expected '${vMeta.euPrez}'`,
      });
    }

    const actualHasEsc = (verb.conjugation?.prezent?.eu || '').endsWith('esc');
    if (actualHasEsc !== vMeta.hasEsc) {
      errors.push({
        rule: 'V10',
        phraseId: vMeta.id,
        message: `Structural claim failure for ${vMeta.id}: hasEsc=${actualHasEsc}, expected ${vMeta.hasEsc}`,
      });
    }

    // Check conjunctiv does not contain 'să'
    for (const [person, form] of Object.entries(verb.conjugation?.conjunctiv || {})) {
      if (form.includes('să')) {
        errors.push({
          rule: 'V21',
          phraseId: vMeta.id,
          message: `Verb ${vMeta.id} conjunctiv.${person} contains 'să': '${form}'`,
        });
      }
    }
  }

  return {
    errors,
    shouldPass: true,
  };
});

// ============================================================================
// TEST 6: Green Test - 12 Words in core-greetings
// ============================================================================
runTest('GREEN TEST: 12 words in core-greetings adhere to specifications', () => {
  const errors: ValidationError[] = [];
  if (CORE_GREETING_WORDS.length !== 12) {
    errors.push({
      rule: 'V24',
      phraseId: 'core-greetings',
      message: `Expected 12 words in CORE_GREETING_WORDS, found ${CORE_GREETING_WORDS.length}`,
    });
  }

  // w-core-buna must have formOf: 'w-core-bun'
  const buna = CORE_GREETING_WORDS.find(w => w.id === 'w-core-buna');
  if (!buna || buna.formOf !== 'w-core-bun') {
    errors.push({
      rule: 'V18',
      phraseId: 'w-core-buna',
      message: `w-core-buna missing formOf: 'w-core-bun'`,
    });
  }

  // w-core-salut must be noun neuter with salutul/saluturi
  const salut = CORE_GREETING_WORDS.find(w => w.id === 'w-core-salut');
  if (!salut || salut.pos !== 'noun' || salut.gender !== 'n' || salut.definiteForm !== 'salutul' || salut.plural !== 'saluturi') {
    errors.push({
      rule: 'V11',
      phraseId: 'w-core-salut',
      message: `w-core-salut attributes invalid: pos=${salut?.pos}, gender=${salut?.gender}, def=${salut?.definiteForm}, pl=${salut?.plural}`,
    });
  }

  // da and nu must be adv
  for (const id of ['w-core-da', 'w-core-nu']) {
    const w = CORE_GREETING_WORDS.find(item => item.id === id);
    if (!w || w.pos !== 'adv') {
      errors.push({
        rule: 'V1',
        phraseId: id,
        message: `${id} missing or pos is not 'adv'`,
      });
    }
  }

  return {
    errors,
    shouldPass: true,
  };
});

// ============================================================================
// TEST 7: Green Test - 20 Phrases in core-greetings adhere to policy & register
// ============================================================================
runTest('GREEN TEST: 20 phrases in core-greetings have valid references, register policies, and notes', () => {
  const errors: ValidationError[] = [];
  if (CORE_GREETING_PHRASES.length !== 20) {
    errors.push({
      rule: 'V24',
      phraseId: 'core-greetings-phrases',
      message: `Expected 20 phrases in CORE_GREETING_PHRASES, found ${CORE_GREETING_PHRASES.length}`,
    });
  }

  for (const phrase of CORE_GREETING_PHRASES) {
    if (phrase.stationId !== 'core-greetings') {
      errors.push({
        rule: 'V13',
        phraseId: phrase.id,
        message: `Phrase ${phrase.id} has stationId '${phrase.stationId}', expected 'core-greetings'`,
      });
    }

    if (phrase.register === 'informal' && phrase.intendedUse !== 'comprehend') {
      errors.push({
        rule: 'V6',
        phraseId: phrase.id,
        message: `Informal phrase ${phrase.id} must have intendedUse: 'comprehend'`,
      });
    }

    if (phrase.register === 'formal' && phrase.intendedUse !== 'produce') {
      errors.push({
        rule: 'V6',
        phraseId: phrase.id,
        message: `Formal phrase ${phrase.id} must have intendedUse: 'produce'`,
      });
    }
  }

  // Check noapte bună inversion explanation in usageNote
  const noapteBuna = CORE_GREETING_PHRASES.find(p => p.id === 'p-core-noapte-buna');
  if (!noapteBuna?.usageNote?.fa.includes('وارونگی')) {
    errors.push({
      rule: 'V4',
      phraseId: 'p-core-noapte-buna',
      message: `p-core-noapte-buna usageNote must mention inversion (وارونگی)`,
    });
  }

  return {
    errors,
    shouldPass: true,
  };
});

// ============================================================================
// TEST 8: Green Test - unde resolution: w-unde is published, w-core-unde deleted
// ============================================================================
runTest('GREEN TEST: unde resolution integrity in foundation and registry', () => {
  const errors: ValidationError[] = [];
  const foundationUnde = FOUNDATION_WORDS.find(w => w.id === 'w-unde');
  if (!foundationUnde) {
    errors.push({
      rule: 'V18',
      phraseId: 'w-unde',
      message: 'w-unde not found in FOUNDATION_WORDS',
    });
  } else {
    if (foundationUnde.status !== 'published') {
      errors.push({
        rule: 'V25',
        phraseId: 'w-unde',
        message: `w-unde status is '${foundationUnde.status}', expected 'published'`,
      });
    }
    if (foundationUnde.stationId !== 'core-question-words') {
      errors.push({
        rule: 'V13',
        phraseId: 'w-unde',
        message: `w-unde stationId is '${foundationUnde.stationId}', expected 'core-question-words'`,
      });
    }
    if (!foundationUnde.usageNote?.fa) {
      errors.push({
        rule: 'V4',
        phraseId: 'w-unde',
        message: 'w-unde missing usageNote.fa',
      });
    }
  }

  const coreUnde = CORE_QUESTION_WORDS.find(w => w.id === 'w-core-unde');
  if (coreUnde) {
    errors.push({
      rule: 'V26',
      phraseId: 'w-core-unde',
      message: 'w-core-unde should have been deleted from CORE_QUESTION_WORDS',
    });
  }

  const undeInRegistry = ALL_WORDS.filter(w => w.lemma === 'unde');
  if (undeInRegistry.length !== 1) {
    errors.push({
      rule: 'V26',
      phraseId: 'w-unde',
      message: `Expected exactly 1 unde in ALL_WORDS, found ${undeInRegistry.length}`,
    });
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
  console.log(`ALL DRE-P166 TESTS PASSED SUCCESSFULLY!`);
  console.log(`============================================================`);
  process.exit(0);
} else {
  console.error(`SOME DRE-P166 TESTS FAILED!`);
  console.log(`============================================================`);
  process.exit(1);
}
