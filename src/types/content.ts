import { Language } from "./index";

export type ContentStatus = 'draft' | 'editorial-review' | 'fact-check-review' | 'approved' | 'published' | 'archived';
export type FactCheckStatus = 'unchecked' | 'partially-verified' | 'source-verified' | 'requires-legal-review';
export type RiskCategory = 'IMMIGRATION' | 'LEGAL' | 'TAX' | 'FINANCIAL' | 'MEDICAL' | 'EDUCATION' | 'PRIVACY' | 'CONSUMER' | 'OUTDATED' | 'UNSUPPORTED';

export type ClaimStatus =
  | 'VERIFIED_LEGAL_REQUIREMENT'
  | 'QUALIFIED_LEGAL_REQUIREMENT'
  | 'RECOMMENDED_PRACTICAL_ACTION'
  | 'PROVIDER_DEPENDENT'
  | 'OPTIONAL'
  | 'REMOVED'
  | 'PROFESSIONAL_REVIEW_REQUIRED'
  | 'VERIFIED'
  | 'OWNER_REVIEW_REQUIRED';

export interface OfficialSource {
  id: string;
  sourceTitle: string;
  organization: string;
  url: string;
  sourceType: 'official-website' | 'legislation' | 'official-pdf' | 'embassy' | 'professional-counsel' | 'provider';
  language: 'ro' | 'en' | 'fa';
  dateAccessed: string;
  applicableSection?: string;
  status: 'primary' | 'secondary' | 'deprecated';
  volatility?: 'high' | 'medium' | 'low';
  scopeAndExceptions?: string;
  applicableScenarioIds?: string[];
  applicableClaimIds?: string[];
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

export interface Step {
  title: string;
  description: string;
  claimId?: string;
  status?: ClaimStatus;
  reviewDate?: string;
  sourceId?: string;
  authority?: string;
  jurisdiction?: string;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  appliesTo: string[];
  residenceCondition?: string;
  authority?: string;
  requiresExamination?: boolean;
  requiresMedical?: 'required' | 'not-required' | 'conditional';
  medicalConditionText?: string;
  documents: Array<{
    name: string;
    description?: string;
    isMandatory: boolean;
    claimId?: string;
    sourceId?: string;
    status?: ClaimStatus;
    reviewDate?: string;
  }>;
  steps: Step[];
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
  smeReviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  riskCategory: RiskCategory[];
}
