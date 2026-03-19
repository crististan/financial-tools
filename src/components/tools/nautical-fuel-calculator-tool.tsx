import NauticalFuelCalculator from "@/components/nautical-fuel-calculator";
import Section from "@/components/section";
import Container from "@/components/container";
import type { ToolTranslation } from "@/lib/tool-data";

type NauticalFuelCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function NauticalFuelCalculatorTool({ translation }: NauticalFuelCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return (
        <Section>
            <Container>
                <NauticalFuelCalculator labels={toolLabels} />
            </Container>
        </Section>
    );
}