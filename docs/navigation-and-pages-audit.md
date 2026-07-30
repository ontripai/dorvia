# Navigation and Pages Audit: Dar Romania Platform

**Project**: Dar Romania | در رومانی  
**Target Domain**: https://romania-eight.vercel.app  
**Audit Date**: 2026-07-30  
**Status**: Comprehensive Baseline & Architecture Review  

---

## 1. Existing System Audit

### 1.1 Next.js & Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3 with custom tokens (`--navy-950`, `--romania-blue-*`, `--romania-yellow-*`, `--romania-red-*`)
- **PostCSS**: `postcss.config.js` properly configured with Tailwind and Autoprefixer.
- **Icons**: Lucide React SVG icon system (`Icons.tsx`).
- **Typography**: Google Fonts `Vazirmatn` (Persian) and `Inter` / `Manrope` (English).

### 1.2 Route Architecture & Language Handling
- **Current Setup**: Client-side state routing combined with Next.js App Router root layout.
- **Identified Gap**: Missing explicit localized route prefixes (`/fa/...` and `/en/...`) and `hreflang` metadata headers (`fa`, `en`, `x-default`).
- **Required Action**: Structure all routes with clean bilingual paths, supporting SEO indexing and automatic language fallback.

---

## 2. Navigation Architecture Audit

### 2.1 Current Header Navigation
- **Items**: `مهاجرت`, `تحصیل`, `کار`, `کسب‌وکار`, `زندگی در رومانی`, `شناخت رومانی`.
- **Identified Gap**: Needs restructuring to match the new 6-item primary navigation specification:
  1. `مهاجرت` (Immigration)
  2. `تحصیل` (Study)
  3. `کار` (Work)
  4. `کسب‌وکار` (Business)
  5. `نیازها در رومانی` (Essentials in Romania) - *NEW*
  6. `رومانی` (Romania) - *NEW*
- **Header Utilities**: Functional Search Overlay, Segmented Language Switcher (`FA | EN`), and Primary CTA (`ارزیابی رایگان`).

---

## 3. Missing Pages & Detailed Content Expansion Plan

### 3.1 Category: "نیازها در رومانی" (Essentials in Romania)
- [NEW] `/fa/needs-in-romania/` / `/en/essentials-in-romania/`
- [NEW] `/fa/needs-in-romania/currency-exchange/` (صرافی، تبدیل پول و پرداختهای روزمره)
- [NEW] `/fa/needs-in-romania/driving-license/` (گواهینامه رانندگی)
- [NEW] `/fa/needs-in-romania/certified-translation/` (دارالترجمه و ترجمه رسمی)
- [NEW] `/fa/needs-in-romania/notary-public/` (دفتر اسناد رسمی)
- [NEW] `/fa/needs-in-romania/iranian-embassy-and-mikhak/` (سفارت ایران و سامانه میخک)
- [NEW] `/fa/needs-in-romania/housing/` (اجاره و خرید مسکن)
- [NEW] `/fa/needs-in-romania/first-days-checklist/` (چک‌لیست روزهای نخست ورود)

### 3.2 Category: "رومانی" (Romania Overview & Discover)
- [NEW] `/fa/romania/` / `/en/romania/`
- [NEW] `/fa/romania/economy/` (اقتصاد رومانی، صنایع، درآمد و بازار کار)
- [NEW] `/fa/romania/society/` (جامعه و زندگی اجتماعی در رومانی)
- [NEW] `/fa/romania/culture-and-arts/` (فرهنگ و هنر رومانی)
- [NEW] `/fa/romania/laws-and-regulations/` (قوانین و مقررات مهم)
- [NEW] `/fa/romania/tourism/` (راهنمای گردشگری رومانی)
- [NEW] `/fa/romania/cities/` (شهرهای رومانی: بخارست، کلوژ، تیمیشوارا و...)

### 3.3 Assessment & Service Pages
- [NEW] `/fa/free-assessment/` (صفحه اختصاصی ارزیابی رایگان 4 مرحله‌ای)
- [NEW] `/fa/book-consultation/` (صفحه رزرو مشاوره تخصصی)
- [NEW] `/fa/services/[service-slug]/` (صفحات جزئیات خدمات متمرکز)

---

## 4. Legal Compliance & Credibility Rules
- **No Absolute Claims**: Remove unverified guarantees (e.g. "۱٪ مالیات فوری", "تضمین ۱۰۰٪", "پذیرش قطعی").
- **Official Sources Allowlist**: Link to official primary sources only (BNR `bnr.ro`, IGI `igi.mai.gov.ro`, MAE `mae.ro`, EDU `edu.ro`, ONRC `onrc.ro`, Embassy of Iran `bucharest.mfa.ir`, Mikhak `mikhak.mfa.gov.ir`, ANCPI `ancpi.ro`).
- **Metadata**: Include `lastReviewedAt` and `officialSourceUrl` badges on all changing legal/financial content.
