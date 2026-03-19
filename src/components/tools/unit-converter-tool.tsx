import ConverterCard from "@/components/converter-card";
import RatesTable from "@/components/rates-table";
import Section from "@/components/section";
import Container from "@/components/container";
import { unitFactors, popularConversions } from "@/lib/mock-units";
import type { ToolTranslation, ToolConfig } from "@/lib/tool-data";

type UnitConverterToolProps = {
    translation: ToolTranslation;
    config: ToolConfig;
};

export default function UnitConverterTool({ translation, config }: UnitConverterToolProps) {
    const toolLabels = translation.tool;

    return (
        <>
            <ConverterCard
                options={toolLabels.options}
                factors={unitFactors}
                labels={{
                    fromLabel: toolLabels.fromLabel,
                    toLabel: toolLabels.toLabel,
                    amountPlaceholder: toolLabels.amountPlaceholder,
                    switchButtonAriaLabel: toolLabels.switchButtonAriaLabel,
                    rateDisplay: toolLabels.rateDisplay,
                }}
                defaultFrom={config.defaultFrom ?? "m"}
                defaultTo={config.defaultTo ?? "ft"}
                decimals={config.decimals}
            />

            {translation.ratesTable && (
                <Section>
                    <Container>
                        <RatesTable
                            pairs={popularConversions}
                            factors={unitFactors}
                            headers={translation.ratesTable.headers}
                            title={translation.ratesTable.sectionTitle}
                            description={translation.ratesTable.sectionDescription}
                            names={toolLabels.options}
                        />
                    </Container>
                </Section>
            )}
        </>
    );
}
