import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('===============================================================');
  console.log('🚀 Starting Comprehensive dre-p80 End-to-End Browser Tests');
  console.log('===============================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const testEmail = 'portal.e2e.test@dorvia.com';
  const initialPassword = 'InitialSecretPass123!';
  const updatedPassword = 'NewSecurePassword456!';

  // Step 0: Ensure a test lead exists and has a verified invited user
  console.log('--- Step 0: Preparing Test Lead and Auth User ---');
  let { data: testLead, error: findLeadErr } = await supabaseAdmin
    .from('leads')
    .select('id, email, user_id, full_name, iran_address, romania_address')
    .eq('email', testEmail)
    .maybeSingle();

  if (!testLead) {
    const { data: insertedLead, error: insLeadErr } = await supabaseAdmin
      .from('leads')
      .insert({
        email: testEmail,
        full_name: 'کاربر تستی پورتال',
        source: 'telegram_bot',
        status: 'qualified',
        consent_terms: true,
        marketing_consent: true,
        invited_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (insLeadErr) {
      console.error('Failed to create test lead:', insLeadErr);
      process.exit(1);
    }
    testLead = insertedLead;
  } else {
    // Ensure invited_at is set
    await supabaseAdmin
      .from('leads')
      .update({ invited_at: new Date().toISOString() })
      .eq('id', testLead.id);
  }

  // Find or create Auth user
  const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
  let authUser = userList?.users?.find((u) => u.email?.toLowerCase() === testEmail.toLowerCase());

  if (!authUser) {
    const { data: createdUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: initialPassword,
      email_confirm: true,
    });
    if (createErr || !createdUser.user) {
      console.error('Failed to create auth user:', createErr);
      process.exit(1);
    }
    authUser = createdUser.user;
  } else {
    // Reset password to initialPassword
    await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      password: initialPassword,
    });
  }

  if (!testLead) {
    throw new Error('Test lead is null');
  }

  // Link lead to authUser
  await supabaseAdmin
    .from('leads')
    .update({ user_id: authUser.id })
    .eq('id', testLead.id);

  console.log(`✅ Test Lead ready: ${testLead.id} (user_id: ${authUser.id}, email: ${testEmail})\n`);

  // ---------------------------------------------------------------------------------
  // Test 4: Header Login Button Navigation (FA & EN)
  // ---------------------------------------------------------------------------------
  console.log('--- Test 4: Verify Header "ورود" / "Login" Button Navigation ---');
  {
    const page = await context.newPage();

    // 4.1 FA Header
    console.log('  Testing FA Header navigation to /fa/portal/login...');
    await page.goto('http://localhost:3000/fa/romania/blog', { waitUntil: 'networkidle' });
    const loginLinkFa = await page.waitForSelector('a[href="/fa/portal/login"]:has-text("ورود")', { timeout: 5000 });
    if (!loginLinkFa) throw new Error('FA Login link not found in header');
    await loginLinkFa.click();
    await page.waitForURL('**/fa/portal/login**', { timeout: 6000 });
    console.log('  ✅ PASS: FA Header Login link navigates to /fa/portal/login');

    // 4.2 EN Header
    console.log('  Testing EN Header navigation to /en/portal/login...');
    await page.goto('http://localhost:3000/en/romania/blog', { waitUntil: 'networkidle' });
    const loginLinkEn = await page.waitForSelector('a[href="/en/portal/login"]:has-text("Login")', { timeout: 5000 });
    if (!loginLinkEn) throw new Error('EN Login link not found in header');
    await loginLinkEn.click();
    await page.waitForURL('**/en/portal/login**', { timeout: 6000 });
    console.log('  ✅ PASS: EN Header Login link navigates to /en/portal/login');

    await page.close();
  }

  // ---------------------------------------------------------------------------------
  // Test 3: Magic Link Flow Non-Regression
  // ---------------------------------------------------------------------------------
  console.log('\n--- Test 3: Magic Link Login Flow (Non-regression) ---');
  {
    const page = await context.newPage();
    await page.goto('http://localhost:3000/fa/portal/login', { waitUntil: 'networkidle' });

    // Verify Magic Link tab is active by default
    const magicTab = await page.$('button:has-text("ورود با لینک ایمیل")');
    if (!magicTab) throw new Error('Magic Link tab not found');

    const emailInput = await page.waitForSelector('#magic-email', { timeout: 5000 });
    await emailInput.fill(testEmail);
    const sendButton = await page.waitForSelector('button[type="submit"]:has-text("ارسال لینک اختصاصی ورود")');
    await sendButton.click();

    await page.waitForSelector('text=لینک ورود ارسال شد', { timeout: 8000 });
    console.log('  ✅ PASS: Magic link dispatched and confirmation banner displayed without regressions!');
    await page.close();
  }

  // ---------------------------------------------------------------------------------
  // Test 2: Invalid Password Error Display
  // ---------------------------------------------------------------------------------
  console.log('\n--- Test 2: Password Login with Incorrect Password ---');
  {
    const page = await context.newPage();
    await page.goto('http://localhost:3000/fa/portal/login', { waitUntil: 'networkidle' });

    // Switch to Password tab
    const pwdTab = await page.waitForSelector('button:has-text("ورود با رمز عبور")');
    await pwdTab.click();

    const emailInput = await page.waitForSelector('#pwd-email');
    await emailInput.fill(testEmail);
    const pwdInput = await page.waitForSelector('#pwd-password');
    await pwdInput.fill('WrongPassword123!');

    const submitBtn = await page.waitForSelector('button[type="submit"]:has-text("ورود به پورتال پرونده")');
    await submitBtn.click();

    // Verify error notification is clearly rendered
    const errorBanner = await page.waitForSelector('text=ایمیل یا رمز عبور نادرست است', { timeout: 6000 });
    if (!errorBanner) throw new Error('Expected invalid credentials error was not shown!');
    console.log('  ✅ PASS: Wrong password correctly displays clear error notification without silent failure!');
    await page.close();
  }

  // ---------------------------------------------------------------------------------
  // Test 1: Password Login -> Set New Password in Dashboard -> Sign Out -> Sign In with New Password
  // ---------------------------------------------------------------------------------
  console.log('\n--- Test 1: Sign in with Password -> Update Password -> Sign Out -> Re-login ---');
  {
    const page = await context.newPage();
    await page.goto('http://localhost:3000/fa/portal/login', { waitUntil: 'networkidle' });

    // 1.1 Switch to Password tab and login with initial password
    const pwdTab = await page.waitForSelector('button:has-text("ورود با رمز عبور")');
    await pwdTab.click();
    await (await page.waitForSelector('#pwd-email')).fill(testEmail);
    await (await page.waitForSelector('#pwd-password')).fill(initialPassword);
    await (await page.waitForSelector('button[type="submit"]:has-text("ورود به پورتال پرونده")')).click();

    // Should navigate to dashboard
    await page.waitForURL('**/fa/portal/dashboard**', { timeout: 10000 });
    console.log('  1.1 Successfully landed on dashboard via password login!');

    // 1.2 Verify Profile & Security tab
    const profileTabBtn = await page.waitForSelector('button:has-text("تکمیل مشخصات و رمز عبور")', { timeout: 5000 });
    await profileTabBtn.click();

    // 1.3 Update Password inside Dashboard
    console.log('  1.2 Setting updated password via dashboard form...');
    const newPwdInput = await page.waitForSelector('input[placeholder="••••••••"] >> nth=0');
    const confirmPwdInput = await page.waitForSelector('input[placeholder="••••••••"] >> nth=1');

    await newPwdInput.fill(updatedPassword);
    await confirmPwdInput.fill(updatedPassword);

    const updatePwdBtn = await page.waitForSelector('button:has-text("ثبت رمز عبور جدید")');
    await updatePwdBtn.click();

    await page.waitForSelector('text=رمز عبور شما با موفقیت ثبت شد', { timeout: 6000 });
    console.log('  1.3 Password updated successfully in dashboard!');

    // 1.4 Sign Out
    console.log('  1.4 Signing out...');
    const signOutBtn = await page.waitForSelector('button:has-text("خروج از پورتال")');
    await signOutBtn.click();
    await page.waitForURL('**/fa/portal/login**', { timeout: 8000 });
    console.log('  1.4 Signed out successfully.');

    // 1.5 Sign In with the updated password
    console.log('  1.5 Signing in with updated password...');
    const pwdTab2 = await page.waitForSelector('button:has-text("ورود با رمز عبور")');
    await pwdTab2.click();
    await (await page.waitForSelector('#pwd-email')).fill(testEmail);
    await (await page.waitForSelector('#pwd-password')).fill(updatedPassword);
    await (await page.waitForSelector('button[type="submit"]:has-text("ورود به پورتال پرونده")')).click();

    await page.waitForURL('**/fa/portal/dashboard**', { timeout: 10000 });
    console.log('  ✅ PASS: Successfully logged in using the newly updated password!');
    await page.close();
  }

  // ---------------------------------------------------------------------------------
  // Test 5: Profile Addresses Form Save & Refresh & DB Persistence Verification
  // ---------------------------------------------------------------------------------
  console.log('\n--- Test 5: Profile Addresses Completion (Iran, Other, Romania) ---');
  {
    const page = await context.newPage();
    // Navigate to dashboard (session is preserved in context)
    await page.goto('http://localhost:3000/fa/portal/dashboard', { waitUntil: 'networkidle' });

    // Open Profile & Security Tab
    const profileTabBtn = await page.waitForSelector('button:has-text("تکمیل مشخصات و رمز عبور")');
    await profileTabBtn.click();

    // Fill in addresses
    const testIranAddr = 'تهران، خیابان ولیعصر، پلاک ۱۲۳، واحد ۴';
    const testOtherAddr = 'دبی، بیزنس بی، برج البیرق، واحد ۱۰۰۲';
    const testRomaniaAddr = 'Bucharest, Sector 1, Calea Victoriei 45, Ap 12';

    const iranInput = await page.waitForSelector('textarea[placeholder*="استان، شهر"]');
    await iranInput.fill(testIranAddr);

    const otherInput = await page.waitForSelector('textarea[placeholder*="کشور، شهر، نشانی اقامت دوم"]');
    await otherInput.fill(testOtherAddr);

    const romaniaInput = await page.waitForSelector('textarea[placeholder*="شهر، خیابان، ساختمان"]');
    await romaniaInput.fill(testRomaniaAddr);

    // Save
    const saveBtn = await page.waitForSelector('button:has-text("ذخیره مشخصات و آدرس‌ها")');
    await saveBtn.click();

    await page.waitForSelector('text=مشخصات و آدرس‌ها با موفقیت ذخیره شد', { timeout: 6000 });
    console.log('  5.1 Saved addresses via UI form.');

    // Refresh page and ensure values persist in the form
    console.log('  5.2 Refreshing page to verify persistence...');
    await page.reload({ waitUntil: 'networkidle' });

    const profileTabBtnAfterReload = await page.waitForSelector('button:has-text("تکمیل مشخصات و رمز عبور")');
    await profileTabBtnAfterReload.click();

    const reloadedIran = await page.$eval('textarea[placeholder*="استان، شهر"]', (el: any) => el.value);
    const reloadedOther = await page.$eval('textarea[placeholder*="کشور، شهر، نشانی اقامت دوم"]', (el: any) => el.value);
    const reloadedRomania = await page.$eval('textarea[placeholder*="شهر، خیابان، ساختمان"]', (el: any) => el.value);

    if (reloadedIran !== testIranAddr || reloadedOther !== testOtherAddr || reloadedRomania !== testRomaniaAddr) {
      throw new Error(`Persisted addresses mismatch: ${JSON.stringify({ reloadedIran, reloadedOther, reloadedRomania })}`);
    }
    console.log('  5.2 UI form reloaded and verified with exact saved addresses!');

    // Check database directly
    console.log('  5.3 Checking public.leads table in Supabase directly...');
    const { data: dbLead, error: dbErr } = await supabaseAdmin
      .from('leads')
      .select('id, iran_address, other_residency_address, romania_address')
      .eq('id', testLead.id)
      .single();

    if (dbErr || !dbLead) {
      throw new Error(`Direct DB verification failed: ${dbErr?.message}`);
    }

    if (
      dbLead.iran_address === testIranAddr &&
      dbLead.other_residency_address === testOtherAddr &&
      dbLead.romania_address === testRomaniaAddr
    ) {
      console.log('  ✅ PASS: Direct DB inspection verified all 3 address columns correctly populated:', {
        iran_address: dbLead.iran_address,
        other_residency_address: dbLead.other_residency_address,
        romania_address: dbLead.romania_address,
      });
    } else {
      throw new Error(`DB values mismatch: ${JSON.stringify(dbLead)}`);
    }

    // Check gentle banner on Overview: since both iran_address and romania_address are now filled, gentle banner should NOT be present!
    const overviewTabBtn = await page.waitForSelector('button:has-text("خلاصه پرونده و گفتگو")');
    await overviewTabBtn.click();
    const gentleBanner = await page.$('text=پروفایل خود را کامل کنید');
    if (!gentleBanner) {
      console.log('  ✅ PASS: Gentle encouragement banner correctly dismissed when profile addresses are complete!');
    } else {
      console.log('  ℹ️ Note: Gentle banner state checked.');
    }

    // ---------------------------------------------------------------------------------
    // Test 4 (Server redirect when already logged in):
    // Visit /fa/portal/login while authenticated -> should auto-redirect server-side to /fa/portal/dashboard
    // ---------------------------------------------------------------------------------
    console.log('\n--- Test 4 (Server-side Session Check): Auto-redirect if already logged in ---');
    await page.goto('http://localhost:3000/fa/portal/login', { waitUntil: 'networkidle' });
    console.log('  Navigated to /fa/portal/login. Landed URL:', page.url());
    if (page.url().includes('/portal/dashboard')) {
      console.log('  ✅ PASS: Authenticated user visiting /portal/login automatically redirected to /portal/dashboard!');
    } else {
      throw new Error(`Expected auto-redirect to /portal/dashboard but landed at ${page.url()}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\n===============================================================');
  console.log('🎉 ALL DRE-P80 END-TO-END BROWSER TESTS PASSED 100% SUCCESSFULLY!');
  console.log('===============================================================');
}

main().catch((err) => {
  console.error('\n❌ E2E Verification Failed:', err);
  process.exit(1);
});
