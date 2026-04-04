'use client';

import { useState, useMemo, type ChangeEvent } from 'react';

type Mode = 'weight' | 'volume';

type WeightVolumeConverterProps = {
    labels: {
        fromLabel: string;
        toLabel: string;
        amountPlaceholder: string;
        switchButtonAriaLabel: string;
        rateDisplay: string;
        modeLabels: { weight: string; volume: string };
        weightOptions: Record<string, string>;
        volumeOptions: Record<string, string>;
        tableTitle: string;
        tableHeaders: { pair: string; rate: string; inverseRate: string };
    };
    defaultFrom: string;
    defaultTo: string;
};

// Factors relative to 1 kg
const weightFactors: Record<string, number> = {
    kg: 1,
    g: 1000,
    lb: 2.20462,
    oz: 35.274,
    st: 0.157473,
};

// Factors relative to 1 liter
const volumeFactors: Record<string, number> = {
    L: 1,
    mL: 1000,
    gal: 0.264172,
    'fl oz': 33.814,
    pt: 2.11338,
    qt: 1.05669,
};

const popularWeightConversions = [
    { from: 'kg', to: 'lb' },
    { from: 'kg', to: 'oz' },
    { from: 'kg', to: 'st' },
    { from: 'kg', to: 'g' },
    { from: 'lb', to: 'oz' },
    { from: 'lb', to: 'st' },
    { from: 'lb', to: 'g' },
    { from: 'st', to: 'lb' },
];

const popularVolumeConversions = [
    { from: 'L', to: 'gal' },
    { from: 'L', to: 'fl oz' },
    { from: 'L', to: 'pt' },
    { from: 'L', to: 'qt' },
    { from: 'L', to: 'mL' },
    { from: 'gal', to: 'fl oz' },
    { from: 'gal', to: 'pt' },
    { from: 'gal', to: 'qt' },
];

function formatValue(value: number): string {
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

export default function WeightVolumeConverter({ labels, defaultFrom, defaultTo }: WeightVolumeConverterProps) {
    const [mode, setMode] = useState<Mode>('weight');
    const [amount, setAmount] = useState(1);
    const [weightFrom, setWeightFrom] = useState(defaultFrom || 'kg');
    const [weightTo, setWeightTo] = useState(defaultTo || 'lb');
    const [volumeFrom, setVolumeFrom] = useState('L');
    const [volumeTo, setVolumeTo] = useState('gal');

    const factors = mode === 'weight' ? weightFactors : volumeFactors;
    const options = mode === 'weight' ? labels.weightOptions : labels.volumeOptions;
    const fromOption = mode === 'weight' ? weightFrom : volumeFrom;
    const toOption = mode === 'weight' ? weightTo : volumeTo;
    const setFromOption = mode === 'weight' ? setWeightFrom : setVolumeFrom;
    const setToOption = mode === 'weight' ? setWeightTo : setVolumeTo;
    const popularConversions = mode === 'weight' ? popularWeightConversions : popularVolumeConversions;

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
        .replace('{rate}', formatValue(currentRate))
        .replace('{to}', toOption);

    function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
        const parsed = parseFloat(e.target.value);
        setAmount(isNaN(parsed) ? 0 : parsed);
    }

    function switchOptions() {
        if (mode === 'weight') {
            setWeightFrom(weightTo);
            setWeightTo(weightFrom);
        } else {
            setVolumeFrom(volumeTo);
            setVolumeTo(volumeFrom);
        }
    }

    return (
        <div className="w-full space-y-6">
            {/* Converter */}
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                {/* Mode tabs */}
                <div className="flex gap-2 mb-6">
                    {(['weight', 'volume'] as Mode[]).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer ${
                                mode === m
                                    ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                    : 'bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)]'
                            }`}
                        >
                            {labels.modeLabels[m]}
                        </button>
                    ))}
                </div>

                {/* From input */}
                <div className="flex flex-row gap-3 justify-between items-end bg-[var(--clr-neutral-1000)] p-4 rounded-xl">
                    <div className="flex flex-col gap-2 flex-1">
                        <small className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.fromLabel}</small>
                        <input
                            type="number"
                            className="w-full p-2 bg-[var(--clr-neutral-800)] text-xl md:text-2xl font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.amountPlaceholder}
                            value={amount.toString()}
                            onChange={handleAmountChange}
                        />
                    </div>
                    <select
                        className="w-[160px] p-2 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        value={fromOption}
                        onChange={(e) => setFromOption(e.target.value)}
                    >
                        {optionList.map((option) => (
                            <option key={option.code} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]" value={option.code}>
                                {option.code} - {option.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Swap button */}
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

                {/* To input */}
                <div className="flex flex-row gap-3 justify-between items-end bg-[var(--clr-neutral-1000)] p-4 rounded-xl">
                    <div className="flex flex-col gap-2 flex-1">
                        <small className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.toLabel}</small>
                        <input
                            type="number"
                            className="w-full p-2 bg-[var(--clr-neutral-800)] text-xl md:text-2xl font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            value={formatValue(result)}
                            readOnly
                            disabled
                        />
                    </div>
                    <select
                        className="w-[160px] p-2 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        value={toOption}
                        onChange={(e) => setToOption(e.target.value)}
                    >
                        {optionList.map((option) => (
                            <option key={option.code} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]" value={option.code}>
                                {option.code} - {option.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rate display */}
                <div className="text-center mt-6 mb-2">
                    <p className="text-lg font-medium">
                        <span className="text-[var(--clr-green-500)]">{rateDisplayText}</span>
                    </p>
                </div>
            </div>

            {/* Popular conversions table */}
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                <h3 className="text-xl font-medium mb-4 text-center">{labels.tableTitle}</h3>
                <div className="overflow-x-auto rounded-2xl border border-[var(--clr-neutral-900)]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--clr-neutral-1000)]">
                                <th className="px-5 py-4 text-sm font-medium text-[var(--clr-green-500)]">{labels.tableHeaders.pair}</th>
                                <th className="px-5 py-4 text-sm font-medium text-[var(--clr-green-500)]">{labels.tableHeaders.rate}</th>
                                <th className="px-5 py-4 text-sm font-medium text-[var(--clr-green-500)]">{labels.tableHeaders.inverseRate}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {popularConversions.map((pair, index) => {
                                const rate = getRate(pair.from, pair.to, factors);
                                const inverse = getRate(pair.to, pair.from, factors);
                                const fromLabel = options[pair.from] ?? pair.from;
                                const toLabel = options[pair.to] ?? pair.to;
                                return (
                                    <tr
                                        key={`${pair.from}-${pair.to}`}
                                        className={`border-b border-[var(--clr-neutral-900)] last:border-b-0 transition-colors duration-200 hover:bg-[var(--clr-neutral-900)] ${index % 2 === 1 ? 'bg-[var(--clr-neutral-900)]/30' : ''}`}
                                    >
                                        <td className="px-5 py-3.5 text-sm">
                                            <span className="text-[var(--clr-green-500)] font-medium">{fromLabel}</span>
                                            <span className="text-[var(--clr-neutral-100)]"> / </span>
                                            <span className="font-medium">{toLabel}</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-mono">{formatValue(rate)}</td>
                                        <td className="px-5 py-3.5 text-sm font-mono">{formatValue(inverse)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
