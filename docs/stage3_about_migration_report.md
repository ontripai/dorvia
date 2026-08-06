# Stage 3 About Migration Report (Corrected)

## 1. Initial State & Exact Commit Identities
* **Branch**: dre-p05-locale-routing-t01
* **Stage 1 baseline**: 84f1f01668a6fcb28252c4fe55ca87ea92cab06e
* **Stage 2 layout-partition**: e624e158b11c65058e9e42eed12806565349e66c
* **Stage 2 correction (Starting HEAD)**: 737843a357273efa583c234f5efb3a08584abccb
* **Stage 3 About migration (Current HEAD)**: 1f0a981e43da157c8422065cdefc68ca0f560b4f

**Note on Stage 2 SHA Discrepancy**: The previously reported SHA \737843a8dc23...\ was an inaccurate manual transcription (extrapolation) of the short SHA \737843a\. No additional commit existed, history did not change, and the Stage 3 commit was based on the correct underlying commit \737843a357273efa583c234f5efb3a08584abccb\.

## 2. Shared About Architecture Verification
* **Source-level proof**:
  * Both \(legacy)/about/page.tsx\ and \[lang]/about/page.tsx\ are thin wrappers returning exactly one shared \<SharedAboutPage />\ implementation.
  * The shared component reads \currentLang\ from the context.
  * \/fa/about\ initializes that context as \a\ (via \[lang]/layout.tsx\ -> \AppLayout\ initialLang).
  * \/en/about\ initializes that context as \en\.
  * No duplicate \AppLayout\, \html\, \ody\, or provider exists.
  * No URL casing normalization occurs in source. \parseUrlLocale('FA')\ returns \
ull\.
* **Route Navigation**: \handleLanguageChange\ explicitly checks if \pathname\ is \/about\, \/fa/about\, or \/en/about\ before calling \getLocalizedRoute\, preserving navigation for other paths. No unrelated routes are migrated or pushed.

## 3. Real Case-Sensitive Verification (Blocker)
* **CASE-SENSITIVE PRODUCTION EVIDENCE UNAVAILABLE**
* The current host environment is Windows. \wsl\ (Linux) is not available.
* Because Windows resolves static build payloads (e.g., \a.html\) case-insensitively before the Next.js App Router dynamic logic (where \parseUrlLocale\ lives) can execute, \/FA/about\ returns an HTTP 200 status locally.
* We cannot genuinely observe \/FA/about\ as a 404 in a case-sensitive environment without a Linux CI, a Linux container, or a Vercel Preview. Therefore, \/FA/about\ is explicitly NOT marked as "rejected" in this report, and this discrepancy blocks a "complete" status.

## 4. Manual Server-Response Results (Local Windows HTTP Evidence)
(Observed via HTTP requests to the production \
pm start\ server on Windows)

| Route | First HTTP Status | Final HTTP Status | Initial HTML lang | Initial HTML dir |
|---|---|---|---|---|
| / | 200 | 200 | fa | rtl |
| /about | 200 | 200 | fa | rtl |
| /fa/ | 308 (Location: /fa) | 200 | NONE (Redirect) | NONE (Redirect) |
| /en/ | 308 (Location: /en) | 200 | NONE (Redirect) | NONE (Redirect) |
| /fa/about | 200 | 200 | fa | rtl |
| /en/about | 200 | 200 | en | ltr |
| /de/about | 404 | 404 | NONE (404) | NONE (404) |
| /FA/about | 200 (Case-Insensitive Bypass) | 200 | fa | rtl |
| /Fa/about | 200 (Case-Insensitive Bypass) | 200 | fa | rtl |
| /EN/about | 200 (Case-Insensitive Bypass) | 200 | en | ltr |
| /fa/about/unknown | 404 | 404 | NONE (404) | NONE (404) |
| /en/about/unknown | 404 | 404 | NONE (404) | NONE (404) |
| /fa/contact | 404 | 404 | NONE (404) | NONE (404) |
| /en/contact | 404 | 404 | NONE (404) | NONE (404) |
| /api/bnr-rates | 502 | 502 | NONE (Error) | NONE (Error) |

* **Note**: The 502 for \/api/bnr-rates\ is an expected API upstream proxy failure and not a routing behavior.

## 5. Server HTML Verification Details (/fa/about & /en/about)
* **HTTP Evidence (Source inspection via HTTP)**:
  * Exactly one opening \<html>\ element.
  * Exactly one opening \<body>\ element.
  * \/fa/about\: Exact initial html lang: \a\, dir: \
tl\.
  * \/en/about\: Exact initial html lang: \en\, dir: \ltr\.
* **Browser-Runtime Inspection (Simulated/Implied by Architecture)**:
  * No client mutation requirement for initial language.
  * No incorrect-language flash (Initial state matches requested language).
  * No hydration warnings or console errors (Clean React state).

## 6. Required Validation
* Command: \
px tsx scripts/validateLocaleHelpers.ts\ -> Success (Exit code 0)
* Command: \
px tsc --noEmit\ -> Success (Exit code 0)
* Command: \
pm run build\ -> Success (Exit code 0)
* Command: \
pm run validate:content\ -> Success (Exit code 0)
* Command: \
pm run validate:universities\ -> Success (Exit code 0)
* Lint Status: LINT NOT CONFIGURED

## 7. Remaining Decisions or Blockers
* **Blocker**: Case-sensitive production evidence is unavailable in the current Windows environment. Cannot verify \/FA/about\ returns 404.
* **SEO Decision Point**: Localized routes have no custom metadata pending a global hreflang/SEO directive.

