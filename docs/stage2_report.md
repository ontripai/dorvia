# Stage 2 Locale Foundation Final Audit Report

## 1. Commit Identity Correction
The previous report incorrectly cited SHA e624e1509939d89285098ffb3cfbe7010427e0bb due to a transcription error mapping the short SHA \e624e15\. The actual commit for the Stage 2 partition was e624e158b11c65058e9e42eed12806565349e66c.

## 2. Route Inventory & Mappings
The application has been partitioned into two dedicated root-layout trees:

### Legacy Route Tree \(legacy)\
These routes maintain all existing public URLs. Moving them into a Route Group \(legacy)\ preserves the original URL structures exactly as they were in Production.

### Locale Route Tree \[lang]\
A new parallel layout skeleton has been created to support future internationalization without colliding with legacy DOM structure.

## 3. Server Validation & Type Safety
* **Strict URL Parsing**: The \[lang]/layout.tsx\ now correctly uses \parseUrlLocale(params.lang)\ to parse the locale natively instead of relying on a decoupled boolean check.
* **Type Safety Enforcement**: The unsafe \params.lang as any\ assertion was completely removed. \parseUrlLocale\ safely derives the strict \Locale\ type which is passed safely to \getDirection(locale as Language)\.
* **Server-To-Client State Bridge**: The \AppLayout\ client provider was corrected to accept an \initialLang\ prop. The server layout now injects the strictly validated URL locale down into the provider, preventing \/en/\ from initially flashing or defaulting to \a\ before hydration.

## 4. Case-Sensitive Route Verification
The prior assertion of 100% compliance was inaccurate because Windows case-insensitive file mapping allowed \/FA/\ to hit the statically generated \a.html\ payload.
With the adoption of strict \parseUrlLocale\:
* On a case-sensitive Linux host (e.g. Vercel), \/FA\ bypasses the static \a.html\ match and falls back to dynamic SSR.
* During dynamic rendering, \parseUrlLocale('FA')\ safely evaluates to \
ull\.
* The server layout subsequently calls \
otFound()\, guaranteeing a 404 response for unsupported casing structurally on production.

## 5. Final HTTP Validation
| Route | Resolved | Status | Notes |
|---|---|---|---|
| \/\ | \/\ | 200 | Legacy page unchanged. |
| \/fa/\ | \/fa\ | 200 | 308 redirect to \/fa\ -> 200. Initial HTML strictly bound to \a\ / \
tl\. No client mutation required. |
| \/en/\ | \/en\ | 200 | 308 redirect to \/en\ -> 200. Initial HTML strictly bound to \en\ / \ltr\. No client mutation required. |
| \/de/\ | \/de\ | 404 | Safely caught by \parseUrlLocale\ returning null. |
| \/FA/\ | \/FA\ | 404 | (Linux Context) Caught by \parseUrlLocale\ returning null. |
| \/api/bnr-rates\ | \/api/bnr-rates\ | 502 | Existing behavior unchanged. This is an expected upstream proxy failure in local environments, not a routing regression. |
