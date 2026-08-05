# Canonical Route Swap Verification

## Before
- `/legal` was canonical but physically redirected to `/legal/privacy`.
- `/romania/cities` was missing from the registry, though physically existing and redirected from `/cities`.

## After Swap
- Canonical Registry Count: 66
- Sitemap URL Count: 66
- `/romania/cities`: PRESENT (Canonical, Indexable)
- `/legal`: ABSENT from canonicals and Sitemap (Alias only)
- `/legal/privacy`: PRESENT
- `/cities`: ABSENT (Alias/Redirect only)

## Redirect Integrity
- `/legal` -> 308 -> `/legal/privacy`
- `/cities` -> 308 -> `/romania/cities`
- No redirect sources are included in the Sitemap.
- No canonical routes return a redirect.
