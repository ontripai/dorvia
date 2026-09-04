import { NextResponse } from 'next/server';
import { recordPathfinderLead } from '../../../lib/supabaseAdmin';

// DORVIA Assessment / PathFinder — lead capture endpoint.
// Mirrors the structure of /api/evaluation/route.ts (rate limiting,
// sanitization, honeypot, Telegram dispatch) but carries the richer
// PathFinder payload (full question answers + computed scores) instead of
// the simple 3-field LeadForm shape. Kept as its own route rather than
// extending /api/evaluation so that endpoint's already-validated behavior
// is untouched.

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const ROUTES = ['study', 'work', 'business', 'family', 'relocation'] as const;
type RouteId = (typeof ROUTES)[number];

function isRouteId(v: unknown): v is RouteId {
  return typeof v === 'string' && (ROUTES as readonly string[]).includes(v);
}

export async function POST(req: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('API Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing');
      return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }

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
        // Larger cap than /api/evaluation: this payload carries the full
        // question-by-question answers object, not just a free-text message.
        return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
      }
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (data._gotcha && String(data._gotcha).trim() !== '') {
      return NextResponse.json({ success: true, message: 'Request processed securely' });
    }

    if (!data.fullName || !data.whatsapp || !data.email || !data.result || !isRouteId(data.result.primaryRoute)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sanitize = (str: unknown, maxLen: number = 500) => {
      if (!str) return '';
      return String(str).normalize('NFC').replace(/[<>]/g, '').substring(0, maxLen);
    };

    const safeData = {
      fullName: sanitize(data.fullName, 100),
      whatsapp: sanitize(data.whatsapp, 50),
      email: sanitize(data.email, 100),
      telegram: sanitize(data.telegram, 100),
      preferredLanguage: data.preferredLanguage === 'en' ? 'en' : 'fa',
    };

    const result = data.result || {};
    const primaryRoute: RouteId = isRouteId(result.primaryRoute) ? result.primaryRoute : 'relocation';
    const secondaryRoute: RouteId | null = isRouteId(result.secondaryRoute) ? result.secondaryRoute : null;
    const profileScore = typeof result.scores?.[primaryRoute] === 'number' ? result.scores[primaryRoute] : 0;
    const leadTemperature = typeof result.leadTemperature === 'string' ? result.leadTemperature : 'informational';

    // The raw answers object is arbitrary but bounded (fixed question set,
    // single/multi string values) — safe to store as-is in jsonb without
    // per-field sanitization beyond the overall payload-size cap above.
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
      submittedAt: new Date().toISOString(),
    };

    await recordPathfinderLead({
      fullName: safeData.fullName,
      whatsapp: safeData.whatsapp,
      email: safeData.email,
      preferredLanguage: safeData.preferredLanguage,
      primaryRoute,
      secondaryRoute,
      profileScore,
      leadTemperature,
      channelRef: 'pathfinder',
      rawMeta,
    }).catch(() => {});

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
        throw new Error(`Telegram API responded with ${telegramRes.status}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Telegram Dispatch Error (Internal)');
      // Unlike /api/evaluation, the Supabase write above already succeeded
      // (or was best-effort attempted) by this point, so the lead is not
      // lost even if Telegram notification fails — return success so the
      // user sees their result rather than a false error.
      return NextResponse.json({ success: true, message: 'Request processed securely' });
    }

    return NextResponse.json({ success: true, message: 'Request processed securely' });
  } catch (error) {
    console.error('Assessment API Error (Internal)');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
