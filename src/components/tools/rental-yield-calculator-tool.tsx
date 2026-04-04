import RentalYieldCalculator from "@/components/rental-yield-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type RentalYieldCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function RentalYieldCalculatorTool({ translation }: RentalYieldCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <RentalYieldCalculator labels={toolLabels} />;
}
