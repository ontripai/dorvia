import {
  RomanianCategory,
  RomanianPhrase,
  RomanianWord,
  RomanianVerb,
  RomanianGrapheme,
  RomanianDialogue,
  DomainMeta,
  AudioClip,
  NoteSegment,
  UsageNote,
} from './types';

/** متن رویه‌ای یک یادداشت — همان چیزی که کاربر می‌خواند. */
export function usageNoteText(segments?: NoteSegment[], headOf?: (id: string) => string | undefined): string {
  if (!Array.isArray(segments)) return '';
  return segments
    .map(seg => {
      if ('t' in seg) return seg.t;
      if ('bad' in seg) return seg.bad;
      if ('fn' in seg) return seg.fn;
      return seg.display ?? headOf?.(seg.ref) ?? '';
    })
    .join('');
}

/** ارجاع‌های یک یادداشت، به‌ترتیب. قطعه‌های `bad` ارجاع محتوایی نیستند. */
export function usageNoteRefs(segments?: NoteSegment[]): string[] {
  if (!Array.isArray(segments)) return [];
  return segments.filter(s => 'ref' in s && !('bad' in s)).map(s => (s as { ref: string }).ref);
}

export type ValidationRuleId =
  | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8'
  | 'V9' | 'V10' | 'V11' | 'V12' | 'V13' | 'V14' | 'V15' | 'V16'
  | 'V17' | 'V18' | 'V19' | 'V20' | 'V21' | 'V22' | 'V23' | 'V24' | 'V25' | 'V26' | 'V27' | 'V28' | 'V29'
  | 'V30' | 'V31' | 'V32' | 'V33' | 'V34' | 'V35' | 'V36' | 'V37' | 'V38';

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
  { id: 'V11', name: 'Noun Gender & Definite', description: 'Nouns require valid gender and definite form (or declared invariable)' },
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
  { id: 'V27', name: 'Usage Note Vocabulary Conformance', description: 'All Latin tokens in usage notes (fa) and phrase ro texts must be valid Romanian vocabulary from registry or allowlist' },
  { id: 'V28', name: 'Published formOf Target Integrity', description: 'Published words with formOf must reference published base words' },
  { id: 'V29', name: 'Core Audio Manifest Integrity', description: 'Audio clip files referenced in core audio manifest must physically exist on disk under public/' },
  { id: 'V30', name: 'Unique Published Phrase Text', description: 'No two published phrases may share the same Romanian text (text.ro)' },
  { id: 'V31', name: 'English Gloss Disambiguation', description: 'Published entries sharing an English gloss must each carry a parenthetical disambiguator' },
  { id: 'V32', name: 'Stored Duration Matches File', description: 'Every AudioClip durationMs must match the real duration of the mp3 on disk (100ms tolerance)' },
  { id: 'V33', name: 'Unique Published Verb Infinitive', description: 'No two published verbs may share the same infinitive' },
  { id: 'V34', name: 'Usage Note Language Completeness', description: 'For every usage note, at least one language must carry every ref used by any of its languages' },
  { id: 'V35', name: 'No Bare Romanian In Note Text', description: 'A translatable {t} segment may not contain Romanian diacritics — Romanian forms must be refs' },
  { id: 'V36', name: 'Step Membership', description: 'Every entry in a station with steps must name a stepId defined by that station' },
  { id: 'V37', name: 'Free Stations Are A Prefix', description: 'Free stations must occupy the first positions of the teaching order — no paid station may precede a free one' },
  { id: 'V38', name: 'Step Size', description: 'A step must hold between 2 and 10 items — a session the learner can finish' },
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
  coreAudio?: Record<string, AudioClip[]>;
}

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * الگوی استخراج نشانه‌های لاتین به همراه حروف دارای نشانه‌های رومانیایی (ă â î ș ț) و خط‌تیره‌های درون‌واژه‌ای
 */
export const LATIN_TOKEN_REGEX = /[a-zA-ZăâîșțĂÂÎȘȚ]+(?:-[a-zA-ZăâîșțĂÂÎȘȚ]+)*/gu;

/**
 * واژه‌های نقشی که مدخل مستقل ندارند ولی در یادداشت‌ها لازم‌اند.
 * هر مدخل تازه اینجا باید دلیل داشته باشد — این فهرست راه فرار از V27 نیست.
 * سقف تعیین‌شده: حداکثر ۱۵ مدخل (بند ۲ dre-p167).
 */
