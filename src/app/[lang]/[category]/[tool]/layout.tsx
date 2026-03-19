import type { Metadata } from "next";
import { getToolBySlug, getToolTranslation, getCategoryBySlug, getCategoryTranslation, getPrimaryCategorySlug } from "@/lib/tool-data";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string; tool: string }> }): Promise<Metadata> {
    const { lang, category: categorySlug, tool: toolSlug } = await params;
    const toolData = await getToolBySlug(toolSlug, lang);

    if (!toolData) {
        return { title: "Not Found" };
    }

    const translation = getToolTranslation(toolData, lang);

    // Canonical URL points to primary category version
    const primaryCatSlug = await getPrimaryCategorySlug(toolData, lang);
    const prefix = lang === "en" ? "" : `/${lang}`;
    const canonicalPath = `${prefix}/${primaryCatSlug}/${translation.slug}`;
    const isCanonical = categorySlug === primaryCatSlug;

    return {
        title: translation.meta.title,
        description: translation.meta.description,
        keywords: translation.meta.keywords,
        ...(!isCanonical && {
            alternates: {
                canonical: canonicalPath,
            },
        }),
    };
}

export default async function ToolLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string; category: string; tool: string }>;
}) {
    const { lang, category: categorySlug, tool: toolSlug } = await params;
    const toolData = await getToolBySlug(toolSlug, lang);

    if (!toolData) {
        return <>{children}</>;
    }

    const translation = getToolTranslation(toolData, lang);

    // Get category data for breadcrumb
    const categoryData = await getCategoryBySlug(categorySlug, lang);
    const categoryTranslation = categoryData ? getCategoryTranslation(categoryData, lang) : null;

    const prefix = lang === "en" ? "" : `/${lang}`;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: translation.faq.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };

    const appSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: translation.hero.headline,
        description: translation.hero.description,
        applicationCategory: toolData.applicationCategory,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: translation.howItWorks.sectionTitle,
        step: translation.howItWorks.steps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.title,
            text: step.description,
        })),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `https://toolframe.net${prefix || "/"}`,
            },
            ...(categoryTranslation
                ? [
                      {
                          "@type": "ListItem",
                          position: 2,
                          name: categoryTranslation.headline,
                          item: `https://toolframe.net${prefix}/${categorySlug}`,
                      },
                  ]
                : []),
            {
                "@type": "ListItem",
                position: categoryTranslation ? 3 : 2,
                name: translation.hero.headline,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {children}
        </>
    );
}
