# Driving License Page Comprehensive Overhaul (DRE-P00-BASE-T02-M01-PHASE5)

This document records the design, implementation, and verification of the newly rebuilt 6-section driving license guide at `/needs/driving-license`.

---

## 1. Page Architecture & Section Breakdown

```
[ Hero Panel ] (Title & Subtitle)
     │
[ Section 0: Table of Contents ] (Quick Anchor Links)
     ├── #foreign-license-temp ────► Section 1: Temporary Foreign License (Vienna Convention 1968)
     ├── #iranian-license-conversion ─► Section 2: Iranian License Conversion (Prerequisites, Process, Costs)
     ├── #license-from-scratch ────► Section 3: Driving License from Scratch (DGPCI, 24h theory + 30h practice)
     ├── #license-renewal ─────────► Section 4: Romanian License Renewal (10-15 years validity)
     ├── #international-license-idp ──► Section 5: International Permit (DGPCI 46 RON vs ACR 1,150 RON)
     └── #penalties-and-suspension ─► Section 6: Penalties, Suspensions & Traffic Points
     │
[ Official References ] (DGPCI, Embassy, Vienna Convention, ACR)
     │
[ Date Verification Tag ] (آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶)
```

---

## 2. Key Details & Fixes Implemented

### Section 0: Interactive Table of Contents
- Renders 6 interactive anchor cards for instant smooth scrolling to each section.

### Section 1: Temporary Foreign License
- Explains the Vienna Convention on Road Traffic 1968 (Iran accession 1976).
- Warns that legal residency requires license exchange according to Romanian law.

### Section 2: Iranian License Conversion
- **Quick Answer**: Explains who this guide is for.
- **Initial Prerequisites HTML Table**: Highlights valid Iranian license (unexpired requirement), residence permit (Permis de Ședere), embassy authentication, and medical fitness.
- **Step-by-Step Process**: Embassy verification (Mikhak portal) ➔ Legal translation & notary ➔ Medical exam (Fișa Medicală) ➔ DGPCI submission.
- **Required Documents Checklist**: Complete list with checkmark icons.
- **Costs Breakdown HTML Table**: 89 RON state fee (2026), 150-250 RON medical exam, 100-200 RON translation/notary, embassy fee.
- **Timeframe Note**: `"طبق منابع مختلف، بررسی اصالت گواهی‌نامه‌های کشورهای خارج از اتحادیه اروپا از ۱۵ روز کاری تا حدود سه ماه گزارش شده است..."`
- **Expired License Warning**: `"گواهی‌نامه‌های منقضی شده صادر از کشورهای خارج از اتحادیه اروپا معمولاً قابل تبدیل نیستند..."`
- **Frozen Files & Issues**: Details causes for frozen files (name spelling mismatches, slow embassy replies).

### Section 3: Obtaining License from Scratch
- School training: 24h theory + 30h practical B category.
- Computer theory exam at DGPCI (foreign nationals can request exam in international languages).
- State fee: 89 RON (2026).
- Practical test re-test rule: Minimum 6 additional practical hours required upon failure.
- Cited Source: `dgpci.mai.gov.ro`.

### Section 4: Romanian License Renewal
- 10-15 years validity, no re-examination required, updated medical checkup (Fișa Medicală).

### Section 5: International Driving Permit (IDP)
- Compares **DGPCI direct service (since 2024)** at **46 RON** (~30 days processing) versus **ACR** at **~1,150 RON**.
- Valid for up to 3 years.

### Section 6: Penalties & Suspensions
- Overview of penalty points (Puncte de penalizare) and temporary license confiscation/suspensions.

### Official References
- Direct clickable links to DGPCI (`dgpci.mai.gov.ro`), Iranian Embassy in Bucharest (`bucharest.mfa.ir`), Vienna Convention 1968, and ACR (`acr.ro`).

### Date & Validity Footer
- Includes: `"آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶"`.

---

## 3. Verification Results

| Test Item | Verification Command | Result |
| :--- | :--- | :--- |
| **TypeScript / Build Check** | `npm run build` | ✅ PASSED (Compiled with zero errors) |
| **Section Anchor ID Check** | `scratch/verify_driving_license_page.js` | ✅ PASSED (All 6 anchor IDs verified) |
| **HTML Data Tables Check** | Inspection of `<table />` elements | ✅ PASSED (Prerequisites and Costs tables verified) |
| **Official Links Verification** | Verification script | ✅ PASSED (DGPCI, Embassy, Vienna Convention, ACR links active) |
