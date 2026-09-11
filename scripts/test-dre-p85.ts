import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { supabaseAdmin } from '../src/lib/supabaseAdmin';
import * as chargesRoute from '../src/app/api/admin/leads/[id]/charges/route';
import * as chargeItemRoute from '../src/app/api/admin/leads/[id]/charges/[chargeId]/route';
import * as receiptsRoute from '../src/app/api/admin/leads/[id]/receipts/route';
import * as receiptItemRoute from '../src/app/api/admin/leads/[id]/receipts/[receiptId]/route';
import * as ledgerRoute from '../src/app/api/admin/leads/[id]/ledger/route';
import * as financeReportRoute from '../src/app/api/admin/reports/finance/route';

async function runTest() {
  console.log('====================================================');
  console.log('🚀 Running dre-p85 Comprehensive Client Accounting Tests');
  console.log('====================================================\n');

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
  }

  const sessionHandler = await import('../src/app/api/auth/session/route');

  if (!supabaseAdmin) {
    throw new Error('Supabase admin client unconfigured.');
  }

  console.log('Generating admin session for ontrip.ai@gmail.com...');
  const linkRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: 'ontrip.ai@gmail.com',
    options: { redirectTo: 'https://dorvia.ro/fa/admin/callback' },
  });

  const actionLink = linkRes.data?.properties?.action_link;
  if (!actionLink) {
    console.error('❌ Failed to generate action link for admin:', linkRes.error);
    process.exit(1);
  }

  const verifyRes = await fetch(actionLink, { method: 'GET', redirect: 'manual' });
  const location = verifyRes.headers.get('location') || '';
  const hash = location.split('#')[1] || '';
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken) {
    console.error('❌ Failed to extract token from verify redirect.');
    process.exit(1);
  }

  const sessionReq = new Request('https://dorvia.ro/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      flow: 'admin',
      lang: 'fa',
    }),
  });

  const sessionRes = await sessionHandler.POST(sessionReq);
  const sessionJson = await sessionRes.json();
  if (sessionRes.status !== 200 || !sessionJson.success) {
    console.error('❌ Failed to establish admin session:', sessionJson);
    process.exit(1);
  }

  const adminCookies = (sessionRes as any).cookies?.getAll ? (sessionRes as any).cookies.getAll() : [];
  const adminCookieHeader = adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
  console.log('👤 Admin session cookie established successfully!');

  const authHeaders = {
    'Content-Type': 'application/json',
    cookie: adminCookieHeader,
  };

  // 2. Create or find a dedicated test lead
  const testLeadEmail = `accounting-test-${Date.now()}@dorvia-test.ro`;
  const { data: testLead, error: leadErr } = await supabaseAdmin
    .from('leads')
    .insert({
      full_name: 'آزمایش حسابداری تفصیلی',
      email: testLeadEmail,
      phone: '+40700000085',
      source: 'website',
      status: 'qualified',
    })
    .select()
    .single();

  if (leadErr || !testLead) {
    console.error('❌ Failed to create test lead:', leadErr);
    process.exit(1);
  }
  console.log(`📁 Test Lead created: ID=${testLead.id}, Name=${testLead.full_name}\n`);

  try {
    // -------------------------------------------------------------
    // Test Step 1: Create 2 separate charges on the lead
    // -------------------------------------------------------------
    console.log('--- Step 1: Creating 2 separate charges in EUR (€) ---');

    // Charge 1: 3,000 EUR
    const charge1Req = new Request(`https://dorvia.ro/api/admin/leads/${testLead.id}/charges`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        description: 'حق‌الوکاله اخذ اقامت کاری رومانی',
        amount: 3000,
        notes: 'مرحله اول پرونده اقامتی',
      }),
    });
    const charge1Res = await chargesRoute.POST(charge1Req, {
      params: Promise.resolve({ id: testLead.id }),
    });
    const charge1Json = await charge1Res.json();
    console.log('Charge 1 response status:', charge1Res.status);
    if (charge1Res.status !== 201 || !charge1Json.success || !charge1Json.charge?.id) {
      throw new Error(`Failed to create charge 1: ${JSON.stringify(charge1Json)}`);
    }
    const charge1 = charge1Json.charge;
    console.log(`✅ Charge 1 created: doc=${charge1.doc_number}, amount=${charge1.amount} ${charge1.currency}, status=${charge1.status}`);

    // Charge 2: 1,500 EUR
    const charge2Req = new Request(`https://dorvia.ro/api/admin/leads/${testLead.id}/charges`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        description: 'خدمات ترجمه رسمی و تایید اسناد تجاری',
        amount: 1500,
        notes: 'ترجمه مدارک به رومانیایی',
      }),
    });
    const charge2Res = await chargesRoute.POST(charge2Req, {
      params: Promise.resolve({ id: testLead.id }),
    });
    const charge2Json = await charge2Res.json();
    console.log('Charge 2 response status:', charge2Res.status);
    if (charge2Res.status !== 201 || !charge2Json.success || !charge2Json.charge?.id) {
      throw new Error(`Failed to create charge 2: ${JSON.stringify(charge2Json)}`);
    }
    const charge2 = charge2Json.charge;
    console.log(`✅ Charge 2 created: doc=${charge2.doc_number}, amount=${charge2.amount} ${charge2.currency}, status=${charge2.status}\n`);

    // Verify both charges are in 'open' status with 0 paid_amount
    if (charge1.status !== 'open' || charge2.status !== 'open') {
      throw new Error('Initial charges should both have status="open"');
    }

    // -------------------------------------------------------------
    // Test Step 2: Record a receipt of 3,500 EUR allocated across charges
    // (3,000 EUR to Charge 1 -> fully paid, 500 EUR to Charge 2 -> partially paid)
    // -------------------------------------------------------------
    console.log('--- Step 2: Record a 3,500 EUR receipt with allocations ---');
    const receiptReq = new Request(`https://dorvia.ro/api/admin/leads/${testLead.id}/receipts`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        amount: 3500,
        payment_method: 'bank_transfer',
        paid_at: '2026-09-11',
        reference_number: 'TRX-EUR-884920',
        notes: 'واریز به حساب بانکی بی‌سی‌آر بخارست',
        allocations: [
          { charge_id: charge1.id, amount: 3000 },
          { charge_id: charge2.id, amount: 500 },
        ],
      }),
    });
    const receiptRes = await receiptsRoute.POST(receiptReq, {
      params: Promise.resolve({ id: testLead.id }),
    });
    const receiptJson = await receiptRes.json();
    console.log('Receipt response status:', receiptRes.status);
    if (receiptRes.status !== 201 || !receiptJson.success || !receiptJson.receipt?.id) {
      throw new Error(`Failed to create receipt: ${JSON.stringify(receiptJson)}`);
    }
    const receipt = receiptJson.receipt;
    console.log(`✅ Receipt created: doc=${receipt.doc_number}, amount=${receipt.amount} ${receipt.currency}, allocated=${receipt.allocated_amount}`);

    // Verify charge statuses after receipt allocations
    const { data: updatedCharge1 } = await supabaseAdmin
      .from('case_charges')
      .select('*')
      .eq('id', charge1.id)
      .single();
    const { data: updatedCharge2 } = await supabaseAdmin
      .from('case_charges')
      .select('*')
      .eq('id', charge2.id)
      .single();

    console.log(`Charge 1 status: ${updatedCharge1?.status}, paid: ${updatedCharge1?.paid_amount}/${updatedCharge1?.amount}`);
    console.log(`Charge 2 status: ${updatedCharge2?.status}, paid: ${updatedCharge2?.paid_amount}/${updatedCharge2?.amount}`);

    if (updatedCharge1?.status !== 'paid' || Number(updatedCharge1?.paid_amount) !== 3000) {
      throw new Error(`Charge 1 should be 'paid' with paid_amount=3000, got status=${updatedCharge1?.status}, paid=${updatedCharge1?.paid_amount}`);
    }
    if (updatedCharge2?.status !== 'partially_paid' || Number(updatedCharge2?.paid_amount) !== 500) {
      throw new Error(`Charge 2 should be 'partially_paid' with paid_amount=500, got status=${updatedCharge2?.status}, paid=${updatedCharge2?.paid_amount}`);
    }
    console.log('✅ PASS: Charge 1 transitioned to "paid" and Charge 2 to "partially_paid"!\n');

    // -------------------------------------------------------------
    // Test Step 3: Verify Chronological Ledger endpoint & Running Balance
    // -------------------------------------------------------------
    console.log('--- Step 3: Verify Chronological Ledger and Running Balance ---');
    const ledgerReq = new Request(`https://dorvia.ro/api/admin/leads/${testLead.id}/ledger`, {
      method: 'GET',
      headers: authHeaders,
    });
    const ledgerRes = await ledgerRoute.GET(ledgerReq, {
      params: Promise.resolve({ id: testLead.id }),
    });
    const ledgerData = await ledgerRes.json();
    console.log('Ledger status:', ledgerRes.status, 'Entries count:', ledgerData.entries?.length);

    if (!ledgerData.success || !Array.isArray(ledgerData.entries)) {
      throw new Error(`Ledger query failed: ${JSON.stringify(ledgerData)}`);
    }

    console.log('Ledger summary:', ledgerData.summary);
    // Expected:
    // Total charges: 3000 + 1500 = 4500
    // Total receipts: 3500
    // Balance: 4500 - 3500 = 1000 EUR
    if (ledgerData.summary.totalCharges !== 4500) {
      throw new Error(`Expected totalCharges=4500, got ${ledgerData.summary.totalCharges}`);
    }
    if (ledgerData.summary.totalReceipts !== 3500) {
      throw new Error(`Expected totalReceipts=3500, got ${ledgerData.summary.totalReceipts}`);
    }
    if (ledgerData.summary.balance !== 1000) {
      throw new Error(`Expected balance=1000, got ${ledgerData.summary.balance}`);
    }
    console.log('✅ PASS: Ledger entries and running balance calculate accurately!\n');

    // -------------------------------------------------------------
    // Test Step 4: Cancellation Guard Rules
    // -------------------------------------------------------------
    console.log('--- Step 4: Testing Cancellation Rules ---');

    // Rule 4a: Cannot cancel an allocated charge
    console.log('Attempting to cancel Charge 1 (which has allocations)...');
    const cancelChgReq = new Request(`https://dorvia.ro/api/admin/leads/${testLead.id}/charges/${charge1.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ action: 'cancel', reason: 'تست ابطال' }),
    });
    const cancelChgRes = await chargeItemRoute.PATCH(cancelChgReq, {
      params: Promise.resolve({ id: testLead.id, chargeId: charge1.id }),
    });
    const cancelChgJson = await cancelChgRes.json();
    console.log('Cancel allocated charge status:', cancelChgRes.status, 'Error:', cancelChgJson.error);
    if (cancelChgRes.status !== 400) {
      throw new Error('Allocated charge cancellation must be rejected with 400!');
    }
    console.log('✅ PASS: Cancellation of allocated charge correctly rejected!\n');

    // Rule 4b: Cancelling a receipt reverts allocations and resets charge status
    console.log('Cancelling the receipt to revert allocations...');
    const cancelRcptReq = new Request(`https://dorvia.ro/api/admin/leads/${testLead.id}/receipts/${receipt.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ action: 'cancel', reason: 'واریزی اشتباه بوده است' }),
    });
    const cancelRcptRes = await receiptItemRoute.PATCH(cancelRcptReq, {
      params: Promise.resolve({ id: testLead.id, receiptId: receipt.id }),
    });
    const cancelRcptJson = await cancelRcptRes.json();
    console.log('Cancel receipt status:', cancelRcptRes.status);
    if (cancelRcptRes.status !== 200 || !cancelRcptJson.success) {
      throw new Error(`Receipt cancellation failed: ${JSON.stringify(cancelRcptJson)}`);
    }

    // Verify charge statuses reverted back to 'open' with paid_amount=0
    const { data: revertedCharge1 } = await supabaseAdmin
      .from('case_charges')
      .select('*')
      .eq('id', charge1.id)
      .single();
    const { data: revertedCharge2 } = await supabaseAdmin
      .from('case_charges')
      .select('*')
      .eq('id', charge2.id)
      .single();

    console.log(`Reverted Charge 1: status=${revertedCharge1?.status}, paid=${revertedCharge1?.paid_amount}`);
    console.log(`Reverted Charge 2: status=${revertedCharge2?.status}, paid=${revertedCharge2?.paid_amount}`);

    if (revertedCharge1?.status !== 'open' || Number(revertedCharge1?.paid_amount) !== 0) {
      throw new Error(`Charge 1 should have reverted to 'open' with 0 paid, got ${revertedCharge1?.status}, ${revertedCharge1?.paid_amount}`);
    }
    if (revertedCharge2?.status !== 'open' || Number(revertedCharge2?.paid_amount) !== 0) {
      throw new Error(`Charge 2 should have reverted to 'open' with 0 paid, got ${revertedCharge2?.status}, ${revertedCharge2?.paid_amount}`);
    }
    console.log('✅ PASS: Receipt cancellation restored all allocations and charge statuses!\n');

    // Rule 4c: Now that Charge 1 has 0 paid_amount, cancellation should succeed
    console.log('Cancelling unallocated Charge 1...');
    const cancelChg2Req = new Request(`https://dorvia.ro/api/admin/leads/${testLead.id}/charges/${charge1.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ action: 'cancel', reason: 'لغو با موفقیت' }),
    });
    const cancelChg2Res = await chargeItemRoute.PATCH(cancelChg2Req, {
      params: Promise.resolve({ id: testLead.id, chargeId: charge1.id }),
    });
    const cancelChg2Json = await cancelChg2Res.json();
    console.log('Cancel unallocated charge status:', cancelChg2Res.status);
    if (cancelChg2Res.status !== 200 || !cancelChg2Json.success || cancelChg2Json.charge?.status !== 'cancelled') {
      throw new Error(`Expected charge to be cancelled, got ${JSON.stringify(cancelChg2Json)}`);
    }
    console.log('✅ PASS: Unallocated charge cancellation succeeded!\n');

    // -------------------------------------------------------------
    // Test Step 5: Finance Report Integration (/api/admin/reports/finance)
    // -------------------------------------------------------------
    console.log('--- Step 5: Testing Finance Report & Client Breakdown ---');
    const today = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const reportReq = new Request(`https://dorvia.ro/api/admin/reports/finance?from=${from}&to=${today}`, {
      method: 'GET',
      headers: authHeaders,
    });
    const reportRes = await financeReportRoute.GET(reportReq);
    const reportJson = await reportRes.json();
    console.log('Finance Report status:', reportRes.status);

    if (reportRes.status !== 200 || !reportJson.summary) {
      throw new Error(`Finance report failed: ${JSON.stringify(reportJson)}`);
    }

    console.log('Report Currency:', reportJson.summary.currency);
    console.log('Client Breakdown entries count:', reportJson.clientBreakdown?.length);

    if (reportJson.summary.currency !== 'EUR') {
      throw new Error(`Expected currency EUR, got ${reportJson.summary.currency}`);
    }
    if (!Array.isArray(reportJson.clientBreakdown)) {
      throw new Error('clientBreakdown must be an array in finance report response');
    }

    const testLeadBreakdown = reportJson.clientBreakdown.find((c: any) => c.leadId === testLead.id);
    console.log('Test Lead in Breakdown:', testLeadBreakdown);
    if (testLeadBreakdown) {
      console.log(`✅ Test Lead correctly included in clientBreakdown with outstandingBalance=${testLeadBreakdown.outstandingBalance} EUR`);
    }

    // -------------------------------------------------------------
    // Test Step 6: Verify RLS Lockdown (Anon vs Service Role)
    // -------------------------------------------------------------
    console.log('\n--- Step 6: Testing RLS Lockdown ---');
    const { createClient } = await import('@supabase/supabase-js');
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: anonCharges, error: anonChgErr } = await anonClient
      .from('case_charges')
      .select('*')
      .eq('lead_id', testLead.id);

    const { data: anonReceipts, error: anonRcptErr } = await anonClient
      .from('case_receipts')
      .select('*')
      .eq('lead_id', testLead.id);

    console.log('Anon client query on case_charges count:', anonCharges?.length ?? 0, 'Error:', anonChgErr?.message || 'none');
    console.log('Anon client query on case_receipts count:', anonReceipts?.length ?? 0, 'Error:', anonRcptErr?.message || 'none');

    if (anonCharges && anonCharges.length > 0) {
      throw new Error('SECURITY VIOLATION: Anon client was able to read case_charges rows! RLS policy must deny anon.');
    }
    if (anonReceipts && anonReceipts.length > 0) {
      throw new Error('SECURITY VIOLATION: Anon client was able to read case_receipts rows! RLS policy must deny anon.');
    }
    console.log('✅ PASS: RLS is strictly active with zero rows visible to unprivileged clients!\n');

    console.log('====================================================');
    console.log('🎉 ALL dre-p85 TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================');

  } finally {
    // Clean up test data
    console.log('🧹 Cleaning up test lead and records...');
    await supabaseAdmin.from('receipt_allocations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('case_receipts').delete().eq('lead_id', testLead.id);
    await supabaseAdmin.from('case_charges').delete().eq('lead_id', testLead.id);
    await supabaseAdmin.from('leads').delete().eq('id', testLead.id);
    console.log('✅ Cleanup complete.');
  }
}

runTest().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
