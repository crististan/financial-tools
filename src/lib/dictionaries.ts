import type { Locale } from './i18n';

const commonDictionaries: Record<string, () => Promise<Record<string, unknown>>> = {
    en: () => import('@/dictionaries/en/common').then(m => m.default),
    ro: () => import('@/dictionaries/ro/common').then(m => m.default),
    de: () => import('@/dictionaries/de/common').then(m => m.default),
    fr: () => import('@/dictionaries/fr/common').then(m => m.default),
    it: () => import('@/dictionaries/it/common').then(m => m.default),
    es: () => import('@/dictionaries/es/common').then(m => m.default),
};

export async function getDictionary<T = Record<string, unknown>>(lang: string): Promise<T> {
    const locale = (lang in commonDictionaries ? lang : 'en') as Locale;
    const loader = commonDictionaries[locale];
    return loader() as Promise<T>;
}
