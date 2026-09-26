// scripts/audioMeasure.ts — اندازه‌گیری مشترک صدا (dre-p172)
//
// تنها منبع حقیقت برای «مدت» و «سکوت». هم refreshAudioDurations و هم
// checkAudioHygiene از این استفاده می‌کنند تا دو عدد متفاوت تولید نشود.
//
// هیچ فراخوان شبکه‌ای، هیچ کلید API.

import { spawnSync } from 'node:child_process';

/** نرخ نمونه‌برداری تحلیل. ربطی به نرخ فایل خروجی (۲۴۰۰۰) ندارد. */
const ANALYSIS_SR = 16000;
const FRAME = 0.025;   // ۲۵ میلی‌ثانیه
const HOP = 0.010;     // ۱۰ میلی‌ثانیه
/** آستانه‌ی «گفتار»: نسبت به اوج همان فایل، نه مطلق. */
const SPEECH_FLOOR_DB = -35;

export type Measurement = {
  /** مدت ظرف mp3، گردشده به نزدیک‌ترین ۱۰ms — همان چیزی که durationMs ذخیره می‌کند. */
  durationMs: number;
  /** ثانیه: از اولین تا آخرین فریم بالای آستانه. */
  speech: number;
  /** ثانیه: سکوت ابتدا. */
  lead: number;
  /** ثانیه: سکوت انتها. */
  trail: number;
};

import fs from 'node:fs';

const BITRATE_V1_L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
const BITRATE_V2_L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
const SAMPLE_RATES: Record<number, number[]> = {
  3: [44100, 48000, 32000],
  2: [22050, 24000, 16000],
  0: [11025, 12000, 8000],
};

function getFfmpegBin(): string {
  try {
    const installer = require('@ffmpeg-installer/ffmpeg');
    if (installer?.path && fs.existsSync(installer.path)) return installer.path;
  } catch {}
  return 'ffmpeg';
}

function getMp3DurationSeconds(file: string): number {
  try {
    const b = fs.readFileSync(file);
    let i = 0;
    if (b.length > 10 && b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) {
      i = 10 + (((b[6] & 0x7f) << 21) | ((b[7] & 0x7f) << 14) | ((b[8] & 0x7f) << 7) | (b[9] & 0x7f));
    }
    let samples = 0;
    let rate = 0;
    let frames = 0;
    while (i + 4 <= b.length) {
      if (b[i] !== 0xff || (b[i + 1] & 0xe0) !== 0xe0) { i++; continue; }
      const verBits = (b[i + 1] >> 3) & 0x03;
      const layer = (b[i + 1] >> 1) & 0x03;
      if (layer !== 1 || verBits === 1) { i++; continue; }
      const brIdx = (b[i + 2] >> 4) & 0x0f;
      const srIdx = (b[i + 2] >> 2) & 0x03;
      if (brIdx === 0 || brIdx === 15 || srIdx === 3) { i++; continue; }
      const isV1 = verBits === 3;
      const bitrate = (isV1 ? BITRATE_V1_L3 : BITRATE_V2_L3)[brIdx] * 1000;
      const sr = SAMPLE_RATES[verBits][srIdx];
      const spf = isV1 ? 1152 : 576;
      const pad = (b[i + 2] >> 1) & 0x01;
      const len = Math.floor((spf / 8) * bitrate / sr) + pad;
      if (len < 4) { i++; continue; }
      rate = sr;
      samples += spf;
      frames++;
      i += len;
    }
    if (frames > 0 && rate > 0) {
      return samples / rate;
    }
  } catch {}

  // Fallback to ffprobe if available
  const r = spawnSync('ffprobe',
    ['-v', 'quiet', '-print_format', 'json', '-show_format', file],
    { encoding: 'utf8' });
  if (r.status === 0) {
    const d = JSON.parse(r.stdout)?.format?.duration;
    if (d !== undefined) return Number(d);
  }

  throw new Error(`Could not determine duration for ${file}`);
}

function decodePcm(file: string): Int16Array {
  const bin = getFfmpegBin();
  const r = spawnSync(bin,
    ['-v', 'quiet', '-i', file, '-f', 's16le', '-ac', '1', '-ar', String(ANALYSIS_SR), '-'],
    { maxBuffer: 1024 * 1024 * 256 });
  if (r.status !== 0) throw new Error(`ffmpeg decode failed for ${file} using ${bin}`);
  const b = r.stdout;
  return new Int16Array(b.buffer, b.byteOffset, Math.floor(b.length / 2));
}

export function measure(file: string): Measurement {
  const durationMs = Math.round(getMp3DurationSeconds(file) * 1000 / 10) * 10;
  const x = decodePcm(file);
  const hop = Math.round(HOP * ANALYSIS_SR);
  const win = Math.round(FRAME * ANALYSIS_SR);
  const n = Math.max(1, Math.floor((x.length - win) / hop) + 1);

  const db = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let acc = 0;
    const s = i * hop;
    for (let j = 0; j < win; j++) { const v = x[s + j] / 32768; acc += v * v; }
    db[i] = 20 * Math.log10(Math.sqrt(acc / win) + 1e-12);
  }

  let peak = -Infinity;
  for (let i = 0; i < n; i++) if (db[i] > peak) peak = db[i];
  const thr = peak + SPEECH_FLOOR_DB;

  let first = -1, last = -1;
  for (let i = 0; i < n; i++) if (db[i] > thr) { if (first < 0) first = i; last = i; }

  const dur = x.length / ANALYSIS_SR;
  if (first < 0) return { durationMs, speech: 0, lead: dur, trail: 0 };
  return {
    durationMs,
    speech: (last - first) * HOP,
    lead: first * HOP,
    trail: dur - last * HOP,
  };
}
