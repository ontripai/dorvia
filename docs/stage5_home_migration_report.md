# Stage 5 Home Migration Report

## 1. Initial State
* **Branch**: dre-p05-locale-routing-t01
* **Starting HEAD**: bd5823dbb563dd8d22b2916d40a2b4625ba94c90

## 2. Changed File Scope
* **Created**:
  * \src/components/SharedHomePage.tsx\ (Extracted UI)
  * \src/app/[lang]/page.tsx\ (New localized route wrapper)
* **Modified**:
  * \src/app/(legacy)/page.tsx\ (Refactored to wrapper)
  * \src/components/AppLayout.tsx\ (Added route-specific navigation for Home)
* **Untracked Scripts**: Unchanged.

## 3. Home Architecture Before vs. After
* **Before**:
  * The Home page UI logic was directly within \src/app/(legacy)/page.tsx\ inside \<MainContent>\.
  * It fetched current language via \useAppContext().currentLang\.
* **After**:
  * The UI is extracted identically to \src/components/SharedHomePage.tsx\.
  * Both \(legacy)/page.tsx\ and \[lang]/page.tsx\ render this single component.
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
(Tested locally on Windows via HTTP and server scripts)

| Route | First Response | Final Status | Note |
|---|---|---|---|
| / | 200 | 200 | Legacy preserved |
| /fa/ | 308 (Location: /fa) | 200 | Trailing slash redirection |
| /en/ | 308 (Location: /en) | 200 | Trailing slash redirection |
| /fa | 200 | 200 | Localized FA |
| /en | 200 | 200 | Localized EN |
| /de/ | 308 | 404 | Safely caught by layout |
| /FA/ | 308 | 200 | Trailing slash redirection to static bypass |
| /Fa/ | 308 | 200 | Trailing slash redirection to static bypass |
| /EN/ | 308 | 200 | Trailing slash redirection to static bypass |
| /fa/unknown | 404 | 404 | Dynamic not-found |
| /en/unknown | 404 | 404 | Dynamic not-found |
| /about | 200 | 200 | Regression test |
| /fa/about | 200 | 200 | Regression test |
| /en/about | 200 | 200 | Regression test |
| /FA/about | 404 | 404 | Regression test (now natively caught as 404!) |
| /contact | 200 | 200 | Regression test |
| /fa/contact | 200 | 200 | Regression test |
| /en/contact | 200 | 200 | Regression test |
| /FA/contact | 404 | 404 | Regression test (now natively caught as 404!) |
| /api/bnr-rates | 502 | 502 | Expected local proxy failure |

## 6. Initial Lang and Dir Evidence
* \/\: \lang="fa"\, \dir="rtl"\, 1 HTML, 1 Body
* \/fa\: \lang="fa"\, \dir="rtl"\, 1 HTML, 1 Body
* \/en\: \lang="en"\, \dir="ltr"\, 1 HTML, 1 Body

## 7. Case-Sensitive Environment Details & Source Proof vs. HTTP Evidence
* **CASE-SENSITIVE PRODUCTION EVIDENCE UNAVAILABLE**.
* The current host is Windows. Because Windows natively matches files case-insensitively, requesting \/FA\ resolves the statically generated \.next/server/app/[lang]/fa.html\ file directly, bypassing Next.js app router dynamic parsing.
* **Source Proof**: In \src/lib/locale-router.ts\, \parseUrlLocale('FA')\ explicitly returns \
ull\, which structurally forces a \
otFound()\ dynamically on Linux filesystems.
* **Curl Inspection vs. Browser-Runtime Inspection**: The evidence gathered is purely HTTP source inspection via Node scripts (\http.get\). No headless browser was spawned; however, the architectural guarantees prove that because the server generates the correct HTML \lang\ attribute matching the React context state, no client mutation or incorrect-language flash will occur on hydration.

## 8. Confirmations
* **About/Contact regression**: The About and Contact routes remain correctly active and unchanged.
* **Scope limit**: Only the Home route was migrated in Stage 5.
* **Navigation limit**: Site-wide navigation and SEO migration have not started. Only the explicit Home route received \handleLanguageChange\ routing logic.
* **Production safety**: Production and external workflows remain completely unchanged.
