import { OperationalGuide } from '../../../types/content';

export const firstDaysChecklistFA: OperationalGuide = {
  canonicalRoute: '/needs/first-days-checklist',
  locale: 'fa',
  title: 'چک‌لیست روزهای اول ورود به رومانی',
  shortDescription: 'مراحل ضروری برای ۷۲ ساعت، ۷ روز اول و پس از آن در رومانی، شامل اقدامات عملی فوری و مهلت‌های قانونی.',
  mainQuestion: 'بلافاصله پس از ورود به رومانی چه اقدامات اداری و عملی باید انجام دهم؟',
  quickAnswer: 'ابتدا اتصال اینترنت و ارز محلی را تامین کنید. قرارداد مسکن بلندمدت خود را نهایی کنید تا ثبت نام امکان‌پذیر شود. باید درخواست اقامت خود را حداقل ۳۰ روز قبل از انقضای حق اقامت قانونی فعلی خود (در صورت لزوم) ارسال کنید.',
  targetAudience: ['دانشجویان بین‌المللی', 'کارگران خارجی', 'اعضای خانواده', 'شهروندان اتحادیه اروپا', 'بازدیدکنندگان کوتاه‌مدت'],
  generalExceptions: [
    'دارندگان ویزای کوتاه‌مدت (نوع C) واجد شرایط درخواست مجوز اقامت (Permis de Ședere) نیستند و نمی‌توانند حساب بانکی استاندارد افتتاح کنند.',
    'شهروندان اتحادیه اروپا نیازی به ویزا ندارند اما اگر بیش از ۳ ماه اقامت دارند باید اقامت خود را ثبت کنند (دریافت CNP).'
  ],
  commonProblems: [
    'تلاش برای افتتاح حساب بانکی بدون قرارداد مسکن نهایی یا ثبت رسمی در ANAF.',
    'از دست دادن مهلت قانونی برای درخواست مجوز اقامت قبل از انقضای ویزای فعلی.'
  ],
  warnings: [
    'برای درخواست مجوز اقامت تا هفته آخر ویزای خود صبر نکنید. وقت‌های IGI باید از قبل رزرو شوند و درخواست‌های دیرهنگام ممکن است جریمه یا دیپورت به همراه داشته باشند.',
    'قوانین پوشش بیمه درمانی برای افراد تحت تکفل و دانشجویان پیچیده است و به شدت اجرا می‌شود. وضعیت خود را مستقیماً با CNAS بررسی کنید.'
  ],
  officialSources: [
    {
      id: 'igi-student',
      sourceTitle: 'IGI - مجوز اقامت برای تحصیل',
      organization: 'اداره کل مهاجرت',
      url: 'https://igi.mai.gov.ro/en/studies/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['student-arrival']
    },
    {
      id: 'igi-work',
      sourceTitle: 'IGI - مجوز اقامت برای کار',
      organization: 'اداره کل مهاجرت',
      url: 'https://igi.mai.gov.ro/en/employment/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['employee-arrival']
    },
    {
      id: 'igi-family',
      sourceTitle: 'IGI - پیوستن خانواده',
      organization: 'اداره کل مهاجرت',
      url: 'https://igi.mai.gov.ro/en/family-reunification/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['family-reunification']
    },
    {
      id: 'igi-family-ro',
      sourceTitle: 'IGI - اعضای خانواده شهروندان رومانی',
      organization: 'اداره کل مهاجرت',
      url: 'https://igi.mai.gov.ro/en/family-members-of-romanian-citizens/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['family-romanian-citizen']
    },
    {
      id: 'igi-eu',
      sourceTitle: 'IGI - شهروندان اتحادیه اروپا/منطقه اقتصادی اروپا',
      organization: 'اداره کل مهاجرت',
      url: 'https://igi.mai.gov.ro/en/citizens-of-the-eu-eea-and-the-swiss-confederation/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'low',
      applicableScenarioIds: ['eu-citizen-arrival']
    },
    {
      id: 'igi-business',
      sourceTitle: 'IGI - فعالیت‌های تجاری',
      organization: 'اداره کل مهاجرت',
      url: 'https://igi.mai.gov.ro/en/commercial-activities/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['company-owner']
    },
    {
      id: 'mae-visas',
      sourceTitle: 'MAE - ویزاهای کوتاه‌مدت',
      organization: 'وزارت امور خارجه',
      url: 'https://www.mae.ro/en/node/2035',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'low',
      applicableScenarioIds: ['short-stay-visitor']
    },
    {
      id: 'anaf-contracts',
      sourceTitle: 'ANAF - ثبت قراردادهای اجاره',
      organization: 'آژانس ملی مدیریت مالی',
      url: 'https://www.anaf.ro/anaf/internet/ANAF/asistenta_contribuabili/servicii_oferite_contribuabililor/inregistrare_contracte_locatiune',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-05',
      status: 'primary'
    },
    {
      id: 'cnas-insurance-general',
      sourceTitle: 'CNAS - اطلاعات عمومی بیمه سلامت ملی',
      organization: 'سازمان ملی بیمه سلامت',
      url: 'https://cnas.ro/',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'high',
      scopeAndExceptions: 'نیاز به بررسی حقوقی حرفه‌ای برای تعیین دقیق شرایط واجد شرایط بودن دارد.'
    }
  ],
  relatedGuides: [
    { route: '/needs/banking', title: 'افتتاح حساب بانکی' },
    { route: '/needs/housing', title: 'اجاره و خرید ملک' },
    { route: '/immigration/igi-process', title: 'روند اقامت در IGI' }
  ],
  lastReviewed: '2026-08-05',
  nextReview: '2027-02-05',
  contentOwner: 'DORVIA EUROP Content Team',
  contentStatus: 'draft',
  factCheckStatus: 'partially-verified',
  riskCategory: ['IMMIGRATION', 'LEGAL', 'FINANCIAL'],
  
  situations: [
    {
      id: 'student-arrival',
      title: 'دانشجویان بین‌المللی (ویزا D/SD)',
      appliesTo: ['دانشجویان دانشگاه', 'دانشجویان سال پیش‌نیاز زبان'],
      residenceCondition: 'ورود به رومانی با ویزای نوع D/SD',
      authority: 'IGI و وزارت آموزش',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'پاسپورت با ویزای معتبر D/SD', isMandatory: true, claimId: 'c-student-doc-1', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'نامه پذیرش دانشگاه', isMandatory: true, claimId: 'c-student-doc-2', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'قرارداد مسکن (ثبت شده در ANAF یا محضری)', isMandatory: true, claimId: 'c-student-doc-3', sourceId: 'anaf-contracts', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'گواهی پزشکی از کلینیک', isMandatory: true, claimId: 'c-student-doc-4', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'پس از ورود: ارتباطات', description: 'یک سیم کارت محلی خریداری کنید.', claimId: 'c-student-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: '۷ روز اول: دانشگاه و مسکن', description: 'ثبت‌نام خود را در دانشگاه رسمی کنید و مطمئن شوید صاحبخانه قرارداد شما را در ANAF ثبت می‌کند.', claimId: 'c-student-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'anaf-contracts' },
        { title: 'عملی: حساب بانکی', description: 'برای رسیدگی به شهریه و هزینه‌های زندگی یک حساب بانکی محلی باز کنید.', claimId: 'c-student-step-3', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'مهلت قانونی: درخواست اقامت IGI', description: 'حداقل ۳۰ روز قبل از انقضای حق اقامت فعلی خود، درخواست اقامت را از طریق پورتال IGI ثبت کنید.', claimId: 'c-student-step-4', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-student', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'هزینه صدور کارت اقامت', isFixed: true, sourceId: 'igi-student' },
        { amount: '120', currency: 'EUR', description: 'معادل مالیات کنسولی', isFixed: true, sourceId: 'igi-student' }
      ],
      timeline: [
        { duration: '۳۰-۴۵ روز', description: 'زمان تقریبی پردازش IGI پس از ارسال مدارک.', isGuaranteed: false, sourceId: 'igi-student' }
      ],
      exceptions: ['دانشجویان بورسیه ممکن است از هزینه‌های کنسولی معاف باشند.'],
      limitations: []
    },
    {
      id: 'employee-arrival',
      title: 'کارگران خارجی (ویزا D/AM)',
      appliesTo: ['کارمندان با Aviz de Muncă', 'کارگران با مهارت بالا'],
      residenceCondition: 'ورود به رومانی با ویزای نوع D/AM',
      authority: 'IGI و ITM',
      requiresExamination: false,
      requiresMedical: 'required',
      medicalConditionText: 'معاینه پزشکی شغلی برای قرارداد کار الزامی است.',
      documents: [
        { name: 'پاسپورت با ویزای معتبر D/AM', isMandatory: true, claimId: 'c-work-doc-1', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'مجوز کار (Aviz de Muncă)', isMandatory: true, claimId: 'c-work-doc-2', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'قرارداد کاری ثبت شده در REVISAL', isMandatory: true, claimId: 'c-work-doc-3', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'قرارداد مسکن ثبت شده در ANAF', isMandatory: true, claimId: 'c-work-doc-4', sourceId: 'anaf-contracts', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'پس از ورود: امضای قرارداد', description: 'برای امضای قرارداد کاری فردی (CIM) به کارفرمای خود مراجعه کنید.', claimId: 'c-work-step-1', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-work' },
        { title: '۷ روز اول: معاینه پزشکی و مسکن', description: 'معاینه سلامت شغلی (Medicina Muncii) که توسط کارفرما ترتیب داده شده است را تکمیل کنید. ثبت مسکن در ANAF را تضمین کنید.', claimId: 'c-work-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'anaf-contracts' },
        { title: 'عملی: حساب حقوق', description: 'یک حساب بانکی برای دریافت حقوق خود باز کنید.', claimId: 'c-work-step-3', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'مهلت قانونی: درخواست اقامت IGI', description: 'حداقل ۳۰ روز قبل از انقضای ویزای خود، درخواست اقامت را در پورتال IGI ثبت کنید.', claimId: 'c-work-step-4', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-work', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'هزینه صدور کارت اقامت', isFixed: true, sourceId: 'igi-work' },
        { amount: '120', currency: 'EUR', description: 'معادل مالیات کنسولی', isFixed: true, sourceId: 'igi-work' }
      ],
      timeline: [
        { duration: '۳۰ روز', description: 'زمان پردازش تخمینی IGI پس از مصاحبه.', isGuaranteed: false, sourceId: 'igi-work' }
      ],
      exceptions: ['متقاضیان کارت آبی اتحادیه اروپا ممکن است زمان پردازش متفاوتی داشته باشند.'],
      limitations: ['شما فقط می‌توانید برای کارفرمای مشخص شده در مجوز کار خود کار کنید.']
    },
    {
      id: 'family-reunification',
      title: 'پیوستن خانواده (اسپانسر غیر اتحادیه اروپا)',
      appliesTo: ['همسران افراد مقیم غیر اتحادیه اروپا', 'فرزندان تحت تکفل افراد مقیم غیر اتحادیه اروپا'],
      residenceCondition: 'ورود با ویزای نوع D/VF',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'conditional',
      medicalConditionText: 'گواهی پزشکی مبنی بر عدم ابتلا به بیماری‌های مسری الزامی است.',
      documents: [
        { name: 'پاسپورت با ویزای معتبر D/VF', isMandatory: true, claimId: 'c-fam1-doc-1', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'مجوز اقامت اسپانسر', isMandatory: true, claimId: 'c-fam1-doc-2', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'گواهی ازدواج یا تولد (ترجمه شده و آپوستیل)', isMandatory: true, claimId: 'c-fam1-doc-3', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'اثبات مسکن و تمکن مالی', isMandatory: true, claimId: 'c-fam1-doc-4', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'عملی: استقرار', description: 'یک سیم کارت محلی تهیه کنید و در صورت نیاز برای اثبات مسکن، نام عضو خانواده را به قبوض خدماتی اضافه کنید.', claimId: 'c-fam1-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'بیمه درمانی (Co-asigurat)', description: 'برای وضعیت بیمه مشترک (هم‌پوشانی) در CNAS جهت پوشش بهداشت عمومی اقدام کنید.', claimId: 'c-fam1-step-2', status: 'QUALIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'cnas-insurance-general', authority: 'CNAS' },
        { title: 'مهلت قانونی: درخواست اقامت IGI', description: 'درخواست مجوز اقامت برای پیوستن خانواده را حداقل ۳۰ روز قبل از انقضای ویزا از طریق پورتال IGI ارسال کنید.', claimId: 'c-fam1-step-3', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-family', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'هزینه صدور کارت اقامت', isFixed: true, sourceId: 'igi-family' },
        { amount: '120', currency: 'EUR', description: 'معادل مالیات کنسولی', isFixed: true, sourceId: 'igi-family' }
      ],
      timeline: [
        { duration: '۳۰-۶۰ روز', description: 'زمان پردازش تخمینی IGI.', isGuaranteed: false, sourceId: 'igi-family' }
      ],
      exceptions: [],
      limitations: []
    },
    {
      id: 'family-romanian-citizen',
      title: 'خانواده شهروندان رومانیایی',
      appliesTo: ['همسران شهروندان رومانیایی', 'فرزندان تحت تکفل شهروندان رومانیایی'],
      residenceCondition: 'درخواست اقامت بر اساس ازدواج/نسبت با یک شهروند رومانیایی',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'پاسپورت (و در صورت نیاز ملیت، ویزا)', isMandatory: true, claimId: 'c-fam2-doc-1', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'کارت شناسایی رومانیایی (ID) شخص حمایت‌کننده', isMandatory: true, claimId: 'c-fam2-doc-2', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'سند ازدواج/تولد رومانیایی', isMandatory: true, claimId: 'c-fam2-doc-3', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'مهلت قانونی: درخواست اقامت IGI', description: 'حداقل ۳۰ روز قبل از انقضای اقامت قانونی فعلی، درخواست مجوز اقامت را در پورتال IGI ثبت کنید.', claimId: 'c-fam2-step-1', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-family-ro', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'هزینه صدور کارت اقامت', isFixed: true, sourceId: 'igi-family-ro' }
      ],
      timeline: [
        { duration: '۳۰-۹۰ روز', description: 'زمان پردازش تخمینی IGI.', isGuaranteed: false, sourceId: 'igi-family-ro' }
      ],
      exceptions: ['اعضای خانواده که به شهروند رومانیایی می‌پیوندند از پرداخت مالیات کنسولی معاف هستند.'],
      limitations: []
    },
    {
      id: 'company-owner',
      title: 'صاحبان شرکت / سرمایه‌گذاران',
      appliesTo: ['مدیران یا سهامداران یک SRL رومانیایی'],
      residenceCondition: 'درخواست اقامت بر اساس فعالیت‌های تجاری',
      authority: 'IGI و وزارت اقتصاد',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'پاسپورت با ویزای نوع D (در صورت وجود)', isMandatory: true, claimId: 'c-biz-doc-1', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'مدارک ثبت شرکت ONRC', isMandatory: true, claimId: 'c-biz-doc-2', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'تاییدیه سرمایه‌گذاری خارجی (در صورت نیاز)', isMandatory: true, claimId: 'c-biz-doc-3', status: 'QUALIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'عملی: حساب بانکی شرکتی', description: 'تمهیدات بانکی شرکت را برای سرمایه و عملیات نهایی کنید.', claimId: 'c-biz-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'مهلت قانونی: درخواست اقامت IGI', description: 'درخواست اقامت را حداقل ۳۰ روز قبل از انقضای ویزای خود از طریق پورتال IGI ارسال کنید.', claimId: 'c-biz-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-business', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'هزینه صدور کارت اقامت', isFixed: true, sourceId: 'igi-business' },
        { amount: '120', currency: 'EUR', description: 'معادل مالیات کنسولی', isFixed: true, sourceId: 'igi-business' }
      ],
      timeline: [
        { duration: '۳۰-۴۵ روز', description: 'زمان پردازش تخمینی IGI.', isGuaranteed: false, sourceId: 'igi-business' }
      ],
      exceptions: [],
      limitations: []
    },
    {
      id: 'eu-citizen-arrival',
      title: 'شهروندان اتحادیه اروپا/منطقه اقتصادی اروپا و سوئیس',
      appliesTo: ['شهروندان اتحادیه اروپا، منطقه اقتصادی اروپا یا سوئیس'],
      residenceCondition: 'نیازی به ویزا نیست. ثبت نام برای اقامت بیش از ۳ ماه الزامی است.',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'کارت ملی یا پاسپورت معتبر', isMandatory: true, claimId: 'c-eu-doc-1', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'اثبات اشتغال، تحصیل یا تمکن مالی', isMandatory: true, claimId: 'c-eu-doc-2', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'اثبات مسکن', isMandatory: true, claimId: 'c-eu-doc-3', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'عملی: تنظیمات اولیه', description: 'در صورت نیاز یک سیم کارت محلی بخرید. به راحتی از حساب‌های بانکی اتحادیه اروپا استفاده کنید.', claimId: 'c-eu-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'مهلت قانونی: ثبت نام IGI (CNP)', description: 'اگر قصد دارید بیشتر از ۳ ماه بمانید، باید قبل از پایان ۹۰ روز برای گواهی ثبت‌نام (Certificat de Înregistrare) اقدام کنید.', claimId: 'c-eu-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-eu', authority: 'IGI' }
      ],
      fees: [],
      timeline: [
        { duration: 'همان روز', description: 'گواهی ثبت نام معمولا همان روزی که پرونده تکمیل شده ارسال می‌شود صادر می‌شود.', isGuaranteed: true, sourceId: 'igi-eu' }
      ],
      exceptions: ['شهروندان اتحادیه اروپا "Permis de Ședere" کلاسیک دریافت نمی‌کنند، آنها "Certificat de Înregistrare" می‌گیرند.'],
      limitations: []
    },
    {
      id: 'short-stay-visitor',
      title: 'بازدیدکنندگان کوتاه‌مدت (ویزا نوع C / معاف از ویزا)',
      appliesTo: ['توریست‌ها', 'بازدیدکنندگان تجاری', 'بازدیدهای خانوادگی کوتاه‌مدت (زیر ۹۰ روز)'],
      residenceCondition: 'حداکثر ۹۰ روز در هر دوره ۱۸۰ روزه.',
      authority: 'پلیس مرزی و MAE',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'پاسپورت معتبر و ویزا (در صورت نیاز)', isMandatory: true, claimId: 'c-short-doc-1', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'بیمه درمانی مسافرتی', isMandatory: true, claimId: 'c-short-doc-2', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'عملی: ارتباطات', description: 'تهیه یک سیم کارت اعتباری (نیازی به مجوز اقامت ندارد).', claimId: 'c-short-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'حقوقی: ثبت اقامتگاه', description: 'مطمئن شوید که هتل یا میزبان شما اقامت شما را ثبت می‌کند، همانطور که قانون برای توریست‌ها ظرف ۳ روز الزامی کرده است.', claimId: 'c-short-step-2', status: 'QUALIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'mae-visas' }
      ],
      fees: [],
      timeline: [],
      exceptions: ['شما نمی‌توانید با ویزای کوتاه‌مدت (نوع C) برای مجوز اقامت درخواست دهید.'],
      limitations: ['نمی‌توانید به صورت قانونی کار کنید.', 'نمی‌توانید اقامت را بیش از ۹۰ روز در یک دوره ۱۸۰ روزه تمدید کنید.']
    },
    {
      id: 'existing-residence-holder',
      title: 'دارندگان کارت اقامت معتبر',
      appliesTo: ['افرادی که با کارت اقامت معتبر به رومانی بازمی‌گردند'],
      residenceCondition: 'ورود مجدد با Permis de Ședere معتبر',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'پاسپورت معتبر', isMandatory: true, claimId: 'c-exist-doc-1', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'کارت اقامت معتبر', isMandatory: true, claimId: 'c-exist-doc-2', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'عملی: بررسی انقضا', description: 'تاریخ انقضای مجوز اقامت خود را بررسی کنید. درخواست‌های تمدید باید حداقل ۳۰ روز قبل از انقضا ارسال شوند.', claimId: 'c-exist-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' }
      ],
      fees: [],
      timeline: [],
      exceptions: [],
      limitations: []
    },
    {
      id: 'no-accommodation',
      title: 'ورود بدون مسکن قطعی',
      appliesTo: ['افراد تازه‌واردی که در هتل یا Airbnb موقت اقامت دارند'],
      residenceCondition: 'در جستجوی اجاره بلندمدت',
      authority: 'هیچ‌کدام',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [],
      steps: [
        { title: 'عملی: جستجوی مسکن', description: 'برای یافتن مسکن بلندمدت از پلتفرم‌هایی مانند Imobiliare.ro یا Storia استفاده کنید. بدون بازدید از ملک قراردادی امضا نکنید.', claimId: 'c-noacc-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'وابستگی: حساب بانکی', description: 'آگاه باشید که اکثر بانک‌ها برای افتتاح حساب به عنوان فرد مقیم، به قرارداد اجاره ثبت‌شده نیاز دارند.', claimId: 'c-noacc-step-2', status: 'PROVIDER_DEPENDENT', reviewDate: '2026-08-05' }
      ],
      fees: [],
      timeline: [],
      exceptions: [],
      limitations: ['تا زمانی که مسکن بلندمدت تامین و در ANAF ثبت نشود، نمی‌توان برای کارت اقامت درخواست داد.']
    }
  ]
};
