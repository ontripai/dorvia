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
    programs: [
      { name: { fa: 'پزشکی عمومی', en: 'General Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
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
    descriptionFa: 'قدیمی‌ترین دانشگاه پزشکی رومانی در پایتخت. نیکولای پائولسکو، دانشمند رومانیایی، انسولین را برای نخستین‌بار در سال ۱۹۲۱ در همین دانشگاه استخراج کرد — یکی از شناخته‌شده‌ترین رویدادهای تاریخ علمی رومانی.',
    descriptionEn: "The oldest medical university in Romania, located in the capital. Romanian scientist Nicolae Paulescu first isolated insulin here in 1921 — one of the best-known milestones in Romanian scientific history.",
    sourceRecords: [
      { name: { fa: 'سایت رسمی', en: 'Official Site' }, url: 'https://umfcd.ro/' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'مشاهده شرایط ثبت‌نام',
    ctaLabelEn: 'View Admission Requirements',
    ctaHref: '/study',
    ctaType: 'internal',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/8%20Bulevardul%20Eroii%20Sanitari%2C%20Bucharest%20(01).jpg?width=800',
    photoCaptionFa: 'بنای تاریخی دانشکده پزشکی کارول داویلا (۱۹۰۳) — عکس: ویکی‌مدیا کامنز',
    photoCaptionEn: 'The historic Faculty of Medicine building, Carol Davila University (built 1903) — Photo: Wikimedia Commons'
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
    programs: [
      { name: { fa: 'پزشکی عمومی', en: 'General Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
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
    descriptionFa: 'دانشگاهی پیشرو در زمینه پزشکی در غرب رومانی. این دانشگاه به نام ویکتور بابش، دانشمند بنیان‌گذار مکتب میکروب‌شناسی رومانی و نویسنده یکی از نخستین کتاب‌های جامع باکتری‌شناسی جهان، نام‌گذاری شده است.',
    descriptionEn: "A leading medical university in western Romania, named after Victor Babeș, the scientist who founded Romania's school of microbiology and authored one of the world's first comprehensive treatises on bacteriology.",
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
    programs: [
      { name: { fa: 'پزشکی عمومی', en: 'General Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
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
    descriptionFa: 'یکی از تاریخی‌ترین دانشگاه‌های پزشکی در منطقه مولداوی رومانی. ریشه این دانشگاه به مدرسه جراحی یاش در سال ۱۸۵۹ بازمی‌گردد که نخستین مدرسه پزشکی رومانی‌زبان کشور بود.',
    descriptionEn: "One of the most historic medical universities in the Moldavia region of Romania. Its roots trace back to the 1859 Surgery School of Iași, the country's first Romanian-language medical school.",
    sourceRecords: [
      { name: { fa: 'سایت رسمی', en: 'Official Site' }, url: 'https://www.umfiasi.ro/' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'سایت رسمی دانشگاه',
    ctaLabelEn: 'Official University Website',
    ctaHref: 'https://www.umfiasi.ro/',
    ctaType: 'external',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/UMF%20Ia%C8%99i.jpg?width=800',
    photoCaptionFa: 'ساختمان دانشگاه علوم پزشکی گریگوره ت. پوپا یاش — عکس: ویکی‌مدیا کامنز',
    photoCaptionEn: 'A building of Grigore T. Popa University of Medicine and Pharmacy, Iași — Photo: Wikimedia Commons'
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
    programs: [
      { name: { fa: 'پزشکی عمومی', en: 'General Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
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
    descriptionFa: 'دانشگاهی با بالاترین استانداردهای آموزشی در قلب ترانسیلوانیا. قدمت آموزش پزشکی در این نهاد به مدرسه پزشکی-جراحی کلوژ در سال ۱۷۷۵ بازمی‌گردد که آن را به قدیمی‌ترین مرکز آموزش پزشکی ترانسیلوانیا تبدیل می‌کند.',
    descriptionEn: "A university with the highest educational standards in the heart of Transylvania. Medical education at this institution traces back to the 1775 Medical-Surgical School of Cluj, making it Transylvania's oldest center of medical education.",
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
    programs: [
      { name: { fa: 'حقوق و علوم سیاسی', en: 'Law & Political Science' }, studyAreaId: 'law_political_science', languages: ['UNKNOWN'] },
      { name: { fa: 'علوم کامپیوتر و ریاضیات', en: 'Computer Science & Mathematics' }, studyAreaId: 'computer_it', languages: ['UNKNOWN'] },
      { name: { fa: 'زبان‌های خارجی', en: 'Foreign Languages' }, studyAreaId: 'foreign_languages', languages: ['UNKNOWN'] },
      { name: { fa: 'مدیریت', en: 'Management' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] }
    ],
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
    descriptionFa: 'قدیمی‌ترین و برجسته‌ترین دانشگاه جامع رومانی. متقاضیان ایرانی با احراز شرایط رسمی امکان استفاده از ۵٪ تخفیف شهریه را دارند. ریشه این نهاد به آکادمی سلطنتی سال ۱۶۹۴ بازمی‌گردد و در میان فارغ‌التحصیلان آن جورج امیل پالاده (برنده جایزه نوبل پزشکی) و اوژن یونسکو (نمایشنامه‌نویس مشهور) دیده می‌شوند.',
    descriptionEn: "Romania's premier comprehensive public university. Iranian citizens are eligible for a 5% tuition discount according to official conditions. Its roots trace back to the 1694 Princely Academy, and its alumni include Nobel Prize–winning scientist George Emil Palade and playwright Eugène Ionesco.",
    sourceRecords: [
      { name: { fa: 'سایت بین‌الملل', en: 'International Site' }, url: 'https://international.unibuc.ro' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'اطلاعات تحصیل در رومانی',
    ctaLabelEn: 'Study in Romania Info',
    ctaHref: '/study',
    ctaType: 'internal',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Universitatea%20Bucuresti%2C%20Piata%20Universitatii%20(1).JPG?width=800',
    photoCaptionFa: 'بنای اصلی دانشگاه بخارست در میدان دانشگاه — عکس: ویکی‌مدیا کامنز',
    photoCaptionEn: 'The main University of Bucharest building on University Square — Photo: Wikimedia Commons'
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
    programs: [
      { name: { fa: 'مهندسی کامپیوتر', en: 'Computer Engineering' }, studyAreaId: 'computer_it', languages: ['UNKNOWN'] },
      { name: { fa: 'هوافضا', en: 'Aerospace' }, studyAreaId: 'engineering', languages: ['UNKNOWN'] },
      { name: { fa: 'مهندسی برق', en: 'Electrical Engineering' }, studyAreaId: 'engineering', languages: ['UNKNOWN'] },
      { name: { fa: 'رباتیک', en: 'Robotics' }, studyAreaId: 'engineering', languages: ['UNKNOWN'] }
    ],
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
    descriptionFa: 'بزرگترین و معتبرترین دانشگاه فنی مهندسی در رومانی. این نهاد در سال ۱۸۱۸ توسط گئورگه لازار بنیان‌گذاری شد و نخستین مدرسه فنی عالی والاخیا بود؛ دومیترو پرونارو، فارغ‌التحصیل این دانشگاه، نخستین رومانیایی بود که به فضا سفر کرد.',
    descriptionEn: 'The largest and most prestigious technical university in Romania. Founded in 1818 by Gheorghe Lazăr as the first higher technical school in Wallachia, its alumni include Dumitru Prunariu, the first Romanian to travel to space.',
    sourceRecords: [
      { name: { fa: 'سند رسمی', en: 'Official Document' }, url: 'https://international.upb.ro/assets/docs/2026/regulations/POLITEHNICA_Bucharest_tuition_fees.pdf' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'مسیر تحصیل',
    ctaLabelEn: 'Study Pathway',
    ctaHref: '/study',
    ctaType: 'internal',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Politehnica%20University%20of%20Bucharest.jpg?width=800',
    photoCaptionFa: 'دانشگاه ملی علوم و فناوری پلی‌تکنیک بخارست — عکس: ویکی‌مدیا کامنز',
    photoCaptionEn: 'National University of Science and Technology POLITEHNICA Bucharest — Photo: Wikimedia Commons'
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
    programs: [
      { name: { fa: 'اقتصاد', en: 'Economics' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] },
      { name: { fa: 'تجارت بین‌الملل', en: 'International Business' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] },
      { name: { fa: 'حسابداری', en: 'Accounting' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] },
      { name: { fa: 'مدیریت بازرگانی', en: 'Business Administration' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] }
    ],
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
    descriptionFa: 'معتبرترین دانشگاه اقتصاد و مدیریت بازرگانی در رومانی. این دانشگاه در ۶ آوریل ۱۹۱۳ با فرمان سلطنتی کارول اول تأسیس شد و نخستین نهاد آموزش عالی اقتصاد در رومانی محسوب می‌شود.',
    descriptionEn: "The most prestigious university for economics and business administration in Romania. It was founded on April 6, 1913 by royal decree under King Carol I, making it Romania's first institution of higher economic education.",
    sourceRecords: [
      { name: { fa: 'پذیرش بین‌الملل', en: 'International Admission' }, url: 'https://international.ase.ro' }
    ],
    reviewedAt: '2026-08-05',
    ctaLabelFa: 'شرایط تحصیل',
    ctaLabelEn: 'Study Requirements',
    ctaHref: '/study',
    ctaType: 'internal',
    photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cladirea%20ASE%20Bucuresti.jpg?width=800',
    photoCaptionFa: 'بنای تاریخی دانشگاه مطالعات اقتصادی بخارست (ASE) در میدان رومانا — عکس: ویکی‌مدیا کامنز',
    photoCaptionEn: 'The historic ASE building on Piața Romană, Bucharest — Photo: Wikimedia Commons'
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
    programs: [
      { name: { fa: 'کسب و کار', en: 'Business' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] },
      { name: { fa: 'روابط بین‌الملل', en: 'International Relations' }, studyAreaId: 'other', languages: ['UNKNOWN'] }
    ],
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
    descriptionFa: 'یک دانشگاه خصوصی معتبر در بخارست با برنامه‌های تجاری بین‌المللی. این دانشگاه در سال ۱۹۹۱ توسط اقتصاددان یون اسمدسکو تأسیس شد؛ نکته مهم: با وجود نام آن، طبق اعلام رسمی خودِ دانشگاه، این نهاد به‌طور رسمی وابسته به یا مورد حمایت هیچ دانشگاه آمریکایی نیست و به‌صورت مستقل فعالیت می‌کند.',
    descriptionEn: "A reputable private university in Bucharest with international business programs. Founded in 1991 by economist Ion Smedescu, it's worth noting that — despite its name — the university's own materials state it operates as an independent institution, without formal affiliation to or sponsorship by any American university.",
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
    programs: [
      { name: { fa: 'پزشکی', en: 'Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['EN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['EN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
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
    descriptionFa: 'یک دانشگاه خصوصی محبوب در میان برخی متقاضیان ایرانی، اما فاقد تأییدیه تضمین‌شده وزارت بهداشت. این دانشگاه در سال ۱۹۹۰ تأسیس شد و یکی از نخستین دانشگاه‌های خصوصی رومانی پس از سقوط کمونیسم بود؛ نام آن برگرفته از تیتو مایورسکو، منتقد ادبی تأثیرگذار قرن نوزدهم است که مدتی کوتاه نخست‌وزیر رومانی نیز بود.',
    descriptionEn: 'A popular private university among some Iranian applicants, but lacking guaranteed MOH approval. Founded in 1990, it was one of Romania\'s earliest private universities established after the fall of communism; it is named after Titu Maiorescu, the influential 19th-century literary critic who also briefly served as Prime Minister of Romania.',
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
