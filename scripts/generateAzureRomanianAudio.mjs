// Run after reviewing the catalog: AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=... npm run audio:azure
// Generation is an editorial step. Never synthesize arbitrary learner input or expose the key to browsers.
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(await fs.readFile(path.join(root, 'scripts/romanian-audio-catalog.json'), 'utf8'));
const manifestPath = path.join(root, 'src/content/romanian/verified-audio.json');
const output = path.join(root, 'public/audio/romanian/verified');
const key = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION;
const voice = process.env.AZURE_SPEECH_VOICE || 'ro-RO-AlinaNeural';
if (!key || !region) throw new Error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION outside source control.');
if (!/^[a-z0-9-]+$/i.test(region)) throw new Error('Invalid Azure region.');
if (!/^ro-RO-[\w:-]+$/.test(voice)) throw new Error('Select a Romanian voice.');

const escapeXml = text => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const seen = new Set();
const seenSlugs = new Set();
await fs.mkdir(output, { recursive: true });

for (const item of catalog) {
  const text = item.text?.normalize('NFC').trim();
  if (!text || !/^[a-z0-9-]+$/.test(item.slug) || seen.has(text) || seenSlugs.has(item.slug)) throw new Error(`Invalid or repeated catalog item: ${JSON.stringify(item)}`);
  seen.add(text);
  seenSlugs.add(item.slug);
  const filename = `${item.slug}.mp3`;
  const target = path.join(output, filename);
  const url = `/audio/romanian/verified/${filename}`;
  try {
    if ((await fs.stat(target)).size > 100) {
      if (item.approved === true) manifest[text] = url;
      else delete manifest[text];
      continue;
    }
  } catch { /* generate missing clip */ }
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ro-RO"><voice name="${voice}">${escapeXml(text)}</voice></speak>`;
  const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'dorvia-audio-builder',
    },
    body: ssml,
  });
  if (!response.ok) throw new Error(`Azure speech failed (${response.status}) for ${item.slug}. Check region, voice and subscription.`);
  const raw = Buffer.from(await response.arrayBuffer());
  if (raw.length < 100) throw new Error(`Empty audio for ${item.slug}`);
  const temporary = `${target}.raw.mp3`;
  await fs.writeFile(temporary, raw);
  try {
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', temporary,
      '-af', 'silenceremove=start_periods=1:start_silence=0.02:start_threshold=-42dB:detection=rms',
      '-codec:a', 'libmp3lame', '-b:a', '48k', target]);
    if ((await fs.stat(target)).size < 100) throw new Error(`Silent audio for ${item.slug}`);
    if (item.approved === true) manifest[text] = url;
    else delete manifest[text];
    // Save after every successful item so an interrupted batch can resume.
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  } finally { await fs.rm(temporary, { force: true }); }
  console.log(`Generated ${item.slug}`);
}
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated candidate clips. ${Object.keys(manifest).length} approved clips registered for playback.`);
