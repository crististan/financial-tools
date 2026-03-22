import RomanianFinancialCalculator from "@/components/romanian-financial-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type SalaryCalculatorToolProps = {
    translation: ToolTranslation;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>;
};

export default function SalaryCalculatorTool({ translation, config }: SalaryCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <RomanianFinancialCalculator primaryMode="salary" labels={toolLabels} configData={config.data} />;
}
