/**
 * Direct Telegram Bot Notification Dispatcher
 * Dispatches messages to admin staff via Telegram Bot API without external dependencies.
 */

export interface TelegramSendResult {
  success: boolean;
  messageId?: number;
  error?: string;
  skipped?: boolean;
}

/**
 * Sends a message to a specific Telegram chat_id using the official Telegram Bot API.
 * If TELEGRAM_BOT_TOKEN is not configured, logs a warning and returns gracefully (never crashes).
 *
 * @param chatId The recipient's numeric Telegram chat ID (from admin_users.telegram_chat_id)
 * @param text The message body (supports standard HTML tags if parseMode is 'HTML')
 * @param parseMode Optional parse mode ('HTML' by default)
 */
export async function sendTelegramMessage(
  chatId: string,
  text: string,
  parseMode: 'HTML' | 'Markdown' | 'None' = 'HTML'
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();

  if (!token) {
    console.warn(
      '[Telegram] TELEGRAM_BOT_TOKEN environment variable is not defined. Skipping Telegram dispatch.'
    );
    return { success: false, skipped: true, error: 'TELEGRAM_BOT_TOKEN not configured' };
  }

  if (!chatId || !chatId.trim()) {
    return { success: false, skipped: true, error: 'Empty or invalid chat_id' };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload: Record<string, any> = {
      chat_id: chatId.trim(),
      text: text,
      disable_web_page_preview: true,
    };

    if (parseMode !== 'None') {
      payload.parse_mode = parseMode;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      const errorMsg = data?.description || `HTTP status ${response.status}`;
      console.error(`[Telegram] Failed to send message to ${chatId}: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }

    return {
      success: true,
      messageId: data?.result?.message_id,
    };
  } catch (error: any) {
    console.error(`[Telegram] Network error sending message to ${chatId}:`, error?.message || error);
    return { success: false, error: error?.message || 'Network exception' };
  }
}
