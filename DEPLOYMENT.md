# راهنمای دیپلوی و متغیرهای محیطی DORVIA / Deployment Guide

## ⚠️ نکته حیاتی درباره متغیرهای محیطی در Vercel (Critical Environment Variables Note)

> **مهم:** تغییر هر `NEXT_PUBLIC_*` env var در Vercel به‌تنهایی کافی نیست — **باید Redeploy دستی هم انجام شود**.
> 
> **Important:** Changing any `NEXT_PUBLIC_*` environment variable in the Vercel Dashboard is NOT enough on its own — **a manual Redeploy is required**. Next.js inlines all `NEXT_PUBLIC_*` variables at **build time**, not at runtime. If a redeploy is not triggered, existing serverless functions and client bundles will continue serving the old values.

### چک‌لیست متغیرهای کلیدی پروداکشن (Production Checklist):
- `NEXT_PUBLIC_SITE_URL`: باید برابر با `https://dorvia.ro` باشد (نه دامنهٔ پیش‌فرض ورسل مانند `dorvia.vercel.app`).
- `NEXT_PUBLIC_SUPABASE_URL`: آدرس پروژه سوپابیس.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: کلید anon سوپابیس.
- `SUPABASE_SERVICE_ROLE_KEY`: کلید service role سوپابیس.
