import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const familyMembers = [
  {
    "name": "Ana",
    "age": 42,
    "role": {
      "fa": "مادر؛ زن‌عموی شما",
      "en": "Mother; your aunt by marriage"
    }
  },
  {
    "name": "Mihai",
    "age": 45,
    "role": {
      "fa": "پدر؛ عموی شما",
      "en": "Father; your paternal uncle"
    }
  },
  {
    "name": "Elena",
    "age": 21,
    "role": {
      "fa": "دختر بزرگ؛ دانشجو",
      "en": "Older daughter; university student"
    }
  },
  {
    "name": "Andrei",
    "age": 17,
    "role": {
      "fa": "پسر بزرگ؛ دانش‌آموز",
      "en": "Older son; school student"
    }
  },
  {
    "name": "Sofia",
    "age": 11,
    "role": {
      "fa": "دختر کوچک؛ دانش‌آموز",
      "en": "Younger daughter; school student"
    }
  },
  {
    "name": "Luca",
    "age": 7,
    "role": {
      "fa": "پسر کوچک؛ دانش‌آموز",
      "en": "Younger son; school student"
    }
  }
] as const;

export const welcomeHomeLesson = {
  "slug": "bun-venit",
  "title": {
    "fa": "درس ۱: دیدار پسرعمو یا دخترعمو",
    "en": "Lesson 1: A cousin comes to visit"
  },
  "goal": {
    "fa": "با النا سلام و آشنایی کنید. فقط پنج واژهٔ تازه؛ خانواده و اتاق در درس‌های بعدی.",
    "en": "Greet Elena and introduce yourself. Only five new words; family and rooms come in later lessons."
  },
  "dialogue": [
    {
      "ro": "Bună ziua! Eu sunt Elena.",
      "en": "Hello! I am Elena.",
      "fa": "سلام! من النا هستم.",
      "who": "host"
    },
    {
      "ro": "Bună ziua! Sunt vărul tău.",
      "en": "Hello! I am your male cousin.",
      "fa": "سلام! من پسرعموی تو هستم.",
      "who": "you"
    },
    {
      "ro": "Mihai este unchiul tău.",
      "en": "Mihai is your uncle.",
      "fa": "میهای عموی توست.",
      "who": "host"
    },
    {
      "ro": "El este unchiul meu.",
      "en": "He is my uncle.",
      "fa": "او عموی من است.",
      "who": "you"
    },
    {
      "ro": "Ana este mătușa ta.",
      "en": "Ana is your aunt.",
      "fa": "آنا زن‌عموی توست.",
      "who": "host"
    },
    {
      "ro": "Ea este mătușa mea.",
      "en": "She is my aunt.",
      "fa": "او زن‌عموی من است.",
      "who": "you"
    },
    {
      "ro": "Ești aici pentru vizită?",
      "en": "Are you here for a visit?",
      "fa": "برای دیدار اینجا هستی؟",
      "who": "host"
    },
    {
      "ro": "Da, sunt aici pentru vizită.",
      "en": "Yes, I am here for a visit.",
      "fa": "بله، برای دیدار اینجا هستم.",
      "who": "you"
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "پسرعمو یا دخترعمو",
        "en": "Male or female cousin"
      },
      "explanation": {
        "fa": "اگر پسرعمو هستید vărul tău و اگر دخترعمو هستید vara ta بگویید؛ هر دو پذیرفته می‌شوند. văr و vară صورت‌های جنسیتی یک واژهٔ هدف‌اند، نه دو واژهٔ تازه. unchi و mătușă در رومانیایی سمت پدری یا مادری را مشخص نمی‌کنند.",
        "en": "Use vărul tău for a male cousin or vara ta for a female cousin; both are accepted. They count as one vocabulary target. Unchi and mătușă do not distinguish the paternal or maternal side."
      },
      "examples": [
        {
          "ro": "Bună ziua! Sunt vărul tău.",
          "en": "Hello! I am your male cousin.",
          "fa": "سلام! من پسرعموی تو هستم."
        },
        {
          "ro": "Bună ziua! Sunt vara ta.",
          "en": "Hello! I am your female cousin.",
          "fa": "سلام! من دخترعموی تو هستم."
        }
      ]
    },
    {
      "title": {
        "fa": "مرور «بودن»؛ خطاب صمیمی",
        "en": "Review “to be”; familiar address"
      },
      "explanation": {
        "fa": "sunt، ești و este شکل‌های فعل a fi از درس‌های پایه‌اند؛ واژهٔ تازه حساب نمی‌شوند. النا دخترعموی شماست، پس خطاب صمیمیِ tu طبیعی است.",
        "en": "Sunt, ești and este are forms of a fi from the foundations; they do not count as new vocabulary. Elena is your cousin, so familiar tu is natural."
      },
      "examples": [
        {
          "ro": "Ești aici pentru vizită?",
          "en": "Are you here for a visit?",
          "fa": "برای دیدار اینجا هستی؟"
        },
        {
          "ro": "Da, sunt aici pentru vizită.",
          "en": "Yes, I am here for a visit.",
          "fa": "بله، برای دیدار اینجا هستم."
        }
      ]
    }
  ],
  "tasks": [
    {
      "ro": "Bună ziua! Sunt vărul tău.",
      "en": "Hello! I am your male cousin.",
      "fa": "سلام! من پسرعموی تو هستم.",
      "hint": "Bună …",
      "cue": {
        "ro": "Bună ziua! Eu sunt Elena.",
        "en": "Hello! I am Elena.",
        "fa": "سلام! من النا هستم."
      },
      "alternatives": [
        "Bună ziua! Sunt vara ta."
      ]
    },
    {
      "ro": "El este unchiul meu.",
      "en": "He is my uncle.",
      "fa": "او عموی من است.",
      "hint": "El …",
      "cue": {
        "ro": "Mihai este unchiul tău.",
        "en": "Mihai is your uncle.",
        "fa": "میهای عموی توست."
      }
    },
    {
      "ro": "Ea este mătușa mea.",
      "en": "She is my aunt.",
      "fa": "او زن‌عموی من است.",
      "hint": "Ea …",
      "cue": {
        "ro": "Ana este mătușa ta.",
        "en": "Ana is your aunt.",
        "fa": "آنا زن‌عموی توست."
      }
    },
    {
      "ro": "Da, sunt aici pentru vizită.",
      "en": "Yes, I am here for a visit.",
      "fa": "بله، برای دیدار اینجا هستم.",
      "hint": "Da, …",
      "cue": {
        "ro": "Ești aici pentru vizită?",
        "en": "Are you here for a visit?",
        "fa": "برای دیدار اینجا هستی؟"
      }
    }
  ],
  "vocabulary": [
    {
      "ro": "văr",
      "en": "cousin (male; female: vară)",
      "fa": "پسرعمو؛ صورت مؤنث: vară، دخترعمو",
      "example": {
        "ro": "Bună ziua! Sunt vărul tău.",
        "en": "Hello! I am your male cousin.",
        "fa": "سلام! من پسرعموی تو هستم."
      },
      "alternatives": [
        {
          "ro": "Bună ziua! Sunt vara ta.",
          "en": "Hello! I am your female cousin.",
          "fa": "سلام! من دخترعموی تو هستم."
        }
      ]
    },
    {
      "ro": "unchi",
      "en": "uncle",
      "fa": "عمو / دایی؛ در این داستان: عمو",
      "example": {
        "ro": "El este unchiul meu.",
        "en": "He is my uncle.",
        "fa": "او عموی من است."
      }
    },
    {
      "ro": "mătușă",
      "en": "aunt",
      "fa": "عمه / خاله / همسر عمو یا دایی؛ اینجا: زن‌عمو",
      "example": {
        "ro": "Ea este mătușa mea.",
        "en": "She is my aunt.",
        "fa": "او زن‌عموی من است."
      }
    },
    {
      "ro": "aici",
      "en": "here",
      "fa": "اینجا",
      "example": {
        "ro": "Da, sunt aici pentru vizită.",
        "en": "Yes, I am here for a visit.",
        "fa": "بله، برای دیدار اینجا هستم."
      }
    },
    {
      "ro": "vizită",
      "en": "visit",
      "fa": "دیدار",
      "example": {
        "ro": "Da, sunt aici pentru vizită.",
        "en": "Yes, I am here for a visit.",
        "fa": "بله، برای دیدار اینجا هستم."
      }
    }
  ]
} satisfies EverydayScenario;

