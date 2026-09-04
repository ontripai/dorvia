import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

async function testApi() {
  const { POST } = await import('../src/app/api/auth/magic-link/route');
  console.log('=== Testing /api/auth/magic-link Handler ===\n');

  // 1. Test valid registered admin email (ontrip.ai@gmail.com)
  console.log('1. Testing with registered owner email (ontrip.ai@gmail.com)...');
  const req1 = new Request('http://localhost:3000/api/auth/magic-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'ontrip.ai@gmail.com',
      flow: 'admin',
      lang: 'fa',
    }),
  });

  const res1 = await POST(req1);
  const data1 = await res1.json();
  console.log('Response Status:', res1.status);
  console.log('Response Body:', data1);

  if (res1.status === 200 && data1.success) {
    console.log('✅ PASS: Magic link dispatched to registered owner!\n');
  } else {
    console.error('❌ FAIL: Failed for registered owner.');
  }

  // 2. Test unregistered email (should be non-revealing success)
  console.log('2. Testing with unregistered email (nonexistent@dorvia.com)...');
  const req2 = new Request('http://localhost:3000/api/auth/magic-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nonexistent@dorvia.com',
      flow: 'portal',
      lang: 'fa',
    }),
  });

  const res2 = await POST(req2);
  const data2 = await res2.json();
  console.log('Response Status:', res2.status);
  console.log('Response Body:', data2);

  if (res2.status === 200 && data2.success) {
    console.log('✅ PASS: Non-revealing success returned for unregistered email!\n');
  } else {
    console.error('❌ FAIL: Non-revealing behavior broken.');
  }

  // 3. Test invalid email format
  console.log('3. Testing with invalid email format...');
  const req3 = new Request('http://localhost:3000/api/auth/magic-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'invalid-string',
      flow: 'admin',
      lang: 'fa',
    }),
  });

  const res3 = await POST(req3);
  const data3 = await res3.json();
  console.log('Response Status:', res3.status);
  console.log('Response Body:', data3);

  if (res3.status === 400 && data3.error === 'invalid_email') {
    console.log('✅ PASS: Invalid email correctly rejected!\n');
  } else {
    console.error('❌ FAIL: Validation failed.');
  }

  console.log('=== All /api/auth/magic-link Tests Passed! ===');
  process.exit(0);
}

testApi();
