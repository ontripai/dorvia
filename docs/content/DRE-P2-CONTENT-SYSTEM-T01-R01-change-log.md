# Change Log: DRE-P2-CONTENT-SYSTEM-T01-R01

- Rebuilt the FA and EN `driving-license` data models to explicitly mandate seven specific operational scenarios (`temporary-foreign-licence-use`, `foreign-licence-exchange`, `iranian-issued-licence`, `obtain-romanian-licence-from-scratch`, `renew-romanian-licence`, `international-driving-permit`, `penalties-suspension-and-restrictions`).
- Dropped universal Iranian Embassy delay/mandatory estimates in favor of explicitly sourced authenticity checks.
- Stripped unsupported medical clinic and translation fee estimates (150-250 RON), instructing users to request real-time quotes instead.
- Refined the 89 RON fee to strictly apply only to issuance, renewal, and exchange.
- Re-architected `validateContent.ts` to statically enforce 100% ID symmetry across localized files, blocking builds containing missing/duplicate source IDs or fixed metrics without official citations.
- Ran explicit negative tests on the validator, successfully catching 7 intentional violations.
