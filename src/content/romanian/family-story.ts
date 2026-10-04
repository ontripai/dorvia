import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const familyMembers = [
  {
    "name": "Ana",
    "age": 42,
    "role": {
      "fa": "مادر؛ میزبان شما در این قسمت",
      "en": "Mother; your host in this episode"
    }
  },
  {
    "name": "Mihai",
    "age": 45,
    "role": {
      "fa": "پدر",
      "en": "Father"
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
    "fa": "قسمت ۱: مهمان خانهٔ خانوادهٔ پوپسکو",
    "en": "Episode 1: A guest at the Popescu home"
  },
  "goal": {
    "fa": "شما مهمان خانواده هستید: پاسخ خوش‌آمدگویی بدهید، دربارهٔ خانواده و خانه صحبت کنید و اتاق خود را بشناسید.",
    "en": "You are the family’s guest: answer the welcome, talk about the family and house, and recognise your room."
  },
  "dialogue": [
    {
      "ro": "Bună ziua! Sunteți aici pentru vizită?",
      "en": "Hello! Are you here for a visit?",
      "fa": "سلام! برای دیدار آمده‌اید؟",
      "who": "host"
    },
    {
      "ro": "Da, sunt musafirul vostru.",
      "en": "Yes, I am your guest.",
      "fa": "بله، من مهمان شما هستم.",
      "who": "you"
    },
    {
      "ro": "Aveți un prieten aici?",
      "en": "Do you have a friend here?",
      "fa": "اینجا دوستی دارید؟",
      "who": "host"
    },
    {
      "ro": "Da, am un prieten aici.",
      "en": "Yes, I have a friend here.",
      "fa": "بله، اینجا یک دوست دارم.",
      "who": "you"
    },
    {
      "ro": "Eu sunt Ana. Aceasta este familia mea.",
      "en": "I am Ana. This is my family.",
      "fa": "من آنا هستم. این خانوادهٔ من است.",
      "who": "host"
    },
    {
      "ro": "Aveți o familie mare.",
      "en": "You have a large family.",
      "fa": "شما خانوادهٔ بزرگی دارید.",
      "who": "you"
    },
    {
      "ro": "Da, suntem șase. Aceasta este casa noastră.",
      "en": "Yes, there are six of us. This is our house.",
      "fa": "بله، ما شش نفر هستیم. این خانهٔ ماست.",
      "who": "host"
    },
    {
      "ro": "Aveți o casă frumoasă.",
      "en": "You have a beautiful house.",
      "fa": "شما خانهٔ زیبایی دارید.",
      "who": "you"
    },
    {
      "ro": "Mulțumesc. Aceasta este camera pentru musafiri.",
      "en": "Thank you. This is the guest room.",
      "fa": "ممنون. این اتاق مهمان است.",
      "who": "host"
    },
    {
      "ro": "Aceasta este camera mea?",
      "en": "Is this my room?",
      "fa": "این اتاق من است؟",
      "who": "you"
    },
    {
      "ro": "Da. Aveți apă aici.",
      "en": "Yes. You have water here.",
      "fa": "بله. اینجا آب دارید.",
      "who": "host"
    },
    {
      "ro": "Mulțumesc. Aceasta este camera mea.",
      "en": "Thank you. This is my room.",
      "fa": "ممنون. این اتاق من است.",
      "who": "you"
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "خودتان را معرفی کنید: sunt",
        "en": "Introduce yourself: sunt"
      },
      "explanation": {
        "fa": "Sunt یعنی «هستم». musafirul vostru برای مهمان مرد و musafira voastră برای مهمان زن است؛ هر دو پاسخ پذیرفته می‌شوند. در نوبت مهمان، خودتان پاسخ بدهید.",
        "en": "Sunt means “I am”. Use musafirul vostru for a male guest or musafira voastră for a female guest; both are accepted. Answer during the guest’s turn."
      },
      "examples": [
        {
          "ro": "Da, sunt musafirul vostru.",
          "en": "Yes, I am your guest.",
          "fa": "بله، من مهمان شما هستم."
        },
        {
          "ro": "Da, sunt musafira voastră.",
          "en": "Yes, I am your guest.",
          "fa": "بله، من مهمان شما هستم."
        }
      ]
    },
    {
      "title": {
        "fa": "داشتن: am و aveți",
        "en": "Having: am and aveți"
      },
      "explanation": {
        "fa": "Am یعنی «دارم». Aveți یعنی «دارید» و برای خطاب مؤدبانه یا چند نفر به کار می‌رود. اسم مؤنث مفرد مانند familie، casă و cameră با o می‌آید؛ prieten در این مثال با un می‌آید.",
        "en": "Am means “I have”. Aveți means “you have”, for polite address or several people. Feminine singular nouns such as familie, casă and cameră take o; prieten takes un here."
      },
      "examples": [
        {
          "ro": "Da, am un prieten aici.",
          "en": "Yes, I have a friend here.",
          "fa": "بله، اینجا یک دوست دارم."
        },
        {
          "ro": "Aveți o familie mare.",
          "en": "You have a large family.",
          "fa": "شما خانوادهٔ بزرگی دارید."
        },
        {
          "ro": "Aveți o casă frumoasă.",
          "en": "You have a beautiful house.",
          "fa": "شما خانهٔ زیبایی دارید."
        }
      ]
    },
    {
      "title": {
        "fa": "این چیست؟ aceasta este",
        "en": "What is this? aceasta este"
      },
      "explanation": {
        "fa": "Acesta/aceasta به جنس اسم وابسته است؛ اینجا camera مؤنث است، پس aceasta este می‌گوییم. Camera mea یعنی «اتاق من». یک پرسش و پاسخ می‌توانند همان واژه‌ها را داشته باشند، اما لحن و نشانه‌گذاری متفاوت دارند.",
        "en": "Acesta/aceasta agrees with the noun; camera is feminine, so use aceasta este. Camera mea means “my room”. A question and a statement can use the same words with different intonation and punctuation."
      },
      "examples": [
        {
          "ro": "Aceasta este camera mea?",
          "en": "Is this my room?",
          "fa": "این اتاق من است؟"
        },
        {
          "ro": "Mulțumesc. Aceasta este camera mea.",
          "en": "Thank you. This is my room.",
          "fa": "ممنون. این اتاق من است."
        }
      ]
    },
    {
      "title": {
        "fa": "رسمی و صمیمی: aveți و ai",
        "en": "Polite and familiar: aveți and ai"
      },
      "explanation": {
        "fa": "در نخستین دیدار، برای یک بزرگسال ناآشنا از aveți استفاده می‌کنیم. میان دوستان و در خانواده، پس از توافق یا آشنایی، ai رایج است. برای خطاب به چند نفر نیز aveți به کار می‌رود. مؤدبانه بودن فقط به فعل وابسته نیست؛ لحن و لطفاً هم مهم‌اند.",
        "en": "Use aveți when politely addressing an unfamiliar adult. Among friends and family, ai is common once familiar address is welcome. Aveți also addresses several people. Politeness also depends on tone and words such as please."
      },
      "examples": [
        {
          "ro": "Aveți apă?",
          "en": "Do you have water? (polite or plural)",
          "fa": "آب دارید؟ (مؤدبانه یا خطاب به چند نفر)"
        },
        {
          "ro": "Ai apă?",
          "en": "Do you have water? (familiar singular)",
          "fa": "آب داری؟ (صمیمی، خطاب به یک نفر)"
        }
      ]
    }
  ],
  "tasks": [
    {
      "ro": "Da, sunt musafirul vostru.",
      "en": "Yes, I am your guest.",
      "fa": "بله، من مهمان شما هستم.",
      "hint": "Da, …",
      "cue": {
        "ro": "Bună ziua! Sunteți aici pentru vizită?",
        "en": "Hello! Are you here for a visit?",
        "fa": "سلام! برای دیدار آمده‌اید؟"
      },
      "alternatives": [
        "Da, sunt musafira voastră."
      ]
    },
    {
      "ro": "Da, am un prieten aici.",
      "en": "Yes, I have a friend here.",
      "fa": "بله، اینجا یک دوست دارم.",
      "hint": "Da, …",
      "cue": {
        "ro": "Aveți un prieten aici?",
        "en": "Do you have a friend here?",
        "fa": "اینجا دوستی دارید؟"
      }
    },
    {
      "ro": "Aveți o familie mare.",
      "en": "You have a large family.",
      "fa": "شما خانوادهٔ بزرگی دارید.",
      "hint": "Aveți …",
      "cue": {
        "ro": "Eu sunt Ana. Aceasta este familia mea.",
        "en": "I am Ana. This is my family.",
        "fa": "من آنا هستم. این خانوادهٔ من است."
      }
    },
    {
      "ro": "Aveți o casă frumoasă.",
      "en": "You have a beautiful house.",
      "fa": "شما خانهٔ زیبایی دارید.",
      "hint": "Aveți …",
      "cue": {
        "ro": "Da, suntem șase. Aceasta este casa noastră.",
        "en": "Yes, there are six of us. This is our house.",
        "fa": "بله، ما شش نفر هستیم. این خانهٔ ماست."
      }
    },
    {
      "ro": "Mulțumesc. Aceasta este camera mea.",
      "en": "Thank you. This is my room.",
      "fa": "ممنون. این اتاق من است.",
      "hint": "Mulțumesc. …",
      "cue": {
        "ro": "Da. Aveți apă aici.",
        "en": "Yes. You have water here.",
        "fa": "بله. اینجا آب دارید."
      }
    }
  ],
  "vocabulary": [
    {
      "ro": "musafir",
      "en": "guest",
      "fa": "مهمان",
      "example": {
        "ro": "Da, sunt musafirul vostru.",
        "en": "Yes, I am your guest.",
        "fa": "بله، من مهمان شما هستم."
      },
      "alternatives": [
        {
          "ro": "Da, sunt musafira voastră.",
          "en": "Yes, I am your guest.",
          "fa": "بله، من مهمان شما هستم."
        }
      ]
    },
    {
      "ro": "prieten",
      "en": "friend",
      "fa": "دوست",
      "example": {
        "ro": "Da, am un prieten aici.",
        "en": "Yes, I have a friend here.",
        "fa": "بله، اینجا یک دوست دارم."
      }
    },
    {
      "ro": "familie",
      "en": "family",
      "fa": "خانواده",
      "example": {
        "ro": "Aveți o familie mare.",
        "en": "You have a large family.",
        "fa": "شما خانوادهٔ بزرگی دارید."
      }
    },
    {
      "ro": "casă",
      "en": "house",
      "fa": "خانه",
      "example": {
        "ro": "Aveți o casă frumoasă.",
        "en": "You have a beautiful house.",
        "fa": "شما خانهٔ زیبایی دارید."
      }
    },
    {
      "ro": "cameră",
      "en": "room",
      "fa": "اتاق",
      "example": {
        "ro": "Mulțumesc. Aceasta este camera mea.",
        "en": "Thank you. This is my room.",
        "fa": "ممنون. این اتاق من است."
      }
    }
  ]
} satisfies EverydayScenario;

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
