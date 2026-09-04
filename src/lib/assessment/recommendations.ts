// DORVIA Assessment / PathFinder — recommendation content.
// Implements sections 8–9 of claude/dorvia-pathfinder-full-spec-v1-2026-09-04.md:
// per-route display metadata, the "why this path" / "needs review" factor
// lists, and the per-route WhatsApp message template. Kept separate from
// scoring.ts (pure numbers) so the *text* shown for a route can be edited
// without touching the scoring formulas, per spec section 14.

import { AssessmentAnswers, Bilingual, RouteId } from './types';

export const ROUTE_META: Record<RouteId, { icon: string; title: Bilingual; href: string }> = {
  study: { icon: '🎓', title: { fa: 'تحصیل در رومانی', en: 'Study in Romania' }, href: '/study' },
  work: { icon: '💼', title: { fa: 'کار در رومانی', en: 'Work in Romania' }, href: '/work' },
  business: { icon: '🏢', title: { fa: 'کسب‌وکار در رومانی', en: 'Business in Romania' }, href: '/company' },
  family: { icon: '👨‍👩‍👧', title: { fa: 'پیوست خانواده', en: 'Family Reunification' }, href: '/immigration/family-reunification' },
  relocation: { icon: '🏠', title: { fa: 'جابه‌جایی و استقرار', en: 'Relocation & Living' }, href: '/needs' },
};

const MATCH_LABEL: Record<'strong' | 'good' | 'review' | 'low', { icon: string; label: Bilingual; text: Bilingual }> = {
  strong: {
    icon: '🟢',
    label: { fa: 'تطابق اولیه قوی', en: 'Strong Match' },
    text: {
      fa: 'اطلاعات اولیه شما با این مسیر تطابق خوبی دارد.',
      en: 'Based on the information you provided, this appears to be your strongest initial pathway to explore.',
    },
  },
  good: {
    icon: '🟡',
    label: { fa: 'پتانسیل خوب', en: 'Good Potential' },
    text: {
      fa: 'این مسیر ارزش بررسی دارد، اما چند عامل مهم باید دقیق‌تر بررسی شود.',
      en: 'This path is worth exploring, though a few important factors need closer review.',
    },
  },
  review: {
    icon: '🟠',
    label: { fa: 'نیاز به بررسی بیشتر', en: 'Needs Review' },
    text: {
      fa: 'اطلاعات فعلی برای توصیه قطعی کافی نیست و چند مورد مهم نیاز به بررسی دارد.',
      en: 'The current information is not enough for a firm recommendation — a few important points need review.',
    },
  },
  low: {
    icon: '🔴',
    label: { fa: 'تطابق اولیه پایین', en: 'Low Initial Match' },
    text: {
      fa: 'بر اساس اطلاعات فعلی، این مسیر در اولویت پایین‌تری قرار می‌گیرد. مسیرهای دیگر ممکن است مناسب‌تر باشند.',
      en: 'Based on current information, this path is a lower priority right now — another route may fit better.',
    },
  },
};

export function matchMeta(level: 'strong' | 'good' | 'review' | 'low') {
  return MATCH_LABEL[level];
}

