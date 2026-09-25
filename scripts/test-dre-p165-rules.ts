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
import { parseNounParadigmTable } from './lib/parse-noun-table.mjs';

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
// PART 1: Parser Hardening Tests (Red Test & Green Test)
// ============================================================================

// RED TEST: Fixture table with stripped case labels (only singular/plural, no nominativ-acuzativ label)
const tableWithoutCaseLabels = `
<table>
  <tr>
    <th></th>
    <th>nearticulat</th>
    <th>articulat</th>
  </tr>
  <tr>
    <th>singular</th>
    <td>oră</td>
    <td>ora</td>
  </tr>
  <tr>
    <th>plural</th>
    <td>ore</td>
    <td>orele</td>
  </tr>
</table>
`;

// Healthy table fixture for 'oră' with explicit nominativ-acuzativ label
const healthyTableOra = `
<table class="lexeme">
  <tr>
    <th colspan="2"></th>
    <th>nearticulat</th>
    <th>articulat</th>
  </tr>
  <tr>
    <th rowspan="2">nominativ-acuzativ</th>
    <th>singular</th>
    <td>oră</td>
    <td>ora</td>
  </tr>
  <tr>
    <th>plural</th>
    <td>ore</td>
    <td>orele</td>
  </tr>
  <tr>
    <th rowspan="2">genitiv-dativ</th>
    <th>singular</th>
    <td>ore</td>
    <td>orei</td>
  </tr>
  <tr>
    <th>plural</th>
    <td>ore</td>
    <td>orelor</td>
  </tr>
</table>
`;

// Healthy table fixture for 'zi' with explicit nominativ-acuzativ label
const healthyTableZi = `
<table class="lexeme">
  <tr>
    <th colspan="2"></th>
    <th>nearticulat</th>
    <th>articulat</th>
  </tr>
  <tr>
    <th rowspan="2">nominativ-acuzativ</th>
    <th>singular</th>
    <td>zi</td>
    <td>ziua</td>
  </tr>
  <tr>
    <th>plural</th>
    <td>zile</td>
    <td>zilele</td>
  </tr>
  <tr>
    <th rowspan="2">genitiv-dativ</th>
    <th>singular</th>
    <td>zile</td>
    <td>zilei</td>
  </tr>
  <tr>
    <th>plural</th>
    <td>zile</td>
    <td>zilelor</td>
  </tr>
</table>
`;

runTest('Parser Red Test: Unlabeled case row returns null (no positional fallback)', () => {
  const parsed = parseNounParadigmTable(tableWithoutCaseLabels, 'oră');
  const errors: ValidationError[] = [];
  if (parsed !== null) {
    errors.push({
      rule: 'V18',
      phraseId: 'parser-test',
      message: `Expected null for unlabeled table, but got: ${JSON.stringify(parsed)}`,
    });
  }
  return {
    shouldPass: parsed === null,
    expectedRule: 'V18',
    errors,
  };
});

runTest('Parser Green Test: Healthy table for "oră" extracts correctly', () => {
  const parsed = parseNounParadigmTable(healthyTableOra, 'oră');
  const errors: ValidationError[] = [];
  if (!parsed) {
    errors.push({
      rule: 'V18',
      phraseId: 'parser-test-ora',
      message: 'Expected parsed result for healthy table of "oră", got null',
    });
  } else {
    if (parsed.singularNearticulat !== 'oră') errors.push({ rule: 'V18', phraseId: 'ora', message: `singularNearticulat mismatch: ${parsed.singularNearticulat}` });
    if (parsed.definiteForm !== 'ora') errors.push({ rule: 'V18', phraseId: 'ora', message: `definiteForm mismatch: ${parsed.definiteForm}` });
    if (parsed.plural !== 'ore') errors.push({ rule: 'V18', phraseId: 'ora', message: `plural mismatch: ${parsed.plural}` });
    if (parsed.pluralArticulat !== 'orele') errors.push({ rule: 'V18', phraseId: 'ora', message: `pluralArticulat mismatch: ${parsed.pluralArticulat}` });
  }
  return { shouldPass: true, errors };
});

runTest('Parser Green Test: Healthy table for "zi" extracts correctly', () => {
  const parsed = parseNounParadigmTable(healthyTableZi, 'zi');
  const errors: ValidationError[] = [];
  if (!parsed) {
    errors.push({
      rule: 'V18',
      phraseId: 'parser-test-zi',
      message: 'Expected parsed result for healthy table of "zi", got null',
    });
  } else {
    if (parsed.singularNearticulat !== 'zi') errors.push({ rule: 'V18', phraseId: 'zi', message: `singularNearticulat mismatch: ${parsed.singularNearticulat}` });
    if (parsed.definiteForm !== 'ziua') errors.push({ rule: 'V18', phraseId: 'zi', message: `definiteForm mismatch: ${parsed.definiteForm}` });
    if (parsed.plural !== 'zile') errors.push({ rule: 'V18', phraseId: 'zi', message: `plural mismatch: ${parsed.plural}` });
    if (parsed.pluralArticulat !== 'zilele') errors.push({ rule: 'V18', phraseId: 'zi', message: `pluralArticulat mismatch: ${parsed.pluralArticulat}` });
  }
  return { shouldPass: true, errors };
});

// ============================================================================
// PART 2: 10 formOf Backfill Links Validation (Section 2)
// ============================================================================

const expectedLinks: Record<string, string> = {
  'w-core-ma': 'w-core-eu',
  'w-core-imi': 'w-core-eu',
  'w-core-te': 'w-core-tu',
  'w-core-iti': 'w-core-tu',
  'w-core-ne': 'w-core-noi',
  'w-core-va': 'w-core-voi',
  'w-core-mea': 'w-core-meu',
  'w-core-cata': 'w-core-cat',
  'w-core-cati': 'w-core-cat',
  'w-core-cate': 'w-core-cat',
};

