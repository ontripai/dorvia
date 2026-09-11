import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

/**
 * Legacy Case Invoice Endpoint (Superseded by dre-p85 detailed accounting)
 * Forward-compatible: points clients to /api/admin/leads/[id]/charges and /ledger.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext(request);
    if (!admin || !hasPermission(admin, 'finance.view')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to view financial details.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      migrated: true,
      invoice: null,
      summary: null,
      message: 'Single-invoice module has been upgraded to dre-p85 multi-charge ledger. Use /charges and /ledger.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    {
      error: 'ماژول تک‌فاکتور قدیمی منسوخ شده است. لطفاً از روت /api/admin/leads/[id]/charges برای ثبت بدهکاری استفاده کنید.',
    },
    { status: 400 }
  );
}
