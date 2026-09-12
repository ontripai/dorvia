# DRE-P2-NEEDS-FIRST-DAYS-CONTENT-T01-V02 Verification Report

## Verification Checklist
- [x] Extended Negative Test Coverage: preserved previous 6 tests and expanded to 12 mutation tests covering claim mapping, outdated costs, CNAS verification, FA/EN scenario mismatch.
- [x] Separate Data and Static UI Checks: implemented 6 static non-mutating assertions to verify headings, languages, package dependencies, and SME status.
- [x] Test Recovery: Tests restore the file via `finally` blocks. Git working tree remains completely clean after test execution.
- [x] Heading and Language Checks: Assertions confirmed there is exactly 1 `H1` tag per guide and no `H1 -> H3` skip. Both FA and EN language structures contain correct localized SME statuses without leakage.
- [x] Deployment Identity: Vercel preview verified and confirmed matching commit SHAs.
- [x] All Validations passed successfully: `validate:content`, `validate:content-audit`, `validate:first-days-negative`, `tsc --noEmit`, and `next build`.
- [x] Driving Licence guide integrity verified. No accidental zero-diff leakage to the `driving-license` source files.
- [x] Route registry and sitemap dynamically count exactly 66 routes.

## Test Summary
### 12 Content Mutation Tests:
1. Verified Step without sourceId
2. Verified Document without sourceId
3. Unknown sourceId
4. Source not applicable to scenario
5. Outdated residence-document fee of 259 RON
6. Generic CNAS homepage used as VERIFIED legal entitlement evidence
7. FA/EN scenario mismatch
8. Missing applicableClaimIds on a VERIFIED step
9. A source missing applicableClaimIds entirely
10. A source with an empty applicableClaimIds array
11. A source where applicableScenarioIds lacks the current scenario ID
12. The general non-EU family reunification source URL pointing to the beneficiaries-of-international-protection page

### 6 Static UI & Package Assertions:
1. Playwright not in production dependencies
2. Guide is not published while SME review is PENDING
3. Persian governance UI does not contain English labels
4. English governance UI does not contain Persian labels
5. Exactly one H1 found
6. No H1 -> H3 skip detected
7. SME pending notice is visible in layout

## Conclusion
All requirements for T01-V02 have been successfully met. Branch is safe to merge.
