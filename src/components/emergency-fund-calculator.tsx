'use client';

import { useState, useMemo } from 'react';

type EmergencyFundCalculatorProps = {
    labels: {
        monthlyExpensesLabel: string;
        monthlyExpensesPlaceholder: string;
        monthsOfCoverageLabel: string;
        monthsOfCoveragePlaceholder: string;
        currentSavingsLabel: string;
        currentSavingsPlaceholder: string;
        monthlyContributionLabel: string;
        monthlyContributionPlaceholder: string;
        currencyLabel: string;
        currencySymbol: string;
        resultTargetLabel: string;
        resultStillNeededLabel: string;
        resultMonthsToGoalLabel: string;
        resultCompletionDateLabel: string;
        summaryTitle: string;
        summaryTarget: string;
        summaryCurrent: string;
        summaryGap: string;
        summaryContribution: string;
        summaryCompletion: string;
        timelineToggleLabel: string;
        timelineTitle: string;
        timelineDescription: string;
        timelineColMonth: string;
        timelineColContribution: string;
        timelineColCumulative: string;
        timelineColGap: string;
        monthsUnit: string;
        goalReachedLabel: string;
    };
    configData: {
        defaultMonths: number;
        minMonths: number;
        maxMonths: number;
        defaultMonthlySavings: number;
    };
};

const CURRENCIES = [
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
    { symbol: 'lei', label: 'RON (lei)' },
];

const MAX_TIMELINE_ROWS = 360;

function formatValue(value: number, currency: string): string {
    const formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    if (currency === 'lei') return `${formatted} ${currency}`;
    return `${currency}${formatted}`;
}

function addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default function EmergencyFundCalculator({ labels, configData }: EmergencyFundCalculatorProps) {
    const [monthlyExpenses, setMonthlyExpenses] = useState(2000);
    const [monthsCoverage, setMonthsCoverage] = useState(configData.defaultMonths);
    const [currentSavings, setCurrentSavings] = useState(0);
    const [monthlyContribution, setMonthlyContribution] = useState(configData.defaultMonthlySavings);
    const [currency, setCurrency] = useState(labels.currencySymbol);
    const [showTimeline, setShowTimeline] = useState(false);

    const results = useMemo(() => {
        const expenses = Math.max(0, monthlyExpenses || 0);
        const months = Math.min(Math.max(configData.minMonths, monthsCoverage || configData.minMonths), configData.maxMonths);
        const saved = Math.max(0, currentSavings || 0);
        const contribution = Math.max(0, monthlyContribution || 0);

        const target = expenses * months;
        const stillNeeded = Math.max(0, target - saved);
        const monthsToGoal = stillNeeded === 0 ? 0 : (contribution > 0 ? Math.ceil(stillNeeded / contribution) : 0);

        const completionDate = stillNeeded === 0
            ? new Date()
            : (contribution > 0 ? addMonths(new Date(), monthsToGoal) : null);

        const timeline: { month: number; contribution: number; cumulative: number; gap: number }[] = [];
        if (contribution > 0 && stillNeeded > 0) {
            let cumulative = saved;
            for (let i = 1; i <= MAX_TIMELINE_ROWS; i++) {
                const thisContribution = Math.min(contribution, target - cumulative);
                cumulative = Math.min(target, cumulative + contribution);
                const gap = Math.max(0, target - cumulative);
                timeline.push({ month: i, contribution: thisContribution, cumulative, gap });
                if (cumulative >= target) break;
            }
        }

        return { target, stillNeeded, monthsToGoal, completionDate, timeline, hasContribution: contribution > 0 };
    }, [monthlyExpenses, monthsCoverage, currentSavings, monthlyContribution, configData]);

    const handleMonthsChange = (value: string) => {
        const n = parseInt(value, 10);
        if (Number.isNaN(n)) {
            setMonthsCoverage(configData.minMonths);
            return;
        }
        setMonthsCoverage(Math.min(Math.max(configData.minMonths, n), configData.maxMonths));
    };

    return (
        <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8 space-y-6">
            {/* Monthly Expenses */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.monthlyExpensesLabel}
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        {currency}
                    </span>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={monthlyExpenses || ''}
                        onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                        placeholder={labels.monthlyExpensesPlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-8"
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

            {/* Months of Coverage */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.monthsOfCoverageLabel}
                </label>
                <input
                    type="number"
                    min={configData.minMonths}
                    max={configData.maxMonths}
                    step="1"
                    value={monthsCoverage || ''}
                    onChange={(e) => handleMonthsChange(e.target.value)}
                    placeholder={labels.monthsOfCoveragePlaceholder}
                    className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)]"
                />
            </div>

            {/* Current Savings */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.currentSavingsLabel}
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        {currency}
                    </span>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={currentSavings || ''}
                        onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                        placeholder={labels.currentSavingsPlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-8"
                    />
                </div>
            </div>

            {/* Monthly Contribution */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.monthlyContributionLabel}
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        {currency}
                    </span>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={monthlyContribution || ''}
                        onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                        placeholder={labels.monthlyContributionPlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-8"
                    />
                </div>
            </div>

            {/* Result Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultTargetLabel}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {formatValue(results.target, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultStillNeededLabel}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.stillNeeded, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultMonthsToGoalLabel}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {results.stillNeeded === 0
                            ? labels.goalReachedLabel
                            : (results.hasContribution ? `${results.monthsToGoal} ${labels.monthsUnit}` : '—')}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultCompletionDateLabel}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {results.completionDate ? formatDate(results.completionDate) : '—'}
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
                        <span>{labels.summaryTarget}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.target, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryCurrent}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(Math.max(0, currentSavings || 0), currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryGap}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.stillNeeded, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryContribution}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(Math.max(0, monthlyContribution || 0), currency)}</span>
                    </div>
                    <div className="border-t border-[var(--clr-neutral-800)] pt-2 flex justify-between font-semibold">
                        <span className="text-[var(--clr-neutral-0)]">{labels.summaryCompletion}</span>
                        <span className="text-[var(--clr-green-500)]">
                            {results.completionDate ? formatDate(results.completionDate) : '—'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Timeline toggle & table */}
            {results.timeline.length > 0 && (
                <div>
                    <button
                        type="button"
                        className="flex items-center gap-2 text-[var(--clr-green-500)] hover:text-[var(--clr-neutral-0)] transition-colors cursor-pointer mb-4"
                        onClick={() => setShowTimeline(!showTimeline)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className={`transition-transform duration-300 ${showTimeline ? 'rotate-90' : ''}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-sm font-medium">{labels.timelineToggleLabel}</span>
                    </button>

                    {showTimeline && (
                        <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 md:p-6">
                            <h3 className="text-lg font-semibold text-[var(--clr-neutral-0)] mb-1">
                                {labels.timelineTitle}
                            </h3>
                            <p className="text-sm text-[var(--clr-neutral-100)] mb-4">
                                {labels.timelineDescription}
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--clr-neutral-800)] text-left text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                                            <th className="py-2 pr-3">{labels.timelineColMonth}</th>
                                            <th className="py-2 pr-3">{labels.timelineColContribution}</th>
                                            <th className="py-2 pr-3">{labels.timelineColCumulative}</th>
                                            <th className="py-2">{labels.timelineColGap}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.timeline.map((row) => (
                                            <tr key={row.month} className="border-b border-[var(--clr-neutral-800)]/60 last:border-0">
                                                <td className="py-2 pr-3 text-[var(--clr-neutral-0)]">{row.month}</td>
                                                <td className="py-2 pr-3 text-[var(--clr-neutral-0)]">{formatValue(row.contribution, currency)}</td>
                                                <td className="py-2 pr-3 text-[var(--clr-neutral-0)]">{formatValue(row.cumulative, currency)}</td>
                                                <td className={`py-2 ${row.gap === 0 ? 'text-[var(--clr-green-500)] font-semibold' : 'text-[var(--clr-neutral-0)]'}`}>
                                                    {formatValue(row.gap, currency)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
