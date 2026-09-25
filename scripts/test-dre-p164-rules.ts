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
import { cleanText, isElision } from './lib/dex-text.mjs';

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
console.log('DRE-P164 RULES SUITE (TIME MODULE, HYPHEN FILTER, DAYS & MONTHS)');
console.log('============================================================');

// 1. Documentation Test: History of what the old hyphen filter did
runTest("Documentation: what the old filter did (corrupted compound words with internal hyphens)", () => {
  const oldCleanText = (text: string) => text.replace(/[-‑–—\u2011]/g, '').trim();
  const oldIsElision = (text: string) => /[-‑–—\u2011]/.test(text);

  const corrupted = oldCleanText('după-amiază');
  const wronglyClassifiedAsElision = oldIsElision('după-amiază');

  const errors: ValidationError[] = [];
  if (corrupted === 'dupăamiază' && wronglyClassifiedAsElision === true) {
    errors.push({
      rule: 'V18',
      phraseId: 'old-hyphen-filter',
      message: "Old filter corrupted 'după-amiază' to 'dupăamiază' and flagged it as an elision",
    });
  }

  return { expectedRule: 'V18', errors, shouldPass: false };
});

// 2. Green Test: New dex-text maintains internal hyphens and rejects leading/trailing elisions
runTest("Green Test: New dex-text preserves 'după-amiază' and rejects '‑mi' / '‑ți' / 'fostu‑'", () => {
  const errors: ValidationError[] = [];

  const daClean = cleanText('după-amiază');
  const daIsEl = isElision('după-amiază');
  if (daClean !== 'după-amiază') {
    errors.push({
      rule: 'V18',
      phraseId: 'după-amiază',
      message: `Expected 'după-amiază', got '${daClean}'`,
    });
  }
  if (daIsEl !== false) {
    errors.push({
      rule: 'V18',
      phraseId: 'după-amiază',
      message: `Expected isElision('după-amiază') to be false, got true`,
    });
  }

  // Check that leading/trailing hyphens ARE recognized as elisions and cleaned
  const miClean = cleanText('‑mi');
  const miIsEl = isElision('‑mi');
  if (miClean !== 'mi' || miIsEl !== true) {
    errors.push({
      rule: 'V18',
      phraseId: '‑mi',
      message: `Failed on '‑mi': clean='${miClean}', isElision=${miIsEl}`,
    });
  }

  const tiClean = cleanText('‑ți');
  const tiIsEl = isElision('‑ți');
  if (tiClean !== 'ți' || tiIsEl !== true) {
    errors.push({
      rule: 'V18',
      phraseId: '‑ți',
      message: `Failed on '‑ți': clean='${tiClean}', isElision=${tiIsEl}`,
    });
  }

  const fostuClean = cleanText('fostu‑');
  const fostuIsEl = isElision('fostu‑');
  if (fostuClean !== 'fostu' || fostuIsEl !== true) {
    errors.push({
      rule: 'V18',
      phraseId: 'fostu‑',
      message: `Failed on 'fostu‑': clean='${fostuClean}', isElision=${fostuIsEl}`,
    });
  }

  return { errors, shouldPass: true };
});

// 3. Green Test: Days of the week structural assertions (Addendum 1)
runTest("Green Test: Group 1 Days of the week plural and definite claims (Addendum 1)", () => {
  const errors: ValidationError[] = [];
  const daysFirst5 = ['luni', 'marți', 'miercuri', 'joi', 'vineri'];
  const expectedDefinite: Record<string, string> = {
    luni: 'lunea',
    marți: 'marțea',
    miercuri: 'miercurea',
    joi: 'joia',
    vineri: 'vinerea',
    sâmbătă: 'sâmbăta',
    duminică: 'duminica',
  };

  for (const lemma of daysFirst5) {
    const entry = CORE_TIME.find(w => w.lemma === lemma);
    if (!entry) {
      errors.push({ rule: 'V1', phraseId: lemma, message: `Missing day entry '${lemma}'` });
      continue;
    }
    if (entry.plural !== entry.lemma) {
      errors.push({
        rule: 'V11',
        phraseId: entry.id,
        message: `Day '${lemma}' plural '${entry.plural}' is not equal to lemma '${entry.lemma}'`,
      });
    }
    if (entry.definiteForm !== expectedDefinite[lemma]) {
      errors.push({
        rule: 'V11',
        phraseId: entry.id,
        message: `Day '${lemma}' definiteForm '${entry.definiteForm}' !== '${expectedDefinite[lemma]}'`,
      });
    }
  }

  const sambata = CORE_TIME.find(w => w.lemma === 'sâmbătă');
  if (!sambata || sambata.plural !== 'sâmbete' || sambata.definiteForm !== 'sâmbăta') {
    errors.push({ rule: 'V11', phraseId: 'w-time-sambata', message: "Invalid 'sâmbătă' plural or definiteForm" });
  }

  const duminica = CORE_TIME.find(w => w.lemma === 'duminică');
  if (!duminica || duminica.plural !== 'duminici' || duminica.definiteForm !== 'duminica') {
    errors.push({ rule: 'V11', phraseId: 'w-time-duminica', message: "Invalid 'duminică' plural or definiteForm" });
  }

  return { errors, shouldPass: true };
});

// 4. Green Test: Group 2 Months structural assertions
runTest("Green Test: Group 2 Months are all invariable masculine nouns", () => {
  const errors: ValidationError[] = [];
  const monthLemmas = [
    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
  ];

  for (const lemma of monthLemmas) {
    const entry = CORE_TIME.find(w => w.lemma === lemma);
    if (!entry) {
      errors.push({ rule: 'V1', phraseId: lemma, message: `Missing month '${lemma}'` });
      continue;
    }
    if (entry.pos !== 'noun' || entry.gender !== 'm' || entry.plural !== undefined || entry.definiteForm !== undefined) {
      errors.push({
        rule: 'V11',
        phraseId: entry.id,
        message: `Month '${lemma}' must be pos: 'noun', gender: 'm', and invariable (no plural, no definiteForm). Found: pos=${entry.pos}, gender=${entry.gender}, plural=${entry.plural}, definiteForm=${entry.definiteForm}`,
      });
    }
  }

  return { errors, shouldPass: true };
});

// 5. Green Test: Healthy Registry Context with CORE_TIME
runTest("Green Test: Healthy Registry Context with Station 4 core-time", () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});

if (!passedAll) {
  console.error('\nFAILED: One or more tests in DRE-P164 rules suite failed.');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All DRE-P164 tests passed successfully.');
}
