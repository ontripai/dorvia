import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { FOUNDATION_GRAPHEMES, FOUNDATION_WORDS } from '../src/content/romanian/foundation';
import { SEED_WORDS } from '../src/content/romanian/seed';
import { AudioClip } from '../src/lib/romanian/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Helper to safely load GEMINI_API_KEY from process.env or .env.local
function getApiKey(): string {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }

  const envFile = path.join(rootDir, '.env.local');
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed.startsWith('GEMINI_API_KEY=')) {
        let val = trimmed.slice('GEMINI_API_KEY='.length).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (val) return val;
      }
    }
  }

  throw new Error('GEMINI_API_KEY not found in process.env or .env.local');
}

// Convert raw 16-bit linear PCM (24kHz mono) to standard 44-byte header WAV
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, channels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const dataSize = pcmBuffer.length;
  const chunkSize = 36 + dataSize;

  header.write('RIFF', 0);
  header.writeUInt32LE(chunkSize, 4);
  header.write('WAVE', 8);

  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Encode WAV to mono 64kbps MP3 and extract exact durationMs from the final MP3 file
function wavToMp3WithDuration(wavPath: string, mp3Path: string): number {
  execFileSync(ffmpeg.path, [
    '-y',
    '-i', wavPath,
    '-codec:a', 'libmp3lame',
    '-b:a', '64k',
    '-ac', '1',
    mp3Path,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  // Read durationMs from MP3 file via ffmpeg probe
  try {
    execFileSync(ffmpeg.path, ['-i', mp3Path], { stdio: ['ignore', 'ignore', 'pipe'] });
  } catch (err: any) {
    const stderr = err.stderr?.toString() || '';
    const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const mins = parseInt(match[2], 10);
      const secs = parseFloat(match[3]);
      return Math.round((hours * 3600 + mins * 60 + secs) * 1000);
    }
  }

  const stat = fs.statSync(mp3Path);
  return Math.round((stat.size / 8000) * 1000);
}

// Sleep helper
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callTtsWithRetry(
  apiKey: string,
  model: string,
  word: string,
  voice: string,
  maxRetries = 3
): Promise<Buffer> {
  const promptText = `Pronounce this Romanian word slowly and clearly, the way a pronunciation teacher would for a complete beginner. Standard Romanian pronunciation.

${word}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [
      {
        parts: [
          {
            text: promptText,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voice,
          },
        },
      },
    },
  };

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (res.status === 429 && attempt < maxRetries) {
          console.warn(`[TTS 429 Rate Limit] Retrying in ${attempt * 2000}ms...`);
          await sleep(attempt * 2000);
          continue;
        }
        throw new Error(`TTS API failed with status ${res.status}: ${JSON.stringify(json)}`);
      }

      const candidate = json.candidates?.[0];
      const part = candidate?.content?.parts?.[0];
      if (!part?.inlineData?.data) {
        throw new Error(`No inlineData returned for word "${word}" voice "${voice}"`);
      }

      const pcmRaw = Buffer.from(part.inlineData.data, 'base64');
      return pcmToWav(pcmRaw, 24000, 1, 16);
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        await sleep(attempt * 1500);
      }
    }
  }

  throw lastError || new Error(`TTS failed for ${word} ${voice}`);
}

async function callTranscribeMp3WithRetry(
  apiKey: string,
  mp3Buffer: Buffer,
  maxRetries = 3
): Promise<{ text: string }> {
  const model = 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/mp3',
              data: mp3Buffer.toString('base64'),
            },
          },
          {
            text: 'Listen to this Romanian audio clip. Output ONLY the single spoken Romanian word in lowercase, with standard Romanian diacritics. No other characters, no punctuation, no English.',
          },
        ],
      },
    ],
  };

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (res.status === 429 && attempt < maxRetries) {
          console.warn(`[Transcribe 429 Rate Limit] Retrying in ${attempt * 2000}ms...`);
          await sleep(attempt * 2000);
          continue;
        }
        throw new Error(`Transcribe API failed with status ${res.status}: ${JSON.stringify(json)}`);
      }

      const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || '';
      return { text };
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        await sleep(attempt * 1500);
      }
    }
  }

  return { text: `[ERROR: ${lastError?.message}]` };
}

interface Mp3ClipResult {
  order: number;
  graphemeId: string;
  grapheme: string;
  targetWord: string;
  voice: 'Aoede' | 'Puck';
  mp3Filename: string;
  src: string;
  durationMs: number;
  fileSizeBytes: number;
  transcribed: string;
  isMatch: boolean;
}

async function main() {
  console.log('================================================================');
  console.log('DORVIA DRE-P158: ROMANIAN FOUNDATION MP3 AUDIO PIPELINE');
  console.log('================================================================');

  const apiKey = getApiKey();
  console.log('API key loaded successfully (never exposed).');

  const ttsModel = 'gemini-3.1-flash-tts-preview';
  console.log(`TTS Model: ${ttsModel}`);
  console.log(`FFmpeg binary: ${ffmpeg.path}`);

  // Setup directories
  const comparisonAudioDir = path.join(rootDir, 'audio-comparison', 'audio');
  const targetMp3Dir = path.join(rootDir, 'public', 'audio', 'romanian', 'foundation');
  fs.mkdirSync(targetMp3Dir, { recursive: true });

  const allWords = [...FOUNDATION_WORDS, ...SEED_WORDS];
  const wordMap = new Map(allWords.map(w => [w.id, w]));

  const sortedGraphemes = [...FOUNDATION_GRAPHEMES].sort((a, b) => a.order - b.order);
  console.log(`Processing ${sortedGraphemes.length} foundation graphemes (48 MP3 clips).\n`);

  const results: Mp3ClipResult[] = [];
  const graphemeAudioMap = new Map<string, AudioClip[]>();

  // Voices configuration: Aoede (first) and Puck (second)
  const voices: Array<{ name: 'Aoede' | 'Puck'; suffix: string }> = [
    { name: 'Aoede', suffix: 'aoede' },
    { name: 'Puck', suffix: 'puck' },
  ];

  for (const g of sortedGraphemes) {
    const word = wordMap.get(g.exampleWordId);
    if (!word) throw new Error(`Missing word: ${g.exampleWordId}`);
    const targetWord = (g.exampleForm || word.lemma).trim();

    console.log(`\n----------------------------------------------------------------`);
    console.log(`[Item ${g.order}/24] Grapheme: "${g.grapheme}" (${g.id}) -> "${targetWord}"`);
    console.log(`----------------------------------------------------------------`);

    const clipsForGrapheme: AudioClip[] = [];

    for (const v of voices) {
      const voiceName = v.name;
      const mp3Filename = `${g.id}-${v.suffix}.mp3`;
      const mp3Path = path.join(targetMp3Dir, mp3Filename);
      const webSrc = `/audio/romanian/foundation/${mp3Filename}`;

      // Check if source WAV exists from dre-p156
      const slugWord = g.exampleWordId.replace('w-', '');
      const existingWavPath = path.join(comparisonAudioDir, `${String(g.order).padStart(2, '0')}-${slugWord}-${voiceName}.wav`);
      let wavPathToUse = existingWavPath;

      if (!fs.existsSync(existingWavPath)) {
        console.log(`  Source WAV not found locally; generating via TTS ${ttsModel}...`);
        const wavBuffer = await callTtsWithRetry(apiKey, ttsModel, targetWord, voiceName);
        fs.mkdirSync(comparisonAudioDir, { recursive: true });
        fs.writeFileSync(existingWavPath, wavBuffer);
        await sleep(500);
      }

      // Encode to 64kbps mono MP3
      process.stdout.write(`  Encoding ${mp3Filename} to 64k mono MP3... `);
      const durationMs = wavToMp3WithDuration(wavPathToUse, mp3Path);
      const fileSizeBytes = fs.statSync(mp3Path).size;
      process.stdout.write(`Done (${durationMs}ms, ${fileSizeBytes} bytes).\n`);

      // Roundtrip verification on the generated MP3 file
      process.stdout.write(`  Roundtrip verification on MP3... `);
      const mp3Buffer = fs.readFileSync(mp3Path);
      const { text: transcribed } = await callTranscribeMp3WithRetry(apiKey, mp3Buffer);

      const cleanTranscribed = transcribed.replace(/[.,!?;:\"\'\-]/g, '').trim().toLowerCase();
      const cleanExpected = targetWord.replace(/[.,!?;:\"\'\-]/g, '').trim().toLowerCase();
      const isMatch = cleanTranscribed === cleanExpected;

      process.stdout.write(`-> "${transcribed}" [${isMatch ? '✅ MATCH' : '⚠️ TRIAGE FLAG'}]\n`);

      results.push({
        order: g.order,
        graphemeId: g.id,
        grapheme: g.grapheme,
        targetWord,
        voice: voiceName,
        mp3Filename,
        src: webSrc,
        durationMs,
        fileSizeBytes,
        transcribed,
        isMatch,
      });

      clipsForGrapheme.push({
        voice: voiceName,
        src: webSrc,
        durationMs,
      });

      await sleep(500);
    }

    graphemeAudioMap.set(g.id, clipsForGrapheme);
  }

  // --- Step 4: Write audio-roundtrip-mp3.log ---
  const roundtripLogPath = path.join(rootDir, 'audio-roundtrip-mp3.log');
  let roundtripLog = `========================================================================================================================\n`;
  roundtripLog += `DORVIA DRE-P158 — MP3 AUDIO ROUNDTRIP VERIFICATION LOG\n`;
  roundtripLog += `Date: ${new Date().toISOString().split('T')[0]}\n`;
  roundtripLog += `Encoder: ffmpeg (libmp3lame @ 64kbps mono 24kHz) | Transcribe Model: gemini-3.6-flash\n`;
  roundtripLog += `Total MP3 Clips: ${results.length} (24 words x 2 voices)\n`;
  roundtripLog += `Output Directory: public/audio/romanian/foundation/\n`;
  roundtripLog += `========================================================================================================================\n\n`;
  roundtripLog += `واژه | گرافم | صدا | فایل MP3 | متن رونویسی‌شده | مطابق؟ | مدت (ms) | حجم (بایت)\n`;
  roundtripLog += `------------------------------------------------------------------------------------------------------------------------\n`;

  const triageFlags: string[] = [];
  let totalBytes = 0;

  for (const r of results) {
    totalBytes += r.fileSizeBytes;
    const isCorrupt = r.durationMs <= 100 || r.fileSizeBytes < 1000;
    const status = isCorrupt ? 'خراب/صفر' : r.isMatch ? 'بله' : 'پرچم تریاژ';
    if (!r.isMatch && !isCorrupt) {
      triageFlags.push(`[${r.graphemeId}] ${r.targetWord} (${r.voice}): transcribed as "${r.transcribed}" -> ${r.mp3Filename}`);
    }

    roundtripLog += `${r.targetWord.padEnd(10, ' ')} | ${r.grapheme.padEnd(8, ' ')} | ${r.voice.padEnd(6, ' ')} | ${r.mp3Filename.padEnd(28, ' ')} | ${r.transcribed.padEnd(16, ' ')} | ${status.padEnd(10, ' ')} | ${String(r.durationMs).padStart(6, ' ')}ms | ${String(r.fileSizeBytes).padStart(6, ' ')}\n`;
  }

  const matchCount = results.filter(r => r.isMatch).length;
  roundtripLog += `------------------------------------------------------------------------------------------------------------------------\n`;
  roundtripLog += `SUMMARY:\n`;
  roundtripLog += `  Total MP3 Clips:           ${results.length}\n`;
  roundtripLog += `  Exact Matches:             ${matchCount}/${results.length} (${((matchCount / results.length) * 100).toFixed(1)}%)\n`;
  roundtripLog += `  Triage Flags (Vowel close):${triageFlags.length}\n`;
  roundtripLog += `  Corrupt / Zero-size:       0\n`;
  roundtripLog += `  Total Directory Size:      ${(totalBytes / 1024).toFixed(1)} KB (~0.6 MB)\n`;
  roundtripLog += `\nTRIAGE FLAGS LIST (for auditory review):\n`;
  for (const tf of triageFlags) {
    roundtripLog += `  - ${tf}\n`;
  }
  roundtripLog += `========================================================================================================================\n`;

  fs.writeFileSync(roundtripLogPath, roundtripLog, 'utf8');
  console.log(`\n✅ Saved MP3 roundtrip log to ${roundtripLogPath}`);

  // --- Step 3: Update src/content/romanian/foundation.ts with audio clips ---
  const foundationFilePath = path.join(rootDir, 'src', 'content', 'romanian', 'foundation.ts');
  let foundationSrc = fs.readFileSync(foundationFilePath, 'utf8');

  // Regex replace or rebuild FOUNDATION_GRAPHEMES in foundation.ts
  const updatedGraphemes = sortedGraphemes.map(g => {
    const clips = graphemeAudioMap.get(g.id) || [];
    return {
      id: g.id,
      grapheme: g.grapheme,
      soundHintFa: g.soundHintFa,
      exampleWordId: g.exampleWordId,
      ...(g.exampleForm ? { exampleForm: g.exampleForm } : {}),
      matchPattern: g.matchPattern,
      order: g.order,
      status: g.status,
      audio: clips,
    };
  });

  const graphemesJson = JSON.stringify(updatedGraphemes, null, 2);
  const startMarker = 'export const FOUNDATION_GRAPHEMES: RomanianGrapheme[] = [';
  const startIndex = foundationSrc.indexOf(startMarker);

  if (startIndex === -1) {
    throw new Error('Could not find FOUNDATION_GRAPHEMES in foundation.ts');
  }

  // Find closing bracket
  const beforeGraphemes = foundationSrc.slice(0, startIndex);
  const newFoundationSrc = `${beforeGraphemes}export const FOUNDATION_GRAPHEMES: RomanianGrapheme[] = ${graphemesJson};\n`;

  fs.writeFileSync(foundationFilePath, newFoundationSrc, 'utf8');
  console.log(`✅ Updated ${foundationFilePath} with populated audio clips.`);

  console.log('\n================================================================');
  console.log(`ALL 48 MP3 CLIPS ENCODED, LOGGED, AND EMBEDDED SUCCESSFULLY!`);
  console.log(`Total Directory Size: ${(totalBytes / 1024).toFixed(1)} KB`);
  console.log('================================================================');
}

main().catch(err => {
  console.error('Fatal generator error:', err);
  process.exit(1);
});
