# Route Registry Reconciliation

During the initial phase of the SEO patch (DRE-P2-ROUTES-SEO-T01), the `sitemap.ts` file maintained a hardcoded list of static routes (e.g., ``, `/about`, `/contact`, `/universities`, `/services`, `/articles`) distinct from the `ROUTE_REGISTRY`. This violated the architectural intent that `ROUTE_REGISTRY` serves as the singular source of truth for all public canonical routes.

## Action Taken
1. The 6 static routes were extracted from `sitemap.ts` and formally added to `ROUTE_REGISTRY` in `src/lib/routeRegistry.ts` as canonical nodes. They are classified as `pageType: 'special'` (or `hub` for list pages), with explicitly defined `titleFa`, `titleEn`, `indexable`, and `inSitemap` properties.
2. The `sitemap.ts` file was rewritten to read exclusively from `ROUTE_REGISTRY`. It now iterates over all registered routes, filtering by `indexable && inSitemap`, to generate the 66 valid XML nodes.

## Benefits
- **Zero Hidden Routes**: No route is submitted to the XML Sitemap that cannot be managed and verified through the Registry.
- **Consistent Metadata**: Top-level static pages now enjoy the same centralized metadata controls via `src/lib/pageMeta.ts` as dynamic leaf nodes.
- **Canonical Clarity**: Centralizing all canonical paths prevents conflicts where a page might be defined in the app folder but omitted from the sitemap.
