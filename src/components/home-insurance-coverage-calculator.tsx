'use client';

import { useState, useMemo } from 'react';

type HomeInsuranceCalculatorProps = {
    labels: {
        propertySizeLabel: string;
        propertySizePlaceholder: string;
        propertySizeUnit: string;
        constructionLabel: string;
        constructionMasonry: string;
        constructionMixed: string;
        constructionWood: string;
        constructionPrefab: string;
        riskLabel: string;
        riskLow: string;
        riskMedium: string;
        riskHigh: string;
        contentsLabel: string;
        contentsPlaceholder: string;
        currencyLabel: string;
        resultDwelling: string;
        resultContents: string;
        resultLiability: string;
        resultTotal: string;
        summaryTitle: string;
        summaryRebuildRate: string;
        summaryRiskAdjustment: string;
        summaryDwelling: string;
        summaryContents: string;
        summaryLiability: string;
        summaryPremiumRange: string;
        summaryTotal: string;
        currencySymbol: string;
    };
    configData: {
        rebuildRates: { masonry: number; mixed: number; wood: number; prefabricated: number };
        riskMultipliers: { low: number; medium: number; high: number };
        contentsRiskAdjustment: { low: number; medium: number; high: number };
        liabilityPercentage: number;
        premiumRate: number;
        premiumSpread: number;
    };
};

type ConstructionType = 'masonry' | 'mixed' | 'wood' | 'prefabricated';
type RiskLevel = 'low' | 'medium' | 'high';

const CURRENCIES = [
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
    { symbol: 'lei', label: 'RON (lei)' },
];

function formatValue(value: number, currency: string): string {
    const formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    if (currency === 'lei') return `${formatted} ${currency}`;
    return `${currency}${formatted}`;
}

function formatRange(low: number, high: number, currency: string): string {
    return `${formatValue(low, currency)} – ${formatValue(high, currency)}`;
}

export default function HomeInsuranceCoverageCalculator({ labels, configData }: HomeInsuranceCalculatorProps) {
    const [propertySize, setPropertySize] = useState(100);
    const [construction, setConstruction] = useState<ConstructionType>('masonry');
    const [risk, setRisk] = useState<RiskLevel>('low');
    const [contentsValue, setContentsValue] = useState(25000);
    const [currency, setCurrency] = useState(labels.currencySymbol);

    const results = useMemo(() => {
        const size = Math.max(0, propertySize || 0);
        const contents = Math.max(0, contentsValue || 0);
        const rebuildRate = configData.rebuildRates[construction];
        const riskMult = configData.riskMultipliers[risk];
        const contentsAdj = configData.contentsRiskAdjustment[risk];

        const dwelling = size * rebuildRate * riskMult;
        const contentsCoverage = contents * contentsAdj;
        const liability = dwelling * configData.liabilityPercentage;
        const total = dwelling + contentsCoverage + liability;
        const premium = total * configData.premiumRate;
        const premiumLow = premium * (1 - configData.premiumSpread);
        const premiumHigh = premium * (1 + configData.premiumSpread);

        return {
            rebuildRate,
            riskMult,
            dwelling: Math.round(dwelling),
            contents: Math.round(contentsCoverage),
            liability: Math.round(liability),
            total: Math.round(total),
            premiumLow: Math.round(premiumLow),
            premiumHigh: Math.round(premiumHigh),
        };
    }, [propertySize, construction, risk, contentsValue, configData]);

    const constructionOptions: { value: ConstructionType; label: string }[] = [
        { value: 'masonry', label: labels.constructionMasonry },
        { value: 'mixed', label: labels.constructionMixed },
        { value: 'wood', label: labels.constructionWood },
        { value: 'prefabricated', label: labels.constructionPrefab },
    ];

    const riskOptions: { value: RiskLevel; label: string }[] = [
        { value: 'low', label: labels.riskLow },
        { value: 'medium', label: labels.riskMedium },
        { value: 'high', label: labels.riskHigh },
    ];

    return (
        <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8 space-y-6">
            {/* Property Size */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.propertySizeLabel}
                </label>
                <div className="relative">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={propertySize || ''}
                        onChange={(e) => setPropertySize(parseFloat(e.target.value) || 0)}
                        placeholder={labels.propertySizePlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        {labels.propertySizeUnit}
                    </span>
                </div>
            </div>

            {/* Construction Type */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.constructionLabel}
                </label>
                <select
                    value={construction}
                    onChange={(e) => setConstruction(e.target.value as ConstructionType)}
                    className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)]"
                >
                    {constructionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Location Risk */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.riskLabel}
                </label>
                <select
                    value={risk}
                    onChange={(e) => setRisk(e.target.value as RiskLevel)}
                    className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)]"
                >
                    {riskOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Contents Value */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.contentsLabel}
                </label>
                <div className="relative">
                    <input
                        type="number"
                        min="0"
                        step="100"
                        value={contentsValue || ''}
                        onChange={(e) => setContentsValue(parseFloat(e.target.value) || 0)}
                        placeholder={labels.contentsPlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)]"
                    />
                </div>
            </div>

            {/* Currency Selector */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.currencyLabel}
                </label>
                <div className="flex gap-2 flex-wrap">
                    {CURRENCIES.map((c) => (
                        <button
                            key={c.symbol}
                            onClick={() => setCurrency(c.symbol)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                currency === c.symbol
                                    ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                    : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-1000)]'
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Result Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultDwelling}
                    </p>
                    <p className="text-lg md:text-xl font-bold text-[var(--clr-green-500)]">
                        {formatValue(results.dwelling, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultContents}
                    </p>
                    <p className="text-lg md:text-xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.contents, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultLiability}
                    </p>
                    <p className="text-lg md:text-xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.liability, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultTotal}
                    </p>
                    <p className="text-lg md:text-xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.total, currency)}
                    </p>
                </div>
            </div>

            {/* Summary Breakdown */}
            <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[var(--clr-neutral-0)] uppercase tracking-wider">
                    {labels.summaryTitle}
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryRebuildRate}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.rebuildRate, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryRiskAdjustment}</span>
                        <span className="text-[var(--clr-neutral-0)]">×{results.riskMult.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryDwelling}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.dwelling, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryContents}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.contents, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryLiability}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.liability, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryPremiumRange}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatRange(results.premiumLow, results.premiumHigh, currency)}</span>
                    </div>
                    <div className="border-t border-[var(--clr-neutral-800)] pt-2 flex justify-between font-semibold">
                        <span className="text-[var(--clr-neutral-0)]">{labels.summaryTotal}</span>
                        <span className="text-[var(--clr-green-500)]">{formatValue(results.total, currency)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
