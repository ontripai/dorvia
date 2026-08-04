# Change Log: DRE-P2-LEGAL-FORM-T01-M01

- Added `/api/evaluation/route.ts` to act as a secure backend dispatcher.
- Minimised LeadForm fields (removed nationality/country).
- Added a Just-in-Time privacy notice above the form submit button.
- Replaced generic consent with a mandatory `privacyAcknowledgment` and optional `marketingConsent`.
- Created three distinct legal pages: Privacy Policy, Terms of Use, and Disclaimer with unique metadata.
- Embedded `OWNER INPUT REQUIRED` markers in legal templates where formal entity details belong.
- Added honeypot and IP-based rate limiting to the API route.
