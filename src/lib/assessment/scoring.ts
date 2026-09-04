// DORVIA Assessment / PathFinder — scoring engine.
// Implements sections 5–7 and 11 of
// claude/dorvia-pathfinder-full-spec-v1-2026-09-04.md exactly (factor names
// and point values below map 1:1 to that document — do not rebalance these
// without updating the spec doc too, the two must stay in sync).
//
// Deliberately kept as pure functions with no React/Next dependency, per
// spec section 14 ("Scoring را از Content جدا کنیم") — this file can be
// unit-tested or reused (e.g. by a future /api/assessment/complete route)
// without pulling in any UI code.

import { AssessmentAnswers, AssessmentResult, RouteId } from './types';

const BASE_SCORE = 20;

function clamp(n: number): number {
  return Math.min(Math.max(n, 0), 100);
}

function isVal(answers: AssessmentAnswers, id: string, value: string): boolean {
  return answers[id] === value;
}

function secondaryIncludes(answers: AssessmentAnswers, route: RouteId): boolean {
  const v = answers['secondary_goal'];
  return Array.isArray(v) && v.includes(route);
}

function primaryIs(answers: AssessmentAnswers, route: RouteId): boolean {
  return answers['primary_goal'] === route;
}

function timelineUnder6Months(answers: AssessmentAnswers): boolean {
  const t = answers['timeline'];
  return t === 'this_month' || t === '1_3_months' || t === '3_6_months';
}

function documentsReady(answers: AssessmentAnswers): boolean {
  return answers['documents_readiness'] === 'mostly_ready';
}

function budgetAtLeast(answers: AssessmentAnswers, thresholds: string[]): boolean {
  const b = answers['total_budget'];
  return typeof b === 'string' && thresholds.includes(b);
}

// ---- Study ----
function studyScore(answers: AssessmentAnswers): number {
  let s = BASE_SCORE;
  if (primaryIs(answers, 'study')) s += 25;
  if (secondaryIncludes(answers, 'study')) s += 12;
  const relatedEducation = ['bachelor', 'master', 'phd', 'associate'].includes(String(answers['education_level'] || ''));
  if (relatedEducation) s += 10;
  const budget = answers['study_budget_annual'];
  if (budget && budget !== 'unknown' && budget !== 'under_5000') s += 15;
  if (answers['language_certificate'] === 'yes') s += 10;
  if (timelineUnder6Months(answers)) s += 10;
  if (documentsReady(answers)) s += 8;
  if (answers['age_range'] === '18_24' || answers['age_range'] === '25_34') s += 5;
  if (answers['study_level']) s += 5;
  return clamp(s);
}

// ---- Work ----
function workScore(answers: AssessmentAnswers): number {
  let s = BASE_SCORE;
  if (primaryIs(answers, 'work')) s += 25;
  if (secondaryIncludes(answers, 'work')) s += 12;
  if (answers['job_offer'] === 'yes') s += 25;
  if (answers['work_experience'] === '3_5' || answers['work_experience'] === '6_10' || answers['work_experience'] === '10_plus') s += 10;
  if (answers['work_field']) s += 8;
  if (timelineUnder6Months(answers)) s += 8;
  if (documentsReady(answers)) s += 7;
  if (answers['work_experience'] === '6_10' || answers['work_experience'] === '10_plus') s += 5;
  return clamp(s);
}

// ---- Business ----
function businessScore(answers: AssessmentAnswers): number {
  let s = BASE_SCORE;
  if (primaryIs(answers, 'business')) s += 25;
  if (secondaryIncludes(answers, 'business')) s += 12;
  if (budgetAtLeast(answers, ['50000_100000', '100000_plus']) || answers['business_capital'] === '50000_100000' || answers['business_capital'] === '100000_plus') s += 20;
  if (answers['has_existing_business'] === 'yes') s += 10;
  if (answers['business_goal'] && answers['business_goal'] !== 'not_sure') s += 10;
  if (timelineUnder6Months(answers)) s += 8;
  if (answers['has_existing_business'] === 'yes' || answers['work_experience'] === '6_10' || answers['work_experience'] === '10_plus') s += 10;
  if (documentsReady(answers)) s += 5;
  return clamp(s);
}

// ---- Family ----
function familyScore(answers: AssessmentAnswers): number {
  let s = BASE_SCORE;
  if (primaryIs(answers, 'family')) s += 30;
  if (answers['family_member_in_romania'] && answers['family_member_in_romania'] !== 'nobody') s += 20;
  if (answers['family_member_status'] && answers['family_member_status'] !== 'unknown') s += 15;
  if (answers['relationship_documents_ready'] === 'yes') s += 15;
  if (timelineUnder6Months(answers)) s += 10;
  if (answers['family_member_in_romania'] && answers['family_member_status']) s += 10;
  return clamp(s);
}

