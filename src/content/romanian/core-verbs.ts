import { RomanianVerb } from '@/lib/romanian/types';

/**
 * دوازده فعل هسته‌ی رومانیایی (dre-p157)
 * واکشی‌شده قطعی از dexonline بدون مدل زبانی
 *
 * لایه‌ی الف — پایه‌ای:
 *   a fi · a avea · a putea · a vrea · a trebui · a ști
 *
 * `a fi` و `a avea` **در این فایل نیستند** (dre-p187). هر دو از قبل در
 * `seed.ts` با شناسه‌های `v-a-fi` و `v-a-avea` منتشر شده بودند و صیغه‌هایشان
 * با نسخه‌ی واکشی‌شده‌ی این‌جا **بیت‌به‌بیت یکسان** بود؛ تنها تفاوت برچسب منبع
 * بود که در نسخه‌ی seed تمیزتر است (DOOM 3 / DEX '09). پس دو مدخل تکراری
 * حذف شدند و V33 از این پس بی‌توجه به وضعیت کار می‌کند تا دوباره ساخته نشوند.
 *
 * لایه‌ی ب — تعامل روزمره:
 *   a înțelege · a vorbi · a merge · a veni · a face · a ajuta
 *
 * تمامی افعال با status: 'draft' و صیغه‌های conjunctiv بدون 'să' ذخیره شده‌اند.
 */

