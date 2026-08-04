# Forms and Data Flow Audit

## Current Forms
1. **Evaluation Form (`/evaluation`)**
   - **Route**: `/evaluation` and triggered via CTA modals across site.
   - **Purpose**: Initial immigration/needs assessment.
   - **Fields**: Name, Phone, Email, Nationality, Current Status, Goal.
   - **Required fields**: Name, Email, Phone.
   - **Sensitive Fields**: Nationality, Current Status.
   - **Validation**: Basic HTML5 and regex.
   - **Consent Wording**: None explicit (Implicit by submission - **LEGAL RISK**).
   - **Endpoint**: Telegram Bot (via `api/evaluation`).
   - **Storage destination**: No DB storage currently (sent to Telegram).
   - **Notification destination**: Admin Telegram group.
   - **Error state**: Handled via toast.
   - **Success state**: Handled via toast + modal close.
   - **Retention**: Indefinite on Telegram.
   - **Deletion method**: Manual.
   - **Third-party sharing**: None.
   - **Mobile Usability**: Good (iOS keyboard tested).
   - **Spam Protection**: None visible.
   - **Status**: Actual.

## Future Proposed Flows (DO NOT IMPLEMENT YET)
1. **DORVIA Service Request (e.g., Company Registration)**
   - **Flow**: User clicks CTA -> Multistep Form -> DB (Status: Pending) -> Admin Notification -> Dashboard Quote -> User Payment.
   - **Consent**: Explicit GDPR tickbox required for processing.
2. **Lead Request (Third-Party Provider)**
   - **Flow**: User views Provider -> Clicks "Contact" -> Form -> DB -> Notification to Provider -> Provider Dashboard.
   - **Consent**: Explicit consent to share data with *specific* third party required.
