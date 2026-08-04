const fs = require('fs');
const path = require('path');

function writeDoc(p, content) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content, 'utf8');
}

// 1
writeDoc('docs/legal/telegram-delivery-verification.md', `# Telegram Delivery Verification

## Status
IMPLEMENTED & VERIFIED

## Mechanism
- The \`/api/evaluation/route.ts\` endpoint acts as a secure middleware.
- The request requires \`TELEGRAM_BOT_TOKEN\` and \`TELEGRAM_CHAT_ID\` to be present. If missing, it immediately responds with \`503 Service Unavailable\`.
- The dispatch to Telegram uses a \`fetch\` with an \`AbortController\` for an 8-second timeout.
- The response from the Telegram API is \`await\`ed. The server checks \`response.ok\`.
- Only if \`response.ok\` is true does the API return \`200 OK\` to the client.
- This ensures that a client is never shown a "Success" message unless the message actually reached the destination.
`);

// 2
writeDoc('docs/legal/retention-decision.md', `# Retention Decision

## Status
OWNER DECISION PENDING (Placeholder set)

## Current Policy
- Unconverted enquiries: Delete or anonymise 30 days after last meaningful contact.
- Active customers: Retain according to contract, accounting, and legal obligations.
- Marketing consent: Retain until withdrawal or documented expiry.

## Action Required
The business owner must confirm or alter these exact periods. Until confirmation, the 30-day rule for unconverted leads is enforced.
`);

// 3
writeDoc('docs/legal/legal-operator-config.md', `# Legal Operator Configuration

## Location
\`src/lib/legalConfig.ts\`

## Purpose
To centralise all legal entity information (Name, CUI, Address, Contact) into a single source of truth.

## Behaviour
- If the required fields in \`legalOperatorConfig\` are empty AND the environment is Production, the evaluation form will automatically disable itself.
- A neutral fallback message will display direct contact methods instead of allowing data collection without a controller identity.
`);

// 4
writeDoc('docs/legal/comment-privacy.md', `# Comment Privacy Rules

## Status
IMPLEMENTED

## Mechanism
- A prominent privacy notice is injected above the comment submission form.
- Users are instructed that Names are optional.
- Users are instructed not to submit PII, medical, immigration, or financial data.
- It is stated that comments are moderated and may be removed upon request (via Privacy Policy contact).
- No IP addresses are logged in plain text.
`);

// 5
writeDoc('docs/security/comments-admin-security.md', `# Comments Admin Security

## Status
PERMANENTLY DISABLED IN PRODUCTION

## Reason
- The previous implementation relied on a client-side environment variable (\`NEXT_PUBLIC_ADMIN_PASSWORD\`) which was insecure.
- In order to comply with strict security constraints and avoid shipping vulnerable authentication flows, the route \`/admin/comments\` has been converted to a Server Component that returns \`404 Not Found\`.
- Supabase Service Roles or external admin tools should be used to moderate comments until a robust server-side RBAC auth system is developed.
`);

// 6
writeDoc('docs/security/rate-limit-assessment.md', `# Rate Limit Assessment

## Current Implementation
- An in-memory \`Map\` is used within the Next.js API route (\`/api/evaluation/route.ts\`).
- Limits: 3 requests per 5 minutes per IP.
- IP Source: \`x-forwarded-for\` header.

## Assessment
- This is a **Best-Effort** mechanism.
- In a serverless environment (like Vercel), each function execution may spin up a new container, meaning the in-memory \`Map\` is not shared across instances.
- This is sufficient to block simple burst scripts on a single cold start, but is **not production-grade** against distributed attacks.
- For true production-grade rate limiting, a shared store (Redis/Upstash) or a platform-level WAF (Vercel Firewall / Cloudflare) is required.
`);

// 7
writeDoc('docs/security/DRE-P2-LEGAL-FORM-T01-R01-change-log.md', `# Change Log: DRE-P2-LEGAL-FORM-T01-R01

## Changes Made
1. **Legal Config:** Created \`src/lib/legalConfig.ts\` to centralize legal entity data. Removed all developer placeholders from Privacy, Terms, and Disclaimer pages.
2. **Form Minimization:** Stripped \`educationLevel\`, \`workExperience\`, \`approximateBudget\`, and \`maritalStatus\` from \`LeadForm.tsx\`. Phone OR Email is now required.
3. **Production Guard:** The \`LeadForm.tsx\` will automatically render a disabled state if deployed to production without a populated \`legalConfig.ts\`.
4. **Telegram Hardening:** The API route now strictly waits for the Telegram API's 2xx response before reporting success. Errors and missing env vars return 503 safely.
5. **Supabase LocalStorage Purge:** Removed all fallback LocalStorage logic from \`src/lib/supabase.ts\`.
6. **Comments Privacy:** Added a strict disclaimer to the comments section.
7. **Admin Security:** Permanently disabled \`/admin/comments\` by turning it into a 404 server component, preventing client-side password exposure.
8. **SEO/Footer:** Added Links to Privacy, Terms, Disclaimer, and Cookie Policy in \`Footer.tsx\`. Excluded \`/admin/*\` from \`sitemap.ts\`.
`);

console.log('Documentation generated.');
