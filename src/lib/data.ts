import { University, City, ServiceItem, Article } from '../types';

export const featuredUniversities: University[] = [
  {
    id: 'unibuc',
    name: { fa: 'دانشگاه بخارست', en: 'University of Bucharest' },
    city: { fa: 'بخارست', en: 'Bucharest' },
    type: { fa: 'دولتی', en: 'Public' },
    tuitionRange: { fa: '۲,۰۰۰ - ۴,۵۰۰ یورو / سال (تقریبی)', en: '€2,000 - €4,500 / year (Approx.)' },
    popularFields: {
      fa: ['حقوق و علوم سیاسی', 'علوم کامپیوتر و ریاضیات', 'زبان‌های خارجی و روانشناسی', 'مدیریت و اقتصاد'],
      en: ['Law & Political Science', 'Computer Science & Mathematics', 'Foreign Languages & Psychology', 'Business & Economics']
    },

    description: {
      fa: 'قدیمی‌ترین و برجسته‌ترین دانشگاه جامع رومانی، تاسیس ۱۸۶۴. برای دریافت مبلغ دقیق شهریه بر اساس دانشکده، به international.unibuc.ro مراجعه کنید.',
      en: 'Romania’s premier comprehensive public university. For exact tuition fees per faculty, please visit international.unibuc.ro.'
    },
    source: { name: 'international.unibuc.ro', url: 'https://international.unibuc.ro' },
    lastReviewed: '2026-2027'
  },
  {
    id: 'umf-carol-davila',
    name: { fa: 'دانشگاه پزشکی و داروسازی کارول داویلا', en: 'Carol Davila University of Medicine and Pharmacy' },
    city: { fa: 'بخارست', en: 'Bucharest' },
    type: { fa: 'دولتی تخصصی', en: 'Public Medical' },
    tuitionRange: { fa: '۸,۵۰۰ - ۱۰,۰۰۰ یورو / سال', en: '€8,500 - €10,000 / year' },
    popularFields: {
      fa: ['پزشکی عمومی (انگلیسی)', 'دندانپزشکی', 'داروسازی'],
      en: ['General Medicine (English)', 'Dentistry', 'Pharmacy']
    },

    description: {
      fa: 'پزشکی و دندانپزشکی: ۱۰,۰۰۰ یورو/سال، داروسازی: ۸,۵۰۰ یورو/سال. (رقم مربوط به سال ۲۵-۲۰۲۴ است؛ برای سال ۲۷-۲۰۲۶ باید مستقیم از دانشگاه استعلام شود زیرا فهرست یورویی جدید منتشر نشده).',
      en: 'Medicine/Dentistry: €10,000/yr, Pharmacy: €8,500/yr. (Based on 2024-25 data; exact 2026-27 EUR fees pending release, check directly with university).'
    },
    source: { name: 'UMFCD Official', url: 'https://old.umfcd.ro/en/international-students' },
    lastReviewed: '2025-2026'
  },
  {
    id: 'ubb-cluj',
    name: { fa: 'دانشگاه بابش-بویایی کلوژ-نپوکا', en: 'Babeș-Bolyai University (UBB)' },
    city: { fa: 'کلوژ-نپوکا', en: 'Cluj-Napoca' },
    type: { fa: 'دولتی جامع', en: 'Public' },
    tuitionRange: { fa: '۲,۲۵۰ - ۸,۱۰۰ یورو / سال', en: '€2,250 - €8,100 / year' },
    popularFields: {
      fa: ['مهندسی نرم‌افزار و IT', 'بیوتکنولوژی', 'مدیریت بین‌الملل', 'هنر و رسانه'],
      en: ['Software Engineering & IT', 'Biotechnology', 'International Business', 'Arts & Media']
    },

    description: {
      fa: 'شهریه به یورو در ماه اعلام می‌شود (۹ ماه در سال): کامپیوتر (۹۰۰€/ماه)، ریاضی (۷۰۰€)، مدیریت (۵۰۰€)، زیست‌شناسی (۳۵۰€)، اقتصاد (۲۵۰€).',
      en: 'Tuition paid monthly in EUR (9 months/year): CS (€900/mo), Math (€700/mo), Business (€500/mo), Biology (€350/mo), Economics (€250/mo).'
    },
    source: { name: 'UBB Senate Decision', url: 'https://senat.ubbcluj.ro' },
    lastReviewed: '2026-2027'
  },
  {
    id: 'upb-polytechnic',
    name: { fa: 'دانشگاه پلی‌تکنیک بخارست', en: 'National University of Science and Technology POLITEHNICA Bucharest' },
    city: { fa: 'بخارست', en: 'Bucharest' },
    type: { fa: 'دولتی مهندسی', en: 'Public Technological' },
    tuitionRange: { fa: '۲,۲۰۰ - ۷,۵۰۰ یورو / سال', en: '€2,200 - €7,500 / year' },
    popularFields: {
      fa: ['مهندسی کامپیوتر و هوش مصنوعی', 'هوا فضا', 'مهندسی برق و انرژی', 'مکانیک و رباتیک'],
      en: ['Computer Engineering & AI', 'Aerospace Engineering', 'Electrical & Energy', 'Robotics & Mechanics']
    },

    description: {
      fa: 'فنی، علوم و ریاضی: ۲,۶۰۰€ (کارشناسی) تا ۲,۷۰۰€ (ارشد). علوم انسانی و اقتصاد: ۲,۲۰۰€. هنر و معماری: تا ۷,۵۰۰€ در سال.',
      en: 'Tech/Math/Science: €2,600 (BSc) - €2,700 (MSc). Humanities/Economics: €2,200. Arts/Music: up to €7,500 per year.'
    },
    source: { name: 'UPB Official Tuition Document', url: 'https://international.upb.ro/assets/docs/2026/regulations/POLITEHNICA_Bucharest_tuition_fees.pdf' },
    lastReviewed: '2026-2027'
  }
];

