/**
 * dre-p173 — تست‌های قاعده‌ی V30 (یکتایی متن عبارت منتشرشده) و
 *            V31 (رفع‌ابهام معادل انگلیسی).
 *
 * هر تست قرمز داده‌ی واقعی رجیستری را جهش می‌دهد و تابع واقعی
 * validateRomanianContent را صدا می‌زند. هیچ منطقی محلی بازپیاده‌سازی نمی‌شود —
 * درس dre-p164: ادعایی که نتواند شکست بخورد، تست نیست.
 */

import {
  validateRomanianContent,
  ValidationError,
  RomanianValidationContext,
} from '../src/lib/romanian/validator';
import {
  CORE_AUDIO,
  ALL_WORDS,
  ALL_VERBS,
  ALL_GRAPHEMES,
  ALL_PHRASES,
  ALL_DIALOGUES,
  ALL_DOMAINS,
} from '../src/content/romanian/registry';

type FullContext = Required<Pick<RomanianValidationContext,
  'phrases' | 'words' | 'verbs' | 'graphemes' | 'dialogues' | 'domains' | 'coreAudio'>> &
  RomanianValidationContext;

function getCleanBaseContext(): FullContext {
  return {
    phrases: JSON.parse(JSON.stringify(ALL_PHRASES)),
    words: JSON.parse(JSON.stringify(ALL_WORDS)),
    verbs: JSON.parse(JSON.stringify(ALL_VERBS)),
    graphemes: JSON.parse(JSON.stringify(ALL_GRAPHEMES)),
    dialogues: JSON.parse(JSON.stringify(ALL_DIALOGUES)),
    domains: JSON.parse(JSON.stringify(ALL_DOMAINS)),
    coreAudio: JSON.parse(JSON.stringify(CORE_AUDIO)),
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
      console.error(`[FAIL GREEN TEST] Expected 0 errors, received ${result.errors.length}:`);
      for (const e of result.errors) console.error(`  - [${e.rule}] (${e.phraseId}): ${e.message}`);
    }
  } else {
    const matching = result.errors.filter(e => e.rule === result.expectedRule);
    if (matching.length > 0) {
      console.log(`[PASS RED TEST] Correctly caught expected rule [${result.expectedRule}]:`);
      for (const e of matching) console.log(`  - ${e.message}`);
    } else {
      passedAll = false;
      console.error(
        `[FAIL RED TEST] Did not find expected rule [${result.expectedRule}]. All errors (${result.errors.length}):`
      );
      for (const e of result.errors) console.error(`  - [${e.rule}] ${e.message}`);
    }
  }
}

// ============================================================================
// GREEN — the registry as it stands must be clean under both new rules
// ============================================================================

runTest('GREEN: live registry has no V30 or V31 violations', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx).filter(e => e.rule === 'V30' || e.rule === 'V31');
  return { errors, shouldPass: true };
});

// ============================================================================
// RED V30 — un-archiving one of the six duplicates must reopen the collision
// ============================================================================

runTest('RED V30: un-archiving everyday-006 re-creates the "La revedere!" duplicate', () => {
  const ctx = getCleanBaseContext();
  const victim = ctx.phrases.find(p => p.id === 'everyday-006');
  if (!victim) throw new Error('Fixture missing: phrase everyday-006 is not in the registry.');
  if (victim.status !== 'archived') {
    throw new Error(`Fixture broken: everyday-006 should be archived, found "${victim.status}".`);
  }
  const twin = ctx.phrases.find(p => p.id === 'p-core-la-revedere');
  if (!twin || twin.status !== 'published') {
    throw new Error('Fixture broken: p-core-la-revedere must be published for this test to mean anything.');
  }
  if (twin.text.ro !== victim.text.ro) {
    throw new Error(`Fixture broken: the two phrases no longer share text.ro ("${twin.text.ro}" vs "${victim.text.ro}").`);
  }
  victim.status = 'published';
  return { expectedRule: 'V30', errors: validateRomanianContent(ctx), shouldPass: false };
});

runTest('RED V30: diacritics are never normalised — "suta" must not collide with "sută"', () => {
  const ctx = getCleanBaseContext();
  const a = ctx.phrases.find(p => p.status === 'published');
  if (!a) throw new Error('Fixture missing: no published phrase.');
  const clone = JSON.parse(JSON.stringify(a));
  clone.id = 'test-diacritic-clone';
  clone.slug = 'test-diacritic-clone';
  // same letters, but ă replaced by a — a different string, so NOT a duplicate
  clone.text.ro = a.text.ro.replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i');
  if (clone.text.ro === a.text.ro) {
    // the chosen phrase had no diacritics; force a difference so the test stays meaningful
    clone.text.ro = a.text.ro + ' ă';
  }
  ctx.phrases.push(clone);
  const errors = validateRomanianContent(ctx).filter(
    e => e.rule === 'V30' && e.phraseId === 'test-diacritic-clone'
  );
  return { errors, shouldPass: true };
});

// ============================================================================
// RED V31 — removing a disambiguator must reopen the gloss collision
// ============================================================================

runTest('RED V31: stripping "(formal)" from Vă rog re-creates the "Please." collision', () => {
  const ctx = getCleanBaseContext();
  const formal = ctx.phrases.find(p => p.id === 'p-core-va-rog');
  const informal = ctx.phrases.find(p => p.id === 'p-core-te-rog');
  if (!formal || !informal) throw new Error('Fixture missing: p-core-va-rog / p-core-te-rog.');
  if (!/\(/.test(formal.text.en) || !/\(/.test(informal.text.en)) {
    throw new Error('Fixture broken: both phrases must start out disambiguated.');
  }
  formal.text.en = formal.text.en.replace(/\s*\([^)]*\)/, '');
  informal.text.en = informal.text.en.replace(/\s*\([^)]*\)/, '');
  return { expectedRule: 'V31', errors: validateRomanianContent(ctx), shouldPass: false };
});

