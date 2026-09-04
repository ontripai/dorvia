import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import {
  escapeHtml,
  isValidEmail,
  buildInternalLeadEmail,
  buildApplicantResultEmail,
  sendPathfinderEmails,
} from '../src/lib/email/pathfinderEmails';
import { getResendConfig } from '../src/lib/email/resend';
import { POST } from '../src/app/api/assessment/route';

async function runTests() {
  console.log('=== DORVIA PathFinder Resend Email & Assessment Flow Test Suite ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${msg}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // Test 1: HTML Sanitization & Escaping
  // -------------------------------------------------------------
  console.log('--- Test 1: HTML Sanitization & Escaping ---');
  const dirty = '<script>alert("xss")</script> & "test" \'safe\'';
  const clean = escapeHtml(dirty);
  assert(
    !clean.includes('<script>') && clean.includes('&lt;script&gt;') && clean.includes('&amp;'),
    'User-controlled content is strictly sanitized with HTML entity encoding'
  );

  // -------------------------------------------------------------
  // Test 2: Email Format Validation
  // -------------------------------------------------------------
  console.log('\n--- Test 2: Email Format Validation ---');
  assert(isValidEmail('test@example.com'), 'Valid email passes RFC format validation');
  assert(isValidEmail('user.name+tag@domain.co.ro'), 'Complex valid email passes');
  assert(!isValidEmail('invalid-email'), 'Plain string rejected as invalid email');
  assert(!isValidEmail('missing@domain'), 'Email without TLD rejected');
  assert(!isValidEmail(''), 'Empty email rejected');
  assert(!isValidEmail(null), 'Null email rejected');

  // -------------------------------------------------------------
  // Test 3: Internal Lead Email Template
  // -------------------------------------------------------------
  console.log('\n--- Test 3: Internal Lead Email Template Generation ---');
  const internalData = {
    fullName: 'Ali Rezai <CEO>',
    whatsapp: '+98 912 345 6789',
    email: 'ali@example.com',
    preferredLanguage: 'fa' as const,
    primaryRoute: 'study' as const,
    secondaryRoute: 'work' as const,
    profileScore: 85,
    leadScore: 85,
    leadTemperature: 'hot',
    answers: {
      timeline: 'this_month',
      total_budget: '10000_25000',
      current_location: 'iran',
    },
    matchLevel: { study: 'strong', work: 'good' },
  };

  const internalEmail = buildInternalLeadEmail(internalData);
  assert(internalEmail.subject.includes('New DORVIA PathFinder Lead'), 'Internal email subject formatted correctly');
  assert(internalEmail.subject.includes('Study in Romania') && internalEmail.subject.includes('85/100'), 'Subject carries route and score');
  assert(!internalEmail.html.includes('<CEO>') && internalEmail.html.includes('&lt;CEO&gt;'), 'Applicant name is escaped in internal email');
  assert(internalEmail.html.includes('Ali Rezai'), 'Name appears in HTML');
  assert(internalEmail.html.includes('Primary Route'), 'Primary Route row present');
  assert(internalEmail.html.includes('Secondary Route'), 'Secondary Route row present');
  assert(internalEmail.html.includes('Timeline') && internalEmail.html.includes('Budget'), 'Timeline and budget present');

  // -------------------------------------------------------------
  // Test 4: Applicant Localized Result Email (Persian & English)
  // -------------------------------------------------------------
  console.log('\n--- Test 4: Applicant Localized Result Email (Persian & English) ---');
  
  // 4a. Persian Template
  const faEmail = buildApplicantResultEmail({ ...internalData, preferredLanguage: 'fa' });
  assert(faEmail.subject === 'نتیجه ارزیابی اولیه DORVIA شما', 'Persian subject matches exact specification');
  assert(faEmail.html.includes('dir="rtl"'), 'Persian email has dir="rtl" layout');
  assert(faEmail.html.includes('تطابق اولیه قوی'), 'Uses approved Persian match level label');
  assert(faEmail.html.includes('یادداشت مهم و سلب مسئولیت حقوقی:'), 'Persian disclaimer header present');
  assert(
    faEmail.html.includes('به هیچ عنوان تصمیم قطعی') && faEmail.html.includes('تضمین ویزا'),
    'Persian disclaimer contains required non-guarantee wording'
  );
  assert(!faEmail.html.includes('You are eligible') && !faEmail.html.includes('Visa probability'), 'Complies with prohibition against false claims');
  assert(faEmail.html.includes('wa.me'), 'Contains WhatsApp link');

  // 4b. English Template
  const enEmail = buildApplicantResultEmail({ ...internalData, preferredLanguage: 'en' });
  assert(enEmail.subject === 'Your DORVIA PathFinder Result', 'English subject matches exact specification');
  assert(enEmail.html.includes('dir="ltr"'), 'English email has dir="ltr" layout');
  assert(enEmail.html.includes('Strong Initial Match'), 'Uses approved English match level label');
  assert(enEmail.html.includes('Important Legal Notice & Disclaimer:'), 'English disclaimer header present');
  assert(
    enEmail.html.includes('does NOT constitute an official eligibility determination') &&
    enEmail.html.includes('visa guarantee'),
    'English disclaimer contains required non-guarantee wording'
  );
  assert(!enEmail.html.includes('You are eligible') && !enEmail.html.includes('Guaranteed admission'), 'Complies with prohibition against false claims');
  assert(enEmail.html.includes('wa.me'), 'Contains WhatsApp link');

  // -------------------------------------------------------------
  // Test 5: Route Handler — Missing / Disabled Telegram (Must NOT return 503)
  // -------------------------------------------------------------
  console.log('\n--- Test 5: Route Handler — Missing Telegram is optional (No 503) ---');
  // Ensure Telegram vars are unset for this test
  const oldBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const oldChatId = process.env.TELEGRAM_CHAT_ID;
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;

  const validPayload = {
    fullName: 'Test User',
    whatsapp: '+40727000111',
    email: 'testuser@example.com',
    preferredLanguage: 'en',
    answers: { primary_goal: 'study', timeline: '1_3_months', total_budget: '10000_25000' },
    result: {
      primaryRoute: 'study',
      secondaryRoute: 'work',
      scores: { study: 80, work: 65, business: 40, family: 20, relocation: 50 },
      matchLevel: { study: 'strong', work: 'good', business: 'review', family: 'low', relocation: 'good' },
      leadTemperature: 'warm',
      leadScore: 80,
    },
  };

  const req1 = new Request('http://localhost:3000/api/assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
    body: JSON.stringify(validPayload),
  });

  const res1 = await POST(req1);
  const data1 = await res1.json();
  assert(res1.status === 200 && data1.success === true, 'Submission succeeds with 200 when Telegram is not configured (no 503)');

  // -------------------------------------------------------------
  // Test 6: Route Handler — WhatsApp-only lead (No email supplied)
  // -------------------------------------------------------------
  console.log('\n--- Test 6: Route Handler — WhatsApp-only lead (No email supplied) ---');
  const whatsappOnlyPayload = {
    fullName: 'WhatsApp Only Lead',
    whatsapp: '+40727999888',
    preferredLanguage: 'fa',
    answers: { primary_goal: 'work' },
    result: {
      primaryRoute: 'work',
      scores: { work: 75 },
      matchLevel: { work: 'good' },
      leadTemperature: 'warm',
    },
  };

  const req2 = new Request('http://localhost:3000/api/assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.2' },
    body: JSON.stringify(whatsappOnlyPayload),
  });

  const res2 = await POST(req2);
  const data2 = await res2.json();
  assert(res2.status === 200 && data2.success === true, 'WhatsApp-only lead without email succeeds with 200');

  // -------------------------------------------------------------
  // Test 7: Route Handler — Honeypot field triggers silent success
  // -------------------------------------------------------------
  console.log('\n--- Test 7: Route Handler — Honeypot field behavior ---');
  const honeypotPayload = {
    ...validPayload,
    _gotcha: 'bot-detected',
  };

  const req3 = new Request('http://localhost:3000/api/assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.3' },
    body: JSON.stringify(honeypotPayload),
  });

  const res3 = await POST(req3);
  const data3 = await res3.json();
  assert(res3.status === 200 && data3.success === true, 'Honeypot field correctly handled');

  // -------------------------------------------------------------
  // Test 8: Route Handler — Invalid payload returns 400
  // -------------------------------------------------------------
  console.log('\n--- Test 8: Route Handler — Missing required fields returns 400 ---');
  const invalidPayload = {
    fullName: '', // missing
    whatsapp: '+40727000111',
  };

  const req4 = new Request('http://localhost:3000/api/assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.4' },
    body: JSON.stringify(invalidPayload),
  });

  const res4 = await POST(req4);
  const data4 = await res4.json();
  assert(res4.status === 400 && data4.error === 'Missing required fields', 'Invalid payload returns 400 Bad Request');

  // -------------------------------------------------------------
  // Test 9: Safe Resend Dispatch with Missing / Invalid Keys
  // -------------------------------------------------------------
  console.log('\n--- Test 9: Safe Resend Dispatch when unconfigured / failing ---');
  delete process.env.RESEND_API_KEY;
  const dispatchResult = await sendPathfinderEmails(internalData);
  assert(
    dispatchResult.internalSent === false && dispatchResult.applicantSent === false,
    'sendPathfinderEmails safely handles unconfigured Resend without throwing'
  );

  // -------------------------------------------------------------
  // Test 10: Resend API failure simulation (Safe Error Handling)
  // -------------------------------------------------------------
  console.log('\n--- Test 10: Resend API failure simulation ---');
  process.env.RESEND_API_KEY = 're_dummy_test_key';
  process.env.DORVIA_LEADS_EMAIL = 'leads@example.com';
  process.env.RESEND_FROM_EMAIL = 'DORVIA <notifications@notifications.dorvia.ro>';

  const failureResult = await sendPathfinderEmails(internalData);
  assert(
    typeof failureResult === 'object' && failureResult.internalSent === false,
    'Resend network/auth failure is caught cleanly without failing lead capture'
  );

  // -------------------------------------------------------------
  // Test 11: Route handler end-to-end with simulated Resend config
  // -------------------------------------------------------------
  console.log('\n--- Test 11: Route handler end-to-end with simulated Resend config ---');
  const req5 = new Request('http://localhost:3000/api/assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.5' },
    body: JSON.stringify(validPayload),
  });

  const res5 = await POST(req5);
  const data5 = await res5.json();
  assert(res5.status === 200 && data5.success === true, 'End-to-end lead submission succeeds with 200 regardless of Resend response');

  // Clean up env vars
  delete process.env.RESEND_API_KEY;
  delete process.env.DORVIA_LEADS_EMAIL;
  delete process.env.RESEND_FROM_EMAIL;

  // Restore environment variables
  if (oldBotToken) process.env.TELEGRAM_BOT_TOKEN = oldBotToken;
  if (oldChatId) process.env.TELEGRAM_CHAT_ID = oldChatId;

  console.log(`\n========================================`);
  console.log(`Test Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
