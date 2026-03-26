export const locales = ['en', 'ro', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isValidLocale(lang: string): lang is Locale {
    return locales.includes(lang as Locale);
}

export function getLocalizedPath(lang: Locale, path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (lang === defaultLocale) return cleanPath;
    return `/${lang}${cleanPath}`;
}

export function getPathWithoutLocale(pathname: string): string {
    for (const locale of locales) {
        if (locale === defaultLocale) continue;
        if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
        if (pathname === `/${locale}`) return '/';
    }
    return pathname;
}

export function getLocaleFromPath(pathname: string): Locale {
    for (const locale of locales) {
        if (locale === defaultLocale) continue;
        if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) return locale;
    }
    return defaultLocale;
}
