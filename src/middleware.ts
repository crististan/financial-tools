import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static files, api, _next
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/icons') ||
        pathname.includes('.') // static files like .svg, .css, .js
    ) {
        return NextResponse.next();
    }

    // Check if path already has a non-default locale prefix
    for (const locale of locales) {
        if (locale === defaultLocale) continue;
        if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
            return NextResponse.next();
        }
    }

    // Rewrite to /en/... internally for default locale
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url);
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
