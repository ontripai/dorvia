import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runTests() {
  console.log('=== DORVIA Auth Flow & Callback Test Suite (dre-p56) ===\n');

  // Import handlers dynamically after env is loaded
  const adminCallback = await import('../src/app/[lang]/admin/callback/route');
  const portalCallback = await import('../src/app/[lang]/portal/callback/route');
  const sessionHandler = await import('../src/app/api/auth/session/route');

  // -------------------------------------------------------------
  // Test 1: GET /admin/callback with NO query params (Implicit flow)
  // -------------------------------------------------------------
  console.log('1. Testing GET /fa/admin/callback without query params (implicit flow landing)...');
  const req1 = new Request('https://dorvia.ro/fa/admin/callback', { method: 'GET' });
  const res1 = await adminCallback.GET(req1, { params: { lang: 'fa' } });

  console.log('Status:', res1.status);
  console.log('Content-Type:', res1.headers.get('content-type'));
  const html1 = await res1.text();
  const hasHashExtractor = html1.includes('window.location.hash') && html1.includes('/api/auth/session');

  if (res1.status === 200 && hasHashExtractor) {
    console.log('✅ PASS: Admin callback serves client-side hash extractor instead of premature redirect!\n');
  } else {
    console.error('❌ FAIL: Admin callback did not serve hash extractor HTML.');
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test 2: GET /portal/callback with NO query params (Implicit flow)
  // -------------------------------------------------------------
  console.log('2. Testing GET /fa/portal/callback without query params (implicit flow landing)...');
  const req2 = new Request('https://dorvia.ro/fa/portal/callback', { method: 'GET' });
  const res2 = await portalCallback.GET(req2, { params: { lang: 'fa' } });

  console.log('Status:', res2.status);
  console.log('Content-Type:', res2.headers.get('content-type'));
  const html2 = await res2.text();
  const hasPortalHashExtractor = html2.includes('window.location.hash') && html2.includes("flow: 'portal'");

  if (res2.status === 200 && hasPortalHashExtractor) {
    console.log('✅ PASS: Portal callback serves client-side hash extractor!\n');
  } else {
    console.error('❌ FAIL: Portal callback did not serve hash extractor HTML.');
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test 3: POST /api/auth/session with invalid token
  // -------------------------------------------------------------
  console.log('3. Testing POST /api/auth/session with invalid token...');
  const req3 = new Request('https://dorvia.ro/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: 'invalid_token_12345',
      refresh_token: 'invalid_refresh',
      flow: 'admin',
      lang: 'fa',
    }),
  });
  const res3 = await sessionHandler.POST(req3);
  const data3 = await res3.json();
  console.log('Status:', res3.status, 'Body:', data3);

  if (res3.status === 401 && data3.error === 'invalid_link') {
    console.log('✅ PASS: Invalid token correctly rejected with 401 invalid_link!\n');
  } else {
    console.error('❌ FAIL: Invalid token check failed.');
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test 4: Real token exchange for active admin (ontrip.ai@gmail.com)
  // -------------------------------------------------------------
  console.log('4. Generating real magic link and testing POST /api/auth/session for active admin (ontrip.ai@gmail.com)...');
  const linkRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: 'ontrip.ai@gmail.com',
    options: { redirectTo: 'https://dorvia.ro/fa/admin/callback' },
  });

  const actionLink = linkRes.data?.properties?.action_link;
  if (!actionLink) {
    console.error('❌ Failed to generate action link.');
    process.exit(1);
  }

  // Follow verify endpoint to retrieve redirect location and hash fragment
  const verifyRes = await fetch(actionLink, { method: 'GET', redirect: 'manual' });
  const location = verifyRes.headers.get('location') || '';
  const hash = location.split('#')[1] || '';
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken) {
    console.error('❌ Failed to retrieve access_token from Supabase verify redirect.');
    process.exit(1);
  }

  console.log('Extracted valid access_token from Supabase verify URL fragment.');

  const req4 = new Request('https://dorvia.ro/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      flow: 'admin',
      lang: 'fa',
    }),
  });

  const res4 = await sessionHandler.POST(req4);
  const data4 = await res4.json();
  console.log('Status:', res4.status);
  console.log('Body:', data4);

  if (res4.status === 200 && data4.success && data4.redirectTo === '/fa/admin/leads') {
    console.log('✅ PASS: Real admin session successfully established and routed to /fa/admin/leads!\n');
  } else {
    console.error('❌ FAIL: Active admin session establishment failed.');
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test 5: Unauthorized non-admin user in admin flow
  // -------------------------------------------------------------
  console.log('5. Testing POST /api/auth/session for non-admin email in admin flow...');
  // Create a temporary non-admin user
  const tempEmail = `nonadmin-${Date.now()}@dorvia.ro`;
  const tempUser = await supabaseAdmin.auth.admin.createUser({
    email: tempEmail,
    email_confirm: true,
  });

  const nonAdminLink = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: tempEmail,
    options: { redirectTo: 'https://dorvia.ro/fa/admin/callback' },
  });

  const nonAdminVerify = await fetch(nonAdminLink.data?.properties?.action_link!, {
    method: 'GET',
    redirect: 'manual',
  });
  const nonAdminHash = (nonAdminVerify.headers.get('location') || '').split('#')[1] || '';
  const nonAdminParams = new URLSearchParams(nonAdminHash);
  const nonAdminToken = nonAdminParams.get('access_token');
  const nonAdminRefresh = nonAdminParams.get('refresh_token');

  const req5 = new Request('https://dorvia.ro/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: nonAdminToken,
      refresh_token: nonAdminRefresh,
      flow: 'admin',
      lang: 'fa',
    }),
  });

  const res5 = await sessionHandler.POST(req5);
  const data5 = await res5.json();
  console.log('Status:', res5.status, 'Body:', data5);

  // Clean up temporary user
  if (tempUser.data?.user?.id) {
    await supabaseAdmin.auth.admin.deleteUser(tempUser.data.user.id);
  }

  if (res5.status === 403 && data5.error === 'unauthorized' && data5.redirectTo?.includes('error=unauthorized')) {
    console.log('✅ PASS: Non-admin user correctly rejected with 403 unauthorized!\n');
  } else {
    console.error('❌ FAIL: Unauthorized admin access check failed.');
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test 6: Real token exchange for invited portal lead (dre-p58)
  // -------------------------------------------------------------
  console.log('6. Testing portal magic-link flow for invited lead (dre-p58)...');
  const portalTestEmail = `portal.test.${Date.now()}@dorvia.com`;

  // Create a verified & invited lead in `leads` table with user_id = null
  const { data: createdLead, error: createLeadErr } = await supabaseAdmin
    .from('leads')
    .insert([
      {
        full_name: 'کاربر تستی پورتال (dre-p58)',
        email: portalTestEmail,
        phone: '+40727000111',
        source: 'telegram_bot',
        site_goal: 'study',
        status: 'qualified',
        verified_at: new Date().toISOString(),
        invited_at: new Date().toISOString(),
        raw_meta: { testFlow: 'dre-p58' },
      },
    ])
    .select('*')
    .single();

  if (createLeadErr || !createdLead) {
    console.error('❌ Failed to insert test lead for portal flow:', createLeadErr);
    process.exit(1);
  }
  console.log('Created test lead record:', createdLead.id, createdLead.email);

  // Generate magic link using supabaseAdmin.auth.admin
  const portalLinkRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: portalTestEmail,
    options: { redirectTo: 'https://dorvia.ro/fa/portal/callback' },
  });

  const portalActionLink = portalLinkRes.data?.properties?.action_link;
  const portalAuthUserId = portalLinkRes.data?.user?.id;
  if (!portalActionLink || !portalAuthUserId) {
    console.error('❌ Failed to generate portal action link:', portalLinkRes.error);
    process.exit(1);
  }

  // Follow verify endpoint to retrieve hash fragment
  const portalVerifyRes = await fetch(portalActionLink, { method: 'GET', redirect: 'manual' });
  const portalLocation = portalVerifyRes.headers.get('location') || '';
  const portalHash = portalLocation.split('#')[1] || '';
  const portalParams = new URLSearchParams(portalHash);
  const portalAccessToken = portalParams.get('access_token');
  const portalRefreshToken = portalParams.get('refresh_token');

  if (!portalAccessToken) {
    console.error('❌ Failed to extract access_token from portal magic link redirect.');
    process.exit(1);
  }

  console.log('Extracted valid access_token from portal link fragment.');

  // Call POST /api/auth/session with flow: 'portal'
  const req6 = new Request('https://dorvia.ro/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: portalAccessToken,
      refresh_token: portalRefreshToken,
      flow: 'portal',
      lang: 'fa',
    }),
  });

  const res6 = await sessionHandler.POST(req6);
  const data6 = await res6.json();
  console.log('Status:', res6.status);
  console.log('Body:', data6);

  if (res6.status !== 200 || !data6.success || data6.redirectTo !== '/fa/portal/dashboard') {
    console.error('❌ FAIL: Portal session establishment did not return success and /fa/portal/dashboard.');
    process.exit(1);
  }
  console.log('✅ PASS: POST /api/auth/session returned success with redirectTo: /fa/portal/dashboard');

  // Verify that leads.user_id is now populated with portalAuthUserId via direct DB query
  const { data: verifyLead, error: verifyLeadErr } = await supabaseAdmin
    .from('leads')
    .select('id, email, user_id, invited_at')
    .eq('id', createdLead.id)
    .single();

  if (verifyLeadErr || !verifyLead) {
    console.error('❌ FAIL: Could not query lead after portal auth:', verifyLeadErr);
    process.exit(1);
  }

  console.log('Queried lead from DB:', verifyLead);
  if (verifyLead.user_id === portalAuthUserId) {
    console.log(`✅ PASS: leads.user_id was correctly linked to auth.users ID (${portalAuthUserId})!\n`);
  } else {
    console.error(`❌ FAIL: leads.user_id is ${verifyLead.user_id}, expected ${portalAuthUserId}`);
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test 7: GET /api/portal/dashboard with authenticated user session
  // -------------------------------------------------------------
  console.log('7. Testing GET /api/portal/dashboard with authenticated user session...');
  const portalDashboardHandler = await import('../src/app/api/portal/dashboard/route');

  const cookiesList = res6.cookies?.getAll ? res6.cookies.getAll() : [];
  const cookieHeader = cookiesList.map((c: any) => `${c.name}=${c.value}`).join('; ');

  const req7 = new Request('https://dorvia.ro/api/portal/dashboard', {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
    },
  });

  const res7 = await portalDashboardHandler.GET(req7);
  const data7 = await res7.json();
  console.log('Status:', res7.status);
  console.log('Body summary:', { success: data7.success, leadId: data7.lead?.id, messagesCount: data7.messages?.length });

  if (res7.status === 200 && data7.success && data7.lead?.id === createdLead.id) {
    console.log('✅ PASS: GET /api/portal/dashboard returned authorized lead data using session cookies!\n');
  } else {
    console.error('❌ FAIL: GET /api/portal/dashboard did not return expected lead data.');
    process.exit(1);
  }

  // Cleanup test user and lead
  await supabaseAdmin.auth.admin.deleteUser(portalAuthUserId);
  await supabaseAdmin.from('leads').delete().eq('id', createdLead.id);
  console.log('Cleaned up test user and lead.\n');

  console.log('=== All 7 Callback, Portal & Session Flow Tests Passed Successfully! ===\n');
}

runTests().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
