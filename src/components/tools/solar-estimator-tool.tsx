import SolarEstimator from "@/components/solar-estimator";
import Section from "@/components/section";
import Container from "@/components/container";
import type { ToolTranslation } from "@/lib/tool-data";
import { getSolarEstimatorConfig } from "@/lib/site-config";

type SolarEstimatorToolProps = {
    translation: ToolTranslation;
};

export default async function SolarEstimatorTool({ translation }: SolarEstimatorToolProps) {
    const solarConfig = await getSolarEstimatorConfig();

    return (
        <Section>
            <Container>
                <SolarEstimator
                    labels={translation.tool}
                    config={solarConfig}
                />
            </Container>
        </Section>
    );
}
