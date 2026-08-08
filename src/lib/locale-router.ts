import { ROUTE_REGISTRY, RouteConfig } from './routeRegistry';

export type Locale = 'fa' | 'en';

export const LOCALES: Locale[] = ['fa', 'en'];
export const DEFAULT_LOCALE: Locale = 'fa';

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

/**
 * Strictly parses a URL locale parameter.
 * Returns null if the locale is unsupported or missing, allowing layouts to call notFound().
 */
export function parseUrlLocale(locale: string | undefined | null): Locale | null {
  if (locale && isValidLocale(locale)) return locale;
  return null;
}

/**
 * Resolves a fallback preference for client state or optional preferences.
 * Safely defaults to fa if absent or unsupported.
 */
export function getFallbackPreference(locale: string | undefined | null): Locale {
  if (locale && isValidLocale(locale)) return locale;
  return DEFAULT_LOCALE;
}

export function getLocaleDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'fa' ? 'rtl' : 'ltr';
}

export type RouteMappingResult =
  | { status: 'success'; path: string }
  | { status: 'unavailable'; reason: 'missing_translation' | 'unknown_route' }
  | { status: 'ignored'; path: string };

/**
 * Strips any supported locale prefix from a pathname, returning the bare path.
 */
export function stripLocalePrefix(pathname: string): string {
  for (const loc of LOCALES) {
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      const stripped = pathname.substring(loc.length + 1);
      return stripped === '' ? '/' : stripped;
    }
  }
  return pathname;
}

/**
 * Safely constructs a localized path by validating against the ROUTE_REGISTRY.
 * Does NOT rely on unsafe string replacement.
 */
export function getLocalizedRoute(path: string, targetLocale: Locale): RouteMappingResult {
  let urlObj;
  try {
    urlObj = new URL(path, 'http://localhost');
  } catch {
    return { status: 'unavailable', reason: 'unknown_route' };
  }

  // 1. External absolute URLs
  if (urlObj.origin !== 'http://localhost') {
    return { status: 'ignored', path };
  }

  const p = urlObj.pathname;
  // 2. Ignore API routes, Next.js internals, and static assets
  if (
    p === '/api' || p.startsWith('/api/') ||
    p === '/_next' || p.startsWith('/_next/') ||
    p.match(/\.(ico|png|jpg|jpeg|svg|css|js|json|xml|txt)$/i)
  ) {
    return { status: 'ignored', path };
  }


  let barePathname = stripLocalePrefix(urlObj.pathname);

  // 2. Find the route in the registry to ensure it's a known, valid route
  let foundConfig: RouteConfig | null = null;

  // Exact canonical match
  for (const config of Object.values(ROUTE_REGISTRY)) {
    if (config.canonical === barePathname) {
      foundConfig = config;
      break;
    }
  }

  // If not found, check if it's a base dynamic path that might just be missing from registry
  // E.g. unknown university slug. For foundation, if it's completely unknown, we reject it.
  if (!foundConfig) {
    return { status: 'unavailable', reason: 'unknown_route' };
  }

  // 4. Check for explicit missing translation
  if (foundConfig.missingTranslations?.includes(targetLocale)) {
    return { status: 'unavailable', reason: 'missing_translation' };
  }

  // 4. Construct the localized path safely
  const newPathname = barePathname === '/' ? `/${targetLocale}` : `/${targetLocale}${barePathname}`;

  return {
    status: 'success',
    path: newPathname + urlObj.search + urlObj.hash
  };
}
