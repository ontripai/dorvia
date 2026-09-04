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
    officialWebsite: 'https://umfcd.ro/en/',
    foundedYear: 1857,
    programs: [
      { name: { fa: 'پزشکی عمومی', en: 'General Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
    rankingFacts: [
      {
        labelFa: 'رتبهبندی QS بهتفکیک رشته — پزشکی (۲۰۲۶)',
        labelEn: 'QS World University Rankings by Subject — Medicine (2026)',
        valueFa: 'باند ۷۰۱–۸۵۰',
        valueEn: '701–850 band',
        sourceUrl: 'https://www.topuniversities.com/universities/carol-davila-university-medicine-pharmacy',
        sourceLabelFa: 'QS TopUniversities',
        sourceLabelEn: 'QS TopUniversities'
      },
      {
        labelFa: 'رتبهبندی جهانی THE (۲۰۲۶)',
        labelEn: 'Times Higher Education World University Rankings (2026)',
        valueFa: 'باند ۸۰۱–۱۰۰۰',
        valueEn: '801–1000 band',
        sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/university-medicine-and-pharmacy-carol-davila',
        sourceLabelFa: 'Times Higher Education',
        sourceLabelEn: 'Times Higher Education'
      },
      {
        labelFa: 'رتبهبندی URAP (۲۰۲۵)',
        labelEn: 'URAP Ranking (2025)',
        valueFa: 'رتبه ۷۷۴ جهانی — نخستین دانشگاه رومانی',
        valueEn: '774th worldwide — 1st among Romanian universities',
        sourceUrl: 'https://en.wikipedia.org/wiki/Carol_Davila_University_of_Medicine_and_Pharmacy',
        sourceLabelFa: 'ویکیپدیا به نقل از URAP',
        sourceLabelEn: 'Wikipedia, citing URAP'
      }
    ],
    degreeLevels: [
      { levelFa: 'کارشناسی', levelEn: "Bachelor's", fieldsFa: 'پزشکی (شامل برنامه انگلیسیزبان)، دندانپزشکی، داروسازی، پرستاری', fieldsEn: 'Medicine (incl. English-taught program), Dentistry, Pharmacy, Nursing' },
      { levelFa: 'دکتری', levelEn: 'Doctoral', fieldsFa: 'مطالعات دکتری در چهار دانشکده', fieldsEn: 'Doctoral studies across four faculties' }
    ],
    facilities: [
      { fa: 'قدیمیترین دانشگاه پزشکی رومانی، تأسیس ۱۸۵۷ بهعنوان مدرسه ملی پزشکی و داروسازی', en: "Romania's oldest medical university, founded 1857 as the National School of Medicine and Pharmacy" },
      { fa: 'استفاده از امکانات بالینی بیش از ۲۰ بیمارستان در سراسر بخارست', en: 'Uses the clinical facilities of over 20 hospitals across Bucharest' },
      { fa: 'نیکولای پائولسکو انسولین را در سال ۱۹۲۱ در همین دانشگاه استخراج کرد؛ جورج امیل پالاده (برنده جایزه نوبل) در این دانشگاه تحصیل و تدریس کرده است', en: 'Nicolae Paulescu isolated insulin here in 1921; Nobel laureate George Emil Palade studied and taught here' },
      { fa: 'دارای گواهی ISO 9001:2015 و طبقهبندیشده بهعنوان «دانشگاه پیشرفته پژوهش و آموزش» توسط وزارت آموزش رومانی', en: "ISO 9001:2015 certified; classified as an \"advanced research and education university\" by Romania's Ministry of Education" }
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
    ctaLabelFa: 'مشاهده پروفایل کامل دانشگاه',
    ctaLabelEn: 'View Full University Profile',
    ctaHref: '/universities/umf-carol-davila',
    ctaType: 'internal',
    photoUrl: '/images/universities/carol-davila.jpg',
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
    officialWebsite: 'https://umft.ro/en/',
    foundedYear: 1945,
    programs: [
      { name: { fa: 'پزشکی عمومی', en: 'General Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
    rankingFacts: [
      {
        labelFa: 'رتبهبندی نهادی QS Stars',
        labelEn: 'QS Stars Institutional Rating',
        valueFa: '۴ ستاره (این یک ارزیابی نهادی QS Stars است، نه جایگاه در رتبهبندی جهانی QS WUR)',
        valueEn: '4 stars (this is the QS Stars institutional audit product, not a QS World University Rankings position)',
        sourceUrl: 'https://www.topuniversities.com/universities/victor-babes-university-medicine-pharmacy-timisoara',
        sourceLabelFa: 'QS TopUniversities',
        sourceLabelEn: 'QS TopUniversities'
      },
      {
        labelFa: 'رتبهبندی جهانی QS/THE',
        labelEn: 'QS/THE World Ranking',
        valueFa: 'در زمان تحقیق (سپتامبر ۲۰۲۶) جایگاه مشخصی در QS WUR یا THE برای این دانشگاه یافت نشد',
        valueEn: 'As of this research (September 2026), no confirmed QS WUR or THE world-ranking position was found for this university',
        sourceUrl: 'https://www.topuniversities.com/universities/victor-babes-university-medicine-pharmacy-timisoara',
        sourceLabelFa: 'بررسی مستقیم QS TopUniversities و THE',
        sourceLabelEn: 'Direct check of QS TopUniversities and THE'
      }
    ],
    degreeLevels: [
      { levelFa: 'کارشناسی، کارشناسی ارشد و دکتری (مدرسه دکتری IOSUD)', levelEn: "Bachelor's, Master's, and PhD (IOSUD/PhD School)", fieldsFa: 'پزشکی، دندانپزشکی، داروسازی، پرستاری — به زبانهای رومانیایی، انگلیسی و فرانسوی', fieldsEn: 'Medicine, Dental Medicine, Pharmacy, Nursing — taught in Romanian, English, and French' }
    ],
    facilities: [
      { fa: 'تأسیسشده با فرمان سلطنتی شماره ۶۶۰ مورخ ۲۲ دسامبر ۱۹۴۴ و قانون شماره ۳۶۱ سال ۱۹۴۵', en: 'Founded by Royal Decree No. 660 of 22 December 1944 and Law No. 361 of 1945' },
      { fa: 'کتابخانه دانشگاه بیش از ۱۸۲٬۰۰۰ جلد کتاب دارد، با ۴۵ شعبه در کلینیکها و آزمایشگاهها', en: 'The university library holds over 182,000 volumes across 45 branch points in clinics and laboratories' },
      { fa: 'بیش از ۸٬۰۰۰ دانشجو، حدود ۲٬۰۰۰ دانشجوی بینالمللی و حدود ۴٬۰۰۰ دستیار در حال آموزش (طبق سایت رسمی)', en: 'Over 8,000 students, approximately 2,000 of them international, and around 4,000 residents in training (per the official site)' },
      { fa: 'نامگذاریشده به افتخار ویکتور بابش، بنیانگذار مکتب میکروبشناسی رومانی', en: "Named after Victor Babeș, founder of Romania's school of microbiology" }
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
    ctaLabelFa: 'مشاهده پروفایل کامل دانشگاه',
    ctaLabelEn: 'View Full University Profile',
    ctaHref: '/universities/umf-victor-babes',
    ctaType: 'internal',
    photoUrl: '/images/universities/victor-babes.jpg',
    photoCaptionFa: 'ساختمان دانشگاه علوم پزشکی ویکتور بابش در تیمیشوارا — عکس: ویکی‌مدیا کامنز',
    photoCaptionEn: 'Victor Babeș University of Medicine and Pharmacy building, Timișoara — Photo: Wikimedia Commons'
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
    officialWebsite: 'https://www.umfiasi.ro/',
    foundedYear: 1879,
    programs: [
      { name: { fa: 'پزشکی عمومی', en: 'General Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
    rankingFacts: [
      {
        labelFa: 'رتبهبندی جهانی THE (۲۰۲۶)',
        labelEn: 'Times Higher Education World University Rankings (2026)',
        valueFa: 'باند کلی ۱۵۰۱ به بالا؛ در حوزه پزشکی و سلامت: باند ۱۰۰۱ به بالا',
        valueEn: 'Overall 1501+ band; Medical & Health subject: 1001+ band',
        sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/grigore-t-popa-university-medicine-and-pharmacy-iasi',
        sourceLabelFa: 'Times Higher Education',
        sourceLabelEn: 'Times Higher Education'
      },
      {
        labelFa: 'رتبهبندی نهادی QS Stars',
        labelEn: 'QS Stars Institutional Rating',
        valueFa: '۴ ستاره (ارزیابی نهادی، نه جایگاه در رتبهبندی جهانی QS WUR)',
        valueEn: '4 stars (institutional audit rating, not a QS WUR world-ranking position)',
        sourceUrl: 'https://www.topuniversities.com/universities/grigore-t-popa-university-medicine-pharmacy-iasi-romania',
        sourceLabelFa: 'QS TopUniversities',
        sourceLabelEn: 'QS TopUniversities'
      }
    ],
    degreeLevels: [
      { levelFa: 'کارشناسی', levelEn: "Bachelor's", fieldsFa: 'پزشکی (۶ سال)، دندانپزشکی (۶ سال)، داروسازی (۵ سال)، مهندسی زیستپزشکی', fieldsEn: 'Medicine (6-year MD), Dental Medicine (6-year DMD), Pharmacy (5-year PharmD), Medical Bioengineering' },
      { levelFa: 'کارشناسی ارشد و دکتری', levelEn: "Master's and Doctoral", fieldsFa: 'کارشناسی ارشد مهندسی زیستپزشکی؛ دوره دکتری با ۷۱۶ دانشجو', fieldsEn: "Master's in Medical Bioengineering; doctoral program with 716 PhD candidates" }
    ],
    facilities: [
      { fa: 'تأسیس در سال ۱۸۷۹ بهعنوان دانشکده پزشکی؛ ریشه در مدرسه جراحی یاش (۱۸۵۹)، نخستین مدرسه پزشکی رومانیزبان کشور', en: "Founded in 1879 as a Faculty of Medicine; roots trace to the 1859 Surgery School of Iași, the country's first Romanian-language medical school" },
      { fa: 'بیش از ۱۳٬۰۰۰ دانشجو از رومانی و بیش از ۶۰ کشور دیگر', en: 'Over 13,000 students from Romania and more than 60 other countries' },
      { fa: 'شش بیمارستان اصلیِ وابسته برای آموزش بالینی، از جمله بیمارستان سنت اسپیریدون و مؤسسه انکولوژی منطقهای', en: 'Six major affiliated teaching hospitals, including St. Spiridon Hospital and the Regional Oncology Institute' },
      { fa: 'عضو فدراسیون جهانی آموزش پزشکی (WFME) و انجمن دانشگاههای اروپا (EUA)', en: 'Member of the World Federation for Medical Education (WFME) and the European University Association (EUA)' }
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
    ctaLabelFa: 'مشاهده پروفایل کامل دانشگاه',
    ctaLabelEn: 'View Full University Profile',
    ctaHref: '/universities/umf-grigore-t-popa',
    ctaType: 'internal',
    photoUrl: '/images/universities/umf-iasi.jpg',
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
    officialWebsite: 'https://umfcluj.ro/en/',
    foundedYear: 1919,
    programs: [
      { name: { fa: 'پزشکی عمومی', en: 'General Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
    rankingFacts: [
      {
        labelFa: 'رتبهبندی QS بهتفکیک رشته — پزشکی (۲۰۲۶)',
        labelEn: 'QS World University Rankings by Subject — Medicine (2026)',
        valueFa: 'باند ۳۰۱–۳۵۰ (صعود از باند ۴۰۱–۴۵۰ در سال ۲۰۲۵) — این رقم را پیش از انتشار روی صفحه رسمی رتبهبندیهای umfcluj.ro دوباره چک کن',
        valueEn: '301–350 band (up from 401–450 in 2025) — re-verify this figure on umfcluj.ro’s own rankings page before publishing, as an older 351–400 figure also appears there',
        sourceUrl: 'https://umfcluj.ro/en/university/about/prestige-rankings-certifications/',
        sourceLabelFa: 'صفحه رسمی رتبهبندیهای UMF Cluj',
        sourceLabelEn: "UMF Cluj's official rankings page"
      },
      {
        labelFa: 'ScImago Institutions Rankings',
        labelEn: 'ScImago Institutions Rankings',
        valueFa: 'نخستین دانشگاه رومانی',
        valueEn: '1st among Romanian universities',
        sourceUrl: 'https://umfcluj.ro/en/university/about/prestige-rankings-certifications/',
        sourceLabelFa: 'صفحه رسمی رتبهبندیهای UMF Cluj',
        sourceLabelEn: "UMF Cluj's official rankings page"
      },
      {
        labelFa: 'رتبهبندی جهانی THE (داده ۲۰۲۲ طبق سایت رسمی)',
        labelEn: 'THE World University Rankings (2022 data per official site)',
        valueFa: 'باند کلی ۸۰۱–۱۰۰۰',
        valueEn: 'Overall 801–1000 band',
        sourceUrl: 'https://umfcluj.ro/en/university/about/prestige-rankings-certifications/',
        sourceLabelFa: 'صفحه رسمی رتبهبندیهای UMF Cluj',
        sourceLabelEn: "UMF Cluj's official rankings page"
      }
    ],
    degreeLevels: [
      { levelFa: 'کارشناسی', levelEn: "Bachelor's", fieldsFa: 'پزشکی (۶ سال)، دندانپزشکی، داروسازی، پرستاری (۴ سال)، رادیولوژی/تصویربرداری پزشکی و بالنئوفیزیوکینتوتراپی (۳ سال)', fieldsEn: 'Medicine (6 years), Dentistry, Pharmacy, Nursing (4 years), Radiology/Medical Imaging and Balneophysiokinetotherapy (3 years)' },
      { levelFa: 'کارشناسی ارشد و دکتری', levelEn: "Master's and Doctoral", fieldsFa: '۱۳ برنامه کارشناسی ارشد؛ دورههای دکتری و رزیدنتی', fieldsEn: "13 Master's programs; doctoral degrees and residency programs" }
    ],
    facilities: [
      { fa: 'تأسیس در سال ۱۹۱۹ بهعنوان دانشکده پزشکی کلوژ؛ قدیمیترین نهاد آموزش پزشکی ترانسیلوانیا', en: "Founded in 1919 as the Faculty of Medicine of Cluj; the oldest medical education institution in Transylvania" },
      { fa: 'میزبان موزه تاریخ پزشکی و داروسازی والریو بولوگا؛ ناشر مجله علمی Clujul Medical از سال ۱۹۲۰', en: 'Home to the Valeriu Bologa Museum of the History of Medicine and Pharmacy; publisher of the Clujul Medical journal since 1920' },
      { fa: 'دو مرکز تعالی و هفت مرکز پژوهشی', en: 'Two excellence centers and seven research centers' },
      { fa: 'حدود ۸٬۰۰۰ دانشجو (۷٬۱۵۳ کارشناسی و ۸۷۶ تحصیلات تکمیلی)', en: '~8,000 students (7,153 undergraduate and 876 postgraduate)' }
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
    ctaLabelFa: 'مشاهده پروفایل کامل دانشگاه',
    ctaLabelEn: 'View Full University Profile',
    ctaHref: '/universities/umf-iuliu-hatieganu',
    ctaType: 'internal',
    photoUrl: '/images/universities/iuliu-hatieganu.jpg',
    photoCaptionFa: 'ساختمان دانشکده پزشکی دانشگاه یولیو هاتیگانو در کلوژ-نپوکا — عکس: ویکی‌مدیا کامنز',
    photoCaptionEn: 'Faculty of Medicine building, Iuliu Hațieganu University in Cluj-Napoca — Photo: Wikimedia Commons'
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
    officialWebsite: 'https://unibuc.ro/',
    foundedYear: 1864,
    programs: [
      { name: { fa: 'حقوق و علوم سیاسی', en: 'Law & Political Science' }, studyAreaId: 'law_political_science', languages: ['UNKNOWN'] },
      { name: { fa: 'علوم کامپیوتر و ریاضیات', en: 'Computer Science & Mathematics' }, studyAreaId: 'computer_it', languages: ['UNKNOWN'] },
      { name: { fa: 'زبان‌های خارجی', en: 'Foreign Languages' }, studyAreaId: 'foreign_languages', languages: ['UNKNOWN'] },
      { name: { fa: 'مدیریت', en: 'Management' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] }
    ],
    rankingFacts: [
      {
        labelFa: 'رتبهبندی جهانی QS (۲۰۲۷)',
        labelEn: 'QS World University Rankings (2027)',
        valueFa: 'باند ۸۰۱–۸۵۰ — نخستین دانشگاه رومانی',
        valueEn: "801–850 band — Romania's #1 university",
        sourceUrl: 'https://unibuc.ro/qs-world-university-rankings-2027-the-university-of-bucharest-remains-romanias-leading-university-slider/?lang=en',
        sourceLabelFa: 'اعلامیه رسمی دانشگاه بخارست',
        sourceLabelEn: "University of Bucharest's official announcement"
      },
      {
        labelFa: 'رتبهبندی جهانی QS (۲۰۲۶)',
        labelEn: 'QS World University Rankings (2026)',
        valueFa: 'باند ۷۶۱–۷۷۰؛ رتبه اول رومانی در «چشمانداز اشتغال» (۲۲۶ جهانی) و «اعتبار نزد کارفرمایان» (۴۰۰ جهانی)',
        valueEn: "761–770 band; #1 in Romania for Employment Outcomes (226th globally) and Employer Reputation (400th globally)",
        sourceUrl: 'https://unibuc.ro/qs-world-university-rankings-2026-universitatea-din-bucuresti-prima-universitate-din-romania-si-in-primele-770-de-universitati-din-lume/?lang=en',
        sourceLabelFa: 'اعلامیه رسمی دانشگاه بخارست',
        sourceLabelEn: "University of Bucharest's official announcement"
      },
      {
        labelFa: 'رتبهبندی QS بهتفکیک رشته (۲۰۲۶)',
        labelEn: 'QS World University Rankings by Subject (2026)',
        valueFa: 'رتبه اول رومانی در شش رشته: زبانشناسی، زبانهای مدرن، زبان و ادبیات انگلیسی، علوم سیاسی، شیمی و جغرافیا',
        valueEn: '#1 in Romania in six fields: Linguistics, Modern Languages, English Language and Literature, Political Science, Chemistry, and Geography',
        sourceUrl: 'https://unibuc.ro/universitatea-din-bucuresti-prima-universitate-din-romania-in-topul-qs-by-subject-2026-in-sase-domenii-lingvistica-limbi-moderne-limba-si-literatura-engleza-stiinte-politice-chimie-si-geografie/?lang=en',
        sourceLabelFa: 'اعلامیه رسمی دانشگاه بخارست',
        sourceLabelEn: "University of Bucharest's official announcement"
      }
    ],
    degreeLevels: [
      { levelFa: 'کارشناسی، کارشناسی ارشد و دکتری', levelEn: "Bachelor's, Master's, and Doctorate", fieldsFa: '۱۹ دانشکده در حوزههای علوم پایه، علوم انسانی، علوم اجتماعی و الهیات — به رومانیایی و انگلیسی', fieldsEn: '19 faculties spanning natural sciences, humanities, social sciences, and theology — taught in Romanian and English' }
    ],
    facilities: [
      { fa: 'تأسیس رسمی در ۴ ژوئیه ۱۸۶۴ به فرمان شاهزاده الکساندرو یوان کوزا؛ ریشه در آکادمی سلطنتی سال ۱۶۹۴', en: "Formally established on 4 July 1864 by Prince Alexandru Ioan Cuza; roots trace back to the 1694 Princely Academy" },
      { fa: 'عضو کنسرسیوم «Universitaria» متشکل از دانشگاههای برتر رومانی', en: 'Member of the "Universitaria Consortium" of elite Romanian universities' },
      { fa: 'حدود ۳۲٬۶۰۰ دانشجو (سال تحصیلی ۲۰۲۲–۲۰۲۳): ۲۲٬۴۲۸ کارشناسی و ۸٬۹۱۱ تحصیلات تکمیلی', en: '~32,600 students (2022–2023 academic year): 22,428 undergraduate and 8,911 postgraduate' },
      { fa: 'از میان فارغالتحصیلان: جورج امیل پالاده (برنده جایزه نوبل پزشکی)، اوژن یونسکو (نمایشنامهنویس)، امیل کنستانتینسکو (رئیسجمهور اسبق رومانی)', en: 'Notable alumni include Nobel laureate George Emil Palade, playwright Eugène Ionesco, and former Romanian President Emil Constantinescu' }
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
    ctaLabelFa: 'مشاهده پروفایل کامل دانشگاه',
    ctaLabelEn: 'View Full University Profile',
    ctaHref: '/universities/unibuc',
    ctaType: 'internal',
    photoUrl: '/images/universities/bucharest.jpg',
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
    officialWebsite: 'https://upb.ro/en/',
    foundedYear: 1818,
    programs: [
      { name: { fa: 'مهندسی کامپیوتر', en: 'Computer Engineering' }, studyAreaId: 'computer_it', languages: ['UNKNOWN'] },
      { name: { fa: 'هوافضا', en: 'Aerospace' }, studyAreaId: 'engineering', languages: ['UNKNOWN'] },
      { name: { fa: 'مهندسی برق', en: 'Electrical Engineering' }, studyAreaId: 'engineering', languages: ['UNKNOWN'] },
      { name: { fa: 'رباتیک', en: 'Robotics' }, studyAreaId: 'engineering', languages: ['UNKNOWN'] }
    ],
    rankingFacts: [
      {
        labelFa: 'رتبهبندی جهانی QS',
        labelEn: 'QS World University Rankings',
        valueFa: 'باند ۱۲۰۱–۱۴۰۰ — سال دقیق ویرایش را پیش از انتشار روی صفحه QS TopUniversities تأیید کن',
        valueEn: '1201–1400 band — confirm the exact edition year on the QS TopUniversities profile before publishing',
        sourceUrl: 'https://www.topuniversities.com/universities/university-politehnica-bucharest',
        sourceLabelFa: 'QS TopUniversities',
        sourceLabelEn: 'QS TopUniversities'
      },
      {
        labelFa: 'رتبهبندی QS بهتفکیک رشته — مهندسی',
        labelEn: 'QS World University Rankings by Subject — Engineering',
        valueFa: 'باند ۳۵۱–۴۰۰',
        valueEn: '351–400 band',
        sourceUrl: 'https://www.topuniversities.com/universities/university-politehnica-bucharest',
        sourceLabelFa: 'QS TopUniversities',
        sourceLabelEn: 'QS TopUniversities'
      }
    ],
    degreeLevels: [
      { levelFa: 'کارشناسی، کارشناسی ارشد، دکتری و فوقدکتری', levelEn: "Undergraduate, Master's, Doctoral, and Postdoctoral", fieldsFa: '۱۵ دانشکده شامل مهندسی برق، قدرت، رباتیک، هوافضا، مهندسی پزشکی و دانشکده اختصاصیِ «مهندسی به زبانهای خارجی»', fieldsEn: '15 faculties including Electrical Engineering, Power Engineering, Robotics, Aerospace, Medical Engineering, and a dedicated Faculty of Engineering in Foreign Languages' }
    ],
    facilities: [
      { fa: 'ریشه در سال ۱۸۱۸ («مدرسه مهندسان نقشهبردار»)؛ تأسیس رسمی بهعنوان «مدرسه پلیتکنیک بخارست» در ۱۰ ژوئن ۱۹۲۰', en: 'Traces its origin to 1818 ("School for Surveying Engineers"); formally established as the "Politehnica School of Bucharest" on 10 June 1920' },
      { fa: 'بزرگترین دانشگاه فنی رومانی', en: 'The largest technical university in Romania' },
      { fa: 'چندین دانشگاه مستقل امروزیِ رومانی (مهندسی عمران، معماری، علوم کشاورزی) از دانشکدههای پیشین همین دانشگاه شکل گرفتهاند', en: 'Several of today’s standalone Romanian universities (Civil Engineering, Architecture, Agronomic Sciences) originated from its former faculties' },
      { fa: 'عضو EAIE، EUA، CESAER، EELISA و ENEN', en: 'Member of EAIE, EUA, CESAER, EELISA, and ENEN' }
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
    ctaLabelFa: 'مشاهده پروفایل کامل دانشگاه',
    ctaLabelEn: 'View Full University Profile',
    ctaHref: '/universities/upb-polytechnic',
    ctaType: 'internal',
    photoUrl: '/images/universities/politehnica.jpg',
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
    officialWebsite: 'https://ase.ro/en/',
    foundedYear: 1913,
    programs: [
      { name: { fa: 'اقتصاد', en: 'Economics' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] },
      { name: { fa: 'تجارت بین‌الملل', en: 'International Business' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] },
      { name: { fa: 'حسابداری', en: 'Accounting' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] },
      { name: { fa: 'مدیریت بازرگانی', en: 'Business Administration' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] }
    ],
    rankingFacts: [
      {
        labelFa: 'رتبهبندی QS بهتفکیک رشته (۲۰۲۵)',
        labelEn: 'QS World University Rankings by Subject (2025)',
        valueFa: 'اقتصاد و اقتصادسنجی: باند ۳۵۱–۴۰۰؛ مدیریت بازرگانی: باند ۵۰۱–۵۵۰ (این دانشگاه رتبه کلی QS WUR ندارد، فقط رتبهبندی بهتفکیک رشته)',
        valueEn: 'Economics & Econometrics: 351–400 band; Business & Management: 501–550 band (no overall QS WUR rank — subject rankings only)',
        sourceUrl: 'https://international.ase.ro/21/qs-world-university-rankings/',
        sourceLabelFa: 'صفحه رسمی رتبهبندیهای ASE',
        sourceLabelEn: "ASE's official international rankings page"
      },
      {
        labelFa: 'رتبهبندی جهانی THE (۲۰۲۶)',
        labelEn: 'THE World University Rankings (2026)',
        valueFa: 'باند ۸۰۱–۱۰۰۰؛ به گفته دانشگاه، برای هفتمین سال متوالی رتبه اول رومانی در THE',
        valueEn: "801–1000 band; per the university, ranked #1 in Romania on THE for the 7th consecutive year",
        sourceUrl: 'https://international.ase.ro/21/times-higher-education/',
        sourceLabelFa: 'صفحه رسمی رتبهبندیهای ASE',
        sourceLabelEn: "ASE's official international rankings page"
      }
    ],
    degreeLevels: [
      { levelFa: 'کارشناسی (۳ سال / ۱۸۰ واحد ECTS)', levelEn: "Bachelor's (3 years / 180 ECTS credits)", fieldsFa: '۱۳ دانشکده شامل تجارت بینالملل، حقوق، مالی و بانکداری، مدیریت و بازاریابی، انفورماتیک اقتصادی', fieldsEn: '13 faculties including International Business, Law, Finance and Banking, Management and Marketing, Economic Informatics' },
      { levelFa: 'کارشناسی ارشد و دکتری', levelEn: "Master's and Doctoral", fieldsFa: 'کارشناسی ارشد (۲ سال / ۱۲۰ واحد ECTS)، دکتری (حداقل ۳ سال) — ۲۵ برنامه به رومانیایی، انگلیسی، فرانسوی یا آلمانی', fieldsEn: "Master's (2 years / 120 ECTS credits), Doctoral (minimum 3 years) — 25 programs taught in Romanian, English, French, or German" }
    ],
    facilities: [
      { fa: 'تأسیس در ۶ آوریل ۱۹۱۳ با فرمان سلطنتی کارول اول؛ نخستین نهاد آموزش عالی اقتصاد در رومانی', en: 'Founded on 6 April 1913 by royal decree under King Carol I; the first institution of higher economic education in Romania' },
      { fa: '۱۳ مرکز پژوهشی موردتأیید شورای ملی پژوهش علمی آموزش عالی رومانی', en: "13 research centers recognized by Romania's National Council of Scientific Research in Higher Education" },
      { fa: 'عضو کنسرسیوم «Universitaria» متشکل از دانشگاههای برتر رومانی', en: 'Member of the "Universitaria Consortium" of elite Romanian universities' },
      { fa: 'حدود ۲۳٬۳۰۰ دانشجو شامل ۱٬۱۱۲ دانشجوی بینالمللی (طبق پروفایل QS TopUniversities — پیش از انتشار با سایت رسمی تطبیق بده)', en: '~23,300 students including 1,112 international students (per the QS TopUniversities profile — verify against the official site before publishing)' }
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
    ctaLabelFa: 'مشاهده پروفایل کامل دانشگاه',
    ctaLabelEn: 'View Full University Profile',
    ctaHref: '/universities/ase-bucharest',
    ctaType: 'internal',
    photoUrl: '/images/universities/ase.jpg',
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
    officialWebsite: 'https://www.rau.ro/en/',
    foundedYear: 1991,
    programs: [
      { name: { fa: 'کسب و کار', en: 'Business' }, studyAreaId: 'management_business', languages: ['UNKNOWN'] },
      { name: { fa: 'روابط بین‌الملل', en: 'International Relations' }, studyAreaId: 'other', languages: ['UNKNOWN'] }
    ],
    rankingFacts: [
      {
        labelFa: 'رتبهبندی جهانی QS/THE',
        labelEn: 'QS/THE World Ranking',
        valueFa: 'در جستوجوی مستقیم روی سایتهای QS TopUniversities و THE هیچ پروفایل رتبهبندی برای این دانشگاه یافت نشد',
        valueEn: 'A direct site search on QS TopUniversities and THE found no ranking profile for this university',
        sourceUrl: 'https://www.topuniversities.com/',
        sourceLabelFa: 'بررسی مستقیم QS TopUniversities',
        sourceLabelEn: 'Direct check of QS TopUniversities'
      },
      {
        labelFa: 'ارزیابی ملی رومانی (۲۰۱۱–۲۰۱۲)',
        labelEn: 'Romanian National Program Evaluation (2011–2012)',
        valueFa: 'رشته «روابط اقتصادی بینالملل» و «مالی» رتبه A (عالی) و رشتههای مدیریت، بازاریابی، مدیریت بازرگانی و علوم کامپیوتر رتبه B گرفتهاند — این یک رتبهبندی بینالمللی نیست، طبقهبندی کیفیت برنامه در نظام ملی رومانی است',
        valueEn: 'International Economic Relations and Finance rated Category A (excellence); Management, Marketing, Business Administration, and Computer Science rated Category B — this is a Romanian national program-quality category, not an international ranking',
        sourceUrl: 'https://en.wikipedia.org/wiki/Romanian-American_University',
        sourceLabelFa: 'ویکیپدیا',
        sourceLabelEn: 'Wikipedia'
      }
    ],
    degreeLevels: [
      { levelFa: 'کارشناسی (شامل برنامه انگلیسیزبان و سال پایه)', levelEn: "Bachelor's (including English-taught programs and a foundation year)", fieldsFa: '۱۰ دانشکده شامل تجارت بینالملل، معماری، حقوق، مالی و حسابداری، علوم پزشکی، گردشگری و مدیریت هتلداری', fieldsEn: '10 faculties including International Business, Architecture, Law, Finance and Accounting, Medical Sciences, Tourism and Hospitality Management' },
      { levelFa: 'کارشناسی ارشد و تحصیلات تکمیلی', levelEn: "Master's and Postgraduate Studies", fieldsFa: 'برنامههای کارشناسی ارشد (شامل انگلیسیزبان) و دورههای تحصیلات تکمیلی', fieldsEn: "Master's programs (including English-taught) and postgraduate studies" }
    ],
    facilities: [
      { fa: 'تأسیس در ۱۷ آوریل ۱۹۹۱ توسط اقتصاددان یون اسمدسکو', en: 'Founded on 17 April 1991 by economist Ion Smedescu' },
      { fa: 'یک نهاد مستقل است و — با وجود نام آن — طبق منابع موجود، بهطور رسمی وابسته به یا مورد حمایت هیچ دانشگاه آمریکایی نیست', en: 'An independent institution that — despite its name — is not, per available sources, formally affiliated with or sponsored by any American university' },
      { fa: 'کمپوس دانشگاه در اکتبر ۲۰۰۳ افتتاح شد', en: 'The university campus was inaugurated in October 2003' },
      { fa: 'دانشکده حقوق تحت قانون رومانی شماره ۲۷۴ مصوب ۱۵ مه ۲۰۰۲ اعتبارسنجی شده است', en: 'The Faculty of Law is accredited under Romanian Law No. 274 of 15 May 2002' }
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
    ctaLabelFa: 'مشاهده پروفایل کامل دانشگاه',
    ctaLabelEn: 'View Full University Profile',
    ctaHref: '/universities/rau-bucharest',
    ctaType: 'internal',
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
    officialWebsite: 'https://www.utm.ro/en/',
    foundedYear: 1990,
    programs: [
      { name: { fa: 'پزشکی', en: 'Medicine' }, studyAreaId: 'medicine_dentistry', languages: ['EN'] },
      { name: { fa: 'دندانپزشکی', en: 'Dentistry' }, studyAreaId: 'medicine_dentistry', languages: ['EN'] },
      { name: { fa: 'داروسازی', en: 'Pharmacy' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] }
    ],
    rankingFacts: [
      {
        labelFa: 'رتبهبندی جهانی QS/THE',
        labelEn: 'QS/THE World Ranking',
        valueFa: 'در جستوجوی مستقیم روی سایتهای QS TopUniversities و THE هیچ پروفایل رتبهبندی برای این دانشگاه یافت نشد',
        valueEn: 'A direct site search on QS TopUniversities and THE found no ranking profile for this university',
        sourceUrl: 'https://www.topuniversities.com/',
        sourceLabelFa: 'بررسی مستقیم QS TopUniversities',
        sourceLabelEn: 'Direct check of QS TopUniversities'
      }
    ],
    degreeLevels: [
      { levelFa: 'کارشناسی، کارشناسی ارشد و دکتری', levelEn: "Bachelor's, Master's, and Doctoral", fieldsFa: '۱۱ دانشکده شامل حقوق، روانشناسی، انفورماتیک، پزشکی، دندانپزشکی، داروسازی؛ برنامههای انگلیسیزبان: پزشکی، دندانپزشکی و رشته جدید هوش مصنوعی در مقطع کارشناسی', fieldsEn: '11 faculties including Law, Psychology, Informatics, Medicine, Dental Medicine, Pharmacy; English-taught programs: Medicine, Dental Medicine, and a newly launched Artificial Intelligence bachelor\'s degree' }
    ],
    facilities: [
      { fa: 'تأسیس در ۲۰ سپتامبر ۱۹۹۰، یکی از نخستین دانشگاههای خصوصی رومانی پس از سقوط کمونیسم', en: "Founded on 20 September 1990, one of Romania's earliest private universities established after the fall of communism" },
      { fa: 'نامگذاریشده به افتخار تیتو مایورسکو، منتقد ادبی و نخستوزیر پیشین رومانی', en: 'Named after Titu Maiorescu, literary critic and former Prime Minister of Romania' },
      { fa: 'دارای گواهی «سطح بالای اعتماد» از ARACIS (نهاد اعتبارسنجی رومانی) مورخ ۲۰۱۸ — پیش از انتشار، بهروز بودن این گواهی را در سایت رسمی چک کن', en: "Holds an ARACIS (Romania's accreditation body) \"High Level of Trust\" certificate dated 2018 — verify this is still current on the official site before publishing" },
      { fa: 'در تهران بلوار کاله واکارشتی شماره ۱۸۷، بخارست واقع شده است', en: 'Located at 187 Calea Văcărești, Bucharest' }
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
    ctaLabelFa: 'مشاهده پروفایل کامل دانشگاه',
    ctaLabelEn: 'View Full University Profile',
    ctaHref: '/universities/titu-maiorescu',
    ctaType: 'internal',
    photoUrl: '/images/universities/titu-maiorescu.jpg',
    photoCaptionFa: 'ساختمان دانشگاه تیتو مایورسکو در بخارست — عکس: ویکی‌مدیا کامنز',
    photoCaptionEn: 'Titu Maiorescu University building in Bucharest — Photo: Wikimedia Commons',
    disclaimer: {
      fa: 'این دانشگاه در فهرست فعلی دانشگاههای مورد تأیید وزارت بهداشت ایران قرار ندارد. منابع تأییدشده مستقیماً باید چک شوند. توجه: شهریه سالهای بعدی متفاوت است.',
      en: 'This university is not included in the current recognition list supplied for this project. Applicants planning to practise medicine in Iran should verify its latest status through the official Iranian Ministry of Health system before enrollment. Note: Later-year fees differ.'
    }
  }
];
