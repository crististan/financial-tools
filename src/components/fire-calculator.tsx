'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

type FireCalculatorProps = {
    labels: {
        annualIncomeLabel: string;
        annualIncomePlaceholder: string;
        annualExpensesLabel: string;
        annualExpensesPlaceholder: string;
        currentSavingsLabel: string;
        currentSavingsPlaceholder: string;
        expectedReturnLabel: string;
        expectedReturnPlaceholder: string;
        withdrawalRateLabel: string;
        withdrawalRatePlaceholder: string;
        inflationRateLabel: string;
        inflationRatePlaceholder: string;
        resultFINumber: string;
        resultYearsToFI: string;
        resultSavingsRate: string;
        resultMonthlyBudget: string;
        resultCoastFIAge: string;
        fiReachedMessage: string;
        fiDateLabel: string;
        yearsLabel: string;
        chartPortfolio: string;
        chartFITarget: string;
        chartContributions: string;
        breakdownToggle: string;
        breakdownHeaders: {
            year: string;
            age: string;
            contributions: string;
            portfolio: string;
            fiProgress: string;
        };
        currentAgeLabel: string;
        currentAgePlaceholder: string;
        currencySymbol: string;
    };
};

type YearlyData = {
    year: number;
    age: number;
    contributions: number;
    portfolio: number;
    fiTarget: number;
    fiProgress: number;
};

function calculateFIREData(
    currentAge: number,
    currentSavings: number,
    annualIncome: number,
    annualExpenses: number,
    expectedReturn: number,
    withdrawalRate: number,
    inflationRate: number,
    maxYears: number = 60
): { data: YearlyData[]; yearsToFI: number; fiNumber: number; coastFIAge: number | null } {
    const realReturn = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
    const fiNumber = annualExpenses / (withdrawalRate / 100);
    const annualSavings = annualIncome - annualExpenses;
    const data: YearlyData[] = [];

    let portfolio = currentSavings;
    let totalContributions = currentSavings;
    let yearsToFI = -1;
    let coastFIAge: number | null = null;

    // Year 0
    data.push({
        year: 0,
        age: currentAge,
        contributions: totalContributions,
        portfolio: portfolio,
        fiTarget: fiNumber,
        fiProgress: Math.min((portfolio / fiNumber) * 100, 100),
    });

    if (portfolio >= fiNumber) {
        yearsToFI = 0;
    }

    for (let year = 1; year <= maxYears; year++) {
        portfolio = portfolio * (1 + realReturn) + annualSavings;
        totalContributions += annualSavings;

        if (portfolio < 0) portfolio = 0;

        const progress = Math.min((portfolio / fiNumber) * 100, 100);

        data.push({
            year,
            age: currentAge + year,
            contributions: totalContributions,
            portfolio,
            fiTarget: fiNumber,
            fiProgress: progress,
        });

        if (yearsToFI < 0 && portfolio >= fiNumber) {
            yearsToFI = year;
        }

        // Coast FI: check if current portfolio alone would grow to fiNumber by age 65
        if (coastFIAge === null && currentAge + year < 65) {
            const yearsTo65 = 65 - (currentAge + year);
            const projectedAt65 = portfolio * Math.pow(1 + realReturn, yearsTo65);
            if (projectedAt65 >= fiNumber) {
                coastFIAge = currentAge + year;
            }
        }

        if (yearsToFI >= 0 && year >= yearsToFI + 10) break;
    }

    return { data, yearsToFI, fiNumber, coastFIAge };
}

function formatCurrency(value: number, symbol: string): string {
    if (Math.abs(value) >= 1_000_000) {
        const abbrev = `${(value / 1_000_000).toFixed(1)}M`;
        if (symbol === 'lei') return `${abbrev} lei`;
        return `${symbol}${abbrev}`;
    }
    const formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    if (symbol === 'lei') return `${formatted} lei`;
    return `${symbol}${formatted}`;
}

function formatCurrencyFull(value: number, symbol: string): string {
    const formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    if (symbol === 'lei') return `${formatted} lei`;
    return `${symbol}${formatted}`;
}

