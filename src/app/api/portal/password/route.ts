import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

/**
 * POST /api/portal/password
 * Authenticated self-service endpoint for portal clients to set or update their account password.
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerComponentClient(request);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database service unconfigured.' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    const newPassword = body?.password;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateErr) {
      console.error('[Portal Password] Failed to update password for user:', user.id, updateErr.message);
      return NextResponse.json(
        { error: updateErr.message || 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (err: any) {
    console.error('[Portal Password] Unexpected error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