export const meetFamilyLesson = {
  "slug": "familia",
  "title": {
    "fa": "درس ۲: شناخت خانواده",
    "en": "Lesson 2: Meet the family"
  },
  "goal": {
    "fa": "پنج واژهٔ تازه برای نسبت‌های خانوادگی؛ با آنا صحبت کنید.",
    "en": "Five new family words; talk with Ana."
  },
  "dialogue": [
    {
      "ro": "Aceasta este familia mea.",
      "en": "This is my family.",
      "fa": "این خانوادهٔ من است.",
      "who": "host"
    },
    {
      "ro": "Aceasta este familia ta?",
      "en": "Is this your family?",
      "fa": "این خانوادهٔ توست؟",
      "who": "you"
    },
    {
      "ro": "Da. Eu sunt mama.",
      "en": "Yes. I am the mother.",
      "fa": "بله. من مادر هستم.",
      "who": "host"
    },
    {
      "ro": "Tu ești mama.",
      "en": "You are the mother.",
      "fa": "تو مادر هستی.",
      "who": "you"
    },
    {
      "ro": "Mihai este tatăl.",
      "en": "Mihai is the father.",
      "fa": "میهای پدر است.",
      "who": "host"
    },
    {
      "ro": "El este tatăl.",
      "en": "He is the father.",
      "fa": "او پدر است.",
      "who": "you"
    },
    {
      "ro": "Elena este fiica mea. Andrei este fiul meu.",
      "en": "Elena is my daughter. Andrei is my son.",
      "fa": "النا دختر من است. آندری پسر من است.",
      "who": "host"
    },
    {
      "ro": "Ai o fiică și un fiu.",
      "en": "You have a daughter and a son.",
      "fa": "تو یک دختر و یک پسر داری.",
      "who": "you"
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "عضو خانواده را معرفی کنید",
        "en": "Introduce a family member"
      },
      "explanation": {
        "fa": "برای معرفی از este استفاده کنید؛ فعل تازه نداریم. mama، tatăl، fiica و fiul صورت‌های معرفهٔ همین واژه‌ها هستند.",
        "en": "Use este to introduce someone; there is no new verb. Mama, tatăl, fiica and fiul are definite forms of these same words."
      },
      "examples": [
        {
          "ro": "Da. Eu sunt mama.",
          "en": "Yes. I am the mother.",
          "fa": "بله. من مادر هستم."
        },
        {
          "ro": "Mihai este tatăl.",
          "en": "Mihai is the father.",
          "fa": "میهای پدر است."
        }
      ]
    },
    {
      "title": {
        "fa": "مرور «داشتن»",
        "en": "Review “to have”"
      },
      "explanation": {
        "fa": "Ai یعنی «داری»، شکل آشنای a avea. fiică مؤنث با o و fiu مذکر با un می‌آید. آنا دو دختر و دو پسر دارد؛ این گفت‌وگو فقط النا و آندری را معرفی می‌کند.",
        "en": "Ai means “you have”, a familiar form of a avea. Use o with feminine fiică and un with masculine fiu. Ana has two daughters and two sons; this exchange introduces only Elena and Andrei."
      },
      "examples": [
        {
          "ro": "Ai o fiică și un fiu.",
          "en": "You have a daughter and a son.",
          "fa": "تو یک دختر و یک پسر داری."
        }
      ]
    }
  ],
  "tasks": [
    {
      "ro": "Aceasta este familia ta?",
      "en": "Is this your family?",
      "fa": "این خانوادهٔ توست؟",
      "hint": "Aceasta …",
      "cue": {
        "ro": "Aceasta este familia mea.",
        "en": "This is my family.",
        "fa": "این خانوادهٔ من است."
      }
    },
    {
      "ro": "Tu ești mama.",
      "en": "You are the mother.",
      "fa": "تو مادر هستی.",
      "hint": "Tu …",
      "cue": {
        "ro": "Da. Eu sunt mama.",
        "en": "Yes. I am the mother.",
        "fa": "بله. من مادر هستم."
      }
    },
    {
      "ro": "El este tatăl.",
      "en": "He is the father.",
      "fa": "او پدر است.",
      "hint": "El …",
      "cue": {
        "ro": "Mihai este tatăl.",
        "en": "Mihai is the father.",
        "fa": "میهای پدر است."
      }
    },
    {
      "ro": "Ai o fiică și un fiu.",
      "en": "You have a daughter and a son.",
      "fa": "تو یک دختر و یک پسر داری.",
      "hint": "Ai …",
      "cue": {
        "ro": "Elena este fiica mea. Andrei este fiul meu.",
        "en": "Elena is my daughter. Andrei is my son.",
        "fa": "النا دختر من است. آندری پسر من است."
      }
    }
  ],
  "vocabulary": [
    {
      "ro": "familie",
      "en": "family",
      "fa": "خانواده",
      "example": {
        "ro": "Aceasta este familia mea.",
        "en": "This is my family.",
        "fa": "این خانوادهٔ من است."
      }
    },
    {
      "ro": "mamă",
      "en": "mother",
      "fa": "مادر",
      "example": {
        "ro": "Tu ești mama.",
        "en": "You are the mother.",
        "fa": "تو مادر هستی."
      }
    },
    {
      "ro": "tată",
      "en": "father",
      "fa": "پدر",
      "example": {
        "ro": "El este tatăl.",
        "en": "He is the father.",
        "fa": "او پدر است."
      }
    },
    {
      "ro": "fiică",
      "en": "daughter",
      "fa": "دخترِ کسی",
      "example": {
        "ro": "Elena este fiica mea. Andrei este fiul meu.",
        "en": "Elena is my daughter. Andrei is my son.",
        "fa": "النا دختر من است. آندری پسر من است."
      }
    },
    {
      "ro": "fiu",
      "en": "son",
      "fa": "پسرِ کسی",
      "example": {
        "ro": "Ai o fiică și un fiu.",
        "en": "You have a daughter and a son.",
        "fa": "تو یک دختر و یک پسر داری."
      }
    }
  ]
} satisfies EverydayScenario;

