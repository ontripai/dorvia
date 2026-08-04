# Change Log: DRE-P2-LEGAL-FORM-T01-R01

## Changes Made
1. **Legal Config:** Created `src/lib/legalConfig.ts` to centralize legal entity data. Removed all developer placeholders from Privacy, Terms, and Disclaimer pages.
2. **Form Minimization:** Stripped `educationLevel`, `workExperience`, `approximateBudget`, and `maritalStatus` from `LeadForm.tsx`. Phone OR Email is now required.
3. **Production Guard:** The `LeadForm.tsx` will automatically render a disabled state if deployed to production without a populated `legalConfig.ts`.
4. **Telegram Hardening:** The API route now strictly waits for the Telegram API's 2xx response before reporting success. Errors and missing env vars return 503 safely.
5. **Supabase LocalStorage Purge:** Removed all fallback LocalStorage logic from `src/lib/supabase.ts`.
6. **Comments Privacy:** Added a strict disclaimer to the comments section.
7. **Admin Security:** Permanently disabled `/admin/comments` by turning it into a 404 server component, preventing client-side password exposure.
8. **SEO/Footer:** Added Links to Privacy, Terms, Disclaimer, and Cookie Policy in `Footer.tsx`. Excluded `/admin/*` from `sitemap.ts`.
