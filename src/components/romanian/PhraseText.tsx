import React from 'react';
import { splitPlaceholders, PLACEHOLDER_LABELS } from '@/lib/romanian/placeholders';

/**
 * متن یک عبارت، با جای خالی‌اش به‌صورت شکاف دیدنی.
 *
 * `variant="ro"` خط رومانیایی است و شکاف را **بدون برچسب** نشان می‌دهد — یک جای
 * خالیِ زیرخط‌دار. گذاشتن برچسب فارسی وسط یک جمله‌ی رومانیایی هم جهت متن را
 * می‌شکند و هم جمله را دیگر رومانیایی نمی‌گذارد.
 *
 * `variant="gloss"` خط فارسی یا انگلیسی است و برچسب می‌گیرد، چون آنجا کار
 * برچسب توضیح‌دادن است: «نام شما».
 */
export function PhraseText({
  text,
  variant,
  lang,
}: {
  text: string;
  variant: 'ro' | 'gloss';
  lang: 'fa' | 'en';
}) {
  const segments = splitPlaceholders(text);
  if (segments.length === 1 && 't' in segments[0]) return <>{segments[0].t}</>;

  return (
    <>
      {segments.map((seg, i) => {
        if ('t' in seg) return <React.Fragment key={i}>{seg.t}</React.Fragment>;
        if (variant === 'ro') {
          return (
            <span
              key={i}
              className="inline-block align-baseline border-b-2 border-dashed border-slate-400 min-w-[3.5rem] mx-0.5"
              aria-label={PLACEHOLDER_LABELS[seg.slot]?.[lang] || seg.slot}
            >
              &nbsp;
            </span>
          );
        }
        const label = PLACEHOLDER_LABELS[seg.slot]?.[lang] || seg.slot;
        return (
          <span
            key={i}
            className="inline-block px-1.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[0.9em] font-medium"
          >
            {label}
          </span>
        );
      })}
    </>
  );
}
