import { RomanianCategory, RomanianCategoryMeta } from './types';

export const ROMANIAN_CATEGORIES: Record<RomanianCategory, RomanianCategoryMeta> = {
  everyday: {
    slug: 'everyday',
    titleFa: 'مکالمات روزمره',
    titleEn: 'Everyday Life',
    descriptionFa: 'عبارت‌های پرکاربرد برای تعاملات روزمره و احوالپرسی در رومانی.',
    descriptionEn: 'Essential phrases for daily interactions and greetings in Romania.',
    order: 1,
  },
  transport: {
    slug: 'transport',
    titleFa: 'حمل‌ونقل و سفر',
    titleEn: 'Transport & Travel',
    descriptionFa: 'عبارت‌های کاربردی برای استفاده از حمل‌ونقل عمومی و جابه‌جایی در رومانی.',
    descriptionEn: 'Useful phrases for navigating public transport and getting around in Romania.',
    order: 2,
  },
  shopping: {
    slug: 'shopping',
    titleFa: 'خرید و فروشگاه',
    titleEn: 'Shopping & Stores',
    descriptionFa: 'جمله‌های متداول برای خرید، پرداخت و سوال درباره قیمت در فروشگاه‌ها.',
    descriptionEn: 'Common expressions for shopping, making payments, and asking prices in stores.',
    order: 3,
  },
  housing: {
    slug: 'housing',
    titleFa: 'مسکن و اقامتگاه',
    titleEn: 'Housing & Accommodation',
    descriptionFa: 'اصطلاحات پایه برای پرس‌وجو و هماهنگی درباره مسکن و محل سکونت.',
    descriptionEn: 'Basic phrases for inquiries and communication regarding accommodation.',
    order: 4,
  },
  banking: {
    slug: 'banking',
    titleFa: 'بانک و امور مالی',
    titleEn: 'Banking & Finance',
    descriptionFa: 'عبارت‌های رسمی برای مراجعه به شعب بانک و امور حساب در رومانی.',
    descriptionEn: 'Formal phrases for visits to bank branches and account matters in Romania.',
    order: 5,
  },
  healthcare: {
    slug: 'healthcare',
    titleFa: 'بهداشت و درمان',
    titleEn: 'Healthcare & Medical',
    descriptionFa: 'جملات کلیدی برای نوبت‌دهی، مراجعه به درمانگاه و داروخانه در رومانی.',
    descriptionEn: 'Key phrases for scheduling appointments, clinic visits, and pharmacies.',
    order: 6,
  },
  school: {
    slug: 'school',
    titleFa: 'مدارس و آموزش کودکان',
    titleEn: 'School & Child Education',
    descriptionFa: 'عبارت‌های مورد نیاز برای ارتباط اولیا با کادر مدارس و ثبت‌نام دانش‌آموزان.',
    descriptionEn: 'Phrases needed for parent communication with school staff and enrollment.',
    order: 7,
  },
  university: {
    slug: 'university',
    titleFa: 'دانشگاه و آموزش عالی',
    titleEn: 'University & Higher Ed',
    descriptionFa: 'واژه‌ها و جملات مناسب برای ارتباطات دانشگاهی و امور دانشجویی.',
    descriptionEn: 'Phrases and expressions for university communications and student affairs.',
    order: 8,
  },
  work: {
    slug: 'work',
    titleFa: 'محیط کار و اشتغال',
    titleEn: 'Workplace & Employment',
    descriptionFa: 'اصطلاحات کاربردی برای ارتباط حرفه‌ای و حضور در محیط‌های کاری رومانی.',
    descriptionEn: 'Practical terminology for professional communication in Romanian workplaces.',
    order: 9,
  },
  business: {
    slug: 'business',
    titleFa: 'کسب‌وکار و جلسات',
    titleEn: 'Business & Meetings',
    descriptionFa: 'جملات رسمی برای مکاتبات تجاری، قرارهای اداری و جلسات کاری.',
    descriptionEn: 'Formal phrases for commercial correspondence, appointments, and business meetings.',
    order: 10,
  },
  administration: {
    slug: 'administration',
    titleFa: 'امور اداری و مدارک',
    titleEn: 'Administration & Documents',
    descriptionFa: 'عبارت‌های رسمی برای مراجعه به ادارات دولتی، تحویل اسناد و نوبت‌های اداری.',
    descriptionEn: 'Formal expressions for visiting administrative offices and submitting documents.',
    order: 11,
  },
  emergency: {
    slug: 'emergency',
    titleFa: 'شرایط اضطراری',
    titleEn: 'Emergency & Urgent Help',
    descriptionFa: 'جملات ضروری و فوری برای درخواست کمک در شرایط بحرانی و فوریت‌ها.',
    descriptionEn: 'Crucial and direct expressions for requesting assistance in urgent situations.',
    order: 12,
  },
  social: {
    slug: 'social',
    titleFa: 'روابط اجتماعی و فرهنگ',
    titleEn: 'Social & Cultural Life',
    descriptionFa: 'عبارت‌های رایج برای آشنایی با دیگران، گپ‌وگفت و رویدادهای اجتماعی.',
    descriptionEn: 'Common phrases for meeting people, casual conversation, and social events.',
    order: 13,
  },
};

export const ORDERED_CATEGORIES: RomanianCategoryMeta[] = Object.values(ROMANIAN_CATEGORIES).sort(
  (a, b) => a.order - b.order
);

export function getCategoryBySlug(slug: string): RomanianCategoryMeta | undefined {
  return (ROMANIAN_CATEGORIES as Record<string, RomanianCategoryMeta>)[slug];
}

export function isValidCategory(slug: string): slug is RomanianCategory {
  return slug in ROMANIAN_CATEGORIES;
}
