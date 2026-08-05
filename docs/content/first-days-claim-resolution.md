# First Days Checklist: Claim Resolution

## Content Status
- All scenarios and steps in the `first-days-checklist` guide are properly classified with explicit claims (`VERIFIED_LEGAL_REQUIREMENT`, `QUALIFIED_LEGAL_REQUIREMENT`, `RECOMMENDED_PRACTICAL_ACTION`, `PROVIDER_DEPENDENT`).
- The `contentStatus` is currently `draft`.
- The `factCheckStatus` is `partially-verified`.

## SME Review Status
- **Status**: `SME_REVIEW_PENDING`
- **Important Note**: SME review has *not* occurred yet. The absence of `PROFESSIONAL_REVIEW_REQUIRED` at the individual claim level does *not* imply that final legal/SME approval has taken place. The public UI will not describe this guide as fully verified or final until actual SME sign-off is completed.

## Review Schedule
- The `lastReviewed` date is set to `2026-08-05`.
- The `nextReview` date is set to `2027-02-05`.

## Governance Checks
- All steps and documents within the `situations` arrays possess the required governance fields: `claimId`, `status`, and `reviewDate`.
- Any required `sourceId` mappings have been explicitly defined in `officialSources` and constrained using `applicableScenarioIds` to prevent cross-contamination.
- There are no `OWNER_REVIEW_REQUIRED` or `PROFESSIONAL_REVIEW_REQUIRED` claims.
