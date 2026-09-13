import { NextResponse } from 'next/server';
import { getExchangeUserContext } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const auth = await getExchangeUserContext(request);
    if (auth.response) return auth.response;
    const { lead, profile, user } = auth.context!;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    if (profile.exchange_status === 'approved') {
      return NextResponse.json({
        success: true,
        message: 'Your exchange profile is already approved.',
        exchange_status: 'approved',
      });
    }

    if (profile.exchange_status === 'suspended') {
      return NextResponse.json(
        {
          error: 'Your exchange account is suspended. Please contact DORVIA support.',
          code: 'exchange_suspended',
        },
        { status: 403 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from('exchange_profiles')
      .update({
        exchange_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('lead_id', lead.id);

    if (updateError) {
      console.error('Error updating exchange profile to pending:', updateError);
      return NextResponse.json({ error: 'Failed to submit access request.' }, { status: 500 });
    }

    // Append audit event
    await supabaseAdmin.from('exchange_events').insert({
      actor: 'client',
      actor_user_id: user.id,
      from_status: profile.exchange_status,
      to_status: 'pending',
      payload: { action: 'request_access', lead_id: lead.id },
    });

    return NextResponse.json({
      success: true,
      message: 'درخواست دسترسی به تبادل ارز ثبت شد و در صف بررسی کارشناسان قرار گرفت.',
      exchange_status: 'pending',
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/exchange/request-access:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
