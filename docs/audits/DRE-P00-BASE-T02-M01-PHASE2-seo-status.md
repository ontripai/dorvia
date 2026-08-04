# SEO Status Report (DRE-P00-BASE-T02-M01-PHASE2)

This report details the metadata configurations, canonical links, H1 distribution, and indexation treatments applied to all public paths on the portal as part of Phase 2.

## 1. List of Pages with New Custom Metadata

The following routes have been configured with unique title tags, meta descriptions, canonical URLs, and OpenGraph headers via layout components. All canonical paths are relative to the dynamic `${SITE_URL}` base variable:

| Route Path | Farsi Title (og:title) | Meta Description (og:description) | Canonical URL |
| :--- | :--- | :--- | :--- |
| `/` | دوریا اروپا \| DORVIA EUROP - مرجع مهاجرت... | اپلیکیشن جامع برای ارزیابی و مشاوره رایگان... | `${SITE_URL}/` |
| `/about` | درباره ما \| در رومانی – DORVIA EUROP | درباره پلتفرم در رومانی (DORVIA EUROP)... | `${SITE_URL}/about` |
| `/contact` | ارتباط با ما \| در رومانی – DORVIA EUROP | ارتباط با کارشناسان DORVIA EUROP جهت مشاوره... | `${SITE_URL}/contact` |
| `/immigration` | مهاجرت و اقامت رومانی \| در رومانی – DORVIA EUROP | راهنمای جامع روش‌های قانونی مهاجرت به رومانی... | `${SITE_URL}/immigration` |
| `/immigration/residence-renewal` | تمدید اجازه اقامت رومانی \| در رومانی – DORVIA EUROP | مراحل، مدارک و قوانین تمدید اجازه اقامت موقت... | `${SITE_URL}/immigration/residence-renewal` |
| `/immigration/long-term-residence` | اقامت بلندمدت و دائم رومانی \| در رومانی – DORVIA EUROP | شرایط اخذ اقامت دائم رومانی، قانون ۵ سال حضور مستمر... | `${SITE_URL}/immigration/long-term-residence` |
| `/immigration/citizenship` | حقوق شهروندی و تابعیت رومانی \| در رومانی – DORVIA EUROP | راهنمای کامل دریافت پاسپورت و تابعیت رومانی... | `${SITE_URL}/immigration/citizenship` |
| `/immigration/family-reunification` | پیوند با خانواده در رومانی \| در رومانی – DORVIA EUROP | قوانین و مراحل الحاق به خانواده در رومانی... | `${SITE_URL}/immigration/family-reunification` |
| `/study` | تحصیل در رومانی \| در رومانی – DORVIA EUROP | تحصیل در دانشگاه‌های معتبر رومانی به زبان انگلیسی... | `${SITE_URL}/study` |
| `/study/preparatory-year` | دوره سال زبان رومانیایی \| در رومانی – DORVIA EUROP | شرایط ثبت‌نام، شهریه و اطلاعات دوره آمادگی زبان... | `${SITE_URL}/study/preparatory-year` |
| `/study/scholarships` | بورسیه تحصیلی دولت رومانی \| در رومانی – DORVIA EUROP | راهنمای ثبت‌نام در برنامه بورسیه وزارت امور خارجه... | `${SITE_URL}/study/scholarships` |
| `/universities` | دانشگاه‌های معتبر رومانی \| در رومانی – DORVIA EUROP | جستجو و بررسی دانشگاه‌های دولتی و تخصصی رومانی... | `${SITE_URL}/universities` |
| `/work` | کار و اشتغال در رومانی \| در رومانی – DORVIA EUROP | راهنمای کاریابی، اخذ مجوز کار (Aviz de Munca)... | `${SITE_URL}/work` |
| `/work/permit` | مجوز کار رومانی (Aviz de Munca) \| در رومانی – DORVIA EUROP | شرایط قانونی صدور مجوز کار برای نیروی کار خارجی... | `${SITE_URL}/work/permit` |
| `/work/visa` | ویزای کار رومانی (Type D/AM) \| در رومانی – DORVIA EUROP | مراحل دریافت ویزای بلندمدت کاری رومانی از سفارت... | `${SITE_URL}/work/visa` |
| `/work/find-job` | راهنمای کاریابی در رومانی \| در رومانی – DORVIA EUROP | معرفی سایت‌های معتبر کاریابی، نحوه نگارش رزومه... | `${SITE_URL}/work/find-job` |
| `/work/contract` | قراردادهای کاری و قانون کار رومانی \| در رومانی – DORVIA EUROP | حقوق قانونی کارگران، ثبت قرارداد در سامانه REVISAL... | `${SITE_URL}/work/contract` |
| `/work/tax` | مالیات بر درآمد حقوق در رومانی \| در رومانی – DORVIA EUROP | آشنایی با نرخ‌های مالیات حقوق، کسورات بیمه درمانی... | `${SITE_URL}/work/tax` |
| `/work/insurance` | بیمه اجتماعی و سلامت کار در رومانی \| در رومانی – DORVIA EUROP | حقوق درمانی، خدمات پزشکی تحت پوشش بیمه دولتی... | `${SITE_URL}/work/insurance` |
| `/company` | ثبت شرکت و کسب‌وکار در رومانی \| در رومانی – DORVIA EUROP | راهنمای ثبت شرکت SRL، قوانین مالیاتی شرکت‌های خرد... | `${SITE_URL}/company` |
| `/company/investment` | سرمایه‌گذاری در رومانی \| در رومانی – DORVIA EUROP | فرصت‌های سرمایه‌گذاری ملکی و استارت‌آپی در رومانی... | `${SITE_URL}/company/investment` |
| `/company/registration` | مراحل ثبت شرکت SRL در رومانی \| در رومانی – DORVIA EUROP | مراحل و پیش‌نیازهای قانونی ثبت شرکت SRL... | `${SITE_URL}/company/registration` |
| `/company/tax-types` | انواع مالیات شرکت‌ها در رومانی \| در رومانی – DORVIA EUROP | بررسی رژیم‌های مالیاتی شرکت‌های خرد و عادی... | `${SITE_URL}/company/tax-types` |
| `/company/bank-account` | افتتاح حساب بانکی شرکتی در رومانی \| در رومانی – DORVIA EUROP | مراحل و مدارک لازم جهت افتتاح حساب‌های جاری... | `${SITE_URL}/company/bank-account` |
| `/company/residency` | اقامت تجاری مدیرعامل در رومانی \| در رومانی – DORVIA EUROP | شرایط اخذ و تمدید اجازه اقامت موقت به عنوان مدیرعامل... | `${SITE_URL}/company/residency` |
| `/company/real-estate-investment` | سرمایه‌گذاری در املاک رومانی \| در رومانی – DORVIA EUROP | ضوابط خرید ملک، آپارتمان و زمین برای اتباع خارجی... | `${SITE_URL}/company/real-estate-investment` |
| `/company/startup-tech-investment` | سرمایه‌گذاری استارت‌آپی و فناوری \| در رومانی – DORVIA EUROP | فرصت‌های کارآفرینی در قطب‌های فناوری رومانی... | `${SITE_URL}/company/startup-tech-investment` |
| `/company/annual-tax-reporting` | گزارش‌های مالیاتی سالانه شرکت‌ها \| در رومانی – DORVIA EUROP | تکالیف مالیاتی سالانه و فصلی شرکت‌ها و خدمات حسابداری... | `${SITE_URL}/company/annual-tax-reporting` |
| `/needs` | نیازهای زندگی در رومانی \| در رومانی – DORVIA EUROP | راهنمای ضروری زندگی روزمره در رومانی شامل امور مالی... | `${SITE_URL}/needs` |
| `/needs/first-days-checklist` | چک‌لیست روزهای نخست ورود به رومانی \| در رومانی – DORVIA EUROP | اقدامات فوری ۷۲ ساعت، ۷ روز و ۳۰ روز اول ورود... | `${SITE_URL}/needs/first-days-checklist` |
| `/needs/currency-exchange` | صرافی و نرخ ارز در رومانی \| در رومانی – DORVIA EUROP | راهنمای تبدیل پول، نرخ‌های رسمی بانک ملی (BNR)... | `${SITE_URL}/needs/currency-exchange` |
| `/needs/housing` | اجاره و خرید مسکن در رومانی \| در رومانی – DORVIA EUROP | چک‌لیست قرارداد اجاره مسکن، ثبت در دارایی (ANAF)... | `${SITE_URL}/needs/housing` |
| `/needs/driving-license` | گواهینامه رانندگی در رومانی \| در رومانی – DORVIA EUROP | قوانین رانندگی با مجوز بین‌المللی و شرایط تبدیل... | `${SITE_URL}/needs/driving-license` |
| `/needs/certified-translation` | دارالترجمه رسمی در رومانی \| در رومانی – DORVIA EUROP | یافتن مترجمین رسمی دادگستری رومانی جهت ترجمه... | `${SITE_URL}/needs/certified-translation` |
| `/needs/notary-public` | دفتر اسناد رسمی در رومانی \| در رومانی – DORVIA EUROP | نقش دفاتر اسناد رسمی (Notar Public)، ثبت قراردادها... | `${SITE_URL}/needs/notary-public` |
| `/needs/iranian-embassy-and-mikhak` | سفارت ایران و سامانه میخک در رومانی \| در رومانی – DORVIA EUROP | راهنمای دریافت خدمات کنسولی، تایید مدارک و وکالت‌نامه... | `${SITE_URL}/needs/iranian-embassy-and-mikhak` |
| `/romania` | شناخت کشور رومانی | در رومانی – DORVIA EUROP | مقدمه‌ای بر جغرافیا، اقتصاد، جامعه، فرهنگ و قوانین... | `${SITE_URL}/romania` |
| `/romania/economy` | اقتصاد و صنایع رومانی \| در رومانی – DORVIA EUROP | تحلیل اقتصاد رومانی، بخش‌های فعال مانند خودروسازی... | `${SITE_URL}/romania/economy` |
| `/romania/society` | جامعه و زندگی اجتماعی در رومانی \| در رومانی – DORVIA EUROP | ساختار اجتماعی، زبان رسمی، آداب رفتار اجتماعی... | `${SITE_URL}/romania/society` |
| `/romania/culture-and-arts` | فرهنگ، هنر و میراث رومانی \| در رومانی – DORVIA EUROP | میراث فرهنگی غنی، قلعه‌های ترانسیلوانیا، موسیقی... | `${SITE_URL}/romania/culture-and-arts` |
| `/romania/laws-and-regulations` | قوانین و مقررات عمومی رومانی \| در رومانی – DORVIA EUROP | آشنایی با سیستم حقوقی رومانی، قوانین عمومی مدنی... | `${SITE_URL}/romania/laws-and-regulations` |
| `/romania/cities` | شهرهای اصلی کشور رومانی \| در رومانی – DORVIA EUROP | بررسی کامل شهرهای مهم جهت کار و تحصیل نظیر بخارست... | `${SITE_URL}/romania/cities` |
| `/start-here` | شروع از اینجا – راهنمای گام به گام | راهنمای تعاملی و گام به گام ورود و استقرار در کشور... | `${SITE_URL}/start-here` |
| `/start-here/planning-to-come` | برنامه‌ریزی قبل از سفر به رومانی \| در رومانی – DORVIA EUROP | مراحل آماده‌سازی مدارک تحصیلی، کاری و هویتی... | `${SITE_URL}/start-here/planning-to-come` |
| `/start-here/just-arrived` | اقدامات پس از ورود به رومانی \| در رومانی – DORVIA EUROP | اولین اقدامات در فرودگاه، تهیه سیم‌کارت محلی... | `${SITE_URL}/start-here/just-arrived` |
| `/start-here/living-here` | زندگی و استقرار بلندمدت در رومانی \| در رومانی – DORVIA EUROP | راهنمای افتتاح حساب بانکی دائمی، تمدید سالانه اقامت... | `${SITE_URL}/start-here/living-here` |
| `/start-here/pre-departure-checklist` | چک‌لیست قبل از پرواز به رومانی \| در رومانی – DORVIA EUROP | لیست لوازم ضروری، ارز مجاز مسافرتی، اسناد... | `${SITE_URL}/start-here/pre-departure-checklist` |
| `/start-here/first-three-days` | سه روز اول ورود به رومانی \| در رومانی – DORVIA EUROP | اقدامات حیاتی ۷۲ ساعت اول از ترانسفر فرودگاهی... | `${SITE_URL}/start-here/first-three-days` |
| `/start-here/first-month` | ماه اول استقرار در رومانی \| در رومانی – DORVIA EUROP | کارهای اداری ماه اول شامل ثبت قرارداد در ANAF... | `${SITE_URL}/start-here/first-month` |

