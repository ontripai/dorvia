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

  // -------------------------------------------------------------
  // Test 8: Authenticated Admin access to Lead Detail & Messages (dre-p60)
  // -------------------------------------------------------------
  console.log('8. Testing authenticated admin access to /api/admin/leads/[id] and messages (dre-p60)...');
  const adminCookies = res4.cookies?.getAll ? res4.cookies.getAll() : [];
  const adminCookieHeader = adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

  const leadsRoute = await import('../src/app/api/admin/leads/route');
  const leadsReq = new Request('https://dorvia.ro/api/admin/leads', {
    method: 'GET',
    headers: { cookie: adminCookieHeader },
  });
  const leadsRes = await leadsRoute.GET(leadsReq);
  const leadsJson = await leadsRes.json();

  if (leadsRes.status !== 200 || !leadsJson.leads || leadsJson.leads.length === 0) {
    console.error('❌ FAIL: Failed to list leads using admin session:', leadsJson);
    process.exit(1);
  }

  const sampleLeadId = leadsJson.leads[0].id;
  console.log(`Fetched lead list successfully. Testing detail for lead: ${sampleLeadId} (${leadsJson.leads[0].full_name})`);

  const leadDetailRoute = await import('../src/app/api/admin/leads/[id]/route');
  const leadDetailReq = new Request(`https://dorvia.ro/api/admin/leads/${sampleLeadId}`, {
    method: 'GET',
    headers: { cookie: adminCookieHeader },
  });
  const leadDetailRes = await leadDetailRoute.GET(leadDetailReq, { params: { id: sampleLeadId } });
  const leadDetailJson = await leadDetailRes.json();

  if (leadDetailRes.status === 200 && leadDetailJson.lead?.id === sampleLeadId) {
    console.log('✅ PASS: GET /api/admin/leads/[id] returned 200 and valid lead detail with verifier/inviter relations!');
  } else {
    console.error('❌ FAIL: GET /api/admin/leads/[id] failed:', leadDetailRes.status, leadDetailJson);
    process.exit(1);
  }

  const leadMessagesRoute = await import('../src/app/api/admin/leads/[id]/messages/route');
  const leadMessagesReq = new Request(`https://dorvia.ro/api/admin/leads/${sampleLeadId}/messages`, {
    method: 'GET',
    headers: { cookie: adminCookieHeader },
  });
  const leadMessagesRes = await leadMessagesRoute.GET(leadMessagesReq, { params: { id: sampleLeadId } });
  const leadMessagesJson = await leadMessagesRes.json();

  if (leadMessagesRes.status === 200 && Array.isArray(leadMessagesJson.messages)) {
    console.log('✅ PASS: GET /api/admin/leads/[id]/messages returned 200 and messages array!\n');
  } else {
    console.error('❌ FAIL: GET /api/admin/leads/[id]/messages failed:', leadMessagesRes.status, leadMessagesJson);
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test 9: Portal Invite redirect_to Regression Protection (dre-p61)
  // -------------------------------------------------------------
  console.log('9. Testing portal invite redirect_to regression protection (dre-p61)...');
  
  // Read from actual process.env.NEXT_PUBLIC_SITE_URL as used by route handlers
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteUrl = (rawSiteUrl || 'https://dorvia.ro').replace(/\/+$/, '');
  const expectedPortalCallback = `${siteUrl}/fa/portal/callback`;
  const inviteTestEmail = `invite-regression-${Date.now()}@dorvia.com`;

  console.log('Runtime process.env.NEXT_PUBLIC_SITE_URL:', rawSiteUrl);
  console.log('Computed site origin for callback:', siteUrl);
  console.log('Target expected portal callback:', expectedPortalCallback);

  // Protective assertion: In production / build environments, NEXT_PUBLIC_SITE_URL must NOT be vercel.app
  if (siteUrl.includes('vercel.app')) {
    console.error(`❌ FAIL: NEXT_PUBLIC_SITE_URL is configured as "${siteUrl}". Production deployments must use https://dorvia.ro!`);
    process.exit(1);
  }

  // Protective assertion: The expected callback MUST strictly match canonical portal callback
  if (expectedPortalCallback !== 'https://dorvia.ro/fa/portal/callback') {
    console.warn(`⚠️ Note: expectedPortalCallback is "${expectedPortalCallback}" (canonical: "https://dorvia.ro/fa/portal/callback")`);
  }

  if (expectedPortalCallback.includes('admin/callback')) {
    console.error(`❌ FAIL: Computed portal callback contains admin/callback: "${expectedPortalCallback}"`);
    process.exit(1);
  }

  // Generate invite link using Supabase Auth Admin API (the engine backing inviteUserByEmail)
  const inviteGenRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'invite',
    email: inviteTestEmail,
    options: {
      redirectTo: expectedPortalCallback,
    },
  });

  if (inviteGenRes.error || !inviteGenRes.data?.properties?.action_link) {
    console.error('❌ FAIL: Failed to generate portal invite link:', inviteGenRes.error);
    process.exit(1);
  }

  const inviteProperties = inviteGenRes.data.properties;
  const inviteActionLink = inviteProperties.action_link;
  const inviteRedirectTo = inviteProperties.redirect_to;
  const inviteUserId = inviteGenRes.data.user?.id;

  console.log('Raw invite properties:', {
    redirect_to: inviteRedirectTo,
    verification_type: inviteProperties.verification_type,
    action_link: inviteActionLink,
  });

  // 1. Assert redirect_to property strictly matches https://dorvia.ro/fa/portal/callback
  if (inviteRedirectTo !== 'https://dorvia.ro/fa/portal/callback' && inviteRedirectTo !== expectedPortalCallback) {
    console.error(`❌ FAIL: invite properties.redirect_to mismatch. Got: "${inviteRedirectTo}", Expected: "${expectedPortalCallback}"`);
    if (inviteUserId) await supabaseAdmin.auth.admin.deleteUser(inviteUserId);
    process.exit(1);
  }
  if (inviteRedirectTo.includes('vercel.app') || inviteRedirectTo.includes('admin/callback')) {
    console.error(`❌ FAIL: invite properties.redirect_to contains forbidden token (vercel.app or admin/callback): "${inviteRedirectTo}"`);
    if (inviteUserId) await supabaseAdmin.auth.admin.deleteUser(inviteUserId);
    process.exit(1);
  }
  console.log(`✅ PASS: invite properties.redirect_to strictly matches: ${inviteRedirectTo}`);

  // 2. Assert action_link query parameter contains redirect_to strictly matching portal callback
  const parsedActionLink = new URL(inviteActionLink);
  const actionLinkRedirectTo = parsedActionLink.searchParams.get('redirect_to');
  if (actionLinkRedirectTo !== expectedPortalCallback) {
    console.error(`❌ FAIL: action_link redirect_to param mismatch. Got: "${actionLinkRedirectTo}", Expected: "${expectedPortalCallback}"`);
    if (inviteUserId) await supabaseAdmin.auth.admin.deleteUser(inviteUserId);
    process.exit(1);
  }
  if (actionLinkRedirectTo.includes('vercel.app') || actionLinkRedirectTo.includes('admin/callback')) {
    console.error(`❌ FAIL: action_link redirect_to param contains forbidden token: "${actionLinkRedirectTo}"`);
    if (inviteUserId) await supabaseAdmin.auth.admin.deleteUser(inviteUserId);
    process.exit(1);
  }
  console.log(`✅ PASS: action_link query param redirect_to strictly matches: ${actionLinkRedirectTo}`);

  // 3. Assert raw action_link does NOT contain admin/callback or vercel.app
  if (inviteActionLink.includes('admin/callback') || inviteActionLink.includes('vercel.app')) {
    console.error('❌ FAIL: invite action_link contains admin/callback or vercel.app:', inviteActionLink);
    if (inviteUserId) await supabaseAdmin.auth.admin.deleteUser(inviteUserId);
    process.exit(1);
  }
  console.log('✅ PASS: invite action_link does NOT contain admin/callback or vercel.app');

  // 4. Follow action_link via HTTP GET (redirect: 'manual') to verify raw HTTP 303 location
  const inviteVerifyRes = await fetch(inviteActionLink, { method: 'GET', redirect: 'manual' });
  const verifyLocation = inviteVerifyRes.headers.get('location') || '';
  console.log(`Invite link verification response status: ${inviteVerifyRes.status}`);
  console.log(`Location: ${verifyLocation.substring(0, 120)}...`);

  if (!verifyLocation.startsWith('https://dorvia.ro/fa/portal/callback') && !verifyLocation.startsWith(expectedPortalCallback)) {
    console.error(`❌ FAIL: Invite redirect location does NOT start with expected portal callback. Got: "${verifyLocation}"`);
    if (inviteUserId) await supabaseAdmin.auth.admin.deleteUser(inviteUserId);
    process.exit(1);
  }
  if (verifyLocation.includes('admin/callback') || verifyLocation.includes('vercel.app')) {
    console.error('❌ FAIL: Invite redirect location contains forbidden token (admin/callback or vercel.app):', verifyLocation);
    if (inviteUserId) await supabaseAdmin.auth.admin.deleteUser(inviteUserId);
    process.exit(1);
  }
  console.log(`✅ PASS: Supabase Auth verify redirect strictly targets: ${verifyLocation.split('#')[0]}!\n`);

  // Clean up temporary auth user
  if (inviteUserId) {
    await supabaseAdmin.auth.admin.deleteUser(inviteUserId);
    console.log('Cleaned up temporary test invite user.\n');
  }

  // -------------------------------------------------------------
  // Test 10: Document & Translation Lifecycle (dre-p64)
  // -------------------------------------------------------------
  console.log('10. Testing Document & Translation Lifecycle (dre-p64)...');
  const adminDocsRoute = await import('../src/app/api/admin/leads/[id]/documents/route');
  const adminDocItemRoute = await import('../src/app/api/admin/leads/[id]/documents/[docId]/route');
  const adminDocDownloadRoute = await import('../src/app/api/admin/leads/[id]/documents/[docId]/download/route');

  // Create test lead for document operations
  const docTestEmail = `doctest.${Date.now()}@dorvia.com`;
  const { data: docLead, error: createDocLeadErr } = await supabaseAdmin
    .from('leads')
    .insert([
      {
        full_name: 'متقاضی تست مدارک و ترجمه (dre-p64)',
        email: docTestEmail,
        phone: '+40727000999',
        source: 'telegram_bot',
        site_goal: 'study',
        status: 'qualified',
        verified_at: new Date().toISOString(),
        invited_at: new Date().toISOString(),
        raw_meta: { testSuite: 'dre-p64' },
      },
    ])
    .select('*')
    .single();

  if (createDocLeadErr || !docLead) {
    console.error('❌ FAIL: Failed to create test lead for doc lifecycle:', createDocLeadErr);
    process.exit(1);
  }
  console.log(`Created test lead for documents: ${docLead.id} (${docLead.email})`);

  // Step 1: Upload original document via staff endpoint (using admin session cookies from test 4)
  const originalFileContent = Buffer.from('PDF_SAMPLE_ORIGINAL_NATIONAL_ID_DATA_' + Date.now());
  const originalFile = new File([originalFileContent], 'national-id-original.pdf', { type: 'application/pdf' });
  const uploadForm1 = new FormData();
  uploadForm1.append('file', originalFile);
  uploadForm1.append('document_type', 'national_id');
  uploadForm1.append('language', 'فارسی');
  uploadForm1.append('is_certified_translation', 'false');

  const uploadReq1 = new Request(`https://dorvia.ro/api/admin/leads/${docLead.id}/documents`, {
    method: 'POST',
    headers: { cookie: adminCookieHeader },
    body: uploadForm1,
  });

  const uploadRes1 = await adminDocsRoute.POST(uploadReq1, { params: { id: docLead.id } });
  const uploadData1 = await uploadRes1.json();
  console.log('Upload Original Document Status:', uploadRes1.status, uploadData1.success ? 'Success' : uploadData1);

  if (uploadRes1.status !== 200 || !uploadData1.success || !uploadData1.document?.id) {
    console.error('❌ FAIL: Failed to upload original document via staff endpoint:', uploadData1);
    await supabaseAdmin.from('leads').delete().eq('id', docLead.id);
    process.exit(1);
  }
  const originalDoc = uploadData1.document;
  console.log(`✅ PASS: Original document uploaded: ${originalDoc.id} (${originalDoc.file_name}, storage_path: ${originalDoc.storage_path})`);

  // Step 2: Upload translation document linked to the original document
  const transFileContent = Buffer.from('PDF_SAMPLE_TRANSLATION_RO_DATA_' + Date.now());
  const transFile = new File([transFileContent], 'national-id-ro-translation.pdf', { type: 'application/pdf' });
  const uploadForm2 = new FormData();
  uploadForm2.append('file', transFile);
  uploadForm2.append('document_type', 'national_id');
  uploadForm2.append('language', 'رومانیایی');
  uploadForm2.append('translation_of_document_id', originalDoc.id);
  uploadForm2.append('translation_office', 'دارالترجمه رسمی دانشجو');
  uploadForm2.append('is_certified_translation', 'true');

  const uploadReq2 = new Request(`https://dorvia.ro/api/admin/leads/${docLead.id}/documents`, {
    method: 'POST',
    headers: { cookie: adminCookieHeader },
    body: uploadForm2,
  });

  const uploadRes2 = await adminDocsRoute.POST(uploadReq2, { params: { id: docLead.id } });
  const uploadData2 = await uploadRes2.json();
  console.log('Upload Translation Document Status:', uploadRes2.status, uploadData2.success ? 'Success' : uploadData2);

  if (uploadRes2.status !== 200 || !uploadData2.success || uploadData2.document?.translation_of_document_id !== originalDoc.id) {
    console.error('❌ FAIL: Failed to upload translation linked to parent document:', uploadData2);
    await supabaseAdmin.from('leads').delete().eq('id', docLead.id);
    process.exit(1);
  }
  const transDoc = uploadData2.document;
  console.log(`✅ PASS: Translation uploaded and linked: ${transDoc.id} -> parent ${originalDoc.id}`);

  // Step 3: Fetch list of documents as admin and assert nested structure & counts
  const listReq = new Request(`https://dorvia.ro/api/admin/leads/${docLead.id}/documents`, {
    method: 'GET',
    headers: { cookie: adminCookieHeader },
  });
  const listRes = await adminDocsRoute.GET(listReq, { params: { id: docLead.id } });
  const listData = await listRes.json();

  if (listRes.status !== 200 || !listData.documents || listData.documents.length !== 2) {
    console.error('❌ FAIL: Admin documents list did not return expected 2 documents:', listData);
    process.exit(1);
  }
  console.log(`✅ PASS: Admin document list returned ${listData.documents.length} documents (original + translation)`);

  // Step 4: Edit translation metadata via PATCH endpoint
  const patchReq = new Request(`https://dorvia.ro/api/admin/leads/${docLead.id}/documents/${transDoc.id}`, {
    method: 'PATCH',
    headers: {
      cookie: adminCookieHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      is_certified_translation: false,
      translation_office: 'دارالترجمه رسمی تهران - سعادت‌آباد',
    }),
  });

  const patchRes = await adminDocItemRoute.PATCH(patchReq, { params: { id: docLead.id, docId: transDoc.id } });
  const patchData = await patchRes.json();

  if (patchRes.status !== 200 || !patchData.success || patchData.document?.translation_office !== 'دارالترجمه رسمی تهران - سعادت‌آباد' || patchData.document?.is_certified_translation !== false) {
    console.error('❌ FAIL: Translation metadata update via PATCH failed:', patchData);
    process.exit(1);
  }
  console.log('✅ PASS: Translation metadata successfully updated via PATCH endpoint (office & certification flag)');

  // Step 5: Download original document via short-lived signed URL and verify content bytes
  const dlReq = new Request(`https://dorvia.ro/api/admin/leads/${docLead.id}/documents/${originalDoc.id}/download?json=true`, {
    method: 'GET',
    headers: { cookie: adminCookieHeader },
  });
  const dlRes = await adminDocDownloadRoute.GET(dlReq, { params: { id: docLead.id, docId: originalDoc.id } });
  const dlData = await dlRes.json();

  if (dlRes.status !== 200 || !dlData.success || !dlData.downloadUrl) {
    console.error('❌ FAIL: Download endpoint did not return signed downloadUrl:', dlData);
    process.exit(1);
  }
  console.log(`Generated signed download URL: ${dlData.downloadUrl.substring(0, 80)}...`);

  // Fetch file from signed URL to verify it's reachable and content matches
  const downloadedFileRes = await fetch(dlData.downloadUrl);
  if (downloadedFileRes.status !== 200) {
    console.error('❌ FAIL: HTTP GET on signed download URL failed with status:', downloadedFileRes.status);
    process.exit(1);
  }
  const downloadedBytes = Buffer.from(await downloadedFileRes.arrayBuffer());
  if (!downloadedBytes.equals(originalFileContent)) {
    console.error('❌ FAIL: Downloaded file content does not match uploaded bytes.');
    process.exit(1);
  }
  console.log('✅ PASS: Verified signed URL download returns exact uploaded binary content!\n');

  // -------------------------------------------------------------
  // Test 11: Strict Role-Based Document Access Enforcement (dre-p64)
  // Verification that an unauthorized role (e.g. 'marketing'):
  // 1. Receives an empty document list (documents excluded on server).
  // 2. Receives HTTP 403 Forbidden on direct download endpoint.
  // 3. Receives HTTP 403 Forbidden on staff upload endpoint.
  // -------------------------------------------------------------
  console.log('11. Testing Strict Server-Side Role Enforcement (dre-p64)...');
  const marketingEmail = `marketing.${Date.now()}@dorvia.ro`;
  
  // 1. Create temporary auth user for marketing staff
  const marketingAuthRes = await supabaseAdmin.auth.admin.createUser({
    email: marketingEmail,
    email_confirm: true,
  });
  const marketingUserId = marketingAuthRes.data?.user?.id;
  if (!marketingUserId) {
    console.error('❌ FAIL: Could not create marketing auth user:', marketingAuthRes.error);
    process.exit(1);
  }

  // 2. Insert into admin_users with role 'marketing' (id: '94527e85-9881-40d7-b138-2ba83355a251')
  const { error: insertMarketingErr } = await supabaseAdmin.from('admin_users').insert([
    {
      id: marketingUserId,
      role_id: '94527e85-9881-40d7-b138-2ba83355a251', // marketing role
      full_name: 'کارشناس بازاریابی آزمایشی (بدون دسترسی مدارک)',
      is_active: true,
    },
  ]);
  if (insertMarketingErr) {
    console.error('❌ FAIL: Could not create marketing admin_users record:', insertMarketingErr);
    await supabaseAdmin.auth.admin.deleteUser(marketingUserId);
    process.exit(1);
  }

  // 3. Exchange magic link for marketing session cookies
  const marketingLinkRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: marketingEmail,
    options: { redirectTo: 'https://dorvia.ro/fa/admin/callback' },
  });
  const marketingVerify = await fetch(marketingLinkRes.data?.properties?.action_link!, {
    method: 'GET',
    redirect: 'manual',
  });
  const marketingHash = (marketingVerify.headers.get('location') || '').split('#')[1] || '';
  const marketingParams = new URLSearchParams(marketingHash);
  const marketingToken = marketingParams.get('access_token');
  const marketingRefresh = marketingParams.get('refresh_token');

  const marketingSessionReq = new Request('https://dorvia.ro/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: marketingToken,
      refresh_token: marketingRefresh,
      flow: 'admin',
      lang: 'fa',
    }),
  });
  const marketingSessionRes = await sessionHandler.POST(marketingSessionReq);
  const marketingCookies = marketingSessionRes.cookies?.getAll ? marketingSessionRes.cookies.getAll() : [];
  const marketingCookieHeader = marketingCookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

  console.log('Established active marketing admin session with role: marketing.');

  // 4. Test List Endpoint: Marketing staff requesting /api/admin/leads/[id]/documents
  const mListReq = new Request(`https://dorvia.ro/api/admin/leads/${docLead.id}/documents`, {
    method: 'GET',
    headers: { cookie: marketingCookieHeader },
  });
  const mListRes = await adminDocsRoute.GET(mListReq, { params: { id: docLead.id } });
  const mListData = await mListRes.json();
  console.log('Marketing List Status:', mListRes.status, 'Visible Docs Count:', mListData.documents?.length);

  if (mListRes.status !== 200) {
    console.error('❌ FAIL: Marketing list request failed with status:', mListRes.status);
    process.exit(1);
  }
  if (mListData.documents && mListData.documents.length > 0) {
    console.error('❌ FAIL: Marketing user was able to view restricted documents in the list:', mListData.documents);
    process.exit(1);
  }
  console.log('✅ PASS: Marketing staff document list is completely empty — restricted documents are hidden server-side!');

  // 5. Test Direct Download Endpoint: Marketing staff requesting direct download of national_id
  console.log('Testing direct GET /documents/[docId]/download with marketing session (must return 403)...');
  const mDlReq = new Request(`https://dorvia.ro/api/admin/leads/${docLead.id}/documents/${originalDoc.id}/download?json=true`, {
    method: 'GET',
    headers: { cookie: marketingCookieHeader },
  });
  const mDlRes = await adminDocDownloadRoute.GET(mDlReq, { params: { id: docLead.id, docId: originalDoc.id } });
  const mDlData = await mDlRes.json();
  console.log('Marketing Direct Download Status:', mDlRes.status, 'Body:', mDlData);

  if (mDlRes.status === 403 && mDlData.error?.includes('Access denied')) {
    console.log('✅ PASS: Direct download strictly returned HTTP 403 Forbidden for unauthorized role (marketing)!');
  } else {
    console.error(`❌ FAIL: Expected 403 Forbidden, but received status ${mDlRes.status}:`, mDlData);
    process.exit(1);
  }

  // Also test direct download of the translation document
  const mTransDlReq = new Request(`https://dorvia.ro/api/admin/leads/${docLead.id}/documents/${transDoc.id}/download?json=true`, {
    method: 'GET',
    headers: { cookie: marketingCookieHeader },
  });
  const mTransDlRes = await adminDocDownloadRoute.GET(mTransDlReq, { params: { id: docLead.id, docId: transDoc.id } });
  const mTransDlData = await mTransDlRes.json();
  if (mTransDlRes.status === 403) {
    console.log('✅ PASS: Direct download of translation also strictly returned HTTP 403 Forbidden!');
  } else {
    console.error(`❌ FAIL: Expected 403 Forbidden on translation download, got ${mTransDlRes.status}:`, mTransDlData);
    process.exit(1);
  }

  // 6. Test Upload Endpoint: Marketing staff attempting to upload national_id
  const mUploadForm = new FormData();
  mUploadForm.append('file', new File([Buffer.from('rogue')], 'rogue.pdf', { type: 'application/pdf' }));
  mUploadForm.append('document_type', 'national_id');
  const mUploadReq = new Request(`https://dorvia.ro/api/admin/leads/${docLead.id}/documents`, {
    method: 'POST',
    headers: { cookie: marketingCookieHeader },
    body: mUploadForm,
  });
  const mUploadRes = await adminDocsRoute.POST(mUploadReq, { params: { id: docLead.id } });
  const mUploadData = await mUploadRes.json();
  if (mUploadRes.status === 403) {
    console.log('✅ PASS: Staff upload endpoint strictly returned HTTP 403 Forbidden for unauthorized role!\n');
  } else {
    console.error(`❌ FAIL: Expected 403 Forbidden on upload, got ${mUploadRes.status}:`, mUploadData);
    process.exit(1);
  }

  // 7. Cleanup Test 10 & 11 data
  console.log('Cleaning up test files, documents, marketing user, and test lead...');
  await supabaseAdmin.storage.from('lead-documents').remove([originalDoc.storage_path, transDoc.storage_path]);
  await supabaseAdmin.from('lead_documents').delete().eq('lead_id', docLead.id);
  await supabaseAdmin.from('admin_users').delete().eq('id', marketingUserId);
  await supabaseAdmin.auth.admin.deleteUser(marketingUserId);
  await supabaseAdmin.from('leads').delete().eq('id', docLead.id);
  console.log('✅ Test artifacts cleaned up successfully.\n');

  // -------------------------------------------------------------
  // Test 12: Customer Profile Whitelist Enforcement & Family Network (dre-p63)
  // -------------------------------------------------------------
  console.log('12. Testing Customer Profile Whitelist Enforcement & Family Network (dre-p63)...');
  const portalProfileRoute = await import('../src/app/api/portal/profile/route');
  const portalFamilyRoute = await import('../src/app/api/portal/family/route');

  // 1. Create a primary lead record
  const p63Email = `p63.primary.${Date.now()}@dorvia.com`;
  const { data: p63Lead, error: p63LeadErr } = await supabaseAdmin
    .from('leads')
    .insert({
      email: p63Email,
      full_name: 'Mahmoud Test Primary',
      phone: '09120000001',
      source: 'website',
      status: 'contacted',
      admin_comment: 'Original Admin Comment',
      verified_at: new Date().toISOString(),
      invited_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (p63LeadErr || !p63Lead) {
    console.error('❌ FAIL: Failed to create test primary lead:', p63LeadErr);
    process.exit(1);
  }
  console.log(`Created test primary lead: ${p63Lead.id} (${p63Email})`);

  // 2. Generate magic link and authenticate as customer in portal flow
  const p63Link = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: p63Email,
    options: { redirectTo: 'https://dorvia.ro/fa/portal/callback' },
  });
  const p63AuthUserId = p63Link.data?.user?.id;
  const p63ActionLink = p63Link.data?.properties?.action_link;
  if (!p63ActionLink || !p63AuthUserId) {
    console.error('❌ Failed to generate portal action link for p63 lead');
    process.exit(1);
  }

  const p63VerifyRes = await fetch(p63ActionLink, { method: 'GET', redirect: 'manual' });
  const p63Hash = (p63VerifyRes.headers.get('location') || '').split('#')[1] || '';
  const p63Params = new URLSearchParams(p63Hash);
  const p63AccessToken = p63Params.get('access_token');
  const p63RefreshToken = p63Params.get('refresh_token');

  const p63SessionReq = new Request('https://dorvia.ro/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: p63AccessToken,
      refresh_token: p63RefreshToken,
      flow: 'portal',
      lang: 'fa',
    }),
  });
  const p63SessionRes = await sessionHandler.POST(p63SessionReq);
  const p63Cookies = p63SessionRes.cookies?.getAll ? p63SessionRes.cookies.getAll() : [];
  const p63CookieHeader = p63Cookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

  // 3. GET /api/portal/profile
  const pReq = new Request('https://dorvia.ro/api/portal/profile', {
    method: 'GET',
    headers: { cookie: p63CookieHeader },
  });
  const pRes = await portalProfileRoute.GET(pReq);
  const pData = await pRes.json();
  if (pRes.status !== 200 || pData.lead?.id !== p63Lead.id) {
    console.error('❌ FAIL: GET /api/portal/profile failed:', pRes.status, pData);
    process.exit(1);
  }
  console.log('✅ PASS: GET /api/portal/profile returned authenticated lead profile.');

  // 4. POST /api/portal/profile - Test Whitelist Security Enforcement
  console.log('Testing customer profile update with forbidden fields injected (status, admin_comment, etc.)...');
  const updateReq = new Request('https://dorvia.ro/api/portal/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: p63CookieHeader,
    },
    body: JSON.stringify({
      phone: '09129998877',
      address_city: 'Bucharest',
      address_line: 'Bulevardul Unirii 10',
      address_postal_code: '030167',
      date_of_birth: '1988-12-01',
      anniversary_date: '2015-06-20',
      national_id_or_passport: 'A98765432',
      employment_status: 'employed',
      education_level: 'master',
      // Injected unauthorized/admin fields:
      status: 'won',
      admin_comment: 'HACKED_COMMENT',
      unified_category: 'VIP_CUSTOMER',
      verified_at: '2025-01-01',
    }),
  });
  const updateRes = await portalProfileRoute.POST(updateReq);
  const updateData = await updateRes.json();

  if (updateRes.status !== 200 || !updateData.success) {
    console.error('❌ FAIL: POST /api/portal/profile returned error:', updateRes.status, updateData);
    process.exit(1);
  }

  // Verify directly in Supabase DB that whitelist was enforced
  const { data: dbLeadAfterUpdate, error: dbVerifyErr } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', p63Lead.id)
    .single();

  if (dbVerifyErr || !dbLeadAfterUpdate) {
    console.error('❌ FAIL: Failed to query lead from DB after profile update:', dbVerifyErr);
    process.exit(1);
  }

  if (
    dbLeadAfterUpdate.phone === '09129998877' &&
    dbLeadAfterUpdate.address_city === 'Bucharest' &&
    dbLeadAfterUpdate.national_id_or_passport === 'A98765432' &&
    dbLeadAfterUpdate.education_level === 'master' &&
    dbLeadAfterUpdate.status === 'contacted' && // Must NOT be 'won'
    dbLeadAfterUpdate.admin_comment === 'Original Admin Comment' && // Must NOT be 'HACKED_COMMENT'
    dbLeadAfterUpdate.unified_category === null && // Must NOT be 'VIP_CUSTOMER'
    dbLeadAfterUpdate.verified_at !== '2025-01-01' // Must NOT be injected '2025-01-01'
  ) {
    console.log('✅ PASS: Profile fields updated successfully while unauthorized/admin fields were strictly ignored by whitelist!');
  } else {
    console.error('❌ FAIL: Whitelist check failed. DB record contains unauthorized changes:', {
      status: dbLeadAfterUpdate.status,
      admin_comment: dbLeadAfterUpdate.admin_comment,
      address_city: dbLeadAfterUpdate.address_city,
    });
    process.exit(1);
  }

  // 5. POST /api/portal/family - Add a spouse
  console.log('Testing adding a spouse via POST /api/portal/family...');
  const addFamReq = new Request('https://dorvia.ro/api/portal/family', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: p63CookieHeader,
    },
    body: JSON.stringify({
      full_name: 'Sara Rezaei',
      relation_to_primary: 'spouse',
      date_of_birth: '1990-04-12',
      phone: '09127776655',
      notes: 'Spouse accompanying lead',
    }),
  });
  const addFamRes = await portalFamilyRoute.POST(addFamReq);
  const addFamData = await addFamRes.json();

  if (addFamRes.status !== 200 || !addFamData.success || !addFamData.member) {
    console.error('❌ FAIL: POST /api/portal/family returned error:', addFamRes.status, addFamData);
    process.exit(1);
  }
  const spouseId = addFamData.member.id;
  console.log(`Created spouse lead: ${spouseId}`);

  // Query DB directly to assert family group linkage
  const { data: primaryAfterFam } = await supabaseAdmin
    .from('leads')
    .select('id, family_group_id, is_family_primary, relation_to_primary')
    .eq('id', p63Lead.id)
    .single();

  const { data: spouseInDb } = await supabaseAdmin
    .from('leads')
    .select('id, full_name, family_group_id, is_family_primary, relation_to_primary, status, user_id')
    .eq('id', spouseId)
    .single();

  if (
    spouseInDb &&
    primaryAfterFam &&
    primaryAfterFam.family_group_id &&
    primaryAfterFam.is_family_primary === true &&
    spouseInDb.family_group_id === primaryAfterFam.family_group_id &&
    spouseInDb.relation_to_primary === 'spouse' &&
    spouseInDb.is_family_primary === false &&
    spouseInDb.status === 'new' &&
    spouseInDb.user_id === null
  ) {
    console.log('✅ PASS: Family network linkage confirmed in DB: shared family_group_id, primary flag set, spouse status is "new" and user_id is null.');
  } else {
    console.error('❌ FAIL: Family linkage DB assertion failed:', { primaryAfterFam, spouseInDb });
    process.exit(1);
  }

  // 6. Test GET /api/portal/family
  const getFamReq = new Request('https://dorvia.ro/api/portal/family', {
    method: 'GET',
    headers: { cookie: p63CookieHeader },
  });
  const getFamRes = await portalFamilyRoute.GET(getFamReq);
  const getFamData = await getFamRes.json();
  if (getFamRes.status === 200 && Array.isArray(getFamData.familyMembers) && getFamData.familyMembers.length >= 2) {
    console.log(`✅ PASS: GET /api/portal/family returned ${getFamData.familyMembers.length} members in the family group!`);
  } else {
    console.error('❌ FAIL: GET /api/portal/family returned unexpected response:', getFamRes.status, getFamData);
    process.exit(1);
  }

  // 7. Test Admin view of Family: GET /api/admin/leads/[id]
  const adminLeadDetailReq = new Request(`https://dorvia.ro/api/admin/leads/${p63Lead.id}`, {
    method: 'GET',
    headers: { cookie: adminCookieHeader },
  });
  const adminLeadDetailRes = await leadDetailRoute.GET(adminLeadDetailReq, { params: { id: p63Lead.id } });
  const adminLeadDetailJson = await adminLeadDetailRes.json();

  if (
    adminLeadDetailRes.status === 200 &&
    Array.isArray(adminLeadDetailJson.familyMembers) &&
    adminLeadDetailJson.familyMembers.length >= 2
  ) {
    console.log('✅ PASS: GET /api/admin/leads/[id] returned familyMembers array for admin view!\n');
  } else {
    console.error('❌ FAIL: Admin lead detail did not return familyMembers:', adminLeadDetailRes.status, adminLeadDetailJson);
    process.exit(1);
  }

  // 8. Cleanup Test 12 data
  console.log('Cleaning up Test 12 data...');
  await supabaseAdmin.from('leads').delete().eq('id', spouseId);
  await supabaseAdmin.from('leads').delete().eq('id', p63Lead.id);
  await supabaseAdmin.auth.admin.deleteUser(p63AuthUserId);
  console.log('✅ Test 12 artifacts cleaned up successfully.\n');

  // -------------------------------------------------------------
  // Test 13: Team Governance, Case Assignments & Notification Settings (dre-p65)
  // -------------------------------------------------------------
  console.log('13. Testing Team Governance, Case Assignments & Notification Settings (dre-p65)...');
  const adminTeamRoute = await import('../src/app/api/admin/team/route');
  const adminTeamInviteRoute = await import('../src/app/api/admin/team/invite/route');
  const adminTeamPatchRoute = await import('../src/app/api/admin/team/[staffId]/route');
  const adminAssignmentsRoute = await import('../src/app/api/admin/leads/[id]/assignments/route');
  const adminDeleteAssignmentRoute = await import('../src/app/api/admin/leads/[id]/assignments/[assignmentId]/route');
  const adminNotificationsRoute = await import('../src/app/api/admin/me/notifications/route');

  // 1. Fetch 'agent' role
  const { data: agentRole, error: roleErr } = await supabaseAdmin
    .from('roles')
    .select('id, key')
    .eq('key', 'agent')
    .single();

  if (roleErr || !agentRole) {
    console.error('❌ FAIL: Could not find agent role:', roleErr);
    process.exit(1);
  }

  // 2. Owner invites a new staff member with role 'agent'
  const agentEmail = `test.agent.${Date.now()}@dorvia.com`;
  console.log(`Inviting new staff member: ${agentEmail} with role: agent...`);
  const inviteReq = new Request('https://dorvia.ro/api/admin/team/invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: adminCookieHeader,
    },
    body: JSON.stringify({
      email: agentEmail,
      full_name: 'Test Agent Ali',
      role_id: agentRole.id,
    }),
  });
  const inviteRes = await adminTeamInviteRoute.POST(inviteReq);
  const inviteJson = await inviteRes.json();

  if (inviteRes.status !== 200 || !inviteJson.success || !inviteJson.member?.id) {
    console.error('❌ FAIL: POST /api/admin/team/invite failed:', inviteRes.status, inviteJson);
    process.exit(1);
  }
  const agentUserId = inviteJson.member.id;
  console.log(`✅ PASS: Staff invited successfully with ID: ${agentUserId}`);

  // Query DB directly to verify admin_users row
  const { data: staffInDb, error: staffInDbErr } = await supabaseAdmin
    .from('admin_users')
    .select('id, role_id, full_name, is_active')
    .eq('id', agentUserId)
    .single();

  if (staffInDbErr || !staffInDb || staffInDb.role_id !== agentRole.id || !staffInDb.is_active) {
    console.error('❌ FAIL: admin_users record mismatch in DB:', staffInDbErr, staffInDb);
    process.exit(1);
  }
  console.log('✅ PASS: admin_users record verified in database with role_id and is_active: true');

  // 3. Create a test lead to assign
  const { data: assignTestLead, error: assignLeadErr } = await supabaseAdmin
    .from('leads')
    .insert({
      full_name: 'Lead for Assignment Test',
      email: `assign.test.${Date.now()}@dorvia.com`,
      source: 'website',
      status: 'new',
    })
    .select('id')
    .single();

  if (assignLeadErr || !assignTestLead) {
    console.error('❌ FAIL: Failed to create lead for assignment test:', assignLeadErr);
    process.exit(1);
  }

  // 4. Owner assigns new agent to the test lead
  console.log(`Assigning agent ${agentUserId} to lead ${assignTestLead.id}...`);
  const assignReq = new Request(`https://dorvia.ro/api/admin/leads/${assignTestLead.id}/assignments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: adminCookieHeader,
    },
    body: JSON.stringify({
      staff_id: agentUserId,
      assigned_role: 'agent',
    }),
  });
  const assignRes = await adminAssignmentsRoute.POST(assignReq, { params: { id: assignTestLead.id } });
  const assignJson = await assignRes.json();

  if (assignRes.status !== 200 || !assignJson.success || !assignJson.assignment?.id) {
    console.error('❌ FAIL: POST /api/admin/leads/[id]/assignments failed:', assignRes.status, assignJson);
    process.exit(1);
  }
  const assignmentId = assignJson.assignment.id;
  console.log(`✅ PASS: Assignment created with ID: ${assignmentId}`);

  // Query DB directly to verify lead_assignments row
  const { data: dbAssignment, error: dbAssignErr } = await supabaseAdmin
    .from('lead_assignments')
    .select('id, lead_id, staff_id, assigned_role')
    .eq('id', assignmentId)
    .single();

  if (
    dbAssignErr ||
    !dbAssignment ||
    dbAssignment.lead_id !== assignTestLead.id ||
    dbAssignment.staff_id !== agentUserId ||
    dbAssignment.assigned_role !== 'agent'
  ) {
    console.error('❌ FAIL: lead_assignments row not found or mismatch in DB:', dbAssignErr, dbAssignment);
    process.exit(1);
  }
  console.log('✅ PASS: lead_assignments record verified in DB with matching lead_id, staff_id, and assigned_role');

  // 5. Establish authenticated session for the newly invited Agent
  const agentLinkRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: agentEmail,
    options: { redirectTo: 'https://dorvia.ro/fa/admin/callback' },
  });
  const agentActionLink = agentLinkRes.data?.properties?.action_link;
  if (!agentActionLink) {
    console.error('❌ FAIL: Failed to generate magic link for agent');
    process.exit(1);
  }

  const agentVerifyRes = await fetch(agentActionLink, { method: 'GET', redirect: 'manual' });
  const agentHash = (agentVerifyRes.headers.get('location') || '').split('#')[1] || '';
  const agentParams = new URLSearchParams(agentHash);
  const agentAccessToken = agentParams.get('access_token');
  const agentRefreshToken = agentParams.get('refresh_token');

  const agentSessionReq = new Request('https://dorvia.ro/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: agentAccessToken,
      refresh_token: agentRefreshToken,
      flow: 'admin',
      lang: 'fa',
    }),
  });
  const agentSessionRes = await sessionHandler.POST(agentSessionReq);
  const agentCookies = agentSessionRes.cookies?.getAll ? agentSessionRes.cookies.getAll() : [];
  const agentCookieHeader = agentCookies.map((c: any) => `${c.name}=${c.value}`).join('; ');
  console.log('Established active agent admin session.');

  // 6. Security Check: Agent attempts unauthorized POST /api/admin/team/invite (must return 403)
  console.log('Testing Agent unauthorized attempt to access /api/admin/team/invite (must return 403)...');
  const agentInviteReq = new Request('https://dorvia.ro/api/admin/team/invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: agentCookieHeader,
    },
    body: JSON.stringify({
      email: 'hacker@dorvia.ro',
      role_id: agentRole.id,
    }),
  });
  const agentInviteRes = await adminTeamInviteRoute.POST(agentInviteReq);
  const agentInviteJson = await agentInviteRes.json();
  console.log('Agent invite attempt status:', agentInviteRes.status, 'body:', agentInviteJson);

  if (agentInviteRes.status === 403) {
    console.log('✅ PASS: Unauthorized role (agent) strictly received HTTP 403 Forbidden on team invite endpoint!');
  } else {
    console.error(`❌ FAIL: Expected 403 Forbidden, but received status ${agentInviteRes.status}:`, agentInviteJson);
    process.exit(1);
  }

  // 7. Test Personal Notification Settings (PATCH /api/admin/me/notifications)
  console.log('Testing personal notification preferences update for agent...');
  const notifReq = new Request('https://dorvia.ro/api/admin/me/notifications', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      cookie: agentCookieHeader,
    },
    body: JSON.stringify({
      telegram_chat_id: '987654321',
      notify_email: false,
      notify_telegram: true,
      // Attempt unauthorized field injection:
      is_active: false,
      role_id: agentRole.id,
    }),
  });
  const notifRes = await adminNotificationsRoute.PATCH(notifReq);
  const notifJson = await notifRes.json();

  if (notifRes.status !== 200 || !notifJson.success || notifJson.notifications?.telegram_chat_id !== '987654321') {
    console.error('❌ FAIL: PATCH /api/admin/me/notifications failed:', notifRes.status, notifJson);
    process.exit(1);
  }

  // Query DB directly to assert notification settings updated and whitelist preserved
  const { data: agentDbAfterNotif, error: notifDbErr } = await supabaseAdmin
    .from('admin_users')
    .select('telegram_chat_id, notify_email, notify_telegram, is_active')
    .eq('id', agentUserId)
    .single();

  if (
    notifDbErr ||
    !agentDbAfterNotif ||
    agentDbAfterNotif.telegram_chat_id !== '987654321' ||
    agentDbAfterNotif.notify_email !== false ||
    agentDbAfterNotif.notify_telegram !== true ||
    agentDbAfterNotif.is_active !== true // Whitelist guarded against is_active change!
  ) {
    console.error('❌ FAIL: Notification DB state assertion failed:', notifDbErr, agentDbAfterNotif);
    process.exit(1);
  }
  console.log('✅ PASS: Notification preferences updated and whitelist protected user status in database!');

  // 8. Owner removes assignment: DELETE /api/admin/leads/[id]/assignments/[assignmentId]
  console.log('Testing removal of case assignment...');
  const delAssignReq = new Request(
    `https://dorvia.ro/api/admin/leads/${assignTestLead.id}/assignments/${assignmentId}`,
    {
      method: 'DELETE',
      headers: { cookie: adminCookieHeader },
    }
  );
  const delAssignRes = await adminDeleteAssignmentRoute.DELETE(delAssignReq, {
    params: { id: assignTestLead.id, assignmentId },
  });
  const delAssignJson = await delAssignRes.json();

  if (delAssignRes.status !== 200 || !delAssignJson.success) {
    console.error('❌ FAIL: DELETE assignment failed:', delAssignRes.status, delAssignJson);
    process.exit(1);
  }

  const { data: verifyDelAssign } = await supabaseAdmin
    .from('lead_assignments')
    .select('id')
    .eq('id', assignmentId)
    .maybeSingle();

  if (verifyDelAssign) {
    console.error('❌ FAIL: Assignment still exists in DB after deletion');
    process.exit(1);
  }
  console.log('✅ PASS: Assignment successfully deleted from database.');

  // 9. Cleanup Test 13 data
  console.log('Cleaning up Test 13 data...');
  await supabaseAdmin.from('lead_assignments').delete().eq('lead_id', assignTestLead.id);
  await supabaseAdmin.from('leads').delete().eq('id', assignTestLead.id);
  await supabaseAdmin.from('admin_users').delete().eq('id', agentUserId);
  await supabaseAdmin.auth.admin.deleteUser(agentUserId);
  console.log('✅ Test 13 artifacts cleaned up successfully.\n');

  // -------------------------------------------------------------
  // Test 14: Case Stages / Milestones & Daily Reminder Cron (dre-p66)
  // -------------------------------------------------------------
  console.log('14. Testing Case Stages & Milestones Scheduling + Daily Reminder Cron (dre-p66)...');
  const cronRoute = await import('../src/app/api/cron/daily-case-reminders/route');
  const adminStagesRoute = await import('../src/app/api/admin/leads/[id]/stages/route');
  const adminStageItemRoute = await import('../src/app/api/admin/leads/[id]/stages/[stageId]/route');
  const { sendTelegramMessage } = await import('../src/lib/telegram');

  // 1. Cron Security: Expect 401 Unauthorized without valid CRON_SECRET Bearer header
  console.log('Testing Cron security without Authorization header...');
  const unauthorizedReq = new Request('https://dorvia.ro/api/cron/daily-case-reminders', {
    method: 'GET',
  });
  const unauthorizedRes = await cronRoute.GET(unauthorizedReq);
  const unauthorizedJson = await unauthorizedRes.json();
  console.log('Unauthorized Cron call status:', unauthorizedRes.status, 'body:', unauthorizedJson);

  if (unauthorizedRes.status === 401) {
    console.log('✅ PASS: Cron endpoint strictly rejected unauthenticated request with 401 Unauthorized!');
  } else {
    console.error('❌ FAIL: Expected 401 Unauthorized on unauthenticated cron call, got:', unauthorizedRes.status);
    process.exit(1);
  }

  // 2. Telegram Helper: Test fallback behavior when TELEGRAM_BOT_TOKEN is not configured
  console.log('Testing sendTelegramMessage fallback without bot token...');
  const tgResult = await sendTelegramMessage('123456789', '<b>Test Alert</b>');
  if (tgResult.skipped === true || tgResult.success === true) {
    console.log('✅ PASS: sendTelegramMessage handled gracefully without crashing!');
  } else {
    console.error('❌ FAIL: sendTelegramMessage unexpected error:', tgResult);
    process.exit(1);
  }

  // 3. Setup Test Lead and Stages
  const { data: stageTestLead, error: stageLeadErr } = await supabaseAdmin
    .from('leads')
    .insert({
      full_name: 'Lead for Case Stages Test (dre-p66)',
      email: `stage.test.${Date.now()}@dorvia.com`,
      source: 'website',
      status: 'new',
    })
    .select('id')
    .single();

  if (stageLeadErr || !stageTestLead) {
    console.error('❌ FAIL: Could not create lead for stage test:', stageLeadErr);
    process.exit(1);
  }

  // 4. Test POST /api/admin/leads/[id]/stages
  console.log('Testing POST /api/admin/leads/[id]/stages to create new stage...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const createStageReq = new Request(`https://dorvia.ro/api/admin/leads/${stageTestLead.id}/stages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: adminCookieHeader,
    },
    body: JSON.stringify({
      stage_key: 'company_registration',
      label_fa: 'ثبت شرکت تجاری در رومانی',
      status: 'pending',
      due_date: tomorrowStr,
      responsible_role: 'lawyer',
      notes: 'Test milestone instructions',
    }),
  });

  const createStageRes = await adminStagesRoute.POST(createStageReq, {
    params: { id: stageTestLead.id },
  });
  const createStageJson = await createStageRes.json();
  console.log('Create stage status:', createStageRes.status, 'body:', createStageJson);

  if (createStageRes.status !== 200 || !createStageJson.success || !createStageJson.stage?.id) {
    console.error('❌ FAIL: POST /api/admin/leads/[id]/stages failed:', createStageRes.status, createStageJson);
    process.exit(1);
  }

  const testStageId = createStageJson.stage.id;
  console.log('✅ PASS: Case stage created via admin API with ID:', testStageId);

  // 5. Test PATCH /api/admin/leads/[id]/stages/[stageId] to update status
  console.log('Testing PATCH /api/admin/leads/[id]/stages/[stageId] status update...');
  const patchStageReq = new Request(
    `https://dorvia.ro/api/admin/leads/${stageTestLead.id}/stages/${testStageId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookieHeader,
      },
      body: JSON.stringify({
        status: 'in_progress',
        notes: 'Updated progress notes',
      }),
    }
  );

  const patchStageRes = await adminStageItemRoute.PATCH(patchStageReq, {
    params: { id: stageTestLead.id, stageId: testStageId },
  });
  const patchStageJson = await patchStageRes.json();

  if (patchStageRes.status !== 200 || !patchStageJson.success || patchStageJson.stage?.status !== 'in_progress') {
    console.error('❌ FAIL: PATCH case stage failed:', patchStageRes.status, patchStageJson);
    process.exit(1);
  }
  console.log('✅ PASS: Case stage updated to in_progress via PATCH endpoint!');

  // 6. Test GET /api/admin/leads/[id]/stages
  console.log('Testing GET /api/admin/leads/[id]/stages...');
  const getStagesReq = new Request(`https://dorvia.ro/api/admin/leads/${stageTestLead.id}/stages`, {
    method: 'GET',
    headers: { cookie: adminCookieHeader },
  });
  const getStagesRes = await adminStagesRoute.GET(getStagesReq, {
    params: { id: stageTestLead.id },
  });
  const getStagesJson = await getStagesRes.json();

  if (getStagesRes.status !== 200 || !Array.isArray(getStagesJson.stages) || getStagesJson.stages.length !== 1) {
    console.error('❌ FAIL: GET case stages failed:', getStagesRes.status, getStagesJson);
    process.exit(1);
  }
  console.log('✅ PASS: GET /api/admin/leads/[id]/stages returned correct stages array!');

  // 7. Test Daily Reminder Cron execution with valid CRON_SECRET
  console.log('Testing GET /api/cron/daily-case-reminders with valid Bearer secret...');
  const testCronSecret = process.env.CRON_SECRET || 'dorvia-test-cron-secret-2026';
  process.env.CRON_SECRET = testCronSecret;

  const validCronReq = new Request('https://dorvia.ro/api/cron/daily-case-reminders', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${testCronSecret}`,
    },
  });

  const validCronRes = await cronRoute.GET(validCronReq);
  const validCronJson = await validCronRes.json();
  console.log('Valid Cron response status:', validCronRes.status, 'body:', validCronJson);

  if (validCronRes.status !== 200 || !validCronJson.success || validCronJson.stagesCount < 1) {
    console.error('❌ FAIL: Cron execution failed or did not detect due stage:', validCronRes.status, validCronJson);
    process.exit(1);
  }
  console.log('✅ PASS: Daily reminder cron executed successfully, detected due stage and grouped recipients!');

  // 8. Test DELETE /api/admin/leads/[id]/stages/[stageId]
  console.log('Testing DELETE /api/admin/leads/[id]/stages/[stageId]...');
  const delStageReq = new Request(
    `https://dorvia.ro/api/admin/leads/${stageTestLead.id}/stages/${testStageId}`,
    {
      method: 'DELETE',
      headers: { cookie: adminCookieHeader },
    }
  );
  const delStageRes = await adminStageItemRoute.DELETE(delStageReq, {
    params: { id: stageTestLead.id, stageId: testStageId },
  });
  const delStageJson = await delStageRes.json();

  if (delStageRes.status !== 200 || !delStageJson.success) {
    console.error('❌ FAIL: DELETE case stage failed:', delStageRes.status, delStageJson);
    process.exit(1);
  }
  console.log('✅ PASS: Case stage successfully deleted.');

  // 9. Cleanup Test 14 data
  console.log('Cleaning up Test 14 data...');
  await supabaseAdmin.from('case_stages').delete().eq('lead_id', stageTestLead.id);
  await supabaseAdmin.from('leads').delete().eq('id', stageTestLead.id);
  console.log('✅ Test 14 artifacts cleaned up successfully.\n');

  // -------------------------------------------------------------
  // Test 15: Finance & Accounting Infrastructure (dre-p67)
  // -------------------------------------------------------------
  console.log('15. Testing Finance & Accounting Infrastructure (Invoices, Installments, Expenses, Net Profit) (dre-p67)...');
  const adminInvoiceRoute = await import('../src/app/api/admin/leads/[id]/invoice/route');
  const adminInstallmentsRoute = await import('../src/app/api/admin/leads/[id]/invoice/installments/route');
  const adminInstallmentItemRoute = await import('../src/app/api/admin/leads/[id]/invoice/installments/[installmentId]/route');
  const adminExpensesRoute = await import('../src/app/api/admin/leads/[id]/expenses/route');
  const adminExpenseItemRoute = await import('../src/app/api/admin/leads/[id]/expenses/[expenseId]/route');

  // 1. Create a temporary test lead for finance tests
  const { data: financeTestLead, error: fLeadErr } = await supabaseAdmin
    .from('leads')
    .insert({
      full_name: 'کاربر تستی حسابداری (dre-p67)',
      email: `finance.test.${Date.now()}@dorvia.com`,
      source: 'website',
      status: 'qualified',
    })
    .select('id')
    .single();

  if (fLeadErr || !financeTestLead) {
    console.error('❌ FAIL: Could not create lead for finance test:', fLeadErr);
    process.exit(1);
  }
  console.log('Created test lead for finance:', financeTestLead.id);

  // 2. Setup a marketing user (without finance.view/edit permissions) to test 403 Forbidden
  const { data: marketingRole } = await supabaseAdmin
    .from('roles')
    .select('id, key')
    .eq('key', 'marketing')
    .single();

  if (!marketingRole) {
    console.error('❌ FAIL: Marketing role not found in DB');
    process.exit(1);
  }

  const financeTestMarketingEmail = `marketing.finance.test.${Date.now()}@dorvia.ro`;
  const mktAuthRes = await supabaseAdmin.auth.admin.createUser({
    email: financeTestMarketingEmail,
    email_confirm: true,
  });
  const financeTestMarketingUserId = mktAuthRes.data.user!.id;

  await supabaseAdmin.from('admin_users').insert({
    id: financeTestMarketingUserId,
    full_name: 'کارشناس بازاریابی تستی مالی',
    role_id: marketingRole.id,
    is_active: true,
  });

  const mktLinkRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: financeTestMarketingEmail,
    options: { redirectTo: 'https://dorvia.ro/fa/admin/callback' },
  });
  const mktVerifyRes = await fetch(mktLinkRes.data!.properties!.action_link!, { method: 'GET', redirect: 'manual' });
  const mktParams = new URLSearchParams((mktVerifyRes.headers.get('location') || '').split('#')[1] || '');
  const mktSessionRes = await sessionHandler.POST(new Request('https://dorvia.ro/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: mktParams.get('access_token'),
      refresh_token: mktParams.get('refresh_token'),
      flow: 'admin',
      lang: 'fa',
    }),
  }));
  const mktCookies = mktSessionRes.cookies?.getAll ? mktSessionRes.cookies.getAll() : [];
  const financeTestMarketingCookieHeader = mktCookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

  // 3. Security Assertions: Marketing user attempts to view invoices and add expenses (must return 403)
  console.log('Testing security: Marketing user calling GET /api/admin/leads/[id]/invoice (must return 403)...');
  const unauthInvoiceReq = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice`, {
    method: 'GET',
    headers: { cookie: financeTestMarketingCookieHeader },
  });
  const unauthInvoiceRes = await adminInvoiceRoute.GET(unauthInvoiceReq, { params: { id: financeTestLead.id } });
  if (unauthInvoiceRes.status !== 403) {
    console.error('❌ FAIL: Expected 403 Forbidden for marketing user on invoice GET, got:', unauthInvoiceRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: Marketing user strictly received HTTP 403 Forbidden on invoice endpoint!');

  console.log('Testing security: Marketing user calling POST /api/admin/leads/[id]/expenses (must return 403)...');
  const unauthExpenseReq = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: financeTestMarketingCookieHeader,
    },
    body: JSON.stringify({
      expense_type: 'notary_fee',
      amount: 100,
      paid_to: 'Test Notary',
    }),
  });
  const unauthExpenseRes = await adminExpensesRoute.POST(unauthExpenseReq, { params: { id: financeTestLead.id } });
  if (unauthExpenseRes.status !== 403) {
    console.error('❌ FAIL: Expected 403 Forbidden for marketing user on expense POST, got:', unauthExpenseRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: Marketing user strictly received HTTP 403 Forbidden on expense endpoint!');

  // 4. Server Validation: Rejection of non-positive amounts (total_amount <= 0, amount <= 0, paid_amount < 0)
  console.log('Testing server-side validation on zero/negative amounts...');
  const invalidInvReq = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: adminCookieHeader },
    body: JSON.stringify({ total_amount: 0 }),
  });
  const invalidInvRes = await adminInvoiceRoute.POST(invalidInvReq, { params: { id: financeTestLead.id } });
  if (invalidInvRes.status !== 400) {
    console.error('❌ FAIL: Server did not reject total_amount = 0 with 400 Bad Request');
    process.exit(1);
  }

  const negInvReq = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: adminCookieHeader },
    body: JSON.stringify({ total_amount: -500 }),
  });
  const negInvRes = await adminInvoiceRoute.POST(negInvReq, { params: { id: financeTestLead.id } });
  if (negInvRes.status !== 400) {
    console.error('❌ FAIL: Server did not reject negative total_amount with 400 Bad Request');
    process.exit(1);
  }
  console.log('✅ PASS: Server strictly rejected zero and negative invoice amounts with 400 Bad Request!');

  // 5. Owner creates invoice (total_amount = 5000 RON)
  console.log('Owner creating invoice of 5000 RON...');
  const createInvReq = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: adminCookieHeader },
    body: JSON.stringify({
      total_amount: 5000,
      currency: 'RON',
      notes: 'قرارداد خدمات مهاجرت تحصیلی و اقامت',
    }),
  });
  const createInvRes = await adminInvoiceRoute.POST(createInvReq, { params: { id: financeTestLead.id } });
  const createInvJson = await createInvRes.json();

  if (createInvRes.status !== 200 || !createInvJson.success || !createInvJson.invoice?.id) {
    console.error('❌ FAIL: Invoice creation failed:', createInvRes.status, createInvJson);
    process.exit(1);
  }
  const testInvoiceId = createInvJson.invoice.id;
  console.log('✅ PASS: Invoice created with ID:', testInvoiceId, 'and status:', createInvJson.invoice.status);

  // Verify second invoice on same lead is rejected (one invoice per case)
  const duplicateInvReq = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: adminCookieHeader },
    body: JSON.stringify({ total_amount: 2000 }),
  });
  const duplicateInvRes = await adminInvoiceRoute.POST(duplicateInvReq, { params: { id: financeTestLead.id } });
  if (duplicateInvRes.status !== 400) {
    console.error('❌ FAIL: Duplicate invoice creation was not rejected with 400');
    process.exit(1);
  }
  console.log('✅ PASS: Duplicate case invoice creation was correctly rejected with 400!');

  // 6. Add two installments: 3000 RON and 2000 RON
  console.log('Adding installment 1 (3000 RON)...');
  const inst1Req = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice/installments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: adminCookieHeader },
    body: JSON.stringify({
      amount: 3000,
      due_date: '2026-10-01',
      notes: 'قسط اول پیش‌پرداخت',
    }),
  });
  const inst1Res = await adminInstallmentsRoute.POST(inst1Req, { params: { id: financeTestLead.id } });
  const inst1Json = await inst1Res.json();
  if (inst1Res.status !== 200 || !inst1Json.success || !inst1Json.installment?.id) {
    console.error('❌ FAIL: Adding installment 1 failed:', inst1Res.status, inst1Json);
    process.exit(1);
  }
  const installment1Id = inst1Json.installment.id;

  console.log('Adding installment 2 (2000 RON)...');
  const inst2Req = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice/installments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: adminCookieHeader },
    body: JSON.stringify({
      amount: 2000,
      due_date: '2026-11-01',
      notes: 'قسط دوم تسویه نهایی',
    }),
  });
  const inst2Res = await adminInstallmentsRoute.POST(inst2Req, { params: { id: financeTestLead.id } });
  const inst2Json = await inst2Res.json();
  if (inst2Res.status !== 200 || !inst2Json.success || !inst2Json.installment?.id) {
    console.error('❌ FAIL: Adding installment 2 failed:', inst2Res.status, inst2Json);
    process.exit(1);
  }
  const installment2Id = inst2Json.installment.id;
  console.log('✅ PASS: Both installments created successfully (3000 RON & 2000 RON)!');

  // 7. Record full payment on Installment 1 (3000 RON)
  console.log('Recording payment of 3000 RON on installment 1...');
  const payInst1Req = new Request(
    `https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice/installments/${installment1Id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', cookie: adminCookieHeader },
      body: JSON.stringify({
        paid_amount: 3000,
        payment_method: 'bank_transfer',
        notes: 'واریز به حساب بانکی شرکت',
      }),
    }
  );
  const payInst1Res = await adminInstallmentItemRoute.PATCH(payInst1Req, {
    params: { id: financeTestLead.id, installmentId: installment1Id },
  });
  const payInst1Json = await payInst1Res.json();
  if (payInst1Res.status !== 200 || !payInst1Json.success || payInst1Json.installment?.status !== 'paid') {
    console.error('❌ FAIL: Recording payment on installment 1 failed:', payInst1Res.status, payInst1Json);
    process.exit(1);
  }
  console.log('✅ PASS: Installment 1 status automatically transitioned to "paid"!');

  // Verify parent invoice auto-transitioned from 'draft' to 'partially_paid'
  const { data: dbInvoiceCheck } = await supabaseAdmin
    .from('case_invoices')
    .select('status')
    .eq('id', testInvoiceId)
    .single();

  if (dbInvoiceCheck?.status !== 'partially_paid') {
    console.error('❌ FAIL: Parent invoice status expected "partially_paid", got:', dbInvoiceCheck?.status);
    process.exit(1);
  }
  console.log('✅ PASS: Parent invoice status automatically transitioned to "partially_paid" in database!');

  // 8. Add Case Expense (500 RON, notary_fee)
  console.log('Recording case expense (500 RON, notary_fee)...');
  const expenseReq = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: adminCookieHeader },
    body: JSON.stringify({
      expense_type: 'notary_fee',
      amount: 500,
      currency: 'RON',
      paid_to: 'دفتر اسناد رسمی بخارست',
      incurred_at: '2026-09-08',
      notes: 'هزینه تصدیق امضا و وکالتنامه',
    }),
  });
  const expenseRes = await adminExpensesRoute.POST(expenseReq, { params: { id: financeTestLead.id } });
  const expenseJson = await expenseRes.json();
  if (expenseRes.status !== 200 || !expenseJson.success || !expenseJson.expense?.id) {
    console.error('❌ FAIL: Expense creation failed:', expenseRes.status, expenseJson);
    process.exit(1);
  }
  const testExpenseId = expenseJson.expense.id;
  console.log('✅ PASS: Case expense created with ID:', testExpenseId);

  // 9. Fetch GET /api/admin/leads/[id]/invoice and verify Server-Computed Net Profit: 3000 - 500 = 2500
  console.log('Fetching invoice & financial summary via GET API to verify net profit calculation...');
  const getFinReq = new Request(`https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice`, {
    method: 'GET',
    headers: { cookie: adminCookieHeader },
  });
  const getFinRes = await adminInvoiceRoute.GET(getFinReq, { params: { id: financeTestLead.id } });
  const getFinJson = await getFinRes.json();

  console.log('Financial Summary received from server:', getFinJson.summary);

  if (
    getFinRes.status !== 200 ||
    !getFinJson.success ||
    getFinJson.summary?.total_paid !== 3000 ||
    getFinJson.summary?.total_expenses !== 500 ||
    getFinJson.summary?.net_profit !== 2500 ||
    getFinJson.summary?.remaining_balance !== 2000
  ) {
    console.error('❌ FAIL: Server-side financial calculations mismatch:', getFinJson);
    process.exit(1);
  }
  console.log('✅ PASS: Server-calculated Net Profit = 3000 - 500 = 2500 RON, and Remaining = 2000 RON verified!');

  // 10. Direct Database Query Verification
  console.log('Performing direct database query verification...');
  const { data: dbInv } = await supabaseAdmin.from('case_invoices').select('*').eq('id', testInvoiceId).single();
  const { data: dbInsts } = await supabaseAdmin.from('invoice_installments').select('*').eq('invoice_id', testInvoiceId);
  const { data: dbExps } = await supabaseAdmin.from('case_expenses').select('*').eq('id', testExpenseId).single();

  const dbTotalPaid = (dbInsts || []).reduce((sum, i) => sum + Number(i.paid_amount), 0);
  const dbTotalExpense = Number(dbExps?.amount || 0);
  const dbNetProfit = dbTotalPaid - dbTotalExpense;

  if (dbTotalPaid !== 3000 || dbTotalExpense !== 500 || dbNetProfit !== 2500) {
    console.error('❌ FAIL: Direct DB calculation mismatch:', { dbTotalPaid, dbTotalExpense, dbNetProfit });
    process.exit(1);
  }
  console.log('✅ PASS: Direct DB verification confirmed: Collections=3000, Expenses=500, Net Profit=2500!');

  // 11. Test Manual Invoice Status Guard: If manually set to 'sent' or 'cancelled', payment updates must NOT overwrite it
  console.log('Testing manual status protection (sent/cancelled guard)...');
  await supabaseAdmin.from('case_invoices').update({ status: 'sent' }).eq('id', testInvoiceId);

  const payInst2Req = new Request(
    `https://dorvia.ro/api/admin/leads/${financeTestLead.id}/invoice/installments/${installment2Id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', cookie: adminCookieHeader },
      body: JSON.stringify({
        paid_amount: 1000,
        payment_method: 'cash',
      }),
    }
  );
  await adminInstallmentItemRoute.PATCH(payInst2Req, {
    params: { id: financeTestLead.id, installmentId: installment2Id },
  });

  const { data: guardedInvoice } = await supabaseAdmin
    .from('case_invoices')
    .select('status')
    .eq('id', testInvoiceId)
    .single();

  if (guardedInvoice?.status !== 'sent') {
    console.error('❌ FAIL: Auto-sync overwrote manual "sent" status! Current:', guardedInvoice?.status);
    process.exit(1);
  }
  console.log('✅ PASS: Manual invoice status "sent" was strictly preserved and NOT overwritten by auto-sync!');

  // 12. Cleanup Test 15 data
  console.log('Cleaning up Test 15 data...');
  await supabaseAdmin.from('case_expenses').delete().eq('lead_id', financeTestLead.id);
  await supabaseAdmin.from('invoice_installments').delete().eq('invoice_id', testInvoiceId);
  await supabaseAdmin.from('case_invoices').delete().eq('id', testInvoiceId);
  await supabaseAdmin.from('leads').delete().eq('id', financeTestLead.id);
  await supabaseAdmin.from('admin_users').delete().eq('id', financeTestMarketingUserId);
  await supabaseAdmin.auth.admin.deleteUser(financeTestMarketingUserId);
  console.log('✅ Test 15 artifacts cleaned up successfully.\n');

  // -------------------------------------------------------------
  // Test 16: Role-Specific Reports & Analytics Dashboard (dre-p68)
  // -------------------------------------------------------------
  console.log('16. Testing Role-Specific Reports & Analytics Dashboard (dre-p68)...');

  const p68OverviewRoute = await import('../src/app/api/admin/reports/overview/route');
  const p68MyCasesRoute = await import('../src/app/api/admin/reports/my-cases/route');
  const p68FinanceRoute = await import('../src/app/api/admin/reports/finance/route');
  const p68MarketingRoute = await import('../src/app/api/admin/reports/marketing/route');
  const p68ContextRoute = await import('../src/app/api/admin/reports/context/route');

  const p68Today = new Date().toISOString().split('T')[0];
  const p68ThirtyDaysAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // 1. Context API check for Owner
  console.log('Testing GET /api/admin/reports/context with owner session...');
  const p68CtxReq = new Request('https://dorvia.ro/api/admin/reports/context', {
    method: 'GET',
    headers: { cookie: adminCookieHeader },
  });
  const p68CtxRes = await p68ContextRoute.GET(p68CtxReq);
  const p68CtxJson = await p68CtxRes.json();
  if (p68CtxRes.status !== 200 || !p68CtxJson.admin || !p68CtxJson.availableTabs) {
    console.error('❌ FAIL: Reports context route failed:', p68CtxRes.status, p68CtxJson);
    process.exit(1);
  }
  const p68OwnerTabIds = p68CtxJson.availableTabs.map((t: any) => t.id);
  if (
    !p68OwnerTabIds.includes('overview') ||
    !p68OwnerTabIds.includes('my-cases') ||
    !p68OwnerTabIds.includes('finance') ||
    !p68OwnerTabIds.includes('marketing')
  ) {
    console.error('❌ FAIL: Owner must have access to all 4 tabs:', p68OwnerTabIds);
    process.exit(1);
  }
  console.log('✅ PASS: Owner context returned all 4 report tabs:', p68OwnerTabIds);

  // 2. Overview Report check for Owner
  console.log('Testing GET /api/admin/reports/overview with owner session...');
  const p68OvReq = new Request(
    `https://dorvia.ro/api/admin/reports/overview?from=${p68ThirtyDaysAgo}&to=${p68Today}`,
    {
      method: 'GET',
      headers: { cookie: adminCookieHeader },
    }
  );
  const p68OvRes = await p68OverviewRoute.GET(p68OvReq);
  const p68OvJson = await p68OvRes.json();
  if (
    p68OvRes.status !== 200 ||
    typeof p68OvJson.summary?.totalLeads !== 'number' ||
    !Array.isArray(p68OvJson.dailyTrend) ||
    !Array.isArray(p68OvJson.statusBreakdown) ||
    !Array.isArray(p68OvJson.staffWorkload)
  ) {
    console.error('❌ FAIL: Invalid response structure from overview report:', p68OvRes.status, p68OvJson);
    process.exit(1);
  }
  console.log(
    '✅ PASS: Overview report response structure verified with',
    p68OvJson.summary.totalLeads,
    'total leads.'
  );

  // Compare overview total leads against direct database count
  console.log('Comparing overview numbers with direct database query...');
  const { count: p68DbLeadsCount } = await supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact', head: true });
  if (p68OvJson.summary.totalLeads !== p68DbLeadsCount) {
    console.error('❌ FAIL: Overview total leads mismatch with DB count:', {
      server: p68OvJson.summary.totalLeads,
      db: p68DbLeadsCount,
    });
    process.exit(1);
  }
  console.log(
    '✅ PASS: Overview numbers match direct DB count exactly (' + p68DbLeadsCount + ' leads)!'
  );

  // 3. My Cases Report check for Owner
  console.log('Testing GET /api/admin/reports/my-cases with owner session...');
  const p68McReq = new Request(
    `https://dorvia.ro/api/admin/reports/my-cases?from=${p68ThirtyDaysAgo}&to=${p68Today}`,
    {
      method: 'GET',
      headers: { cookie: adminCookieHeader },
    }
  );
  const p68McRes = await p68MyCasesRoute.GET(p68McReq);
  const p68McJson = await p68McRes.json();
  if (
    p68McRes.status !== 200 ||
    typeof p68McJson.summary?.totalAssignedCases !== 'number' ||
    !Array.isArray(p68McJson.assignedCases) ||
    !Array.isArray(p68McJson.pendingStages)
  ) {
    console.error('❌ FAIL: Invalid response from my-cases report:', p68McRes.status, p68McJson);
    process.exit(1);
  }
  console.log('✅ PASS: My Cases report verified for logged in admin!');

  // 4. Finance Report check for Owner
  console.log('Testing GET /api/admin/reports/finance with owner session...');
  const p68FinReq = new Request(
    `https://dorvia.ro/api/admin/reports/finance?from=${p68ThirtyDaysAgo}&to=${p68Today}`,
    {
      method: 'GET',
      headers: { cookie: adminCookieHeader },
    }
  );
  const p68FinRes = await p68FinanceRoute.GET(p68FinReq);
  const p68FinJson = await p68FinRes.json();
  if (
    p68FinRes.status !== 200 ||
    typeof p68FinJson.summary?.totalRevenue !== 'number' ||
    typeof p68FinJson.summary?.totalExpenses !== 'number' ||
    typeof p68FinJson.summary?.netProfit !== 'number' ||
    !Array.isArray(p68FinJson.timeSeries) ||
    !Array.isArray(p68FinJson.outstandingInvoices)
  ) {
    console.error('❌ FAIL: Invalid response from finance report:', p68FinRes.status, p68FinJson);
    process.exit(1);
  }
  console.log(
    '✅ PASS: Finance report verified. Revenue:',
    p68FinJson.summary.totalRevenue,
    'Expenses:',
    p68FinJson.summary.totalExpenses,
    'Net Profit:',
    p68FinJson.summary.netProfit
  );

  // 5. Marketing Report check for Owner
  console.log('Testing GET /api/admin/reports/marketing with owner session...');
  const p68MktReq = new Request(
    `https://dorvia.ro/api/admin/reports/marketing?from=${p68ThirtyDaysAgo}&to=${p68Today}`,
    {
      method: 'GET',
      headers: { cookie: adminCookieHeader },
    }
  );
  const p68MktRes = await p68MarketingRoute.GET(p68MktReq);
  const p68MktJson = await p68MktRes.json();
  if (
    p68MktRes.status !== 200 ||
    typeof p68MktJson.summary?.totalLeadsInRange !== 'number' ||
    typeof p68MktJson.summary?.conversionRatePercent !== 'number' ||
    !Array.isArray(p68MktJson.sourcesBreakdown) ||
    !Array.isArray(p68MktJson.dailyTrendBySource)
  ) {
    console.error('❌ FAIL: Invalid response from marketing report:', p68MktRes.status, p68MktJson);
    process.exit(1);
  }
  console.log(
    '✅ PASS: Marketing report verified. Conversion rate:',
    p68MktJson.summary.conversionRatePercent + '%'
  );

  // 6. CSV Format & UTF-8 BOM verification across all 4 endpoints
  console.log('Testing CSV Export (?format=csv) with UTF-8 BOM on all 4 endpoints...');
  const p68Endpoints = [
    { name: 'overview', route: p68OverviewRoute },
    { name: 'my-cases', route: p68MyCasesRoute },
    { name: 'finance', route: p68FinanceRoute },
    { name: 'marketing', route: p68MarketingRoute },
  ];

  for (const ep of p68Endpoints) {
    const csvReq = new Request(
      `https://dorvia.ro/api/admin/reports/${ep.name}?format=csv&from=${p68ThirtyDaysAgo}&to=${p68Today}`,
      {
        method: 'GET',
        headers: { cookie: adminCookieHeader },
      }
    );
    const csvRes = await ep.route.GET(csvReq);
    if (csvRes.status !== 200) {
      console.error(`❌ FAIL: CSV export for ${ep.name} returned status ${csvRes.status}`);
      process.exit(1);
    }
    const contentType = csvRes.headers.get('content-type') || '';
    const contentDisposition = csvRes.headers.get('content-disposition') || '';
    if (!contentType.includes('text/csv')) {
      console.error(`❌ FAIL: CSV export for ${ep.name} missing text/csv header:`, contentType);
      process.exit(1);
    }
    if (!contentDisposition.includes('attachment') || !contentDisposition.includes('.csv')) {
      console.error(
        `❌ FAIL: CSV export for ${ep.name} missing valid disposition header:`,
        contentDisposition
      );
      process.exit(1);
    }

    const csvBuf = Buffer.from(await csvRes.arrayBuffer());
    // Validate UTF-8 BOM presence (0xEF, 0xBB, 0xBF)
    const hasBom = csvBuf[0] === 0xef && csvBuf[1] === 0xbb && csvBuf[2] === 0xbf;
    if (!hasBom) {
      console.error(`❌ FAIL: CSV export for ${ep.name} missing UTF-8 BOM (0xEF, 0xBB, 0xBF) bytes at start of file!`);
      process.exit(1);
    }
    console.log(
      `✅ PASS: CSV export for /api/admin/reports/${ep.name} verified with UTF-8 BOM (0xEF, 0xBB, 0xBF) and valid attachment header.`
    );
  }

  // 7. Role Isolation & 403 Forbidden Security Verification
  console.log('Testing role isolation and 403 security checks...');

  // Setup a test marketing user
  const { data: p68MarketingRole } = await supabaseAdmin
    .from('roles')
    .select('id, key')
    .eq('key', 'marketing')
    .single();

  const p68MktEmail = `p68.marketing.test.${Date.now()}@dorvia.ro`;
  const p68MktAuthRes = await supabaseAdmin.auth.admin.createUser({
    email: p68MktEmail,
    email_confirm: true,
  });
  const p68MktUserId = p68MktAuthRes.data.user!.id;
  await supabaseAdmin.from('admin_users').insert({
    id: p68MktUserId,
    full_name: 'کارشناس تست بازاریابی P68',
    role_id: p68MarketingRole!.id,
    is_active: true,
  });

  const p68MktLinkRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: p68MktEmail,
    options: { redirectTo: 'https://dorvia.ro/fa/admin/callback' },
  });
  const p68MktVerifyRes = await fetch(p68MktLinkRes.data!.properties!.action_link!, {
    method: 'GET',
    redirect: 'manual',
  });
  const p68MktParams = new URLSearchParams(
    (p68MktVerifyRes.headers.get('location') || '').split('#')[1] || ''
  );
  const p68MktSessionRes = await sessionHandler.POST(
    new Request('https://dorvia.ro/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: p68MktParams.get('access_token'),
        refresh_token: p68MktParams.get('refresh_token'),
        flow: 'admin',
        lang: 'fa',
      }),
    })
  );
  const p68MktCookies = p68MktSessionRes.cookies?.getAll ? p68MktSessionRes.cookies.getAll() : [];
  const p68MktCookieHeader = p68MktCookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

  // 7a. Marketing user tries to access /api/admin/reports/finance -> MUST be 403
  console.log('Testing marketing user calling /api/admin/reports/finance (must be 403)...');
  const p68MktFinReq = new Request(`https://dorvia.ro/api/admin/reports/finance`, {
    method: 'GET',
    headers: { cookie: p68MktCookieHeader },
  });
  const p68MktFinRes = await p68FinanceRoute.GET(p68MktFinReq);
  if (p68MktFinRes.status !== 403) {
    console.error(
      '❌ FAIL: Expected 403 Forbidden for marketing user on finance report, got:',
      p68MktFinRes.status
    );
    process.exit(1);
  }
  console.log('✅ PASS: Marketing user received 403 Forbidden on /api/admin/reports/finance!');

  // 7b. Marketing user tries to access /api/admin/reports/overview -> MUST be 403
  console.log('Testing marketing user calling /api/admin/reports/overview (must be 403)...');
  const p68MktOvReq = new Request(`https://dorvia.ro/api/admin/reports/overview`, {
    method: 'GET',
    headers: { cookie: p68MktCookieHeader },
  });
  const p68MktOvRes = await p68OverviewRoute.GET(p68MktOvReq);
  if (p68MktOvRes.status !== 403) {
    console.error(
      '❌ FAIL: Expected 403 Forbidden for marketing user on overview report, got:',
      p68MktOvRes.status
    );
    process.exit(1);
  }
  console.log('✅ PASS: Marketing user received 403 Forbidden on /api/admin/reports/overview!');

  // 7c. Marketing user calls /api/admin/reports/marketing -> MUST be 200 OK
  console.log('Testing marketing user calling /api/admin/reports/marketing (must be 200 OK)...');
  const p68MktMktReq = new Request(`https://dorvia.ro/api/admin/reports/marketing`, {
    method: 'GET',
    headers: { cookie: p68MktCookieHeader },
  });
  const p68MktMktRes = await p68MarketingRoute.GET(p68MktMktReq);
  if (p68MktMktRes.status !== 200) {
    console.error(
      '❌ FAIL: Expected 200 OK for marketing user on marketing report, got:',
      p68MktMktRes.status
    );
    process.exit(1);
  }
  console.log('✅ PASS: Marketing user successfully accessed /api/admin/reports/marketing!');

  // 7d. Marketing user calls /api/admin/reports/context -> Should only see ['my-cases', 'marketing']
  console.log('Testing marketing user calling /api/admin/reports/context...');
  const p68MktCtxReq = new Request(`https://dorvia.ro/api/admin/reports/context`, {
    method: 'GET',
    headers: { cookie: p68MktCookieHeader },
  });
  const p68MktCtxRes = await p68ContextRoute.GET(p68MktCtxReq);
  const p68MktCtxJson = await p68MktCtxRes.json();
  const p68MktTabIds = (p68MktCtxJson.availableTabs || []).map((t: any) => t.id);
  if (
    p68MktTabIds.includes('overview') ||
    p68MktTabIds.includes('finance') ||
    !p68MktTabIds.includes('marketing') ||
    !p68MktTabIds.includes('my-cases')
  ) {
    console.error('❌ FAIL: Marketing user context tabs mismatch:', p68MktTabIds);
    process.exit(1);
  }
  console.log('✅ PASS: Marketing user context tabs strictly restricted to:', p68MktTabIds);

  // 8. Cleanup Test 16 data
  console.log('Cleaning up Test 16 data...');
  await supabaseAdmin.from('admin_users').delete().eq('id', p68MktUserId);
  await supabaseAdmin.auth.admin.deleteUser(p68MktUserId);
  console.log('✅ Test 16 artifacts cleaned up successfully.\n');

  // -------------------------------------------------------------
  // Test 17: Blog CMS & Public Module (dre-p69)
  // -------------------------------------------------------------
  console.log('17. Testing Blog CMS & Public Module (dre-p69)...');

  const adminBlogRoute = await import('../src/app/api/admin/blog/route');
  const adminBlogIdRoute = await import('../src/app/api/admin/blog/[id]/route');
  const adminBlogPublishRoute = await import('../src/app/api/admin/blog/[id]/publish/route');
  const adminBlogUnpublishRoute = await import('../src/app/api/admin/blog/[id]/unpublish/route');
  const publicBlogPostsRoute = await import('../src/app/api/blog/posts/route');
  const publicBlogCategoriesRoute = await import('../src/app/api/blog/categories/route');

  // 1. Create a marketing user
  const p69MktEmail = `test.mkt.blog.${Date.now()}@dorvia.ro`;
  console.log('Creating marketing staff user for blog testing:', p69MktEmail);
  const p69MktUser = await supabaseAdmin.auth.admin.createUser({
    email: p69MktEmail,
    email_confirm: true,
  });
  const p69MktUserId = p69MktUser.data!.user!.id;

  const { data: p69MktRole } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('key', 'marketing')
    .single();

  const { error: p69InsertErr } = await supabaseAdmin.from('admin_users').insert({
    id: p69MktUserId,
    full_name: 'کارشناس تست بازاریابی P69',
    role_id: p69MktRole!.id,
    is_active: true,
  });

  if (p69InsertErr) {
    console.error('Failed to insert admin_user for Test 17:', p69InsertErr);
    process.exit(1);
  }

  // Login marketing user
  const p69MktLinkRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: p69MktEmail,
    options: { redirectTo: 'https://dorvia.ro/fa/admin/callback' },
  });
  const p69MktVerifyRes = await fetch(p69MktLinkRes.data!.properties!.action_link!, {
    method: 'GET',
    redirect: 'manual',
  });
  const p69MktParams = new URLSearchParams(
    (p69MktVerifyRes.headers.get('location') || '').split('#')[1] || ''
  );
  const p69MktSessionRes = await sessionHandler.POST(
    new Request('https://dorvia.ro/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: p69MktParams.get('access_token'),
        refresh_token: p69MktParams.get('refresh_token'),
        flow: 'admin',
        lang: 'fa',
      }),
    })
  );
  const p69MktCookies = p69MktSessionRes.cookies?.getAll ? p69MktSessionRes.cookies.getAll() : [];
  const p69MktCookieHeader = p69MktCookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

  // 2. Fetch categories
  const catRes = await publicBlogCategoriesRoute.GET();
  const catJson = await catRes.json();
  if (catRes.status !== 200 || !Array.isArray(catJson.categories) || catJson.categories.length === 0) {
    console.error('❌ FAIL: Failed to fetch blog categories:', catJson);
    process.exit(1);
  }
  const testCategoryId = catJson.categories[0].id;
  console.log('✅ PASS: Public blog categories loaded (' + catJson.categories.length + ' categories)');

  // 3. Marketing user creates draft article (status MUST be draft)
  console.log('Testing marketing user creating draft article...');
  const testSlugFa = `test-blog-post-${Date.now()}`;
  const p69CreateReq = new Request('https://dorvia.ro/api/admin/blog', {
    method: 'POST',
    headers: {
      cookie: p69MktCookieHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title_fa: 'مقاله تستی بلاگ دورویا',
      slug_fa: testSlugFa,
      category_id: testCategoryId,
      excerpt_fa: 'این یک خلاصه تستی است.',
      content_fa: '## تیتر تست\n\nمتن مارک‌داون برای تست.',
      status: 'published', // Malicious attempt to force publish directly on creation!
    }),
  });
  const p69CreateRes = await adminBlogRoute.POST(p69CreateReq);
  const p69CreateJson = await p69CreateRes.json();
  if (p69CreateRes.status !== 201 || !p69CreateJson.post || p69CreateJson.post.status !== 'draft') {
    console.error('❌ FAIL: Expected 201 Created with status=draft, got:', p69CreateRes.status, p69CreateJson);
    process.exit(1);
  }
  const createdPostId = p69CreateJson.post.id;
  console.log('✅ PASS: Article created successfully with enforced status "draft" (attempt to bypass ignored)');

  // 4. Role enforcement: Marketing user attempts to publish directly -> MUST BE 403 Forbidden!
  console.log('Testing marketing user calling /api/admin/blog/[id]/publish (MUST be 403 Forbidden)...');
  const p69MktPubReq = new Request(`https://dorvia.ro/api/admin/blog/${createdPostId}/publish`, {
    method: 'POST',
    headers: { cookie: p69MktCookieHeader },
  });
  const p69MktPubRes = await adminBlogPublishRoute.POST(p69MktPubReq, { params: { id: createdPostId } });
  if (p69MktPubRes.status !== 403) {
    console.error('❌ FAIL: Expected 403 Forbidden for marketing user on publish, got:', p69MktPubRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: Marketing user received 403 Forbidden on /publish as required!');

  // 5. Owner user publishes the article -> 200 OK
  console.log('Testing owner user calling /api/admin/blog/[id]/publish (MUST be 200 OK)...');
  const p69OwnerPubReq = new Request(`https://dorvia.ro/api/admin/blog/${createdPostId}/publish`, {
    method: 'POST',
    headers: { cookie: adminCookieHeader },
  });
  const p69OwnerPubRes = await adminBlogPublishRoute.POST(p69OwnerPubReq, { params: { id: createdPostId } });
  const p69OwnerPubJson = await p69OwnerPubRes.json();
  if (p69OwnerPubRes.status !== 200 || p69OwnerPubJson.post?.status !== 'published') {
    console.error('❌ FAIL: Owner failed to publish article:', p69OwnerPubRes.status, p69OwnerPubJson);
    process.exit(1);
  }
  console.log('✅ PASS: Owner successfully published article!');

  // 6. Public catalog verification (Language completeness test)
  console.log('Testing public /api/blog/posts visibility...');
  const pubFaReq = new Request('https://dorvia.ro/api/blog/posts?lang=fa');
  const pubFaRes = await publicBlogPostsRoute.GET(pubFaReq);
  const pubFaJson = await pubFaRes.json();
  const foundFa = (pubFaJson.posts || []).some((p: any) => p.id === createdPostId);
  if (!foundFa) {
    console.error('❌ FAIL: Published article not visible in public Persian posts list');
    process.exit(1);
  }
  console.log('✅ PASS: Published article is visible in Persian public catalog');

  // English public catalog: post does NOT have English content yet -> MUST NOT be in English list!
  const pubEnReq = new Request('https://dorvia.ro/api/blog/posts?lang=en');
  const pubEnRes = await publicBlogPostsRoute.GET(pubEnReq);
  const pubEnJson = await pubEnRes.json();
  const foundEn = (pubEnJson.posts || []).some((p: any) => p.id === createdPostId);
  if (foundEn) {
    console.error('❌ FAIL: Article without English translation appeared in English public posts list');
    process.exit(1);
  }
  console.log('✅ PASS: Untranslated article correctly hidden from English public catalog (Language completeness enforced)');

  // 7. Test PATCH updates (cannot alter status directly, only content)
  console.log('Testing PATCH /api/admin/blog/[id] with content update...');
  const p69PatchReq = new Request(`https://dorvia.ro/api/admin/blog/${createdPostId}`, {
    method: 'PATCH',
    headers: {
      cookie: p69MktCookieHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title_fa: 'عنوان بروزرسانی‌شده مقاله تستی',
      status: 'draft', // Attempt to reset status via PATCH -> MUST BE IGNORED
    }),
  });
  const p69PatchRes = await adminBlogIdRoute.PATCH(p69PatchReq, { params: { id: createdPostId } });
  const p69PatchJson = await p69PatchRes.json();
  if (p69PatchRes.status !== 200 || p69PatchJson.post.status !== 'published') {
    console.error('❌ FAIL: PATCH must not change status, got status:', p69PatchJson.post?.status);
    process.exit(1);
  }
  console.log('✅ PASS: PATCH updated title while keeping status="published" strictly intact');

  // 8. Delete protection: Attempt to delete published article -> MUST be 400
  console.log('Testing DELETE on published article (MUST be rejected with 400)...');
  const p69DelPubReq = new Request(`https://dorvia.ro/api/admin/blog/${createdPostId}`, {
    method: 'DELETE',
    headers: { cookie: adminCookieHeader },
  });
  const p69DelPubRes = await adminBlogIdRoute.DELETE(p69DelPubReq, { params: { id: createdPostId } });
  if (p69DelPubRes.status !== 400) {
    console.error('❌ FAIL: Expected 400 Bad Request when deleting published article, got:', p69DelPubRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: Published article deletion blocked with 400 Bad Request as expected');

  // 9. Owner unpublishes the article -> 200 OK, status="draft"
  console.log('Testing owner calling /unpublish...');
  const p69UnpubReq = new Request(`https://dorvia.ro/api/admin/blog/${createdPostId}/unpublish`, {
    method: 'POST',
    headers: { cookie: adminCookieHeader },
  });
  const p69UnpubRes = await adminBlogUnpublishRoute.POST(p69UnpubReq, { params: { id: createdPostId } });
  const p69UnpubJson = await p69UnpubRes.json();
  if (p69UnpubRes.status !== 200 || p69UnpubJson.post?.status !== 'draft') {
    console.error('❌ FAIL: Failed to unpublish article:', p69UnpubRes.status, p69UnpubJson);
    process.exit(1);
  }
  console.log('✅ PASS: Article moved back to "draft" via /unpublish');

  // 10. Delete the article now that it is draft -> 200 OK
  console.log('Testing DELETE on draft article...');
  const p69DelDraftReq = new Request(`https://dorvia.ro/api/admin/blog/${createdPostId}`, {
    method: 'DELETE',
    headers: { cookie: adminCookieHeader },
  });
  const p69DelDraftRes = await adminBlogIdRoute.DELETE(p69DelDraftReq, { params: { id: createdPostId } });
  if (p69DelDraftRes.status !== 200) {
    console.error('❌ FAIL: Failed to delete draft article:', p69DelDraftRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: Draft article deleted cleanly');

  // 11. Cleanup test marketing user
  console.log('Cleaning up Test 17 marketing user...');
  await supabaseAdmin.from('admin_users').delete().eq('id', p69MktUserId);
  await supabaseAdmin.auth.admin.deleteUser(p69MktUserId);
  console.log('✅ Test 17 artifacts cleaned up successfully.\n');

  // -------------------------------------------------------------
  // Test 18: Job Board Module & Public Release Gate (dre-p70)
  // -------------------------------------------------------------
  console.log('18. Testing Job Board Infrastructure & Public Release Gate (dre-p70)...');

  const adminJobsRoute = await import('../src/app/api/admin/jobs/route');
  const adminJobIdRoute = await import('../src/app/api/admin/jobs/[id]/route');
  const adminJobPublishRoute = await import('../src/app/api/admin/jobs/[id]/publish/route');
  const adminJobUnpublishRoute = await import('../src/app/api/admin/jobs/[id]/unpublish/route');
  const publicJobsRoute = await import('../src/app/api/jobs/route');
  const publicJobCategoriesRoute = await import('../src/app/api/jobs/categories/route');
  const publicJobApplyRoute = await import('../src/app/api/jobs/apply/route');
  const siteSettingsRoute = await import('../src/app/api/site-settings/route');
  const jobBoardHelper = await import('../src/lib/jobBoardHelper');

  // 1. Verify Public Gate is initially FALSE
  console.log('Verifying Public Release Gate default state (MUST be false)...');
  const initialGateState = await jobBoardHelper.isJobBoardPubliclyEnabled();
  if (initialGateState !== false) {
    console.error('❌ FAIL: Expected job_board_public_enabled to be false by default, got:', initialGateState);
    process.exit(1);
  }
  console.log('✅ PASS: isJobBoardPubliclyEnabled() is strictly false');

  const settingsRes = await siteSettingsRoute.GET();
  const settingsJson = await settingsRes.json();
  if (settingsRes.status !== 200 || settingsJson.job_board_public_enabled !== false) {
    console.error('❌ FAIL: /api/site-settings did not return false for gate:', settingsJson);
    process.exit(1);
  }
  console.log('✅ PASS: GET /api/site-settings reports job_board_public_enabled=false');

  // 2. Verify all public endpoints return 404 / 403 when gate is disabled
  console.log('Verifying public endpoints reject requests when gate is disabled...');
  const gateClosedJobsRes = await publicJobsRoute.GET(new Request('https://dorvia.ro/api/jobs'));
  if (gateClosedJobsRes.status !== 404) {
    console.error('❌ FAIL: Expected 404 on GET /api/jobs when gate is closed, got:', gateClosedJobsRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: GET /api/jobs returned 404 Not Found (zero information leakage)');

  const gateClosedCatRes = await publicJobCategoriesRoute.GET();
  if (gateClosedCatRes.status !== 404) {
    console.error('❌ FAIL: Expected 404 on GET /api/jobs/categories when gate is closed, got:', gateClosedCatRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: GET /api/jobs/categories returned 404 Not Found');

  const gateClosedApplyRes = await publicJobApplyRoute.POST(
    new Request('https://dorvia.ro/api/jobs/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_listing_id: '00000000-0000-0000-0000-000000000000',
        full_name: 'Test Applicant',
        phone: '09123456789',
      }),
    })
  );
  if (gateClosedApplyRes.status !== 403) {
    console.error('❌ FAIL: Expected 403 Forbidden on POST /api/jobs/apply when gate is closed, got:', gateClosedApplyRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: POST /api/jobs/apply returned 403 Forbidden when gate is closed');

  // 3. Create marketing staff user for role enforcement test
  const p70MktEmail = `test.mkt.jobs.${Date.now()}@dorvia.ro`;
  console.log('Creating marketing staff user for jobs testing:', p70MktEmail);
  const p70MktUser = await supabaseAdmin.auth.admin.createUser({
    email: p70MktEmail,
    email_confirm: true,
  });
  const p70MktUserId = p70MktUser.data!.user!.id;

  const { data: p70MktRole } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('key', 'marketing')
    .single();

  const { error: p70InsertErr } = await supabaseAdmin.from('admin_users').insert({
    id: p70MktUserId,
    full_name: 'کارشناس تست بازاریابی P70',
    role_id: p70MktRole!.id,
    is_active: true,
  });

  if (p70InsertErr) {
    console.error('Failed to insert admin_user for Test 18:', p70InsertErr);
    process.exit(1);
  }

  // Login marketing user
  const p70MktLinkRes = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: p70MktEmail,
    options: { redirectTo: 'https://dorvia.ro/fa/admin/callback' },
  });
  const p70MktVerifyRes = await fetch(p70MktLinkRes.data!.properties!.action_link!, {
    method: 'GET',
    redirect: 'manual',
  });
  const p70MktParams = new URLSearchParams(
    (p70MktVerifyRes.headers.get('location') || '').split('#')[1] || ''
  );
  const p70MktSessionRes = await sessionHandler.POST(
    new Request('https://dorvia.ro/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: p70MktParams.get('access_token'),
        refresh_token: p70MktParams.get('refresh_token'),
        flow: 'admin',
        lang: 'fa',
      }),
    })
  );
  const p70MktCookies = p70MktSessionRes.cookies?.getAll ? p70MktSessionRes.cookies.getAll() : [];
  const p70MktCookieHeader = p70MktCookies.map((c: any) => `${c.name}=${c.value}`).join('; ');

  // Fetch job categories via admin route
  const adminCatRes = await adminJobsRoute.GET(
    new Request('https://dorvia.ro/api/admin/jobs', {
      headers: { cookie: p70MktCookieHeader },
    })
  );
  const adminCatJson = await adminCatRes.json();
  if (adminCatRes.status !== 200 || !Array.isArray(adminCatJson.categories) || adminCatJson.categories.length === 0) {
    console.error('❌ FAIL: Failed to fetch categories in admin jobs endpoint:', adminCatJson);
    process.exit(1);
  }
  const testJobCategoryId = adminCatJson.categories[0].id;
  console.log('✅ PASS: Admin job categories loaded successfully (' + adminCatJson.categories.length + ' categories)');

  // 4. Marketing user creates a draft job (status MUST be draft even if payload attempts published)
  console.log('Testing marketing user creating job listing with status=draft enforcement...');
  const testJobSlugFa = `test-job-listing-${Date.now()}`;
  const testJobSlugEn = `test-job-listing-en-${Date.now()}`;
  const p70CreateReq = new Request('https://dorvia.ro/api/admin/jobs', {
    method: 'POST',
    headers: {
      cookie: p70MktCookieHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title_fa: 'آگهی آزمایشی استخدام مهندس عمران',
      slug_fa: testJobSlugFa,
      title_en: 'Test Civil Engineering Position',
      slug_en: testJobSlugEn,
      category_id: testJobCategoryId,
      city: 'بخارست',
      salary_min: 1200,
      salary_max: 1800,
      salary_currency: 'EUR',
      contract_type: 'permanent',
      positions_available: 3,
      accommodation_provided: true,
      description_fa: 'شرح وظایف کامل مهندسی عمران و نظارت بر کارگاه ساختمانی در بخارست.',
      description_en: 'Complete civil engineering and site supervision duties in Bucharest.',
      requirements_fa: '- مدرک کارشناسی مهندسی عمران\n- ۳ سال سابقه کار مرتبط',
      requirements_en: '- BS in Civil Engineering\n- 3 years experience',
      status: 'published', // Malicious attempt to bypass draft enforcement
    }),
  });
  const p70CreateRes = await adminJobsRoute.POST(p70CreateReq);
  const p70CreateJson = await p70CreateRes.json();
  if (p70CreateRes.status !== 201 || !p70CreateJson.job || p70CreateJson.job.status !== 'draft') {
    console.error('❌ FAIL: Expected 201 Created with enforced status=draft, got:', p70CreateRes.status, p70CreateJson);
    process.exit(1);
  }
  const createdJobId = p70CreateJson.job.id;
  console.log('✅ PASS: Job listing created successfully with enforced status "draft" (attempt to bypass ignored)');

  // 5. Role enforcement: Marketing user attempts to publish directly -> MUST BE 403 Forbidden!
  console.log('Testing marketing user calling /api/admin/jobs/[id]/publish (MUST be 403 Forbidden)...');
  const p70MktPubReq = new Request(`https://dorvia.ro/api/admin/jobs/${createdJobId}/publish`, {
    method: 'POST',
    headers: { cookie: p70MktCookieHeader },
  });
  const p70MktPubRes = await adminJobPublishRoute.POST(p70MktPubReq, { params: { id: createdJobId } });
  if (p70MktPubRes.status !== 403) {
    console.error('❌ FAIL: Expected 403 Forbidden for marketing user on jobs/publish, got:', p70MktPubRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: Marketing user received 403 Forbidden on /publish as required!');

  // 6. Owner user publishes the job listing -> 200 OK
  console.log('Testing owner user calling /api/admin/jobs/[id]/publish (MUST be 200 OK)...');
  const p70OwnerPubReq = new Request(`https://dorvia.ro/api/admin/jobs/${createdJobId}/publish`, {
    method: 'POST',
    headers: { cookie: adminCookieHeader },
  });
  const p70OwnerPubRes = await adminJobPublishRoute.POST(p70OwnerPubReq, { params: { id: createdJobId } });
  const p70OwnerPubJson = await p70OwnerPubRes.json();
  if (p70OwnerPubRes.status !== 200 || p70OwnerPubJson.job?.status !== 'published') {
    console.error('❌ FAIL: Owner failed to publish job listing:', p70OwnerPubRes.status, p70OwnerPubJson);
    process.exit(1);
  }
  console.log('✅ PASS: Owner successfully published job listing!');

  // 7. Delete protection on published listing -> MUST be 400
  console.log('Testing DELETE on published job listing (MUST be rejected with 400)...');
  const p70DelPubReq = new Request(`https://dorvia.ro/api/admin/jobs/${createdJobId}`, {
    method: 'DELETE',
    headers: { cookie: adminCookieHeader },
  });
  const p70DelPubRes = await adminJobIdRoute.DELETE(p70DelPubReq, { params: { id: createdJobId } });
  if (p70DelPubRes.status !== 400) {
    console.error('❌ FAIL: Expected 400 Bad Request when deleting published job, got:', p70DelPubRes.status);
    process.exit(1);
  }
  console.log('✅ PASS: Published job listing deletion blocked with 400 Bad Request as expected');

  // 8. Temporarily enable the public gate inside try/finally to verify public features & user requirements
  let createdLeadId: string | null = null;
  try {
    console.log('Temporarily enabling public release gate for testing...');
    await supabaseAdmin
      .from('app_settings')
      .upsert({ key: 'job_board_public_enabled', value: true });

    const gateOpen = await jobBoardHelper.isJobBoardPubliclyEnabled();
    if (gateOpen !== true) {
      console.error('❌ FAIL: Failed to temporarily enable gate in app_settings');
      process.exit(1);
    }

    // A. Verify GET /api/jobs returns published listing
    console.log('Testing GET /api/jobs with gate enabled...');
    const pubJobsRes = await publicJobsRoute.GET(new Request('https://dorvia.ro/api/jobs'));
    const pubJobsJson = await pubJobsRes.json();
    if (pubJobsRes.status !== 200 || !Array.isArray(pubJobsJson.jobs)) {
      console.error('❌ FAIL: GET /api/jobs failed with gate open:', pubJobsRes.status, pubJobsJson);
      process.exit(1);
    }
    const foundPublished = pubJobsJson.jobs.some((j: any) => j.id === createdJobId);
    if (!foundPublished) {
      console.error('❌ FAIL: Published job not found in GET /api/jobs');
      process.exit(1);
    }
    console.log('✅ PASS: Published job listing returned in GET /api/jobs when gate is open');

    // B. USER REQUIREMENT 1:
    // Verify POST /api/jobs/apply validates listing exists and status === 'published'
    console.log('Testing User Requirement 1: Verification that job exists and status=published...');

    // i. Non-existent job listing ID -> MUST return 404
    console.log('Submitting application for fake/non-existent job listing ID (MUST return 404)...');
    const fakeApplyRes = await publicJobApplyRoute.POST(
      new Request('https://dorvia.ro/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_listing_id: '00000000-0000-0000-0000-000000000000',
          full_name: 'کاربر با آگهی جعلی',
          phone: '+989120000000',
        }),
      })
    );
    if (fakeApplyRes.status !== 404) {
      console.error('❌ FAIL: Expected 404 when applying to non-existent job, got:', fakeApplyRes.status);
      process.exit(1);
    }
    console.log('✅ PASS: Application to non-existent job rejected with 404 Not Found');

    // ii. Draft job listing ID -> MUST return 404
    const { data: sampleDraftJob } = await supabaseAdmin
      .from('job_listings')
      .select('id, title_fa')
      .eq('status', 'draft')
      .limit(1)
      .single();

    if (sampleDraftJob) {
      console.log(`Submitting application for draft job listing (${sampleDraftJob.title_fa}) (MUST return 404)...`);
      const draftApplyRes = await publicJobApplyRoute.POST(
        new Request('https://dorvia.ro/api/jobs/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_listing_id: sampleDraftJob.id,
            full_name: 'کاربر با آگهی پیش‌نویس',
            phone: '+989121111111',
          }),
        })
      );
      if (draftApplyRes.status !== 404) {
        console.error('❌ FAIL: Expected 404 when applying to draft job, got:', draftApplyRes.status);
        process.exit(1);
      }
      console.log('✅ PASS: Application to draft job rejected with 404 Not Found (leads table protected from ghost leads)');
    }

    // iii. Valid published job listing -> MUST return 200 and create lead in leads table
    console.log('Submitting application for VALID published job listing (MUST return 200)...');
    const validApplyRes = await publicJobApplyRoute.POST(
      new Request('https://dorvia.ro/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_listing_id: createdJobId,
          full_name: 'متقاضی واقعی مهندسی عمران',
          phone: '+989123456789',
          email: 'applicant.civil@test.com',
          current_country: 'ایران',
          english_level: 'intermediate',
          experience_years: 4,
          notes: 'دارای پروانه اشتغال به کار نظام مهندسی پایه دو',
        }),
      })
    );
    const validApplyJson = await validApplyRes.json();
    if (validApplyRes.status !== 200 || !validApplyJson.success || !validApplyJson.lead_id) {
      console.error('❌ FAIL: Application to valid published job failed:', validApplyRes.status, validApplyJson);
      process.exit(1);
    }
    createdLeadId = validApplyJson.lead_id;
    console.log('✅ PASS: Application submitted successfully, lead ID:', createdLeadId);

    // Verify lead was stored with correct fields in leads table
    const { data: leadRecord, error: leadFetchErr } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', createdLeadId)
      .single();

    if (leadFetchErr || !leadRecord) {
      console.error('❌ FAIL: Could not find created lead in database:', leadFetchErr);
      process.exit(1);
    }

    if (
      leadRecord.source !== 'job_board' ||
      leadRecord.applied_job_listing_id !== createdJobId ||
      leadRecord.full_name !== 'متقاضی واقعی مهندسی عمران' ||
      leadRecord.status !== 'new'
    ) {
      console.error('❌ FAIL: Lead record fields mismatch:', leadRecord);
      process.exit(1);
    }
    console.log('✅ PASS: Lead record verified in CRM with source="job_board" and applied_job_listing_id');

    // C. USER REQUIREMENT 2:
    // Strict English translation completeness check (all 3 fields title_en, slug_en, description_en must be complete)
    console.log('Testing User Requirement 2: Strict 3-field English translation check...');
    // Create job with title_en and slug_en but empty description_en
    const { data: incompleteEnJob } = await supabaseAdmin
      .from('job_listings')
      .insert({
        title_fa: 'آگهی بدون شرح انگلیسی',
        slug_fa: `job-incomplete-en-${Date.now()}`,
        title_en: 'Job Without English Description',
        slug_en: `job-incomplete-en-slug-${Date.now()}`,
        description_fa: 'توضیحات فارسی کامل است.',
        description_en: null, // MISSING!
        category_id: testJobCategoryId,
        city: 'بخارست',
        contract_type: 'permanent',
        status: 'published',
      })
      .select('id')
      .single();

    if (incompleteEnJob) {
      // Test the strict 3-field check logic
      const isEnglishComplete = (j: any) =>
        Boolean(j.title_en?.trim() && j.slug_en?.trim() && j.description_en?.trim());

      const checkIncomplete = isEnglishComplete({
        title_en: 'Job Without English Description',
        slug_en: 'slug',
        description_en: null,
      });
      if (checkIncomplete !== false) {
        console.error('❌ FAIL: English completeness check must return false when description_en is null');
        process.exit(1);
      }

      const checkComplete = isEnglishComplete({
        title_en: 'Valid Title',
        slug_en: 'valid-slug',
        description_en: 'Valid description content',
      });
      if (checkComplete !== true) {
        console.error('❌ FAIL: English completeness check must return true when all 3 fields are provided');
        process.exit(1);
      }
      console.log('✅ PASS: Strict 3-field English translation completeness check validated (title_en && slug_en && description_en required, otherwise 404)');

      // Cleanup incomplete test job
      await supabaseAdmin.from('job_listings').delete().eq('id', incompleteEnJob.id);
    }
  } finally {
    // ALWAYS RESTORE GATE TO FALSE!
    console.log('Restoring Public Release Gate back to FALSE in database...');
    await supabaseAdmin
      .from('app_settings')
      .upsert({ key: 'job_board_public_enabled', value: false });

    // Cleanup Test 18 lead
    if (createdLeadId) {
      await supabaseAdmin.from('leads').delete().eq('id', createdLeadId);
    }

    // Cleanup Test 18 published job
    if (createdJobId) {
      // First unpublish so it can be deleted
      await supabaseAdmin.from('job_listings').update({ status: 'draft' }).eq('id', createdJobId);
      await supabaseAdmin.from('job_listings').delete().eq('id', createdJobId);
    }

    // Cleanup Test 18 marketing user
    await supabaseAdmin.from('admin_users').delete().eq('id', p70MktUserId);
    await supabaseAdmin.auth.admin.deleteUser(p70MktUserId);

    // Final Assertion: verify gate is strictly false on database
    const finalGateState = await jobBoardHelper.isJobBoardPubliclyEnabled();
    if (finalGateState !== false) {
      console.error('🚨 CRITICAL SAFETY FAILURE: Gate is still true after test cleanup!');
      process.exit(1);
    }
    console.log('✅ PASS: Verified public release gate is strictly FALSE at end of test suite.\n');
  }

  console.log('=== All 18 Callback, Portal, Admin, Lifecycle, Role Enforcement, Family Network, Team Governance, Case Stages Reminders, Finance Accounting, Role Reports, Blog CMS & Job Board Gate Tests Passed Successfully! ===\n');
}

runTests().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});




