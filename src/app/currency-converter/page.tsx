import DefaultHero from "@/components/default-hero";
import Section from "@/components/section";
import Container from "@/components/container";
import HowItWorks from "@/components/how-it-works";
import FeatureCards from "@/components/feature-cards";
import EducationalContent from "@/components/educational-content";
import FaqSection from "@/components/faq-section";
import ToolsCta from "@/components/tools-cta";
import ConverterCard from "@/components/tools/currency-converter/converter-card";
import ExchangeRatesTable from "@/components/tools/currency-converter/exchange-rates-table";
import dictionary from "@/dictionaries/en/currency-converter";
import { mockExchangeRates, popularPairs } from "@/lib/mock-rates";
import { CONFIG } from "@/lib/config";

export default function CurrencyConverterPage() {
    return (
        <>
            <DefaultHero
                headline={dictionary.hero.headline}
                description={dictionary.hero.description}
            />

            <Section>
                <Container>
                    <ConverterCard
                        currencies={dictionary.currencies}
                        rates={mockExchangeRates.rates}
                        labels={dictionary.converter}
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
                    <ExchangeRatesTable
                        rates={mockExchangeRates.rates}
                        pairs={popularPairs}
                        headers={dictionary.exchangeRatesTable.headers}
                        title={dictionary.exchangeRatesTable.sectionTitle}
                        description={dictionary.exchangeRatesTable.sectionDescription}
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
                        tools={CONFIG.tools}
                        currentToolSlug="currency-converter"
                    />
                </Container>
            </Section>
        </>
    );
}
