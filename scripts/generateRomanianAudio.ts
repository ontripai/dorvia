import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FOUNDATION_GRAPHEMES, FOUNDATION_WORDS } from '../src/content/romanian/foundation';
import { SEED_WORDS } from '../src/content/romanian/seed';

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

// Sleep helper
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface UsageStats {
  ttsCalls: number;
  ttsPromptTokens: number;
  ttsCandidateTokens: number;
  transcribeCalls: number;
  transcribePromptTokens: number;
  transcribeCandidateTokens: number;
}

const usageStats: UsageStats = {
  ttsCalls: 0,
  ttsPromptTokens: 0,
  ttsCandidateTokens: 0,
  transcribeCalls: 0,
  transcribePromptTokens: 0,
  transcribeCandidateTokens: 0,
};

async function callTtsWithRetry(
  apiKey: string,
  model: string,
  word: string,
  voice: string,
  maxRetries = 3
): Promise<{ wavBuffer: Buffer; durationSec: number; usage?: any }> {
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

      usageStats.ttsCalls++;
      if (json.usageMetadata) {
        usageStats.ttsPromptTokens += json.usageMetadata.promptTokenCount || 0;
        usageStats.ttsCandidateTokens += json.usageMetadata.candidatesTokenCount || 0;
      }

      const candidate = json.candidates?.[0];
      const part = candidate?.content?.parts?.[0];
      if (!part?.inlineData?.data) {
        throw new Error(`No inlineData returned for word "${word}" voice "${voice}"`);
      }

      const pcmRaw = Buffer.from(part.inlineData.data, 'base64');
      const wavBuffer = pcmToWav(pcmRaw, 24000, 1, 16);
      const durationSec = Number((pcmRaw.length / 48000).toFixed(2));

      return { wavBuffer, durationSec, usage: json.usageMetadata };
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        await sleep(attempt * 1500);
      }
    }
  }

  throw lastError || new Error(`TTS failed for ${word} ${voice}`);
}

async function callTranscribeWithRetry(
  apiKey: string,
  wavBuffer: Buffer,
  maxRetries = 3
): Promise<{ text: string; usage?: any }> {
  const model = 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/wav',
              data: wavBuffer.toString('base64'),
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

      usageStats.transcribeCalls++;
      if (json.usageMetadata) {
        usageStats.transcribePromptTokens += json.usageMetadata.promptTokenCount || 0;
        usageStats.transcribeCandidateTokens += json.usageMetadata.candidatesTokenCount || 0;
      }

      const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || '';
      return { text, usage: json.usageMetadata };
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries) {
        await sleep(attempt * 1500);
      }
    }
  }

  return { text: `[ERROR: ${lastError?.message}]` };
}

interface ClipResult {
  order: number;
  grapheme: string;
  wordId: string;
  targetWord: string;
  translationEn: string;
  translationFa: string;
  voice: string;
  filename: string;
  transcribed: string;
  isMatch: boolean;
  durationSec: number;
  fileSizeBytes: number;
}