export default function FireCalculator({ labels }: FireCalculatorProps) {
    const [currentAge, setCurrentAge] = useState(30);
    const [annualIncome, setAnnualIncome] = useState(75000);
    const [annualExpenses, setAnnualExpenses] = useState(40000);
    const [currentSavings, setCurrentSavings] = useState(50000);
    const [expectedReturn, setExpectedReturn] = useState(7);
    const [withdrawalRate, setWithdrawalRate] = useState(4);
    const [inflationRate, setInflationRate] = useState(2);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const isValid = annualIncome > 0 && annualExpenses > 0 && annualExpenses < annualIncome
        && withdrawalRate > 0 && expectedReturn >= 0 && currentAge > 0 && currentAge < 100;

    const savingsRate = annualIncome > 0 ? ((annualIncome - annualExpenses) / annualIncome) * 100 : 0;

    const { data, yearsToFI, fiNumber, coastFIAge } = useMemo(() => {
        if (!isValid) return { data: [], yearsToFI: -1, fiNumber: 0, coastFIAge: null };
        return calculateFIREData(
            currentAge, currentSavings, annualIncome, annualExpenses,
            expectedReturn, withdrawalRate, inflationRate
        );
    }, [currentAge, currentSavings, annualIncome, annualExpenses, expectedReturn, withdrawalRate, inflationRate, isValid]);

    const fiDate = useMemo(() => {
        if (yearsToFI < 0) return null;
        const now = new Date();
        return now.getFullYear() + yearsToFI;
    }, [yearsToFI]);

    const monthlyBudget = withdrawalRate > 0 ? (annualExpenses / 12) : 0;

    const chartData = useMemo(() => {
        const maxYear = yearsToFI >= 0 ? Math.min(yearsToFI + 5, data.length) : Math.min(40, data.length);
        return data.slice(0, maxYear).map((d) => ({
            name: `${d.age}`,
            [labels.chartPortfolio]: Math.round(d.portfolio),
            [labels.chartContributions]: Math.round(d.contributions),
            [labels.chartFITarget]: Math.round(d.fiTarget),
        }));
    }, [data, yearsToFI, labels]);

    function handleNumberInput(setter: (v: number) => void) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const parsed = parseFloat(e.target.value);
            setter(isNaN(parsed) ? 0 : parsed);
        };
    }

    return (
        <div className="w-full">
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                {/* Row 1: Age + Income + Expenses */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.currentAgeLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.currentAgePlaceholder}
                            value={currentAge || ''}
                            onChange={handleNumberInput(setCurrentAge)}
                            min={1}
                            max={99}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.annualIncomeLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.annualIncomePlaceholder}
                            value={annualIncome || ''}
                            onChange={handleNumberInput(setAnnualIncome)}
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.annualExpensesLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.annualExpensesPlaceholder}
                            value={annualExpenses || ''}
                            onChange={handleNumberInput(setAnnualExpenses)}
                            min={0}
                        />
                    </div>
                </div>

                {/* Row 2: Current Savings + Return + Withdrawal + Inflation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.currentSavingsLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.currentSavingsPlaceholder}
                            value={currentSavings || ''}
                            onChange={handleNumberInput(setCurrentSavings)}
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.expectedReturnLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.expectedReturnPlaceholder}
                            value={expectedReturn || ''}
                            onChange={handleNumberInput(setExpectedReturn)}
                            min={0}
                            max={30}
                            step={0.1}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.withdrawalRateLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.withdrawalRatePlaceholder}
                            value={withdrawalRate || ''}
                            onChange={handleNumberInput(setWithdrawalRate)}
                            min={0.1}
                            max={10}
                            step={0.1}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.inflationRateLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.inflationRatePlaceholder}
                            value={inflationRate || ''}
                            onChange={handleNumberInput(setInflationRate)}
                            min={0}
                            max={20}
                            step={0.1}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--clr-neutral-1000)] mb-6" />

                {/* Results */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultFINumber}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                            {isValid ? formatCurrency(fiNumber, labels.currencySymbol) : '—'}
                        </p>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultYearsToFI}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                            {isValid ? (
                                yearsToFI === 0 ? labels.fiReachedMessage :
                                yearsToFI > 0 ? `${yearsToFI} ${labels.yearsLabel}` : '60+'
                            ) : '—'}
                        </p>
                        {isValid && fiDate && yearsToFI > 0 && (
                            <p className="text-xs text-[var(--clr-neutral-100)] mt-1">
                                {labels.fiDateLabel}: {fiDate}
                            </p>
                        )}
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultSavingsRate}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                            {isValid ? `${savingsRate.toFixed(1)}%` : '—'}
                        </p>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultMonthlyBudget}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                            {isValid ? formatCurrencyFull(Math.round(monthlyBudget), labels.currencySymbol) : '—'}
                        </p>
                    </div>
                </div>

                {/* Coast FI info */}
                {isValid && coastFIAge !== null && (
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 mb-6 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                            {labels.resultCoastFIAge}
                        </p>
                        <p className="text-lg font-bold text-[var(--clr-green-500)]">
                            {coastFIAge <= currentAge ? labels.fiReachedMessage : `${coastFIAge} (${coastFIAge - currentAge} ${labels.yearsLabel})`}
                        </p>
                    </div>
                )}

                {/* Chart */}
                {isValid && chartData.length > 1 && (
                    <div className="w-full h-[300px] mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-neutral-800)" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'var(--clr-neutral-100)', fontSize: 12 }}
                                    interval={chartData.length > 20 ? Math.floor(chartData.length / 10) - 1 : 'preserveStartEnd'}
                                />
                                <YAxis
                                    tick={{ fill: 'var(--clr-neutral-100)', fontSize: 12 }}
                                    tickFormatter={(v: number) => {
                                        const s = labels.currencySymbol;
                                        if (v >= 1_000_000) {
                                            const abbrev = `${(v / 1_000_000).toFixed(1)}M`;
                                            return s === 'lei' ? `${abbrev} lei` : `${s}${abbrev}`;
                                        }
                                        const abbrev = `${(v / 1000).toFixed(0)}k`;
                                        return s === 'lei' ? `${abbrev} lei` : `${s}${abbrev}`;
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--clr-neutral-1000)',
                                        border: '1px solid var(--clr-neutral-800)',
                                        borderRadius: '8px',
                                        color: 'var(--clr-neutral-0)',
                                    }}
                                    labelStyle={{ color: 'var(--clr-neutral-0)' }}
                                    formatter={(value) => formatCurrencyFull(Number(value), labels.currencySymbol)}
                                />
                                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--clr-neutral-100)' }} />
                                <Area
                                    type="monotone"
                                    dataKey={labels.chartContributions}
                                    fill="#3B82F6"
                                    stroke="#3B82F6"
                                    fillOpacity={0.3}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={labels.chartPortfolio}
                                    fill="#09E789"
                                    stroke="#09E789"
                                    fillOpacity={0.5}
                                />
                                <ReferenceLine
                                    y={fiNumber}
                                    stroke="#F59E0B"
                                    strokeDasharray="5 5"
                                    strokeWidth={2}
                                    label={{
                                        value: labels.chartFITarget,
                                        position: 'right',
                                        fill: '#F59E0B',
                                        fontSize: 12,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Annual Breakdown Toggle & Table */}
            {isValid && data.length > 1 && (
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
                                        <th className="text-left p-3">{labels.breakdownHeaders.age}</th>
                                        <th className="text-right p-3">{labels.breakdownHeaders.contributions}</th>
                                        <th className="text-right p-3">{labels.breakdownHeaders.portfolio}</th>
                                        <th className="text-right p-3">{labels.breakdownHeaders.fiProgress}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.slice(0, yearsToFI >= 0 ? yearsToFI + 1 : undefined).map((row) => (
                                        <tr
                                            key={row.year}
                                            className={`border-t border-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)] ${
                                                row.portfolio >= fiNumber ? 'bg-[var(--clr-green-500)]/5' : ''
                                            }`}
                                        >
                                            <td className="p-3 font-medium">{row.year}</td>
                                            <td className="p-3">{row.age}</td>
                                            <td className="p-3 text-right">{formatCurrencyFull(Math.round(row.contributions), labels.currencySymbol)}</td>
                                            <td className="p-3 text-right font-semibold">{formatCurrencyFull(Math.round(row.portfolio), labels.currencySymbol)}</td>
                                            <td className="p-3 text-right">
                                                <span className={row.fiProgress >= 100 ? 'text-[var(--clr-green-500)] font-bold' : ''}>
                                                    {row.fiProgress.toFixed(1)}%
                                                </span>
                                            </td>
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
