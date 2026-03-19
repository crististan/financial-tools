import SolarEstimator from "@/components/solar-estimator";
import type { ToolTranslation } from "@/lib/tool-data";
import { getSolarEstimatorConfig } from "@/lib/site-config";

type SolarEstimatorToolProps = {
    translation: ToolTranslation;
};

export default async function SolarEstimatorTool({ translation }: SolarEstimatorToolProps) {
    const solarConfig = await getSolarEstimatorConfig();

    return (
        <SolarEstimator
            labels={translation.tool}
            config={solarConfig}
        />
    );
}
