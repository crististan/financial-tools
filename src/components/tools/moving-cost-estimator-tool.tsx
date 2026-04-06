import MovingCostEstimator from "@/components/moving-cost-estimator";
import type { ToolTranslation } from "@/lib/tool-data";

type MovingCostEstimatorToolProps = {
    translation: ToolTranslation;
    config: { data: {
        baseRatePerKmPerM3: number;
        volumeTiers: { small: number; medium: number; large: number; xl: number };
        packingMultipliers: { none: number; partial: number; full: number };
        storageRatePerWeekPerM3: number;
        peakSurcharge: number;
        costRangeSpread: number;
    }};
};

export default function MovingCostEstimatorTool({ translation, config }: MovingCostEstimatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return <MovingCostEstimator labels={toolLabels} configData={config.data} />;
}