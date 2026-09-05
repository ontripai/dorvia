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

  console.log('=== All 12 Callback, Portal, Admin, Lifecycle, Role Enforcement & Family Network Tests Passed Successfully! ===\n');
}

runTests().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});

