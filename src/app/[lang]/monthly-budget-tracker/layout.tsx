import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import type { MonthlyBudgetTrackerDictionary } from "@/dictionaries/en/monthly-budget-tracker";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const dictionary = await getDictionary<MonthlyBudgetTrackerDictionary>(lang, 'monthly-budget-tracker');
    return {
        title: dictionary.meta.title,
        description: dictionary.meta.description,
        keywords: dictionary.meta.keywords,
    };
}

export default async function MonthlyBudgetTrackerLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dictionary = await getDictionary<MonthlyBudgetTrackerDictionary>(lang, 'monthly-budget-tracker');

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

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: dictionary.howItWorks.sectionTitle,
        step: dictionary.howItWorks.steps.map((step, index) => ({
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
