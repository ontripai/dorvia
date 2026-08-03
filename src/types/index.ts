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

export interface University {
  id: string;
  name: { fa: string; en: string };
  city: { fa: string; en: string };
  type: { fa: string; en: string }; // Public / Private
  tuitionRange: { fa: string; en: string };
  popularFields: { fa: string[]; en: string[] };
  ranking: string;
  description: { fa: string; en: string };
  source?: { name: string; url: string };
  lastReviewed?: string;
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