export const featuredCities: City[] = [
  {
    id: 'bucharest',
    name: { fa: 'بخارست', en: 'Bucharest' },
    romanianName: 'București',
    population: '۲.۱ میلیون نفر',
    region: { fa: 'جنوب رومانی (پایتخت)', en: 'Capital / Southern Romania' },
    highlights: {
      fa: ['پایتخت سیاسی و اقتصادی', 'مراکز تجاری و بانک‌های بین‌المللی', 'سیستم حمل‌ونقل شهری مترو پيشرفته', 'زندگی شبانه و مراکز فرهنگی فراوان'],
      en: ['Political & Economic Capital', 'Multinational Corporate Hubs', 'Advanced Metro & Transit', 'Vibrant Cultural & Nightlife']
    },
    description: {
      fa: 'پایتخت رومانی معروف به "پاریس کوچک شرق"، مرکز اصلی اقتصاد، آموزش عالی، بیمارستان‌های مجهز و شرکت‌های بین‌المللی است.',
      en: 'Romania’s dynamic capital, known historically as "Little Paris", housing top universities and multinational HQ hubs.'
    }
  },
  {
    id: 'cluj-napoca',
    name: { fa: 'کلوژ-نپوکا', en: 'Cluj-Napoca' },
    romanianName: 'Cluj-Napoca',
    population: '۳۳۰,۰۰۰ نفر',
    region: { fa: 'ترانسیلوانیا (غرب)', en: 'Transylvania (West)' },
    highlights: {
      fa: ['سیلیکون ولی رومانی (قطب IT)', 'شهر جوان و دانشگاهی', 'جشنواره‌های بین‌المللی موسیقی', 'کیفیت بسیار بالای زندگی'],
      en: ['Silicon Valley of Romania', 'Young University Student City', 'Major European Music Festivals', 'Top Quality of Life Index']
    },
    description: {
      fa: 'پایتخت اقتصادی ترانسیلوانیا و محبوب‌ترین شهر رومانی برای مهندسان نرم‌افزار، استارت‌آپ‌ها و دانشجویان بین‌المللی.',
      en: 'The heart of Transylvania and the undisputed tech startup capital of Romania, famous for university culture.'
    }
  },
  {
    id: 'timisoara',
    name: { fa: 'تیمیشوارا', en: 'Timișoara' },
    romanianName: 'Timișoara',
    population: '۳۲۰,۰۰۰ نفر',
    region: { fa: 'غرب رومانی (نزدیک مرز مجارستان)', en: 'Western Romania (Near HU border)' },
    highlights: {
      fa: ['پایتخت فرهنگی اروپا', 'صنایع خودرو و الکترونیک', 'معماری دیدنی کلاسیک اروپایی', 'دسترسی سریع زمینی به کل اروپا'],
      en: ['European Capital of Culture', 'Automotive & Electronics Hub', 'Stunning Classical Architecture', 'Fast Transit to Central Europe']
    },
    description: {
      fa: 'شهری اروپایی با تاریخ غنی، صنایع پیشرفته خودروسازی و محیطی عالی برای سرمایه‌گذاران و کارآفرینان.',
      en: 'A historic European city with thriving automotive industries and direct strategic access to Central Europe.'
    }
  },
  {
    id: 'iasi',
    name: { fa: 'یاش', en: 'Iași' },
    romanianName: 'Iași',
    population: '۳۹۰,۰۰۰ نفر',
    region: { fa: 'شمال شرق رومانی (مولداوی)', en: 'Northeastern Romania' },
    highlights: {
      fa: ['پایتخت تاریخی و فرهنگی', 'اولین دانشگاه رومانی', 'هزینه مسکن بسیار اقتصادی', 'مراکز تحقیقاتی و IT'],
      en: ['Cultural & Historic Capital', 'Home of Romania’s 1st University', 'Highly Affordable Living Costs', 'Growing IT R&D Centers']
    },
    description: {
      fa: 'گوارای تاریخ و فرهنگ رومانی با هزینه‌های زندگی اقتصادی و فضای تحصیلی آرامش‌بخش.',
      en: 'The cultural cradle of Romania, ideal for international students looking for affordable, high-quality education.'
    }
  },
  {
    id: 'brasov',
    name: { fa: 'براشوف', en: 'Brașov' },
    romanianName: 'Brașov',
    population: '۲۷۰,۰۰۰ نفر',
    region: { fa: 'مرکز رومانی (کوه‌های کارپات)', en: 'Central Romania (Carpathian Alps)' },
    highlights: {
      fa: ['قطب گردشگری و توریسم', 'طبیعت و پیست‌های اسکی فوق‌العاده', 'صنایع هوافضا و مهندسی', 'امنیت فوق‌العاده خانوادگی'],
      en: ['Primary Tourism & Ski Destination', 'Breathtaking Alpine Nature', 'Aerospace & Precision Manufacturing', 'Top Family Safety']
    },
    description: {
      fa: 'شهری زیبا محصور در کوهستان‌های سرسبز، توریستی‌ترین شهر رومانی با صنایع دقیق مهندسی و محیط زیست بی نظیر.',
      en: 'Nestled in the Carpathian mountains, Brașov combines fairytale scenery with industrial manufacturing strength.'
    }
  },
  {
    id: 'constanta',
    name: { fa: 'کونستانتسا', en: 'Constanța' },
    romanianName: 'Constanța',
    population: '۲۸۰,۰۰۰ نفر',
    region: { fa: 'جنوب شرق (ساحل دریای سیاه)', en: 'Southeastern Coast (Black Sea)' },
    highlights: {
      fa: ['بزرگ‌ترین بندر دریای سیاه', 'صنایع کشتیرانی و لجستیک', 'شهر ساحلی و تفریحی', 'دانشگاه علوم دریانوردی'],
      en: ['Largest Black Sea Port', 'Maritime Logistics Hub', 'Coastal Resort Lifestyle', 'Maritime Academy & Studies']
    },
    description: {
      fa: 'بزرگ‌ترین بندر تجاری رومانی و مرکز اصلی صنایع کشتیرانی، شیلات، گردشگری ساحلی و تجارت بین‌الملل دریایی.',
      en: 'Romania’s chief port city and maritime trade center, featuring sandy beaches, resorts, and shipping hubs.'
    }
  }
];

