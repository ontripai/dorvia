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
    "fa": "بعد از سفر رسیده‌اید؛ وارد شوید، چمدان را بگذارید و خستگی خود را بگویید.",
    "en": "You have arrived after travelling; enter, put your bag down and say you are tired."
  },
  "dialogue": [
    {
      "ro": "Bună! Intră!",
      "en": "Hi! Come in!",
      "fa": "سلام! بیا داخل!",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Bună! Am un bagaj.",
      "en": "Hi! I have a bag.",
      "fa": "سلام! یک چمدان دارم.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Bagajul aici?",
      "en": "The bag here?",
      "fa": "چمدان را اینجا بگذاریم؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Da, mulțumesc.",
      "en": "Yes, thank you.",
      "fa": "بله، ممنون.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Ești obosit?",
      "en": "Are you tired?",
      "fa": "خسته‌ای؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Da, sunt obosit.",
      "en": "Yes, I am tired.",
      "fa": "بله، خسته‌ام.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Ai apă aici.",
      "en": "There is water here for you.",
      "fa": "اینجا برایت آب هست.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Mulțumesc!",
      "en": "Thank you!",
      "fa": "ممنون!",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "خوش‌آمدگویی با یک کار واقعی",
        "en": "A welcome with a real action"
      },
      "explanation": {
        "fa": "Intră یعنی «بیا داخل»؛ شکل دعوتیِ a intra است. النا در را باز کرده و زبان‌آموز با چمدان وارد می‌شود. bagajul صورت معرفهٔ bagaj است.",
        "en": "Intră means come in, an invitation form of a intra. Elena has opened the door and the learner enters with luggage. Bagajul is the definite form of bagaj."
      },
      "examples": [
        {
          "ro": "Bună! Intră!",
          "en": "Hi! Come in!",
          "fa": "سلام! بیا داخل!"
        },
        {
          "ro": "Bagajul aici?",
          "en": "The bag here?",
          "fa": "چمدان را اینجا بگذاریم؟"
        }
      ]
    },
    {
      "title": {
        "fa": "خستگی را طبیعی بیان کنید",
        "en": "Say you are tired naturally"
      },
      "explanation": {
        "fa": "برای گویندهٔ مرد obosit و برای گویندهٔ زن obosită به کار می‌رود؛ هر دو یک واژهٔ هدف‌اند و پذیرفته می‌شوند. sunt و ești مرور «بودن» هستند. جمله‌های کوتاهِ تشکر پاسخ‌های واقعی همین موقعیت‌اند.",
        "en": "Use obosit for a male speaker and obosită for a female speaker. They count as one target and both are accepted. Sunt and ești review to be. Short thanks are natural replies in this situation."
      },
      "examples": [
        {
          "ro": "Da, sunt obosit.",
          "en": "Yes, I am tired.",
          "fa": "بله، خسته‌ام."
        },
        {
          "ro": "Da, sunt obosită.",
          "en": "Yes, I am tired. (female speaker)",
          "fa": "بله، خسته‌ام. (گویندهٔ زن)"
        }
      ]
    }
  ],
  "tasks": [
    {
      "ro": "Bună! Am un bagaj.",
      "en": "Hi! I have a bag.",
      "fa": "سلام! یک چمدان دارم.",
      "hint": "Bună! …",
      "cue": {
        "ro": "Bună! Intră!",
        "en": "Hi! Come in!",
        "fa": "سلام! بیا داخل!",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Da, mulțumesc.",
      "en": "Yes, thank you.",
      "fa": "بله، ممنون.",
      "hint": "Da, …",
      "cue": {
        "ro": "Bagajul aici?",
        "en": "The bag here?",
        "fa": "چمدان را اینجا بگذاریم؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Da, sunt obosit.",
      "en": "Yes, I am tired.",
      "fa": "بله، خسته‌ام.",
      "hint": "Da, …",
      "cue": {
        "ro": "Ești obosit?",
        "en": "Are you tired?",
        "fa": "خسته‌ای؟",
        "audioVoice": "ro-RO-AlinaNeural"
      },
      "alternatives": [
        "Da, sunt obosită."
      ]
    },
    {
      "ro": "Mulțumesc!",
      "en": "Thank you!",
      "fa": "ممنون!",
      "hint": "Mulțumesc! …",
      "cue": {
        "ro": "Ai apă aici.",
        "en": "There is water here for you.",
        "fa": "اینجا برایت آب هست.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    }
  ],
  "vocabulary": [
    {
      "ro": "a intra",
      "en": "to enter",
      "fa": "وارد شدن",
      "example": {
        "ro": "Bună! Intră!",
        "en": "Hi! Come in!",
        "fa": "سلام! بیا داخل!"
      }
    },
    {
      "ro": "bagaj",
      "en": "luggage / bag",
      "fa": "چمدان / بار سفر",
      "example": {
        "ro": "Bună! Am un bagaj.",
        "en": "Hi! I have a bag.",
        "fa": "سلام! یک چمدان دارم."
      }
    },
    {
      "ro": "obosit",
      "en": "tired",
      "fa": "خسته",
      "example": {
        "ro": "Da, sunt obosit.",
        "en": "Yes, I am tired.",
        "fa": "بله، خسته‌ام."
      },
      "alternatives": [
        {
          "ro": "Da, sunt obosită.",
          "en": "Yes, I am tired. (female speaker)",
          "fa": "بله، خسته‌ام. (گویندهٔ زن)"
        }
      ]
    },
    {
      "ro": "aici",
      "en": "here",
      "fa": "اینجا",
      "example": {
        "ro": "Bagajul aici?",
        "en": "The bag here?",
        "fa": "چمدان را اینجا بگذاریم؟"
      }
    },
    {
      "ro": "apă",
      "en": "water",
      "fa": "آب",
      "example": {
        "ro": "Ai apă aici.",
        "en": "There is water here for you.",
        "fa": "اینجا برایت آب هست."
      }
    }
  ],
  "answerVoice": "ro-RO-EmilNeural",
  "setting": {
    "fa": "النا درِ خانه را باز می‌کند. شما پسرعمو یا دخترعموی او هستید و پس از سفر با یک چمدان رسیده‌اید.",
    "en": "Elena opens the front door. You are her cousin and have arrived after a journey with one bag."
  }
} satisfies EverydayScenario;

export const meetFamilyLesson = {
  "slug": "familia",
  "title": {
    "fa": "درس ۲: شناخت خانواده",
    "en": "Lesson 2: Meet the family"
  },
  "goal": {
    "fa": "آنا از حال خانوادهٔ شما می‌پرسد؛ پاسخ‌های کوتاه و صمیمی بدهید.",
    "en": "Ana asks after your family; give short, familiar answers."
  },
  "dialogue": [
    {
      "ro": "Cum e familia ta?",
      "en": "How is your family?",
      "fa": "خانواده‌ات چطورند؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Familia mea e bine.",
      "en": "My family is well.",
      "fa": "خانواده‌ام خوب‌اند.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Mama ta e bine?",
      "en": "Is your mother well?",
      "fa": "مادرت خوب است؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Mama e obosită.",
      "en": "My mother is tired.",
      "fa": "مادرم خسته است.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Și tata?",
      "en": "And your father?",
      "fa": "و پدرت؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Și tata e bine.",
      "en": "My father is well too.",
      "fa": "پدرم هم خوب است.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Și fratele și sora ta?",
      "en": "And your brother and sister?",
      "fa": "و برادر و خواهرت؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Și ei sunt bine.",
      "en": "They are well too.",
      "fa": "آن‌ها هم خوب‌اند.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "احوال‌پرسی، نه معرفیِ بدیهیات",
        "en": "Ask after relatives, rather than state the obvious"
      },
      "explanation": {
        "fa": "آنا خانوادهٔ شما را می‌شناسد و پس از دیدار دربارهٔ حالشان می‌پرسد. bine یعنی «خوب» و از پایه‌ها مرور می‌شود؛ e شکل کوتاه و رایج este است.",
        "en": "Ana knows your family and asks how they are when you visit. Bine reviews well from foundations; e is a common short form of este."
      },
      "examples": [
        {
          "ro": "Cum e familia ta?",
          "en": "How is your family?",
          "fa": "خانواده‌ات چطورند؟"
        },
        {
          "ro": "Familia mea e bine.",
          "en": "My family is well.",
          "fa": "خانواده‌ام خوب‌اند."
        }
      ]
    },
    {
      "title": {
        "fa": "پرسش کوتاه در گفت‌وگوی خانوادگی",
        "en": "Short questions in family conversation"
      },
      "explanation": {
        "fa": "پس از پرسش دربارهٔ مادر، «و پدرت؟» طبیعی است؛ لازم نیست ساختار کامل هر بار تکرار شود. fratele و sora صورت‌های معرفهٔ frate و soră هستند. در این داستانِ نمونه، مهمان یک برادر و یک خواهر دارد.",
        "en": "After asking about the mother, and your father is natural; the full question need not be repeated. Fratele and sora are definite forms of frate and soră. In this model story the guest has a brother and a sister."
      },
      "examples": [
        {
          "ro": "Și tata?",
          "en": "And your father?",
          "fa": "و پدرت؟"
        },
        {
          "ro": "Și ei sunt bine.",
          "en": "They are well too.",
          "fa": "آن‌ها هم خوب‌اند."
        }
      ]
    }
  ],
  "tasks": [
    {
      "ro": "Familia mea e bine.",
      "en": "My family is well.",
      "fa": "خانواده‌ام خوب‌اند.",
      "hint": "Familia …",
      "cue": {
        "ro": "Cum e familia ta?",
        "en": "How is your family?",
        "fa": "خانواده‌ات چطورند؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Mama e obosită.",
      "en": "My mother is tired.",
      "fa": "مادرم خسته است.",
      "hint": "Da, …",
      "cue": {
        "ro": "Mama ta e bine?",
        "en": "Is your mother well?",
        "fa": "مادرت خوب است؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Și tata e bine.",
      "en": "My father is well too.",
      "fa": "پدرم هم خوب است.",
      "hint": "Și …",
      "cue": {
        "ro": "Și tata?",
        "en": "And your father?",
        "fa": "و پدرت؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Și ei sunt bine.",
      "en": "They are well too.",
      "fa": "آن‌ها هم خوب‌اند.",
      "hint": "Și …",
      "cue": {
        "ro": "Și fratele și sora ta?",
        "en": "And your brother and sister?",
        "fa": "و برادر و خواهرت؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    }
  ],
  "vocabulary": [
    {
      "ro": "familie",
      "en": "family",
      "fa": "خانواده",
      "example": {
        "ro": "Familia mea e bine.",
        "en": "My family is well.",
        "fa": "خانواده‌ام خوب‌اند."
      }
    },
    {
      "ro": "mamă",
      "en": "mother",
      "fa": "مادر",
      "example": {
        "ro": "Mama e obosită.",
        "en": "My mother is tired.",
        "fa": "مادرم خسته است."
      }
    },
    {
      "ro": "tată",
      "en": "father",
      "fa": "پدر",
      "example": {
        "ro": "Și tata e bine.",
        "en": "My father is well too.",
        "fa": "پدرم هم خوب است."
      }
    },
    {
      "ro": "frate",
      "en": "brother",
      "fa": "برادر",
      "example": {
        "ro": "Și fratele și sora ta?",
        "en": "And your brother and sister?",
        "fa": "و برادر و خواهرت؟"
      }
    },
    {
      "ro": "soră",
      "en": "sister",
      "fa": "خواهر",
      "example": {
        "ro": "Și fratele și sora ta?",
        "en": "And your brother and sister?",
        "fa": "و برادر و خواهرت؟"
      }
    }
  ],
  "answerVoice": "ro-RO-EmilNeural",
  "setting": {
    "fa": "چمدان را کنار گذاشته‌اید. آنا، زن‌عموی شما، خوش‌آمد می‌گوید و از حال خانواده‌تان خبر می‌گیرد. در این خبرگیری، می‌گویید مادرتان خسته است؛ واژهٔ خستگی از درس ورود دوباره به کار می‌رود.",
    "en": "You have put your bag down. Ana, your aunt by marriage, welcomes you and asks after your family. You mention that your mother is tired, reusing tiredness from the arrival lesson."
  }
} satisfies EverydayScenario;

export const homeRoomLesson = {
  "slug": "camera",
  "title": {
    "fa": "درس ۳: خانه و اتاق شما",
    "en": "Lesson 3: Your house and room"
  },
  "goal": {
    "fa": "آنا اتاق را نشان می‌دهد؛ دربارهٔ تخت و اتاق واکنش نشان دهید و تشکر کنید.",
    "en": "Ana shows you the room; react to the room and bed, then thank her."
  },
  "dialogue": [
    {
      "ro": "Aceasta este camera ta.",
      "en": "This is your room.",
      "fa": "این اتاق توست.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Ce cameră frumoasă!",
      "en": "What a beautiful room!",
      "fa": "چه اتاق زیبایی!",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Patul e aici.",
      "en": "The bed is here.",
      "fa": "تخت اینجاست.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Patul e mare!",
      "en": "The bed is big!",
      "fa": "تخت بزرگ است!",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Da. Ai apă aici.",
      "en": "Yes. There is water here for you.",
      "fa": "بله. اینجا برایت آب هست.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Mulțumesc. Casa e frumoasă.",
      "en": "Thank you. The house is beautiful.",
      "fa": "ممنون. خانه زیباست.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Ești bine?",
      "en": "Are you okay?",
      "fa": "حالت خوب است؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Da, sunt bine.",
      "en": "Yes, I am okay.",
      "fa": "بله، خوبم.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "واکنش به اتاق",
        "en": "React to the room"
      },
      "explanation": {
        "fa": "Ce cameră frumoasă! یک واکنش طبیعی به دیدن اتاق است. frumoasă صورت مؤنث frumos است و یک واژهٔ تازه شمرده می‌شود.",
        "en": "Ce cameră frumoasă is a natural reaction when seeing the room. Frumoasă is the feminine form of frumos; they count as one new target."
      },
      "examples": [
        {
          "ro": "Aceasta este camera ta.",
          "en": "This is your room.",
          "fa": "این اتاق توست."
        },
        {
          "ro": "Ce cameră frumoasă!",
          "en": "What a beautiful room!",
          "fa": "چه اتاق زیبایی!"
        }
      ]
    },
    {
      "title": {
        "fa": "اشاره به وسایل و پرسیدن حال مهمان",
        "en": "Point out things and check on the guest"
      },
      "explanation": {
        "fa": "Patul صورت معرفهٔ pat است. آب و خستگی به دیدار اول پیوند دارند؛ آنا آب می‌گذارد و می‌پرسد حال مهمان خوب است یا نه. sunt و e مرور «بودن» هستند.",
        "en": "Patul is the definite form of pat. Water and tiredness connect back to the arrival; Ana provides water and checks on the guest. Sunt and e review to be."
      },
      "examples": [
        {
          "ro": "Patul e aici.",
          "en": "The bed is here.",
          "fa": "تخت اینجاست."
        },
        {
          "ro": "Ești bine?",
          "en": "Are you okay?",
          "fa": "حالت خوب است؟"
        }
      ]
    }
  ],
  "tasks": [
    {
      "ro": "Ce cameră frumoasă!",
      "en": "What a beautiful room!",
      "fa": "چه اتاق زیبایی!",
      "hint": "Ce …",
      "cue": {
        "ro": "Aceasta este camera ta.",
        "en": "This is your room.",
        "fa": "این اتاق توست.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Patul e mare!",
      "en": "The bed is big!",
      "fa": "تخت بزرگ است!",
      "hint": "Patul …",
      "cue": {
        "ro": "Patul e aici.",
        "en": "The bed is here.",
        "fa": "تخت اینجاست.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Mulțumesc. Casa e frumoasă.",
      "en": "Thank you. The house is beautiful.",
      "fa": "ممنون. خانه زیباست.",
      "hint": "Mulțumesc. …",
      "cue": {
        "ro": "Da. Ai apă aici.",
        "en": "Yes. There is water here for you.",
        "fa": "بله. اینجا برایت آب هست.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Da, sunt bine.",
      "en": "Yes, I am okay.",
      "fa": "بله، خوبم.",
      "hint": "Da, …",
      "cue": {
        "ro": "Ești bine?",
        "en": "Are you okay?",
        "fa": "حالت خوب است؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    }
  ],
  "vocabulary": [
    {
      "ro": "cameră",
      "en": "room",
      "fa": "اتاق",
      "example": {
        "ro": "Ce cameră frumoasă!",
        "en": "What a beautiful room!",
        "fa": "چه اتاق زیبایی!"
      }
    },
    {
      "ro": "casă",
      "en": "house",
      "fa": "خانه",
      "example": {
        "ro": "Mulțumesc. Casa e frumoasă.",
        "en": "Thank you. The house is beautiful.",
        "fa": "ممنون. خانه زیباست."
      }
    },
    {
      "ro": "pat",
      "en": "bed",
      "fa": "تخت",
      "example": {
        "ro": "Patul e mare!",
        "en": "The bed is big!",
        "fa": "تخت بزرگ است!"
      }
    },
    {
      "ro": "mare",
      "en": "big",
      "fa": "بزرگ",
      "example": {
        "ro": "Patul e mare!",
        "en": "The bed is big!",
        "fa": "تخت بزرگ است!"
      }
    },
    {
      "ro": "frumos",
      "en": "beautiful",
      "fa": "زیبا؛ صورت مؤنث: frumoasă",
      "example": {
        "ro": "Ce cameră frumoasă!",
        "en": "What a beautiful room!",
        "fa": "چه اتاق زیبایی!"
      }
    }
  ],
  "answerVoice": "ro-RO-EmilNeural",
  "setting": {
    "fa": "بعد از احوال‌پرسی، آنا اتاق مهمان را نشان می‌دهد تا چمدان را بگذارید و استراحت کنید.",
    "en": "After catching up, Ana shows you the guest room so you can put your bag down and rest."
  }
} satisfies EverydayScenario;

export const familyBreakfastLesson = {
  "slug": "mic-dejun",
  "title": {
    "fa": "درس ۴: صبحانه با خانواده",
    "en": "Lesson 4: Breakfast with the family"
  },
  "goal": {
    "fa": "صبح روز تعطیل، با النا برای صبحانه در کافه قرار می‌گذارید.",
    "en": "On a day off, make a plan with Elena to have breakfast at the café."
  },
  "dialogue": [
    {
      "ro": "Bună! Ai foame?",
      "en": "Hi! Are you hungry?",
      "fa": "سلام! گرسنه‌ای؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Da, am foame.",
      "en": "Yes, I am hungry.",
      "fa": "بله، گرسنه‌ام.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Mergem la cafenea pentru micul dejun?",
      "en": "Shall we go to the café for breakfast?",
      "fa": "برای صبحانه به کافه برویم؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Da, mergem împreună.",
      "en": "Yes, let’s go together.",
      "fa": "بله، با هم برویم.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Cafeneaua e lângă casă.",
      "en": "The café is next to the house.",
      "fa": "کافه کنار خانه است.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Și mama ta?",
      "en": "And your mother?",
      "fa": "و مادرت؟",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Mama e acasă.",
      "en": "My mother is at home.",
      "fa": "مادرم در خانه است.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Bine, mergem!",
      "en": "Okay, let’s go!",
      "fa": "خوب، برویم!",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    }
  ],
  "tasks": [
    {
      "ro": "Da, am foame.",
      "en": "Yes, I am hungry.",
      "fa": "بله، گرسنه‌ام.",
      "hint": "Da, …",
      "cue": {
        "ro": "Bună! Ai foame?",
        "en": "Hi! Are you hungry?",
        "fa": "سلام! گرسنه‌ای؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Da, mergem împreună.",
      "en": "Yes, let’s go together.",
      "fa": "بله، با هم برویم.",
      "hint": "Da, …",
      "cue": {
        "ro": "Mergem la cafenea pentru micul dejun?",
        "en": "Shall we go to the café for breakfast?",
        "fa": "برای صبحانه به کافه برویم؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Și mama ta?",
      "en": "And your mother?",
      "fa": "و مادرت؟",
      "hint": "Și …",
      "cue": {
        "ro": "Cafeneaua e lângă casă.",
        "en": "The café is next to the house.",
        "fa": "کافه کنار خانه است.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Bine, mergem!",
      "en": "Okay, let’s go!",
      "fa": "خوب، برویم!",
      "hint": "Bine, …",
      "cue": {
        "ro": "Mama e acasă.",
        "en": "My mother is at home.",
        "fa": "مادرم در خانه است.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "برنامه‌ای که به رفتن منجر می‌شود",
        "en": "A plan that leads to going out"
      },
      "explanation": {
        "fa": "Mergem la cafenea pentru micul dejun? یک پیشنهاد است: «برای صبحانه به کافه برویم؟». mergem شکل «ما» از a merge است. împreună یعنی «با هم» و برای فهم صحنه کمک می‌کند؛ حفظ آن در این جلسه لازم نیست.",
        "en": "Mergem la cafenea pentru micul dejun? is an invitation: shall we go to the café for breakfast? Mergem is the we-form of a merge. Împreună means together; it supports the scene and is not a memorisation target in this session."
      },
      "examples": [
        {
          "ro": "Mergem la cafenea pentru micul dejun?",
          "en": "Shall we go to the café for breakfast?",
          "fa": "برای صبحانه به کافه برویم؟"
        },
        {
          "ro": "Bine, mergem!",
          "en": "Okay, let’s go!",
          "fa": "خوب، برویم!"
        }
      ]
    },
    {
      "title": {
        "fa": "گرسنگی و نشانی نزدیک خانه",
        "en": "Hunger and a location near home"
      },
      "explanation": {
        "fa": "Ai foame? و Am foame از فعل آشنای a avea هستند. lângă casă یعنی «کنار خانه». pentru در پیشنهاد النا یعنی «برای»؛ هدف یادگیری مستقل این جلسه نیست.",
        "en": "Ai foame? and Am foame use the familiar a avea. Lângă casă means next to the house. Pentru means for in Elena’s invitation; it is supporting language, not a separate target."
      },
      "examples": [
        {
          "ro": "Bună! Ai foame?",
          "en": "Hi! Are you hungry?",
          "fa": "سلام! گرسنه‌ای؟"
        },
        {
          "ro": "Da, am foame.",
          "en": "Yes, I am hungry.",
          "fa": "بله، گرسنه‌ام."
        }
      ]
    }
  ],
  "vocabulary": [
    {
      "ro": "foame",
      "en": "hunger",
      "fa": "گرسنگی",
      "example": {
        "ro": "Bună! Ai foame?",
        "en": "Hi! Are you hungry?",
        "fa": "سلام! گرسنه‌ای؟"
      }
    },
    {
      "ro": "mic dejun",
      "en": "breakfast",
      "fa": "صبحانه؛ یک ترکیب واژگانی",
      "example": {
        "ro": "Da, am foame.",
        "en": "Yes, I am hungry.",
        "fa": "بله، گرسنه‌ام."
      }
    },
    {
      "ro": "cafenea",
      "en": "café",
      "fa": "کافه",
      "example": {
        "ro": "Cafeneaua e lângă casă.",
        "en": "The café is next to the house.",
        "fa": "کافه کنار خانه است.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "lângă",
      "en": "next to",
      "fa": "کنار",
      "example": {
        "ro": "Cafeneaua e lângă casă.",
        "en": "The café is next to the house.",
        "fa": "کافه کنار خانه است."
      }
    },
    {
      "ro": "a merge",
      "en": "to go",
      "fa": "رفتن",
      "example": {
        "ro": "Bine, mergem!",
        "en": "Okay, let’s go!",
        "fa": "خوب، برویم!"
      }
    }
  ],
  "answerVoice": "ro-RO-EmilNeural",
  "setting": {
    "fa": "صبح روز تعطیل است. النا شما را برای صبحانه به کافهٔ کنار خانه دعوت می‌کند. شما دعوتش را قبول می‌کنید و پیش از رفتن دربارهٔ آنا می‌پرسید؛ آنا امروز در خانه می‌ماند.",
    "en": "It is a morning on a day off. Elena invites you to breakfast at the café next to the house. You accept and ask about Ana before leaving; Ana is staying home today."
  }
} satisfies EverydayScenario;

export const familyCafeLesson: EverydayScenario & { vocabulary: NonNullable<EverydayScenario['vocabulary']> } = {
  "slug": "cu-familia",
  "title": {
    "fa": "چای در کافه با خانواده",
    "en": "Tea at the café with the family"
  },
  "goal": {
    "fa": "چای با شیر و بدون شکر سفارش دهید و تأیید کنید که سفارش درست فهمیده شده است.",
    "en": "Order tea with milk and without sugar, then confirm that the order has been understood."
  },
  "dialogue": [
    {
      "ro": "Bună ziua!",
      "en": "Hello!",
      "fa": "سلام!",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Bună ziua! Un ceai, vă rog.",
      "en": "Hello! A tea, please.",
      "fa": "سلام! یک چای، لطفاً.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Cu lapte?",
      "en": "With milk?",
      "fa": "با شیر؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Da, cu lapte, vă rog.",
      "en": "Yes, with milk, please.",
      "fa": "بله، با شیر، لطفاً.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Și cu zahăr?",
      "en": "And with sugar?",
      "fa": "و با شکر؟",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Fără zahăr, vă rog.",
      "en": "Without sugar, please.",
      "fa": "بدون شکر، لطفاً.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Un ceai cu lapte, fără zahăr.",
      "en": "A tea with milk, without sugar.",
      "fa": "یک چای با شیر، بدون شکر.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Da. Mulțumesc!",
      "en": "Yes. Thank you!",
      "fa": "بله. ممنون!",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    }
  ],
  "tasks": [
    {
      "ro": "Bună ziua! Un ceai, vă rog.",
      "en": "Hello! A tea, please.",
      "fa": "سلام! یک چای، لطفاً.",
      "hint": "Bună …",
      "cue": {
        "ro": "Bună ziua!",
        "en": "Hello!",
        "fa": "سلام!",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Da, cu lapte, vă rog.",
      "en": "Yes, with milk, please.",
      "fa": "بله، با شیر، لطفاً.",
      "hint": "Da, …",
      "cue": {
        "ro": "Cu lapte?",
        "en": "With milk?",
        "fa": "با شیر؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Fără zahăr, vă rog.",
      "en": "Without sugar, please.",
      "fa": "بدون شکر، لطفاً.",
      "hint": "Fără …",
      "cue": {
        "ro": "Și cu zahăr?",
        "en": "And with sugar?",
        "fa": "و با شکر؟",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Da. Mulțumesc!",
      "en": "Yes. Thank you!",
      "fa": "بله. ممنون!",
      "hint": "Da. …",
      "cue": {
        "ro": "Un ceai cu lapte, fără zahăr.",
        "en": "A tea with milk, without sugar.",
        "fa": "یک چای با شیر، بدون شکر.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "سفارش، پرسش، تأیید",
        "en": "Order, clarify, confirm"
      },
      "explanation": {
        "fa": "کارمند ابتدا سلام می‌کند، سپس دربارهٔ شیر و شکر می‌پرسد و سفارش را دوباره می‌گوید تا تأیید کنید. vă rog درخواست را مؤدبانه می‌کند و از خرید آب مرور می‌شود.",
        "en": "The staff greet you, ask about milk and sugar, then repeat the order for confirmation. Vă rog makes the request polite and reviews the water-shopping lesson."
      },
      "examples": [
        {
          "ro": "Bună ziua! Un ceai, vă rog.",
          "en": "Hello! A tea, please.",
          "fa": "سلام! یک چای، لطفاً."
        },
        {
          "ro": "Un ceai cu lapte, fără zahăr.",
          "en": "A tea with milk, without sugar.",
          "fa": "یک چای با شیر، بدون شکر."
        },
        {
          "ro": "Da. Mulțumesc!",
          "en": "Yes. Thank you!",
          "fa": "بله. ممنون!"
        }
      ]
    },
    {
      "title": {
        "fa": "انتخاب واقعی: با شیر، بدون شکر",
        "en": "A real choice: with milk, without sugar"
      },
      "explanation": {
        "fa": "در این نمونه چای را با شیر و بدون شکر می‌خواهید. cu و fără هر دو جزو پنج واژهٔ تازه‌اند. گفت‌وگوی مستقلِ سفارش‌های دیگر را می‌توانید جداگانه تمرین کنید.",
        "en": "In this model you choose tea with milk and without sugar. Cu and fără both count among the five new words. Other orders can be studied independently."
      },
      "examples": [
        {
          "ro": "Da, cu lapte, vă rog.",
          "en": "Yes, with milk, please.",
          "fa": "بله، با شیر، لطفاً."
        },
        {
          "ro": "Fără zahăr, vă rog.",
          "en": "Without sugar, please.",
          "fa": "بدون شکر، لطفاً."
        }
      ]
    }
  ],
  "vocabulary": [
    {
      "ro": "ceai",
      "en": "tea",
      "fa": "چای",
      "example": {
        "ro": "Bună ziua! Un ceai, vă rog.",
        "en": "Hello! A tea, please.",
        "fa": "سلام! یک چای، لطفاً."
      }
    },
    {
      "ro": "lapte",
      "en": "milk",
      "fa": "شیر",
      "example": {
        "ro": "Da, cu lapte, vă rog.",
        "en": "Yes, with milk, please.",
        "fa": "بله، با شیر، لطفاً."
      }
    },
    {
      "ro": "zahăr",
      "en": "sugar",
      "fa": "شکر",
      "example": {
        "ro": "Fără zahăr, vă rog.",
        "en": "Without sugar, please.",
        "fa": "بدون شکر، لطفاً."
      }
    },
    {
      "ro": "cu",
      "en": "with",
      "fa": "با",
      "example": {
        "ro": "Cu lapte?",
        "en": "With milk?",
        "fa": "با شیر؟"
      }
    },
    {
      "ro": "fără",
      "en": "without",
      "fa": "بدون",
      "example": {
        "ro": "Fără zahăr, vă rog.",
        "en": "Without sugar, please.",
        "fa": "بدون شکر، لطفاً."
      }
    }
  ],
  "answerVoice": "ro-RO-EmilNeural",
  "setting": {
    "fa": "با النا در کافه نشسته‌اید. او سفارش خودش را داده؛ حالا کارمند از شما سفارش می‌گیرد.",
    "en": "You are at the café with Elena. She has placed her own order; now the staff take yours."
  }
} satisfies EverydayScenario;

export const familyTableLesson = {
  "slug": "la-masa",
  "title": {
    "fa": "درس ۵: کمک در چیدن میز",
    "en": "Lesson 5: Helping set the table"
  },
  "goal": {
    "fa": "در خانه به آنا کمک کنید؛ دربارهٔ نان، پنیر و جای بشقاب بپرسید.",
    "en": "Help Ana at home; ask about bread, cheese and where to put the plate."
  },
  "setting": {
    "fa": "بعدتر در همان روز، آنا نان و پنیر برای یک وعدهٔ ساده آماده کرده است. شما به عنوان مهمان کمک می‌کنید میز را بچینید؛ لازم نیست نام وسایل را بی‌دلیل تکرار کنید، هر سؤال برای انجام کاری است.",
    "en": "Later that day, Ana has prepared bread and cheese for a simple meal. As her guest, you help set the table; each question helps you do something."
  },
  "dialogue": [
    {
      "ro": "Avem pâine și brânză.",
      "en": "We have bread and cheese.",
      "fa": "نان و پنیر داریم.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Pun pâinea pe masă?",
      "en": "Shall I put the bread on the table?",
      "fa": "نان را روی میز بگذارم؟",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Da, mulțumesc.",
      "en": "Yes, thank you.",
      "fa": "بله، ممنون.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Și brânza?",
      "en": "And the cheese?",
      "fa": "پنیر را هم؟",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Da, pe masă.",
      "en": "Yes, on the table.",
      "fa": "بله، روی میز.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Unde pun farfuria?",
      "en": "Where shall I put the plate?",
      "fa": "بشقاب را کجا بگذارم؟",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    },
    {
      "ro": "Aici, lângă pâine.",
      "en": "Here, next to the bread.",
      "fa": "اینجا، کنار نان.",
      "who": "host",
      "audioVoice": "ro-RO-AlinaNeural"
    },
    {
      "ro": "Bine, pun farfuria aici.",
      "en": "Okay, I’ll put the plate here.",
      "fa": "خوب، بشقاب را اینجا می‌گذارم.",
      "who": "you",
      "audioVoice": "ro-RO-EmilNeural"
    }
  ],
  "tasks": [
    {
      "ro": "Pun pâinea pe masă?",
      "en": "Shall I put the bread on the table?",
      "fa": "نان را روی میز بگذارم؟",
      "hint": "Pun …",
      "cue": {
        "ro": "Avem pâine și brânză.",
        "en": "We have bread and cheese.",
        "fa": "نان و پنیر داریم.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Și brânza?",
      "en": "And the cheese?",
      "fa": "پنیر را هم؟",
      "hint": "Și …",
      "cue": {
        "ro": "Da, mulțumesc.",
        "en": "Yes, thank you.",
        "fa": "بله، ممنون.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Unde pun farfuria?",
      "en": "Where shall I put the plate?",
      "fa": "بشقاب را کجا بگذارم؟",
      "hint": "Unde …",
      "cue": {
        "ro": "Da, pe masă.",
        "en": "Yes, on the table.",
        "fa": "بله، روی میز.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "Bine, pun farfuria aici.",
      "en": "Okay, I’ll put the plate here.",
      "fa": "خوب، بشقاب را اینجا می‌گذارم.",
      "hint": "Bine, …",
      "cue": {
        "ro": "Aici, lângă pâine.",
        "en": "Here, next to the bread.",
        "fa": "اینجا، کنار نان.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    }
  ],
  "rules": [
    {
      "title": {
        "fa": "پیشنهاد کمک با فعل گذاشتن",
        "en": "Offer help with to put"
      },
      "explanation": {
        "fa": "a pune یعنی «گذاشتن»؛ pun شکل «من» است. Pun pâinea pe masă? در این صحنه یعنی «نان را روی میز بگذارم؟». با لحن سؤال اجازه می‌گیرید و کمک می‌کنید.",
        "en": "A pune means to put; pun is the I-form. Pun pâinea pe masă? offers help: shall I put the bread on the table? The question asks for guidance."
      },
      "examples": [
        {
          "ro": "Pun pâinea pe masă?",
          "en": "Shall I put the bread on the table?",
          "fa": "نان را روی میز بگذارم؟",
          "audioVoice": "ro-RO-EmilNeural"
        },
        {
          "ro": "Bine, pun farfuria aici.",
          "en": "Okay, I’ll put the plate here.",
          "fa": "خوب، بشقاب را اینجا می‌گذارم.",
          "audioVoice": "ro-RO-EmilNeural"
        }
      ]
    },
    {
      "title": {
        "fa": "از یک سؤال تا جای درست وسیله",
        "en": "Ask where an item belongs"
      },
      "explanation": {
        "fa": "Unde یعنی «کجا» و از پرسش‌واژه‌های پایه مرور می‌شود. pe masă یعنی «روی میز»؛ pe فقط برای فهم جمله توضیح داده شده است. pâinea، brânza و farfuria شکل معرفهٔ سه واژهٔ هدف هستند. lângă از درس قبل مرور می‌شود.",
        "en": "Unde reviews the basic question word where. Pe masă means on the table; pe supports the sentence. Pâinea, brânza and farfuria are definite forms of three targets. Lângă reviews the previous lesson."
      },
      "examples": [
        {
          "ro": "Unde pun farfuria?",
          "en": "Where shall I put the plate?",
          "fa": "بشقاب را کجا بگذارم؟",
          "audioVoice": "ro-RO-EmilNeural"
        },
        {
          "ro": "Aici, lângă pâine.",
          "en": "Here, next to the bread.",
          "fa": "اینجا، کنار نان.",
          "audioVoice": "ro-RO-AlinaNeural"
        }
      ]
    }
  ],
  "vocabulary": [
    {
      "ro": "pâine",
      "en": "bread",
      "fa": "نان",
      "example": {
        "ro": "Avem pâine și brânză.",
        "en": "We have bread and cheese.",
        "fa": "نان و پنیر داریم.",
        "audioVoice": "ro-RO-AlinaNeural"
      }
    },
    {
      "ro": "brânză",
      "en": "cheese",
      "fa": "پنیر",
      "example": {
        "ro": "Și brânza?",
        "en": "And the cheese?",
        "fa": "پنیر را هم؟",
        "audioVoice": "ro-RO-EmilNeural"
      }
    },
    {
      "ro": "masă",
      "en": "table",
      "fa": "میز",
      "example": {
        "ro": "Pun pâinea pe masă?",
        "en": "Shall I put the bread on the table?",
        "fa": "نان را روی میز بگذارم؟",
        "audioVoice": "ro-RO-EmilNeural"
      }
    },
    {
      "ro": "farfurie",
      "en": "plate",
      "fa": "بشقاب",
      "example": {
        "ro": "Unde pun farfuria?",
        "en": "Where shall I put the plate?",
        "fa": "بشقاب را کجا بگذارم؟",
        "audioVoice": "ro-RO-EmilNeural"
      }
    },
    {
      "ro": "a pune",
      "en": "to put",
      "fa": "گذاشتن",
      "example": {
        "ro": "Bine, pun farfuria aici.",
        "en": "Okay, I’ll put the plate here.",
        "fa": "خوب، بشقاب را اینجا می‌گذارم.",
        "audioVoice": "ro-RO-EmilNeural"
      }
    }
  ],
  "answerVoice": "ro-RO-EmilNeural"
} satisfies EverydayScenario;

export const homeStoryLessons: (EverydayScenario & { vocabulary: NonNullable<EverydayScenario['vocabulary']> })[] = [welcomeHomeLesson, meetFamilyLesson, homeRoomLesson, familyBreakfastLesson, familyTableLesson];

export const homeReturnDialogue = [
  {
    "ro": "Ce ai în pungă?",
    "en": "What do you have in the bag?",
    "fa": "داخل کیسه چه داری؟",
    "who": "host",
    "audioVoice": "ro-RO-AlinaNeural"
  },
  {
    "ro": "Am o sticlă de apă.",
    "en": "I have a bottle of water.",
    "fa": "یک بطری آب دارم.",
    "who": "you",
    "audioVoice": "ro-RO-EmilNeural"
  },
  {
    "ro": "Cât costă?",
    "en": "How much does it cost?",
    "fa": "قیمتش چقدر است؟",
    "who": "host",
    "audioVoice": "ro-RO-AlinaNeural"
  },
  {
    "ro": "Costă cinci lei.",
    "en": "It costs five lei.",
    "fa": "قیمتش پنج لِی است.",
    "who": "you",
    "audioVoice": "ro-RO-EmilNeural"
  },
  {
    "ro": "Mulțumesc. Acum avem apă acasă.",
    "en": "Thank you. Now we have water at home.",
    "fa": "ممنون. حالا در خانه آب داریم.",
    "who": "host",
    "audioVoice": "ro-RO-AlinaNeural"
  }
] as const;

export const homeVerbTimes = [
  { tense: { fa: 'گذشته · دیروز', en: 'Past · yesterday' }, ro: 'Ieri am avut o sticlă de apă.', en: 'Yesterday I had a bottle of water.', fa: 'دیروز یک بطری آب داشتم.', form: 'am avut', hint: { fa: 'am + avut؛ در این جمله، am بخش کمکیِ گذشته است.', en: 'am + avut; here am is the auxiliary for the compound past.' } },
  { tense: { fa: 'حال · اکنون', en: 'Present · now' }, ro: 'Acum am o sticlă de apă.', en: 'Now I have a bottle of water.', fa: 'اکنون یک بطری آب دارم.', form: 'am', hint: { fa: 'am؛ شکل حالِ a avea برای «من».', en: 'am; the present form of a avea for “I”.' } },
  { tense: { fa: 'آینده · فردا', en: 'Future · tomorrow' }, ro: 'Mâine voi avea o sticlă de apă.', en: 'Tomorrow I will have a bottle of water.', fa: 'فردا یک بطری آب خواهم داشت.', form: 'voi avea', hint: { fa: 'voi + avea؛ یکی از شکل‌های استاندارد آینده برای «من».', en: 'voi + avea; one standard future form for “I”.' } },
] as const;

export const cafeReturnDialogue = [
  {
    "ro": "Ai avut ceai cu lapte?",
    "en": "Did you have tea with milk?",
    "fa": "چای با شیر داشتی؟",
    "who": "host",
    "audioVoice": "ro-RO-AlinaNeural"
  },
  {
    "ro": "Da, am avut ceai cu lapte.",
    "en": "Yes, I had tea with milk.",
    "fa": "بله، چای با شیر داشتم.",
    "who": "you",
    "audioVoice": "ro-RO-EmilNeural"
  },
  {
    "ro": "Și cu zahăr?",
    "en": "And with sugar?",
    "fa": "و با شکر؟",
    "who": "host",
    "audioVoice": "ro-RO-AlinaNeural"
  },
  {
    "ro": "Nu, fără zahăr.",
    "en": "No, without sugar.",
    "fa": "نه، بدون شکر.",
    "who": "you",
    "audioVoice": "ro-RO-EmilNeural"
  },
  {
    "ro": "Bine.",
    "en": "Okay.",
    "fa": "خوب.",
    "who": "host",
    "audioVoice": "ro-RO-AlinaNeural"
  }
] as const;
