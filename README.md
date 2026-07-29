# Dar Romania | در رومانی 🇷🇴

Modern, professional, bilingual (Persian & English) information and lead-generation web application for **Dar Romania | In Romania**.

Targeted at international applicants — especially from Iran, UAE, Turkey, and worldwide — seeking legal pathways to Romania (Study, Work, Company Registration, Investment, Family Reunification).

---

## 🌟 Key Features

1. **Full Bilingual & Direction Support (Persian RTL / English LTR)**
   - Persian (Farsi) as the primary default language (`/fa`).
   - English as the second language (`/en`).
   - Automatic HTML `dir="rtl"` and `dir="ltr"` switching.
   - Language switcher in the sticky header and footer.

2. **Romanian Flag Design System**
   - **Romanian Blue**: `#002B7F` (Primary brand color for trust, headers, primary buttons, and cards).
   - **Romanian Yellow / Gold**: `#FCD116` (Highlight accents, key callouts, gold badges).
   - **Romanian Red**: `#CE1126` (Urgency accents, subtle alert badges).
   - **Typography**: Google Fonts `Vazirmatn` (Persian) & `Inter` (English).

3. **14 Core Pages & Sections**
   - 🏠 **Home Page**: Hero section, Main Pathways, Why Romania benefits grid, About Romania intro, Our Services, Featured Universities, Featured Cities, Interactive Evaluation Lead Form, Latest Articles, Ethical Trust & Compliance, Final Call-to-Action.
   - 📜 **Immigration to Romania**: Pathways breakdown, requirements, residency rules.
   - 🎓 **Study in Romania**: University admission process, medicine/dentistry options, tuition & living costs, student visas.
   - 💼 **Work in Romania**: Job market, sectors (IT, engineering, construction), Aviz de Munca work permit.
   - 🏢 **Company Registration in Romania**: SRL company formation, 1% micro tax option, virtual offices, business residency.
   - 🏡 **Living in Romania**: Housing rents, food, healthcare, transportation, safety, family life.
   - 🏛️ **Universities Listing**: Filterable directory of top accredited public & medical universities.
   - 📍 **Cities Listing**: Bucharest, Cluj-Napoca, Timișoara, Iași, Brașov, Constanța.
   - 🇷🇴 **About Romania**: Geography, nature, culture, economy, history, society.
   - ✦ **Services Page**: Educational admissions, work permit support, company setup, document legalization, post-arrival assistance.
   - 📰 **Articles & Resources**: Immigration legal updates, university guides, business news.
   - 👥 **About Us**: Mission, transparency, non-guaranteed visa compliance.
   - 📞 **Contact Us**: Contact form, WhatsApp direct link, email, location details.
   - ⚖️ **Legal Pages**: Privacy Policy, Terms & Conditions, Disclaimer, Cookie Policy.

4. **Lead Capture & Supabase Scaffolding**
   - Multi-field lead form capturing: Name, Email, Phone/WhatsApp, Country, Nationality, Preferred Language, Primary Goal, Education, Experience, Budget, Marital Status, Message, and Privacy Consent.
   - Integrated with `@supabase/supabase-js` targeting the `leads` database table with demo fallback handling.

---

## 🛠️ Project Structure

```
c:/AIPROJECTBACKUP/nextromaniaIMG/
├── index.html                 # Ready-to-run interactive SPA (Browser Preview)
├── package.json               # Dependencies & scripts for Next.js 14
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS with Romanian flag design tokens
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Supabase environment variables template
├── src/
│   ├── App.tsx                # Main stateful application wrapper
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces (LeadFormData, University, City, etc.)
│   ├── lib/
│   │   ├── i18n.ts            # Translation utility & language settings
│   │   ├── supabase.ts        # Supabase client & submission handler
│   │   ├── data.ts            # Dataset for Universities, Cities, Services, Articles
│   │   └── translations/
│   │       ├── fa.ts          # Persian dictionary
│   │       └── en.ts          # English dictionary
│   ├── components/
│   │   ├── Header.tsx         # Sticky header with logo, nav, language switcher, CTA
│   │   ├── Footer.tsx         # Footer with quick links, legal disclaimers, contact
│   │   ├── LeadForm.tsx       # Evaluation form component with validation
│   │   ├── LanguageSwitcher.tsx
│   │   ├── PathwayCard.tsx
│   │   ├── UniversityCard.tsx
│   │   ├── CityCard.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── TrustSection.tsx
│   │   └── MainContent.tsx    # Dynamic view switcher for all 14 pages
│   └── app/
│       ├── layout.tsx         # Next.js RootLayout
│       ├── page.tsx           # App Router entry point
│       └── globals.css        # Global CSS & fonts
```

---

## 🚀 How to Run & Deploy

### Option 1: Direct Browser Testing (Instant)
Simply open `index.html` in any web browser (Chrome, Edge, Firefox, Safari) to test all interactive features, bilingual toggling, lead evaluation forms, and responsive page navigation.

### Option 2: Deploy with Next.js & Vercel
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run local dev server:
   ```bash
   npm run dev
   ```
3. Deploy to Vercel:
   ```bash
   npx vercel
   ```

### Supabase Integration Setup
1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Create a `leads` table with columns matching `LeadFormData`:
   - `full_name` (text)
   - `email` (text)
   - `phone` (text)
   - `current_country` (text)
   - `nationality` (text)
   - `preferred_language` (text)
   - `main_goal` (text)
   - `education_level` (text)
   - `work_experience` (text)
   - `approximate_budget` (text)
   - `marital_status` (text)
   - `message` (text)
   - `privacy_consent` (boolean)
   - `created_at` (timestamp)
3. Set your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
