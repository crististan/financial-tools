'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import AmortizationTable from './amortization-table';

type LoanCalculatorProps = {
    labels: {
        loanAmountLabel: string;
        loanAmountPlaceholder: string;
        interestRateLabel: string;
        interestRatePlaceholder: string;
        loanTermLabel: string;
        loanTermPlaceholder: string;
        termUnitLabel: string;
        termUnitYears: string;
        termUnitMonths: string;
        monthlyPaymentLabel: string;
        totalPaymentLabel: string;
        totalInterestLabel: string;
    };
    amortizationLabels: {
        sectionTitle: string;
        sectionDescription: string;
        toggleLabel: string;
        headers: {
            month: string;
            payment: string;
            principal: string;
            interest: string;
            balance: string;
        };
    };
};

export type AmortizationRow = {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
};

function calculateMonthlyPayment(principal: number, annualRate: number, totalMonths: number): number {
    if (annualRate === 0) return principal / totalMonths;
    const monthlyRate = annualRate / 100 / 12;
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    return principal * (monthlyRate * factor) / (factor - 1);
}

function generateAmortizationSchedule(principal: number, annualRate: number, totalMonths: number, monthlyPayment: number): AmortizationRow[] {
    const schedule: AmortizationRow[] = [];
    let balance = principal;
    const monthlyRate = annualRate / 100 / 12;

    for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance = Math.max(0, balance - principalPayment);

        schedule.push({
            month,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance,
        });
    }

    return schedule;
}

function formatCurrency(value: number): string {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function LoanCalculator({ labels, amortizationLabels }: LoanCalculatorProps) {
    const [loanAmount, setLoanAmount] = useState(250000);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');
    const [showAmortization, setShowAmortization] = useState(false);

    const totalMonths = useMemo(
        () => termUnit === 'years' ? loanTerm * 12 : loanTerm,
        [loanTerm, termUnit]
    );

    const monthlyPayment = useMemo(() => {
        if (loanAmount <= 0 || totalMonths <= 0) return 0;
        return calculateMonthlyPayment(loanAmount, interestRate, totalMonths);
    }, [loanAmount, interestRate, totalMonths]);

    const totalPayment = useMemo(
        () => monthlyPayment * totalMonths,
        [monthlyPayment, totalMonths]
    );

    const totalInterest = useMemo(
        () => totalPayment - loanAmount,
        [totalPayment, loanAmount]
    );

    const amortizationSchedule = useMemo(() => {
        if (!showAmortization || loanAmount <= 0 || totalMonths <= 0) return [];
        return generateAmortizationSchedule(loanAmount, interestRate, totalMonths, monthlyPayment);
    }, [showAmortization, loanAmount, interestRate, totalMonths, monthlyPayment]);

    function handleLoanAmountChange(e: ChangeEvent<HTMLInputElement>) {
        const parsed = parseFloat(e.target.value);
        setLoanAmount(isNaN(parsed) ? 0 : parsed);
    }

    function handleInterestRateChange(e: ChangeEvent<HTMLInputElement>) {
        const parsed = parseFloat(e.target.value);
        setInterestRate(isNaN(parsed) ? 0 : parsed);
    }

    function handleLoanTermChange(e: ChangeEvent<HTMLInputElement>) {
        const parsed = parseInt(e.target.value);
        setLoanTerm(isNaN(parsed) ? 0 : parsed);
    }

    function handleTermUnitChange(e: ChangeEvent<HTMLSelectElement>) {
        setTermUnit(e.target.value as 'years' | 'months');
    }

    const isValid = loanAmount > 0 && interestRate >= 0 && totalMonths > 0;

    return (
        <div className="w-full max-w-[600px] mx-auto">
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                {/* Loan Amount */}
                <div className="mb-5">
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.loanAmountLabel}
                    </label>
                    <input
                        type="number"
                        className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        placeholder={labels.loanAmountPlaceholder}
                        value={loanAmount || ''}
                        onChange={handleLoanAmountChange}
                        min={0}
                    />
                </div>

                {/* Interest Rate */}
                <div className="mb-5">
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.interestRateLabel}
                    </label>
                    <input
                        type="number"
                        className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        placeholder={labels.interestRatePlaceholder}
                        value={interestRate || ''}
                        onChange={handleInterestRateChange}
                        min={0}
                        max={100}
                        step={0.1}
                    />
                </div>

                {/* Loan Term + Unit */}
                <div className="mb-6 flex gap-3">
                    <div className="flex-1">
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.loanTermLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.loanTermPlaceholder}
                            value={loanTerm || ''}
                            onChange={handleLoanTermChange}
                            min={1}
                        />
                    </div>
                    <div className="w-[140px]">
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.termUnitLabel}
                        </label>
                        <select
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            value={termUnit}
                            onChange={handleTermUnitChange}
                        >
                            <option value="years">{labels.termUnitYears}</option>
                            <option value="months">{labels.termUnitMonths}</option>
                        </select>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--clr-neutral-1000)] mb-6" />

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.monthlyPaymentLabel}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                            {isValid ? `$${formatCurrency(monthlyPayment)}` : '—'}
                        </p>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.totalPaymentLabel}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                            {isValid ? `$${formatCurrency(totalPayment)}` : '—'}
                        </p>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.totalInterestLabel}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                            {isValid ? `$${formatCurrency(totalInterest)}` : '—'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Amortization toggle & table */}
            {isValid && (
                <div className="mt-8">
                    <button
                        type="button"
                        className="flex items-center gap-2 text-[var(--clr-green-500)] hover:text-[var(--clr-neutral-0)] transition-colors cursor-pointer mb-4"
                        onClick={() => setShowAmortization(!showAmortization)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className={`transition-transform duration-300 ${showAmortization ? 'rotate-90' : ''}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-sm font-medium">{amortizationLabels.toggleLabel}</span>
                    </button>

                    {showAmortization && (
                        <AmortizationTable
                            schedule={amortizationSchedule}
                            headers={amortizationLabels.headers}
                            title={amortizationLabels.sectionTitle}
                            description={amortizationLabels.sectionDescription}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
