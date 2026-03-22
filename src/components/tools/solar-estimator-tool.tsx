import SolarEstimator from "@/components/solar-estimator";
import type { ToolTranslation } from "@/lib/tool-data";

type SolarEstimatorToolProps = {
    translation: ToolTranslation;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: Record<string, any>;
};

export default function SolarEstimatorTool({ translation, config }: SolarEstimatorToolProps) {
    return (
        <SolarEstimator
            labels={translation.tool}
            config={config.data}
        />
    );
}
