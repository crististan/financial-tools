import type { Metadata } from "next";
import { getToolBySlug, getToolTranslation } from "@/lib/tool-data";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; tool: string }> }): Promise<Metadata> {
    const { lang, tool: toolSlug } = await params;
    const toolData = await getToolBySlug(toolSlug, lang);

    if (!toolData) {
        return { title: "Not Found" };
    }

    const translation = getToolTranslation(toolData, lang);

    return {
        title: translation.meta.title,
        description: translation.meta.description,
        keywords: translation.meta.keywords,
    };
}

export default async function ToolLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string; tool: string }>;
}) {
    const { lang, tool: toolSlug } = await params;
    const toolData = await getToolBySlug(toolSlug, lang);

    if (!toolData) {
        return <>{children}</>;
    }

    const translation = getToolTranslation(toolData, lang);

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
            {children}
        </>
    );
}
