import { notFound } from "next/navigation";
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
import { getSponsorsForPage } from "@/lib/site-config";
import SponsorSection from "@/components/sponsor-section";
import type { CommonDictionary } from "@/dictionaries/en/common";

export async function generateStaticParams() {
    return getStaticToolParams();
}

export default async function ToolPage({ params }: { params: Promise<{ lang: string; category: string; tool: string }> }) {
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

    // Get sponsors for this tool page
    const sponsors = await getSponsorsForPage(toolData.id, lang);

    // Get the unique tool component
    const ToolComponent = getToolComponent(toolData.component);
    if (!ToolComponent) {
        notFound();
    }

    return (
        <>
            {/* Hero + Tool: side-by-side on desktop, stacked on mobile */}
            <Section className="pt-8 md:pt-12 pb-12 md:pb-20">
                <Container>
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        {/* Hero — left column, sticky within tool boundary */}
                        <div className="w-full lg:w-[340px] xl:w-[400px] flex-shrink-0 lg:sticky lg:top-8 lg:self-start">
                            <h1 className="text-2xl md:text-3xl font-medium mb-3 md:mb-4">{translation.hero.headline}</h1>
                            {translation.hero.description && (
                                <p className="text-[var(--clr-neutral-100)] text-sm leading-relaxed">{translation.hero.description}</p>
                            )}
                        </div>

                        {/* Tool — right column, fills remaining space */}
                        <div className="w-full lg:flex-1 min-w-0">
                            <ToolComponent
                                translation={translation}
                                config={toolData.config}
                            />
                        </div>
                    </div>
                </Container>
            </Section>

            {sponsors.length > 0 && (
                <Section>
                    <Container>
                        <SponsorSection sponsors={sponsors} label={common.sponsor.label} />
                    </Container>
                </Section>
            )}

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
