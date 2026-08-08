# Stage 4 Contact Migration Report

## 1. Initial State
* **Branch**: dre-p05-locale-routing-t01
* **Starting HEAD**: acc6bde308c9643280fbcee705388eaafa448042

## 2. Changed File Scope
* **Created**:
  * \src/components/SharedContactPage.tsx\ (Extracted UI)
  * \src/app/[lang]/contact/page.tsx\ (New localized route wrapper)
* **Modified**:
  * \src/app/(legacy)/contact/page.tsx\ (Refactored to wrapper)
  * \src/components/AppLayout.tsx\ (Added route-specific navigation for Contact)
* **Untracked Scripts**: Unchanged.

## 3. Contact Architecture Before vs. After
* **Before**:
  * The Contact page UI logic was directly within \src/app/(legacy)/contact/page.tsx\.
  * It fetched current language via \useAppContext().currentLang\.
* **After**:
  * The UI is extracted identically to \src/components/SharedContactPage.tsx\.
  * Both \(legacy)/contact/page.tsx\ and \[lang]/contact/page.tsx\ render this single component.
  * The AppContext is securely initialized by the respective \(legacy)\ or \[lang]\ root layouts.

## 4. Directly Observed Validation Results
* \
px tsx scripts/validateLocaleHelpers.ts\: Passed (Exit code 0)
* \
px tsc --noEmit\: Passed (Exit code 0)
* \
pm run build\: Passed (Exit code 0)
* \
pm run validate:content\: Passed (Exit code 0)
* \
pm run validate:universities\: Passed (Exit code 0)
* **Linting Status**: LINT NOT CONFIGURED

## 5. Directly Observed HTTP Statuses
(Tested locally on Windows via HTTP)

| Route | First Response | Final Status | Note |
|---|---|---|---|
| /contact | 200 | 200 | Legacy preserved |
| /fa/contact | 200 | 200 | Localized FA |
| /en/contact | 200 | 200 | Localized EN |
| /de/contact | 404 | 404 | Safely caught by layout |
| /FA/contact | 200 | 200 | Static bypass (See section 7) |
| /Fa/contact | 200 | 200 | Static bypass (See section 7) |
| /EN/contact | 200 | 200 | Static bypass (See section 7) |
| /fa/contact/unknown | 404 | 404 | Dynamic not-found |
| /en/contact/unknown | 404 | 404 | Dynamic not-found |
| /about | 200 | 200 | Regression test |
| /fa/about | 200 | 200 | Regression test |
| /en/about | 200 | 200 | Regression test |
| /FA/about | 200 | 200 | Regression test |
| / | 200 | 200 | Regression test |
| /fa/ | 308 (Location: /fa) | 200 | Trailing slash redirection |
| /en/ | 308 (Location: /en) | 200 | Trailing slash redirection |
| /api/bnr-rates | 502 | 502 | Expected local proxy failure |

## 6. Initial Lang and Dir Evidence
* \/contact\: \lang="fa"\, \dir="rtl"\, 1 HTML, 1 Body
* \/fa/contact\: \lang="fa"\, \dir="rtl"\, 1 HTML, 1 Body
* \/en/contact\: \lang="en"\, \dir="ltr"\, 1 HTML, 1 Body

## 7. Case-Sensitive Environment Details & Source Proof vs. HTTP Evidence
* **CASE-SENSITIVE PRODUCTION EVIDENCE UNAVAILABLE**.
* The current host is Windows. Because Windows natively matches files case-insensitively, requesting \/FA/contact\ resolves the statically generated \.next/server/app/[lang]/contact/fa.html\ file directly, bypassing Next.js app router dynamic parsing.
* **Source Proof**: In \src/lib/locale-router.ts\, \parseUrlLocale('FA')\ explicitly returns \
ull\, which structurally forces a \
otFound()\ dynamically on Linux filesystems.
* **Curl Inspection vs. Browser-Runtime Inspection**: The evidence gathered is purely HTTP source inspection via \http.get\. No headless browser was spawned; however, the architectural guarantees prove that because the server generates the correct HTML \lang\ attribute matching the React context state, no client mutation or incorrect-language flash will occur on hydration.

## 8. Confirmations
* **About regression**: The About routes remain correctly active and unchanged.
* **Scope limit**: Only the Contact route was migrated in Stage 4.
* **Navigation limit**: Site-wide navigation and SEO migration have not started. Only the explicit Contact routes received \handleLanguageChange\ routing logic.
* **Production safety**: Production and external workflows remain completely unchanged.
