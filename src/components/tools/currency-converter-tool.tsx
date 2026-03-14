import ConverterCard from "@/components/converter-card";
import RatesTable from "@/components/rates-table";
import Section from "@/components/section";
import Container from "@/components/container";
import { mockExchangeRates, popularPairs } from "@/lib/mock-rates";
import type { ToolTranslation, ToolConfig } from "@/lib/tool-data";

type CurrencyConverterToolProps = {
    translation: ToolTranslation;
    config: ToolConfig;
};

export default function CurrencyConverterTool({ translation, config }: CurrencyConverterToolProps) {
    const toolLabels = translation.tool;

    return (
        <>
            <Section>
                <Container>
                    <ConverterCard
                        options={toolLabels.options}
                        factors={mockExchangeRates.rates}
                        labels={{
                            fromLabel: toolLabels.fromLabel,
                            toLabel: toolLabels.toLabel,
                            amountPlaceholder: toolLabels.amountPlaceholder,
                            switchButtonAriaLabel: toolLabels.switchButtonAriaLabel,
                            rateDisplay: toolLabels.rateDisplay,
                            lastUpdated: toolLabels.lastUpdated,
                        }}
                        defaultFrom={config.defaultFrom ?? "USD"}
                        defaultTo={config.defaultTo ?? "EUR"}
                        decimals={config.decimals}
                    />
                </Container>
            </Section>

            {translation.ratesTable && (
                <Section>
                    <Container>
                        <RatesTable
                            pairs={popularPairs}
                            factors={mockExchangeRates.rates}
                            headers={translation.ratesTable.headers}
                            title={translation.ratesTable.sectionTitle}
                            description={translation.ratesTable.sectionDescription}
                            decimals={config.decimals}
                        />
                    </Container>
                </Section>
            )}
        </>
    );
}
