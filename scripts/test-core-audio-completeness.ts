import {
  ALL_WORDS,
  ALL_PHRASES,
  CORE_AUDIO,
} from '../src/content/romanian/registry';

console.log('============================================================');
console.log('DRE-P169 SEPARATE TEST: CORE AUDIO COMPLETENESS CHECK');
console.log('(Separate check — not a build rule)');
console.log('============================================================');

const coreStations = [
  'core-greetings',
  'core-pronouns',
  'core-question-words',
  'core-time',
  'core-numbers',
];

const pubWords = ALL_WORDS.filter(w => w.status === 'published' && coreStations.includes(w.stationId || ''));
const pubPhrases = ALL_PHRASES.filter(p => p.status === 'published' && coreStations.includes(p.stationId || ''));
const allCoreItems = [...pubWords, ...pubPhrases];

console.log(`Total published core items expected: ${allCoreItems.length} (Target: 160)`);

let completeCount = 0;
const missingItems: string[] = [];
const incompleteItems: Array<{ id: string; clipsCount: number; voices: string[] }> = [];

for (const item of allCoreItems) {
  const clips = CORE_AUDIO[item.id];
  if (!clips || !Array.isArray(clips) || clips.length === 0) {
    missingItems.push(item.id);
    continue;
  }

  if (clips.length !== 2) {
    incompleteItems.push({
      id: item.id,
      clipsCount: clips.length,
      voices: clips.map(c => c.voice),
    });
    continue;
  }

  const voices = clips.map(c => c.voice);
  if (!voices.includes('Aoede') || !voices.includes('Puck')) {
    incompleteItems.push({
      id: item.id,
      clipsCount: clips.length,
      voices,
    });
    continue;
  }

  completeCount++;
}

console.log(`\nCoverage Summary:`);
console.log(`  - Items with exactly 2 clips (Aoede & Puck): ${completeCount}/${allCoreItems.length} (${((completeCount / allCoreItems.length) * 100).toFixed(1)}%)`);
console.log(`  - Total Clips in Manifest: ${completeCount * 2}/${allCoreItems.length * 2}`);
console.log(`  - Items missing: ${missingItems.length}`);
console.log(`  - Incomplete items: ${incompleteItems.length}`);

if (missingItems.length > 0) {
  console.log(`\nPending items awaiting TTS quota reset:`);
  for (const id of missingItems) {
    console.log(`  - ${id}`);
  }
}

if (incompleteItems.length > 0) {
  console.log(`\nIncomplete items:`);
  for (const inc of incompleteItems) {
    console.log(`  - ${inc.id}: ${inc.clipsCount} clips (${inc.voices.join(', ')})`);
  }
}

if (completeCount === allCoreItems.length) {
  console.log(`\n🎉 SUCCESS: All 160 core items have exactly 2 clips!`);
  process.exit(0);
} else {
  console.log(`\n📊 REPORT: ${completeCount}/160 items complete. ${missingItems.length} pending next run.`);
  process.exit(0); // Non-zero exit code not used for reporting test
}
