import RomanianFinancialCalculator from "@/components/romanian-financial-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type UnemploymentCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function UnemploymentCalculatorTool({ translation }: UnemploymentCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <RomanianFinancialCalculator primaryMode="unemployment" labels={toolLabels} />;
}
