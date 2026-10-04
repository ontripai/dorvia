/** Ignore presentation differences without accepting wrong words or noun forms. */
export function normalizeRomanianAnswer(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('ro-RO')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().replace(/\s+/g, ' ');
}

export function matchesRomanianAnswer(value: string, expected: string) {
  const submitted = normalizeRomanianAnswer(value);
  const target = normalizeRomanianAnswer(expected);
  if (!submitted) return false;
  // A polite request still communicates its meaning without the optional “please”.
  return submitted === target || submitted === target.replace(/ va rog$/, '');
}
