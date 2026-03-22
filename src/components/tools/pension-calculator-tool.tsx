import RomanianFinancialCalculator from "@/components/romanian-financial-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type PensionCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function PensionCalculatorTool({ translation }: PensionCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <RomanianFinancialCalculator primaryMode="pension" labels={toolLabels} />;
}
