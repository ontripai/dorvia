import { NextResponse } from 'next/server';
import { getAdminContext, hasPermission } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminContext();
    if (!admin || !hasPermission(admin, 'leads.invite')) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have permission to invite leads.' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    // 1. Fetch lead
    const { data: lead, error: fetchErr } = await supabaseAdmin
      .from('leads')
      .select('id, email, full_name, verified_at, invited_at')
      .eq('id', leadId)
      .maybeSingle();

    if (fetchErr || !lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    if (!lead.email) {
      return NextResponse.json(
        { error: 'Cannot send portal invitation: lead has no email address.' },
        { status: 400 }
      );
    }

    // 2. Strict Server Guard: Lead MUST be verified first
    if (!lead.verified_at) {
      return NextResponse.json(
        { error: 'Lead must be verified before a portal invitation can be sent.' },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const origin = url.origin;
    const callbackUrl = `${origin}/fa/portal/callback`;

    // 3. Send magic link invitation via Supabase Auth Admin API
    const { data: inviteData, error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      lead.email.trim().toLowerCase(),
      {
        redirectTo: callbackUrl,
      }
    );

    // If user is already registered in auth, inviteUserByEmail might return an error or notice.
    // In that case, generate a magic link or proceed gracefully so the action is idempotent.
    if (inviteErr) {
      console.warn('inviteUserByEmail note/error:', inviteErr.message);
      // If error is because user is already registered, fallback to generateLink or sending OTP
      if (
        inviteErr.message.toLowerCase().includes('already') ||
        inviteErr.message.toLowerCase().includes('registered')
      ) {
        await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: lead.email.trim().toLowerCase(),
          options: {
            redirectTo: callbackUrl,
          },
        });
      } else {
        return NextResponse.json(
          { error: `Failed to dispatch invitation: ${inviteErr.message}` },
          { status: 500 }
        );
      }
    }

    const now = new Date().toISOString();

    // 4. Update leads.invited_at and leads.invited_by
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('leads')
      .update({
        invited_at: now,
        invited_by: admin.adminUserId,
      })
      .eq('id', leadId)
      .select('id, email, verified_at, invited_at, invited_by')
      .single();

    if (updateErr) {
      console.error('Error updating lead invited_at:', updateErr);
      return NextResponse.json({ error: 'Failed to record invitation state.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('Unexpected error in invite lead:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
