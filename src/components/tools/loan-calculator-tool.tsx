import LoanCalculator from "@/components/loan-calculator";
import type { ToolTranslation } from "@/lib/tool-data";

type LoanCalculatorToolProps = {
    translation: ToolTranslation;
};

export default function LoanCalculatorTool({ translation }: LoanCalculatorToolProps) {
    const toolLabels = translation.tool;

    return (
        <LoanCalculator
            labels={{
                loanAmountLabel: toolLabels.loanAmountLabel,
                loanAmountPlaceholder: toolLabels.loanAmountPlaceholder,
                interestRateLabel: toolLabels.interestRateLabel,
                interestRatePlaceholder: toolLabels.interestRatePlaceholder,
                loanTermLabel: toolLabels.loanTermLabel,
                loanTermPlaceholder: toolLabels.loanTermPlaceholder,
                termUnitLabel: toolLabels.termUnitLabel,
                termUnitYears: toolLabels.termUnitYears,
                termUnitMonths: toolLabels.termUnitMonths,
                monthlyPaymentLabel: toolLabels.monthlyPaymentLabel,
                totalPaymentLabel: toolLabels.totalPaymentLabel,
                totalInterestLabel: toolLabels.totalInterestLabel,
            }}
            amortizationLabels={toolLabels.amortizationTable}
        />
    );
}
