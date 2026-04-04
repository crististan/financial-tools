'use client';

import { useState, useMemo } from 'react';

type RentalYieldCalculatorProps = {
    labels: {
        purchasePriceLabel: string;
        purchasePricePlaceholder: string;
        monthlyRentLabel: string;
        monthlyRentPlaceholder: string;
        annualCostsLabel: string;
        annualCostsPlaceholder: string;
        annualCostsHint: string;
        downPaymentLabel: string;
        downPaymentPlaceholder: string;
        annualMortgageLabel: string;
        annualMortgagePlaceholder: string;
        annualMortgageHint: string;
        vacancyRateLabel: string;
        vacancyRatePlaceholder: string;
        resultGrossYield: string;
        resultNetYield: string;
        resultCashOnCash: string;
        resultBreakEvenRent: string;
        breakdownToggle: string;
        breakdownTitle: string;
        breakdownGrossIncome: string;
        breakdownVacancyLoss: string;
        breakdownEffectiveIncome: string;
        breakdownOperatingCosts: string;
        breakdownMortgage: string;
        breakdownNetCashFlow: string;
        perMonth: string;
        currencySymbol: string;
    };
};

function formatCurrency(value: number, symbol: string): string {
    const formatted = Math.abs(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    const sign = value < 0 ? '-' : '';
    if (symbol === 'lei') return `${sign}${formatted} ${symbol}`;
    return `${sign}${symbol}${formatted}`;
}

function formatPercent(value: number): string {
    if (!isFinite(value)) return '—';
    return `${value.toFixed(2)}%`;
}

export default function RentalYieldCalculator({ labels }: RentalYieldCalculatorProps) {
    const [purchasePrice, setPurchasePrice] = useState(250000);
    const [monthlyRent, setMonthlyRent] = useState(1500);
    const [annualCosts, setAnnualCosts] = useState(3000);
    const [downPayment, setDownPayment] = useState(50000);
    const [annualMortgage, setAnnualMortgage] = useState(12000);
    const [vacancyRate, setVacancyRate] = useState(5);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const results = useMemo(() => {
        const price = purchasePrice || 0;
        const rent = monthlyRent || 0;
        const costs = annualCosts || 0;
        const down = downPayment || 0;
        const mortgage = annualMortgage || 0;
        const vacancy = Math.max(0, Math.min(100, vacancyRate || 0));

        const annualRent = rent * 12;
        const vacancyLoss = annualRent * (vacancy / 100);
        const effectiveIncome = annualRent - vacancyLoss;
        const netIncome = effectiveIncome - costs;
        const netCashFlow = netIncome - mortgage;

        const grossYield = price > 0 ? (annualRent / price) * 100 : 0;
        const netYield = price > 0 ? ((effectiveIncome - costs) / price) * 100 : 0;
        const cashOnCash = down > 0 ? (netCashFlow / down) * 100 : 0;
        const breakEvenRent = (costs + mortgage) / 12;

        return {
            grossYield,
            netYield,
            cashOnCash,
            breakEvenRent,
            annualRent,
            vacancyLoss,
            effectiveIncome,
            operatingCosts: costs,
            mortgage,
            netCashFlow,
        };
    }, [purchasePrice, monthlyRent, annualCosts, downPayment, annualMortgage, vacancyRate]);

    const currency = labels.currencySymbol;

    return (
        <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8 space-y-6">
            {/* Property Purchase Price */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.purchasePriceLabel}
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        {currency}
                    </span>
                    <input
                        type="number"
                        min="0"
                        step="10000"
                        value={purchasePrice || ''}
                        onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                        placeholder={labels.purchasePricePlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-12"
                    />
                </div>
            </div>

            {/* Monthly Rent & Annual Costs */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.monthlyRentLabel}
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                            {currency}
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="100"
                            value={monthlyRent || ''}
                            onChange={(e) => setMonthlyRent(parseFloat(e.target.value) || 0)}
                            placeholder={labels.monthlyRentPlaceholder}
                            className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-12"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.annualCostsLabel}
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                            {currency}
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="500"
                            value={annualCosts || ''}
                            onChange={(e) => setAnnualCosts(parseFloat(e.target.value) || 0)}
                            placeholder={labels.annualCostsPlaceholder}
                            className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-12"
                        />
                    </div>
                    <p className="text-xs text-[var(--clr-neutral-100)] mt-1">{labels.annualCostsHint}</p>
                </div>
            </div>

            {/* Down Payment & Annual Mortgage */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.downPaymentLabel}
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                            {currency}
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="5000"
                            value={downPayment || ''}
                            onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                            placeholder={labels.downPaymentPlaceholder}
                            className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-12"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.annualMortgageLabel}
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                            {currency}
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="500"
                            value={annualMortgage || ''}
                            onChange={(e) => setAnnualMortgage(parseFloat(e.target.value) || 0)}
                            placeholder={labels.annualMortgagePlaceholder}
                            className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-12"
                        />
                    </div>
                    <p className="text-xs text-[var(--clr-neutral-100)] mt-1">{labels.annualMortgageHint}</p>
                </div>
            </div>

            {/* Vacancy Rate */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.vacancyRateLabel}
                </label>
                <div className="relative">
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={vacancyRate || ''}
                        onChange={(e) => setVacancyRate(parseFloat(e.target.value) || 0)}
                        placeholder={labels.vacancyRatePlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pr-8 max-w-[200px]"
                    />
                    <span className="absolute left-[170px] top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        %
                    </span>
                </div>
            </div>

            {/* Result Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultGrossYield}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {formatPercent(results.grossYield)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultNetYield}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {formatPercent(results.netYield)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultCashOnCash}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {formatPercent(results.cashOnCash)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultBreakEvenRent}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatCurrency(results.breakEvenRent, currency)}{labels.perMonth}
                    </p>
                </div>
            </div>

            {/* Expandable Annual Breakdown */}
            <div>
                <button
                    type="button"
                    className="flex items-center gap-2 text-[var(--clr-green-500)] hover:text-[var(--clr-neutral-0)] transition-colors cursor-pointer mb-4"
                    onClick={() => setShowBreakdown(!showBreakdown)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className={`transition-transform duration-300 ${showBreakdown ? 'rotate-90' : ''}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-medium">{labels.breakdownToggle}</span>
                </button>

                {showBreakdown && (
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-[var(--clr-neutral-0)] uppercase tracking-wider">
                            {labels.breakdownTitle}
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-[var(--clr-neutral-100)]">
                                <span>{labels.breakdownGrossIncome}</span>
                                <span className="text-[var(--clr-neutral-0)]">
                                    {formatCurrency(results.annualRent, currency)}
                                </span>
                            </div>
                            <div className="flex justify-between text-[var(--clr-neutral-100)]">
                                <span>{labels.breakdownVacancyLoss}</span>
                                <span className="text-red-400">
                                    -{formatCurrency(results.vacancyLoss, currency)}
                                </span>
                            </div>
                            <div className="border-t border-[var(--clr-neutral-800)] pt-2 flex justify-between text-[var(--clr-neutral-100)]">
                                <span className="font-medium text-[var(--clr-neutral-0)]">{labels.breakdownEffectiveIncome}</span>
                                <span className="text-[var(--clr-neutral-0)]">
                                    {formatCurrency(results.effectiveIncome, currency)}
                                </span>
                            </div>
                            <div className="flex justify-between text-[var(--clr-neutral-100)]">
                                <span>{labels.breakdownOperatingCosts}</span>
                                <span className="text-red-400">
                                    -{formatCurrency(results.operatingCosts, currency)}
                                </span>
                            </div>
                            <div className="flex justify-between text-[var(--clr-neutral-100)]">
                                <span>{labels.breakdownMortgage}</span>
                                <span className="text-red-400">
                                    -{formatCurrency(results.mortgage, currency)}
                                </span>
                            </div>
                            <div className="border-t border-[var(--clr-neutral-800)] pt-2 flex justify-between font-semibold">
                                <span className="text-[var(--clr-neutral-0)]">{labels.breakdownNetCashFlow}</span>
                                <span className={results.netCashFlow >= 0 ? 'text-[var(--clr-green-500)]' : 'text-red-400'}>
                                    {formatCurrency(results.netCashFlow, currency)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
