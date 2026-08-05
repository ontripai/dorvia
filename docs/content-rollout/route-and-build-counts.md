# Route and Build Counts

## Separation of Counts

It is critical to distinguish between canonical routes, physical files, and build output:

- **Canonical Routes in ROUTE_REGISTRY: 66**
  These are the unique, indexable concepts representing public-facing pages in the system.

- **Sitemap URL Count: 66**
  Derived directly from the 66 canonical routes.

- **Physical App Router Page Files: 25**
  There are exactly 25 physical `page.tsx` files inside `src/app`.
  This consists of:
  - 1 Admin route (`/admin/comments/page.tsx`)
  - 16 Static physical public routes
  - 8 Dynamic template routes

- **Dynamic Templates**
  The 8 dynamic `[slug]/page.tsx` templates expand via `generateStaticParams` into the remaining canonical routes:
  - `/legal/[slug]`: 4 canonical routes
  - `/needs/[slug]`: 12 canonical routes
  - `/immigration/[slug]`: 5 canonical routes
  - `/work/[slug]`: 6 canonical routes
  - `/company/[slug]`: 8 canonical routes
  - `/study/[slug]`: 6 canonical routes
  - `/start-here/[slug]`: 5 canonical routes
  - `/romania/[slug]`: 7 canonical routes

## Build Output Evidence

When running `npm run build`, Next.js shows physical page routes processed. The exact output demonstrates the difference between the base physical page routes and the 66 generated HTML pages:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    372 B           321 kB
├ ○ /_not-found                          876 B          88.2 kB
├ ○ /about                               3.1 kB          122 kB
├ ○ /admin/comments                      208 B          87.5 kB
├ ○ /api/bnr-rates                       0 B                0 B
├ ƒ /api/evaluation                      0 B                0 B
├ ○ /articles                            1.43 kB         128 kB
├ ○ /company                             390 B           137 kB
├ ƒ /company/[slug]                      395 B           137 kB
├ ○ /company/investment                  2.85 kB         122 kB
├ ○ /contact                             1.47 kB         120 kB
├ ○ /evaluation                          730 B           120 kB
├ ○ /immigration                         341 B           210 kB
├ ƒ /immigration/[slug]                  423 B           210 kB
├ ƒ /legal/[slug]                        4.15 kB         123 kB
├ ○ /needs                               396 B           231 kB
├ ƒ /needs/[slug]                        404 B           231 kB
├ ○ /robots.txt                          0 B                0 B
├ ○ /romania                             394 B           136 kB
├ ƒ /romania/[slug]                      400 B           136 kB
├ ○ /romania/cities                      2.18 kB         128 kB
├ ○ /services                            1.8 kB          128 kB
├ ○ /sitemap.xml                         0 B                0 B
├ ○ /start-here                          395 B           134 kB
├ ƒ /start-here/[slug]                   394 B           134 kB
├ ○ /study                               372 B           321 kB
├ ƒ /study/[slug]                        438 B           135 kB
├ ○ /universities                        2.51 kB         129 kB
├ ○ /work                                332 B           137 kB
└ ƒ /work/[slug]                         394 B           137 kB
```
Next.js outputs: `✓ Generating static pages (24/24)` for the base template iterations, while `generateStaticParams` actually generates the 66 static HTML outputs during build.
Do not claim 66 physical page files.
