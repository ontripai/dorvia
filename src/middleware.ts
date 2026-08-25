import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-dorvia-locale');

  const firstSegment = pathname.split('/')[1];

  const nextWithHeaders = () => NextResponse.next({
    request: { headers: requestHeaders }
  });

  // Ignore static assets, next internals, and already localized paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/fa/') || pathname === '/fa' ||
    pathname.startsWith('/en/') || pathname === '/en' ||
    pathname.match(/\.(.*)$/) ||
    pathname === '/' ||
    pathname.startsWith('/admin')
  ) {
    return nextWithHeaders();
  }

  // Only redirect known unprefixed legacy routes to /fa equivalents
  const exactRoutes = ['/about', '/contact', '/legal/privacy', '/legal/terms', '/legal/disclaimer'];
  const knownPrefixes = ['/articles', '/company', '/immigration', '/needs', '/romania', '/services', '/start-here', '/study', '/universities', '/work'];

  if (
    exactRoutes.includes(pathname) ||
    knownPrefixes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/fa${pathname}`;
    return NextResponse.redirect(url, 308);
  }

  return nextWithHeaders();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
