# Change Log: First Days Guide M01/R02

## Structural Changes
- Implemented the 9-scenario Operational Guide architecture for the `first-days-checklist` in both `en.ts` and `fa.ts`.
- Segregated family reunification into explicit scenarios for EU/Romanian citizen sponsors and Non-EU sponsors.
- Separated EU registration (`Certificat de Înregistrare`) from non-EU `Permis de Ședere` pathways.

## Legal & Compliance Updates
- Verified all residence document fees to reflect the current 265 RON standard (IGI August 2025 announcement).
- Separated the 120 EUR consular tax from physical document costs.
- Enforced strict requirements on `sourceId` for all `VERIFIED_LEGAL_REQUIREMENT` claims (documents and steps).
- Resolved absolute accommodation statements by distinguishing ANAF-registered long-term leases from short-term host notifications (tourist registration within 3 days).

## Validation Engine Changes
- Upgraded `scripts/validateContent.ts` to actively enforce contextual constraints.
- Bound sources securely to specific scenarios (`applicableScenarioIds`) and claims (`applicableClaimIds`).
- Established robust negative-testing procedures to confirm the validator correctly traps missing sources, incorrect assumptions, and deprecated costs.
