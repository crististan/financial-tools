'use client';

import { useState, useMemo } from 'react';

type SplitBillCalculatorProps = {
    labels: {
        billAmountLabel: string;
        billAmountPlaceholder: string;
        tipLabel: string;
        customTipPlaceholder: string;
        numberOfPeopleLabel: string;
        currencyLabel: string;
        resultTotalWithTip: string;
        resultTipAmount: string;
        resultPerPersonTotal: string;
        resultPerPersonTip: string;
        summaryTitle: string;
        summaryBillPerPerson: string;
        summaryTipPerPerson: string;
        summaryTotalPerPerson: string;
        currencySymbol: string;
    };
};

const TIP_PRESETS = [10, 15, 18, 20, 25];

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

export default function SplitBillCalculator({ labels }: SplitBillCalculatorProps) {
    const [billAmount, setBillAmount] = useState(100);
    const [tipPercentage, setTipPercentage] = useState(15);
    const [customTip, setCustomTip] = useState('');
    const [isCustomTip, setIsCustomTip] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState(2);
    const [currency, setCurrency] = useState(labels.currencySymbol);

    const activeTip = isCustomTip ? (parseFloat(customTip) || 0) : tipPercentage;

    const results = useMemo(() => {
        const bill = billAmount || 0;
        const people = Math.max(1, numberOfPeople);
        const tipAmount = bill * activeTip / 100;
        const totalWithTip = bill + tipAmount;
        const perPersonTotal = totalWithTip / people;
        const perPersonTip = tipAmount / people;
        const perPersonBill = bill / people;

        return { tipAmount, totalWithTip, perPersonTotal, perPersonTip, perPersonBill };
    }, [billAmount, activeTip, numberOfPeople]);

    const handlePresetClick = (preset: number) => {
        setTipPercentage(preset);
        setIsCustomTip(false);
        setCustomTip('');
    };

    const handleCustomTipChange = (value: string) => {
        setCustomTip(value);
        setIsCustomTip(true);
    };

    const handlePeopleChange = (delta: number) => {
        setNumberOfPeople((prev) => Math.max(1, prev + delta));
    };

    return (
        <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8 space-y-6">
            {/* Bill Amount */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.billAmountLabel}
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        {currency}
                    </span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={billAmount || ''}
                        onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                        placeholder={labels.billAmountPlaceholder}
                        className={'w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-8'}
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

            {/* Tip Percentage */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.tipLabel}
                </label>
                <div className="flex gap-2 flex-wrap mb-3">
                    {TIP_PRESETS.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => handlePresetClick(preset)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                !isCustomTip && tipPercentage === preset
                                    ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                    : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-1000)]'
                            }`}
                        >
                            {preset}%
                        </button>
                    ))}
                </div>
                <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={isCustomTip ? customTip : ''}
                    onChange={(e) => handleCustomTipChange(e.target.value)}
                    onFocus={() => setIsCustomTip(true)}
                    placeholder={labels.customTipPlaceholder}
                    className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)]"
                />
            </div>

            {/* Number of People */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.numberOfPeopleLabel}
                </label>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handlePeopleChange(-1)}
                        disabled={numberOfPeople <= 1}
                        className="w-12 h-12 rounded-md bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] text-xl font-medium flex items-center justify-center hover:bg-[var(--clr-neutral-1000)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        −
                    </button>
                    <span className="text-3xl font-semibold text-[var(--clr-neutral-0)] min-w-[3rem] text-center">
                        {numberOfPeople}
                    </span>
                    <button
                        onClick={() => handlePeopleChange(1)}
                        className="w-12 h-12 rounded-md bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] text-xl font-medium flex items-center justify-center hover:bg-[var(--clr-neutral-1000)] transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Result Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultTotalWithTip}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {formatValue(results.totalWithTip, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultTipAmount}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.tipAmount, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultPerPersonTotal}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {formatValue(results.perPersonTotal, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultPerPersonTip}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.perPersonTip, currency)}
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
                        <span>{labels.summaryBillPerPerson}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.perPersonBill, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryTipPerPerson}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.perPersonTip, currency)}</span>
                    </div>
                    <div className="border-t border-[var(--clr-neutral-800)] pt-2 flex justify-between font-semibold">
                        <span className="text-[var(--clr-neutral-0)]">{labels.summaryTotalPerPerson}</span>
                        <span className="text-[var(--clr-green-500)]">{formatValue(results.perPersonTotal, currency)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
