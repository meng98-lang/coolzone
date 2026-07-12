import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

// Paths that should NOT be localized
const SKIP_PREFIXES = ['/api', '/admin', '/_next', '/favicon', '/products/hero'];

function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/');
  if (segments.length >= 2) {
    const possibleLocale = segments[1] as Locale;
    if (locales.includes(possibleLocale)) {
      return possibleLocale;
    }
  }
  return null;
}

function detectBrowserLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  const languageMatches = acceptLanguage.matchAll(
    /([a-z]{2})(?:-[A-Z]{2})?(?:;q=([0-9.]+))?/gi
  );
  
  const preferences: Array<{ locale: string; quality: number }> = [];
  for (const match of languageMatches) {
    const lang = match[1].toLowerCase();
    const quality = match[2] ? parseFloat(match[2]) : 1.0;
    preferences.push({ locale: lang, quality });
  }
  
  preferences.sort((a, b) => b.quality - a.quality);
  
  for (const pref of preferences) {
    if (locales.includes(pref.locale as Locale)) {
      return pref.locale as Locale;
    }
  }
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip API routes, admin, static files, and special paths
  if (SKIP_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }
  
  // Skip static files
  if (/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/.test(pathname)) {
    return NextResponse.next();
  }
  
  // Check if the path already has a locale
  const pathnameLocale = getLocaleFromPath(pathname);
  if (pathnameLocale) {
    const response = NextResponse.next();
    response.headers.set('x-locale', pathnameLocale);
    return response;
  }
  
  // For root path or paths without locale, redirect to detected locale
  const browserLocale = detectBrowserLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${browserLocale}${pathname === '/' ? '' : pathname}`;
  
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (Next.js internals)
     * - api (API routes)
     * - admin (admin panel)
     * - Static files with extensions
     */
    '/((?!_next|api|admin|.*\\..*$).*)',
  ],
};
