/**
 * Shared dexonline text processing and elision extraction utilities.
 * Single source of truth across all parser scripts (dre-p164 Addendum 1).
 */

export function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&#x([0-9a-fA-F]+);?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/**
 * Strips HTML tags and normalizes whitespace.
 * Only strips LEADING and TRAILING hyphens (- U+002D, ‑ U+2011, – U+2013, — U+2014).
 * Internal hyphens (e.g. in compound words like "după-amiază") are strictly preserved.
 */
export function cleanText(html) {
  if (!html) return '';
  const decoded = decodeHtmlEntities(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return decoded.replace(/^[-‑–—\u2011]+|[-‑–—\u2011]+$/g, '').trim();
}

/**
 * Determines whether a token represents an elision/enclitic form.
 * 1. Checks dexonline HTML classes/titles (e.g. class="elision" or title="eliziune").
 * 2. Hyphens only signal an elision if LEADING or TRAILING (e.g. ‑mi, ‑ți, fostu‑).
 * Internal hyphens between letters (e.g. după-amiază) are NOT elisions.
 */
export function isElision(text, attrs = '') {
  const hasElisionClass = /class=["'][^"']*elision/i.test(attrs) || /title=["'][^"']*eliziune/i.test(attrs);
  const trimmed = text.trim();
  const hasBoundaryHyphen = /^[-‑–—\u2011]|[-‑–—\u2011]$/.test(trimmed);
  return hasElisionClass || hasBoundaryHyphen;
}

/**
 * Extracts items from <li> inside a table cell, separating elisions.
 */
export function extractItems(cellHtml) {
  if (!cellHtml) return [];
  const liRegex = /<li([^>]*)>([\s\S]*?)<\/li>/gi;
  const items = [];
  let liMatch;
  while ((liMatch = liRegex.exec(cellHtml)) !== null) {
    const attrs = liMatch[1];
    const inner = liMatch[2];
    const raw = decodeHtmlEntities(inner).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const clean = cleanText(inner);
    const elision = isElision(raw, attrs);

    items.push({
      rawText: raw,
      cleanText: clean,
      isElision: elision,
      attrs: attrs.trim(),
    });
  }
  return items;
}
