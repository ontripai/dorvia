# Telegram Risk Controls

To mitigate the risks of using Telegram as a data transmission service, the following controls are active on the `/api/evaluation` endpoint:

1. **Server-Side Exclusivity:** The Telegram Bot Token (`TELEGRAM_BOT_TOKEN`) is strictly server-side and never exposed to the client.
2. **Honeypot Protection:** A hidden `_gotcha` field drops bot submissions silently without hitting Telegram.
3. **Input Sanitization:** Basic HTML escaping is applied to prevent injection into the Markdown parser.
4. **Rate Limiting:** An in-memory IP-based rate limiter restricts submissions (max 3 per 5 minutes) to prevent Telegram API spam.
5. **Neutral Error Handling:** Internal server errors or rate limits return neutral JSON responses to avoid leaking infrastructure details.
6. **No File Storage:** Document uploads are not permitted in this form, preventing sensitive files from sitting on Telegram servers.
