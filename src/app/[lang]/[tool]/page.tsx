import { notFound } from "next/navigation";
import DefaultHero from "@/components/default-hero";
import Section from "@/components/section";
import Container from "@/components/container";
import HowItWorks from "@/components/how-it-works";
import FeatureCards from "@/components/feature-cards";
import EducationalContent from "@/components/educational-content";
import FaqSection from "@/components/faq-section";
import ToolsCta from "@/components/tools-cta";
import { getToolBySlug, getToolTranslation, getStaticToolParams, getLocalizedToolsFromJson } from "@/lib/tool-data";
import { getToolComponent } from "@/components/tools";
import { getDictionary } from "@/lib/dictionaries";
import type { CommonDictionary } from "@/dictionaries/en/common";

export async function generateStaticParams() {
    return getStaticToolParams();
}

export default async function ToolPage({ params }: { params: Promise<{ lang: string; tool: string }> }) {
    const { lang, tool: toolSlug } = await params;

    // Reverse-lookup: find tool data by translated slug
    const toolData = await getToolBySlug(toolSlug, lang);
    if (!toolData) {
        notFound();
    }

    const translation = getToolTranslation(toolData, lang);
    const common = await getDictionary<CommonDictionary>(lang);

    // Get localized tools for CTA section
    const toolsForCta = await getLocalizedToolsFromJson(lang);
    const toolsWithCta = toolsForCta.map((t) => ({
        ...t,
        cta: { ...t.cta, text: common.tools.cta },
    }));

    // Get the unique tool component
    const ToolComponent = getToolComponent(toolData.component);
    if (!ToolComponent) {
        notFound();
    }

    return (
        <>
            <DefaultHero
                headline={translation.hero.headline}
                description={translation.hero.description}
            />

            {/* Unique tool component (includes its own Section/Container) */}
            <ToolComponent
                translation={translation}
                config={toolData.config}
            />

            <Section>
                <Container>
                    <HowItWorks
                        sectionTitle={translation.howItWorks.sectionTitle}
                        steps={translation.howItWorks.steps}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <FeatureCards
                        sectionTitle={translation.features.sectionTitle}
                        sectionDescription={translation.features.sectionDescription}
                        items={translation.features.items}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <EducationalContent
                        sectionTitle={translation.educational.sectionTitle}
                        articles={translation.educational.articles}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <FaqSection
                        title={translation.faq.sectionTitle}
                        items={translation.faq.items}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <ToolsCta
                        title={translation.cta.title}
                        description={translation.cta.description}
                        tools={toolsWithCta}
                        currentToolSlug={translation.slug}
                    />
                </Container>
            </Section>
        </>
    );
}
