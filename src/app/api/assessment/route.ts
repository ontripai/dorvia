import { NextResponse } from 'next/server';
import { recordPathfinderLead } from '../../../lib/supabaseAdmin';
import { sendPathfinderEmails } from '../../../lib/email/pathfinderEmails';

// DORVIA Assessment / PathFinder — lead capture endpoint.
// Validates payload, saves lead to Supabase, dispatches Resend transactional
// emails (internal notification to DORVIA + localized result email to applicant),
// and best-effort Telegram notification if configured.

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const ROUTES = ['study', 'work', 'business', 'family', 'relocation'] as const;
type RouteId = (typeof ROUTES)[number];

function isRouteId(v: unknown): v is RouteId {
  return typeof v === 'string' && (ROUTES as readonly string[]).includes(v);
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Rate limiting: max 3 requests per 5 minutes per IP (same policy as /api/evaluation)
    const now = Date.now();
    const rlData = rateLimitMap.get(ip);
    if (rlData && now < rlData.resetTime) {
      if (rlData.count >= 3) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }
      rlData.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
    }

    let data: any;
    try {
      const text = await req.text();
      if (text.length > 20000) {
        return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
      }
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Honeypot field check
    if (data._gotcha && String(data._gotcha).trim() !== '') {
      return NextResponse.json({ success: true, message: 'Request processed securely' });
    }

    // Validation: Name, WhatsApp, and valid primaryRoute are required.
    // Email is optional (WhatsApp-only leads).
    if (!data.fullName || !data.whatsapp || !data.result || !isRouteId(data.result.primaryRoute)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sanitize = (str: unknown, maxLen: number = 500) => {
      if (!str) return '';
      return String(str).normalize('NFC').replace(/[<>]/g, '').substring(0, maxLen).trim();
    };

    const safeData = {
      fullName: sanitize(data.fullName, 100),
      whatsapp: sanitize(data.whatsapp, 50),
      email: data.email ? sanitize(data.email, 100) : '',
      telegram: data.telegram ? sanitize(data.telegram, 100) : '',
      preferredLanguage: data.preferredLanguage === 'en' ? ('en' as const) : ('fa' as const),
    };

    const result = data.result || {};
    const primaryRoute: RouteId = isRouteId(result.primaryRoute) ? result.primaryRoute : 'relocation';
    const secondaryRoute: RouteId | null = isRouteId(result.secondaryRoute) ? result.secondaryRoute : null;
    const profileScore = typeof result.scores?.[primaryRoute] === 'number' ? result.scores[primaryRoute] : 0;
    const leadTemperature = typeof result.leadTemperature === 'string' ? result.leadTemperature : 'informational';
    const submittedAt = new Date().toISOString();

    const rawMeta = {
      telegram: safeData.telegram || null,
      ip,
      answers: data.answers && typeof data.answers === 'object' ? data.answers : {},
      scores: result.scores || {},
      matchLevel: result.matchLevel || {},
      primaryRoute,
      secondaryRoute,
      leadScore: result.leadScore ?? null,
      leadTemperature,
      submittedAt,
    };

    // 1. Attempt lead capture into Supabase (best-effort, non-blocking)
    await recordPathfinderLead({
      fullName: safeData.fullName,
      whatsapp: safeData.whatsapp,
      email: safeData.email || undefined,
      preferredLanguage: safeData.preferredLanguage,
      primaryRoute,
      secondaryRoute,
      profileScore,
      leadTemperature,
      channelRef: 'pathfinder',
      rawMeta,
    }).catch(() => {});

    // 2. Transactional Emails via Resend (Internal notification + Applicant result)
    await sendPathfinderEmails({
      fullName: safeData.fullName,
      whatsapp: safeData.whatsapp,
      email: safeData.email || undefined,
      telegram: safeData.telegram || undefined,
      preferredLanguage: safeData.preferredLanguage,
      primaryRoute,
      secondaryRoute,
      profileScore,
      leadScore: result.leadScore,
      leadTemperature,
      answers: rawMeta.answers as Record<string, unknown>,
      matchLevel: result.matchLevel,
      submittedAt,
    }).catch((err) => {
      console.error('[Assessment] Pathfinder emails dispatch caught error:', err instanceof Error ? err.message : 'Unknown');
    });

    // 3. Telegram notification (Best-effort, optional)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const routeLabelFa: Record<RouteId, string> = {
        study: 'تحصیل',
        work: 'کار',
        business: 'کسب‌وکار',
        family: 'خانواده',
        relocation: 'جابه‌جایی/زندگی',
      };

      const telegramMessage = `
🧭 *DORVIA PathFinder — New Assessment Lead*

👤 *Name:* ${safeData.fullName}
📱 *WhatsApp:* ${safeData.whatsapp || 'N/A'}
📧 *Email:* ${safeData.email || 'N/A'}
✈️ *Telegram:* ${safeData.telegram || 'N/A'}
🎯 *Primary Route:* ${routeLabelFa[primaryRoute]} (${primaryRoute}) — ${profileScore}/100
${secondaryRoute ? `↪️ *Secondary Route:* ${routeLabelFa[secondaryRoute]} (${secondaryRoute}) — ${result.scores?.[secondaryRoute] ?? '?'}/100\n` : ''}🌡 *Lead Temperature:* ${leadTemperature}
      `.trim();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: telegramMessage, parse_mode: 'Markdown' }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!telegramRes.ok) {
          console.warn(`[Assessment] Telegram API responded with status ${telegramRes.status}`);
        }
      } catch {
        clearTimeout(timeoutId);
        console.error('[Assessment] Telegram Dispatch Error (Internal)');
      }
    }

    return NextResponse.json({ success: true, message: 'Request processed securely' });
  } catch (error) {
    console.error('[Assessment] API Error (Internal)');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