export const mainServices: ServiceItem[] = [
  {
    id: 'academic-admission',
    icon: 'GraduationCap',
    title: { fa: 'پذیرش دانشگاهی و تحصیل', en: 'University Admission Support' },
    shortDesc: {
      fa: 'مشاوره انتخاب رشته، ترجمه و ارزشیابی مدارک، اخذ پذیرش قطع از دانشگاه‌های معتبر رومانی.',
      en: 'Complete guidance on program selection, document evaluation, and securing official admission offers.'
    },
    fullDesc: {
      fa: 'خدمات شامل بررسی اولیه رزومه تحصیلی، انتخاب رشته دانشگاهی مناسب بر اساس بودجه و علاقه، ترجمه تایید شده مدارک، آماده‌سازی پرونده طبق ضوابط وزارت آموزش رومانی و پیگیری تا دریافت پذیرش قطعی تحصیلی است.',
      en: 'Comprehensive support covering credential evaluation, selecting suitable public or private universities, document translation support, and securing official Acceptance Letters from the Ministry of Education.'
    },
    features: {
      fa: ['ارزیابی شانس پذیرش بدون نیاز به کنکور', 'ترجمه رسمی و تاییدیه دادگستری/امورخارجه', 'اخذ گواهی پذیرش وزارت آموزش رومانی', 'راهنمایی اقدام برای ویزای تحصیلی type D/SD'],
      en: ['Admission probability assessment', 'Certified translation & legalizations', 'Ministry of Education Acceptance Letter', 'Student Visa D/SD application guidance']
    }
  },
  {
    id: 'work-permit',
    icon: 'Briefcase',
    title: { fa: 'ویزای کار و مجوز اشتغال', en: 'Work Permit & Employment Guidance' },
    shortDesc: {
      fa: 'راهنمایی در مورد قوانین کار، فرآیند صدور مجوز اشتغال (Aviz de Munca) و ویزای کار رومانی.',
      en: 'Guidance on labor laws, Work Authorization Notice (Aviz de Munca), and Work Visa requirements.'
    },
    fullDesc: {
      fa: 'پوشش کامل ضوابط قانونی استخدام کارجویان خارجی در رومانی، تایید مدارک شغلی، الزامات کارفرما برای اخذ تاییدیه اداره کل مهاجرت (IGI) و مراحل قانونی تا صدور کارت اقامت کاری.',
      en: 'Step-by-step guidance on immigration compliance for non-EU workers, verifying employer eligibility under IGI standards, work permit approval, and work residency card processing.'
    },
    features: {
      fa: ['معرفی بسترها و سایت‌های رسمی کاریابی رومانی', 'بررسی شرایط قانونی کارفرما جهت صدور Aviz', 'تنظیم استانداردهای رزومه یوروپاس (Europass)', 'مشاوره مصاحبه‌های سفارت رومانی'],
      en: ['Official Romanian job board resources', 'Employer eligibility review for Aviz de Munca', 'Europass CV standardization', 'Embassies interview prep']
    }
  },
  {
    id: 'company-setup',
    icon: 'Building2',
    title: { fa: 'ثبت شرکت و مشاوره کسب‌وکار', en: 'Company Registration & Business Setup' },
    shortDesc: {
      fa: 'ثبت رسمی شرکت SRL، افتتاح حساب بانکی شرکتی، مشاوره مالیاتی و اخذ اقامت مدیرعامل.',
      en: 'Official SRL company formation, corporate banking support, tax guidance, and director residency.'
    },
    fullDesc: {
      fa: 'رومانی با نرخ مالیات ۱ درصدی بر درآمد شرکت‌های میکرو، یکی از بهترین نقاط اروپا برای کارآفرینی است. ما کلیه فرآیندهای ثبت شرکت در اداره ثبت شرکت‌های رومانی (ONRC) را پشتیبانی می‌کنیم.',
      en: 'With a 1% micro-company income tax option, Romania is Europe’s top destination for entrepreneurs. We cover complete incorporation procedures with the Trade Register (ONRC).'
    },
    features: {
      fa: ['ثبت شرکت SRL با حداقل سرمایه اولیه', 'اخذ آدرس دفتر مجازی (Virtual Office)', 'معرفی حسابداران رسمی و معتمد در بخارست', 'اقدام جهت اقامت تجاری مدیرعامل'],
      en: ['SRL Company registration with low share capital', 'Virtual office address support', 'English/Persian speaking accountant referral', 'Business residency application guidance']
    }
  },
  {
    id: 'document-legalization',
    icon: 'FileCheck',
    title: { fa: 'امور مدارک و تاییدات سفارت', en: 'Document Authentication & Legalization' },
    shortDesc: {
      fa: 'راهنمایی ترجمه، آپوستیل و تایید مدارک در سفارت رومانی جهت پرونده‌های مهاجرتی.',
      en: 'Step-by-step guidance on translations, Apostille, and embassy legalization process.'
    },
    fullDesc: {
      fa: 'فرآیند دقیق آماده‌سازی و تایید مدرک برای اطمینان از پذیرش رسمی توسط اداره مهاجرت رومانی (IGI)، دانشگاه‌ها و سفارتخانه‌ها.',
      en: 'Detailed instructions and verification checklists for identity, academic, and criminal background documents to satisfy IGI requirements.'
    },
    features: {
      fa: ['چک‌لیست دقیق مدارک سفارت', 'تاییدیه ترجمه‌ها به زبان رومانیایی/انگلیسی', 'راهنمایی اخذ سوءپیشینه بین‌المللی', 'بررسی نقایص احتمالی پرونده قبل از سابمیت'],
      en: ['Detailed Embassy document checklist', 'Romanian/English translation compliance', 'International background check guidance', 'Pre-submission document audit']
    }
  },
  {
    id: 'post-arrival',
    icon: 'Compass',
    title: { fa: 'پشتیبانی پس از ورود به رومانی', en: 'Post-Arrival & Relocation Support' },
    shortDesc: {
      fa: 'اجاره مسکن، دریافت کارت اقامت (Permis de Ședere)، شماره مالیاتی CNP و افتتاح حساب بانکی.',
      en: 'Housing rental guidance, residence card (Permis de Ședere), CNP tax ID, and local banking setup.'
    },
    fullDesc: {
      fa: 'مهاجرت با ورود به کشور تمام نمی‌شود؛ تیم ما شما را در تمام مراحل استقرار اولیه، تمدید اقامت، قرارداد اجاره رسمی و دریافت خدمات درمانی رومانی همراهی می‌کند.',
      en: 'Relocation doesn’t end at the airport. We assist with initial settlement, lease contract registration (ANAF), residence card issuance at IGI, and healthcare registration.'
    },
    features: {
      fa: ['راهنمایی اجاره آپارتمان و ثبت در دارایی (ANAF)', 'همراهی در وقت اداره مهاجرت IGI برای ثبت اثرانگشت', 'افتتاح حساب بانکی شخصی شخصی', 'ثبت‌نام بیمه درمانی دولتی/خصوصی'],
      en: ['Apartment rental guidance & ANAF registration', 'IGI appointment accompaniment for biometrics', 'Personal bank account opening', 'Health insurance registration']
    }
  }
];

