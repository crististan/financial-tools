import { locales } from "./i18n";

// ---- Types ----

export interface ToolStep {
    number: number;
    icon: string;
    title: string;
    description: string;
}

export interface ToolFeatureItem {
    icon: string;
    title: string;
    description: string;
}

export interface ToolArticle {
    title: string;
    content: string;
}

export interface ToolFaqItem {
    question: string;
    answer: string;
}

export interface ToolTranslation {
    slug: string;
    meta: {
        title: string;
        description: string;
        keywords: string[];
    };
    hero: {
        headline: string;
        description: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tool: Record<string, any>;
    howItWorks: {
        sectionTitle: string;
        steps: ToolStep[];
    };
    ratesTable?: {
        sectionTitle: string;
        sectionDescription: string;
        headers: {
            pair: string;
            rate: string;
            inverseRate: string;
        };
    };
    features: {
        sectionTitle: string;
        sectionDescription: string;
        items: ToolFeatureItem[];
    };
    educational: {
        sectionTitle: string;
        articles: ToolArticle[];
    };
    faq: {
        sectionTitle: string;
        items: ToolFaqItem[];
    };
    cta: {
        title: string;
        description: string;
    };
}

export interface ToolConfig {
    defaultFrom?: string;
    defaultTo?: string;
    decimals?: number;
    dataSource?: string;
}

export interface ToolData {
    id: string;
    component: string;
    iconPath: string;
    applicationCategory: string;
    config: ToolConfig;
    translations: Record<string, ToolTranslation>;
}

// ---- Loaders ----

const toolModules: Record<string, () => Promise<ToolData>> = {
    "currency-converter": () => import("@/data/tools/currency-converter.json").then((m) => m.default as ToolData),
    "unit-converter": () => import("@/data/tools/unit-converter.json").then((m) => m.default as ToolData),
    "loan-repayment-calculator": () => import("@/data/tools/loan-repayment-calculator.json").then((m) => m.default as ToolData),
    "monthly-budget-tracker": () => import("@/data/tools/monthly-budget-tracker.json").then((m) => m.default as ToolData),
};

const toolIds = Object.keys(toolModules);

/** Load a tool by its internal id (filename without extension) */
export async function getToolById(id: string): Promise<ToolData | null> {
    const loader = toolModules[id];
    if (!loader) return null;
    return loader();
}

/** Load ALL tool data objects */
export async function getAllTools(): Promise<ToolData[]> {
    return Promise.all(toolIds.map((id) => toolModules[id]()));
}

/** Reverse-lookup: find the tool whose translated slug matches for a given language */
export async function getToolBySlug(slug: string, lang: string): Promise<ToolData | null> {
    const allTools = await getAllTools();
    const safeLang = lang || "en";
    return (
        allTools.find((t) => {
            const tr = t.translations[safeLang];
            return tr && tr.slug === slug;
        }) ?? null
    );
}

/** Extract translations for a specific language (falls back to 'en') */
export function getToolTranslation(toolData: ToolData, lang: string): ToolTranslation {
    return toolData.translations[lang] ?? toolData.translations["en"];
}

/** Generate all { lang, tool } pairs for generateStaticParams */
export async function getStaticToolParams(): Promise<{ lang: string; tool: string }[]> {
    const allTools = await getAllTools();
    const params: { lang: string; tool: string }[] = [];

    for (const tool of allTools) {
        for (const locale of locales) {
            const tr = tool.translations[locale];
            if (tr) {
                params.push({ lang: locale, tool: tr.slug });
            }
        }
    }

    return params;
}

/** Get the localized slug for a tool id + language */
export async function getLocalizedToolSlug(toolId: string, lang: string): Promise<string> {
    const tool = await getToolById(toolId);
    if (!tool) return toolId;
    const tr = tool.translations[lang] ?? tool.translations["en"];
    return tr.slug;
}

/** Get a mapping of slug → translated slug for another language (for language switching) */
export async function getSlugMap(fromLang: string, toLang: string): Promise<Record<string, string>> {
    const allTools = await getAllTools();
    const map: Record<string, string> = {};
    for (const tool of allTools) {
        const fromTr = tool.translations[fromLang];
        const toTr = tool.translations[toLang];
        if (fromTr && toTr) {
            map[fromTr.slug] = toTr.slug;
        }
    }
    return map;
}

/** Get localized tools data for homepage cards & CTA sections */
export async function getLocalizedToolsFromJson(lang: string) {
    const allTools = await getAllTools();
    const prefix = lang === "en" ? "" : `/${lang}`;

    return allTools.map((tool) => {
        const tr = tool.translations[lang] ?? tool.translations["en"];
        return {
            id: tool.id,
            slug: tr.slug,
            iconPath: tool.iconPath,
            title: tr.hero.headline,
            shortDescription: tr.hero.description,
            cta: {
                href: `${prefix}/${tr.slug}`,
                text: "", // Will be filled by common dictionary cta text
            },
        };
    });
}
