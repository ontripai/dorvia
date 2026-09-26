import { RomanianWord, RomanianGrapheme } from '@/lib/romanian/types';

/**
 * لایه‌ی فونداسیون حروف و صداهای رومانیایی (dre-p154, dre-p158, dre-p160)
 * طراحی و تألیف: Claude (۲۲ سپتامبر ۲۰۲۶)
 * مبنا: dorvia-romanian-foundation-letters-v1-2026-09-22.md
 *
 * تصمیم معماری (بند ۴): لایه‌ی فونداسیون grouped است، نه sequential.
 * واژه‌ی نمونه برای شنیدن صداست، نه رمزگشایی خطی حرف‌به‌حرف.
 * تمامی ورودی‌ها در dre-p160 به همراه صوت‌های تأییدشده منتشر شدند (status: 'published').
 */

export const FOUNDATION_WORDS: RomanianWord[] = [
  {
    "id": "w-apa",
    "lemma": "apă",
    "pos": "noun",
    "gender": "f",
    "definiteForm": "apa",
    "plural": "ape",
    "translations": {
      "en": "water",
      "fa": "آب"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOR)",
      "url": "https://dexonline.ro/definitie/ap%C4%83/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-elev",
    "lemma": "elev",
    "pos": "noun",
    "gender": "m",
    "definiteForm": "elevul",
    "plural": "elevi",
    "translations": {
      "en": "student / pupil",
      "fa": "دانش‌آموز"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/elev/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-bilet",
    "lemma": "bilet",
    "pos": "noun",
    "gender": "n",
    "definiteForm": "biletul",
    "plural": "bilete",
    "translations": {
      "en": "ticket",
      "fa": "بلیت"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/bilet/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-oras",
    "lemma": "oraș",
    "pos": "noun",
    "gender": "n",
    "definiteForm": "orașul",
    "plural": "orașe",
    "translations": {
      "en": "city",
      "fa": "شهر"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/ora%C8%99/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-unde",
    "lemma": "unde",
    "pos": "adv",
    "translations": {
      "en": "where",
      "fa": "کجا"
    },
    "domains": [
      "core"
    ],
    "stationId": "core-question-words",
    "stepId": "qw-1-plain",
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline — definitie (DOOM 3)",
      "url": "https://dexonline.ro/definitie/unde",
      "retrievedAt": "2026-09-24"
    },
    "reviewer": "ai-only",
    "status": "published",
    usageNote: {
      fa: [
        { t: "قالب کلیدی روزمره: «" },
        { ref: "transport-003", display: "Unde este" },
        { t: " …?» به‌معنای «… کجاست؟» (مانند «" },
        { ref: "transport-003", display: "Unde este" },
        { t: " " },
        { ref: "w-gara", display: "gara" },
        { t: "?»)." },
      ],
      en: [
        { t: "Key everyday pattern: \"" },
        { ref: "transport-003", display: "Unde este" },
        { t: " …?\" meaning \"Where is …?\" (e.g. \"" },
        { ref: "transport-003", display: "Unde este" },
        { t: " " },
        { ref: "w-gara", display: "gara" },
        { t: "?\")." },
      ],
    },
  },
  {
    "id": "w-masa",
    "lemma": "masă",
    "pos": "noun",
    "gender": "f",
    "definiteForm": "masa",
    "plural": "mese",
    "translations": {
      "en": "table",
      "fa": "میز"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/mas%C4%83/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-romana",
    "lemma": "română",
    "pos": "noun",
    "gender": "f",
    "definiteForm": "româna",
    "plural": "române",
    "translations": {
      "en": "Romanian language",
      "fa": "زبان رومانیایی"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOR)",
      "url": "https://dexonline.ro/definitie/rom%C3%A2n%C4%83/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-inainte",
    "lemma": "înainte",
    "pos": "adv",
    "translations": {
      "en": "forward / before",
      "fa": "جلو / پیش / قبل"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DEX '09)",
      "url": "https://dexonline.ro/definitie/%C3%AEnainte"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-usa",
    "lemma": "ușă",
    "pos": "noun",
    "gender": "f",
    "definiteForm": "ușa",
    "plural": "uși",
    "translations": {
      "en": "door",
      "fa": "در / درب"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOR)",
      "url": "https://dexonline.ro/definitie/u%C8%99%C4%83/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-multumesc",
    "lemma": "mulțumesc",
    "pos": "expression",
    "translations": {
      "en": "thank you",
      "fa": "متشکرم / ممنون"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DEX '09)",
      "url": "https://dexonline.ro/definitie/mul%C8%9Bumesc"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-card",
    "lemma": "card",
    "pos": "noun",
    "gender": "n",
    "definiteForm": "cardul",
    "plural": "carduri",
    "translations": {
      "en": "card (bank/ID)",
      "fa": "کارت"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/card/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-ceai",
    "lemma": "ceai",
    "pos": "noun",
    "gender": "n",
    "definiteForm": "ceaiul",
    "plural": "ceaiuri",
    "translations": {
      "en": "tea",
      "fa": "چای"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/ceai/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-cheie",
    "lemma": "cheie",
    "pos": "noun",
    "gender": "f",
    "definiteForm": "cheia",
    "plural": "chei",
    "translations": {
      "en": "key",
      "fa": "کلید"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOR)",
      "url": "https://dexonline.ro/definitie/cheie/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-gara",
    "lemma": "gară",
    "pos": "noun",
    "gender": "f",
    "definiteForm": "gara",
    "plural": "gări",
    "translations": {
      "en": "train station",
      "fa": "ایستگاه قطار"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOR)",
      "url": "https://dexonline.ro/definitie/gar%C4%83/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-geam",
    "lemma": "geam",
    "pos": "noun",
    "gender": "n",
    "definiteForm": "geamul",
    "plural": "geamuri",
    "translations": {
      "en": "window pane / glass",
      "fa": "شیشه / پنجره"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/geam/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-ghiseu",
    "lemma": "ghișeu",
    "pos": "noun",
    "gender": "n",
    "definiteForm": "ghișeul",
    "plural": "ghișee",
    "translations": {
      "en": "counter / ticket window",
      "fa": "باجه"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/ghi%C8%99eu/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-ajutor",
    "lemma": "ajutor",
    "pos": "noun",
    "gender": "n",
    "definiteForm": "ajutorul",
    "plural": "ajutoare",
    "translations": {
      "en": "help / assistance",
      "fa": "کمک"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/ajutor/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published",
    usageNote: {
      fa: [
        { t: "در معنای «کمک» خنثی است و جمعش «" },
        { ref: "w-ajutor", display: "ajutoare" },
        { t: "» است. واژه‌ی همنگاشتی هم هست به معنای «دستیار» که اسم مذکر است و جمع دیگری دارد؛ در این درس‌ها فقط معنای «کمک» به کار می‌آید." },
      ],
      en: [
        { t: "Neuter noun meaning \"help\" with plural " },
        { t: "\"" },
        { ref: "w-ajutor", display: "ajutoare" },
        { t: "\"" },
        { t: ". There is also a homograph meaning \"assistant\" which is masculine and has a different plural; only the meaning \"help\" is taught in these lessons." },
      ],
    },
  },
  {
    "id": "w-rece",
    "lemma": "rece",
    "pos": "adj",
    "translations": {
      "en": "cold",
      "fa": "سرد"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DEX '09)",
      "url": "https://dexonline.ro/definitie/rece"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-vama",
    "lemma": "vamă",
    "pos": "noun",
    "gender": "f",
    "definiteForm": "vama",
    "plural": "vămi",
    "translations": {
      "en": "customs",
      "fa": "گمرک"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOR)",
      "url": "https://dexonline.ro/definitie/vam%C4%83/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-harta",
    "lemma": "hartă",
    "pos": "noun",
    "gender": "f",
    "definiteForm": "harta",
    "plural": "hărți",
    "translations": {
      "en": "map",
      "fa": "نقشه"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOR)",
      "url": "https://dexonline.ro/definitie/hart%C4%83/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-casa",
    "lemma": "casă",
    "pos": "noun",
    "gender": "f",
    "definiteForm": "casa",
    "plural": "case",
    "translations": {
      "en": "house / home",
      "fa": "خانه"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOR)",
      "url": "https://dexonline.ro/definitie/cas%C4%83/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-taxi",
    "lemma": "taxi",
    "pos": "noun",
    "gender": "n",
    "definiteForm": "taxiul",
    "plural": "taxiuri",
    "translations": {
      "en": "taxi",
      "fa": "تاکسی"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/taxi/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-ban",
    "lemma": "ban",
    "pos": "noun",
    "gender": "m",
    "definiteForm": "banul",
    "plural": "bani",
    "translations": {
      "en": "money / coin",
      "fa": "پول / سکه"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/ban/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  },
  {
    "id": "w-telefon",
    "lemma": "telefon",
    "pos": "noun",
    "gender": "n",
    "definiteForm": "telefonul",
    "plural": "telefoane",
    "translations": {
      "en": "telephone / phone",
      "fa": "تلفن"
    },
    "domains": [
      "core"
    ],
    "intendedUse": "produce",
    "source": {
      "kind": "common-usage",
      "label": "dexonline (DOOM 3)",
      "url": "https://dexonline.ro/definitie/telefon/paradigma"
    },
    "reviewer": "ai-only",
    "status": "published"
  }
];

export const FOUNDATION_GRAPHEMES: RomanianGrapheme[] = [
  {
    "id": "g-01-a",
    "slug": "a",
    "grapheme": "a",
    "soundHintFa": "مثل «آ» کوتاه در «باد».",
    "exampleWordId": "w-apa",
    "matchPattern": "a",
    "order": 1,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-01-a-aoede.mp3",
        "durationMs": 790
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-01-a-puck.mp3",
        "durationMs": 820
      }
    ]
  },
  {
    "id": "g-02-e",
    "slug": "e",
    "grapheme": "e",
    "soundHintFa": "مثل «اِ» در «بِبَر».",
    "exampleWordId": "w-elev",
    "matchPattern": "e",
    "order": 2,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-02-e-aoede.mp3",
        "durationMs": 1490
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-02-e-puck.mp3",
        "durationMs": 1900
      }
    ]
  },
  {
    "id": "g-03-i",
    "slug": "i",
    "grapheme": "i",
    "soundHintFa": "مثل «ای» در «بید» — ولی بند ۲۳ را هم بخوانید.",
    "exampleWordId": "w-bilet",
    "matchPattern": "i",
    "order": 3,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-03-i-aoede.mp3",
        "durationMs": 1940
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-03-i-puck.mp3",
        "durationMs": 1940
      }
    ]
  },
  {
    "id": "g-04-o",
    "slug": "o",
    "grapheme": "o",
    "soundHintFa": "مثل «اُ» در «پُل».",
    "exampleWordId": "w-oras",
    "matchPattern": "o",
    "order": 4,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-04-o-aoede.mp3",
        "durationMs": 1850
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-04-o-puck.mp3",
        "durationMs": 2230
      }
    ]
  },
  {
    "id": "g-05-u",
    "slug": "u",
    "grapheme": "u",
    "soundHintFa": "مثل «او» در «بود».",
    "exampleWordId": "w-unde",
    "matchPattern": "u",
    "order": 5,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-05-u-aoede.mp3",
        "durationMs": 940
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-05-u-puck.mp3",
        "durationMs": 1010
      }
    ]
  },
  {
    "id": "g-06-a-breve",
    "slug": "a-breve",
    "grapheme": "ă",
    "soundHintFa": "صدای کوتاه و بی‌تأکید، چیزی میان «اَ» و «اِ». در فارسی وجود ندارد — صوت را بشنوید.",
    "exampleWordId": "w-masa",
    "matchPattern": "ă",
    "order": 6,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-06-a-breve-aoede.mp3",
        "durationMs": 1460
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-06-a-breve-puck.mp3",
        "durationMs": 1180
      }
    ]
  },
  {
    "id": "g-07-a-circ-i-circ",
    "slug": "a-circ",
    "grapheme": "â / î",
    "soundHintFa": "یک صدا با دو املا. در فارسی نیست: زبان بالا و عقب، لب‌ها کشیده نیست. اگر «ای» بگویید و زبان را کمی عقب ببرید نزدیک می‌شوید.",
    "exampleWordId": "w-romana",
    "matchPattern": "[âî]",
    "order": 7,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-07-a-circ-i-circ-aoede.mp3",
        "durationMs": 1200
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-07-a-circ-i-circ-puck.mp3",
        "durationMs": 1080
      }
    ]
  },
  {
    "id": "g-08-circ-rule",
    "slug": "circ-rule",
    "grapheme": "قاعده‌ی î و â",
    "soundHintFa": "î در ابتدا و انتهای واژه، â در میانه. همین و بس.",
    "exampleWordId": "w-inainte",
    "matchPattern": "^î|î$|â",
    "order": 8,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-08-circ-rule-aoede.mp3",
        "durationMs": 1420
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-08-circ-rule-puck.mp3",
        "durationMs": 1300
      }
    ]
  },
  {
    "id": "g-09-s-comma",
    "slug": "s-comma",
    "grapheme": "ș",
    "soundHintFa": "دقیقاً «ش» فارسی.",
    "exampleWordId": "w-usa",
    "matchPattern": "ș",
    "order": 9,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-09-s-comma-aoede.mp3",
        "durationMs": 910
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-09-s-comma-puck.mp3",
        "durationMs": 720
      }
    ]
  },
  {
    "id": "g-10-t-comma",
    "slug": "t-comma",
    "grapheme": "ț",
    "soundHintFa": "«ت» و «س» چسبیده به هم، یک صدا نه دو تا.",
    "exampleWordId": "w-multumesc",
    "matchPattern": "ț",
    "order": 10,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-10-t-comma-aoede.mp3",
        "durationMs": 2760
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-10-t-comma-puck.mp3",
        "durationMs": 2040
      }
    ]
  },
  {
    "id": "g-11-c-hard",
    "slug": "c-hard",
    "grapheme": "c + a o u",
    "soundHintFa": "«ک».",
    "exampleWordId": "w-card",
    "matchPattern": "c[aou]",
    "order": 11,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-11-c-hard-aoede.mp3",
        "durationMs": 1080
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-11-c-hard-puck.mp3",
        "durationMs": 1010
      }
    ]
  },
  {
    "id": "g-12-ce-ci",
    "slug": "ce-ci",
    "grapheme": "ce / ci",
    "soundHintFa": "«چ». c پیش از e و i همیشه «چ» می‌شود.",
    "exampleWordId": "w-ceai",
    "matchPattern": "c[ei]",
    "order": 12,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-12-ce-ci-aoede.mp3",
        "durationMs": 770
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-12-ce-ci-puck.mp3",
        "durationMs": 820
      }
    ]
  },
  {
    "id": "g-13-che-chi",
    "slug": "che-chi",
    "grapheme": "che / chi",
    "soundHintFa": "«ک». h تلفظ نمی‌شود؛ کارش این است که c را «ک» نگه دارد.",
    "exampleWordId": "w-cheie",
    "matchPattern": "ch[ei]",
    "order": 13,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-13-che-chi-aoede.mp3",
        "durationMs": 840
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-13-che-chi-puck.mp3",
        "durationMs": 910
      }
    ]
  },
  {
    "id": "g-14-g-hard",
    "slug": "g-hard",
    "grapheme": "g + a o u",
    "soundHintFa": "«گ».",
    "exampleWordId": "w-gara",
    "matchPattern": "g[aou]",
    "order": 14,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-14-g-hard-aoede.mp3",
        "durationMs": 1100
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-14-g-hard-puck.mp3",
        "durationMs": 1010
      }
    ]
  },
  {
    "id": "g-15-ge-gi",
    "slug": "ge-gi",
    "grapheme": "ge / gi",
    "soundHintFa": "«ج».",
    "exampleWordId": "w-geam",
    "matchPattern": "g[ei]",
    "order": 15,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-15-ge-gi-aoede.mp3",
        "durationMs": 980
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-15-ge-gi-puck.mp3",
        "durationMs": 1060
      }
    ]
  },
  {
    "id": "g-16-ghe-ghi",
    "slug": "ghe-ghi",
    "grapheme": "ghe / ghi",
    "soundHintFa": "«گ». h باز هم تلفظ نمی‌شود و نقش نگهبان دارد.",
    "exampleWordId": "w-ghiseu",
    "matchPattern": "gh[ei]",
    "order": 16,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-16-ghe-ghi-aoede.mp3",
        "durationMs": 2500
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-16-ghe-ghi-puck.mp3",
        "durationMs": 2810
      }
    ]
  },
  {
    "id": "g-17-j",
    "slug": "j",
    "grapheme": "j",
    "soundHintFa": "«ژ» — نه «ج». این پرتکرارترین اشتباه انگلیسی‌زبان‌هاست.",
    "exampleWordId": "w-ajutor",
    "matchPattern": "j",
    "order": 17,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-17-j-aoede.mp3",
        "durationMs": 3140
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-17-j-puck.mp3",
        "durationMs": 3070
      }
    ]
  },
  {
    "id": "g-18-r",
    "slug": "r",
    "grapheme": "r",
    "soundHintFa": "غلتان و کوتاه، مثل «ر» فارسی ولی محکم‌تر.",
    "exampleWordId": "w-rece",
    "matchPattern": "r",
    "order": 18,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-18-r-aoede.mp3",
        "durationMs": 860
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-18-r-puck.mp3",
        "durationMs": 1100
      }
    ]
  },
  {
    "id": "g-19-v",
    "slug": "v",
    "grapheme": "v",
    "soundHintFa": "مثل «و» در «وان» — نه مثل «و» در «او».",
    "exampleWordId": "w-vama",
    "matchPattern": "v",
    "order": 19,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-19-v-aoede.mp3",
        "durationMs": 940
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-19-v-puck.mp3",
        "durationMs": 960
      }
    ]
  },
  {
    "id": "g-20-h",
    "slug": "h",
    "grapheme": "h",
    "soundHintFa": "همیشه تلفظ می‌شود، مثل «ه» فارسی. برخلاف فرانسوی و ایتالیایی.",
    "exampleWordId": "w-harta",
    "matchPattern": "h",
    "order": 20,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-20-h-aoede.mp3",
        "durationMs": 1060
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-20-h-puck.mp3",
        "durationMs": 1270
      }
    ]
  },
  {
    "id": "g-21-s",
    "slug": "s",
    "grapheme": "s",
    "soundHintFa": "همیشه «س»، هرگز «ز» — حتی وقتی میان دو مصوت باشد.",
    "exampleWordId": "w-casa",
    "matchPattern": "s",
    "order": 21,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-21-s-aoede.mp3",
        "durationMs": 860
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-21-s-puck.mp3",
        "durationMs": 860
      }
    ]
  },
  {
    "id": "g-22-x",
    "slug": "x",
    "grapheme": "x",
    "soundHintFa": "«کس».",
    "exampleWordId": "w-taxi",
    "matchPattern": "x",
    "order": 22,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-22-x-aoede.mp3",
        "durationMs": 1270
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-22-x-puck.mp3",
        "durationMs": 860
      }
    ]
  },
  {
    "id": "g-23-i-final",
    "slug": "i-final",
    "grapheme": "i پایانی",
    "soundHintFa": "در پایان واژه معمولاً مصوت کامل نیست؛ فقط حرف قبلی را نازک می‌کند. bani «بانی» نیست، «بان» با یک ردّ «ی» است.",
    "exampleWordId": "w-ban",
    "exampleForm": "bani",
    "matchPattern": "i$",
    "order": 23,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-23-i-final-aoede.mp3",
        "durationMs": 910
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-23-i-final-puck.mp3",
        "durationMs": 890
      }
    ]
  },
  {
    "id": "g-24-consonants-basic",
    "slug": "consoane",
    "grapheme": "b d f l m n p t z",
    "soundHintFa": "همان‌طور که انتظار دارید. یک درس مشترک.",
    "exampleWordId": "w-telefon",
    "matchPattern": "[bdflmnptz]",
    "order": 24,
    "status": "published",
    "audio": [
      {
        "voice": "Aoede",
        "src": "/audio/romanian/foundation/g-24-consonants-basic-aoede.mp3",
        "durationMs": 1270
      },
      {
        "voice": "Puck",
        "src": "/audio/romanian/foundation/g-24-consonants-basic-puck.mp3",
        "durationMs": 1250
      }
    ]
  }
];
