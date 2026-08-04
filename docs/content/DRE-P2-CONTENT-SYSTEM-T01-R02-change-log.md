# Change Log: DRE-P2-CONTENT-SYSTEM-T01-R02

- Re-architected the `requiresMedical` content model in `src/types/content.ts` from a boolean to a strict tri-state (`required`, `not-required`, `conditional`) with an enforcement mechanism requiring `medicalConditionText` for conditional procedures.
- Applied the conditional medical logic to `foreign-licence-exchange` in both `en.ts` and `fa.ts`, resolving ambiguity for duplicate/replacement vs new-validity exchanges.
- Added `dgpci-idp` as an official primary source and wired it directly to the International Driving Permit scenario (covering 46 RON fee and 30-day timeline).
- Re-engineered `validateContent.ts` to statically reject missing IDP sources, un-cited fixed fees/timelines within the IDP block, medical state/qualification mismatches, and FA/EN cross-locale parity discrepancies.
- Validated all 7 exact negative cases (via `run_negative_test.js`) and formally executed live validations against Vercel deployment infrastructure.
