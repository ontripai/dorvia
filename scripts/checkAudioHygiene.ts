// scripts/checkAudioHygiene.ts — سه آشکارساز که ASR نمی‌بیند (dre-p172)
//
// چرا وجود دارد: در dre-p169 هر هفت کلیپ معیوب، آزمون ASR را پاس کردند.
// w-core-buna-puck پنج ثانیه سکوت ابتدایی داشت و رونویسی‌اش کاملاً درست بود.
// یک بررسی خودکار فقط همان بُعدی را می‌بیند که برایش ساخته شده.
//
// هیچ فراخوان شبکه‌ای، هیچ کلید API.

import { readdirSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { measure, Measurement } from './audioMeasure';

const ROOT = resolve(__dirname, '..');
const DIRS = [
  'public/audio/romanian/core',
  'public/audio/romanian/foundation',
];

/** A — سکوت. کلیپی که با سکوت شروع شود، «خراب» به نظر می‌رسد.
 *  trail سخاوتمندانه‌تر از lead است: آستانه‌ی اندازه‌گیری نسبت به اوج فایل است،
 *  پس واکه‌ی پایانی یا همخوان نرم، در حال افت، زیر آن می‌رود بدون اینکه سکوت باشد.
 *  برش‌دهنده هر چیز زیر ‎-45dB مطلق را برمی‌دارد؛ آنچه می‌ماند صدای واقعی است. */
const MAX_LEAD = 0.20;
const MAX_TRAIL = 0.35;
/** B — مدت گفتار مطلق. هجی‌کردن و تکرار، طول را چند برابر می‌کند.
 *  گرافم‌ها سقف بالاتری دارند: پرامپتشان عمداً یک جمله‌ی آموزشی تولید می‌کند
 *  («آن‌طور که یک معلم تلفظ برای یک مبتدی کامل می‌گوید»)، نه یک واژه‌ی تنها.
 *  این با آزمون روی داده‌ی واقعی کالیبره شد: g-17-j در ۲.۸۸s سالم است. */
const MAX_SPEECH_WORD = 2.5;
const MAX_SPEECH_GRAPHEME = 4.0;
const MAX_SPEECH_PHRASE = 5.0;
/** C — نسبت جفتی. دو صدا برای یک متن نباید این‌قدر فرق کنند. */
const MAX_PAIR_RATIO = 1.8;

type Row = { id: string; voice: string; file: string } & Measurement;

const rows: Row[] = [];
for (const dir of DIRS) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) { console.log(`skip (missing): ${dir}`); continue; }
  for (const name of readdirSync(full).filter(f => f.endsWith('.mp3')).sort()) {
    const stem = name.slice(0, -4);
    const cut = stem.lastIndexOf('-');
    rows.push({
      id: stem.slice(0, cut),
      voice: stem.slice(cut + 1),
      file: join(dir, name),
      ...measure(join(full, name)),
    });
  }
}

type Fail = { file: string; rule: 'A' | 'B' | 'C'; detail: string };
const fails: Fail[] = [];

for (const r of rows) {
  if (r.lead > MAX_LEAD || r.trail > MAX_TRAIL) {
    fails.push({ file: r.file, rule: 'A',
      detail: `lead ${r.lead.toFixed(2)}s, trail ${r.trail.toFixed(2)}s` });
  }
  const limit = r.id.startsWith('p-') ? MAX_SPEECH_PHRASE
              : r.id.startsWith('g-') ? MAX_SPEECH_GRAPHEME
              : MAX_SPEECH_WORD;
  if (r.speech > limit) {
    fails.push({ file: r.file, rule: 'B',
      detail: `speech ${r.speech.toFixed(2)}s exceeds ${limit}s` });
  }
}

const byId = new Map<string, Row[]>();
for (const r of rows) {
  const list = byId.get(r.id) ?? [];
  list.push(r);
  byId.set(r.id, list);
}
for (const [id, list] of byId) {
  if (list.length !== 2) {
    fails.push({ file: id, rule: 'C',
      detail: `incomplete pair: ${list.map(r => r.voice).join(', ') || 'none'}` });
    continue;
  }
  const [a, b] = list.map(r => r.speech);
  if (a > 0 && b > 0) {
    const ratio = Math.max(a, b) / Math.min(a, b);
    if (ratio > MAX_PAIR_RATIO) {
      fails.push({ file: id, rule: 'C',
        detail: `${list[0].voice} ${a.toFixed(2)}s vs ${list[1].voice} ${b.toFixed(2)}s = ${ratio.toFixed(1)}x` });
    }
  }
}

console.log(`clips measured: ${rows.length}`);
if (fails.length === 0) {
  console.log('audio hygiene: PASS');
  process.exit(0);
}

const NAME = { A: 'silence', B: 'speech-too-long', C: 'pair' } as const;
console.log(`\naudio hygiene: ${fails.length} FAILURES\n`);
console.log('rule  detector          clip                                  detail');
for (const f of fails.sort((x, y) => x.rule.localeCompare(y.rule))) {
  console.log(`  ${f.rule}   ${NAME[f.rule].padEnd(18)}${basename(f.file).padEnd(38)}${f.detail}`);
}
process.exit(1);
