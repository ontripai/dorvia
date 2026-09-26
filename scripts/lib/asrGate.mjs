// scripts/lib/asrGate.mjs — دروازه‌ی رونویسی (dre-p176)
//
// چرا این فایل وجود دارد:
//
// `generateCoreAudio.ts` از ابتدا `isMatch` را درست محاسبه می‌کرد، چاپش می‌کرد،
// و بعد **نادیده‌اش می‌گرفت** — کلیپ هرچه رونویسی می‌گفت وارد مانیفست می‌شد.
// این‌طور شد که `ele` به‌صورت حرف انگلیسی «L» منتشر شد (dre-p169) و `mea`
// به‌صورت `mă` (dre-p174). هر دو بار مدل عدم تطابق را گزارش کرد و انسان از
// کنارش رد شد.
//
// این ماژول تصمیم را از گزارش جدا می‌کند: همان مقایسه، ولی نتیجه‌اش مسیر کد را
// عوض می‌کند.
//
// **عمداً نرمال‌ساز تازه‌ای نمی‌سازد.** `normalizeForComparison` از قبل در
// tts.mjs هست و دیاکریتیک‌های رومانیایی را نگه می‌دارد (درس dre-p163:
// `suta` و `sută` دو چیزند). دو پیاده‌سازی از یک مقایسه، دو جواب می‌دهد.

import { normalizeForComparison } from './tts.mjs';

/**
 * آیا این کلیپ باید رد شود؟
 *
 * تساوی دقیق پس از نرمال‌سازی — نه شباهت، نه فاصله‌ی ویرایشی، نه آستانه‌ی
 * درصدی. آستانه‌ی شباهت همان چیزی است که «L» را به `ele` نزدیک می‌دید.
 *
 * @returns {{reject: boolean, normTarget: string, normTranscript: string, reason: string}}
 */
export function judgeClip(targetText, transcribedText) {
  const normTarget = normalizeForComparison(targetText);
  const normTranscript = normalizeForComparison(transcribedText);

  if (!normTarget) {
    return { reject: true, normTarget, normTranscript, reason: 'target text is empty' };
  }
  if (/^\[(?:ERROR|Transcribe Err)/i.test(String(transcribedText ?? ''))) {
    return { reject: true, normTarget, normTranscript, reason: 'transcription failed' };
  }
  if (normTarget !== normTranscript) {
    return {
      reject: true,
      normTarget,
      normTranscript,
      reason: `transcript "${normTranscript}" does not match target "${normTarget}"`,
    };
  }
  return { reject: false, normTarget, normTranscript, reason: '' };
}
