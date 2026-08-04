import { OperationalGuide } from '../../../types/content';

export const drivingLicenseFA: OperationalGuide = {
  canonicalRoute: '/needs/driving-license',
  locale: 'fa',
  title: 'گواهی‌نامه رانندگی در رومانی: تبدیل، اخذ از ابتدا و قوانین بین‌المللی',
  shortDescription: 'راهنمای جامع رانندگی موقت با گواهی‌نامه خارجی، مراحل تبدیل گواهی‌نامه ایرانی، گرفتن گواهی‌نامه از ابتدا، تمدید، و صدور گواهی‌نامه بین‌المللی (IDP).',
  mainQuestion: 'به عنوان یک خارجی در رومانی، چگونه می‌توانم به صورت قانونی رانندگی کنم یا گواهی‌نامه بگیرم؟',
  quickAnswer: 'در صورت داشتن گواهی‌نامه معتبر خارجی (مانند ایرانی) و گواهی‌نامه بین‌المللی، می‌توانید موقتاً رانندگی کنید. پس از دریافت اقامت رومانی، باید گواهی‌نامه خود را از طریق اداره DGPCI بدون آزمون به گواهی‌نامه رومانیایی (استاندارد اتحادیه اروپا) تبدیل کنید. در غیر این صورت، می‌توانید با ثبت‌نام در آموزشگاه رانندگی، گواهی‌نامه جدید بگیرید.',
  targetAudience: ['مهاجران', 'دانشجویان بین‌المللی', 'نیروی کار خارجی', 'شهروندان ایرانی مقیم رومانی'],
  generalExceptions: [
    'گواهی‌نامه‌های منقضی شده خارج از اتحادیه اروپا قابل تبدیل نیستند؛ باید گواهی‌نامه جدید دریافت کنید.',
    'گواهی‌نامه کشورهای خارج از لیست ضمیمه ۱ دستورالعمل OMAI 163/2011 (و اصلاحات بعدی آن) بدون شرکت در آزمون قابل تبدیل نیستند.'
  ],
  commonProblems: [
    'تاخیر در فرآیند استعلام اصالت گواهی‌نامه از طریق سفارت.',
    'انقضای اعتبار فرم معاینه پزشکی پیش از پردازش نهایی پرونده (اعتبار این فرم ۶ ماه است).'
  ],
  warnings: [
    'نکته مهم اقامتی: پس از استقرار قانونی و دریافت کارت اقامت (Permis de Ședere)، طبق قوانین جاری رومانی معمولاً باید برای تبدیل گواهی‌نامه به گواهی‌نامه رومانیایی اقدام شود.'
  ],
  officialSources: [
    {
      id: 'dgpci-exchange',
      sourceTitle: 'DGPCI - Preschimbare Permise Străine',
      organization: 'اداره کل گواهی‌نامه‌های رانندگی و ثبت وسایل نقلیه',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
    {
      id: 'omai-163-2011',
      sourceTitle: 'Ordinul MAI 163/2011 privind preschimbarea permiselor',
      organization: 'وزارت امور داخلی رومانی',
      url: 'https://legislatie.just.ro/Public/DetaliiDocument/131062',
      sourceType: 'legislation',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    }
  ],
  relatedGuides: [
    { route: '/needs/first-days-checklist', title: 'چک‌لیست روزهای نخست ورود' },
    { route: '/needs/health', title: 'خدمات درمانی و سلامت (فرم Fișa Medicală)' }
  ],
  lastReviewed: '2026-08-04',
  nextReview: '2027-02-04',
  contentOwner: 'تیم حقوقی DORVIA EUROP',
  contentStatus: 'published',
  factCheckStatus: 'source-verified',
  riskCategory: ['LEGAL'],
  
  situations: [
    {
      id: 'temporary',
      title: 'استفاده موقت از گواهی‌نامه خارجی',
      appliesTo: ['توریست‌ها', 'دارندگان ویزای کوتاه‌مدت', 'مهاجران پیش از دریافت کارت اقامت'],
      exceptions: ['در صورتی که گواهی‌نامه به حروف لاتین نباشد، داشتن گواهی‌نامه بین‌المللی (IDP) یا ترجمه رسمی الزامی است.'],
      limitations: ['تنها تا زمانی اعتبار دارد که اقامت دائم یا موقت خود را ثبت کنید؛ پس از آن مقررات تبدیل اعمال می‌شود.'],
      documents: [],
      steps: [],
      fees: [],
      timeline: []
    },
    {
      id: 'exchange-iran',
      title: 'تبدیل گواهی‌نامه ایرانی در رومانی',
      appliesTo: ['اتباع ایرانی دارای گواهی‌نامه معتبر ایرانی و کارت اقامت قانونی رومانی (Permis de Ședere)'],
      residenceCondition: 'دارا بودن کارت اقامت موقت یا دائم معتبر',
      authority: 'اداره DGPCI',
      requiresExamination: false,
      requiresMedical: true,
      documents: [
        { name: 'اصل گواهی‌نامه ایرانی معتبر + کپی', isMandatory: true },
        { name: 'ترجمه رسمی محضری گواهی‌نامه به رومانیایی', isMandatory: true },
        { name: 'اصل گواهی اصالت صادرشده از سفارت ایران', description: 'دریافت از طریق سامانه میخک/سفارت', isMandatory: true },
        { name: 'کارت اقامت معتبر رومانی + کپی', isMandatory: true },
        { name: 'پاسپورت معتبر + کپی صفحات هویتی', isMandatory: true },
        { name: 'برگه معاینه پزشکی تاییدشده (Fișa Medicală)', isMandatory: true },
        { name: 'فیش پرداخت هزینه ثبت نام به حساب DGPCI', isMandatory: true },
        { name: 'فرم درخواست رسمی تکمیل‌شده DGPCI', isMandatory: true }
      ],
      steps: [
        { title: 'استعلام اصالت در سفارت', description: 'تماس با بخش کنسولی سفارت ایران برای اطلاع از نوع خدمت و دریافت تاییدیه اصالت گواهی‌نامه.' },
        { title: 'ترجمه رسمی', description: 'ترجمه رسمی گواهی‌نامه و نامه سفارت توسط مترجم مجاز رومانیایی.' },
        { title: 'معاینه پزشکی', description: 'انجام معاینات (بینایی، شنوایی و عمومی) در کلینیک‌های معتمد DGPCI.' },
        { title: 'ثبت پرونده در DGPCI', description: 'تحویل پرونده تکمیل‌شده به اداره راهور استان محل سکونت و دریافت رسید.' }
      ],
      fees: [
        { amount: '89', currency: 'RON', description: 'تعرفه صدور گواهی‌نامه DGPCI (مبلغ ثابت دولتی)', isFixed: true, sourceId: 'dgpci-exchange' },
        { amount: '150 - 250', currency: 'RON', description: 'هزینه معاینات پزشکی (بسته به کلینیک انتخابی)', isFixed: false },
        { amount: '100 - 200', currency: 'RON', description: 'ترجمه رسمی و تایید محضری (به ازای هر مدرک)', isFixed: false }
      ],
      timeline: [
        { duration: '۳۰ - ۹۰ روز', description: 'فرآیند بررسی اصالت گواهی‌نامه‌های خارج از اتحادیه اروپا نیازمند مکاتبه با سفارت است و زمان می‌برد.', isGuaranteed: false }
      ],
      exceptions: ['گواهی‌نامه‌های منقضی شده قابل تبدیل نیستند.'],
      limitations: ['امکان نگهداری همزمان دو گواهی‌نامه وجود ندارد؛ گواهی‌نامه ایرانی شما اخذ و به مرجع صادرکننده در ایران عودت داده می‌شود.'],
      actionLink: { url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf', label: 'پورتال رسمی DGPCI' }
    },
    {
      id: 'scratch',
      title: 'گرفتن گواهی‌نامه از ابتدا (آموزشگاه)',
      appliesTo: ['اتباع خارجی که فاقد هرگونه گواهی‌نامه رانندگی هستند', 'دارندگان گواهی‌نامه منقضی شده یا کشورهایی که در لیست تبدیل قرار ندارند'],
      residenceCondition: 'باید دارای اقامت قانونی رومانی باشند.',
      requiresExamination: true,
      requiresMedical: true,
      documents: [
        { name: 'کارت اقامت معتبر رومانی', isMandatory: true },
        { name: 'گواهی پزشکی و روان‌سنجی', isMandatory: true },
        { name: 'گواهی سوء پیشینه (Cazier Judiciar)', isMandatory: true },
        { name: 'گواهی پایان دوره آموزشگاه رانندگی', isMandatory: true }
      ],
      steps: [
        { title: 'ثبت‌نام در آموزشگاه', description: 'یافتن آموزشگاه معتبر؛ برخی آموزشگاه‌ها در شهرهای بزرگ کلاس به زبان انگلیسی برگزار می‌کنند.' },
        { title: 'تست پزشکی و روان‌سنجی', description: 'موفقیت در آزمایش‌های پزشکی و روانی الزامی برای رانندگی.' },
        { title: 'آزمون تئوری', description: 'قبولی در آزمون رایانه‌ای آیین‌نامه (Sala). در برخی شهرستان‌ها به زبان انگلیسی نیز ارائه می‌شود.' },
        { title: 'آزمون عملی', description: 'قبولی در آزمون شهری به همراه افسر پلیس.' }
      ],
      fees: [
        { amount: '1500 - 2500', currency: 'RON', description: 'شهریه آموزشگاه رانندگی (بسته به دسته‌بندی و زبان آموزش متغیر است)', isFixed: false },
        { amount: '89', currency: 'RON', description: 'تعرفه صدور گواهی‌نامه DGPCI', isFixed: true, sourceId: 'dgpci-exchange' }
      ],
      timeline: [
        { duration: '۲ - ۴ ماه', description: 'زمان مورد نیاز برای تکمیل آموزش و قبولی در آزمون‌ها.', isGuaranteed: false }
      ],
      exceptions: [],
      limitations: []
    }
  ]
};
