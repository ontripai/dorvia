import { NextResponse } from 'next/server';
import { requireApprovedExchangeUser } from '@/lib/exchangeServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = await requireApprovedExchangeUser(request);
    if (auth.response) return auth.response;
    const { lead } = auth.context!;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const { data: accounts, error } = await supabaseAdmin
      .from('exchange_accounts')
      .select('id, lead_id, kind, value, holder_name, verified_at, is_active, created_at')
      .eq('lead_id', lead.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching exchange accounts:', error);
      return NextResponse.json({ error: 'Failed to fetch accounts.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, accounts: accounts || [] });
  } catch (error) {
    console.error('Unexpected error in GET /api/portal/exchange/accounts:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireApprovedExchangeUser(request);
    if (auth.response) return auth.response;
    const { lead } = auth.context!;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unconfigured.' }, { status: 500 });
    }

    const body = await request.json();
    const { kind, value, holder_name } = body;

    if (!['IR_SHEBA', 'IR_CARD', 'RO_IBAN'].includes(kind)) {
      return NextResponse.json(
        { error: 'نوع حساب نامعتبر است (باید IR_SHEBA، IR_CARD، یا RO_IBAN باشد).' },
        { status: 400 }
      );
    }

    const cleanValue = String(value || '').trim().replace(/[\s-]/g, '').toUpperCase();
    if (!cleanValue) {
      return NextResponse.json({ error: 'شماره حساب / شبا / کارت الزامی است.' }, { status: 400 });
    }

    if (kind === 'IR_SHEBA') {
      const shebaRegex = /^IR[0-9]{24}$/;
      if (!shebaRegex.test(cleanValue)) {
        return NextResponse.json(
          { error: 'شماره شبا باید با IR شروع شده و دارای ۲۴ رقم باشد.' },
          { status: 400 }
        );
      }
    } else if (kind === 'IR_CARD') {
      const cardRegex = /^[0-9]{16}$/;
      if (!cardRegex.test(cleanValue)) {
        return NextResponse.json(
          { error: 'شماره کارت باید دقیقاً ۱۶ رقم عددی باشد.' },
          { status: 400 }
        );
      }
    } else if (kind === 'RO_IBAN') {
      const ibanRegex = /^RO[0-9A-Z]{22}$/;
      if (!ibanRegex.test(cleanValue)) {
        return NextResponse.json(
          { error: 'شماره شبا رومانی (IBAN) باید با RO شروع شده و دارای ۲۲ کاراکتر باشد.' },
          { status: 400 }
        );
      }
    }

    const cleanHolder = String(holder_name || lead.full_name || '').trim();
    if (!cleanHolder) {
      return NextResponse.json({ error: 'نام صاحب حساب الزامی است.' }, { status: 400 });
    }

    const { data: newAccount, error: insertError } = await supabaseAdmin
      .from('exchange_accounts')
      .insert({
        lead_id: lead.id,
        kind,
        value: cleanValue,
        holder_name: cleanHolder,
        is_active: true,
      })
      .select('id, lead_id, kind, value, holder_name, verified_at, is_active, created_at')
      .single();

    if (insertError || !newAccount) {
      console.error('Error inserting exchange account:', insertError);
      return NextResponse.json({ error: 'خطا در ثبت حساب جدید.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      account: newAccount,
      message: 'حساب بانکی با موفقیت افزوده شد.',
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/portal/exchange/accounts:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
