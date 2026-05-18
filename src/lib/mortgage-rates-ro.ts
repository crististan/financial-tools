import mortgageRatesData from "@/data/config/mortgage-rates-ro.json";

export interface MortgageRatesRO {
    currency: string;
    ircc: {
        value: number;
        lastUpdated: string;
        source: string;
    };
    defaultRates: {
        fixedRateDefault: number;
        variableMarginDefault: number;
    };
    limits: {
        minDownPaymentPercent: number;
        maxDebtToIncomePercent: number;
        minTermYears: number;
        maxTermYears: number;
        minLoanAmount: number;
        maxLoanAmount: number;
    };
    fees: {
        applicationFeePercent: number;
        applicationFeeMax: number;
        monthlyAdminFeePercent: number;
        propertyInsuranceAnnualPercent: number;
        lifeInsuranceAnnualPercent: number;
    };
    defaults: {
        loanAmount: number;
        downPaymentPercent: number;
        termYears: number;
        monthlyIncome: number;
    };
    metadata: {
        dataSource: string;
        futureApiEndpoint: string;
        notes: string;
    };
}

// TODO: When the external API becomes available, replace the static import with:
//   const response = await fetch(data.metadata.futureApiEndpoint, { next: { revalidate: 3600 } });
//   return response.json();
// The rest of the codebase consumes this loader and will not need changes.
export function getMortgageRatesRO(): MortgageRatesRO {
    return mortgageRatesData as MortgageRatesRO;
}