---

## 2. List of noindexed Pages and Rationale

The following routes have been configured with `noindex` (`robots: { index: false, follow: true }`) to protect the domain's SEO score from duplicate or thin content:

1. **`/articles`**:
   - *Rationale*: Thin content. The page displays a feed of article excerpts and titles, but there is no sub-page to read the actual full articles.
2. **`/cities`**:
   - *Rationale*: Duplicate content & orphan page. This page is an unlinked duplicate of `/romania/cities`.
3. **`/services`**:
   - *Rationale*: Short summaries only. Displays 5 services with brief descriptions, primarily serving as entry points to the evaluation form modal.
4. **`/romania/tourism`**:
   - *Rationale*: Thin content. Contains no text details or guides, only a hero banner header.
5. **`/needs/health`**:
   - *Rationale*: Temporary placeholder page containing high-level summary only.
6. **`/needs/school`**:
   - *Rationale*: Temporary placeholder page containing high-level summary only.
7. **`/needs/telecom`**:
   - *Rationale*: Temporary placeholder page containing high-level summary only.
8. **`/legal/privacy` & `/legal/disclaimer`** (all `/legal/[slug]` routes):
   - *Rationale*: Thin text policies.

---

## 3. Decisions & Clarifications

1. **`/services` treatment**:
   - We applied `noindex` because it contains short summaries of services that are already thoroughly described in the respective category hubs (`/study`, `/work`, `/company`, etc.). 
2. **Evaluation Page**:
   - There is no standalone `/evaluation` page in the code; the case evaluation form (`LeadForm`) is rendered as a modal overlay (`isEvaluationModalOpen`) throughout the site to maximize conversion. We have given the `/contact` page (which embeds the form directly) full metadata.
3. **Final Production Domain Setup**:
   - The fabricated domain `dorvia.eu` has been completely removed to prevent incorrect canonical URL associations.
   - We now define a dynamic `SITE_URL` base path which checks `process.env.NEXT_PUBLIC_SITE_URL` (configured on hosting like Vercel) and falls back to `process.env.NEXT_PUBLIC_VERCEL_URL` or a temporary Vercel placeholder.
   - **Important**: Configuring the final production TLD (e.g. buying and mapping a domain like `.ro` or `.eu` for this platform) is a project owner decision. Once the domain is registered, it must be specified in the environment variables on Vercel as `NEXT_PUBLIC_SITE_URL` to update all canonical metadata tags automatically.
