import { isValidLocale, parseLocale, getLocaleDirection, getLocalizedRoute, stripLocalePrefix } from '../src/lib/locale-router';

let hasErrors = false;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    hasErrors = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- Testing isValidLocale ---');
assert(isValidLocale('fa') === true, 'fa is valid');
assert(isValidLocale('en') === true, 'en is valid');
assert(isValidLocale('de') === false, 'de is invalid');
assert(isValidLocale('') === false, 'empty is invalid');

console.log('\n--- Testing parseLocale ---');
assert(parseLocale('fa') === 'fa', 'parses fa');
assert(parseLocale('en') === 'en', 'parses en');
assert(parseLocale('de') === 'fa', 'falls back on invalid (de)');
assert(parseLocale(null) === 'fa', 'falls back on null');

console.log('\n--- Testing getLocaleDirection ---');
assert(getLocaleDirection('fa') === 'rtl', 'fa maps to rtl');
assert(getLocaleDirection('en') === 'ltr', 'en maps to ltr');

console.log('\n--- Testing stripLocalePrefix ---');
assert(stripLocalePrefix('/fa/about') === '/about', 'strips /fa/');
assert(stripLocalePrefix('/en/about') === '/about', 'strips /en/');
assert(stripLocalePrefix('/fa') === '/', 'strips /fa exactly');
assert(stripLocalePrefix('/en') === '/', 'strips /en exactly');
assert(stripLocalePrefix('/about') === '/about', 'no-op for non-prefixed');

console.log('\n--- Testing getLocalizedRoute ---');
// 1. Valid route translation
let r1 = getLocalizedRoute('/about', 'fa');
assert(r1.status === 'success' && (r1 as any).path === '/fa/about', 'Localizes /about for fa');

let r2 = getLocalizedRoute('/about', 'en');
assert(r2.status === 'success' && (r2 as any).path === '/en/about', 'Localizes /about for en');

let r3 = getLocalizedRoute('/', 'en');
assert(r3.status === 'success' && (r3 as any).path === '/en', 'Localizes / for en');

// 2. Already prefixed path
let r4 = getLocalizedRoute('/fa/about', 'en');
assert(r4.status === 'success' && (r4 as any).path === '/en/about', 'No duplicate prefix, strips /fa and replaces with /en');

// 3. API path remains unlocalized
let r5 = getLocalizedRoute('/api/test', 'fa');
assert(r5.status === 'ignored' && (r5 as any).path === '/api/test', 'API paths remain ignored');

let r6 = getLocalizedRoute('/_next/data', 'fa');
assert(r6.status === 'ignored' && (r6 as any).path === '/_next/data', 'Next internals ignored');

// 4. Missing translation (we will mock this by setting missingTranslations on a route in ROUTE_REGISTRY)
import { ROUTE_REGISTRY } from '../src/lib/routeRegistry';
ROUTE_REGISTRY['needs/banking'].missingTranslations = ['en'];

let r7 = getLocalizedRoute('/needs/banking', 'en');
assert(r7.status === 'unavailable' && (r7 as any).reason === 'missing_translation', 'Explicit unavailable result on missing translation');

// Clean up mock
delete ROUTE_REGISTRY['needs/banking'].missingTranslations;

// 5. Preserves query and fragment
let r8 = getLocalizedRoute('/about?foo=bar#section', 'fa');
assert(r8.status === 'success' && (r8 as any).path === '/fa/about?foo=bar#section', 'Preserves query strings and fragments');

if (hasErrors) {
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed!');
}
