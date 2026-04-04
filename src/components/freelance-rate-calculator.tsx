'use client';

import { useState, useMemo } from 'react';

type FreelanceRateCalculatorProps = {
    labels: {
        annualIncomeLabel: string;
        annualIncomePlaceholder: string;
        billableWeeksLabel: string;
        billableWeeksPlaceholder: string;
        billableHoursLabel: string;
        billableHoursPlaceholder: string;
        expensesLabel: string;
        expensesPlaceholder: string;
        taxRateLabel: string;
        taxRatePlaceholder: string;
        currencyLabel: string;
        resultHourlyRate: string;
        resultDailyRate: string;
        resultGrossAnnual: string;
        resultAnnualHours: string;
        summaryTitle: string;
        summaryNetIncome: string;
        summaryExpenses: string;
        summaryTaxBuffer: string;
        summaryGrossNeeded: string;
        currencySymbol: string;
    };
};

const CURRENCIES = [
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
    { symbol: 'lei', label: 'RON (lei)' },
];

function formatValue(value: number, currency: string): string {
    const formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    if (currency === 'lei') return `${formatted} ${currency}`;
    return `${currency}${formatted}`;
}

function formatWhole(value: number): string {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

export default function FreelanceRateCalculator({ labels }: FreelanceRateCalculatorProps) {
    const [annualIncome, setAnnualIncome] = useState(60000);
    const [billableWeeks, setBillableWeeks] = useState(46);
    const [billableHours, setBillableHours] = useState(30);
    const [expenses, setExpenses] = useState(5000);
    const [taxRate, setTaxRate] = useState(30);
    const [currency, setCurrency] = useState(labels.currencySymbol);

    const results = useMemo(() => {
        const net = annualIncome || 0;
        const exp = expenses || 0;
        const weeks = Math.max(1, billableWeeks || 1);
        const hours = Math.max(1, billableHours || 1);
        const tax = Math.max(0, Math.min(100, taxRate || 0));

        const preTotal = net + exp;
        const taxBuffer = preTotal * (tax / (100 - tax));
        const grossAnnual = preTotal + taxBuffer;
        const annualBillableHours = weeks * hours;
        const hourlyRate = grossAnnual / annualBillableHours;
        const dailyRate = hourlyRate * 8;

        return {
            hourlyRate,
            dailyRate,
            grossAnnual,
            annualBillableHours,
            taxBuffer,
            netIncome: net,
            expenses: exp,
        };
    }, [annualIncome, billableWeeks, billableHours, expenses, taxRate]);

    return (
        <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8 space-y-6">
            {/* Annual Net Income */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.annualIncomeLabel}
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        {currency}
                    </span>
                    <input
                        type="number"
                        min="0"
                        step="1000"
                        value={annualIncome || ''}
                        onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                        placeholder={labels.annualIncomePlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-12"
                    />
                </div>
            </div>

            {/* Billable Weeks & Hours */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.billableWeeksLabel}
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="52"
                        step="1"
                        value={billableWeeks || ''}
                        onChange={(e) => setBillableWeeks(parseInt(e.target.value) || 0)}
                        placeholder={labels.billableWeeksPlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)]"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.billableHoursLabel}
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="80"
                        step="1"
                        value={billableHours || ''}
                        onChange={(e) => setBillableHours(parseInt(e.target.value) || 0)}
                        placeholder={labels.billableHoursPlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)]"
                    />
                </div>
            </div>

            {/* Expenses & Tax Rate */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.expensesLabel}
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                            {currency}
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="500"
                            value={expenses || ''}
                            onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
                            placeholder={labels.expensesPlaceholder}
                            className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-12"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.taxRateLabel}
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="99"
                            step="1"
                            value={taxRate || ''}
                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                            placeholder={labels.taxRatePlaceholder}
                            className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                            %
                        </span>
                    </div>
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
                        {labels.resultHourlyRate}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {formatValue(results.hourlyRate, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultDailyRate}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {formatValue(results.dailyRate, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultGrossAnnual}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.grossAnnual, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultAnnualHours}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatWhole(results.annualBillableHours)}
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
                        <span>{labels.summaryNetIncome}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.netIncome, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryExpenses}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.expenses, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryTaxBuffer}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.taxBuffer, currency)}</span>
                    </div>
                    <div className="border-t border-[var(--clr-neutral-800)] pt-2 flex justify-between font-semibold">
                        <span className="text-[var(--clr-neutral-0)]">{labels.summaryGrossNeeded}</span>
                        <span className="text-[var(--clr-green-500)]">{formatValue(results.grossAnnual, currency)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
