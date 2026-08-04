import { OperationalGuide } from '../../../types/content';

export const drivingLicenseFA: OperationalGuide = {
  canonicalRoute: '/needs/driving-license',
  locale: 'fa',
  title: 'گواهینامه رانندگی در رومانی: تبدیل، صدور جدید و قوانین',
  shortDescription: 'راهنمای جامع رانندگی با گواهینامه خارجی، تبدیل گواهینامه ایرانی، مراحل صدور گواهینامه جدید، تمدید و گواهینامه بین‌المللی.',
  mainQuestion: 'چگونه می‌توانم به عنوان یک مقیم خارجی در رومانی به صورت قانونی رانندگی کنم یا گواهینامه بگیرم؟',
  quickAnswer: 'اگر گواهینامه خارجی معتبر و گواهینامه بین‌المللی دارید، می‌توانید به طور موقت رانندگی کنید. پس از دریافت اقامت، باید آن را به گواهینامه رومانیایی تبدیل کنید (بدون آزمون برای کشورهای مجاز). در غیر این صورت باید از طریق آموزشگاه رانندگی برای گواهینامه جدید اقدام کنید.',
  targetAudience: ['مهاجران', 'دانشجویان بین‌المللی', 'نیروی کار خارجی', 'شهروندان ایرانی در رومانی'],
  generalExceptions: [
    'گواهینامه‌های غیر اروپایی تاریخ‌گذشته قابل تبدیل نیستند؛ باید برای گواهینامه جدید اقدام کنید.',
    'گواهینامه‌های کشورهای خارج از پیوست 1 دستورالعمل OMAI 163/2011 مستقیماً و بدون آزمون قابل تبدیل نیستند.'
  ],
  commonProblems: [
    'تأخیر در تایید اصالت و اعتبار گواهینامه از سوی کشور صادرکننده.',
    'انقضای گواهی پزشکی پیش از رسیدگی به درخواست (اعتبار آن ۶ ماه است).'
  ],
  warnings: [
    'نکته مهم اقامت: به محض دریافت اقامت قانونی (Permis de Ședere)، قانون رومانی معمولاً شما را ملزم می‌کند تا در صورت تمایل به رانندگی، گواهینامه خود را در یک بازه زمانی مشخص تبدیل کنید.'
  ],
  officialSources: [
    {
      id: 'dgpci-idp',
      sourceTitle: 'DGPCI - Eliberare Permis de Conducere Internațional',
      organization: 'Directia Generală Permise de Conducere și Înmatriculări',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
    {
      id: 'dgpci-exchange',
      sourceTitle: 'DGPCI - Preschimbare Permise Străine',
      organization: 'Directia Generală Permise de Conducere și Înmatriculări',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
    {
      id: 'omai-163-2011',
      sourceTitle: 'Ordinul MAI 163/2011 privind preschimbarea permiselor',
      organization: 'Ministry of Internal Affairs',
      url: 'https://legislatie.just.ro/Public/DetaliiDocument/131062',
      sourceType: 'legislation',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
    {
      id: 'dgpci-exam',
      sourceTitle: 'DGPCI - Obținerea permisului de conducere',
      organization: 'DGPCI',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f25a10a30b538053a4ce',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
    {
      id: 'dgpci-renewal',
      sourceTitle: 'DGPCI - Preschimbarea permisului românesc',
      organization: 'DGPCI',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f2cf10a30b538053a4d0',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
    {
      id: 'codul-rutier',
      sourceTitle: 'Codul Rutier (O.U.G. 195/2002)',
      organization: 'Guvernul României',
      url: 'https://legislatie.just.ro/Public/DetaliiDocument/39474',
      sourceType: 'legislation',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    }
  ],
  relatedGuides: [
    { route: '/needs/first-days-checklist', title: 'چک‌لیست روزهای اول پس از ورود' },
    { route: '/needs/health', title: 'بیمه و درمان (اطلاعات گواهی پزشکی)' }
  ],
  lastReviewed: '2026-08-04',
  nextReview: '2027-02-04',
  contentOwner: 'تیم حقوقی DORVIA EUROP',
  contentStatus: 'published',
  factCheckStatus: 'source-verified',
  riskCategory: ['LEGAL'],
  
  situations: [
    {
      id: 'temporary-foreign-licence-use',
      title: 'استفاده موقت از گواهینامه خارجی',
      appliesTo: ['توریست‌ها', 'دارندگان ویزای کوتاه‌مدت', 'تازه‌واردان پیش از دریافت کارت اقامت'],
      documents: [],
      steps: [],
      fees: [],
      timeline: [],
      exceptions: [],
      limitations: []
    },
    {
      id: 'foreign-licence-exchange',
      title: 'تبدیل گواهینامه خارجی (عمومی)',
      appliesTo: ['اتباع خارجی از کشورهای پیوست 1 دستورالعمل (OMAI 163/2011)'],
      residenceCondition: 'داشتن کارت اقامت معتبر رومانی',
      authority: 'DGPCI (پلیس راهنمایی و رانندگی و ثبت وسایل نقلیه)',
      requiresExamination: false,
      requiresMedical: 'conditional',
      medicalConditionText: 'A medical document is required when the applicant requests a Romanian licence with new administrative validity. A duplicate or replacement retaining the existing administrative validity may not require it.',
      documents: [
        { name: 'اصل گواهینامه معتبر خارجی + کپی', isMandatory: true },
        { name: 'ترجمه رسمی رومانیایی گواهینامه', isMandatory: true },
        { name: 'کارت اقامت معتبر رومانی + کپی', isMandatory: true },
        { name: 'گذرنامه معتبر + کپی', isMandatory: true },
        { name: 'فرم تکمیل‌شده درخواست DGPCI', isMandatory: true }
      ],
      steps: [],
      fees: [
        { amount: '89', currency: 'RON', description: 'هزینه صدور گواهینامه جهت تبدیل. قابل پرداخت از طریق بانک CEC، سایت ghișeul.ro یا باجه‌های DGPCI.', isFixed: true, sourceId: 'dgpci-exchange' }
      ],
      timeline: [],
      exceptions: ['گواهینامه‌های تاریخ‌گذشته قابل تبدیل نیستند.'],
      limitations: []
    },
    {
      id: 'iranian-issued-licence',
      title: 'تبدیل گواهینامه ایرانی در رومانی',
      appliesTo: ['شهروندان ایرانی دارای گواهینامه معتبر ایرانی و کارت اقامت رومانی'],
      residenceCondition: 'کارت اقامت معتبر رومانی',
      authority: 'DGPCI',
      requiresExamination: false,
      requiresMedical: 'required',
      documents: [
        { name: 'اصل گواهینامه معتبر ایرانی + کپی', isMandatory: true },
        { name: 'ترجمه رسمی رومانیایی گواهینامه', isMandatory: true },
        { name: 'کارت اقامت معتبر رومانی + کپی', isMandatory: true },
        { name: 'گذرنامه معتبر + کپی', isMandatory: true },
        { name: 'گواهی سلامت پزشکی (Fișa Medicală) جهت دریافت اعتبار اداری جدید', isMandatory: true },
        { name: 'رسید پرداخت هزینه صدور DGPCI', isMandatory: true },
        { name: 'فرم تکمیل‌شده درخواست DGPCI', isMandatory: true }
      ],
      steps: [
        { title: 'بررسی اصالت', description: 'مرجع ذی‌صلاح رومانیایی فرآیند استعلام از کشور صادرکننده را مدیریت می‌کند. اصالت و اعتبار گواهینامه باید تایید شود. ممکن است مدارک اضافی درخواست شود.' },
        { title: 'ترجمه رسمی', description: 'ترجمه رسمی گواهینامه ایرانی توسط مترجم مجاز رومانیایی.' },
        { title: 'معاینه پزشکی', description: 'انجام معاینات پزشکی در کلینیک‌های مورد تایید DGPCI.' },
        { title: 'ثبت درخواست در DGPCI', description: 'ارائه پرونده تکمیل‌شده به دفتر استانی DGPCI، پرداخت هزینه صدور و دریافت رسید ثبت‌نام.' }
      ],
      fees: [
        { amount: '89', currency: 'RON', description: 'هزینه صدور گواهینامه جهت تبدیل. قابل پرداخت از طریق بانک CEC، سایت ghișeul.ro یا باجه‌های DGPCI.', isFixed: true, sourceId: 'dgpci-exchange' }
      ],
      timeline: [
        { duration: 'متغیر', description: 'مدت زمان بستگی به فرآیند تایید اصالت و اعتبار از سوی کشور صادرکننده دارد. متقاضی باید الزامات فعلی را از خدمات شهرستان مربوطه جویا شود.', isGuaranteed: false }
      ],
      exceptions: ['گواهینامه‌های تاریخ‌گذشته قابل تبدیل نیستند.'],
      limitations: ['شما نمی‌توانید همزمان هر دو گواهینامه را در اختیار داشته باشید. گواهینامه ایرانی شما اخذ خواهد شد.'],
      actionLink: { url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf', label: 'پورتال رسمی DGPCI' }
    },
    {
      id: 'obtain-romanian-licence-from-scratch',
      title: 'اخذ گواهینامه رانندگی جدید (از صفر)',
      appliesTo: ['اتباع خارجی که گواهینامه ندارند', 'دارندگان گواهینامه‌های خارجی غیرقابل تبدیل یا منقضی‌شده'],
      residenceCondition: 'داشتن کارت اقامت معتبر رومانی الزامی است.',
      requiresExamination: true,
      requiresMedical: 'required',
      documents: [
        { name: 'کارت اقامت معتبر رومانی', isMandatory: true },
        { name: 'گواهی پزشکی و روانشناسی', isMandatory: true },
        { name: 'گواهی عدم سوء‌پیشینه (Cazier Judiciar)', isMandatory: true },
        { name: 'گواهی پایان دوره آموزشگاه رانندگی', isMandatory: true }
      ],
      steps: [
        { title: 'ثبت‌نام در آموزشگاه رانندگی', description: 'یک آموزشگاه مجاز پیدا کنید. برخی آموزشگاه‌ها در شهرهای بزرگ کلاس‌های انگلیسی دارند.' },
        { title: 'آزمون‌های پزشکی و روانشناسی', description: 'گذراندن آزمایش‌های سلامت جسمی و روانی.' },
        { title: 'آزمون آیین‌نامه (تئوری)', description: 'قبولی در آزمون کامپیوتری (Sala).' },
        { title: 'آزمون عملی', description: 'قبولی در آزمون عملی رانندگی در جاده با ممتحن پلیس.' }
      ],
      fees: [
        { amount: '89', currency: 'RON', description: 'هزینه صدور گواهینامه DGPCI. قابل پرداخت از طریق بانک CEC، سایت ghișeul.ro یا باجه‌های DGPCI.', isFixed: true, sourceId: 'dgpci-exam' }
      ],
      timeline: [],
      exceptions: [],
      limitations: []
    },
    {
      id: 'renew-romanian-licence',
      title: 'تمدید گواهینامه رومانیایی',
      appliesTo: ['دارندگان گواهینامه رومانیایی که به تاریخ انقضا نزدیک می‌شوند'],
      residenceCondition: 'داشتن اقامت معتبر یا شهروندی رومانی.',
      requiresExamination: false,
      requiresMedical: 'required',
      documents: [],
      steps: [],
      fees: [
        { amount: '89', currency: 'RON', description: 'هزینه صدور گواهینامه جهت تمدید. قابل پرداخت از طریق بانک CEC، سایت ghișeul.ro یا DGPCI.', isFixed: true, sourceId: 'dgpci-renewal' }
      ],
      timeline: [],
      exceptions: [],
      limitations: []
    },
        {
      id: 'international-driving-permit',
      title: 'International Driving Permit (IDP)',
      appliesTo: ['Holders of a valid Romanian national driving licence'],
      documents: [
        { name: 'Valid Romanian Driving Licence', isMandatory: true }
      ],
      steps: [],
      fees: [
        { amount: '46', currency: 'RON', description: 'DGPCI fee for IDP issuance.', isFixed: true, sourceId: 'dgpci-idp' }
      ],
      timeline: [
        { duration: 'Up to 30 calendar days', description: 'Legal maximum processing time.', isGuaranteed: false, sourceId: 'dgpci-idp' }
      ],
      exceptions: [],
      limitations: ['Requires a valid Romanian national licence. Foreign licence holders cannot apply for a Romanian IDP.']
    },
    {
      id: 'penalties-suspension-and-restrictions',
      title: 'جرایم، تعلیق و محدودیت‌ها',
      appliesTo: ['هر راننده‌ای که در رومانی رانندگی می‌کند'],
      residenceCondition: 'ندارد',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [],
      steps: [],
      fees: [],
      timeline: [],
      exceptions: [],
      limitations: []
    }
  ]
};