export const homeRoomLesson = {
  "slug": "camera",
  "title": {
    "fa": "درس ۳: خانه و اتاق شما",
    "en": "Lesson 3: Your house and room"
  },
  "goal": {
    "fa": "پنج واژهٔ تازه برای خانه، اتاق و آب؛ سپس می‌توانید به فروشگاه بروید.",
    "en": "Five new words for the house, room and water; then you can go to the shop."
  },
  "dialogue": [
    {
      "ro": "Aceasta este casa noastră.",
      "en": "This is our house.",
      "fa": "این خانهٔ ماست.",
      "who": "host"
    },
    {
      "ro": "Ai o casă frumoasă.",
      "en": "You have a beautiful house.",
      "fa": "تو خانهٔ زیبایی داری.",
      "who": "you"
    },
    {
      "ro": "Aceasta este camera ta.",
      "en": "This is your room.",
      "fa": "این اتاق توست.",
      "who": "host"
    },
    {
      "ro": "Aceasta este camera mea?",
      "en": "Is this my room?",
      "fa": "این اتاق من است؟",
      "who": "you"
    },
    {
      "ro": "Da. Ai o cameră mare.",
      "en": "Yes. You have a large room.",
      "fa": "بله. تو اتاق بزرگی داری.",
      "who": "host"
    },
    {
      "ro": "Am o cameră mare.",
      "en": "I have a large room.",
      "fa": "من اتاق بزرگی دارم.",
      "who": "you"
    },
    {
      "ro": "Ai apă aici.",
      "en": "You have water here.",
      "fa": "اینجا آب داری.",
      "who": "host"
    },
    {
      "ro": "Mulțumesc. Am apă.",
      "en": "Thank you. I have water.",
      "fa": "ممنون. آب دارم.",
      "who": "you"
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "خانهٔ زیبا، اتاق بزرگ",
        "en": "A beautiful house, a large room"
      },
      "explanation": {
        "fa": "frumoasă صورت مؤنث frumos است؛ یک واژهٔ هدف حساب می‌شود. mare برای این اسم‌ها تغییر نمی‌کند. صفت در این مثال‌ها بعد از اسم می‌آید.",
        "en": "Frumoasă is the feminine form of frumos; they count as one target. Mare stays the same for these nouns. In these examples the adjective follows the noun."
      },
      "examples": [
        {
          "ro": "Ai o casă frumoasă.",
          "en": "You have a beautiful house.",
          "fa": "تو خانهٔ زیبایی داری."
        },
        {
          "ro": "Am o cameră mare.",
          "en": "I have a large room.",
          "fa": "من اتاق بزرگی دارم."
        }
      ]
    },
    {
      "title": {
        "fa": "پرسش با همان جمله",
        "en": "Ask using the same sentence"
      },
      "explanation": {
        "fa": "camera mea یعنی اتاق من. با لحن پرسشی و علامت سؤال، جمله به پرسش تبدیل می‌شود. am و ai مرور a avea هستند. واژهٔ aici را از درس اول دوباره می‌بینید.",
        "en": "Camera mea means my room. Question intonation and a question mark turn the sentence into a question. Am and ai review a avea. Aici repeats the word from lesson one."
      },
      "examples": [
        {
          "ro": "Aceasta este camera ta.",
          "en": "This is your room.",
          "fa": "این اتاق توست."
        },
        {
          "ro": "Aceasta este camera mea?",
          "en": "Is this my room?",
          "fa": "این اتاق من است؟"
        }
      ]
    }
  ],
  "tasks": [
    {
      "ro": "Ai o casă frumoasă.",
      "en": "You have a beautiful house.",
      "fa": "تو خانهٔ زیبایی داری.",
      "hint": "Ai …",
      "cue": {
        "ro": "Aceasta este casa noastră.",
        "en": "This is our house.",
        "fa": "این خانهٔ ماست."
      }
    },
    {
      "ro": "Aceasta este camera mea?",
      "en": "Is this my room?",
      "fa": "این اتاق من است؟",
      "hint": "Aceasta …",
      "cue": {
        "ro": "Aceasta este camera ta.",
        "en": "This is your room.",
        "fa": "این اتاق توست."
      }
    },
    {
      "ro": "Am o cameră mare.",
      "en": "I have a large room.",
      "fa": "من اتاق بزرگی دارم.",
      "hint": "Am …",
      "cue": {
        "ro": "Da. Ai o cameră mare.",
        "en": "Yes. You have a large room.",
        "fa": "بله. تو اتاق بزرگی داری."
      }
    },
    {
      "ro": "Mulțumesc. Am apă.",
      "en": "Thank you. I have water.",
      "fa": "ممنون. آب دارم.",
      "hint": "Mulțumesc. …",
      "cue": {
        "ro": "Ai apă aici.",
        "en": "You have water here.",
        "fa": "اینجا آب داری."
      }
    }
  ],
  "vocabulary": [
    {
      "ro": "casă",
      "en": "house",
      "fa": "خانه",
      "example": {
        "ro": "Ai o casă frumoasă.",
        "en": "You have a beautiful house.",
        "fa": "تو خانهٔ زیبایی داری."
      }
    },
    {
      "ro": "cameră",
      "en": "room",
      "fa": "اتاق",
      "example": {
        "ro": "Aceasta este camera mea?",
        "en": "Is this my room?",
        "fa": "این اتاق من است؟"
      }
    },
    {
      "ro": "mare",
      "en": "large",
      "fa": "بزرگ",
      "example": {
        "ro": "Am o cameră mare.",
        "en": "I have a large room.",
        "fa": "من اتاق بزرگی دارم."
      }
    },
    {
      "ro": "frumos",
      "en": "beautiful",
      "fa": "زیبا؛ صورت مؤنث: frumoasă",
      "example": {
        "ro": "Ai o casă frumoasă.",
        "en": "You have a beautiful house.",
        "fa": "تو خانهٔ زیبایی داری."
      }
    },
    {
      "ro": "apă",
      "en": "water",
      "fa": "آب",
      "example": {
        "ro": "Mulțumesc. Am apă.",
        "en": "Thank you. I have water.",
        "fa": "ممنون. آب دارم."
      }
    }
  ]
} satisfies EverydayScenario;

