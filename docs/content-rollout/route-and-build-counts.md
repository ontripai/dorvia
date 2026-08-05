# Route and Build Counts

## Separation of Counts

It is critical to distinguish between canonical routes, physical files, and build output:

- **Canonical Routes in ROUTE_REGISTRY: 66**
  These are the unique, indexable concepts representing public-facing pages in the system.

- **Sitemap URL Count: 66**
  Derived directly from the 66 canonical routes.

- **Physical App Router Page Files: ~25-30**
  Next.js App Router uses dynamic route catch-alls (e.g., `app/needs/[slug]/page.tsx`, `app/company/[slug]/page.tsx`). A single physical file generates multiple routes.

- **Static Routes / Dynamic Routes**
  The build process uses `generateStaticParams` to statically generate HTML for all 66 routes based on the dynamic templates.

**Explanation:** 
66 canonical routes do NOT equal 66 physical files in the `app/` directory. The architecture uses dynamic templates (like `[slug]/page.tsx`) to systematically inject localized content into shared React components.
