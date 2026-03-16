'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

type CompoundInterestCalculatorProps = {
    labels: {
        initialDepositLabel: string;
        initialDepositPlaceholder: string;
        monthlyContributionLabel: string;
        monthlyContributionPlaceholder: string;
        interestRateLabel: string;
        interestRatePlaceholder: string;
        periodLabel: string;
        periodPlaceholder: string;
        compoundingLabel: string;
        compoundingOptions: {
            monthly: string;
            quarterly: string;
            annually: string;
        };
        scenarioToggleLabel: string;
        scenario2Label: string;
        scenario2Placeholder: string;
        resultFinalAmount: string;
        resultTotalContributions: string;
        resultTotalInterest: string;
        comparisonTitle: string;
        scenario1Name: string;
        scenario2Name: string;
        differenceLabel: string;
        breakdownTitle: string;
        breakdownToggle: string;
        breakdownHeaders: {
            year: string;
            contributions: string;
            interest: string;
            balance: string;
        };
        chartContributions: string;
        chartInterest: string;
        chartScenario2: string;
        currencySymbol: string;
    };
};

type CompoundingFrequency = 'monthly' | 'quarterly' | 'annually';

type YearlyData = {
    year: number;
    contributions: number;
    interest: number;
    balance: number;
};

function getCompoundingN(frequency: CompoundingFrequency): number {
    switch (frequency) {
        case 'monthly': return 12;
        case 'quarterly': return 4;
        case 'annually': return 1;
    }
}

function calculateCompoundInterest(
    principal: number,
    monthlyContribution: number,
    annualRate: number,
    years: number,
    frequency: CompoundingFrequency
): YearlyData[] {
    const n = getCompoundingN(frequency);
    const r = annualRate / 100;
    const data: YearlyData[] = [];

    let balance = principal;
    let totalContributions = principal;

    for (let year = 1; year <= years; year++) {
        // Calculate compounding for this year with monthly contributions
        for (let month = 1; month <= 12; month++) {
            balance += monthlyContribution;
            totalContributions += monthlyContribution;

            // Apply interest at compounding intervals
            const monthInYear = month;
            if (frequency === 'monthly') {
                balance *= (1 + r / n);
            } else if (frequency === 'quarterly' && monthInYear % 3 === 0) {
                balance *= (1 + r / n);
            } else if (frequency === 'annually' && monthInYear === 12) {
                balance *= (1 + r / n);
            }
        }

        data.push({
            year,
            contributions: totalContributions,
            interest: balance - totalContributions,
            balance,
        });
    }

    return data;
}