export const CORE_VERBS: RomanianVerb[] = [
  {
    "id": "v-core-a-putea",
    "infinitive": "a putea",
    "translations": {
      "en": "to be able to / can",
      "fa": "توانستن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "pot",
        "tu": "poți",
        "el": "poate",
        "noi": "putem",
        "voi": "puteți",
        "ei": "pot"
      },
      "conjunctiv": {
        "eu": "pot",
        "tu": "poți",
        "el": "poată",
        "noi": "putem",
        "voi": "puteți",
        "ei": "poată"
      }
    },
    "participiu": "putut",
    "source": {
      "label": "dexonline — paradigma (verb (V511)     Surse flexiune)",
      "url": "https://dexonline.ro/definitie/putea/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-vrea",
    "infinitive": "a vrea",
    "translations": {
      "en": "to want",
      "fa": "خواستن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "vreau",
        "tu": "vrei",
        "el": "vrea",
        "noi": "vrem",
        "voi": "vreți",
        "ei": "vor"
      },
      "conjunctiv": {
        "eu": "vreau",
        "tu": "vrei",
        "el": "vrea",
        "noi": "vrem",
        "voi": "vreți",
        "ei": "vrea"
      }
    },
    "participiu": "vrut",
    "source": {
      "label": "dexonline — paradigma (verb (VT517)     Surse flexiun)",
      "url": "https://dexonline.ro/definitie/vrea/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-trebui",
    "infinitive": "a trebui",
    "translations": {
      "en": "to need / must",
      "fa": "باید / لازم بودن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "",
        "tu": "",
        "el": "trebuie",
        "noi": "",
        "voi": "",
        "ei": "trebuie"
      },
      "conjunctiv": {
        "eu": "",
        "tu": "",
        "el": "trebuie",
        "noi": "",
        "voi": "",
        "ei": "trebuie"
      }
    },
    "participiu": "trebuit",
    "source": {
      "label": "dexonline — paradigma (verb (V343)     Surse flexiune)",
      "url": "https://dexonline.ro/definitie/trebui/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft",
    "defective": {
      "reason": "Verb unipersonal / defectiv de persoana I și a II-a; se folosește doar la persoana a III-a.",
      "source": "DOOM 3 (V343) / dexonline"
    },
    usageNote: {
      fa: [
        { t: "در زبان رومانیایی امروز، فعل " },
        { ref: "v-core-a-trebui", display: "a trebui" },
        { t: " به‌صورت بی‌شخص به کار می‌رود و فقط صورت " },
        { ref: "v-core-a-trebui", display: "trebuie" },
        { t: " برای همه‌ی اشخاص استفاده می‌شود؛ سایر صیغه‌ها در تولید گفتار معیار کاربرد ندارند." },
      ],
      en: [
        { t: "In contemporary Romanian, " },
        { t: "\"" },
        { ref: "v-core-a-trebui", display: "a trebui" },
        { t: "\"" },
        { t: " is used impersonally; only the form " },
        { t: "\"" },
        { ref: "v-core-a-trebui", display: "trebuie" },
        { t: "\"" },
        { t: " is used across all persons, and personal forms are not used in standard production." },
      ],
    },
  },
  {
    "id": "v-core-a-sti",
    "infinitive": "a ști",
    "translations": {
      "en": "to know",
      "fa": "دانستن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "știu",
        "tu": "știi",
        "el": "știe",
        "noi": "știm",
        "voi": "știți",
        "ei": "știu"
      },
      "conjunctiv": {
        "eu": "știu",
        "tu": "știi",
        "el": "știe",
        "noi": "știm",
        "voi": "știți",
        "ei": "știe"
      }
    },
    "participiu": "știut",
    "source": {
      "label": "dexonline — paradigma (verb (VT340)     Surse flexiun)",
      "url": "https://dexonline.ro/definitie/%C8%99ti/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-intelege",
    "infinitive": "a înțelege",
    "translations": {
      "en": "to understand",
      "fa": "فهمیدن / درک کردن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "înțeleg",
        "tu": "înțelegi",
        "el": "înțelege",
        "noi": "înțelegem",
        "voi": "înțelegeți",
        "ei": "înțeleg"
      },
      "conjunctiv": {
        "eu": "înțeleg",
        "tu": "înțelegi",
        "el": "înțeleagă",
        "noi": "înțelegem",
        "voi": "înțelegeți",
        "ei": "înțeleagă"
      }
    },
    "participiu": "înțeles",
    "source": {
      "label": "dexonline — paradigma (verb (VT652)     Surse flexiun)",
      "url": "https://dexonline.ro/definitie/%C3%AEn%C8%9Belege/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-vorbi",
    "infinitive": "a vorbi",
    "translations": {
      "en": "to speak / talk",
      "fa": "صحبت کردن / حرف زدن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "vorbesc",
        "tu": "vorbești",
        "el": "vorbește",
        "noi": "vorbim",
        "voi": "vorbiți",
        "ei": "vorbesc"
      },
      "conjunctiv": {
        "eu": "vorbesc",
        "tu": "vorbești",
        "el": "vorbească",
        "noi": "vorbim",
        "voi": "vorbiți",
        "ei": "vorbească"
      }
    },
    "participiu": "vorbit",
    "source": {
      "label": "dexonline — paradigma (verb (VT401)     Surse flexiun)",
      "url": "https://dexonline.ro/definitie/vorbi/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-merge",
    "infinitive": "a merge",
    "translations": {
      "en": "to go / walk",
      "fa": "رفتن / راه رفتن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "merg",
        "tu": "mergi",
        "el": "merge",
        "noi": "mergem",
        "voi": "mergeți",
        "ei": "merg"
      },
      "conjunctiv": {
        "eu": "merg",
        "tu": "mergi",
        "el": "meargă",
        "noi": "mergem",
        "voi": "mergeți",
        "ei": "meargă"
      }
    },
    "participiu": "mers",
    "source": {
      "label": "dexonline — paradigma (verb (V653)     Surse flexiune)",
      "url": "https://dexonline.ro/definitie/merge/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-veni",
    "infinitive": "a veni",
    "translations": {
      "en": "to come",
      "fa": "آمدن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "vin",
        "tu": "vii",
        "el": "vine",
        "noi": "venim",
        "voi": "veniți",
        "ei": "vin"
      },
      "conjunctiv": {
        "eu": "vin",
        "tu": "vii",
        "el": "vină",
        "noi": "venim",
        "voi": "veniți",
        "ei": "vină"
      }
    },
    "participiu": "venit",
    "source": {
      "label": "dexonline — paradigma (verb (V323)     Surse flexiune)",
      "url": "https://dexonline.ro/definitie/veni/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-face",
    "infinitive": "a face",
    "translations": {
      "en": "to do / make",
      "fa": "انجام دادن / ساختن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "fac",
        "tu": "faci",
        "el": "face",
        "noi": "facem",
        "voi": "faceți",
        "ei": "fac"
      },
      "conjunctiv": {
        "eu": "fac",
        "tu": "faci",
        "el": "facă",
        "noi": "facem",
        "voi": "faceți",
        "ei": "facă"
      }
    },
    "participiu": "făcut",
    "source": {
      "label": "dexonline — paradigma (verb (VT613)     Surse flexiun)",
      "url": "https://dexonline.ro/definitie/face/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-ajuta",
    "infinitive": "a ajuta",
    "translations": {
      "en": "to help",
      "fa": "کمک کردن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "ajut",
        "tu": "ajuți",
        "el": "ajută",
        "noi": "ajutăm",
        "voi": "ajutați",
        "ei": "ajută"
      },
      "conjunctiv": {
        "eu": "ajut",
        "tu": "ajuți",
        "el": "ajute",
        "noi": "ajutăm",
        "voi": "ajutați",
        "ei": "ajute"
      }
    },
    "participiu": "ajutat",
    "source": {
      "label": "dexonline — paradigma (verb (VT3)     Surse flexiune:)",
      "url": "https://dexonline.ro/definitie/ajuta/paradigma",
      "retrievedAt": "2026-09-23"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-multumi",
    "infinitive": "a mulțumi",
    "translations": {
      "en": "to thank",
      "fa": "تشکر کردن / سپاسگزاری کردن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "mulțumesc",
        "tu": "mulțumești",
        "el": "mulțumește",
        "noi": "mulțumim",
        "voi": "mulțumiți",
        "ei": "mulțumesc"
      },
      "conjunctiv": {
        "eu": "mulțumesc",
        "tu": "mulțumești",
        "el": "mulțumească",
        "noi": "mulțumim",
        "voi": "mulțumiți",
        "ei": "mulțumească"
      }
    },
    "participiu": "mulțumit",
    "source": {
      "label": "dexonline — paradigma",
      "url": "https://dexonline.ro/definitie/mulțumi/paradigma",
      "retrievedAt": "2026-09-25"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-ruga",
    "infinitive": "a ruga",
    "translations": {
      "en": "to ask / to beg",
      "fa": "خواهش کردن / تقاضا کردن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "rog",
        "tu": "rogi",
        "el": "roagă",
        "noi": "rugăm",
        "voi": "rugați",
        "ei": "roagă"
      },
      "conjunctiv": {
        "eu": "rog",
        "tu": "rogi",
        "el": "roage",
        "noi": "rugăm",
        "voi": "rugați",
        "ei": "roage"
      }
    },
    "participiu": "rugat",
    "source": {
      "label": "dexonline — paradigma",
      "url": "https://dexonline.ro/definitie/ruga/paradigma",
      "retrievedAt": "2026-09-25"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-numi",
    "infinitive": "a numi",
    "translations": {
      "en": "to name / to call",
      "fa": "نامیدن / صدا کردن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "numesc",
        "tu": "numești",
        "el": "numește",
        "noi": "numim",
        "voi": "numiți",
        "ei": "numesc"
      },
      "conjunctiv": {
        "eu": "numesc",
        "tu": "numești",
        "el": "numească",
        "noi": "numim",
        "voi": "numiți",
        "ei": "numească"
      }
    },
    "participiu": "numit",
    "source": {
      "label": "dexonline — paradigma",
      "url": "https://dexonline.ro/definitie/numi/paradigma",
      "retrievedAt": "2026-09-25"
    },
    "reviewer": "ai-only",
    "status": "draft"
  },
  {
    "id": "v-core-a-parea",
    "infinitive": "a părea",
    "translations": {
      "en": "to seem / to appear",
      "fa": "به نظر رسیدن"
    },
    "domains": [
      "core"
    ],
    "conjugation": {
      "prezent": {
        "eu": "par",
        "tu": "pari",
        "el": "pare",
        "noi": "părem",
        "voi": "păreți",
        "ei": "par"
      },
      "conjunctiv": {
        "eu": "par",
        "tu": "pari",
        "el": "pară",
        "noi": "părem",
        "voi": "păreți",
        "ei": "pară"
      }
    },
    "participiu": "părut",
    "source": {
      "label": "dexonline — paradigma",
      "url": "https://dexonline.ro/definitie/părea/paradigma",
      "retrievedAt": "2026-09-25"
    },
    "reviewer": "ai-only",
    "status": "draft"
  }
];
