import HomeInsuranceCoverageCalculator from "@/components/home-insurance-coverage-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type HomeInsuranceCoverageCalculatorToolProps = {
    translation: ToolTranslation;
    config: { data: {
        rebuildRates: { masonry: number; mixed: number; wood: number; prefabricated: number };
        riskMultipliers: { low: number; medium: number; high: number };
        contentsRiskAdjustment: { low: number; medium: number; high: number };
        liabilityPercentage: number;
        premiumRate: number;
        premiumSpread: number;
    }};
};

export default function HomeInsuranceCoverageCalculatorTool({ translation, config }: HomeInsuranceCoverageCalculatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <HomeInsuranceCoverageCalculator labels={toolLabels} configData={config.data} />;
}
