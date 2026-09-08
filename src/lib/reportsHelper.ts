import { NextResponse } from 'next/server';

export interface ReportDateRange {
  fromStr: string; // YYYY-MM-DD
  toStr: string;   // YYYY-MM-DD
  fromIso: string; // ISO string at start of day UTC
  toIso: string;   // ISO string at end of day UTC
  diffDays: number;
}

/**
 * Parses and validates `from` and `to` query parameters from the request URL.
 * Defaults to the last 30 days if omitted or invalid.
 */
export function parseReportDates(searchParams: URLSearchParams): ReportDateRange {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const now = new Date();

  let toStr = searchParams.get('to');
  let fromStr = searchParams.get('from');

  if (!toStr || !dateRegex.test(toStr)) {
    toStr = now.toISOString().split('T')[0];
  }

  if (!fromStr || !dateRegex.test(fromStr)) {
    const thirtyDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    fromStr = thirtyDaysAgo.toISOString().split('T')[0];
  }

  // Ensure from <= to; if reversed, swap
  if (fromStr > toStr) {
    const temp = fromStr;
    fromStr = toStr;
    toStr = temp;
  }

  const fromDate = new Date(`${fromStr}T00:00:00.000Z`);
  const toDate = new Date(`${toStr}T23:59:59.999Z`);
  const diffDays = Math.max(
    1,
    Math.round((new Date(toStr).getTime() - new Date(fromStr).getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  return {
    fromStr,
    toStr,
    fromIso: fromDate.toISOString(),
    toIso: toDate.toISOString(),
    diffDays,
  };
}

/**
 * Generates an array of continuous date strings ['YYYY-MM-DD', ...] between fromStr and toStr.
 */
export function generateDateList(fromStr: string, toStr: string): string[] {
  const dates: string[] = [];
  const current = new Date(`${fromStr}T00:00:00.000Z`);
  const end = new Date(`${toStr}T00:00:00.000Z`);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

/**
 * Escapes a single CSV value.
 */
export function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts rows array to CSV text with standard commas and CRLF/LF.
 */
export function toCsvString(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const rowLines = rows.map((r) => r.map(escapeCsvCell).join(','));
  return [headerLine, ...rowLines].join('\n');
}

/**
 * Creates a response with UTF-8 BOM (0xEF, 0xBB, 0xBF) for Persian/Excel support.
 */
export function createCsvResponse(csvContent: string, filename: string): Response {
  const cleanContent = csvContent.startsWith('\uFEFF') ? csvContent.slice(1) : csvContent;
  const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
  const textBuffer = Buffer.from(cleanContent, 'utf-8');
  const fullBuffer = Buffer.concat([bom, textBuffer]);

  return new Response(fullBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
