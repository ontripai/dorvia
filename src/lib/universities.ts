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
    institutionType: { fa: 'دولتی علوم پزشکی', en: 'Public Medical' },
    studyFieldsFa: ['پزشکی عمومی', 'داروسازی', 'دندانپزشکی'],
    studyFieldsEn: ['General Medicine', 'Pharmacy', 'Dentistry'],
    tuitionItems: [
      { program: { fa: 'پزشکی', en: 'Medicine' }, amount: 10000, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'دندانپزشکی', en: 'Dentistry' }, amount: 10000, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'داروسازی', en: 'Pharmacy' }, amount: 8500, currency: 'EUR', period: 'academic-year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'OFFICIAL_FIXED',
    recognitionStatus: 'IRAN_MOH_APPROVED',
    recognitionSources: [
      {
        name: { fa: 'سند رسمی شهریه ۲۰۲۶-۲۰۲۷', en: 'Official Tuition Document 2026-2027' },
        issuer: { fa: 'UMFCD', en: 'UMFCD' },
        academicYear: '2026-2027',
        url: 'https://umfcd.ro/wp-content/uploads/2026/NORME_LEGALE/Taxe%20UMFCD%202026-2027.pdf',
        officialFlag: true
      },
      {
        name: { fa: 'فهرست رسمی دانشگاههای خارجی مورد تأیید ۲۰۲۵–۲۰۲۶؛ معتبر برای ورودیهای ۲۰۲۶–۲۰۲۷', en: 'Official List of Approved Foreign Universities 2025–2026; valid for 2026–2027 entrants' },
        issuer: { fa: 'وزارت بهداشت، درمان و آموزش پزشکی ایران', en: 'Iran Ministry of Health and Medical Education' },
        academicYear: '2025-2026',
        url: 'https://edd.behdasht.gov.ir/uploads/178/doc/Motabar202520263.pdf',
        officialFlag: true
      }
    ],
    badgeTextFa: '✓ تأییدیه وزارت بهداشت ایران',
    badgeTextEn: '✓ Listed by Iran’s Ministry of Health',
    warningLevel: 'none',
    descriptionFa: 'قدیمی‌ترین دانشگاه پزشکی رومانی در پایتخت.',
    descriptionEn: 'The oldest medical university in Romania, located in the capital.',
    sourceRecords: [
      { name: { fa: 'سایت رسمی', en: 'Official Site' }, url: 'https://umfcd.ro/' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'مشاهده شرایط ثبت‌نام',
    ctaLabelEn: 'View Admission Requirements',
    ctaHref: '/study',
    ctaType: 'internal'
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
    institutionType: { fa: 'دولتی علوم پزشکی', en: 'Public Medical' },
    studyFieldsFa: ['پزشکی عمومی', 'داروسازی', 'دندانپزشکی'],
    studyFieldsEn: ['General Medicine', 'Pharmacy', 'Dentistry'],
    tuitionItems: [
      { program: { fa: 'پزشکی و دندانپزشکی', en: 'Medicine/Dentistry' }, amount: 9000, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'داروسازی', en: 'Pharmacy' }, amount: 8000, currency: 'EUR', period: 'academic-year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'OFFICIAL_FIXED',
    recognitionStatus: 'IRAN_MOH_APPROVED',
    recognitionSources: [
      {
        name: { fa: 'سند رسمی شهریه ۲۰۲۶-۲۰۲۷', en: 'Official Tuition Document 2026-2027' },
        issuer: { fa: 'UMFT', en: 'UMFT' },
        academicYear: '2026-2027',
        url: 'https://www.umft.ro/wp-content/uploads/2026/04/Fees-admission-type-III-International-2026-ue-and-non-ue_EN-24.04.2026.pdf',
        officialFlag: true
      },
      {
        name: { fa: 'فهرست رسمی دانشگاههای خارجی مورد تأیید ۲۰۲۵–۲۰۲۶؛ معتبر برای ورودیهای ۲۰۲۶–۲۰۲۷', en: 'Official List of Approved Foreign Universities 2025–2026; valid for 2026–2027 entrants' },
        issuer: { fa: 'وزارت بهداشت، درمان و آموزش پزشکی ایران', en: 'Iran Ministry of Health and Medical Education' },
        academicYear: '2025-2026',
        url: 'https://edd.behdasht.gov.ir/uploads/178/doc/Motabar202520263.pdf',
        officialFlag: true
      }
    ],
    badgeTextFa: '✓ تأییدیه وزارت بهداشت ایران',
    badgeTextEn: '✓ Listed by Iran’s Ministry of Health',
    warningLevel: 'none',
    descriptionFa: 'دانشگاهی پیشرو در زمینه پزشکی در غرب رومانی.',
    descriptionEn: 'A leading medical university in western Romania.',
    sourceRecords: [
      { name: { fa: 'سایت رسمی', en: 'Official Site' }, url: 'https://www.umft.ro/' }
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
    institutionType: { fa: 'دولتی علوم پزشکی', en: 'Public Medical' },
    studyFieldsFa: ['پزشکی عمومی', 'داروسازی', 'دندانپزشکی'],
    studyFieldsEn: ['General Medicine', 'Pharmacy', 'Dentistry'],
    tuitionItems: [
      { program: { fa: 'همه رشته‌ها', en: 'All Programs' }, feeType: 'contact' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'CONTACT_UNIVERSITY',
    recognitionStatus: 'IRAN_MOH_APPROVED',
    recognitionSources: [
      {
        name: { fa: 'پذیرش ۲۰۲۶', en: 'Admission 2026' },
        issuer: { fa: 'UMF Iasi', en: 'UMF Iasi' },
        academicYear: '2026',
        url: 'https://www.umfiasi.ro/en/admission/Pages/Admission-2026.aspx',
        officialFlag: true
      },
      {
        name: { fa: 'فهرست رسمی دانشگاههای خارجی مورد تأیید ۲۰۲۵–۲۰۲۶؛ معتبر برای ورودیهای ۲۰۲۶–۲۰۲۷', en: 'Official List of Approved Foreign Universities 2025–2026; valid for 2026–2027 entrants' },
        issuer: { fa: 'وزارت بهداشت، درمان و آموزش پزشکی ایران', en: 'Iran Ministry of Health and Medical Education' },
        academicYear: '2025-2026',
        url: 'https://edd.behdasht.gov.ir/uploads/178/doc/Motabar202520263.pdf',
        officialFlag: true
      }
    ],
    badgeTextFa: '✓ تأییدیه وزارت بهداشت ایران',
    badgeTextEn: '✓ Listed by Iran’s Ministry of Health',
    warningLevel: 'none',
    descriptionFa: 'یکی از تاریخی‌ترین دانشگاه‌های پزشکی در منطقه مولداوی رومانی.',
    descriptionEn: 'One of the most historic medical universities in the Moldavia region of Romania.',
    sourceRecords: [
      { name: { fa: 'سایت رسمی', en: 'Official Site' }, url: 'https://www.umfiasi.ro/' }
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
    institutionType: { fa: 'دولتی علوم پزشکی', en: 'Public Medical' },
    studyFieldsFa: ['پزشکی عمومی', 'داروسازی', 'دندانپزشکی'],
    studyFieldsEn: ['General Medicine', 'Pharmacy', 'Dentistry'],
    tuitionItems: [
      { program: { fa: 'سال اول (پزشکی/دندانپزشکی/داروسازی)', en: 'First-year Medicine/Dentistry/Pharmacy' }, amount: 10000, currency: 'EUR', period: 'academic-year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'OFFICIAL_FIXED',
    recognitionStatus: 'IRAN_MOH_APPROVED',
    recognitionSources: [
      {
        name: { fa: 'سند رسمی شهریه ۲۰۲۶-۲۰۲۷', en: 'Official Tuition Document 2026-2027' },
        issuer: { fa: 'UMF Cluj', en: 'UMF Cluj' },
        academicYear: '2026-2027',
        url: 'https://cdn.umfcluj.ro/uploads/2026/05/TUITION-FEES-FOR-THE-ACADEMIC-YEAR-2026_2027.pdf',
        officialFlag: true
      },
      {
        name: { fa: 'فهرست رسمی دانشگاههای خارجی مورد تأیید ۲۰۲۵–۲۰۲۶؛ معتبر برای ورودیهای ۲۰۲۶–۲۰۲۷', en: 'Official List of Approved Foreign Universities 2025–2026; valid for 2026–2027 entrants' },
        issuer: { fa: 'وزارت بهداشت، درمان و آموزش پزشکی ایران', en: 'Iran Ministry of Health and Medical Education' },
        academicYear: '2025-2026',
        url: 'https://edd.behdasht.gov.ir/uploads/178/doc/Motabar202520263.pdf',
        officialFlag: true
      }
    ],
    badgeTextFa: '✓ تأییدیه وزارت بهداشت ایران',
    badgeTextEn: '✓ Listed by Iran’s Ministry of Health',
    warningLevel: 'none',
    descriptionFa: 'دانشگاهی با بالاترین استانداردهای آموزشی در قلب ترانسیلوانیا.',
    descriptionEn: 'A university with the highest educational standards in the heart of Transylvania.',
    sourceRecords: [
      { name: { fa: 'سایت رسمی', en: 'Official Site' }, url: 'https://umfcluj.ro/' }
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
    institutionType: { fa: 'دولتی جامع', en: 'Public Comprehensive' },
    studyFieldsFa: ['حقوق و علوم سیاسی', 'علوم کامپیوتر و ریاضیات', 'زبان‌های خارجی', 'مدیریت'],
    studyFieldsEn: ['Law & Political Science', 'Computer Science & Mathematics', 'Foreign Languages', 'Management'],
    tuitionItems: [
      { program: { fa: 'کارشناسی', en: 'Bachelor' }, amount: 2500, maxAmount: 3150, currency: 'EUR', period: 'academic-year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'OFFICIAL_RANGE',
    recognitionStatus: 'GENERAL_POPULAR',
    recognitionSources: [
      {
        name: { fa: 'شهریه کارشناسی', en: 'Bachelor Tuition Fees' },
        issuer: { fa: 'University of Bucharest', en: 'University of Bucharest' },
        academicYear: '2026-2027',
        url: 'https://international.unibuc.ro/home-3/admission-2026-2/study-cycles/details-about-fees-and-admission-criteria/tuition-fees/tuition-fees-for-bachelors-degree/',
        officialFlag: true
      }
    ],
    badgeTextFa: 'دانشگاه جامع دولتی',
    badgeTextEn: 'Public Comprehensive',
    warningLevel: 'none',
    descriptionFa: 'قدیمی‌ترین و برجسته‌ترین دانشگاه جامع رومانی. متقاضیان ایرانی با احراز شرایط رسمی امکان استفاده از ۵٪ تخفیف شهریه را دارند.',
    descriptionEn: 'Romania’s premier comprehensive public university. Iranian citizens are eligible for a 5% tuition discount according to official conditions.',
    sourceRecords: [
      { name: { fa: 'سایت بین‌الملل', en: 'International Site' }, url: 'https://international.unibuc.ro' }
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
    institutionType: { fa: 'دولتی فناوری', en: 'Public Technological' },
    studyFieldsFa: ['مهندسی کامپیوتر', 'هوافضا', 'مهندسی برق', 'رباتیک'],
    studyFieldsEn: ['Computer Engineering', 'Aerospace', 'Electrical Engineering', 'Robotics'],
    tuitionItems: [
      { program: { fa: 'مهندسی (کارشناسی)', en: 'Engineering Undergraduate' }, amount: 2600, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'مهندسی (کارشناسی ارشد)', en: 'Engineering Graduate' }, amount: 2700, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'دکتری', en: 'Doctoral' }, amount: 3800, currency: 'EUR', period: 'calendar-year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'OFFICIAL_FIXED',
    recognitionStatus: 'GENERAL_POPULAR',
    recognitionSources: [
      {
        name: { fa: 'سند رسمی شهریه', en: 'Official Tuition Document' },
        issuer: { fa: 'POLITEHNICA Bucharest', en: 'POLITEHNICA Bucharest' },
        academicYear: '2026',
        url: 'https://international.upb.ro/assets/docs/2026/regulations/POLITEHNICA_Bucharest_tuition_fees.pdf',
        officialFlag: true
      }
    ],
    badgeTextFa: 'برترین دانشگاه فنی',
    badgeTextEn: 'Top Technological University',
    warningLevel: 'none',
    descriptionFa: 'بزرگترین و معتبرترین دانشگاه فنی مهندسی در رومانی.',
    descriptionEn: 'The largest and most prestigious technical university in Romania.',
    sourceRecords: [
      { name: { fa: 'سند رسمی', en: 'Official Document' }, url: 'https://international.upb.ro/assets/docs/2026/regulations/POLITEHNICA_Bucharest_tuition_fees.pdf' }
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
    institutionType: { fa: 'دولتی اقتصاد', en: 'Public Economic' },
    studyFieldsFa: ['اقتصاد', 'تجارت بین‌الملل', 'حسابداری', 'مدیریت بازرگانی'],
    studyFieldsEn: ['Economics', 'International Business', 'Accounting', 'Business Administration'],
    tuitionItems: [
      { program: { fa: 'کارشناسی', en: 'Bachelor' }, amount: 3500, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'ثبت‌نام کارشناسی', en: 'Bachelor Registration' }, amount: 350, currency: 'EUR', period: 'one-time', feeType: 'registration_fee' },
      { program: { fa: 'کارشناسی ارشد', en: 'Master' }, amount: 4500, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'ثبت‌نام کارشناسی ارشد', en: 'Master Registration' }, amount: 450, currency: 'EUR', period: 'one-time', feeType: 'registration_fee' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'OFFICIAL_FIXED',
    recognitionStatus: 'GENERAL_POPULAR',
    recognitionSources: [
      {
        name: { fa: 'پذیرش کارشناسی غیراتحادیه اروپا', en: 'Non-EU Bachelor Admission' },
        issuer: { fa: 'ASE', en: 'ASE' },
        academicYear: '2026-2027',
        url: 'https://international.ase.ro/21/admission-for-noneu-citizen/',
        officialFlag: true
      },
      {
        name: { fa: 'پذیرش کارشناسی ارشد غیراتحادیه اروپا', en: 'Non-EU Master Admission' },
        issuer: { fa: 'ASE', en: 'ASE' },
        academicYear: '2026-2027',
        url: 'https://international.ase.ro/21/admission-for-noneu-citizen-2/',
        officialFlag: true
      }
    ],
    badgeTextFa: 'دانشگاه برتر اقتصاد',
    badgeTextEn: 'Top Economics University',
    warningLevel: 'none',
    descriptionFa: 'معتبرترین دانشگاه اقتصاد و مدیریت بازرگانی در رومانی.',
    descriptionEn: 'The most prestigious university for economics and business administration in Romania.',
    sourceRecords: [
      { name: { fa: 'پذیرش بین‌الملل', en: 'International Admission' }, url: 'https://international.ase.ro' }
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
    institutionType: { fa: 'خصوصی', en: 'Private' },
    studyFieldsFa: ['کسب و کار', 'روابط بین‌الملل'],
    studyFieldsEn: ['Business', 'International Relations'],
    tuitionItems: [
      { program: { fa: 'دوره پایه', en: 'Foundation' }, amount: 2900, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'کارشناسی', en: 'Bachelor regular' }, amount: 3400, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'کارشناسی ارشد', en: 'Master regular' }, amount: 3600, currency: 'EUR', period: 'academic-year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'OFFICIAL_FIXED',
    recognitionStatus: 'GENERAL_POPULAR',
    recognitionSources: [
      {
        name: { fa: 'هزینه‌ها و امور مالی', en: 'Tuition Fees and Finances' },
        issuer: { fa: 'RAU', en: 'RAU' },
        academicYear: '2026',
        url: 'https://www.rau.ro/tuition-fees-and-finances/?lang=en',
        officialFlag: true
      }
    ],
    badgeTextFa: 'دانشگاه خصوصی',
    badgeTextEn: 'Private University',
    warningLevel: 'none',
    descriptionFa: 'یک دانشگاه خصوصی معتبر در بخارست با برنامه‌های تجاری بین‌المللی.',
    descriptionEn: 'A reputable private university in Bucharest with international business programs.',
    sourceRecords: [
      { name: { fa: 'لینک شهریه رسمی', en: 'Official Tuition Link' }, url: 'https://www.rau.ro/tuition-fees-and-finances/?lang=en' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'سایت رسمی',
    ctaLabelEn: 'Official Website',
    ctaHref: 'https://www.rau.ro/tuition-fees-and-finances/?lang=en',
    ctaType: 'external',
    disclaimer: {
      fa: 'طبق اطلاعات ارائهشده از سوی دانشگاه، امکان بازپرداخت شهریه در صورت رد ویزا وجود دارد، اما شرایط، مدارک و مهلتهای بازپرداخت باید مستقیماً از دانشگاه بررسی شود.',
      en: 'The university indicates that tuition may be refundable following a visa refusal, subject to its current conditions, required evidence and deadlines. Confirm the policy directly before payment.'
    }
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
    institutionType: { fa: 'خصوصی علوم پزشکی', en: 'Private Medical' },
    studyFieldsFa: ['پزشکی', 'دندانپزشکی', 'داروسازی'],
    studyFieldsEn: ['Medicine', 'Dentistry', 'Pharmacy'],
    tuitionItems: [
      { program: { fa: 'پزشکی انگلیسی (سال اول)', en: 'English Medicine, first year' }, amount: 16500, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'دندانپزشکی انگلیسی (سال اول)', en: 'English Dentistry, first year' }, amount: 16500, currency: 'EUR', period: 'academic-year', feeType: 'tuition' },
      { program: { fa: 'داروسازی (سال اول)', en: 'Pharmacy, first year' }, amount: 10000, currency: 'EUR', period: 'academic-year', feeType: 'tuition' }
    ],
    tuitionAcademicYear: '2026-2027',
    tuitionVerificationStatus: 'OFFICIAL_FIXED',
    recognitionStatus: 'REQUIRES_CURRENT_RECHECK',
    recognitionSources: [
      {
        name: { fa: 'سند رسمی شهریه', en: 'Official Tuition Document' },
        issuer: { fa: 'Titu Maiorescu', en: 'Titu Maiorescu' },
        academicYear: '2026-2027',
        url: 'https://www.utm.ro/wp-content/uploads/2026/03/Nomeclator-texe-2026-2027.pdf',
        officialFlag: true
      }
    ],
    badgeTextFa: '⚠ در فهرست فعلی مورد تأیید نیست',
    badgeTextEn: '⚠ Not currently listed as approved',
    warningLevel: 'warning',
    descriptionFa: 'یک دانشگاه خصوصی محبوب در میان برخی متقاضیان ایرانی، اما فاقد تأییدیه تضمین‌شده وزارت بهداشت.',
    descriptionEn: 'A popular private university among some Iranian applicants, but lacking guaranteed MOH approval.',
    sourceRecords: [
      { name: { fa: 'سایت رسمی', en: 'TMU Official' }, url: 'https://www.utm.ro/' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'سایت رسمی',
    ctaLabelEn: 'Official Website',
    ctaHref: 'https://www.utm.ro/',
    ctaType: 'external',
    disclaimer: {
      fa: 'این دانشگاه در فهرست فعلی دانشگاههای مورد تأیید وزارت بهداشت ایران قرار ندارد. منابع تأییدشده مستقیماً باید چک شوند. توجه: شهریه سالهای بعدی متفاوت است.',
      en: 'This university is not included in the current recognition list supplied for this project. Applicants planning to practise medicine in Iran should verify its latest status through the official Iranian Ministry of Health system before enrollment. Note: Later-year fees differ.'
    }
  }
];
