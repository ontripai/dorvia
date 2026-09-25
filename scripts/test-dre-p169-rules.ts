import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
  CORE_AUDIO,
} from '../src/content/romanian/registry';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function getCleanBaseContext(): RomanianValidationContext {
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
console.log('DRE-P169 RULES SUITE (CORE AUDIO MANIFEST & V29 INTEGRITY)');
console.log('============================================================');

// ----------------------------------------------------------------------------
// RED TEST 1: Manifest entry with non-existent audio file fails V29
// ----------------------------------------------------------------------------
runTest('RED TEST 1: Manifest entry referencing non-existent audio file fails V29', () => {
  const ctx = getCleanBaseContext();
  ctx.coreAudio = {
    ...ctx.coreAudio,
    'w-core-eu': [
      {
        voice: 'Aoede',
        src: '/audio/romanian/core/non-existent-w-core-eu-aoede-fake.mp3',
        durationMs: 1500,
      },
    ],
  };

  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V29', errors, shouldPass: false };
});

// ----------------------------------------------------------------------------
// RED TEST 2: Manifest entry with empty src fails V29
// ----------------------------------------------------------------------------
runTest('RED TEST 2: Manifest entry with empty src fails V29', () => {
  const ctx = getCleanBaseContext();
  ctx.coreAudio = {
    ...ctx.coreAudio,
    'w-core-tu': [
      {
        voice: 'Puck',
        src: '   ',
        durationMs: 1200,
      },
    ],
  };

  const errors = validateRomanianContent(ctx);
  return { expectedRule: 'V29', errors, shouldPass: false };
});

// ----------------------------------------------------------------------------
// GREEN TEST 1: Healthy context with CORE_AUDIO passes all rules V1 through V29
// ----------------------------------------------------------------------------
runTest('GREEN TEST 1: Healthy context with CORE_AUDIO passes V1 through V29', () => {
  const ctx = getCleanBaseContext();
  const errors = validateRomanianContent(ctx);
  return { errors, shouldPass: true };
});



// ----------------------------------------------------------------------------
// GREEN TEST 3: Report unreferenced/orphan mp3 files in public/audio/romanian/core/
// ----------------------------------------------------------------------------
runTest('GREEN TEST 3: Orphan check - identify any unreferenced mp3 files in public/audio/romanian/core/', () => {
  const coreAudioDir = path.join(rootDir, 'public', 'audio', 'romanian', 'core');
  const errors: ValidationError[] = [];

  if (!fs.existsSync(coreAudioDir)) {
    // If directory not created yet, pass
    return { errors, shouldPass: true };
  }

  const manifestSrcSet = new Set<string>();
  for (const clips of Object.values(CORE_AUDIO)) {
    if (Array.isArray(clips)) {
      for (const clip of clips) {
        if (clip.src) manifestSrcSet.add(clip.src);
      }
    }
  }

  const diskFiles = fs.readdirSync(coreAudioDir).filter(f => f.endsWith('.mp3'));
  const orphans: string[] = [];

  for (const f of diskFiles) {
    const webSrc = `/audio/romanian/core/${f}`;
    if (!manifestSrcSet.has(webSrc)) {
      orphans.push(f);
    }
  }

  if (orphans.length > 0) {
    console.warn(`[ORPHAN AUDIO FILES REPORTED]: Found ${orphans.length} unreferenced audio file(s):`);
    for (const o of orphans) {
      console.warn(`  - ${o}`);
    }
  } else {
    console.log(`[ORPHAN CHECK PASSED]: 0 unreferenced audio files found on disk.`);
  }

  return { errors, shouldPass: true };
});

// ----------------------------------------------------------------------------
// GREEN TEST 4: Total audio directory size check (< 20MB)
// ----------------------------------------------------------------------------
runTest('GREEN TEST 4: Size check - total audio directory size must be under 20MB', () => {
  const coreAudioDir = path.join(rootDir, 'public', 'audio', 'romanian', 'core');
  const errors: ValidationError[] = [];

  if (!fs.existsSync(coreAudioDir)) {
    return { errors, shouldPass: true };
  }

  let totalBytes = 0;
  const diskFiles = fs.readdirSync(coreAudioDir).filter(f => f.endsWith('.mp3'));
  for (const f of diskFiles) {
    totalBytes += fs.statSync(path.join(coreAudioDir, f)).size;
  }

  const totalMb = totalBytes / (1024 * 1024);
  console.log(`Total core audio size: ${totalMb.toFixed(2)} MB across ${diskFiles.length} MP3 files.`);

  if (totalBytes > 20 * 1024 * 1024) {
    errors.push({
      rule: 'V29',
      phraseId: 'core-audio-size',
      message: `Total core audio directory size (${totalMb.toFixed(2)} MB) exceeds 20 MB limit!`,
    });
  }

  return { errors, shouldPass: true };
});

if (!passedAll) {
  console.error('\nFAILED: One or more tests in DRE-P169 rules suite failed.');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All DRE-P169 tests passed successfully.');
}
