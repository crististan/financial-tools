import type { ComponentType } from "react";
import type { ToolTranslation, ToolConfig } from "@/lib/tool-data";

import CurrencyConverterTool from "./currency-converter-tool";
import UnitConverterTool from "./unit-converter-tool";
import LoanCalculatorTool from "./loan-calculator-tool";
import BudgetTrackerTool from "./budget-tracker-tool";
import SolarEstimatorTool from "./solar-estimator-tool";
import CompoundInterestCalculatorTool from "./compound-interest-calculator-tool";
import NauticalFuelCalculatorTool from "./nautical-fuel-calculator-tool";
import SalaryCalculatorTool from "./salary-calculator-tool";
import UnemploymentCalculatorTool from "./unemployment-calculator-tool";
import PensionCalculatorTool from "./pension-calculator-tool";
import SplitBillCalculatorTool from "./split-bill-calculator-tool";
import FireCalculatorTool from "./fire-calculator-tool";

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
    "solar-estimator": SolarEstimatorTool as ComponentType<ToolComponentProps>,
    "compound-interest-calculator": CompoundInterestCalculatorTool as ComponentType<ToolComponentProps>,
    "nautical-fuel-calculator": NauticalFuelCalculatorTool as ComponentType<ToolComponentProps>,
    "salary-calculator": SalaryCalculatorTool as ComponentType<ToolComponentProps>,
    "unemployment-calculator": UnemploymentCalculatorTool as ComponentType<ToolComponentProps>,
    "pension-calculator": PensionCalculatorTool as ComponentType<ToolComponentProps>,
    "split-bill-calculator": SplitBillCalculatorTool as ComponentType<ToolComponentProps>,
    "fire-calculator": FireCalculatorTool as ComponentType<ToolComponentProps>,
};

export function getToolComponent(componentId: string): ComponentType<ToolComponentProps> | null {
    return toolComponentMap[componentId] ?? null;
}
