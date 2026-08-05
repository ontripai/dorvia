# Change Log: University Content, Data Architecture & UI Restructure

**Task ID**: DRE-P03-UNI-T01-M01
**Date**: 2026-08-05
**Author**: Antigravity / Gemini

## Summary
Restructured the university content from a hardcoded array in `data.ts` to a fully typed, validated `University` architecture located in `universities.ts`. Redesigned the Homepage section and `/universities` page to properly categorize and group the 9 requested Romanian universities according to Iran MOH recognition status.

## Key Changes
1. **Data Model Updates (`src/types/index.ts`)**
   - Introduced `RecognitionStatus`, `TuitionVerificationStatus`, `WarningLevel`, and `CTAType` types.
   - Refactored the `University` interface to strictly define 30 fields, including bilingual text (FA/EN), specific tuition items array, source records, and verification timestamps.

2. **Content Generation (`src/lib/universities.ts`)**
   - Created exact records for the 9 specified universities.
   - Applied specific Group IDs (1 for Medical MOH, 2 for General, 3 for Special Warning).
   - Ensured exact display order 1-9.
   - Updated `src/lib/data.ts` to export this new data.

3. **UI Improvements**
   - **Homepage (`src/components/MainContent.tsx`)**: Replaced the 4-card grid with a categorized section highlighting Group 1 (Medical), a compact summary for Group 2, and a prominent warning banner for Group 3 (Titu Maiorescu).
   - **Universities Page (`src/app/[lang]/universities/page.tsx`)**: Grouped the grid by `groupId` with localized H2 headings. Improved accessibility with proper heading hierarchy (H1 -> H2 -> H3).
   - **University Card (`src/components/UniversityCard.tsx`)**: Redesigned to consume the new types. Added support for displaying dynamic tuition arrays, badges, disclaimers, and warnings.

4. **Validation Scripts**
   - **`scripts/validateUniversities.ts`**: Verifies exact count (9), display order, group constraints, and tuition/MOH invariants.
   - **`scripts/validateUniversitiesNegativeTests.ts`**: Mutates the working tree in memory to verify that `validateUniversities.ts` fails correctly on invalid data, restoring state safely.

## Dependencies & Packages
- Added `validate:universities` and `validate:universities-negative` to `package.json` scripts.
- Included validation in the main `build` script.

## Notes
The previous hardcoded placeholder figures (like the €2,000-€4,500 estimate for UniBuc) have been completely removed, ensuring compliance with the rule to not invent figures where the official site doesn't publish them clearly.
