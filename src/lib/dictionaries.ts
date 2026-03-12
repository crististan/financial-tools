import type { Locale } from './i18n';

const toolDictionaries = {
    en: {
        'currency-converter': () => import('@/dictionaries/en/currency-converter').then(m => m.default),
        'unit-converter': () => import('@/dictionaries/en/unit-converter').then(m => m.default),
        'loan-repayment-calculator': () => import('@/dictionaries/en/loan-repayment-calculator').then(m => m.default),
        'monthly-budget-tracker': () => import('@/dictionaries/en/monthly-budget-tracker').then(m => m.default),
        'common': () => import('@/dictionaries/en/common').then(m => m.default),
    },
    ro: {
        'currency-converter': () => import('@/dictionaries/ro/currency-converter').then(m => m.default),
        'unit-converter': () => import('@/dictionaries/ro/unit-converter').then(m => m.default),
        'loan-repayment-calculator': () => import('@/dictionaries/ro/loan-repayment-calculator').then(m => m.default),
        'monthly-budget-tracker': () => import('@/dictionaries/ro/monthly-budget-tracker').then(m => m.default),
        'common': () => import('@/dictionaries/ro/common').then(m => m.default),
    },
} as const;

type ToolName = keyof typeof toolDictionaries.en;

export async function getDictionary<T = Record<string, unknown>>(lang: string, tool: ToolName): Promise<T> {
    const locale = (lang in toolDictionaries ? lang : 'en') as Locale;
    const loader = toolDictionaries[locale][tool];
    return loader() as Promise<T>;
}
