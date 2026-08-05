# University Data Architecture Model

**Task ID**: DRE-P03-UNI-T01-M01

The University Data Model (defined in `src/types/index.ts` and populated in `src/lib/universities.ts`) is designed to capture and display nuanced verification states for Romanian higher education, particularly addressing the strict constraints of Iranian Ministry of Health recognition and historical tuition ambiguity.

## Core Structure
- **id**: Unique identifier string.
- **displayOrder**: Strict integer defining UI order (1-9).
- **groupId**: Integer clustering universities logically.
  - `1`: Medical universities explicitly listed by Iran's MOH.
  - `2`: General, comprehensive, and technical universities.
  - `3`: Universities requiring special verification/warnings.
- **nameFa / nameEn**: Bilingual display names.
- **officialRomanianName**: Official name used in legal documents and diplomas.
- **cityFa / cityEn**: Bilingual city names.
- **institutionType**: Descriptive type (e.g., 'Public Medical', 'Private').

## Verification and Safety Models
- **recognitionStatus**:
  - `IRAN_MOH_APPROVED`: Strictly reserved for universities currently listed in the official Iranian MOH directory (Group 1).
  - `GENERAL_POPULAR`: For non-medical universities widely popular (Group 2).
  - `REQUIRES_CURRENT_RECHECK`: Explicit warning state. E.g., Titu Maiorescu, which is popular but often lacks MOH approval.
- **warningLevel**: Drives UI styling. `none`, `warning` (amber styling), or `danger` (red styling).
- **tuitionVerificationStatus**:
  - `OFFICIAL_FIXED`: Confirmed explicit fee.
  - `OFFICIAL_RANGE`: Official scale based on faculty/program.
  - `OFFICIAL_REGISTRATION_FEE`: Only the application fee is publicly stated.
  - `HISTORICAL_OFFICIAL`: True for past years but pending current updates.
  - `UNOFFICIAL_ESTIMATE`: Hearsay or unverified claims. Must not be used alongside `IRAN_MOH_APPROVED`.
  - `CONTACT_UNIVERSITY`: Directed fallback when the university withholds public tuition arrays.
- **tuitionAcademicYear**: The specific year the data pertains to (e.g., '2026-2027' or '2024-2025').

## Structured Financials
- **tuitionItems**: Array of `{ program, amount, feeType }`.
  Replaces flat strings with dynamic mappings, ensuring registration fees and tuition are not conflated.

## External Source Bindings
- **sourceRecords**: Arrays of `{ name, url }` linking directly to university Senate decisions or international admissions portals.
- **reviewedAt**: ISO date of the last verification.

## Disclaimer Architecture
- **disclaimerFa / disclaimerEn**: Optional fields for rendering strict legal, recognition, or refund policy warnings directly within the `UniversityCard`.
