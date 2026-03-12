import DefaultHero from "@/components/default-hero";
import Section from "@/components/section";
import Container from "@/components/container";
import HowItWorks from "@/components/how-it-works";
import FeatureCards from "@/components/feature-cards";
import EducationalContent from "@/components/educational-content";
import FaqSection from "@/components/faq-section";
import ToolsCta from "@/components/tools-cta";
import ConverterCard from "@/components/converter-card";
import RatesTable from "@/components/rates-table";
import { unitFactors, popularConversions } from "@/lib/mock-units";
import { getLocalizedTools } from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import type { UnitConverterDictionary } from "@/dictionaries/en/unit-converter";
import type { CommonDictionary } from "@/dictionaries/en/common";

export default async function UnitConverterPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary<UnitConverterDictionary>(lang, 'unit-converter');
    const common = await getDictionary<CommonDictionary>(lang, 'common');
    const tools = getLocalizedTools(common, lang);

    return (
        <>
            <DefaultHero
                headline={dictionary.hero.headline}
                description={dictionary.hero.description}
            />

            <Section>
                <Container>
                    <ConverterCard
                        options={dictionary.options}
                        factors={unitFactors}
                        labels={dictionary.converter}
                        defaultFrom="m"
                        defaultTo="ft"
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <HowItWorks
                        sectionTitle={dictionary.howItWorks.sectionTitle}
                        steps={dictionary.howItWorks.steps}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <RatesTable
                        pairs={popularConversions}
                        factors={unitFactors}
                        headers={dictionary.ratesTable.headers}
                        title={dictionary.ratesTable.sectionTitle}
                        description={dictionary.ratesTable.sectionDescription}
                        names={dictionary.options}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <FeatureCards
                        sectionTitle={dictionary.features.sectionTitle}
                        sectionDescription={dictionary.features.sectionDescription}
                        items={dictionary.features.items}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <EducationalContent
                        sectionTitle={dictionary.educational.sectionTitle}
                        articles={dictionary.educational.articles}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <FaqSection
                        title={dictionary.faq.sectionTitle}
                        items={dictionary.faq.items}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <ToolsCta
                        title={dictionary.cta.title}
                        description={dictionary.cta.description}
                        tools={tools}
                        currentToolSlug="unit-converter"
                    />
                </Container>
            </Section>
        </>
    );
}
