import SplitBillCalculator from "@/components/split-bill-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type SplitBillCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function SplitBillCalculatorTool({ translation }: SplitBillCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <SplitBillCalculator labels={toolLabels} />;
}
