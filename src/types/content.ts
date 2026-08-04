import { Language } from "./index";

export type ContentStatus = 'draft' | 'editorial-review' | 'fact-check-review' | 'approved' | 'published' | 'archived';
export type FactCheckStatus = 'unchecked' | 'partially-verified' | 'source-verified' | 'requires-legal-review';
export type RiskCategory = 'IMMIGRATION' | 'LEGAL' | 'TAX' | 'FINANCIAL' | 'MEDICAL' | 'EDUCATION' | 'PRIVACY' | 'CONSUMER' | 'OUTDATED' | 'UNSUPPORTED';

export interface OfficialSource {
  id: string;
  sourceTitle: string;
  organization: string;
  url: string;
  sourceType: 'legislation' | 'official-website' | 'embassy' | 'international-convention' | 'other';
  language: 'ro' | 'en' | 'fa';
  dateAccessed: string;
  publicationDate?: string;
  applicableSection?: string;
  status: 'primary' | 'secondary';
}

export interface CostEstimate {
  amount: string;
  currency: 'RON' | 'EUR' | 'USD';
  description: string;
  sourceId?: string;
  isFixed: boolean;
}

export interface TimelineEstimate {
  duration: string;
  description: string;
  sourceId?: string;
  isGuaranteed: boolean;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  appliesTo: string[];
  residenceCondition?: string;
  authority?: string;
  requiresExamination?: boolean;
  requiresMedical?: boolean;
  documents: Array<{
    name: string;
    description?: string;
    isMandatory: boolean;
  }>;
  steps: Array<{
    title: string;
    description: string;
  }>;
  fees: CostEstimate[];
  timeline: TimelineEstimate[];
  exceptions: string[];
  limitations: string[];
  actionLink?: {
    url: string;
    label: string;
  };
}

export interface OperationalGuide {
  canonicalRoute: string;
  locale: Language;
  title: string;
  shortDescription: string;
  mainQuestion: string;
  quickAnswer: string;
  targetAudience: string[];
  situations: ScenarioDefinition[];
  generalExceptions: string[];
  commonProblems: string[];
  warnings: string[];
  officialSources: OfficialSource[];
  relatedGuides: Array<{
    route: string;
    title: string;
  }>;
  lastReviewed: string; // ISO Date
  nextReview: string; // ISO Date
  contentOwner: string;
  contentStatus: ContentStatus;
  factCheckStatus: FactCheckStatus;
  riskCategory: RiskCategory[];
}
