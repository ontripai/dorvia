export type Bilingual = { fa: string; en: string };
type Example = { ro: string; fa: string; en: string };
export type Lesson = {
  title: Bilingual; goal: Bilingual; introduction: Bilingual;
  rules: Array<{ title: Bilingual; explanation: Bilingual; examples: Example[] }>;
  table: { headers: Bilingual[]; rows: Array<{ cells: string[]; note: Bilingual }> };
  practice: Array<{ meaning: Bilingual; answer: string; hint: Bilingual }>;
  next: string;
};

const B = (fa: string, en: string): Bilingual => ({ fa, en });
const E = (ro: string, fa: string, en: string): Example => ({ ro, fa, en });

export const additionalFoundationLessons = {
  moarefe: {
    title: B('سلام، معرفی خود و خطاب محترمانه', 'Greetings, introductions, and polite address'),
    goal: B('نام، کشور و شغل خود را در گفت‌وگوی کوتاه بیان کنید.', 'Give your name, country, and job in a short exchange.'),
    introduction: B('سلام و معرفی، اولین کاربرد جملهٔ ساده است. در برخورد رسمی از عبارت‌های مؤدبانه و فعل دوم‌شخص جمع استفاده کنید؛ برای دوست و هم‌سن‌وسال، شکل خودمانی مناسب است. هنگام معرفی، من با sunt و شما با sunteți می‌آید.', 'Greetings make the first useful sentences. Use polite expressions and the second-person plural verb form in formal encounters; use informal forms with friends. In introductions, I takes sunt and polite you takes sunteți.'),
    rules: [
      { title: B('سلام و خداحافظی', 'Greeting and leave-taking'), explanation: B('Bună ziua در طول روز مؤدبانه است؛ Bună خودمانی است. La revedere برای خداحافظی در هر دو موقعیت کاربرد دارد.', 'Bună ziua is polite during the day; Bună is informal. La revedere is a useful goodbye in both settings.'), examples: [E('Bună ziua!','روز بخیر!','Good day!'), E('La revedere!','خداحافظ!','Goodbye!')] },
      { title: B('نام، کشور و شغل', 'Name, country, and job'), explanation: B('برای معرفی نام بگویید Eu sunt Ana. برای کشور از Sunt din ... و برای شغل از Sunt ... استفاده کنید. در همهٔ این جمله‌ها فقط شکل‌های فعل a fi را به کار می‌برید.', 'Introduce your name with Eu sunt Ana. Use Sunt din ... for origin and Sunt ... for a job. These sentences use only forms of a fi.'), examples: [E('Eu sunt Ana.','من آنا هستم.','I am Ana.'), E('Sunt din Iran.','من اهل ایران هستم.','I am from Iran.'), E('Sunt studentă.','من دانشجو هستم (زن).','I am a student (woman).')] },
      { title: B('سوم‌شخص مفرد و جمع', 'Singular and plural third person'), explanation: B('el و ea به یک مرد یا زن اشاره می‌کنند و با este می‌آیند. ei برای مردان یا گروه ترکیبی و ele برای گروه مؤنث است؛ هر دو با sunt می‌آیند. وقتی جنس یا شخص از بافت روشن نباشد، ضمیر را نگه دارید.', 'El and ea refer to masculine or feminine singular subjects and both take este. Ei refers to masculine or mixed groups; ele to feminine groups. Both take sunt. Keep the pronoun when context does not identify the subject.'), examples: [E('El este aici.','او (مرد) اینجا است.','He is here.'),E('Ea este aici.','او (زن) اینجا است.','She is here.'),E('Ei sunt aici.','آن‌ها (مردان یا گروه ترکیبی) اینجا هستند.','They (masculine or mixed) are here.'),E('Ele sunt aici.','آن‌ها (زنان) اینجا هستند.','They (women) are here.')] },
      { title: B('رسمی یا خودمانی', 'Formal or informal'), explanation: B('برای یک دوست می‌گوییم Tu ești ...؛ برای خطاب محترمانه به یک نفر نیز Dumneavoastră sunteți ... . فعل رسمی همان شکل جمع است.', 'Say Tu ești ... to a friend; address one person politely with Dumneavoastră sunteți ... . The polite verb has the plural form.'), examples: [E('Dumneavoastră sunteți profesor?','آیا شما معلم هستید؟ (محترمانه)','Are you a teacher? (polite)')] },
    ],
    table: { headers: [B('ضمیر فاعلی','Subject pronoun'),B('a fi · بودن','a fi · to be')], rows: [
      {cells:['eu','sunt'],note:B('من','I')},{cells:['tu','ești'],note:B('تو؛ خودمانی','you; informal')},
      {cells:['el','este'],note:B('او؛ مذکر','he')},{cells:['ea','este'],note:B('او؛ مؤنث','she')},{cells:['noi','suntem'],note:B('ما','we')},
      {cells:['voi','sunteți'],note:B('شما؛ جمع خودمانی','you; plural informal')},
      {cells:['ei','sunt'],note:B('آن‌ها؛ مذکر یا گروه ترکیبی','they; masculine or mixed')},{cells:['ele','sunt'],note:B('آن‌ها؛ گروه مؤنث','they; feminine')},
      {cells:['dumneavoastră','sunteți'],note:B('شما؛ محترمانه برای یک یا چند نفر','you; polite singular or plural')},
    ] },
    practice: [
      { meaning: B('من آنا هستم.','I am Ana.'), answer: 'Eu sunt Ana.', hint: B('با Eu sunt شروع کنید.','Start with Eu sunt.') },
      { meaning: B('من اهل ایران هستم.','I am from Iran.'), answer: 'Sunt din Iran.', hint: B('برای «اهلِ» از din استفاده کنید.','Use din for origin.') },
    ], next: '/learn-romanian/fundamente/porsesh',
  },
  porsesh: {
    title: B('سؤال‌سازی و پاسخ کوتاه', 'Questions and short answers'), goal: B('دربارهٔ شخص، چیز، مکان و چگونگی سؤال بپرسید.', 'Ask about a person, thing, place, and manner.'),
    introduction: B('واژهٔ پرسشی را در آغاز جمله بیاورید، سپس فعل مناسب را بگذارید. برای پرسش بله/خیر می‌توان همان ترتیب خبری را با آهنگ پرسشی و علامت سؤال آورد. پاسخ را نخست کوتاه و سپس با یک جملهٔ کامل بیان کنید.', 'Put a question word at the beginning, followed by a suitable verb. A yes/no question can retain statement order with question intonation and a question mark. Give a short reply, then a complete sentence.'),
    rules: [
      { title: B('چه کسی، چه چیز، کجا', 'Who, what, where'), explanation: B('cine برای شخص، ce برای چیز، unde برای مکان و de unde برای مبدأ است. در سؤال، فعل باید با فاعل جمله هماهنگ باشد.', 'Cine asks about a person, ce about a thing, unde about a place, and de unde about origin. Match the verb to the subject.'), examples: [E('Cine este aici?','چه کسی اینجا است؟','Who is here?'),E('Unde este biletul?','بلیت کجاست؟','Where is the ticket?'),E('De unde sunteți?','اهل کجا هستید؟ (محترمانه)','Where are you from? (polite)')] },
      { title: B('چگونه و بله/خیر', 'How and yes/no'), explanation: B('cum یعنی چگونه. برای تأیید یا رد، Da / Nu بگویید و سپس پاسخ روشن بدهید: Da, am un bilet. یا Nu, nu am un bilet.', 'Cum means how. For yes/no, say Da / Nu and then a clear sentence: Da, am un bilet. or Nu, nu am un bilet.'), examples: [E('Cum sunteți?','حال شما چطور است؟','How are you?'),E('Aveți un bilet?','آیا بلیت دارید؟','Do you have a ticket?')] },
    ],
    table: { headers: [B('واژه','Word'),B('کاربرد','Use')], rows: [
      {cells:['cine','person'],note:B('چه کسی؟','Who?')},{cells:['ce','thing'],note:B('چه؟','What?')},{cells:['unde / de unde','place / origin'],note:B('کجا / اهل کجا؟','Where / from where?')},{cells:['cum','manner'],note:B('چگونه؟','How?')},
    ] },
    practice: [
      {meaning:B('چه کسی اینجا است؟','Who is here?'),answer:'Cine este aici?',hint:B('cine + este + aici','cine + este + aici')},
      {meaning:B('آیا بلیت دارید؟ (محترمانه)','Do you have a ticket? (polite)'),answer:'Aveți un bilet?',hint:B('صورت محترمانهٔ a avea برابر aveți است.','The polite a avea form is aveți.')},
    ], next:'/learn-romanian/fundamente/nafi',
  },
  nafi: {
    title:B('منفی‌سازی و پاسخ بله یا خیر','Negation and yes/no answers'),goal:B('یک جملهٔ مثبت را منفی کنید و پاسخ روشن بدهید.','Negate a positive sentence and give a clear answer.'),
    introduction:B('در جملهٔ ساده، nu درست پیش از فعل صرف‌شده می‌آید. اگر ضمیر فاعلی را حذف کنید، جای nu تغییر نمی‌کند. در پاسخ کوتاه، Nu به‌تنهایی «نه» است؛ در جملهٔ منفی دوباره nu را کنار فعل می‌آوریم.', 'In a simple sentence, nu goes immediately before the conjugated verb. Omitting the subject does not move nu. In a short answer, Nu means “no”; repeat nu before the verb in a full negative sentence.'),
    rules:[
      {title:B('جای nu','Where nu goes'),explanation:B('الگو: (فاعل) + nu + فعل + بقیهٔ جمله. منفی‌ساز پیش از am و sunt قرار می‌گیرد، نه پس از مفعول یا در پایان جمله.', 'Pattern: (subject) + nu + verb + the rest. Put nu before am and sunt, not after the object or at the end.'),examples:[E('Eu nu am un bilet.','من بلیت ندارم.','I do not have a ticket.'),E('Ea nu este aici.','او اینجا نیست.','She is not here.')]},
      {title:B('پاسخ کوتاه و کامل','Short and complete replies'),explanation:B('پس از سؤال، پاسخ مثبت را با Da و پاسخ منفی را با Nu آغاز کنید. شکل فعل را با شخص پاسخ‌دهنده هماهنگ کنید: پرسش Aveți? اما پاسخ Am / Nu am.', 'Begin positive answers with Da and negative ones with Nu. Adjust the verb to the respondent: the question Aveți? can receive Am / Nu am.'),examples:[E('Aveți un bilet? Da, am un bilet.','بلیت دارید؟ بله، بلیت دارم.','Do you have a ticket? Yes, I do.'),E('Aveți un bilet? Nu, nu am un bilet.','بلیت دارید؟ نه، بلیت ندارم.','Do you have a ticket? No, I do not.')]},
    ],
    table:{headers:[B('مثبت','Positive'),B('منفی','Negative')],rows:[{cells:['Am un bilet.','Nu am un bilet.'],note:B('دارم ← ندارم','I have ← I do not have')},{cells:['Ea este aici.','Ea nu este aici.'],note:B('اینجا است ← اینجا نیست','She is here ← She is not here')}]},
    practice:[{meaning:B('من بلیت ندارم.','I do not have a ticket.'),answer:'Nu am un bilet.',hint:B('nu را پیش از am بگذارید.','Place nu before am.')},{meaning:B('او (زن) اینجا نیست.','She is not here.'),answer:'Ea nu este aici.',hint:B('ea + nu + este','ea + nu + este')}],next:'/learn-romanian/fundamente/articole',
  },
  articole: {
    title:B('اسم نامعین و معین','Indefinite and definite nouns'),goal:B('فرق «یک بلیت» و «بلیتِ مشخص» را بیان کنید.','Distinguish “a ticket” from “the ticket”.'),
    introduction:B('در رومانیایی «یک» پیش از اسم می‌آید: un bilet، o carte. اما نشانهٔ اسم معین معمولاً به پایان اسم می‌چسبد: biletul، cartea. صورت‌های جمع و تغییرهای املایی را باید همراه هر اسم یاد گرفت. «معین» یعنی شنونده می‌داند دربارهٔ کدام چیز حرف می‌زنیم.', 'Romanian puts the indefinite article before the noun: un bilet, o carte. The definite article usually attaches to the noun: biletul, cartea. Learn plural and spelling changes with each noun. “Definite” means the listener can identify the item.'),
    rules:[
      {title:B('نامعین: un / o / niște','Indefinite: un / o / niște'),explanation:B('un برای مفرد مذکر و خنثی، o برای مفرد مؤنث است. niște برای جمع نامعین کاربرد دارد. جنس اسم را همراه خود واژه یاد بگیرید.', 'Use un for masculine and neuter singular, o for feminine singular, and niște for indefinite plurals. Learn each noun together with its gender.'),examples:[E('Am un bilet.','یک بلیت دارم.','I have a ticket.'),E('Am o carte.','یک کتاب دارم.','I have a book.'),E('Am niște bilete.','چند بلیت دارم.','I have some tickets.')]},
      {title:B('معین: پسوندِ اسم','Definite: a noun ending'),explanation:B('در این نمونه‌ها un bilet به biletul و o carte به cartea تبدیل می‌شود. حرف تعریف معین واژهٔ جداگانه نیست؛ شکل اسم تغییر می‌کند.', 'In these examples un bilet becomes biletul and o carte becomes cartea. The definite article is not a separate word; the noun changes form.'),examples:[E('Biletul este aici.','بلیت اینجاست.','The ticket is here.'),E('Cartea este aici.','کتاب اینجاست.','The book is here.')]},
    ],
    table:{headers:[B('نامعین','Indefinite'),B('معین','Definite')],rows:[{cells:['un bilet','biletul'],note:B('بلیت؛ خنثی مفرد','ticket; neuter singular')},{cells:['o carte','cartea'],note:B('کتاب؛ مؤنث مفرد','book; feminine singular')},{cells:['niște bilete','biletele'],note:B('بلیت‌ها؛ جمع','tickets; plural')}]},
    practice:[{meaning:B('بلیت اینجاست.','The ticket is here.'),answer:'Biletul este aici.',hint:B('صورت معین bilet برابر biletul است.','The definite form of bilet is biletul.')},{meaning:B('یک کتاب دارم.','I have a book.'),answer:'Am o carte.',hint:B('carte مؤنث است؛ o را پیش از آن بگذارید.','Carte is feminine; use o before carte.') }],next:'/learn-romanian/fundamente/verbe',
  },
  verbe: {
    title:B('دو فعل پایه: بودن و داشتن','Two foundation verbs: to be and to have'),goal:B('a fi و a avea را برای همهٔ ضمیرها صرف کنید و با آن‌ها جمله بسازید.','Conjugate a fi and a avea for every subject and build sentences with them.'),
    introduction:B('در مسیر پایه فقط دو فعل a fi (بودن) و a avea (داشتن) را تمرین می‌کنیم. مصدر با a آغاز می‌شود؛ در جمله باید شکل مناسب فاعل را از جدول بردارید. فعل‌های حرکت و کار در درس‌های روزمره خواهند آمد.', 'The foundation path uses only a fi (to be) and a avea (to have). Infinitives begin with a; choose the form matching the subject in a sentence. Action and movement verbs belong in everyday lessons.'),
    rules:[
      {title:B('a fi برای هویت، حالت و مکان','a fi for identity, state, and place'),explanation:B('eu sunt، tu ești، el/ea este، noi suntem، voi/dumneavoastră sunteți، ei/ele sunt. فاعل و فعل را با هم بخوانید؛ برای یک نفرِ محترمانه نیز sunteți می‌آید.', 'Learn eu sunt, tu ești, el/ea este, noi suntem, voi/dumneavoastră sunteți, and ei/ele sunt. Polite singular address also takes sunteți.'),examples:[E('Eu sunt studentă.','من دانشجو هستم (زن).','I am a student.'),E('Ea este în București.','او در بخارست است.','She is in Bucharest.'),E('Dumneavoastră sunteți aici.','شما (محترمانه) اینجا هستید.','You are here (polite).')]},
      {title:B('a avea برای داشتن','a avea for possession'),explanation:B('eu am، tu ai، el/ea are، noi avem، voi/dumneavoastră aveți، ei/ele au. مفعول پس از فعل می‌آید: Noi avem două bilete. شکل سوم‌شخص جمع au است.', 'Learn eu am, tu ai, el/ea are, noi avem, voi/dumneavoastră aveți, and ei/ele au. The object follows the verb: Noi avem două bilete. Third-person plural takes au.'),examples:[E('Eu am un bilet.','من یک بلیت دارم.','I have a ticket.'),E('Noi avem două bilete.','ما دو بلیت داریم.','We have two tickets.'),E('Ei au o carte.','آن‌ها یک کتاب دارند.','They have a book.')]},
    ],
    table:{headers:[B('فاعل','Subject'),B('a fi · بودن','to be'),B('a avea · داشتن','to have')],rows:[
      {cells:['eu','sunt','am'],note:B('من','I')},
      {cells:['tu','ești','ai'],note:B('تو','you, singular')},
      {cells:['el / ea','este','are'],note:B('او؛ مذکر / مؤنث','he / she')},
      {cells:['noi','suntem','avem'],note:B('ما','we')},
      {cells:['voi / dumneavoastră','sunteți','aveți'],note:B('شما؛ دوستانه / محترمانه','you, plural / polite')},
      {cells:['ei / ele','sunt','au'],note:B('آن‌ها؛ مذکر / مؤنث','they, masculine / feminine')},
    ]},
    practice:[{meaning:B('من دانشجو هستم.','I am a student.'),answer:'Eu sunt student.',hint:B('eu + sunt + student','eu + sunt + student')},{meaning:B('او (زن) در بخارست است.','She is in Bucharest.'),answer:'Ea este în București.',hint:B('ea + este + în București','ea + este + în București')},{meaning:B('ما دو بلیت داریم.','We have two tickets.'),answer:'Noi avem două bilete.',hint:B('noi + avem + două bilete','noi + avem + două bilete')}],next:'/learn-romanian/fundamente/locatie',
  },
  locatie: {
    title:B('مکان و حروف اضافهٔ پایه','Places and basic prepositions'),goal:B('جای خود یا یک شیء را در جمله بیان کنید.','Say where you or an object are.'),
    introduction:B('برای جواب دادن به «کجا؟» از a fi و یک عبارت مکانی استفاده کنید. în برای «درون»، pe برای «روی»، lângă برای «کنار»، sub برای «زیر» و la برای مکان‌هایی مانند مدرسه می‌آید. در این درس فقط مکان ثابت را توصیف می‌کنیم.', 'Answer “Where?” with a fi and a place phrase. Use în for inside, pe for on, lângă for beside, sub for under, and la for places such as school. Here we describe a fixed location.'),
    rules:[
      {title:B('در، روی، کنار، زیر','In, on, beside, under'),explanation:B('برای جای ثابت، الگوی سادهٔ اسم + este + عبارت مکانی را به کار ببرید. صورت اسم پس از حرف اضافه بسته به معنی و معرفه‌بودن آن تغییر می‌کند؛ فعلاً هر عبارت را یک‌جا بخوانید.', 'For a fixed position, use noun + este + place phrase. Noun forms after prepositions vary with meaning and definiteness; learn each phrase as a unit for now.'),examples:[E('Cartea este pe masă.','کتاب روی میز است.','The book is on the table.'),E('Biletul este în geantă.','بلیت در کیف است.','The ticket is in the bag.'),E('Cartea este lângă telefon.','کتاب کنار تلفن است.','The book is beside the phone.')]},
      {title:B('مکان با la و în','Location with la and în'),explanation:B('برای حضور در مدرسه می‌گوییم Sunt la școală. برای حضور در شهر می‌گوییم Sunt în București. در درس روزمره بعداً حرکت و مقصد را با فعل‌های دیگر یاد می‌گیرید.', 'Say Sunt la școală for being at school and Sunt în București for being in the city. Everyday lessons will later introduce movement and destinations with other verbs.'),examples:[E('Eu sunt la școală.','من در مدرسه هستم.','I am at school.'),E('Ea este în București.','او در بخارست است.','She is in Bucharest.')]},
    ],
    table:{headers:[B('حرف اضافه','Preposition'),B('عبارت','Phrase')],rows:[{cells:['în','în geantă'],note:B('در کیف','in the bag')},{cells:['pe','pe masă'],note:B('روی میز','on the table')},{cells:['lângă','lângă telefon'],note:B('کنار تلفن','beside the phone')},{cells:['sub','sub masă'],note:B('زیر میز','under the table')},{cells:['la','la școală'],note:B('به / در مدرسه','to / at school')}]},
    practice:[{meaning:B('کتاب روی میز است.','The book is on the table.'),answer:'Cartea este pe masă.',hint:B('cartea + este + pe masă','cartea + este + pe masă')},{meaning:B('من در مدرسه هستم.','I am at school.'),answer:'Eu sunt la școală.',hint:B('eu + sunt + la școală','eu + sunt + la școală')}],next:'/learn-romanian/fundamente/numere-pret',
  },
  'numere-pret': {
    title:B('عدد، مقدار و قیمت','Numbers, quantities, and prices'),goal:B('تعداد و قیمت ساده را بپرسید و بگویید.','Ask and state a simple quantity and price.'),
    introduction:B('اعداد را کنار اسم به کار ببرید. برای «چند؟» صورت câți را با جمع مذکر و câte را با جمع مؤنث یا خنثی هماهنگ کنید. برای پرسیدن قیمت در این درس از «Cât este ...?» و برای پاسخ از «Prețul ... este ...» استفاده می‌کنیم.', 'Use numbers with nouns. Match câți to masculine plurals and câte to feminine or neuter plurals. Ask a price here with Cât este ...? and answer with Prețul ... este ... .'),
    rules:[
      {title:B('یک و دو کنار اسم','One and two with nouns'),explanation:B('un bilet، o carte، doi elevi و două bilete. اسم خنثی در مفرد با un و در جمع با două می‌آید.', 'Use un bilet, o carte, doi elevi, and două bilete. Neuter nouns take un in the singular and două in the plural.'),examples:[E('Am două bilete.','دو بلیت دارم.','I have two tickets.'),E('Am o carte.','یک کتاب دارم.','I have one book.')]},
      {title:B('چندتا و چقدر؟','How many and how much?'),explanation:B('Câți برای جمع مذکر مانند elevi و Câte برای bilete یا cărți است. قیمت یک بلیت را می‌توان با Cât este biletul? پرسید.', 'Use Câți with masculine plurals such as elevi, and Câte with bilete or cărți. Ask a ticket price with Cât este biletul?'),examples:[E('Câte bilete aveți?','چند بلیت دارید؟','How many tickets do you have?'),E('Cât este biletul?','بلیت چند لئو است؟','How much is the ticket?')]},
      {title:B('ساخت عددهای بزرگ‌تر','Building larger numbers'),explanation:B('عددهای ۱۱ تا ۱۹ و دهگان‌ها را در جدول بخوانید. برای ۲۱، «بیست و یک» را با și وصل می‌کنیم: douăzeci și unu. برای قیمت می‌گوییم Prețul biletului este zece lei. شکل عدد یک و دو کنار اسم با جنس آن هماهنگ می‌شود.', 'Read 11–19 and the tens in the table. Join tens and units with și, as in douăzeci și unu (21). For a price say Prețul biletului este zece lei. One and two next to a noun depend on its gender.'),examples:[E('Am douăzeci și unu de bilete.','بیست و یک بلیت دارم.','I have twenty-one tickets.'),E('Prețul biletului este zece lei.','قیمت بلیت ده لئو است.','The ticket price is ten lei.')]},
    ],
    table:{headers:[B('عدد / پرسش','Number / question'),B('صورت رومانیایی یا نمونه','Romanian form or example')],rows:[{cells:['۰–۵','zero, unu/una, doi/două, trei, patru, cinci'],note:B('یک و دو با اسم هماهنگ می‌شوند','one and two agree with the noun')},{cells:['۶–۱۰','șase, șapte, opt, nouă, zece'],note:B('شش تا ده','six to ten')},{cells:['۱۱–۱۹','unsprezece, doisprezece, treisprezece, paisprezece, cincisprezece, șaisprezece, șaptesprezece, optsprezece, nouăsprezece'],note:B('یازده تا نوزده','eleven to nineteen')},{cells:['۲۰، ۳۰، ۴۰، ۵۰','douăzeci, treizeci, patruzeci, cincizeci'],note:B('دهگان‌های پرکاربرد','common tens')},{cells:['۶۰، ۷۰، ۸۰، ۹۰، ۱۰۰','șaizeci, șaptezeci, optzeci, nouăzeci, o sută'],note:B('دهگان‌ها و صد','tens and one hundred')},{cells:['۲۱','douăzeci și unu'],note:B('دهگان + și + یکان','tens + și + units')},{cells:['یک / دو کنار اسم','un bilet / o carte; doi elevi / două bilete'],note:B('جنس اسم را بررسی کنید','check the noun’s gender')},{cells:['چند؟','câți elevi / câte bilete'],note:B('مذکر جمع / مؤنث یا خنثی جمع','masculine / feminine or neuter plural')}]},
    practice:[{meaning:B('دو بلیت دارم.','I have two tickets.'),answer:'Am două bilete.',hint:B('bilet خنثی است؛ جمع آن با două می‌آید.','Bilet is neuter; use două with its plural.')},{meaning:B('بلیت چند لئو است؟','How much is the ticket?'),answer:'Cât este biletul?',hint:B('با Cât este شروع کنید.','Start with Cât este.')},{meaning:B('قیمت بلیت ده لئو است.','The ticket price is ten lei.'),answer:'Prețul biletului este zece lei.',hint:B('prețul biletului + este + zece lei','prețul biletului + este + zece lei')}],next:'/learn-romanian/fundamente/timp-sade',
  },
  'timp-sade': {
    title:B('روز، ساعت و قید زمان','Day, time, and time adverbs'),goal:B('روز و ساعت یک وضعیت یا قرار را با a fi بیان کنید.','Describe the day and time of a situation or meeting with a fi.'),
    introduction:B('قید زمان به سؤال «کی؟» جواب می‌دهد و می‌تواند در آغاز یا پایان جمله بیاید. برای زمان قرار از la ora ... استفاده کنید؛ برای پرسیدن ساعت قرار بگویید La ce oră este întâlnirea? در این درس همهٔ جمله‌ها با a fi یا a avea ساخته می‌شوند.', 'Time words answer “When?” and can come at the beginning or end. Use la ora ... for an appointment; ask La ce oră este întâlnirea? All sentences here use a fi or a avea.'),
    rules:[
      {title:B('امروز، فردا و حالا','Today, tomorrow, now'),explanation:B('azi = امروز، mâine = فردا، acum = الان. جای قید برای تأکید می‌تواند عوض شود: Azi sunt aici / Sunt aici azi.', 'Azi means today, mâine tomorrow, and acum now. The time word can move for emphasis: Azi sunt aici / Sunt aici azi.'),examples:[E('Azi sunt la școală.','امروز در مدرسه هستم.','I am at school today.'),E('Mâine sunt în București.','فردا در بخارست هستم.','I am in Bucharest tomorrow.')]},
      {title:B('پرسیدن ساعت','Asking about time'),explanation:B('Cât este ceasul? ساعت فعلی را می‌پرسد؛ La ce oră este întâlnirea? ساعت قرار را می‌پرسد. Întâlnirea este la ora două یعنی قرار ساعت دو است.', 'Cât este ceasul? asks the current time; La ce oră este întâlnirea? asks the appointment time. Întâlnirea este la ora două means the meeting is at two.'),examples:[E('Cât este ceasul?','ساعت چند است؟','What time is it?'),E('La ce oră este întâlnirea?','قرار چه ساعتی است؟','What time is the meeting?'),E('Întâlnirea este la ora două.','قرار ساعت دو است.','The meeting is at two o’clock.')]},
      {title:B('روزهای هفته','Days of the week'),explanation:B('نام روزهای هفته را در جدول ببینید. برای گفتن «امروز دوشنبه است» بگویید Este luni. برای پرسیدن روز بگویید Ce zi este? روزها معمولاً با حرف کوچک نوشته می‌شوند.', 'Use the weekday names in the table. Say Este luni for “It is Monday” and ask Ce zi este? for “What day is it?” Weekday names are usually lowercase.'),examples:[E('Ce zi este? Este luni.','چه روزی است؟ دوشنبه است.','What day is it? It is Monday.'),E('Marți sunt la școală.','سه‌شنبه در مدرسه هستم.','I am at school on Tuesday.')]},
    ],
    table:{headers:[B('روز / عبارت','Day / expression'),B('معنی انگلیسی','English meaning')],rows:[{cells:['luni, marți, miercuri','Monday, Tuesday, Wednesday'],note:B('دوشنبه، سه‌شنبه، چهارشنبه','first three weekdays')},{cells:['joi, vineri','Thursday, Friday'],note:B('پنجشنبه، جمعه','Thursday and Friday')},{cells:['sâmbătă, duminică','Saturday, Sunday'],note:B('شنبه، یکشنبه','weekend')},{cells:['azi, mâine, acum','today, tomorrow, now'],note:B('امروز، فردا، الان','time adverbs')},{cells:['ora două / la ora două','two o’clock / at two o’clock'],note:B('ساعت دو / در ساعت دو','clock time / appointment time')},{cells:['ora două și jumătate','half past two'],note:B('ساعت دو و نیم','half past two')}]},
    practice:[{meaning:B('امروز در مدرسه هستم.','I am at school today.'),answer:'Azi sunt la școală.',hint:B('azi + sunt + la școală','azi + sunt + la școală')},{meaning:B('قرار ساعت دو است.','The meeting is at two o’clock.'),answer:'Întâlnirea este la ora două.',hint:B('întâlnirea + este + la ora două','întâlnirea + este + la ora două')},{meaning:B('امروز دوشنبه است.','It is Monday today.'),answer:'Azi este luni.',hint:B('azi + este + luni','azi + este + luni')}],next:'/learn-romanian/fundamente/sakht-jomle',
  },
} satisfies Record<string, Lesson>;

export type AdditionalFoundationSlug = keyof typeof additionalFoundationLessons;
