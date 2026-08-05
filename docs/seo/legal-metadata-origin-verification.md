# Legal Metadata Origin Verification

## Changes Implemented
- Imported `SITE_URL` from `@/config` in `src/app/legal/[slug]/page.tsx`.
- Updated `alternates.canonical` to use `${SITE_URL}/legal/${params.slug}`.
- Updated `openGraph.url` to use `${SITE_URL}/legal/${params.slug}`.
- The hardcoded Vercel preview host (`romania-nwnxllu92-ontrip.vercel.app`) was completely removed from the repository metadata.

## Verifications
- `/legal/privacy` self-canonical verified.
- `/legal/terms` self-canonical verified.
- `/legal/disclaimer` self-canonical verified.
- Open Graph URLs use the approved Production origin.
- Preview environments remain noindex, nofollow through the existing global policy.
