import SalaryCalculator from "@/components/salary-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type SalaryCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function SalaryCalculatorTool({ translation }: SalaryCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <SalaryCalculator labels={toolLabels} />;
}
