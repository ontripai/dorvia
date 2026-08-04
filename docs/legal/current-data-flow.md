# Actual Form Data Flow

Based on code audit, the evaluation form data flow is:

1. **User** fills out the React form on `/contact` or modal.
2. **Browser Form** sends a POST request to the Next.js API (`/api/evaluation`).
3. **Next.js API (Server)** validates, sanitizes, applies rate-limiting, and formats a markdown message.
4. **Telegram API (Bot)** securely receives the payload server-side using `TELEGRAM_BOT_TOKEN`.
5. **Telegram Group/Channel** receives the message.
6. **Authorised Administrators** review the message on Telegram.

*Legal Classification Note:* Telegram is treated as a **Third-party messaging and data-transmission service**, pending final legal classification regarding EU standard contractual clauses.
