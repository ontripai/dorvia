import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Exchange Banking Calendar Helper (dre-p127)
 * Calculates Iranian and Romanian banking deadlines taking into account
 * weekly closures (e.g. Friday in Iran) and holidays in exchange_nonbanking_days.
 */

export interface BankingCalendarConfig {
  weeklyClosed: number[]; // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  nonBankingDates: Set<string>; // 'YYYY-MM-DD'
}

export async function getBankingCalendarConfig(country: 'IR' | 'RO'): Promise<BankingCalendarConfig> {
  const fallbackWeeklyClosed = country === 'IR' ? [5] : [0, 6];

  if (!supabaseAdmin) {
    return { weeklyClosed: fallbackWeeklyClosed, nonBankingDates: new Set() };
  }

  try {
    const { data: calendarData } = await supabaseAdmin
      .from('exchange_banking_calendar')
      .select('weekly_closed')
      .eq('country', country)
      .maybeSingle();

    const { data: holidays } = await supabaseAdmin
      .from('exchange_nonbanking_days')
      .select('date')
      .eq('country', country);

    const weeklyClosed = (calendarData?.weekly_closed as number[]) || fallbackWeeklyClosed;
    const nonBankingDates = new Set<string>((holidays || []).map((h) => h.date));

    return { weeklyClosed, nonBankingDates };
  } catch (err) {
    console.error(`Failed to fetch banking calendar for ${country}:`, err);
    return { weeklyClosed: fallbackWeeklyClosed, nonBankingDates: new Set() };
  }
}

/**
 * Adds N banking business days to a given start date based on the country's calendar.
 */
export async function addBankingDays(
  startDate: Date,
  bankingDays: number,
  country: 'IR' | 'RO' = 'IR'
): Promise<Date> {
  const config = await getBankingCalendarConfig(country);
  const current = new Date(startDate);
  let added = 0;

  // Max lookahead of 30 calendar days to avoid infinite loop
  let safetyCounter = 0;
  while (added < bankingDays && safetyCounter < 30) {
    current.setDate(current.getDate() + 1);
    safetyCounter++;

    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().slice(0, 10);

    if (config.weeklyClosed.includes(dayOfWeek)) {
      continue;
    }
    if (config.nonBankingDates.has(dateStr)) {
      continue;
    }

    added++;
  }

  return current;
}
