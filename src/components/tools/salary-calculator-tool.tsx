import SalaryCalculator from "@/components/salary-calculator";
import Section from "@/components/section";
import Container from "@/components/container";
import type { ToolTranslation } from "@/lib/tool-data";

type SalaryCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function SalaryCalculatorTool({ translation }: SalaryCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return (
        <Section>
            <Container>
                <SalaryCalculator labels={toolLabels} />
            </Container>
        </Section>
    );
}
