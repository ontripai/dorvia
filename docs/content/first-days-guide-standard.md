# First Days Checklist: Guide Standard

## Structure
The `first-days-checklist` guide conforms strictly to the `OperationalGuide` interface defined in `src/types/content.ts`.

## Enhancements over Pilot
- Added `reviewDate` to `ScenarioDefinition.documents` schema to enable full traceability for each individual verified legal requirement.
- Implemented robust `sourceId` applicability checks (Scenario-level and Claim-level) within the data structure rather than relying solely on global IDs.
- Distinguished clearly between the types of accommodation proof (e.g., ANAF-registered long-term lease vs. 3-day tourist hosting notification).

## Current Validation Stance
- The global `validateContent.ts` script checks for the existence of `sourceId` for all `VERIFIED_LEGAL_REQUIREMENT` documents and steps.
- Validates the exact 265 RON cost for residence permits based on the August 2025 IGI fee announcement.
