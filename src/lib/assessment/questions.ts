// DORVIA Assessment / PathFinder — question set (Phase 1 MVP).
// Implements section 3 of claude/dorvia-pathfinder-full-spec-v1-2026-09-04.md.
// Data-driven on purpose (per spec section 14): the UI just renders whatever
// this list + showIf produce, and scoring.ts is the only place that reads
// answer values — so the question wording/order can change without touching
// either.

import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'primary_goal',
    type: 'single',
    required: true,
    title: {
      fa: 'هدف اصلی شما از ورود یا زندگی در رومانی چیست؟',
      en: 'What is your main goal for Romania?',
    },
    options: [
      { value: 'study', icon: '🎓', label: { fa: 'تحصیل', en: 'Study' } },
      { value: 'work', icon: '💼', label: { fa: 'کار', en: 'Work' } },
      { value: 'business', icon: '🏢', label: { fa: 'کسب‌وکار / سرمایه‌گذاری', en: 'Business / Investment' } },
      { value: 'family', icon: '👨‍👩‍👧', label: { fa: 'خانواده', en: 'Family' } },
      { value: 'relocation', icon: '🏠', label: { fa: 'جابه‌جایی و زندگی در رومانی', en: 'Relocation & Living' } },
      { value: 'long_term', icon: '🇷🇴', label: { fa: 'اقامت بلندمدت / شهروندی', en: 'Long-term Residence / Citizenship' } },
      { value: 'unsure', icon: '❓', label: { fa: 'هنوز مطمئن نیستم', en: 'Not sure yet' } },
    ],
  },
  {
    id: 'secondary_goal',
    type: 'multi',
    maxSelections: 2,
    title: {
      fa: 'آیا مسیر دیگری هم برای شما مهم است؟ (حداکثر ۲ گزینه)',
      en: 'Is another path important to you too? (max 2)',
    },
    options: [
      { value: 'study', icon: '🎓', label: { fa: 'تحصیل', en: 'Study' } },
      { value: 'work', icon: '💼', label: { fa: 'کار', en: 'Work' } },
      { value: 'business', icon: '🏢', label: { fa: 'کسب‌وکار', en: 'Business' } },
      { value: 'family', icon: '👨‍👩‍👧', label: { fa: 'خانواده', en: 'Family' } },
      { value: 'relocation', icon: '🏠', label: { fa: 'زندگی در رومانی', en: 'Living in Romania' } },
      { value: 'none', icon: '—', label: { fa: 'مورد دیگری ندارم', en: 'None' } },
    ],
  },
  {
    id: 'current_location',
    type: 'single',
    required: true,
    title: { fa: 'در حال حاضر کجا زندگی می‌کنید؟', en: 'Where do you currently live?' },
    options: [
      { value: 'iran', icon: '🇮🇷', label: { fa: 'ایران', en: 'Iran' } },
      { value: 'romania', icon: '🇷🇴', label: { fa: 'رومانی', en: 'Romania' } },
      { value: 'other_eu', icon: '🇪🇺', label: { fa: 'یک کشور دیگر اتحادیه اروپا', en: 'Another EU country' } },
      { value: 'outside_eu', icon: '🌍', label: { fa: 'خارج از اتحادیه اروپا', en: 'Outside the EU' } },
    ],
  },
  {
    id: 'age_range',
    type: 'single',
    required: true,
    title: { fa: 'سن شما در چه بازه‌ای است؟', en: 'What is your age range?' },
    options: [
      { value: 'under_18', label: { fa: 'زیر ۱۸', en: 'Under 18' } },
      { value: '18_24', label: { fa: '۱۸–۲۴', en: '18–24' } },
      { value: '25_34', label: { fa: '۲۵–۳۴', en: '25–34' } },
      { value: '35_44', label: { fa: '۳۵–۴۴', en: '35–44' } },
      { value: '45_54', label: { fa: '۴۵–۵۴', en: '45–54' } },
      { value: '55_plus', label: { fa: '۵۵ به بالا', en: '55+' } },
    ],
  },
  {
    id: 'family_status',
    type: 'single',
    required: true,
    title: { fa: 'وضعیت خانوادگی شما چیست؟', en: 'What is your family status?' },
    options: [
      { value: 'single', label: { fa: 'مجرد', en: 'Single' } },
      { value: 'married', label: { fa: 'متأهل', en: 'Married' } },
      { value: 'married_children', label: { fa: 'متأهل با فرزند', en: 'Married with children' } },
      { value: 'other', label: { fa: 'سایر', en: 'Other' } },
    ],
  },
  {
    id: 'family_relocating',
    type: 'single',
    showIf: { any: [{ question: 'family_status', equals: 'married' }, { question: 'family_status', equals: 'married_children' }] },
    title: { fa: 'آیا خانواده شما نیز قصد جابه‌جایی به رومانی دارند؟', en: 'Does your family plan to relocate to Romania too?' },
    options: [
      { value: 'yes', label: { fa: 'بله', en: 'Yes' } },
      { value: 'no', label: { fa: 'خیر', en: 'No' } },
      { value: 'not_sure', label: { fa: 'هنوز مشخص نیست', en: 'Not sure yet' } },
    ],
  },
  {
    id: 'education_level',
    type: 'single',
    required: true,
    title: { fa: 'بالاترین مدرک تحصیلی شما چیست؟', en: 'What is your highest level of education?' },
    options: [
      { value: 'high_school', label: { fa: 'دیپلم / دبیرستان', en: 'High school' } },
      { value: 'associate', label: { fa: 'کاردانی', en: 'Associate degree' } },
      { value: 'bachelor', label: { fa: 'کارشناسی', en: "Bachelor's degree" } },
      { value: 'master', label: { fa: 'کارشناسی ارشد', en: "Master's degree" } },
      { value: 'phd', label: { fa: 'دکترا', en: 'PhD' } },
      { value: 'other', label: { fa: 'سایر', en: 'Other' } },
    ],
  },

  // ---- Study branch ----
  {
    id: 'study_level',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'study' }, { question: 'secondary_goal', contains: 'study' }] },
    title: { fa: 'برای چه مقطعی قصد تحصیل دارید؟', en: 'What level do you want to study at?' },
    options: [
      { value: 'foundation', label: { fa: 'سال تحصیلی مقدماتی (Foundation)', en: 'Foundation year' } },
      { value: 'bachelor', label: { fa: 'کارشناسی', en: "Bachelor's" } },
      { value: 'master', label: { fa: 'کارشناسی ارشد', en: "Master's" } },
      { value: 'phd', label: { fa: 'دکترا', en: 'PhD' } },
      { value: 'medicine', label: { fa: 'پزشکی', en: 'Medicine' } },
      { value: 'dentistry', label: { fa: 'دندانپزشکی', en: 'Dentistry' } },
      { value: 'pharmacy', label: { fa: 'داروسازی', en: 'Pharmacy' } },
      { value: 'other', label: { fa: 'سایر', en: 'Other' } },
    ],
  },
  {
    id: 'study_language',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'study' }, { question: 'secondary_goal', contains: 'study' }] },
    title: { fa: 'زبان موردنظر برای تحصیل؟', en: 'Preferred language of study?' },
    options: [
      { value: 'english', label: { fa: 'انگلیسی', en: 'English' } },
      { value: 'romanian', label: { fa: 'رومانیایی', en: 'Romanian' } },
      { value: 'french', label: { fa: 'فرانسوی', en: 'French' } },
      { value: 'no_preference', label: { fa: 'مهم نیست', en: 'No preference' } },
    ],
  },
  {
    id: 'language_certificate',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'study' }, { question: 'secondary_goal', contains: 'study' }] },
    title: { fa: 'آیا مدرک زبان دارید؟', en: 'Do you have a language certificate?' },
    options: [
      { value: 'yes', label: { fa: 'بله', en: 'Yes' } },
      { value: 'in_progress', label: { fa: 'در حال آماده‌سازی', en: 'In progress' } },
      { value: 'no', label: { fa: 'خیر', en: 'No' } },
    ],
  },
  {
    id: 'study_budget_annual',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'study' }, { question: 'secondary_goal', contains: 'study' }] },
    title: { fa: 'بودجه تقریبی سالانه تحصیل؟ (یورو)', en: 'Approximate annual study budget? (EUR)' },
    options: [
      { value: 'under_5000', label: { fa: 'کمتر از ۵٬۰۰۰€', en: 'Under €5,000' } },
      { value: '5000_10000', label: { fa: '۵٬۰۰۰–۱۰٬۰۰۰€', en: '€5,000–10,000' } },
      { value: '10000_20000', label: { fa: '۱۰٬۰۰۰–۲۰٬۰۰۰€', en: '€10,000–20,000' } },
      { value: '20000_30000', label: { fa: '۲۰٬۰۰۰–۳۰٬۰۰۰€', en: '€20,000–30,000' } },
      { value: '30000_plus', label: { fa: 'بالای ۳۰٬۰۰۰€', en: 'Over €30,000' } },
      { value: 'unknown', label: { fa: 'نمی‌دانم', en: "Don't know yet" } },
    ],
  },

  // ---- Work branch ----
  {
    id: 'work_field',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'work' }, { question: 'secondary_goal', contains: 'work' }] },
    title: { fa: 'حوزه کاری شما چیست؟', en: 'What is your professional field?' },
    options: [
      { value: 'it', label: { fa: 'فناوری اطلاعات (IT)', en: 'IT' } },
      { value: 'engineering', label: { fa: 'مهندسی', en: 'Engineering' } },
      { value: 'healthcare', label: { fa: 'درمان / پزشکی', en: 'Healthcare' } },
      { value: 'pharmacy', label: { fa: 'داروسازی', en: 'Pharmacy' } },
      { value: 'finance', label: { fa: 'مالی', en: 'Finance' } },
      { value: 'marketing', label: { fa: 'بازاریابی', en: 'Marketing' } },
      { value: 'sales', label: { fa: 'فروش', en: 'Sales' } },
      { value: 'construction', label: { fa: 'ساخت‌وساز', en: 'Construction' } },
      { value: 'hospitality', label: { fa: 'هتلداری و گردشگری', en: 'Hospitality' } },
      { value: 'other', label: { fa: 'سایر', en: 'Other' } },
    ],
  },
  {
    id: 'work_experience',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'work' }, { question: 'secondary_goal', contains: 'work' }] },
    title: { fa: 'چند سال سابقه کار دارید؟', en: 'Years of work experience?' },
    options: [
      { value: 'none', label: { fa: 'بدون سابقه', en: 'None' } },
      { value: '1_2', label: { fa: '۱–۲ سال', en: '1–2 years' } },
      { value: '3_5', label: { fa: '۳–۵ سال', en: '3–5 years' } },
      { value: '6_10', label: { fa: '۶–۱۰ سال', en: '6–10 years' } },
      { value: '10_plus', label: { fa: 'بیش از ۱۰ سال', en: '10+ years' } },
    ],
  },
  {
    id: 'job_offer',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'work' }, { question: 'secondary_goal', contains: 'work' }] },
    title: { fa: 'آیا در حال حاضر پیشنهاد شغلی (Job Offer) دارید؟', en: 'Do you currently have a job offer?' },
    options: [
      { value: 'yes', icon: '🟢', label: { fa: 'بله', en: 'Yes' } },
      { value: 'in_negotiation', icon: '🟡', label: { fa: 'در حال مذاکره', en: 'In negotiation' } },
      { value: 'no', icon: '🔴', label: { fa: 'خیر', en: 'No' } },
    ],
  },
  {
    id: 'employer_in_romania',
    type: 'single',
    showIf: { all: [{ question: 'job_offer', equals: 'yes' }] },
    title: { fa: 'آیا کارفرمای شما در رومانی است؟', en: 'Is your employer based in Romania?' },
    options: [
      { value: 'yes', label: { fa: 'بله', en: 'Yes' } },
      { value: 'no', label: { fa: 'خیر', en: 'No' } },
      { value: 'not_sure', label: { fa: 'مطمئن نیستم', en: 'Not sure' } },
    ],
  },

  // ---- Business branch ----
  {
    id: 'business_goal',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'business' }, { question: 'secondary_goal', contains: 'business' }] },
    title: { fa: 'هدف شما از کسب‌وکار در رومانی چیست؟', en: 'What is your business goal in Romania?' },
    options: [
      { value: 'new_company', label: { fa: 'ثبت شرکت جدید', en: 'Register a new company' } },
      { value: 'existing_business', label: { fa: 'انتقال کسب‌وکار فعلی', en: 'Relocate an existing business' } },
      { value: 'investment', label: { fa: 'سرمایه‌گذاری', en: 'Investment' } },
      { value: 'expand_business', label: { fa: 'توسعه کسب‌وکار موجود', en: 'Expand an existing business' } },
      { value: 'freelance', label: { fa: 'فعالیت فریلنسری', en: 'Freelance activity' } },
      { value: 'not_sure', label: { fa: 'هنوز تصمیم نگرفته‌ام', en: 'Not decided yet' } },
    ],
  },
  {
    id: 'business_capital',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'business' }, { question: 'secondary_goal', contains: 'business' }] },
    title: { fa: 'سرمایه تقریبی که برای کسب‌وکار در نظر گرفته‌اید؟', en: 'Approximate capital planned for the business?' },
    options: [
      { value: 'under_10000', label: { fa: 'کمتر از ۱۰٬۰۰۰€', en: 'Under €10,000' } },
      { value: '10000_25000', label: { fa: '۱۰٬۰۰۰–۲۵٬۰۰۰€', en: '€10,000–25,000' } },
      { value: '25000_50000', label: { fa: '۲۵٬۰۰۰–۵۰٬۰۰۰€', en: '€25,000–50,000' } },
      { value: '50000_100000', label: { fa: '۵۰٬۰۰۰–۱۰۰٬۰۰۰€', en: '€50,000–100,000' } },
      { value: '100000_plus', label: { fa: 'بالای ۱۰۰٬۰۰۰€', en: 'Over €100,000' } },
    ],
  },
  {
    id: 'has_existing_business',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'business' }, { question: 'secondary_goal', contains: 'business' }] },
    title: { fa: 'آیا در حال حاضر کسب‌وکار فعال دارید؟', en: 'Do you currently run an active business?' },
    options: [
      { value: 'yes', label: { fa: 'بله', en: 'Yes' } },
      { value: 'planning', label: { fa: 'در حال برنامه‌ریزی هستم', en: 'Planning one' } },
      { value: 'no', label: { fa: 'خیر', en: 'No' } },
    ],
  },

  // ---- Family branch ----
  {
    id: 'family_member_in_romania',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'family' }, { question: 'secondary_goal', contains: 'family' }] },
    title: { fa: 'چه کسی از خانواده شما در رومانی اقامت دارد؟', en: 'Which family member resides in Romania?' },
    options: [
      { value: 'spouse', label: { fa: 'همسر', en: 'Spouse' } },
      { value: 'parent', label: { fa: 'والدین', en: 'Parent' } },
      { value: 'child', label: { fa: 'فرزند', en: 'Child' } },
      { value: 'other', label: { fa: 'سایر', en: 'Other' } },
      { value: 'nobody', label: { fa: 'هنوز کسی نیست', en: 'Nobody yet' } },
    ],
  },
  {
    id: 'family_member_status',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'family' }, { question: 'secondary_goal', contains: 'family' }] },
    title: { fa: 'وضعیت اقامت آن فرد در رومانی چیست؟', en: "What is that family member's residence status in Romania?" },
    options: [
      { value: 'temporary_residence', label: { fa: 'اقامت موقت', en: 'Temporary residence' } },
      { value: 'long_term_residence', label: { fa: 'اقامت بلندمدت', en: 'Long-term residence' } },
      { value: 'romanian_citizenship', label: { fa: 'تابعیت رومانی', en: 'Romanian citizenship' } },
      { value: 'eu_status', label: { fa: 'شهروند اتحادیه اروپا', en: 'EU citizen' } },
      { value: 'unknown', label: { fa: 'نمی‌دانم', en: "Don't know" } },
    ],
  },
  {
    id: 'relationship_documents_ready',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'family' }, { question: 'secondary_goal', contains: 'family' }] },
    title: { fa: 'آیا مدارک رابطه خانوادگی شما آماده است؟', en: 'Are your family-relationship documents ready?' },
    options: [
      { value: 'yes', label: { fa: 'بله', en: 'Yes' } },
      { value: 'partially', label: { fa: 'بخشی آماده است', en: 'Partially' } },
      { value: 'no', label: { fa: 'خیر', en: 'No' } },
      { value: 'not_sure', label: { fa: 'مطمئن نیستم', en: 'Not sure' } },
    ],
  },

  // ---- Relocation branch ----
  {
    id: 'relocation_timeline',
    type: 'single',
    showIf: { any: [{ question: 'primary_goal', equals: 'relocation' }, { question: 'secondary_goal', contains: 'relocation' }] },
    title: { fa: 'چه زمانی قصد جابه‌جایی به رومانی را دارید؟', en: 'When do you plan to relocate to Romania?' },
    options: [
      { value: 'under_3_months', label: { fa: 'کمتر از ۳ ماه', en: 'Under 3 months' } },
      { value: '3_6_months', label: { fa: '۳–۶ ماه', en: '3–6 months' } },
      { value: '6_12_months', label: { fa: '۶–۱۲ ماه', en: '6–12 months' } },
      { value: 'over_12_months', label: { fa: 'بیش از یک سال', en: 'Over a year' } },
      { value: 'not_sure', label: { fa: 'هنوز تصمیم نگرفته‌ام', en: 'Not decided yet' } },
    ],
  },

  // ---- Shared questions (all routes) ----
  {
    id: 'total_budget',
    type: 'single',
    required: true,
    title: { fa: 'بودجه‌ای که برای شروع مسیر رومانی در نظر گرفته‌اید؟', en: 'Budget you have set aside to start your Romania path?' },
    options: [
      { value: 'under_5000', label: { fa: 'کمتر از ۵٬۰۰۰€', en: 'Under €5,000' } },
      { value: '5000_10000', label: { fa: '۵٬۰۰۰–۱۰٬۰۰۰€', en: '€5,000–10,000' } },
      { value: '10000_25000', label: { fa: '۱۰٬۰۰۰–۲۵٬۰۰۰€', en: '€10,000–25,000' } },
      { value: '25000_50000', label: { fa: '۲۵٬۰۰۰–۵۰٬۰۰۰€', en: '€25,000–50,000' } },
      { value: '50000_100000', label: { fa: '۵۰٬۰۰۰–۱۰۰٬۰۰۰€', en: '€50,000–100,000' } },
      { value: '100000_plus', label: { fa: 'بالای ۱۰۰٬۰۰۰€', en: 'Over €100,000' } },
      { value: 'prefer_not_to_say', label: { fa: 'ترجیح می‌دهم نگویم', en: 'Prefer not to say' } },
    ],
  },
  {
    id: 'timeline',
    type: 'single',
    required: true,
    title: { fa: 'چه زمانی می‌خواهید مسیر خود را شروع کنید؟', en: 'When do you want to start your path?' },
    options: [
      { value: 'this_month', icon: '🔥', label: { fa: 'همین ماه', en: 'This month' } },
      { value: '1_3_months', label: { fa: '۱–۳ ماه دیگر', en: 'In 1–3 months' } },
      { value: '3_6_months', label: { fa: '۳–۶ ماه دیگر', en: 'In 3–6 months' } },
      { value: '6_12_months', label: { fa: '۶–۱۲ ماه دیگر', en: 'In 6–12 months' } },
      { value: 'undecided', label: { fa: 'هنوز مشخص نیست', en: 'Undecided' } },
    ],
  },
  {
    id: 'documents_readiness',
    type: 'single',
    required: true,
    title: { fa: 'وضعیت آمادگی مدارک شما چگونه است؟', en: 'How ready are your documents?' },
    options: [
      { value: 'mostly_ready', label: { fa: 'بیشتر مدارک آماده است', en: 'Mostly ready' } },
      { value: 'partially_ready', label: { fa: 'بخشی آماده است', en: 'Partially ready' } },
      { value: 'not_started', label: { fa: 'هنوز شروع نکرده‌ام', en: 'Not started yet' } },
      { value: 'dont_know', label: { fa: 'نمی‌دانم چه مدارکی لازم است', en: "Don't know what's needed" } },
    ],
  },
  {
    id: 'lead_source',
    type: 'single',
    title: { fa: 'چگونه با DORVIA آشنا شدید؟', en: 'How did you hear about DORVIA?' },
    options: [
      { value: 'google', label: { fa: 'گوگل', en: 'Google' } },
      { value: 'instagram', label: { fa: 'اینستاگرام', en: 'Instagram' } },
      { value: 'telegram', label: { fa: 'تلگرام', en: 'Telegram' } },
      { value: 'youtube', label: { fa: 'یوتیوب', en: 'YouTube' } },
      { value: 'friend', label: { fa: 'دوستان و آشنایان', en: 'Friend / family' } },
      { value: 'referral', label: { fa: 'معرفی شخص دیگر', en: 'Referral' } },
      { value: 'other', label: { fa: 'سایر', en: 'Other' } },
    ],
  },
];

export function getVisibleQuestions(answers: import('./types').AssessmentAnswers): Question[] {
  return QUESTIONS.filter((q) => isQuestionVisible(q, answers));
}

export function isQuestionVisible(q: Question, answers: import('./types').AssessmentAnswers): boolean {
  if (!q.showIf) return true;
  const evalRule = (rule: import('./types').ConditionRule): boolean => {
    const val = answers[rule.question];
    if ('equals' in rule) return val === rule.equals;
    if ('contains' in rule) return Array.isArray(val) && val.includes(rule.contains);
    return false;
  };
  if (q.showIf.all) return q.showIf.all.every(evalRule);
  if (q.showIf.any) return q.showIf.any.some(evalRule);
  return true;
}
