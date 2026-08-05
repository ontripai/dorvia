import { OperationalGuide } from '../../../types/content';

export const firstDaysChecklistFA: OperationalGuide = {
  canonicalRoute: '/needs/first-days-checklist',
  locale: 'fa',
  title: 'چک‌لیست روزهای نخست ورود به رومانی',
  shortDescription: 'اقدامات ضروری در ۷۲ ساعت، ۷ روز و ۳۰ روز اول ورود به رومانی، از جمله سیم‌کارت، حساب بانکی، مسکن و ثبت‌نام اقامت در IGI.',
  mainQuestion: 'بلافاصله پس از ورود به رومانی چه اقدامات اداری و عملی باید انجام دهم؟',
  quickAnswer: 'ابتدا یک سیم‌کارت محلی تهیه کنید و مقدار کمی ارز تبدیل کنید. در هفته اول، قرارداد مسکن خود را نهایی کرده و در صورت امکان حساب بانکی باز کنید. تا روز ۳۰ام، باید بسته به نوع ویزای خود، آدرس خود را ثبت کرده و برای کارت اقامت در IGI درخواست دهید.',
  targetAudience: ['دانشجویان بین‌المللی', 'نیروی کار خارجی', 'اعضای خانواده', 'شهروندان اتحادیه اروپا'],
  generalExceptions: [
    'دارندگان ویزای کوتاه‌مدت (نوع C) نیازی به درخواست کارت اقامت (Permis de Ședere) ندارند و نمی‌توانند حساب بانکی معمولی برای افراد مقیم باز کنند.',
    'شهروندان اتحادیه اروپا به ویزا نیاز ندارند اما اگر بیش از ۳ ماه اقامت داشته باشند، باید اقامت خود را ثبت کنند (دریافت CNP).'
  ],
  commonProblems: [
    'تلاش برای باز کردن حساب بانکی بدون داشتن قرارداد مسکن نهایی یا ثبت رسمی آن در اداره مالیات (ANAF).',
    'از دست دادن مهلت ۳۰ روزه قبل از انقضای ویزا برای ثبت درخواست کارت اقامت در IGI.'
  ],
  warnings: [
    'برای درخواست کارت اقامت تا هفته آخر اعتبار ویزای خود صبر نکنید. نوبت‌های IGI ممکن است از هفته‌ها قبل پر شده باشند.'
  ],
  officialSources: [
    {
      id: 'igi-residence-general',
      sourceTitle: 'اداره کل بازرسی مهاجرت (IGI) - کارت‌های اقامت',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/residence-permits/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary'
    },
    {
      id: 'anaf-contracts',
      sourceTitle: 'اداره مالیات (ANAF) - ثبت قراردادهای اجاره',
      organization: 'Agentia Nationala de Administrare Fiscala',
      url: 'https://www.anaf.ro/anaf/internet/ANAF/asistenta_contribuabili/servicii_oferite_contribuabililor/inregistrare_contracte_locatiune',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-05',
      status: 'primary'
    },
    {
      id: 'cnas-insurance',
      sourceTitle: 'بیمه سلامت ملی (CNAS) - اطلاعات عمومی',
      organization: 'Casa Națională de Asigurări de Sănătate',
      url: 'https://cnas.ro/',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-05',
      status: 'primary'
    }
  ],
  relatedGuides: [
    { route: '/needs/banking', title: 'افتتاح حساب بانکی' },
    { route: '/needs/housing', title: 'اجاره و خرید مسکن' },
    { route: '/immigration/igi-process', title: 'فرآیند اقامت IGI' }
  ],
  lastReviewed: '2026-08-05',
  nextReview: '2027-02-05',
  contentOwner: 'DORVIA EUROP Legal Team',
  contentStatus: 'published',
  factCheckStatus: 'source-verified',
  riskCategory: ['IMMIGRATION', 'LEGAL', 'FINANCIAL'],
  
  situations: [
    {
      id: 'student-arrival',
      title: 'دانشجویان بین‌المللی (ویزای نوع D/SD)',
      appliesTo: ['دانشجویان دانشگاه', 'دانشجویان سال آمادگی زبان'],
      residenceCondition: 'ورود به رومانی با ویزای نوع D/SD',
      authority: 'IGI و وزارت آموزش',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'پاسپورت با ویزای معتبر نوع D/SD', isMandatory: true, claimId: 'c-student-doc-1' },
        { name: 'نامه پذیرش دانشگاه (Letter of Acceptance)', isMandatory: true, claimId: 'c-student-doc-2' },
        { name: 'قرارداد مسکن (ثبت شده در ANAF یا محضری در صورت اقامت رایگان)', isMandatory: true, claimId: 'c-student-doc-3', sourceId: 'anaf-contracts' },
        { name: 'گواهی پزشکی از درمانگاه دانشگاه یا بیمارستان دولتی', isMandatory: true, claimId: 'c-student-doc-4' }
      ],
      steps: [
        { title: '۷۲ ساعت اول: ارتباطات و مالی', description: 'با استفاده از پاسپورت خود یک سیم‌کارت محلی (مثل Orange, Vodafone) بخرید. مقدار کمی پول را برای هزینه‌های فوری مانند حمل و نقل به لئو (RON) تبدیل کنید.', claimId: 'c-student-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: '۷ روز اول: ثبت‌نام دانشگاه و مسکن', description: 'برای نهایی کردن ثبت‌نام به دفتر بین‌المللی دانشگاه خود مراجعه کنید. قرارداد اجاره بلندمدت خود را نهایی کنید؛ مطمئن شوید که صاحبخانه آن را در ANAF ثبت می‌کند.', claimId: 'c-student-step-2', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'anaf-contracts' },
        { title: '۱۴ روز اول: حساب بانکی', description: 'یک حساب بانکی در رومانی باز کنید. اکثر بانک‌ها پاسپورت، ویزا، قرارداد مسکن و گواهی ثبت‌نام دانشگاه را می‌خواهند. توجه: برخی بانک‌ها ممکن است دانشجویان برخی حوزه‌های قضایی را بدون داشتن کارت اقامت رد کنند.', claimId: 'c-student-step-3', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: '۳۰ روز اول: کارت اقامت IGI', description: 'درخواست کارت اقامت دانشجویی (Permis de Ședere) خود را حداقل ۳۰ روز قبل از پایان مهلت ویزا از طریق پورتال IGI ثبت کنید.', claimId: 'c-student-step-4', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'igi-residence-general', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'هزینه صدور کارت اقامت (Taxa permis ședere)', isFixed: true, sourceId: 'igi-residence-general' },
        { amount: '120', currency: 'EUR', description: 'مالیات کنسولی معادل به RON (Taxa consulara) - استثنائاتی برای دانشجویان بورسیه وجود دارد', isFixed: true, sourceId: 'igi-residence-general' }
      ],
      timeline: [
        { duration: '۳۰-۴۵ روز', description: 'زمان پردازش استاندارد IGI برای کارت اقامت دانشجویی پس از تحویل مدارک.', isGuaranteed: false, sourceId: 'igi-residence-general' }
      ],
      exceptions: ['دانشجویانی که بورسیه تحصیلی دولت رومانی را دارند از پرداخت مالیات کنسولی معاف هستند.', 'دانشجویان زیر ۲۶ سال معمولاً از پرداخت حق بیمه سلامت عمومی (CNAS) معاف هستند.'],
      limitations: []
    },
    {
      id: 'employee-arrival',
      title: 'نیروی کار خارجی (ویزای نوع D/AM)',
      appliesTo: ['کارمندان دارای مجوز کار (Aviz de Muncă)', 'کارگران ماهر (بلوکارت اتحادیه اروپا)'],
      residenceCondition: 'ورود به رومانی با ویزای نوع D/AM',
      authority: 'IGI و ITM (بازرسی کار)',
      requiresExamination: false,
      requiresMedical: 'required',
      medicalConditionText: 'معاینه طب کار برای قرارداد استخدام الزامی است.',
      documents: [
        { name: 'پاسپورت با ویزای معتبر نوع D/AM', isMandatory: true, claimId: 'c-work-doc-1' },
        { name: 'مجوز کار (Aviz de Muncă)', isMandatory: true, claimId: 'c-work-doc-2' },
        { name: 'قرارداد استخدام ثبت شده در سامانه REVISAL', isMandatory: true, claimId: 'c-work-doc-3' },
        { name: 'قرارداد مسکن ثبت شده در ANAF', isMandatory: true, claimId: 'c-work-doc-4', sourceId: 'anaf-contracts' }
      ],
      steps: [
        { title: '۷۲ ساعت اول: ورود و قرارداد', description: 'بلافاصله به کارفرمای خود مراجعه کنید. شما باید قرارداد کار فردی (CIM) را امضا کنید و کارفرما باید آن را در سامانه REVISAL ثبت کند.', claimId: 'c-work-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: '۷ روز اول: معاینه پزشکی و مسکن', description: 'معاینه طب کار (Medicina Muncii) را که توسط کارفرمای شما هماهنگ شده تکمیل کنید. یک اجاره‌نامه بلندمدت منعقد کرده و از ثبت آن در ANAF اطمینان حاصل کنید.', claimId: 'c-work-step-2', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'anaf-contracts' },
        { title: '۱۴ روز اول: حساب بانکی (حقوق)', description: 'برای دریافت حقوق خود یک حساب بانکی باز کنید. کارفرمای شما معمولاً برای تسهیل این امر گواهی اشتغال به کار ارائه می‌دهد.', claimId: 'c-work-step-3', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: '۳۰ روز اول: کارت اقامت IGI', description: 'درخواست کارت اقامت کاری خود را حداقل ۳۰ روز قبل از انقضای ویزای ۹۰ روزه از طریق پورتال IGI ثبت کنید.', claimId: 'c-work-step-4', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'igi-residence-general', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'هزینه صدور کارت اقامت (Taxa permis ședere)', isFixed: true, sourceId: 'igi-residence-general' },
        { amount: '120', currency: 'EUR', description: 'مالیات کنسولی معادل به RON (Taxa consulara)', isFixed: true, sourceId: 'igi-residence-general' }
      ],
      timeline: [
        { duration: '۳۰ روز', description: 'زمان پردازش استاندارد IGI برای کارت اقامت کاری پس از مصاحبه.', isGuaranteed: false, sourceId: 'igi-residence-general' }
      ],
      exceptions: ['متقاضیان بلوکارت (کارت آبی) اتحادیه اروپا ممکن است زمان‌های پردازش و ساختار هزینه‌های متفاوتی داشته باشند.'],
      limitations: ['شما فقط می‌توانید برای کارفرمایی که در مجوز کار (Aviz de Muncă) مشخص شده کار کنید.']
    },
    {
      id: 'family-arrival',
      title: 'پیوستن به خانواده (ویزای نوع D/VF)',
      appliesTo: ['همسر افراد مقیم یا شهروندان', 'فرزندان تحت تکفل'],
      residenceCondition: 'ورود به رومانی با ویزای نوع D/VF',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'conditional',
      medicalConditionText: 'گواهی پزشکی مبنی بر نداشتن بیماری‌های واگیردار الزامی است.',
      documents: [
        { name: 'پاسپورت با ویزای معتبر نوع D/VF', isMandatory: true, claimId: 'c-fam-doc-1' },
        { name: 'کپی کارت اقامت یا شناسنامه شخص حمایت‌کننده (Sponsor)', isMandatory: true, claimId: 'c-fam-doc-2' },
        { name: 'گواهی ازدواج یا تولد (ترجمه و آپوستیل شده)', isMandatory: true, claimId: 'c-fam-doc-3' },
        { name: 'مدرک اثبات مسکن و تمکن مالی کافی', isMandatory: true, claimId: 'c-fam-doc-4' }
      ],
      steps: [
        { title: '۷۲ ساعت اول: استقرار', description: 'یک سیم‌کارت محلی تهیه کنید. شخص حمایت‌کننده در صورت نیاز برای اثبات مسکن باید نام عضو خانواده را به قبوض خدماتی یا هزینه‌های خانه اضافه کند.', claimId: 'c-fam-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: '۱۴ روز اول: بیمه سلامت', description: 'بسته به وضعیت شخص حمایت‌کننده، برای وضعیت بیمه‌شده مشترک (co-asigurat) در CNAS اقدام کنید تا عضو خانواده دارای پوشش سلامت عمومی شود.', claimId: 'c-fam-step-2', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'cnas-insurance', authority: 'CNAS' },
        { title: '۳۰ روز اول: کارت اقامت IGI', description: 'درخواست کارت اقامت پیوستن به خانواده را حداقل ۳۰ روز قبل از انقضای ویزا در پورتال IGI ثبت کنید.', claimId: 'c-fam-step-3', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'igi-residence-general', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'هزینه صدور کارت اقامت (Taxa permis ședere)', isFixed: true, sourceId: 'igi-residence-general' },
        { amount: '120', currency: 'EUR', description: 'مالیات کنسولی معادل به RON (Taxa consulara) - در صورت پیوستن به شهروند رومانیایی معاف است', isFixed: true, sourceId: 'igi-residence-general' }
      ],
      timeline: [
        { duration: '۳۰-۶۰ روز', description: 'زمان پردازش استاندارد IGI.', isGuaranteed: false, sourceId: 'igi-residence-general' }
      ],
      exceptions: ['اعضای خانواده‌ای که به یک شهروند رومانیایی می‌پیوندند از مالیات کنسولی ۱۲۰ یورویی معاف هستند.'],
      limitations: []
    },
    {
      id: 'eu-citizen-arrival',
      title: 'شهروندان اتحادیه اروپا/منطقه اقتصادی اروپا و سوئیس',
      appliesTo: ['شهروندان کشورهای EU, EEA و سوئیس'],
      residenceCondition: 'نیاز به ویزا نیست. برای اقامت بیش از ۳ ماه ثبت‌نام الزامی است.',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'کارت شناسایی ملی یا پاسپورت معتبر', isMandatory: true, claimId: 'c-eu-doc-1' },
        { name: 'مدرک اشتغال، تحصیل یا تمکن مالی کافی', isMandatory: true, claimId: 'c-eu-doc-2' },
        { name: 'مدرک مسکن (قرارداد اجاره یا سند مالکیت)', isMandatory: true, claimId: 'c-eu-doc-3' }
      ],
      steps: [
        { title: '۷۲ ساعت اول: تنظیمات اولیه', description: 'اگر طرح تلفن همراه کشور شما رومینگ طولانی‌مدت اروپا را پوشش نمی‌دهد، یک سیم‌کارت محلی بخرید. اکثر شهروندان اتحادیه اروپا می‌توانند موقتاً از حساب‌های بانکی کشور خود استفاده کنند.', claimId: 'c-eu-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'قبل از ۹۰ روز: گواهی ثبت‌نام IGI (دریافت CNP)', description: 'اگر قصد دارید بیش از ۳ ماه بمانید، باید در IGI ثبت‌نام کنید تا گواهی ثبت‌نام (Certificat de Înregistrare) دریافت کنید که به شما یک شماره ملی اختصاصی (CNP) می‌دهد.', claimId: 'c-eu-step-2', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'igi-residence-general', authority: 'IGI' }
      ],
      fees: [],
      timeline: [
        { duration: 'همان روز', description: 'گواهی ثبت‌نام معمولاً در همان روز ارائه پرونده کامل صادر می‌شود.', isGuaranteed: true, sourceId: 'igi-residence-general' }
      ],
      exceptions: ['شهروندان اتحادیه اروپا به ویزا یا "کارت اقامت" کلاسیک نیاز ندارند، آنها "گواهی ثبت‌نام" دریافت می‌کنند.'],
      limitations: []
    },
    {
      id: 'short-stay-visitor',
      title: 'بازدیدکنندگان کوتاه‌مدت (ویزای نوع C / معاف از ویزا)',
      appliesTo: ['توریست‌ها', 'بازدیدکنندگان تجاری', 'بازدیدهای خانوادگی کوتاه‌مدت (زیر ۹۰ روز)'],
      residenceCondition: 'حداکثر ۹۰ روز در هر بازه ۱۸۰ روزه.',
      authority: 'پلیس مرزی',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'پاسپورت و ویزای معتبر (در صورت نیاز)', isMandatory: true, claimId: 'c-short-doc-1' },
        { name: 'بیمه درمانی مسافرتی', isMandatory: true, claimId: 'c-short-doc-2' }
      ],
      steps: [
        { title: '۷۲ ساعت اول: ارتباطات و اقامت', description: 'یک سیم‌کارت اعتباری تهیه کنید (نیازی به کارت اقامت ندارد). اطمینان حاصل کنید که هتل یا میزبان شما اقامت شما را ثبت می‌کند، زیرا این امر برای توریست‌ها قانوناً الزامی است.', claimId: 'c-short-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' }
      ],
      fees: [],
      timeline: [],
      exceptions: ['در زمانی که با ویزای کوتاه‌مدت نوع C در کشور هستید نمی‌توانید برای کارت اقامت درخواست دهید.', 'به طور کلی نمی‌توانید حساب بانکی معمولی برای افراد مقیم باز کنید.'],
      limitations: ['نمی‌توانید به طور قانونی کار کنید.', 'نمی‌توانید اقامت خود را بیش از ۹۰ روز در بازه ۱۸۰ روزه تمدید کنید.']
    }
  ]
};
