export type Language = 'fa' | 'en';

export type Direction = 'rtl' | 'ltr';

export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  currentCountry: string;
  nationality: string;
  preferredLanguage: Language;
  mainGoal: 'study' | 'work' | 'company' | 'investment' | 'family' | 'other';
  educationLevel: string;
  workExperience: string;
  approximateBudget: string;
  maritalStatus: 'single' | 'married' | 'married_with_children';
  message?: string;
  privacyConsent: boolean;
}

export type RecognitionStatus = 'IRAN_MOH_APPROVED' | 'GENERAL_POPULAR' | 'IRAN_MOH_NOT_APPROVED' | 'REQUIRES_CURRENT_RECHECK';

export type MosListStatus = 'LISTED_2026' | 'NOT_IN_2026_LIST' | 'OUT_OF_MOS_SCOPE';

export interface MosRecognition {
  status: MosListStatus;
  listYear: string;                                              // '2026'
  group?: 'A' | 'B' | 'C';                                       // فقط وقتی LISTED_2026
  previousGroup?: { listYear: string; group: 'A' | 'B' | 'C' };   // اگر سطحش عوض شده
  appearedInPriorLists?: boolean;                                // در فهرست سالهای قبل بوده یا نه
  checkedAt: string;                                             // '2026-09-13'
  sourceUrl: string;
}
export type TuitionVerificationStatus = 'OFFICIAL_FIXED' | 'OFFICIAL_RANGE' | 'OFFICIAL_REGISTRATION_FEE' | 'HISTORICAL_OFFICIAL' | 'UNOFFICIAL_ESTIMATE' | 'CONTACT_UNIVERSITY' | 'NOT_PROVIDED';
export type WarningLevel = 'none' | 'warning' | 'danger';
export type CTAType = 'internal' | 'external';

export interface TuitionItem {
  program: { fa: string; en: string };
  amount?: number;
  maxAmount?: number;
  currency?: 'EUR' | 'RON';
  period?: 'academic-year' | 'calendar-year' | 'one-time';
  feeType: 'tuition' | 'registration_fee' | 'contact';
}

export interface RecognitionSource {
  name: { fa: string; en: string };
  issuer: { fa: string; en: string };
  academicYear: string;
  url: string;
  officialFlag: boolean;
}

export type StudyAreaId =
  | 'medicine_dentistry'
  | 'computer_it'
  | 'engineering'
  | 'management_business'
  | 'law_political_science'
  | 'foreign_languages'
  | 'other';

export type TeachingLanguage = 'RO' | 'EN' | 'FR' | 'UNKNOWN';

export interface VerifiedProgram {
  name: { fa: string; en: string };
  studyAreaId: StudyAreaId;
  languages: TeachingLanguage[];
}

export interface UniversityRankingFact {
  labelFa: string;
  labelEn: string;
  valueFa: string;
  valueEn: string;
  sourceUrl: string;
  sourceLabelFa: string;
  sourceLabelEn: string;
}

export interface UniversityDegreeLevel {
  levelFa: string;
  levelEn: string;
  fieldsFa: string;
  fieldsEn: string;
}

export interface University {
  id: string;
  displayOrder: number;
  groupId: number;
  nameFa: string;
  nameEn: string;
  officialRomanianName: string;
  cityFa: string;
  cityEn: string;
  institutionType: { fa: string; en: string };
  programs: VerifiedProgram[];
  tuitionItems: TuitionItem[];
  tuitionAcademicYear: string;
  tuitionVerificationStatus: TuitionVerificationStatus;
  recognitionStatus: RecognitionStatus;
  recognitionSources?: RecognitionSource[];
  mosRecognition?: MosRecognition;
  badgeTextFa: string;
  badgeTextEn: string;
  warningLevel: WarningLevel;
  descriptionFa: string;
  descriptionEn: string;
  sourceRecords: { name: { fa: string; en: string }; url: string }[];
  reviewedAt: string;
  ctaLabelFa: string;
  ctaLabelEn: string;
  ctaHref: string;
  ctaType: CTAType;
  disclaimer?: { fa: string; en: string };
  photoUrl?: string;
  photoCaptionFa?: string;
  photoCaptionEn?: string;
  officialWebsite?: string;
  foundedYear?: number;
  rankingFacts?: UniversityRankingFact[];
  degreeLevels?: UniversityDegreeLevel[];
  facilities?: { fa: string; en: string }[];
}

export interface City {
  id: string;
  name: { fa: string; en: string };
  romanianName: string;
  population: string;
  region: { fa: string; en: string };
  highlights: { fa: string[]; en: string[] };
  description: { fa: string; en: string };
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: { fa: string; en: string };
  shortDesc: { fa: string; en: string };
  fullDesc: { fa: string; en: string };
  features: { fa: string[]; en: string[] };
}

export interface PathwayItem {
  id: string;
  icon: string;
  title: { fa: string; en: string };
  shortDesc: { fa: string; en: string };
  href: string;
  badge?: { fa: string; en: string };
}

export interface Article {
  id: string;
  slug: string;
  title: { fa: string; en: string };
  category: { fa: string; en: string };
  date: string;
  readTime: string;
  excerpt: { fa: string; en: string };
}

export * from './exchange';
