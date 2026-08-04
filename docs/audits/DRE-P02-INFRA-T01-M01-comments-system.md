# Moderated Public Comments System & Admin Moderation Panel (DRE-P02-INFRA-T01-M01)

This document records the design, implementation, and verification of the moderated public commenting infrastructure and the password-protected admin moderation panel.

---

## 1. System Architecture

```
[ User Comment Submission ]
     │
     ▼
[ Anti-Spam & Validation ]
  - Honeypot check (hidden input field)
  - 60-second rate-limiter per browser
  - Character limit (max 1000 chars)
     │
     ▼
[ Database Storage ]
  - Supabase `comments` table OR LocalStorage Demo Fallback
  - Default status: 'pending'
     │
     ▼
[ Admin Panel ] (/admin/comments)
  - Protected by ADMIN_PASSWORD
  - Views Pending, Approved, and Rejected comments
  - Actions: Approve (تایید و انتشار), Reject (رد نظر), Delete (حذف)
     │
     ▼
[ Public View ] (<CommentsSection pagePath="..." />)
  - Renders ONLY comments with status = 'approved' for that page
```

---

## 2. Database Schema (`comments` Table)

File: `docs/migrations/01_create_comments_table.sql`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier (`gen_random_uuid()`) |
| `page_path` | TEXT | Target page route (e.g., `needs/driving-license`) |
| `name` | TEXT | Display name (default: 'کاربر ناشناس') |
| `comment_text` | TEXT | Comment content (max 1000 chars) |
| `rating` | INTEGER | Optional 1 to 5 star rating |
| `status` | TEXT | Moderation status: `'pending'`, `'approved'`, `'rejected'` |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `ip_hash` | TEXT | Hashed IP for rate limiting |

---

## 3. Key Components & Features

### 1. `src/components/CommentsSection.tsx`
- Renders published (`approved`) comments for the active `pagePath`.
- Includes star ratings, author badges, and relative timestamps.
- Form handles name (optional), star rating (optional), and comment text (required).
- After submission, notifies user: `"نظر شما با موفقیت ثبت شد و پس از بررسی و تایید مدیر نمایش داده می‌شود."`
- Honeypot hidden input prevents automated bot submissions.

### 2. `src/app/admin/comments/page.tsx`
- Password-protected admin interface using `ADMIN_PASSWORD` env variable (fallback: `admin123`).
- Provides realtime filtering tabs (`Pending`, `Approved`, `Rejected`, `All`).
- Enables one-click Approval, Rejection, and Permanent Deletion.

---

## 4. Verification & Build Results

| Test Item | Verification Method | Status |
| :--- | :--- | :--- |
| **TypeScript & Next.js Build** | `npm run build` | ✅ PASSED (Clean compilation of 21 static/dynamic routes) |
| **Comments Data Flow Test** | `scratch/test_comments_system.js` | ✅ PASSED (Submission, status toggle, and public visibility confirmed) |
| **Anti-Spam Honeypot Check** | Automated script test | ✅ PASSED (Bot submissions rejected) |
| **Bilingual UI** | FA / EN prop testing | ✅ PASSED |
