import FireCalculator from "@/components/fire-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type FireCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function FireCalculatorTool({ translation }: FireCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <FireCalculator labels={toolLabels} />;
}
