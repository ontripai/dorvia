# Medical Requirement Model

## Objective
To strictly govern how medical requirements (Fișa Medicală) are presented across different driving license procedures, avoiding blanket assertions that could mislead users applying for duplicates versus new validities.

## Logic Implementation
The core types (`src/types/content.ts`) now mandate a specific tri-state model for the `requiresMedical` field on any scenario:
- `required`: A medical certificate is unequivocally required (e.g., obtaining a license from scratch, renewing an expired license).
- `not-required`: A medical certificate is unequivocally not required (e.g., International Driving Permit issuance, temporary foreign use).
- `conditional`: The requirement depends on the exact parameters of the applicant's request. **Must be accompanied by `medicalConditionText`.**

## Application to Foreign Licence Exchange
The `foreign-licence-exchange` scenario is now classified as `conditional` in both `en.ts` and `fa.ts`.

**Explanation**: 
- A medical document is **required** when the applicant requests a Romanian licence with a **new administrative validity**.
- A duplicate or replacement that strictly retains the **existing administrative validity** of the original foreign license may follow a different document requirement and may not require the medical certificate. 

This model guarantees cross-locale parity and strictly aligns with DGPCI exchange regulations.
