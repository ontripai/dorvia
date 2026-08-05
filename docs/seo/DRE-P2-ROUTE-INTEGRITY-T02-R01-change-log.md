# DRE-P2-ROUTE-INTEGRITY-T02-R01 Change Log

## Changes
- Swapped `/legal` canonical route with `/romania/cities` in `ROUTE_REGISTRY`.
- `/legal` is now an alias of `/legal/privacy` and is removed from the Sitemap and canonical indices.
- `/romania/cities` is now an indexable, canonical route (DIRECTORY_OR_INDEX hub) included in the Sitemap.
- Preserved permanent redirects: `/legal` -> `/legal/privacy` and `/cities` -> `/romania/cities`.
- Removed hardcoded preview origins (`https://romania-nwnxllu92-ontrip.vercel.app`) from `src/app/legal/[slug]/page.tsx` metadata and replaced with `SITE_URL`.
- Updated `scripts/validateContent.ts` to enforce route integrity checks against redirects, sitemap inclusions, and preview hostnames.
