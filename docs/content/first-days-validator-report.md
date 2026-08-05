# First Days Checklist: Validator Report

## Enforcement Rules Active
The script `scripts/validateContent.ts` currently verifies:
1. **Required Scenarios**: Confirms all 9 scenarios exist in the `first-days-checklist` guide.
2. **Language Parity**: Ensures FA and EN scenario lists match perfectly.
3. **Source Integrity**: Detects unknown `sourceId` references in documents, steps, and timelines.
4. **Verified Claims Constraint**: Fails if a `VERIFIED_LEGAL_REQUIREMENT` document or step lacks a `sourceId`.
5. **Applicability Scope**: Confirms `applicableScenarioIds` and `applicableClaimIds` constraints on sources, preventing a source intended for one scenario from being incorrectly cited in another.
6. **Outdated Content Detection**: Explicitly fails if the outdated 259 RON residence document cost is detected.
7. **Banned Sources**: Fails if the generic CNAS homepage is used as `VERIFIED_LEGAL_REQUIREMENT`, or if incorrect/inappropriate family-reunification sources are used (e.g. international protection).
8. **Absolute Accommodation Rule**: Rejects absolute claims stating that only an ANAF-registered long-term lease is sufficient for accommodation proofs, acknowledging alternate forms depending on the specific procedure (like host notification or short-stay registration).

## Conclusion
The validator actively prevents regressions in structure, claims, costs, and sources. All test conditions are met.
