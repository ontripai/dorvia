const fs = require('fs');
const path = require('path');

const legalDir = path.join(__dirname, 'docs', 'legal');
if (!fs.existsSync(legalDir)) fs.mkdirSync(legalDir, { recursive: true });

function writeMd(filename, content) {
    fs.writeFileSync(path.join(legalDir, filename), content.trim() + '\n', 'utf8');
}

writeMd('current-data-flow.md', `
# Actual Form Data Flow

Based on code audit, the evaluation form data flow is:

1. **User** fills out the React form on \`/contact\` or modal.
2. **Browser Form** sends a POST request to the Next.js API (\`/api/evaluation\`).
3. **Next.js API (Server)** validates, sanitizes, applies rate-limiting, and formats a markdown message.
4. **Telegram API (Bot)** securely receives the payload server-side using \`TELEGRAM_BOT_TOKEN\`.
5. **Telegram Group/Channel** receives the message.
6. **Authorised Administrators** review the message on Telegram.

*Legal Classification Note:* Telegram is treated as a **Third-party messaging and data-transmission service**, pending final legal classification regarding EU standard contractual clauses.
`);

writeMd('form-field-purpose.md', `
# Form Field Purpose & Data Minimisation

The following fields are retained for the initial contact step:

- **fullName**: Required. Needed to address the user correctly.
- **phone**: Required. Primary method of direct response/WhatsApp contact.
- **email**: Optional. Secondary fallback contact method.
- **mainGoal**: Required. Routing the lead to the correct consultant (Study, Work, etc.).
- **educationLevel / workExperience / approximateBudget / maritalStatus**: Required. Basic filtering criteria to assess immediate viability without requesting sensitive documents.
- **message**: Optional. User context.

**Fields Removed/Avoided in Phase 1:**
- \`currentCountry\` / \`nationality\`: Removed from Step 1 to reduce PII collection.
- Passport numbers, document uploads, and health information are strictly avoided at this stage.
`);

writeMd('cookie-inventory.md', `
# Cookie & Tracking Inventory

An audit of the codebase confirms:

- **Analytics:** No Google Analytics, Meta Pixel, or third-party tracking scripts are currently active.
- **Advertising:** No advertising cookies are loaded.
- **Essential Cookies:** Only framework-level session/routing cookies (Next.js internals) and potentially local storage for language preference (\`i18next\`) are used.

*Action:* Since only essential mechanisms exist, no intrusive cookie banner is required at this time. A statement has been added to the Privacy Policy (Section 16).
`);

writeMd('telegram-risk-controls.md', `
# Telegram Risk Controls

To mitigate the risks of using Telegram as a data transmission service, the following controls are active on the \`/api/evaluation\` endpoint:

1. **Server-Side Exclusivity:** The Telegram Bot Token (\`TELEGRAM_BOT_TOKEN\`) is strictly server-side and never exposed to the client.
2. **Honeypot Protection:** A hidden \`_gotcha\` field drops bot submissions silently without hitting Telegram.
3. **Input Sanitization:** Basic HTML escaping is applied to prevent injection into the Markdown parser.
4. **Rate Limiting:** An in-memory IP-based rate limiter restricts submissions (max 3 per 5 minutes) to prevent Telegram API spam.
5. **Neutral Error Handling:** Internal server errors or rate limits return neutral JSON responses to avoid leaking infrastructure details.
6. **No File Storage:** Document uploads are not permitted in this form, preventing sensitive files from sitting on Telegram servers.
`);

writeMd('owner-input-required.md', `
# Owner Input Required

The following decisions must be made and supplied by the platform owner to complete legal compliance:

1. **Legal Entity:** The exact registered company name, CUI (Registration Number), and official address in Romania.
2. **Governing Law:** Confirmation of Romanian jurisdiction.
3. **Data Protection Officer (DPO):** An official contact email for privacy requests.
4. **Retention Period:** A specific duration (e.g., "6 months") for holding lead data in Telegram before manual deletion.
5. **Telegram Deletion Procedure:** An internal operational procedure for administrators to manually delete processed Telegram messages.
`);

writeMd('DRE-P2-LEGAL-FORM-T01-M01-change-log.md', `
# Change Log: DRE-P2-LEGAL-FORM-T01-M01

- Added \`/api/evaluation/route.ts\` to act as a secure backend dispatcher.
- Minimised LeadForm fields (removed nationality/country).
- Added a Just-in-Time privacy notice above the form submit button.
- Replaced generic consent with a mandatory \`privacyAcknowledgment\` and optional \`marketingConsent\`.
- Created three distinct legal pages: Privacy Policy, Terms of Use, and Disclaimer with unique metadata.
- Embedded \`OWNER INPUT REQUIRED\` markers in legal templates where formal entity details belong.
- Added honeypot and IP-based rate limiting to the API route.
`);

console.log('Legal docs generated.');
