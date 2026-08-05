# First Days Checklist: Validator Report

## Validation Execution
The `npm run validate:content` script was executed after extending the validator logic with claim-level governance constraints. 

## Additions to Validation Logic
- **Claim ID Uniqueness Check**: Ensured that `claimId` strings are globally unique per guide.
- **Material Claim Status**: Ensured all `steps` contain a `status` field.
- **Published State Protection**: Ensured no guide marked as `published` contains steps with `OWNER_REVIEW_REQUIRED` or `PROFESSIONAL_REVIEW_REQUIRED`.
- **Dynamic Scenario Parsing**: Improved the validator to dynamically fetch the required scenarios mapping for both `driving-license` and `first-days-checklist` based on `canonicalRoute`.

## Validation Results
```
> dar-romania@1.0.0 validate:content
> npx tsx scripts/validateContent.ts

Running Content Validation...
Validating C:\AIPROJECTBACKUP\nextromaniaIMG\src\content\guides\driving-license\en.ts...
✅ en.ts is valid.
Validating C:\AIPROJECTBACKUP\nextromaniaIMG\src\content\guides\driving-license\fa.ts...
✅ fa.ts is valid.
Validating C:\AIPROJECTBACKUP\nextromaniaIMG\src\content\guides\first-days-checklist\en.ts...
✅ en.ts is valid.
Validating C:\AIPROJECTBACKUP\nextromaniaIMG\src\content\guides\first-days-checklist\fa.ts...
✅ fa.ts is valid.
✅ Route Validation Passed.
All content and route validations passed.
```
