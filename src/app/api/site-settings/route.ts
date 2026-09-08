import { NextResponse } from 'next/server';
import { isJobBoardPubliclyEnabled } from '@/lib/jobBoardHelper';

export const dynamic = 'force-dynamic';

/**
 * GET /api/site-settings
 * Exposes non-sensitive feature flags to client applications.
 */
export async function GET() {
  try {
    const jobBoardPublicEnabled = await isJobBoardPubliclyEnabled();
    return NextResponse.json({
      job_board_public_enabled: jobBoardPublicEnabled,
    });
  } catch (error: any) {
    return NextResponse.json(
      { job_board_public_enabled: false },
      { status: 500 }
    );
  }
}