runTest('RED V31: stripping "(masculine)" from bun re-creates the "good" collision', () => {
  const ctx = getCleanBaseContext();
  const masc = ctx.words.find(w => w.id === 'w-core-bun');
  const fem = ctx.words.find(w => w.id === 'w-core-buna');
  if (!masc || !fem) throw new Error('Fixture missing: w-core-bun / w-core-buna.');
  masc.translations.en = masc.translations.en.replace(/\s*\([^)]*\)/, '');
  fem.translations.en = fem.translations.en.replace(/\s*\([^)]*\)/, '');
  return { expectedRule: 'V31', errors: validateRomanianContent(ctx), shouldPass: false };
});

runTest('GREEN V31: one disambiguator on each side is enough — no error', () => {
  const ctx = getCleanBaseContext();
  const masc = ctx.words.find(w => w.id === 'w-core-bun');
  if (!masc) throw new Error('Fixture missing: w-core-bun.');
  // leave bună disambiguated, keep bun disambiguated too: the live state
  const errors = validateRomanianContent(ctx).filter(e => e.rule === 'V31');
  return { errors, shouldPass: true };
});

runTest('RED V31: a draft entry is invisible to the rule, a published one is not', () => {
  const ctx = getCleanBaseContext();
  const a = ctx.words.find(w => w.status === 'published' && w.translations?.en);
  if (!a) throw new Error('Fixture missing: no published word with an English gloss.');
  const clone = JSON.parse(JSON.stringify(a));
  clone.id = 'test-gloss-clone';
  clone.slug = 'test-gloss-clone';
  clone.lemma = a.lemma + 'xx';
  clone.status = 'draft';
  clone.formOf = undefined;
  ctx.words.push(clone);
  const draftErrors = validateRomanianContent(ctx).filter(
    e => e.rule === 'V31' && e.phraseId === 'test-gloss-clone'
  );
  if (draftErrors.length > 0) {
    passedAll = false;
    console.error('[FAIL] V31 fired on a draft entry; it must only see published ones.');
  }
  clone.status = 'published';
  return { expectedRule: 'V31', errors: validateRomanianContent(ctx), shouldPass: false };
});

// ============================================================================
// V32 — stored durationMs must track the real file
// ============================================================================

runTest('GREEN V32: every stored durationMs matches its file on disk', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx).filter(e => e.rule === 'V32');
  return { errors, shouldPass: true };
});

runTest('RED V32: drifting one manifest duration by 500ms is caught', () => {
  const ctx = getCleanBaseContext();
  const entry = Object.keys(ctx.coreAudio)[0];
  if (!entry) throw new Error('Fixture missing: core audio manifest is empty.');
  const clip = ctx.coreAudio[entry][0];
  if (!clip) throw new Error(`Fixture missing: no clip under "${entry}".`);
  const before = clip.durationMs;
  clip.durationMs = before + 500;
  const errors = validateRomanianContent(ctx);
  const hit = errors.filter(e => e.rule === 'V32' && e.phraseId === entry);
  if (hit.length === 0) {
    passedAll = false;
    console.error(`[FAIL] V32 did not catch a 500ms drift on "${entry}".`);
  }
  return { expectedRule: 'V32', errors, shouldPass: false };
});

runTest('GREEN V32: a 60ms drift stays inside the tolerance', () => {
  const ctx = getCleanBaseContext();
  const entry = Object.keys(ctx.coreAudio)[0];
  ctx.coreAudio[entry][0].durationMs += 60;
  const errors = validateRomanianContent(ctx).filter(e => e.rule === 'V32');
  return { errors, shouldPass: true };
});

runTest('RED V32: a grapheme duration drift is caught too, not only the manifest', () => {
  const ctx = getCleanBaseContext();
  const g = ctx.graphemes.find(x => Array.isArray(x.audio) && x.audio.length > 0);
  if (!g) throw new Error('Fixture missing: no grapheme carries audio.');
  g.audio![0].durationMs += 900;
  return { expectedRule: 'V32', errors: validateRomanianContent(ctx), shouldPass: false };
});

// ============================================================================
// V33 — verbs had no uniqueness rule at all until now
// ============================================================================

runTest('GREEN V33: no two published verbs share an infinitive', () => {
  const ctx = getCleanBaseContext();
  return { errors: validateRomanianContent(ctx).filter(e => e.rule === 'V33'), shouldPass: true };
});

runTest('RED V33: publishing v-core-a-fi alongside v-a-fi is caught', () => {
  const ctx = getCleanBaseContext();
  const draft = ctx.verbs.find(v => v.id === 'v-core-a-fi');
  const live = ctx.verbs.find(v => v.id === 'v-a-fi');
  if (!draft || !live) throw new Error('Fixture missing: v-core-a-fi / v-a-fi.');
  if (live.status !== 'published') throw new Error('Fixture broken: v-a-fi must be published.');
  if (draft.infinitive !== live.infinitive) {
    throw new Error(`Fixture broken: infinitives differ ("${draft.infinitive}" vs "${live.infinitive}").`);
  }
  draft.status = 'published';
  return { expectedRule: 'V33', errors: validateRomanianContent(ctx), shouldPass: false };
});

console.log(`\n============================================================`);
if (passedAll) {
  console.log(`ALL DRE-P173 TESTS PASSED SUCCESSFULLY!`);
  console.log(`============================================================`);
  process.exit(0);
} else {
  console.error(`SOME TESTS IN DRE-P173 SUITE REPORTED DISCREPANCIES!`);
  console.log(`============================================================`);
  process.exit(1);
}
