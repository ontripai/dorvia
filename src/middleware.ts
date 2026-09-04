import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const SUPPORTED_LOCALES = ['fa', 'en'] as const;
const DEFAULT_LOCALE = 'fa';

const KNOWN_SECTIONS = [
  'about',
  'admin',
  'articles',
  'assessment',
  'company',
  'contact',
  'immigration',
  'legal',
  'needs',
  'portal',
  'romania',
  'services',
  'start-here',
  'study',
  'universities',
  'work'
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-dorvia-locale');

  const nextWithHeaders = () => NextResponse.next({
    request: { headers: requestHeaders }
  });

  // 1. Ignore static assets, Next internals, api endpoints, and root
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname.match(/\.(.*)$/)
  ) {
    return nextWithHeaders();
  }

  // 2. Check if already localized with a supported locale
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (SUPPORTED_LOCALES.includes(firstSegment as any)) {
    // Protected route check for /portal/dashboard
    if (pathname.includes('/portal/dashboard')) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

      let response = nextWithHeaders();
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      });

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = `/${firstSegment}/portal/login`;
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }

      return response;
    }

    // Protected route check for /admin (excluding /admin/login and /admin/callback)
    if (
      pathname.includes('/admin') &&
      !pathname.includes('/admin/login') &&
      !pathname.includes('/admin/callback')
    ) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

      let response = nextWithHeaders();
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options });
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      });

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = `/${firstSegment}/admin/login`;
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }

      return response;
    }

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
