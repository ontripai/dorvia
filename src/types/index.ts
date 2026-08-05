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
  studyFieldsFa: string[];
  studyFieldsEn: string[];
  tuitionItems: TuitionItem[];
  tuitionAcademicYear: string;
  tuitionVerificationStatus: TuitionVerificationStatus;
  recognitionStatus: RecognitionStatus;
  recognitionSources?: RecognitionSource[];
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
