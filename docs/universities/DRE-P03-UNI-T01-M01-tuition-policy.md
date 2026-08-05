# Tuition Policy & Verification Rules

**Task ID**: DRE-P03-UNI-T01-M01

The data architecture enforces strict rules regarding how tuition and financial figures are stored and presented on the platform. We no longer rely on arbitrary string ranges or guesses.

## Verification Constraints
The `tuitionVerificationStatus` field prevents unverified or outdated data from being presented as current facts.
1. `OFFICIAL_FIXED` / `OFFICIAL_RANGE` / `OFFICIAL_REGISTRATION_FEE`: Must only be used when a primary `.ro` educational domain source explicitly publishes these figures for non-EU students for the current academic year.
2. `HISTORICAL_OFFICIAL`: If the university only lists old fees (e.g. 2024-2025 like UMFCD), it is explicitly labelled and the academic year string must reflect this.
3. `CONTACT_UNIVERSITY`: If a university hides or removes its tuition figures for international students, we do NOT invent a number. We display "Contact University".
4. `UNOFFICIAL_ESTIMATE`: Used for schools like Titu Maiorescu where the official site lacks clear data but applicants frequently report a specific number. This triggers a strict warning in the UI.

## Separation of Fees
Registration fees (application/processing) are decoupled from annual tuition fees using the `feeType` attribute within `tuitionItems`. This ensures users do not conflate a €50-450 non-refundable registration fee with a €10,000 tuition fee.

## Disclaimers
A new `disclaimer` field exists per university to highlight unique financial policies, such as the 5% discount at UniBuc or the visa-refusal refund policy at RAU.
