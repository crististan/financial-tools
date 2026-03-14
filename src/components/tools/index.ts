import type { ComponentType } from "react";
import type { ToolTranslation, ToolConfig } from "@/lib/tool-data";

import CurrencyConverterTool from "./currency-converter-tool";
import UnitConverterTool from "./unit-converter-tool";
import LoanCalculatorTool from "./loan-calculator-tool";
import BudgetTrackerTool from "./budget-tracker-tool";

// Common props that all tool components receive
export type ToolComponentProps = {
    translation: ToolTranslation;
    config: ToolConfig;
};

// Map component id → React component
const toolComponentMap: Record<string, ComponentType<ToolComponentProps>> = {
    "currency-converter": CurrencyConverterTool as ComponentType<ToolComponentProps>,
    "unit-converter": UnitConverterTool as ComponentType<ToolComponentProps>,
    "loan-calculator": LoanCalculatorTool as ComponentType<ToolComponentProps>,
    "budget-tracker": BudgetTrackerTool as ComponentType<ToolComponentProps>,
};

export function getToolComponent(componentId: string): ComponentType<ToolComponentProps> | null {
    return toolComponentMap[componentId] ?? null;
}
