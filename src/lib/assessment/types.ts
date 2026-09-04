// DORVIA Assessment / PathFinder — shared types for the engine layer.
// See claude/dorvia-pathfinder-full-spec-v1-2026-09-04.md (project docs) for
// the full product spec these types implement.

export type RouteId = 'study' | 'work' | 'business' | 'family' | 'relocation';

// primary_goal has two extra options beyond the five routes: long_term and
// unsure. Neither maps to its own score track (long_term folds into the
// relocation/family scoring inputs it most resembles at the answer level;
// unsure simply means no route gets the "primary goal" bonus).
export type PrimaryGoal = RouteId | 'long_term' | 'unsure';

export type Bilingual = { fa: string; en: string };

export interface QuestionOption {
  value: string;
  label: Bilingual;
  icon?: string; // optional emoji shown before the label
}

export type ConditionRule =
  | { question: string; equals: string }
  | { question: string; contains: string }; // for multi-select answers (string[])

export interface ShowIf {
  any?: ConditionRule[];
  all?: ConditionRule[];
}

export interface Question {
  id: string;
  type: 'single' | 'multi';
  required?: boolean;
  maxSelections?: number; // for multi
  title: Bilingual;
  helper?: Bilingual;
  options: QuestionOption[];
  showIf?: ShowIf;
}

// Answers keyed by question id. Single-select -> string, multi-select -> string[].
export type AssessmentAnswers = Record<string, string | string[]>;

export interface RouteScoreBreakdown {
  route: RouteId;
  score: number; // 0-100, normalized
  matchLevel: 'strong' | 'good' | 'review' | 'low';
  positiveFactors: string[]; // i18n keys resolved to display text by the caller
}

export interface AssessmentResult {
  scores: Record<RouteId, number>;
  primaryRoute: RouteId;
  secondaryRoute: RouteId | null;
  matchLevel: Record<RouteId, 'strong' | 'good' | 'review' | 'low'>;
  leadTemperature: 'hot' | 'warm' | 'nurture' | 'informational';
  leadScore: number;
}
