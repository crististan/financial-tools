// ---- Types ----

export interface SponsorTranslation {
    text: string;
    linkText: string;
    linkUrl: string;
}

export interface SponsorEntry {
    id: string;
    status: "active" | "inactive";
    pages: string[];
    translations: Record<string, SponsorTranslation>;
}

export interface SiteConfig {
    sponsors: SponsorEntry[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    solarEstimator?: Record<string, any>;
}

// ---- Loader ----

let cachedConfig: SiteConfig | null = null;

async function getSiteConfig(): Promise<SiteConfig> {
    if (!cachedConfig) {
        const mod = await import("@/data/site-config.json");
        cachedConfig = mod.default as unknown as SiteConfig;
    }
    return cachedConfig;
}

/** Get solar estimator config data from site-config.json */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSolarEstimatorConfig(): Promise<any> {
    const config = await getSiteConfig();
    return config.solarEstimator;
}

/** Get active sponsors for a specific page + language (returns translated items) */
export async function getSponsorsForPage(
    pageId: string,
    lang: string
): Promise<SponsorTranslation[]> {
    const config = await getSiteConfig();

    return config.sponsors
        .filter((s) => s.status === "active" && s.pages.includes(pageId))
        .map((s) => s.translations[lang] ?? s.translations["en"])
        .filter(Boolean);
}
