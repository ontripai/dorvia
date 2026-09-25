import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

export function getApiKey() {
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

export function pcmToWav(pcmBuffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
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

export function wavToMp3WithDuration(wavPath, mp3Path, ffmpegPath = ffmpeg.path) {
  const silenceFilter =
    'silenceremove=start_periods=1:start_silence=0.10:start_threshold=-45dB:detection=rms,areverse,silenceremove=start_periods=1:start_silence=0.10:start_threshold=-45dB:detection=rms,areverse';

  execFileSync(ffmpegPath, [
    '-y',
    '-i', wavPath,
    '-af', silenceFilter,
    '-codec:a', 'libmp3lame',
    '-b:a', '64k',
    '-ac', '1',
    '-ar', '24000',
    mp3Path,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  return getMp3DurationMs(mp3Path, ffmpegPath);
}

export function getMp3DurationMs(mp3Path, ffmpegPath = ffmpeg.path) {
  try {
    execFileSync(ffmpegPath, ['-i', mp3Path], { stdio: ['ignore', 'ignore', 'pipe'] });
  } catch (err) {
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

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function callTtsWithRetry(
  apiKey,
  model,
  text,
  voice,
  isPhrase = false,
  maxRetries = 4
) {
  const promptText = `Say this Romanian ${isPhrase ? 'phrase' : 'word'} once, clearly and at a slightly slow pace, in standard Romanian pronunciation. Say it exactly one time. Do not spell it out, do not break it into syllables, do not repeat it, and do not add any other words.

${text}`;

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

  let lastError = null;
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
          console.warn(`[TTS 429 Rate Limit] Retrying in ${attempt * 3000}ms...`);
          await sleep(attempt * 3000);
          continue;
        }
        throw new Error(`TTS API failed with status ${res.status}: ${JSON.stringify(json)}`);
      }

      const candidate = json.candidates?.[0];
      const part = candidate?.content?.parts?.[0];
      if (!part?.inlineData?.data) {
        throw new Error(`No inlineData returned for "${text}" voice "${voice}"`);
      }

      const pcmRaw = Buffer.from(part.inlineData.data, 'base64');
      return pcmToWav(pcmRaw, 24000, 1, 16);
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await sleep(attempt * 2000);
      }
    }
  }

  throw lastError || new Error(`TTS failed for ${text} ${voice}`);
}

export async function callTranscribeMp3WithRetry(
  apiKey,
  mp3Buffer,
  isPhrase = false,
  maxRetries = 4
) {
  const model = 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const instruction = isPhrase
    ? 'Listen to this Romanian audio clip. Output ONLY the spoken Romanian phrase in lowercase, with standard Romanian diacritics. No other characters, no punctuation, no English.'
    : 'Listen to this Romanian audio clip. Output ONLY the single spoken Romanian word in lowercase, with standard Romanian diacritics. No other characters, no punctuation, no English.';

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
            text: instruction,
          },
        ],
      },
    ],
  };

  let lastError = null;
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
          console.warn(`[Transcribe 429 Rate Limit] Retrying in ${attempt * 3000}ms...`);
          await sleep(attempt * 3000);
          continue;
        }
        throw new Error(`Transcribe API failed with status ${res.status}: ${JSON.stringify(json)}`);
      }

      const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || '';
      return { text };
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await sleep(attempt * 2000);
      }
    }
  }

  return { text: `[ERROR: ${lastError?.message}]` };
}

export function normalizeForComparison(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\{\{[^}]*\}\}/g, ' ')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»—–]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
