# Forms and Data Flow Audit

## Telegram Data Flow (Current `/evaluation`)
- **Data transmitted**: Name, Phone, Email, Nationality, Current Status, Goal.
- **Telegram destination**: Third-party messaging service (servers outside direct DORVIA control).
- **Access roles**: Anyone in the destination Telegram group/channel.
- **Retention status**: Indefinite on Telegram servers.
- **Deletion process**: Manual deletion from chat required.
- **Security risks**: Data exfiltration if Telegram group is compromised. Bot token leakage.
- **Privacy notice requirement**: MUST disclose Telegram as a data processor.
- **Consent requirement**: Explicit user tickbox required stating data is sent via Telegram.
- **Spam protection**: None visible (Rate limiting needed).
- **Data-subject request**: No automated way for users to request deletion of their Telegram-stored data.
