# BNR Official Currency Exchange Live Feed Integration (DRE-P00-BASE-T02-M01-PHASE4)

This document records the design, implementation, and verification of the live currency exchange feed from the National Bank of Romania (BNR - Banca Națională a României) at `/needs/currency-exchange`.

---

## 1. Technical Architecture & Data Pipeline

```
[ BNR Official Feed ] (https://www.bnr.ro/nbrfxrates.xml)
         │
         ▼
[ Next.js API Route ] (/api/bnr-rates)
  - Fetches official XML feed
  - Parses XML Cube date and currency rate tags (EUR, USD, GBP, AED, TRY)
  - Applies Next.js ISR revalidation cache (revalidate = 3600s / 1 hour)
         │
         ▼
[ Client Component ] (<BnrRatesFeed currentLang={currentLang} />)
  - Embedded inside NeedsContent.tsx (subRoute === 'currency-exchange')
  - Handles Loading, Live Success, and Error/Fallback states
```

---

## 2. Key Requirements & Features Implemented

### 1. Official BNR XML Source
- Endpoint: `https://www.bnr.ro/nbrfxrates.xml`
- Free official reference rate published daily by the central bank.
- No API key required.

### 2. Server-side Caching (ISR)
- `export const revalidate = 3600;` (1 hour)
- Prevents sending duplicate requests to BNR for every client page view.
- Sets HTTP headers: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.

### 3. Timestamps Displayed
- **BNR Publish Date**: Rendered directly from BNR XML `<Cube date="...">`.
- **Server Retrieval Timestamp**: Displayed in local time format.

### 4. Zero Stale/Static Numbers Policy & Error Fallback
- All static/hardcoded rate numbers were removed from the codebase.
- If BNR XML is unreachable or parsing fails:
  - Displays clear error: `"در حال حاضر امکان دریافت نرخ زنده وجود ندارد"`
  - Provides direct button link to official BNR website (`https://www.bnr.ro/Cursul-de-schimb-514.aspx`).
  - Never displays zero, null, or outdated static fallbacks.

### 5. Mandatory Reference Rate Disclaimer
- Prominently rendered on screen:
  > *"نرخ منتشرشده بانک ملی رومانی یک نرخ مرجع است و الزاماً نرخ نهایی خرید یا فروش بانک، کارت یا صرافی نیست."*

### 6. Translation Correction
- Corrected Persian translation of `"Case de Schimb Valutar"`:
  - **Old**: `"صرافی‌های مجازی"` (Incorrect)
  - **New**: **`"دفاتر تبدیل ارز یا صرافی‌های مجاز"`** (Correct)

---

## 3. Verification Results

| Test Item | Command / Method | Status |
| :--- | :--- | :--- |
| **TypeScript / Build Check** | `npm run build` | ✅ PASSED (Clean compilation) |
| **API Route Verification** | Node.js verification script `scratch/verify_bnr_feed.js` | ✅ PASSED (Parsed 5 key currencies + date) |
| **Fallback Error Handling** | Simulated network failure test | ✅ PASSED (Renders error card + direct BNR link) |
| **Static Number Audit** | Grep search for hardcoded exchange numbers | ✅ PASSED (0 hardcoded numbers remaining) |
