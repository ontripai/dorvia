# Form Field Purpose & Data Minimisation

The following fields are retained for the initial contact step:

- **fullName**: Required. Needed to address the user correctly.
- **phone**: Required. Primary method of direct response/WhatsApp contact.
- **email**: Optional. Secondary fallback contact method.
- **mainGoal**: Required. Routing the lead to the correct consultant (Study, Work, etc.).
- **educationLevel / workExperience / approximateBudget / maritalStatus**: Required. Basic filtering criteria to assess immediate viability without requesting sensitive documents.
- **message**: Optional. User context.

**Fields Removed/Avoided in Phase 1:**
- `currentCountry` / `nationality`: Removed from Step 1 to reduce PII collection.
- Passport numbers, document uploads, and health information are strictly avoided at this stage.
