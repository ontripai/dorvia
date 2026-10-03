import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const housingScenarios: EverydayScenario[] = [
  {
    "slug": "vizionare",
    "title": {
      "fa": "هماهنگی بازدید خانه",
      "en": "Arrange a viewing"
    },
    "goal": {
      "fa": "نشانی، زمان بازدید و شخصی که باید ملاقات کنید را روشن کنید.",
      "en": "Confirm the address, viewing time and whom to meet."
    },
    "dialogue": [
      {
        "who": "you",
        "ro": "Bună ziua. Apartamentul din anunț mai este disponibil?",
        "en": "Hello. Is the apartment in the advert still available?",
        "fa": "سلام. آپارتمان آگهی هنوز موجود است؟"
      },
      {
        "who": "owner",
        "ro": "Da, este disponibil. Doriți să îl vedeți?",
        "en": "Yes, it is available. Would you like to see it?",
        "fa": "بله، موجود است. می‌خواهید آن را ببینید؟"
      },
      {
        "who": "you",
        "ro": "Da. Putem stabili o vizionare pentru mâine?",
        "en": "Yes. Can we arrange a viewing for tomorrow?",
        "fa": "بله. می‌توانیم برای فردا بازدید هماهنگ کنیم؟"
      },
      {
        "who": "owner",
        "ro": "Mâine la ora șaptesprezece este bine?",
        "en": "Is tomorrow at seventeen hundred suitable?",
        "fa": "فردا ساعت هفده مناسب است؟"
      },
      {
        "who": "you",
        "ro": "Da. Care este adresa exactă?",
        "en": "Yes. What is the exact address?",
        "fa": "بله. نشانی دقیق چیست؟"
      },
      {
        "who": "owner",
        "ro": "Vă trimit strada, numărul și intrarea.",
        "en": "I will send you the street, number and entrance.",
        "fa": "خیابان، شماره و ورودی را برایتان می‌فرستم."
      },
      {
        "who": "you",
        "ro": "Cu cine mă întâlnesc la intrare?",
        "en": "Who will I meet at the entrance?",
        "fa": "با چه کسی کنار ورودی ملاقات می‌کنم؟"
      },
      {
        "who": "owner",
        "ro": "Vă întâlniți cu mine. Sunați-mă când ajungeți.",
        "en": "You will meet me. Call me when you arrive.",
        "fa": "با من ملاقات می‌کنید. وقتی رسیدید با من تماس بگیرید."
      },
      {
        "who": "you",
        "ro": "Mulțumesc. Confirm vizionarea pentru mâine la ora șaptesprezece.",
        "en": "Thank you. I confirm the viewing for tomorrow at seventeen hundred.",
        "fa": "ممنون. بازدید فردا ساعت هفده را تأیید می‌کنم."
      }
    ],
    "rules": [
      {
        "title": {
          "fa": "موجود بودن",
          "en": "Availability"
        },
        "explanation": {
          "fa": "mai este disponibil? یعنی «هنوز موجود است؟». apartamentul صورت مشخص apartament و اسم خنثی است؛ جمع آن apartamente است.",
          "en": "Mai este disponibil? asks “is it still available?”. Apartamentul is the definite form of the neuter noun apartament; its plural is apartamente."
        },
        "examples": [
          {
            "ro": "Bună ziua. Apartamentul din anunț mai este disponibil?",
            "en": "Hello. Is the apartment in the advert still available?",
            "fa": "سلام. آپارتمان آگهی هنوز موجود است؟"
          }
        ]
      },
      {
        "title": {
          "fa": "هماهنگی زمان",
          "en": "Arrange a time"
        },
        "explanation": {
          "fa": "Putem stabili ...? یعنی «می‌توانیم ... تعیین کنیم؟». o vizionare یعنی «یک بازدید» و pentru mâine یعنی «برای فردا».",
          "en": "Putem stabili ...? means “can we arrange ...?”. O vizionare is “a viewing”; pentru mâine is “for tomorrow”."
        },
        "examples": [
          {
            "ro": "Da. Putem stabili o vizionare pentru mâine?",
            "en": "Yes. Can we arrange a viewing for tomorrow?",
            "fa": "بله. می‌توانیم برای فردا بازدید هماهنگ کنیم؟"
          }
        ]
      },
      {
        "title": {
          "fa": "تأیید نشانی و شخص",
          "en": "Confirm the address and person"
        },
        "explanation": {
          "fa": "Care este ...? یعنی «... چیست؟». Cu cine ...? برای پرسیدن شخص است. نام خیابان، شماره و ورودی را جداگانه دریافت کنید.",
          "en": "Care este ...? asks “what is ...?”. Cu cine ...? asks about the person. Obtain the street, number and entrance separately."
        },
        "examples": [
          {
            "ro": "Cu cine mă întâlnesc la intrare?",
            "en": "Who will I meet at the entrance?",
            "fa": "با چه کسی کنار ورودی ملاقات می‌کنم؟"
          }
        ]
      }
    ],
    "tasks": [
      {
        "ro": "Bună ziua. Apartamentul din anunț mai este disponibil?",
        "fa": "سلام. آپارتمان آگهی هنوز موجود است؟",
        "en": "Hello. Is the apartment in the advert still available?",
        "hint": "Bună ziua. Apartam ..."
      },
      {
        "ro": "Da. Putem stabili o vizionare pentru mâine?",
        "fa": "بله. می‌توانیم برای فردا بازدید هماهنگ کنیم؟",
        "en": "Yes. Can we arrange a viewing for tomorrow?",
        "hint": "Da. Putem stabili  ..."
      },
      {
        "ro": "Da. Care este adresa exactă?",
        "fa": "بله. نشانی دقیق چیست؟",
        "en": "Yes. What is the exact address?",
        "hint": "Da. Care este adre ..."
      },
      {
        "ro": "Cu cine mă întâlnesc la intrare?",
        "fa": "با چه کسی کنار ورودی ملاقات می‌کنم؟",
        "en": "Who will I meet at the entrance?",
        "hint": "Cu cine mă întâlne ..."
      }
    ]
  },
  {
    "slug": "costuri",
    "title": {
      "fa": "هزینه‌ها و امکانات خانه",
      "en": "Costs and apartment facilities"
    },
    "goal": {
      "fa": "اجاره، هزینه‌های جداگانه، ضمانت و امکانات را پیش از تصمیم روشن کنید.",
      "en": "Clarify rent, separate costs, deposit and facilities before deciding."
    },
    "dialogue": [
      {
        "who": "you",
        "ro": "Cât este chiria lunară?",
        "en": "How much is the monthly rent?",
        "fa": "اجارهٔ ماهانه چقدر است؟"
      },
      {
        "who": "owner",
        "ro": "Suma este cea din anunț.",
        "en": "The amount is the one in the advert.",
        "fa": "مبلغ همان مبلغ آگهی است."
      },
      {
        "who": "you",
        "ro": "Utilitățile sunt incluse sau se plătesc separat?",
        "en": "Are utilities included or paid separately?",
        "fa": "هزینه‌های خدمات در اجاره هستند یا جدا پرداخت می‌شوند؟"
      },
      {
        "who": "owner",
        "ro": "Se plătesc separat. Vă pot arăta facturile recente.",
        "en": "They are paid separately. I can show you recent bills.",
        "fa": "جدا پرداخت می‌شوند. می‌توانم صورتحساب‌های اخیر را نشان بدهم."
      },
      {
        "who": "you",
        "ro": "Ce garanție solicitați?",
        "en": "What deposit do you ask for?",
        "fa": "چه مبلغ ضمانتی می‌خواهید؟"
      },
      {
        "who": "owner",
        "ro": "Discutăm suma și condițiile în scris.",
        "en": "We will discuss the amount and conditions in writing.",
        "fa": "دربارهٔ مبلغ و شرایط به صورت مکتوب صحبت می‌کنیم."
      },
      {
        "who": "you",
        "ro": "Apartamentul este mobilat? Cum funcționează încălzirea?",
        "en": "Is the apartment furnished? How does the heating work?",
        "fa": "آپارتمان مبله است؟ گرمایش چگونه کار می‌کند؟"
      },
      {
        "who": "owner",
        "ro": "Este mobilat. Vă arăt sistemul de încălzire la vizionare.",
        "en": "It is furnished. I will show you the heating system during the viewing.",
        "fa": "مبله است. سیستم گرمایش را هنگام بازدید نشان می‌دهم."
      },
      {
        "who": "you",
        "ro": "Aș dori lista costurilor și condițiile în scris, vă rog.",
        "en": "I would like the list of costs and the conditions in writing, please.",
        "fa": "لطفاً فهرست هزینه‌ها و شرایط را به صورت مکتوب می‌خواهم."
      }
    ],
    "rules": [
      {
        "title": {
          "fa": "اجارهٔ ماهانه",
          "en": "Monthly rent"
        },
        "explanation": {
          "fa": "chirie اسم مؤنث با جمع chirii است. chiria صورت مشخص آن است. Cât este ...? مبلغ را می‌پرسد.",
          "en": "Chirie is a feminine noun, plural chirii. Chiria is its definite form. Cât este ...? asks the amount."
        },
        "examples": [
          {
            "ro": "Cât este chiria lunară?",
            "en": "How much is the monthly rent?",
            "fa": "اجارهٔ ماهانه چقدر است؟"
          }
        ]
      },
      {
        "title": {
          "fa": "هزینهٔ شامل یا جدا",
          "en": "Included or separate costs"
        },
        "explanation": {
          "fa": "sunt incluse با utilitățile که جمع مؤنث است تطابق دارد. separat یعنی «جداگانه». این جمله را برای روشن‌کردن هزینه‌های واقعی بپرسید.",
          "en": "Sunt incluse agrees with feminine plural utilitățile. Separat means “separately”. Ask this to clarify the actual costs."
        },
        "examples": [
          {
            "ro": "Utilitățile sunt incluse sau se plătesc separat?",
            "en": "Are utilities included or paid separately?",
            "fa": "هزینه‌های خدمات در اجاره هستند یا جدا پرداخت می‌شوند؟"
          }
        ]
      },
      {
        "title": {
          "fa": "شرایط مکتوب",
          "en": "Written conditions"
        },
        "explanation": {
          "fa": "Aș dori ... درخواست مؤدبانهٔ «می‌خواهم ...» است. în scris یعنی «به صورت مکتوب». این درس شرایط حقوقی مشخصی برای ضمانت تعیین نمی‌کند.",
          "en": "Aș dori ... is a polite “I would like ...”. În scris means “in writing”. This lesson does not set specific legal deposit conditions."
        },
        "examples": [
          {
            "ro": "Aș dori lista costurilor și condițiile în scris, vă rog.",
            "en": "I would like the list of costs and the conditions in writing, please.",
            "fa": "لطفاً فهرست هزینه‌ها و شرایط را به صورت مکتوب می‌خواهم."
          }
        ]
      }
    ],
    "tasks": [
      {
        "ro": "Cât este chiria lunară?",
        "fa": "اجارهٔ ماهانه چقدر است؟",
        "en": "How much is the monthly rent?",
        "hint": "Cât este chiria lu ..."
      },
      {
        "ro": "Utilitățile sunt incluse sau se plătesc separat?",
        "fa": "هزینه‌های خدمات در اجاره هستند یا جدا پرداخت می‌شوند؟",
        "en": "Are utilities included or paid separately?",
        "hint": "Utilitățile sunt i ..."
      },
      {
        "ro": "Ce garanție solicitați?",
        "fa": "چه مبلغ ضمانتی می‌خواهید؟",
        "en": "What deposit do you ask for?",
        "hint": "Ce garanție solici ..."
      },
      {
        "ro": "Apartamentul este mobilat? Cum funcționează încălzirea?",
        "fa": "آپارتمان مبله است؟ گرمایش چگونه کار می‌کند؟",
        "en": "Is the apartment furnished? How does the heating work?",
        "hint": "Apartamentul este  ..."
      }
    ]
  },
  {
    "slug": "problema",
    "title": {
      "fa": "گزارش مشکل و هماهنگی تعمیر",
      "en": "Report a problem and arrange a repair"
    },
    "goal": {
      "fa": "مشکل، محل و زمان آن را بیان کنید و زمان مراجعه و پیگیری بخواهید.",
      "en": "Explain what happened, where and when, then arrange a visit and follow-up."
    },
    "dialogue": [
      {
        "who": "you",
        "ro": "Bună ziua. Am o problemă în apartament.",
        "en": "Hello. I have a problem in the apartment.",
        "fa": "سلام. در آپارتمان مشکلی دارم."
      },
      {
        "who": "owner",
        "ro": "Ce s-a întâmplat?",
        "en": "What happened?",
        "fa": "چه اتفاقی افتاده است؟"
      },
      {
        "who": "you",
        "ro": "Robinetul din baie curge de ieri.",
        "en": "The bathroom tap has been leaking since yesterday.",
        "fa": "شیر حمام از دیروز نشت می‌کند."
      },
      {
        "who": "owner",
        "ro": "Puteți trimite o fotografie?",
        "en": "Can you send a photograph?",
        "fa": "می‌توانید یک عکس بفرستید؟"
      },
      {
        "who": "you",
        "ro": "Da. Când poate veni cineva să verifice?",
        "en": "Yes. When can someone come to check?",
        "fa": "بله. چه زمانی کسی می‌تواند برای بررسی بیاید؟"
      },
      {
        "who": "owner",
        "ro": "Verific disponibilitatea și vă confirm ora.",
        "en": "I will check availability and confirm the time.",
        "fa": "زمان آزاد را بررسی می‌کنم و ساعت را به شما تأیید می‌کنم."
      },
      {
        "who": "you",
        "ro": "Vă rog să mă anunțați înainte de vizită.",
        "en": "Please let me know before the visit.",
        "fa": "لطفاً پیش از مراجعه به من اطلاع دهید."
      },
      {
        "who": "owner",
        "ro": "Sigur. Stabilim împreună ora vizitei.",
        "en": "Of course. We will agree on the visit time together.",
        "fa": "حتماً. زمان مراجعه را با هم هماهنگ می‌کنیم."
      },
      {
        "who": "you",
        "ro": "Mulțumesc. Aștept confirmarea și păstrez mesajul.",
        "en": "Thank you. I will wait for confirmation and keep the message.",
        "fa": "ممنون. منتظر تأیید می‌مانم و پیام را نگه می‌دارم."
      }
    ],
    "rules": [
      {
        "title": {
          "fa": "بیان مشکل",
          "en": "Describe the problem"
        },
        "explanation": {
          "fa": "Am o problemă یعنی «مشکلی دارم». Ce s-a întâmplat? سؤال دربارهٔ اتفاق گذشته است و به معنی «چه اتفاقی افتاده؟» است.",
          "en": "Am o problemă means “I have a problem”. Ce s-a întâmplat? asks about a past event: “what happened?”."
        },
        "examples": [
          {
            "ro": "Bună ziua. Am o problemă în apartament.",
            "en": "Hello. I have a problem in the apartment.",
            "fa": "سلام. در آپارتمان مشکلی دارم."
          }
        ]
      },
      {
        "title": {
          "fa": "محل و زمان",
          "en": "Place and time"
        },
        "explanation": {
          "fa": "din baie یعنی «در حمام» برای مشخص‌کردن شیر موردنظر. de ieri یعنی «از دیروز». robinet اسم خنثی و جمع آن robinete است.",
          "en": "Din baie identifies the bathroom tap; de ieri means “since yesterday”. Robinet is neuter, plural robinete."
        },
        "examples": [
          {
            "ro": "Robinetul din baie curge de ieri.",
            "en": "The bathroom tap has been leaking since yesterday.",
            "fa": "شیر حمام از دیروز نشت می‌کند."
          }
        ]
      },
      {
        "title": {
          "fa": "هماهنگی مراجعه",
          "en": "Arrange the visit"
        },
        "explanation": {
          "fa": "Vă rog să ... یعنی «لطفاً ...». înainte de vizită یعنی «پیش از مراجعه». زمان مراجعه را صریح تأیید کنید.",
          "en": "Vă rog să ... means “please ...”. Înainte de vizită means “before the visit”. Confirm the visit time explicitly."
        },
        "examples": [
          {
            "ro": "Vă rog să mă anunțați înainte de vizită.",
            "en": "Please let me know before the visit.",
            "fa": "لطفاً پیش از مراجعه به من اطلاع دهید."
          }
        ]
      }
    ],
    "tasks": [
      {
        "ro": "Bună ziua. Am o problemă în apartament.",
        "fa": "سلام. در آپارتمان مشکلی دارم.",
        "en": "Hello. I have a problem in the apartment.",
        "hint": "Bună ziua. Am o pr ..."
      },
      {
        "ro": "Robinetul din baie curge de ieri.",
        "fa": "شیر حمام از دیروز نشت می‌کند.",
        "en": "The bathroom tap has been leaking since yesterday.",
        "hint": "Robinetul din baie ..."
      },
      {
        "ro": "Da. Când poate veni cineva să verifice?",
        "fa": "بله. چه زمانی کسی می‌تواند برای بررسی بیاید؟",
        "en": "Yes. When can someone come to check?",
        "hint": "Da. Când poate ven ..."
      },
      {
        "ro": "Vă rog să mă anunțați înainte de vizită.",
        "fa": "لطفاً پیش از مراجعه به من اطلاع دهید.",
        "en": "Please let me know before the visit.",
        "hint": "Vă rog să mă anunț ..."
      }
    ]
  }
];

export function getHousingScenario(slug: string) { return housingScenarios.find(lesson => lesson.slug === slug); }