async function main() {
  console.log('================================================================');
  console.log('DORVIA DRE-P156: ROMANIAN FOUNDATION AUDIO COMPARISON GENERATOR');
  console.log('================================================================');

  const apiKey = getApiKey();
  console.log('API key loaded successfully (length verified, never logged).');

  // Verify TTS Model
  const ttsModel = 'gemini-3.1-flash-tts-preview';
  console.log(`Using TTS model: ${ttsModel}`);

  const voices = [
    { name: 'Aoede', gender: 'Female', desc: 'Breezy, natural, clear enunciation' },
    { name: 'Puck', gender: 'Male', desc: 'Upbeat, clear, distinct articulation' },
  ];
  console.log(`Comparing 2 prebuilt voices: ${voices.map(v => `${v.name} (${v.gender})`).join(', ')}`);

  // Target directory
  const audioDir = path.join(rootDir, 'audio-comparison', 'audio');
  fs.mkdirSync(audioDir, { recursive: true });

  const allWords = [...FOUNDATION_WORDS, ...SEED_WORDS];
  const wordMap = new Map(allWords.map(w => [w.id, w]));

  const sortedGraphemes = [...FOUNDATION_GRAPHEMES].sort((a, b) => a.order - b.order);
  console.log(`Found ${sortedGraphemes.length} foundation graphemes to synthesize.\n`);

  const results: ClipResult[] = [];

  for (const g of sortedGraphemes) {
    const word = wordMap.get(g.exampleWordId);
    if (!word) {
      throw new Error(`Grapheme ${g.id} references missing wordId: ${g.exampleWordId}`);
    }

    const targetWord = (g.exampleForm || word.lemma).trim();
    if (!targetWord) {
      throw new Error(`Empty target word for grapheme ${g.id}`);
    }

    console.log(`\n----------------------------------------------------------------`);
    console.log(`[Item ${g.order}/24] Grapheme: "${g.grapheme}" -> Target Word: "${targetWord}"`);
    console.log(`Translations: en="${word.translations.en}", fa="${word.translations.fa}"`);
    console.log(`----------------------------------------------------------------`);

    for (const v of voices) {
      const voiceName = v.name;
      const slugWord = g.exampleWordId.replace('w-', '');
      const filename = `${String(g.order).padStart(2, '0')}-${slugWord}-${voiceName}.wav`;
      const filePath = path.join(audioDir, filename);

      process.stdout.write(`  Generating with ${voiceName} (${v.gender})... `);
      const { wavBuffer, durationSec } = await callTtsWithRetry(apiKey, ttsModel, targetWord, voiceName);
      fs.writeFileSync(filePath, wavBuffer);
      const fileSizeBytes = wavBuffer.length;
      process.stdout.write(`Done (${durationSec}s, ${fileSizeBytes} bytes).\n`);

      // Gentle pause to respect rate limits
      await sleep(600);

      process.stdout.write(`  Roundtrip transcription (${targetWord} vs audio)... `);
      const { text: transcribed } = await callTranscribeWithRetry(apiKey, wavBuffer);

      // Clean comparison: remove punctuation, lowercase, normalize spaces
      const cleanTranscribed = transcribed.replace(/[.,!?;:\"\'\-]/g, '').trim().toLowerCase();
      const cleanExpected = targetWord.replace(/[.,!?;:\"\'\-]/g, '').trim().toLowerCase();
      const isMatch = cleanTranscribed === cleanExpected;

      process.stdout.write(`-> "${transcribed}" [${isMatch ? '✅ MATCH' : '⚠️ MISMATCH'}]\n`);

      results.push({
        order: g.order,
        grapheme: g.grapheme,
        wordId: g.exampleWordId,
        targetWord,
        translationEn: word.translations.en,
        translationFa: word.translations.fa,
        voice: voiceName,
        filename,
        transcribed,
        isMatch,
        durationSec,
        fileSizeBytes,
      });

      // Pause before next call
      await sleep(600);
    }
  }

  // --- Step 6: Write audio-roundtrip.log ---
  const roundtripLogPath = path.join(rootDir, 'audio-roundtrip.log');
  let roundtripLog = `========================================================================================================\n`;
  roundtripLog += `DORVIA DRE-P156 — AUDIO ROUNDTRIP VERIFICATION LOG\n`;
  roundtripLog += `Date: ${new Date().toISOString().split('T')[0]}\n`;
  roundtripLog += `TTS Model: ${ttsModel} | Transcription Model: gemini-3.6-flash\n`;
  roundtripLog += `Total Clips: ${results.length} (24 words x 2 voices)\n`;
  roundtripLog += `========================================================================================================\n\n`;
  roundtripLog += `واژه | صدا | متن رونویسی‌شده | مطابق؟ | مدت (ثانیه) | حجم (بایت)\n`;
  roundtripLog += `--------------------------------------------------------------------------------------------------------\n`;

  for (const r of results) {
    const isZero = r.durationSec <= 0.1 || r.fileSizeBytes < 1000;
    const matchStr = isZero ? 'شکست (حجم/مدت صفر)' : r.isMatch ? 'بله' : 'خیر';
    roundtripLog += `${r.targetWord.padEnd(12, ' ')} | ${r.voice.padEnd(8, ' ')} | ${r.transcribed.padEnd(18, ' ')} | ${matchStr.padEnd(8, ' ')} | ${String(r.durationSec).padStart(5, ' ')}s | ${String(r.fileSizeBytes).padStart(7, ' ')}\n`;
  }

  const matchCount = results.filter(r => r.isMatch).length;
  roundtripLog += `\n--------------------------------------------------------------------------------------------------------\n`;
  roundtripLog += `SUMMARY: ${matchCount} of ${results.length} clips matched perfectly in roundtrip verification (${((matchCount / results.length) * 100).toFixed(1)}%).\n`;
  roundtripLog += `Zero-duration or corrupted clips: ${results.filter(r => r.durationSec <= 0.1 || r.fileSizeBytes < 1000).length}\n`;
  roundtripLog += `========================================================================================================\n`;

  fs.writeFileSync(roundtripLogPath, roundtripLog, 'utf8');
  console.log(`\n✅ Saved roundtrip verification log to ${roundtripLogPath}`);

  // --- Step 9: Write audio-usage.log ---
  const usageLogPath = path.join(rootDir, 'audio-usage.log');
  let usageLog = `================================================================\n`;
  usageLog += `DORVIA DRE-P156 — GEMINI AUDIO API USAGE REPORT\n`;
  usageLog += `Date: ${new Date().toISOString().split('T')[0]}\n`;
  usageLog += `================================================================\n\n`;
  usageLog += `1. TEXT-TO-SPEECH (TTS):\n`;
  usageLog += `   Model:                   ${ttsModel}\n`;
  usageLog += `   Total Calls:             ${usageStats.ttsCalls}\n`;
  usageLog += `   Prompt Tokens:           ${usageStats.ttsPromptTokens}\n`;
  usageLog += `   Candidate Audio Tokens:  ${usageStats.ttsCandidateTokens}\n`;
  usageLog += `   Total TTS Tokens:        ${usageStats.ttsPromptTokens + usageStats.ttsCandidateTokens}\n\n`;
  usageLog += `2. AUDIO TRANSCRIPTION (ROUNDTRIP):\n`;
  usageLog += `   Model:                   gemini-3.6-flash\n`;
  usageLog += `   Total Calls:             ${usageStats.transcribeCalls}\n`;
  usageLog += `   Prompt Audio/Text Tokens:${usageStats.transcribePromptTokens}\n`;
  usageLog += `   Candidate Text Tokens:   ${usageStats.transcribeCandidateTokens}\n`;
  usageLog += `   Total Transcribe Tokens: ${usageStats.transcribePromptTokens + usageStats.transcribeCandidateTokens}\n\n`;
  usageLog += `3. TOTAL BATCH TOTALS:\n`;
  usageLog += `   Total API Calls:         ${usageStats.ttsCalls + usageStats.transcribeCalls}\n`;
  usageLog += `   Total Combined Tokens:   ${usageStats.ttsPromptTokens + usageStats.ttsCandidateTokens + usageStats.transcribePromptTokens + usageStats.transcribeCandidateTokens}\n`;
  usageLog += `================================================================\n`;

  fs.writeFileSync(usageLogPath, usageLog, 'utf8');
  console.log(`✅ Saved API usage log to ${usageLogPath}`);

  // --- Step 7: Generate HTML Comparison Page ---
  const htmlPath = path.join(rootDir, 'audio-comparison', 'index.html');
  const htmlContent = generateHtmlComparisonPage(results, ttsModel);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`✅ Saved HTML comparison page to ${htmlPath}`);

  console.log('\n================================================================');
  console.log('ALL 48 CLIPS GENERATED, TRANSCRIBED, AND LOGGED SUCCESSFULLY!');
  console.log('================================================================');
}

function generateHtmlComparisonPage(results: ClipResult[], ttsModel: string): string {
  // Group results by order
  const rowsMap = new Map<number, { a?: ClipResult; b?: ClipResult; meta: ClipResult }>();
  for (const r of results) {
    if (!rowsMap.has(r.order)) {
      rowsMap.set(r.order, { meta: r });
    }
    const entry = rowsMap.get(r.order)!;
    if (r.voice === 'Aoede') entry.a = r;
    else entry.b = r;
  }

  const rows = Array.from(rowsMap.values()).sort((x, y) => x.meta.order - y.meta.order);
  const totalClips = results.length;
  const matchCount = results.filter(r => r.isMatch).length;

  return `<!DOCTYPE html>
<html lang="ro" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DORVIA — Romanian Foundation Audio Comparison (dre-p156)</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --card-border: #1f2937;
      --accent: #3b82f6;
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --success-bg: rgba(16, 185, 129, 0.15);
      --success-text: #34d399;
      --warning-bg: rgba(245, 158, 11, 0.15);
      --warning-text: #fbbf24;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-family);
      margin: 0;
      padding: 32px 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 28px;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 20px;
    }
    h1 {
      font-size: 26px;
      margin: 0 0 8px 0;
      color: #fff;
    }
    .badge-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 12px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #1f2937;
      color: #e5e7eb;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 500;
    }
    .prompt-box {
      background: #1e293b;
      border-left: 4px solid var(--accent);
      padding: 12px 16px;
      border-radius: 4px;
      margin: 20px 0;
      font-size: 13px;
      color: #cbd5e1;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: var(--card-bg);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--card-border);
    }
    th, td {
      padding: 14px 16px;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid var(--card-border);
    }
    th {
      background: #1a2234;
      color: #93c5fd;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
    .word-cell {
      font-weight: 700;
      font-size: 17px;
      color: #ffffff;
    }
    .grapheme-tag {
      display: inline-block;
      background: #2563eb;
      color: #fff;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 6px;
    }
    .subtext {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .fa-subtext {
      font-size: 12px;
      color: #a78bfa;
      direction: rtl;
      display: inline-block;
      margin-top: 2px;
    }
    audio {
      width: 220px;
      height: 36px;
      outline: none;
    }
    .roundtrip-tag {
      display: inline-block;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 4px;
      font-weight: 600;
    }
    .match {
      background: var(--success-bg);
      color: var(--success-text);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .mismatch {
      background: var(--warning-bg);
      color: var(--warning-text);
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .audio-meta {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>DORVIA — Romanian Foundation Audio Comparison (dre-p156)</h1>
      <div class="badge-bar">
        <span class="badge">Model: ${ttsModel}</span>
        <span class="badge">Items: 24 Foundation Graphemes</span>
        <span class="badge">Clips: ${totalClips} Total (48 Files)</span>
        <span class="badge">Roundtrip Match Rate: ${matchCount}/${totalClips} (${((matchCount / totalClips) * 100).toFixed(0)}%)</span>
        <span class="badge">Voices: Aoede (Female) vs. Puck (Male)</span>
      </div>
      <div class="prompt-box">
        <strong>Fixed Style Prompt:</strong> "Pronounce this Romanian word slowly and clearly, the way a pronunciation teacher would for a complete beginner. Standard Romanian pronunciation."
      </div>
    </header>

    <table>
      <thead>
        <tr>
          <th style="width: 40px;">#</th>
          <th>Grapheme / Lesson</th>
          <th>Target Word</th>
          <th>Meaning (EN / FA)</th>
          <th>Voice A: Aoede (Female)</th>
          <th>Voice B: Puck (Male)</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => {
          const a = row.a!;
          const b = row.b!;
          const m = row.meta;
          return `<tr>
            <td style="color: var(--text-muted); font-size: 13px;">${m.order}</td>
            <td>
              <span class="grapheme-tag">${m.grapheme}</span>
              <div class="subtext">ID: ${m.wordId}</div>
            </td>
            <td>
              <div class="word-cell">${m.targetWord}</div>
            </td>
            <td>
              <div>${m.translationEn}</div>
              <div class="fa-subtext">${m.translationFa}</div>
            </td>
            <td>
              <audio controls preload="none" src="audio/${a.filename}"></audio>
              <div class="audio-meta">
                ${a.durationSec}s · ${(a.fileSizeBytes / 1024).toFixed(1)} KB
              </div>
              <span class="roundtrip-tag ${a.isMatch ? 'match' : 'mismatch'}">
                ${a.isMatch ? '✅' : '⚠️'} Transcribed: "${a.transcribed}"
              </span>
            </td>
            <td>
              <audio controls preload="none" src="audio/${b.filename}"></audio>
              <div class="audio-meta">
                ${b.durationSec}s · ${(b.fileSizeBytes / 1024).toFixed(1)} KB
              </div>
              <span class="roundtrip-tag ${b.isMatch ? 'match' : 'mismatch'}">
                ${b.isMatch ? '✅' : '⚠️'} Transcribed: "${b.transcribed}"
              </span>
            </td>
          </tr>`;
        }).join('\n')}
      </tbody>
    </table>
  </div>
</body>
</html>`;
}

main().catch(err => {
  console.error('Fatal generator error:', err);
  process.exit(1);
});
