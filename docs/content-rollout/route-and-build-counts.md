# Route and Build Counts

## Exact Build Concepts

- **Total physical `page.tsx` files**: 25
- **Public physical `page.tsx` files**: 24
- **Admin `page.tsx` files**: 1 (`/admin/comments`)
- **Static physical public route files**: 16
- **Dynamic template files**: 8
- **`generateStaticParams` outputs**: 0 (Dynamic pages are server-rendered on demand `ƒ`)
- **Canonical URL outputs**: 66 (Defined in ROUTE_REGISTRY)
- **Sitemap URLs**: 66
- **Next.js “Generating static pages” progress count**: 24 (The 16 static public physical files + 8 base dynamic template iterations)

## Discrepancy Resolution

Previous arithmetic (66 - 16 = 50 vs 53) contained three foundational errors:

1. **Incorrect generateStaticParams Claim**: The Next.js implementation does not use `generateStaticParams`; dynamic pages are server-rendered on demand. The reported 53 was derived manually from a flawed template-to-route mapping, not from build outputs.
2. **Incorrect Template Mapping (+1 error)**: The previous manual mapping attributed 8 routes to `/company/[slug]`. However, one of those (`/company/investment`) is a static physical page, leaving only 7 dynamic company routes. This reduces the artificial 53 count to the correct 52.
3. **Non-Canonical Static Pages (-2 error)**: The assumption that 66 canonical - 16 static = 50 dynamic assumes all 16 static physical pages are canonical. This is false. `/evaluation` is a physical static page but is NOT included in `ROUTE_REGISTRY`. Also `/romania/cities` is a static canonical route. 

**The Reconciled Equation:**
15 Static Canonical + 51 Dynamic Canonical = 66 Canonical Routes

## Dynamic Template Canonical Mapping (51 Outputs)
- `/legal/[slug]`: 3 routes
- `/needs/[slug]`: 12 routes
- `/immigration/[slug]`: 5 routes
- `/work/[slug]`: 6 routes
- `/company/[slug]`: 7 routes
- `/study/[slug]`: 6 routes
- `/start-here/[slug]`: 5 routes
- `/romania/[slug]`: 7 routes

## The `/legal/[slug]` Inspection
`/legal/[slug]` canonical routes are exactly:
- `/legal/privacy`
- `/legal/terms`
- `/legal/disclaimer`

`/legal` is only an alias and permanent redirect to `/legal/privacy`.
