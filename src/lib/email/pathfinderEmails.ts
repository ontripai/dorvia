import { getResendClient, getResendConfig } from './resend';
import { RouteId } from '../assessment/types';
import { ROUTE_META, whatsappLink } from '../assessment/recommendations';
import { getCanonicalOrigin } from '../metadata';

// Security assertion: Never run in browser
if (typeof window !== 'undefined') {
  throw new Error('FATAL SECURITY VIOLATION: Email modules must NEVER be imported or executed in the client bundle.');
}

export function escapeHtml(str: unknown): string {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function isValidEmail(email: unknown): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  // Standard RFC 5322 regex subset
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
    trimmed
  );
}

export interface SendPathfinderEmailsParams {
  fullName: string;
  whatsapp?: string;
  email?: string;
  telegram?: string;
  preferredLanguage?: 'fa' | 'en';
  primaryRoute: RouteId;
  secondaryRoute?: RouteId | null;
  profileScore: number;
  leadScore?: number | null;
  leadTemperature: string;
  answers: Record<string, unknown>;
  matchLevel?: Record<string, string>;
  submittedAt?: string;
}

const ROUTE_LABELS: Record<RouteId, { fa: string; en: string; icon: string }> = {
  study: { fa: 'تحصیل در رومانی', en: 'Study in Romania', icon: '🎓' },
  work: { fa: 'کار در رومانی', en: 'Work in Romania', icon: '💼' },
  business: { fa: 'کسب‌وکار / ثبت شرکت در رومانی', en: 'Business / Company in Romania', icon: '🏢' },
  family: { fa: 'پیوست خانواده در رومانی', en: 'Family Reunification in Romania', icon: '👨‍👩‍👧' },
  relocation: { fa: 'جابه‌جایی و زندگی در رومانی', en: 'Relocation & Living in Romania', icon: '🏠' },
};

const MATCH_LABELS: Record<string, { fa: string; en: string }> = {
  strong: { fa: 'تطابق اولیه قوی', en: 'Strong Initial Match' },
  good: { fa: 'ارزش بررسی اولیه', en: 'Worth Exploring' },
  review: { fa: 'نیازمند بررسی تکمیلی', en: 'Needs Review' },
  low: { fa: 'تطابق اولیه پایین', en: 'Low Initial Match' },
};

const TIMELINE_LABELS: Record<string, { fa: string; en: string }> = {
  this_month: { fa: 'همین ماه', en: 'This month' },
  '1_3_months': { fa: '۱–۳ ماه دیگر', en: 'In 1–3 months' },
  '3_6_months': { fa: '۳–۶ ماه دیگر', en: 'In 3–6 months' },
  '6_12_months': { fa: '۶–۱۲ ماه دیگر', en: 'In 6–12 months' },
  undecided: { fa: 'هنوز مشخص نیست', en: 'Undecided' },
  under_3_months: { fa: 'کمتر از ۳ ماه', en: 'Under 3 months' },
  over_12_months: { fa: 'بیش از یک سال', en: 'Over a year' },
  not_sure: { fa: 'هنوز تصمیم نگرفته‌ام', en: 'Not decided yet' },
};

const BUDGET_LABELS: Record<string, { fa: string; en: string }> = {
  under_5000: { fa: 'کمتر از ۵٬۰۰۰€', en: 'Under €5,000' },
  '5000_10000': { fa: '۵٬۰۰۰–۱۰٬۰۰۰€', en: '€5,000–10,000' },
  '10000_25000': { fa: '۱۰٬۰۰۰–۲۵٬۰۰۰€', en: '€10,000–25,000' },
  '25000_50000': { fa: '۲۵٬۰۰۰–۵۰٬۰۰۰€', en: '€25,000–50,000' },
  '5000_100000': { fa: '۵۰٬۰۰۰–۱۰۰٬۰۰۰€', en: '€50,000–100,000' },
  '50000_100000': { fa: '۵۰٬۰۰۰–۱۰۰٬۰۰۰€', en: '€50,000–100,000' },
  '100000_plus': { fa: 'بالای ۱۰۰٬۰۰۰€', en: 'Over €100,000' },
  prefer_not_to_say: { fa: 'ترجیح می‌دهم نگویم', en: 'Prefer not to say' },
};

