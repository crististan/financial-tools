import SolarEstimator from "@/components/solar-estimator";
import Section from "@/components/section";
import type { ToolTranslation } from "@/lib/tool-data";
import { getSolarEstimatorConfig } from "@/lib/site-config";

type SolarEstimatorToolProps = {
    translation: ToolTranslation;
};

export default async function SolarEstimatorTool({ translation }: SolarEstimatorToolProps) {
    const solarConfig = await getSolarEstimatorConfig();

    return (
        <Section>
            <SolarEstimator
                labels={translation.tool}
                config={solarConfig}
            />
        </Section>
    );
}
