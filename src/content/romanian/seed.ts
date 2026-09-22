import {
  DomainMeta,
  RomanianWord,
  RomanianVerb,
  RomanianGrapheme,
  RomanianDialogue,
} from '@/lib/romanian/types';

export const SEED_DOMAINS: DomainMeta[] = [
  {
    id: 'core',
    titleFa: 'هسته',
    titleEn: 'Core',
    order: 0,
    estimatedWeeks: 2,
    stationOrder: 'grouped',
    stations: [],
    sourcingPolicy: 'common-usage-ok',
  },
];

export const SEED_WORDS: RomanianWord[] = [
  {
    id: 'w-cont',
    lemma: 'cont',
    pos: 'noun',
    gender: 'n',
    definiteForm: 'contul',
    plural: 'conturi',
    translations: { en: 'account', fa: 'حساب' },
    domains: ['core'],
    intendedUse: 'produce',
    source: { kind: 'common-usage', label: 'DORVIA seed' },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'w-pasaport',
    lemma: 'pașaport',
    pos: 'noun',
    gender: 'n',
    definiteForm: 'pașaportul',
    plural: 'pașapoarte',
    translations: { en: 'passport', fa: 'گذرنامه' },
    domains: ['core'],
    intendedUse: 'produce',
    source: { kind: 'common-usage', label: 'DORVIA seed' },
    reviewer: 'ai-only',
    status: 'published',
  },
];

export const SEED_VERBS: RomanianVerb[] = [
  {
    id: 'v-a-fi',
    infinitive: 'a fi',
    translations: { en: 'to be', fa: 'بودن' },
    domains: ['core'],
    conjugation: {
      prezent: {
        eu: 'sunt',
        tu: 'ești',
        el: 'este',
        noi: 'suntem',
        voi: 'sunteți',
        ei: 'sunt',
      },
      conjunctiv: {
        eu: 'să fiu',
        tu: 'să fii',
        el: 'să fie',
        noi: 'să fim',
        voi: 'să fiți',
        ei: 'să fie',
      },
    },
    participiu: 'fost',
    source: {
      label: 'dexonline — paradigma (DOOM 3)',
      url: 'https://dexonline.ro/definitie/fi/paradigma',
      retrievedAt: '2026-09-22',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
  {
    id: 'v-a-avea',
    infinitive: 'a avea',
    translations: { en: 'to have', fa: 'داشتن' },
    domains: ['core'],
    conjugation: {
      prezent: {
        eu: 'am',
        tu: 'ai',
        el: 'are',
        noi: 'avem',
        voi: 'aveți',
        ei: 'au',
      },
    },
    participiu: 'avut',
    source: {
      label: "dexonline — paradigma (DEX '09)",
      url: 'https://dexonline.ro/definitie/avea/paradigma',
      retrievedAt: '2026-09-22',
    },
    reviewer: 'ai-only',
    status: 'published',
  },
];

export const SEED_GRAPHEMES: RomanianGrapheme[] = [
  {
    id: 'g-s-comma',
    grapheme: 'ș',
    soundHintFa: 'مثل «ش» فارسی',
    exampleWordId: 'w-pasaport',
    order: 1,
    status: 'published',
  },
  {
    id: 'g-t-comma',
    grapheme: 'ț',
    soundHintFa: 'مثل «تس» پشت سر هم',
    exampleWordId: 'w-cont',
    order: 2,
    status: 'published',
  },
];

export const SEED_DIALOGUES: RomanianDialogue[] = [];