const LOCATION_LABELS: Record<string, { fa: string; en: string }> = {
  iran: { fa: 'ایران', en: 'Iran' },
  romania: { fa: 'رومانی', en: 'Romania' },
  other_eu: { fa: 'یک کشور دیگر اتحادیه اروپا', en: 'Another EU country' },
  outside_eu: { fa: 'خارج از اتحادیه اروپا', en: 'Outside the EU' },
};

function formatLabel(val: unknown, dict: Record<string, { fa: string; en: string }>, lang: 'fa' | 'en'): string {
  if (typeof val !== 'string') return '—';
  const item = dict[val];
  if (!item) return val;
  return lang === 'fa' ? `${item.fa} (${item.en})` : `${item.en} (${item.fa})`;
}

/**
 * Builds the HTML content for internal DORVIA lead notification
 */
export function buildInternalLeadEmail(params: SendPathfinderEmailsParams): { subject: string; html: string } {
  const lang = params.preferredLanguage || 'fa';
  const primaryMeta = ROUTE_LABELS[params.primaryRoute] || { fa: params.primaryRoute, en: params.primaryRoute, icon: '🧭' };
  const secondaryMeta = params.secondaryRoute ? ROUTE_LABELS[params.secondaryRoute] : null;
  const matchLevelKey = params.matchLevel?.[params.primaryRoute] || 'review';
  const matchMeta = MATCH_LABELS[matchLevelKey] || { fa: matchLevelKey, en: matchLevelKey };

  const timelineVal = params.answers['timeline'] || params.answers['relocation_timeline'];
  const budgetVal = params.answers['total_budget'] || params.answers['study_budget_annual'] || params.answers['business_budget'];
  const locationVal = params.answers['current_location'];

  const submittedAt = params.submittedAt || new Date().toISOString();

  const subject = `New DORVIA PathFinder Lead — ${primaryMeta.en} — ${params.profileScore}/100`;

  const cleanWhatsapp = (params.whatsapp || '').replace(/[^0-9+]/g, '');
  const waUrl = cleanWhatsapp.replace('+', '');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color: #071B3D; padding: 24px 28px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">DORVIA</span>
                    <span style="display: inline-block; margin-left: 8px; font-size: 11px; font-weight: 700; color: #2F6FED; background-color: rgba(47, 111, 237, 0.15); padding: 3px 8px; border-radius: 6px; text-transform: uppercase;">PathFinder™</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 12px; font-weight: 600; color: #94a3b8;">${escapeHtml(submittedAt.slice(0, 16).replace('T', ' '))} UTC</span>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 12px; font-size: 16px; font-weight: 700; color: #f8fafc;">
                New Lead Submission: ${escapeHtml(params.fullName)}
              </div>
            </td>
          </tr>

          <!-- Key Metrics Badges -->
          <tr>
            <td style="padding: 20px 28px 12px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="width: 33%; padding: 4px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Primary Score</div>
                    <div style="font-size: 20px; font-weight: 800; color: #2F6FED; margin-top: 2px;">${params.profileScore}/100</div>
                  </td>
                  <td style="width: 33%; padding: 4px; text-align: center; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Match Level</div>
                    <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 4px;">${escapeHtml(matchMeta.en)}</div>
                  </td>
                  <td style="width: 33%; padding: 4px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Temperature</div>
                    <div style="font-size: 13px; font-weight: 700; color: ${params.leadTemperature === 'hot' ? '#b91c1c' : '#0369a1'}; margin-top: 4px; text-transform: uppercase;">${escapeHtml(params.leadTemperature)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact Details Table -->
          <tr>
            <td style="padding: 24px 28px;">
              <h3 style="margin: 0 0 14px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #071B3D;">
                Applicant Contact Details
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="width: 36%; color: #64748b; font-weight: 600;">Full Name</td>
                  <td style="color: #0f172a; font-weight: 700;">${escapeHtml(params.fullName)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="color: #64748b; font-weight: 600;">WhatsApp / Phone</td>
                  <td style="font-weight: 700;">
                    ${params.whatsapp ? `<a href="https://wa.me/${escapeHtml(waUrl)}" style="color: #16a34a; text-decoration: none;">📱 ${escapeHtml(params.whatsapp)}</a>` : '<span style="color: #94a3b8;">Not provided</span>'}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="color: #64748b; font-weight: 600;">Email</td>
                  <td style="font-weight: 700;">
                    ${params.email ? `<a href="mailto:${escapeHtml(params.email)}" style="color: #2563eb; text-decoration: none;">✉️ ${escapeHtml(params.email)}</a>` : '<span style="color: #94a3b8;">Not provided (WhatsApp only)</span>'}
                  </td>
                </tr>
                ${params.telegram ? `<tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="color: #64748b; font-weight: 600;">Telegram</td>
                  <td style="color: #0284c7; font-weight: 700;">${escapeHtml(params.telegram)}</td>
                </tr>` : ''}
                <tr>
                  <td style="color: #64748b; font-weight: 600;">Preferred Language</td>
                  <td style="color: #0f172a; font-weight: 600; text-transform: uppercase;">${escapeHtml(lang)}</td>
                </tr>
              </table>

              <!-- Assessment Result Section -->
              <h3 style="margin: 28px 0 14px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #071B3D;">
                Pathway Recommendation
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="width: 36%; color: #64748b; font-weight: 600;">Primary Route</td>
                  <td style="color: #0f172a; font-weight: 700;">
                    ${primaryMeta.icon} ${escapeHtml(primaryMeta.en)} (${escapeHtml(primaryMeta.fa)})
                  </td>
                </tr>
                ${secondaryMeta ? `<tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="color: #64748b; font-weight: 600;">Secondary Route</td>
                  <td style="color: #334155; font-weight: 600;">
                    ${secondaryMeta.icon} ${escapeHtml(secondaryMeta.en)} (${escapeHtml(secondaryMeta.fa)})
                  </td>
                </tr>` : ''}
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="color: #64748b; font-weight: 600;">Current Location</td>
                  <td style="color: #0f172a;">${escapeHtml(formatLabel(locationVal, LOCATION_LABELS, 'en'))}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="color: #64748b; font-weight: 600;">Planned Timeline</td>
                  <td style="color: #0f172a;">${escapeHtml(formatLabel(timelineVal, TIMELINE_LABELS, 'en'))}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600;">Stated Budget</td>
                  <td style="color: #0f172a;">${escapeHtml(formatLabel(budgetVal, BUDGET_LABELS, 'en'))}</td>
                </tr>
              </table>

              <!-- Action Bar -->
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                ${params.whatsapp ? `<a href="https://wa.me/${escapeHtml(waUrl)}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 13px; margin: 4px;">Open WhatsApp Chat</a>` : ''}
                ${params.email ? `<a href="mailto:${escapeHtml(params.email)}" style="display: inline-block; background-color: #2F6FED; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 13px; margin: 4px;">Reply via Email</a>` : ''}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
              DORVIA EUROP Internal Notification System • Strictly Confidential
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

/**
 * Builds localized confirmation/result email for the applicant
 */
export function buildApplicantResultEmail(params: SendPathfinderEmailsParams): { subject: string; html: string } {
  const isFa = params.preferredLanguage !== 'en';
  const primaryMeta = ROUTE_LABELS[params.primaryRoute] || { fa: params.primaryRoute, en: params.primaryRoute, icon: '🧭' };
  const secondaryMeta = params.secondaryRoute ? ROUTE_LABELS[params.secondaryRoute] : null;
  const matchLevelKey = params.matchLevel?.[params.primaryRoute] || 'good';
  const matchMeta = MATCH_LABELS[matchLevelKey] || { fa: matchLevelKey, en: matchLevelKey };

  const baseUrl = getCanonicalOrigin();
  const routeCanonical = ROUTE_META[params.primaryRoute]?.href || '';
  const siteUrl = `${baseUrl}/${isFa ? 'fa' : 'en'}${routeCanonical}`;
  const directWaUrl = whatsappLink(params.primaryRoute, isFa ? 'fa' : 'en');

  const subject = isFa ? 'نتیجه ارزیابی اولیه DORVIA شما' : 'Your DORVIA PathFinder Result';

  const safeName = escapeHtml(params.fullName);
  const safePrimaryTitle = escapeHtml(isFa ? primaryMeta.fa : primaryMeta.en);
  const safeMatchLabel = escapeHtml(isFa ? matchMeta.fa : matchMeta.en);

  const html = `<!DOCTYPE html>
<html lang="${isFa ? 'fa' : 'en'}" dir="${isFa ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: ${isFa ? "'Vazirmatn', Tahoma, Arial, sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"}; color: #1e293b; line-height: 1.7; direction: ${isFa ? 'rtl' : 'ltr'}; text-align: ${isFa ? 'right' : 'left'};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05); text-align: ${isFa ? 'right' : 'left'}; direction: ${isFa ? 'rtl' : 'ltr'};">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #071B3D; padding: 28px 32px; text-align: center;">
              <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">DORVIA</span>
              <span style="display: inline-block; margin-right: 6px; margin-left: 6px; font-size: 11px; font-weight: 700; color: #2F6FED; background-color: rgba(47, 111, 237, 0.2); padding: 3px 8px; border-radius: 6px; text-transform: uppercase;">PathFinder™</span>
              <div style="margin-top: 10px; font-size: 15px; color: #e2e8f0; font-weight: 500;">
                ${isFa ? 'گزارش ارزیابی اولیه شرایط متقاضی' : 'Preliminary Profile Assessment Report'}
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px;">
              <!-- Greeting -->
              <p style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #0f172a;">
                ${isFa ? `سلام ${safeName} عزیز،` : `Dear ${safeName},`}
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.8;">
                ${isFa
                  ? 'اطلاعات اولیه شما در سیستم ارزیابی DORVIA PathFinder با موفقیت تحلیل و بررسی شد. با توجه به پاسخ‌هایی که ثبت کردید، نتیجه ارزیابی اولیه پروفایل شما به شرح زیر آماده شده است:'
                  : 'Your preliminary profile details have been processed by the DORVIA PathFinder system. Based on your submitted answers, here is your initial pathway assessment:'}
              </p>

              <!-- Result Card -->
              <div style="background-color: #f0f6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 22px 24px; margin-bottom: 28px;">
                <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${isFa ? 'مسیر اولویت پیشنهادی اولیه' : 'Recommended Primary Pathway'}
                </div>
                <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 6px;">
                  ${primaryMeta.icon} ${safePrimaryTitle}
                </div>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 14px; border-top: 1px solid #dbeafe; padding-top: 14px;">
                  <tr>
                    <td style="width: 50%;">
                      <div style="font-size: 11px; font-weight: 600; color: #64748b;">${isFa ? 'امتیاز تطابق اولیه' : 'Initial Score'}</div>
                      <div style="font-size: 20px; font-weight: 800; color: #2F6FED; margin-top: 2px;">${params.profileScore} / 100</div>
                    </td>
                    <td style="width: 50%; text-align: ${isFa ? 'left' : 'right'};">
                      <div style="font-size: 11px; font-weight: 600; color: #64748b;">${isFa ? 'سطح تطابق' : 'Match Level'}</div>
                      <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 4px;">${safeMatchLabel}</div>
                    </td>
                  </tr>
                </table>

                ${secondaryMeta ? `<div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #bfdbfe; font-size: 13px; color: #334155;">
                  <strong>${isFa ? 'مسیر جایگزین:' : 'Alternative pathway:'}</strong> ${secondaryMeta.icon} ${escapeHtml(isFa ? secondaryMeta.fa : secondaryMeta.en)}
                </div>` : ''}
              </div>

              <!-- Scope Explanation -->
              <p style="margin: 0 0 20px; font-size: 13px; color: #475569; line-height: 1.8;">
                ${isFa
                  ? 'این گزارش به شما کمک می‌کند تا زمان و هزینه خود را روی مناسب‌ترین مسیرهای قانونی متمرکز کنید و از اقدام برای راه‌های نامتناسب بپرهیزید.'
                  : 'This assessment is designed to help guide your planning and focus your time and investment on the most legally viable route for your profile.'}
              </p>

              <!-- Mandatory Non-misleading Legal Disclaimer Callout -->
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: ${isFa ? '1px solid #fef3c7' : '4px solid #f59e0b'}; border-right: ${isFa ? '4px solid #f59e0b' : '1px solid #fef3c7'}; border-radius: 10px; padding: 16px 18px; margin-bottom: 28px;">
                <div style="font-size: 12px; font-weight: 800; color: #92400e; margin-bottom: 6px;">
                  ⚠️ ${isFa ? 'یادداشت مهم و سلب مسئولیت حقوقی:' : 'Important Legal Notice & Disclaimer:'}
                </div>
                <div style="font-size: 12px; color: #78350f; line-height: 1.75;">
                  ${isFa
                    ? 'این گزارش صرفاً یک ارزیابی اولیه بر اساس اطلاعات وارد شده توسط شماست و به هیچ عنوان تصمیم قطعی، پذیرش تضمینی دانشگاه، تضمین ویزا یا مشاوره رسمی حقوقی تلقی نمی‌شود. تصمیم‌گیری نهایی همواره بر عهده مراجع رسمی، سفارت و اداره مهاجرت رومانی (IGI) است.'
                    : 'This report represents an initial exploratory evaluation based solely on the information you provided. It does NOT constitute an official eligibility determination, guaranteed university admission, visa guarantee, residence approval, or formal legal advice. Final authority rests strictly with the competent official government bodies, embassies, and the Romanian General Inspectorate for Immigration (IGI).'}
                </div>
              </div>

              <!-- Call To Actions -->
              <div style="text-align: center; margin-top: 28px;">
                <a href="${escapeHtml(directWaUrl)}" style="display: block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; margin-bottom: 10px; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.25);">
                  💬 ${isFa ? 'ادامه بررسی رایگان در واتس‌اپ' : 'Continue Free Discussion on WhatsApp'}
                </a>
                <a href="${escapeHtml(siteUrl)}" style="display: block; background-color: #2F6FED; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px;">
                  📖 ${isFa ? 'مشاهده راهنمای کامل این مسیر در سایت DORVIA' : 'Explore Complete Pathway Guide on DORVIA'}
                </a>
              </div>

              <div style="margin-top: 32px; font-size: 12px; color: #64748b; text-align: center; line-height: 1.7;">
                ${isFa
                  ? 'کارشناسان DORVIA پرونده شما را بررسی خواهند کرد و در صورت نیاز به اطلاعات تکمیلی با شما تماس خواهند گرفت.'
                  : 'A DORVIA advisor will review your submitted profile and follow up if further details are helpful.'}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #071B3D; padding: 22px 32px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.8;">
              <div style="color: #ffffff; font-weight: 700; margin-bottom: 4px;">DORVIA EUROP</div>
              <div>${isFa ? 'پلتفرم جامع خدمات حقوقی، تحصیلی و استقرار در رومانی' : 'Comprehensive Romanian Relocation, Education & Advisory Platform'}</div>
              <div style="margin-top: 8px; color: #64748b;">
                ${isFa ? 'بخارست · اتحادیه اروپا' : 'Bucharest • European Union'}
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

/**
 * Main coordinator function to send internal and applicant emails via Resend.
 * Safe and best-effort: never throws an exception, and never exposes credentials.
 */
export async function sendPathfinderEmails(
  params: SendPathfinderEmailsParams
): Promise<{ internalSent: boolean; applicantSent: boolean }> {
  const result = { internalSent: false, applicantSent: false };

  const resend = getResendClient();
  const config = getResendConfig();

  if (!resend || !config.isConfigured) {
    console.warn('[Email] Resend API key is not configured; skipping transactional email dispatch.');
    return result;
  }

  // 1. Send Internal Lead Notification to DORVIA
  if (config.hasLeadsEmail && config.leadsEmail) {
    try {
      const { subject, html } = buildInternalLeadEmail(params);
      const res = await resend.emails.send({
        from: config.fromEmail,
        to: config.leadsEmail,
        subject,
        html,
      });

      if (res.error) {
        console.error('[Email] Internal lead notification failed:', res.error.message);
      } else {
        result.internalSent = true;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Email] Exception during internal lead notification dispatch:', msg);
    }
  } else {
    console.warn('[Email] DORVIA_LEADS_EMAIL is not configured; internal notification skipped.');
  }

  // 2. Send Localized Applicant Confirmation Email (if valid email provided)
  const applicantEmail = params.email?.trim();
  if (applicantEmail && isValidEmail(applicantEmail)) {
    try {
      const { subject, html } = buildApplicantResultEmail(params);
      const res = await resend.emails.send({
        from: config.fromEmail,
        to: applicantEmail,
        subject,
        html,
      });

      if (res.error) {
        console.error('[Email] Applicant confirmation failed:', res.error.message);
      } else {
        result.applicantSent = true;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Email] Exception during applicant email dispatch:', msg);
    }
  }

  return result;
}
