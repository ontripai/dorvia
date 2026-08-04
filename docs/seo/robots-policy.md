# Robots Policy Configuration

## Production Policy
- **Origin Reference**: Driven exclusively by `process.env.NEXT_PUBLIC_SITE_URL`.
- **Allowed**: Canonical routes generated via `sitemap.xml`.
- **Disallowed Paths**: `/admin/`, `/api/`.
- **HTML Directives**: `index, follow` across canonical public pages. Legal pages (`/legal/[slug]`) override to `noindex, follow` based on registry definitions.

## Preview & Development Policy
- **Robots.txt Output**:
  ```text
  User-agent: *
  Disallow: /
  ```
- **HTML Directives**: Globally enforced as `noindex, nofollow` via root layout.
- **Sitemap**: The `robots.txt` in Preview explicitly does NOT output a `Sitemap:` directive pointing to the preview domain, preventing accidental submission of preview hostnames.

## Implementation Details
- Handled via `src/app/robots.ts` as a native Next.js Metadata Route.
- Environment detection uses `process.env.VERCEL_ENV`.
- Conflicting page-level layout tags have been safely stripped/wrapped to ensure Preview guarantees are absolute.
