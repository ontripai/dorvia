# Work and Business Menu Consolidation Audit (DRE-P00-BASE-T02-M01-PHASE3)

This document records the consolidation of the separate "کار" (Work) and "کسب‌وکار" (Business) desktop top-level navigation items into a single, unified **"کار و کسب‌وکار"** (Work & Business) mega menu and mobile navigation item.

## 1. Decision on Primary Click Target

When a user clicks directly on the main top-level navigation item **"کار و کسب‌وکار"** (rather than selecting a specific dropdown subroute):
- **Default Route**: `/work`
- **Rationale**: 
  1. `/work` serves as the primary entry point for employment, which represents the majority of user queries.
  2. The unified mega menu provides prominent, dedicated CTA buttons for both **"هاب اصلی کار" (`/work`)** and **"هاب اصلی کسب‌وکار" (`/company`)** at the top of each respective column.
  3. This ensures that users seeking business/company information can reach `/company` with 1 click from inside the mega menu without needing a separate top-level header item.

---

## 2. Complete List of 13 Sub-routes and 2 Standalone Hub Routes

All 15 routes remain 100% active, with unchanged URLs and intact page logic:

### Standalone Hub Pages (2 Routes)
1. `/work` — Work & Employment Hub Overview
2. `/company` — Business & SRL Formation Hub Overview

### Employment & Career Sub-routes (6 Routes)
3. `/work/find-job` — پیدا کردن کار (Find a Job)
4. `/work/permit` — مجوز کار Aviz de Muncă (Work Permit)
5. `/work/visa` — ویزای کاری تایپ D/AM (Work Visa)
6. `/work/contract` — قرارداد استخدام و REVISAL (Employment Contract)
7. `/work/tax` — حقوق و مالیات بر درآمد (Salary & Tax)
8. `/work/insurance` — بیمه اجتماعی و درمانی (Insurance)

### Business & Investment Sub-routes (7 Routes)
9. `/company/registration` — مراحل ثبت شرکت SRL در ONRC (Company Registration)
10. `/company/tax-types` — انواع نرخ‌های مالیاتی ۱٪ تا ۱۶٪ (Corporate Tax Options)
11. `/company/bank-account` — افتتاح حساب بانکی شرکتی (Corporate Bank Account)
12. `/company/residency` — شرایط اقامت مدیرعامل و سهامدار (Executive Residency)
13. `/company/real-estate-investment` — سرمایه‌گذاری در املاک (Real Estate Investment)
14. `/company/startup-tech-investment` — استارت‌آپ‌ها و فناوری اطلاعات (Tech Startups)
15. `/company/annual-tax-reporting` — قوانین مالیاتی و گزارش سالانه (Annual Tax Compliance)

---

## 3. Verification Results

| Test Step | Verification Method | Result |
| :--- | :--- | :--- |
| **TypeScript / Build Check** | `npm run build` | ✅ PASSED (Compiled with zero errors) |
| **Subroute Link Integrity** | Custom Node.js verification script (`scratch/verify_menu_routes.js`) | ✅ PASSED (15/15 routes confirmed active) |
| **Standalone Hub Route Test** | Direct URL verification for `/work` and `/company` | ✅ PASSED (Both hubs render correctly) |
| **Desktop Mega Menu UX** | 2-column layout with CTA buttons for both hubs | ✅ PASSED |
| **Mobile Drawer UX** | Unified "کار و کسب‌وکار" section with sub-headers | ✅ PASSED |
