import { University } from '../types';

export const universitiesData: University[] = [
  // GROUP 1: Medical universities listed as approved by Iran’s Ministry of Health
  {
    id: 'umf-carol-davila',
    displayOrder: 1,
    groupId: 1,
    nameFa: 'دانشگاه پزشکی و داروسازی کارول داویلا',
    nameEn: 'Carol Davila University of Medicine and Pharmacy',
    officialRomanianName: 'Universitatea de Medicină și Farmacie „Carol Davila”',
    cityFa: 'بخارست',
    cityEn: 'Bucharest',
    institutionType: 'Public Medical',
    studyFieldsFa: ['پزشکی عمومی', 'داروسازی', 'دندانپزشکی'],
    studyFieldsEn: ['General Medicine', 'Pharmacy', 'Dentistry'],
    tuitionItems: [
      { program: { fa: 'پزشکی عمومی', en: 'General Medicine' }, amount: 'EUR 10,000/year', feeType: 'tuition' },
      { program: { fa: 'داروسازی', en: 'Pharmacy' }, amount: 'EUR 8,500/year', feeType: 'tuition' },
      { program: { fa: 'دندانپزشکی', en: 'Dentistry' }, amount: 'CONTACT_UNIVERSITY', feeType: 'contact' }
    ],
    tuitionAcademicYear: '2024–2025',
    tuitionVerificationStatus: 'HISTORICAL_OFFICIAL',
    recognitionStatus: 'IRAN_MOH_APPROVED',
    badgeTextFa: '✓ تأیید وزارت بهداشت ایران',
    badgeTextEn: '✓ Listed by Iran’s Ministry of Health',
    warningLevel: 'none',
    descriptionFa: 'قدیمی‌ترین دانشگاه پزشکی رومانی در پایتخت.',
    descriptionEn: 'The oldest medical university in Romania, located in the capital.',
    sourceRecords: [
      { name: 'UMFCD Official', url: 'https://umfcd.ro/' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'مشاهده شرایط ثبت‌نام',
    ctaLabelEn: 'View Admission Requirements',
    ctaHref: '/study',
    ctaType: 'internal',
    disclaimerFa: 'توجه: شهریه‌های ذکر شده مربوط به سال تحصیلی ۲۰۲۴-۲۰۲۵ است. برای شهریه قطعی باید مستقیماً از دانشگاه استعلام شود.',
    disclaimerEn: 'Note: Tuition fees listed are for the 2024-2025 academic year. Current tuition must be confirmed directly with the university.'
  },
  {
    id: 'umf-victor-babes',
    displayOrder: 2,
    groupId: 1,
    nameFa: 'دانشگاه پزشکی و داروسازی ویکتور بابش',
    nameEn: 'Victor Babeș University of Medicine and Pharmacy',
    officialRomanianName: 'Universitatea de Medicină și Farmacie „Victor Babeș”',
    cityFa: 'تیمیشوارا',
    cityEn: 'Timișoara',
    institutionType: 'Public Medical',
    studyFieldsFa: ['پزشکی عمومی', 'داروسازی', 'دندانپزشکی'],
    studyFieldsEn: ['General Medicine', 'Pharmacy', 'Dentistry'],
    tuitionItems: [
      { program: { fa: 'همه رشته‌ها', en: 'All Programs' }, amount: 'CONTACT_UNIVERSITY', feeType: 'contact' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'CONTACT_UNIVERSITY',
    recognitionStatus: 'IRAN_MOH_APPROVED',
    badgeTextFa: '✓ تأیید وزارت بهداشت ایران',
    badgeTextEn: '✓ Listed by Iran’s Ministry of Health',
    warningLevel: 'none',
    descriptionFa: 'دانشگاهی پیشرو در زمینه پزشکی در غرب رومانی.',
    descriptionEn: 'A leading medical university in western Romania.',
    sourceRecords: [
      { name: 'UMFT Official Admissions', url: 'https://www.umft.ro/' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'سایت رسمی دانشگاه',
    ctaLabelEn: 'Official University Website',
    ctaHref: 'https://www.umft.ro/',
    ctaType: 'external'
  },
  {
    id: 'umf-grigore-t-popa',
    displayOrder: 3,
    groupId: 1,
    nameFa: 'دانشگاه پزشکی و داروسازی گریگوره ت. پوپا',
    nameEn: 'Grigore T. Popa University of Medicine and Pharmacy',
    officialRomanianName: 'Universitatea de Medicină și Farmacie „Grigore T. Popa”',
    cityFa: 'یاش',
    cityEn: 'Iași',
    institutionType: 'Public Medical',
    studyFieldsFa: ['پزشکی عمومی', 'داروسازی', 'دندانپزشکی'],
    studyFieldsEn: ['General Medicine', 'Pharmacy', 'Dentistry'],
    tuitionItems: [
      { program: { fa: 'همه رشته‌ها', en: 'All Programs' }, amount: 'CONTACT_UNIVERSITY', feeType: 'contact' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'CONTACT_UNIVERSITY',
    recognitionStatus: 'IRAN_MOH_APPROVED',
    badgeTextFa: '✓ تأیید وزارت بهداشت ایران',
    badgeTextEn: '✓ Listed by Iran’s Ministry of Health',
    warningLevel: 'none',
    descriptionFa: 'یکی از تاریخی‌ترین دانشگاه‌های پزشکی در منطقه مولداوی رومانی.',
    descriptionEn: 'One of the most historic medical universities in the Moldavia region of Romania.',
    sourceRecords: [
      { name: 'UMF Iasi Official Admissions', url: 'https://www.umfiasi.ro/' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'سایت رسمی دانشگاه',
    ctaLabelEn: 'Official University Website',
    ctaHref: 'https://www.umfiasi.ro/',
    ctaType: 'external'
  },
  {
    id: 'umf-iuliu-hatieganu',
    displayOrder: 4,
    groupId: 1,
    nameFa: 'دانشگاه پزشکی و داروسازی یولیو هاتیگانو',
    nameEn: 'Iuliu Hațieganu University of Medicine and Pharmacy',
    officialRomanianName: 'Universitatea de Medicină și Farmacie „Iuliu Hațieganu”',
    cityFa: 'کلوژ-نپوکا',
    cityEn: 'Cluj-Napoca',
    institutionType: 'Public Medical',
    studyFieldsFa: ['پزشکی عمومی', 'داروسازی', 'دندانپزشکی'],
    studyFieldsEn: ['General Medicine', 'Pharmacy', 'Dentistry'],
    tuitionItems: [
      { program: { fa: 'همه رشته‌ها', en: 'All Programs' }, amount: 'CONTACT_UNIVERSITY', feeType: 'contact' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'CONTACT_UNIVERSITY',
    recognitionStatus: 'IRAN_MOH_APPROVED',
    badgeTextFa: '✓ تأیید وزارت بهداشت ایران',
    badgeTextEn: '✓ Listed by Iran’s Ministry of Health',
    warningLevel: 'none',
    descriptionFa: 'دانشگاهی با بالاترین استانداردهای آموزشی در قلب ترانسیلوانیا.',
    descriptionEn: 'A university with the highest educational standards in the heart of Transylvania.',
    sourceRecords: [
      { name: 'UMF Cluj Official Admissions', url: 'https://umfcluj.ro/' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'سایت رسمی دانشگاه',
    ctaLabelEn: 'Official University Website',
    ctaHref: 'https://umfcluj.ro/',
    ctaType: 'external'
  },

  // GROUP 2: Popular general and non-medical universities
  {
    id: 'unibuc',
    displayOrder: 5,
    groupId: 2,
    nameFa: 'دانشگاه بخارست',
    nameEn: 'University of Bucharest',
    officialRomanianName: 'Universitatea din București',
    cityFa: 'بخارست',
    cityEn: 'Bucharest',
    institutionType: 'Public Comprehensive',
    studyFieldsFa: ['حقوق و علوم سیاسی', 'علوم کامپیوتر و ریاضیات', 'زبان‌های خارجی', 'مدیریت'],
    studyFieldsEn: ['Law & Political Science', 'Computer Science & Mathematics', 'Foreign Languages', 'Management'],
    tuitionItems: [
      { program: { fa: 'کارشناسی', en: 'Bachelor' }, amount: 'EUR 2,500–3,150/year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026–2027',
    tuitionVerificationStatus: 'OFFICIAL_RANGE',
    recognitionStatus: 'GENERAL_POPULAR',
    badgeTextFa: 'دانشگاه جامع دولتی',
    badgeTextEn: 'Public Comprehensive',
    warningLevel: 'none',
    descriptionFa: 'قدیمی‌ترین و برجسته‌ترین دانشگاه جامع رومانی. متقاضیان ایرانی با احراز شرایط رسمی امکان استفاده از ۵٪ تخفیف شهریه را دارند.',
    descriptionEn: 'Romania’s premier comprehensive public university. Iranian citizens are eligible for a 5% tuition discount according to official conditions.',
    sourceRecords: [
      { name: 'official international.unibuc.ro bachelor tuition page', url: 'https://international.unibuc.ro' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'اطلاعات تحصیل در رومانی',
    ctaLabelEn: 'Study in Romania Info',
    ctaHref: '/study',
    ctaType: 'internal'
  },
  {
    id: 'upb-polytechnic',
    displayOrder: 6,
    groupId: 2,
    nameFa: 'دانشگاه ملی علوم و فناوری پلی‌تکنیک بخارست',
    nameEn: 'National University of Science and Technology Politehnica Bucharest',
    officialRomanianName: 'Universitatea Națională de Știință și Tehnologie POLITEHNICA București',
    cityFa: 'بخارست',
    cityEn: 'Bucharest',
    institutionType: 'Public Technological',
    studyFieldsFa: ['مهندسی کامپیوتر', 'هوافضا', 'مهندسی برق', 'رباتیک'],
    studyFieldsEn: ['Computer Engineering', 'Aerospace', 'Electrical Engineering', 'Robotics'],
    tuitionItems: [
      { program: { fa: 'مهندسی (همه مقاطع)', en: 'Engineering (All)' }, amount: 'EUR 2,200–7,500/year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'OFFICIAL_RANGE',
    recognitionStatus: 'GENERAL_POPULAR',
    badgeTextFa: 'برترین دانشگاه فنی',
    badgeTextEn: 'Top Technological University',
    warningLevel: 'none',
    descriptionFa: 'بزرگترین و معتبرترین دانشگاه فنی مهندسی در رومانی.',
    descriptionEn: 'The largest and most prestigious technical university in Romania.',
    sourceRecords: [
      { name: 'UPB Official Tuition Document', url: 'https://international.upb.ro/assets/docs/2026/regulations/POLITEHNICA_Bucharest_tuition_fees.pdf' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'مسیر تحصیل',
    ctaLabelEn: 'Study Pathway',
    ctaHref: '/study',
    ctaType: 'internal'
  },
  {
    id: 'ase-bucharest',
    displayOrder: 7,
    groupId: 2,
    nameFa: 'دانشگاه مطالعات اقتصادی بخارست - ASE',
    nameEn: 'Bucharest University of Economic Studies — ASE',
    officialRomanianName: 'Academia de Studii Economice din București',
    cityFa: 'بخارست',
    cityEn: 'Bucharest',
    institutionType: 'Public Economic',
    studyFieldsFa: ['اقتصاد', 'تجارت بین‌الملل', 'حسابداری', 'مدیریت بازرگانی'],
    studyFieldsEn: ['Economics', 'International Business', 'Accounting', 'Business Administration'],
    tuitionItems: [
      { program: { fa: 'کارشناسی', en: 'Bachelor' }, amount: 'EUR 3,500', feeType: 'tuition' },
      { program: { fa: 'ثبت‌نام کارشناسی', en: 'Bachelor Registration' }, amount: 'EUR 350', feeType: 'registration_fee' },
      { program: { fa: 'کارشناسی ارشد', en: 'Master' }, amount: 'EUR 4,500', feeType: 'tuition' },
      { program: { fa: 'ثبت‌نام کارشناسی ارشد', en: 'Master Registration' }, amount: 'EUR 450', feeType: 'registration_fee' }
    ],
    tuitionAcademicYear: '2026–2027',
    tuitionVerificationStatus: 'OFFICIAL_FIXED',
    recognitionStatus: 'GENERAL_POPULAR',
    badgeTextFa: 'دانشگاه برتر اقتصاد',
    badgeTextEn: 'Top Economics University',
    warningLevel: 'none',
    descriptionFa: 'معتبرترین دانشگاه اقتصاد و مدیریت بازرگانی در رومانی.',
    descriptionEn: 'The most prestigious university for economics and business administration in Romania.',
    sourceRecords: [
      { name: 'Official non-EU admission page on international.ase.ro', url: 'https://international.ase.ro' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'شرایط تحصیل',
    ctaLabelEn: 'Study Requirements',
    ctaHref: '/study',
    ctaType: 'internal'
  },
  {
    id: 'rau-bucharest',
    displayOrder: 8,
    groupId: 2,
    nameFa: 'دانشگاه رومانیایی-آمریکایی',
    nameEn: 'Romanian-American University',
    officialRomanianName: 'Universitatea Româno-Americană',
    cityFa: 'بخارست',
    cityEn: 'Bucharest',
    institutionType: 'Private',
    studyFieldsFa: ['کسب و کار', 'روابط بین‌الملل'],
    studyFieldsEn: ['Business', 'International Relations'],
    tuitionItems: [
      { program: { fa: 'هزینه ثبت‌نام اولیه', en: 'Initial Registration Fee' }, amount: 'EUR 50', feeType: 'registration_fee' },
      { program: { fa: 'شهریه سالانه', en: 'Annual Tuition' }, amount: 'CONTACT_UNIVERSITY', feeType: 'contact' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'CONTACT_UNIVERSITY',
    recognitionStatus: 'GENERAL_POPULAR',
    badgeTextFa: 'دانشگاه خصوصی',
    badgeTextEn: 'Private University',
    warningLevel: 'none',
    descriptionFa: 'یک دانشگاه خصوصی معتبر در بخارست با برنامه‌های تجاری بین‌المللی.',
    descriptionEn: 'A reputable private university in Bucharest with international business programs.',
    sourceRecords: [
      { name: 'Official tuition link', url: 'https://rau.ro/tuition-fees-and-finances' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'سایت رسمی',
    ctaLabelEn: 'Official Website',
    ctaHref: 'https://rau.ro/tuition-fees-and-finances',
    ctaType: 'external',
    disclaimerFa: 'طبق اطلاعات ارائهشده از سوی دانشگاه، امکان بازپرداخت شهریه در صورت رد ویزا وجود دارد، اما شرایط، مدارک و مهلتهای بازپرداخت باید مستقیماً از دانشگاه بررسی شود.',
    disclaimerEn: 'The university indicates that tuition may be refundable following a visa refusal, subject to its current conditions, required evidence and deadlines. Confirm the policy directly before payment.'
  },

  // GROUP 3: Special recognition warning
  {
    id: 'titu-maiorescu',
    displayOrder: 9,
    groupId: 3,
    nameFa: 'دانشگاه تیتو مایورسکو',
    nameEn: 'Titu Maiorescu University',
    officialRomanianName: 'Universitatea Titu Maiorescu',
    cityFa: 'بخارست',
    cityEn: 'Bucharest',
    institutionType: 'Private Medical',
    studyFieldsFa: ['پزشکی', 'دندانپزشکی', 'داروسازی'],
    studyFieldsEn: ['Medicine', 'Dentistry', 'Pharmacy'],
    tuitionItems: [
      { program: { fa: 'پزشکی', en: 'Medicine' }, amount: 'around EUR 11,000/year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'UNOFFICIAL_ESTIMATE',
    recognitionStatus: 'REQUIRES_CURRENT_RECHECK',
    badgeTextFa: '⚠ در فهرست فعلی مورد تأیید نیست',
    badgeTextEn: '⚠ Not currently listed as approved',
    warningLevel: 'warning',
    descriptionFa: 'یک دانشگاه خصوصی محبوب در میان برخی متقاضیان ایرانی، اما فاقد تاییدیه تضمین‌شده وزارت بهداشت.',
    descriptionEn: 'A popular private university among some Iranian applicants, but lacking guaranteed MOH approval.',
    sourceRecords: [
      { name: 'TMU Official', url: 'https://www.utm.ro/' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'سایت رسمی',
    ctaLabelEn: 'Official Website',
    ctaHref: 'https://www.utm.ro/',
    ctaType: 'external',
    disclaimerFa: 'این دانشگاه در فهرست فعلی دانشگاههای مورد تأیید وزارت بهداشت ایران قرار ندارد. متقاضیانی که قصد فعالیت پزشکی در ایران را دارند باید پیش از ثبتنام، وضعیت بهروز دانشگاه را از سامانه رسمی وزارت بهداشت ایران بررسی کنند.',
    disclaimerEn: 'This university is not included in the current recognition list supplied for this project. Applicants planning to practise medicine in Iran should verify its latest status through the official Iranian Ministry of Health system before enrollment.'
  }
];
