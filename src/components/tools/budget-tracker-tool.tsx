import BudgetTracker from "@/components/budget-tracker";
import Section from "@/components/section";
import Container from "@/components/container";
import type { ToolTranslation } from "@/lib/tool-data";

type BudgetTrackerToolProps = {
    translation: ToolTranslation;
};

export default function BudgetTrackerTool({ translation }: BudgetTrackerToolProps) {
    const { defaultCategories, ...labels } = translation.tool;

    return (
        <Section>
            <Container>
                <BudgetTracker
                    labels={labels as Parameters<typeof BudgetTracker>[0]["labels"]}
                    defaultCategories={defaultCategories as Parameters<typeof BudgetTracker>[0]["defaultCategories"]}
                />
            </Container>
        </Section>
    );
}