// "Why this path" factors — mirrors the positive-scoring conditions in
// scoring.ts for the given route, in plain language. Capped at 4 per spec
// section 32 ("حداکثر ۴ مورد").
export function whyThisPath(route: RouteId, answers: AssessmentAnswers): Bilingual[] {
  const out: Bilingual[] = [];
  const push = (fa: string, en: string) => out.push({ fa, en });

  if (route === 'study') {
    if (answers['primary_goal'] === 'study' || (Array.isArray(answers['secondary_goal']) && (answers['secondary_goal'] as string[]).includes('study'))) push('هدف تحصیلی مشخص دارید', 'You have a clear academic goal');
    if (['bachelor', 'master', 'phd', 'associate'].includes(String(answers['education_level'] || ''))) push('سطح تحصیلات شما با مسیر انتخابی هماهنگ است', 'Your education level fits this path');
    if (answers['language_certificate'] === 'yes') push('مدرک زبان دارید', 'You already hold a language certificate');
    if (answers['study_budget_annual'] && answers['study_budget_annual'] !== 'unknown') push('بودجه تحصیلی اعلام‌شده قابل بررسی است', 'Your stated study budget is workable');
  }
  if (route === 'work') {
    if (answers['job_offer'] === 'yes') push('پیشنهاد شغلی (Job Offer) دارید', 'You already have a job offer');
    if (['3_5', '6_10', '10_plus'].includes(String(answers['work_experience'] || ''))) push('سابقه کاری قابل‌توجهی دارید', 'You have relevant work experience');
    if (answers['work_field']) push('حوزه کاری شما مشخص است', 'Your professional field is well defined');
  }
  if (route === 'business') {
    if (['50000_100000', '100000_plus'].includes(String(answers['business_capital'] || ''))) push('سرمایه اعلام‌شده برای ثبت شرکت/اقامت مناسب است', 'Your stated capital fits a business-based path');
    if (answers['has_existing_business'] === 'yes') push('در حال حاضر کسب‌وکار فعال دارید', 'You already run an active business');
    if (answers['business_goal'] && answers['business_goal'] !== 'not_sure') push('هدف کسب‌وکاری شما مشخص است', 'Your business goal is clearly defined');
  }
  if (route === 'family') {
    if (answers['family_member_in_romania'] && answers['family_member_in_romania'] !== 'nobody') push('عضوی از خانواده شما در رومانی اقامت دارد', 'You have a family member residing in Romania');
    if (answers['relationship_documents_ready'] === 'yes') push('مدارک رابطه خانوادگی شما آماده است', 'Your relationship documents are ready');
  }
  if (route === 'relocation') {
    if (answers['current_location'] === 'romania') push('در حال حاضر در رومانی هستید', 'You are already in Romania');
    if (answers['relocation_timeline'] && answers['relocation_timeline'] !== 'not_sure') push('زمان‌بندی جابه‌جایی شما مشخص است', 'Your relocation timeline is defined');
  }
  if (answers['timeline'] === 'this_month' || answers['timeline'] === '1_3_months' || answers['timeline'] === '3_6_months') {
    push('زمان‌بندی مشخصی برای اقدام دارید', 'You have a defined timeline to act');
  }
  if (answers['documents_readiness'] === 'mostly_ready') {
    push('بیشتر مدارک شما آماده است', 'Most of your documents are ready');
  }
  return out.slice(0, 4);
}

// "Needs review" — items the assessment could not confirm are handled,
// capped at 4 per spec section 33.
export function needsReview(route: RouteId, answers: AssessmentAnswers): Bilingual[] {
  const out: Bilingual[] = [];
  const push = (fa: string, en: string) => out.push({ fa, en });

  if (route === 'study') {
    if (answers['language_certificate'] !== 'yes') push('مدرک و سطح زبان', 'Language certificate / level');
    push('انتخاب دانشگاه و رشته نهایی', 'Final university & program selection');
    if (answers['documents_readiness'] !== 'mostly_ready') push('بررسی دقیق مدارک', 'Detailed document review');
  }
  if (route === 'work') {
    if (answers['job_offer'] !== 'yes') push('یافتن کارفرما یا Job Offer', 'Finding an employer / job offer');
    push('نوع دقیق مجوز کار و اقامت', 'Exact work-permit / residence category');
  }
  if (route === 'business') {
    push('انتخاب ساختار حقوقی شرکت', 'Legal structure selection');
    if (answers['has_existing_business'] !== 'yes') push('طرح کسب‌وکار دقیق‌تر', 'A more detailed business plan');
  }
  if (route === 'family') {
    if (answers['relationship_documents_ready'] !== 'yes') push('تکمیل مدارک رابطه خانوادگی', 'Completing relationship documents');
    if (answers['family_member_status'] === 'unknown' || !answers['family_member_status']) push('وضعیت اقامتی دقیق فرد در رومانی', "Exact residence status of the family member");
  }
  if (route === 'relocation') {
    push('برنامه‌ریزی مسکن و بانک', 'Housing & banking arrangements');
  }
  if (answers['documents_readiness'] === 'not_started' || answers['documents_readiness'] === 'dont_know') {
    push('شناسایی مدارک مورد نیاز', 'Identifying the documents you will need');
  }
  // de-dupe by fa text and cap at 4
  const seen = new Set<string>();
  const unique = out.filter((x) => (seen.has(x.fa) ? false : (seen.add(x.fa), true)));
  return unique.slice(0, 4);
}

export function whatsappMessage(route: RouteId, lang: 'fa' | 'en'): string {
  const title = ROUTE_META[route].title[lang];
  if (lang === 'fa') {
    return `سلام، من ارزیابی DORVIA را تکمیل کردم. مسیر پیشنهادی اولیه من ${title} است و مایلم شرایط خودم را بیشتر بررسی کنم.`;
  }
  return `Hello, I completed the DORVIA Assessment. My recommended primary path is ${title} and I'd like to discuss my situation further.`;
}

export const WHATSAPP_NUMBER = '40727348009';

export function whatsappLink(route: RouteId, lang: 'fa' | 'en'): string {
  const text = encodeURIComponent(whatsappMessage(route, lang));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
