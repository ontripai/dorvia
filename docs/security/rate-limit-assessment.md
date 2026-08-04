# Rate Limit Assessment

## Current Implementation
- An in-memory `Map` is used within the Next.js API route (`/api/evaluation/route.ts`).
- Limits: 3 requests per 5 minutes per IP.
- IP Source: `x-forwarded-for` header.

## Assessment
- This is a **Best-Effort** mechanism.
- In a serverless environment (like Vercel), each function execution may spin up a new container, meaning the in-memory `Map` is not shared across instances.
- This is sufficient to block simple burst scripts on a single cold start, but is **not production-grade** against distributed attacks.
- For true production-grade rate limiting, a shared store (Redis/Upstash) or a platform-level WAF (Vercel Firewall / Cloudflare) is required.
