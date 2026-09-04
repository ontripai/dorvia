import { Resend } from 'resend';

// Security assertion: Resend client must NEVER be executed on the client/browser bundle
if (typeof window !== 'undefined') {
  throw new Error('FATAL SECURITY VIOLATION: Resend email module must NEVER be imported or executed in the client bundle.');
}

export interface ResendConfig {
  isConfigured: boolean;
  hasLeadsEmail: boolean;
  apiKey?: string;
  fromEmail: string;
  leadsEmail?: string;
}

export function getResendConfig(): ResendConfig {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'DORVIA <notifications@notifications.dorvia.ro>';
  const leadsEmail = process.env.DORVIA_LEADS_EMAIL?.trim();

  return {
    isConfigured: Boolean(apiKey && apiKey.length > 0),
    hasLeadsEmail: Boolean(leadsEmail && leadsEmail.length > 0),
    apiKey,
    fromEmail,
    leadsEmail,
  };
}

let cachedResend: Resend | null = null;
let lastApiKey: string | undefined = undefined;

export function getResendClient(): Resend | null {
  const config = getResendConfig();
  if (!config.isConfigured || !config.apiKey) {
    return null;
  }

  if (!cachedResend || lastApiKey !== config.apiKey) {
    cachedResend = new Resend(config.apiKey);
    lastApiKey = config.apiKey;
  }

  return cachedResend;
}