runTest('Green Test: All 10 backfilled entries have correct formOf target ID', () => {
  const errors: ValidationError[] = [];
  for (const [entryId, targetId] of Object.entries(expectedLinks)) {
    const entry = ALL_WORDS.find(w => w.id === entryId);
    if (!entry) {
      errors.push({
        rule: 'V18',
        phraseId: entryId,
        message: `Entry ${entryId} not found in ALL_WORDS`,
      });
      continue;
    }
    if (entry.formOf !== targetId) {
      errors.push({
        rule: 'V18',
        phraseId: entryId,
        message: `Entry ${entryId} (${entry.lemma}) expected formOf '${targetId}', got '${entry.formOf}'`,
      });
    }
    // Verify target exists
    const target = ALL_WORDS.find(w => w.id === targetId);
    if (!target) {
      errors.push({
        rule: 'V18',
        phraseId: entryId,
        message: `Target ${targetId} for entry ${entryId} not found in ALL_WORDS`,
      });
    } else if (target.formOf) {
      errors.push({
        rule: 'V18',
        phraseId: entryId,
        message: `Target ${targetId} itself has formOf '${target.formOf}', two-level chaining prohibited`,
      });
    }
  }
  return { shouldPass: true, errors };
});

// ============================================================================
// PART 3: Items that MUST NOT have formOf (Section 3 negative list)
// ============================================================================

const negativeListIds = [
  'w-core-el',
  'w-core-ea',
  'w-core-ei',
  'w-core-ele',
  'w-core-dumneata',
  'w-core-dumneavoastra',
  'w-core-cine',
  'w-core-care',
  'w-core-ce',
  'w-core-unde',
  'w-core-cand',
  'w-core-cum',
  'w-time-azi',
  'w-time-astazi',
];

runTest('Green Test: Section 3 negative list entries do NOT have formOf', () => {
  const errors: ValidationError[] = [];
  for (const id of negativeListIds) {
    const entry = ALL_WORDS.find(w => w.id === id);
    if (!entry) {
      const phrase = ALL_PHRASES.find(p => p.id === id);
      if (phrase) {
        if ((phrase as any).formOf) {
          errors.push({
            rule: 'V18',
            phraseId: id,
            message: `Phrase ${id} has unexpected formOf: ${(phrase as any).formOf}`,
          });
        }
        continue;
      }
      errors.push({
        rule: 'V18',
        phraseId: id,
        message: `Negative list item ${id} not found in registry`,
      });
      continue;
    }
    if (entry.formOf !== undefined) {
      errors.push({
        rule: 'V18',
        phraseId: id,
        message: `Entry ${id} (${entry.lemma}) should NOT have formOf, but has: ${entry.formOf}`,
      });
    }
  }
  return { shouldPass: true, errors };
});

// Check 'de ce'
runTest('Green Test: "de ce" is a phrase/entry without formOf', () => {
  const errors: ValidationError[] = [];
  const dece = ALL_WORDS.find(w => w.id === 'w-core-de-ce') || ALL_PHRASES.find(p => p.id === 'ph-core-de-ce' || p.id === 'w-core-de-ce');
  if (dece && (dece as any).formOf) {
    errors.push({
      rule: 'V18',
      phraseId: 'de-ce',
      message: `"de ce" should not have formOf, got ${(dece as any).formOf}`,
    });
  }
  return { shouldPass: true, errors };
});

// ============================================================================
// PART 4: Validator Rule V18 (Referential Integrity & Chaining)
// ============================================================================

runTest('Red Test: V18 catches non-existent formOf target ID', () => {
  const ctx = getCleanBaseContext();
  const word = ctx.words!.find(w => w.id === 'w-core-ma');
  if (word) {
    word.formOf = 'w-core-non-existent-id-xyz';
  }
  const errors = validateRomanianContent(ctx);
  const matching = errors.filter(e => e.rule === 'V18' && e.message.includes('non-existent word'));
  return {
    shouldPass: false,
    expectedRule: 'V18',
    errors: matching,
  };
});

runTest('Red Test: V18 catches 2-level formOf chaining (A -> B -> C)', () => {
  const ctx = getCleanBaseContext();
  const baseTarget = ctx.words!.find(w => w.id === 'w-core-eu');
  if (baseTarget) {
    baseTarget.formOf = 'w-core-tu';
  }
  const errors = validateRomanianContent(ctx);
  const matching = errors.filter(e => e.rule === 'V18' && e.message.includes('two-level formOf chain prohibited'));
  return {
    shouldPass: false,
    expectedRule: 'V18',
    errors: matching,
  };
});

runTest('Red Test: V18 catches self-referencing formOf (A -> A)', () => {
  const ctx = getCleanBaseContext();
  const word = ctx.words!.find(w => w.id === 'w-core-eu');
  if (word) {
    word.formOf = 'w-core-eu';
  }
  const errors = validateRomanianContent(ctx);
  const matching = errors.filter(e => e.rule === 'V18' && (e.message.includes('self-reference') || e.message.includes('chain prohibited')));
  return {
    shouldPass: false,
    expectedRule: 'V18',
    errors: matching,
  };
});

runTest('Green Test: Entire active registry passes Romanian validation cleanly', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return {
    shouldPass: true,
    errors,
  };
});

// Final outcome
console.log(`\n============================================================`);
if (passedAll) {
  console.log(`ALL DRE-P165 TESTS PASSED SUCCESSFULLY!`);
  console.log(`============================================================\n`);
  process.exit(0);
} else {
  console.error(`SOME DRE-P165 TESTS FAILED.`);
  console.log(`============================================================\n`);
  process.exit(1);
}
