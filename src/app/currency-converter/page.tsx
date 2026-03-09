import DefaultHero from "@/components/default-hero";
import Section from "@/components/section";
import Container from "@/components/container";
import ConverterCard from "@/components/tools/currency-converter/converter-card";
import ExchangeRatesTable from "@/components/tools/currency-converter/exchange-rates-table";
import FaqSection from "@/components/tools/currency-converter/faq-section";
import dictionary from "@/dictionaries/en/currency-converter";
import { mockExchangeRates, popularPairs } from "@/lib/mock-rates";

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
                    <FaqSection
                        title={dictionary.faq.sectionTitle}
                        items={dictionary.faq.items}
                    />
                </Container>
            </Section>
        </>
    );
}
