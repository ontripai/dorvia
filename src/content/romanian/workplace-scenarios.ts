import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const workplaceScenarios: EverydayScenario[] = [
  {
    "slug": "prima-zi",
    "title": {
      "fa": "معرفی در روز اول",
      "en": "First-day introductions"
    },
    "goal": {
      "fa": "خودتان را معرفی کنید، مسئول تیم را پیدا کنید و محل شروع را بپرسید.",
      "en": "Introduce yourself, find the team leader and ask where to start."
    },
    "dialogue": [
      {
        "who": "you",
        "ro": "Bună ziua. Sunt nou în echipă.",
        "en": "Hello. I am new to the team.",
        "fa": "سلام. تازه به تیم پیوسته‌ام."
      },
      {
        "who": "colleague",
        "ro": "Bine ați venit! Cum vă numiți?",
        "en": "Welcome! What is your name?",
        "fa": "خوش آمدید! نامتان چیست؟"
      },
      {
        "who": "you",
        "ro": "Mă numesc Amir. Cu cine trebuie să vorbesc?",
        "en": "My name is Amir. Who should I speak to?",
        "fa": "نام من امیر است. با چه کسی باید صحبت کنم؟"
      },
      {
        "who": "colleague",
        "ro": "Vorbiți cu responsabilul echipei.",
        "en": "Speak to the team leader.",
        "fa": "با مسئول تیم صحبت کنید."
      },
      {
        "who": "you",
        "ro": "Unde îl găsesc?",
        "en": "Where can I find him?",
        "fa": "کجا می‌توانم او را پیدا کنم؟"
      },
      {
        "who": "colleague",
        "ro": "Este în biroul de lângă intrare.",
        "en": "He is in the office next to the entrance.",
        "fa": "در دفتر کنار ورودی است."
      },
      {
        "who": "you",
        "ro": "Trebuie să mă prezint înainte să încep?",
        "en": "Should I introduce myself before I start?",
        "fa": "باید پیش از شروع خودم را معرفی کنم؟"
      },
      {
        "who": "colleague",
        "ro": "Da, apoi vă arată locul de muncă.",
        "en": "Yes, then he will show you your workplace.",
        "fa": "بله، سپس محل کارتان را به شما نشان می‌دهد."
      },
      {
        "who": "you",
        "ro": "Mulțumesc. Merg mai întâi la birou.",
        "en": "Thank you. I will go to the office first.",
        "fa": "ممنون. ابتدا به دفتر می‌روم."
      }
    ],
    "rules": [
      {
        "title": {
          "fa": "معرفی خود",
          "en": "Introduce yourself"
        },
        "explanation": {
          "fa": "Mă numesc ... یعنی «نام من ... است». برای بیان تازه‌وارد بودن، مرد می‌گوید nou و زن می‌گوید nouă.",
          "en": "Mă numesc ... means “my name is ...”. A man uses nou and a woman nouă to say they are new."
        },
        "examples": [
          {
            "ro": "Mă numesc Amir. Cu cine trebuie să vorbesc?",
            "en": "My name is Amir. Who should I speak to?",
            "fa": "نام من امیر است. با چه کسی باید صحبت کنم؟"
          }
        ]
      },
      {
        "title": {
          "fa": "مسئول و محل",
          "en": "Person and place"
        },
        "explanation": {
          "fa": "Cu cine ...? می‌پرسد «با چه کسی ...؟» و Unde ...? می‌پرسد «کجا ...؟». îl در این مکالمه به مسئول مرد اشاره می‌کند.",
          "en": "Cu cine ...? asks “with whom?”; Unde ...? asks “where?”. Here îl refers to a male team leader."
        },
        "examples": [
          {
            "ro": "Unde îl găsesc?",
            "en": "Where can I find him?",
            "fa": "کجا می‌توانم او را پیدا کنم؟"
          }
        ]
      },
      {
        "title": {
          "fa": "ترتیب شروع",
          "en": "Starting sequence"
        },
        "explanation": {
          "fa": "înainte să încep یعنی «پیش از آنکه شروع کنم». mai întâi یعنی «ابتدا» و apoi یعنی «سپس».",
          "en": "Înainte să încep means “before I start”. Mai întâi is “first” and apoi is “then”."
        },
        "examples": [
          {
            "ro": "Trebuie să mă prezint înainte să încep?",
            "en": "Should I introduce myself before I start?",
            "fa": "باید پیش از شروع خودم را معرفی کنم؟"
          }
        ]
      }
    ],
    "tasks": [
      {
        "ro": "Bună ziua. Sunt nou în echipă.",
        "fa": "سلام. تازه به تیم پیوسته‌ام.",
        "en": "Hello. I am new to the team.",
        "hint": "Bună ziua ..."
      },
      {
        "ro": "Mă numesc Amir. Cu cine trebuie să vorbesc?",
        "fa": "نام من امیر است. با چه کسی باید صحبت کنم؟",
        "en": "My name is Amir. Who should I speak to?",
        "hint": "Mă numesc Amir ..."
      },
      {
        "ro": "Unde îl găsesc?",
        "fa": "کجا می‌توانم او را پیدا کنم؟",
        "en": "Where can I find him?",
        "hint": "Unde îl găsesc ..."
      },
      {
        "ro": "Trebuie să mă prezint înainte să încep?",
        "fa": "باید پیش از شروع خودم را معرفی کنم؟",
        "en": "Should I introduce myself before I start?",
        "hint": "Trebuie să mă prez ..."
      }
    ]
  },
  {
    "slug": "program",
    "title": {
      "fa": "شیفت و زمان استراحت",
      "en": "Shift and break times"
    },
    "goal": {
      "fa": "شروع و پایان شیفت، استراحت و برنامهٔ فردا را تأیید کنید.",
      "en": "Confirm shift times, breaks and tomorrow’s schedule."
    },
    "dialogue": [
      {
        "who": "you",
        "ro": "Bună ziua. La ce oră începe tura mea?",
        "en": "Hello. What time does my shift start?",
        "fa": "سلام. شیفت من چه ساعتی شروع می‌شود؟"
      },
      {
        "who": "colleague",
        "ro": "Tura începe la ora opt.",
        "en": "The shift starts at eight.",
        "fa": "شیفت ساعت هشت شروع می‌شود."
      },
      {
        "who": "you",
        "ro": "Și la ce oră se termină?",
        "en": "And what time does it end?",
        "fa": "و چه ساعتی تمام می‌شود؟"
      },
      {
        "who": "colleague",
        "ro": "Se termină la ora șaisprezece.",
        "en": "It ends at sixteen hundred.",
        "fa": "ساعت شانزده تمام می‌شود."
      },
      {
        "who": "you",
        "ro": "Când avem pauză?",
        "en": "When do we have a break?",
        "fa": "چه زمانی استراحت داریم؟"
      },
      {
        "who": "colleague",
        "ro": "Pauza este la ora doisprezece.",
        "en": "The break is at twelve.",
        "fa": "استراحت ساعت دوازده است."
      },
      {
        "who": "you",
        "ro": "Unde pot vedea programul pentru mâine?",
        "en": "Where can I see tomorrow’s schedule?",
        "fa": "برنامهٔ فردا را کجا می‌توانم ببینم؟"
      },
      {
        "who": "colleague",
        "ro": "Programul este afișat lângă birou.",
        "en": "The schedule is displayed next to the office.",
        "fa": "برنامه کنار دفتر نصب شده است."
      },
      {
        "who": "you",
        "ro": "Am înțeles. Verific programul înainte să plec.",
        "en": "I understand. I will check the schedule before I leave.",
        "fa": "متوجه شدم. پیش از رفتن برنامه را بررسی می‌کنم."
      }
    ],
    "rules": [
      {
        "title": {
          "fa": "شروع و پایان",
          "en": "Start and finish"
        },
        "explanation": {
          "fa": "La ce oră ...? یعنی «چه ساعتی ...؟». începe یعنی «شروع می‌شود» و se termină یعنی «تمام می‌شود».",
          "en": "La ce oră ...? asks “at what time?”. Începe is “starts”; se termină is “ends”."
        },
        "examples": [
          {
            "ro": "Bună ziua. La ce oră începe tura mea?",
            "en": "Hello. What time does my shift start?",
            "fa": "سلام. شیفت من چه ساعتی شروع می‌شود؟"
          }
        ]
      },
      {
        "title": {
          "fa": "زمان استراحت",
          "en": "Break time"
        },
        "explanation": {
          "fa": "Când ...? برای پرسیدن زمان است. pauză اسم مؤنث و pauza صورت مشخص آن، به معنی «آن استراحت»، است.",
          "en": "Când ...? asks when. Pauză is feminine; pauza is its definite form, “the break”."
        },
        "examples": [
          {
            "ro": "Când avem pauză?",
            "en": "When do we have a break?",
            "fa": "چه زمانی استراحت داریم؟"
          }
        ]
      },
      {
        "title": {
          "fa": "برنامهٔ فردا",
          "en": "Tomorrow’s schedule"
        },
        "explanation": {
          "fa": "pentru mâine یعنی «برای فردا». înainte să plec یعنی «پیش از آنکه بروم». ساعت‌ها در این مکالمه نمونه‌اند؛ برنامهٔ خود را از مسئول بپرسید.",
          "en": "Pentru mâine means “for tomorrow”; înainte să plec means “before I leave”. The times are examples; ask your supervisor about your own schedule."
        },
        "examples": [
          {
            "ro": "Unde pot vedea programul pentru mâine?",
            "en": "Where can I see tomorrow’s schedule?",
            "fa": "برنامهٔ فردا را کجا می‌توانم ببینم؟"
          }
        ]
      }
    ],
    "tasks": [
      {
        "ro": "Bună ziua. La ce oră începe tura mea?",
        "fa": "سلام. شیفت من چه ساعتی شروع می‌شود؟",
        "en": "Hello. What time does my shift start?",
        "hint": "Bună ziua ..."
      },
      {
        "ro": "Și la ce oră se termină?",
        "fa": "و چه ساعتی تمام می‌شود؟",
        "en": "And what time does it end?",
        "hint": "Și la ce oră se te ..."
      },
      {
        "ro": "Când avem pauză?",
        "fa": "چه زمانی استراحت داریم؟",
        "en": "When do we have a break?",
        "hint": "Când avem pauză ..."
      },
      {
        "ro": "Unde pot vedea programul pentru mâine?",
        "fa": "برنامهٔ فردا را کجا می‌توانم ببینم؟",
        "en": "Where can I see tomorrow’s schedule?",
        "hint": "Unde pot vedea pro ..."
      }
    ]
  },
  {
    "slug": "instructiuni",
    "title": {
      "fa": "درخواست توضیح و تأیید کار",
      "en": "Clarify and confirm a task"
    },
    "goal": {
      "fa": "وقتی دستور را نفهمیده‌اید، تکرار، نمایش عملی و تأیید بخواهید.",
      "en": "Ask for repetition, a demonstration and confirmation when instructions are unclear."
    },
    "dialogue": [
      {
        "who": "you",
        "ro": "Scuzați-mă, nu am înțeles instrucțiunea.",
        "en": "Excuse me, I did not understand the instruction.",
        "fa": "ببخشید، دستور را متوجه نشدم."
      },
      {
        "who": "colleague",
        "ro": "Ce parte nu este clară?",
        "en": "Which part is unclear?",
        "fa": "کدام قسمت روشن نیست؟"
      },
      {
        "who": "you",
        "ro": "Puteți repeta mai încet, vă rog?",
        "en": "Could you repeat more slowly, please?",
        "fa": "ممکن است لطفاً آهسته‌تر تکرار کنید؟"
      },
      {
        "who": "colleague",
        "ro": "Mai întâi verificați eticheta.",
        "en": "First check the label.",
        "fa": "ابتدا برچسب را بررسی کنید."
      },
      {
        "who": "you",
        "ro": "Puteți să-mi arătați cum se face?",
        "en": "Could you show me how it is done?",
        "fa": "ممکن است به من نشان دهید چطور انجام می‌شود؟"
      },
      {
        "who": "colleague",
        "ro": "Da, priviți acest exemplu.",
        "en": "Yes, look at this example.",
        "fa": "بله، این نمونه را نگاه کنید."
      },
      {
        "who": "you",
        "ro": "Deci verific eticheta înainte să continui?",
        "en": "So I check the label before I continue?",
        "fa": "پس پیش از ادامه برچسب را بررسی می‌کنم؟"
      },
      {
        "who": "colleague",
        "ro": "Da. Dacă aveți o întrebare, cereți ajutor.",
        "en": "Yes. If you have a question, ask for help.",
        "fa": "بله. اگر پرسشی دارید، کمک بخواهید."
      },
      {
        "who": "you",
        "ro": "Mulțumesc. Vă întreb dacă nu sunt sigur.",
        "en": "Thank you. I will ask you if I am unsure.",
        "fa": "ممنون. اگر مطمئن نباشم از شما می‌پرسم."
      }
    ],
    "rules": [
      {
        "title": {
          "fa": "گفتن نفهمیدن",
          "en": "Say you did not understand"
        },
        "explanation": {
          "fa": "Nu am înțeles گذشتهٔ منفی و به معنی «متوجه نشدم» است. instrucțiunea یعنی «آن دستور».",
          "en": "Nu am înțeles is a negative past form meaning “I did not understand”. Instrucțiunea means “the instruction”."
        },
        "examples": [
          {
            "ro": "Scuzați-mă, nu am înțeles instrucțiunea.",
            "en": "Excuse me, I did not understand the instruction.",
            "fa": "ببخشید، دستور را متوجه نشدم."
          }
        ]
      },
      {
        "title": {
          "fa": "درخواست مؤدبانه",
          "en": "Polite request"
        },
        "explanation": {
          "fa": "Puteți ...? برای درخواست مؤدبانه است. mai încet یعنی «آهسته‌تر». să-mi arătați یعنی «به من نشان دهید».",
          "en": "Puteți ...? makes a polite request. Mai încet means “more slowly”; să-mi arătați means “show me”."
        },
        "examples": [
          {
            "ro": "Puteți să-mi arătați cum se face?",
            "en": "Could you show me how it is done?",
            "fa": "ممکن است به من نشان دهید چطور انجام می‌شود؟"
          }
        ]
      },
      {
        "title": {
          "fa": "تأیید برداشت",
          "en": "Confirm your understanding"
        },
        "explanation": {
          "fa": "Deci یعنی «پس». اگر مطمئن نیستید برداشت خود را به صورت پرسش تکرار کنید. مرد می‌گوید sigur و زن می‌گوید sigură.",
          "en": "Deci means “so”. Repeat your understanding as a question when unsure. A man uses sigur; a woman sigură."
        },
        "examples": [
          {
            "ro": "Deci verific eticheta înainte să continui?",
            "en": "So I check the label before I continue?",
            "fa": "پس پیش از ادامه برچسب را بررسی می‌کنم؟"
          }
        ]
      }
    ],
    "tasks": [
      {
        "ro": "Scuzați-mă, nu am înțeles instrucțiunea.",
        "fa": "ببخشید، دستور را متوجه نشدم.",
        "en": "Excuse me, I did not understand the instruction.",
        "hint": "Scuzați-mă, nu am  ..."
      },
      {
        "ro": "Puteți repeta mai încet, vă rog?",
        "fa": "ممکن است لطفاً آهسته‌تر تکرار کنید؟",
        "en": "Could you repeat more slowly, please?",
        "hint": "Puteți repeta mai  ..."
      },
      {
        "ro": "Puteți să-mi arătați cum se face?",
        "fa": "ممکن است به من نشان دهید چطور انجام می‌شود؟",
        "en": "Could you show me how it is done?",
        "hint": "Puteți să-mi arăta ..."
      },
      {
        "ro": "Deci verific eticheta înainte să continui?",
        "fa": "پس پیش از ادامه برچسب را بررسی می‌کنم؟",
        "en": "So I check the label before I continue?",
        "hint": "Deci verific etich ..."
      }
    ]
  }
];

export function getWorkplaceScenario(slug: string) { return workplaceScenarios.find(lesson => lesson.slug === slug); }
