import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_WORDS, ALL_PHRASES } from '../src/content/romanian/registry';
import { AudioClip, RomanianWord, RomanianPhrase } from '../src/lib/romanian/types';
import {
  getApiKey,
  callTtsWithRetry,
  wavToMp3WithDuration,
  getMp3DurationMs,
  callTranscribeMp3WithRetry,
  normalizeForComparison,
  sleep,
} from './lib/tts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

interface TargetItem {
  id: string;
  stationId: string;
  targetText: string;
  rawText: string;
  isPhrase: boolean;
}

interface ClipLogRecord {
  id: string;
  targetText: string;
  voice: 'Aoede' | 'Puck';
  filename: string;
  transcribedText: string;
  isMatch: boolean;
  durationMs: number;
  sizeBytes: number;
  status: 'generated' | 'cached' | 'failed';
}

function cleanPhraseText(raw: string): string {
  // Remove {{...}} placeholders and any attached punctuation / whitespace around or following them
  let cleaned = raw.replace(/\{\{[^}]*\}\}[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»—–\s]*/gu, '');
  // Also strip any leftover trailing punctuation
  cleaned = cleaned.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»—–\s]+$/gu, '');
  return cleaned.replace(/\s+/g, ' ').trim();
}

function isLongItem(targetText: string): boolean {
  const words = targetText.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return true;
  const letters = targetText.replace(/[\s.,\/#!$%\^&\*;:{}=\-_`~()?"'«»—–]/gu, '');
  return letters.length >= 8;
}

async function main() {
  console.log('================================================================');
  console.log('DORVIA DRE-P169: CORE CONTENT AUDIO GENERATION & TRANSCRIPTION');
  console.log('================================================================');

  const apiKey = getApiKey();
  console.log('API key loaded securely from environment.');

  const force = process.argv.includes('--force');
  if (force) {
    console.log('Flag --force detected: will overwrite existing audio clips.');
  }

  const ttsModel = 'gemini-3.1-flash-tts-preview';
  console.log(`TTS Model: ${ttsModel}`);

  // Directories
  const targetMp3Dir = path.join(rootDir, 'public', 'audio', 'romanian', 'core');
  const tempWavDir = path.join(rootDir, 'scratch', 'audio-core-wav');
  const cacheFile = path.join(rootDir, 'scratch', 'audio-transcription-cache.json');
  const logFile = path.join(rootDir, 'core-audio-generation.log');
  const manifestFile = path.join(rootDir, 'src', 'content', 'romanian', 'audio-manifest.ts');

  fs.mkdirSync(targetMp3Dir, { recursive: true });
  fs.mkdirSync(tempWavDir, { recursive: true });

  // Load transcription cache if present
  let transcriptionCache: Record<string, { text: string; isMatch: boolean }> = {};
  if (fs.existsSync(cacheFile)) {
    try {
      transcriptionCache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch {
      transcriptionCache = {};
    }
  }

  const saveCache = () => {
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(transcriptionCache, null, 2), 'utf8');
    } catch (e) {
      console.warn('Could not write cache file:', e);
    }
  };

  const coreStations = [
    'core-greetings',
    'core-pronouns',
    'core-question-words',
    'core-time',
    'core-numbers',
  ];

  // 1. Gather all 160 items:
  // First prioritize the 20 greeting phrases as instructed, then greeting words, then other stations
  const pubPhrases = ALL_PHRASES.filter(
    p => p.status === 'published' && coreStations.includes(p.stationId || '')
  );
  const pubWords = ALL_WORDS.filter(
    w => w.status === 'published' && coreStations.includes(w.stationId || '')
  );

  const greetingPhrases = pubPhrases.filter(p => p.stationId === 'core-greetings');
  const otherPhrases = pubPhrases.filter(p => p.stationId !== 'core-greetings');
  const greetingWords = pubWords.filter(w => w.stationId === 'core-greetings');
  const pronounWords = pubWords.filter(w => w.stationId === 'core-pronouns');
  const questionWords = pubWords.filter(w => w.stationId === 'core-question-words');
  const timeWords = pubWords.filter(w => w.stationId === 'core-time');
  const numberWords = pubWords.filter(w => w.stationId === 'core-numbers');

  const orderedItems: TargetItem[] = [];

  // Add greeting phrases first (highest priority)
  for (const p of greetingPhrases) {
    const cleanRo = cleanPhraseText(p.text.ro);
    orderedItems.push({
      id: p.id,
      stationId: p.stationId || 'core-greetings',
      targetText: cleanRo,
      rawText: p.text.ro,
      isPhrase: true,
    });
  }

  // Greeting words
  for (const w of greetingWords) {
    orderedItems.push({
      id: w.id,
      stationId: w.stationId || 'core-greetings',
      targetText: w.lemma.trim(),
      rawText: w.lemma,
      isPhrase: false,
    });
  }

  // Pronouns
  for (const w of pronounWords) {
    orderedItems.push({
      id: w.id,
      stationId: w.stationId || 'core-pronouns',
      targetText: w.lemma.trim(),
      rawText: w.lemma,
      isPhrase: false,
    });
  }

  // Question words
  for (const w of questionWords) {
    orderedItems.push({
      id: w.id,
      stationId: w.stationId || 'core-question-words',
      targetText: w.lemma.trim(),
      rawText: w.lemma,
      isPhrase: false,
    });
  }

  // Time words
  for (const w of timeWords) {
    orderedItems.push({
      id: w.id,
      stationId: w.stationId || 'core-time',
      targetText: w.lemma.trim(),
      rawText: w.lemma,
      isPhrase: false,
    });
  }

  // Number words
  for (const w of numberWords) {
    orderedItems.push({
      id: w.id,
      stationId: w.stationId || 'core-numbers',
      targetText: w.lemma.trim(),
      rawText: w.lemma,
      isPhrase: false,
    });
  }

  // Any other phrases if any
  for (const p of otherPhrases) {
    const cleanRo = cleanPhraseText(p.text.ro);
    orderedItems.push({
      id: p.id,
      stationId: p.stationId || 'core',
      targetText: cleanRo,
      rawText: p.text.ro,
      isPhrase: true,
    });
  }

  console.log(`\nIdentified ${orderedItems.length} published core items to process:`);
  console.log(`  - Greeting phrases: ${greetingPhrases.length}`);
  console.log(`  - Greeting words: ${greetingWords.length}`);
  console.log(`  - Pronouns: ${pronounWords.length}`);
  console.log(`  - Question words: ${questionWords.length}`);
  console.log(`  - Time words: ${timeWords.length}`);
  console.log(`  - Number words: ${numberWords.length}`);
  console.log(`Total audio clips to generate: ${orderedItems.length * 2} (Aoede & Puck).\n`);

  if (orderedItems.length !== 160) {
    console.warn(`WARNING: Expected exactly 160 items, but found ${orderedItems.length}!`);
  }

  const voices: Array<{ name: 'Aoede' | 'Puck'; suffix: string }> = [
    { name: 'Aoede', suffix: 'aoede' },
    { name: 'Puck', suffix: 'puck' },
  ];

  const manifestData: Record<string, AudioClip[]> = {};
  const clipRecords: ClipLogRecord[] = [];

  let totalGenerated = 0;
  let totalCached = 0;
  let totalFailed = 0;
  let totalMismatches = 0;
  let totalEvaluatedTranscriptions = 0;

  let totalLongEvaluated = 0;
  let totalLongMismatches = 0;
  let totalShortEvaluated = 0;
  let totalShortMismatches = 0;

  let currentItemIndex = 0;
  const totalClips = orderedItems.length * 2;

  for (const item of orderedItems) {
    currentItemIndex++;
    const clipsForItem: AudioClip[] = [];

    console.log(
      `\n[Item ${currentItemIndex}/${orderedItems.length}] [${item.stationId}] "${item.id}" -> "${item.targetText}"`
    );

    for (const v of voices) {
      const clipIndex = (currentItemIndex - 1) * 2 + (v.name === 'Aoede' ? 1 : 2);
      const filename = `${item.id}-${v.suffix}.mp3`;
      const mp3Path = path.join(targetMp3Dir, filename);
      const webSrc = `/audio/romanian/core/${filename}`;
      const cacheKey = `${item.id}-${v.suffix}`;

      const exists = fs.existsSync(mp3Path) && fs.statSync(mp3Path).size > 0;
      const forceThisItem = force || item.id === 'p-core-ma-numesc';

      if (forceThisItem && transcriptionCache[cacheKey]) {
        delete transcriptionCache[cacheKey];
      }

      let durationMs = 0;
      let transcribedText = '';
      let isMatch = false;

      if (exists && !forceThisItem) {
        totalCached++;
        durationMs = getMp3DurationMs(mp3Path);
        const sizeBytes = fs.statSync(mp3Path).size;

        if (transcriptionCache[cacheKey]) {
          transcribedText = transcriptionCache[cacheKey].text;
          isMatch = transcriptionCache[cacheKey].isMatch;
        } else {
          // Transcribe existing file to ensure verification
          console.log(`  [${clipIndex}/${totalClips}] ${v.name}: MP3 exists (${durationMs}ms, ${sizeBytes}b), verifying transcription...`);
          try {
            const mp3Buf = fs.readFileSync(mp3Path);
            const trResult = await callTranscribeMp3WithRetry(apiKey, mp3Buf, item.isPhrase);
            transcribedText = trResult.text;
            const normTarget = normalizeForComparison(item.targetText);
            const normTrans = normalizeForComparison(transcribedText);
            isMatch = normTarget === normTrans;
            transcriptionCache[cacheKey] = { text: transcribedText, isMatch };
            saveCache();
            await sleep(300);
          } catch (e: any) {
            transcribedText = `[Transcribe Err: ${e.message}]`;
            isMatch = false;
          }
        }

        totalEvaluatedTranscriptions++;
        if (!isMatch) totalMismatches++;

        const isLong = isLongItem(item.targetText);
        if (isLong) {
          totalLongEvaluated++;
          if (!isMatch) totalLongMismatches++;
        } else {
          totalShortEvaluated++;
          if (!isMatch) totalShortMismatches++;
        }

        console.log(
          `  [${clipIndex}/${totalClips}] ${v.name} (cached): "${transcribedText}" | match=${isMatch} (long=${isLong}) | ${durationMs}ms | ${sizeBytes}b`
        );

        clipsForItem.push({
          voice: v.name,
          src: webSrc,
          durationMs,
        });

        clipRecords.push({
          id: item.id,
          targetText: item.targetText,
          voice: v.name,
          filename,
          transcribedText,
          isMatch,
          durationMs,
          sizeBytes,
          status: 'cached',
        });
      } else {
        // Need to generate audio
        console.log(`  [${clipIndex}/${totalClips}] Generating ${v.name} for "${item.targetText}"...`);
        const tempWav = path.join(tempWavDir, `${item.id}-${v.suffix}.wav`);

        try {
          const wavBuffer = await callTtsWithRetry(
            apiKey,
            ttsModel,
            item.targetText,
            v.name,
            item.isPhrase
          );
          fs.writeFileSync(tempWav, wavBuffer);

          durationMs = wavToMp3WithDuration(tempWav, mp3Path);
          const sizeBytes = fs.statSync(mp3Path).size;
          totalGenerated++;

          // Transcribe immediately
          const mp3Buf = fs.readFileSync(mp3Path);
          const trResult = await callTranscribeMp3WithRetry(apiKey, mp3Buf, item.isPhrase);
          transcribedText = trResult.text;

          const normTarget = normalizeForComparison(item.targetText);
          const normTrans = normalizeForComparison(transcribedText);
          isMatch = normTarget === normTrans;

          transcriptionCache[cacheKey] = { text: transcribedText, isMatch };
          saveCache();

          totalEvaluatedTranscriptions++;
          if (!isMatch) totalMismatches++;

          const isLong = isLongItem(item.targetText);
          if (isLong) {
            totalLongEvaluated++;
            if (!isMatch) totalLongMismatches++;
          } else {
            totalShortEvaluated++;
            if (!isMatch) totalShortMismatches++;
          }

          console.log(
            `    -> Transcribed: "${transcribedText}" | Match: ${isMatch} (long=${isLong}) | Duration: ${durationMs}ms | Size: ${sizeBytes}b`
          );

          clipsForItem.push({
            voice: v.name,
            src: webSrc,
            durationMs,
          });

          clipRecords.push({
            id: item.id,
            targetText: item.targetText,
            voice: v.name,
            filename,
            transcribedText,
            isMatch,
            durationMs,
            sizeBytes,
            status: 'generated',
          });

          // Cleanup temp wav
          if (fs.existsSync(tempWav)) fs.unlinkSync(tempWav);

          await sleep(400);
        } catch (err: any) {
          totalFailed++;
          console.error(`  ❌ Failed to generate clip ${v.name} for ${item.id}:`, err.message);

          clipRecords.push({
            id: item.id,
            targetText: item.targetText,
            voice: v.name,
            filename,
            transcribedText: `[FAILED: ${err.message}]`,
            isMatch: false,
            durationMs: 0,
            sizeBytes: 0,
            status: 'failed',
          });
        }
      }

      // Check Stop Condition 1: Long items mismatch rate > 10% (after at least 20 long items evaluated)
      if (totalLongEvaluated >= 20) {
        const longMismatchRate = totalLongMismatches / totalLongEvaluated;
        if (longMismatchRate > 0.10) {
          console.error(
            `\n🚨 STOP CONDITION 1 TRIGGERED: Long items mismatch rate is ${(longMismatchRate * 100).toFixed(1)}% (${totalLongMismatches}/${totalLongEvaluated}), exceeding 10% threshold!`
          );
          console.error('Halting execution to avoid wasting API quota.');
          writeOutputs(manifestData, clipRecords, manifestFile, logFile);
          process.exit(1);
        }
      }
    }

    if (clipsForItem.length > 0) {
      manifestData[item.id] = clipsForItem;
    }
  }

  writeOutputs(manifestData, clipRecords, manifestFile, logFile);

  // Check Stop Condition: Total directory size > 20MB
  let totalDirBytes = 0;
  const filesInCore = fs.readdirSync(targetMp3Dir);
  for (const f of filesInCore) {
    if (f.endsWith('.mp3')) {
      totalDirBytes += fs.statSync(path.join(targetMp3Dir, f)).size;
    }
  }
  const totalDirMb = (totalDirBytes / (1024 * 1024)).toFixed(2);
  console.log(`\nTotal audio size on disk: ${totalDirMb} MB (${totalDirBytes} bytes) across ${filesInCore.length} files.`);
  if (totalDirBytes > 20 * 1024 * 1024) {
    console.error(`🚨 STOP CONDITION TRIGGERED: Total audio directory size (${totalDirMb} MB) exceeds 20 MB!`);
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('SUMMARY OF CORE AUDIO EXECUTION:');
  console.log('================================================================');
  console.log(`Total Items: ${orderedItems.length} (Expected: 160)`);
  console.log(`Total Clips Evaluated: ${clipRecords.length} (Generated: ${totalGenerated}, Cached: ${totalCached}, Failed: ${totalFailed})`);
  console.log(
    `Overall Mismatches: ${totalMismatches}/${totalEvaluatedTranscriptions} (${((totalMismatches / (totalEvaluatedTranscriptions || 1)) * 100).toFixed(1)}%)`
  );
  console.log(
    `Long Items Mismatches: ${totalLongMismatches}/${totalLongEvaluated} (${((totalLongMismatches / (totalLongEvaluated || 1)) * 100).toFixed(1)}%)`
  );
  console.log(
    `Short Items Mismatches: ${totalShortMismatches}/${totalShortEvaluated} (${((totalShortMismatches / (totalShortEvaluated || 1)) * 100).toFixed(1)}%)`
  );

  const minimalPairPrefixes = [
    'w-core-pa-',
    'w-core-te-aoede',
    'w-core-iti-aoede',
    'w-core-imi-puck',
    'w-core-eu-aoede',
    'p-core-imi-pare-bine-aoede',
    'p-core-ma-numesc-',
  ];

  const highRiskRecords = clipRecords.filter(r =>
    minimalPairPrefixes.some(pre => r.filename.startsWith(pre))
  );

  const otherMismatchRecords = clipRecords.filter(
    r => !r.isMatch && !minimalPairPrefixes.some(pre => r.filename.startsWith(pre))
  );

  console.log('\n--- HIGH-RISK MINIMAL PAIRS STATUS ---');
  for (const r of highRiskRecords) {
    console.log(`  ${r.filename}: target="${r.targetText}", transcribed="${r.transcribedText}", match=${r.isMatch ? 'YES' : 'NO'}`);
  }

  console.log('\n--- OTHER MISMATCHES ---');
  if (otherMismatchRecords.length === 0) {
    console.log('  None!');
  } else {
    for (const r of otherMismatchRecords) {
      console.log(`  ${r.filename}: target="${r.targetText}", transcribed="${r.transcribedText}"`);
    }
  }
  console.log(`Manifest written to: ${manifestFile}`);
  console.log(`Log written to: ${logFile}`);
}

function writeOutputs(
  manifestData: Record<string, AudioClip[]>,
  clipRecords: ClipLogRecord[],
  manifestFile: string,
  logFile: string
) {
  // Write audio-manifest.ts
  const manifestTs = `// src/content/romanian/audio-manifest.ts — فایل تولیدشده، دستی ویرایش نشود
import { AudioClip } from '@/lib/romanian/types';

export const CORE_AUDIO: Record<string, AudioClip[]> = ${JSON.stringify(manifestData, null, 2)};
`;
  fs.writeFileSync(manifestFile, manifestTs, 'utf8');
  console.log(`Successfully updated manifest: ${manifestFile}`);

  // Write log file
  const header = 'id | متن هدف | صدا | فایل | رونویسی‌شده | منطبق؟ | مدت | اندازه\n';
  const rows = clipRecords.map(r =>
    `${r.id} | ${r.targetText} | ${r.voice} | ${r.filename} | ${r.transcribedText} | ${r.isMatch ? 'بله' : 'خیر'} | ${r.durationMs}ms | ${r.sizeBytes}B`
  ).join('\n');
  fs.writeFileSync(logFile, header + rows, 'utf8');
  console.log(`Successfully updated log: ${logFile}`);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
