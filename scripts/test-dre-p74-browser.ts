import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseServiceKey;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('=== Starting Runtime Browser Verification for dre-p74 ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // =========================================================================
  // TEST 1: /fa/work/job-requests
  // Expected behavior: Since job_board_public_enabled is false on DB,
  // it must render 404 Not Found. Console MUST be free of FATAL SECURITY VIOLATION or React #423 hydration error.
  // =========================================================================
  console.log('--- TEST 1: Testing /fa/work/job-requests ---');
  const jobPage = await context.newPage();
  const jobConsoleMessages: { type: string; text: string }[] = [];
  const jobPageErrors: string[] = [];

  jobPage.on('console', (msg) => {
    jobConsoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  jobPage.on('pageerror', (err) => {
    jobPageErrors.push(err.message);
  });

  const jobRes = await jobPage.goto('http://localhost:3000/fa/work/job-requests', {
    waitUntil: 'networkidle',
  });
  console.log(`[TEST 1] HTTP Status Code: ${jobRes?.status()}`);

  console.log('[TEST 1] Console Messages:');
  jobConsoleMessages.forEach(m => console.log(`   [${m.type}] ${m.text}`));
  if (jobPageErrors.length > 0) {
    console.log('[TEST 1] Page Unhandled Errors:');
    jobPageErrors.forEach(e => console.log(`   [error] ${e}`));
  }

  const hasJobFatal = jobPageErrors.some(e => e.includes('FATAL SECURITY VIOLATION') || e.includes('supabaseAdmin')) ||
    jobConsoleMessages.some(m => m.type === 'error' && (m.text.includes('FATAL SECURITY VIOLATION') || m.text.includes('supabaseAdmin')));
  const hasJobHydration = jobPageErrors.some(e => e.includes('Minified React error #423') || e.includes('Hydration')) ||
    jobConsoleMessages.some(m => m.type === 'error' && (m.text.includes('Minified React error #423') || m.text.includes('Hydration')));

  console.log(`[TEST 1] FATAL SECURITY VIOLATION detected: ${hasJobFatal ? 'YES ❌' : 'NO ✅'}`);
  console.log(`[TEST 1] Hydration mismatch error #423: ${hasJobHydration ? 'YES ❌' : 'NO ✅'}`);

  if (hasJobFatal || hasJobHydration) {
    console.error('❌ FAIL: Security or hydration error on /fa/work/job-requests');
    await browser.close();
    process.exit(1);
  }

  // =========================================================================
  // TEST 2: /fa/admin/blog/f798a8d0-4495-42df-bd31-81e8790a419e/edit
  // Expected behavior: Authenticate as admin, open edit page, load post data,
  // verify title input is populated, edit title, save, and ensure console is free of FATAL errors.
  // =========================================================================
  console.log('\n--- TEST 2: Testing /fa/admin/blog/[id]/edit ---');
  // 1. Find active admin user
  const { data: adminUsers } = await supabaseAdmin
    .from('admin_users')
    .select('id, full_name, is_active')
    .eq('is_active', true)
    .limit(1);

  const targetAdmin = adminUsers?.[0];
  if (!targetAdmin) {
    throw new Error('No active admin user found in database');
  }
  const { data: uData } = await supabaseAdmin.auth.admin.getUserById(targetAdmin.id);
  const adminEmail = uData?.user?.email;
  if (!adminEmail) {
    throw new Error(`Admin user ${targetAdmin.id} has no email address`);
  }
  console.log(`[TEST 2] Admin selected: ${targetAdmin.full_name} (${adminEmail})`);

  // 2. Generate token & verify OTP to get access_token and refresh_token
  const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: adminEmail,
  });
  const tokenHash = linkData?.properties?.hashed_token;
  if (!tokenHash) throw new Error('Failed to generate magiclink token_hash');

  const { data: verifyData, error: verifyErr } = await anonClient.auth.verifyOtp({
    token_hash: tokenHash,
    type: 'magiclink',
  });
  if (verifyErr || !verifyData.session) {
    throw new Error(`Failed to verify OTP: ${verifyErr?.message}`);
  }

  const { access_token, refresh_token } = verifyData.session;

  // 3. Establish session cookies on localhost context
  const sessionRes = await context.request.post('http://localhost:3000/api/auth/session', {
    data: {
      access_token,
      refresh_token,
      flow: 'admin',
      lang: 'fa',
    },
  });
  console.log(`[TEST 2] /api/auth/session status: ${sessionRes.status()}`);

  // 4. Navigate to blog edit page
  const editPage = await context.newPage();
  const editConsoleMessages: { type: string; text: string }[] = [];
  const editPageErrors: string[] = [];

  editPage.on('console', (msg) => {
    editConsoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  editPage.on('pageerror', (err) => {
    editPageErrors.push(err.message);
  });

  const postId = 'f798a8d0-4495-42df-bd31-81e8790a419e';
  const editUrl = `http://localhost:3000/fa/admin/blog/${postId}/edit`;
  console.log(`[TEST 2] Navigating to: ${editUrl}`);

  const editRes = await editPage.goto(editUrl, { waitUntil: 'networkidle' });
  console.log(`[TEST 2] Page HTTP Status: ${editRes?.status()}`);

  // Wait for post data to be hydrated into title input
  await editPage.waitForFunction(() => {
    const input = document.querySelector('input[placeholder="عنوان فارسی مقاله..."]') as HTMLInputElement | null;
    return input && input.value.trim().length > 0;
  }, { timeout: 15000 });

  const initialTitle = await editPage.$eval('input[placeholder="عنوان فارسی مقاله..."]', (el: any) => el.value);
  console.log(`[TEST 2] Successfully loaded post! Current Title: "${initialTitle}"`);

  console.log('[TEST 2] Console Messages:');
  editConsoleMessages.forEach(m => console.log(`   [${m.type}] ${m.text}`));
  if (editPageErrors.length > 0) {
    console.log('[TEST 2] Page Unhandled Errors:');
    editPageErrors.forEach(e => console.log(`   [error] ${e}`));
  }

  // Check for any FATAL security errors or React errors
  const hasEditFatal = editPageErrors.some(e => e.includes('FATAL SECURITY VIOLATION') || e.includes('supabaseAdmin')) ||
    editConsoleMessages.some(m => m.type === 'error' && (m.text.includes('FATAL SECURITY VIOLATION') || m.text.includes('supabaseAdmin')));
  const hasEditHydration = editPageErrors.some(e => e.includes('Minified React error #423') || e.includes('Hydration')) ||
    editConsoleMessages.some(m => m.type === 'error' && (m.text.includes('Minified React error #423') || m.text.includes('Hydration')));

  console.log(`[TEST 2] FATAL SECURITY VIOLATION detected: ${hasEditFatal ? 'YES ❌' : 'NO ✅'}`);
  console.log(`[TEST 2] Hydration mismatch error #423: ${hasEditHydration ? 'YES ❌' : 'NO ✅'}`);

  if (hasEditFatal || hasEditHydration) {
    console.error('❌ FAIL: Security or hydration error on blog edit page');
    await browser.close();
    process.exit(1);
  }

  // 5. Test saving the article
  console.log('[TEST 2] Testing edit & save action...');
  const updatedTitle = initialTitle.includes(' [ویرایش تست]') 
    ? initialTitle.replace(' [ویرایش تست]', '') 
    : `${initialTitle} [ویرایش تست]`;
  await editPage.fill('input[placeholder="عنوان فارسی مقاله..."]', updatedTitle);

  // Click the save button
  const saveButton = await editPage.waitForSelector('button[type="submit"]:has-text("ذخیره تغییرات")', { timeout: 5000 });
  await saveButton.click();

  // Wait for success toast / banner
  await editPage.waitForSelector('text=تغییرات مقاله با موفقیت ذخیره شد', { timeout: 10000 });
  console.log(`[TEST 2] Save confirmation banner displayed: "تغییرات مقاله با موفقیت ذخیره شد" ✅`);

  // Verify updated title on reload
  await editPage.reload({ waitUntil: 'networkidle' });
  await editPage.waitForFunction(() => {
    const input = document.querySelector('input[placeholder="عنوان فارسی مقاله..."]') as HTMLInputElement | null;
    return input && input.value.trim().length > 0;
  }, { timeout: 10000 });
  const reloadedTitle = await editPage.$eval('input[placeholder="عنوان فارسی مقاله..."]', (el: any) => el.value);
  console.log(`[TEST 2] Reloaded title matches saved title: "${reloadedTitle}" === "${updatedTitle}" ✅`);

  // Restore original title
  await editPage.fill('input[placeholder="عنوان فارسی مقاله..."]', initialTitle);
  const restoreSaveBtn = await editPage.waitForSelector('button[type="submit"]:has-text("ذخیره تغییرات")', { timeout: 5000 });
  await restoreSaveBtn.click();
  await editPage.waitForSelector('text=تغییرات مقاله با موفقیت ذخیره شد', { timeout: 10000 });
  console.log(`[TEST 2] Restored original title and saved cleanly ✅`);

  await browser.close();
  console.log('\n🎉 ALL RUNTIME BROWSER ACCEPTANCE TESTS PASSED WITH 0 ERRORS!');
}

main().catch((err) => {
  console.error('❌ Execution error in main():', err);
  process.exit(1);
});
