import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const screenshotDir = path.join(process.cwd(), 'screenshots', 'dre-p80-live');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runLiveProductionTests() {
  console.log('===============================================================');
  console.log('🌐 STARTING LIVE PRODUCTION VERIFICATION ON HTTPS://DORVIA.RO');
  console.log('===============================================================\n');

  const testEmail = 'portal.live.test@dorvia.com';
  const livePassword = 'LiveProdPassword2026!';
  const wrongPassword = 'CompletelyWrongPass999!';

  // Step 0: Ensure test lead & auth user exist on Supabase
  console.log('--- Step 0: Preparing Test Lead & Auth User in Supabase ---');
  let { data: testLead } = await supabaseAdmin
    .from('leads')
    .select('id, email, user_id, full_name')
    .eq('email', testEmail)
    .maybeSingle();

  if (!testLead) {
    const { data: insertedLead, error: insErr } = await supabaseAdmin
      .from('leads')
      .insert({
        email: testEmail,
        full_name: 'متقاضی تستی لایو',
        source: 'telegram_bot',
        status: 'qualified',
        consent_terms: true,
        marketing_consent: true,
        invited_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (insErr || !insertedLead) {
      throw new Error(`Failed to create test lead: ${insErr?.message}`);
    }
    testLead = insertedLead;
  } else {
    await supabaseAdmin
      .from('leads')
      .update({ invited_at: new Date().toISOString() })
      .eq('id', testLead.id);
  }

  const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
  let authUser = userList?.users?.find((u) => u.email?.toLowerCase() === testEmail.toLowerCase());

  if (!authUser) {
    const { data: createdUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      email_confirm: true,
    });
    if (createErr || !createdUser.user) {
      throw new Error(`Failed to create auth user: ${createErr?.message}`);
    }
    authUser = createdUser.user;
  }

  if (!testLead) {
    throw new Error('testLead is null');
  }

  await supabaseAdmin
    .from('leads')
    .update({ user_id: authUser.id })
    .eq('id', testLead.id);

  console.log(`✅ Test Lead ready: ${testLead.id} (user_id: ${authUser.id}, email: ${testEmail})\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  // ---------------------------------------------------------------------------------
  // 1. ورود با لینک ایمیل (Magic Link) روی سایت زنده
  // ---------------------------------------------------------------------------------
  console.log('--- 1. Login via Magic Link on Live Production (https://dorvia.ro) ---');
  const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: testEmail,
    options: {
      redirectTo: 'https://dorvia.ro/fa/portal/dashboard',
    },
  });

  if (linkErr || !linkData.properties?.action_link) {
    throw new Error(`Failed to generate magic link: ${linkErr?.message}`);
  }

  const magicLinkUrl = linkData.properties.action_link;
  console.log('  Magic link generated via Supabase Auth Admin API.');
  console.log('  Navigating to magic link in production browser context...');

  await page.goto(magicLinkUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForURL('**/portal/dashboard**', { timeout: 20000 });

  console.log('  Landed on Live Dashboard:', page.url());
  const dashWelcome = await page.waitForSelector('text=پورتال رسمی پرونده', { timeout: 15000 });
  if (!dashWelcome) throw new Error('Dashboard heading not found!');

  const step1Screenshot = path.join(screenshotDir, '01-live-magic-link-dashboard.png');
  await page.screenshot({ path: step1Screenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${step1Screenshot}`);
  console.log('  ✅ Step 1 PASS: Successfully logged into live production dashboard via Magic Link!\n');

  // ---------------------------------------------------------------------------------
  // 2. تنظیم رمز عبور واقعی از تب «تکمیل مشخصات و رمز عبور»
  // ---------------------------------------------------------------------------------
  console.log('--- 2. Set Real Password from Profile & Security Tab in Live Dashboard ---');
  const profileTabBtn = await page.waitForSelector('button:has-text("تکمیل مشخصات و رمز عبور")', { timeout: 10000 });
  await profileTabBtn.click();

  const newPwdInput = await page.waitForSelector('input[placeholder="••••••••"] >> nth=0', { timeout: 10000 });
  const confirmPwdInput = await page.waitForSelector('input[placeholder="••••••••"] >> nth=1', { timeout: 10000 });

  await newPwdInput.fill(livePassword);
  await confirmPwdInput.fill(livePassword);

  const step2BeforeScreenshot = path.join(screenshotDir, '02-live-password-form-filled.png');
  await page.screenshot({ path: step2BeforeScreenshot, fullPage: false });

  page.on('console', (msg) => console.log('  [Browser Console]', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.error('  [Browser PageError]', err.message));

  const updatePwdBtn = await page.waitForSelector('button:has-text("ثبت رمز عبور جدید")');
  await updatePwdBtn.scrollIntoViewIfNeeded();
  await updatePwdBtn.click();

  // Wait for either success or error banner
  const resultSelector = await Promise.race([
    page.waitForSelector('text=رمز عبور شما با موفقیت ثبت شد', { timeout: 10000 }).then(() => 'success'),
    page.waitForSelector('.bg-red-50', { timeout: 10000 }).then(() => 'error'),
  ]).catch(() => 'timeout');

  const step2AfterScreenshot = path.join(screenshotDir, '02-live-password-updated-result.png');
  await page.screenshot({ path: step2AfterScreenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${step2AfterScreenshot}`);

  if (resultSelector === 'error') {
    const errorText = await page.$eval('.bg-red-50', (el: any) => el.textContent);
    throw new Error(`Password update failed with banner error: ${errorText}`);
  }
  if (resultSelector === 'timeout') {
    throw new Error('Password update timed out waiting for success or error banner');
  }

  console.log('  ✅ Step 2 PASS: Real password successfully configured on live production!\n');

  // ---------------------------------------------------------------------------------
  // 3. خروج (Sign out)
  // ---------------------------------------------------------------------------------
  console.log('--- 3. Sign Out from Live Dashboard ---');
  const signOutBtn = await page.waitForSelector('button:has-text("خروج از پورتال")', { timeout: 10000 });
  await signOutBtn.click();

  await page.waitForURL('**/portal/login**', { timeout: 15000 });
  console.log('  Landed on login page after sign-out:', page.url());

  const step3Screenshot = path.join(screenshotDir, '03-live-signed-out.png');
  await page.screenshot({ path: step3Screenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${step3Screenshot}`);
  console.log('  ✅ Step 3 PASS: Signed out successfully.\n');

  // ---------------------------------------------------------------------------------
  // 4. ورود با رمز عبور به https://dorvia.ro/fa/portal/login
  // ---------------------------------------------------------------------------------
  console.log('--- 4. Sign In with Password on https://dorvia.ro/fa/portal/login ---');
  await page.goto('https://dorvia.ro/fa/portal/login', { waitUntil: 'networkidle', timeout: 20000 });

  const pwdTab = await page.waitForSelector('button:has-text("ورود با رمز عبور")', { timeout: 10000 });
  await pwdTab.click();

  const emailInput = await page.waitForSelector('#pwd-email', { timeout: 10000 });
  const pwdInput = await page.waitForSelector('#pwd-password', { timeout: 10000 });

  await emailInput.fill(testEmail);
  await pwdInput.fill(livePassword);

  const step4BeforeScreenshot = path.join(screenshotDir, '04-live-password-login-form.png');
  await page.screenshot({ path: step4BeforeScreenshot, fullPage: false });

  const submitLoginBtn = await page.waitForSelector('button[type="submit"]:has-text("ورود به پورتال پرونده")');
  await submitLoginBtn.click();

  await page.waitForURL('**/fa/portal/dashboard**', { timeout: 15000 });
  console.log('  Landed on Live Dashboard via Password Login:', page.url());

  await page.waitForSelector('text=پورتال رسمی پرونده', { timeout: 15000 });

  const step4AfterScreenshot = path.join(screenshotDir, '04-live-password-login-success-dashboard.png');
  await page.screenshot({ path: step4AfterScreenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${step4AfterScreenshot}`);
  console.log('  ✅ Step 4 PASS: Successfully logged into live production dashboard via Password!\n');

  // ---------------------------------------------------------------------------------
  // 5. بررسی خطای رمز اشتباه (Invalid Credentials Error)
  // ---------------------------------------------------------------------------------
  console.log('--- 5. Test Wrong Password on Live Production ---');
  // First, sign out to return to login
  const signOutBtn2 = await page.waitForSelector('button:has-text("خروج از پورتال")', { timeout: 10000 });
  await signOutBtn2.click();
  await page.waitForURL('**/portal/login**', { timeout: 15000 });

  // Select password tab
  const pwdTab2 = await page.waitForSelector('button:has-text("ورود با رمز عبور")', { timeout: 10000 });
  await pwdTab2.click();

  await (await page.waitForSelector('#pwd-email')).fill(testEmail);
  await (await page.waitForSelector('#pwd-password')).fill(wrongPassword);

  const submitWrongBtn = await page.waitForSelector('button[type="submit"]:has-text("ورود به پورتال پرونده")');
  await submitWrongBtn.click();

  const errBanner = await page.waitForSelector('text=ایمیل یا رمز عبور نادرست است', { timeout: 10000 });
  if (!errBanner) throw new Error('Expected invalid credentials error message not found!');

  const step5Screenshot = path.join(screenshotDir, '05-live-wrong-password-error.png');
  await page.screenshot({ path: step5Screenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${step5Screenshot}`);
  console.log('  ✅ Step 5 PASS: Clear error message displayed for invalid password on live site!\n');

  // ---------------------------------------------------------------------------------
  // 6. بررسی دکمهٔ «ورود» در هدر dorvia.ro در هر دو زبان fa و en
  // ---------------------------------------------------------------------------------
  console.log('--- 6. Test Header "ورود" / "Login" Button on Live dorvia.ro (FA & EN) ---');

  // 6.1 FA Header
  console.log('  Testing FA Header on https://dorvia.ro/fa/romania/blog...');
  await page.goto('https://dorvia.ro/fa/romania/blog', { waitUntil: 'networkidle', timeout: 20000 });
  const loginBtnFa = await page.waitForSelector('header a[href="/fa/portal/login"]:has-text("ورود")', { timeout: 10000 });
  if (!loginBtnFa) throw new Error('FA Login link not found in live header!');

  const step6FaHeaderScreenshot = path.join(screenshotDir, '06-live-fa-header-login-btn.png');
  await page.screenshot({ path: step6FaHeaderScreenshot, fullPage: false });

  await loginBtnFa.click();
  await page.waitForURL('**/fa/portal/login**', { timeout: 15000 });
  console.log('  Landed URL from FA Header click:', page.url());

  // 6.2 EN Header
  console.log('  Testing EN Header on https://dorvia.ro/en/romania/blog...');
  await page.goto('https://dorvia.ro/en/romania/blog', { waitUntil: 'networkidle', timeout: 20000 });
  const loginBtnEn = await page.waitForSelector('header a[href="/en/portal/login"]:has-text("Login")', { timeout: 10000 });
  if (!loginBtnEn) throw new Error('EN Login link not found in live header!');

  const step6EnHeaderScreenshot = path.join(screenshotDir, '06-live-en-header-login-btn.png');
  await page.screenshot({ path: step6EnHeaderScreenshot, fullPage: false });

  await loginBtnEn.click();
  await page.waitForURL('**/en/portal/login**', { timeout: 15000 });
  console.log('  Landed URL from EN Header click:', page.url());
  console.log('  ✅ Step 6 PASS: Header buttons correctly navigate to /portal/login in both FA and EN!\n');

  await browser.close();

  console.log('===============================================================');
  console.log('🎉 ALL 6 LIVE PRODUCTION SCENARIOS PASSED 100% ON DORVIA.RO!');
  console.log('===============================================================');
}

runLiveProductionTests().catch((err) => {
  console.error('\n❌ Live Production Verification Failed:', err);
  process.exit(1);
});