// ---- Relocation ----
function relocationScore(answers: AssessmentAnswers): number {
  let s = BASE_SCORE;
  if (primaryIs(answers, 'relocation')) s += 25;
  if (secondaryIncludes(answers, 'relocation')) s += 10;
  if (answers['relocation_timeline'] && answers['relocation_timeline'] !== 'not_sure') s += 15;
  if (budgetAtLeast(answers, ['10000_25000', '25000_50000', '50000_100000', '100000_plus'])) s += 15;
  if (answers['current_location'] === 'romania') s += 15;
  if (documentsReady(answers)) s += 10;
  if (answers['primary_goal'] === 'relocation' || answers['primary_goal'] === 'long_term') s += 10;
  return clamp(s);
}

export function computeScores(answers: AssessmentAnswers): Record<RouteId, number> {
  return {
    study: studyScore(answers),
    work: workScore(answers),
    business: businessScore(answers),
    family: familyScore(answers),
    relocation: relocationScore(answers),
  };
}

export function matchLevelFor(score: number): 'strong' | 'good' | 'review' | 'low' {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'good';
  if (score >= 40) return 'review';
  return 'low';
}

// Section 7: Primary/Secondary route algorithm. The user's stated primary
// goal wins as long as its own score clears the "review" threshold (40) —
// we don't second-guess a clearly stated goal just because another route
// happens to score a few points higher.
export function determineRoutes(
  answers: AssessmentAnswers,
  scores: Record<RouteId, number>
): { primaryRoute: RouteId; secondaryRoute: RouteId | null } {
  const ROUTES: RouteId[] = ['study', 'work', 'business', 'family', 'relocation'];
  const sorted = [...ROUTES].sort((a, b) => scores[b] - scores[a]);
  const highest = sorted[0];

  const goal = answers['primary_goal'];
  const statedGoal: RouteId | null = ROUTES.includes(goal as RouteId) ? (goal as RouteId) : null;

  let primaryRoute: RouteId;
  if (statedGoal && scores[statedGoal] >= 40) {
    primaryRoute = statedGoal;
  } else {
    primaryRoute = highest;
  }

  const remaining = sorted.filter((r) => r !== primaryRoute);
  const secondaryCandidate = remaining[0];
  const secondaryRoute = secondaryCandidate && scores[secondaryCandidate] >= 40 ? secondaryCandidate : null;

  return { primaryRoute, secondaryRoute };
}

// Section 11: Sales Lead Score — separate from the Profile/Route scores.
// Determines how the DORVIA team should triage the lead, independent of
// which pathway looks like the best fit.
export function computeLeadScore(answers: AssessmentAnswers): number {
  let s = 0;
  if (answers['timeline'] === 'this_month' || answers['timeline'] === '1_3_months') s += 20;
  if (answers['job_offer'] === 'yes') s += 25;
  if (documentsReady(answers)) s += 10;
  if (budgetAtLeast(answers, ['10000_25000', '25000_50000', '50000_100000', '100000_plus'])) s += 15;
  const goal = answers['primary_goal'];
  if (goal && goal !== 'unsure') s += 10;
  if (answers['current_location'] === 'romania') s += 10;
  if (answers['family_relocating'] === 'yes') s += 5;
  return Math.min(s, 95);
}

export function leadTemperatureFor(leadScore: number): 'hot' | 'warm' | 'nurture' | 'informational' {
  if (leadScore >= 80) return 'hot';
  if (leadScore >= 60) return 'warm';
  if (leadScore >= 40) return 'nurture';
  return 'informational';
}

export function buildAssessmentResult(answers: AssessmentAnswers): AssessmentResult {
  const scores = computeScores(answers);
  const { primaryRoute, secondaryRoute } = determineRoutes(answers, scores);
  const matchLevel: AssessmentResult['matchLevel'] = {
    study: matchLevelFor(scores.study),
    work: matchLevelFor(scores.work),
    business: matchLevelFor(scores.business),
    family: matchLevelFor(scores.family),
    relocation: matchLevelFor(scores.relocation),
  };
  const leadScore = computeLeadScore(answers);
  return {
    scores,
    primaryRoute,
    secondaryRoute,
    matchLevel,
    leadScore,
    leadTemperature: leadTemperatureFor(leadScore),
  };
}
