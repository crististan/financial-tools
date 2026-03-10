'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import UnitInput from './unit-input';
import { convertUnit, getConversionFactor, formatConversion } from '@/lib/mock-units';

type UnitConverterCardProps = {
    units: Record<string, string>;
    labels: {
        fromLabel: string;
        toLabel: string;
        amountPlaceholder: string;
        switchButtonAriaLabel: string;
        rateDisplay: string;
    };
};

export default function UnitConverterCard({ units, labels }: UnitConverterCardProps) {
    const [amount, setAmount] = useState(1);
    const [fromUnit, setFromUnit] = useState('m');
    const [toUnit, setToUnit] = useState('ft');

    const unitList = useMemo(
        () => Object.entries(units).map(([code, name]) => ({ code, name })),
        [units]
    );

    const result = useMemo(
        () => convertUnit(amount, fromUnit, toUnit),
        [amount, fromUnit, toUnit]
    );

    const conversionFactor = useMemo(
        () => getConversionFactor(fromUnit, toUnit),
        [fromUnit, toUnit]
    );

    const rateDisplayText = labels.rateDisplay
        .replace('{from}', fromUnit)
        .replace('{rate}', formatConversion(conversionFactor))
        .replace('{to}', toUnit);

    function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
        const parsed = parseFloat(e.target.value);
        setAmount(isNaN(parsed) ? 0 : parsed);
    }

    function handleFromUnitChange(e: ChangeEvent<HTMLSelectElement>) {
        setFromUnit(e.target.value);
    }

    function handleToUnitChange(e: ChangeEvent<HTMLSelectElement>) {
        setToUnit(e.target.value);
    }

    function switchUnits() {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    }

    return (
        <div className="w-full max-w-[600px] mx-auto bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
            <UnitInput
                label={labels.fromLabel}
                value={amount.toString()}
                units={unitList}
                selectedUnit={fromUnit}
                placeholder={labels.amountPlaceholder}
                onChangeInput={handleAmountChange}
                onChangeSelect={handleFromUnitChange}
            />

            <div className="my-2 relative">
                <div className="h-px bg-[var(--clr-neutral-1000)]" />
                <button
                    type="button"
                    className="w-12 h-12 rounded-full bg-[var(--clr-green-500)] grid place-items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 hover:rotate-180 hover:cursor-pointer transition-all duration-500"
                    onClick={switchUnits}
                    aria-label={labels.switchButtonAriaLabel}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--clr-neutral-1000)" viewBox="0 0 16 16">
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                        <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                    </svg>
                </button>
            </div>

            <UnitInput
                label={labels.toLabel}
                value={formatConversion(result)}
                units={unitList}
                selectedUnit={toUnit}
                isReadOnly={true}
                onChangeSelect={handleToUnitChange}
            />

            <div className="text-center mt-6 mb-2">
                <p className="text-lg font-medium">
                    <span className="text-[var(--clr-green-500)]">{rateDisplayText}</span>
                </p>
            </div>
        </div>
    );
}
