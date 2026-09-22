import {
  RomanianPhrase,
  RomanianWord,
  RomanianVerb,
  RomanianGrapheme,
  RomanianDialogue,
  DomainMeta,
} from './types';

export type ValidationRuleId =
  | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8'
  | 'V9' | 'V10' | 'V11' | 'V12' | 'V13' | 'V14';

export interface ValidationError {
  rule: ValidationRuleId;
  phraseId: string;
  entityId?: string;
  message: string;
}

export interface RomanianValidationContext {
  phrases?: RomanianPhrase[];
  words?: RomanianWord[];
  verbs?: RomanianVerb[];
  graphemes?: RomanianGrapheme[];
  dialogues?: RomanianDialogue[];
  domains?: DomainMeta[];
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

export function validateRomanianContent(context: RomanianValidationContext): ValidationError[] {
  const {
    phrases = [],
    words = [],
    verbs = [],
    graphemes = [],
    dialogues = [],
    domains = [],
  } = context;

  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  // Lookup maps
  const wordIdSet = new Set(words.map(w => w.id));
  const verbIdSet = new Set(verbs.map(v => v.id));
  const phraseIdSet = new Set(phrases.map(p => p.id));
  const wordMap = new Map<string, RomanianWord>(words.map(w => [w.id, w]));
  const domainMap = new Map<string, DomainMeta>(domains.map(d => [d.id, d]));

  // --- Validate Phrases (V1 to V8, V9, V12, V14) ---
  for (const phrase of phrases) {
    const id = phrase.id || '(missing-id)';

    // V1: Unique id across entire dataset
    if (seenIds.has(phrase.id)) {
      errors.push({
        rule: 'V1',
        phraseId: id,
        entityId: id,
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
        entityId: id,
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
        entityId: id,
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
        entityId: id,
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
          entityId: id,
          message: `Published phrase has empty source.label`,
        });
      }
    }

    // V6: Published phrase cannot have register === 'informal' ONLY IF intendedUse === 'produce'
    // Modified in dre-p152: phrases with intendedUse === 'comprehend' may have informal register.
    if (
      phrase.status === 'published' &&
      phrase.intendedUse === 'produce' &&
      phrase.register === 'informal'
    ) {
      errors.push({
        rule: 'V6',
        phraseId: id,
        entityId: id,
        message: `Published phrase with intendedUse: 'produce' has forbidden informal register. Informal expressions are restricted to informalVariant or intendedUse: 'comprehend'.`,
      });
    }

    // V7: Name token consistency
    const texts = [
      { lang: 'ro', val: phrase.text?.ro || '' },
      { lang: 'en', val: phrase.text?.en || '' },
      { lang: 'fa', val: phrase.text?.fa || '' },
    ];

    let hasInvalidToken = false;
    for (const { lang, val } of texts) {
      const tokenMatches = val.match(/\{\{[^}]*\}\}|\{\{/g);
      if (tokenMatches) {
        for (const token of tokenMatches) {
          if (token !== '{{name}}') {
            hasInvalidToken = true;
            errors.push({
              rule: 'V7',
              phraseId: id,
              entityId: id,
              message: `Invalid template token "${token}" in text.${lang}. Only exact "{{name}}" is permitted.`,
            });
          }
        }
      }
    }

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
          entityId: id,
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
            entityId: id,
            message: `Missing ZWNJ (نیم‌فاصله) after verb prefix in ${name}: offending word "${word}"`,
          });
        }
      }
    }

    // V9: Reference existence for phrase wordIds and verbIds
    if (phrase.wordIds && phrase.wordIds.length > 0) {
      for (const wId of phrase.wordIds) {
        if (!wordIdSet.has(wId)) {
          errors.push({
            rule: 'V9',
            phraseId: id,
            entityId: id,
            message: `Phrase "${id}" references non-existent wordId: "${wId}"`,
          });
        }
      }
    }

    if (phrase.verbIds && phrase.verbIds.length > 0) {
      for (const vId of phrase.verbIds) {
        if (!verbIdSet.has(vId)) {
          errors.push({
            rule: 'V9',
            phraseId: id,
            entityId: id,
            message: `Phrase "${id}" references non-existent verbId: "${vId}"`,
          });
        }
      }
    }

    // V12: Introduction order - phrase cannot use word from a higher order domain
    if (phrase.wordIds && phrase.wordIds.length > 0) {
      const phraseDomainId = phrase.domain || phrase.category;
      const phraseDomain = domainMap.get(phraseDomainId);
      const phraseOrder = phraseDomain?.order;

      for (const wId of phrase.wordIds) {
        const word = wordMap.get(wId);
        if (!word) continue;

        let minWordOrder = Infinity;
        let wordMinDomain: DomainMeta | undefined;
        for (const dId of word.domains) {
          const d = domainMap.get(dId);
          if (d && d.order < minWordOrder) {
            minWordOrder = d.order;
            wordMinDomain = d;
          }
        }

        if (phraseOrder !== undefined && minWordOrder !== Infinity) {
          if (phraseOrder < minWordOrder) {
            errors.push({
              rule: 'V12',
              phraseId: id,
              entityId: id,
              message: `Phrase "${id}" in domain "${phraseDomainId}" (order ${phraseOrder}) uses word "${wId}" introduced in domain "${wordMinDomain?.id}" with higher order (${minWordOrder}).`,
            });
          }
        }

        // Station check if in the same domain and stationOrder is sequential
        if (
          phraseDomain &&
          phraseDomain.stationOrder === 'sequential' &&
          word.domains.includes(phraseDomain.id) &&
          phrase.stationId &&
          word.stationId
        ) {
          const phraseStation = phraseDomain.stations.find(s => s.id === phrase.stationId);
          const wordStation = phraseDomain.stations.find(s => s.id === word.stationId);
          if (phraseStation && wordStation && phraseStation.order < wordStation.order) {
            errors.push({
              rule: 'V12',
              phraseId: id,
              entityId: id,
              message: `Phrase "${id}" at station "${phrase.stationId}" (order ${phraseStation.order}) uses word "${wId}" introduced at later station "${word.stationId}" (order ${wordStation.order}) in sequential domain "${phraseDomain.id}".`,
            });
          }
        }
      }
    }

    // V14: High risk domain check for published phrases
    if (phrase.status === 'published') {
      const phraseDomainId = phrase.domain || phrase.category;
      const pDomain = domainMap.get(phraseDomainId);
      if (pDomain && pDomain.sourcingPolicy === 'must-be-sourced') {
        const isOfficial = phrase.source?.kind === 'official';
        const hasUrl = Boolean(phrase.source?.url && phrase.source.url.trim().length > 0);
        if (!isOfficial || !hasUrl) {
          errors.push({
            rule: 'V14',
            phraseId: id,
            entityId: id,
            message: `Published phrase "${id}" in must-be-sourced domain "${phraseDomainId}" requires source.kind === 'official' and non-empty url.`,
          });
        }
      }
    }
  }

  // --- Validate Graphemes (V9) ---
  for (const grapheme of graphemes) {
    if (grapheme.exampleWordId && !wordIdSet.has(grapheme.exampleWordId)) {
      errors.push({
        rule: 'V9',
        phraseId: grapheme.id,
        entityId: grapheme.id,
        message: `Grapheme "${grapheme.id}" references non-existent exampleWordId: "${grapheme.exampleWordId}"`,
      });
    }
  }

  // --- Validate Dialogues (V9) ---
  for (const dialogue of dialogues) {
    if (dialogue.turns) {
      for (const turn of dialogue.turns) {
        if (turn.phraseId && !phraseIdSet.has(turn.phraseId)) {
          errors.push({
            rule: 'V9',
            phraseId: dialogue.id,
            entityId: dialogue.id,
            message: `Dialogue "${dialogue.id}" turn references non-existent phraseId: "${turn.phraseId}"`,
          });
        }
      }
    }
  }

  // --- Validate Verbs (V10, V14) ---
  for (const verb of verbs) {
    if (verb.status === 'published') {
      // V10: Published verb must have source.url and conjugation.prezent
      const url = verb.source?.url?.trim() || '';
      if (!url) {
        errors.push({
          rule: 'V10',
          phraseId: verb.id,
          entityId: verb.id,
          message: `Published verb "${verb.id}" missing required source.url.`,
        });
      }

      if (!verb.conjugation?.prezent) {
        errors.push({
          rule: 'V10',
          phraseId: verb.id,
          entityId: verb.id,
          message: `Published verb "${verb.id}" missing required conjugation.prezent.`,
        });
      } else {
        const p = verb.conjugation.prezent;
        const missingPersons = ['eu', 'tu', 'el', 'noi', 'voi', 'ei'].filter(
          k => !p[k as keyof typeof p] || !p[k as keyof typeof p].trim()
        );
        if (missingPersons.length > 0) {
          errors.push({
            rule: 'V10',
            phraseId: verb.id,
            entityId: verb.id,
            message: `Published verb "${verb.id}" conjugation.prezent missing person(s): ${missingPersons.join(', ')}.`,
          });
        }
      }

      // V14: Verb in must-be-sourced domain
      for (const dId of verb.domains || []) {
        const d = domainMap.get(dId);
        if (d && d.sourcingPolicy === 'must-be-sourced') {
          if (!url) {
            errors.push({
              rule: 'V14',
              phraseId: verb.id,
              entityId: verb.id,
              message: `Published verb "${verb.id}" in must-be-sourced domain "${dId}" requires non-empty source.url.`,
            });
          }
        }
      }
    }
  }

  // --- Validate Words (V11, V14) ---
  for (const word of words) {
    if (word.status === 'published') {
      // V11: Published noun must have gender and definiteForm
      if (word.pos === 'noun') {
        if (!word.gender || !['m', 'f', 'n'].includes(word.gender)) {
          errors.push({
            rule: 'V11',
            phraseId: word.id,
            entityId: word.id,
            message: `Published noun "${word.id}" missing required gender ('m' | 'f' | 'n').`,
          });
        }
        if (!word.definiteForm || !word.definiteForm.trim()) {
          errors.push({
            rule: 'V11',
            phraseId: word.id,
            entityId: word.id,
            message: `Published noun "${word.id}" missing required definiteForm.`,
          });
        }
      }

      // V14: Word in must-be-sourced domain
      for (const dId of word.domains || []) {
        const d = domainMap.get(dId);
        if (d && d.sourcingPolicy === 'must-be-sourced') {
          const isOfficial = word.source?.kind === 'official';
          const hasUrl = Boolean(word.source?.url && word.source.url.trim().length > 0);
          if (!isOfficial || !hasUrl) {
            errors.push({
              rule: 'V14',
              phraseId: word.id,
              entityId: word.id,
              message: `Published word "${word.id}" in must-be-sourced domain "${dId}" requires source.kind === 'official' and non-empty url.`,
            });
          }
        }
      }
    }
  }

  // --- Validate Domains (V13) ---
  // Collect all domains that contain published content
  const domainsWithPublishedContent = new Set<string>();
  for (const d of domains) {
    domainsWithPublishedContent.add(d.id);
  }
  for (const w of words) {
    if (w.status === 'published') {
      for (const dId of w.domains || []) domainsWithPublishedContent.add(dId);
    }
  }
  for (const v of verbs) {
    if (v.status === 'published') {
      for (const dId of v.domains || []) domainsWithPublishedContent.add(dId);
    }
  }
  for (const d of dialogues) {
    if (d.status === 'published' && d.domain) {
      domainsWithPublishedContent.add(d.domain);
    }
  }
  for (const p of phrases) {
    if (p.status === 'published' && p.domain) {
      domainsWithPublishedContent.add(p.domain);
    }
  }

  for (const dId of domainsWithPublishedContent) {
    const dMeta = domainMap.get(dId);
    if (!dMeta) {
      errors.push({
        rule: 'V13',
        phraseId: dId,
        entityId: dId,
        message: `Domain "${dId}" has published content but is not registered in domain list.`,
      });
      continue;
    }

    if (typeof dMeta.estimatedWeeks !== 'number' || isNaN(dMeta.estimatedWeeks)) {
      errors.push({
        rule: 'V13',
        phraseId: dId,
        entityId: dId,
        message: `Domain "${dId}" has published content but is missing required estimatedWeeks.`,
      });
    }

    if (!dMeta.stationOrder || !['sequential', 'grouped'].includes(dMeta.stationOrder)) {
      errors.push({
        rule: 'V13',
        phraseId: dId,
        entityId: dId,
        message: `Domain "${dId}" has published content but is missing valid stationOrder ('sequential' | 'grouped').`,
      });
    }
  }

  return errors;
}

export function validateRomanianPhrases(phrases: RomanianPhrase[]): ValidationError[] {
  return validateRomanianContent({ phrases });
}

export function assertValidPhrases(phrases: RomanianPhrase[]): void {
  const errors = validateRomanianPhrases(phrases);
  if (errors.length > 0) {
    const formatted = errors
      .map(e => `  [${e.rule}] entity "${e.phraseId}": ${e.message}`)
      .join('\n');
    throw new Error(
      `Romanian Content Validation Failed with ${errors.length} error(s):\n${formatted}`
    );
  }
}

export function assertValidContent(context: RomanianValidationContext): void {
  const errors = validateRomanianContent(context);
  if (errors.length > 0) {
    const formatted = errors
      .map(e => `  [${e.rule}] entity "${e.phraseId}": ${e.message}`)
      .join('\n');
    throw new Error(
      `Romanian Content Validation Failed with ${errors.length} error(s):\n${formatted}`
    );
  }
}