export const homeStoryLessons: (EverydayScenario & { vocabulary: NonNullable<EverydayScenario['vocabulary']> })[] = [welcomeHomeLesson, meetFamilyLesson, homeRoomLesson];

export const homeReturnDialogue = [
  { who: 'host', ro: 'Ce ai în pungă?', en: 'What do you have in the bag?', fa: 'داخل کیسه چه داری؟' },
  { who: 'you', ro: 'Am o sticlă de apă.', en: 'I have a bottle of water.', fa: 'یک بطری آب دارم.' },
  { who: 'host', ro: 'Cât costă?', en: 'How much does it cost?', fa: 'قیمتش چقدر است؟' },
  { who: 'you', ro: 'Costă cinci lei.', en: 'It costs five lei.', fa: 'قیمتش پنج لِی است.' },
  { who: 'host', ro: 'Mulțumesc. Acum avem apă acasă.', en: 'Thank you. Now we have water at home.', fa: 'ممنون. حالا در خانه آب داریم.' },
] as const;

export const homeVerbTimes = [
  { tense: { fa: 'گذشته · دیروز', en: 'Past · yesterday' }, ro: 'Ieri am avut o sticlă de apă.', en: 'Yesterday I had a bottle of water.', fa: 'دیروز یک بطری آب داشتم.', form: 'am avut', hint: { fa: 'am + avut؛ در این جمله، am بخش کمکیِ گذشته است.', en: 'am + avut; here am is the auxiliary for the compound past.' } },
  { tense: { fa: 'حال · اکنون', en: 'Present · now' }, ro: 'Acum am o sticlă de apă.', en: 'Now I have a bottle of water.', fa: 'اکنون یک بطری آب دارم.', form: 'am', hint: { fa: 'am؛ شکل حالِ a avea برای «من».', en: 'am; the present form of a avea for “I”.' } },
  { tense: { fa: 'آینده · فردا', en: 'Future · tomorrow' }, ro: 'Mâine voi avea o sticlă de apă.', en: 'Tomorrow I will have a bottle of water.', fa: 'فردا یک بطری آب خواهم داشت.', form: 'voi avea', hint: { fa: 'voi + avea؛ یکی از شکل‌های استاندارد آینده برای «من».', en: 'voi + avea; one standard future form for “I”.' } },
] as const;
