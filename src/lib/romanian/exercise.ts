/**
 * تولیدکننده‌ی تمرین — گام ۳ حلقه‌ی یادگیری (dre-p182).
 *
 * اصل حاکم، از سند طراحی: **هیچ تمرینی دستی نوشته نمی‌شود.** هر سؤال از
 * داده‌ی موجودِ اعتبارسنجی‌شده ساخته می‌شود. اگر جایی مجبور به نوشتن سؤال
 * دستی شدیم، یعنی داده فیلدی کم دارد — فیلد اضافه می‌شود، نه سؤال.
 *
 * نوع تمرین در این گام یکی است: **رومانیایی → فارسی، چهارگزینه‌ای** (بازشناسی).
 *
 * ### چرا `counterExamples` اینجا به کار نمی‌آید
 * طراحی `counterExamples` را بهترین منبع گزینه نامیده بود. برای **این جهت**
 * قابل استفاده نیست: `counterExamples` صورتِ **غلطِ رومانیایی** است
 * (`patrusprezece` در برابر `paisprezece`)، ولی گزینه‌های این تمرین گلاس
 * فارسی‌اند. آن فیلد به تمرین املا یا تولید تعلق دارد، نه به بازشناسی.
 *
 * ### تله‌ای که باید بسته می‌شد
 * صورت‌های هم‌خانواده می‌توانند گلاس **یکسان** داشته باشند. اگر `el` سؤال باشد
 * و گلاسِ `ea` گزینه شود، گزینه پاسخِ درستِ دوم است نه غلط. پس هر نامزدی که
 * گلاسش با پاسخ یکی باشد حذف می‌شود — و مقایسه روی رشته‌ی **خام** انجام می‌شود،
 * با پرانتزهای رفع‌ابهام، چون همان پرانتزها هستند که «او (مذکر)» را از
 * «او (مؤنث)» جدا می‌کنند و یادگیرنده دقیقاً همان‌ها را می‌بیند.
 */
import {
  getPublishedWords,
  getPublishedPhrases,
} from './content';
import { RomanianWord, RomanianPhrase } from './types';

export interface ExerciseOption {
  id: string;
  fa: string;
  en: string;
}

export interface RecognitionQuestion {
  itemId: string;
  mode: 'recognition';
  /** متن رومانیایی که به یادگیرنده نشان داده می‌شود. */
  promptRo: string;
  /** چهار گزینه، به ترتیب قطعیِ برآمده از seed. */
  options: ExerciseOption[];
  correctOptionId: string;
  /** از کدام لایه‌ها گزینه گرفته شد — برای بازرسی، نه برای نمایش. */
  distractorSources: Array<'sibling' | 'step' | 'station'>;
}

/* ---------------------------------------------------------------- تصادفِ قطعی */

/**
 * تصادف باید **قطعی** باشد: یک قلم در یک نشست همیشه همان چهار گزینه و همان
 * ترتیب را بدهد. اگر `Math.random` استفاده شود، رندر سمت سرور و سمت کلاینت دو
 * چیز متفاوت می‌دهند، و مهم‌تر: دو بار دیدن یک سؤال دو مجموعه گزینه می‌دهد و
 * تحلیل لاگ پاسخ‌ها بی‌معنا می‌شود.
 */
