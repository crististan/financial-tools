import CompoundInterestCalculator from "@/components/compound-interest-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type CompoundInterestCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function CompoundInterestCalculatorTool({ translation }: CompoundInterestCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <CompoundInterestCalculator labels={toolLabels} />;
}