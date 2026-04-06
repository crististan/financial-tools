import WeddingBudgetCalculator from "@/components/wedding-budget-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type WeddingBudgetCalculatorToolProps = {
    translation: ToolTranslation;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>;
};

export default function WeddingBudgetCalculatorTool({ translation, config }: WeddingBudgetCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <WeddingBudgetCalculator labels={toolLabels} defaultCategories={config.data.defaultCategories} />;
}
