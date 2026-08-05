# Change Log: DRE-P2-NEEDS-FIRST-DAYS-CONTENT-T01-M01

## 2026-08-05
### Added
- Extended `src/types/content.ts` `OperationalGuide` interface with explicit claim-level governance properties (`claimId`, `sourceId`, `authority`, `jurisdiction`, `reviewDate`, `status`).
- Added `firstDaysChecklistEN` and `firstDaysChecklistFA` in `src/content/guides/first-days-checklist/`.
- Replaced the hardcoded First Days Checklist JSX in `NeedsContent.tsx` with the `OperationalGuideLayout` component.
- Injected `status: 'VERIFIED'` and `reviewDate` properties into the existing `driving-license` guide steps to ensure compliance with the new validator constraints.
- Extended `validateContent.ts` with checks for duplicate `claimId`, missing material `status`, published-state protections, and dynamic scenario parity per-guide.

### Changed
- No route architecture changes were made. `/needs/first-days-checklist` remains canonical.
- No global UI elements were modified.
