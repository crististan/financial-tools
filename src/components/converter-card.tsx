'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import ConverterInput from './converter-input';

type ConverterCardProps = {
    options: Record<string, string>;
    factors: Record<string, number>;
    labels: {
        fromLabel: string;
        toLabel: string;
        amountPlaceholder: string;
        switchButtonAriaLabel: string;
        rateDisplay: string;
        lastUpdated?: string;
    };
    defaultFrom: string;
    defaultTo: string;
    decimals?: number;
};

function formatValue(value: number, decimals?: number): string {
    if (decimals !== undefined) return value.toFixed(decimals);
    if (value >= 1000) return value.toFixed(2);
    if (value >= 1) return value.toFixed(4);
    if (value >= 0.001) return value.toFixed(6);
    return value.toExponential(4);
}

function convert(amount: number, from: string, to: string, factors: Record<string, number>): number {
    if (from === to) return amount;
    const fromFactor = factors[from];
    const toFactor = factors[to];
    if (!fromFactor || !toFactor) return 0;
    return amount * toFactor / fromFactor;
}

function getRate(from: string, to: string, factors: Record<string, number>): number {
    const fromFactor = factors[from];
    const toFactor = factors[to];
    if (!fromFactor || !toFactor) return 0;
    return toFactor / fromFactor;
}

export default function ConverterCard({ options, factors, labels, defaultFrom, defaultTo, decimals }: ConverterCardProps) {
    const [amount, setAmount] = useState(1);
    const [fromOption, setFromOption] = useState(defaultFrom);
    const [toOption, setToOption] = useState(defaultTo);

    const optionList = useMemo(
        () => Object.entries(options).map(([code, name]) => ({ code, name })),
        [options]
    );

    const result = useMemo(
        () => convert(amount, fromOption, toOption, factors),
        [amount, fromOption, toOption, factors]
    );

    const currentRate = useMemo(
        () => getRate(fromOption, toOption, factors),
        [fromOption, toOption, factors]
    );

    const rateDisplayText = labels.rateDisplay
        .replace('{from}', fromOption)
        .replace('{rate}', formatValue(currentRate, decimals))
        .replace('{to}', toOption);

    const lastUpdatedText = labels.lastUpdated
        ? labels.lastUpdated.replace('{date}', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
        : null;

    function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
        const parsed = parseFloat(e.target.value);
        setAmount(isNaN(parsed) ? 0 : parsed);
    }

    function handleFromChange(e: ChangeEvent<HTMLSelectElement>) {
        setFromOption(e.target.value);
    }

    function handleToChange(e: ChangeEvent<HTMLSelectElement>) {
        setToOption(e.target.value);
    }

    function switchOptions() {
        setFromOption(toOption);
        setToOption(fromOption);
    }

    return (
        <div className="w-full max-w-[600px] mx-auto bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
            <ConverterInput
                label={labels.fromLabel}
                value={amount.toString()}
                options={optionList}
                selectedOption={fromOption}
                placeholder={labels.amountPlaceholder}
                onChangeInput={handleAmountChange}
                onChangeSelect={handleFromChange}
            />

            <div className="my-2 relative">
                <div className="h-px bg-[var(--clr-neutral-1000)]" />
                <button
                    type="button"
                    className="w-12 h-12 rounded-full bg-[var(--clr-green-500)] grid place-items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 hover:rotate-180 hover:cursor-pointer transition-all duration-500"
                    onClick={switchOptions}
                    aria-label={labels.switchButtonAriaLabel}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--clr-neutral-1000)" viewBox="0 0 16 16">
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                        <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                    </svg>
                </button>
            </div>

            <ConverterInput
                label={labels.toLabel}
                value={formatValue(result, decimals)}
                options={optionList}
                selectedOption={toOption}
                isReadOnly={true}
                onChangeSelect={handleToChange}
            />

            <div className="text-center mt-6 mb-2">
                <p className="text-lg font-medium">
                    <span className="text-[var(--clr-green-500)]">{rateDisplayText}</span>
                </p>
                {lastUpdatedText && (
                    <p className="text-xs text-[var(--clr-neutral-100)] mt-1">
                        {lastUpdatedText}
                    </p>
                )}
            </div>
        </div>
    );
}