function fnv1a(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** درهم‌ریزی فیشر–ییتس با یک مولد قطعی. ورودی دست‌نخورده می‌ماند. */
export function deterministicShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  const rand = mulberry32(fnv1a(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ------------------------------------------------------------------ نمایه‌ها */

type Entry =
  | { kind: 'word'; item: RomanianWord }
  | { kind: 'phrase'; item: RomanianPhrase };

const glossFa = (e: Entry): string =>
  e.kind === 'word' ? e.item.translations?.fa || '' : e.item.text?.fa || '';
const glossEn = (e: Entry): string =>
  e.kind === 'word' ? e.item.translations?.en || '' : e.item.text?.en || '';
const promptRo = (e: Entry): string =>
  e.kind === 'word' ? e.item.lemma : e.item.text?.ro || '';
const headOf = (e: Entry): string =>
  e.kind === 'word' ? e.item.formOf || e.item.id : e.item.id;
const stepOf = (e: Entry): string | undefined => (e.item as { stepId?: string }).stepId;
const stationOf = (e: Entry): string | undefined => e.item.stationId;

let ENTRIES: Entry[] | null = null;
function entries(): Entry[] {
  if (!ENTRIES) {
    ENTRIES = [
      ...getPublishedWords().map(item => ({ kind: 'word', item }) as Entry),
      ...getPublishedPhrases().map(item => ({ kind: 'phrase', item }) as Entry),
    ];
  }
  return ENTRIES;
}

/* ------------------------------------------------------------------- ساخت سؤال */

const OPTION_COUNT = 4;

/**
 * آیا این قلم با این نوع تمرین قابل آزمودن است.
 *
 * شرط‌ها: گلاس فارسی داشته باشد، و بتوان سه گزینه‌ی غلط با گلاس **متفاوت**
 * برایش پیدا کرد. قلمی که شرط را ندارد حذف نمی‌شود — فقط با این نوع تمرین
 * آزموده نمی‌شود، و وقتی نوع دوم اضافه شد واجد شرایط می‌گردد.
 */
export function isRecognizable(itemId: string): boolean {
  return buildRecognitionQuestion(itemId, 'eligibility-probe') !== null;
}

export function buildRecognitionQuestion(
  itemId: string,
  seed: string
): RecognitionQuestion | null {
  const all = entries();
  const target = all.find(e => e.item.id === itemId);
  if (!target) return null;

  const answerFa = glossFa(target);
  const answerRo = promptRo(target);
  if (!answerFa || !answerRo) return null;

  const targetHead = headOf(target);
  const targetStep = stepOf(target);
  const targetStation = stationOf(target);

  // هم‌نوع با هم؛ گلاس واژه و گلاس عبارت دو چیزند و قاطی‌کردنشان سؤال را بد می‌کند.
  const pool = all.filter(
    e =>
      e.kind === target.kind &&
      e.item.id !== itemId &&
      glossFa(e) !== '' &&
      // پاسخِ درستِ دوم نسازیم.
      glossFa(e) !== answerFa &&
      glossEn(e) !== glossEn(target)
  );

  // به‌ترتیب کیفیت: هم‌خانواده (جنسیت و پی‌بست را می‌آزماید) ← هم‌گام ← هم‌ایستگاه.
  const tiers: Array<{ name: 'sibling' | 'step' | 'station'; items: Entry[] }> = [
    { name: 'sibling', items: pool.filter(e => headOf(e) === targetHead) },
    {
      name: 'step',
      items: pool.filter(
        e => targetStep && stepOf(e) === targetStep && headOf(e) !== targetHead
      ),
    },
    {
      name: 'station',
      items: pool.filter(
        e =>
          targetStation &&
          stationOf(e) === targetStation &&
          (!targetStep || stepOf(e) !== targetStep) &&
          headOf(e) !== targetHead
      ),
    },
  ];

  const picked: Entry[] = [];
  const sources: Array<'sibling' | 'step' | 'station'> = [];
  const takenIds = new Set<string>();

  for (const tier of tiers) {
    if (picked.length >= OPTION_COUNT - 1) break;
    const fresh = tier.items.filter(e => !takenIds.has(e.item.id));
    // درهم‌ریزی درون لایه، تا انتخاب همیشه اولین‌های فهرست نباشد ولی قطعی بماند.
    for (const e of deterministicShuffle(fresh, `${seed}:${itemId}:${tier.name}`)) {
      if (picked.length >= OPTION_COUNT - 1) break;
      // دو گزینه با گلاس یکسان هم قابل قبول نیست.
      if (picked.some(p => glossFa(p) === glossFa(e))) continue;
      picked.push(e);
      sources.push(tier.name);
      takenIds.add(e.item.id);
    }
  }

  if (picked.length < OPTION_COUNT - 1) return null;

  const options: ExerciseOption[] = [target, ...picked].map(e => ({
    id: e.item.id,
    fa: glossFa(e),
    en: glossEn(e),
  }));

  return {
    itemId,
    mode: 'recognition',
    promptRo: answerRo,
    options: deterministicShuffle(options, `${seed}:${itemId}:options`),
    correctOptionId: itemId,
    distractorSources: sources,
  };
}
