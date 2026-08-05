export interface RouteConfig {
  canonical: string;
  aliases: string[];
  parentHub: string | null;
  titleFa: string;
  titleEn: string;
  parentTitleFa?: string;
  parentTitleEn?: string;
  indexable: boolean;
  inSitemap: boolean;
  pageType: 'hub' | 'content' | 'legal' | 'admin' | 'api' | 'special';
}

export const ROUTE_REGISTRY: Record<string, RouteConfig> = {
  'home': {
    canonical: '/',
    aliases: [],
    parentHub: null,
    titleFa: 'صفحه اصلی',
    titleEn: 'Home',
    indexable: true,
    inSitemap: true,
    pageType: 'special'
  },
  'about': {
    canonical: '/about',
    aliases: [],
    parentHub: null,
    titleFa: 'درباره ما',
    titleEn: 'About Us',
    indexable: true,
    inSitemap: true,
    pageType: 'special'
  },
  'contact': {
    canonical: '/contact',
    aliases: [],
    parentHub: null,
    titleFa: 'تماس با ما',
    titleEn: 'Contact',
    indexable: true,
    inSitemap: true,
    pageType: 'special'
  },
  'universities': {
    canonical: '/universities',
    aliases: [],
    parentHub: null,
    titleFa: 'دانشگاه‌ها',
    titleEn: 'Universities',
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
  'services': {
    canonical: '/services',
    aliases: [],
    parentHub: null,
    titleFa: 'خدمات ما',
    titleEn: 'Our Services',
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
  'articles': {
    canonical: '/articles',
    aliases: [],
    parentHub: null,
    titleFa: 'مقالات و اخبار',
    titleEn: 'Articles & News',
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
  'needs': {
    canonical: '/needs',
    aliases: [],
    parentHub: null,
    titleFa: 'نیازمندی‌ها و استقرار',
    titleEn: 'Essentials & Settlement',
    
    
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
  'immigration': {
    canonical: '/immigration',
    aliases: [],
    parentHub: null,
    titleFa: 'مهاجرت و اقامت',
    titleEn: 'Immigration & Residence',
    
    
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
  'work': {
    canonical: '/work',
    aliases: [],
    parentHub: null,
    titleFa: 'کار و اشتغال',
    titleEn: 'Work & Employment',
    
    
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
  'company': {
    canonical: '/company',
    aliases: [],
    parentHub: null,
    titleFa: 'ثبت شرکت و سرمایه‌گذاری',
    titleEn: 'Business & Investment',
    
    
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
  'study': {
    canonical: '/study',
    aliases: [],
    parentHub: null,
    titleFa: 'تحصیل در رومانی',
    titleEn: 'Study in Romania',
    
    
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
  'romania': {
    canonical: '/romania',
    aliases: [],
    parentHub: null,
    titleFa: 'درباره رومانی',
    titleEn: 'About Romania',
    
    
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
  'start-here': {
    canonical: '/start-here',
    aliases: [],
    parentHub: null,
    titleFa: 'از کجا شروع کنم',
    titleEn: 'Start Here',
    
    
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },

  'needs/driving-license': {
    canonical: '/needs/driving-license',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'گواهینامه رانندگی',
    titleEn: 'Driving License',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/first-days-checklist': {
    canonical: '/needs/first-days-checklist',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'چک‌لیست روزهای نخست ورود',
    titleEn: 'First-Days Arrival Checklist',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/housing': {
    canonical: '/needs/housing',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'اجاره و خرید مسکن',
    titleEn: 'Renting & Buying Property',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/banking': {
    canonical: '/needs/banking',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'افتتاح حساب بانکی',
    titleEn: 'Bank Account Opening',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/certified-translation': {
    canonical: '/needs/certified-translation',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'دارالترجمه رسمی',
    titleEn: 'Certified Translation',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/notary-public': {
    canonical: '/needs/notary-public',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'دفتر اسناد رسمی (Notary)',
    titleEn: 'Notary Public',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/iranian-embassy-and-mikhak': {
    canonical: '/needs/iranian-embassy-and-mikhak',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'سفارت ایران و سامانه میخک',
    titleEn: 'Iranian Embassy & Mikhak',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/health': {
    canonical: '/needs/health',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'خدمات درمانی و بیمه سلامت',
    titleEn: 'Healthcare & Insurance',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/school': {
    canonical: '/needs/school',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'ثبت‌نام مدارس و معادلسازی مدارک',
    titleEn: 'Schools & Education',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/telecom': {
    canonical: '/needs/telecom',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'تلفن همراه، اینترنت و تلویزیون',
    titleEn: 'Telecom, Internet & TV',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/currency-exchange': {
    canonical: '/needs/currency-exchange',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'صرافی و پرداخت‌های ارزی',
    titleEn: 'Currency Exchange',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'needs/transportation': {
    canonical: '/needs/transportation',
    aliases: [],
    parentHub: '/needs',
    titleFa: 'حمل‌ونقل عمومی و بین‌شهری',
    titleEn: 'Public Transportation',
    parentTitleFa: 'نیازمندی‌ها و استقرار',
    parentTitleEn: 'Essentials & Settlement',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'immigration/igi-process': {
    canonical: '/immigration/igi-process',
    aliases: [],
    parentHub: '/immigration',
    titleFa: 'مراحل و نوبت‌دهی IGI',
    titleEn: 'IGI Residency Process',
    parentTitleFa: 'مهاجرت و اقامت',
    parentTitleEn: 'Immigration & Residence',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'immigration/residence-renewal': {
    canonical: '/immigration/residence-renewal',
    aliases: [],
    parentHub: '/immigration',
    titleFa: 'تمدید کارت اقامت',
    titleEn: 'Residence Renewal',
    parentTitleFa: 'مهاجرت و اقامت',
    parentTitleEn: 'Immigration & Residence',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'immigration/family-reunification': {
    canonical: '/immigration/family-reunification',
    aliases: [],
    parentHub: '/immigration',
    titleFa: 'پیوست خانواده',
    titleEn: 'Family Reunification',
    parentTitleFa: 'مهاجرت و اقامت',
    parentTitleEn: 'Immigration & Residence',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'immigration/long-term-residence': {
    canonical: '/immigration/long-term-residence',
    aliases: [],
    parentHub: '/immigration',
    titleFa: 'اقامت بلندمدت و دائم',
    titleEn: 'Long-Term Residence',
    parentTitleFa: 'مهاجرت و اقامت',
    parentTitleEn: 'Immigration & Residence',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'immigration/citizenship': {
    canonical: '/immigration/citizenship',
    aliases: [],
    parentHub: '/immigration',
    titleFa: 'تابعیت و پاسپورت رومانی',
    titleEn: 'Romanian Citizenship',
    parentTitleFa: 'مهاجرت و اقامت',
    parentTitleEn: 'Immigration & Residence',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'work/finding-job': {
    canonical: '/work/finding-job',
    aliases: [],
    parentHub: '/work',
    titleFa: 'پیدا کردن کار و رزومه‌نویسی',
    titleEn: 'Finding a Job',
    parentTitleFa: 'کار و اشتغال',
    parentTitleEn: 'Work & Employment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'work/work-permit': {
    canonical: '/work/work-permit',
    aliases: [],
    parentHub: '/work',
    titleFa: 'مجوز کار (Aviz de Muncă)',
    titleEn: 'Work Permit (Aviz de Muncă)',
    parentTitleFa: 'کار و اشتغال',
    parentTitleEn: 'Work & Employment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'work/work-visa': {
    canonical: '/work/work-visa',
    aliases: [],
    parentHub: '/work',
    titleFa: 'ویزای کاری (نوع D/AM)',
    titleEn: 'Work Visa (Type D/AM)',
    parentTitleFa: 'کار و اشتغال',
    parentTitleEn: 'Work & Employment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'work/employment-contract': {
    canonical: '/work/employment-contract',
    aliases: [],
    parentHub: '/work',
    titleFa: 'قرارداد استخدام و حقوق کارمند',
    titleEn: 'Employment Contract',
    parentTitleFa: 'کار و اشتغال',
    parentTitleEn: 'Work & Employment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'work/taxes-salaries': {
    canonical: '/work/taxes-salaries',
    aliases: [],
    parentHub: '/work',
    titleFa: 'حقوق و مالیات کارمندی',
    titleEn: 'Salary & Taxes',
    parentTitleFa: 'کار و اشتغال',
    parentTitleEn: 'Work & Employment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'work/insurance': {
    canonical: '/work/insurance',
    aliases: [],
    parentHub: '/work',
    titleFa: 'بیمه اجتماعی و درمانی',
    titleEn: 'Social & Health Insurance',
    parentTitleFa: 'کار و اشتغال',
    parentTitleEn: 'Work & Employment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'company/registration': {
    canonical: '/company/registration',
    aliases: [],
    parentHub: '/company',
    titleFa: 'ثبت شرکت (SRL)',
    titleEn: 'Company Registration (SRL)',
    parentTitleFa: 'ثبت شرکت و سرمایه‌گذاری',
    parentTitleEn: 'Business & Investment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'company/tax-types': {
    canonical: '/company/tax-types',
    aliases: [],
    parentHub: '/company',
    titleFa: 'انواع مالیات شرکتی',
    titleEn: 'Corporate Tax Types',
    parentTitleFa: 'ثبت شرکت و سرمایه‌گذاری',
    parentTitleEn: 'Business & Investment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'company/bank-account': {
    canonical: '/company/bank-account',
    aliases: [],
    parentHub: '/company',
    titleFa: 'حساب بانکی تجاری',
    titleEn: 'Corporate Bank Account',
    parentTitleFa: 'ثبت شرکت و سرمایه‌گذاری',
    parentTitleEn: 'Business & Investment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'company/residency': {
    canonical: '/company/residency',
    aliases: [],
    parentHub: '/company',
    titleFa: 'اقامت از طریق ثبت شرکت',
    titleEn: 'Residency via Business',
    parentTitleFa: 'ثبت شرکت و سرمایه‌گذاری',
    parentTitleEn: 'Business & Investment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'company/real-estate-investment': {
    canonical: '/company/real-estate-investment',
    aliases: [],
    parentHub: '/company',
    titleFa: 'سرمایه‌گذاری در املاک',
    titleEn: 'Real Estate Investment',
    parentTitleFa: 'ثبت شرکت و سرمایه‌گذاری',
    parentTitleEn: 'Business & Investment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'company/startup-tech-investment': {
    canonical: '/company/startup-tech-investment',
    aliases: [],
    parentHub: '/company',
    titleFa: 'سرمایه‌گذاری استارتاپ و تکنولوژی',
    titleEn: 'Startup & Tech Investment',
    parentTitleFa: 'ثبت شرکت و سرمایه‌گذاری',
    parentTitleEn: 'Business & Investment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'company/annual-tax-reporting': {
    canonical: '/company/annual-tax-reporting',
    aliases: [],
    parentHub: '/company',
    titleFa: 'گزارش مالیاتی سالانه',
    titleEn: 'Annual Tax Reporting',
    parentTitleFa: 'ثبت شرکت و سرمایه‌گذاری',
    parentTitleEn: 'Business & Investment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'company/investment': {
    canonical: '/company/investment',
    aliases: [],
    parentHub: '/company',
    titleFa: 'فرصت‌های سرمایه‌گذاری',
    titleEn: 'Investment Opportunities',
    parentTitleFa: 'ثبت شرکت و سرمایه‌گذاری',
    parentTitleEn: 'Business & Investment',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'study/requirements': {
    canonical: '/study/requirements',
    aliases: [],
    parentHub: '/study',
    titleFa: 'مدارک و الزامات پذیرش',
    titleEn: 'Admission Requirements',
    parentTitleFa: 'تحصیل در رومانی',
    parentTitleEn: 'Study in Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'study/visa-type-d': {
    canonical: '/study/visa-type-d',
    aliases: [],
    parentHub: '/study',
    titleFa: 'ویزای تحصیلی نوع D/SD',
    titleEn: 'Type D/SD Student Visa',
    parentTitleFa: 'تحصیل در رومانی',
    parentTitleEn: 'Study in Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'study/tuition-overview': {
    canonical: '/study/tuition-overview',
    aliases: [],
    parentHub: '/study',
    titleFa: 'شهریه‌های تحصیلی',
    titleEn: 'Tuition Rates',
    parentTitleFa: 'تحصیل در رومانی',
    parentTitleEn: 'Study in Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'study/preparatory-year': {
    canonical: '/study/preparatory-year',
    aliases: [],
    parentHub: '/study',
    titleFa: 'سال زبان (Anul Pregătitor)',
    titleEn: 'Language Preparatory Year',
    parentTitleFa: 'تحصیل در رومانی',
    parentTitleEn: 'Study in Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'study/scholarships': {
    canonical: '/study/scholarships',
    aliases: [],
    parentHub: '/study',
    titleFa: 'بورسیه‌های تحصیلی دولتی',
    titleEn: 'Government Scholarships',
    parentTitleFa: 'تحصیل در رومانی',
    parentTitleEn: 'Study in Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'study/part-time-work': {
    canonical: '/study/part-time-work',
    aliases: [],
    parentHub: '/study',
    titleFa: 'مجوز کار دانشجویی',
    titleEn: 'Student Work Permits',
    parentTitleFa: 'تحصیل در رومانی',
    parentTitleEn: 'Study in Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'start-here/planning-to-come': {
    canonical: '/start-here/planning-to-come',
    aliases: [],
    parentHub: '/start-here',
    titleFa: 'برنامه‌ریزی برای ورود',
    titleEn: 'Planning Your Move',
    parentTitleFa: 'از کجا شروع کنم',
    parentTitleEn: 'Start Here',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'start-here/newly-arrived': {
    canonical: '/start-here/newly-arrived',
    aliases: [],
    parentHub: '/start-here',
    titleFa: 'تازه‌واردین (۷۲ ساعت اول)',
    titleEn: 'Newly Arrived',
    parentTitleFa: 'از کجا شروع کنم',
    parentTitleEn: 'Start Here',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'start-here/settling-in': {
    canonical: '/start-here/settling-in',
    aliases: [],
    parentHub: '/start-here',
    titleFa: 'استقرار و ماه اول',
    titleEn: 'Settling In',
    parentTitleFa: 'از کجا شروع کنم',
    parentTitleEn: 'Start Here',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'start-here/long-term-stay': {
    canonical: '/start-here/long-term-stay',
    aliases: [],
    parentHub: '/start-here',
    titleFa: 'اقامت و زندگی بلندمدت',
    titleEn: 'Long-Term Life',
    parentTitleFa: 'از کجا شروع کنم',
    parentTitleEn: 'Start Here',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'start-here/citizenship-goal': {
    canonical: '/start-here/citizenship-goal',
    aliases: [],
    parentHub: '/start-here',
    titleFa: 'هدف‌گذاری تابعیت رومانی',
    titleEn: 'Citizenship Path',
    parentTitleFa: 'از کجا شروع کنم',
    parentTitleEn: 'Start Here',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'romania/economy': {
    canonical: '/romania/economy',
    aliases: [],
    parentHub: '/romania',
    titleFa: 'اقتصاد و بازار مالی',
    titleEn: 'Economy & Markets',
    parentTitleFa: 'درباره رومانی',
    parentTitleEn: 'About Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'romania/society': {
    canonical: '/romania/society',
    aliases: [],
    parentHub: '/romania',
    titleFa: 'جامعه و زندگی اجتماعی',
    titleEn: 'Society & Social Life',
    parentTitleFa: 'درباره رومانی',
    parentTitleEn: 'About Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'romania/culture-and-arts': {
    canonical: '/romania/culture-and-arts',
    aliases: [],
    parentHub: '/romania',
    titleFa: 'فرهنگ و هنر',
    titleEn: 'Culture & Arts',
    parentTitleFa: 'درباره رومانی',
    parentTitleEn: 'About Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'romania/laws-and-regulations': {
    canonical: '/romania/laws-and-regulations',
    aliases: [],
    parentHub: '/romania',
    titleFa: 'قوانین و مقررات',
    titleEn: 'Laws & Regulations',
    parentTitleFa: 'درباره رومانی',
    parentTitleEn: 'About Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'romania/tourism': {
    canonical: '/romania/tourism',
    aliases: [],
    parentHub: '/romania',
    titleFa: 'گردشگری و جاذبه‌ها',
    titleEn: 'Tourism & Travel',
    parentTitleFa: 'درباره رومانی',
    parentTitleEn: 'About Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'romania/geography': {
    canonical: '/romania/geography',
    aliases: [],
    parentHub: '/romania',
    titleFa: 'جغرافیا و شهرهای اصلی',
    titleEn: 'Geography & Cities',
    parentTitleFa: 'درباره رومانی',
    parentTitleEn: 'About Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'romania/history': {
    canonical: '/romania/history',
    aliases: [],
    parentHub: '/romania',
    titleFa: 'تاریخ رومانی',
    titleEn: 'History of Romania',
    parentTitleFa: 'درباره رومانی',
    parentTitleEn: 'About Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'content'
  },
  'legal/privacy': {
    canonical: '/legal/privacy',
    aliases: ['/legal'],
    parentHub: null,
    titleFa: 'حریم خصوصی',
    titleEn: 'Privacy Policy',
    parentTitleFa: 'حقوقی و شرایط',
    parentTitleEn: 'Legal & Terms',
    indexable: true,
    inSitemap: true,
    pageType: 'legal'
  },
  'legal/terms': {
    canonical: '/legal/terms',
    aliases: [],
    parentHub: null,
    titleFa: 'شرایط استفاده',
    titleEn: 'Terms of Use',
    parentTitleFa: 'حقوقی و شرایط',
    parentTitleEn: 'Legal & Terms',
    indexable: true,
    inSitemap: true,
    pageType: 'legal'
  },
  'legal/disclaimer': {
    canonical: '/legal/disclaimer',
    aliases: [],
    parentHub: null,
    titleFa: 'سلب مسئولیت',
    titleEn: 'Legal Disclaimer',
    parentTitleFa: 'حقوقی و شرایط',
    parentTitleEn: 'Legal & Terms',
    indexable: true,
    inSitemap: true,
    pageType: 'legal'
  },

  'romania-cities': {
    canonical: '/romania/cities',
    aliases: ['/cities'],
    parentHub: '/romania',
    titleFa: 'شهرهای رومانی',
    titleEn: 'Cities of Romania',
    indexable: true,
    inSitemap: true,
    pageType: 'hub'
  },
};
