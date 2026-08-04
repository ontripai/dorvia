# Change Log: Minor SEO Closure Patch (DRE-P2-ROUTES-SEO-T01-R01)

## Architecture Updates
- Created `src/app/robots.ts` as a native Next.js `MetadataRoute.Robots` handler.
- Configured conditional environment detection via `process.env.VERCEL_ENV` and `isProduction` flag across all page layouts and robots configuration.
- Enforced `noindex, nofollow` safely in Preview environments.
- Centralized 6 static routes into `src/lib/routeRegistry.ts` so `sitemap.ts` generates exclusively from a single truth source.

## Content Preservation
- Merged lost unique content from deprecated `StartHereContent.tsx` aliases (`pre-departure-checklist`, `first-three-days`, `first-month`) into their respective canonical destination hubs without breaking routing logic. The checklists were injected as distinct secondary sections on the canonical pages.

## Metadata Resolution
- Stripped hardcoded `metaMap` configurations scattered across sub-layouts (`work`, `study`, `needs`, `romania`, etc.).
- Wired all sub-layouts to dynamically generate metadata from `PAGE_META`.
- Wired `PAGE_META` to pull translations from `src/lib/translations/fa.ts` (`seoMetadata`), ensuring routes like `/work/work-permit` and `/romania/cities` emit exact requested `<title>` and `<meta name="description">` tags.

## Documentation
- Overhauled inaccurate documentation claims in `docs/seo` (e.g., removing false "Production safety verified" statements when only Preview was verified).
- Added formal policies for Robots behavior, Route Registry mapping, and Content Preservation.

## Next Steps
Deployment of this commit to the final Production environment to verify `NEXT_PUBLIC_SITE_URL` correctly resolves the sitemap host and allows crawling.
