import { NextResponse } from 'next/server';

// Simple in-memory rate limiting for best-effort fallback
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export async function POST(req: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('API Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing');
      return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate Limiting Logic: Max 3 requests per 5 minutes per IP
    const now = Date.now();
    const rlData = rateLimitMap.get(ip);
    if (rlData && now < rlData.resetTime) {
      if (rlData.count >= 3) {
        // We drop it but still return a 429 for genuine clients to respect
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }
      rlData.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
    }

    // Parse JSON safely
    let data;
    try {
      const text = await req.text();
      if (text.length > 5000) {
        return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
      }
      data = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Honeypot check
    if (data._gotcha && data._gotcha.trim() !== '') {
      // Fake success for bots, do not hit telegram
      return NextResponse.json({ success: true, message: 'Request processed securely' });
    }

    // Required fields check (Basic Validation)
    if (!data.fullName || (!data.phone && !data.email) || !data.privacyAcknowledgment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Input Sanitization (Basic escaping and Unicode normalization)
    const sanitize = (str: string, maxLen: number = 500) => {
      if (!str) return '';
      return String(str)
        .normalize('NFC')
        .replace(/[<>]/g, '')
        .substring(0, maxLen);
    };

    const safeData = {
      fullName: sanitize(data.fullName, 100),
      phone: sanitize(data.phone, 50),
      email: sanitize(data.email, 100),
      mainGoal: sanitize(data.mainGoal, 50),
      message: sanitize(data.message, 1000),
      marketingConsent: Boolean(data.marketingConsent)
    };

    // Construct Telegram Message safely
    const telegramMessage = `
📝 *New Case Evaluation Request*

👤 *Name:* ${safeData.fullName}
📞 *Phone:* ${safeData.phone || 'N/A'}
📧 *Email:* ${safeData.email || 'N/A'}
🎯 *Goal:* ${safeData.mainGoal}
📢 *Marketing Consent:* ${safeData.marketingConsent ? 'Yes' : 'No'}

💬 *Message:* 
${safeData.message || 'No additional message'}
    `.trim();

    // Secure Dispatch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'Markdown'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!telegramRes.ok) {
        throw new Error(`Telegram API responded with ${telegramRes.status}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Telegram Dispatch Error'); // No PII in logs
      return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }

    // Return true success only when Telegram acknowledges
    return NextResponse.json({ success: true, message: 'Request processed securely' });

  } catch (error) {
    // Do not leak internal errors to client
    console.error('Evaluation API Error (Internal)');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