export const sampleArticles: Article[] = [
  {
    id: 'schengen-access-2026',
    slug: 'romania-schengen-impact-2026',
    title: {
      fa: 'تاثیر کامل پیوستن رومانی به حوزه شنگن بر دارنگان اقامت و ویزا',
      en: 'The Full Impact of Romania joining Schengen for Visa & Residence Holders'
    },
    category: { fa: 'قوانین مهاجرت', en: 'Immigration Laws' },
    date: '۲۰۲۶/۰۷/۱۵',
    readTime: '۵ دقیقه مطالعه',
    excerpt: {
      fa: 'با الحاق کامل رومانی به مرزهای هوایی، دریایی و زمینی شنگن، دارندگان اقامت رومانی می‌توانند بدون نیاز به ویزا به ۲۹ کشور اروپایی سفر کنند.',
      en: 'With Romania’s complete Schengen accession, valid residence permit holders enjoy seamless border-free movement across 29 European nations.'
    }
  },
  {
    id: 'study-medical-romania',
    slug: 'study-medicine-dentistry-romania-guide',
    title: {
      fa: 'راهنمای کامل پذیرش پزشکی و دندانپزشکی در رومانی به زبان انگلیسی',
      en: 'Complete Guide to Studying Medicine & Dentistry in Romania in English'
    },
    category: { fa: 'تحصیلات عالی', en: 'Higher Education' },
    date: '۲۰۲۶/۰۶/۲۸',
    readTime: '۷ دقیقه مطالعه',
    excerpt: {
      fa: 'شرایط پذیرش بدون کنکور، شهریه‌های سالانه ۶۰۰۰ تا ۸۵۰۰ یورو، مدارک مورد نیاز و اعتبار مدارک پزشکی رومانی در ایران و اروپا.',
      en: 'Entry criteria without entrance exams, annual tuition ranges (€6,000–€8,500), document requirements, and global medical recognition.'
    }
  },
  {
    id: 'srl-tax-benefits',
    slug: 'romania-company-registration-tax-benefits',
    title: {
      fa: 'چرا رومانی بهشت جدید ثبت شرکت و کارآفرینان در اروپا است؟',
      en: 'Why Romania is Europe’s Premier Hub for Entrepreneurs & Business Formation'
    },
    category: { fa: 'کسب‌ و کار', en: 'Business & Taxes' },
    date: '۲۰۲۶/۰۶/۱۰',
    readTime: '۶ دقیقه مطالعه',
    excerpt: {
      fa: 'بررسی قوانین جدید مالیاتی، شرایط استخدام حداقل یک نیروی کار محلی، و فرآیند اخذ اقامت تجاری در اتحادیه اروپا.',
      en: 'An in-depth review of micro-company tax incentives, minimum local hiring rules, and executive residency options.'
    }
  }
];
