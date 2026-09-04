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

  console.log('=== All 5 Callback & Session Flow Tests Passed Successfully! ===\n');
}

runTests().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
