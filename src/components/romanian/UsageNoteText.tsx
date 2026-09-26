import React from 'react';
import { NoteSegment, UsageNote } from '@/lib/romanian/types';

/**
 * نمایش یک یادداشت کاربرد قطعه‌ای (dre-p175).
 *
 * چرا کامپوننت لازم شد: یادداشت دیگر رشته نیست. صورت رومانیایی یک ارجاع است،
 * و این دو چیز را ممکن می‌کند که با رشته ممکن نبود:
 *
 *  ۱. هر قطعه‌ی رومانیایی `dir="ltr"` و `lang="ro"` خودش را می‌گیرد. متن لاتین
 *     داخل جمله‌ی فارسی راست‌به‌چپ منبع کلاسیک باگ نمایش است؛ با رشته‌ی یکپارچه
 *     راهی برای درست کردنش نبود.
 *  ۲. صورتی که عمداً به‌عنوان غلط نقل می‌شود دیداری از صورت درست جدا می‌شود.
 *     پیش از این، «paisprezece است (نه patrusprezece)» هر دو را یک‌شکل نشان می‌داد.
 *
 * وابستگی به رجیستری ندارد: هر قطعه‌ی `ref` همیشه `display` خودش را دارد.
 */

interface Props {
  note?: UsageNote;
  /** کد زبان ترجیحی. اگر نبود، به `en` و سپس اولین زبان موجود برمی‌گردد. */
  lang: string;
  className?: string;
}

function pickLanguage(note: UsageNote, lang: string): NoteSegment[] | undefined {
  const exact = note[lang];
  if (Array.isArray(exact) && exact.length > 0) return exact;
  const english = note.en;
  if (Array.isArray(english) && english.length > 0) return english;
  for (const value of Object.values(note)) {
    if (Array.isArray(value) && value.length > 0) return value;
  }
  return undefined;
}

export function UsageNoteText({ note, lang, className = '' }: Props) {
  if (!note) return null;
  const segments = pickLanguage(note, lang);
  if (!segments) return null;

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if ('t' in seg) return <React.Fragment key={i}>{seg.t}</React.Fragment>;

        if ('bad' in seg) {
          return (
            <span
              key={i}
              dir="ltr"
              lang="ro"
              className="inline-block line-through decoration-2 decoration-rose-500/70 text-rose-700"
            >
              {seg.bad}
            </span>
          );
        }

        const text = 'fn' in seg ? seg.fn : seg.display ?? '';
        return (
          <span key={i} dir="ltr" lang="ro" className="inline-block font-medium text-slate-900">
            {text}
          </span>
        );
      })}
    </span>
  );
}
