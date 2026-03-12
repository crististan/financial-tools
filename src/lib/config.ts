import type { CommonDictionary } from "@/dictionaries/en/common";

export const CONFIG = {
    tools: [
        {
            slug: "currency-converter",
            iconPath: "/icons/currency-converter-icon.svg",
            titleKey: "currencyConverter" as const,
            descriptionKey: "currencyConverterDescription" as const,
        },
        {
            slug: "loan-repayment-calculator",
            iconPath: "/icons/loan-repayment-calculator-icon.svg",
            titleKey: "loanRepaymentCalculator" as const,
            descriptionKey: "loanRepaymentCalculatorDescription" as const,
        },
        {
            slug: "unit-converter",
            iconPath: "/icons/unit-converter-icon.svg",
            titleKey: "meterConverter" as const,
            descriptionKey: "meterConverterDescription" as const,
        },
        {
            slug: "monthly-budget-tracker",
            iconPath: "/icons/monthly-budget-tracker-icon.svg",
            titleKey: "monthlyBudgetTracker" as const,
            descriptionKey: "monthlyBudgetTrackerDescription" as const,
        },
    ],
    usefulLinks: [
        {
            slug: "/components",
            title: "Components",
        },
        {
            slug: "/docs",
            title: "Documentation",
        },
        {
            slug: "/blog",
            title: "Blog",
        },
    ],
};

export type ToolConfig = (typeof CONFIG.tools)[number];

export function getLocalizedTools(common: CommonDictionary, lang: string) {
    const prefix = lang === "en" ? "" : `/${lang}`;
    return CONFIG.tools.map((tool) => ({
        slug: tool.slug,
        iconPath: tool.iconPath,
        title: common.tools[tool.titleKey],
        shortDescription: common.tools[tool.descriptionKey],
        cta: {
            href: `${prefix}/${tool.slug}`,
            text: common.tools.cta,
        },
    }));
}
