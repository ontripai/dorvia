# First Days Checklist: Language Parity Report

## Parity Validation
- The content validator successfully asserted structural parity between `src/content/guides/first-days-checklist/en.ts` and `fa.ts`.
- **Scenarios**: Exactly matched (5 scenarios: `student-arrival`, `employee-arrival`, `family-arrival`, `eu-citizen-arrival`, `short-stay-visitor`).
- **Sources**: Exactly matched (`igi-residence-general`, `anaf-contracts`, `cnas-insurance`).
- **Claim IDs**: Exactly matched across all documents and steps.

## Content Translation
- The English strings have been fully translated into Persian.
- Operational paragraphs in FA mode are entirely in Persian. No untranslated statements remain.
- The `NeedsContent.tsx` router has been updated to provide localized labels for the `OperationalGuideLayout` (e.g., Table of Contents, Process Timelines, Required Documents).
