import EmergencyFundCalculator from "@/components/emergency-fund-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type EmergencyFundCalculatorToolProps = {
    translation: ToolTranslation;
    config: { data: {
        defaultMonths: number;
        minMonths: number;
        maxMonths: number;
        defaultMonthlySavings: number;
    }};
};

export default function EmergencyFundCalculatorTool({ translation, config }: EmergencyFundCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <EmergencyFundCalculator labels={toolLabels} configData={config.data} />;
}
