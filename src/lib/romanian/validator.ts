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
  | 'V17' | 'V18' | 'V19' | 'V20' | 'V21' | 'V22' | 'V23' | 'V24' | 'V25' | 'V26';

export interface ValidationRuleMeta {
  id: ValidationRuleId;
  name: string;
  description: string;
}

export const VALIDATION_RULES: readonly ValidationRuleMeta[] = Object.freeze([
  { id: 'V1', name: 'Unique ID', description: 'All entity IDs must be unique within their respective collections' },
  { id: 'V2', name: 'Unique Slug', description: 'All slugs must be unique across collections' },
  { id: 'V3', name: 'Slug Format', description: 'Slugs must strictly match regex ^[a-z0-9]+(-[a-z0-9]+)*$' },
  { id: 'V4', name: 'Trilingual Text', description: 'Phrase texts in ro, en, fa must be non-empty after trim' },
  { id: 'V5', name: 'Source Citation', description: 'Published phrases must have non-empty source label' },
  { id: 'V6', name: 'Register Scoping', description: 'Register policy strictly scoped to intendedUse: produce' },
  { id: 'V7', name: 'Name Consistency', description: 'Name tokens {{name}} strictly consistent across ro/en/fa' },
  { id: 'V8', name: 'Verb Prefix ZWNJ', description: 'Persian continuous prefix mi-/nemi- must use ZWNJ' },
  { id: 'V9', name: 'Reference Integrity', description: 'Phrase word/verb references must exist in dictionary' },
  { id: 'V10', name: 'Verb Source & Paradigm', description: 'Verbs require valid DEX URL and complete present tense paradigm' },
  { id: 'V11', name: 'Noun Gender & Definite', description: 'Nouns require valid gender and definite form' },
  { id: 'V12', name: 'Domain Order', description: 'Curriculum domain introduction order strictly enforced' },
  { id: 'V13', name: 'Domain Metadata', description: 'Domain estimatedWeeks and stationOrder verified' },
  { id: 'V14', name: 'High-Risk Sourcing', description: 'High-risk domains must adhere to sourcing policy' },
  { id: 'V15', name: 'Category Compatibility', description: 'Phrase categories must be mapped to valid domains' },
  { id: 'V16', name: 'Domain Budgets', description: 'Domain max item budgets strictly enforced' },
  { id: 'V17', name: 'Global ID Uniqueness', description: 'Global entity ID uniqueness across combined dataset' },
  { id: 'V18', name: 'Referential Integrity', description: 'Referential integrity verified (grapheme exampleWordId and word formOf)' },
  { id: 'V19', name: 'Grapheme Pattern Match', description: 'Display form must contain lesson grapheme matching pattern' },
  { id: 'V20', name: 'Verb Participiu & Conjunctiv', description: 'Verb participiu and conjunctiv paradigm completeness verified' },
  { id: 'V21', name: 'Verb Stored Purity', description: 'Verb stored forms purity verified (no să, enclitic hyphens, HTML entities)' },
  { id: 'V22', name: 'Published Audio Completeness', description: 'Published graphemes require at least 2 distinct voice clips with valid durations' },
  { id: 'V23', name: 'Audio File Integrity', description: 'Audio clip files must physically exist on disk under public/' },
  { id: 'V24', name: 'Registry Completeness', description: 'All entities in source content files must be present in unified registry' },
  { id: 'V25', name: 'Published Example Word', description: 'Published graphemes must reference published example words' },
  { id: 'V26', name: 'Unique Lemma and POS', description: 'The (lemma, pos) pair of every word must be unique across the registry' },
]);

export interface ValidationError {
  rule: ValidationRuleId;
  phraseId: string;
  entityId?: string;
  message: string;
}

export interface RegistrySourceContext {
  phrases?: RomanianPhrase[];
  words?: RomanianWord[];
  verbs?: RomanianVerb[];
  graphemes?: RomanianGrapheme[];
  dialogues?: RomanianDialogue[];
  domains?: DomainMeta[];
}

