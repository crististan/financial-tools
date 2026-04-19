import { locales } from "./i18n";

// ---- Tool Types ----

export interface ToolStep {
    number: number;
    icon?: string;
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
    categories: string[];
    applicationCategory: string;
    layout?: "side-by-side" | "fullwidth";
    config: ToolConfig;
    translations: Record<string, ToolTranslation>;
}

// ---- Category Types ----

export interface CategoryFaqItem {
    question: string;
    answer: string;
}

export interface CategoryTranslation {
    slug: string;
    meta: {
        title: string;
        description: string;
        keywords: string[];
    };
    headline: string;
    description: string;
    faq: {
        sectionTitle: string;
        items: CategoryFaqItem[];
    };
}

export interface CategoryData {
    id: string;
    order: number;
    translations: Record<string, CategoryTranslation>;
}

interface CategoriesFile {
    categories: CategoryData[];
}

// ---- Tool Loaders ----

const toolModules: Record<string, () => Promise<ToolData>> = {
    "currency-converter": () => import("@/data/tools/currency-converter.json").then((m) => m.default as unknown as ToolData),
    "unit-converter": () => import("@/data/tools/unit-converter.json").then((m) => m.default as unknown as ToolData),
    "loan-repayment-calculator": () => import("@/data/tools/loan-repayment-calculator.json").then((m) => m.default as unknown as ToolData),
    "monthly-budget-tracker": () => import("@/data/tools/monthly-budget-tracker.json").then((m) => m.default as unknown as ToolData),
    "solar-energy-estimator": () => import("@/data/tools/solar-energy-estimator.json").then((m) => m.default as unknown as ToolData),
    "compound-interest-calculator": () => import("@/data/tools/compound-interest-calculator.json").then((m) => m.default as unknown as ToolData),
    "nautical-fuel-calculator": () => import("@/data/tools/nautical-fuel-calculator.json").then((m) => m.default as unknown as ToolData),
    "salary-calculator": () => import("@/data/tools/salary-calculator.json").then((m) => m.default as unknown as ToolData),
    "unemployment-calculator": () => import("@/data/tools/unemployment-calculator.json").then((m) => m.default as unknown as ToolData),
    "pension-calculator": () => import("@/data/tools/pension-calculator.json").then((m) => m.default as unknown as ToolData),
    "split-bill-calculator": () => import("@/data/tools/split-bill-calculator.json").then((m) => m.default as unknown as ToolData),
    "fire-calculator": () => import("@/data/tools/fire-calculator.json").then((m) => m.default as unknown as ToolData),
    "freelance-rate-calculator": () => import("@/data/tools/freelance-rate-calculator.json").then((m) => m.default as unknown as ToolData),
    "rental-yield-calculator": () => import("@/data/tools/rental-yield-calculator.json").then((m) => m.default as unknown as ToolData),
    "weight-volume-converter": () => import("@/data/tools/weight-volume-converter.json").then((m) => m.default as unknown as ToolData),
    "wedding-budget-calculator": () => import("@/data/tools/wedding-budget-calculator.json").then((m) => m.default as unknown as ToolData),
    "moving-cost-estimator": () => import("@/data/tools/moving-cost-estimator.json").then((m) => m.default as unknown as ToolData),
    "emergency-fund-calculator": () => import("@/data/tools/emergency-fund-calculator.json").then((m) => m.default as unknown as ToolData),
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

/** Generate all { lang, category, tool } triplets for generateStaticParams */
export async function getStaticToolParams(): Promise<{ lang: string; category: string; tool: string }[]> {
    const allTools = await getAllTools();
    const categories = await getAllCategories();
    const params: { lang: string; category: string; tool: string }[] = [];

    for (const tool of allTools) {
        for (const locale of locales) {
            const tr = tool.translations[locale];
            if (!tr) continue;

            // Generate a page for each category this tool belongs to
            for (const catId of tool.categories) {
                const cat = categories.find((c) => c.id === catId);
                const catTr = cat?.translations[locale];
                if (!catTr) continue;
                params.push({ lang: locale, category: catTr.slug, tool: tr.slug });
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

/** Get a mapping of slug-path → translated slug-path for language switching.
 *  Maps composite paths: "category/tool" → "translated-category/translated-tool"
 *  Also maps standalone category slugs: "category" → "translated-category" */
export async function getSlugMap(fromLang: string, toLang: string): Promise<Record<string, string>> {
    const allTools = await getAllTools();
    const categories = await getAllCategories();
    const map: Record<string, string> = {};

    // Map category slugs (standalone)
    for (const cat of categories) {
        const fromCatTr = cat.translations[fromLang];
        const toCatTr = cat.translations[toLang];
        if (fromCatTr && toCatTr) {
            map[fromCatTr.slug] = toCatTr.slug;
        }
    }

    // Map composite category/tool paths
    for (const tool of allTools) {
        const fromToolTr = tool.translations[fromLang];
        const toToolTr = tool.translations[toLang];
        if (!fromToolTr || !toToolTr) continue;

        for (const catId of tool.categories) {
            const cat = categories.find((c) => c.id === catId);
            const fromCatTr = cat?.translations[fromLang];
            const toCatTr = cat?.translations[toLang];
            if (fromCatTr && toCatTr) {
                map[`${fromCatTr.slug}/${fromToolTr.slug}`] = `${toCatTr.slug}/${toToolTr.slug}`;
            }
        }
    }

    return map;
}

/** Get localized tools data for homepage cards & CTA sections.
 *  Only includes tools that have a translation for the requested language.
 *  Uses the primary category (first in array) for href. */
export async function getLocalizedToolsFromJson(lang: string) {
    const allTools = await getAllTools();
    const categories = await getAllCategories();
    const prefix = lang === "en" ? "" : `/${lang}`;

    return allTools
        .filter((tool) => tool.translations[lang] != null)
        .map((tool) => {
            const tr = tool.translations[lang];
            const primaryCatId = tool.categories[0];
            const primaryCat = categories.find((c) => c.id === primaryCatId);
            const catSlug = primaryCat?.translations[lang]?.slug ?? primaryCatId;

            return {
                id: tool.id,
                slug: tr.slug,
                iconPath: tool.iconPath,
                title: tr.hero.headline,
                shortDescription: tr.hero.description,
                categoryId: primaryCatId,
                cta: {
                    href: `${prefix}/${catSlug}/${tr.slug}`,
                    text: "", // Will be filled by common dictionary cta text
                },
            };
        });
}

// ---- Category Loaders ----

let categoriesCache: CategoryData[] | null = null;

/** Load all categories from categories.json */
export async function getAllCategories(): Promise<CategoryData[]> {
    if (categoriesCache) return categoriesCache;
    const data: CategoriesFile = await import("@/data/categories.json").then((m) => m.default as unknown as CategoriesFile);
    categoriesCache = data.categories.sort((a, b) => a.order - b.order);
    return categoriesCache;
}

/** Find a category by its translated slug for a given language */
export async function getCategoryBySlug(slug: string, lang: string): Promise<CategoryData | null> {
    const categories = await getAllCategories();
    const safeLang = lang || "en";
    return (
        categories.find((c) => {
            const tr = c.translations[safeLang];
            return tr && tr.slug === slug;
        }) ?? null
    );
}

/** Find a category by its internal ID */
export async function getCategoryById(id: string): Promise<CategoryData | null> {
    const categories = await getAllCategories();
    return categories.find((c) => c.id === id) ?? null;
}

/** Get the translated slug for a category */
export function getCategoryTranslation(category: CategoryData, lang: string): CategoryTranslation {
    return category.translations[lang] ?? category.translations["en"];
}

/** Generate all { lang, category } pairs for category page generateStaticParams.
 *  Only generates params for lang+category combos that have at least 1 tool. */
export async function getStaticCategoryParams(): Promise<{ lang: string; category: string }[]> {
    const categories = await getAllCategories();
    const allTools = await getAllTools();
    const params: { lang: string; category: string }[] = [];

    for (const cat of categories) {
        for (const locale of locales) {
            const catTr = cat.translations[locale];
            if (!catTr) continue;

            // Only include if at least 1 tool in this category has this language
            const hasTools = allTools.some(
                (t) => t.categories.includes(cat.id) && t.translations[locale] != null
            );
            if (hasTools) {
                params.push({ lang: locale, category: catTr.slug });
            }
        }
    }

    return params;
}

/** Get all tools that belong to a given category and have the requested language */
export async function getToolsByCategory(categoryId: string, lang: string) {
    const allTools = await getAllTools();
    const categories = await getAllCategories();
    const prefix = lang === "en" ? "" : `/${lang}`;
    const cat = categories.find((c) => c.id === categoryId);
    const catSlug = cat?.translations[lang]?.slug ?? categoryId;

    return allTools
        .filter((tool) => tool.categories.includes(categoryId) && tool.translations[lang] != null)
        .map((tool) => {
            const tr = tool.translations[lang];
            return {
                id: tool.id,
                slug: tr.slug,
                iconPath: tool.iconPath,
                title: tr.hero.headline,
                shortDescription: tr.hero.description,
                cta: {
                    href: `${prefix}/${catSlug}/${tr.slug}`,
                    text: "",
                },
            };
        });
}

/** Get the primary category slug for a tool in a given language */
export async function getPrimaryCategorySlug(toolData: ToolData, lang: string): Promise<string> {
    const categories = await getAllCategories();
    const primaryCatId = toolData.categories[0];
    const cat = categories.find((c) => c.id === primaryCatId);
    return cat?.translations[lang]?.slug ?? primaryCatId;
}

/** Get all categories with their tools for navigation (grouped) */
export async function getCategoriesWithTools(lang: string) {
    const categories = await getAllCategories();
    const allTools = await getAllTools();
    const prefix = lang === "en" ? "" : `/${lang}`;

    return categories
        .map((cat) => {
            const catTr = cat.translations[lang];
            if (!catTr) return null;

            const tools = allTools
                .filter((t) => t.categories.includes(cat.id) && t.translations[lang] != null)
                .map((t) => {
                    const tr = t.translations[lang];
                    return {
                        slug: `${prefix}/${catTr.slug}/${tr.slug}`,
                        title: tr.hero.headline,
                        shortDescription: tr.hero.description,
                        iconPath: t.iconPath,
                    };
                });

            if (tools.length === 0) return null;

            return {
                id: cat.id,
                headline: catTr.headline,
                slug: `${prefix}/${catTr.slug}`,
                tools,
            };
        })
        .filter((c) => c !== null);
}
