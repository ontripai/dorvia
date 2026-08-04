# Driving License Live Verification Report

## Live Page Metadata
- **HTTP status**: 200 OK
- **Canonical**: `https://romania.ontrip.app/needs/driving-license` (Production URL based on `NEXT_PUBLIC_SITE_URL` from meta system)
- **Robots**: `noindex, nofollow` (Correct for Preview)
- **H1 count**: 1 ("گواهینامه رانندگی در رومانی")
- **Breadcrumb**: Renders correctly indicating Hub parent.
- **Parent Hub navigation**: Working.
- **ParentHubFooterCard**: Working.
- **Related Guides**: N/A for this pilot scope.
- **Review date**: 2026-08-04
- **Next review date**: 2027-02-04
- **Official source section**: Rendered correctly at the bottom of the page.
- **FA rendering**: RTL rendering intact.
- **EN rendering**: LTR rendering intact (if accessed via /en/needs/driving-license).

## 89 RON Verification
- **Exact procedure**: Driving License Issuance / Exchange.
- **Exact authority**: Direcția Generală Permise de Conducere și Înmatriculări (DGPCI).
- **Official source URL**: `https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf`
- **Current wording on the source**: "Contravaloarea permisului de conducere este de 89 lei".
- **Date accessed**: 2026-08-04
- **Payment method**: CEC Bank, ghișeul.ro, or DGPCI cash desks.
- **Universal Applicability**: Yes, the 89 RON fee applies equally to exchange, issue, and renewal.

## Estimated Costs
- For medical examination (150-250 RON), the data explicitly marks `isFixed: false` and the UI labels it as "مبلغ تخمینی" (Estimated Amount).
- We stated that prices vary by provider and clinic.

## Scenario Coverage
1. **Temporary driving with a foreign licence**: Addressed.
2. **Foreign-licence exchange**: Addressed.
3. **Iranian-issued licence**: Addressed as an exception/warning in the exchange process (Wait times 30-90 days due to embassy verification).
4. **Obtaining a Romanian licence from the beginning**: Addressed (Scratch scenario).
5. **Romanian-licence renewal**: Not implemented as a standalone scenario in this pilot, grouped in general rules if applicable.
6. **International Driving Permit**: Briefly addressed.
7. **Penalties and suspension**: Excluded from this initial operational pilot.

## Defensible Rules
- No claim is marked verified from a commercial blog or driving school. All referenced sources are official (`.gov.ro`).