function formatCurrency(value: number, symbol: string): string {
    return `${symbol}${value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

export default function CompoundInterestCalculator({ labels }: CompoundInterestCalculatorProps) {
    const [initialDeposit, setInitialDeposit] = useState(10000);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [interestRate, setInterestRate] = useState(7);
    const [period, setPeriod] = useState(20);
    const [compounding, setCompounding] = useState<CompoundingFrequency>('monthly');
    const [showScenario2, setShowScenario2] = useState(false);
    const [scenario2Contribution, setScenario2Contribution] = useState(1000);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const isValid = initialDeposit >= 0 && interestRate >= 0 && period > 0 && period <= 50;

    const scenario1Data = useMemo(() => {
        if (!isValid) return [];
        return calculateCompoundInterest(initialDeposit, monthlyContribution, interestRate, period, compounding);
    }, [initialDeposit, monthlyContribution, interestRate, period, compounding, isValid]);

    const scenario2Data = useMemo(() => {
        if (!isValid || !showScenario2) return [];
        return calculateCompoundInterest(initialDeposit, scenario2Contribution, interestRate, period, compounding);
    }, [initialDeposit, scenario2Contribution, interestRate, period, compounding, showScenario2, isValid]);

    const lastYear1 = scenario1Data[scenario1Data.length - 1];
    const lastYear2 = scenario2Data[scenario2Data.length - 1];

    const chartData = useMemo(() => {
        return scenario1Data.map((d, i) => {
            const base: Record<string, string | number> = {
                name: `${d.year}`,
                [labels.chartContributions]: Math.round(d.contributions),
                [labels.chartInterest]: Math.round(d.interest),
            };
            if (showScenario2 && scenario2Data[i]) {
                base[labels.chartScenario2] = Math.round(scenario2Data[i].balance);
            }
            return base;
        });
    }, [scenario1Data, scenario2Data, showScenario2, labels]);

    function handleNumberInput(setter: (v: number) => void) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const parsed = parseFloat(e.target.value);
            setter(isNaN(parsed) ? 0 : parsed);
        };
    }

    return (
        <div className="w-full max-w-[700px] mx-auto">
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.initialDepositLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.initialDepositPlaceholder}
                            value={initialDeposit || ''}
                            onChange={handleNumberInput(setInitialDeposit)}
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.monthlyContributionLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.monthlyContributionPlaceholder}
                            value={monthlyContribution || ''}
                            onChange={handleNumberInput(setMonthlyContribution)}
                            min={0}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.interestRateLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.interestRatePlaceholder}
                            value={interestRate || ''}
                            onChange={handleNumberInput(setInterestRate)}
                            min={0}
                            max={100}
                            step={0.1}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.periodLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.periodPlaceholder}
                            value={period || ''}
                            onChange={handleNumberInput(setPeriod)}
                            min={1}
                            max={50}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.compoundingLabel}
                        </label>
                        <select
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            value={compounding}
                            onChange={(e) => setCompounding(e.target.value as CompoundingFrequency)}
                        >
                            <option value="monthly" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.compoundingOptions.monthly}</option>
                            <option value="quarterly" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.compoundingOptions.quarterly}</option>
                            <option value="annually" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.compoundingOptions.annually}</option>
                        </select>
                    </div>
                </div>

                {/* Scenario 2 Toggle */}
                <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div
                            className={`relative w-11 h-6 rounded-full transition-colors ${showScenario2 ? 'bg-[var(--clr-green-500)]' : 'bg-[var(--clr-neutral-1000)]'}`}
                            onClick={() => setShowScenario2(!showScenario2)}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${showScenario2 ? 'translate-x-5' : ''}`}
                            />
                        </div>
                        <span className="text-sm text-[var(--clr-neutral-100)]">{labels.scenarioToggleLabel}</span>
                    </label>

                    {showScenario2 && (
                        <div className="mt-4">
                            <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                                {labels.scenario2Label}
                            </label>
                            <input
                                type="number"
                                className="w-full max-w-[320px] p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                                placeholder={labels.scenario2Placeholder}
                                value={scenario2Contribution || ''}
                                onChange={handleNumberInput(setScenario2Contribution)}
                                min={0}
                            />
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--clr-neutral-1000)] mb-6" />

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultFinalAmount}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                            {isValid && lastYear1 ? formatCurrency(lastYear1.balance, labels.currencySymbol) : '—'}
                        </p>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultTotalContributions}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                            {isValid && lastYear1 ? formatCurrency(lastYear1.contributions, labels.currencySymbol) : '—'}
                        </p>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultTotalInterest}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                            {isValid && lastYear1 ? formatCurrency(lastYear1.interest, labels.currencySymbol) : '—'}
                        </p>
                    </div>
                </div>

                {/* Chart */}
                {isValid && chartData.length > 0 && (
                    <div className="w-full h-[300px] mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-neutral-800)" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'var(--clr-neutral-100)', fontSize: 12 }}
                                    interval={period > 20 ? Math.floor(period / 10) - 1 : 'preserveStartEnd'}
                                />
                                <YAxis
                                    tick={{ fill: 'var(--clr-neutral-100)', fontSize: 12 }}
                                    tickFormatter={(v: number) => `${labels.currencySymbol}${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--clr-neutral-1000)',
                                        border: '1px solid var(--clr-neutral-800)',
                                        borderRadius: '8px',
                                        color: 'var(--clr-neutral-0)',
                                    }}
                                    labelStyle={{ color: 'var(--clr-neutral-0)' }}
                                    formatter={(value) => formatCurrency(Number(value), labels.currencySymbol)}
                                />
                                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--clr-neutral-100)' }} />
                                <Area
                                    type="monotone"
                                    dataKey={labels.chartContributions}
                                    stackId="1"
                                    fill="#09E789"
                                    stroke="#09E789"
                                    fillOpacity={0.6}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={labels.chartInterest}
                                    stackId="1"
                                    fill="#3B82F6"
                                    stroke="#3B82F6"
                                    fillOpacity={0.6}
                                />
                                {showScenario2 && (
                                    <Area
                                        type="monotone"
                                        dataKey={labels.chartScenario2}
                                        fill="none"
                                        stroke="#F59E0B"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        fillOpacity={0}
                                    />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Scenario Comparison Table */}
                {showScenario2 && isValid && lastYear1 && lastYear2 && (
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-5 mb-6">
                        <h3 className="text-base font-semibold text-[var(--clr-neutral-0)] mb-4">{labels.comparisonTitle}</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-[var(--clr-neutral-100)] text-xs uppercase tracking-wider">
                                    <th className="text-left pb-3"></th>
                                    <th className="text-right pb-3">{labels.resultFinalAmount}</th>
                                    <th className="text-right pb-3">{labels.resultTotalContributions}</th>
                                    <th className="text-right pb-3">{labels.resultTotalInterest}</th>
                                </tr>
                            </thead>
                            <tbody className="text-[var(--clr-neutral-0)]">
                                <tr className="border-b border-[var(--clr-neutral-800)]">
                                    <td className="py-2 font-medium">{labels.scenario1Name}</td>
                                    <td className="py-2 text-right">{formatCurrency(lastYear1.balance, labels.currencySymbol)}</td>
                                    <td className="py-2 text-right">{formatCurrency(lastYear1.contributions, labels.currencySymbol)}</td>
                                    <td className="py-2 text-right">{formatCurrency(lastYear1.interest, labels.currencySymbol)}</td>
                                </tr>
                                <tr className="border-b border-[var(--clr-neutral-800)]">
                                    <td className="py-2 font-medium">{labels.scenario2Name}</td>
                                    <td className="py-2 text-right">{formatCurrency(lastYear2.balance, labels.currencySymbol)}</td>
                                    <td className="py-2 text-right">{formatCurrency(lastYear2.contributions, labels.currencySymbol)}</td>
                                    <td className="py-2 text-right">{formatCurrency(lastYear2.interest, labels.currencySymbol)}</td>
                                </tr>
                                <tr className="text-[var(--clr-green-500)] font-semibold">
                                    <td className="py-2">{labels.differenceLabel}</td>
                                    <td className="py-2 text-right">{formatCurrency(lastYear2.balance - lastYear1.balance, labels.currencySymbol)}</td>
                                    <td className="py-2 text-right">{formatCurrency(lastYear2.contributions - lastYear1.contributions, labels.currencySymbol)}</td>
                                    <td className="py-2 text-right">{formatCurrency(lastYear2.interest - lastYear1.interest, labels.currencySymbol)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Annual Breakdown Toggle & Table */}
            {isValid && scenario1Data.length > 0 && (
                <div className="mt-8">
                    <button
                        type="button"
                        className="flex items-center gap-2 text-[var(--clr-green-500)] hover:text-[var(--clr-neutral-0)] transition-colors cursor-pointer mb-4"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className={`transition-transform duration-300 ${showBreakdown ? 'rotate-90' : ''}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-sm font-medium">{labels.breakdownToggle}</span>
                    </button>

                    {showBreakdown && (
                        <div className="overflow-auto max-h-[400px] rounded-xl border border-[var(--clr-neutral-1000)]">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-[var(--clr-neutral-900)]">
                                    <tr className="text-[var(--clr-neutral-100)] text-xs uppercase tracking-wider">
                                        <th className="text-left p-3">{labels.breakdownHeaders.year}</th>
                                        <th className="text-right p-3">{labels.breakdownHeaders.contributions}</th>
                                        <th className="text-right p-3">{labels.breakdownHeaders.interest}</th>
                                        <th className="text-right p-3">{labels.breakdownHeaders.balance}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scenario1Data.map((row) => (
                                        <tr
                                            key={row.year}
                                            className="border-t border-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]"
                                        >
                                            <td className="p-3 font-medium">{row.year}</td>
                                            <td className="p-3 text-right">{formatCurrency(row.contributions, labels.currencySymbol)}</td>
                                            <td className="p-3 text-right">{formatCurrency(row.interest, labels.currencySymbol)}</td>
                                            <td className="p-3 text-right font-semibold">{formatCurrency(row.balance, labels.currencySymbol)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}