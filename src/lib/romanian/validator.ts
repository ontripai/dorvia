import { RomanianPhrase } from './types';

export interface ValidationError {
  rule: 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8';
  phraseId: string;
  message: string;
}

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const ZWNJ_EXCEPTIONS: readonly string[] = Object.freeze([
  'میز',
  'میوه',
  'میان',
  'میدان',
  'میلیون',
  'میلیارد',
  'میهن',
  'میل',
  'میراث',
  'میزان',
  'میکرو',
]);

const ZWNJ_EXCEPTIONS_SET = new Set(ZWNJ_EXCEPTIONS);
const PERSIAN_LETTERS_RAW = '\\u0621-\\u064A\\u067E\\u0686\\u0698\\u06A9\\u06AF\\u06CC';

export function validateRomanianPhrases(phrases: RomanianPhrase[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const phrase of phrases) {
    const id = phrase.id || '(missing-id)';

    // V1: Unique id across entire dataset
    if (seenIds.has(phrase.id)) {
      errors.push({
        rule: 'V1',
        phraseId: id,
        message: `Duplicate phrase id: "${phrase.id}"`,
      });
    } else {
      seenIds.add(phrase.id);
    }

    // V2: Unique slug across entire dataset
    if (seenSlugs.has(phrase.slug)) {
      errors.push({
        rule: 'V2',
        phraseId: id,
        message: `Duplicate phrase slug: "${phrase.slug}"`,
      });
    } else {
      seenSlugs.add(phrase.slug);
    }

    // V3: Slug format regex: ^[a-z0-9]+(-[a-z0-9]+)*$
    if (!phrase.slug || !SLUG_REGEX.test(phrase.slug)) {
      errors.push({
        rule: 'V3',
        phraseId: id,
        message: `Invalid slug format: "${phrase.slug}". Must match ^[a-z0-9]+(-[a-z0-9]+)*$`,
      });
    }

    // V4: Non-empty text in ro, en, fa after trim()
    const ro = phrase.text?.ro?.trim() || '';
    const en = phrase.text?.en?.trim() || '';
    const fa = phrase.text?.fa?.trim() || '';

    if (!ro || !en || !fa) {
      const missingLangs: string[] = [];
      if (!ro) missingLangs.push('ro');
      if (!en) missingLangs.push('en');
      if (!fa) missingLangs.push('fa');
      errors.push({
        rule: 'V4',
        phraseId: id,
        message: `Empty text detected for language(s): ${missingLangs.join(', ')}`,
      });
    }

    // V5: Published phrase must have non-empty source.label after trim()
    if (phrase.status === 'published') {
      const sourceLabel = phrase.source?.label?.trim() || '';
      if (!sourceLabel) {
        errors.push({
          rule: 'V5',
          phraseId: id,
          message: `Published phrase has empty source.label`,
        });
      }
    }

    // V6: Published phrase cannot have register === 'informal'
    if (phrase.status === 'published' && phrase.register === 'informal') {
      errors.push({
        rule: 'V6',
        phraseId: id,
        message: `Published phrase has forbidden informal register. Informal expressions are restricted to informalVariant.`,
      });
    }

    // V7: Name token consistency
    // Check 1: Any token with '{{' must strictly be '{{name}}' (no '{{user}}', '{{ name }}', etc.)
    const texts = [
      { lang: 'ro', val: phrase.text?.ro || '' },
      { lang: 'en', val: phrase.text?.en || '' },
      { lang: 'fa', val: phrase.text?.fa || '' },
    ];

    let hasInvalidToken = false;
    for (const { lang, val } of texts) {
      // Find all occurrences of {{...}} or stray {{
      const tokenMatches = val.match(/\{\{[^}]*\}\}|\{\{/g);
      if (tokenMatches) {
        for (const token of tokenMatches) {
          if (token !== '{{name}}') {
            hasInvalidToken = true;
            errors.push({
              rule: 'V7',
              phraseId: id,
              message: `Invalid template token "${token}" in text.${lang}. Only exact "{{name}}" is permitted.`,
            });
          }
        }
      }
    }

    // Check 2: Presence parity across all three languages
    if (!hasInvalidToken) {
      const roHas = texts[0].val.includes('{{name}}');
      const enHas = texts[1].val.includes('{{name}}');
      const faHas = texts[2].val.includes('{{name}}');

      const allHave = roHas && enHas && faHas;
      const noneHave = !roHas && !enHas && !faHas;

      if (!allHave && !noneHave) {
        errors.push({
          rule: 'V7',
          phraseId: id,
          message: `Token {{name}} presence parity violation across languages: ro=${roHas}, en=${enHas}, fa=${faHas}. Must be present in all 3 languages or in none.`,
        });
      }
    }

    // V8: Verb prefix ZWNJ enforcement (می / نمی‌)
    const faFields = [
      { name: 'text.fa', text: phrase.text?.fa },
      { name: 'usageNote.fa', text: phrase.usageNote?.fa },
      { name: 'informalVariant.note', text: phrase.informalVariant?.note },
    ];

    for (const { name, text } of faFields) {
      if (!text) continue;
      const re = new RegExp(
        `(?:^|[^${PERSIAN_LETTERS_RAW}\\u200C])((?:ن?می)(?:[${PERSIAN_LETTERS_RAW}]+))`,
        'g'
      );
      let m;
      while ((m = re.exec(text)) !== null) {
        const word = m[1];
        if (!ZWNJ_EXCEPTIONS_SET.has(word)) {
          errors.push({
            rule: 'V8',
            phraseId: id,
            message: `Missing ZWNJ (نیم‌فاصله) after verb prefix in ${name}: offending word "${word}"`,
          });
        }
      }
    }
  }

  return errors;
}

export function assertValidPhrases(phrases: RomanianPhrase[]): void {
  const errors = validateRomanianPhrases(phrases);
  if (errors.length > 0) {
    const formatted = errors
      .map(e => `  [${e.rule}] phrase "${e.phraseId}": ${e.message}`)
      .join('\n');
    throw new Error(
      `Romanian Content Validation Failed with ${errors.length} error(s):\n${formatted}`
    );
  }
}
