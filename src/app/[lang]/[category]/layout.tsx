import type { Metadata } from "next";
import { getCategoryBySlug, getCategoryTranslation, getToolsByCategory } from "@/lib/tool-data";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string }> }): Promise<Metadata> {
    const { lang, category: categorySlug } = await params;
    const categoryData = await getCategoryBySlug(categorySlug, lang);

    if (!categoryData) {
        return { title: "Not Found" };
    }

    const translation = getCategoryTranslation(categoryData, lang);

    return {
        title: translation.meta.title,
        description: translation.meta.description,
        keywords: translation.meta.keywords,
    };
}

export default async function CategoryLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string; category: string }>;
}) {
    const { lang, category: categorySlug } = await params;
    const categoryData = await getCategoryBySlug(categorySlug, lang);

    if (!categoryData) {
        return <>{children}</>;
    }

    const translation = getCategoryTranslation(categoryData, lang);
    const prefix = lang === "en" ? "" : `/${lang}`;

    // Get tools for ItemList schema
    const tools = await getToolsByCategory(categoryData.id, lang);

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: translation.headline,
        description: translation.description,
        mainEntity: {
            "@type": "ItemList",
            itemListElement: tools.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: tool.title,
                url: `https://toolframe.net${tool.cta.href}`,
            })),
        },
    };

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
            {
                "@type": "ListItem",
                position: 2,
                name: translation.headline,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {children}
        </>
    );
}
