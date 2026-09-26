/**
 * جای خالی در متن عبارت — dre-p186.
 *
 * `Mă numesc {{name}}.` عمداً جای خالی دارد: همان چیزی است که یادگیرنده باید
 * با نام خودش پر کند، و الگو بدون آن درس نیست. پس از داده حذف نمی‌شود.
 *
 * ولی تا امروز **عیناً** رندر می‌شد. یادگیرنده روی سایت زنده رشته‌ی
 * `{{name}}` را می‌دید — و صدای همان عبارت جای خالی را حذف می‌کرد، پس نوشته و
 * صدا با هم نمی‌خواندند.
 *
 * این ماژول خالص است تا آزمودنی بماند؛ رندر در کامپوننت است.
 */

export type PhraseSegment = { t: string } | { slot: string };

const PLACEHOLDER = /\{\{([^}]*)\}\}/g;

/** برچسب هر جای خالی، برای خط گلاس. خط رومانیایی برچسب نمی‌گیرد. */
export const PLACEHOLDER_LABELS: Record<string, { fa: string; en: string }> = {
  name: { fa: 'نام شما', en: 'your name' },
};

/** متن را به قطعه‌های متنی و جای خالی می‌شکند، به همان ترتیب. */
export function splitPlaceholders(raw: string): PhraseSegment[] {
  if (!raw) return [];
  const out: PhraseSegment[] = [];
  let last = 0;
  for (const m of raw.matchAll(PLACEHOLDER)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ t: raw.slice(last, at) });
    out.push({ slot: m[1].trim() });
    last = at + m[0].length;
  }
  if (last < raw.length) out.push({ t: raw.slice(last) });
  return out;
}

export function hasPlaceholder(raw?: string): boolean {
  return !!raw && /\{\{[^}]*\}\}/.test(raw);
}

/**
 * متن گفتاری: جای خالی و نقطه‌گذاریِ چسبیده‌اش حذف می‌شود.
 *
 * عمداً همان قاعده‌ی `cleanPhraseText` در `scripts/generateCoreAudio.ts` است،
 * چون آن اسکریپت با همین متن صدا ساخته. اگر این دو از هم دور بیفتند، دوباره
 * نوشته و صدا نمی‌خوانند — و این بار بی‌صدا.
 */
export function spokenForm(raw: string): string {
  return raw
    .replace(/\{\{[^}]*\}\}[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»—–\s]*/gu, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»—–\s]+$/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}
