import WeightVolumeConverter from "@/components/weight-volume-converter";
import type { ToolTranslation, ToolConfig } from "@/lib/tool-data";

type WeightVolumeConverterToolProps = {
    translation: ToolTranslation;
    config: ToolConfig;
};

export default function WeightVolumeConverterTool({ translation, config }: WeightVolumeConverterToolProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolLabels = translation.tool as any;

    return (
        <WeightVolumeConverter
            labels={{
                fromLabel: toolLabels.fromLabel,
                toLabel: toolLabels.toLabel,
                amountPlaceholder: toolLabels.amountPlaceholder,
                switchButtonAriaLabel: toolLabels.switchButtonAriaLabel,
                rateDisplay: toolLabels.rateDisplay,
                modeLabels: toolLabels.modeLabels,
                weightOptions: toolLabels.weightOptions,
                volumeOptions: toolLabels.volumeOptions,
                tableTitle: toolLabels.tableTitle,
                tableHeaders: toolLabels.tableHeaders,
            }}
            defaultFrom={config.defaultFrom ?? "kg"}
            defaultTo={config.defaultTo ?? "lb"}
        />
    );
}
