import MortgageCreditSimulator from "@/components/mortgage-credit-simulator";
import { getMortgageRatesRO } from "@/lib/mortgage-rates-ro";
import type { ToolTranslation } from "@/lib/tool-data";

type MortgageCreditSimulatorToolProps = {
    translation: ToolTranslation;
};

export default function MortgageCreditSimulatorTool({ translation }: MortgageCreditSimulatorToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;
    const rates = getMortgageRatesRO();

    return <MortgageCreditSimulator labels={toolLabels} rates={rates} />;
}