export const FUNCTION_WORD_ALLOWLIST: readonly string[] = Object.freeze([
  'de',  // قاعده‌ی «de بعد از ۲۰» در ماژول اعداد — موضوع خودِ قاعده است
  'la',  // در la revedere و La ce oră؟ — در لوکوسیون منبع آمده
  'cu',  // در cu plăcere — در لوکوسیون منبع آمده
  'un',  // حرف تعریف نامعین مذکر — موضوع قاعده‌ی مطابقت جنسیت
  'o',   // حرف تعریف نامعین مؤنث — همان
  'și',  // موضوع قاعده‌ی اعداد مرکب
  'pe',  // حرف اضافه‌ی مفعول مستقیم رومانیایی
]);

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
      { name: 'usageNote.fa', text: usageNoteText(phrase.usageNote?.fa) || undefined },
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
            /**
             * استثنای «فرمول ثابت» (dre-p177).
             *
             * V12 فرض می‌کرد ترتیب وابستگی داده و ترتیب آموزش یکی‌اند. تا
             * وقتی احوال‌پرسی آخرین ایستگاه بود، بودند. حالا که اول است،
             * «Vă rog» پیش از ضمیر `vă` آموزش داده می‌شود — و باید هم بشود،
             * چون هیچ انسانی روز اول صرف پی‌بست یاد نمی‌گیرد.
             *
             * اعلان کافی نیست: `analysedAt` باید دقیقاً ایستگاه همان واژه را
             * نام ببرد. اگر جای دیگری را نام ببرد یا نام نبرد، قاعده قرمز
             * می‌شود. اعلانی که خودش آزموده نشود، راه فرار است.
             */
            const formula = phrase.taughtAsFormula;
            const declared = formula?.analysedAt ?? [];
            if (formula && declared.includes(word.stationId)) {
              // اعلان درست است — این واژه واقعاً در ایستگاهی که نام برده تحلیل می‌شود
            } else if (formula) {
              errors.push({
                rule: 'V12',
                phraseId: id,
                entityId: id,
                message: `Phrase "${id}" declares taughtAsFormula but its analysedAt [${declared.join(', ')}] does not name "${word.stationId}", where word "${wId}" is introduced.`,
              });
            } else {
              errors.push({
                rule: 'V12',
                phraseId: id,
                entityId: id,
                message: `Phrase "${id}" at station "${phrase.stationId}" (order ${phraseStation.order}) uses word "${wId}" introduced at later station "${word.stationId}" (order ${wordStation.order}) in sequential domain "${phraseDomain.id}". Declare taughtAsFormula if it is meant to be memorised whole.`,
              });
            }
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
        if (word.invariable) {
          if (!word.invariable.reason || !word.invariable.reason.trim() || !word.invariable.source || !word.invariable.source.trim()) {
            errors.push({
              rule: 'V11',
              phraseId: word.id,
              entityId: word.id,
              message: `Published noun "${word.id}" declared invariable must have non-empty reason and source.`,
            });
          }
          if (word.definiteForm && word.definiteForm.trim().length > 0) {
            errors.push({
              rule: 'V11',
              phraseId: word.id,
              entityId: word.id,
              message: `Published noun "${word.id}" declared invariable must not have definiteForm.`,
            });
          }
          if (word.plural && word.plural.trim().length > 0) {
            errors.push({
              rule: 'V11',
              phraseId: word.id,
              entityId: word.id,
              message: `Published noun "${word.id}" declared invariable must not have plural.`,
            });
          }
        } else {
          if (!word.definiteForm || !word.definiteForm.trim()) {
            errors.push({
              rule: 'V11',
              phraseId: word.id,
              entityId: word.id,
              message: `Published noun "${word.id}" missing required definiteForm.`,
            });
          }
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

  /**
   * مدت واقعی یک mp3، با شمردن فریم‌ها — نه ffprobe.
   *
   * چرا ffprobe نه: این اعتبارسنج در زمان بیلد روی Vercel هم اجرا می‌شود و
   * آنجا ffmpeg نصب نیست. قاعده‌ای که در محیط بیلد اجرا نشود، چیزی را
   * دروازه‌بانی نمی‌کند (درس dre-p155).
   *
   * چرا اندازه‌ی فایل نه: در آزمایش روی هر ۱۴۸ کلیپ، تخمین از روی اندازه
   * افست ثابت ۷۵۵ میلی‌ثانیه داشت (سرآیند ID3). ثابت بود فقط چون همه‌ی
   * فایل‌ها یک‌جور کدگذاری شده‌اند — یعنی درست بود به‌تصادف، نه به‌دلیل.
   *
   * شمردن فریم روی همان ۱۴۸ فایل حداکثر ۳۰ میلی‌ثانیه با ffprobe اختلاف داشت.
   */
  const BITRATE_V2_L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
  const BITRATE_V1_L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
  const SAMPLE_RATES: Record<number, number[]> = {
    3: [44100, 48000, 32000],   // MPEG 1
    2: [22050, 24000, 16000],   // MPEG 2
    0: [11025, 12000, 8000],    // MPEG 2.5
  };

  const readMp3DurationMs = (src: string): number | null => {
    if (typeof window !== 'undefined') return null;
    try {
      const fs = require('fs');
      const path = require('path');
      const rel = src.startsWith('/') ? src.slice(1) : src;
      const filePath = path.join(process.cwd(), 'public', rel);
      const b: Buffer = fs.readFileSync(filePath);

      let i = 0;
      if (b.length > 10 && b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) {
        i = 10 + (((b[6] & 0x7f) << 21) | ((b[7] & 0x7f) << 14) | ((b[8] & 0x7f) << 7) | (b[9] & 0x7f));
      }

      let samples = 0;
      let rate = 0;
      let frames = 0;
      while (i + 4 <= b.length) {
        if (b[i] !== 0xff || (b[i + 1] & 0xe0) !== 0xe0) { i++; continue; }
        const verBits = (b[i + 1] >> 3) & 0x03;
        const layer = (b[i + 1] >> 1) & 0x03;
        if (layer !== 1 || verBits === 1) { i++; continue; }
        const brIdx = (b[i + 2] >> 4) & 0x0f;
        const srIdx = (b[i + 2] >> 2) & 0x03;
        if (brIdx === 0 || brIdx === 15 || srIdx === 3) { i++; continue; }
        const isV1 = verBits === 3;
        const bitrate = (isV1 ? BITRATE_V1_L3 : BITRATE_V2_L3)[brIdx] * 1000;
        const sr = SAMPLE_RATES[verBits][srIdx];
        const spf = isV1 ? 1152 : 576;
        const pad = (b[i + 2] >> 1) & 0x01;
        const len = Math.floor((spf / 8) * bitrate / sr) + pad;
        if (len < 4) { i++; continue; }
        rate = sr;
        samples += spf;
        frames++;
        i += len;
      }
      if (!frames || !rate) return null;
      return Math.round((samples / rate) * 1000 / 10) * 10;
    } catch {
      return null;
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

  // --- Validate Published formOf Target Integrity (V28) ---
  for (const word of words) {
    if (word.status === 'published' && word.formOf) {
      const wId = word.id || '(missing-word-id)';
      const baseWord = wordMap.get(word.formOf);
      if (baseWord && baseWord.status !== 'published') {
        errors.push({
          rule: 'V28',
          phraseId: wId,
          entityId: wId,
          message: `Published word "${wId}" has formOf referencing "${word.formOf}" with status "${baseWord.status}". Base word must be published.`,
        });
      }
    }
  }

  // --- Validate Core Audio Manifest File Integrity (V29) ---
  if (context.coreAudio) {
    for (const [entityId, clips] of Object.entries(context.coreAudio)) {
      if (Array.isArray(clips)) {
        for (let i = 0; i < clips.length; i++) {
          const clip = clips[i];
          const src = clip?.src?.trim() || '';
          if (!src) {
            errors.push({
              rule: 'V29',
              phraseId: entityId,
              entityId: entityId,
              message: `Core audio clip #${i + 1} for "${entityId}" has empty src.`,
            });
            continue;
          }
          const fileExists = checkFileExistsOnDisk(src);
          if (!fileExists) {
            errors.push({
              rule: 'V29',
              phraseId: entityId,
              entityId: entityId,
              message: `Core audio clip #${i + 1} for "${entityId}" references non-existent file on disk: "${src}".`,
            });
          }
        }
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

  // --- Validate Usage Note & Phrase Text Conformance (V27) ---
  /**
   * دامنه‌ی این بخش حالا فقط متن رومانیایی عبارت‌هاست (text.ro).
   * یادداشت‌های کاربرد دیگر رشته نیستند و با قواعد قطعه‌ای بررسی می‌شوند —
   * همان «قرارداد نشانه‌گذاری صریح» که کامنت قبلی نبودش را گزارش می‌کرد.
   */

  // سقف ۱۵ مدخل برای فهرست واژه‌های نقشی مجاز
  if (FUNCTION_WORD_ALLOWLIST.length > 15) {
    errors.push({
      rule: 'V27',
      phraseId: 'FUNCTION_WORD_ALLOWLIST',
      entityId: 'FUNCTION_WORD_ALLOWLIST',
      message: `FUNCTION_WORD_ALLOWLIST exceeds maximum allowed size of 15 entries (currently ${FUNCTION_WORD_ALLOWLIST.length}). The allowlist must not be used to bypass V27.`,
    });
  }

  // استخراج واژگان مجاز از خود رجیستری (بدون فهرست دستی)
  const allowedVocab = new Set<string>();
  const addVocabTokens = (raw?: string) => {
    if (!raw) return;
    const tokens = raw.match(LATIN_TOKEN_REGEX);
    if (tokens) {
      for (const t of tokens) {
        allowedVocab.add(t.toLowerCase());
      }
    }
  };

  // ۱. واژه‌ها: لما، جمع، معرفه
  for (const w of words) {
    addVocabTokens(w.lemma);
    addVocabTokens(w.plural);
    addVocabTokens(w.definiteForm);
  }

  // ۲. افعال: شش صیغه‌ی حال و التزامی، وجه وصفی، اجزای مصدر (a و ریشه)
  for (const v of verbs) {
    addVocabTokens(v.participiu);
    addVocabTokens(v.infinitive);
    if (v.conjugation) {
      if (v.conjugation.prezent) {
        for (const f of Object.values(v.conjugation.prezent)) addVocabTokens(f);
      }
      if (v.conjugation.conjunctiv) {
        for (const f of Object.values(v.conjugation.conjunctiv)) addVocabTokens(f);
      }
    }
  }

  // ۳. گرافم‌ها: نماد گرافم و فرم نمایشی نمونه
  for (const g of graphemes) {
    addVocabTokens(g.grapheme);
    addVocabTokens(g.exampleForm);
  }

  // ۴. متن ro هر عبارت (با حذف نشانه‌های قالبی {{name}})
  for (const p of phrases) {
    if (p.text?.ro) {
      const cleanRo = p.text.ro.replace(/\{\{[^}]*\}\}/g, ' ');
      addVocabTokens(cleanRo);
    }
    if (p.informalVariant?.ro) {
      const cleanInf = p.informalVariant.ro.replace(/\{\{[^}]*\}\}/g, ' ');
      addVocabTokens(cleanInf);
    }
  }

  // ۵. فهرست واژه‌های نقشی مجاز
  for (const fw of FUNCTION_WORD_ALLOWLIST) {
    allowedVocab.add(fw.toLowerCase());
  }

  const validateLatinTokens = (
    entityType: string,
    entityId: string,
    entityLabel: string,
    field: string,
    text?: string,
    counterExamples?: string[]
  ) => {
    if (!text) return;
    const textToScan = text.replace(/\{\{[^}]*\}\}/g, ' ');
    const matches = textToScan.match(LATIN_TOKEN_REGEX);
    if (!matches) return;

    // استخراج توکن‌های مجاز محلی (مخصوص همین مدخل) از فیلد counterExamples
    const localAllowed = new Set<string>();
    if (counterExamples && Array.isArray(counterExamples)) {
      for (const ce of counterExamples) {
        if (typeof ce === 'string') {
          const ceMatches = ce.match(LATIN_TOKEN_REGEX);
          if (ceMatches) {
            for (const cet of ceMatches) {
              localAllowed.add(cet.toLowerCase());
            }
          }
        }
      }
    }

    for (const rawToken of matches) {
      const tokenLower = rawToken.toLowerCase();
      if (!allowedVocab.has(tokenLower) && !localAllowed.has(tokenLower)) {
        errors.push({
          rule: 'V27',
          phraseId: entityId,
          entityId: entityId,
          message: `Unverified Latin token "${rawToken}" in ${entityType} "${entityId}" (${entityLabel}) field "${field}". Token is not present in registry vocabulary or FUNCTION_WORD_ALLOWLIST.`,
        });
      }
    }
  };

  // دامنه ۱ سابق (اسکن رشته‌ای usageNote.fa) حذف شد و جایش را V27 قطعه‌ای گرفت.
  // بند «یادداشت‌های کاربرد» پایین‌تر.

  // دامنه ۲: متن رومانیایی عبارت‌ها (فیلد ro)
  for (const p of phrases) {
    validateLatinTokens('phrase', p.id || '(missing-id)', p.slug || 'phrase', 'text.ro', p.text?.ro, (p as any).counterExamples);
  }

  // --- Validate Unique Published Phrase Text (V30) ---
  /**
   * V26 همین را برای واژه‌ها اجرا می‌کند: یکتایی (lemma, pos). برای عبارت‌ها
   * معادلی نبود، و شش عبارت با هر دو نسخه‌ی published زنده ماندند (dre-p173).
   *
   * یک عبارت تکراری فقط باگ نمایشی نیست: حلقه‌ی یادگیری روی شناسه‌ی قلم کلید
   * می‌خورد، پس هر تکرار یک خانه‌ی حافظه‌ی اضافی می‌سازد، دو بار زمان‌بندی
   * می‌شود، و شمارنده‌ی پیشرفت را بیش از واقع می‌کند.
   *
   * مقایسه به حروف بزرگ/کوچک حساس نیست، ولی «ă â î ș ț» هرگز نرمال‌سازی
   * نمی‌شوند — suta و sută دو چیزند (درس dre-p163).
   */
  const publishedPhraseText = new Map<string, string>();
  for (const p of phrases) {
    if (p.status !== 'published') continue;
    const ro = p.text?.ro?.trim();
    if (!ro) continue;
    const key = ro.toLowerCase();
    const prior = publishedPhraseText.get(key);
    if (prior) {
      errors.push({
        rule: 'V30',
        phraseId: p.id,
        entityId: p.id,
        message: `Duplicate published phrase text "${ro}": phrase "${p.id}" duplicates phrase "${prior}". Archive one of them.`,
      });
    } else {
      publishedPhraseText.set(key, p.id);
    }
  }

  // --- Validate English Gloss Disambiguation (V31) ---
  /**
   * انگلیسی خط ثابت هر مخاطب است. یادگیرنده‌ای که فارسی نمی‌خواند فقط انگلیسی
   * را دارد، و دو مدخل متفاوت با یک معادل انگلیسی برای او دو چیز یکسان‌اند.
   *
   * رفع‌ابهام = پرانتز در خود رشته‌ی انگلیسی: «please (polite)».
   * قاعده فقط وجود پرانتز را می‌خواهد، نه درستی محتوایش — آن کار انسان است.
   *
   * دامنه: فقط مدخل‌های هم‌نوع با هم مقایسه می‌شوند (واژه با واژه، عبارت با
   * عبارت). نسخه‌ی اول این قاعده روی داده‌ی واقعی آزموده شد و واژه با عبارت را
   * هم مقایسه می‌کرد؛ نتیجه‌اش مثبت کاذب بود: واژه‌ی `pa` و عبارت `Pa!` یک چیزند
   * که عمداً در دو سطح ثبت شده، نه دو معنای مبهم. آنچه می‌ماند واقعی است:
   * `azi`/`astăzi` هر دو «today» و `bun`/`bună` هر دو «good» — و دومی دقیقاً
   * همان شکاف جنسیت است که یادگیرنده‌ی انگلیسی‌خوان هیچ نشانی از آن نمی‌بیند.
   */
  const DISAMBIGUATOR = /\([^)]+\)/;
  const normaliseGloss = (raw: string): string =>
    raw.trim().toLowerCase().replace(/[.!?]+$/, '').trim();

  type GlossEntry = { id: string; gloss: string; kind: string };
  const glossBuckets = new Map<string, GlossEntry[]>();
  const addGloss = (kind: string, id: string | undefined, gloss: string | undefined) => {
    if (!id || !gloss) return;
    const key = `${kind}#${normaliseGloss(gloss.replace(DISAMBIGUATOR, ' '))}`;
    if (key.endsWith('#')) return;
    const list = glossBuckets.get(key) || [];
    list.push({ id, gloss, kind });
    glossBuckets.set(key, list);
  };

  for (const w of words) {
    if (w.status === 'published') addGloss('word', w.id, w.translations?.en);
  }
  for (const v of verbs) {
    if (v.status === 'published') addGloss('verb', v.id, v.translations?.en);
  }
  for (const p of phrases) {
    if (p.status === 'published') addGloss('phrase', p.id, p.text?.en);
  }

  for (const list of glossBuckets.values()) {
    if (list.length < 2) continue;
    const bare = list.filter(e => !DISAMBIGUATOR.test(e.gloss));
    if (bare.length === 0) continue;
    const all = list.map(e => `"${e.id}"`).join(', ');
    for (const e of bare) {
      errors.push({
        rule: 'V31',
        phraseId: e.id,
        entityId: e.id,
        message: `English gloss "${e.gloss}" on ${e.kind} "${e.id}" is shared with ${all} but carries no parenthetical disambiguator. A learner reading only English cannot tell them apart.`,
      });
    }
  }

  // --- Validate Unique Published Verb Infinitive (V33) ---
  /**
   * V26 یکتایی (lemma, pos) را برای واژه‌ها اجرا می‌کند و V30 همان را برای
   * عبارت‌ها. افعال تا امروز هیچ قاعده‌ای نداشتند — و رجیستری دو جفت تکراری
   * دارد: «a fi» (v-a-fi / v-core-a-fi) و «a avea» (v-a-avea / v-core-a-avea).
   *
   * دامنه عمداً فقط published است، برخلاف V26 که بی‌توجه به وضعیت کار می‌کند.
   * دلیلش این است که در هر جفت، یکی published و دیگری draft است؛ قاعده‌ی
   * بی‌توجه‌به‌وضعیت همین حالا قرمز می‌شود و ما را مجبور می‌کند تصمیم بگیریم
   * کدام نسخه متعارف است — تصمیمی محتوایی که هنوز گرفته نشده.
   *
   * این نسخه دقیقاً همان خطری را می‌بندد که مهم است: انتشار همزمان هر دو.
   * وقتی تصمیم گرفته شد، برداشتن شرط status یک خط است.
   */
  const publishedInfinitives = new Map<string, string>();
  for (const v of verbs) {
    if (v.status !== 'published') continue;
    const inf = v.infinitive?.trim();
    if (!inf) continue;
    const key = inf.toLowerCase();
    const prior = publishedInfinitives.get(key);
    if (prior) {
      errors.push({
        rule: 'V33',
        phraseId: v.id,
        entityId: v.id,
        message: `Duplicate published verb infinitive "${inf}": verb "${v.id}" duplicates verb "${prior}". Archive one of them.`,
      });
    } else {
      publishedInfinitives.set(key, v.id);
    }
  }

  // --- Validate Stored Duration Matches File (V32) ---
  /**
   * V23 و V29 بررسی می‌کنند فایل روی دیسک هست. هیچ‌کدام بررسی نمی‌کنند که
   * durationMs با آن فایل بخواند — و وقتی ۱۲۷ کلیپ برش سکوت خوردند،
   * ۱۴۵ مقدار ذخیره‌شده غلط شد و از هر ۳۱ قاعده رد شد (dre-p172).
   *
   * تلورانس ۱۰۰ms: هم خطای شمارش فریم را می‌پوشاند و هم گردکردن به ۱۰ms را،
   * ولی از یک برش واقعی (کوچک‌ترینشان ۲۹۰ms بود) بسیار کوچک‌تر است.
   */
  const DURATION_TOLERANCE_MS = 100;
  const checkClipDuration = (ownerKind: string, ownerId: string, clip: AudioClip) => {
    const src = clip?.src?.trim();
    if (!src) return;
    const actual = readMp3DurationMs(src);
    if (actual === null) return;   // فایل نیست یا خوانده نشد — کار V23/V29 است
    const stored = clip.durationMs;
    if (typeof stored !== 'number' || !Number.isFinite(stored)) {
      errors.push({
        rule: 'V32',
        phraseId: ownerId,
        entityId: ownerId,
        message: `${ownerKind} "${ownerId}" clip "${src}" has no numeric durationMs (file is ${actual}ms).`,
      });
      return;
    }
    const drift = Math.abs(stored - actual);
    if (drift > DURATION_TOLERANCE_MS) {
      errors.push({
        rule: 'V32',
        phraseId: ownerId,
        entityId: ownerId,
        message: `${ownerKind} "${ownerId}" clip "${src}" stores durationMs ${stored} but the file is ${actual}ms (off by ${drift}ms). Run \`npm run audio:durations\`.`,
      });
    }
  };

  for (const g of graphemes) {
    if (!Array.isArray(g.audio)) continue;
    for (const clip of g.audio) checkClipDuration('Grapheme', g.id || '(missing-id)', clip);
  }
  if (context.coreAudio) {
    for (const [entryId, clips] of Object.entries(context.coreAudio)) {
      if (!Array.isArray(clips)) continue;
      for (const clip of clips) checkClipDuration('Manifest entry', entryId, clip);
    }
  }

  // --- Validate Usage Note Segments (V27, V34, V35) ---
  /**
   * V27 تا dre-p175 هر رشته‌ی لاتین در usageNote.fa را می‌گرفت و می‌پرسید آیا
   * *یک جایی* در رجیستری هست. این کار می‌کرد فقط چون فارسی خط لاتین ندارد —
   * یعنی قاعده به خاصیت تصادفی یکی از ورودی‌هایش تکیه داشت.
   *
   * حالا صورت رومانیایی ارجاع است، نه متن. قاعده زبان‌ناوابسته شد و
   * سخت‌گیرانه‌تر: `bani` دیگر مجاز نیست چون «یک جایی هست»، بلکه فقط وقتی
   * مجاز است که صورتِ همان مدخل ارجاع‌شده باشد.
   */
  const ROMANIAN_DIACRITIC = /[ăâîșțĂÂÎȘȚ]/;

  /** همه‌ی صورت‌هایی که یک مدخل «دارد» — و اجزای سرواژه‌ی چندواژه‌ای‌اش. */
  const formsOfEntry = new Map<string, Set<string>>();
  const headOfEntry = new Map<string, string>();

  const registerEntry = (id: string | undefined, head: string | undefined, forms: (string | undefined)[], allowComponents: boolean) => {
    if (!id) return;
    const set = new Set<string>();
    for (const f of forms) {
      const v = f?.trim();
      if (!v) continue;
      set.add(v.toLowerCase());
      // جزء یک سرواژه‌ی چندواژه‌ای فقط برای واژه و فعل معنا دارد:
      // «sută» جزئی از «o sută» است، ولی «costă» صورتی از جمله‌ی «Cât costă?» نیست.
      if (allowComponents && v.includes(' ')) {
        for (const part of v.split(/\s+/)) if (part.length > 2) set.add(part.toLowerCase());
      }
    }
    formsOfEntry.set(id, set);
    if (head) headOfEntry.set(id, head);
  };

  for (const w of words) {
    registerEntry(w.id, w.lemma, [w.lemma, w.plural, w.definiteForm], true);
  }
  for (const v of verbs) {
    const cells: (string | undefined)[] = [v.infinitive, v.participiu];
    if (v.conjugation?.prezent) cells.push(...Object.values(v.conjugation.prezent));
    if (v.conjugation?.conjunctiv) cells.push(...Object.values(v.conjugation.conjunctiv));
    registerEntry(v.id, v.infinitive, cells, true);
  }
  for (const g of graphemes) {
    registerEntry(g.id, g.grapheme, [g.grapheme, g.exampleForm], false);
  }
  for (const p of phrases) {
    // یک عبارت در یادداشت‌ها به چند شکل نقل می‌شود: با جای‌نگهدار، بدون آن،
    // با یا بدون نقطه‌گذاری پایانی. همه‌ی این‌ها همان عبارت‌اند.
    const ro = p.text?.ro;
    const noPlaceholder = ro?.replace(/\{\{[^}]*\}\}/g, ' ');
    const variants = [ro, noPlaceholder];
    for (const v of [ro, noPlaceholder]) {
      if (!v) continue;
      const tidy = v.replace(/[\u2026]/g, ' ').replace(/\s+/g, ' ').trim();
      variants.push(tidy, tidy.replace(/[.?!:;,]+$/, '').trim());
    }
    registerEntry(p.id, ro, variants, false);
  }

  const statusOfEntry = new Map<string, string | undefined>();
  for (const w of words) if (w.id) statusOfEntry.set(w.id, w.status);
  for (const v of verbs) if (v.id) statusOfEntry.set(v.id, v.status);
  for (const g of graphemes) if (g.id) statusOfEntry.set(g.id, g.status);
  for (const p of phrases) if (p.id) statusOfEntry.set(p.id, p.status);

  const allowedFunctionWords = new Set(FUNCTION_WORD_ALLOWLIST.map(f => f.toLowerCase()));

  const validateNote = (
    kind: string,
    ownerId: string,
    ownerStatus: string | undefined,
    counterExamples: string[] | undefined,
    note: UsageNote | undefined
  ) => {
    if (!note) return;
    const counters = new Set((counterExamples || []).map(c => c.trim().toLowerCase()));
    const refsByLang = new Map<string, string[]>();

    for (const [lang, segments] of Object.entries(note)) {
      if (!Array.isArray(segments)) continue;
      refsByLang.set(lang, usageNoteRefs(segments));

      for (const seg of segments) {
        if ('t' in seg) {
          // V35 — هیچ نشانه‌ی رومانیایی داخل متن ترجمه‌شدنی
          if (ROMANIAN_DIACRITIC.test(seg.t)) {
            errors.push({
              rule: 'V35',
              phraseId: ownerId,
              entityId: ownerId,
              message: `${kind} "${ownerId}" usageNote.${lang} has a translatable text segment containing Romanian diacritics: "${seg.t.trim().slice(0, 60)}". Romanian forms must be {ref} segments, not text.`,
            });
          }
          continue;
        }

        if ('fn' in seg) {
          // V27.4
          if (!allowedFunctionWords.has(seg.fn.trim().toLowerCase())) {
            errors.push({
              rule: 'V27',
              phraseId: ownerId,
              entityId: ownerId,
              message: `${kind} "${ownerId}" usageNote.${lang} uses function word "${seg.fn}", which is not in FUNCTION_WORD_ALLOWLIST.`,
            });
          }
          continue;
        }

        if ('bad' in seg) {
          // V27.3 — یک غلط نقل‌شده باید در counterExamples همان مدخل باشد
          if (seg.ref !== ownerId) {
            errors.push({
              rule: 'V27',
              phraseId: ownerId,
              entityId: ownerId,
              message: `${kind} "${ownerId}" usageNote.${lang} has a {bad} segment whose ref is "${seg.ref}", but a counter-example may only cite its own entry.`,
            });
          } else if (!counters.has(seg.bad.trim().toLowerCase())) {
            errors.push({
              rule: 'V27',
              phraseId: ownerId,
              entityId: ownerId,
              message: `${kind} "${ownerId}" usageNote.${lang} quotes "${seg.bad}" as a mistake, but it is not listed in that entry's counterExamples.`,
            });
          }
          continue;
        }

        // V27.1 — ارجاع باید مدخل موجود باشد
        const forms = formsOfEntry.get(seg.ref);
        if (!forms) {
          errors.push({
            rule: 'V27',
            phraseId: ownerId,
            entityId: ownerId,
            message: `${kind} "${ownerId}" usageNote.${lang} references unknown entry "${seg.ref}".`,
          });
          continue;
        }

        // V27.2 — display باید صورتی از همان مدخل باشد
        const shown = (seg.display ?? headOfEntry.get(seg.ref) ?? '').trim().toLowerCase();
        if (!shown || !forms.has(shown)) {
          errors.push({
            rule: 'V27',
            phraseId: ownerId,
            entityId: ownerId,
            message: `${kind} "${ownerId}" usageNote.${lang} shows "${seg.display ?? headOfEntry.get(seg.ref)}" for entry "${seg.ref}", but that is not a stored form of it.`,
          });
        }

        // V27.5 — یادداشت هرگز به مدخل بایگانی‌شده ارجاع نمی‌دهد
        /**
         * چرا «بایگانی‌شده» و نه «منتشرنشده»: نسخه‌ی اول این شرط، انتشار را
         * می‌خواست و ۱۶ خطا داد — یادداشت‌های منتشرشده‌ای که به افعال هنوز
         * پیش‌نویس (`v-core-a-face` و …) اشاره می‌کنند.
         *
         * آن‌ها خطا نیستند: نمایشگر فقط `display` را چاپ می‌کند و پیوندی
         * نمی‌سازد، پس ارجاع به مدخل پیش‌نویس هیچ چیزی را برای یادگیرنده
         * نمی‌شکند. «بایگانی‌شده» فرق دارد — یعنی عمداً برداشته شده.
         *
         * اگر روزی ارجاع‌ها پیوند شوند، این شرط باید به `published` سخت شود.
         */
        if (statusOfEntry.get(seg.ref) === 'archived') {
          errors.push({
            rule: 'V27',
            phraseId: ownerId,
            entityId: ownerId,
            message: `${kind} "${ownerId}" usageNote.${lang} references "${seg.ref}", which is archived.`,
          });
        }
      }
    }

    // V34 — دست‌کم یک زبان باید همه‌ی ارجاع‌های هر زبان دیگری را داشته باشد
    /**
     * چرا زیرمجموعه و نه برابری: اندازه گرفته شد — فقط ۲۰ از ۹۸ یادداشت
     * دنباله‌ی ارجاع یکسان دارند. یادداشت انگلیسی خلاصه است، نه ترجمه‌ی
     * تحت‌اللفظی. قاعده‌ی برابری ۷۸ یادداشت را مجبور به بازنویسی می‌کرد.
     * زیرمجموعه‌بودن در هر ۹۸ برقرار بود، صفر استثنا.
     */
    if (refsByLang.size > 1) {
      const union = new Set<string>();
      for (const list of refsByLang.values()) for (const r of list) union.add(r);
      const complete = [...refsByLang.entries()].find(([, list]) => {
        const have = new Set(list);
        return [...union].every(r => have.has(r));
      });
      if (!complete) {
        const detail = [...refsByLang.entries()]
          .map(([lang, list]) => `${lang}=[${[...new Set(list)].join(', ')}]`)
          .join(' ');
        errors.push({
          rule: 'V34',
          phraseId: ownerId,
          entityId: ownerId,
          message: `${kind} "${ownerId}" usageNote has no complete language: no single language carries every ref used. ${detail}`,
        });
      }
    }
  };

  for (const w of words) validateNote('Word', w.id || '(missing-id)', w.status, w.counterExamples, w.usageNote);
  for (const v of verbs) validateNote('Verb', v.id || '(missing-id)', v.status, (v as any).counterExamples, v.usageNote);
  for (const g of graphemes) validateNote('Grapheme', g.id || '(missing-id)', g.status, (g as any).counterExamples, (g as any).usageNote);
  for (const p of phrases) validateNote('Phrase', p.id || '(missing-id)', p.status, (p as any).counterExamples, p.usageNote);

  // --- Validate Steps (V36, V37, V38) ---
  /**
   * چرا گام لازم شد: «تا کجای این درس را خوانده‌ای» با فهرست ۵۵تایی اعداد
   * پاسخی نداشت. گام هم موقعیت قابل‌ذخیره می‌دهد، هم بار شناختی را مهار
   * می‌کند، هم واحدی است که فاصله‌گذاری رویش کار می‌کند (dre-p177).
   */
  const MIN_STEP_ITEMS = 2;
  const MAX_STEP_ITEMS = 10;

  for (const domain of domains) {
    const withSteps = (domain.stations || []).filter(st => Array.isArray(st.steps) && st.steps.length > 0);

    // V37 — رایگان‌ها باید پیشوند ترتیب آموزشی باشند
    /**
     * یادگیرنده‌ای که ایستگاه ۱ و ۳ رایگان‌اند و ۲ پولی، به دیوار می‌خورد و
     * برمی‌گردد. مرز پرداخت باید یک برش باشد، نه یک الگوی راه‌راه.
     */
    const ordered = [...(domain.stations || [])].sort((a, b) => a.order - b.order);
    let seenPaid: string | null = null;
    for (const st of ordered) {
      if (st.isFree) {
        if (seenPaid) {
          errors.push({
            rule: 'V37',
            phraseId: st.id,
            entityId: st.id,
            message: `Free station "${st.id}" (order ${st.order}) comes after paid station "${seenPaid}". Free stations must be an unbroken prefix of the teaching order.`,
          });
        }
      } else {
        seenPaid = seenPaid ?? st.id;
      }
    }

    for (const st of withSteps) {
      const stepIds = new Set((st.steps || []).map(sp => sp.id));

      // V38 — اندازه‌ی گام، شمرده از روی داده‌ی واقعی
      const counts = new Map<string, number>();
      for (const sp of st.steps || []) counts.set(sp.id, 0);
      const members = [
        ...words.filter(w => w.stationId === st.id),
        ...phrases.filter(p => p.stationId === st.id),
      ];
      for (const item of members) {
        const sid = (item as { stepId?: string }).stepId;
        // V36 — هر مدخل باید گامی از همین ایستگاه را نام ببرد
        if (!sid) {
          errors.push({
            rule: 'V36',
            phraseId: item.id,
            entityId: item.id,
            message: `Entry "${item.id}" is in station "${st.id}", which defines steps, but names no stepId.`,
          });
          continue;
        }
        if (!stepIds.has(sid)) {
          errors.push({
            rule: 'V36',
            phraseId: item.id,
            entityId: item.id,
            message: `Entry "${item.id}" names stepId "${sid}", which station "${st.id}" does not define.`,
          });
          continue;
        }
        counts.set(sid, (counts.get(sid) || 0) + 1);
      }

      for (const sp of st.steps || []) {
        const n = counts.get(sp.id) || 0;
        if (n < MIN_STEP_ITEMS || n > MAX_STEP_ITEMS) {
          errors.push({
            rule: 'V38',
            phraseId: sp.id,
            entityId: sp.id,
            message: `Step "${sp.id}" in station "${st.id}" holds ${n} item(s); a step must hold between ${MIN_STEP_ITEMS} and ${MAX_STEP_ITEMS}.`,
          });
        }
      }

      // ترتیب گام‌ها باید یکتا و پیوسته باشد
      const orders = (st.steps || []).map(sp => sp.order).sort((a, b) => a - b);
      const expected = orders.map((_, i) => i + 1);
      if (orders.join(',') !== expected.join(',')) {
        errors.push({
          rule: 'V36',
          phraseId: st.id,
          entityId: st.id,
          message: `Station "${st.id}" step orders are [${orders.join(', ')}]; they must be 1..${orders.length} with no gaps or repeats.`,
        });
      }
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
