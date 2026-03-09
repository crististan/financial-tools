import type { Metadata } from "next";
import dictionary from "@/dictionaries/en/currency-converter";

export const metadata: Metadata = {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    keywords: dictionary.meta.keywords,
};

export default function CurrencyConverterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: dictionary.faq.items.map((item) => ({
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
        name: dictionary.hero.headline,
        description: dictionary.hero.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
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
            {children}
        </>
    );
}