export interface RomanianValidationContext {
  phrases?: RomanianPhrase[];
  words?: RomanianWord[];
  verbs?: RomanianVerb[];
  graphemes?: RomanianGrapheme[];
  dialogues?: RomanianDialogue[];
  domains?: DomainMeta[];
  sources?: RegistrySourceContext;
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

      const isDefectiveValid = Boolean(
        verb.defective &&
        verb.defective.reason &&
        verb.defective.reason.trim().length > 0 &&
        verb.defective.source &&
        verb.defective.source.trim().length > 0
      );

      if (!verb.conjugation?.prezent) {
        errors.push({
          rule: 'V10',
          phraseId: verb.id,
          entityId: verb.id,
          message: `Published verb "${verb.id}" missing required conjugation.prezent.`,
        });
      } else if (!isDefectiveValid) {
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

  // --- Validate Verb Conjunctiv and Participiu (V20) ---
  for (const verb of verbs) {
    if (verb.status === 'published') {
      const vId = verb.id || '(missing-verb-id)';

      // Participiu: non-empty string required
      const participiu = verb.participiu?.trim() || '';
      if (!participiu) {
        errors.push({
          rule: 'V20',
          phraseId: vId,
          entityId: vId,
          message: `Published verb "${vId}" missing required non-empty participiu.`,
        });
      }

      // Defective declaration check: if declared, reason and source must be non-empty
      const hasDefectiveDeclaration = Boolean(verb.defective);
      const isDefectiveValid = Boolean(
        verb.defective &&
        verb.defective.reason &&
        verb.defective.reason.trim().length > 0 &&
        verb.defective.source &&
        verb.defective.source.trim().length > 0
      );

      if (hasDefectiveDeclaration && !isDefectiveValid) {
        errors.push({
          rule: 'V20',
          phraseId: vId,
          entityId: vId,
          message: `Published verb "${vId}" declared defective but missing non-empty reason or source.`,
        });
      }

      // Conjunctiv: all 6 persons complete and non-empty, unless explicitly declared defective
      if (!isDefectiveValid) {
        const conj = verb.conjugation?.conjunctiv || verb.conjunctiv;
        if (!conj) {
          errors.push({
            rule: 'V20',
            phraseId: vId,
            entityId: vId,
            message: `Published verb "${vId}" missing required conjunctiv paradigm.`,
          });
        } else {
          const persons = ['eu', 'tu', 'el', 'noi', 'voi', 'ei'] as const;
          const missingPersons = persons.filter(k => !conj[k] || !conj[k].trim());
          if (missingPersons.length > 0) {
            errors.push({
              rule: 'V20',
              phraseId: vId,
              entityId: vId,
              message: `Published verb "${vId}" conjunctiv paradigm missing person(s): ${missingPersons.join(', ')}.`,
            });
          }
        }
      }
    }
  }

  // --- Validate Verb Stored Forms Purity (V21) ---
  for (const verb of verbs) {
    const vId = verb.id || '(missing-verb-id)';

    const checkForm = (form: unknown, path: string) => {
      if (typeof form !== 'string') return;
      const trimmed = form.trim();
      if (!trimmed) return;

      const isSaWord = /(?:^|[^\p{L}])să(?=[^\p{L}]|$)/iu.test(form);
      const isSaPrefix =
        !verb.infinitive?.startsWith('a să') &&
        !verb.infinitive?.startsWith('a sa') &&
        /^să\p{L}+/iu.test(form);

      if (isSaWord || isSaPrefix) {
        errors.push({
          rule: 'V21',
          phraseId: vId,
          entityId: vId,
          message: `Verb "${vId}" ${path} contains "să": "${form}". Stored conjunctiv forms must not include "să".`,
        });
      }
      if (/[-‑–—]/.test(form)) {
        errors.push({
          rule: 'V21',
          phraseId: vId,
          entityId: vId,
          message: `Verb "${vId}" ${path} contains hyphen: "${form}".`,
        });
      }
      if (/[&]|#x/i.test(form)) {
        errors.push({
          rule: 'V21',
          phraseId: vId,
          entityId: vId,
          message: `Verb "${vId}" ${path} contains HTML entity: "${form}".`,
        });
      }
      if (/\s/.test(form)) {
        errors.push({
          rule: 'V21',
          phraseId: vId,
          entityId: vId,
          message: `Verb "${vId}" ${path} contains whitespace: "${form}".`,
        });
      }
    };

    if (verb.participiu) {
      checkForm(verb.participiu, 'participiu');
    }

    if (verb.conjugation) {
      for (const [tense, personSet] of Object.entries(verb.conjugation)) {
        if (personSet && typeof personSet === 'object') {
          for (const [pKey, pVal] of Object.entries(personSet)) {
            checkForm(pVal, `conjugation.${tense}.${pKey}`);
          }
        }
      }
    }

    if (verb.conjunctiv) {
      for (const [pKey, pVal] of Object.entries(verb.conjunctiv)) {
        checkForm(pVal, `conjunctiv.${pKey}`);
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

  // V13: Item stationId validation against domain stations list
  for (const phrase of phrases) {
    if (phrase.stationId) {
      const pDomainId = phrase.domain || phrase.category;
      const pDomain = domainMap.get(pDomainId);
      if (!pDomain || !pDomain.stations.some(s => s.id === phrase.stationId)) {
        errors.push({
          rule: 'V13',
          phraseId: phrase.id,
          entityId: phrase.id,
          message: `Phrase "${phrase.id}" references stationId "${phrase.stationId}" which is not defined in domain "${pDomainId}" stations list.`,
        });
      }
    }
  }

  for (const word of words) {
    if (word.stationId) {
      const wDomains = word.domains || [];
      const hasMatchingStation = wDomains.some(dId =>
        domainMap.get(dId)?.stations.some(s => s.id === word.stationId)
      );
      if (!hasMatchingStation) {
        errors.push({
          rule: 'V13',
          phraseId: word.id,
          entityId: word.id,
          message: `Word "${word.id}" references stationId "${word.stationId}" which is not defined in any of its domains ([${wDomains.join(', ')}]) stations list.`,
        });
      }
    }
  }

  for (const dialogue of dialogues) {
    if (dialogue.stationId) {
      const dDomain = domainMap.get(dialogue.domain);
      if (!dDomain || !dDomain.stations.some(s => s.id === dialogue.stationId)) {
        errors.push({
          rule: 'V13',
          phraseId: dialogue.id,
          entityId: dialogue.id,
          message: `Dialogue "${dialogue.id}" references stationId "${dialogue.stationId}" which is not defined in domain "${dialogue.domain}" stations list.`,
        });
      }
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

  const seenGraphemeIds = new Set<string>();
  const seenGraphemeSlugs = new Set<string>();

  // --- Validate Graphemes Identity & Slug (V1, V2, V3) ---
  for (const grapheme of graphemes) {
    const gId = grapheme.id || '(missing-grapheme-id)';

    // V1: Unique grapheme id
    if (seenGraphemeIds.has(grapheme.id)) {
      errors.push({
        rule: 'V1',
        phraseId: gId,
        entityId: gId,
        message: `Duplicate grapheme id: "${grapheme.id}"`,
      });
    } else if (grapheme.id) {
      seenGraphemeIds.add(grapheme.id);
    }

    // V2: Unique grapheme slug
    if (seenGraphemeSlugs.has(grapheme.slug)) {
      errors.push({
        rule: 'V2',
        phraseId: gId,
        entityId: gId,
        message: `Duplicate grapheme slug: "${grapheme.slug}"`,
      });
    } else if (grapheme.slug) {
      seenGraphemeSlugs.add(grapheme.slug);
    }

    // V3: Slug format regex: ^[a-z0-9]+(-[a-z0-9]+)*$
    if (!grapheme.slug || !SLUG_REGEX.test(grapheme.slug)) {
      errors.push({
        rule: 'V3',
        phraseId: gId,
        entityId: gId,
        message: `Invalid grapheme slug format: "${grapheme.slug}". Must match ^[a-z0-9]+(-[a-z0-9]+)*$`,
      });
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

  // --- Validate Word formOf Referential Integrity (V18) ---
  for (const word of words) {
    const wId = word.id || '(missing-word-id)';
    if (word.formOf !== undefined) {
      if (!word.formOf || !wordMap.has(word.formOf)) {
        errors.push({
          rule: 'V18',
          phraseId: wId,
          entityId: wId,
          message: `Word "${wId}" has formOf referencing non-existent word "${word.formOf}".`,
        });
      } else {
        const baseWord = wordMap.get(word.formOf);
        if (baseWord && baseWord.formOf) {
          errors.push({
            rule: 'V18',
            phraseId: wId,
            entityId: wId,
            message: `Word "${wId}" has formOf referencing "${word.formOf}" which itself has formOf "${baseWord.formOf}" (two-level formOf chain prohibited).`,
          });
        }
      }
    }
  }

  // --- Validate Display Form Contains Lesson Grapheme (V19) ---
  for (const grapheme of graphemes) {
    const gId = grapheme.id || '(missing-grapheme-id)';
    if (!grapheme.matchPattern) {
      errors.push({
        rule: 'V19',
        phraseId: gId,
        entityId: gId,
        message: `Grapheme "${gId}" missing required matchPattern.`,
      });
    } else {
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

  // --- Helper for V23 File Existence ---
  const checkFileExistsOnDisk = (src: string): boolean => {
    if (typeof window !== 'undefined') return true;
    try {
      const fs = require('fs');
      const path = require('path');
      const relativeToPublic = src.startsWith('/') ? src.slice(1) : src;
      const filePath = path.join(process.cwd(), 'public', relativeToPublic);
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  };

  // --- Validate Published Grapheme Audio Clips (V22) ---
  for (const grapheme of graphemes) {
    if (grapheme.status === 'published') {
      const gId = grapheme.id || '(missing-grapheme-id)';
      if (!grapheme.audio || !Array.isArray(grapheme.audio) || grapheme.audio.length < 2) {
        errors.push({
          rule: 'V22',
          phraseId: gId,
          entityId: gId,
          message: `Published grapheme "${gId}" requires at least 2 AudioClips with distinct voices.`,
        });
      } else {
        const voicesSeen = new Set<string>();
        for (let i = 0; i < grapheme.audio.length; i++) {
          const clip = grapheme.audio[i];
          const voice = clip.voice?.trim() || '';
          const src = clip.src?.trim() || '';
          const durationMs = clip.durationMs;

          if (!src) {
            errors.push({
              rule: 'V22',
              phraseId: gId,
              entityId: gId,
              message: `Published grapheme "${gId}" audio clip #${i + 1} has empty src.`,
            });
          }

          if (typeof durationMs !== 'number' || durationMs <= 0 || isNaN(durationMs)) {
            errors.push({
              rule: 'V22',
              phraseId: gId,
              entityId: gId,
              message: `Published grapheme "${gId}" audio clip #${i + 1} (${voice || 'unnamed'}) has invalid durationMs: ${durationMs}. Must be > 0.`,
            });
          }

          if (voice) {
            voicesSeen.add(voice);
          }
        }

        if (voicesSeen.size < 2) {
          errors.push({
            rule: 'V22',
            phraseId: gId,
            entityId: gId,
            message: `Published grapheme "${gId}" must have clips with at least 2 distinct voices, found: ${Array.from(voicesSeen).join(', ') || 'none'}.`,
          });
        }
      }
    }
  }

  // --- Validate Audio Clip File Referential Integrity (V23) ---
  for (const grapheme of graphemes) {
    const gId = grapheme.id || '(missing-grapheme-id)';
    if (grapheme.audio && Array.isArray(grapheme.audio)) {
      for (let i = 0; i < grapheme.audio.length; i++) {
        const clip = grapheme.audio[i];
        const src = clip.src?.trim() || '';
        if (!src) {
          errors.push({
            rule: 'V23',
            phraseId: gId,
            entityId: gId,
            message: `Grapheme "${gId}" audio clip #${i + 1} has empty src.`,
          });
          continue;
        }

        const fileExists = checkFileExistsOnDisk(src);
        if (!fileExists) {
          errors.push({
            rule: 'V23',
            phraseId: gId,
            entityId: gId,
            message: `Grapheme "${gId}" audio clip #${i + 1} references non-existent file on disk: "${src}".`,
          });
        }
      }
    }
  }

  // --- Validate Registry Completeness (V24) ---
  if (context.sources) {
    const v24Errors = validateRegistryCompleteness(context, context.sources);
    errors.push(...v24Errors);
  }

  // --- Validate Published Grapheme Example Word Published (V25) ---
  for (const grapheme of graphemes) {
    if (grapheme.status === 'published') {
      const gId = grapheme.id || '(missing-grapheme-id)';
      const refWord = grapheme.exampleWordId ? wordMap.get(grapheme.exampleWordId) : null;
      if (refWord && refWord.status !== 'published') {
        errors.push({
          rule: 'V25',
          phraseId: gId,
          entityId: gId,
          message: `Published grapheme "${gId}" references example word "${grapheme.exampleWordId}" with status "${refWord.status}". Example word must be published.`,
        });
      }
    }
  }

  // --- Validate Unique (lemma, pos) across Words (V26) ---
  const lemmaPosMap = new Map<string, string>();
  for (const word of words) {
    if (!word.lemma || !word.pos) continue;
    const key = `${word.lemma.trim().toLowerCase()}#${word.pos}`;
    const existingWordId = lemmaPosMap.get(key);
    if (existingWordId) {
      errors.push({
        rule: 'V26',
        phraseId: word.id,
        entityId: word.id,
        message: `Duplicate (lemma, pos) pair ("${word.lemma.trim()}", "${word.pos}"): word "${word.id}" duplicates word "${existingWordId}".`,
      });
    } else {
      lemmaPosMap.set(key, word.id);
    }
  }

  return errors;
}

export function validateRegistryCompleteness(
  registry: RomanianValidationContext,
  sources: RegistrySourceContext
): ValidationError[] {
  const errors: ValidationError[] = [];

  const checkCategory = (
    categoryName: string,
    regItems?: Array<{ id: string }>,
    srcItems?: Array<{ id: string }>
  ) => {
    if (!srcItems || srcItems.length === 0) return;
    const regIds = new Set((regItems || []).map(item => item.id));
    const missingIds: string[] = [];
    for (const src of srcItems) {
      if (!regIds.has(src.id)) {
        missingIds.push(src.id);
      }
    }
    if (missingIds.length > 0) {
      for (const id of missingIds) {
        errors.push({
          rule: 'V24',
          phraseId: id,
          entityId: id,
          message: `Registry ${categoryName} is incomplete: missing ID "${id}" defined in source array.`,
        });
      }
    }
  };

  checkCategory('phrases', registry.phrases, sources.phrases);
  checkCategory('words', registry.words, sources.words);
  checkCategory('verbs', registry.verbs, sources.verbs);
  checkCategory('graphemes', registry.graphemes, sources.graphemes);
  checkCategory('dialogues', registry.dialogues, sources.dialogues);
  checkCategory('domains', registry.domains, sources.domains);

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
