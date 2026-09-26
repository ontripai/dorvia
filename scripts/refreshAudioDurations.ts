// scripts/refreshAudioDurations.ts — تازه‌سازی durationMs از روی فایل‌های دیسک (dre-p172)
//
// چرا وجود دارد: کامنت تایپ AudioClip می‌گوید «از خود فایل خوانده شود، نه تایپ».
// هر بار که یک mp3 عوض شود (تولید مجدد، برش سکوت)، این اجرا می‌شود.
//
// هیچ فراخوان TTS، هیچ کلید API، هیچ شبکه. فقط ffprobe روی فایل‌های موجود.
// فقط مقادیر durationMs را عوض می‌کند — هیچ چیز دیگری در آن فایل‌ها دست نمی‌خورد.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { measure } from './audioMeasure';

const ROOT = resolve(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

const TARGETS = [
  'src/content/romanian/audio-manifest.ts',
  'src/content/romanian/foundation.ts',
];

/**
 * روی بافر خام کار می‌کند، نه رشته‌ی decode‌شده: فایل‌ها CRLF دارند و
 * بازنویسی متنی خط‌پایان‌ها را عوض می‌کند و کل فایل را در diff می‌آورد.
 */
const PATTERN = /("src":\s*"([^"]+)",\s*\r?\n\s*"durationMs":\s*)(\d+)/g;

let totalChanged = 0;
let totalMissing = 0;

for (const rel of TARGETS) {
  const file = join(ROOT, rel);
  const original = readFileSync(file, 'latin1'); // بایت‌به‌بایت، بدون تفسیر UTF-8
  let changed = 0;
  const missing: string[] = [];

  const updated = original.replace(PATTERN, (whole, head: string, src: string, old: string) => {
    const path = join(PUBLIC, src);
    if (!existsSync(path)) { missing.push(src); return whole; }
    const { durationMs } = measure(path);
    if (durationMs !== Number(old)) {
      changed++;
      console.log(`  ${basename(src).padEnd(36)} ${old.padStart(6)} -> ${String(durationMs).padStart(6)} ms`);
    }
    return head + String(durationMs);
  });

  if (updated !== original) writeFileSync(file, updated, 'latin1');
  console.log(`${rel}: ${changed} changed, ${missing.length} missing`);
  for (const m of missing) console.log(`  MISSING ON DISK: ${m}`);
  totalChanged += changed;
  totalMissing += missing.length;
}

console.log(`\ntotal: ${totalChanged} durations refreshed, ${totalMissing} files missing`);
// فایل گمشده خطاست: V29 هم همین را می‌گیرد، ولی اینجا زودتر و روشن‌تر.
process.exit(totalMissing > 0 ? 1 : 0);
