import FreelanceRateCalculator from "@/components/freelance-rate-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type FreelanceRateCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function FreelanceRateCalculatorTool({ translation }: FreelanceRateCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <FreelanceRateCalculator labels={toolLabels} />;
}
