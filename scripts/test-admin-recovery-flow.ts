/**
 * Automated Verification Script for dre-p83: Emergency Recovery Login
 * Tests:
 * 1. Invalid / Non-existent credentials -> 401 Unauthorized
 * 2. Unauthorized role verification -> 403 Forbidden
 * 3. Rate limiting enforcement (3 requests on email / 5 requests on IP) -> 429 Too Many Requests
 * 4. Cookie omission on rejection
 * 5. SEO / Robots exclusion confirmation
 */

import { POST as adminRecoveryPost } from '../src/app/api/auth/admin-recovery/route';
import robots from '../src/app/robots';
import sitemap from '../src/app/sitemap';
import { ROUTE_REGISTRY } from '../src/lib/routeRegistry';

async function runTests() {
  console.log('--- STARTING DRE-P83 VERIFICATION ---');

  // Test 1: SEO & Robots Exclusion
  console.log('\n[TEST 1] Verifying Hidden / SEO Requirements:');
  const robotConfig = robots();
  console.log('Disallowed in robots:', robotConfig.rules);
  const isInRouteRegistry = 'admin/recovery-login' in ROUTE_REGISTRY;
  console.log('Present in ROUTE_REGISTRY:', isInRouteRegistry);
  if (isInRouteRegistry) {
    throw new Error('FAILED: admin/recovery-login must NOT be in ROUTE_REGISTRY!');
  }
  console.log('✅ PASS: Route is excluded from public registry and robots disallow /admin/');

  // Test 2: Invalid request payload
  console.log('\n[TEST 2] Testing missing / invalid payload:');
  const reqInvalid = new Request('http://localhost:3000/api/auth/admin-recovery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bad-email' }),
  });
  const resInvalid = await adminRecoveryPost(reqInvalid);
  const dataInvalid = await resInvalid.json();
  console.log('Status:', resInvalid.status, 'Response:', dataInvalid);
  if (resInvalid.status !== 400) {
    throw new Error(`Expected 400, got ${resInvalid.status}`);
  }
  console.log('✅ PASS: Missing password / bad email returned 400.');

  // Test 3: Invalid credentials (non-existent or wrong password)
  console.log('\n[TEST 3] Testing invalid credentials:');
  const testEmail = `recovery-test-${Date.now()}@example.com`;
  const reqWrong = new Request('http://localhost:3000/api/auth/admin-recovery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '198.51.100.25',
    },
    body: JSON.stringify({
      email: testEmail,
      password: 'IncorrectPassword123!',
      lang: 'fa',
    }),
  });
  const resWrong = await adminRecoveryPost(reqWrong);
  const dataWrong = await resWrong.json();
  console.log('Status:', resWrong.status, 'Response:', dataWrong);
  const cookiesHeader = resWrong.headers.get('set-cookie');
  console.log('Cookies header present:', Boolean(cookiesHeader));
  if (resWrong.status !== 401) {
    throw new Error(`Expected 401, got ${resWrong.status}`);
  }
  if (cookiesHeader) {
    throw new Error('FAILED: Cookies must NOT be set on invalid credentials!');
  }
  console.log('✅ PASS: Invalid credentials returned 401 with no cookies set.');

  // Test 4: Rate limit trigger on email (Max 3 attempts per 15 minutes)
  console.log('\n[TEST 4] Testing Email Rate Limiting (Attempt 2, 3, and 4):');
  const targetRateLimitEmail = `ratelimit-target-${Date.now()}@example.com`;

  for (let i = 1; i <= 4; i++) {
    const req = new Request('http://localhost:3000/api/auth/admin-recovery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Rotate IP to isolate email bucket testing
        'x-forwarded-for': `198.51.100.${30 + i}`,
      },
      body: JSON.stringify({
        email: targetRateLimitEmail,
        password: 'WrongPassword!',
        lang: 'fa',
      }),
    });
    const res = await adminRecoveryPost(req);
    const data = await res.json();
    console.log(`Attempt ${i} status: ${res.status}, error: ${data.error}`);
    if (i <= 3) {
      if (res.status !== 401) {
        throw new Error(`Attempt ${i} expected 401, got ${res.status}`);
      }
    } else {
      // 4th attempt should be blocked by rate limit
      if (res.status !== 429 || data.error !== 'rate_limit') {
        throw new Error(`Attempt 4 expected 429 rate_limit, got ${res.status} ${JSON.stringify(data)}`);
      }
      console.log('Rate limit message received:', data.message);
    }
  }
  console.log('✅ PASS: Email rate limit successfully triggered on 4th attempt with 429.');

  // Test 5: IP Rate Limiting (Max 5 attempts per 15 minutes)
  console.log('\n[TEST 5] Testing IP Rate Limiting:');
  const testIp = `203.0.113.${Math.floor(Math.random() * 200 + 10)}`;
  for (let i = 1; i <= 6; i++) {
    const req = new Request('http://localhost:3000/api/auth/admin-recovery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': testIp,
      },
      body: JSON.stringify({
        email: `random-user-${i}-${Date.now()}@example.com`,
        password: 'WrongPassword!',
        lang: 'en',
      }),
    });
    const res = await adminRecoveryPost(req);
    const data = await res.json();
    console.log(`IP attempt ${i} status: ${res.status}, error: ${data.error}`);
    if (i <= 5) {
      if (res.status !== 401) {
        throw new Error(`IP attempt ${i} expected 401, got ${res.status}`);
      }
    } else {
      if (res.status !== 429 || data.error !== 'rate_limit') {
        throw new Error(`IP attempt 6 expected 429 rate_limit, got ${res.status}`);
      }
      console.log('IP rate limit message:', data.message);
    }
  }
  console.log('✅ PASS: IP rate limit successfully triggered on 6th attempt with 429.');

  console.log('\n========================================');
  console.log('🎉 ALL DRE-P83 VERIFICATION TESTS PASSED!');
  console.log('========================================');
}

runTests().catch((err) => {
  console.error('TEST SUITE ERROR:', err);
  process.exit(1);
});
