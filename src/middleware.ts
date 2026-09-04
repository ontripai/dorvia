import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['fa', 'en'] as const;
const DEFAULT_LOCALE = 'fa';

const KNOWN_SECTIONS = [
  'about',
  'articles',
  'assessment',
  'company',
  'contact',
  'immigration',
  'legal',
  'needs',
  'romania',
  'services',
  'start-here',
  'study',
  'universities',
  'work'
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-dorvia-locale');

  const nextWithHeaders = () => NextResponse.next({
    request: { headers: requestHeaders }
  });

  // 1. Ignore static assets, Next internals, api endpoints, root, and admin
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname.startsWith('/admin') ||
    pathname.match(/\.(.*)$/)
  ) {
    return nextWithHeaders();
  }

  // 2. Check if already localized with a supported locale
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (SUPPORTED_LOCALES.includes(firstSegment as any)) {
    return nextWithHeaders();
  }

  // 3. Handle legacy /evaluation route specifically -> /fa/assessment
  if (pathname === '/evaluation' || pathname.startsWith('/evaluation/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/fa/assessment`;
    return NextResponse.redirect(url, 308);
  }

  // 4. Handle known top-level sections without locale prefix (e.g. /study, /needs/driving-license, /assessment)
  if (KNOWN_SECTIONS.includes(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url, 308);
  }

  // 5. Fallback for unrecognized prefixes (e.g., unsupported locale code like /fr/study -> /fa/study)
  if (segments.length > 1 && KNOWN_SECTIONS.includes(segments[1])) {
    const cleanPath = '/' + segments.slice(1).join('/');
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${cleanPath}`;
    return NextResponse.redirect(url, 308);
  }

  return nextWithHeaders();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
