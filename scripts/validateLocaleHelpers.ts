import { isValidLocale, parseUrlLocale, getFallbackPreference, getLocaleDirection, getLocalizedRoute, stripLocalePrefix } from '../src/lib/locale-router';

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
assert(isValidLocale('') === false, 'empty value is invalid');

console.log('\n--- Testing parseUrlLocale ---');
assert(parseUrlLocale('fa') === 'fa', 'parses URL locale fa');
assert(parseUrlLocale('en') === 'en', 'parses URL locale en');
assert(parseUrlLocale('de') === null, 'URL locale de does not resolve to fa (returns null)');
assert(parseUrlLocale('') === null, 'empty URL locale returns null');
assert(parseUrlLocale(null) === null, 'null URL locale returns null');

console.log('\n--- Testing getFallbackPreference ---');
assert(getFallbackPreference('fa') === 'fa', 'parses preference fa');
assert(getFallbackPreference('en') === 'en', 'parses preference en');
assert(getFallbackPreference('de') === 'fa', 'absent optional preference may resolve to fa only through an explicitly named default helper (de -> fa)');
assert(getFallbackPreference(null) === 'fa', 'absent optional preference may resolve to fa only through an explicitly named default helper (null -> fa)');

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
assert(r1.status === 'success' && (r1 as any).path === '/fa/about', '/about localized to fa');

let r2 = getLocalizedRoute('/about', 'en');
assert(r2.status === 'success' && (r2 as any).path === '/en/about', '/about localized to en');

let r3 = getLocalizedRoute('/', 'en');
assert(r3.status === 'success' && (r3 as any).path === '/en', 'Localizes / for en');

// 2. Already prefixed path
let r4 = getLocalizedRoute('/fa/about', 'en');
assert(r4.status === 'success' && (r4 as any).path === '/en/about', 'already-prefixed /fa/about localized to en without duplicate prefixes');

// 3. API path remains unlocalized
let r5 = getLocalizedRoute('/api/test', 'fa');
assert(r5.status === 'ignored' && (r5 as any).path === '/api/test', '/api path remains unchanged');

let r6 = getLocalizedRoute('/_next/data', 'fa');
assert(r6.status === 'ignored' && (r6 as any).path === '/_next/data', '/_next path remains unchanged');

let r6b = getLocalizedRoute('/logo.png', 'fa');
assert(r6b.status === 'ignored' && (r6b as any).path === '/logo.png', 'common static asset paths remain unchanged');

// 4. Missing translation (we will mock this by setting missingTranslations on a route in ROUTE_REGISTRY)
import { ROUTE_REGISTRY } from '../src/lib/routeRegistry';
ROUTE_REGISTRY['needs/banking'].missingTranslations = ['en'];

let r7 = getLocalizedRoute('/needs/banking', 'en');
assert(r7.status === 'unavailable' && (r7 as any).reason === 'missing_translation', 'missing translation returns missing_translation');
assert(r7.status !== 'success' || (r7 as any).path !== '/', 'missing translation never returns homepage');

// Clean up mock
delete ROUTE_REGISTRY['needs/banking'].missingTranslations;

let r7b = getLocalizedRoute('/non-existent-route', 'en');
assert(r7b.status === 'unavailable' && (r7b as any).reason === 'unknown_route', 'route missing from registry returns an explicit unmapped/unavailable result');
assert(r7b.status !== 'success' || (r7b as any).path !== '/', 'registry lookup does not rely on raw /fa/ ↔ /en/ replacement');

// 5. Preserves query and fragment
let r8 = getLocalizedRoute('/about?foo=bar', 'fa');
assert(r8.status === 'success' && (r8 as any).path === '/fa/about?foo=bar', 'query string preserved');

let r9 = getLocalizedRoute('/about#section', 'fa');
assert(r9.status === 'success' && (r9 as any).path === '/fa/about#section', 'fragment preserved');

let r10 = getLocalizedRoute('/about?foo=bar#section', 'fa');
assert(r10.status === 'success' && (r10 as any).path === '/fa/about?foo=bar#section', 'query and fragment preserved together');

if (hasErrors) {
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed!');
}
