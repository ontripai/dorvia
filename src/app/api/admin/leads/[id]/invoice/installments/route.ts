import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(_req?: any, _context?: any) {
  return NextResponse.json(
    {
      error: 'ماژول اقساط تک‌فاکتور منسوخ شده است. لطفاً از سیستم جدید دریافتی و تخصیص (/api/admin/leads/[id]/receipts) استفاده کنید.',
    },
    { status: 400 }
  );
}
