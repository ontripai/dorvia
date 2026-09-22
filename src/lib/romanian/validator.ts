import {
  RomanianCategory,
  RomanianPhrase,
  RomanianWord,
  RomanianVerb,
  RomanianGrapheme,
  RomanianDialogue,
  DomainMeta,
} from './types';

export type ValidationRuleId =
  | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8'
  | 'V9' | 'V10' | 'V11' | 'V12' | 'V13' | 'V14' | 'V15' | 'V16'
  | 'V17' | 'V18' | 'V19';

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

  // --- Validate Phrases (V1 to V8, V9, V12, V14, V15) ---
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

    // V15: Category and Domain Compatibility
    // Failure when: Published item has domain and category, and category is not in domain's categories list
    if (phrase.status === 'published' && phrase.domain && phrase.category) {
      const pDomain = domainMap.get(phrase.domain);
      if (pDomain && pDomain.categories && !pDomain.categories.includes(phrase.category)) {
        errors.push({
          rule: 'V15',
          phraseId: id,
          entityId: id,
          message: `Published phrase "${id}" has category "${phrase.category}" which is not in domain "${phrase.domain}" allowed categories: [${pDomain.categories.join(', ')}].`,
        });
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

  // --- Validate Domain Budgets (V16) ---
  for (const domain of domains) {
    if (typeof domain.maxItems === 'number') {
      const pubPhrases = phrases.filter(p => p.status === 'published' && p.domain === domain.id).length;
      const pubWords = words.filter(w => w.status === 'published' && (w.domains || []).includes(domain.id)).length;
      const pubVerbs = verbs.filter(v => v.status === 'published' && (v.domains || []).includes(domain.id)).length;
      const pubDialogues = dialogues.filter(d => d.status === 'published' && d.domain === domain.id).length;
      const totalPublished = pubPhrases + pubWords + pubVerbs + pubDialogues;

      if (totalPublished > domain.maxItems) {
        errors.push({
          rule: 'V16',
          phraseId: domain.id,
          entityId: domain.id,
          message: `Domain "${domain.id}" exceeds item budget maxItems (${domain.maxItems}): currently has ${totalPublished} published items (${pubPhrases} phrases, ${pubWords} words, ${pubVerbs} verbs, ${pubDialogues} dialogues).`,
        });
      }
    }
  }

  // --- Validate Global ID Uniqueness Across Combined Dataset (V17) ---
  const globalIdMap = new Map<string, string>();
  const allEntities: Array<{ id: string; type: string }> = [
    ...phrases.map(p => ({ id: p.id, type: 'phrase' })),
    ...words.map(w => ({ id: w.id, type: 'word' })),
    ...verbs.map(v => ({ id: v.id, type: 'verb' })),
    ...graphemes.map(g => ({ id: g.id, type: 'grapheme' })),
    ...dialogues.map(d => ({ id: d.id, type: 'dialogue' })),
  ];
  for (const ent of allEntities) {
    if (!ent.id) continue;
    if (globalIdMap.has(ent.id)) {
      errors.push({
        rule: 'V17',
        phraseId: ent.id,
        entityId: ent.id,
        message: `Duplicate entity ID "${ent.id}" found across dataset (first seen as ${globalIdMap.get(ent.id)}, duplicate in ${ent.type}).`,
      });
    } else {
      globalIdMap.set(ent.id, ent.type);
    }
  }

  // --- Validate Grapheme-to-Word Referential Integrity (V18) ---
  for (const grapheme of graphemes) {
    const gId = grapheme.id || '(missing-grapheme-id)';
    if (!grapheme.exampleWordId) {
      errors.push({
        rule: 'V18',
        phraseId: gId,
        entityId: gId,
        message: `Grapheme "${gId}" missing required exampleWordId.`,
      });
    } else if (!wordIdSet.has(grapheme.exampleWordId)) {
      errors.push({
        rule: 'V18',
        phraseId: gId,
        entityId: gId,
        message: `Grapheme "${gId}" references non-existent exampleWordId: "${grapheme.exampleWordId}".`,
      });
    }
  }

  // --- Validate Display Form Contains Lesson Grapheme (V19) ---
  for (const grapheme of graphemes) {
    const gId = grapheme.id || '(missing-grapheme-id)';
    if (grapheme.matchPattern) {
      const refWord = grapheme.exampleWordId ? wordMap.get(grapheme.exampleWordId) : null;
      const formToTest = grapheme.exampleForm || refWord?.lemma;
      if (!formToTest) {
        errors.push({
          rule: 'V19',
          phraseId: gId,
          entityId: gId,
          message: `Grapheme "${gId}" has matchPattern "${grapheme.matchPattern}" but no exampleForm or referenced word lemma to test.`,
        });
      } else {
        try {
          const rx = new RegExp(grapheme.matchPattern);
          if (!rx.test(formToTest)) {
            errors.push({
              rule: 'V19',
              phraseId: gId,
              entityId: gId,
              message: `Grapheme "${gId}" display form "${formToTest}" does not match lesson pattern /${grapheme.matchPattern}/.`,
            });
          }
        } catch (e) {
          errors.push({
            rule: 'V19',
            phraseId: gId,
            entityId: gId,
            message: `Grapheme "${gId}" has invalid regex matchPattern "${grapheme.matchPattern}": ${(e as Error).message}`,
          });
        }
      }
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

export interface DomainSizeStats {
  id: string;
  phrases: number;
  words: number;
  verbs: number;
  dialogues: number;
  total: number;
  budget?: number;
}

export interface ContentStats {
  domainSizes: DomainSizeStats[];
  mappedCategoriesCount: number;
  totalCategoriesCount: number;
  mappedCategories: RomanianCategory[];
  coreMultiDomainWords: number;
  coreMultiDomainVerbs: number;
}

export function computeContentStats(context: RomanianValidationContext): ContentStats {
  const {
    phrases = [],
    words = [],
    verbs = [],
    dialogues = [],
    domains = [],
  } = context;

  const domainSizes: DomainSizeStats[] = domains.map(d => {
    const pubPhrases = phrases.filter(p => p.status === 'published' && p.domain === d.id).length;
    const pubWords = words.filter(w => w.status === 'published' && (w.domains || []).includes(d.id)).length;
    const pubVerbs = verbs.filter(v => v.status === 'published' && (v.domains || []).includes(d.id)).length;
    const pubDialogues = dialogues.filter(dlg => dlg.status === 'published' && dlg.domain === d.id).length;
    const total = pubPhrases + pubWords + pubVerbs + pubDialogues;
    return {
      id: d.id,
      phrases: pubPhrases,
      words: pubWords,
      verbs: pubVerbs,
      dialogues: pubDialogues,
      total,
      budget: d.maxItems,
    };
  });

  const mappedCategoriesSet = new Set<RomanianCategory>();
  for (const d of domains) {
    for (const cat of d.categories || []) {
      mappedCategoriesSet.add(cat);
    }
  }

  const coreMultiDomainWords = words.filter(
    w => (w.domains || []).includes('core') && (w.domains || []).length > 1
  ).length;

  const coreMultiDomainVerbs = verbs.filter(
    v => (v.domains || []).includes('core') && (v.domains || []).length > 1
  ).length;

  return {
    domainSizes,
    mappedCategoriesCount: mappedCategoriesSet.size,
    totalCategoriesCount: 13,
    mappedCategories: Array.from(mappedCategoriesSet),
    coreMultiDomainWords,
    coreMultiDomainVerbs,
  };
}
